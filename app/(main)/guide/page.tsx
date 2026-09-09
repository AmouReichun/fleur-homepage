import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "高知の美容・ヘアケア情報ガイド | fleur GROUP",
  description:
    "高知県（高知市・香南市）の美容・ヘアケア情報を集約したガイド。髪質改善・縮毛矯正・白髪ぼかし・まつげパーマ・眉毛WAXなど、施術の選び方から高知の美容室・アイラッシュサロンの探し方まで。fleur GROUP（Riv. by fleurami・fleurami・Raffine）が提供する専門情報。",
  alternates: { canonical: `${BASE}/guide` },
  openGraph: {
    title: "高知の美容・ヘアケア情報ガイド | fleur GROUP",
    description:
      "高知県の美容・ヘアケア情報を集約したガイド。髪質改善・縮毛矯正・白髪ぼかし・まつげパーマなど施術の選び方を専門家が解説。",
    url: `${BASE}/guide`,
  },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
];

const guidePageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE}/guide`,
  name: "高知の美容・ヘアケア情報ガイド",
  description:
    "高知県の美容室・アイラッシュサロンで受けられる施術の選び方、よくある悩みの解決策、fleur GROUPが提供するサービス一覧をまとめた情報ガイド。",
  url: `${BASE}/guide`,
  publisher: {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "fleur GROUP",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "髪質改善", url: `${BASE}/service/kamishitsu-kaizen` },
      { "@type": "ListItem", position: 2, name: "縮毛矯正", url: `${BASE}/service/shukumou-kyousei` },
      { "@type": "ListItem", position: 3, name: "白髪ぼかし・グレイカラー", url: `${BASE}/service/shiraga-bokashi` },
      { "@type": "ListItem", position: 4, name: "まつげパーマ・ラッシュリフト", url: `${BASE}/service/matsuge-perm` },
      { "@type": "ListItem", position: 5, name: "眉毛WAX・アイブロウ", url: `${BASE}/service/mayuge-wax` },
      { "@type": "ListItem", position: 6, name: "カット・似合わせカット", url: `${BASE}/service/cut` },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "髪質改善と縮毛矯正はどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正はくせ毛を薬剤とアイロンで半永久的にまっすぐ伸ばす施術で、強いくせ毛に向いています。髪質改善トリートメントはダメージを補修しながら扱いやすい質感に整える施術で、軽いくせ・ダメージが気になる方に向いています。高知市のRiv. by fleuramiと香南市のfleuramiではカウンセリングで最適な施術をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかしと白髪染めは何が違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染めは白髪を暗い色で覆い隠す技術で、根元が伸びると白髪が目立ちやすくなります。白髪ぼかしはハイライトや細かい明るめのカラーを使って白髪を髪全体に自然になじませる技術で、伸びても境目が目立ちにくく、長く楽しめるのが特長です。「Riv. by fleurami」と「fleurami」が得意としています。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で美容室を選ぶポイントは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "①得意な施術が自分の悩みと合っているか（髪質改善・縮毛矯正・カラーなど）、②カウンセリングを丁寧に行うサロンか、③口コミ・実績が確認できるか（Google口コミ件数と評価）、④アクセス・駐車場の有無、⑤予約のしやすさ（ホットペッパー・LINE等）を確認するとよいでしょう。",
      },
    },
    {
      "@type": "Question",
      name: "高知市ではりまや橋の近くにアイラッシュサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋から徒歩約3分の「Raffine（ラフィーネ）」がアイラッシュ・眉毛専門サロンです。まつげパーマ（パリジャンリフト・ラッシュリフト）・まつげエクステ・眉毛WAX（メンズ対応）に特化した全席半個室のサロンです。Googleクチコミ4.82の高評価。TEL: 090-7120-5566。",
      },
    },
    {
      "@type": "Question",
      name: "香南市・野市で美容室に行くなら駐車場はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "香南市野市町の「fleurami（フルールアミー）」は無料駐車場を7台完備しています。のいち駅から車で約4分。縮毛矯正・髪質改善・艶カラーが得意で、大人女性を中心にご来店いただいています。TEL: 0887-56-5566。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマはどのくらい持ちますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に4〜6週間程度が目安です。まつげの生え変わりサイクルや日常のケア方法によって個人差があります。「Raffine（高知市はりまや橋）」ではまつげパーマ・ラッシュリフト・パリジャンリフトに対応しており、アフターケアのアドバイスも丁寧に行っています。",
      },
    },
  ],
};

const hairServices = [
  { href: "/service/kamishitsu-kaizen", name: "髪質改善", desc: "うねり・ダメージ・広がりを補修", blog: "/blog/hair/kamiushitsu-kaizen" },
  { href: "/service/shukumou-kyousei", name: "縮毛矯正", desc: "強いくせ毛をサラサラに", blog: "/blog/hair/shukumou-kyousei" },
  { href: "/service/shiraga-bokashi", name: "白髪ぼかし", desc: "伸びても目立ちにくいグレイブレンド", blog: "/blog/hair/shiraga-bokashi" },
  { href: "/service/cut", name: "カット・似合わせカット", desc: "骨格に合わせて再現性重視" },
  { href: "/service/tsuya-color", name: "艶カラー・透明感カラー", desc: "肌色に合わせた似合わせカラー" },
  { href: "/service/inner-color", name: "インナーカラー", desc: "耳まわりに差し色を仕込むデザインカラー" },
  { href: "/service/bob", name: "ボブ・ショートスタイル", desc: "骨格に合わせた扱いやすいボブ設計" },
  { href: "/service/head-spa", name: "ヘッドスパ", desc: "頭皮ケアで健やかな髪へ" },
];

const eyelashServices = [
  { href: "/service/matsuge-perm", name: "まつげパーマ", desc: "自まつげを根元から立ち上げる", blog: "/blog/eyelash/matsuge-perm" },
  { href: "/service/korean-eyelash", name: "韓国束感まつげ", desc: "うるっとした抜け感のある束感デザイン" },
  { href: "/service/ek-perm", name: "エクパーマ", desc: "まつパ×エクステで下向きまつげも解決" },
  { href: "/service/matsuek", name: "まつげエクステ（マツエク）", desc: "韓国束感・フラットラッシュ対応" },
  { href: "/service/led-extension", name: "LEDまつげエクステ", desc: "短時間装着・当日入浴OK" },
  { href: "/service/mayuge-wax", name: "眉毛WAX・アイブロウ", desc: "黄金比デザイン、メンズ対応" },
];

const areas = [
  { href: "/area/kochi", name: "高知市", desc: "Riv. by fleurami（南川添）、Raffine（はりまや橋）の2店舗" },
  { href: "/area/konan", name: "香南市", desc: "fleurami（野市町西野）。無料駐車場7台完備" },
  { href: "/area/noichi", name: "野市", desc: "fleurami（野市町西野）。のいち駅から車で約4分" },
  { href: "/area/harimayabashi", name: "はりまや橋", desc: "Raffine（はりまや町）。まつげ・眉毛の専門サロン" },
];

export default function GuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guidePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4" aria-label="パンくず">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2" aria-hidden>/</span>
            <span>美容ガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Beauty Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">
            高知の美容・ヘアケア情報
          </h1>
          <p className="text-sm text-site-text leading-loose mt-4 max-w-2xl">
            高知県（高知市・香南市）で美容室・アイラッシュサロンを探している方のための情報ガイドです。
            髪質改善・縮毛矯正・白髪ぼかし・まつげパーマなど、施術の選び方や各サービスの詳細を、
            fleur GROUPのスタイリスト・アイリストの知見をもとにまとめています。
          </p>
        </div>
      </div>

      {/* ヘアメニューガイド */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            ヘアメニューから探す
          </h2>
          <p className="text-sm text-site-muted mb-8">
            高知市・香南市の美容室（Riv. by fleurami・fleurami）で受けられる施術の解説と事例。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hairServices.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="border border-site-greige bg-white p-5 hover:border-site-accent transition-colors group"
              >
                <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">
                  高知の{svc.name}
                </span>
                <span className="block text-xs text-site-muted leading-relaxed">{svc.desc}</span>
                {svc.blog && (
                  <span className="block text-[10px] text-site-accent mt-2">施術事例を見る →</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* アイラッシュメニューガイド */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            アイラッシュ・眉毛メニューから探す
          </h2>
          <p className="text-sm text-site-muted mb-8">
            高知市はりまや橋のアイラッシュサロン（Raffine）で受けられる目元・眉毛の施術。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eyelashServices.map((svc) => (
              <Link
                key={svc.href}
                href={svc.href}
                className="border border-site-greige bg-white p-5 hover:border-site-accent transition-colors group"
              >
                <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">
                  高知の{svc.name}
                </span>
                <span className="block text-xs text-site-muted leading-relaxed">{svc.desc}</span>
                {svc.blog && (
                  <span className="block text-[10px] text-site-accent mt-2">施術事例を見る →</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* エリアから探す */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            エリアから探す
          </h2>
          <p className="text-sm text-site-muted mb-8">
            お近くの店舗を地域別にご案内します。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {areas.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="border border-site-greige bg-white p-5 hover:border-site-accent transition-colors group"
              >
                <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">
                  {a.name}の美容室・サロン
                </span>
                <span className="block text-xs text-site-muted leading-relaxed">{a.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="py-12 sm:py-16 bg-site-light" id="faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            よくある質問
          </h2>
          <dl className="space-y-4">
            {faqSchema.mainEntity.map((item, i) => (
              <div key={i} className="border border-site-greige bg-white p-5">
                <dt className="text-sm font-medium text-site-text mb-2">Q. {item.name}</dt>
                <dd className="text-sm text-site-muted leading-relaxed">A. {item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ブログへのリンク */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            施術事例・ブログ
          </h2>
          <p className="text-sm text-site-muted mb-8">
            スタイリスト・アイリストが担当した実際の施術写真と解説。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/blog/hair" className="border border-site-greige p-6 hover:border-site-accent transition-colors group block text-center">
              <span className="block font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors mb-1">ヘアブログ</span>
              <span className="block text-xs text-site-muted">カット・カラー・パーマの施術事例</span>
            </Link>
            <Link href="/blog/eyelash" className="border border-site-greige p-6 hover:border-site-accent transition-colors group block text-center">
              <span className="block font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors mb-1">アイラッシュブログ</span>
              <span className="block text-xs text-site-muted">まつげ・眉毛の施術事例</span>
            </Link>
            <Link href="/blog/faq" className="border border-site-greige p-6 hover:border-site-accent transition-colors group block text-center">
              <span className="block font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors mb-1">Q&A</span>
              <span className="block text-xs text-site-muted">美容室・アイラッシュのよくある疑問</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 店舗へのリンク */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-site-accent mb-4 uppercase">Our Salons</p>
          <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">fleur GROUP 店舗案内</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { href: "/salon/riv", name: "Riv. by fleurami", area: "高知市南川添", type: "美容室" },
              { href: "/salon/fleurami", name: "fleurami", area: "香南市野市町", type: "美容室" },
              { href: "/salon/raffine", name: "Raffine", area: "高知市はりまや橋", type: "アイラッシュサロン" },
            ].map((s) => (
              <Link key={s.href} href={s.href} className="border border-site-greige bg-white p-5 hover:border-site-accent transition-colors group block">
                <span className="block text-[10px] tracking-[0.25em] text-site-accent mb-1">{s.area} / {s.type}</span>
                <span className="block font-serif text-base font-semibold text-site-text group-hover:text-site-accent transition-colors">{s.name}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/salon"
            className="inline-flex items-center gap-4 text-sm tracking-[0.2em] text-site-text hover:text-site-accent transition-colors group"
          >
            <span>すべての店舗を見る</span>
            <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </section>
    </>
  );
}
