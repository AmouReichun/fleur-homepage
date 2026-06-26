import { NextResponse } from "next/server";
import { fetchAllRecentPosts } from "@/lib/blog/instagram-api";
import { getStaffUploads } from "@/lib/blog/staff-uploads";
import { getFileContent } from "@/lib/blog/github";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// 管理画面で「非表示」にした Instagram 投稿の id 一覧を取得
async function getIgnoredInstagramIds(): Promise<Set<string>> {
  try {
    const file = await getFileContent("data/ig-ignored.json");
    if (!file) return new Set();
    const parsed = JSON.parse(file.content);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

function getUsedInstagramIds(): Set<string> {
  const usedIds = new Set<string>();
  const contentDir = path.join(process.cwd(), "content");
  for (const category of ["hair", "eyelash"]) {
    const dir = path.join(contentDir, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const match = raw.match(/^instagram_id:\s*['"]([^'"]+)['"]/m);
      if (match) usedIds.add(match[1].trim());
    }
  }
  return usedIds;
}

export async function GET() {
  // Instagram 取得とスタッフ投稿取得を並列実行。一方が失敗しても他方を返す
  const [igResult, uploads] = await Promise.allSettled([
    fetchAllRecentPosts(8),
    getStaffUploads(),
  ]);

  const igError = igResult.status === "rejected" ? String(igResult.reason) : null;
  const posts = igResult.status === "fulfilled" ? igResult.value : [];
  const staffUploads = uploads.status === "fulfilled" ? uploads.value : [];

  const usedIds = getUsedInstagramIds();
  const ignoredIds = await getIgnoredInstagramIds();
  const filtered = posts.filter((p) => !usedIds.has(p.id) && !ignoredIds.has(p.id));

  return NextResponse.json({
    posts: filtered,
    uploads: staffUploads,
    usedCount: usedIds.size,
    igError,
  });
}
