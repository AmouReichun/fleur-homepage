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

type AnalyticsReport = {
  generatedAt: string;
  period: { startDate: string; endDate: string };
  byPage: { page: string; sessions: number; pageViews: number; bounceRate: number; avgDurationSec: number }[];
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
  byPage: Map<string, ArticleMeta>,
  analytics?: AnalyticsReport
): Promise<SeoTask[]> {
  const gaByPage = new Map((analytics?.byPage ?? []).map((p) => [p.page, p]));

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
    const ga = gaByPage.get(p.page);
    const gaStr = ga
      ? ` | セッション: ${ga.sessions} | 直帰率: ${ga.bounceRate}% | 滞在: ${ga.avgDurationSec}秒`
      : "";
    return `ページ: ${p.page} | 順位: ${p.position} | 表示: ${p.impressions} | CTR: ${(p.ctr * 100).toFixed(1)}%${gaStr} | タイトル: "${meta.title}"`;
  }).join("\n");

  const newLines = newArticleCandidates.map((q) =>
    `KW: "${q.query}" | 順位: ${q.position} | 表示: ${q.impressions} | CTR: ${(q.ctr * 100).toFixed(1)}%`
  ).join("\n");

  const gaNote = analytics
    ? `\n【GA4データあり】直帰率が高い（70%超）＋滞在時間が短い（60秒未満）ページはコンテンツ改善優先度を上げる。セッション数が多いのにCTRが低いページはタイトル改善で効果が出やすい。`
    : "";

  const prompt = `あなたは美容室・アイラッシュサロンのSEOコンサルタントです。
Google Search Console${analytics ? "＋Google Analytics 4" : ""}データを分析し、fleur GROUP（高知県）のブログSEOを改善するタスクを最大${MAX_TASKS}件、優先度順にJSON配列で返してください。${gaNote}

【サロン情報】
- fleurami: 香南市の美容室（白髪ぼかし・髪質改善・大人女性向け）
- riv: 高知市の美容室（髪質改善・縮毛矯正・20〜40代）
- raffine: 高知市のアイラッシュサロン（まつエク・まつ毛パーマ・眉毛WAX）

【リライト候補ページ（順位8〜35位・表示30回以上）】
${rewriteLines || "なし"}

【新規記事候補KW（順位10位以下・表示50回以上・記事なし）】
${newLines || "なし"}

出力は JSON 配列のみ。前後に説明文や記号は一切不要。最初の文字は [ 、最後の文字は ] にすること。
各要素のキー: type (rewrite/new_article), priority (数値), targetKeyword (文字列), slug (rewriteのみ), category (hair/eyelash), salon (fleurami/riv/raffine), currentTitle (rewriteのみ), currentPosition (rewriteのみ数値), impressions (数値), clicks (数値), ctr (小数), reason (100字以内)`;

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  console.log(`Claude レスポンス先頭: ${text.slice(0, 100)}`);
  const parsed = extractJsonArray(text);
  if (!parsed) throw new Error("Claude がJSON配列を返しませんでした:\n" + text.slice(0, 500));

  return parsed.map((t: SeoTask) => {
    if (t.type === "rewrite" && t.slug) {
      const meta = Array.from(byPage.entries()).find(([, v]) => v.slug === t.slug)?.[1];
      return { ...t, filePath: meta?.filePath, category: (meta?.category ?? t.category) as "hair" | "eyelash" };
    }
    return t;
  });
}

// ─── JSON抽出ユーティリティ（コードブロック・説明文を除去してJSONだけ取り出す） ────

function extractJsonArray(text: string): SeoTask[] | null {
  // コードブロック内のJSONを優先
  const codeBlock = text.match(/```(?:json)?\s*(\[[\s\S]+?\])\s*```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1]); } catch { /* fall through */ }
  }
  // 最初の [ から最後の ] まで
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch { /* fall through */ }
  }
  return null;
}

// ─── Claude失敗時のルールベースフォールバック ──────────────────────────────

function buildRuleBasedTasks(scored: (ArticleMeta & { score: number })[]): SeoTask[] {
  const NEW_ARTICLE_KWS = [
    { keyword: "高知市 まつ毛パーマ 頻度", salon: "raffine", category: "eyelash" as const },
    { keyword: "高知市 マツエク デザイン 選び方", salon: "raffine", category: "eyelash" as const },
    { keyword: "高知市 白髪ぼかし 40代", salon: "fleurami", category: "hair" as const },
    { keyword: "高知市 髪質改善 縮毛矯正 違い", salon: "riv", category: "hair" as const },
    { keyword: "高知市 眉毛ワックス 初めて", salon: "raffine", category: "eyelash" as const },
  ];
  const tasks: SeoTask[] = [];
  scored.slice(0, MAX_TASKS - NEW_ARTICLE_KWS.length).forEach((a, i) => {
    tasks.push({
      type: "rewrite",
      priority: i + 1,
      slug: a.slug,
      category: a.category,
      salon: a.salon,
      filePath: a.filePath,
      targetKeyword: a.tags[0] ?? a.title.slice(0, 20),
      currentTitle: a.title,
      impressions: 0,
      clicks: 0,
      reason: `品質スコア${a.score}点: FAQ${a.faqCount}個・本文${a.bodyLength}字・地域名${a.title.includes("高知") ? "あり" : "なし"}`,
    });
  });
  NEW_ARTICLE_KWS.forEach((kw, i) => {
    tasks.push({
      type: "new_article",
      priority: tasks.length + i + 1,
      targetKeyword: kw.keyword,
      category: kw.category,
      salon: kw.salon,
      impressions: 0,
      clicks: 0,
      reason: "高知×美容系で検索ボリュームが見込まれる未カバーKW",
    });
  });
  return tasks.slice(0, MAX_TASKS);
}

// ─── モード2: GSCデータなし → 記事品質スコアリングによるフォールバック ─────

async function analyzeWithQualityScore(all: ArticleMeta[]): Promise<SeoTask[]> {
  // 品質スコアリング（低いほどリライト優先度高）
  const scored = all
    .map((a) => {
      let score = 100;
      if (a.faqCount < 3) score -= 30;
      else if (a.faqCount < 5) score -= 15;
      if (a.bodyLength < 800) score -= 25;
      else if (a.bodyLength < 1200) score -= 10;
      if (!a.updated) score -= 10;
      if (!a.title.includes("高知")) score -= 15;
      if (a.tags.length < 3) score -= 5;
      return { ...a, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 20);

  console.log("品質スコア上位（リライト候補）:");
  scored.slice(0, 5).forEach((a) => console.log(`  ${a.score}点: ${a.title}`));

  const candidateList = scored.map((a) =>
    `slug: ${a.slug} | タイトル: "${a.title}" | カテゴリ: ${a.category} | サロン: ${a.salon} | FAQ数: ${a.faqCount} | 本文長: ${a.bodyLength}字 | 更新日: ${a.updated || "未更新"}`
  ).join("\n");

  const prompt = `あなたは美容室・アイラッシュサロンのSEOコンサルタントです。
以下は fleur GROUP（高知県）のブログ記事のうち、品質スコアが低い記事のリストです。

【サロン情報】
- fleurami: 香南市の美容室（白髪ぼかし・髪質改善・40代女性向け）
- riv: 高知市の美容室（髪質改善・縮毛矯正・20〜40代）
- raffine: 高知市のアイラッシュサロン（まつエク・まつ毛パーマ・眉毛WAX）

【品質スコアが低い記事（リライト候補）】
${candidateList}

【追加して欲しい新規記事のKW例】
・まつ毛パーマ 頻度 高知 / マツエク デザイン 高知 / 白髪ぼかし 40代 高知 / 髪質改善 縮毛矯正 違い 高知市 / 眉毛ワックス 高知市

SEO改善タスクを最大${MAX_TASKS}件、優先度順にJSON配列で返してください。
出力は JSON 配列のみ。前後に説明文や記号は一切不要。最初の文字は [ 、最後の文字は ] にすること。

各要素のキー:
type (rewrite/new_article), priority (数値), targetKeyword (文字列), slug (rewriteのみ), category (hair/eyelash), salon (fleurami/riv/raffine), currentTitle (rewriteのみ), impressions (0), clicks (0), reason (100字以内の文字列)`;

  try {
    const res = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = res.content[0].type === "text" ? res.content[0].text : "";
    console.log(`Claude レスポンス先頭: ${text.slice(0, 100)}`);
    const parsed = extractJsonArray(text);
    if (!parsed) {
      console.warn("⚠️ ClaudeのJSONパース失敗 → ルールベースフォールバックに切り替え");
      return buildRuleBasedTasks(scored);
    }
    return parsed.map((t: SeoTask) => {
      if (t.type === "rewrite" && t.slug) {
        const meta = all.find((a) => a.slug === t.slug);
        return { ...t, filePath: meta?.filePath, category: (meta?.category ?? t.category) as "hair" | "eyelash" };
      }
      return t;
    });
  } catch (e) {
    console.warn("⚠️ Claude呼び出し失敗 → ルールベースフォールバックに切り替え:", e);
    return buildRuleBasedTasks(scored);
  }
}

// ─── main ──────────────────────────────────────────────────────────────────

async function main() {
  const { byPage, all } = buildArticleIndex();
  console.log(`記事数: ${all.length}件（下書き除く）`);

  const reportPath = path.join(process.cwd(), "data", "seo-report.json");
  const analyticsPath = path.join(process.cwd(), "data", "analytics-report.json");
  let tasks: SeoTask[];

  // GA4データがあれば読み込む
  let analytics: AnalyticsReport | undefined;
  if (fs.existsSync(analyticsPath)) {
    analytics = JSON.parse(fs.readFileSync(analyticsPath, "utf-8")) as AnalyticsReport;
    console.log(`GA4データあり（${analytics.byPage.length}ページ）`);
  }

  if (fs.existsSync(reportPath)) {
    const report: SeoReport = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    console.log(`モード: GSC${analytics ? "＋GA4" : ""}データあり（${report.period.startDate} 〜 ${report.period.endDate}）`);
    console.log(`クエリ数: ${report.byQuery.length} / ページ数: ${report.byPage.length}`);
    console.log("Claude で分析中...");
    tasks = await analyzeWithGSC(report, byPage, analytics);
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
