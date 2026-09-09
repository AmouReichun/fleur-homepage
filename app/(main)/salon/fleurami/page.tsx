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

const fleuramiLocalFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "fleuramiはどこにありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知県香南市野市にある美容室です。無料駐車場を7台ご用意しています。高知市中心部からもアクセスしやすい立地です。" },
    },
    {
      "@type": "Question",
      name: "香南市で縮毛矯正を得意とする美容室はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "香南市野市の美容室「fleurami」が縮毛矯正を得意としています。経験14年の店長をはじめ実力派スタイリストが在籍しており、クセの強い髪質にも丁寧に対応します。" },
    },
    {
      "@type": "Question",
      name: "デザインカラーやインナーカラーはできますか？",
      acceptedAnswer: { "@type": "Answer", text: "fleurami（香南市野市）ではデザインカラー・インナーカラー・イヤリングカラーなど幅広いカラーメニューに対応しています。ご希望のスタイルのお写真をお持ちいただくとよりスムーズにご提案できます。" },
    },
    {
      "@type": "Question",
      name: "初めて縮毛矯正をかける場合、何を準備すればよいですか？",
      acceptedAnswer: { "@type": "Answer", text: "過去の縮毛矯正やパーマ・ブリーチの履歴をお伝えいただけると最適なご提案ができます。なりたいイメージの写真があればお持ちください。当日の服装はデコルテまで開いていると施術がスムーズです。" },
    },
    {
      "@type": "Question",
      name: "fleurami（香南市）の予約方法を教えてください。",
      acceptedAnswer: { "@type": "Answer", text: "Web予約・LINE予約・ホットペッパービューティー・お電話からご予約いただけます。初めての方もお気軽にご予約ください。" },
    },
    {
      "@type": "Question",
      name: "高知で髪質改善トリートメントを受けられる美容室はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "fleurami（香南市野市）では髪質改善トリートメントに対応しています。ダメージを補修しながらツヤとまとまりを引き出す人気メニューです。" },
    },
  ],
};

const fleuramiSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/fleurami",
  name: "fleurami | 香南市の美容室 - 縮毛矯正・カラー",
  url: "https://fleur-group.jp/salon/fleurami",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".salon-lead", "#salon-faq dt"],
  },
  about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
};

export default function FleuramiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiLocalFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="fleurami" />
    </>
  );
}
