import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知の美容室・アイラッシュサロン料金ガイド｜カット・カラー・縮毛矯正・まつげパーマの相場";
const DESC =
  "高知市・香南市の美容室・アイラッシュサロンの料金目安を解説。カット・カラー・縮毛矯正・髪質改善・まつげパーマ・まつエク・眉毛WAXの相場とfleur GROUP料金を掲載。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-beauty-price-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-beauty-price-guide` },
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
  dateModified: "2026-09-09",
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
          "高知市の美容室のカット料金は、シャンプー・ブロー込みで3,500〜6,000円程度が目安です。fleur GROUPのRiv. by fleuramiでは4,500〜5,500円前後。スタイリストの指名・経験年数によって料金が異なります。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のヘアカラー料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室のヘアカラー（リタッチ・全体カラー）は7,000〜15,000円程度が目安です。白髪ぼかしハイライトや特殊カラーはさらに高くなる場合があります。fleur GROUPでは艶カラー・透明感カラーが8,000〜14,000円前後（長さによる）です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の縮毛矯正の料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の縮毛矯正料金は15,000〜25,000円前後が相場です。髪の長さ・状態・施術範囲（全体・前髪のみなど）によって変わります。fleur GROUPでは15,000〜22,000円程度を目安にしています。詳細はホットペッパービューティーか予約時にご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知で髪質改善トリートメントの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市・香南市の髪質改善トリートメント（酸熱トリートメント）の料金目安はショート〜ミディアムで12,000〜18,000円程度です。fleur GROUPのRiv. by fleurami・fleuramiでも同程度の料金となっています。髪質改善縮毛矯正は25,000〜35,000円前後が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のまつげパーマ料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市のアイラッシュサロンのまつげパーマ（ラッシュリフト・パリジャンリフト）料金は6,000〜10,000円前後が目安です。Raffine（高知市はりまや橋）ではラッシュリフトが7,000〜9,000円程度。まつエクとの組み合わせ（エクパーマ）は10,000円台が多いです。",
      },
    },
    {
      "@type": "Question",
      name: "高知市のまつげエクステ（マツエク）料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市のまつげエクステ料金は初回フル装着で9,000〜18,000円、リペア（付け足し）で6,000〜10,000円が目安です。Raffine（高知市はりまや橋）では韓国束感・フラットラッシュ・LEDエクステを提供しています。詳細な料金はホットペッパービューティーでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の眉毛WAXの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の眉毛WAX料金は3,000〜5,000円前後が目安です。Raffine（高知市はりまや橋）では眉毛WAX単品とまつげメニューとのセット割引もあります。メンズ眉WAXも対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "高知市の美容室でヘッドスパの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "高知市の美容室のヘッドスパ料金は3,000〜6,000円前後（20〜40分）が目安です。fleur GROUPのRiv. by fleuramiではヘッドスパ単品から対応しています。カットやカラーとのセット施術も可能です。",
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
          "高知市の美容室でカット＋カラーセットは12,000〜20,000円前後が目安です。fleur GROUPではカット＋艶カラー（セット）で13,000〜19,000円程度（長さ・スタイリストによる）。ホットペッパービューティーにクーポンが掲載されている場合があります。",
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

const EYELASH_PRICES = [
  { menu: "まつげパーマ（ラッシュリフト）", price: "7,000〜9,000" },
  { menu: "パリジャンリフト", price: "8,000〜10,000" },
  { menu: "まつエク・フラットラッシュ（80本〜）", price: "9,000〜13,000" },
  { menu: "韓国束感まつエク", price: "10,000〜16,000" },
  { menu: "エクパーマ（まつパ+エクステ）", price: "11,000〜15,000" },
  { menu: "眉毛WAX（アイブロウ）", price: "3,000〜5,000" },
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
            fleur GROUP（Riv. by fleurami・fleurami・Raffine）での実際の料金水準を参考に、高知の相場感をご確認ください。
            料金は髪の長さ・状態・スタイリストによって変わります。予約前にホットペッパービューティーでクーポン・詳細料金をご確認ください。
          </p>
        </section>

        {/* ヘアメニュー料金表 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">美容室（ヘア）料金目安</h2>
          <p className="text-xs text-site-muted mb-3">※税込・目安料金（2026年）。長さ・状態により変動します。</p>
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

        {/* アイラッシュ料金表 */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-4">アイラッシュ・眉毛メニュー料金目安</h2>
          <p className="text-xs text-site-muted mb-3">※税込・目安料金（2026年）。Raffine（高知市はりまや橋）の水準を参考に記載。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse border border-site-greige">
              <thead>
                <tr className="bg-site-light">
                  <th className="border border-site-greige px-3 py-2 text-left text-site-text">メニュー</th>
                  <th className="border border-site-greige px-3 py-2 text-center text-site-text">目安料金（円）</th>
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
                a: "シャンプー・ブロー込みで3,500〜6,000円程度が目安です。fleur GROUPのRiv. by fleuramiでは4,500〜5,500円前後。スタイリストの指名・経験年数によって異なります。",
              },
              {
                q: "高知市のヘアカラー料金はいくらですか？",
                a: "全体カラーで7,000〜15,000円程度が目安。fleur GROUPの艶カラーは8,000〜14,000円前後（長さによる）です。",
              },
              {
                q: "高知市の縮毛矯正の料金はいくらですか？",
                a: "15,000〜25,000円前後が相場です。fleur GROUPでは15,000〜22,000円程度を目安にしています。",
              },
              {
                q: "高知で髪質改善トリートメントの料金はいくらですか？",
                a: "酸熱トリートメントはショート〜ミディアムで12,000〜18,000円程度。髪質改善縮毛矯正は25,000〜35,000円前後が目安です。",
              },
              {
                q: "高知市のまつげパーマ料金はいくらですか？",
                a: "ラッシュリフトで7,000〜9,000円、パリジャンリフトで8,000〜10,000円が目安です（Raffine・高知市はりまや橋の水準）。",
              },
              {
                q: "高知市でカットとカラーをセットするといくらですか？",
                a: "カット＋全体カラーセットで12,000〜20,000円前後が目安です。ホットペッパービューティーにセットクーポンがある場合もあります。",
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
              Riv. by fleurami（高知市）
            </Link>
            <Link href="/salon/fleurami" className="inline-block px-6 py-2.5 border border-site-accent text-site-accent text-xs tracking-wider hover:bg-site-accent hover:text-white transition-colors">
              fleurami（香南市）
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
    </>
  );
}
