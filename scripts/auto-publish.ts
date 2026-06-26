/**
 * 各サロン N 件、薬機法フラグなしの下書き記事を自動公開するスクリプト
 * GitHub Actions の hourly cron から実行される（ワークフロー側で時刻チェック済み）
 * config/auto-publish.json で enabled / articlesPerSalon を制御
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

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

  for (const category of ["hair", "eyelash"]) {
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

function main() {
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
    }
  }

  console.log(`\n合計 ${publishedCount} 件を公開しました`);
  console.log(`残り下書き（薬機法除く）: ${drafts.length - publishedCount} 件`);
}

main();
