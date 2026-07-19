// Google Business Profile (GBP) への自動投稿クライアント。
// Make.com Webhook 経由で投稿する（GBP API は承認制のため直接呼び出し不可）。
//
// 環境変数:
//   GBP_WEBHOOK_URL   Make.com の Custom Webhook URL
//
// Make.com シナリオ側でペイロードの salonKey を見て店舗ごとにルーティングする。

const SITE_ORIGIN = "https://fleur-group.jp";

const SALON_NAME_TO_KEY: Record<string, string> = {
  "fleur ami": "fleurami",
  "Riv. by fleur ami": "riv",
  "Raffine": "raffine",
};

export function isGbpConfigured(): boolean {
  return !!process.env.GBP_WEBHOOK_URL;
}

export function salonNameToKey(salonName: string): string | undefined {
  return SALON_NAME_TO_KEY[salonName];
}

function toAbsoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

async function postToWebhook(payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.GBP_WEBHOOK_URL!;
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GBP webhook failed: ${res.status} ${await res.text()}`);
  }
}

/**
 * お知らせ（NewsItem）を対象店舗のGBPに投稿する。
 * salon 未指定時は全店舗に投稿（Make.com 側でルーティング）。
 */
export async function postNewsToGbp(item: {
  title: string;
  body: string;
  imageSrc?: string;
  url?: string;
  salon?: string;
}): Promise<string | null> {
  if (!isGbpConfigured()) return null;
  await postToWebhook({
    salonKey: item.salon ?? "all",
    title: item.title,
    excerpt: item.body,
    thumbnailUrl: toAbsoluteUrl(item.imageSrc),
    articleUrl: item.url ?? `${SITE_ORIGIN}/news`,
  });
  return `webhook:${item.salon ?? "all"}`;
}

/**
 * ブログ記事を対象店舗のGBPに「最新情報（投稿）」として送る。
 * salonName は frontmatter の salon フィールド値（例: "Riv. by fleur ami"）。
 * 投稿成功時は "webhook:{salonKey}" を返す。未設定・対象なしは null。
 */
export async function postBlogArticleToGbp(article: {
  title: string;
  excerpt: string;
  thumbnail?: string;
  slug: string;
  category: "hair" | "eyelash";
  salonName: string;
}): Promise<string | null> {
  if (!isGbpConfigured()) return null;
  const salonKey = salonNameToKey(article.salonName);
  if (!salonKey) return null;

  await postToWebhook({
    type: "post",
    salonKey,
    salonName: article.salonName,
    title: article.title,
    excerpt: article.excerpt,
    thumbnailUrl: toAbsoluteUrl(article.thumbnail),
    articleUrl: `${SITE_ORIGIN}/blog/${article.category}/${article.slug}`,
  });
  return `webhook:${salonKey}`;
}

/**
 * ブログ記事のサムネイル画像をGBP「写真」ギャラリーに投稿する。
 * Make.com 側で type === "photo" のルートを設定してください。
 */
export async function postBlogPhotoToGbp(article: {
  title: string;
  thumbnail: string;
  slug: string;
  category: "hair" | "eyelash";
  salonName: string;
}): Promise<string | null> {
  if (!isGbpConfigured()) return null;
  const salonKey = salonNameToKey(article.salonName);
  if (!salonKey) return null;
  const sourceUrl = toAbsoluteUrl(article.thumbnail);
  if (!sourceUrl) return null;

  await postToWebhook({
    type: "photo",
    salonKey,
    salonName: article.salonName,
    sourceUrl,
    description: article.title,
    articleUrl: `${SITE_ORIGIN}/blog/${article.category}/${article.slug}`,
  });
  return `webhook:${salonKey}`;
}
