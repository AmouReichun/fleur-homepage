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

const rivFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Riv. by fleuramiはどこにありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市南川添に位置しています。無料駐車場を5台ご用意しており、お車でお越しいただけます。" },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしハイライトとはどんな施術ですか？",
      acceptedAnswer: { "@type": "Answer", text: "白髪を染めずにハイライトをいれることで白髪をなじませる技術です。根元のプリンが目立ちにくく、次回来店までのサイクルが長くなるのが特徴。Riv. by fleuramiが得意とする施術の一つです。" },
    },
    {
      "@type": "Question",
      name: "高知市で縮毛矯正が得意な美容室はどこですか？",
      acceptedAnswer: { "@type": "Answer", text: "Riv. by fleuramiでは縮毛矯正を得意としており、高知市南川添のサロンで対応しています。髪質改善と組み合わせたメニューもご相談いただけます。" },
    },
    {
      "@type": "Question",
      name: "カラーと縮毛矯正は同日にできますか？",
      acceptedAnswer: { "@type": "Answer", text: "髪の状態によって同日施術が可能な場合があります。カウンセリング時に髪の履歴と状態を確認した上でご提案いたします。まずはご相談ください。" },
    },
    {
      "@type": "Question",
      name: "Riv. by fleuramiはどんなお客様が多いですか？",
      acceptedAnswer: { "@type": "Answer", text: "30〜50代の大人女性のお客様が多く、白髪ぼかし・髪質改善・縮毛矯正のご要望が多いサロンです。丁寧なカウンセリングで一人ひとりのお悩みにお応えします。" },
    },
    {
      "@type": "Question",
      name: "Riv. by fleuramiの予約方法は？",
      acceptedAnswer: { "@type": "Answer", text: "Web予約・LINE予約・ホットペッパービューティー・お電話にてご予約いただけます。初めての方もお気軽にご連絡ください。" },
    },
  ],
};

const rivSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/riv",
  name: "Riv. by fleurami | 高知市の美容室 - 髪質改善・白髪ぼかし",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="riv" />
    </>
  );
}
