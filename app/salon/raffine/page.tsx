import type { Metadata } from "next";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

export const metadata: Metadata = {
  title: "Raffine | 高知市のアイラッシュサロン - まつげパーマ・眉毛WAX",
  description: "高知市はりまや橋のアイラッシュサロン「Raffine」。まつげパーマ・ラッシュリフト・眉毛WAXが得意。自まつげを活かした自然な仕上がり。",
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "Raffine", url: "https://fleurami-group.jp/salon/raffine" },
];

export default function RaffinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="raffine" />
    </>
  );
}
