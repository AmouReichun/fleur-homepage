import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "高知の髪質改善サロン｜fleur ami（香南市）・Riv.（高知市）",
  description:
    "高知県で髪質改善トリートメントが受けられるヘアサロン。香南市のfleur ami・高知市のRiv. by fleur amiが、うねり・ダメージ・広がりを改善しサラサラのツヤ髪へ導きます。施術時間・効果・縮毛矯正との違いも解説。",
  alternates: { canonical: "/blog/hair/kamiushitsu-kaizen" },
  keywords: [
    "髪質改善 高知",
    "髪質改善 高知市",
    "髪質改善 香南市",
    "髪質改善トリートメント 高知",
    "髪質改善 美容室 高知",
    "うねり 改善 高知",
    "サラサラ ツヤ髪 高知",
  ],
};

const woodBg = {
  background: `
    repeating-linear-gradient(
      88deg,
      transparent 0px,
      transparent 3px,
      rgba(160,120,72,0.025) 3px,
      rgba(160,120,72,0.04)  4px,
      transparent 4px,
      transparent 11px,
      rgba(160,120,72,0.02)  11px,
      rgba(160,120,72,0.035) 12px,
      transparent 12px,
      transparent 22px
    ),
    linear-gradient(160deg, #F8F2EA 0%, #F1E7D8 50%, #EAD9C4 100%)
  `,
};

const faq = [
  {
    q: "高知市で髪質改善トリートメントができる美容室は？",
    a: "高知市南川添のRiv. by fleur ami（高知IC車4分・駐車場5台）で髪質改善トリートメントを受けられます。ホットペッパービューティーから予約が可能です。",
  },
  {
    q: "香南市で髪質改善ができる美容院は？",
    a: "香南市野市町のfleur ami（のいち駅から車4分・駐車場7台）が髪質改善トリートメントを提供しています。大人女性のうねり・ダメージケアを得意とするサロンです。",
  },
  {
    q: "髪質改善と縮毛矯正はどう違うの？",
    a: "縮毛矯正はくせ毛を薬剤とアイロンで半永久的にストレートにする施術（施術時間180〜240分）。髪質改善トリートメントは毛髪の内部を補修してツヤとまとまりを向上させる施術（施術時間90〜120分）です。形を変えるのではなく質感を高める点が大きな違いです。",
  },
  {
    q: "髪質改善トリートメントはどのくらい持つ？",
    a: "効果の目安は1〜2ヶ月程度です。1〜2ヶ月ごとの定期ケアを続けると、回を重ねるごとに髪質が改善されやすくなります。ダメージの程度や髪質によって個人差があります。",
  },
  {
    q: "fleur ami・Riv.の髪質改善はどんな人に向いている？",
    a: "カラーを繰り返してパサつく方、雨の日に髪がふくらむ方、くせほどではないがうねりが気になる方、艶のあるまとまりやすい髪にしたい方に向いています。まずはカウンセリングで髪の状態を確認してからご提案します。",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "高知の髪質改善サロン｜fleur ami・Riv.",
  description:
    "高知県で髪質改善トリートメントが受けられるヘアサロン案内。香南市のfleur ami・高知市のRiv. by fleur ami。",
  url: "https://fleur-group.jp/hair/kamiushitsu-kaizen",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ヘア症例", item: "https://fleur-group.jp/hair" },
      { "@type": "ListItem", position: 2, name: "髪質改善", item: "https://fleur-group.jp/hair/kamiushitsu-kaizen" },
    ],
  },
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
};

export default function KamiushitsuKaizenPage() {
  const relatedPosts = getAllPosts("hair")
    .filter((p) => p.tags?.some((t) => ["髪質改善", "縮毛矯正", "ツヤ髪", "トリートメント"].includes(t)))
    .slice(0, 6);

  return (
    <div className="min-h-screen" style={{ background: "#F8F2EA" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 border-b border-hair-border" style={woodBg}>
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[75px] sm:text-[120px] font-cormorant font-semibold leading-none select-none pointer-events-none italic whitespace-nowrap"
          style={{ color: "rgba(160,120,72,0.08)", lineHeight: 1 }}
          aria-hidden="true"
        >
          Treatment
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
            <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">
              fleur ami &amp; Riv. — Hair Quality Treatment
            </span>
            <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
          </div>

          <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3 leading-snug tracking-wide">
            高知の髪質改善サロン
          </h1>

          <p className="text-sm text-hair-muted leading-relaxed max-w-lg">
            うねり・ダメージ・広がりにお悩みの方へ。<br className="hidden sm:block" />
            fleur ami（香南市）と Riv.（高知市）が、<br className="hidden sm:block" />
            あなたの髪の内側からツヤとまとまりを引き出します。
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {["髪質改善トリートメント", "縮毛矯正", "うねり改善", "ツヤ髪", "大人女性"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border border-hair-accent-warm/40 text-hair-accent-warm bg-white/50 tracking-wide"
                style={{ borderRadius: "2px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-wide mx-auto px-4 py-12 space-y-16">

        {/* 髪質改善とは */}
        <section>
          <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
            髪質改善トリートメントとは
          </h2>
          <div className="prose prose-sm max-w-none text-hair-muted leading-relaxed space-y-4">
            <p>
              髪質改善トリートメントは、ダメージ・うねり・広がりの原因となる毛髪内部のタンパク質を補修し、
              サラサラのツヤ髪に近づける施術です。縮毛矯正のように形を変えるのではなく、
              髪本来の質感そのものを高めるのが特徴です。
            </p>
            <p>
              施術時間の目安は<strong className="text-hair-text">90〜120分程度</strong>。
              効果の持続は<strong className="text-hair-text">1〜2ヶ月</strong>が目安で、
              定期的にケアを重ねることで髪質が改善されやすくなります。
            </p>
          </div>

          {/* 縮毛矯正との比較表 */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "髪質改善トリートメント",
                points: ["施術時間：90〜120分", "効果の目安：1〜2ヶ月", "毛髪内部を補修・ツヤ向上", "カラーと同時施術も可"],
              },
              {
                label: "縮毛矯正",
                points: ["施術時間：180〜240分", "効果の目安：3〜4ヶ月", "くせ毛をストレートに固定", "強いくせ毛・チリチリに◎"],
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/70 border border-hair-border p-5"
                style={{ borderRadius: "4px" }}
              >
                <p className="text-xs tracking-wider text-hair-accent-warm font-cormorant mb-3 uppercase">
                  {item.label}
                </p>
                <ul className="space-y-1.5">
                  {item.points.map((pt) => (
                    <li key={pt} className="text-xs text-hair-muted flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full bg-hair-accent-warm/60 shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 2店舗の案内 */}
        <section>
          <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
            高知で髪質改善ができるサロン
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* fleur ami */}
            <div className="bg-white/70 border border-hair-border p-6" style={{ borderRadius: "4px" }}>
              <p className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant mb-1 uppercase">
                香南市
              </p>
              <h3 className="font-mincho text-lg text-hair-text mb-3">fleur ami</h3>
              <ul className="space-y-1.5 text-xs text-hair-muted mb-5">
                <li>📍 高知県香南市野市町西野230</li>
                <li>🕐 9:00〜18:00（月・第1/3火 定休）</li>
                <li>🚗 のいち駅から車4分 / 駐車場7台無料</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-5">
                {["髪質改善", "縮毛矯正", "白髪ぼかし", "艶カラー"].map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 bg-hair-accent-warm/10 text-hair-accent-warm" style={{ borderRadius: "2px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href="https://beauty.hotpepper.jp/slnH000528388/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-wider font-cormorant text-hair-accent-warm hover:opacity-70 transition-opacity uppercase"
                >
                  予約する →
                </a>
                <Link
                  href="/blog/hair/fleur-ami"
                  className="text-[11px] tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors"
                >
                  症例を見る →
                </Link>
              </div>
            </div>

            {/* Riv. */}
            <div className="bg-white/70 border border-hair-border p-6" style={{ borderRadius: "4px" }}>
              <p className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant mb-1 uppercase">
                高知市
              </p>
              <h3 className="font-mincho text-lg text-hair-text mb-3">Riv. by fleur ami</h3>
              <ul className="space-y-1.5 text-xs text-hair-muted mb-5">
                <li>📍 高知県高知市南川添9-21 2F</li>
                <li>🕐 9:30〜18:30（月・第1/3火 定休）</li>
                <li>🚗 高知ICから車4分 / 駐車場5台無料</li>
              </ul>
              <div className="flex flex-wrap gap-2 mb-5">
                {["髪質改善", "縮毛矯正", "ハイライト", "白髪ぼかし"].map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 bg-hair-accent-warm/10 text-hair-accent-warm" style={{ borderRadius: "2px" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href="https://beauty.hotpepper.jp/slnH000634137/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-wider font-cormorant text-hair-accent-warm hover:opacity-70 transition-opacity uppercase"
                >
                  予約する →
                </a>
                <Link
                  href="/blog/hair/riv"
                  className="text-[11px] tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors"
                >
                  症例を見る →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
            よくある質問
          </h2>
          <div className="space-y-5">
            {faq.map((item) => (
              <div key={item.q} className="border-b border-hair-border/50 pb-5">
                <p className="text-sm font-medium text-hair-text mb-2 leading-snug">
                  Q. {item.q}
                </p>
                <p className="text-sm text-hair-muted leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
              髪質改善・関連コラム
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="hair" />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/blog/hair"
                className="text-xs tracking-wider font-cormorant text-hair-accent-warm hover:opacity-70 transition-opacity uppercase"
              >
                ヘア症例・コラムをすべて見る →
              </Link>
            </div>
          </section>
        )}

        <div className="text-center pb-4">
          <Link
            href="/blog/hair"
            className="text-xs tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors"
          >
            ← ヘア一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
