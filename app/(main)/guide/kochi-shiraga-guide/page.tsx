import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の白髪ぼかし・グレイカラーガイド｜白髪染めとの違い・選び方";
const DESC =
  "高知市・香南市で白髪ぼかし・グレイカラー・白髪染めを検討中の方へ。ハイライトを使った白髪ぼかしの仕組み・白髪染めとの違い・料金目安をfleur GROUPが解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-shiraga-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-shiraga-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の白髪ぼかし・グレイカラーガイド", url: `${BASE}/guide/kochi-shiraga-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-shiraga-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "白髪ぼかし" },
    { "@type": "Thing", name: "グレイカラー" },
    { "@type": "Thing", name: "白髪染め" },
    { "@type": "Service", name: "白髪ぼかし", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市・香南市で白髪ぼかしができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPの「Riv. by fleurami（高知市南川添）」と「fleurami（香南市野市）」が白髪ぼかしハイライト・グレイカラーを得意としています。大人女性の白髪のお悩みに特化したカウンセリングで、伸びても目立ちにくいスタイルをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしと白髪染めはどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "白髪染めは白髪を暗い色で均一に染めて隠す施術です。根元が伸びると白と黒の境界線が目立ちやすく、定期的なリタッチが必要です。白髪ぼかし（グレイブレンドカラー）はハイライトを細かく入れることで白髪を髪全体に自然になじませる技術で、根元が伸びても目立ちにくく、染め直しのサイクルを長くできます。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしはどのくらいの頻度でかければいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "白髪ぼかしは白髪染めより根元の伸びが目立ちにくいため、2〜3ヶ月に1回程度のペースが目安です。白髪の量・ハイライトの入れ方によって個人差があります。白髪染めよりもリタッチ頻度を減らせるのが大きなメリットです。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしはダメージが大きいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ハイライトを使う場合はブリーチが必要なため、全体染めよりはダメージが出やすい部分があります。ただし細かいハイライト技術で必要最小限の範囲にとどめ、ダメージを抑えることが可能です。「Riv. by fleurami（高知市）」「fleurami（香南市）」ではダメージを考慮した薬剤選定で対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "グレイヘア（白髪を活かしたスタイル）への移行はできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "はい、白髪染めを段階的にやめてグレイヘアへ移行するカラープランに対応しています。根元と既染部分の段差を目立たなくしながら自然につなぐ「グレイカラー移行」を段階的に行います。移行期間は6ヶ月〜1年が目安で、カウンセリングで個別プランをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "50代・60代の白髪にはどんなカラーが似合いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "50代・60代の方には、白髪をなじませながら肌の透明感を引き出す「グレイブレンドカラー」や「艶カラー」が人気です。白髪を無理に隠さず、上品なグレーやシルバー系を活かしたスタイルや、ベージュ・アッシュ系の白髪ぼかしも選ばれています。「Riv. by fleurami（高知市）」ではエイジング世代に合わせたカラー提案を得意としています。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしとカラーを同日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ハイライトの白髪ぼかしとカラーを同日に組み合わせることが可能です。施術時間は3〜5時間が目安になります。「Riv. by fleurami（高知市）」「fleurami（香南市）」では同日施術のご相談をカウンセリングで承っています。",
      },
    },
    {
      "@type": "Question",
      name: "高知の白髪ぼかしの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUP（2026年9月時点）の白髪ぼかしハイライトの料金はデザインにより8,000〜20,000円前後が目安です。全体カラーと組み合わせると12,000〜25,000円前後になります。詳細はメニューページまたはホットペッパービューティーをご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしのホームケアで気をつけることは？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "白髪ぼかし後は、カラーシャンプー（パープル・シルバー系）を週1〜2回使うと色持ちが改善します。アミノ酸シャンプーと洗い流さないトリートメントで保湿することもダメージケアに効果的です。紫外線による退色を防ぐためUVカット効果のあるスタイリング剤も有効です。",
      },
    },
    {
      "@type": "Question",
      name: "産後に白髪が増えた場合、白髪ぼかしはできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "産後の白髪増加には白髪ぼかしが対応しやすい施術です。ただし授乳中のカラー施術については薬剤の種類を考慮する必要があります。「Riv. by fleurami（高知市）」「fleurami（香南市）」ではカウンセリングでご状況を伺い、最適なカラープランをご提案します。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-shiraga-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-shiraga-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#shiraga-intro", "#shiraga-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiShiragaGuidePage() {
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
            <span>高知の白髪ぼかし・グレイカラーガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Gray Color Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の白髪ぼかし・グレイカラーガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">白髪染めとの違い・選び方・料金目安</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="shiraga-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              白髪ぼかしとは
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              白髪ぼかし（グレイブレンドカラー）とは、白髪を均一に染める「白髪染め」とは異なり、細かいハイライトを使って白髪を髪全体に自然になじませる技法です。根元が伸びても黒と白の境界線が出にくいため、白髪染めより染め直しの頻度を減らすことができます。fleur GROUPは高知市・香南市でこの技術を得意としており、大人女性の白髪のお悩みに特化したカウンセリングを行っています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              白髪染めと白髪ぼかしの比較
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige w-1/3">比較項目</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">白髪染め</th>
                    <th className="text-left p-3 text-site-accent font-medium border-b border-site-greige">白髪ぼかし</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-site-greige">
                  {[
                    ["仕組み", "白髪を暗い色で均一に染める", "ハイライトで白髪を自然にグラデーションする"],
                    ["根元の伸び", "目立ちやすい（白と黒の境界線）", "目立ちにくい（グラデーション）"],
                    ["頻度", "1〜2ヶ月ごとのリタッチが必要", "2〜3ヶ月ごとで済む場合が多い"],
                    ["仕上がり", "均一・落ち着いた印象", "自然・明るい・おしゃれな印象"],
                    ["ダメージ", "比較的少ない", "ハイライト部分にやや出やすい"],
                    ["料金", "8,000〜15,000円前後", "10,000〜25,000円前後"],
                  ].map(([item, old, neo]) => (
                    <tr key={item}>
                      <td className="p-3 text-site-text font-medium">{item}</td>
                      <td className="p-3 text-site-muted">{old}</td>
                      <td className="p-3 text-site-muted">{neo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-site-muted mt-3">※料金は2026年9月時点のfleur GROUP目安です。</p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              グレイヘアへの移行
            </h2>
            <p className="text-sm text-site-text leading-loose">
              白髪染めをやめてグレイヘア（白髪を活かしたシルバーグレースタイル）へ移行したい方も増えています。突然やめると根元の白髪と既染部分の色の段差が目立つため、白髪ぼかしのハイライトを活用しながら段階的に移行するのが自然です。移行期間の目安は6ヶ月〜1年程度です。
            </p>
            <p className="mt-4">
              <Link href="/service/shiraga-bokashi" className="text-site-accent text-sm hover:underline">
                白髪ぼかしサービス詳細はこちら →
              </Link>
            </p>
          </section>

          <section id="shiraga-faq">
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

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知市・香南市の白髪ぼかし対応サロン
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/salon/riv", name: "Riv. by fleurami", area: "高知市南川添", note: "白髪ぼかし・グレイカラー・艶カラー" },
                { href: "/salon/fleurami", name: "fleurami", area: "香南市野市", note: "白髪ぼかし・縮毛矯正・デザインカラー" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block border border-site-greige p-5 hover:border-site-accent transition-colors group"
                >
                  <span className="block font-medium text-sm text-site-text group-hover:text-site-accent mb-1">{s.name}</span>
                  <span className="block text-xs text-site-muted mb-2">{s.area}</span>
                  <span className="block text-xs text-site-accent">{s.note}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-site-light p-6">
            <h2 className="font-serif text-lg font-semibold text-site-text mb-3">関連ガイド</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide/kochi-color-guide" className="text-site-accent hover:underline">
                  高知のカラー完全ガイド（艶カラー・ブリーチ・インナーカラーの選び方）
                </Link>
              </li>
              <li>
                <Link href="/guide/kochi-adult-beauty" className="text-site-accent hover:underline">
                  高知の大人向け美容ガイド（40代・50代のエイジングヘア対策）
                </Link>
              </li>
              <li>
                <Link href="/service/shiraga-bokashi" className="text-site-accent hover:underline">
                  白髪ぼかしサービス詳細
                </Link>
              </li>
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
