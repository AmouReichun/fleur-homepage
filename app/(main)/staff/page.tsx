import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import StaffTabs from "@/app/components/StaffTabs";
import ReservationChannels from "@/app/components/ReservationChannels";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description:
    "fleur GROUPのスタッフ紹介。香南市「fleurami」に美容師歴20年超のトップスタイリストが在籍。高知市「Riv. by fleurami」「Raffine」のスタイリスト・アイリストも。指名予約はWeb・LINEから承ります。",
  alternates: { canonical: "https://fleur-group.jp/staff" },
};

const BASE = "https://fleur-group.jp";

const SALON_URLS: Record<string, string> = {
  fleurami: `${BASE}/salon/fleurami`,
  "Riv. by fleurami": `${BASE}/salon/riv`,
  Raffine: `${BASE}/salon/raffine`,
};

const SALON_TYPE: Record<string, string> = {
  fleurami: "HairSalon",
  "Riv. by fleurami": "HairSalon",
  Raffine: "BeautySalon",
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "スタッフ紹介", url: `${BASE}/staff` },
];

export default async function StaffPage() {
  const content = await getContentCached();

  const personSchemas = content.staff
    .filter((m) => m.slug)
    .map((m) => ({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE}/staff/${m.slug}`,
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      ...(m.imageSrc ? { image: m.imageSrc.startsWith("http") ? m.imageSrc : `${BASE}${m.imageSrc}` } : {}),
      url: `${BASE}/staff/${m.slug}`,
      worksFor: {
        "@type": SALON_TYPE[m.salon] ?? "HairSalon",
        "@id": SALON_URLS[m.salon] ?? `${BASE}/salon`,
        name: m.salon,
        url: SALON_URLS[m.salon] ?? `${BASE}/salon`,
        parentOrganization: { "@type": "Organization", name: "fleur GROUP", url: BASE },
      },
      ...(m.specialties && m.specialties.length > 0 ? { knowsAbout: m.specialties } : {}),
      ...(m.instagramUrl ? { sameAs: [m.instagramUrl] } : {}),
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
      {personSchemas.map((schema) => (
        <script
          key={schema["@id"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ページヘッダー */}
      <div className="pt-14 sm:pt-16 bg-white border-b border-site-greige">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
          <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2">/</span>
            <span>スタッフ紹介</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Staff</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text">スタッフ紹介</h1>
        </div>
      </div>

      {/* タブ＋グリッド */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <StaffTabs staff={content.staff} />
        </div>
      </section>

      {/* 予約 CTA（全チャネル） */}
      <section className="py-16 bg-site-light border-t border-site-greige">
        <div className="px-6 sm:px-10 lg:px-16">
          <ReservationChannels
            salonOrder={content.salonOrder}
            salons={content.salons as unknown as Record<string, import("@/lib/content").SalonContent>}
            heading="ご指名・ご予約はこちら"
            note="スタッフへのご指名はご予約時にお申し付けください"
            groupByType
          />
        </div>
      </section>
    </>
  );
}
