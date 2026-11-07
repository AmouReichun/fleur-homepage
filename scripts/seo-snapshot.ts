/**
 * 手動で実行する「SEO/AIOの現状スナップショット」。
 * Search Console（90日・クエリ×ページ、週別）と GA4（流入元別・AI経由の流入・入口ページ）を取り、
 * snapshot/ に JSON で書き出す（GitHub Actions の artifact として受け取る。リポジトリには保存しない）。
 */
import * as fs from "fs";
import { google } from "googleapis";

const out = "snapshot";
fs.mkdirSync(out, { recursive: true });
const day = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

const auth = new google.auth.GoogleAuth({
  scopes: [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ],
});

async function gsc() {
  const site = process.env.GSC_SITE_URL!;
  const sc = google.searchconsole({ version: "v1", auth });
  const q = async (dimensions: string[], startDate: string, endDate: string, rowLimit = 5000) =>
    (await sc.searchanalytics.query({ siteUrl: site, requestBody: { startDate, endDate, dimensions, rowLimit } })).data.rows ?? [];
  const res: Record<string, unknown> = {
    period: { start: day(93), end: day(3) },
    queryPage: await q(["query", "page"], day(93), day(3)),
    byPage: await q(["page"], day(93), day(3), 1000),
    byQuery: await q(["query"], day(93), day(3), 2000),
    byWeek: await q(["date"], day(180), day(3), 500),
    recent28Query: await q(["query"], day(31), day(3), 1000),
    prev28Query: await q(["query"], day(59), day(31), 1000),
  };
  fs.writeFileSync(`${out}/gsc.json`, JSON.stringify(res));
  console.log("GSC ok", (res.queryPage as unknown[]).length);
}

async function ga() {
  const id = process.env.GA4_PROPERTY_ID!;
  const property = id.startsWith("properties/") ? id : `properties/${id}`;
  const an = google.analyticsdata({ version: "v1beta", auth });
  const run = async (dimensions: string[], metrics: string[], startDate = day(90), extra: object = {}) =>
    (await an.properties.runReport({
      property,
      requestBody: { dateRanges: [{ startDate, endDate: "yesterday" }], dimensions: dimensions.map((name) => ({ name })), metrics: metrics.map((name) => ({ name })), limit: 2000, ...extra },
    })).data;
  const res = {
    bySource: await run(["sessionSource", "sessionMedium"], ["sessions", "engagedSessions", "keyEvents"]),
    bySourceMonth: await run(["yearMonth", "sessionSource"], ["sessions"], day(180)),
    landingBySource: await run(["sessionSource", "landingPage"], ["sessions", "engagedSessions", "keyEvents"]),
    events: await run(["eventName"], ["eventCount"]),
    outbound: await run(["eventName", "linkUrl"], ["eventCount"], day(90), {
      dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "click" } } },
    }).catch((e: Error) => ({ error: e.message })),
  };
  fs.writeFileSync(`${out}/ga4.json`, JSON.stringify(res));
  console.log("GA4 ok");
}

await gsc().catch((e) => console.error("GSC error", e.message));
await ga().catch((e) => console.error("GA4 error", e.message));
