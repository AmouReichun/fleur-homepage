import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import { localBusinessSchema, breadcrumbSchema } from "@/lib/blog/structured-data";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Raffine アイラッシュ症例・コラム | まつ毛パーマ・マツエク・まゆげ",
  description:
    "高知市はりまや町のまつ毛・まゆげサロン Raffine のアイリストによる施術例とコラム。韓国束感マツエク・まつ毛パーマ・眉毛WAX・フラットラッシュ・パリジェンヌリフト。",
  alternates: { canonical: "/blog/eyelash/raffine" },
};

export default function RaffinePage() {
  const posts = getAllPosts("eyelash").filter((p) => p.salon === "Raffine");
  const biz = localBusinessSchema("raffine");
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "アイラッシュ", url: "/blog/eyelash" },
    { name: "Raffine", url: "/blog/eyelash/raffine" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(biz) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FBF8F8 0%, #F9F5F6 100%)" }}>
        {/* パンくず */}
        <nav className="px-4 py-3 border-b border-eye-border bg-white/70 backdrop-blur-sm">
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs text-eye-muted">
            <Link href="/" className="hover:text-eye-text transition-colors">トップ</Link>
            <span className="text-eye-border">›</span>
            <Link href="/blog/eyelash" className="hover:text-eye-text transition-colors">アイラッシュ</Link>
            <span className="text-eye-border">›</span>
            <span className="text-eye-text">Raffine</span>
          </div>
        </nav>

        {/* Hero */}
        <div
          className="relative overflow-hidden py-14 px-4 border-b border-eye-border"
          style={{ background: "linear-gradient(160deg, #FBF8F8 0%, #F9EEF1 50%, #F5E6EA 100%)" }}
        >
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[110px] sm:text-[175px] font-dancing leading-none select-none pointer-events-none whitespace-nowrap"
            style={{ color: "rgba(200,120,138,0.1)", lineHeight: 1 }}
            aria-hidden="true"
          >
            Raffine
          </span>

          <div className="max-w-wide mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
              <span className="text-xs tracking-[0.2em] text-eye-accent font-jakarta uppercase">
                Raffine — Lash &amp; Brow Studio
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
            </div>

            <h1 className="font-kaku text-2xl sm:text-3xl font-medium text-eye-text mb-4 leading-snug">
              Raffine アイラッシュ症例・コラム
            </h1>
            <p className="text-sm text-eye-muted leading-relaxed max-w-lg mb-6">
              高知市はりまや町のまつ毛・まゆげ専門サロン Raffine のアイリストが、
              施術の実例とともにまつ毛パーマ・マツエク・まゆげWAXについて解説します。
            </p>

            {/* サロン情報 */}
            <div className="flex flex-wrap gap-4 text-xs text-eye-muted mb-6">
              <span>📍 高知県高知市はりまや町1-4-8 TNはりまやビル3F</span>
              <span>🕐 10:00〜19:00（不定休）</span>
            </div>

            {/* 得意メニュー */}
            <div className="flex flex-wrap gap-2">
              {["韓国束感マツエク", "まつ毛パーマ", "フラットラッシュ", "眉毛WAX", "パリジェンヌリフト"].map((menu) => (
                <Link
                  key={menu}
                  href={`/blog/eyelash/tag/${encodeURIComponent(menu)}`}
                  className="text-xs px-3 py-1 rounded-full bg-white/80 text-eye-accent border border-eye-border hover:bg-eye-accent hover:text-white transition-colors"
                >
                  {menu}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* アイリスト紹介 */}
        <div className="max-w-wide mx-auto px-4 py-8 border-b border-eye-border">
          <p className="text-[10px] tracking-[0.25em] uppercase text-eye-accent font-jakarta mb-4">Stylist</p>
          <div className="flex flex-wrap gap-3">
            {["安井未琉", "尾崎あい"].map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{ background: "linear-gradient(135deg, #FDF4F6, #F9EEF3)", border: "1px solid #E8D0D8" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
                <span className="font-kaku text-eye-text">{name}</span>
                <span className="text-[10px] text-eye-muted">アイリスト</span>
              </div>
            ))}
          </div>
        </div>

        {/* 予約CTA */}
        <div className="max-w-wide mx-auto px-4 py-6 border-b border-eye-border">
          <a
            href="https://beauty.hotpepper.jp/kr/slnH000767549/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs tracking-[0.15em] font-jakarta rounded-full transition-opacity hover:opacity-80"
            style={{ background: "#C8788A", color: "#FFFFFF" }}
          >
            ホットペッパーで予約する →
          </a>
        </div>

        {/* 記事一覧 */}
        <div className="max-w-wide mx-auto px-4 py-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-eye-accent font-jakarta mb-6">
            Articles — {posts.length} 件
          </p>
          {posts.length === 0 ? (
            <p className="text-eye-muted text-sm">記事はまだありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="eyelash" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
