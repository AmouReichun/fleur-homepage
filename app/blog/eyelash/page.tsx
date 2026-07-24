import { Metadata } from "next";
import { getAllPosts, getAvailableMonths } from "@/lib/blog/posts";
import { collectionPageSchema, breadcrumbSchema } from "@/lib/blog/structured-data";
import EyelashTagFilter from "@/components/EyelashTagFilter";
import MonthArchiveNav from "@/components/MonthArchiveNav";

export function generateMetadata({
  searchParams,
}: {
  searchParams: { tag?: string };
}): Metadata {
  const base: Metadata = {
    title: "まつげ・まゆげ症例・コラム",
    description:
      "高知市「Raffine」のアイリストによるまつ毛パーマ・マツエク・眉毛WAXの施術例とコラム。韓国束感・フラットラッシュ・パリジャンリフト・眉毛WAXについて写真付きで詳しく解説。",
    alternates: { canonical: "/blog/eyelash" },
  };
  if (searchParams.tag) base.robots = { index: false, follow: true };
  return base;
}

export default function EyelashPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const posts = getAllPosts("eyelash");
  const months = getAvailableMonths("eyelash");
  const activeTag = searchParams.tag ?? "";
  const col = collectionPageSchema(
    "まつげ・まゆげ症例・コラム",
    "/blog/eyelash",
    "Raffine（高知市はりまや）のアイリストによるまつ毛パーマ・マツエク・まゆげの症例とコラム",
    posts,
  );
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "アイラッシュ", url: "/blog/eyelash" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(col) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <div className="bg-eye-bg min-h-screen">
      {/* Hero — Raffine ブランドヘッダー */}
      <div className="relative overflow-hidden py-14 px-4" style={{
        background: "linear-gradient(160deg, #FBF8F8 0%, #F9EEF1 50%, #F5E6EA 100%)"
      }}>
        {/* 装飾：背景の大きな薄い文字 */}
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[110px] sm:text-[175px] font-dancing leading-none select-none pointer-events-none whitespace-nowrap"
          style={{ color: "rgba(200,120,138,0.13)", lineHeight: 1 }}
          aria-hidden="true"
        >
          Eyelash
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          {/* ブランドバッジ */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
            <span className="text-xs tracking-[0.2em] text-eye-accent font-jakarta uppercase">
              Raffine — Lash Perm &amp; Extensions &amp; Brow
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
          </div>

          <h1 className="font-kaku text-2xl sm:text-3xl font-medium text-eye-text mb-3 leading-snug">
            まつげ・まゆげ症例・コラム
          </h1>

          <p className="text-sm text-eye-muted leading-relaxed max-w-md">
            まつ毛パーマ・マツエク・まゆげについて、
            <br className="hidden sm:block" />
            Raffineのアイリストが施術の実例とともに解説します。
          </p>

          {/* キーワードタグ */}
          <div className="flex flex-wrap gap-2 mt-5">
            {["韓国束感マツエク", "まつげパーマ", "フラットラッシュ", "眉毛WAX", "パリジェンヌ"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-white/80 text-eye-accent border border-eye-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-wide mx-auto px-4 py-10">
        {posts.length === 0 ? (
          <p className="text-eye-muted text-sm">記事はまだありません。</p>
        ) : (
          <EyelashTagFilter posts={posts} activeTag={activeTag} />
        )}
        <MonthArchiveNav months={months} category="eyelash" />
      </div>
    </div>
    </>
  );
}
