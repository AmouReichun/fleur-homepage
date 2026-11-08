import type { Metadata } from "next";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";
import { getContentCached } from "@/lib/content";
import { withMenuPrices } from "@/lib/menu-offers";

const TITLE = "高知市の美容室 Riv. by fleur ami｜艶カラー・髪質改善・白髪ぼかし";
const DESC = "高知市南川添の美容室「Riv. by fleur ami」。Googleクチコミ4.8・81件、ホットペッパー4.66・619件。30〜50代の大人女性に人気の艶カラーとミルボンの髪質改善。白髪ぼかしハイライト・縮毛矯正も得意。駐車場5台完備、土日OK、当日Web予約受付中。";
const OG_IMG = "/images/admin/salon-riv-1782197568767.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://fleur-group.jp/salon/riv" },
  openGraph: { title: TITLE, description: DESC, url: "https://fleur-group.jp/salon/riv", images: [OG_IMG] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMG] },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "店舗案内", url: "https://fleur-group.jp/salon" },
  { name: "Riv. by fleur ami", url: "https://fleur-group.jp/salon/riv" },
];

const rivSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/riv#webpage",
  name: "高知市の美容室 Riv. by fleur ami｜髪質改善・白髪ぼかし・縮毛矯正",
  url: "https://fleur-group.jp/salon/riv",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".salon-lead", "#salon-faq dt"],
  },
  about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
};

export default async function RivPage() {
  const content = await getContentCached();
  const salonSchema = withMenuPrices(rivSalonSchema, "riv", content.menus["riv"] ?? []);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="riv" />
    </>
  );
}
