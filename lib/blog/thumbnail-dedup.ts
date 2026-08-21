/**
 * サムネイル重複ガード。
 * 既存記事（content/hair・content/eyelash）が既に使っている thumbnail を集め、
 * 新規生成時に同じサムネの記事を作らないためのユーティリティ。
 */
import * as fs from "fs";
import * as path from "path";

const CATEGORIES = ["hair", "eyelash"] as const;

/** 既存記事が使用中の thumbnail パス一覧を収集 */
export function getUsedThumbnails(
  contentRoot = path.join(process.cwd(), "content"),
): Set<string> {
  const used = new Set<string>();
  for (const cat of CATEGORIES) {
    const dir = path.join(contentRoot, cat);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const m = raw.match(/^thumbnail:\s*["']?([^"'\n]+)["']?\s*$/m);
      const thumb = m?.[1]?.trim();
      if (thumb) used.add(thumb);
    }
  }
  return used;
}

/** thumbnail が既存記事で使用済みか。used を渡せば再スキャンを省略できる */
export function isThumbnailUsed(thumbnail: string, used?: Set<string>): boolean {
  const t = thumbnail?.trim();
  if (!t) return false;
  return (used ?? getUsedThumbnails()).has(t);
}
