import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import NewsTabs, { type NewsSalonMeta } from "@/app/components/NewsTabs";

export const metadata: Metadata = {
  title: "最新情報",
  description: "fleur GROUPのキャンペーン・お知らせ・最新情報をお届けします。",
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
      <div className="bg-site-light py-10 sm:py-14">
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
    </>
  );
}
