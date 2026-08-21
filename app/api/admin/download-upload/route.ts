import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * スタッフ投稿画像を 3:4（縦・中央クロップ）に加工してダウンロードさせる。
 * 画像は private リポジトリ（fleur-blog）にあるため GitHub API 経由で取得する。
 * /api/admin/* は middleware で管理者認証済み。
 */

// 出力サイズ（3:4）。元画像より大きい場合のみ拡大されるが、サロン写真は概ねこの前後。
const OUT_W = 1200;
const OUT_H = 1600;

export async function GET(req: NextRequest) {
  const githubPath = req.nextUrl.searchParams.get("path");
  if (!githubPath) return new NextResponse("Missing path", { status: 400 });

  // path traversal 防止：アップロード画像のみ許可
  const safePath = githubPath.replace(/\.\./g, "").replace(/^\/+/, "");
  if (!safePath.startsWith("public/images/uploads/") || !/\.(jpe?g|png|webp)$/i.test(safePath)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT ?? "";
  const owner = process.env.GITHUB_OWNER ?? "AmouReichun";
  const repo = process.env.GITHUB_REPO ?? "fleur-blog";

  const apiRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${safePath}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    },
  );
  if (!apiRes.ok) return new NextResponse("Not found", { status: 404 });

  const data = (await apiRes.json()) as { download_url: string };
  const imgRes = await fetch(data.download_url);
  if (!imgRes.ok) return new NextResponse("Image fetch failed", { status: 502 });
  const input = Buffer.from(await imgRes.arrayBuffer());

  // EXIF の回転を反映してから 3:4 中央クロップ
  const output = await sharp(input)
    .rotate()
    .resize(OUT_W, OUT_H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();

  const base = safePath.split("/").pop()!.replace(/\.[^.]+$/, "");
  const filename = `${base}-3x4.jpg`;

  return new NextResponse(output as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
