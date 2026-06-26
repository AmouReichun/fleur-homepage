import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByYearMonth, getAvailableMonths } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";
import MonthArchiveNav from "@/components/MonthArchiveNav";
import { breadcrumbSchema } from "@/lib/blog/structured-data";

type Props = { params: { year: string; month: string } };

export async function generateStaticParams() {
  return getAvailableMonths("hair").map(({ year, month }) => ({ year, month }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month } = params;
  const label = `${year}年${parseInt(month)}月`;
  return {
    title: `${label}のヘア記事`,
    description: `${label}に公開されたfleur ami・Riv.のヘアカラー・髪質改善・縮毛矯正の症例とコラム一覧。`,
    alternates: { canonical: `/blog/hair/archive/${year}/${month}` },
  };
}

const woodBg = {
  background: `
    repeating-linear-gradient(
      88deg,
      transparent 0px, transparent 3px,
      rgba(160,120,72,0.025) 3px, rgba(160,120,72,0.04) 4px,
      transparent 4px, transparent 11px,
      rgba(160,120,72,0.02) 11px, rgba(160,120,72,0.035) 12px,
      transparent 12px, transparent 22px
    ),
    linear-gradient(160deg, #F8F2EA 0%, #F1E7D8 50%, #EAD9C4 100%)
  `,
};

export default function HairArchivePage({ params }: Props) {
  const { year, month } = params;
  const posts = getPostsByYearMonth("hair", year, month);
  if (posts.length === 0) notFound();

  const months = getAvailableMonths("hair");
  const label = `${year}年${parseInt(month)}月`;

  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "ヘア", url: "/blog/hair" },
    { name: label, url: `/blog/hair/archive/${year}/${month}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />

      <div className="min-h-screen" style={{ background: "#F8F2EA" }}>
        {/* Hero */}
        <div className="relative overflow-hidden py-12 px-4 border-b border-hair-border" style={woodBg}>
          <div className="max-w-wide mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
              <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">
                Hair Archive
              </span>
              <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
            </div>
            <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-2 tracking-wide">
              {label}のヘア記事
            </h1>
            <p className="text-sm text-hair-muted">{posts.length}件</p>

            <div className="flex items-center gap-4 mt-5">
              <Link
                href="/blog/hair"
                className="text-xs font-cormorant tracking-wide text-hair-muted hover:text-hair-accent-warm transition-colors"
              >
                ← ヘア一覧へ
              </Link>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="max-w-wide mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} world="hair" />
            ))}
          </div>

          {/* 月別ナビ */}
          <MonthArchiveNav months={months} category="hair" activeYear={year} activeMonth={month} />
        </div>
      </div>
    </>
  );
}
