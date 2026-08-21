import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * スタッフ投稿画像を 3:4（縦・中央クロップ）に加工してダウンロードさせる。
 * 画像は public/ に配置済みで静的URL（/images/uploads/...）で公開されているため、
 * 自サイトの静的URLから直接取得して sharp で加工する。
 * /api/admin/* は middleware で管理者認証済み。
 */

// 出力サイズ（3:4）。元画像より大きい場合のみ拡大されるが、サロン写真は概ねこの前後。
const OUT_W = 1200;
const OUT_H = 1600;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("path");
  if (!raw) return new NextResponse("Missing path", { status: 400 });

  // path traversal 防止：アップロード画像のみ許可。
  // 受理する形式は "public/images/uploads/..." または "/images/uploads/..." の両方。
  const normalized = raw.replace(/\.\./g, "").replace(/^\/+/, "").replace(/^public\//, "");
  if (!normalized.startsWith("images/uploads/") || !/\.(jpe?g|png|webp)$/i.test(normalized)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 自サイトの静的URLから取得（本番CDN配信）
  const src = new URL(`/${normalized}`, req.nextUrl.origin);
  const imgRes = await fetch(src, { cache: "no-store" });
  if (!imgRes.ok) {
    return new NextResponse(`画像が見つかりません (${imgRes.status})`, { status: 404 });
  }
  const input = Buffer.from(await imgRes.arrayBuffer());

  // EXIF の回転を反映してから 3:4 中央クロップ
  const output = await sharp(input)
    .rotate()
    .resize(OUT_W, OUT_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();

  const base = normalized.split("/").pop()!.replace(/\.[^.]+$/, "");
  const filename = `${base}-3x4.jpg`;

  return new NextResponse(output as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
