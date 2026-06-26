import { NextRequest, NextResponse } from "next/server";
import { commitFile } from "@/lib/blog/github";
import { UPLOAD_SALON_INFO, type StaffUpload, type StaffUploadSalonKey } from "@/lib/blog/staff-uploads";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!(process.env.GITHUB_TOKEN ?? process.env.GH_PAT)) {
    return NextResponse.json({ error: "設定エラー: GitHub token未設定" }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "送信データの読み込みに失敗しました" }, { status: 400 });
  }

  const files = formData.getAll("images") as File[];
  const memo = (formData.get("memo") as string | null)?.trim() ?? "";
  const salonKey = formData.get("salon") as string | null;

  if (!files.length || !memo || !salonKey || !(salonKey in UPLOAD_SALON_INFO)) {
    return NextResponse.json({ error: "写真・メモ・店舗は必須です" }, { status: 400 });
  }

  const salon = UPLOAD_SALON_INFO[salonKey as StaffUploadSalonKey];
  const id = `${salonKey}-${Date.now().toString(36)}`;
  const timestamp = new Date().toISOString();

  // ① 画像を GitHub にコミット（1枚目）
  const imageBuffer = Buffer.from(await files[0].arrayBuffer());
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

  return NextResponse.json({ ok: true });
}
