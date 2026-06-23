import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "最新情報",
  description: "fleurami GROUPのキャンペーン・お知らせ・最新情報をお届けします。",
  alternates: { canonical: "https://fleurami-group.jp/news" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "最新情報", url: "https://fleurami-group.jp/news" },
];

const SALON_LABELS: Record<string, string> = {
  fleurami: "fleurami",
  riv: "Riv.by fleurami",
  raffine: "Raffine",
};

export default function NewsPage() {
  const { news } = getContent();
  const sorted = [...(news ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

      {/* 一覧 */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {sorted.length === 0 ? (
            <p className="text-center text-site-muted text-sm py-16">現在お知らせはありません</p>
          ) : (
            <div className="divide-y divide-site-greige">
              {sorted.map((item) => (
                <article key={item.id} className="py-8 first:pt-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <time
                      dateTime={item.date}
                      className="text-xs text-site-muted tabular-nums"
                    >
                      {item.date.replace(/-/g, ".")}
                    </time>
                    {item.salon && (
                      <span className="text-[10px] tracking-wider text-site-accent border border-site-accent/40 px-2 py-0.5">
                        {SALON_LABELS[item.salon] ?? item.salon}
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-site-text mb-3">
                    {item.title}
                  </h2>
                  {item.imageSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full max-h-80 object-cover mb-4"
                    />
                  )}
                  <p className="text-sm text-site-muted leading-relaxed whitespace-pre-line">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
