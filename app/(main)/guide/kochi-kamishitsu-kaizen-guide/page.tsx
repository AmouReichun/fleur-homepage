import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の髪質改善ガイド｜トリートメント・縮毛矯正との違い・料金目安";
const DESC =
  "高知市・香南市で髪質改善を検討中の方へ。酸熱トリートメント・髪質改善縮毛矯正・水素トリートメントの違い、効果持続期間、料金目安をfleur GROUPが詳しく解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-kamishitsu-kaizen-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-kamishitsu-kaizen-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の髪質改善ガイド", url: `${BASE}/guide/kochi-kamishitsu-kaizen-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-kamishitsu-kaizen-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "髪質改善" },
    { "@type": "Thing", name: "酸熱トリートメント" },
    { "@type": "Thing", name: "髪質改善縮毛矯正" },
    { "@type": "Service", name: "髪質改善", areaServed: "高知市" },
    { "@type": "Service", name: "髪質改善", areaServed: "香南市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市で髪質改善ができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市南川添のRiv. by fleuramiと香南市野市のfleuramiで髪質改善トリートメントを提供しています。酸熱トリートメント・髪質改善縮毛矯正どちらも対応可能です。予約はLINEまたはHot Pepperからお申し込みください。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善トリートメントと普通のトリートメントの違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "普通のトリートメントは髪の表面に成分をコーティングするのに対し、髪質改善トリートメント（酸熱トリートメント）は髪の内部に有機酸（グリオキシル酸など）を結合させて構造自体を強化します。そのため、手触りの改善効果が長持ちし（2〜4ヶ月目安）、くせ毛・うねり・ぱさつきを根本から改善できます。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善縮毛矯正と通常の縮毛矯正はどちらを選べばよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "強いくせ毛やストレートにしたい方には通常の縮毛矯正が適しています。髪質改善縮毛矯正は「自然なストレート＋髪の内部補修」を同時に行うため、ダメージが少なくナチュラルな仕上がりになります。カラーリングもしている方・毎回のアイロン使用を減らしたい方には髪質改善縮毛矯正がおすすめです。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善トリートメントの効果はどれくらい続きますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "酸熱トリートメントは2〜4ヶ月、髪質改善縮毛矯正は半年〜1年程度効果が続きます。ホームケアで酸性シャンプー・補修系アウトバストリートメントを使うと効果が長持ちします。定期的に繰り返すことで、回数を重ねるごとに髪質が改善されていきます。",
      },
    },
    {
      "@type": "Question",
      name: "カラーと髪質改善は同日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ヘアカラーと酸熱トリートメントの同日施術は美容室によって対応が異なります。fleur GROUPでは基本的にカラーと髪質改善を同日対応しておりますが、ダメージ状態によって施術順や内容が変わる場合があります。ご予約時にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善は縮毛矯正のようにぺったりになりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "酸熱トリートメントはくせを「伸ばす」薬剤ではなく、髪を「整える・強化する」ものなので縮毛矯正のようにぺったりとはなりません。自然なまとまりとツヤが出て、ふんわり感を保ちながらうねりを抑えられます。ただし強いくせ毛の場合は効果が限定的なこともあるため、担当スタイリストに相談することをおすすめします。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善の料金はどれくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市・香南市のfleur GROUPでの目安料金は、酸熱トリートメント（ショート〜ミディアム）が12,000〜18,000円、髪質改善縮毛矯正が25,000〜35,000円程度です。髪の長さ・状態・施術内容によって変わりますので、予約時にご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "ブリーチ毛・ハイダメージ毛でも髪質改善できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ブリーチ毛・ハイダメージ毛への酸熱トリートメント施術は可能ですが、髪の状態によっては施術できない場合もあります。縮毛矯正はハイブリーチ毛には難しいケースが多いです。カウンセリングで髪の状態を診断した上で最適なメニューをご提案しますので、まずはお気軽にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "産後の抜け毛・うねり改善に髪質改善は効果的ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "産後ホルモンバランスの変化でくせが強くなる方に、酸熱トリートメントは人気のメニューです。うねりを改善しながら髪を補修できるため、忙しいママさんにも好評です。ただし授乳中の方への薬剤使用については事前にご確認ください。fleur GROUPでは産後のお客様向けの相談も受け付けています。",
      },
    },
    {
      "@type": "Question",
      name: "水素トリートメントとは何ですか？酸熱トリートメントと違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "水素トリートメントは水素の還元力を使って髪の酸化ダメージ（カラー・パーマ・熱）を補修するトリートメントです。酸熱トリートメントが内部構造を化学結合で強化するのに対し、水素トリートメントは補修・保湿・ダメージ回復がメインです。それぞれ目的が異なるため、髪の悩みに合わせて最適なメニューをスタイリストにご相談ください。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-kamishitsu-kaizen-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-kamishitsu-kaizen-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#kamishitsu-intro", "#kamishitsu-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiKamishitsuKaizenGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/guide" className="hover:text-site-accent">美容ガイド</Link>
            <span className="mx-2">/</span>
            <span>高知の髪質改善ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Hair Care Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の髪質改善ガイド
          </h1>
          <p className="text-sm text-site-muted mt-3 leading-relaxed">
            酸熱トリートメント・髪質改善縮毛矯正・水素トリートメントの違いと選び方を解説
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* イントロ */}
        <section id="kamishitsu-intro">
          <p className="text-sm text-site-muted leading-relaxed">
            「くせ毛・うねりをどうにかしたい」「毎朝のスタイリングを楽にしたい」「ダメージ髪をきれいにしたい」——そんなお悩みに応えるのが髪質改善です。
            高知市・香南市のfleur GROUPでは、髪の状態に合わせて酸熱トリートメント・髪質改善縮毛矯正・水素トリートメントをご提案しています。
            このガイドでは、それぞれの違いや効果・料金目安を詳しく解説します。
          </p>
        </section>

        {/* 3メニュー比較 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">髪質改善メニューの比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">メニュー</th>
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">主な効果</th>
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">効果持続</th>
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">こんな方に</th>
                </tr>
              </thead>
              <tbody className="text-site-muted">
                <tr>
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">酸熱トリートメント</td>
                  <td className="border border-site-greige px-3 py-2">うねり軽減・ツヤ・補修</td>
                  <td className="border border-site-greige px-3 py-2">2〜4ヶ月</td>
                  <td className="border border-site-greige px-3 py-2">くせ・ぱさつき・カラーダメージ</td>
                </tr>
                <tr className="bg-site-light">
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">髪質改善縮毛矯正</td>
                  <td className="border border-site-greige px-3 py-2">くせ伸ばし＋内部補修</td>
                  <td className="border border-site-greige px-3 py-2">6ヶ月〜1年</td>
                  <td className="border border-site-greige px-3 py-2">強いくせ毛・自然なストレート希望</td>
                </tr>
                <tr>
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">水素トリートメント</td>
                  <td className="border border-site-greige px-3 py-2">ダメージ補修・保湿</td>
                  <td className="border border-site-greige px-3 py-2">1〜2ヶ月</td>
                  <td className="border border-site-greige px-3 py-2">ハイダメージ・ブリーチ毛のケア</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 酸熱トリートメント詳細 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">酸熱トリートメントとは</h2>
          <p className="text-sm text-site-muted leading-relaxed mb-4">
            酸熱トリートメントは、グリオキシル酸などの有機酸を高温のアイロンで髪の内部に結合させる施術です。
            髪のタンパク質を架橋（ブリッジ）することで、内部構造を強化・整え、うねりを抑えながらツヤを与えます。
            縮毛矯正のようにくせをゼロにするのではなく、髪本来の美しさを引き出すイメージです。
          </p>
          <ul className="text-sm text-site-muted space-y-1.5 list-disc list-inside">
            <li>カラーリングと同日施術が可能（担当者判断）</li>
            <li>繰り返すほど髪質が底上げされる</li>
            <li>ホームケアとの組み合わせで効果が長持ち</li>
            <li>ぺったりしない自然な仕上がり</li>
          </ul>
        </section>

        {/* 髪質改善縮毛矯正 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">髪質改善縮毛矯正とは</h2>
          <p className="text-sm text-site-muted leading-relaxed mb-4">
            通常の縮毛矯正に「髪質改善成分」を組み合わせた施術で、くせをしっかり伸ばしながら髪の内部も同時に補修します。
            従来の縮毛矯正と比べてダメージが少なく、ナチュラルな仕上がりになるのが特徴です。
            「ストレートにしたいけれどダメージが気になる」という方に特に人気があります。
          </p>
          <div className="bg-site-light border border-site-greige p-4 rounded text-xs text-site-muted">
            <p className="font-medium text-site-text mb-1">通常の縮毛矯正との主な違い</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>より低ダメージ・仕上がりが自然</li>
              <li>アイロンによるぺったり感が少ない</li>
              <li>補修成分配合でツヤが出る</li>
              <li>繰り返し施術しても髪へのダメージが蓄積しにくい</li>
            </ul>
          </div>
        </section>

        {/* ホームケア */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">髪質改善を長持ちさせるホームケア</h2>
          <p className="text-sm text-site-muted leading-relaxed mb-4">
            酸熱トリートメントの効果を最大化するには、弱酸性（pH4〜5）のシャンプーを使うことが重要です。
            アルカリ性シャンプーは施術で形成した結合を崩す可能性があります。
          </p>
          <ul className="text-sm text-site-muted space-y-1.5 list-disc list-inside">
            <li>弱酸性シャンプー・酸性シャンプーを選ぶ</li>
            <li>洗い流さないトリートメント（アウトバス）を毎日使う</li>
            <li>ドライヤー前のヒートプロテクトを忘れない</li>
            <li>髪が濡れたまま寝ない（摩擦ダメージを防ぐ）</li>
            <li>2〜4ヶ月ごとに定期的に施術を繰り返す</li>
          </ul>
        </section>

        {/* FAQ */}
        <section id="kamishitsu-faq">
          <h2 className="font-serif text-xl font-semibold text-site-text mb-6">よくある質問</h2>
          <dl className="space-y-5">
            {[
              {
                q: "高知市で髪質改善ができる美容室はありますか？",
                a: "高知市南川添のRiv. by fleuramiと香南市野市のfleuramiで髪質改善トリートメントを提供しています。酸熱トリートメント・髪質改善縮毛矯正どちらも対応可能です。",
              },
              {
                q: "髪質改善トリートメントと普通のトリートメントの違いは？",
                a: "普通のトリートメントは髪の表面をコーティングするのに対し、酸熱トリートメントは髪の内部構造を強化します。そのため効果が2〜4ヶ月長持ちし、くせ・うねり・ぱさつきを根本から改善できます。",
              },
              {
                q: "髪質改善縮毛矯正と通常の縮毛矯正はどちらを選べばよいですか？",
                a: "強いくせ毛でしっかりストレートにしたい方には通常の縮毛矯正、ダメージを抑えながら自然なストレートを求める方には髪質改善縮毛矯正がおすすめです。",
              },
              {
                q: "カラーと髪質改善は同日にできますか？",
                a: "fleur GROUPでは基本的にカラーと髪質改善を同日対応しています。ダメージ状態によって施術順や内容が変わる場合があるため、ご予約時にご相談ください。",
              },
              {
                q: "ブリーチ毛・ハイダメージ毛でも髪質改善できますか？",
                a: "ブリーチ毛への酸熱トリートメントは可能なケースが多いですが、髪の状態によっては施術できない場合もあります。カウンセリングで診断した上で最適なメニューをご提案します。",
              },
              {
                q: "産後のうねり・抜け毛に髪質改善は効果的ですか？",
                a: "産後のホルモン変化によるくせ・うねりに酸熱トリートメントは人気のメニューです。うねりを改善しながら補修できるため、忙しいママさんにも好評です。",
              },
              {
                q: "髪質改善の料金はどれくらいですか？",
                a: "fleur GROUPでの目安料金は、酸熱トリートメント（ショート〜ミディアム）が12,000〜18,000円、髪質改善縮毛矯正が25,000〜35,000円程度です。髪の長さ・状態によって変わります。",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-site-greige pb-5">
                <dt className="text-sm font-medium text-site-text mb-1.5">{q}</dt>
                <dd className="text-sm text-site-muted leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA */}
        <section className="bg-site-light border border-site-greige p-6 sm:p-8 text-center">
          <p className="text-xs tracking-[0.3em] text-site-accent uppercase mb-2">Booking</p>
          <p className="font-serif text-xl font-semibold text-site-text mb-2">高知市・香南市で髪質改善を体験する</p>
          <p className="text-xs text-site-muted mb-6">
            Riv. by fleurami（高知市）・fleurami（香南市）で承っています。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/salon/riv"
              className="inline-block px-6 py-2.5 bg-site-accent text-white text-xs tracking-wider hover:opacity-80 transition-opacity"
            >
              Riv. by fleurami を見る
            </Link>
            <Link
              href="/salon/fleurami"
              className="inline-block px-6 py-2.5 border border-site-accent text-site-accent text-xs tracking-wider hover:bg-site-accent hover:text-white transition-colors"
            >
              fleurami を見る
            </Link>
          </div>
        </section>

        {/* 関連ガイド */}
        <nav aria-label="関連ガイド">
          <h2 className="font-serif text-base font-semibold text-site-text mb-4">関連ガイド</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/kochi-perm-guide" className="text-site-accent hover:underline">高知のパーマ・縮毛矯正ガイド</Link></li>
            <li><Link href="/guide/kochi-shiraga-guide" className="text-site-accent hover:underline">高知の白髪ぼかし・グレイカラーガイド</Link></li>
            <li><Link href="/guide/kochi-hair-care" className="text-site-accent hover:underline">高知のヘアケア・ホームケアガイド</Link></li>
            <li><Link href="/guide/kochi-head-spa-guide" className="text-site-accent hover:underline">高知のヘッドスパガイド</Link></li>
            <li><Link href="/guide" className="text-site-accent hover:underline">美容ガイド一覧に戻る</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
}
