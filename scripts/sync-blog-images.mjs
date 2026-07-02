#!/usr/bin/env node
// ブログ画像同期スクリプト
// fleur-blog リポジトリの public/images を fleur-homepage/public/images へ取り込む。
//
// 背景: 管理画面(/admin/blog)の記事一覧は GitHub からライブ取得するため新記事がすぐ並ぶが、
//       サムネイル画像は fleur-homepage/public に置いた静的ファイルしか配信できない。
//       自動生成で fleur-blog に増えた画像を同期しないと、管理画面のサムネが 404 で割れる。
//
// 使い方:
//   node scripts/sync-blog-images.mjs            # pull → 画像同期（差分のみ）
//   node scripts/sync-blog-images.mjs --deploy   # 上記 + vercel --prod まで実行
//   node scripts/sync-blog-images.mjs --no-pull  # git pull せず、今あるファイルだけ同期
//   BLOG_DIR=/path/to/fleur-blog node scripts/sync-blog-images.mjs   # ブログの場所を指定

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const DO_DEPLOY = args.includes("--deploy");
const NO_PULL = args.includes("--no-pull");

const homeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const blogDir = process.env.BLOG_DIR
  ? path.resolve(process.env.BLOG_DIR)
  : path.resolve(homeRoot, "..", "fleur-blog");

const srcImages = path.join(blogDir, "public", "images");
const dstImages = path.join(homeRoot, "public", "images");

function log(msg) { console.log(msg); }
function fail(msg) { console.error(`\n❌ ${msg}`); process.exit(1); }

if (!fs.existsSync(blogDir)) fail(`fleur-blog が見つかりません: ${blogDir}\n  BLOG_DIR=<パス> で指定できます。`);
if (!fs.existsSync(srcImages)) fail(`画像ディレクトリが見つかりません: ${srcImages}`);

// 1. 最新を取り込む
if (!NO_PULL) {
  log(`▶ git pull（${blogDir}）`);
  try {
    execFileSync("git", ["-C", blogDir, "pull", "--ff-only", "origin", "main"], { stdio: "inherit" });
  } catch {
    fail("git pull に失敗しました。fleur-blog の状態を確認してください。");
  }
}

// 2. 差分同期（新規＋サイズ相違をコピー。削除は同期しない＝安全側）
let copied = 0;
function walk(relDir) {
  const absSrc = path.join(srcImages, relDir);
  for (const name of fs.readdirSync(absSrc)) {
    const rel = path.join(relDir, name);
    const sp = path.join(srcImages, rel);
    const st = fs.statSync(sp);
    if (st.isDirectory()) { walk(rel); continue; }
    const dp = path.join(dstImages, rel);
    const exists = fs.existsSync(dp);
    if (!exists || fs.statSync(dp).size !== st.size) {
      fs.mkdirSync(path.dirname(dp), { recursive: true });
      fs.copyFileSync(sp, dp);
      copied++;
      log(`  ${exists ? "~" : "+"} ${rel}`);
    }
  }
}
log(`▶ 画像同期  ${srcImages}\n         → ${dstImages}`);
walk("");
log(`\n✓ 同期完了: ${copied} 枚更新`);

// 3. デプロイ
if (copied === 0) {
  log("変更なし。デプロイは不要です。");
} else if (DO_DEPLOY) {
  log("\n▶ vercel --prod");
  execFileSync("npx", ["vercel", "--prod"], { cwd: homeRoot, stdio: "inherit" });
} else {
  log("\n本番反映するには:  npx vercel --prod   （または --deploy 付きで再実行）");
}
