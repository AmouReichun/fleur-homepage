import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { IgMedia } from "./fetch-instagram";
import { checkNgWords } from "../lib/blog/ng-words";

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

// 店名 → 地域名（SEO/MEO用）
const AREA_BY_NAME: Record<string, string> = {
  "fleur ami": "香南市",
  "Riv. by fleur ami": "高知市",
  "Raffine": "高知市",
};

// SEO・AIO・MEO 共通ルール（ヘア／アイ両方で使用）
const COMMON_RULES = `
【記事の目的】
- 高知県内（{AREA}）でのSEO上位表示
- AI検索（AIO）で引用されやすい、悩み→施術→解決まで網羅した情報記事
- Googleマップ（MEO）評価向上
- 来店予約につなげる

【入力情報について】
- ビフォー写真はありません。アフター写真1枚＋メモ（担当・メニュー・店舗・簡単なコメント）が入力です。
- アフター写真の仕上がりから、お客様が抱えていた「悩み」を自然に推測し、施術で解決した流れとして記述すること。
- **写真に実際に写っている施術・仕上がりに忠実に書くこと。写っていない施術・効果は書かないこと。**

【タイトルルール】（最重要）
- 「地域名（{AREA}）＋メニュー＋悩み」を必ず含めること
- 例：「{AREA}で髪質改善カラー｜艶のあるまとまり髪へ」
      「{AREA}の白髪ぼかしカラーで自然な仕上がりに」
      「{AREA}まつげパーマでナチュラルな目元へ」
      「{AREA}で縮毛矯正なら{SALON}へ」

【本文の見出し構成】（このH2を順番どおりすべて使うこと）
## 今回のお客様のご紹介
## このようなお悩みはありませんか？   ← メニューに応じた悩みを箇条書き（例：広がる／パサつく／白髪が気になる／まつ毛が下がる など）
## 今回の施術内容
## このメニューがおすすめな方
## 施術後のホームケア方法
## よくある質問   ← Q&Aを4つ。出力JSONの faq と同じ内容にすること
## まとめ   ← 最後に必ず予約を促すCTA文（予約導線）を置くこと
- 各H2の下で必要に応じてH3（###）を使い、内容を整理すること

【SEOルール】
- 地域名（{AREA}）を本文中に自然に3〜5回入れること
- 店舗名（{SALON}）を必ず記載すること
- 全体で1500〜2500文字
- 関連する施術メニューに自然に触れ、回遊を促すこと（内部リンク的役割）
- 「まとめ」の最後に予約導線（CTA）を必ず配置すること

【数値・一次情報の扱い】
- 施術時間・色持ち（持ち）・施術頻度の目安など、具体的な数値を1〜2か所入れること
- 数値は「〜分程度」「〜ヶ月が目安」のように幅を持たせ、断定しないこと

【FAQ の地名・店名・口語ルール】
- 4つのFAQのうち、少なくとも1つは店名（{SALON}）または地名（{AREA}）が入る質問にすること
- 4つのFAQのうち、少なくとも1つは「{AREA}で〇〇するならどこがいい？」のような口語・音声検索を意識した質問にすること

【AIO対策】
- 本文中に店名（{SALON}）と地名（{AREA}）を合計3回以上明記すること
- 「{AREA}で〇〇をお考えの方は{SALON}へ」のようなCTA的フレーズを1〜2か所入れること

【禁止事項】
- 「ありがとうございました」だけで終わる記事
- 日記形式
- 短文のみ・情報量の薄い記事
- 同じ文章の繰り返し`;

const HAIR_PROMPT = `あなたはヘアサロン「{SALON}」（高知県{AREA}）のスタイリストです。
添付したアフター写真と以下の入力情報をもとに、
ヘアケアに関心のある大人女性（主に40代前後）向けのSEO・AIO・MEO対策ブログ記事を書いてください。

トーン：落ち着いた丁寧な大人向けの語り。専門知識をわかりやすく、信頼感のある文体。
${COMMON_RULES}`;

const EYELASH_PROMPT = `あなたはまつ毛・まゆげサロン「{SALON}」（高知県{AREA}）のアイリストです。
添付したアフター写真と以下の入力情報をもとに、
20〜30代女性向けのSEO・AIO・MEO対策ブログ記事を書いてください。

トーン：軽やかでトレンド感のある語り。韓国っぽい感度を意識しつつ、専門家としての信頼感も保つ。
${COMMON_RULES}`;

const JSON_INSTRUCTION = `
以下のJSON形式で出力してください。JSON以外は一切出力しないこと。

{
  "title": "質問形のタイトル（例：白髪ぼかしって何歳から始めるべき？）",
  "slug": "英数字とハイフンのみ（例：shiraga-bokashi-nansai）",
  "excerpt": "120文字以内の要約",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"],
  "question": "記事が答えるメインの質問（1文）",
  "answer_summary": "質問への結論（2〜3文）",
  "faq": [
    {"q": "質問1", "a": "回答1"},
    {"q": "質問2", "a": "回答2"},
    {"q": "質問3", "a": "回答3"},
    {"q": "質問4", "a": "回答4"}
  ],
  "body": "マークダウン形式の本文（1500〜2500字）。指定のH2構成（今回のお客様のご紹介／このようなお悩みはありませんか？／今回の施術内容／このメニューがおすすめな方／施術後のホームケア方法／よくある質問／まとめ）を順番どおりすべて使うこと。本文「よくある質問」セクションは上記 faq と一致させること。"
}

重要：
- 薬機法・景表法に触れる表現（治る/改善する/絶対/No.1/若返り/育毛/100%確実 等）は使わないこと
- 効果の断定はしない。「〜しやすい」「〜の方もいる」「〜傾向がある」などの表現にすること
- 実在する施術内容のみ書くこと。架空の症例は作らないこと
`;

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
  const basePrompt = media.category === "hair" ? HAIR_PROMPT : EYELASH_PROMPT;
  const area = AREA_BY_NAME[media.salonName] ?? "高知県";
  const prompt = basePrompt
    .replace(/\{SALON\}/g, media.salonName)
    .replace(/\{AREA\}/g, area);
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
        max_tokens: 6000,
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

  const basePrompt = salon.category === "hair" ? HAIR_PROMPT : EYELASH_PROMPT;
  const area = AREA_BY_NAME[salon.name] ?? "高知県";
  const textPrompt = `${basePrompt.replace(/{SALON}/g, salon.name).replace(/\{AREA\}/g, area)}

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
        max_tokens: 6000,
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
