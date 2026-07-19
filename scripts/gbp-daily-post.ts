/**
 * 毎日1回、各サロンの未送信ブログ記事を1件ずつ GBP に投稿するスクリプト。
 * GitHub Actions から実行される（gbp-daily-post.yml）。
 * 送信済みslugは data/gbp-posted.json に記録し、コミットして重複投稿を防ぐ。
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTED_PATH = path.join(process.cwd(), "data", "gbp-posted.json");
const SITE_ORIGIN = "https://fleur-group.jp";
const WEBHOOK_URL = process.env.GBP_WEBHOOK_URL;

const SALON_NAME_TO_KEY: Record<string, string> = {
  "fleur ami": "fleurami",
  "Riv. by fleur ami": "riv",
  Raffine: "raffine",
};

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  category: "hair" | "eyelash";
  salonKey: string;
  salonName: string;
  date: string;
};

function getPostedSlugs(): Set<string> {
  try {
    const raw = fs.readFileSync(POSTED_PATH, "utf-8");
    const data = JSON.parse(raw);
    return new Set(Array.isArray(data) ? data.map(String) : []);
  } catch {
    return new Set();
  }
}

function savePostedSlugs(slugs: Set<string>): void {
  fs.mkdirSync(path.dirname(POSTED_PATH), { recursive: true });
  fs.writeFileSync(
    POSTED_PATH,
    JSON.stringify(Array.from(slugs).sort(), null, 2) + "\n",
  );
}

function collectPublishedArticles(): Article[] {
  const articles: Article[] = [];
  for (const category of ["hair", "eyelash"] as const) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      try {
        const raw = fs.readFileSync(path.join(dir, name), "utf-8");
        const { data } = matter(raw);
        if (data.draft === true) continue;
        const salonKey = SALON_NAME_TO_KEY[data.salon as string];
        if (!salonKey) continue;
        const slug =
          (data.slug as string | undefined) ?? path.basename(name, ".md");
        articles.push({
          slug,
          title: (data.title as string | undefined) ?? "",
          excerpt: (data.excerpt as string | undefined) ?? "",
          thumbnail: data.thumbnail as string | undefined,
          category,
          salonKey,
          salonName: data.salon as string,
          date: (data.date as string | undefined) ?? "",
        });
      } catch {
        // ファイル読み取り失敗は無視
      }
    }
  }
  return articles;
}

function toAbsoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

async function postToGbp(article: Article): Promise<void> {
  const res = await fetch(WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      salonKey: article.salonKey,
      salonName: article.salonName,
      title: article.title,
      excerpt: article.excerpt,
      thumbnailUrl: toAbsoluteUrl(article.thumbnail),
      articleUrl: `${SITE_ORIGIN}/blog/${article.category}/${article.slug}`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Webhook エラー: ${res.status} ${await res.text()}`);
  }
}

async function main() {
  if (!WEBHOOK_URL) {
    console.log("[gbp-daily-post] GBP_WEBHOOK_URL が未設定のためスキップ");
    return;
  }

  const postedSlugs = getPostedSlugs();
  const articles = collectPublishedArticles();

  console.log(
    `[gbp-daily-post] 公開記事 ${articles.length} 件 / 投稿済み ${postedSlugs.size} 件`,
  );

  // サロン別にグループ化
  const bySalon: Record<string, Article[]> = {};
  for (const a of articles) {
    if (!bySalon[a.salonKey]) bySalon[a.salonKey] = [];
    bySalon[a.salonKey].push(a);
  }

  let postedCount = 0;

  for (const [salonKey, salonArticles] of Object.entries(bySalon)) {
    // 未投稿を日付の古い順で並べ、最も古い1件を選ぶ
    const unposted = salonArticles
      .filter((a) => !postedSlugs.has(a.slug))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    if (unposted.length === 0) {
      console.log(`  [${salonKey}] 未投稿なし`);
      continue;
    }

    const target = unposted[0];
    try {
      await postToGbp(target);
      postedSlugs.add(target.slug);
      console.log(`  ✓ [${salonKey}] ${target.slug}`);
      postedCount++;
    } catch (e) {
      console.error(
        `  ✗ [${salonKey}] ${target.slug} — ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  if (postedCount > 0) {
    savePostedSlugs(postedSlugs);
    console.log(`\n[gbp-daily-post] 完了: ${postedCount} 件を GBP に投稿`);
  } else {
    console.log("\n[gbp-daily-post] 新規投稿なし");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
