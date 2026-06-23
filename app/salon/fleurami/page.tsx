import type { Metadata } from "next";
import { fleuramiSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

export const metadata: Metadata = {
  title: "fleurami | 香南市の美容室 - 縮毛矯正・カラー",
  description: "香南市の美容室「fleurami」。縮毛矯正・髪質改善・カラーが得意。高知県香南市野市町でくせ毛・うねりでお悩みの方に寄り添います。",
  alternates: { canonical: "https://fleurami-group.jp/salon/fleurami" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "fleurami", url: "https://fleurami-group.jp/salon/fleurami" },
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
