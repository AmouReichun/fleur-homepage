import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { IgMedia } from "./fetch-instagram";
import { checkNgWords, autoFixNgWords } from "../lib/blog/ng-words";
import { buildBasePrompt, JSON_INSTRUCTION, AREA_BY_NAME } from "../lib/blog/article-prompt";

dotenv.config({ path: ".env.local" });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

type FaqItem = { q: string; a: string };

type GeneratedArticle = {
  title: string;
  slug: string;
  category: "hair" | "eyelash";
  salon: string;
  date: string;
  excerpt: string;
  thumbnail: string;
  tags: string[];
  question: string;
  answer_summary: string;
  faq: FaqItem[];
  draft: boolean;
  yakkihou_flag: boolean;
  yakkihou_words: string[];
  instagram_id: string;
  instagram_permalink: string;
  body: string;
};

export const UPLOAD_SALONS = {
  fleurami: { name: "fleur ami",         category: "hair"     as const },
  riv:      { name: "Riv. by fleur ami", category: "hair"     as const },
  raffine:  { name: "Raffine",           category: "eyelash"  as const },
} as const;

export type UploadSalonKey = keyof typeof UPLOAD_SALONS;

// 画像ファイルを base64 エンコードして返す（失敗時は null）
function loadImageAsBase64(localImagePath: string): string | null {
  // localImagePath は "/images/instagram/..." 形式の public パス
  const absPath = path.join(process.cwd(), "public", localImagePath);
  if (!fs.existsSync(absPath)) return null;
  return fs.readFileSync(absPath).toString("base64");
}

function buildTextPrompt(media: IgMedia): string {
  const area = AREA_BY_NAME[media.salonName] ?? "高知県";
  const prompt = buildBasePrompt({ category: media.category, salonName: media.salonName, area });
  return `${prompt}

【Instagramキャプション】
${media.caption}

【投稿日】${media.timestamp.slice(0, 10)}
【サロン】${media.salonName}
【パーマリンク】${media.permalink}

${JSON_INSTRUCTION}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

// AIが返す slug に日本語・キリル文字等が混入するとURLが404になるため、
// ASCII英数字とハイフンのみに正規化する（非ASCIIはハイフン化→整理）。
function sanitizeSlug(s: string | undefined | null): string {
  return (s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toYamlString(value: unknown, indent = 0): string {
  const pad = " ".repeat(indent);
  if (Array.isArray(value)) {
    return value.map((v) => `${pad}- ${typeof v === "object" ? "\n" + Object.entries(v as Record<string, unknown>).map(([k, val]) => `${pad}    ${k}: "${String(val).replace(/"/g, '\\"')}"`).join("\n") : `"${String(v).replace(/"/g, '\\"')}"`}`).join("\n");
  }
  return String(value);
}

export function buildMarkdown(article: GeneratedArticle): string {
  const faqYaml = article.faq
    .map((f) => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`)
    .join("\n");

  const tagsYaml = article.tags.map((t) => `"${t}"`).join(", ");

  const flags = article.yakkihou_flag
    ? `draft: true\nyakkihou_flag: true\nyakkihou_words: [${article.yakkihou_words.map((w) => `"${w}"`).join(", ")}]`
    : "draft: true";

  return `---
title: "${article.title.replace(/"/g, '\\"')}"
slug: "${article.slug}"
category: "${article.category}"
salon: "${article.salon}"
date: "${article.date}"
updated: ""
author: ""
author_role: ""
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
thumbnail: "${article.thumbnail}"
tags: [${tagsYaml}]
question: "${article.question.replace(/"/g, '\\"')}"
answer_summary: "${article.answer_summary.replace(/"/g, '\\"')}"
instagram_id: "${article.instagram_id}"
instagram_permalink: "${article.instagram_permalink}"
${flags}
faq:
${faqYaml}
---

${article.body}
`;
}

export async function generateArticle(media: IgMedia): Promise<GeneratedArticle | null> {
  console.log(`  🤖 記事生成中: ${media.salonName} / ${media.id}`);

  const textPrompt = buildTextPrompt(media);
  const imageBase64 = loadImageAsBase64(media.localImagePath);

  // 画像が取得できた場合はマルチモーダル（画像＋テキスト）で渡す
  // → 写真の見た目と施術内容を両方踏まえた記事になる
  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string };

  const content: ContentBlock[] = imageBase64
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: textPrompt },
      ]
    : [{ type: "text", text: textPrompt }];

  if (imageBase64) {
    console.log(`     📷 画像を添付してリクエスト`);
  } else {
    console.log(`     ⚠️  画像なし（テキストのみ）`);
  }

  type ParsedArticle = {
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    question: string;
    answer_summary: string;
    faq: FaqItem[];
    body: string;
  };

  // JSON パースエラーは API レスポンスの揺らぎで起きるため最大3回リトライ
  let parsed: ParsedArticle | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    let raw = "";
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content }],
      });
      raw = (message.content[0] as { text: string }).text.trim();
    } catch (e) {
      console.error(`  ❌ Claude API エラー (試行 ${attempt}/3):`, e);
      if (attempt === 3) return null;
      continue;
    }

    // JSON ブロック抽出（```json ... ``` を含む場合も対応）
    const fenced = raw.match(/```json\s*([\s\S]*?)```/);
    const jsonStr = fenced ? fenced[1] : raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonStr) {
      console.error(`  ❌ JSON が見つかりません (試行 ${attempt}/3)`);
      if (attempt === 3) return null;
      continue;
    }

    try {
      parsed = JSON.parse(jsonStr);
      break; // 成功したらリトライ終了
    } catch (e) {
      console.error(`  ⚠️  JSON パースエラー (試行 ${attempt}/3):`, (e as Error).message);
      if (attempt === 3) return null;
    }
  }

  if (!parsed) return null;

  // NG語を安全な表現に自動置換してからチェック
  parsed.title          = autoFixNgWords(parsed.title);
  parsed.excerpt        = autoFixNgWords(parsed.excerpt);
  parsed.question       = autoFixNgWords(parsed.question);
  parsed.answer_summary = autoFixNgWords(parsed.answer_summary);
  parsed.body           = autoFixNgWords(parsed.body);
  parsed.faq = parsed.faq.map((f) => ({ q: autoFixNgWords(f.q), a: autoFixNgWords(f.a) }));

  const fullText = [parsed.title, parsed.excerpt, parsed.answer_summary, parsed.body, ...parsed.faq.map((f) => f.q + f.a)].join(" ");
  const ngWords = checkNgWords(fullText);

  const article: GeneratedArticle = {
    title: parsed.title,
    slug: sanitizeSlug(parsed.slug) || slugify(parsed.title) || media.id,
    category: media.category,
    salon: media.salonName,
    date: media.timestamp.slice(0, 10),
    excerpt: parsed.excerpt,
    thumbnail: media.localImagePath,
    tags: parsed.tags ?? [],
    question: parsed.question,
    answer_summary: parsed.answer_summary,
    faq: parsed.faq ?? [],
    draft: true,
    yakkihou_flag: ngWords.length > 0,
    yakkihou_words: ngWords,
    instagram_id: media.id,
    instagram_permalink: media.permalink,
    body: parsed.body,
  };

  return article;
}

export async function generateAllArticles(mediaList: IgMedia[]): Promise<void> {
  let saved = 0;
  let flagged = 0;
  let failed = 0;

  for (const media of mediaList) {
    const article = await generateArticle(media);
    if (!article) { failed++; continue; }

    const dir = path.join(process.cwd(), "content", article.category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${article.slug}.md`);

    // スラグ重複チェック
    if (fs.existsSync(filePath)) {
      article.slug = `${article.slug}-${article.instagram_id.slice(-6)}`;
    }

    const markdown = buildMarkdown(article);
    fs.writeFileSync(filePath, markdown, "utf-8");

    if (article.yakkihou_flag) {
      flagged++;
      console.log(`  ⚠️  薬機法フラグ: ${article.slug} [${article.yakkihou_words.join(", ")}]`);
    } else {
      console.log(`  ✅ 保存: content/${article.category}/${article.slug}.md`);
    }
    saved++;
  }

  console.log(`\n📊 結果: ${saved} 件保存 / ${flagged} 件薬機法フラグ / ${failed} 件失敗`);
}

// ── スタッフ手動アップロード用エントリポイント ─────────────────────────
export async function generateArticleFromUpload(params: {
  imagesBase64: string[];
  memo: string;
  salonKey: UploadSalonKey;
  date: string;
}): Promise<GeneratedArticle | null> {
  const { imagesBase64, memo, salonKey, date } = params;
  const salon = UPLOAD_SALONS[salonKey];

  const area = AREA_BY_NAME[salon.name] ?? "高知県";
  const textPrompt = `${buildBasePrompt({ category: salon.category, salonName: salon.name, area })}

【スタッフメモ】
${memo}

【投稿日】${date}
【サロン】${salon.name}

${JSON_INSTRUCTION}`;

  console.log(`  🤖 記事生成中（手動アップロード）: ${salon.name}`);

  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string };

  const content: ContentBlock[] = [
    ...imagesBase64.map((b64): ContentBlock => ({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: b64 },
    })),
    { type: "text", text: textPrompt },
  ];

  type ParsedArticle = {
    title: string; slug: string; excerpt: string; tags: string[];
    question: string; answer_summary: string; faq: FaqItem[]; body: string;
  };

  let parsed: ParsedArticle | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    let raw = "";
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content }],
      });
      raw = (message.content[0] as { text: string }).text.trim();
    } catch (e) {
      console.error(`  ❌ Claude API エラー (試行 ${attempt}/3):`, e);
      if (attempt === 3) return null;
      continue;
    }
    const fenced = raw.match(/```json\s*([\s\S]*?)```/);
    const jsonStr = fenced ? fenced[1] : raw.match(/\{[\s\S]*\}/)?.[0];
    if (!jsonStr) { if (attempt === 3) return null; continue; }
    try { parsed = JSON.parse(jsonStr); break; }
    catch { if (attempt === 3) return null; }
  }
  if (!parsed) return null;

  // NG語を安全な表現に自動置換してからチェック
  parsed.title          = autoFixNgWords(parsed.title);
  parsed.excerpt        = autoFixNgWords(parsed.excerpt);
  parsed.question       = autoFixNgWords(parsed.question);
  parsed.answer_summary = autoFixNgWords(parsed.answer_summary);
  parsed.body           = autoFixNgWords(parsed.body);
  parsed.faq = parsed.faq.map((f) => ({ q: autoFixNgWords(f.q), a: autoFixNgWords(f.a) }));

  const fullText = [parsed.title, parsed.excerpt, parsed.answer_summary, parsed.body, ...parsed.faq.map((f) => f.q + f.a)].join(" ");
  const ngWords = checkNgWords(fullText);

  return {
    title: parsed.title,
    slug: sanitizeSlug(parsed.slug) || slugify(parsed.title) || `post-${Date.now().toString(36)}`,
    category: salon.category,
    salon: salon.name,
    date,
    excerpt: parsed.excerpt,
    thumbnail: "",
    tags: parsed.tags ?? [],
    question: parsed.question,
    answer_summary: parsed.answer_summary,
    faq: parsed.faq ?? [],
    draft: true,
    yakkihou_flag: ngWords.length > 0,
    yakkihou_words: ngWords,
    instagram_id: "",
    instagram_permalink: "",
    body: parsed.body,
  };
}

// 単体実行
if (process.argv[1].endsWith("generate-article.ts")) {
  const fetchedPath = path.join(process.cwd(), "scripts", "_fetched.json");
  if (!fs.existsSync(fetchedPath)) {
    console.error("❌ scripts/_fetched.json が見つかりません。先に fetch-instagram.ts を実行してください。");
    process.exit(1);
  }
  const mediaList: IgMedia[] = JSON.parse(fs.readFileSync(fetchedPath, "utf-8"));
  const target = mediaList.slice(0, 3); // まず3件でテスト
  console.log(`📝 ${target.length} 件の記事を生成します\n`);
  generateAllArticles(target);
}
