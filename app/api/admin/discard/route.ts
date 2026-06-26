import { NextRequest, NextResponse } from "next/server";
import { deleteFile, getFileContent, commitFile } from "@/lib/blog/github";

export const runtime = "nodejs";

// Instagram 投稿の「非表示（無視）」リストの保存先。
// content/ 配下に置くと記事として誤認・自動デプロイ対象になるため data/ に置く。
const IGNORE_PATH = "data/ig-ignored.json";

/**
 * 生成しないアイテムの破棄。
 * - スタッフ投稿(upload): リポジトリから json と画像を削除（実削除）
 * - Instagram投稿(instagram): 無視リストに id を追加して一覧から非表示
 */
export async function POST(req: NextRequest) {
  let body: {
    itemType?: string;
    jsonGithubPath?: string;
    imageGithubPath?: string;
    igId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  try {
    if (body.itemType === "upload") {
      if (!body.jsonGithubPath) {
        return NextResponse.json({ error: "jsonGithubPath が必要です" }, { status: 400 });
      }
      await deleteFile(body.jsonGithubPath, `discard staff upload: ${body.jsonGithubPath}`);
      // 画像も削除（無くても致命的ではないので失敗は握りつぶす）
      if (body.imageGithubPath) {
        await deleteFile(body.imageGithubPath, `discard staff upload image: ${body.imageGithubPath}`).catch(() => {});
      }
      return NextResponse.json({ ok: true });
    }

    if (body.itemType === "instagram") {
      const igId = String(body.igId ?? "");
      if (!igId) {
        return NextResponse.json({ error: "igId が必要です" }, { status: 400 });
      }
      const cur = await getFileContent(IGNORE_PATH);
      let ids: string[] = [];
      if (cur) {
        try {
          const parsed = JSON.parse(cur.content);
          if (Array.isArray(parsed)) ids = parsed.map(String);
        } catch {
          ids = [];
        }
      }
      if (!ids.includes(igId)) ids.push(igId);
      await commitFile(IGNORE_PATH, JSON.stringify(ids, null, 2), `ignore ig post: ${igId}`, cur?.sha);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "不明なitemTypeです" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
