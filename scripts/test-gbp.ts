import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { isGbpConfigured, postBlogArticleToGbp } from "@/lib/gbp";

async function main() {
  console.log("GBP設定確認:", isGbpConfigured());

  if (!isGbpConfigured()) {
    console.error("❌ 環境変数が未設定です");
    process.exit(1);
  }

  console.log("\n--- テスト投稿（fleur ami / hair） ---");
  const result = await postBlogArticleToGbp({
    title: "テスト投稿 - 動作確認",
    excerpt: "これはGBP自動投稿の動作確認テストです。このメッセージは後ほど削除してください。",
    thumbnail: "/images/uploads/raffine/raffine-mqp27vis.jpg",
    slug: "test-gbp-verification",
    category: "hair",
    salonName: "fleur ami",
  });

  if (result) {
    console.log("✅ 投稿成功:", result);
  } else {
    console.log("⚠️ スキップ（ロケーション未設定）");
  }
}

main().catch((e) => {
  console.error("❌ エラー:", e instanceof Error ? e.message : e);
  process.exit(1);
});
