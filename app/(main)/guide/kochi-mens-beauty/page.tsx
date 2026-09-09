import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知のメンズ美容ガイド｜メンズパーマ・カット・カラー・眉WAX";
const DESC =
  "高知市・香南市でメンズのパーマ・ツイストパーマ・カット・カラー・眉WAXを検討している方へ。施術の選び方・料金目安・ホームケアをfleur GROUPが解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-mens-beauty` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-mens-beauty` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のメンズ美容ガイド", url: `${BASE}/guide/kochi-mens-beauty` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-mens-beauty`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "メンズパーマ" },
    { "@type": "Thing", name: "ツイストパーマ" },
    { "@type": "Thing", name: "眉毛WAX" },
    { "@type": "Service", name: "メンズカット", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市・香南市でメンズパーマができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPのRiv. by fleurami（高知市南川添）とfleurami（香南市野市）でメンズパーマに対応しています。ツイストパーマ・スパイラルパーマ・無造作パーマなど幅広いスタイルをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "ツイストパーマとは何ですか？どんな仕上がりになりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ツイストパーマはロッドで毛束をねじりながら巻くパーマで、整ったカールよりも動きのある無造作なウェーブが特徴です。スタイリング剤をなじませて乾かすだけでおしゃれな仕上がりになるため、不器用な方にも人気です。",
      },
    },
    {
      "@type": "Question",
      name: "メンズパーマの施術時間はどれくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "カットと合わせて2〜3時間が目安です。髪の状態やデザインによって前後するため、予約時にご相談いただくとスムーズです。",
      },
    },
    {
      "@type": "Question",
      name: "メンズカラー（ハイトーン・グレー）は高知の美容室でできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPではメンズカラーに対応しています。グレーアッシュ・ベージュ・ハイトーンカラーなど、ご要望に合わせてご提案します。ブリーチが必要な場合は事前にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知でメンズ眉WAXはどこでできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市はりまや橋のアイラッシュサロン Raffine（ラフィーネ）でメンズ眉WAX・アイブロウ整えに対応しています。産毛や眉の形を整えることで清潔感のある印象になります。",
      },
    },
    {
      "@type": "Question",
      name: "メンズのパーマ後のホームケアで気をつけることは？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "施術当日は24時間シャンプーを控えるのが基本です。洗い流さないトリートメントやバームを使うとカールが長持ちしやすく、乾燥によるパサつきを防げます。ドライヤー時は根元から乾かし、毛先はやや手で揉み込むようにすると自然なウェーブが出ます。",
      },
    },
    {
      "@type": "Question",
      name: "高知のメンズカットの料金目安はどれくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPのメンズカットは5,000円前後が目安です。カット＋パーマの場合は12,000〜16,000円前後になります。詳細はメニューページをご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "初めてパーマをかけるメンズはどんなスタイルが向いていますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "初めてのパーマにはツイストパーマや柔らかいウェーブパーマがおすすめです。スタイリングが簡単で、パーマが落ちてきても自然な仕上がりになります。髪の長さや骨格に合わせてカウンセリングでご提案いたします。",
      },
    },
    {
      "@type": "Question",
      name: "高知でメンズの白髪染めはできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPではメンズの白髪染めにも対応しています。部分染め・全体染め・グレイカラーなどご要望に合わせてご提案します。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-mens-beauty`,
  name: TITLE,
  url: `${BASE}/guide/kochi-mens-beauty`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#mens-guide-intro", "#mens-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiMensBeautyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/guide" className="hover:text-site-accent">美容ガイド</Link>
            <span className="mx-2">/</span>
            <span>高知のメンズ美容ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Mens Beauty Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知のメンズ美容ガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">メンズパーマ・カット・カラー・眉WAXの選び方</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <section id="mens-guide-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知でメンズ美容を楽しむために
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              近年、美容室でのメンズ施術に注目が集まっています。パーマ・カラー・眉毛ケアは、第一印象を大きく左右するケアです。fleur GROUPでは高知市・香南市の男性のお客様がスタイルを楽しめるよう、メンズパーマ・カット・カラー・眉WAXに対応しています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              メンズパーマの種類と選び方
            </h2>
            <div className="space-y-4 text-sm text-site-text leading-loose">
              <p>
                メンズパーマには主に「ツイストパーマ」「スパイラルパーマ」「無造作パーマ」などの種類があります。ツイストパーマは動きと無造作感が出るスタイルで、スタイリングが簡単なため初めてのパーマにおすすめです。
              </p>
              <p>
                スパイラルパーマは均一なカールが特徴で、長めのヘアに向いています。無造作パーマはナチュラルな動きを演出したい方に人気です。
              </p>
              <p>
                <Link href="/service/mens-twist-perm" className="text-site-accent underline underline-offset-2">
                  メンズツイストパーマの詳細はこちら
                </Link>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              メンズカラーの種類と高知での対応
            </h2>
            <div className="space-y-4 text-sm text-site-text leading-loose">
              <p>
                メンズカラーはグレーアッシュ・ベージュ・マット系が人気です。職場対応が必要な方には自然に見えるトーンダウンカラーや白髪染めが適しています。
              </p>
              <p>
                ハイトーンカラーはブリーチが必要になるため、まずはカウンセリングで髪の状態を確認した上でご提案します。
              </p>
              <p>
                <Link href="/service/mens-color" className="text-site-accent underline underline-offset-2">
                  メンズカラーの詳細はこちら
                </Link>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              メンズ眉WAX・アイブロウ
            </h2>
            <p className="text-sm text-site-text leading-loose">
              眉毛を整えることで顔の印象が大きく変わります。高知市はりまや橋のアイラッシュサロン Raffine（ラフィーネ）では、メンズの眉毛WAX・アイブロウ整えに対応しています。ビジネスシーンにも合うナチュラルな仕上がりが好評です。
            </p>
          </section>

          <section id="mens-faq">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-6">
              よくある質問
            </h2>
            <dl className="space-y-6">
              {[
                {
                  q: "高知市・香南市でメンズパーマができる美容室はありますか？",
                  a: "fleur GROUPのRiv. by fleurami（高知市南川添）とfleurami（香南市野市）でメンズパーマに対応しています。ツイストパーマ・スパイラルパーマ・無造作パーマなど幅広いスタイルをご提案します。",
                },
                {
                  q: "ツイストパーマとは何ですか？どんな仕上がりになりますか？",
                  a: "ツイストパーマはロッドで毛束をねじりながら巻くパーマで、整ったカールよりも動きのある無造作なウェーブが特徴です。スタイリング剤をなじませて乾かすだけでおしゃれな仕上がりになるため、不器用な方にも人気です。",
                },
                {
                  q: "メンズパーマの施術時間はどれくらいかかりますか？",
                  a: "カットと合わせて2〜3時間が目安です。髪の状態やデザインによって前後するため、予約時にご相談いただくとスムーズです。",
                },
                {
                  q: "メンズカラー（ハイトーン・グレー）は高知の美容室でできますか？",
                  a: "fleur GROUPではメンズカラーに対応しています。グレーアッシュ・ベージュ・ハイトーンカラーなど、ご要望に合わせてご提案します。ブリーチが必要な場合は事前にご相談ください。",
                },
                {
                  q: "高知でメンズ眉WAXはどこでできますか？",
                  a: "高知市はりまや橋のアイラッシュサロン Raffine（ラフィーネ）でメンズ眉WAX・アイブロウ整えに対応しています。産毛や眉の形を整えることで清潔感のある印象になります。",
                },
                {
                  q: "メンズのパーマ後のホームケアで気をつけることは？",
                  a: "施術当日は24時間シャンプーを控えるのが基本です。洗い流さないトリートメントやバームを使うとカールが長持ちしやすく、乾燥によるパサつきを防げます。",
                },
                {
                  q: "高知のメンズカットの料金目安はどれくらいですか？",
                  a: "fleur GROUPのメンズカットは5,000円前後が目安です。カット＋パーマの場合は12,000〜16,000円前後になります。詳細はメニューページをご確認ください。",
                },
                {
                  q: "高知でメンズの白髪染めはできますか？",
                  a: "fleur GROUPではメンズの白髪染めにも対応しています。部分染め・全体染め・グレイカラーなどご要望に合わせてご提案します。",
                },
              ].map((item, i) => (
                <div key={i} className="border-b border-site-greige pb-5">
                  <dt className="text-sm font-medium text-site-text mb-2">
                    <span className="text-site-accent mr-2">Q.</span>{item.q}
                  </dt>
                  <dd className="text-sm text-site-muted leading-relaxed pl-5">
                    <span className="text-site-accent mr-1">A.</span>{item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="pt-4">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知市・香南市のメンズ対応サロン
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/salon/riv", name: "Riv. by fleurami", area: "高知市南川添", note: "メンズカット・パーマ対応" },
                { href: "/salon/fleurami", name: "fleurami", area: "香南市野市", note: "メンズカット・縮毛矯正対応" },
                { href: "/salon/raffine", name: "Raffine", area: "高知市はりまや橋", note: "メンズ眉WAX対応" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block border border-site-greige p-4 hover:border-site-accent transition-colors group"
                >
                  <span className="block font-medium text-sm text-site-text group-hover:text-site-accent mb-1">{s.name}</span>
                  <span className="block text-xs text-site-muted mb-2">{s.area}</span>
                  <span className="block text-xs text-site-accent">{s.note}</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="pt-4 border-t border-site-greige">
            <Link href="/guide" className="inline-flex items-center gap-3 text-sm text-site-text hover:text-site-accent transition-colors group">
              <span className="w-4 h-px bg-current group-hover:w-6 transition-all duration-300" />
              <span>美容ガイド一覧に戻る</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
