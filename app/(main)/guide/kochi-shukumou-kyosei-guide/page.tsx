import type { Metadata } from "next";
import Link from "next/link";
import GuideRelatedArticles from "@/components/GuideRelatedArticles";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知市の縮毛矯正ガイド｜料金・持ち・酸性ストレートとの違いを解説";
const DESC =
  "高知市・香南市で縮毛矯正を検討中の方へ。料金相場・施術時間・持ち・向いている髪質・酸性ストレートとの違いをfleur GROUPが解説。Riv.byfleurami（高知市）・fleurami（香南市）で対応。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-shukumou-kyosei-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-shukumou-kyosei-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知市の縮毛矯正ガイド", url: `${BASE}/guide/kochi-shukumou-kyosei-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-shukumou-kyosei-guide`,
  datePublished: "2026-09-27",
  dateModified: "2026-09-27",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "縮毛矯正" },
    { "@type": "Thing", name: "酸性ストレート" },
    { "@type": "Service", name: "縮毛矯正", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市で縮毛矯正ができる美容室と料金は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添9-21のRiv. by fleurami（TEL: 088-884-5566）では縮毛矯正に対応しています。料金はショート15,000円〜、ミディアム17,000円〜、セミロング19,000円〜、ロング22,000円〜（税込・長さ・状態により変動）が目安です。香南市野市のfleurami（TEL: 0887-56-1005）でも縮毛矯正をご提供しています。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正の持ちはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正をかけた部分は半永久的にストレートが維持されます。ただし新しく伸びてくる根元部分には自然なくせが戻るため、3〜6ヶ月を目安にリタッチ施術を行うのが一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正と酸性ストレートはどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正はアルカリ性の薬剤でくせを強力に伸ばす施術。酸性ストレートはpH4〜5前後の低刺激薬剤を使うためダメージが少なく、カラー毛やハイダメージ毛にも対応しやすいです。くせが強い場合は縮毛矯正、ダメージが気になる・カラーと併用したい方には酸性ストレートをおすすめするケースが多いです。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正の施術時間はどのくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ミディアム〜セミロングで3〜4時間が目安です。カウンセリング・薬剤塗布・アイロン・2剤処理・仕上げを含みます。カラーと同日施術の場合は4〜5時間前後になることがあります。",
      },
    },
    {
      "@type": "Question",
      name: "高知の梅雨・夏の湿気で髪が広がる場合に縮毛矯正は有効ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有効です。高知県は梅雨から夏にかけて湿度が高く、くせ毛や広がりが強く出やすい環境です。縮毛矯正は半永久的にくせを伸ばすため、湿気の影響を大幅に減らせます。Riv. by fleurami（高知市）・fleurami（香南市）では高知の気候に合わせた薬剤選定で施術しています。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正後にカラーはできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正後のカラーは、施術後2週間以上の間隔を空けることを推奨します。ただし酸性ストレートを選ぶ場合は同日カラーに対応しやすいケースもあります。事前カウンセリングで判断します。",
      },
    },
    {
      "@type": "Question",
      name: "メンズも縮毛矯正はできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、Riv. by fleurami（高知市）・fleurami（香南市）ではメンズの縮毛矯正にも対応しています。男性はショートが多くなりますが、くせの強さや仕上がりのイメージをカウンセリングで共有してから施術します。メンズショートで13,000円〜が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正で「ぺたんこ」や「ヘルメット感」にならないようにできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "薬剤の強さと根元の処理を適切に行うことで、自然なストレートに仕上げることが可能です。Riv. by fleuramiでは「根元のボリュームを残しながら毛先だけ落ち着かせたい」などの細かいご要望をカウンセリングで確認し、仕上がりイメージを共有してから施術します。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-shukumou-kyosei-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-shukumou-kyosei-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#shukumou-intro", "#shukumou-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiShukumouKyoseiGuidePage() {
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
            <span>高知市の縮毛矯正ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Straightening Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知市の縮毛矯正ガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">料金・持ち・酸性ストレートとの違い・失敗しない選び方</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="shukumou-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              縮毛矯正とは
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              縮毛矯正は、アルカリ性の薬剤でシスチン結合を還元し、アイロンで真っすぐに伸ばした後に2剤で形を定着させる施術です。くせ毛・うねり・広がりを半永久的にストレートにできるため、高知の梅雨〜夏の湿度が高い時期でも扱いやすい髪に整えます。
            </p>
            <p className="text-sm sm:text-base text-site-text leading-loose mt-3">
              fleur GROUPのRiv. by fleurami（高知市南川添）とfleurami（香南市野市）では、くせの強さと髪のダメージを考慮した薬剤選定を重視し、自然なストレートに仕上げることを得意としています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知市の縮毛矯正 料金相場
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige w-1/3">髪の長さ</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">高知市の相場</th>
                    <th className="text-left p-3 text-site-accent font-medium border-b border-site-greige">Riv. by fleurami</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ショート（耳下）", "13,000〜16,000円", "15,000円〜"],
                    ["ミディアム（肩上）", "15,000〜19,000円", "17,000円〜"],
                    ["セミロング", "18,000〜22,000円", "19,000円〜"],
                    ["ロング（肩下）", "21,000〜28,000円", "22,000円〜"],
                  ].map(([len, market, riv]) => (
                    <tr key={len} className="border-b border-site-greige last:border-0">
                      <td className="p-3 text-site-text">{len}</td>
                      <td className="p-3 text-site-muted">{market}</td>
                      <td className="p-3 text-site-accent font-medium">{riv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-site-muted mt-2">※税込・長さ・状態・デザインにより変動。詳しくはカウンセリングでご確認ください。</p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              縮毛矯正 vs 酸性ストレート
            </h2>
            <p className="text-sm text-site-text leading-loose mb-4">
              高知市の美容室では縮毛矯正（アルカリ系）と酸性ストレートの両方を選べるサロンが増えています。どちらが自分に向いているか迷ったときの判断基準を表にまとめました。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige w-1/3">比較項目</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">縮毛矯正</th>
                    <th className="text-left p-3 text-site-accent font-medium border-b border-site-greige">酸性ストレート</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["くせ矯正力", "高い（強いくせにも対応）", "中程度"],
                    ["ダメージ", "やや大きい", "少ない"],
                    ["カラー毛・ブリーチ毛", "要慎重", "対応しやすい"],
                    ["料金", "比較的安い", "やや高め"],
                    ["自然な仕上がり", "技術次第", "ふんわりしやすい"],
                  ].map(([item, straight, acid]) => (
                    <tr key={item} className="border-b border-site-greige last:border-0">
                      <td className="p-3 text-site-text font-medium">{item}</td>
                      <td className="p-3 text-site-muted">{straight}</td>
                      <td className="p-3 text-site-accent">{acid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              縮毛矯正の施術の流れ
            </h2>
            <ol className="space-y-4">
              {[
                ["カウンセリング", "くせの強さ・カラー履歴・ダメージ状態を確認。仕上がりイメージを共有し、縮毛矯正か酸性ストレートかを判断します。"],
                ["薬剤塗布（1剤）", "髪質とくせの強さに合わせた薬剤を選定し、根元から毛先まで均一に塗布。適切な時間置きます。"],
                ["アイロン仕上げ", "薬剤を流した後、適切な温度・テンションでアイロンをかけます。自然なストレートに仕上げるための最重要工程。"],
                ["2剤処理", "ストレートの形を定着させる2剤を塗布。その後、トリートメントで手触りを整えます。"],
                ["仕上げ・ホームケア案内", "スタイリングで完成後、施術後の過ごし方・おすすめのホームケアをお伝えします。"],
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

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              縮毛矯正でよくある失敗と高知での対策
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "ぺたんこ・ヘルメット感になった",
                  body: "根元まで薬剤を当てすぎるとトップが潰れます。Riv. by fleuramiでは根元の処理を慎重に行い、自然な立ち上がりが出るよう仕上げます。",
                },
                {
                  title: "不自然にピンピンになった",
                  body: "薬剤が強すぎる・アイロンのかけすぎで人工的な直毛になるケースです。カウンセリングで希望の仕上がりを共有し、適切な薬剤強度を選定します。",
                },
                {
                  title: "チリチリ・ビビリになった",
                  body: "ダメージ毛への無理な縮毛矯正で起こる失敗です。施術前のトリートメントや酸性ストレートへの変更をご提案するケースがあります。",
                },
              ].map(({ title, body }) => (
                <div key={title} className="border border-site-greige bg-site-light p-5">
                  <p className="text-sm font-medium text-site-text mb-2">⚠ {title}</p>
                  <p className="text-sm text-site-muted leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="shukumou-faq">
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
            <h2 className="font-serif text-lg font-semibold text-site-text mb-3">ご予約・お問い合わせ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-site-muted">
              <div>
                <p className="font-medium text-site-text mb-1">Riv. by fleurami（高知市）</p>
                <p>高知市南川添9-21 2F</p>
                <p>TEL: 088-884-5566</p>
                <p>営業: 9:30〜18:30（月・第1第3火 定休）</p>
              </div>
              <div>
                <p className="font-medium text-site-text mb-1">fleurami（香南市）</p>
                <p>香南市野市町みどりが丘1-182</p>
                <p>TEL: 0887-56-1005</p>
                <p>営業: 9:00〜18:00（月・第2第4火 定休）</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/salon/riv"
                className="text-xs px-4 py-2 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors"
              >
                Riv. by fleurami 詳細
              </Link>
              <Link
                href="/salon/fleurami"
                className="text-xs px-4 py-2 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors"
              >
                fleurami 詳細
              </Link>
            </div>
          </section>

        </div>
      </article>

      <GuideRelatedArticles category="hair" tags={["縮毛矯正", "酸性ストレート", "くせ毛"]} />
    </>
  );
}
