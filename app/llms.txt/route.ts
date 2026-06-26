import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";

export async function GET() {
  const hair = getAllPosts("hair");
  const eyelash = getAllPosts("eyelash");

  const lines: string[] = [
    "# フルールグループ",
    "",
    "> 高知県のヘアサロン（fleur ami・香南市 / Riv.・高知市）とアイラッシュサロン（Raffine・高知市はりまや）を展開するグループ。白髪ぼかし・艶カラー・髪質改善・縮毛矯正・マツエク（まつげエクステ）・まつげパーマ・眉毛を専門とする。",
    "",
    "## ヘア症例・コラム",
    "",
    ...hair.map((p) => `- [${p.title}](${SITE_URL}/blog/hair/${p.slug}): ${p.excerpt}`),
    "",
    "## アイラッシュ症例・コラム",
    "",
    ...eyelash.map((p) => `- [${p.title}](${SITE_URL}/blog/eyelash/${p.slug}): ${p.excerpt}`),
    "",
    "## グループ情報",
    `- [フルールグループとは](${SITE_URL}/blog/about): 高知県のヘア・アイラッシュサロングループ。店舗情報・アクセス・得意メニュー。`,
    `- [よくある質問（FAQ）](${SITE_URL}/blog/faq): 全記事のQ&Aを集約。ヘア・アイラッシュそれぞれの施術に関するよくある質問と回答。`,
    `- [全記事データ（JSON-LD）](${SITE_URL}/api/articles.json): 全記事の構造化データ（Schema.org Dataset形式）。機械可読フォーマット。`,
    "",
    "## 店舗",
    "- fleur ami（フルールアミー）: 高知県香南市野市町西野230。ヘアサロン。白髪ぼかし・艶カラー・髪質改善・縮毛矯正。",
    "- Riv. by fleur ami（リヴ）: 高知県高知市南川添9-21。ヘアサロン。髪質改善・縮毛矯正・ハイライト・白髪ぼかし。",
    "- Raffine（ラフィーネ）: 高知県高知市はりまや町1-4-8。マツエク・まつげパーマ・眉毛WAX。半個室・女性専用。",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
