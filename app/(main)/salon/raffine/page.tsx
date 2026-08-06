import type { Metadata } from "next";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "マツエク・まつ毛パーマ 高知市｜眉毛WAX・アイブロウ｜アイラッシュサロン Raffine";
const DESC = "高知市はりまや橋でマツエク・まつ毛パーマ（パリジェンヌ／ラッシュリフト）・眉毛WAX・アイブロウをお探しなら、アイラッシュサロン Raffine（ラフィーネ）。4〜6週間持続する施術が人気で、メンズ眉WAXも対応。Web・LINE予約受付中。";
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
