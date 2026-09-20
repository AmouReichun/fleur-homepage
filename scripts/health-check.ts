/**
 * サイト構造の定期ヘルスチェック。
 * 問題があれば標準エラーに出力して exit 1 → GitHub Actions が失敗通知を送る。
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const CONTENT_DIR = path.join(process.cwd(), "content");
const VALID_SALONS = new Set(["fleurami", "Riv. by fleurami", "Raffine"]);
const SALON_PAT = /^salon:\s*["']?([^"'\n]+)["']?\s*$/m;
const IG_ID_PAT = /^instagram_id:\s*"([^"]+)"/m;
const SLUG_PAT = /^slug:\s*"([^"]+)"/m;
const THUMBNAIL_PAT = /^thumbnail:\s*"([^"]+)"/m;

type Issue = { level: "ERROR" | "WARN"; msg: string };

function collectArticles() {
  const articles: { file: string; raw: string }[] = [];
  for (const cat of ["hair", "eyelash"] as const) {
    const dir = path.join(CONTENT_DIR, cat);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      articles.push({ file: `content/${cat}/${f}`, raw: fs.readFileSync(path.join(dir, f), "utf-8") });
    }
  }
  return articles;
}

function run(): Issue[] {
  const issues: Issue[] = [];
  const articles = collectArticles();

  const igIdCount = new Map<string, number>();
  const slugCount = new Map<string, number>();

  for (const { file, raw } of articles) {
    const isDraft = raw.includes("draft: true");

    // salon名チェック
    const salonM = SALON_PAT.exec(raw);
    const salon = salonM ? salonM[1].trim() : "";
    if (!VALID_SALONS.has(salon)) {
      issues.push({ level: "ERROR", msg: `salon名異常 "${salon}": ${file}` });
    }

    // 薬機法フラグ付き公開記事
    if (!isDraft && raw.includes("yakkihou_flag: true")) {
      issues.push({ level: "ERROR", msg: `薬機法フラグ付き公開記事: ${file}` });
    }

    // Instagram ID重複カウント
    const igM = IG_ID_PAT.exec(raw);
    if (igM && igM[1]) {
      igIdCount.set(igM[1], (igIdCount.get(igM[1]) ?? 0) + 1);
    }

    // slug重複カウント
    const slugM = SLUG_PAT.exec(raw);
    if (slugM) {
      slugCount.set(slugM[1], (slugCount.get(slugM[1]) ?? 0) + 1);
    }

    // instagram画像ファイル欠損
    const thumbM = THUMBNAIL_PAT.exec(raw);
    if (thumbM && thumbM[1].startsWith("/images/instagram/")) {
      const imgPath = path.join(process.cwd(), "public", thumbM[1]);
      if (!fs.existsSync(imgPath)) {
        issues.push({ level: "WARN", msg: `画像ファイル欠損 ${thumbM[1]}: ${file}` });
      }
    }
  }

  // Instagram ID重複
  for (const [id, count] of igIdCount) {
    if (count > 1) {
      issues.push({ level: "ERROR", msg: `Instagram ID重複 (${count}件): ${id}` });
    }
  }

  // slug重複
  for (const [slug, count] of slugCount) {
    if (count > 1) {
      issues.push({ level: "ERROR", msg: `slug重複 (${count}件): ${slug}` });
    }
  }

  // config ↔ cron 時刻整合性チェック
  try {
    const dgConfig = JSON.parse(fs.readFileSync("config/daily-generate.json", "utf-8"));
    const apConfig = JSON.parse(fs.readFileSync("config/auto-publish.json", "utf-8"));
    const dgWf = fs.readFileSync(".github/workflows/daily-generate.yml", "utf-8");
    const apWf = fs.readFileSync(".github/workflows/auto-publish.yml", "utf-8");

    const dgCronM = /cron:\s*'0 (\d+) \* \* \*'/.exec(dgWf);
    if (dgCronM && Number(dgCronM[1]) + 9 !== dgConfig.hourJST) {
      issues.push({ level: "ERROR", msg: `daily-generate cronとconfig時刻が不一致: cron=${Number(dgCronM[1])+9}JST config=${dgConfig.hourJST}JST` });
    }

    const apCronM = /cron:\s*'0 (\d+) \* \* 0,2,4,6'/.exec(apWf);
    if (apCronM && Number(apCronM[1]) + 9 !== apConfig.publishHourJST) {
      issues.push({ level: "ERROR", msg: `auto-publish cronとconfig時刻が不一致: cron=${Number(apCronM[1])+9}JST config=${apConfig.publishHourJST}JST` });
    }

    const apDaysM = /cron:\s*'0 \d+ \* \* ([\d,]+)'/.exec(apWf);
    if (apDaysM) {
      const cronDays = apDaysM[1].split(",").map(Number).sort().join(",");
      const cfgDays = (apConfig.publishDaysOfWeek as number[]).sort().join(",");
      if (cronDays !== cfgDays) {
        issues.push({ level: "ERROR", msg: `auto-publish 曜日設定不一致: cron=[${cronDays}] config=[${cfgDays}]` });
      }
    }

    // perSalon / articlesPerSalon が異常値でないか
    if (dgConfig.perSalon > 3) {
      issues.push({ level: "WARN", msg: `perSalon=${dgConfig.perSalon} (通常1〜3、コスト増に注意)` });
    }
    if (apConfig.articlesPerSalon > 5) {
      issues.push({ level: "WARN", msg: `articlesPerSalon=${apConfig.articlesPerSalon} (通常1〜3)` });
    }
  } catch (e) {
    issues.push({ level: "WARN", msg: `config/workflow読み込みエラー: ${e}` });
  }

  // 記事総数サニティチェック（急減していないか）
  const total = articles.length;
  if (total < 300) {
    issues.push({ level: "ERROR", msg: `記事総数が異常に少ない: ${total}件 (通常350件以上)` });
  }

  return issues;
}

const issues = run();
const errors = issues.filter((i) => i.level === "ERROR");
const warns  = issues.filter((i) => i.level === "WARN");

const totalArticles = collectArticles().length;

// サマリー出力
console.log(`[health-check] ${new Date().toISOString().slice(0, 10)} 実行`);
console.log(`  総記事数: ${totalArticles}件`);
console.log(`  ERROR: ${errors.length}件 / WARN: ${warns.length}件`);

if (warns.length > 0) {
  console.log("\n--- WARN ---");
  warns.forEach((w) => console.log(`  ⚠ ${w.msg}`));
}

if (errors.length > 0) {
  console.error("\n--- ERROR ---");
  errors.forEach((e) => console.error(`  ✗ ${e.msg}`));
  console.error("\n[health-check] 問題が検出されました。上記を確認してください。");
  process.exit(1);
} else {
  console.log("\n[health-check] ✓ 問題なし");
}
