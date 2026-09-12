/**
 * Google Search Console で /guide のインデックス登録をリクエストするスクリプト
 * ユーザーの実際のChromeプロファイル（ログイン済み）を使用
 */
import { chromium } from "playwright";
import path from "path";
import os from "os";

const URLS_TO_REQUEST = [
  "https://fleur-group.jp/guide",
  "https://fleur-group.jp/salon/riv",
];

// 実際のChromeプロファイルを使用
const CHROME_PROFILE = path.join(
  os.homedir(),
  "Library/Application Support/Google/Chrome"
);

async function requestIndexing(page, url) {
  console.log(`\n▶ URL検査: ${url}`);

  const resourceId = "sc-domain%3Afleur-group.jp";
  const inspectUrl = `https://search.google.com/search-console/inspect?resource_id=${resourceId}&id=${encodeURIComponent(url)}`;

  await page.goto(inspectUrl, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(4000);

  const slug = url.replace(/https?:\/\/[^/]+/, "").replace(/\//g, "_") || "_root";
  await page.screenshot({ path: `/tmp/gsc${slug}_1.png`, fullPage: false });
  console.log(`  📸 /tmp/gsc${slug}_1.png`);

  const currentUrl = page.url();
  const title = await page.title();
  console.log(`  URL: ${currentUrl}`);
  console.log(`  タイトル: ${title}`);

  if (currentUrl.includes("accounts.google.com")) {
    console.log("  ❌ Googleログインページにリダイレクトされました");
    return false;
  }

  // ページ内テキストを確認
  const bodyText = await page.locator("body").innerText().catch(() => "");
  const relevant = bodyText.replace(/\s+/g, " ").slice(0, 500);
  console.log(`  ページ: ${relevant}`);

  // 「インデックス登録をリクエスト」ボタンを探す（複数パターン）
  const selectors = [
    "button:has-text('インデックス登録をリクエスト')",
    "button:has-text('Request Indexing')",
    "[aria-label*='インデックス登録']",
    "[aria-label*='Request Indexing']",
  ];

  let clicked = false;
  for (const sel of selectors) {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 5000 }).catch(() => false)) {
      await el.scrollIntoViewIfNeeded();
      await el.click();
      clicked = true;
      console.log(`  ✅ ボタンをクリック: ${sel}`);
      await page.waitForTimeout(5000);
      await page.screenshot({ path: `/tmp/gsc${slug}_2.png` });
      console.log(`  📸 クリック後: /tmp/gsc${slug}_2.png`);
      break;
    }
  }

  if (!clicked) {
    // 「URLがGoogleに登録されています」テキストを確認（既にインデックス済み）
    const isIndexed = await page.locator("text=URLはGoogleに登録されています").isVisible({ timeout: 3000 }).catch(() => false)
      || await page.locator("text=URL is on Google").isVisible({ timeout: 3000 }).catch(() => false);
    if (isIndexed) {
      console.log("  ✅ 既にGoogleにインデックス済みです");
    } else {
      console.log("  ⚠ ボタンが見つかりませんでした（ページを確認してください）");
    }
  }

  return true;
}

async function main() {
  console.log("🚀 Chromeプロファイルでブラウザを起動中...");
  console.log(`   プロファイル: ${CHROME_PROFILE}`);

  const context = await chromium.launchPersistentContext(CHROME_PROFILE, {
    channel: "chrome",
    headless: false,
    args: [
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-blink-features=AutomationControlled",
    ],
    ignoreDefaultArgs: ["--enable-automation"],
    viewport: { width: 1280, height: 900 },
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",
  });

  const page = await context.newPage();

  // Search Console トップでログイン確認
  console.log("Search Console を確認中...");
  await page.goto("https://search.google.com/search-console/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "/tmp/gsc_top.png" });

  const topUrl = page.url();
  const topTitle = await page.title();
  console.log(`トップ URL: ${topUrl}`);
  console.log(`トップ タイトル: ${topTitle}`);

  if (topUrl.includes("accounts.google.com")) {
    console.log("\n❌ ログインが必要です。ブラウザが開いているので手動でログインしてください。");
    await page.waitForTimeout(60000);
    await context.close();
    return;
  }

  // URL検査 → インデックス申請
  let allOk = true;
  for (const url of URLS_TO_REQUEST) {
    const ok = await requestIndexing(page, url);
    if (!ok) { allOk = false; break; }
    await page.waitForTimeout(3000);
  }

  if (allOk) {
    console.log("\n✅ 全URL処理完了");
  }

  console.log("\n5秒後にブラウザを閉じます...");
  await page.waitForTimeout(5000);
  await context.close();
}

main().catch((e) => {
  console.error("エラー:", e.message);
  process.exit(1);
});
