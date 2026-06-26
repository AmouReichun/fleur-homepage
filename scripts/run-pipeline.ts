import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

dotenv.config({ path: ".env.local" });

import { fetchAllSalons, checkTokenExpiry } from "./fetch-instagram";
import { generateArticle } from "./generate-article";
import { generateThumbnail, ThumbInput } from "./generate-thumbnail";

const LIMIT = parseInt(process.argv[2] ?? "5", 10); // デフォルト5件/店舗

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("  fleur group 記事生成パイプライン");
  console.log("═══════════════════════════════════════\n");

  // ① トークン有効期限チェック
  console.log("【1/4】トークン確認");
  await checkTokenExpiry();

  // ② Instagram取得
  console.log("\n【2/4】Instagram投稿取得");
  const mediaList = await fetchAllSalons(LIMIT);
  console.log(`\n  合計 ${mediaList.length} 件取得\n`);

  if (mediaList.length === 0) {
    console.error("❌ 投稿が取得できませんでした。終了します。");
    process.exit(1);
  }

  // ③ 記事生成（既存slugはスキップ）
  console.log("【3/4】記事生成（Claude API）");
  const generated: { slug: string; category: string; title: string; salonName: string; tags: string[]; thumbSrc: string }[] = [];
  let skipped = 0;
  let flagged = 0;
  let failed = 0;

  // 既存記事の instagram_id を全件インデックス化（重複防止）
  const existingIds = new Set<string>();
  for (const cat of ["hair", "eyelash"]) {
    const dir = path.join(process.cwd(), "content", cat);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const m = raw.match(/^instagram_id:\s*"(.+)"/m);
      if (m) existingIds.add(m[1]);
    }
  }

  for (const media of mediaList) {
    // instagram_id 単位でスキップ（スラグが変わっても重複を防ぐ）
    if (existingIds.has(media.id)) {
      skipped++;
      console.log(`  ⏭  スキップ（既存）: ${media.id}`);
      continue;
    }

    const article = await generateArticle(media);
    if (!article) { failed++; continue; }

    const dir = path.join(process.cwd(), "content", article.category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let slug = article.slug;
    const filePath = path.join(dir, `${slug}.md`);

    // スラグ衝突はサフィックスで回避
    if (fs.existsSync(filePath)) {
      slug = `${slug}-${media.id.slice(-6)}`;
    }

    // frontmatter にサムネを仮設定（後で差し替え）
    const tempThumb = media.localImagePath;
    const frontmatter = [
      `---`,
      `title: "${article.title.replace(/"/g, '\\"')}"`,
      `slug: "${slug}"`,
      `category: "${article.category}"`,
      `salon: "${article.salon}"`,
      `date: "${article.date}"`,
      `excerpt: "${article.excerpt.replace(/"/g, '\\"')}"`,
      `thumbnail: "${tempThumb}"`,
      `tags: [${article.tags.map((t) => `"${t}"`).join(", ")}]`,
      `question: "${article.question.replace(/"/g, '\\"')}"`,
      `answer_summary: "${article.answer_summary.replace(/"/g, '\\"')}"`,
      `instagram_id: "${article.instagram_id}"`,
      `instagram_permalink: "${article.instagram_permalink}"`,
      article.yakkihou_flag
        ? `draft: true\nyakkihou_flag: true\nyakkihou_words: [${article.yakkihou_words.map((w) => `"${w}"`).join(", ")}]`
        : `draft: true`,
      `faq:`,
      ...article.faq.map((f) => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`),
      `---`,
      ``,
      article.body,
    ].join("\n");

    fs.writeFileSync(path.join(dir, `${slug}.md`), frontmatter, "utf-8");

    if (article.yakkihou_flag) {
      flagged++;
      console.log(`  ⚠️  薬機法フラグ: ${slug} [${article.yakkihou_words.join(", ")}]`);
    } else {
      console.log(`  ✅ 記事保存: content/${article.category}/${slug}.md`);
    }

    generated.push({
      slug,
      category: article.category,
      title: article.title,
      salonName: article.salon,
      tags: article.tags,
      thumbSrc: tempThumb,
    });
  }

  // ④ サムネ生成 → thumbnail パスを更新
  console.log("\n【4/4】サムネイル生成");
  for (const item of generated) {
    const input: ThumbInput = {
      slug: item.slug,
      title: item.title,
      salonName: item.salonName,
      category: item.category as "hair" | "eyelash",
      tags: item.tags,
      sourceImagePath: item.thumbSrc,
    };
    const thumbPath = await generateThumbnail(input);
    if (!thumbPath) continue;

    // .md の thumbnail を更新
    const mdPath = path.join(process.cwd(), "content", item.category, `${item.slug}.md`);
    if (fs.existsSync(mdPath)) {
      const content = fs.readFileSync(mdPath, "utf-8");
      const updated = content.replace(/^thumbnail: ".+"/m, `thumbnail: "${thumbPath}"`);
      fs.writeFileSync(mdPath, updated, "utf-8");
    }
    console.log(`  ✅ サムネ: ${thumbPath}`);
  }

  // ── 結果サマリー ──────────────────────────────────
  console.log("\n═══════════════════════════════════════");
  console.log("  完了サマリー");
  console.log("═══════════════════════════════════════");
  console.log(`  新規生成:       ${generated.length} 件`);
  console.log(`  スキップ:       ${skipped} 件（既存）`);
  console.log(`  薬機法フラグ:   ${flagged} 件`);
  console.log(`  失敗:           ${failed} 件`);
  console.log("");

  if (generated.length > 0) {
    console.log("  📄 生成された下書き一覧：");
    for (const item of generated) {
      const flag = item.category === "eyelash" ? "💅" : "💇";
      console.log(`  ${flag} content/${item.category}/${item.slug}.md`);
    }
  }

  if (flagged > 0) {
    console.log("\n  ⚠️  薬機法フラグが立っている記事があります。");
    console.log("     公開前に必ず内容を確認してください。");
  }

  console.log("\n  ✅ すべての記事は draft: true です。");
  console.log("  公開するには frontmatter の draft: true を削除してください。");
  console.log("═══════════════════════════════════════\n");
}

main().catch((e) => {
  console.error("❌ パイプラインエラー:", e);
  process.exit(1);
});
