import Anthropic from "@anthropic-ai/sdk";
import { checkNgWords } from "./ng-words";
import type { IgPost } from "./instagram-api";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const STYLISTS: Record<string, { names: string[]; role: string }> = {
  fleurami: {
    names: ["西内みゆき", "山岡悠弥", "川上凛", "高田和花"],
    role: "スタイリスト",
  },
  riv: {
    names: ["西森心大", "細川彩香", "沢村瑞希", "西田ななみ"],
    role: "スタイリスト",
  },
  raffine: {
    names: ["安井未琉", "尾崎あい"],
    role: "アイリスト",
  },
};

function pickStylest(salonKey: string): { name: string; role: string } {
  const s = STYLISTS[salonKey] ?? STYLISTS["fleurami"];
  const name = s.names[Math.floor(Math.random() * s.names.length)];
  return { name, role: s.role };
}

// タイトル・本文で使う地域名（SEO/MEO用）
const AREA: Record<string, string> = {
  fleurami: "香南市",
  riv: "高知市",
  raffine: "高知市",
};

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

// SEO・AIO・MEO 共通ルール（ヘア／アイ両方で使用）
const COMMON_RULES = `
【記事の目的】
- 高知県内（{AREA}）でのSEO上位表示
- AI検索（AIO）で引用されやすい、悩み→施術→解決まで網羅した情報記事
- Googleマップ（MEO）評価向上
- 来店予約につなげる

【入力情報について】
- ビフォー写真はありません。アフター写真1枚＋キャプション（担当スタッフ・メニュー・店舗・簡単なコメント）が入力です。
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

const HAIR_PROMPT = `あなたはヘアサロン「{SALON}」（高知県{AREA}）のスタイリスト{AUTHOR}です。
添付したアフター写真と以下のキャプションをもとに、
ヘアケアに関心のある大人女性（主に40代前後）向けのSEO・AIO・MEO対策ブログ記事を書いてください。

トーン：落ち着いた丁寧な大人向けの語り。専門知識をわかりやすく、信頼感のある文体。
${COMMON_RULES}`;

const EYELASH_PROMPT = `あなたはまつ毛・まゆげサロン「{SALON}」（高知県{AREA}）のアイリスト{AUTHOR}です。
添付したアフター写真と以下のキャプションをもとに、
20〜30代女性向けのSEO・AIO・MEO対策ブログ記事を書いてください。

トーン：軽やかでトレンド感のある語り。韓国っぽい感度を意識しつつ、専門家としての信頼感も保つ。
${COMMON_RULES}`;

const JSON_INSTRUCTION = `
以下のJSON形式で出力してください。JSON以外は一切出力しないこと。

{
  "title": "地域名＋メニュー＋悩みを含むタイトル",
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
  "steps": [
    {"name": "ステップ名（例：カウンセリング）", "text": "手順の説明（1〜2文）"},
    {"name": "ステップ名", "text": "手順の説明"}
  ],
  "body": "マークダウン形式の本文（1500〜2500字）。指定のH2構成（今回のお客様のご紹介／このようなお悩みはありませんか？／今回の施術内容／このメニューがおすすめな方／施術後のホームケア方法／よくある質問／まとめ）を順番どおりすべて使うこと。"
}

stepsについて：施術手順や自宅ケアの手順を2〜5ステップで記述。手順が自然に含まれない記事の場合は空配列 [] にすること。
faqについて：本文「## よくある質問」セクションの内容とこの faq 配列を一致させること。
重要：薬機法・景表法に触れる表現（治る/改善する/絶対/No.1/若返り/100%確実 等）は使わないこと`;

type FaqItem = { q: string; a: string };

type StepItem = { name: string; text: string };

type ParsedArticle = {
  title: string; slug: string; excerpt: string;
  tags: string[]; question: string; answer_summary: string;
  faq: FaqItem[]; steps: StepItem[]; body: string;
};

export type ArticleResult = {
  markdown: string;
  slug: string;
  category: "hair" | "eyelash";
  imagePath: string;
};

export async function generateArticleFromPost(
  post: IgPost,
  imageBase64: string | null,
): Promise<ArticleResult | null> {
  const stylist = pickStylest(post.salonKey);
  const basePrompt = post.category === "hair" ? HAIR_PROMPT : EYELASH_PROMPT;
  const area = AREA[post.salonKey] ?? "高知県";
  const prompt = basePrompt
    .replace(/\{SALON\}/g, post.salonName)
    .replace(/\{AUTHOR\}/g, stylist.name)
    .replace(/\{AREA\}/g, area);

  const fullPrompt = `${prompt}

【Instagramキャプション】
${post.caption}

【投稿日】${post.timestamp.slice(0, 10)}
【サロン】${post.salonName}
【パーマリンク】${post.permalink}

${JSON_INSTRUCTION}`;

  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string };

  const content: ContentBlock[] = imageBase64
    ? [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
        { type: "text", text: fullPrompt },
      ]
    : [{ type: "text", text: fullPrompt }];

  let parsed: ParsedArticle | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 6000,
        messages: [{ role: "user", content }],
      });
      const raw = (message.content[0] as { text: string }).text.trim();
      const fenced = raw.match(/```json\s*([\s\S]*?)```/);
      const jsonStr = fenced ? fenced[1] : raw.match(/\{[\s\S]*\}/)?.[0];
      if (!jsonStr) continue;
      parsed = JSON.parse(jsonStr);
      break;
    } catch (e) {
      console.error(`[article-core] attempt ${attempt} error:`, e);
      if (attempt === 3) return null;
    }
  }
  if (!parsed) return null;

  const slug = sanitizeSlug(parsed.slug) || post.id;
  const ngWords = checkNgWords(
    [parsed.title, parsed.excerpt, parsed.answer_summary, parsed.body,
     ...parsed.faq.map((f) => f.q + f.a)].join(" "),
  );
  const imagePath = `/images/instagram/${post.salonKey}/${post.id}.jpg`;

  const faqYaml = parsed.faq
    .map((f) => `  - q: "${f.q.replace(/"/g, '\\"')}"\n    a: "${f.a.replace(/"/g, '\\"')}"`)
    .join("\n");
  const stepsYaml = (parsed.steps ?? []).length > 0
    ? (parsed.steps ?? []).map((s) => `  - name: "${s.name.replace(/"/g, '\\"')}"\n    text: "${s.text.replace(/"/g, '\\"')}"`)
      .join("\n")
    : null;
  const tagsYaml = parsed.tags.map((t) => `"${t}"`).join(", ");
  const flags = ngWords.length > 0
    ? `draft: true\nyakkihou_flag: true\nyakkihou_words: [${ngWords.map((w) => `"${w}"`).join(", ")}]`
    : "draft: true";

  const markdown = `---
title: "${parsed.title.replace(/"/g, '\\"')}"
slug: "${slug}"
category: "${post.category}"
salon: "${post.salonName}"
date: "${post.timestamp.slice(0, 10)}"
updated: ""
author: "${stylist.name}"
author_role: "${stylist.role}"
excerpt: "${parsed.excerpt.replace(/"/g, '\\"')}"
thumbnail: "${imagePath}"
tags: [${tagsYaml}]
question: "${parsed.question.replace(/"/g, '\\"')}"
answer_summary: "${parsed.answer_summary.replace(/"/g, '\\"')}"
instagram_id: "${post.id}"
instagram_permalink: "${post.permalink}"
${flags}
faq:
${faqYaml}
${stepsYaml ? `steps:\n${stepsYaml}` : "steps: []"}
---

${parsed.body}
`;

  return { markdown, slug, category: post.category, imagePath };
}
