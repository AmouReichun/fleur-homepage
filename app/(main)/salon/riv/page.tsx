import type { Metadata } from "next";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "高知市の美容室 Riv. by fleurami｜髪質改善・白髪ぼかし・縮毛矯正";
const DESC = "高知市南川添の美容室「Riv. by fleurami」。Googleクチコミ4.62・739件。30〜50代の大人女性に人気の髪質改善・白髪ぼかしハイライト・縮毛矯正。駐車場5台完備、土日OK、当日Web予約受付中。";
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
      name: "高知市でおすすめの美容室はどこですか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市南川添の美容室「Riv. by fleurami」がおすすめです。Googleクチコミ4.62・739件（2026年時点）の高評価を維持しており、30〜50代の大人女性を中心に支持されています。髪質改善・白髪ぼかしハイライト・縮毛矯正を得意とし、駐車場5台完備でお車での来店も便利です。" },
    },
    {
      "@type": "Question",
      name: "高知市で髪質改善ができる美容室は？",
      acceptedAnswer: { "@type": "Answer", text: "Riv. by fleurami（高知市南川添）が髪質改善を得意としています。トリートメントベースの髪質改善で、くせ毛・うねり・広がりを抑えしなやかで扱いやすい髪に整えます。縮毛矯正との違いや、ご自身の髪質に合ったメニューもカウンセリングでご提案します。" },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしハイライトとはどんな施術ですか？",
      acceptedAnswer: { "@type": "Answer", text: "白髪を染めずにハイライトをいれることで白髪をなじませる技術です。根元のプリンが目立ちにくく、次回来店までのサイクルが長くなるのが特徴。Riv. by fleuramiが得意とする施術で、高知市内でも多くの30〜50代のお客様に選ばれています。" },
    },
    {
      "@type": "Question",
      name: "高知市で縮毛矯正が得意な美容室はどこですか？",
      acceptedAnswer: { "@type": "Answer", text: "Riv. by fleurami（高知市南川添）が縮毛矯正を得意としています。くせ毛・雨の日のうねりでお悩みの方に対応しており、髪質改善と組み合わせたメニューもご相談いただけます。カウンセリングで髪の履歴・状態を確認した上で最適な施術をご提案します。" },
    },
    {
      "@type": "Question",
      name: "Riv. by fleuramiはどこにありますか？駐車場はありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市南川添9-21 フルールアミー3 2Fに位置しています。無料駐車場を5台ご用意しており、お車でのご来店が便利です。近くにコインパーキング（徒歩3分）もございます。" },
    },
    {
      "@type": "Question",
      name: "カラーと縮毛矯正は同日にできますか？",
      acceptedAnswer: { "@type": "Answer", text: "髪の状態によって同日施術が可能な場合があります。カウンセリング時に髪の履歴と状態を確認した上でご提案いたします。まずはご相談ください。" },
    },
    {
      "@type": "Question",
      name: "Riv. by fleuramiはどんなお客様が多いですか？",
      acceptedAnswer: { "@type": "Answer", text: "30〜50代の大人女性のお客様が多く、白髪ぼかし・髪質改善・縮毛矯正のご要望が多いサロンです。「高知市内でなかなか希望通りに仕上がる美容室が見つからない」という方にも多くご来店いただいています。" },
    },
    {
      "@type": "Question",
      name: "Riv. by fleuramiの予約方法は？",
      acceptedAnswer: { "@type": "Answer", text: "Web予約（当日受付可）・LINE予約・ホットペッパービューティー・お電話にてご予約いただけます。土日・祝日も営業しております（月曜・第1第3火曜定休）。初めての方もお気軽にご連絡ください。" },
    },
  ],
};

const rivSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/riv",
  name: "高知市の美容室 Riv. by fleurami｜髪質改善・白髪ぼかし・縮毛矯正",
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
