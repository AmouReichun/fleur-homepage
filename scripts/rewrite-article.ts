/**
 * data/seo-tasks.json の type="rewrite" タスクを実行する。
 * 既存記事を SEO強化版にリライトして上書き保存する（slug/date/thumbnail は維持）。
 * GitHub Actions から実行される（週次 seo-weekly.yml）。
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { buildBasePrompt, JSON_INSTRUCTION, AREA_BY_KEY } from "../lib/blog/article-prompt";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SALON_NAME: Record<string, string> = {
  fleurami: "fleurami",
  riv: "Riv. by fleurami",
  raffine: "Raffine",
};

type RewriteTask = {
  type: "rewrite";
  priority: number;
  slug: string;
  category: "hair" | "eyelash";
  salon: string;
  filePath?: string;
  targetKeyword: string;
  currentTitle?: string;
  currentPosition?: number;
  impressions: number;
  reason: string;
};

type SeoTasksFile = {
  generatedAt: string;
  tasks: Array<{ type: string } & Partial<RewriteTask>>;
};

function loadTasks(): RewriteTask[] {
  const p = path.join(process.cwd(), "data", "seo-tasks.json");
  if (!fs.existsSync(p)) throw new Error("data/seo-tasks.json が見つかりません。先に analyze-seo を実行してください");
  const { tasks } = JSON.parse(fs.readFileSync(p, "utf-8")) as SeoTasksFile;
  return tasks.filter((t): t is RewriteTask => t.type === "rewrite" && !!t.slug);
}

function resolveFilePath(task: RewriteTask): string | null {
  if (task.filePath && fs.existsSync(task.filePath)) return task.filePath;
  for (const cat of ["hair", "eyelash"]) {
    const p = path.join(process.cwd(), "content", cat, `${task.slug}.md`);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function salonKey(salon: string): string {
  const map: Record<string, string> = {
    fleurami: "fleurami", "Riv. by fleurami": "riv", riv: "riv",
    raffine: "raffine", Raffine: "raffine",
  };
  return map[salon] ?? "fleurami";
}

async function rewriteArticle(task: RewriteTask, filePath: string): Promise<void> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: fm, content: existingBody } = matter(raw);

  const key = salonKey(task.salon ?? fm.salon ?? "fleurami");
  const salonName = SALON_NAME[key] ?? "fleurami";
  const area = AREA_BY_KEY[key] ?? "高知市";
  const category: "hair" | "eyelash" = task.category ?? (filePath.includes("/eyelash/") ? "eyelash" : "hair");

  const basePrompt = buildBasePrompt({ category, salonName, area });

  const rewriteInstruction = `
【リライト指示】
あなたは既存のブログ記事を SEO強化版にリライトします。

改善の目的:
- 狙いキーワード: 「${task.targetKeyword}」
- 現在の検索順位: ${task.currentPosition ?? "不明"}位（表示回数: ${task.impressions}回）
- 改善理由: ${task.reason}

リライト方針:
1. タイトルをターゲットKWを含む検索意図直撃型に改善する
2. excerpt を読みたくなる120字以内に改善する
3. 本文の見出し構成を指定通りに整え、情報密度を上げる
4. FAQを最低5問、検索意図に合わせて追加・改善する
5. answer_summary（結論先出し）を最初に読んで納得できる内容にする
6. slug・date・thumbnail・instagram_id・instagram_permalink は変えない

【既存記事の内容（参考にしつつ大幅改善する）】
タイトル: ${fm.title ?? ""}
excerpt: ${fm.excerpt ?? ""}

既存本文（参考）:
${existingBody.slice(0, 2000)}`;

  const prompt = `${basePrompt}\n\n${rewriteInstruction}\n\n${JSON_INSTRUCTION}`;

  console.log(`  リライト中: ${task.slug} (${key}/${category})`);
  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 5000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const match = text.match(/\{[\s\S]+\}/);
  if (!match) throw new Error(`Claude がJSONを返しませんでした (slug: ${task.slug})`);

  const generated = JSON.parse(match[0]);

  const newFm = {
    ...fm,
    title: generated.title,
    excerpt: generated.excerpt,
    tags: generated.tags ?? fm.tags,
    question: generated.question ?? fm.question,
    answer_summary: generated.answer_summary ?? fm.answer_summary,
    faq: generated.faq ?? fm.faq,
    steps: generated.steps ?? fm.steps ?? [],
    conversation: generated.conversation ?? fm.conversation ?? [],
    updated: new Date().toISOString().slice(0, 10),
  };

  const newContent = matter.stringify(generated.body ?? existingBody, newFm);
  fs.writeFileSync(filePath, newContent, "utf-8");
  console.log(`  ✅ リライト完了: ${newFm.title}`);
}

async function main() {
  const tasks = loadTasks();
  const rewrites = tasks.slice(0, 3); // 1回最大3件リライト（API負荷・push競合を抑制）

  if (rewrites.length === 0) {
    console.log("リライトタスクなし");
    return;
  }

  console.log(`リライト実行: ${rewrites.length}件`);
  let done = 0;
  let failed = 0;

  for (const task of rewrites) {
    const filePath = resolveFilePath(task);
    if (!filePath) {
      console.warn(`  ⚠️ ファイルが見つかりません: ${task.slug}`);
      failed++;
      continue;
    }
    try {
      await rewriteArticle(task, filePath);
      done++;
    } catch (e) {
      console.error(`  ❌ 失敗: ${task.slug}`, e);
      failed++;
    }
  }

  console.log(`\n完了: ${done}件成功 / ${failed}件失敗`);
  if (failed > 0 && done === 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
