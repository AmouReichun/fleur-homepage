"use server";

import fs from "fs";
import path from "path";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { getContentLatest, type NewsItem } from "@/lib/content";
import { createSessionToken } from "@/lib/admin-auth";
import { isGbpConfigured, postNewsToGbp } from "@/lib/gbp";
import { put } from "@vercel/blob";

const CONTENT_PATH = path.join(process.cwd(), "data/content.json");

// ── ログイン総当たり対策（ベストエフォートのインメモリ制限） ──────────────
// サーバーレスはインスタンスごとにメモリが分かれ、コールドスタートでリセットされるため
// 完全ではないが、単純なブルートフォースの敷居を上げる。より強固にするなら Vercel WAF の
// レート制限や KV ストアの利用を検討する。
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10分
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map<string, { count: number; first: number }>();

function clientIp(): string {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not set");
  }

  // レート制限チェック
  const ip = clientIp();
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (rec && now - rec.first < LOGIN_WINDOW_MS && rec.count >= LOGIN_MAX_ATTEMPTS) {
    return { error: "ログイン試行回数が多すぎます。しばらくしてから再度お試しください。" };
  }

  if (password !== adminPassword) {
    // 失敗回数を記録
    if (!rec || now - rec.first >= LOGIN_WINDOW_MS) {
      loginAttempts.set(ip, { count: 1, first: now });
    } else {
      rec.count += 1;
    }
    return { error: "パスワードが正しくありません" };
  }

  // 成功したらカウンタをリセット
  loginAttempts.delete(ip);

  const token = await createSessionToken();
  const cookieStore = cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function addSalon(key: string, name: string, salonType: string, area: string) {
  const current = await getContentLatest();
  if (current.salons[key]) return { success: false, error: "同じキーのサロンが既に存在します" };
  current.salons[key] = {
    salonType, name, nameReading: "", area, tagline: "", description: "",
    features: [], address: "", phone: "", hoursWeekday: "", hoursSaturday: "",
    closed: "", parking: "", hotpepperUrl: "", instagramUrl: "", imageSrc: "",
    mapEmbedUrl: "", faq: [],
  };
  current.menus[key] = [];
  current.salonOrder.push(key);
  const newJson = JSON.stringify(current, null, 2);
  try { fs.writeFileSync(CONTENT_PATH, newJson); } catch { /* read-only on Vercel */ }
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO) {
    try { await commitToGitHub(newJson); } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : String(e) };
    }
  }
  revalidateTag("site-content");
  return { success: true };
}

export async function saveSalonOrder(order: string[]) {
  const current = await getContentLatest();
  current.salonOrder = order;
  const newJson = JSON.stringify(current, null, 2);
  let fsWriteOk = true;
  try { fs.writeFileSync(CONTENT_PATH, newJson); } catch { fsWriteOk = false; }
  const hasGitHub = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO);
  if (!fsWriteOk && !hasGitHub) {
    throw new Error("GitHub 環境変数が未設定です");
  }
  if (hasGitHub) {
    try { await commitToGitHub(newJson); } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e));
    }
  }
  revalidateTag("site-content");
  return { success: true };
}

export async function saveContent(sectionKey: string, dataJson: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = JSON.parse(dataJson);
  const current = await getContentLatest();

  // 最新情報の保存時は、未投稿の新規お知らせを各店舗のGBPへ自動投稿する。
  // 投稿できたものは gbpPostedAt を付けて再投稿を防ぐ。GBP側の失敗は保存を止めない。
  let gbpWarning: string | undefined;
  if (sectionKey === "news" && isGbpConfigured() && Array.isArray(data)) {
    const items = data as NewsItem[];
    for (const item of items) {
      // 既に投稿済み、または内容が空のものはスキップ
      if (item.gbpPostedAt) continue;
      if (!item.title?.trim() && !item.body?.trim()) continue;
      try {
        const name = await postNewsToGbp(item);
        if (name) {
          item.gbpPostedAt = new Date().toISOString();
          item.gbpPostName = name;
        }
      } catch (e) {
        // 投稿失敗時はスタンプを付けない（次回保存で再試行される）
        const msg = e instanceof Error ? e.message : String(e);
        gbpWarning = `GBPへの投稿に一部失敗しました：${msg.slice(0, 120)}`;
      }
    }
  }

  // Support nested keys like "salons.riv"
  const keys = sectionKey.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = current;
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = data;

  const newJson = JSON.stringify(current, null, 2);

  let fsWriteOk = true;
  try { fs.writeFileSync(CONTENT_PATH, newJson); } catch { fsWriteOk = false; }

  const hasGitHub = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO);

  if (!fsWriteOk && !hasGitHub) {
    return {
      success: false,
      error: `環境変数が未設定です。Vercel ダッシュボードで GITHUB_TOKEN・GITHUB_OWNER・GITHUB_REPO を確認してください。TOKEN=${!!process.env.GITHUB_TOKEN} OWNER=${!!process.env.GITHUB_OWNER} REPO=${!!process.env.GITHUB_REPO}`,
    };
  }

  if (hasGitHub) {
    try {
      await commitToGitHub(newJson);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { success: false, error: msg };
    }
  }

  // 公開ページのキャッシュを即時無効化
  revalidateTag("site-content");

  return { success: true, warning: gbpWarning };
}

async function commitToGitHub(content: string) {
  const token = process.env.GITHUB_TOKEN!;
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const filePath = "data/content.json";

  // Get current SHA
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  if (!getRes.ok) {
    const errBody = await getRes.text();
    throw new Error(`GitHub GET failed: ${getRes.status} ${errBody}`);
  }
  const getJson = await getRes.json();
  const sha = getJson.sha;

  // Commit
  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `admin: コンテンツ更新 ${new Date().toLocaleString("ja-JP")}`,
        content: Buffer.from(content).toString("base64"),
        sha,
      }),
    }
  );
  if (!putRes.ok) {
    const errBody = await putRes.text();
    throw new Error(`GitHub PUT failed: ${putRes.status} ${errBody}`);
  }
}

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get("file") as File;
  const section = formData.get("section") as string;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();
  const filename = `${section}-${Date.now()}.${ext}`;

  // Vercel Blob に保存。公開URLは即時に配信可能（再デプロイ不要）＝アップロード後すぐ反映。
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN が未設定です。Vercel Blob ストアを接続してください。"
    );
  }
  try {
    const { url } = await put(`admin/${filename}`, buffer, {
      access: "public",
      contentType: file.type || undefined,
    });
    return url;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`画像のアップロードに失敗しました: ${msg}`);
  }
}
