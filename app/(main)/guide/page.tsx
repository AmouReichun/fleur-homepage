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
    {
      "@type": "Question",
      name: "高知の梅雨・夏の湿気で髪が広がる・うねるときはどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知県は梅雨から夏にかけて湿度が高く、くせ毛や広がりが出やすい環境です。縮毛矯正（半永久的に直毛に整える）や髪質改善トリートメント（ダメージ補修＋まとまりUP）が効果的です。「Riv. by fleurami（高知市）」「fleurami（香南市）」では湿気の強い高知の気候を考慮した薬剤・施術を提案しています。",
      },
    },
    {
      "@type": "Question",
      name: "40代・50代の白髪・髪のお悩みを相談できる美容室は高知にありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市南川添）」は40代・50代の大人女性のお客様が多いサロンです。白髪ぼかし（ハイライトで白髪をなじませるグレイカラー）・髪質改善トリートメント・艶カラーなど、年齢とともに変化する髪の悩みに特化したメニューと丁寧なカウンセリングで対応します。「fleurami（香南市）」も同様の悩みに対応可能です。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマとまつげエクステはどちらを選べばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "まつげパーマ（ラッシュリフト・パリジャンリフト）は自まつげを根元から立ち上げる施術で、自然な仕上がりを好む方に向いています。まつげエクステ（マツエク）は人工まつげをつけてボリュームや長さを加える施術で、より華やかな目元を求める方に向いています。「Raffine（高知市はりまや橋）」では両方に対応しており、まつげの状態や希望に合わせてカウンセリングでご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正はどのくらいの頻度でかけるのがいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に半年〜1年に1回が目安です。くせの強さや伸びの速さによりますが、根元の伸びが目立ち始めた頃（3〜6ヶ月後）に前回との境目をなじませる施術を行うサイクルが多いです。「Riv. by fleurami（高知市）」「fleurami（香南市）」ではくせの状態を確認しながら最適なタイミングをアドバイスします。",
      },
    },
    {
      "@type": "Question",
      name: "高知でヘアカラーのダメージを抑えながらカラーを続けるには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ダメージを最小限にしながらカラーを続けるには、①髪質に合った薬剤を選ぶこと、②ハイライトなど全体ブリーチを避けた技法を使うこと、③カラー後にトリートメントやホームケアで補修することが重要です。「Riv. by fleurami（高知市）」「fleurami（香南市）」ではダメージカウンセリングを重視しており、艶カラー・透明感カラーなど傷みにくい施術を提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でヘアカラーと白髪ぼかしを同じ日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、「Riv. by fleurami（高知市）」では白髪ぼかしハイライトとカラーの同日施術に対応しています。ただし施術内容や髪の状態によって所要時間が変わりますので、ご予約時にご相談ください。「fleurami（香南市）」でも組み合わせ施術は可能です。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマ後のケア方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "施術後24時間は水・湯・スチームにさらさないことが大切です。洗顔・シャワー時は目元を擦らずに、まつげが濡れたらそっと押さえて水分を取ります。まつげ美容液の使用でケアすると持ちが改善することもあります。「Raffine（高知市はりまや橋）」では施術後のアフターケア方法を丁寧にお伝えします。",
      },
    },
    {
      "@type": "Question",
      name: "はりまや橋のRaffineにバスで行くにはどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Raffine（ラフィーネ）」はJR高知駅からとさでん交通バスまたは路面電車（土佐電鉄）で「はりまや橋」下車、徒歩3〜5分です。住所：高知市はりまや町1-4-8 TNはりまやビル3F。お車でも近隣の有料駐車場をご利用いただけます。詳細は予約時にお問い合わせください。",
      },
    },
    {
      "@type": "Question",
      name: "高知でグレイヘア（白髪を活かしたスタイル）に移行したい場合は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染めをやめてグレイヘアへ移行する場合、根元と既染部分の段差を目立たなくしながら自然につなぐ「グレイカラー移行」を段階的に行うのが一般的です。「Riv. by fleurami（高知市）」と「fleurami（香南市）」ではグレイカラーへの移行相談に対応しており、お客様のペースに合わせたプランをカウンセリングで提案します。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide`,
  name: "高知の美容・ヘアケア情報ガイド",
  url: `${BASE}/guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#faq-section dt", "#guide-lead"],
  },
  about: {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "fleur GROUP",
  },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />

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
          <p id="guide-lead" className="text-sm text-site-text leading-loose mt-4 max-w-2xl">
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

      {/* 詳細ガイドサブページ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            詳細ガイド
          </h2>
          <p className="text-sm text-site-muted mb-8">
            施術の選び方から高知の気候・地域特性まで詳しく解説しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/guide/kochi-hair-care" className="border border-site-greige bg-site-light p-6 hover:border-site-accent transition-colors group block">
              <span className="block text-xs tracking-[0.2em] text-site-accent mb-2 uppercase">Hair</span>
              <span className="block font-serif text-lg font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">高知のヘアケア完全ガイド</span>
              <span className="block text-xs text-site-muted leading-relaxed">縮毛矯正・髪質改善・白髪ぼかしの違いと選び方、高知の湿気対策、40代・50代向け施術</span>
            </Link>
            <Link href="/guide/kochi-eyelash-care" className="border border-site-greige bg-site-light p-6 hover:border-site-accent transition-colors group block">
              <span className="block text-xs tracking-[0.2em] text-site-accent mb-2 uppercase">Eyelash</span>
              <span className="block font-serif text-lg font-medium text-site-text group-hover:text-site-accent transition-colors mb-1">高知のまつげ・眉毛ケア完全ガイド</span>
              <span className="block text-xs text-site-muted leading-relaxed">まつパvsマツエク・ラッシュリフト・眉毛WAXの選び方と施術後のケア</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ブログへのリンク */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">
            施術事例・ブログ
          </h2>
          <p className="text-sm text-site-muted mb-8">
            スタイリスト・アイリストが担当した実際の施術写真と解説。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/blog/hair" className="border border-site-greige bg-white p-6 hover:border-site-accent transition-colors group block text-center">
              <span className="block font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors mb-1">ヘアブログ</span>
              <span className="block text-xs text-site-muted">カット・カラー・パーマの施術事例</span>
            </Link>
            <Link href="/blog/eyelash" className="border border-site-greige bg-white p-6 hover:border-site-accent transition-colors group block text-center">
              <span className="block font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors mb-1">アイラッシュブログ</span>
              <span className="block text-xs text-site-muted">まつげ・眉毛の施術事例</span>
            </Link>
            <Link href="/blog/faq" className="border border-site-greige bg-white p-6 hover:border-site-accent transition-colors group block text-center">
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
