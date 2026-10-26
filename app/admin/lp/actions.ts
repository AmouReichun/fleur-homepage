"use server";

import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { getContentLatest } from "@/lib/content";
import { verifySessionToken } from "@/lib/admin-auth";
import { getLpStore, type LpContent, type LpStore } from "@/lib/lp";
import { saveContent } from "../actions";

// サーバーアクションは任意のURLへPOSTして呼べるため、middleware に頼らず各アクション内でも認証を確認する
async function requireAdmin() {
  if (!(await verifySessionToken(cookies().get("admin_session")?.value))) {
    throw new Error("ログインが必要です");
  }
}

async function writeStore(store: LpStore) {
  const res = await saveContent("lp", JSON.stringify(store));
  if (!res.success) throw new Error(res.error ?? "保存に失敗しました");
}

/** 下書きを保存（公開ページには反映されない） */
export async function saveLpDraft(draftJson: string): Promise<{ success: boolean; error?: string; draftUpdatedAt?: string }> {
  try {
    await requireAdmin();
    const draft = JSON.parse(draftJson) as LpContent;
    const current = getLpStore(await getContentLatest());
    const draftUpdatedAt = new Date().toISOString();
    await writeStore({ ...current, draft, draftUpdatedAt });
    return { success: true, draftUpdatedAt };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** 下書きを保存してから、その内容を公開ページへ反映する */
export async function publishLp(draftJson: string): Promise<{ success: boolean; error?: string; publishedAt?: string }> {
  try {
    await requireAdmin();
    const draft = JSON.parse(draftJson) as LpContent;
    const current = getLpStore(await getContentLatest());
    const now = new Date().toISOString();
    await writeStore({ ...current, draft, published: draft, draftUpdatedAt: now, publishedAt: now });
    return { success: true, publishedAt: now };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * LP用の画像アップロード。向き補正 → 長辺1800pxに縮小 → WebP に変換して Vercel Blob（既存ストア）へ保存。
 * 表示時は next/image が端末に合わせて AVIF/WebP・サイズを自動で出し分ける。
 */
export async function uploadLpImage(formData: FormData): Promise<{ url: string; width: number; height: number }> {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  const section = String(formData.get("section") || "lp").replace(/[^a-z0-9-]/gi, "").slice(0, 30) || "lp";
  if (!file || !file.type.startsWith("image/")) throw new Error("画像ファイルを選択してください");
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN が未設定です。Vercel Blob ストアを接続してください。");
  }

  const input = Buffer.from(await file.arrayBuffer());
  let out: Buffer;
  let width = 0;
  let height = 0;
  try {
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    out = data;
    width = info.width;
    height = info.height;
  } catch {
    throw new Error("画像を変換できませんでした（HEIC形式の場合は、iPhoneの設定で「互換性優先」にするか、JPEGで保存してから追加してください）");
  }

  const name = `lp/${section}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
  const { url } = await put(name, out, { access: "public", contentType: "image/webp" });
  return { url, width, height };
}
