import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentCached, type SalonContent } from "@/lib/content";
import { getAreaService, getAllAreaServiceParams } from "@/lib/areas";
import { breadcrumbSchema, rivSalonSchema, fleuramiSalonSchema, raffineSalonSchema } from "@/lib/structured-data";
import ReservationChannels from "@/app/components/ReservationChannels";
import GoogleReviewCTA from "@/app/components/GoogleReviewCTA";

const BASE = "https://fleur-group.jp";

const SALON_SCHEMA: Record<string, object> = {
  riv: rivSalonSchema,
  fleurami: fleuramiSalonSchema,
  raffine: raffineSalonSchema,
};

type Props = { params: { area: string; service: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllAreaServiceParams();
}

export function generateMetadata({ params }: Props): Metadata {
  const data = getAreaService(params.area, params.service);
  if (!data) return {};
  const { area, svc } = data;
  const worldLabel = svc.world === "eyelash" ? "アイラッシュサロン" : "美容室";
  const title = `${area.name}の${svc.name}｜${worldLabel}fleur GROUP`;
  const description = `${area.name}で${svc.name}をお探しの方へ。${area.name}の${worldLabel}fleur GROUPが、${svc.name}の選び方・特徴・よくある質問を解説。施術例や料金、ご予約導線もご案内します。`;
  const url = `${BASE}/area/${area.slug}/${svc.slug}`;
  const ogImage = `${BASE}/api/og?title=${encodeURIComponent(`${area.name}の${svc.name}`)}&salon=${encodeURIComponent("fleur GROUP")}&category=${svc.world}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function AreaServicePage({ params }: Props) {
  const data = getAreaService(params.area, params.service);
  if (!data) notFound();
  const { area, svc, salonKeys } = data;

  const content = await getContentCached();
  const salons = content.salons as unknown as Record<string, SalonContent>;
  const offerSalons = salonKeys.filter((k) => salons[k]);
  const worldLabel = svc.world === "eyelash" ? "アイラッシュサロン" : "美容室";
  const salonNames = offerSalons.map((k) => salons[k]?.name ?? k).join("・");

  // エリア特化の FAQ（音声検索・AIO対策）をサービスFAQの先頭に追加
  const areaFaqLead = {
    q: `${area.name}で${svc.name}ができる${worldLabel}はどこですか？`,
    a: `${area.name}では「${salonNames}」で${svc.name}を受けられます。事前のカウンセリングで髪や目元の状態・ご希望を伺ったうえで施術内容をご提案します。ご予約はホットペッパービューティーやLINEから承っています。`,
  };
  const faqAll = [areaFaqLead, ...svc.faq];

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqAll.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "エリアから探す", url: `${BASE}/area/${area.slug}` },
    { name: `${area.name}の${svc.name}`, url: `${BASE}/area/${area.slug}/${svc.slug}` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${area.name}の${svc.name}`,
    serviceType: svc.name,
    description: svc.description,
    areaServed: { "@type": "City", name: area.name },
    provider: offerSalons.map((k) => ({
      "@type": svc.world === "eyelash" ? "BeautySalon" : "HairSalon",
      name: salons[k].name,
      address: salons[k].address,
      telephone: salons[k].phone,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      {offerSalons.filter((k) => SALON_SCHEMA[k]).map((k) => (
        <script key={k} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SALON_SCHEMA[k]) }} />
      ))}

      {/* ヘッダー */}
      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href={`/area/${area.slug}`} className="hover:text-site-accent">{area.name}</Link>
            <span className="mx-2">/</span>
            <span>{svc.name}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">
            {area.name} — {worldLabel}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">
            {area.name}の{svc.name}
          </h1>
          <p className="text-sm text-site-muted mt-3">{salonNames}</p>
        </div>
      </div>

      {/* 写真＋リード */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {svc.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={svc.image} alt={`${area.name}の${svc.name}｜${worldLabel}`} className="w-full h-56 sm:h-80 object-cover mb-8" loading="eager" />
          )}
          <p className="text-sm sm:text-base text-site-text leading-loose">
            {area.name}で{svc.name}をお探しの方へ。{salonNames}では、{svc.name}を得意メニューとしてご提供しています。{svc.lead}
          </p>
          <p className="text-center text-xs text-site-muted mt-6">
            メニュー全体の説明は
            <Link href={`/service/${svc.slug}`} className="text-site-accent underline underline-offset-2 mx-1">{svc.name}のページ</Link>
            もご覧ください。
          </p>
        </div>
      </section>

      {/* こんなお悩みの方へ */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            {area.name}でこんなお悩みの方へ
          </h2>
          <ul className="space-y-3 max-w-2xl mx-auto">
            {svc.forWhom.map((w) => (
              <li key={w} className="flex items-start gap-3 bg-white border border-site-greige p-4">
                <span className="text-site-accent flex-shrink-0">✓</span>
                <span className="text-sm text-site-text leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 特徴 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">{svc.name}の特徴</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {svc.points.map((p) => (
              <div key={p.title} className="border border-site-greige p-5">
                <h3 className="font-serif text-base font-medium text-site-text mb-2">{p.title}</h3>
                <p className="text-xs text-site-muted leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            {area.name}の{svc.name}・よくある質問
          </h2>
          <div className="divide-y divide-site-greige border-y border-site-greige bg-white">
            {faqAll.map((f, i) => (
              <details key={i} className="group p-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <span className="text-sm font-medium leading-relaxed"><span className="text-site-accent mr-2">Q.</span>{f.q}</span>
                  <span className="flex-shrink-0 text-site-muted text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="mt-4 text-sm text-site-muted leading-relaxed border-t border-site-greige pt-4"><span className="text-site-accent mr-2">A.</span>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 関連ブログ */}
      <section className="py-10 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <a href={`/blog${svc.blogUrl}`}
            className="inline-flex items-center gap-3 text-sm text-site-text hover:text-site-accent transition-colors group">
            <span>{svc.name}の症例・施術例を見る</span>
            <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
          </a>
        </div>
      </section>

      {/* 対応店舗・ご予約 */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="px-4 sm:px-6">
          <ReservationChannels
            salonOrder={offerSalons}
            salons={salons}
            heading={`${area.name}で${svc.name}を受けられる店舗・ご予約`}
            note="ご希望の方法でご予約いただけます"
          />
        </div>
      </section>

      {/* クチコミ導線（MEO） */}
      <GoogleReviewCTA salonKeys={offerSalons} />
    </>
  );
}
