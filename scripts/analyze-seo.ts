/**
 * SEO分析スクリプト
 *
 * 動作モード:
 *   通常: data/seo-report.json が存在する場合 → GSCデータをClaudeで分析してタスク生成
 *   フォールバック: seo-report.json がない場合 → 全記事を品質スコアリングしてタスク生成
 *
 * 出力: data/seo-tasks.json
 *   type: "rewrite"     → 既存記事のSEO改善
 *   type: "new_article" → キーワードドリブン新規記事
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MAX_TASKS = 10;
const CONTENT_DIR = path.join(process.cwd(), "content");

type SeoReport = {
  generatedAt: string;
  period: { startDate: string; endDate: string };
  byQuery: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  byPage: { page: string; clicks: number; impressions: number; ctr: number; position: number }[];
};

type SeoTask = {
  type: "rewrite" | "new_article";
  priority: number;
  slug?: string;
  category?: "hair" | "eyelash";
  salon?: string;
  filePath?: string;
  targetKeyword: string;
  currentTitle?: string;
  currentPosition?: number;
  impressions: number;
  clicks: number;
  ctr?: number;
  reason: string;
};

type ArticleMeta = {
  slug: string;
  category: "hair" | "eyelash";
  salon: string;
  title: string;
  filePath: string;
  date: string;
  updated: string;
  faqCount: number;
  bodyLength: number;
  tags: string[];
};

// ─── 全記事インデックス構築 ────────────────────────────────────────────────

function buildArticleIndex(): { byPage: Map<string, ArticleMeta>; all: ArticleMeta[] } {
  const byPage = new Map<string, ArticleMeta>();
  const all: ArticleMeta[] = [];

  for (const cat of ["hair", "eyelash"] as const) {
    const dir = path.join(CONTENT_DIR, cat);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      if (!data.slug || data.draft) continue;

      const meta: ArticleMeta = {
        slug: data.slug,
        category: cat,
        salon: data.salon ?? "",
        title: data.title ?? "",
        filePath,
        date: data.date ?? "",
        updated: data.updated ?? "",
        faqCount: Array.isArray(data.faq) ? data.faq.length : 0,
        bodyLength: content.replace(/\s+/g, "").length,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
      byPage.set(`/blog/${cat}/${data.slug}`, meta);
      all.push(meta);
    }
  }
  return { byPage, all };
}

// ─── モード1: GSCデータあり → Claude分析 ──────────────────────────────────

async function analyzeWithGSC(
  report: SeoReport,
  byPage: Map<string, ArticleMeta>
): Promise<SeoTask[]> {
  const rewriteCandidates = report.byPage
    .filter((p) => p.position >= 8 && p.position <= 35 && p.impressions >= 30 && byPage.has(p.page))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  const newArticleCandidates = report.byQuery
    .filter((q) => q.position >= 10 && q.impressions >= 50)
    .filter((q) => !Array.from(byPage.keys()).some((page) => page.includes(q.query.replace(/\s+/g, "-"))))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  const rewriteLines = rewriteCandidates.map((p) => {
    const meta = byPage.get(p.page)!;
    return `ページ: ${p.page} | 順位: ${p.position} | 表示: ${p.impressions} | CTR: ${(p.ctr * 100).toFixed(1)}% | タイトル: "${meta.title}"`;
  }).join("\n");

  const newLines = newArticleCandidates.map((q) =>
    `KW: "${q.query}" | 順位: ${q.position} | 表示: ${q.impressions} | CTR: ${(q.ctr * 100).toFixed(1)}%`
  ).join("\n");

  const prompt = `あなたは美容室・アイラッシュサロンのSEOコンサルタントです。
Google Search Console データを分析し、fleur GROUP（高知県）のブログSEOを改善するタスクを最大${MAX_TASKS}件、優先度順にJSON配列で出力してください。

【サロン情報】
- fleurami: 香南市の美容室（白髪ぼかし・髪質改善・大人女性向け）
- riv: 高知市の美容室（髪質改善・縮毛矯正・20〜40代）
- raffine: 高知市のアイラッシュサロン（まつエク・まつ毛パーマ・眉毛WAX）

【リライト候補ページ（順位8〜35位・表示30回以上）】
${rewriteLines || "なし"}

【新規記事候補KW（順位10位以下・表示50回以上・記事なし）】
${newLines || "なし"}

【出力形式】JSON配列のみ（説明文なし）。各要素:
{
  "type": "rewrite" または "new_article",
  "priority": 1〜${MAX_TASKS},
  "targetKeyword": "主要KW",
  "slug": "(rewriteのみ: 既存記事slug)",
  "category": "(rewriteのみ: hair または eyelash)",
  "salon": "fleurami/riv/raffine のいずれか",
  "currentTitle": "(rewriteのみ: 現在のタイトル)",
  "currentPosition": (rewriteのみ: 現在の順位),
  "impressions": 表示回数,
  "clicks": クリック数,
  "ctr": CTR(小数),
  "reason": "改善理由（100字以内）"
}`;

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const match = text.match(/\[[\s\S]+\]/);
  if (!match) throw new Error("Claude がJSON配列を返しませんでした:\n" + text.slice(0, 500));

  const tasks: SeoTask[] = JSON.parse(match[0]);
  return tasks.map((t) => {
    if (t.type === "rewrite" && t.slug) {
      const meta = Array.from(byPage.entries()).find(([, v]) => v.slug === t.slug)?.[1];
      return { ...t, filePath: meta?.filePath, category: (meta?.category ?? t.category) as "hair" | "eyelash" };
    }
    return t;
  });
}

// ─── モード2: GSCデータなし → 記事品質スコアリングによるフォールバック ─────

async function analyzeWithQualityScore(all: ArticleMeta[]): Promise<SeoTask[]> {
  // 品質スコアリング（低いほどリライト優先度高）
  const scored = all
    .filter((a) => !a.slug.startsWith("kochi-matsuge-pama-mochi")) // ピラー記事は除外
    .map((a) => {
      let score = 100;
      if (a.faqCount < 3) score -= 30;
      else if (a.faqCount < 5) score -= 15;
      if (a.bodyLength < 800) score -= 25;
      else if (a.bodyLength < 1200) score -= 10;
      if (!a.updated) score -= 10; // 一度も更新されていない
      if (!a.title.includes("高知")) score -= 15; // 地域名なし
      if (a.tags.length < 3) score -= 5;
      return { ...a, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 20);

  console.log("品質スコア上位（リライト候補）:");
  scored.slice(0, 5).forEach((a) => console.log(`  ${a.score}点: ${a.title}`));

  // Claudeに改善方針を決めてもらう
  const candidateList = scored.map((a) =>
    `slug: ${a.slug} | タイトル: "${a.title}" | カテゴリ: ${a.category} | サロン: ${a.salon} | FAQ数: ${a.faqCount} | 本文長: ${a.bodyLength}字 | 更新日: ${a.updated || "未更新"}`
  ).join("\n");

  const prompt = `あなたは美容室・アイラッシュサロンのSEOコンサルタントです。
以下は fleur GROUP（高知県）のブログ記事のうち、品質スコアが低い記事のリストです。
SEO改善のため、リライト優先タスクと新規記事候補タスクを合わせて最大${MAX_TASKS}件、優先度順にJSON配列で出力してください。

【サロン情報】
- fleurami: 香南市の美容室（白髪ぼかし・髪質改善・40代女性向け）
- riv: 高知市の美容室（髪質改善・縮毛矯正・20〜40代）
- raffine: 高知市のアイラッシュサロン（まつエク・まつ毛パーマ・眉毛WAX）

【品質スコアが低い記事（リライト候補）】
${candidateList}

【追加して欲しい新規記事のKW例（高知でまだ記事数が少ないとおもわれるもの）】
・まつ毛パーマ 頻度 高知 / マツエク デザイン 高知 / 白髪ぼかし 40代 高知 / 髪質改善 縮毛矯正 違い 高知市 / 眉毛ワックス 高知市 / ヘアカラー メンテナンス 高知

【出力形式】JSON配列のみ（説明文なし）。各要素:
{
  "type": "rewrite" または "new_article",
  "priority": 1〜${MAX_TASKS},
  "targetKeyword": "主要KW",
  "slug": "(rewriteのみ: 既存記事slug)",
  "category": "hair または eyelash",
  "salon": "fleurami/riv/raffine のいずれか",
  "currentTitle": "(rewriteのみ: 現在のタイトル)",
  "impressions": 0,
  "clicks": 0,
  "reason": "改善理由（100字以内）"
}`;

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  const match = text.match(/\[[\s\S]+\]/);
  if (!match) throw new Error("Claude がJSON配列を返しませんでした:\n" + text.slice(0, 500));

  const tasks: SeoTask[] = JSON.parse(match[0]);
  return tasks.map((t) => {
    if (t.type === "rewrite" && t.slug) {
      const meta = all.find((a) => a.slug === t.slug);
      return { ...t, filePath: meta?.filePath, category: (meta?.category ?? t.category) as "hair" | "eyelash" };
    }
    return t;
  });
}

// ─── main ──────────────────────────────────────────────────────────────────

async function main() {
  const { byPage, all } = buildArticleIndex();
  console.log(`記事数: ${all.length}件（下書き除く）`);

  const reportPath = path.join(process.cwd(), "data", "seo-report.json");
  let tasks: SeoTask[];

  if (fs.existsSync(reportPath)) {
    const report: SeoReport = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    console.log(`モード: GSCデータあり（${report.period.startDate} 〜 ${report.period.endDate}）`);
    console.log(`クエリ数: ${report.byQuery.length} / ページ数: ${report.byPage.length}`);
    console.log("Claude でGSC分析中...");
    tasks = await analyzeWithGSC(report, byPage);
  } else {
    console.log("モード: フォールバック（GSCレポートなし → 記事品質スコアリング）");
    console.log("Claude で品質分析中...");
    tasks = await analyzeWithQualityScore(all);
  }

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    mode: fs.existsSync(reportPath) ? "gsc" : "quality-fallback",
    tasks,
  };

  const outPath = path.join(process.cwd(), "data", "seo-tasks.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");

  console.log(`\n✅ ${tasks.length}件のタスクを生成 → ${outPath}`);
  for (const t of tasks) {
    const label = t.type === "rewrite" ? `📝 リライト [${t.slug}]` : `✨ 新規記事 [${t.targetKeyword}]`;
    console.log(`  ${t.priority}. ${label}: ${t.reason}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
