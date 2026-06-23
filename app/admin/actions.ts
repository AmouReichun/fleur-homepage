"use server";

import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getContentLatest } from "@/lib/content";

const CONTENT_PATH = path.join(process.cwd(), "data/content.json");

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is not set");
  }

  if (password !== adminPassword) {
    return { error: "パスワードが正しくありません" };
  }

  const cookieStore = cookies();
  cookieStore.set("admin_session", "authenticated", {
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
  return { success: true };
}

export async function saveContent(sectionKey: string, dataJson: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = JSON.parse(dataJson);
  const current = await getContentLatest();

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

  return { success: true };
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
  const savePath = path.join(
    process.cwd(),
    "public/images/admin",
    filename
  );

  try {
    fs.mkdirSync(path.dirname(savePath), { recursive: true });
    fs.writeFileSync(savePath, buffer);
  } catch { /* read-only on Vercel — image stored via GitHub only */ }

  // Sync to GitHub if configured
  if (
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  ) {
    try {
      await commitImageToGitHub(buffer, `public/images/admin/${filename}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`画像のGitHub保存に失敗しました: ${msg}`);
    }
  }

  return `/images/admin/${filename}`;
}

async function commitImageToGitHub(buffer: Buffer, filePath: string) {
  const token = process.env.GITHUB_TOKEN!;
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `admin: 画像アップロード ${filePath}`,
        content: buffer.toString("base64"),
      }),
    }
  );
}
