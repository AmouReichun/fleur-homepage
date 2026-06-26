import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByYearMonth, getAvailableMonths } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";
import MonthArchiveNav from "@/components/MonthArchiveNav";
import { breadcrumbSchema } from "@/lib/blog/structured-data";

type Props = { params: { year: string; month: string } };

export async function generateStaticParams() {
  return getAvailableMonths("eyelash").map(({ year, month }) => ({ year, month }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month } = params;
  const label = `${year}年${parseInt(month)}月`;
  return {
    title: `${label}のアイラッシュ記事`,
    description: `${label}に公開されたRaffineのまつ毛パーマ・マツエク・まゆげの症例とコラム一覧。`,
    alternates: { canonical: `/blog/eyelash/archive/${year}/${month}` },
  };
}

export default function EyelashArchivePage({ params }: Props) {
  const { year, month } = params;
  const posts = getPostsByYearMonth("eyelash", year, month);
  if (posts.length === 0) notFound();

  const months = getAvailableMonths("eyelash");
  const label = `${year}年${parseInt(month)}月`;

  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "アイラッシュ", url: "/blog/eyelash" },
    { name: label, url: `/blog/eyelash/archive/${year}/${month}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FBF8F8 0%, #F9EEF1 100%)" }}>
        {/* Hero */}
        <div
          className="relative overflow-hidden py-12 px-4 border-b border-eye-border"
          style={{ background: "linear-gradient(160deg, #FBF8F8 0%, #F9EEF1 50%, #F5E6EA 100%)" }}
        >
          <div className="max-w-wide mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
              <span className="text-xs tracking-[0.2em] text-eye-accent font-jakarta uppercase">
                Eyelash Archive
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-eye-accent" />
            </div>
            <h1 className="font-kaku text-2xl sm:text-3xl font-medium text-eye-text mb-2">
              {label}のアイラッシュ記事
            </h1>
            <p className="text-sm text-eye-muted">{posts.length}件</p>

            <div className="flex items-center gap-4 mt-5">
              <Link
                href="/blog/eyelash"
                className="text-xs font-jakarta tracking-wide text-eye-muted hover:text-eye-accent transition-colors"
              >
                ← アイラッシュ一覧へ
              </Link>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-wide mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} world="eyelash" />
            ))}
          </div>

          {/* 月別ナビ */}
          <MonthArchiveNav months={months} category="eyelash" activeYear={year} activeMonth={month} />
        </div>
      </div>
    </>
  );
}
