/**
 * GBP（Google Business Profile）の未返信口コミに自動返信するスクリプト。
 * - 各店舗の口コミを取得 → 未返信のものをClaudeで返信文生成 → GBP APIで投稿
 * - data/gbp-reviews-replied.json で返信済みIDを管理
 *
 * 必要な環境変数:
 *   GBP_CLIENT_ID / GBP_CLIENT_SECRET / GBP_REFRESH_TOKEN / GBP_LOCATIONS
 *   ANTHROPIC_API_KEY
 */
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config({ path: ".env.local" });

const REPLIED_PATH = path.join(process.cwd(), "data", "gbp-reviews-replied.json");

// 1回の実行で返信する最大件数（コスト・スパム防止）
const MAX_REPLIES_PER_RUN = Number(process.env.GBP_MAX_REPLIES) || 5;

const SALON_INFO: Record<string, { name: string; description: string }> = {
  fleurami: {
    name: "fleurami（フルールアミー）",
    description: "高知県香南市の美容室。縮毛矯正・髪質改善・艶カラー・白髪ぼかしを得意とする大人女性向けヘアサロン。",
  },
  riv: {
    name: "Riv. by fleurami（リヴ）",
    description: "高知市南川添の美容室。髪質改善・白髪ぼかし・グレイカラー・縮毛矯正が得意。40〜50代のお客様が多い。",
  },
  raffine: {
    name: "Raffine（ラフィーネ）",
    description: "高知市はりまや橋のアイラッシュ・眉毛専門サロン。まつげパーマ・ラッシュリフト・まつエク・眉毛WAX。全席半個室・完全予約制。",
  },
};

type Review = {
  name: string;
  reviewId: string;
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  reviewer?: { displayName?: string };
  reviewReply?: { comment: string };
  createTime: string;
};

type ReviewsResponse = {
  reviews?: Review[];
  nextPageToken?: string;
};

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: process.env.GBP_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`Token取得失敗: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchReviews(locationName: string, token: string): Promise<Review[]> {
  const url = `https://mybusiness.googleapis.com/v4/${locationName}/reviews?pageSize=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`口コミ取得失敗 (${res.status}): ${text}`);
  }
  const data = await res.json() as ReviewsResponse;
  return data.reviews ?? [];
}

async function postReply(reviewName: string, comment: string, token: string): Promise<void> {
  const res = await fetch(`https://mybusiness.googleapis.com/v4/${reviewName}/reply`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`返信投稿失敗 (${res.status}): ${text}`);
  }
}

const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

async function generateReply(
  review: Review,
  salonKey: string,
  client: Anthropic,
): Promise<string> {
  const salon = SALON_INFO[salonKey] ?? SALON_INFO.fleurami;
  const stars = STAR_MAP[review.starRating] ?? 5;
  const reviewerName = review.reviewer?.displayName ?? "お客様";
  const comment = review.comment ?? "";

  const prompt = `あなたは${salon.name}のオーナーです。
${salon.description}

以下のGoogle口コミに返信してください。

【口コミ情報】
投稿者: ${reviewerName}
評価: ★${stars}/5
本文: ${comment || "（テキストなし、星のみ）"}

【返信のルール】
- 150〜250文字程度（長すぎず短すぎず）
- 丁寧で温かみのある語り口（です・ます調）
- ★4以上: 来店への感謝＋具体的な言及（本文に内容がある場合）＋また来てほしい気持ち
- ★3以下: 不満への謝意と改善の意志を示す。言い訳はしない
- 施術の具体的な効果・結果の保証（「必ず改善されます」等）は書かない
- 店名・住所・電話番号は書かない（Googleが重複と見なすため）
- ハッシュタグ不可
- 返信文のみ出力（前置き・説明不要）`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  return ((msg.content[0] as { text: string }).text ?? "").trim();
}

function loadRepliedSet(): Set<string> {
  try {
    const raw = fs.readFileSync(REPLIED_PATH, "utf-8");
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function saveRepliedSet(set: Set<string>): void {
  fs.mkdirSync(path.dirname(REPLIED_PATH), { recursive: true });
  fs.writeFileSync(REPLIED_PATH, JSON.stringify(Array.from(set).sort(), null, 2) + "\n");
}

async function main() {
  const required = ["GBP_CLIENT_ID", "GBP_CLIENT_SECRET", "GBP_REFRESH_TOKEN", "GBP_LOCATIONS", "ANTHROPIC_API_KEY"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`✗ 環境変数が未設定: ${missing.join(", ")}`);
    process.exit(1);
  }

  const locations: Record<string, string> = JSON.parse(process.env.GBP_LOCATIONS!);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const repliedSet = loadRepliedSet();

  console.log(`[gbp-review-reply] 返信済みID: ${repliedSet.size}件\n`);

  let token: string;
  try {
    token = await getAccessToken();
    console.log("  ✓ アクセストークン取得");
  } catch (e) {
    console.error("  ✗ トークン取得失敗:", e);
    process.exit(1);
  }

  let totalReplied = 0;

  for (const [salonKey, locationName] of Object.entries(locations)) {
    if (totalReplied >= MAX_REPLIES_PER_RUN) break;
    console.log(`\n── ${SALON_INFO[salonKey]?.name ?? salonKey} ──`);

    let reviews: Review[];
    try {
      reviews = await fetchReviews(locationName, token);
      console.log(`  口コミ取得: ${reviews.length}件`);
    } catch (e) {
      console.error("  ✗ 口コミ取得失敗:", e);
      continue;
    }

    // 未返信かつ未処理の口コミを日付順（古い順）で処理
    const unreplied = reviews
      .filter((r) => !r.reviewReply && !repliedSet.has(r.reviewId))
      .sort((a, b) => a.createTime.localeCompare(b.createTime));

    console.log(`  未返信: ${unreplied.length}件`);
    if (unreplied.length === 0) continue;

    for (const review of unreplied) {
      if (totalReplied >= MAX_REPLIES_PER_RUN) break;
      const stars = STAR_MAP[review.starRating] ?? 5;
      const reviewerName = review.reviewer?.displayName ?? "お客様";
      console.log(`\n  [★${stars}] ${reviewerName} — ${review.createTime.slice(0, 10)}`);
      if (review.comment) console.log(`  "${review.comment.slice(0, 60)}..."`);

      let replyText: string;
      try {
        replyText = await generateReply(review, salonKey, client);
        console.log(`  生成: "${replyText.slice(0, 60)}..."`);
      } catch (e) {
        console.error("  ✗ 返信文生成失敗:", e);
        continue;
      }

      try {
        await postReply(review.name, replyText, token);
        repliedSet.add(review.reviewId);
        saveRepliedSet(repliedSet);
        console.log("  ✓ 返信投稿完了");
        totalReplied++;
      } catch (e) {
        console.error("  ✗ 返信投稿失敗:", e);
      }
    }
  }

  console.log(`\n[gbp-review-reply] 完了: ${totalReplied}件返信`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
