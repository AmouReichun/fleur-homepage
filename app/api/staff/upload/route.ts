import { NextRequest, NextResponse } from "next/server";
import { commitFile } from "@/lib/blog/github";
import { UPLOAD_SALON_INFO, type StaffUpload, type StaffUploadSalonKey } from "@/lib/blog/staff-uploads";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── 制限値 ────────────────────────────────────────────────
const MAX_FILES = 3;
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB/枚（クライアントで圧縮済みだがサーバーでも担保）
const MAX_MEMO_LEN = 1000;

// レート制限（IP毎・ベストエフォートのインメモリ。サーバーレスのため完全ではない）
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15分
const RATE_MAX = 12;
const uploads = new Map<string, { count: number; first: number }>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// 画像のマジックバイト検証（拡張子・Content-Typeは詐称できるため実バイトで判定）
function isAllowedImage(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
  // GIF: "GIF8"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  // WebP: "RIFF"...."WEBP"
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return true;
  return false;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: NextRequest) {
  if (!(process.env.GITHUB_TOKEN ?? process.env.GH_PAT)) {
    return NextResponse.json({ error: "設定エラー: GitHub token未設定" }, { status: 500 });
  }

  // ── レート制限 ──
  const ip = clientIp(request);
  const now = Date.now();
  const rec = uploads.get(ip);
  if (rec && now - rec.first < RATE_WINDOW_MS && rec.count >= RATE_MAX) {
    return NextResponse.json({ error: "送信回数が多すぎます。しばらくしてから再度お試しください。" }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "送信データの読み込みに失敗しました" }, { status: 400 });
  }

  // ── 合言葉トークン検証（STAFF_UPLOAD_TOKEN が設定されている場合のみ必須）──
  const expectedToken = process.env.STAFF_UPLOAD_TOKEN;
  if (expectedToken) {
    const provided = (formData.get("token") as string | null)?.trim() ?? "";
    if (!provided || !timingSafeEqual(provided, expectedToken)) {
      return NextResponse.json({ error: "合言葉が正しくありません。担当者にご確認ください。" }, { status: 401 });
    }
  }

  const files = formData.getAll("images") as File[];
  const memo = (formData.get("memo") as string | null)?.trim() ?? "";
  const salonKey = formData.get("salon") as string | null;

  if (!files.length || !memo || !salonKey || !(salonKey in UPLOAD_SALON_INFO)) {
    return NextResponse.json({ error: "写真・メモ・店舗は必須です" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `画像は最大${MAX_FILES}枚までです` }, { status: 400 });
  }
  if (memo.length > MAX_MEMO_LEN) {
    return NextResponse.json({ error: `メモは${MAX_MEMO_LEN}文字以内で入力してください` }, { status: 400 });
  }

  // ── 1枚目の画像を検証 ──
  const imageBuffer = Buffer.from(await files[0].arrayBuffer());
  if (imageBuffer.length === 0) {
    return NextResponse.json({ error: "画像が空です" }, { status: 400 });
  }
  if (imageBuffer.length > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "画像サイズが大きすぎます（8MBまで）" }, { status: 400 });
  }
  if (!isAllowedImage(imageBuffer)) {
    return NextResponse.json({ error: "対応していない画像形式です（JPEG/PNG/WebP/GIF）" }, { status: 400 });
  }

  const salon = UPLOAD_SALON_INFO[salonKey as StaffUploadSalonKey];
  const id = `${salonKey}-${Date.now().toString(36)}`;
  const timestamp = new Date().toISOString();

  // ① 画像を GitHub にコミット（1枚目）
  const imageGithubPath = `public/images/uploads/${salonKey}/${id}.jpg`;
  try {
    await commitFile(imageGithubPath, imageBuffer, `upload(staff): ${id}`);
  } catch (e) {
    return NextResponse.json({ error: `画像の保存に失敗しました: ${String(e)}` }, { status: 500 });
  }

  // ② メタデータ JSON を GitHub にコミット
  const jsonGithubPath = `content/uploads/${id}.json`;
  const uploadData: StaffUpload = {
    id,
    type: "upload",
    imageGithubPath,
    memo,
    salonKey: salonKey as StaffUploadSalonKey,
    salonName: salon.name,
    category: salon.category,
    timestamp,
    jsonGithubPath,
  };

  try {
    await commitFile(
      jsonGithubPath,
      JSON.stringify(uploadData, null, 2),
      `upload(staff): metadata ${id}`,
    );
  } catch (e) {
    return NextResponse.json({ error: `メタデータの保存に失敗しました: ${String(e)}` }, { status: 500 });
  }

  // 成功時にレート制限カウンタを加算
  if (!rec || now - rec.first >= RATE_WINDOW_MS) {
    uploads.set(ip, { count: 1, first: now });
  } else {
    rec.count += 1;
  }

  return NextResponse.json({ ok: true });
}
