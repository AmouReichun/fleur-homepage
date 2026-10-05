/**
 * IndexNow 手動送信スクリプト
 *
 * 使い方:
 *   npx tsx scripts/indexnow-submit.ts --all
 *       本番 sitemap.xml の全URLを送信（初回シード／全体再通知に使用）
 *   npx tsx scripts/indexnow-submit.ts --changed
 *       直前のコミットで変更された content/ ファイルのURLのみ送信（seo-weekly.yml 向け）
 *   npx tsx scripts/indexnow-submit.ts <url> [url ...]
 *       指定URLのみ送信（例: https://fleur-group.jp/salon/raffine）
 *
 * ※ auto-publish.ts は公開時に自動でIndexNow送信するため、通常運用ではこのスクリプトは不要。
 */
import * as cp from "child_process";
import { submitToIndexNow, SITE_BASE } from "@/lib/indexnow";

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap取得失敗: ${res.status}`);
  const xml = await res.text();
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
}

function getChangedUrls(): string[] {
  try {
    const out = cp.execSync("git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD", {
      encoding: "utf-8",
    });
    const urls: string[] = [];
    for (const line of out.split("\n")) {
      const m = line.match(/^content\/(hair|eyelash)\/(.+)\.md$/);
      if (m) urls.push(`${SITE_BASE}/blog/${m[1]}/${m[2]}`);
    }
    return urls;
  } catch {
    return [];
  }
}

async function main() {
  const args = process.argv.slice(2);

  let urls: string[];
  if (args.length === 0 || args[0] === "--all") {
    urls = await fetchSitemapUrls();
    console.log(`sitemapから ${urls.length} 件のURLを取得`);
  } else if (args[0] === "--changed") {
    urls = getChangedUrls();
    if (urls.length === 0) {
      console.log("変更されたブログ記事なし、スキップ");
      return;
    }
    console.log(`変更記事 ${urls.length} 件を送信`);
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
