const GRAPH = "https://graph.facebook.com/v19.0";

export type SalonKey = "fleurami" | "riv" | "raffine";

export type IgPost = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  timestamp: string;
  salonKey: SalonKey;
  salonName: string;
  category: "hair" | "eyelash";
};

const SALONS: Record<SalonKey, { name: string; category: "hair" | "eyelash" }> = {
  fleurami: { name: "fleur ami",         category: "hair" },
  riv:      { name: "Riv. by fleur ami", category: "hair" },
  raffine:  { name: "Raffine",           category: "eyelash" },
};

function salonId(key: SalonKey) {
  const map: Record<SalonKey, string | undefined> = {
    fleurami: process.env.IG_BUSINESS_ID_FLEURAMI,
    riv:      process.env.IG_BUSINESS_ID_RIV,
    raffine:  process.env.IG_BUSINESS_ID_RAFFINE,
  };
  if (!map[key]) throw new Error(`IG_BUSINESS_ID_${key.toUpperCase()} not set`);
  return map[key]!;
}

type RawMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

async function carouselFirst(mediaId: string, token: string): Promise<string | null> {
  const res = await fetch(
    `${GRAPH}/${mediaId}/children?fields=id,media_type,media_url&access_token=${token}`,
  );
  const d = await res.json() as { data: { media_url: string; media_type: string }[] };
  return d.data?.find((c) => c.media_type === "IMAGE")?.media_url ?? null;
}

export async function fetchSalonPosts(key: SalonKey, limit = 8): Promise<IgPost[]> {
  const token  = process.env.META_LONG_LIVED_TOKEN!;
  const id     = salonId(key);
  const salon  = SALONS[key];

  const res = await fetch(
    `${GRAPH}/${id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${token}`,
    { cache: "no-store" },
  );
  const d = await res.json() as { data?: RawMedia[]; error?: { message: string } };
  if (d.error) throw new Error(`Instagram [${key}]: ${d.error.message}`);

  const posts: IgPost[] = [];
  for (const item of d.data ?? []) {
    if (!item.caption) continue;

    let mediaUrl = item.media_url;
    if (item.media_type === "VIDEO")            mediaUrl = item.thumbnail_url ?? item.media_url;
    else if (item.media_type === "CAROUSEL_ALBUM") {
      const first = await carouselFirst(item.id, token);
      if (first) mediaUrl = first;
    }

    posts.push({
      id: item.id, caption: item.caption,
      media_type: item.media_type, media_url: mediaUrl,
      permalink: item.permalink, timestamp: item.timestamp,
      salonKey: key, salonName: salon.name, category: salon.category,
    });
  }
  return posts;
}

export async function fetchAllRecentPosts(limit = 6): Promise<IgPost[]> {
  const results = await Promise.allSettled(
    (["fleurami", "riv", "raffine"] as SalonKey[]).map((k) => fetchSalonPosts(k, limit)),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

/** Instagram 画像URLを base64 に変換（10秒タイムアウト） */
export async function imageUrlToBase64(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
    const buf = await res.arrayBuffer();
    return Buffer.from(buf).toString("base64");
  } finally {
    clearTimeout(timer);
  }
}
