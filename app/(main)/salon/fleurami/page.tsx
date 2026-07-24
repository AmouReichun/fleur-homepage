import type { Metadata } from "next";
import { fleuramiSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "fleurami | 香南市の美容室 - 縮毛矯正・カラー";
const DESC = "高知県香南市野市の美容室「fleurami」。縮毛矯正・デザインカラー・髪質改善トリートメントが得意なサロン。経験14年の店長をはじめ実力派スタイリスト在籍。無料駐車場7台完備。Web・LINE予約受付中。";
const OG_IMG = "/images/admin/salon-fleurami-1782197558743.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "https://fleur-group.jp/salon/fleurami" },
  openGraph: { title: TITLE, description: DESC, url: "https://fleur-group.jp/salon/fleurami", images: [OG_IMG] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMG] },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "店舗案内", url: "https://fleur-group.jp/salon" },
  { name: "fleurami", url: "https://fleur-group.jp/salon/fleurami" },
];

export default function FleuramiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="fleurami" />
    </>
  );
}
