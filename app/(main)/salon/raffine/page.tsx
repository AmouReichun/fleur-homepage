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

const raffineFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Raffineはどこにありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市はりまや橋エリアにあるアイラッシュサロンです。Web予約・LINE予約で事前にご予約いただけます。" },
    },
    {
      "@type": "Question",
      name: "高知市でまつ毛パーマができるサロンはありますか？",
      acceptedAnswer: { "@type": "Answer", text: "高知市はりまや橋のアイラッシュサロン Raffine（ラフィーネ）でまつ毛パーマ（パリジェンヌラッシュリフト・ラッシュリフト）に対応しています。4〜6週間の持続が特徴です。" },
    },
    {
      "@type": "Question",
      name: "まつエクとまつ毛パーマはどう違いますか？",
      acceptedAnswer: { "@type": "Answer", text: "まつエク（エクステ）は人工毛をまつ毛に接着してボリュームや長さを出す施術です。まつ毛パーマはご自身のまつ毛をカールさせる施術で、自然なカールで目元を印象的に見せます。ライフスタイルや好みに合わせてご提案いたします。" },
    },
    {
      "@type": "Question",
      name: "眉毛WAXとは何ですか？メンズも対応していますか？",
      acceptedAnswer: { "@type": "Answer", text: "眉毛WAXはワックスで余分な産毛や眉の形を整える施術です。Raffine（高知市）ではメンズの眉毛WAX・アイブロウ整えにも対応しています。" },
    },
    {
      "@type": "Question",
      name: "まつ毛パーマはどれくらい持ちますか？",
      acceptedAnswer: { "@type": "Answer", text: "Raffine（高知市はりまや橋）のまつ毛パーマは4〜6週間の持続が目安です。まつ毛の生え変わりサイクルに合わせて定期的なメンテナンスをおすすめしています。" },
    },
    {
      "@type": "Question",
      name: "Raffineの予約方法は？",
      acceptedAnswer: { "@type": "Answer", text: "Web予約・LINE予約・ホットペッパービューティー・お電話からご予約いただけます。初めての方もお気軽にご予約ください。" },
    },
  ],
};

const raffineSpeakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://fleur-group.jp/salon/raffine",
  name: "マツエク・まつ毛パーマ 高知市｜アイラッシュサロン Raffine",
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
