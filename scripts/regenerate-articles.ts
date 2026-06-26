/**
 * 既存記事を写真＋キャプション（マルチモーダル）で再生成するスクリプト
 *
 * - _fetched.json と instagram_id で照合
 * - スラグ・サムネ・公開状態（draft フラグ）・instagram メタは保持
 * - Claude 生成フィールド（title, excerpt, body, tags, faq など）を上書き
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { generateArticle } from "./generate-article";
import type { IgMedia } from "./fetch-instagram";

const FETCHED_PATH = path.join(process.cwd(), "scripts", "_fetched.json");
const CONTENT_DIRS = ["hair", "eyelash"].map((c) =>
  path.join(process.cwd(), "content", c)
);

if (!fs.existsSync(FETCHED_PATH)) {
  console.error("❌ scripts/_fetched.json が見つかりません。先に npm run pipeline:fetch を実行してください。");
  process.exit(1);
}

const fetched: IgMedia[] = JSON.parse(fs.readFileSync(FETCHED_PATH, "utf-8"));
const fetchedById = new Map(fetched.map((m) => [m.id, m]));

// 対象ファイルを収集
const targets: Array<{ filePath: string; slug: string; media: IgMedia; keepPublished: boolean }> = [];

for (const dir of CONTENT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const igIdMatch = raw.match(/^instagram_id:\s*"(.+)"/m);
    if (!igIdMatch) continue;

    const media = fetchedById.get(igIdMatch[1]);
    if (!media) continue;

    const slugMatch = raw.match(/^slug:\s*"(.+)"/m);
    if (!slugMatch) continue;

    // 公開済み（draft: true がない）なら再生成後もそのまま公開を維持
    const keepPublished = !/^draft:\s*true/m.test(raw);

    targets.push({ filePath, slug: slugMatch[1], media, keepPublished });
  }
}

async function main() {
  console.log(`\n📝 ${targets.length} 件の記事を再生成します（写真＋キャプション）\n`);

  let done = 0, failed = 0;

  for (const { filePath, slug, media, keepPublished } of targets) {
    const article = await generateArticle(media);
    if (!article) {
      console.error(`  ❌ 失敗: ${slug}`);
      failed++;
      continue;
    }

    // 既存ファイルからサムネパスを取得（パイプライン生成サムネを維持）
    const existingRaw = fs.readFileSync(filePath, "utf-8");
    const thumbMatch = existingRaw.match(/^thumbnail:\s*"(.+)"/m);
    const thumbnail = thumbMatch?.[1] ?? media.localImagePath;

    const faqYaml = article.faq
      .map((f) => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`)
      .join("\n");
    const tagsYaml = article.tags.map((t) => `"${t}"`).join(", ");

    // draft フラグ：公開済みはそのまま公開維持、下書きは下書きのまま
    const draftLine = keepPublished ? "" : "draft: true\n";
    const yakkihouLines = article.yakkihou_flag
      ? `yakkihou_flag: true\nyakkihou_words: [${article.yakkihou_words.map((w) => `"${w}"`).join(", ")}]\n`
      : "";

    const newContent = `---
title: "${article.title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${article.category}"
salon: "${article.salon}"
date: "${article.date}"
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
thumbnail: "${thumbnail}"
tags: [${tagsYaml}]
question: "${article.question.replace(/"/g, '\\"')}"
answer_summary: "${article.answer_summary.replace(/"/g, '\\"')}"
instagram_id: "${media.id}"
instagram_permalink: "${media.permalink}"
${draftLine}${yakkihouLines}faq:
${faqYaml}
---

${article.body}
`;

    fs.writeFileSync(filePath, newContent, "utf-8");

    const status = keepPublished ? "公開済み" : "下書き";
    const flag = article.yakkihou_flag ? " ⚠️ 薬機法フラグ" : "";
    console.log(`  ✅ ${slug} [${status}]${flag}`);
    done++;
  }

  console.log(`\n📊 完了: ${done} 件 / 失敗: ${failed} 件`);
  if (done > 0) {
    console.log("   サムネは変更なし（npm run pipeline:thumb で再生成できます）");
  }
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
