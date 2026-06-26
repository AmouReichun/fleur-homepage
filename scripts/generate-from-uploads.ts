/**
 * content/uploads/*.json を読んでスタッフ投稿から記事を生成するスクリプト。
 * GitHub Actions（staff-upload-generate.yml）から実行される。
 * - 薬機法フラグなし → draft なしで即時公開
 * - 薬機法フラグあり → draft: true のまま（管理者レビュー）
 */
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { generateArticleFromUpload, buildMarkdown, type UploadSalonKey } from "./generate-article";
import type { StaffUpload } from "../lib/blog/staff-uploads";

dotenv.config({ path: ".env.local" });

const UPLOAD_DIR = path.join(process.cwd(), "content", "uploads");
const CONTENT_DIR = path.join(process.cwd(), "content");

async function main() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("content/uploads/ が存在しません");
    return;
  }

  const files = fs.readdirSync(UPLOAD_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("処理するアップロードがありません");
    return;
  }

  console.log(`${files.length} 件のスタッフ投稿を処理します\n`);
  let generated = 0;
  let failed = 0;

  for (const file of files) {
    const jsonPath = path.join(UPLOAD_DIR, file);
    let upload: StaffUpload;
    try {
      upload = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as StaffUpload;
    } catch (e) {
      console.error(`JSON 読み込み失敗: ${file}`, e);
      failed++;
      continue;
    }

    console.log(`[${upload.id}] ${upload.salonName} — ${upload.memo.slice(0, 60)}`);

    // imageGithubPath = "public/images/uploads/[salon]/[id].jpg"
    const absImagePath = path.join(process.cwd(), upload.imageGithubPath);
    let imagesBase64: string[] = [];
    if (fs.existsSync(absImagePath)) {
      imagesBase64 = [fs.readFileSync(absImagePath).toString("base64")];
      console.log("  画像: OK");
    } else {
      console.log(`  画像: 見つかりません (${upload.imageGithubPath})、テキストのみで生成`);
    }

    const date = upload.timestamp.slice(0, 10);
    const article = await generateArticleFromUpload({
      imagesBase64,
      memo: upload.memo,
      salonKey: upload.salonKey as UploadSalonKey,
      date,
    });

    if (!article) {
      console.error("  ✗ 記事生成失敗");
      failed++;
      continue;
    }

    article.thumbnail = `/images/uploads/${upload.salonKey}/${upload.id}.jpg`;
    article.slug = `${article.slug}-${Date.now().toString(36)}`;

    let markdown = buildMarkdown(article);

    if (article.yakkihou_flag) {
      console.log(`  ⚠ 薬機法フラグ [${article.yakkihou_words.join(", ")}] → draft 保存（管理者確認）`);
    } else {
      // draft: true を削除して即時公開
      markdown = markdown.replace(/^draft: true\r?\n/m, "");
      console.log("  公開ステータス: 即時公開");
    }

    const mdDir = path.join(CONTENT_DIR, article.category);
    fs.mkdirSync(mdDir, { recursive: true });

    let mdPath = path.join(mdDir, `${article.slug}.md`);
    if (fs.existsSync(mdPath)) {
      article.slug = `${article.slug}-2`;
      mdPath = path.join(mdDir, `${article.slug}.md`);
    }

    fs.writeFileSync(mdPath, markdown, "utf-8");
    console.log(`  ✓ 保存: content/${article.category}/${article.slug}.md`);

    fs.unlinkSync(jsonPath);
    console.log(`  ✓ JSON 削除: content/uploads/${file}`);
    generated++;
  }

  console.log(`\n完了: 生成 ${generated} 件 / 失敗 ${failed} 件`);
  if (generated === 0 && failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
