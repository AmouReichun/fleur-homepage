import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";

dotenv.config({ path: ".env.local" });

const TOKEN = process.env.META_LONG_LIVED_TOKEN!;
const APP_ID = process.env.META_APP_ID!;
const APP_SECRET = process.env.META_APP_SECRET!;

const SALONS = {
  fleurami: {
    id: process.env.IG_BUSINESS_ID_FLEURAMI!,
    name: "fleur ami",
    category: "hair" as const,
  },
  riv: {
    id: process.env.IG_BUSINESS_ID_RIV!,
    name: "Riv. by fleur ami",
    category: "hair" as const,
  },
  raffine: {
    id: process.env.IG_BUSINESS_ID_RAFFINE!,
    name: "Raffine",
    category: "eyelash" as const,
  },
};

export type SalonKey = keyof typeof SALONS;

export type IgMedia = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  localImagePath: string;
  salonKey: SalonKey;
  salonName: string;
  category: "hair" | "eyelash";
};

const GRAPH_BASE = "https://graph.facebook.com/v19.0";
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "instagram");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error(`JSON parse error: ${data.slice(0, 200)}`));
        }
      });
    }).on("error", reject);
  });
}

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(); return; }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadImage(res.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    }).on("error", (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function getCarouselChildren(mediaId: string): Promise<{ media_url: string; media_type: string }[]> {
  const url = `${GRAPH_BASE}/${mediaId}/children?fields=id,media_type,media_url&access_token=${TOKEN}`;
  const res = (await fetchJson(url)) as { data: { media_url: string; media_type: string }[] };
  return res.data ?? [];
}

async function fetchSalonMedia(salonKey: SalonKey, limit = 10): Promise<IgMedia[]> {
  const salon = SALONS[salonKey];
  const url = `${GRAPH_BASE}/${salon.id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${TOKEN}`;
  const res = (await fetchJson(url)) as { data: RawMedia[]; error?: { message: string } };

  if ((res as { error?: { message: string } }).error) {
    const errMsg = ((res as { error?: { message: string } }).error)!.message;
    console.error(`[${salonKey}] API error: ${errMsg}`);
    return [];
  }

  const results: IgMedia[] = [];
  const salonDir = path.join(IMAGES_DIR, salonKey);
  ensureDir(salonDir);

  for (const item of (res.data ?? [])) {
    if (!item.caption) continue;

    let imageUrl = item.media_url;

    if (item.media_type === "VIDEO") {
      imageUrl = item.thumbnail_url ?? item.media_url;
    } else if (item.media_type === "CAROUSEL_ALBUM") {
      const children = await getCarouselChildren(item.id);
      const first = children.find((c) => c.media_type === "IMAGE");
      if (first) imageUrl = first.media_url;
    }

    const ext = ".jpg";
    const fileName = `${item.id}${ext}`;
    const localPath = path.join(salonDir, fileName);
    const publicPath = `/images/instagram/${salonKey}/${fileName}`;

    try {
      await downloadImage(imageUrl, localPath);
      console.log(`  ✅ ${salonKey}/${fileName}`);
    } catch (e) {
      console.error(`  ❌ 画像取得失敗: ${fileName}`, e);
      continue;
    }

    results.push({
      id: item.id,
      caption: item.caption,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url,
      permalink: item.permalink,
      timestamp: item.timestamp,
      localImagePath: publicPath,
      salonKey,
      salonName: salon.name,
      category: salon.category,
    });
  }

  return results;
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

export async function fetchAllSalons(limit = 10): Promise<IgMedia[]> {
  ensureDir(IMAGES_DIR);
  const all: IgMedia[] = [];

  for (const key of Object.keys(SALONS) as SalonKey[]) {
    console.log(`\n📸 ${SALONS[key].name} の投稿を取得中...`);
    const posts = await fetchSalonMedia(key, limit);
    console.log(`   ${posts.length} 件取得`);
    all.push(...posts);
  }

  return all;
}

// .env.local の特定キーを書き換える
function updateEnvLocal(key: string, value: string) {
  const envPath = path.join(process.cwd(), ".env.local");
  const src = fs.readFileSync(envPath, "utf-8");
  const updated = src.replace(
    new RegExp(`^${key}=.*`, "m"),
    `${key}=${value}`,
  );
  fs.writeFileSync(envPath, updated, "utf-8");
}

// 14日未満なら自動で長期トークンを再発行し .env.local を更新する
export async function checkTokenExpiry() {
  const url = `${GRAPH_BASE}/debug_token?input_token=${TOKEN}&access_token=${APP_ID}|${APP_SECRET}`;
  const res = (await fetchJson(url)) as { data?: { expires_at: number; is_valid: boolean } };
  const data = res.data;
  if (!data) return;

  const expiresAt = new Date(data.expires_at * 1000);
  const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (!data.is_valid) {
    console.warn("⚠️  トークンが無効です。Meta Developers で手動再取得が必要です。");
    return;
  }

  if (daysLeft < 14) {
    console.log(`⏳ トークン残り ${daysLeft} 日 → 自動更新します...`);
    const refreshUrl =
      `${GRAPH_BASE}/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${APP_ID}` +
      `&client_secret=${APP_SECRET}` +
      `&fb_exchange_token=${TOKEN}`;
    const refreshed = (await fetchJson(refreshUrl)) as {
      access_token?: string;
      expires_in?: number;
      error?: { message: string };
    };

    if (refreshed.error || !refreshed.access_token) {
      console.error("❌ トークン更新失敗:", refreshed.error?.message ?? "不明なエラー");
      console.warn("   Meta Developers で手動再取得してください。");
      return;
    }

    updateEnvLocal("META_LONG_LIVED_TOKEN", refreshed.access_token);
    // process.env も更新して同セッション内の後続処理に反映させる
    process.env.META_LONG_LIVED_TOKEN = refreshed.access_token;

    const newExpiry = refreshed.expires_in
      ? new Date(Date.now() + refreshed.expires_in * 1000).toLocaleDateString("ja-JP")
      : "（日付不明）";
    console.log(`✅ トークン更新完了 → .env.local に保存。新しい有効期限: ${newExpiry}`);
  } else {
    console.log(`✅ トークン有効期限: ${expiresAt.toLocaleDateString("ja-JP")}（あと ${daysLeft} 日）`);
  }
}

// 単体実行
if (process.argv[1].endsWith("fetch-instagram.ts")) {
  (async () => {
    await checkTokenExpiry();
    const posts = await fetchAllSalons(5);
    console.log(`\n✅ 合計 ${posts.length} 件取得完了`);
    fs.writeFileSync(
      path.join(process.cwd(), "scripts", "_fetched.json"),
      JSON.stringify(posts, null, 2)
    );
    console.log("📄 scripts/_fetched.json に保存しました");
  })();
}
