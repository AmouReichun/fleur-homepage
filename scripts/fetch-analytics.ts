/**
 * Google Analytics 4 Data API からページ別のセッション・滞在時間・直帰率を取得して
 * data/analytics-report.json に保存する。
 * WIF認証（Application Default Credentials）を使用。
 * GA4_PROPERTY_ID 環境変数が未設定の場合はスキップ（既存データを保持）。
 */
import * as fs from "fs";
import * as path from "path";
import { google } from "googleapis";

const DAYS = 28;

function getDateRange(): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date(end.getTime() - DAYS * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function main() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    console.log("GA4_PROPERTY_ID 未設定 → スキップ");
    return;
  }

  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  const analyticsdata = google.analyticsdata({ version: "v1beta", auth });
  const dateRange = getDateRange();
  const property = propertyId.startsWith("properties/") ? propertyId : `properties/${propertyId}`;

  console.log(`期間: ${dateRange.startDate} 〜 ${dateRange.endDate}`);
  console.log("GA4 ページ別データ取得中...");

  const res = await analyticsdata.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "BEGINS_WITH", value: "/blog/" },
        },
      },
      limit: 300,
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    },
  });

  const byPage = (res.data.rows ?? []).map((row) => {
    const dims = row.dimensionValues ?? [];
    const metrics = row.metricValues ?? [];
    return {
      page: dims[0]?.value ?? "",
      sessions: Math.round(Number(metrics[0]?.value ?? 0)),
      pageViews: Math.round(Number(metrics[1]?.value ?? 0)),
      bounceRate: Math.round(Number(metrics[2]?.value ?? 0) * 1000) / 10,
      avgDurationSec: Math.round(Number(metrics[3]?.value ?? 0)),
    };
  });

  const report = {
    generatedAt: new Date().toISOString().slice(0, 10),
    period: dateRange,
    byPage,
  };

  const outPath = path.join(process.cwd(), "data", "analytics-report.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf-8");

  console.log(`✅ ${byPage.length} ページのGA4データ → ${outPath}`);

  // 上位10ページをログ表示
  byPage.slice(0, 10).forEach((p) =>
    console.log(`  ${p.page}: ${p.sessions}セッ / 直帰${p.bounceRate}% / ${p.avgDurationSec}秒`)
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
