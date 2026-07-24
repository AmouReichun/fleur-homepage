import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentCached, type SalonContent } from "@/lib/content";
import { AREAS, getArea, servicesInArea } from "@/lib/areas";
import { breadcrumbSchema, salonFaqPageSchema } from "@/lib/structured-data";
import ReservationChannels from "@/app/components/ReservationChannels";
import GoogleReviewCTA from "@/app/components/GoogleReviewCTA";

const BASE = "https://fleur-group.jp";

type Props = { params: { area: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getArea(params.area);
  if (!area) return {};
  const title = `${area.name}の美容室・アイラッシュサロン｜fleur GROUP`;
  const description = `${area.name}でメニューから探す。髪質改善・白髪ぼかし・縮毛矯正・艶カラー・まつげパーマ・眉毛WAXなど、${area.name}のfleur GROUPで受けられるメニュー一覧と各店舗のご予約案内。`;
  const url = `${BASE}/area/${area.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function AreaPage({ params }: Props) {
  const area = getArea(params.area);
  if (!area) notFound();

  const services = servicesInArea(area);
  const content = await getContentCached();
  const salons = content.salons as unknown as Record<string, SalonContent>;
  const areaSalonKeys = area.salonKeys.filter((k) => salons[k]);

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "エリアから探す", url: `${BASE}/area/${area.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      {area.faq && area.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonFaqPageSchema(area.faq)) }} />
      )}

      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>{area.name}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Area — {area.name}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">
            {area.name}の美容室・アイラッシュサロン
          </h1>
          <p className="text-sm text-site-muted mt-3">
            {area.name}のfleur GROUPで受けられるメニューから探せます。
          </p>
        </div>
      </div>

      {/* メニュー一覧 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            {area.name}のメニュー
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/area/${area.slug}/${svc.slug}`}
                className="border border-site-greige p-5 hover:border-site-accent transition-colors group"
              >
                <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors">
                  {area.name}の{svc.name}
                </span>
                <span className="block text-[11px] text-site-muted mt-1">
                  {svc.world === "eyelash" ? "アイラッシュ" : "ヘア"}
                </span>
              </Link>
            ))}
          </div>
          <p className="text-center text-xs text-site-muted mt-8">
            他のエリア：
            {AREAS.filter((a) => a.slug !== area.slug).map((a) => (
              <Link key={a.slug} href={`/area/${a.slug}`} className="text-site-accent underline underline-offset-2 mx-1">
                {a.name}
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* 対応店舗・ご予約 */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="px-4 sm:px-6">
          <ReservationChannels
            salonOrder={areaSalonKeys}
            salons={salons}
            heading={`${area.name}の店舗・ご予約`}
            note="ご希望の方法でご予約いただけます"
          />
        </div>
      </section>

      {/* よくある質問 */}
      {area.faq && area.faq.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-site-greige">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              {area.name}のよくある質問
            </h2>
            <dl className="space-y-4">
              {area.faq.map((item, i) => (
                <div key={i} className="border border-site-greige p-5">
                  <dt className="text-sm font-medium text-site-text mb-2">Q. {item.q}</dt>
                  <dd className="text-sm text-site-muted leading-relaxed">A. {item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <GoogleReviewCTA salonKeys={areaSalonKeys} />
    </>
  );
}
