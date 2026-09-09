import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知のパーマ・縮毛矯正ガイド｜種類・選び方・料金目安";
const DESC =
  "高知市・香南市でパーマ・縮毛矯正・デジタルパーマ・エクパーマを検討中の方へ。種類の違い・選び方・施術時間・料金目安をfleur GROUPが解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-perm-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-perm-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のパーマ・縮毛矯正ガイド", url: `${BASE}/guide/kochi-perm-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-perm-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "縮毛矯正" },
    { "@type": "Thing", name: "パーマ" },
    { "@type": "Thing", name: "デジタルパーマ" },
    { "@type": "Service", name: "縮毛矯正", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市・香南市で縮毛矯正が得意な美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPの「Riv. by fleurami（高知市南川添）」と「fleurami（香南市野市）」が縮毛矯正を得意としています。くせ毛・うねりの状態に合わせた薬剤選定とアイロン技術で、ダメージを抑えながら自然なストレートに仕上げます。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正とパーマは同時にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "縮毛矯正とパーマを同日に施術することは、薬剤の性質上できません。縮毛矯正はくせ毛をまっすぐに整える施術、パーマはウェーブやカールをつける施術で、同時にかけると互いに打ち消しあいます。どちらを優先するかはカウンセリングで相談できます。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正はどのくらい持ちますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "縮毛矯正をかけた部分は半永久的に効果が持続しますが、新しく生えてくる根元はくせが出てきます。そのため3〜6ヶ月に1回、根元部分を施術するのが一般的なサイクルです。",
      },
    },
    {
      "@type": "Question",
      name: "パーマとデジタルパーマはどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "通常のパーマは薬剤だけでカールをつける施術で、濡れた状態でウェーブが出やすく乾くと伸びやすい特性があります。デジタルパーマは薬剤＋専用ロッドの熱でカールを固定する施術で、乾かしてもカールが出やすく、ゆるめのカールに向いています。",
      },
    },
    {
      "@type": "Question",
      name: "高知でエクパーマができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPの「Riv. by fleurami（高知市）」と「fleurami（香南市）」でエクパーマ（エクステ＋パーマ）に対応しています。自まつ毛が短い・下向きで悩む方向けのアイラッシュ施術です。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正の施術時間はどれくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "縮毛矯正はカットと合わせて3〜5時間が目安です。髪の長さやくせの強さ、カラーとの同日施術かどうかによって前後します。予約時にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知の縮毛矯正の料金目安はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUP（2026年9月時点）の縮毛矯正の税込料金は15,000〜22,000円前後が目安です。髪の長さ・ダメージ状態・追加トリートメントの有無によって異なります。詳細はメニューページまたはホットペッパービューティーでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正後のホームケアで気をつけることは？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "施術当日は洗髪を避け、24時間は摩擦・結ぶ・ピン止めしないのが基本です。洗い流さないトリートメントやヘアオイルでしっかり保湿すると持ちがよくなります。シャンプーはアミノ酸系を選ぶと髪へのダメージが少なくなります。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正とカラーを同日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "髪の状態によって同日施術が可能な場合があります。施術順は縮毛矯正を先に行い、カラーはその後が基本です。ただし負担が大きくなるため、カウンセリングで髪の状態を確認した上でご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知の梅雨・夏の湿気対策として縮毛矯正は効果的ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知県は梅雨から夏にかけて湿度が非常に高く、くせ毛や広がりが出やすい環境です。縮毛矯正は湿気によるうねりを半永久的に抑える最も効果の高い施術です。「Riv. by fleurami（高知市）」「fleurami（香南市）」では高知の高湿度に合わせた薬剤選定を行っています。",
      },
    },
    {
      "@type": "Question",
      name: "ツイストパーマとは何ですか？高知でできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ツイストパーマは毛束をねじりながらロッドで巻くパーマで、無造作な動きと束感が特徴です。メンズに人気のスタイルで、スタイリングが簡単なのが特長です。「Riv. by fleurami（高知市）」「fleurami（香南市）」で対応しています。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-perm-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-perm-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#perm-guide-intro", "#perm-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiPermGuidePage() {
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
            <span>高知のパーマ・縮毛矯正ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Perm &amp; Straight Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知のパーマ・縮毛矯正ガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">種類の違い・選び方・施術時間・料金目安</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="perm-guide-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              パーマ・縮毛矯正の選び方
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              高知県は梅雨から夏にかけて湿度が非常に高く、くせ毛・うねり・広がりが出やすい環境です。「まとめたい」「カールをつけたい」「ストレートにしたい」という目的によって最適な施術が異なります。fleur GROUPでは高知の気候に合わせた薬剤選定とカウンセリングで、それぞれのお悩みに対応しています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              施術の種類と特徴
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "縮毛矯正",
                  desc: "くせ毛を薬剤とアイロンで半永久的にまっすぐ整える施術。高知の湿気によるうねりに最も効果的。持続性が高く、伸びてきた根元を3〜6ヶ月おきに施術するのが一般的。",
                  link: "/service/shukumou-kyousei",
                },
                {
                  name: "髪質改善トリートメント",
                  desc: "ダメージを補修しながらまとまりとツヤを引き出す施術。強いくせより、柔らかいうねりや広がり・ダメージが気になる方に向いている。縮毛矯正より柔らかい仕上がりが特長。",
                  link: "/service/kamishitsu-kaizen",
                },
                {
                  name: "パーマ（コールドパーマ）",
                  desc: "薬剤だけでカールをつける施術。濡れている状態でウェーブが出やすく、乾くと伸びやすい特性がある。自然な動きやゆるウェーブに向いている。",
                  link: null,
                },
                {
                  name: "デジタルパーマ",
                  desc: "薬剤＋専用ロッドの熱でカールを固定する施術。乾かしてもカールが残りやすく、ゆるめのカールや大きなウェーブが得意。スタイリングが簡単。",
                  link: null,
                },
                {
                  name: "ツイストパーマ（メンズ）",
                  desc: "毛束をねじりながらロッドで巻くパーマで、無造作な動きと束感が特徴。メンズに人気でスタイリングが簡単なのが特長。",
                  link: "/service/mens-twist-perm",
                },
                {
                  name: "エクパーマ（アイラッシュ）",
                  desc: "まつげエクステ＋まつげパーマを組み合わせた施術。自まつ毛が短い・下向きの方でもカールアップできる。Raffineではなく美容室サービス。",
                  link: "/service/ek-perm",
                },
              ].map((item) => (
                <div key={item.name} className="border border-site-greige p-5 bg-site-light">
                  <h3 className="font-medium text-sm text-site-text mb-2">{item.name}</h3>
                  <p className="text-xs text-site-muted leading-relaxed mb-3">{item.desc}</p>
                  {item.link && (
                    <Link href={item.link} className="text-xs text-site-accent hover:underline">
                      詳しく見る →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              縮毛矯正の料金・施術時間の目安
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">施術</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">料金目安（税込）</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">所要時間</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-site-greige">
                  {[
                    { menu: "縮毛矯正", price: "15,000〜22,000円", time: "3〜5時間" },
                    { menu: "縮毛矯正＋カット", price: "18,000〜26,000円", time: "3.5〜5.5時間" },
                    { menu: "髪質改善トリートメント", price: "10,000〜18,000円", time: "2〜3時間" },
                    { menu: "パーマ（コールド）", price: "10,000〜15,000円", time: "2〜3時間" },
                    { menu: "デジタルパーマ", price: "13,000〜18,000円", time: "3〜4時間" },
                    { menu: "ツイストパーマ＋カット（メンズ）", price: "12,000〜16,000円", time: "2〜3時間" },
                  ].map((row) => (
                    <tr key={row.menu}>
                      <td className="p-3 text-site-text">{row.menu}</td>
                      <td className="p-3 text-site-muted">{row.price}</td>
                      <td className="p-3 text-site-muted">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-site-muted mt-3">※料金は2026年9月時点の目安です。髪の長さ・状態によって異なります。詳細はメニューページをご確認ください。</p>
          </section>

          <section id="perm-faq">
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
              高知市・香南市のパーマ・縮毛矯正対応サロン
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/salon/riv", name: "Riv. by fleurami", area: "高知市南川添", note: "縮毛矯正・髪質改善・白髪ぼかし" },
                { href: "/salon/fleurami", name: "fleurami", area: "香南市野市", note: "縮毛矯正・デザインカラー・髪質改善" },
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
                <Link href="/guide/kochi-hair-care" className="text-site-accent hover:underline">
                  高知のヘアケア完全ガイド（縮毛矯正・髪質改善・白髪ぼかしの比較）
                </Link>
              </li>
              <li>
                <Link href="/guide/kochi-color-guide" className="text-site-accent hover:underline">
                  高知のカラー完全ガイド（白髪ぼかし・ブリーチ・艶カラーの選び方）
                </Link>
              </li>
              <li>
                <Link href="/guide/kochi-mens-beauty" className="text-site-accent hover:underline">
                  高知のメンズ美容ガイド（ツイストパーマ・メンズカラー・眉WAX）
                </Link>
              </li>
              <li>
                <Link href="/service/shukumou-kyousei" className="text-site-accent hover:underline">
                  縮毛矯正サービス詳細
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
