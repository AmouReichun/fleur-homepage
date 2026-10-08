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


/**
 * 1ページ目（10位以内）に出ているのにクリックされない記事は、本文を書き換えると順位が揺れるため
 * 「検索結果に出る部分」＝ seoTitle（短いタイトル）と excerpt（説明文）だけを直す。
 */
async function rewriteTitleOnly(task: RewriteTask, filePath: string): Promise<void> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: fm, content: body } = matter(raw);
  const prompt = `あなたは高知県の美容室・まつげサロンの検索結果改善の担当です。
次のブログ記事は検索で${task.currentPosition ?? "?"}位・表示${task.impressions}回なのにクリックが少ないです。
検索結果に表示される「タイトル」と「説明文」だけを、クリックしたくなる形に書き直してください。本文は変えません。

狙うキーワード: ${task.targetKeyword}
今のタイトル: ${fm.title ?? ""}
今の説明文: ${fm.excerpt ?? ""}
本文の冒頭: ${body.slice(0, 800)}

ルール:
- seoTitle: 28〜32文字。狙うキーワードの地域名とメニュー名を前半に入れる。数字・具体的な結果・対象（例：40代、くせ毛）で中身が一目で分かるように。誇大表現（No.1、絶対、必ず）は使わない。店名は入れない（自動で付く）
- excerpt: 80〜110文字。誰の・どんな悩みに・何が分かるかを書く。最後に店名と地域を入れる
- 本文に書いていないこと（料金・時間など）は書かない

次のJSONだけを返してください: {"seoTitle": "...", "excerpt": "..."}`;
  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });
  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const match = text.match(/\{[\s\S]+\}/);
  if (!match) throw new Error(`Claude がJSONを返しませんでした (slug: ${task.slug})`);
  const g = JSON.parse(match[0]) as { seoTitle?: string; excerpt?: string };
  if (!g.seoTitle || g.seoTitle.length > 40) throw new Error(`seoTitle が不正: ${g.seoTitle}`);
  const newFm = { ...fm, seoTitle: g.seoTitle, excerpt: g.excerpt || fm.excerpt, updated: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(filePath, matter.stringify(body, newFm), "utf-8");
  console.log(`  ✅ タイトル・説明文だけ改善: ${g.seoTitle}`);
}

async function main() {
  const tasks = loadTasks();
  // 10位以内（1ページ目）でクリックが少ない記事 → タイトル・説明文だけ直す（最大5件）
  // それ以外 → 本文ごとリライト（最大2件）
  const titleOnly = tasks.filter((t) => (t.currentPosition ?? 99) <= 10).slice(0, 5);
  const full = tasks.filter((t) => (t.currentPosition ?? 99) > 10).slice(0, 2);
  const rewrites = [...titleOnly, ...full];

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
      if ((task.currentPosition ?? 99) <= 10) await rewriteTitleOnly(task, filePath);
      else await rewriteArticle(task, filePath);
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
