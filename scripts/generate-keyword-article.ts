/**
 * data/seo-tasks.json の type="new_article" タスクを実行する。
 * Instagram 写真なしでも、キーワードから情報系ピラー記事を生成して draft: true で保存する。
 * GitHub Actions から実行される（週次 seo-weekly.yml）。
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { buildBasePrompt, JSON_INSTRUCTION, AREA_BY_KEY } from "../lib/blog/article-prompt";
import { getAllPosts } from "../lib/blog/posts";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SALON_NAME: Record<string, string> = {
  fleurami: "fleurami",
  riv: "Riv. by fleurami",
  raffine: "Raffine",
};


type NewArticleTask = {
  type: "new_article";
  priority: number;
  targetKeyword: string;
  category?: "hair" | "eyelash";
  salon?: string;
  impressions: number;
  reason: string;
};

type SeoTasksFile = {
  generatedAt: string;
  tasks: Array<{ type: string } & Partial<NewArticleTask>>;
};

function loadTasks(): NewArticleTask[] {
  const p = path.join(process.cwd(), "data", "seo-tasks.json");
  if (!fs.existsSync(p)) throw new Error("data/seo-tasks.json が見つかりません");
  const { tasks } = JSON.parse(fs.readFileSync(p, "utf-8")) as SeoTasksFile;
  return tasks.filter((t): t is NewArticleTask => t.type === "new_article" && !!t.targetKeyword);
}

function guessCategory(keyword: string): "hair" | "eyelash" {
  const eyelashKW = ["まつ", "眉", "マツ", "eyelash", "まゆ", "アイ", "ラッシュ"];
  return eyelashKW.some((w) => keyword.includes(w)) ? "eyelash" : "hair";
}

function guessSalon(keyword: string, category: "hair" | "eyelash"): string {
  if (category === "eyelash") return "raffine";
  const fleuramKW = ["香南", "野市", "のいち", "ヘアケア"];
  if (fleuramKW.some((w) => keyword.includes(w))) return "fleurami";
  return "riv";
}

function getExistingTitles(salonName: string, category: "hair" | "eyelash"): string[] {
  try {
    return getAllPosts(category)
      .filter((p) => p.salon === salonName)
      .map((p) => p.title)
      .slice(-30);
  } catch {
    return [];
  }
}

function sanitizeSlug(s: string): string {
  return s.toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function generateKeywordArticle(task: NewArticleTask): Promise<void> {
  const category = task.category ?? guessCategory(task.targetKeyword);
  const key = task.salon ?? guessSalon(task.targetKeyword, category);
  const salonName = SALON_NAME[key] ?? "fleurami";
  const area = AREA_BY_KEY[key] ?? "高知市";
  const existingTitles = getExistingTitles(salonName, category);

  const authorHistory = key === "riv"
    ? "高知市の美容室 Riv. by fleurami のスタイリスト。髪質改善・縮毛矯正を得意とする"
    : undefined;

  const basePrompt = buildBasePrompt({
    category, salonName, area, existingTitles,
    author: key === "riv" ? "細川彩香" : undefined,
    authorHistory,
  });

  const articleInstruction = `
【記事生成指示】
キーワード「${task.targetKeyword}」で情報系ピラー記事を生成してください。

【SEO必須要件】
- タイトル: 「${task.targetKeyword}」を冒頭または冒頭付近に含め、55〜65文字に収める
- H2見出し: 最低2つに「${task.targetKeyword}」またはその派生語・同義語を自然に含める
- 本文: 「${task.targetKeyword}」を5〜8回自然に含める（不自然な連続使用・詰め込みは禁止）
- excerpt: 「${task.targetKeyword}」と地域名を含む120文字以内
- FAQ: 「${task.targetKeyword}」を含む質問を最低2問含める
- 文字数: 2500文字以上の密度ある内容にする

目的:
- 検索順位を上げるための専門解説記事（読者の悩みに深く答える）
- 表示回数: ${task.impressions}回 → CTR を上げてクリックを獲得する
- 生成理由: ${task.reason}

注意:
- 写真はありません（Instagram写真ドリブンではなく、テキスト中心のピラー記事）
- 「施術事例（今回の仕上がり）」セクションは「${salonName}の施術事例・お悩み相談」として、実際にありそうなお悩みと対応例を書く`;

  const prompt = `${basePrompt}\n\n${articleInstruction}\n\n${JSON_INSTRUCTION}`;

  console.log(`  生成中: [${task.targetKeyword}] → ${key}/${category}`);
  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 5000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const match = text.match(/\{[\s\S]+\}/);
  if (!match) throw new Error(`Claude がJSONを返しませんでした (KW: ${task.targetKeyword})`);

  const generated = JSON.parse(match[0]);
  const slug = sanitizeSlug(generated.slug ?? task.targetKeyword);

  // 既存slugと重複チェック
  const outDir = path.join(process.cwd(), "content", category);
  const outPath = path.join(outDir, `${slug}.md`);
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭ スキップ: slug重複 ${slug}`);
    return;
  }

  // デフォルトサムネを探す（既存画像から流用）
  const thumbDir = path.join(process.cwd(), "public", "images", "uploads", key);
  let thumbnail = "";
  if (fs.existsSync(thumbDir)) {
    const imgs = fs.readdirSync(thumbDir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));
    if (imgs.length > 0) {
      thumbnail = `/images/uploads/${key}/${imgs[Math.floor(Math.random() * imgs.length)]}`;
    }
  }

  const fm = {
    title: generated.title,
    slug,
    category,
    salon: salonName,
    date: new Date().toISOString().slice(0, 10),
    updated: "",
    author: key === "riv" ? "細川彩香" : "",
    author_role: key === "riv" ? "スタイリスト" : "",
    excerpt: generated.excerpt,
    thumbnail,
    tags: generated.tags ?? [],
    question: generated.question ?? "",
    answer_summary: generated.answer_summary ?? "",
    instagram_id: "",
    instagram_permalink: "",
    faq: generated.faq ?? [],
    steps: generated.steps ?? [],
    conversation: generated.conversation ?? [],
    draft: false,
    seo_generated: true,
    target_keyword: task.targetKeyword,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, matter.stringify(generated.body ?? "", fm), "utf-8");
  console.log(`  ✅ 生成完了: ${generated.title} → ${outPath}`);
}

async function main() {
  const tasks = loadTasks();
  const newArticles = tasks.slice(0, 2); // 1回最大2件（API・コスト制御）

  if (newArticles.length === 0) {
    console.log("新規記事タスクなし");
    return;
  }

  console.log(`新規記事生成: ${newArticles.length}件`);
  let done = 0;
  let failed = 0;

  for (const task of newArticles) {
    try {
      await generateKeywordArticle(task);
      done++;
    } catch (e) {
      console.error(`  ❌ 失敗: ${task.targetKeyword}`, e);
      failed++;
    }
  }

  console.log(`\n完了: ${done}件成功 / ${failed}件失敗`);
  if (failed > 0 && done === 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
