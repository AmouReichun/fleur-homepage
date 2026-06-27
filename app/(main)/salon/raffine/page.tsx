import type { Metadata } from "next";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "Raffine | 高知市のアイラッシュサロン - まつげパーマ・眉毛WAX";
const DESC = "高知市はりまや橋のアイラッシュサロン「Raffine」。まつげパーマ・ラッシュリフト・眉毛WAXが得意。自まつげを活かした自然な仕上がり。";
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

export default function RaffinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="raffine" />
    </>
  );
}
