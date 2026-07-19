/**
 * 毎日1回、各サロンの未送信ブログ記事を1件ずつ GBP に投稿するスクリプト。
 *   - 「最新情報（テキスト投稿）」: 未送信記事を1件/サロン → data/gbp-posted.json で管理
 *   - 「写真投稿」              : サムネイルのある未送信記事を1件/サロン → data/gbp-photos-posted.json で管理
 * GitHub Actions から実行される（gbp-daily-post.yml）。
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTED_PATH = path.join(process.cwd(), "data", "gbp-posted.json");
const PHOTOS_POSTED_PATH = path.join(process.cwd(), "data", "gbp-photos-posted.json");
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

function readSlugsSet(filePath: string): Set<string> {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return new Set(Array.isArray(data) ? data.map(String) : []);
  } catch {
    return new Set();
  }
}

function writeSlugsSet(filePath: string, slugs: Set<string>): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(
    filePath,
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

async function postTextToGbp(article: Article): Promise<void> {
  const res = await fetch(WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "post",
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

async function postPhotoToGbp(article: Article): Promise<void> {
  const sourceUrl = toAbsoluteUrl(article.thumbnail);
  if (!sourceUrl) throw new Error("thumbnail なし");

  const res = await fetch(WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "photo",
      salonKey: article.salonKey,
      salonName: article.salonName,
      sourceUrl,
      description: article.title,
      articleUrl: `${SITE_ORIGIN}/blog/${article.category}/${article.slug}`,
    }),
  });
  if (!res.ok) {
    throw new Error(`Webhook エラー: ${res.status} ${await res.text()}`);
  }
}

function groupBySalon(articles: Article[]): Record<string, Article[]> {
  const map: Record<string, Article[]> = {};
  for (const a of articles) {
    if (!map[a.salonKey]) map[a.salonKey] = [];
    map[a.salonKey].push(a);
  }
  return map;
}

async function main() {
  if (!WEBHOOK_URL) {
    console.log("[gbp-daily-post] GBP_WEBHOOK_URL が未設定のためスキップ");
    return;
  }

  const articles = collectPublishedArticles();
  console.log(`[gbp-daily-post] 公開記事 ${articles.length} 件`);

  // ── テキスト投稿 ──────────────────────────────
  const postedSlugs = readSlugsSet(POSTED_PATH);
  console.log(`[text] 投稿済み ${postedSlugs.size} 件`);
  let textPosted = 0;

  for (const [salonKey, salonArticles] of Object.entries(groupBySalon(articles))) {
    const unposted = salonArticles
      .filter((a) => !postedSlugs.has(a.slug))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    if (unposted.length === 0) {
      console.log(`  [text][${salonKey}] 未投稿なし`);
      continue;
    }

    const target = unposted[0];
    try {
      await postTextToGbp(target);
      postedSlugs.add(target.slug);
      console.log(`  ✓ [text][${salonKey}] ${target.slug}`);
      textPosted++;
    } catch (e) {
      console.error(
        `  ✗ [text][${salonKey}] ${target.slug} — ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  if (textPosted > 0) {
    writeSlugsSet(POSTED_PATH, postedSlugs);
    console.log(`[text] 完了: ${textPosted} 件投稿`);
  }

  // ── 写真投稿 ──────────────────────────────────
  const photoPostedSlugs = readSlugsSet(PHOTOS_POSTED_PATH);
  console.log(`[photo] 投稿済み ${photoPostedSlugs.size} 件`);
  let photoPosted = 0;

  // サムネイルがある記事のみ対象
  const articlesWithThumbnail = articles.filter((a) => !!a.thumbnail);

  for (const [salonKey, salonArticles] of Object.entries(groupBySalon(articlesWithThumbnail))) {
    const unposted = salonArticles
      .filter((a) => !photoPostedSlugs.has(a.slug))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    if (unposted.length === 0) {
      console.log(`  [photo][${salonKey}] 未投稿なし`);
      continue;
    }

    const target = unposted[0];
    try {
      await postPhotoToGbp(target);
      photoPostedSlugs.add(target.slug);
      console.log(`  ✓ [photo][${salonKey}] ${target.slug}`);
      photoPosted++;
    } catch (e) {
      console.error(
        `  ✗ [photo][${salonKey}] ${target.slug} — ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  if (photoPosted > 0) {
    writeSlugsSet(PHOTOS_POSTED_PATH, photoPostedSlugs);
    console.log(`[photo] 完了: ${photoPosted} 件投稿`);
  }

  console.log(`\n[gbp-daily-post] 完了 — テキスト: ${textPosted}件 / 写真: ${photoPosted}件`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
