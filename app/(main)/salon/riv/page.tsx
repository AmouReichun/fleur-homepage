import type { Metadata } from "next";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "Riv. by fleurami | 高知市の美容室 - 髪質改善・白髪ぼかし";
const DESC = "高知市南川添の美容室「Riv. by fleurami」。髪質改善・白髪ぼかしハイライト・縮毛矯正が得意な大人女性向けサロン。丁寧なカウンセリングで毎日扱いやすいスタイルをご提案。駐車場5台完備。Web・LINE予約受付中。";
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

export default function RivPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="riv" />
    </>
  );
}
