/**
 * 各サロン N 件、薬機法フラグなしの下書き記事を自動公開するスクリプト
 * GitHub Actions の hourly cron から実行される（ワークフロー側で時刻チェック済み）
 * config/auto-publish.json で enabled / articlesPerSalon を制御
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { isGbpConfigured, postBlogArticleToGbp } from "@/lib/gbp";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CONFIG_PATH = path.join(process.cwd(), "config", "auto-publish.json");

type Config = {
  enabled: boolean;
  publishHourJST: number;
  articlesPerSalon: number;
};

type Draft = {
  filePath: string;
  salon: string;
  date: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  slug: string;
  category: "hair" | "eyelash";
};

function loadConfig(): Config {
  try {
    return {
      enabled: true,
      publishHourJST: 12,
      articlesPerSalon: 1,
      ...JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")),
    };
  } catch {
    return { enabled: true, publishHourJST: 12, articlesPerSalon: 1 };
  }
}

function collectEligibleDrafts(): Draft[] {
  const result: Draft[] = [];

  for (const category of ["hair", "eyelash"] as const) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;

    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      const filePath = path.join(dir, name);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      if (data.draft !== true) continue;
      if (data.yakkihou_flag === true) continue;

      result.push({
        filePath,
        salon: String(data.salon ?? ""),
        date: String(data.date ?? ""),
        title: String(data.title ?? ""),
        excerpt: String(data.excerpt ?? ""),
        thumbnail: String(data.thumbnail ?? ""),
        slug: String(data.slug ?? path.basename(name, ".md")),
        category,
      });
    }
  }

  return result;
}

function publishFile(filePath: string): void {
  const raw = fs.readFileSync(filePath, "utf-8");
  const updated = raw.replace(/^draft: true\r?\n/m, "");
  fs.writeFileSync(filePath, updated, "utf-8");
}

async function main() {
  const cfg = loadConfig();

  if (!cfg.enabled) {
    console.log("自動公開は無効です（config/auto-publish.json）");
    return;
  }

  const drafts = collectEligibleDrafts();

  if (drafts.length === 0) {
    console.log("公開できる下書き記事がありません（薬機法フラグなし）");
    return;
  }

  // サロン別にグループ化
  const bySalon: Record<string, Draft[]> = {};
  for (const d of drafts) {
    if (!bySalon[d.salon]) bySalon[d.salon] = [];
    bySalon[d.salon].push(d);
  }

  const gbpEnabled = isGbpConfigured();
  if (!gbpEnabled) {
    console.log("ℹ️  GBP 環境変数が未設定のため、GBP への自動投稿はスキップします");
  }

  let publishedCount = 0;

  for (const [salon, articles] of Object.entries(bySalon)) {
    // 日付の古い順（FIFO）で articlesPerSalon 件まで公開
    const sorted = [...articles].sort((a, b) =>
      a.date < b.date ? -1 : a.date > b.date ? 1 : 0
    );
    const targets = sorted.slice(0, cfg.articlesPerSalon);

    for (const target of targets) {
      publishFile(target.filePath);
      const slug = path.basename(target.filePath, ".md");
      console.log(`✓ 公開: [${salon}] ${slug} (${target.date})`);
      publishedCount++;

      // GBP への自動投稿
      if (gbpEnabled && target.title && target.excerpt) {
        try {
          const postName = await postBlogArticleToGbp({
            title: target.title,
            excerpt: target.excerpt,
            thumbnail: target.thumbnail || undefined,
            slug: target.slug,
            category: target.category,
            salonName: target.salon,
          });
          if (postName) {
            console.log(`  📍 GBP 投稿済み: ${postName}`);
          } else {
            console.log(`  ℹ️  GBP: 対象ロケーション未設定のためスキップ (salon="${target.salon}")`);
          }
        } catch (e) {
          // GBP 失敗は公開を止めない
          console.error(`  ⚠️  GBP 投稿失敗 (${salon}): ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
  }

  console.log(`\n合計 ${publishedCount} 件を公開しました`);
  console.log(`残り下書き（薬機法除く）: ${drafts.length - publishedCount} 件`);
}

main().catch((e) => {
  console.error("エラー:", e);
  process.exit(1);
});
