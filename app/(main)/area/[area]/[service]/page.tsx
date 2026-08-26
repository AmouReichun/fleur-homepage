import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContentCached, type SalonContent } from "@/lib/content";
import { getAreaService, getAllAreaServiceParams, offerSalonKeysInArea } from "@/lib/areas";
import { getService } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/structured-data";
import { getCaseStudies } from "@/lib/blog/case-studies";
import type { SalonKey } from "@/lib/blog/internal-links";
import ReservationChannels from "@/app/components/ReservationChannels";
import GoogleReviewCTA from "@/app/components/GoogleReviewCTA";
import CaseStudySection from "@/app/components/CaseStudySection";

const BASE = "https://fleur-group.jp";

const SALON_ADDRESSES: Record<string, { streetAddress: string; addressLocality: string; postalCode: string }> = {
  riv: { streetAddress: "南川添9-21 フルールアミー3 2F", addressLocality: "高知市", postalCode: "781-0082" },
  fleurami: { streetAddress: "野市町西野230", addressLocality: "香南市", postalCode: "781-5232" },
  raffine: { streetAddress: "はりまや町1-4-8 TNはりまやビル3F", addressLocality: "高知市", postalCode: "780-0822" },
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
  const title = `高知県${area.name}の${svc.name}｜${worldLabel}fleur GROUP`;
  const description = `高知県${area.name}で${svc.name}をお探しの方へ。高知県${area.name}の${worldLabel}fleur GROUPが、${svc.name}の選び方・特徴・よくある質問を解説。施術例や料金、ご予約導線もご案内します。`;
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

  // 関連メニュー：同エリアで受けられるものはエリアページへ、それ以外はメニューページへ内部リンク
  const relatedLinks = (svc.related ?? [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((r) => {
      const inArea = offerSalonKeysInArea(area, r).length > 0;
      return { name: r.name, forWhom: r.forWhom[0], href: inArea ? `/area/${area.slug}/${r.slug}` : `/service/${r.slug}` };
    });
  // この店舗ページへの導線（アイラッシュ＝Raffineなど、エリア内提供店舗へ戻れるように）
  const primarySalonKey = offerSalons[0];
  const primarySalon = primarySalonKey ? salons[primarySalonKey] : undefined;

  // このエリア×メニューの最新の施術事例（店舗×メニューで自動抽出。手動リンク不要）
  const caseStudies = getCaseStudies({
    salonKeys: offerSalons as SalonKey[],
    serviceSlug: svc.slug,
    category: svc.world,
    limit: 6,
  });

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
      "@id": `${BASE}/salon/${k}`,
      name: salons[k].name,
      telephone: salons[k].phone,
      address: {
        "@type": "PostalAddress",
        ...(SALON_ADDRESSES[k] ?? {}),
        addressRegion: "高知県",
        addressCountry: "JP",
      },
      url: `${BASE}/salon/${k}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
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
            <div className="relative w-full h-56 sm:h-80 mb-8">
              <Image src={svc.image} alt={`${area.name}の${svc.name}｜${worldLabel}`} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 896px" />
            </div>
          )}
          <p className="text-sm sm:text-base text-site-text leading-loose">
            {area.name}で{svc.name}をお探しの方へ。{salonNames}では、{svc.name}を得意メニューとしてご提供しています。{svc.lead}
          </p>
          {svc.body && svc.body.length > 0 && (
            <div className="mt-6 space-y-4">
              {svc.body.map((para, i) => (
                <p key={i} className="text-sm text-site-text leading-loose">{para}</p>
              ))}
            </div>
          )}
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
              <div key={i} className="p-5">
                <p className="text-sm font-medium leading-relaxed mb-3"><span className="text-site-accent mr-2">Q.</span>{f.q}</p>
                <p className="text-sm text-site-muted leading-relaxed border-t border-site-greige pt-3"><span className="text-site-accent mr-2">A.</span>{f.a}</p>
              </div>
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

      {/* 最新の施術事例（店舗×メニューで自動抽出・自動更新） */}
      <CaseStudySection
        posts={caseStudies}
        world={svc.world}
        heading={`${primarySalon?.name ?? salonNames}の${svc.name} 最新施術事例`}
        subheading={`${area.name}で実際に${svc.name}を担当したスタイリストの症例です`}
        moreHref={`/blog${svc.blogUrl}`}
        moreLabel={`${svc.name}の施術事例をもっと見る`}
        bg="bg-white"
      />

      {/* 関連メニュー（内部リンク） */}
      {relatedLinks.length > 0 && (
        <section className="py-12 sm:py-16 bg-white border-t border-site-greige">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">関連メニュー</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedLinks.map((r) => (
                <Link key={r.href} href={r.href} className="block bg-white border border-site-greige p-5 hover:border-site-accent transition-colors group">
                  <span className="block font-serif text-base font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">{r.name}</span>
                  <span className="block text-xs text-site-muted leading-relaxed">{r.forWhom}</span>
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] text-site-accent">詳しく見る<span className="w-4 h-px bg-current group-hover:w-6 transition-all duration-300" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 店舗ページへ戻る導線 */}
      {primarySalon && primarySalonKey && (
        <section className="py-10 bg-site-light border-t border-site-greige">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-site-muted mb-4">{svc.name}を提供している店舗</p>
            <Link href={`/salon/${primarySalonKey}`} className="inline-flex items-center gap-3 border border-site-greige bg-white px-6 py-3 text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors group">
              <span>{primarySalon.name}の店舗ページを見る</span>
              <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
            </Link>
          </div>
        </section>
      )}

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
