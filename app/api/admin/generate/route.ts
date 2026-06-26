import { NextRequest, NextResponse } from "next/server";
import { imageUrlToBase64 } from "@/lib/blog/instagram-api";
import { generateArticleFromPost } from "@/lib/blog/article-core";
import { commitFile, deleteFile } from "@/lib/blog/github";
import { getFileBase64FromGithub } from "@/lib/blog/staff-uploads";
import { generateArticleFromUpload, buildMarkdown } from "@/scripts/generate-article";
import type { IgPost } from "@/lib/blog/instagram-api";
import type { StaffUpload } from "@/lib/blog/staff-uploads";

export const runtime = "nodejs";
export const maxDuration = 180;

async function handleInstagram(post: IgPost) {
  // 画像を取得して base64 に変換
  let imageBase64: string | null = null;
  try {
    imageBase64 = await imageUrlToBase64(post.media_url);
  } catch {
    // 画像取得失敗はスキップ（テキストのみで生成）
  }

  const result = await generateArticleFromPost(post, imageBase64);
  if (!result) throw new Error("記事生成に失敗しました");

  // GitHub に画像をコミット
  if (imageBase64) {
    const imgPath = `public/images/instagram/${post.salonKey}/${post.id}.jpg`;
    await commitFile(
      imgPath,
      Buffer.from(imageBase64, "base64"),
      `img: add instagram image ${post.id}`,
    );
  }

  // GitHub に記事 .md をコミット
  const mdPath = `content/${result.category}/${result.slug}.md`;
  await commitFile(mdPath, result.markdown, `draft: ${post.salonName} - ${result.slug}`);

  return { slug: result.slug, category: result.category };
}

async function handleUpload(upload: StaffUpload) {
  // GitHub から画像を base64 で取得
  const imageBase64 = await getFileBase64FromGithub(upload.imageGithubPath);

  const date = new Date().toISOString().slice(0, 10);
  const article = await generateArticleFromUpload({
    imagesBase64: imageBase64 ? [imageBase64] : [],
    memo: upload.memo,
    salonKey: upload.salonKey,
    date,
  });
  if (!article) throw new Error("記事生成に失敗しました");

  // サムネイルはアップロード済み画像を参照
  article.thumbnail = `/images/uploads/${upload.salonKey}/${upload.id}.jpg`;
  article.slug = `${article.slug}-${Date.now().toString(36)}`;

  // GitHub に記事 .md をコミット
  const markdown = buildMarkdown(article);
  const mdPath = `content/${article.category}/${article.slug}.md`;
  await commitFile(mdPath, markdown, `draft(upload): ${article.title}`);

  // 処理済みのアップロード JSON を削除
  try {
    await deleteFile(upload.jsonGithubPath, `upload(done): remove ${upload.id}`);
  } catch (e) {
    console.error("upload JSON delete failed:", e);
    // 削除失敗は致命的でないので続行
  }

  return { slug: article.slug, category: article.category };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { post?: IgPost; upload?: StaffUpload };

    let result: { slug: string; category: string };

    if (body.upload) {
      result = await handleUpload(body.upload);
    } else if (body.post) {
      result = await handleInstagram(body.post);
    } else {
      return NextResponse.json({ error: "post または upload が必要です" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, slug: result.slug, category: result.category });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
