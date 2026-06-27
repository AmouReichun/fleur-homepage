import Anthropic from "@anthropic-ai/sdk";
import { checkNgWords } from "./ng-words";
import { buildBasePrompt, JSON_INSTRUCTION } from "./article-prompt";
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
  const area = AREA[post.salonKey] ?? "高知県";
  const prompt = buildBasePrompt({
    category: post.category,
    salonName: post.salonName,
    area,
    author: stylist.name,
  });

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
        max_tokens: 8000,
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
