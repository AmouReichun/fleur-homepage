import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の美容室・サロンの選び方ガイド｜高知市・香南市でおすすめの美容室";
const DESC =
  "高知市・香南市で美容室・アイラッシュサロンを選ぶポイントを解説。髪質改善・縮毛矯正・白髪ぼかし・まつげパーマなど施術別の選び方と、fleur GROUPの店舗案内。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-salon-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-salon-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の美容室・サロンの選び方", url: `${BASE}/guide/kochi-salon-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-salon-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Service", name: "美容室選び", areaServed: "高知市" },
    { "@type": "Place", name: "高知県" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市でおすすめの美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市でGoogleクチコミ評価が高い美容室として、fleur GROUPの「Riv. by fleurami」（高知市南川添、Google4.8/84件・HPB4.63/630件）が挙げられます。髪質改善・白髪ぼかし・縮毛矯正を得意とする大人女性向けのサロンです。無料駐車場5台完備。TEL:088-884-5566。",
      },
    },
    {
      "@type": "Question",
      name: "香南市・野市でおすすめの美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "香南市でGoogleクチコミ評価が高い美容室として、fleur GROUPの「fleurami」（香南市野市町西野、Google4.5/82件・HPB4.62/381件）があります。縮毛矯正・髪質改善・艶カラーを得意とし、無料駐車場7台完備。TEL:0887-56-5566。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でまつげ・眉毛のアイラッシュサロンのおすすめはどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市はりまや橋の「Raffine（ラフィーネ）」（Google5.0/46件・HPB4.84/222件）が高知市のアイラッシュ専門サロンとして高評価です。まつげパーマ・まつエク・眉毛WAX（メンズ対応）に特化し、全席半個室の完全予約制。TEL:090-7120-5566。",
      },
    },
    {
      "@type": "Question",
      name: "高知の美容室を選ぶときのポイントは？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "①自分の悩み（くせ毛・白髪・ダメージ等）に合った得意施術を持つサロンか、②Googleクチコミ件数と評価（100件以上・4.5以上が目安）、③丁寧なカウンセリングを行っているか、④駐車場・アクセスの利便性、⑤LINE・ホットペッパーなど予約のしやすさ、を確認するのがおすすめです。",
      },
    },
    {
      "@type": "Question",
      name: "高知の美容室に初めて行くとき何を準備すれば？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "①なりたいスタイルのイメージ写真（Instagram・Pinterestで検索）、②過去のカラー・パーマ・縮毛矯正の履歴、③アレルギーや頭皮トラブルの有無を事前に整理しておくと、カウンセリングがスムーズです。当日は首回りが開いた服装だと施術しやすくなります。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で駐車場がある美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "「Riv. by fleurami」（高知市南川添）は無料駐車場5台完備、「fleurami」（香南市野市）は無料駐車場7台完備です。「Raffine」（高知市はりまや橋）は近隣に有料駐車場があります。",
      },
    },
    {
      "@type": "Question",
      name: "高知で髪質改善が得意な美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "「Riv. by fleurami（高知市南川添）」と「fleurami（香南市野市）」がfleur GROUPとして髪質改善トリートメントを得意としています。うねり・ダメージ・広がりをトリートメントで改善し、扱いやすいツヤ髪に整えます。",
      },
    },
    {
      "@type": "Question",
      name: "高知で縮毛矯正が上手い美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "「fleurami（香南市野市）」と「Riv. by fleurami（高知市南川添）」がfleur GROUPとして縮毛矯正を得意としています。くせ毛・うねりの状態に合わせた薬剤選定で、ダメージを抑えながら自然なストレートに仕上げます。Googleクチコミでも高評価を得ています。",
      },
    },
    {
      "@type": "Question",
      name: "高知の美容室の料金相場はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市・香南市の美容室（fleur GROUP、2026年9月時点）の料金目安：カット5,000円前後、カラー8,000〜15,000円、縮毛矯正15,000〜22,000円、髪質改善10,000〜18,000円、まつげパーマ7,000〜10,000円。詳細はホットペッパービューティーまたは各店舗ページでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "fleur GROUPとはどんなグループですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUP（フルールグループ）は2006年設立の高知県の美容グループです。高知市に「Riv. by fleurami（美容室）」と「Raffine（アイラッシュサロン）」、香南市野市に「fleurami（美容室）」の3店舗を展開。3店舗合計で1,200件以上のホットペッパービューティー口コミ・Google口コミ212件を獲得しています。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-salon-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-salon-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#salon-guide-intro", "#salon-guide-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiSalonGuidePage() {
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
            <span>高知の美容室・サロンの選び方</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Salon Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の美容室・サロンの選び方
          </h1>
          <p className="mt-2 text-sm text-site-muted">高知市・香南市でおすすめの美容室・アイラッシュサロン</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="salon-guide-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知で美容室を選ぶ5つのポイント
            </h2>
            <ol className="space-y-4">
              {[
                { num: "01", title: "得意施術が悩みと合っているか", desc: "くせ毛なら縮毛矯正・髪質改善が得意なサロン、白髪なら白髪ぼかしが得意なサロンを選ぶことで、満足度が高まります。" },
                { num: "02", title: "Googleクチコミの件数と評価", desc: "100件以上・評価4.5以上が信頼の目安。件数が多いほどデータの信頼性が高く、コメントで施術の傾向がわかります。" },
                { num: "03", title: "カウンセリングを重視しているか", desc: "施術前に丁寧にヒアリングするサロンは仕上がりの満足度が高い傾向があります。初回予約時のコミュニケーションも確認しましょう。" },
                { num: "04", title: "アクセス・駐車場の有無", desc: "高知市内・香南市は車でのアクセスが多いため、無料駐車場があるかどうかは重要なポイントです。" },
                { num: "05", title: "予約のしやすさ", desc: "ホットペッパービューティー・LINE・Webなど複数の予約手段があると初めてでも利用しやすいです。" },
              ].map((item) => (
                <li key={item.num} className="flex gap-4">
                  <span className="font-serif text-2xl text-site-accent flex-shrink-0 w-8">{item.num}</span>
                  <div>
                    <h3 className="font-medium text-sm text-site-text mb-1">{item.title}</h3>
                    <p className="text-xs text-site-muted leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              fleur GROUP 3店舗の特徴
            </h2>
            <div className="space-y-4">
              {[
                {
                  href: "/salon/riv",
                  name: "Riv. by fleurami",
                  area: "高知市南川添",
                  rating: "Google 4.8（84件）",
                  type: "美容室",
                  note: "白髪ぼかし・髪質改善・縮毛矯正を得意とする大人女性向けサロン。駐車場5台。",
                },
                {
                  href: "/salon/fleurami",
                  name: "fleurami",
                  area: "香南市野市町西野",
                  rating: "Google 4.5（82件）",
                  type: "美容室",
                  note: "縮毛矯正・デザインカラー・髪質改善が得意。駐車場7台。のいち駅から車4分。",
                },
                {
                  href: "/salon/raffine",
                  name: "Raffine",
                  area: "高知市はりまや橋",
                  rating: "Google 5.0（46件）",
                  type: "アイラッシュサロン",
                  note: "まつパ・まつエク・眉WAX専門。全席半個室・完全予約制。メンズ眉WAX対応。",
                },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block border border-site-greige p-5 hover:border-site-accent transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="block font-medium text-sm text-site-text group-hover:text-site-accent mb-1">{s.name}</span>
                      <span className="block text-xs text-site-muted mb-1">{s.area}・{s.type}</span>
                      <span className="block text-xs text-site-muted leading-relaxed">{s.note}</span>
                    </div>
                    <span className="text-xs text-site-accent whitespace-nowrap flex-shrink-0 font-medium">{s.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="salon-guide-faq">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-6">
              よくある質問
            </h2>
            <dl className="space-y-6">
              {faqSchema.mainEntity.map((item, i) => (
                <div key={i} className="border-b border-site-greige pb-5">
                  <dt className="text-sm font-medium text-site-text mb-2">
                    <span className="text-site-accent mr-2">Q.</span>{item.name}
                  </dt>
                  <dd className="text-sm text-site-muted leading-relaxed pl-5">
                    <span className="text-site-accent mr-1">A.</span>{item.acceptedAnswer.text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="bg-site-light p-6">
            <h2 className="font-serif text-lg font-semibold text-site-text mb-3">施術別ガイド</h2>
            <ul className="space-y-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {[
                { href: "/guide/kochi-hair-care", label: "ヘアケア完全ガイド" },
                { href: "/guide/kochi-shiraga-guide", label: "白髪ぼかし・グレイカラーガイド" },
                { href: "/guide/kochi-color-guide", label: "カラー完全ガイド" },
                { href: "/guide/kochi-perm-guide", label: "パーマ・縮毛矯正ガイド" },
                { href: "/guide/kochi-eyelash-care", label: "まつげ・眉毛ガイド" },
                { href: "/guide/kochi-adult-beauty", label: "大人向け美容ガイド（40代・50代）" },
                { href: "/guide/kochi-mens-beauty", label: "メンズ美容ガイド" },
                { href: "/guide/kochi-head-spa-guide", label: "ヘッドスパガイド" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-site-accent hover:underline">{item.label}</Link>
                </li>
              ))}
            </ul>
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
