import type { Metadata } from "next";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "高知市の眉毛サロン・まつ毛サロン Raffine｜眉毛WAX・マツエク・まつ毛パーマ";
const DESC = "高知市はりまや橋の眉毛サロン・アイラッシュサロン Raffine（ラフィーネ）。Googleクチコミ5.0・45件、ホットペッパー4.86・232件。眉毛WAX（黄金比・メンズ可）・まつ毛パーマ（パリジェンヌ）・マツエク（束感）。Web予約当日受付可・LINE予約OK。";
const OG_IMG = "/images/admin/salon-raffine-1782206000346.JPG";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://fleur-group.jp/salon/raffine" },
  openGraph: { title: TITLE, description: DESC, url: "https://fleur-group.jp/salon/raffine", images: [OG_IMG] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMG] },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "店舗案内", url: "https://fleur-group.jp/salon" },
  { name: "Raffine", url: "https://fleur-group.jp/salon/raffine" },
];

const raffineSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/raffine",
  name: "高知市の眉毛サロン・まつ毛サロン Raffine｜眉毛WAX・マツエク・まつ毛パーマ",
  url: "https://fleur-group.jp/salon/raffine",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".salon-lead", "#salon-faq dt"],
  },
  about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
};

export default function RaffinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="raffine" />
    </>
  );
}
