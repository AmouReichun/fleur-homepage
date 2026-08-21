/**
 * content/uploads/*.json を読んでスタッフ投稿から記事を生成するスクリプト。
 * GitHub Actions（staff-upload-generate.yml）から1日1回の定時cronで実行される。
 * - 1回の実行で古い順に MAX_PER_RUN 件（=1件/日）だけ生成し、残りはキューに残す。
 * - 生成した記事は draft: true のまま下書き保存する（公開は auto-publish バッチが担当）。
 * - 薬機法フラグの有無に関わらず下書き。フラグ有りは auto-publish の対象外。
 */
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { generateArticleFromUpload, buildMarkdown, type UploadSalonKey } from "./generate-article";
import type { StaffUpload } from "../lib/blog/staff-uploads";
import { getUsedThumbnails } from "../lib/blog/thumbnail-dedup";

dotenv.config({ path: ".env.local" });

const UPLOAD_DIR = path.join(process.cwd(), "content", "uploads");
const CONTENT_DIR = path.join(process.cwd(), "content");

// 1回の実行で生成する記事数（1日1回のcronで実行するため実質「1件/日」）
const MAX_PER_RUN = 1;

async function main() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.log("content/uploads/ が存在しません");
    return;
  }

  const fileNames = fs.readdirSync(UPLOAD_DIR).filter((f) => f.endsWith(".json"));
  if (fileNames.length === 0) {
    console.log("処理するアップロードがありません");
    return;
  }

  // 投稿時刻の古い順（FIFO）に並べ、先頭から MAX_PER_RUN 件だけ生成する。
  // 残りは content/uploads/ に残し、翌日以降の実行で順に処理する。
  const entries: { file: string; upload: StaffUpload }[] = [];
  let failed = 0;
  for (const file of fileNames) {
    try {
      const upload = JSON.parse(
        fs.readFileSync(path.join(UPLOAD_DIR, file), "utf-8"),
      ) as StaffUpload;
      entries.push({ file, upload });
    } catch (e) {
      console.error(`JSON 読み込み失敗: ${file}`, e);
      failed++;
    }
  }
  entries.sort((a, b) => (a.upload.timestamp < b.upload.timestamp ? -1 : 1));

  console.log(
    `キュー ${entries.length} 件。古い順に最大 ${MAX_PER_RUN} 件を下書き生成します\n`,
  );

  // サムネ重複ガード: 既存記事と同じサムネの記事は生成しない
  const usedThumbnails = getUsedThumbnails();
  let generated = 0;

  for (const { file, upload } of entries) {
    if (generated >= MAX_PER_RUN) break;
    const jsonPath = path.join(UPLOAD_DIR, file);

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

    // サムネ重複ガード: 既存記事と同じサムネなら保存せずスキップ
    if (usedThumbnails.has(article.thumbnail)) {
      console.log(`  ⏭ サムネ重複のためスキップ: ${article.thumbnail}`);
      fs.unlinkSync(jsonPath);
      continue;
    }
    usedThumbnails.add(article.thumbnail);

    article.slug = `${article.slug}-${Date.now().toString(36)}`;

    // 常に draft: true のまま保存（公開は auto-publish バッチが担当）。
    // buildMarkdown は draft: true を出力するため、そのまま書き出す。
    const markdown = buildMarkdown(article);

    if (article.yakkihou_flag) {
      console.log(`  ⚠ 薬機法フラグ [${article.yakkihou_words.join(", ")}] → 下書き保存（管理者確認・自動公開対象外）`);
    } else {
      console.log("  下書き保存（翌日以降 auto-publish が公開）");
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
