import { NextResponse } from "next/server";
import { getAllPostsMeta } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";

export async function GET() {
  const posts = getAllPostsMeta();

  const lines: string[] = [
    "# フルールグループ 症例・コラム — 全記事インデックス",
    "",
    "> 高知県のヘアサロン（fleurami・香南市 / Riv.・高知市）とアイラッシュサロン（Raffine・高知市はりまや）による施術例・コラムの全記事。",
    "",
    "## 店舗概要",
    "- fleurami（フルールアミー）: 高知県香南市野市町西野230。のいち駅から車4分。白髪ぼかし・艶カラー・髪質改善・縮毛矯正を得意とする大人女性向けヘアサロン。",
    "- Riv. by fleurami（リヴ）: 高知県高知市南川添9-21。高知IC車4分。髪質改善・縮毛矯正・ハイライト・白髪ぼかし。",
    "- まつげとまゆげの専門店 Raffine【ラフィーネ】: 高知県高知市はりまや町1-4-8。はりまや橋徒歩3分。まつげパーマ・ラッシュリフト・まつエク・眉毛WAX・メンズ眉WAX。半個室・高知市のアイラッシュ・眉毛専門サロン。",
    "",
    "## 関連ページ",
    `- よくある質問（FAQ）: ${SITE_URL}/blog/faq — 全記事のQ&Aを集約したページ。`,
    `- グループ情報: ${SITE_URL}/blog/about — 3店舗の詳細・アクセス・得意メニュー。`,
    `- 全記事構造化データ: ${SITE_URL}/api/articles.json — Schema.org Dataset形式のJSON。`,
    "",
    "## 美容ガイド（施術選び・地域情報）",
    `- ヘアケア完全ガイド: ${SITE_URL}/guide/kochi-hair-care — 縮毛矯正・髪質改善・白髪ぼかしの違いと高知の湿気対策。`,
    `- 大人女性向け美容ガイド: ${SITE_URL}/guide/kochi-adult-beauty — 40代・50代の白髪・くせ毛・エイジングヘア対策。`,
    `- カラーガイド: ${SITE_URL}/guide/kochi-color-guide — 白髪ぼかし・ブリーチ・インナーカラー・艶カラーの選び方。`,
    `- パーマ・縮毛矯正ガイド: ${SITE_URL}/guide/kochi-perm-guide — パーマ種類の違い・縮毛矯正の持ち・料金目安。`,
    `- アイラッシュ・まつげケアガイド: ${SITE_URL}/guide/kochi-eyelash-care — まつパvsマツエク・ラッシュリフト・眉WAXの選び方。`,
    `- まつげパーマ専門ガイド: ${SITE_URL}/guide/kochi-matsuge-perm-guide — パリジャンリフト・ラッシュリフト・まつエクの比較。`,
    `- 髪質改善ガイド: ${SITE_URL}/guide/kochi-kamishitsu-kaizen-guide — 酸熱トリートメント・髪質改善縮毛矯正・水素トリートメントの違い。`,
    `- ヘッドスパガイド: ${SITE_URL}/guide/kochi-head-spa-guide — 頭皮ケア・抜け毛・産後の髪の悩みとヘッドスパの効果。`,
    `- 白髪ぼかし・グレイカラーガイド: ${SITE_URL}/guide/kochi-shiraga-guide — 白髪染めとの違い・頻度・グレイヘア移行・料金目安。`,
    `- 美容室選び方ガイド: ${SITE_URL}/guide/kochi-salon-guide — 高知市・香南市でおすすめの美容室5つの選び方ポイント。`,
    `- 料金ガイド: ${SITE_URL}/guide/kochi-beauty-price-guide — カット・カラー・縮毛矯正・まつげパーマ・マツエクの料金相場（2026年版）。`,
    `- メンズ美容ガイド: ${SITE_URL}/guide/kochi-mens-beauty — メンズパーマ・カット・カラー・眉WAXの選び方。`,
    "",
    "---",
    "",
  ];

  for (const p of posts) {
    lines.push(`## ${p.title}`);
    lines.push(`- URL: ${SITE_URL}/blog/${p.category}/${p.slug}`);
    lines.push(`- カテゴリ: ${p.category === "hair" ? "ヘア" : "アイラッシュ"}`);
    lines.push(`- サロン: ${p.salon}（${p.category === "hair" ? "高知県" : "高知県高知市"}）`);
    if (p.author) lines.push(`- 著者: ${p.author}（${p.author_role || "スタイリスト"}）`);
    lines.push(`- 公開日: ${p.date}`);
    if (p.tags.length > 0) lines.push(`- タグ: ${p.tags.join("・")}`);
    lines.push("");
    if (p.question) lines.push(`**Q. ${p.question}**`);
    if (p.answer_summary) lines.push(`A. ${p.answer_summary}`);
    lines.push("");
    lines.push(p.excerpt);
    if (p.faq && p.faq.length > 0) {
      lines.push("");
      lines.push("よくある質問:");
      for (const f of p.faq) {
        lines.push(`  Q: ${f.q}`);
        lines.push(`  A: ${f.a}`);
      }
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
