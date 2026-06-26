import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/** private リポジトリの画像を認証付きで配信するプロキシ */
export async function GET(req: NextRequest) {
  const githubPath = req.nextUrl.searchParams.get("path");
  if (!githubPath) return new NextResponse("Missing path", { status: 400 });

  // path traversal 防止
  const safePath = githubPath.replace(/\.\./g, "").replace(/^\/+/, "");
  if (!safePath.startsWith("public/images/uploads/")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT ?? "";
  const owner = process.env.GITHUB_OWNER ?? "AmouReichun";
  const repo  = process.env.GITHUB_REPO  ?? "fleur-blog";

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

  const buffer = await imgRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
