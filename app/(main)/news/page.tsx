import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import NewsTabs, { type NewsSalonMeta } from "@/app/components/NewsTabs";

export const metadata: Metadata = {
  title: "最新情報",
  description:
    "高知県高知市・香南市で美容室 Riv. by fleurami・fleurami と、まつげ・まゆげ専門店 Raffine を展開する fleur GROUP のキャンペーン・お知らせ・最新情報。各店の新メニューや季節のお得な情報、休業日のご案内をお届けします。",
  alternates: { canonical: "https://fleur-group.jp/news" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "最新情報", url: "https://fleur-group.jp/news" },
];

export default async function NewsPage() {
  const content = await getContentCached();
  const news = content.news ?? [];
  const salonMeta: NewsSalonMeta[] = content.salonOrder.map((key) => {
    const s = content.salons[key as keyof typeof content.salons];
    return {
      key,
      name: s?.name ?? key,
      category: s?.salonType?.includes("アイラッシュ") ? "eyelash" : "hair",
    };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>最新情報</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">News</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">最新情報</h1>
        </div>
      </div>

      {/* 一覧（業態タブ＋店舗別） */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <NewsTabs news={news} salons={salonMeta} />
        </div>
      </section>

      {/* 関連ページ */}
      <nav className="py-10 bg-site-light border-t border-site-greige" aria-label="関連ページ">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs tracking-[0.3em] text-site-accent mb-4 uppercase">Related</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/salon" className="text-sm text-site-text hover:text-site-accent border border-site-greige px-4 py-2 transition-colors">店舗案内</Link>
            <Link href="/menu" className="text-sm text-site-text hover:text-site-accent border border-site-greige px-4 py-2 transition-colors">メニュー・料金</Link>
            <Link href="/staff" className="text-sm text-site-text hover:text-site-accent border border-site-greige px-4 py-2 transition-colors">スタッフ紹介</Link>
            <Link href="/blog" className="text-sm text-site-text hover:text-site-accent border border-site-greige px-4 py-2 transition-colors">施術ブログ</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
