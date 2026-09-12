import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知のまつげパーマガイド｜ラッシュリフト・パリジャンリフト・持ち・料金";
const DESC =
  "高知市ではりまや橋近くのRaffine（ラフィーネ）が解説するまつげパーマガイド。ラッシュリフト・パリジャンリフトの違い、持続期間、ケア方法、まつエクとの比較、料金目安を詳しく紹介します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-matsuge-perm-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-matsuge-perm-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のまつげパーマガイド", url: `${BASE}/guide/kochi-matsuge-perm-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-matsuge-perm-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "まつげパーマ" },
    { "@type": "Thing", name: "ラッシュリフト" },
    { "@type": "Thing", name: "パリジャンリフト" },
    { "@type": "Service", name: "まつげパーマ", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市でまつげパーマができるアイラッシュサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "「Raffine（ラフィーネ）」（高知市はりまや町1-4-8 TNはりまやビル3F、TEL:090-7120-5566）がまつげパーマに特化したアイラッシュ専門サロンです。はりまや橋から徒歩約3分。ラッシュリフト・パリジャンリフト・エクパーマ（まつパ+エクステ）を提供しています。Googleクチコミ5.0（46件）・ホットペッパービューティー4.84（222件）の高知市トップクラスの評価。",
      },
    },
    {
      "@type": "Question",
      name: "ラッシュリフトとパリジャンリフトの違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ラッシュリフトは自まつげを根元からしっかり立ち上げ、目を大きく見せる効果が高い施術です。パリジャンリフトはラッシュリフトより柔らかいカーブをつけ、まつげの先端を繊細に仕上げるフランス発の技術です。目の形やまつげの長さ・量によって向いている施術が変わります。Raffineでは担当アイリストが丁寧にカウンセリングしてご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマの効果はどれくらい続きますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "一般的にまつげパーマ（ラッシュリフト・パリジャンリフト）の効果は4〜6週間程度が目安です。まつげの生え変わりサイクル（約6週間）により個人差があります。ホームケアで油分の多いメイク落としを避けることで持ちが改善する場合があります。Raffine（高知市）では施術後のケア方法も丁寧にお伝えします。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマとまつげエクステはどちらを選べばよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "まつげパーマ（ラッシュリフト）は自まつげを活かした自然な仕上がりで、アイメイクが少なくて済む・メンテナンスが楽・まつげへのダメージが少ないのが特長です。まつげエクステはボリュームや長さを出したい方・目力のある仕上がりを求める方に向いています。どちらも Raffine（高知市はりまや橋）で対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマ後のケア方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "施術後24時間はまつげを水・湯・スチームにさらさないことが重要です。洗顔時はまつげを擦らず、濡れた場合はそっと押さえて水分を取ります。オイルクレンジングはパーマをゆるめる可能性があるため、ジェルや泡タイプの洗顔料を使用することをおすすめします。まつげ美容液の定期使用で健康なまつげを維持しましょう。",
      },
    },
    {
      "@type": "Question",
      name: "エクパーマ（まつパ+エクステ）とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "エクパーマはまつげパーマ（ラッシュリフト等）とまつげエクステを組み合わせた施術で、自まつげを根元から立ち上げながら長さ・ボリュームも足せます。通常エクステだと下向きに重く仕上がりがちなまつげでも、パーマの力でカールキープできる人気メニューです。Raffine（高知市）で提供しています。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマは下向きまつげでもできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "まつげが下向きに生えていてもまつげパーマ（ラッシュリフト・パリジャンリフト）で根元から立ち上げることができます。下向きまつげの方はむしろパーマの効果を実感しやすい傾向があります。まつげの状態によっては仕上がりに差が出ることもあるため、カウンセリングでご確認ください。Raffine（高知市はりまや橋）でお気軽にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Raffine（高知市はりまや橋）でのまつげパーマ（ラッシュリフト）の料金は7,000〜9,000円程度、パリジャンリフトは8,000〜10,000円程度が目安です（2026年9月時点）。詳細な料金・クーポンはホットペッパービューティーをご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマはすっぴん映えしますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "はい、まつげパーマ（ラッシュリフト・パリジャンリフト）はまつげが根元からカールするため、マスカラやアイメイクをしなくても目元がパッと明るく見えます。すっぴんでも気になりにくく、「自然なのにきれいな目元」が好評です。アイメイクの時短にもなります。",
      },
    },
    {
      "@type": "Question",
      name: "まつげが少なくて細くても施術できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "まつげが少なめ・細めの方でも施術は可能ですが、仕上がりの印象はまつげの量・長さによって異なります。まつげエクステとの組み合わせ（エクパーマ）でボリュームを補う方法もあります。Raffine（高知市）ではカウンセリングで最適なメニューをご提案しますのでお気軽にご相談ください。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-matsuge-perm-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-matsuge-perm-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#matsuge-intro", "#matsuge-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

const raffineSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${BASE}/salon/raffine`,
  name: "Raffine",
  alternateName: "ラフィーネ",
  url: `${BASE}/salon/raffine`,
  telephone: "090-7120-5566",
  address: {
    "@type": "PostalAddress",
    streetAddress: "はりまや町1-4-8 TNはりまやビル3F",
    addressLocality: "高知市",
    addressRegion: "高知県",
    postalCode: "780-0822",
    addressCountry: "JP",
  },
  geo: { "@type": "GeoCoordinates", latitude: 33.5597, longitude: 133.5380 },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 5.0,
    reviewCount: 46,
    bestRating: 5,
  },
  priceRange: "¥¥",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "09:30", closes: "18:30" },
  ],
  hasMap: "https://maps.google.com/?q=Raffine+高知市はりまや町",
};

export default function KochiMatugePermGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSchema) }} />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/guide" className="hover:text-site-accent">美容ガイド</Link>
            <span className="mx-2">/</span>
            <span>高知のまつげパーマガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Lash Perm Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知のまつげパーマガイド
          </h1>
          <p className="text-sm text-site-muted mt-3 leading-relaxed">
            ラッシュリフト・パリジャンリフトの違い・持続期間・ケア方法・料金目安
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* イントロ */}
        <section id="matsuge-intro">
          <p className="text-sm text-site-muted leading-relaxed">
            「まつげが下向き・短い」「マスカラなしでもきれいな目元でいたい」「すっぴん映えしたい」——そんな方に人気なのがまつげパーマです。
            高知市はりまや橋の<strong className="text-site-text">Raffine（ラフィーネ）</strong>は、まつげパーマ・ラッシュリフト・パリジャンリフト・エクパーマに特化したアイラッシュ専門サロンです。
            Googleクチコミ5.0（46件）・ホットペッパービューティー4.84（222件）と高知市内トップクラスの評価を誇ります。
          </p>
        </section>

        {/* Raffine サロン情報 */}
        <section className="bg-site-light border border-site-greige p-5 sm:p-6">
          <h2 className="font-serif text-lg font-semibold text-site-text mb-3">Raffine（ラフィーネ）</h2>
          <dl className="text-xs text-site-muted space-y-1.5">
            <div className="flex gap-2"><dt className="text-site-text w-16 flex-shrink-0">住所</dt><dd>高知市はりまや町1-4-8 TNはりまやビル3F（はりまや橋から徒歩3分）</dd></div>
            <div className="flex gap-2"><dt className="text-site-text w-16 flex-shrink-0">電話</dt><dd>090-7120-5566</dd></div>
            <div className="flex gap-2"><dt className="text-site-text w-16 flex-shrink-0">営業時間</dt><dd>9:30〜18:30 / 不定休（Instagramでお知らせ）</dd></div>
            <div className="flex gap-2"><dt className="text-site-text w-16 flex-shrink-0">特徴</dt><dd>全席半個室・完全予約制・まつげパーマ/エクステ/眉WAX専門・メンズ眉WAX対応</dd></div>
            <div className="flex gap-2"><dt className="text-site-text w-16 flex-shrink-0">クチコミ</dt><dd>Google 5.0 ★（46件）</dd></div>
          </dl>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Link href="/salon/raffine" className="inline-block px-5 py-2 bg-site-accent text-white text-xs tracking-wider hover:opacity-80 transition-opacity text-center">
              Raffine 店舗詳細
            </Link>
            <Link href="/service/matsuge-perm" className="inline-block px-5 py-2 border border-site-accent text-site-accent text-xs tracking-wider hover:bg-site-accent hover:text-white transition-colors text-center">
              まつげパーマのサービス詳細
            </Link>
          </div>
        </section>

        {/* まつパの種類比較 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">まつげパーマの種類比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">施術名</th>
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">カールの特徴</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">持続</th>
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">こんな方に</th>
                </tr>
              </thead>
              <tbody className="text-site-muted">
                <tr>
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">ラッシュリフト</td>
                  <td className="border border-site-greige px-3 py-2">根元からしっかり立ち上げ</td>
                  <td className="border border-site-greige px-3 py-2 text-center">4〜6週</td>
                  <td className="border border-site-greige px-3 py-2">目力が欲しい・短いまつげ</td>
                </tr>
                <tr className="bg-site-light">
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">パリジャンリフト</td>
                  <td className="border border-site-greige px-3 py-2">柔らかい自然なカーブ</td>
                  <td className="border border-site-greige px-3 py-2 text-center">4〜6週</td>
                  <td className="border border-site-greige px-3 py-2">自然な仕上がり希望</td>
                </tr>
                <tr>
                  <td className="border border-site-greige px-3 py-2 font-medium text-site-text">エクパーマ</td>
                  <td className="border border-site-greige px-3 py-2">パーマ＋エクステのカール</td>
                  <td className="border border-site-greige px-3 py-2 text-center">3〜4週</td>
                  <td className="border border-site-greige px-3 py-2">ボリューム・長さも欲しい</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* まつパ vs マツエク */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">まつげパーマ vs まつげエクステ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-site-greige p-5">
              <h3 className="font-medium text-site-text mb-3 text-sm">まつげパーマ（ラッシュリフト）</h3>
              <ul className="text-xs text-site-muted space-y-1.5 list-disc list-inside">
                <li>自まつげをカールさせる</li>
                <li>自然な仕上がり・すっぴん映え</li>
                <li>アイメイクが少なくて済む</li>
                <li>まつげへのダメージが少ない</li>
                <li>メンテナンスが楽（4〜6週に1回）</li>
              </ul>
            </div>
            <div className="border border-site-greige p-5">
              <h3 className="font-medium text-site-text mb-3 text-sm">まつげエクステ（マツエク）</h3>
              <ul className="text-xs text-site-muted space-y-1.5 list-disc list-inside">
                <li>長さ・ボリュームを自由に調整</li>
                <li>目元の印象を大きく変えられる</li>
                <li>デザインが豊富</li>
                <li>3〜4週ごとのリペアが必要</li>
                <li>まつげへの負担あり</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ケア方法 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">まつげパーマ後のホームケア</h2>
          <ol className="text-sm text-site-muted space-y-2 list-decimal list-inside">
            <li>施術後<strong className="text-site-text">24時間</strong>は水・湯・スチームを避ける</li>
            <li>洗顔時はまつげを擦らず、濡れたらそっと押さえて水分を取る</li>
            <li>オイルクレンジングを避ける（ジェル・泡タイプ推奨）</li>
            <li>まつげ美容液を定期使用してまつげを強くする</li>
            <li>枕で目元を押しつぶさないよう寝方に気をつける</li>
          </ol>
        </section>

        {/* FAQ */}
        <section id="matsuge-faq">
          <h2 className="font-serif text-xl font-semibold text-site-text mb-6">よくある質問</h2>
          <dl className="space-y-5">
            {[
              {
                q: "高知市でまつげパーマができるサロンはどこですか？",
                a: "Raffine（ラフィーネ）（高知市はりまや町1-4-8 TNはりまやビル3F、TEL:090-7120-5566）がまつげパーマ専門のアイラッシュサロンです。はりまや橋から徒歩約3分。Googleクチコミ5.0（46件）。",
              },
              {
                q: "ラッシュリフトとパリジャンリフトの違いは？",
                a: "ラッシュリフトは根元からしっかり立ち上げる力強いカール、パリジャンリフトは柔らかく自然なカーブが特長です。目の形・まつげの状態によって最適な施術をご提案します。",
              },
              {
                q: "まつげパーマの効果はどれくらい続きますか？",
                a: "4〜6週間が目安です。まつげの生え変わりサイクルと日々のケアによって個人差があります。",
              },
              {
                q: "施術後のケアで気をつけることは？",
                a: "施術後24時間は水・スチームを避けてください。オイルクレンジングはパーマをゆるめる可能性があるため使用を控えることをおすすめします。",
              },
              {
                q: "下向きまつげでもできますか？",
                a: "できます。むしろ下向きまつげの方はラッシュリフトの効果を実感しやすい傾向があります。カウンセリングで仕上がりのイメージをご確認ください。",
              },
              {
                q: "まつげパーマの料金はいくらですか？",
                a: "Raffine（高知市）でのラッシュリフトは7,000〜9,000円、パリジャンリフトは8,000〜10,000円程度が目安です。最新の料金はホットペッパービューティーでご確認ください。",
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
          <p className="font-serif text-xl font-semibold text-site-text mb-2">高知市でまつげパーマを予約する</p>
          <p className="text-xs text-site-muted mb-6">
            Raffine（高知市はりまや橋）にてご予約受付中。完全予約制。
          </p>
          <Link href="/salon/raffine" className="inline-block px-8 py-3 bg-site-accent text-white text-xs tracking-wider hover:opacity-80 transition-opacity">
            Raffine の予約・店舗詳細を見る
          </Link>
        </section>

        {/* 関連ガイド */}
        <nav aria-label="関連ガイド">
          <h2 className="font-serif text-base font-semibold text-site-text mb-4">関連ガイド</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/kochi-eyelash-care" className="text-site-accent hover:underline">高知のまつげ・眉毛ケア完全ガイド</Link></li>
            <li><Link href="/guide/kochi-beauty-price-guide" className="text-site-accent hover:underline">高知の美容室・サロン料金ガイド</Link></li>
            <li><Link href="/guide/kochi-salon-guide" className="text-site-accent hover:underline">高知の美容室・サロン選び方ガイド</Link></li>
            <li><Link href="/guide" className="text-site-accent hover:underline">美容ガイド一覧に戻る</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
}
