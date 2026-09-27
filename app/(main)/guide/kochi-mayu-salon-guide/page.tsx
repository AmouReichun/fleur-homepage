import type { Metadata } from "next";
import Link from "next/link";
import GuideRelatedArticles from "@/components/GuideRelatedArticles";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の眉毛サロンガイド｜眉毛WAX・アイブロウの料金と選び方";
const DESC =
  "高知市で眉毛サロンをお探しの方へ。眉毛WAX・アイブロウデザインの料金・施術時間・持ち・選び方をRaffine（高知市はりまや橋）が解説します。メンズ対応・まつ毛パーマとのセット施術も可能。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-mayu-salon-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-mayu-salon-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の眉毛サロンガイド", url: `${BASE}/guide/kochi-mayu-salon-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-mayu-salon-guide`,
  datePublished: "2026-09-27",
  dateModified: "2026-09-27",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "眉毛WAX" },
    { "@type": "Thing", name: "アイブロウ" },
    { "@type": "Service", name: "眉毛サロン", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市で眉毛WAXができるサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Raffine（ラフィーヌ、高知市帯屋町2-1-40 TEL: 088-823-6622）が眉毛WAX・アイブロウデザインに対応しています。料金は3,300円〜（税込）、施術時間は30〜40分が目安です。まつ毛パーマ（ラッシュリフト）とのセット施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXとシェービング（眉カット）はどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "眉毛WAXはWAXを使って産毛・不要な毛を根元から一気に除去します。シェービングより持ちが良く（約2〜3週間）、仕上がりもスッキリします。シェービングは剃るだけなので根元から取れませんが、痛みが少なく費用が安い傾向があります。眉毛サロンでは形の設計から行うWAX施術が、仕上がりのクオリティが高くなります。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXの持ちはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "眉毛WAXの持ちは一般的に2〜3週間です。毛の生え方・毛量によって個人差があります。定期的に施術することで産毛の生えにくい綺麗な眉に整っていくのが特長です。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXはメンズでも受けられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、Raffineでは男性のお客様の眉毛WAX・アイブロウ施術にも対応しています。眉毛を整えるだけで清潔感が格段に上がるため、男性からも好評です。メンズのご来店も歓迎しています。",
      },
    },
    {
      "@type": "Question",
      name: "まつ毛パーマと眉毛WAXを同日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、Raffineではラッシュリフト（まつ毛パーマ）と眉毛WAXのセット施術が可能です。合計90〜100分が目安です。眉毛と目元をまとめて整えることでバランスの取れた印象に仕上がります。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛の形が分からない・どんな形にすればいいか相談できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、カウンセリングで骨格・目の形・なりたいイメージをヒアリングし、お顔に合った眉毛の形をご提案します。「初めてで眉毛の形が分からない」という方も安心してご来店ください。Raffine（TEL: 088-823-6622）では初めてのお客様も多く担当しています。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のはりまや橋からRaffineへのアクセスは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Raffineは高知市帯屋町2-1-40に位置し、はりまや橋から徒歩約5分です。帯屋町商店街エリアの中心部にあります。お車の方は近隣の有料駐車場をご利用ください。TEL: 088-823-6622。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-mayu-salon-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-mayu-salon-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#mayu-intro", "#mayu-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiMayuSalonGuidePage() {
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
            <span>高知の眉毛サロンガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Eyebrow Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の眉毛サロンガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">眉毛WAX・アイブロウデザインの料金・持ち・選び方</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="mayu-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知市で眉毛サロンをお探しの方へ
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              眉毛は顔の印象を大きく左右するパーツです。高知市内では眉毛専門サロンの数が限られており、まつ毛パーマと眉毛WAXを同時に施術できるサロンはさらに少ないのが現状です。
            </p>
            <p className="text-sm sm:text-base text-site-text leading-loose mt-3">
              Raffine（ラフィーヌ、高知市帯屋町2-1-40）はまつ毛パーマ・まつ毛エクステ・眉毛WAXに対応するアイラッシュ専門サロンです。目元トータルのご相談をお受けしています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              Raffineの眉毛WAX料金
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige w-1/2">メニュー</th>
                    <th className="text-left p-3 text-site-accent font-medium border-b border-site-greige">料金（税込・目安）</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">時間</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["眉毛WAX（アイブロウ）", "3,300円〜", "30〜40分"],
                    ["ラッシュリフト（まつ毛パーマ）", "6,600円〜", "60〜80分"],
                    ["眉毛WAX＋ラッシュリフト", "お問い合わせ", "90〜100分"],
                  ].map(([menu, price, time]) => (
                    <tr key={menu} className="border-b border-site-greige last:border-0">
                      <td className="p-3 text-site-text">{menu}</td>
                      <td className="p-3 text-site-accent font-medium">{price}</td>
                      <td className="p-3 text-site-muted">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-site-muted mt-2">※料金はデザイン・状態により変動します。詳細はお問い合わせください。</p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              眉毛WAXとシェービングの違い
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige w-1/3">比較項目</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">シェービング</th>
                    <th className="text-left p-3 text-site-accent font-medium border-b border-site-greige">眉毛WAX</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["除去の方法", "剃る", "根元から抜く"],
                    ["持ち", "1〜2週間", "2〜3週間"],
                    ["仕上がり", "普通", "スッキリ・キレイ"],
                    ["痛み", "なし", "少しある"],
                    ["形の設計", "自分で決める", "専門家が提案"],
                  ].map(([item, shave, wax]) => (
                    <tr key={item} className="border-b border-site-greige last:border-0">
                      <td className="p-3 text-site-text font-medium">{item}</td>
                      <td className="p-3 text-site-muted">{shave}</td>
                      <td className="p-3 text-site-accent">{wax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              眉毛WAXの施術の流れ
            </h2>
            <ol className="space-y-4">
              {[
                ["カウンセリング", "骨格・目の形・なりたいイメージをヒアリング。眉毛の形・太さ・長さをご提案します。"],
                ["デザイン確認", "施術前に鉛筆で仮の形を描いて確認します。「ここを変えたい」など細かい要望もこの時点でお伝えください。"],
                ["WAX施術", "WAXを塗布し、布やシートで一気に除去。産毛・形の外側の毛をきれいに取り除きます。"],
                ["仕上げ", "残った細かい毛をピンセットで整え、肌を鎮静させます。仕上がりを確認していただきます。"],
                ["アフターケア案内", "施術後の注意事項（当日は強い摩擦を避ける等）をお伝えします。"],
              ].map(([step, desc], i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-site-accent text-white text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-site-text mb-1">{step}</p>
                    <p className="text-sm text-site-muted leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="mayu-faq">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-6">
              よくある質問
            </h2>
            <dl className="space-y-4">
              {faqSchema.mainEntity.map((item, i) => (
                <div key={i} className="border border-site-greige bg-site-light p-5">
                  <dt className="text-sm font-medium text-site-text mb-2">Q. {item.name}</dt>
                  <dd className="text-sm text-site-muted leading-relaxed">A. {item.acceptedAnswer.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="bg-site-light border border-site-greige p-6">
            <h2 className="font-serif text-lg font-semibold text-site-text mb-3">ご予約・アクセス</h2>
            <div className="text-sm text-site-muted space-y-1">
              <p className="font-medium text-site-text">Raffine（ラフィーヌ）</p>
              <p>高知県高知市帯屋町2-1-40</p>
              <p>TEL: 088-823-6622</p>
              <p>営業時間: 10:00〜19:00（火曜定休）</p>
              <p className="mt-2 text-xs">はりまや橋から徒歩約5分・帯屋町商店街エリア</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/salon/raffine"
                className="text-xs px-4 py-2 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors"
              >
                Raffine 詳細・予約
              </Link>
            </div>
          </section>

        </div>
      </article>

      <GuideRelatedArticles category="eyelash" tags={["眉毛WAX", "眉毛サロン", "まつ毛パーマ"]} />
    </>
  );
}
