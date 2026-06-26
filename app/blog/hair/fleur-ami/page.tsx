import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";
import { localBusinessSchema, breadcrumbSchema, collectionPageSchema } from "@/lib/blog/structured-data";

export const metadata: Metadata = {
  title: "fleur ami ヘア症例・コラム",
  description:
    "香南市のヘアサロン fleur ami によるヘアカラー・髪質改善・白髪ぼかし・縮毛矯正の症例とコラム。大人女性（40代前後）向けのスタイル提案。",
  alternates: { canonical: "/blog/hair/fleur-ami" },
};

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

export default function FleurAmiPage() {
  const posts = getAllPosts("hair").filter((p) => p.salon === "fleur ami");
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "ヘア", url: "/blog/hair" },
    { name: "fleur ami", url: "/blog/hair/fleur-ami" },
  ]);
  const col = collectionPageSchema(
    "fleur ami ヘア症例・コラム",
    "/blog/hair/fleur-ami",
    "香南市のヘアサロン fleur ami によるヘアカラー・髪質改善・白髪ぼかし・縮毛矯正の症例とコラム",
    posts,
  );

  return (
    <div className="min-h-screen" style={{ background: "#F8F2EA" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema("fleurami")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(col) }} />

      {/* Hero */}
      <div
        className="relative overflow-hidden py-14 px-4 border-b border-hair-border"
        style={woodBg}
      >
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] sm:text-[160px] font-cormorant font-semibold leading-none select-none pointer-events-none italic whitespace-nowrap"
          style={{ color: "rgba(160,120,72,0.08)", lineHeight: 1 }}
          aria-hidden="true"
        >
          fleur ami
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
            <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">
              fleur ami — Hair Salon / 香南市
            </span>
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
          </div>

          <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3 leading-snug tracking-wide">
            fleur ami ヘア症例・コラム
          </h1>

          <p className="text-sm text-hair-muted leading-relaxed max-w-md">
            高知県香南市のヘアサロン fleur ami のスタイリストが、
            <br className="hidden sm:block" />
            カラー・髪質改善・白髪ぼかしを症例とともに解説します。
          </p>

          {/* サロン情報 */}
          <div className="flex flex-wrap gap-3 mt-5 text-xs text-hair-muted">
            <span>📍 高知県香南市野市町西野230</span>
            <span>🕐 9:00〜18:00（月・第1/3火 定休）</span>
            <span>🚗 のいち駅から車4分 / 駐車場7台</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {["艶カラー", "白髪ぼかし", "髪質改善", "縮毛矯正", "カット"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 border border-hair-accent-warm/40 text-hair-accent-warm bg-white/50 tracking-wide"
                  style={{ borderRadius: "2px" }}
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-4 mt-5">
            <a
              href="https://beauty.hotpepper.jp/slnH000528388/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-wider uppercase font-cormorant text-hair-accent-warm"
            >
              HotPepper →
            </a>
            <a
              href="https://www.instagram.com/fleurami_info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-wider uppercase font-cormorant text-hair-accent-warm"
            >
              Instagram →
            </a>
            <Link
              href="/blog/hair"
              className="text-[11px] tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors"
            >
              ← ヘア一覧に戻る
            </Link>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-wide mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <p className="text-hair-muted text-sm">記事はまだありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} world="hair" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
