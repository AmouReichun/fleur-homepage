/**
 * Google Search Console API からクエリ別・ページ別データを取得して data/seo-report.json に保存する。
 * Service Account JSON を環境変数 GSC_SERVICE_ACCOUNT_JSON (JSON文字列) として渡す。
 * 対象サイト URL は GSC_SITE_URL 環境変数（例: sc-domain:fleur-group.jp または https://fleur-group.jp/）
 */
import * as fs from "fs";
import * as path from "path";
import { google } from "googleapis";

const DAYS = 28; // 取得期間（日）
const ROW_LIMIT = 500;

function getDateRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end.getTime() - DAYS * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function buildClient() {
  // Workload Identity Federation 使用時は google-github-actions/auth が
  // Application Default Credentials (ADC) を自動セットするため credentials 不要
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return google.searchconsole({ version: "v1", auth });
}

type Row = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function fetchRows(
  client: ReturnType<typeof google.searchconsole>,
  siteUrl: string,
  dimension: "query" | "page",
  dateRange: { startDate: string; endDate: string }
): Promise<Row[]> {
  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      dimensions: [dimension],
      rowLimit: ROW_LIMIT,
      startRow: 0,
    },
  });
  return (res.data.rows ?? []).map((r) => ({
    keys: r.keys ?? [],
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
}

async function main() {
  const siteUrl = process.env.GSC_SITE_URL;
  if (!siteUrl) throw new Error("GSC_SITE_URL が未設定です");

  const client = await buildClient();
  const dateRange = getDateRange();

  console.log(`期間: ${dateRange.startDate} 〜 ${dateRange.endDate}`);
  console.log("クエリ別データ取得中...");
  const queryRows = await fetchRows(client, siteUrl, "query", dateRange);

  console.log("ページ別データ取得中...");
  const pageRows = await fetchRows(client, siteUrl, "page", dateRange);

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    period: dateRange,
    byQuery: queryRows.map((r) => ({
      query: r.keys[0],
      clicks: Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      ctr: Math.round(r.ctr * 10000) / 10000,
      position: Math.round(r.position * 10) / 10,
    })),
    byPage: pageRows.map((r) => ({
      page: r.keys[0].replace(/^https?:\/\/[^/]+/, ""),
      clicks: Math.round(r.clicks),
      impressions: Math.round(r.impressions),
      ctr: Math.round(r.ctr * 10000) / 10000,
      position: Math.round(r.position * 10) / 10,
    })),
  };

  const outPath = path.join(process.cwd(), "data", "seo-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");

  console.log(`✅ クエリ: ${report.byQuery.length}件 / ページ: ${report.byPage.length}件 → ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
