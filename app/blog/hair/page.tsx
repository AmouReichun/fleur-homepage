import { Metadata } from "next";
import { getAllPosts, getAvailableMonths } from "@/lib/blog/posts";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/blog/structured-data";
import HairSalonFilter from "@/components/HairSalonFilter";
import MonthArchiveNav from "@/components/MonthArchiveNav";

export const metadata: Metadata = {
  title: "ヘア症例・コラム",
  description:
    "fleur ami（香南市）・Riv.（高知市）のスタイリストによるヘアカラー・髪質改善・白髪ぼかし・縮毛矯正の症例とコラム。",
  alternates: { canonical: "/blog/hair" },
};

// 薄い木目グラデーション（再利用）
const woodBg = {
  background: `
    repeating-linear-gradient(
      88deg,
      transparent 0px,
      transparent 3px,
      rgba(160,120,72,0.025) 3px,
      rgba(160,120,72,0.04)  4px,
      transparent 4px,
      transparent 11px,
      rgba(160,120,72,0.02)  11px,
      rgba(160,120,72,0.035) 12px,
      transparent 12px,
      transparent 22px
    ),
    linear-gradient(160deg, #F8F2EA 0%, #F1E7D8 50%, #EAD9C4 100%)
  `,
};

export default function HairPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const posts = getAllPosts("hair");
  const months = getAvailableMonths("hair");
  const activeTag = searchParams.tag ?? "";
  const col = collectionPageSchema(
    "ヘア症例・コラム",
    "/blog/hair",
    "fleur ami（香南市）・Riv.（高知市）のスタイリストによるヘアカラー・髪質改善・白髪ぼかし・縮毛矯正の症例とコラム",
    posts,
  );
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "ヘア", url: "/blog/hair" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(col) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <div className="min-h-screen" style={{ background: "#F8F2EA" }}>
      {/* Hero — fleur ami / Riv. ヘッダー */}
      <div className="relative overflow-hidden py-14 px-4 border-b border-hair-border" style={woodBg}>
        {/* 装飾：背景の薄い透かし文字 */}
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] sm:text-[190px] font-cormorant font-semibold leading-none select-none pointer-events-none italic whitespace-nowrap"
          style={{ color: "rgba(160,120,72,0.08)", lineHeight: 1 }}
          aria-hidden="true"
        >
          Hair
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          {/* ブランドバッジ */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
            <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">
              fleur ami &amp; Riv. — Hair Salon
            </span>
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
          </div>

          <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3 leading-snug tracking-wide">
            ヘア症例・コラム
          </h1>

          <p className="text-sm text-hair-muted leading-relaxed max-w-md">
            fleur ami（香南市）と Riv.（高知市）のスタイリストが、
            <br className="hidden sm:block" />
            カラー・髪質改善・白髪ぼかしを症例とともに解説します。
          </p>

          {/* キーワードタグ */}
          <div className="flex flex-wrap gap-2 mt-5">
            {["白髪ぼかし", "艶カラー", "髪質改善", "縮毛矯正", "ハイライト"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border border-hair-accent-warm/40 text-hair-accent-warm bg-white/50 tracking-wide"
                style={{ borderRadius: "2px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Articles with salon filter */}
      <div className="max-w-wide mx-auto px-4 py-10">
        <HairSalonFilter posts={posts} activeTag={activeTag} />
        <MonthArchiveNav months={months} category="hair" />
      </div>
    </div>
    </>
  );
}
