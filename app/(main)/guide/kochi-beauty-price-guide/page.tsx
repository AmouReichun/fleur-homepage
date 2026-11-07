import type { Metadata } from "next";
import Link from "next/link";
import GuideRelatedArticles from "@/components/GuideRelatedArticles";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の美容室・アイラッシュサロン料金ガイド｜カット・カラー・縮毛矯正・まつげパーマの相場";
const DESC =
  "高知市・香南市の美容室・アイラッシュサロンの料金目安を解説。カット・カラー・縮毛矯正・髪質改善・まつげパーマ・まつエク・眉毛WAXの相場とfleur GROUP料金を掲載。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-beauty-price-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-beauty-price-guide`, images: [`${BASE}/images/admin/hero-1782190629178.jpg`] },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の美容室・サロン料金ガイド", url: `${BASE}/guide/kochi-beauty-price-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-beauty-price-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-27",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "美容室料金" },
    { "@type": "Thing", name: "縮毛矯正料金" },
    { "@type": "Thing", name: "髪質改善料金" },
    { "@type": "Thing", name: "まつげパーマ料金" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市の美容室のカット料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室のカット料金は、シャンプー・ブロー込みで3,500〜6,000円程度が目安です。fleur GROUPのRiv. by fleur ami・fleur amiでは似合わせカット4,700円〜（高校生4,000円〜／中学生以下3,850円〜・通常料金）です。スタイリストの指名・経験年数によって料金が異なります。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のヘアカラー料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室のヘアカラー（リタッチ・全体カラー）は7,000〜15,000円程度が目安です。白髪ぼかしハイライトや特殊カラーはさらに高くなる場合があります。fleur GROUPでは艶カラー（ベストマッチングカラー）が7,000円〜、艶カラー＋カットが11,700円〜です（通常料金。ロング料金 M＋500円／L＋1,000円／LL＋1,500円）。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の縮毛矯正の料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の縮毛矯正料金は15,000〜25,000円前後が相場です。髪の長さ・状態・施術範囲（全体・前髪のみなど）によって変わります。fleur GROUPでは縮毛矯正（ショート・カット込み）が16,800円〜で、ロング料金（M＋2,500円／L＋3,500円／LL＋5,000円）が別途かかります。詳細はメニューページをご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知で髪質改善トリートメントの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市・香南市の髪質改善トリートメント（酸熱トリートメント）の料金目安はショート〜ミディアムで12,000〜18,000円程度、髪質改善縮毛矯正は25,000〜35,000円前後が相場です。fleur GROUPのRiv. by fleur ami・fleur amiでは、髪質改善トリートメント（グローバルミルボン プレミアム）7,000円、髪質改善TR＋カット11,700円〜、縮毛矯正＋カット＋髪質改善（GM）23,800円〜です（通常料金）。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のまつげパーマ料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市のアイラッシュサロンのまつげパーマ（ラッシュリフト・パリジェンヌ）料金は6,000〜10,000円前後が目安です。Raffine（高知市はりまや橋）ではラッシュリフトが5,500円、特殊ラッシュリフト（パリジェンヌ・メーテルなど）が6,000円です（通常料金）。まつエクとの組み合わせ（エクパーマ）は、Raffineではフラットラッシュ60本エクパーマ8,000円〜です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のまつげエクステ（マツエク）料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市のまつげエクステ料金は初回フル装着で9,000〜18,000円、リペア（付け足し）で6,000〜10,000円が目安です。Raffine（高知市はりまや橋）では韓国束感・フラットラッシュ・LEDエクステを提供しており、フラットラッシュは40本4,000円〜180本8,800円です（通常料金）。詳細はメニューページをご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の眉毛WAXの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の眉毛WAX料金は3,000〜5,000円前後が目安です。Raffine（高知市はりまや橋）では美眉デザインWAXが5,500円（メンズも同料金・通常料金）で、まつげメニューと同じ日の施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の美容室でヘッドスパの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室のヘッドスパ料金は3,000〜6,000円前後（20〜40分）が目安です。fleur GROUPのRiv. by fleur ami・fleur amiでは特許リフトアップスパ4,200円、クレンジングスパ3,500円、プチスパ1,100円です（通常料金）。カットやカラーと同じ日の施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "高知の美容室の料金はなぜ店舗によって差があるのですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "美容室の料金はスタイリストの技術・経験年数、使用する薬剤の品質、施術時間、立地（賃料）、サービスの内容（シャンプー・ブロー込みかどうかなど）によって変わります。「安い＝品質が低い」ではなく、カウンセリングの丁寧さや施術の精度、使用薬剤の品質を確認することが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でカットとカラーをセットでするといくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室でカット＋カラーセットは12,000〜20,000円前後が目安です。fleur GROUPでは艶カラー＋似合わせカットで11,700円〜です（通常料金。ロング料金 M＋500円／L＋1,000円／LL＋1,500円）。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-beauty-price-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-beauty-price-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#price-intro", "#price-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

const HAIR_PRICES = [
  { menu: "カット（シャンプー・ブロー込み）", short: "3,500〜4,500", mid: "4,000〜5,500", long: "4,500〜6,000" },
  { menu: "ヘアカラー（全体）", short: "7,000〜10,000", mid: "9,000〜13,000", long: "11,000〜15,000" },
  { menu: "白髪ぼかしハイライト", short: "15,000〜", mid: "18,000〜", long: "20,000〜" },
  { menu: "縮毛矯正", short: "15,000〜18,000", mid: "18,000〜22,000", long: "20,000〜25,000" },
  { menu: "酸熱トリートメント", short: "12,000〜14,000", mid: "14,000〜16,000", long: "16,000〜18,000" },
  { menu: "パーマ", short: "8,000〜12,000", mid: "10,000〜14,000", long: "12,000〜16,000" },
  { menu: "ヘッドスパ（30分）", short: "—", mid: "3,500〜5,000", long: "—" },
];

// fleur GROUP美容室の通常料金（data/content.json の menus の定価とその合計）
const OUR_HAIR_PRICES = [
  { menu: "似合わせカット（高校生／中学生以下）", price: "4,700〜（4,000〜／3,850〜）" },
  { menu: "艶カラー（ベストマッチングカラー）", price: "7,000〜" },
  { menu: "艶カラー＋カット", price: "11,700〜" },
  { menu: "白髪ぼかし（ハイライト5枚まで）＋カラー＋カット", price: "13,900〜" },
  { menu: "縮毛矯正（ショート・カット込み）", price: "16,800〜" },
  { menu: "髪質改善トリートメント（GM）＋カット", price: "11,700〜" },
  { menu: "パーマ", price: "12,000" },
  { menu: "ヘッドスパ（プチスパ〜特許リフトアップスパ）", price: "1,100〜4,200" },
];

// Raffineの通常料金（data/content.json の menus.raffine の定価）
const EYELASH_PRICES = [
  { menu: "まつげパーマ（ラッシュリフト）", price: "5,500" },
  { menu: "特殊ラッシュリフト（パリジェンヌ・メーテルなど）", price: "6,000" },
  { menu: "下まつげラッシュリフト", price: "2,200" },
  { menu: "まつエク・フラットラッシュ（40本〜180本）", price: "4,000〜8,800" },
  { menu: "エクパーマ（フラットラッシュ60本〜180本＋エクパーマ）", price: "8,000〜12,300" },
  { menu: "美眉デザインWAX（メンズも同料金）", price: "5,500" },
];

export default function KochiBeautyPriceGuidePage() {
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
            <span>高知の美容室・サロン料金ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Price Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の美容室・サロン料金ガイド
          </h1>
          <p className="text-sm text-site-muted mt-3 leading-relaxed">
            カット・カラー・縮毛矯正・髪質改善・まつげパーマ・マツエクの相場（2026年版）
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* イントロ */}
        <section id="price-intro">
          <p className="text-sm text-site-muted leading-relaxed">
            高知市・香南市で美容室やアイラッシュサロンを検討している方のために、施術ごとの料金目安をまとめました。
            高知の一般的な相場と、fleur GROUP（Riv. by fleur ami・fleur ami・Raffine）の通常料金（定価）を分けて掲載しています。
            料金は髪の長さ・状態・スタイリストによって変わります。fleur GROUPの詳しい料金は<Link href="/menu" className="underline hover:text-site-accent">メニューページ</Link>をご覧ください。
          </p>
        </section>

        {/* ヘアメニュー料金表 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">美容室（ヘア）料金目安</h2>
          <p className="text-xs text-site-muted mb-3">※高知の一般的な相場（税込・目安・2026年）。長さ・状態により変動します。fleur GROUPの料金は下の表をご覧ください。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">メニュー</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">ショート</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">ミディアム</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">ロング</th>
                </tr>
              </thead>
              <tbody className="text-site-muted">
                {HAIR_PRICES.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-site-light" : ""}>
                    <td className="border border-site-greige px-3 py-2 font-medium text-site-text">{row.menu}</td>
                    <td className="border border-site-greige px-3 py-2 text-center">{row.short}</td>
                    <td className="border border-site-greige px-3 py-2 text-center">{row.mid}</td>
                    <td className="border border-site-greige px-3 py-2 text-center">{row.long}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-site-muted mt-2">※ カラーはリタッチ（根元のみ）の場合はショート・ミディアム問わず6,000〜8,000円前後になることもあります。</p>
        </section>

        {/* fleur GROUP 美容室の通常料金（定価） */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">fleur GROUP美容室（Riv. by fleur ami・fleur ami）の通常料金</h2>
          <p className="text-xs text-site-muted mb-3">※税込・通常料金（2026年11月時点）。2店とも同じ料金です。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">メニュー</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">料金（円）</th>
                </tr>
              </thead>
              <tbody className="text-site-muted">
                {OUR_HAIR_PRICES.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-site-light" : ""}>
                    <td className="border border-site-greige px-3 py-2 font-medium text-site-text">{row.menu}</td>
                    <td className="border border-site-greige px-3 py-2 text-center">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-site-muted mt-2">※ ロング料金：カラー M＋500円／L＋1,000円／LL＋1,500円、縮毛矯正 M＋2,500円／L＋3,500円／LL＋5,000円。</p>
        </section>

        {/* アイラッシュ料金表 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">Raffine（アイラッシュ・眉毛）の通常料金</h2>
          <p className="text-xs text-site-muted mb-3">※税込・通常料金（2026年11月時点）。Raffine（高知市はりまや橋）のメニュー表の料金です。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">メニュー</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">料金（円）</th>
                </tr>
              </thead>
              <tbody className="text-site-muted">
                {EYELASH_PRICES.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? "bg-site-light" : ""}>
                    <td className="border border-site-greige px-3 py-2 font-medium text-site-text">{row.menu}</td>
                    <td className="border border-site-greige px-3 py-2 text-center">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 料金の見方 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">美容室の料金を正しく比較するポイント</h2>
          <ul className="text-sm text-site-muted space-y-3 list-disc list-inside">
            <li>
              <strong className="text-site-text">シャンプー・ブロー込みか確認する</strong> —
              カット料金がシャンプー・ブロー別の場合、実際の支払い額は高くなります。
            </li>
            <li>
              <strong className="text-site-text">髪の長さで料金が変わる</strong> —
              ショート・ボブ・ミディアム・ロング・スーパーロングで区分があることが多いです。
            </li>
            <li>
              <strong className="text-site-text">ホットペッパービューティーのクーポンを活用する</strong> —
              初回割引・平日割引・セットクーポンがある場合があります。
            </li>
            <li>
              <strong className="text-site-text">薬剤の品質・技術力も考慮する</strong> —
              安さだけで選ぶとダメージや仕上がりに影響することも。特に縮毛矯正・ブリーチは注意が必要です。
            </li>
            <li>
              <strong className="text-site-text">指名料・スタイリスト指定</strong> —
              チーフスタイリスト・トップスタイリストなど、指名料が追加される場合があります。
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section id="price-faq">
          <h2 className="font-serif text-xl font-semibold text-site-text mb-6">よくある質問</h2>
          <dl className="space-y-5">
            {[
              {
                q: "高知市の美容室のカット料金はいくらですか？",
                a: "シャンプー・ブロー込みで3,500〜6,000円程度が目安です。fleur GROUPのRiv. by fleur ami・fleur amiでは似合わせカット4,700円〜（高校生4,000円〜／中学生以下3,850円〜・通常料金）です。スタイリストの指名・経験年数によって異なります。",
              },
              {
                q: "高知市のヘアカラー料金はいくらですか？",
                a: "全体カラーで7,000〜15,000円程度が目安。fleur GROUPの艶カラーは7,000円〜、艶カラー＋カットは11,700円〜です（通常料金・ロング料金別途）。",
              },
              {
                q: "高知市の縮毛矯正の料金はいくらですか？",
                a: "15,000〜25,000円前後が相場です。fleur GROUPでは縮毛矯正（ショート・カット込み）16,800円〜（ロング料金別途）です。",
              },
              {
                q: "高知で髪質改善トリートメントの料金はいくらですか？",
                a: "相場は酸熱トリートメント（ショート〜ミディアム）で12,000〜18,000円程度、髪質改善縮毛矯正で25,000〜35,000円前後です。fleur GROUPでは髪質改善TR（GM）7,000円、髪質改善TR＋カット11,700円〜です（通常料金）。",
              },
              {
                q: "高知市のまつげパーマ料金はいくらですか？",
                a: "相場は6,000〜10,000円前後です。Raffine（高知市はりまや橋）ではラッシュリフト5,500円、特殊ラッシュリフト（パリジェンヌ・メーテルなど）6,000円です（通常料金）。",
              },
              {
                q: "高知市でカットとカラーをセットするといくらですか？",
                a: "カット＋全体カラーで12,000〜20,000円前後が相場です。fleur GROUPでは艶カラー＋似合わせカットで11,700円〜（通常料金・ロング料金別途）です。",
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
          <p className="font-serif text-xl font-semibold text-site-text mb-2">詳しい料金・予約はこちら</p>
          <p className="text-xs text-site-muted mb-6">
            各店舗の詳細な料金・クーポンはホットペッパービューティーでご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/salon/riv" className="inline-block px-6 py-2.5 bg-site-accent text-white text-xs tracking-wider hover:opacity-80 transition-opacity">
              Riv. by fleur ami（高知市）
            </Link>
            <Link href="/salon/fleurami" className="inline-block px-6 py-2.5 border border-site-accent text-site-accent text-xs tracking-wider hover:bg-site-accent hover:text-white transition-colors">
              fleur ami（香南市）
            </Link>
            <Link href="/salon/raffine" className="inline-block px-6 py-2.5 border border-site-greige text-site-text text-xs tracking-wider hover:border-site-accent hover:text-site-accent transition-colors">
              Raffine（はりまや橋）
            </Link>
          </div>
        </section>

        {/* メニューページリンク */}
        <section className="bg-white border border-site-greige p-5 text-center">
          <Link href="/menu" className="inline-flex items-center gap-3 text-sm text-site-text hover:text-site-accent transition-colors group">
            <span>fleur GROUP 全メニュー・料金一覧を見る</span>
            <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
          </Link>
        </section>

        {/* 関連ガイド */}
        <nav aria-label="関連ガイド">
          <h2 className="font-serif text-base font-semibold text-site-text mb-4">関連ガイド</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/guide/kochi-kamishitsu-kaizen-guide" className="text-site-accent hover:underline">高知の髪質改善ガイド</Link></li>
            <li><Link href="/guide/kochi-perm-guide" className="text-site-accent hover:underline">高知のパーマ・縮毛矯正ガイド</Link></li>
            <li><Link href="/guide/kochi-shiraga-guide" className="text-site-accent hover:underline">高知の白髪ぼかし・グレイカラーガイド</Link></li>
            <li><Link href="/guide/kochi-salon-guide" className="text-site-accent hover:underline">高知の美容室・サロン選び方ガイド</Link></li>
            <li><Link href="/guide" className="text-site-accent hover:underline">美容ガイド一覧に戻る</Link></li>
          </ul>
        </nav>
      </div>
      <GuideRelatedArticles tags={["香南市美容室", "高知市美容室", "まつ毛パーマ", "艶カラー"]} category="both" />
    </>
  );
}
