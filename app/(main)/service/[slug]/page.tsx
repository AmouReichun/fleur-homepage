import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentCached, type SalonContent } from "@/lib/content";
import { getService, getAllServiceSlugs } from "@/lib/services";
import { AREAS, offerSalonKeysInArea } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/structured-data";
import ReservationChannels from "@/app/components/ReservationChannels";
import GoogleReviewCTA from "@/app/components/GoogleReviewCTA";

const BASE = "https://fleur-group.jp";

type Props = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const svc = getService(params.slug);
  if (!svc) return {};
  const url = `${BASE}/service/${svc.slug}`;
  const worldLabel = svc.world === "eyelash" ? "アイラッシュサロン" : "美容室";
  const ogImage = `${BASE}/api/og?title=${encodeURIComponent(svc.name)}&salon=${encodeURIComponent(`高知市・香南市の${worldLabel}`)}&category=${svc.world}`;
  return {
    title: svc.title,
    description: svc.description,
    alternates: { canonical: url },
    openGraph: { title: svc.title, description: svc.description, url, images: [ogImage] },
    twitter: { card: "summary_large_image", title: svc.title, description: svc.description, images: [ogImage] },
  };
}

export default async function ServicePage({ params }: Props) {
  const svc = getService(params.slug);
  if (!svc) notFound();

  const content = await getContentCached();
  const salons = content.salons as unknown as Record<string, SalonContent>;
  const offerSalons = svc.salonKeys.filter((k) => salons[k]);

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "メニュー", url: `${BASE}/menu` },
    { name: svc.name, url: `${BASE}/service/${svc.slug}` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    serviceType: svc.name,
    description: svc.description,
    areaServed: ["高知市", "香南市"],
    provider: offerSalons.map((k) => ({
      "@type": svc.world === "eyelash" ? "BeautySalon" : "HairSalon",
      name: salons[k].name,
      address: salons[k].address,
      telephone: salons[k].phone,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: svc.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      {/* ヘッダー */}
      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/menu" className="hover:text-site-accent">メニュー</Link>
            <span className="mx-2">/</span>
            <span>{svc.name}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">
            {svc.world === "eyelash" ? "Eyelash & Brow" : "Hair"} — 高知市・香南市
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">{svc.name}</h1>
        </div>
      </div>

      {/* 写真＋リード */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {svc.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={svc.image} alt={`${svc.name}｜高知市・香南市の${svc.world === "eyelash" ? "アイラッシュサロン" : "美容室"}`} className="w-full h-56 sm:h-80 object-cover mb-8" loading="eager" />
          )}
          <p className="text-sm sm:text-base text-site-text leading-loose">{svc.lead}</p>
        </div>
      </section>

      {/* こんなお悩みの方へ */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">こんなお悩みの方へ</h2>
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

      {/* 特徴・効果 */}
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
          <p className="text-center text-xs text-site-muted mt-6">
            ※料金・施術時間の詳細は
            <Link href="/menu" className="text-site-accent underline underline-offset-2 mx-1">メニュー・料金</Link>
            をご覧ください。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">よくある質問</h2>
          <div className="divide-y divide-site-greige border-y border-site-greige bg-white">
            {svc.faq.map((f, i) => (
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
            <span>{svc.name}の症例・施術例を症例ブログで見る</span>
            <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
          </a>
        </div>
      </section>

      {/* エリアから探す（ローカルSEO内部リンク） */}
      <section className="py-10 bg-white border-t border-site-greige">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-site-accent mb-3 uppercase">Area</p>
          <p className="text-sm text-site-muted mb-5">エリアから{svc.name}を探す</p>
          <div className="flex flex-wrap justify-center gap-3">
            {AREAS.filter((a) => offerSalonKeysInArea(a, svc).length > 0).map((a) => (
              <Link
                key={a.slug}
                href={`/area/${a.slug}/${svc.slug}`}
                className="border border-site-greige px-5 py-2.5 text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors"
              >
                {a.name}の{svc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 対応店舗・ご予約 */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="px-4 sm:px-6">
          <ReservationChannels
            salonOrder={offerSalons}
            salons={salons}
            heading={`${svc.name}が受けられる店舗・ご予約`}
            note="ご希望の方法でご予約いただけます"
          />
        </div>
      </section>

      {/* クチコミ導線（MEO） */}
      <GoogleReviewCTA salonKeys={offerSalons} />
    </>
  );
}
