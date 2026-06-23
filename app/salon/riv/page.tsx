import type { Metadata } from "next";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

export const metadata: Metadata = {
  title: "Riv.by fleurami | 高知市の美容室 - 髪質改善・白髪ぼかし",
  description: "高知市の美容室「Riv.by fleurami」。髪質改善・白髪ぼかし・艶カラー・大人女性向けの似合わせカットが得意。",
  alternates: { canonical: "https://fleurami-group.jp/salon/riv" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "Riv.by fleurami", url: "https://fleurami-group.jp/salon/riv" },
];

export default function RivPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="riv" />
    </>
  );
}
