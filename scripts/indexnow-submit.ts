/**
 * IndexNow 手動送信スクリプト
 *
 * 使い方:
 *   npx tsx scripts/indexnow-submit.ts --all
 *       本番 sitemap.xml の全URLを送信（初回シード／全体再通知に使用）
 *   npx tsx scripts/indexnow-submit.ts <url> [url ...]
 *       指定URLのみ送信（例: https://fleur-group.jp/salon/raffine）
 *
 * ※ auto-publish.ts は公開時に自動でIndexNow送信するため、通常運用ではこのスクリプトは不要。
 */
import { submitToIndexNow, SITE_BASE } from "@/lib/indexnow";

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap取得失敗: ${res.status}`);
  const xml = await res.text();
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
}

async function main() {
  const args = process.argv.slice(2);

  let urls: string[];
  if (args.length === 0 || args[0] === "--all") {
    urls = await fetchSitemapUrls();
    console.log(`sitemapから ${urls.length} 件のURLを取得`);
  } else {
    urls = args;
  }

  const ok = await submitToIndexNow(urls);
  if (!ok) process.exit(1);
}

main().catch((e) => {
  console.error("エラー:", e);
  process.exit(1);
});
