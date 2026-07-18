/**
 * 毎日1回、各サロンの最新Instagram投稿から記事を自動生成するスクリプト。
 * GitHub Actions から実行される。
 */
import * as fs from "fs";
import * as path from "path";
import { fetchSalonPosts, imageUrlToBase64, type SalonKey } from "../lib/blog/instagram-api";
import { generateArticleFromPost } from "../lib/blog/article-core";

const SALONS: SalonKey[] = ["fleurami", "riv", "raffine"];

const SALON_ID_ENV: Record<SalonKey, string> = {
  fleurami: "IG_BUSINESS_ID_FLEURAMI",
  riv:      "IG_BUSINESS_ID_RIV",
  raffine:  "IG_BUSINESS_ID_RAFFINE",
};

type GenerateConfig = { enabled: boolean; hourJST: number; perSalon: number };

function loadConfig(): GenerateConfig {
  const defaults: GenerateConfig = { enabled: true, hourJST: 10, perSalon: 1 };
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "config/daily-generate.json"), "utf-8");
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

/** 管理画面で「非表示」または「削除」した instagram_id を収集 */
function getIgnoredIds(): Set<string> {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "ig-ignored.json"), "utf-8");
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.map(String) : []);
  } catch {
    return new Set();
  }
}

/** 既に処理済みの instagram_id をコンテンツファイルから収集 */
function getProcessedIds(): Set<string> {
  const processed = new Set<string>();
  for (const cat of ["hair", "eyelash"]) {
    const dir = path.join(process.cwd(), "content", cat);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const match = raw.match(/instagram_id:\s*['"]([^'"]+)['"]/);
      if (match) processed.add(match[1]);
    }
  }
  return processed;
}

/** 必須 env var のチェック。不足があれば警告して不足 key を返す */
function checkEnvVars(): SalonKey[] {
  const missing: SalonKey[] = [];
  for (const salon of SALONS) {
    const envKey = SALON_ID_ENV[salon];
    if (!process.env[envKey]) {
      console.warn(`  ⚠ ${envKey} が未設定 → ${salon} をスキップ`);
      missing.push(salon);
    }
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("  ✗ ANTHROPIC_API_KEY が未設定 — 記事生成不可");
    process.exit(1);
  }
  if (!process.env.META_LONG_LIVED_TOKEN) {
    console.error("  ✗ META_LONG_LIVED_TOKEN が未設定 — Instagram API 不可");
    process.exit(1);
  }
  return missing;
}

async function main() {
  const config = loadConfig();
  if (!config.enabled) {
    console.log("[daily-generate] 自動生成が無効のためスキップ");
    process.exit(0);
  }
  console.log(`[daily-generate] 設定: ${config.hourJST}:00 JST / サロンあたり ${config.perSalon} 件`);

  console.log("\n■ 環境変数チェック");
  const missingSalons = checkEnvVars();
  const activeSalons = SALONS.filter((s) => !missingSalons.includes(s));
  if (activeSalons.length === 0) {
    console.error("[daily-generate] 有効なサロンが0件 — GitHub Secrets に IG_BUSINESS_ID_* を登録してください");
    process.exit(1);
  }
  console.log(`  有効サロン: ${activeSalons.join(", ")}`);

  const processedIds = getProcessedIds();
  const ignoredIds = getIgnoredIds();
  const skipIds = new Set(Array.from(processedIds).concat(Array.from(ignoredIds)));
  console.log(`\n[daily-generate] スキップID: 処理済み ${processedIds.size} 件 + 非表示/削除済み ${ignoredIds.size} 件`);

  let generated = 0;
  let apiErrors = 0;

  for (const salonKey of activeSalons) {
    console.log(`\n── ${salonKey} ──`);
    let posts;
    try {
      posts = await fetchSalonPosts(salonKey, 10);
    } catch (e) {
      console.error(`  ✗ Instagram 取得失敗: ${e}`);
      apiErrors++;
      continue;
    }

    // まだ記事化されていない投稿を設定件数選ぶ
    const newPosts = posts.filter((p) => !skipIds.has(p.id)).slice(0, config.perSalon);
    if (newPosts.length === 0) {
      console.log("  新規投稿なし（全て処理済み）");
      continue;
    }

    console.log(`  対象: ${newPosts.length} 件`);

    for (const post of newPosts) {
      console.log(`\n  [${post.id}] ${post.timestamp.slice(0, 10)} category=${post.category}`);
      console.log(`  caption: ${post.caption.slice(0, 60)}...`);

      // 画像取得
      let imageBase64: string | null = null;
      try {
        imageBase64 = await imageUrlToBase64(post.media_url);
        console.log("  画像: 取得成功");
      } catch {
        console.log("  画像: 取得失敗（テキストのみで生成）");
      }

      // Claude で記事生成
      console.log("  Claude で記事生成中...");
      const result = await generateArticleFromPost(post, imageBase64);
      if (!result) {
        console.error("  ✗ 記事生成失敗");
        apiErrors++;
        continue;
      }

      // 画像を保存
      if (imageBase64) {
        const imgDir = path.join(
          process.cwd(),
          "public",
          "images",
          "instagram",
          salonKey,
        );
        fs.mkdirSync(imgDir, { recursive: true });
        fs.writeFileSync(
          path.join(imgDir, `${post.id}.jpg`),
          Buffer.from(imageBase64, "base64"),
        );
        console.log(`  画像保存: public/images/instagram/${salonKey}/${post.id}.jpg`);
      }

      // Markdown を保存
      const mdDir = path.join(process.cwd(), "content", result.category);
      fs.mkdirSync(mdDir, { recursive: true });
      fs.writeFileSync(path.join(mdDir, `${result.slug}.md`), result.markdown);
      console.log(`  ✓ 記事保存: content/${result.category}/${result.slug}.md`);

      if (result.markdown.includes("yakkihou_flag: true")) {
        console.log("  ⚠ 薬機法フラグあり — 管理画面で確認してください");
      }

      // 処理済みに追加（同一ランでの重複防止）
      processedIds.add(post.id);
      generated++;
    }
  }

  console.log(`\n[daily-generate] 完了: 生成 ${generated} 件 / API エラー ${apiErrors} 件`);

  if (generated === 0 && apiErrors > 0) {
    console.error("[daily-generate] 全サロンでエラー発生");
    process.exit(1);
  }
  if (generated === 0) {
    console.log("コミットなし（新規生成なし）");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
