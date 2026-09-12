import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "高知のまつげ・眉毛ケア完全ガイド｜まつパ・マツエク・眉WAXの選び方",
  description:
    "高知県（高知市はりまや橋）のアイラッシュサロンRaffineのアイリストが解説するまつげ・眉毛のケアガイド。まつげパーマとマツエクの違い、ラッシュリフト・パリジャンリフトの特徴、眉毛WAXの選び方、施術後のケア方法まで詳しく紹介します。",
  alternates: { canonical: `${BASE}/guide/kochi-eyelash-care` },
  openGraph: {
    title: "高知のまつげ・眉毛ケア完全ガイド｜まつパ・マツエク・眉WAXの選び方",
    description:
      "高知市はりまや橋のアイラッシュサロンRaffineが解説する、まつパ・マツエク・ラッシュリフト・眉WAXの選び方と持ちのコツ。",
    url: `${BASE}/guide/kochi-eyelash-care`,
  },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のまつげ・眉毛ケアガイド", url: `${BASE}/guide/kochi-eyelash-care` },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE}/guide/kochi-eyelash-care`,
  headline: "高知のまつげ・眉毛ケア完全ガイド｜まつパ・マツエク・眉WAXの選び方",
  description:
    "高知市はりまや橋のアイラッシュサロンRaffineのアイリストが解説するまつげパーマ・マツエク・ラッシュリフト・眉毛WAXの選び方ガイド。",
  url: `${BASE}/guide/kochi-eyelash-care`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  inLanguage: "ja",
  author: {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "fleur GROUP",
  },
  publisher: {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "fleur GROUP",
  },
  about: [
    { "@type": "Thing", name: "まつげパーマ" },
    { "@type": "Thing", name: "まつげエクステ" },
    { "@type": "Thing", name: "ラッシュリフト" },
    { "@type": "Thing", name: "眉毛WAX" },
    { "@type": "Place", name: "高知県" },
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#eyelash-guide-intro", "#eyelash-faq dt"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "まつげパーマとまつげエクステはどちらを選べばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "まつげパーマ（ラッシュリフト・パリジャンリフト）は自まつげを根元から立ち上げる施術で、自然な仕上がりを好む方に向いています。毎日のビューラー不要になり、持ちは4〜6週間が目安です。まつげエクステ（マツエク）は人工まつげを装着してボリューム・長さを出す施術で、より華やかな目元を求める方に向いています。まつげの状態・好みのデザイン・ライフスタイルによって最適な施術が異なるため、「Raffine（高知市はりまや橋）」ではカウンセリングで最適なメニューをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマの持ちはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に4〜6週間程度が目安です。まつげの生え変わりサイクルや日常のケア方法によって個人差があります。施術後24時間は水・湯・スチームを避け、洗顔時はまつげを擦らないようにすると持ちが改善します。「Raffine（高知市はりまや橋）」では施術後のアフターケア方法を丁寧にお伝えします。",
      },
    },
    {
      "@type": "Question",
      name: "ラッシュリフトとパリジャンリフトの違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ラッシュリフトはシリコンパッドで根元から自然に立ち上げるまつげパーマで、シャープで均一なカールが特長です。パリジャンリフト（パリジェンヌラッシュリフト）は下まつげも上に向ける特殊な技術で、目がより大きく・まつげが長く見える効果があります。「Raffine（高知市はりまや橋）」ではまつげの状態や目の形に合わせてご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知市ではりまや橋のアイラッシュサロンはどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Raffine（ラフィーネ）」が高知市はりまや橋周辺のアイラッシュ専門サロンです。住所：高知市はりまや町1-4-8 TNはりまやビル3F。電話：090-7120-5566。まつげパーマ（パリジャンリフト・ラッシュリフト）・まつげエクステ・眉毛WAXに特化した全席半個室の専門サロンで、Googleクチコミ5.0（46件）・ホットペッパービューティー4.84（222件）の高評価。",
      },
    },
    {
      "@type": "Question",
      name: "まつげエクステ（マツエク）はどのくらい持ちますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "まつげエクステは自まつげと一緒に生え変わるため、3〜4週間程度でリペア（付け足し）が目安になります。LEDエクステは通常グルーより持ちに優れており、比較的長持ちします。「Raffine（高知市はりまや橋）」では韓国束感・フラットラッシュ・LEDエクステに対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "下向きまつげや短いまつげでも施術できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、対応可能です。下向きまつげにはパリジャンリフトやラッシュリフトで根元から立ち上げることができます。短いまつげにはまつエクを組み合わせて長さを出す「エクパーマ」という方法もあります。「Raffine（高知市はりまや橋）」でまつげの状態を確認してから最適な施術をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXとは何ですか？どんな効果がありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "眉毛WAX（ワックス脱毛）は温めたワックスを眉毛周りに塗り、余分な産毛・毛を一気に除毛する技術です。ピンセット脱毛より短時間で仕上がり、産毛まできれいに処理できるため眉の輪郭がすっきりします。黄金比に基づいたデザインで顔全体の印象を整えます。「Raffine（高知市はりまや橋）」ではメンズ眉WAXにも対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマ後のケア方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "施術後24時間は水・湯・スチームにさらさないことが重要です。洗顔・シャワー時は目元を擦らず、まつげが濡れたらそっと押さえて水分を取ります。まつげ美容液を使うと持ちが改善することもあります。「Raffine（高知市はりまや橋）」では施術後のアフターケア方法を丁寧にお伝えします。",
      },
    },
    {
      "@type": "Question",
      name: "まつげ・眉毛の施術を初めて受けるのですが大丈夫ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Raffine（高知市はりまや橋）」は全席半個室で完全予約制のプライベートなサロンです。初めての方も担当アイリストが丁寧にカウンセリングを行い、まつげの状態・目の形・ライフスタイルに合わせたデザインをご提案します。不安な点はカウンセリングでご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "まつげパーマと眉毛WAXを同じ日に受けられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、同日施術に対応しています。「Raffine（高知市はりまや橋）」ではまつげパーマ・まつエク・眉毛WAXの組み合わせ施術が可能です。施術時間はご予約時にご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "はりまや橋のRaffineに電車・バスでのアクセス方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JR高知駅からとさでん交通バスまたは路面電車（土佐電鉄）で「はりまや橋」下車、徒歩3〜5分です。住所：高知市はりまや町1-4-8 TNはりまやビル3F（3階）。近隣に有料駐車場あり。電話：090-7120-5566。",
      },
    },
  ],
};

const sections = [
  {
    id: "perm-vs-extension",
    title: "まつげパーマ vs まつエク：どちらを選ぶべきか",
    content: `高知市はりまや橋の「Raffine（ラフィーネ）」でよくご相談いただくのが「まつパとマツエクどちらがいいの？」という質問です。

**まつげパーマ（ラッシュリフト・パリジャンリフト）が向いている方:**
・自然な仕上がりが好き・すっぴんでも崩れにくい目元にしたい
・毎日のビューラーをなくしたい
・まつげを傷めたくない
・水仕事・スポーツをする方

**まつげエクステ（マツエク）が向いている方:**
・しっかりボリューム・長さを出したい
・特別なシーンに向けて華やかにしたい
・まつげが少ない・短い方
・韓国風の束感デザインにしたい

どちらかを選べない場合は、まつパとエクステを組み合わせた「エクパーマ」もあります。Raffineではカウンセリングで最適なメニューをご提案します。`,
  },
  {
    id: "lash-types",
    title: "まつげパーマの種類：ラッシュリフトとパリジャンリフト",
    content: `まつげパーマには複数の種類があります。Raffineが提供する代表的なメニューを解説します。

**ラッシュリフト:**
シリコンパッドで根元から均一にまつげを立ち上げる次世代まつげパーマ。自然な立ち上がりで、まつげが長く・目が大きく見える効果があります。持続4〜6週間が目安。

**パリジャンリフト（パリジェンヌラッシュリフト）:**
まつげの根元を約90度垂直に立ち上げる特殊な技術。下を向いていたまつげも上向きになり、目が縦に大きく見えます。「人生で一番まつげが上がった」と喜ばれる方が多いメニューです。

**エクパーマ（まつパ＋エクステ）:**
まつげパーマの上にエクステを付けることで、立ち上がり＋長さ・ボリュームを同時に叶えるメニューです。下向きまつげや短いまつげの方に特に人気です。`,
  },
  {
    id: "eyebrow-wax",
    title: "眉毛WAX（アイブロウ）でできること",
    content: `眉毛WAX（ワックス脱毛）は眉周りの余分な産毛・毛を一気に除毛する技術です。

**眉毛WAXの特長:**
・短時間（20〜30分程度）でケアが完了
・ピンセット脱毛より産毛まできれいに処理できる
・黄金比デザインで顔の輪郭が整い、印象がすっきりする
・男性にも人気（メンズ眉WAX対応）

**高知市はりまや橋のRaffineの眉毛WAX:**
まつげメニューと同日施術が可能なため、まつパや眉WAXをセットで受ける方が多くいらっしゃいます。顔型・顔のパーツのバランスを見ながら最適なデザインをご提案します。`,
  },
];

export default function KochiEyelashCareGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ヘッダー */}
      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4" aria-label="パンくず">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2" aria-hidden>/</span>
            <Link href="/guide" className="hover:text-site-accent transition-colors">美容ガイド</Link>
            <span className="mx-2" aria-hidden>/</span>
            <span>高知のまつげ・眉毛ケアガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Eyelash & Brow Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知のまつげ・眉毛<br className="sm:hidden" />ケア完全ガイド
          </h1>
          <p id="eyelash-guide-intro" className="text-sm text-site-text leading-loose mt-4 max-w-2xl">
            まつげパーマとマツエクの違い、ラッシュリフト・パリジャンリフトの選び方、眉毛WAXでできること、施術後のケア方法まで。
            高知市はりまや橋の「Raffine（ラフィーネ）」のアイリストが詳しく解説します。
          </p>
        </div>
      </div>

      {/* 目次 */}
      <nav className="bg-white border-b border-site-greige py-6" aria-label="目次">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-xs text-site-muted mb-3 tracking-wider">目次</p>
          <ol className="space-y-1">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-site-accent hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#eyelash-faq" className="text-sm text-site-accent hover:underline">
                {sections.length + 1}. よくある質問（FAQ）
              </a>
            </li>
          </ol>
        </div>
      </nav>

      {/* 本文セクション */}
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="py-12 sm:py-16 bg-white border-b border-site-greige">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-6">{s.title}</h2>
            <div className="text-sm text-site-muted leading-loose space-y-4 whitespace-pre-line">
              {s.content.split("\n\n").map((para, i) => (
                <p key={i}>{para.replace(/\*\*/g, "")}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section id="eyelash-faq" className="py-12 sm:py-16 bg-site-light">
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

      {/* 関連ページリンク */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-xl font-semibold text-site-text mb-6">関連ページ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/service/matsuge-perm" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">まつげパーマ</span>
              <span className="block text-xs text-site-muted">ラッシュリフト・パリジャンリフトの詳細・FAQ</span>
            </Link>
            <Link href="/service/matsuek" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">まつげエクステ（マツエク）</span>
              <span className="block text-xs text-site-muted">韓国束感・フラットラッシュ・LEDエクステの詳細</span>
            </Link>
            <Link href="/service/mayuge-wax" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">眉毛WAX・アイブロウ</span>
              <span className="block text-xs text-site-muted">黄金比デザイン、メンズ対応の眉毛WAX詳細</span>
            </Link>
            <Link href="/area/harimayabashi" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">はりまや橋のアイラッシュメニュー</span>
              <span className="block text-xs text-site-muted">Raffineが提供する全サービス一覧</span>
            </Link>
            <Link href="/salon/raffine" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">Raffine 店舗詳細・予約</span>
              <span className="block text-xs text-site-muted">アクセス・営業時間・ご予約はこちら</span>
            </Link>
            <Link href="/guide" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">美容ガイド トップ</span>
              <span className="block text-xs text-site-muted">ヘアケアガイドもこちらから</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 店舗CTA */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-site-accent mb-4 uppercase">Reservation</p>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-3">
            高知市はりまや橋のアイラッシュ専門サロン
          </h2>
          <p className="text-sm text-site-muted mb-6 leading-loose">
            Raffine（ラフィーネ）｜高知市はりまや町1-4-8 TNはりまやビル3F<br />
            TEL: 090-7120-5566｜営業 9:30〜18:30（不定休）
          </p>
          <Link
            href="/salon/raffine"
            className="inline-flex items-center gap-4 text-xs tracking-[0.2em] text-site-text hover:text-site-accent border border-site-greige px-6 py-3 hover:border-site-accent transition-colors"
          >
            <span>予約・詳細を見る</span>
            <span className="w-6 h-px bg-current" />
          </Link>
        </div>
      </section>
    </>
  );
}
