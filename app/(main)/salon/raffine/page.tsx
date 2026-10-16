import type { Metadata } from "next";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";
import SalonDetailPage from "@/app/components/SalonDetailPage";

const TITLE = "高知市の眉毛サロン・まつ毛サロン Raffine｜眉毛WAX・マツエク・まつ毛パーマ";
const DESC = "高知市はりまや橋の眉毛サロン・アイラッシュサロン Raffine（ラフィーネ）。Googleクチコミ4.82・200件。眉毛WAX（黄金比・メンズ可）・まつ毛パーマ（パリジェンヌ）・マツエク（束感）。Web予約当日受付可・LINE予約OK。";
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

const raffineFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市でおすすめの眉毛サロンはどこですか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市はりまや橋の「Raffine（ラフィーネ）」がおすすめです。眉毛WAX（アイブロウ）を専門的に提供しており、黄金比に基づく骨格別デザインで顔の印象をすっきり整えます。Googleクチコミ4.82・200件（2026年時点）の高評価で、レディース・メンズ共に対応しています。" },
    },
    {
      "@type": "Question",
      name: "高知市で眉毛WAXができるサロンはありますか？",
      acceptedAnswer: { "@type": "Answer", text: "Raffine（高知市はりまや橋）が眉毛WAX・アイブロウ施術に対応しています。ワックスで余分な産毛を一度に除去し、骨格・黄金比に合わせた形に整えます。メンズ眉毛WAXも対応。まつ毛パーマやマツエクとの同日施術もできます。" },
    },
    {
      "@type": "Question",
      name: "Raffineはどこにありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知県高知市はりまや町1-4-8 TNはりまやビル3Fにあります（はりまや橋から徒歩圏内）。近辺にコインパーキング（徒歩1〜3分）がございます。Web予約・LINE予約で事前にご予約いただけます。" },
    },
    {
      "@type": "Question",
      name: "高知市でまつ毛パーマができるサロンはありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市はりまや橋のアイラッシュサロン Raffine（ラフィーネ）でまつ毛パーマ（パリジェンヌラッシュリフト・ラッシュリフト）に対応しています。4〜6週間の持続が特徴で、Googleクチコミ4.82の高評価サロンです。" },
    },
    {
      "@type": "Question",
      name: "まつエクとまつ毛パーマはどう違いますか？",
      acceptedAnswer: { "@type": "Answer", text: "まつエク（エクステ）は人工毛をまつ毛に接着してボリュームや長さを出す施術です。まつ毛パーマはご自身のまつ毛をカールさせる施術で、自然なカールで目元を印象的に見せます。ライフスタイルや好みに合わせてご提案いたします。" },
    },
    {
      "@type": "Question",
      name: "眉毛WAXは痛いですか？どれくらい持ちますか？",
      acceptedAnswer: { "@type": "Answer", text: "多少の刺激はありますが施術時間が短いため、「思ったより大丈夫だった」という声が多くあります。持続期間は個人差がありますが3〜4週間が目安です。敏感肌の方はご来店前にご相談ください。" },
    },
    {
      "@type": "Question",
      name: "まつ毛パーマはどれくらい持ちますか？",
      acceptedAnswer: { "@type": "Answer", text: "Raffine（高知市はりまや橋）のまつ毛パーマは4〜6週間の持続が目安です。まつ毛の生え変わりサイクルに合わせて定期的なメンテナンスをおすすめしています。" },
    },
    {
      "@type": "Question",
      name: "Raffineの予約方法は？",
      acceptedAnswer: { "@type": "Answer", text: "Web予約（当日受付可）・LINE予約・ホットペッパービューティー・お電話からご予約いただけます。不定休のため、ご来店前に予約状況をご確認ください。" },
    },
  ],
};

const raffineSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/raffine",
  name: "高知市の眉毛サロン・まつ毛サロン Raffine｜眉毛WAX・マツエク・まつ毛パーマ",
  url: "https://fleur-group.jp/salon/raffine",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".salon-lead", "#salon-faq dt"],
  },
  about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
};

export default function RaffinePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSpeakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <SalonDetailPage salonKey="raffine" />
    </>
  );
}
