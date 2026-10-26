import type { Metadata } from "next";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "高知市の美容室 Riv. by fleurami｜髪質改善・白髪ぼかし・縮毛矯正";
const DESC = "高知市南川添の美容室「Riv. by fleurami」。Googleクチコミ4.8・83件、ホットペッパー4.66・621件。30〜50代の大人女性に人気の髪質改善・白髪ぼかしハイライト・縮毛矯正。駐車場5台完備、土日OK、当日Web予約受付中。";
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
  { name: "Riv. by fleurami", url: "https://fleur-group.jp/salon/riv" },
];

const rivSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/riv",
  name: "高知市の美容室 Riv. by fleurami｜髪質改善・白髪ぼかし・縮毛矯正",
  url: "https://fleur-group.jp/salon/riv",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".salon-lead", "#salon-faq dt"],
  },
  about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
};

export default function RivPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="riv" />
    </>
  );
}
