// Google Business Profile (GBP) への自動投稿クライアント。
//
// 環境変数（すべて揃っている場合のみ有効。無ければ何もしない）:
//   GBP_CLIENT_ID       OAuth クライアントID
//   GBP_CLIENT_SECRET   OAuth クライアントシークレット
//   GBP_REFRESH_TOKEN   business.manage スコープで取得したリフレッシュトークン
//   GBP_LOCATIONS       店舗キー→ロケーションリソースのJSON
//                       例: {"fleurami":"accounts/123/locations/456","riv":"accounts/123/locations/789","raffine":"accounts/123/locations/012"}
//
// ロケーションリソースは `accounts/{accountId}/locations/{locationId}` 形式。

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://mybusiness.googleapis.com/v4";
const SUMMARY_MAX = 1500;
const SITE_ORIGIN = "https://fleur-group.jp";

// content.json の salonOrder キー → GBP_LOCATIONS キーのマッピング
// （ブログ記事 frontmatter の salon 名からキーへの逆引きにも使用）
const SALON_NAME_TO_KEY: Record<string, string> = {
  "fleur ami": "fleurami",
  "Riv. by fleur ami": "riv",
  "Raffine": "raffine",
};

export function isGbpConfigured(): boolean {
  return !!(
    process.env.GBP_CLIENT_ID &&
    process.env.GBP_CLIENT_SECRET &&
    process.env.GBP_REFRESH_TOKEN &&
    process.env.GBP_LOCATIONS
  );
}

function locationMap(): Record<string, string> {
  try {
    return JSON.parse(process.env.GBP_LOCATIONS || "{}");
  } catch {
    return {};
  }
}

/** 店舗キー(空=全店舗共通)から投稿先ロケーションリソースの配列を返す */
export function resolveLocations(salonKey: string | undefined): string[] {
  const map = locationMap();
  if (salonKey && salonKey.trim() !== "") {
    const loc = map[salonKey];
    return loc ? [loc] : [];
  }
  return Object.values(map);
}

/** ブログ記事 frontmatter の salon 名（例: "Riv. by fleur ami"）を GBP_LOCATIONS のキーに変換 */
export function salonNameToKey(salonName: string): string | undefined {
  return SALON_NAME_TO_KEY[salonName];
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: process.env.GBP_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`GBP token refresh failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.access_token as string;
}

function toAbsoluteUrl(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return `${SITE_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

interface GbpPostInput {
  title: string;
  body: string;
  imageSrc?: string;
  /** CTA のリンク先。省略時は /news */
  url?: string;
}

async function createLocalPost(
  accessToken: string,
  locationResource: string,
  input: GbpPostInput
): Promise<string> {
  const summary = `${input.title}\n\n${input.body}`.trim().slice(0, SUMMARY_MAX);
  const imageUrl = toAbsoluteUrl(input.imageSrc);
  const ctaUrl = input.url ?? `${SITE_ORIGIN}/news`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const basePost: any = {
    languageCode: "ja",
    summary,
    topicType: "STANDARD",
    callToAction: {
      actionType: "LEARN_MORE",
      url: ctaUrl,
    },
  };

  async function send(withMedia: boolean): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post: any = { ...basePost };
    if (withMedia && imageUrl) {
      post.media = [{ mediaFormat: "PHOTO", sourceUrl: imageUrl }];
    }
    return fetch(`${API_BASE}/${locationResource}/localPosts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
  }

  let res = await send(!!imageUrl);
  // 画像URLがまだ本番に反映されていない等で失敗した場合はテキストのみで再試行
  if (!res.ok && imageUrl) {
    res = await send(false);
  }
  if (!res.ok) {
    throw new Error(
      `GBP localPosts.create failed (${locationResource}): ${res.status} ${await res.text()}`
    );
  }
  const json = await res.json();
  return json.name as string;
}

/**
 * お知らせ（NewsItem）を対象店舗のGBPに投稿する。
 * CTAは /news へのリンク。
 * 投稿成功時はリソース名（複数店舗はカンマ区切り）を返す。未設定・対象なしは null。
 */
export async function postNewsToGbp(item: GbpPostInput & { salon?: string }): Promise<string | null> {
  if (!isGbpConfigured()) return null;
  const locations = resolveLocations(item.salon);
  if (locations.length === 0) return null;

  const accessToken = await getAccessToken();
  const names: string[] = [];
  for (const loc of locations) {
    const name = await createLocalPost(accessToken, loc, item);
    names.push(name);
  }
  return names.join(",");
}

/**
 * ブログ記事を対象店舗のGBPに投稿する。
 * CTAは記事URLへのリンク。salonName は frontmatter の salon フィールド値（例: "Riv. by fleur ami"）。
 * 投稿成功時はリソース名（複数店舗はカンマ区切り）を返す。未設定・対象なしは null。
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
  const locations = resolveLocations(salonKey);
  if (locations.length === 0) return null;

  const articleUrl = `${SITE_ORIGIN}/blog/${article.category}/${article.slug}`;
  const accessToken = await getAccessToken();
  const names: string[] = [];
  for (const loc of locations) {
    const name = await createLocalPost(accessToken, loc, {
      title: article.title,
      body: article.excerpt,
      imageSrc: article.thumbnail,
      url: articleUrl,
    });
    names.push(name);
  }
  return names.join(",");
}
