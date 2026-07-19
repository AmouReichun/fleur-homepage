import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "白髪ぼかし・グレイカラー 高知｜fleurami・Riv.by fleurami",
  description:
    "高知市・香南市で白髪ぼかし（グレイカラー）が受けられる美容室。染めずに活かすグレイヘアへのシフト、白髪を馴染ませるイルミナカラー・ハイライトで自然な仕上がりに。香南市のfleurami・高知市のRiv.by fleuramiが対応。",
  alternates: { canonical: "/blog/hair/shiraga-bokashi" },
  keywords: [
    "白髪ぼかし 高知",
    "白髪ぼかし 高知市",
    "白髪ぼかし 香南市",
    "白髪ぼかし 美容室 高知",
    "グレイカラー 高知",
    "グレイヘア 高知",
    "白髪染め 高知",
    "白髪 ハイライト 高知",
    "白髪カラー 高知県",
  ],
};

const faq = [
  {
    q: "高知市で白髪ぼかしができる美容室は？",
    a: "高知市南川添のRiv.by fleurami（TEL 088-884-5566）が白髪ぼかしに対応しています。白髪を染めず、ハイライトやグレイカラーで自然に馴染ませるメニューをご用意しています。",
  },
  {
    q: "香南市で白髪ぼかしを得意とする美容院は？",
    a: "香南市野市町のfleurami（TEL 0887-56-5566）が白髪ぼかしを得意としています。40〜50代の大人女性のお客様を多く担当し、白髪の自然な活かし方をご提案します。",
  },
  {
    q: "白髪ぼかしと白髪染めの違いは？",
    a: "白髪染め（オールカラー）は白髪を黒や茶色に染める施術です。白髪ぼかしはハイライトやグレイカラーを使って白髪を目立たなくする技術で、全体を暗くせず自然な印象のまま白髪が気にならなくなります。明るさを保ちやすいのが特徴です。",
  },
  {
    q: "白髪ぼかしはどのくらいの頻度で染めますか？",
    a: "白髪ぼかしはリタッチの必要性が低く、通常の白髪染めよりもメンテナンス間隔が長くなる傾向があります。目安は2〜3ヶ月に1回です。根元が伸びても自然にぼけるため、プリン状態になりにくいのが魅力です。",
  },
  {
    q: "白髪が多くても白髪ぼかしはできますか？",
    a: "白髪の量が多い方でも白髪ぼかしはできます。むしろ白髪が多い方は自然なグレイヘアへのシフトも提案しやすくなります。まずはカウンセリングで白髪の状態や希望のスタイルをお聞かせください。",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "白髪ぼかし・グレイカラー 高知｜fleurami・Riv.by fleurami",
  description: "高知市・香南市で白髪ぼかし（グレイカラー）が受けられる美容室。",
  url: "https://fleur-group.jp/blog/hair/shiraga-bokashi",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ヘア症例", item: "https://fleur-group.jp/blog/hair" },
      { "@type": "ListItem", position: 2, name: "白髪ぼかし", item: "https://fleur-group.jp/blog/hair/shiraga-bokashi" },
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

export default function ShiragaBokashiPage() {
  const relatedPosts = getAllPosts("hair")
    .filter((p) => p.tags?.some((t) => ["白髪ぼかし", "白髪", "グレイカラー", "ハイライト", "白髪カラー"].includes(t)))
    .slice(0, 6);

  const accent = "#9C7B4A";
  const bg = "linear-gradient(160deg, #F9F5EE 0%, #F2EAD8 50%, #EADFC6 100%)";

  return (
    <div className="min-h-screen" style={{ background: "#F9F5EE" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 border-b border-hair-border" style={{ background: bg }}>
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[75px] sm:text-[120px] font-cormorant font-semibold leading-none select-none pointer-events-none italic whitespace-nowrap"
          style={{ color: "rgba(156,123,74,0.07)" }}
          aria-hidden="true"
        >
          Gray Color
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
            <span className="text-xs tracking-[0.2em] font-cormorant" style={{ color: accent }}>
              fleurami &amp; Riv.by fleurami — White Hair Solution
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
          </div>

          <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3 leading-snug tracking-wide">
            高知の白髪ぼかし・グレイカラーサロン
          </h1>
          <p className="text-sm text-hair-muted leading-relaxed max-w-lg">
            白髪を「染める」から「活かす」へ。<br className="hidden sm:block" />
            ハイライト・グレイカラー・イルミナカラーで<br className="hidden sm:block" />
            白髪が自然に馴染む大人のヘアスタイルを。
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {["白髪ぼかし", "グレイカラー", "白髪ハイライト", "イルミナカラー", "大人女性"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border bg-white/50 tracking-wide"
                style={{ borderRadius: "2px", borderColor: `${accent}60`, color: accent }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-wide mx-auto px-4 py-12 space-y-16">

        {/* 白髪ぼかしとは */}
        <section>
          <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
            白髪ぼかしとは
          </h2>
          <div className="prose prose-sm max-w-none text-hair-muted leading-relaxed space-y-4">
            <p>
              白髪ぼかしとは、白髪を暗い色で均一に染める「白髪染め」ではなく、
              ハイライトやグレイカラーを使って白髪を自然に馴染ませる技術です。
              白髪を「隠す」のではなく「活かす」アプローチで、明るく柔らかい印象に仕上がります。
            </p>
            <p>
              プリン状態になりにくく、メンテナンス間隔が長くなる傾向があるため、
              忙しい方や白髪染めが負担に感じていた方に特に人気のメニューです。
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "白髪ぼかし（ハイライト）", points: ["白髪をぼかして馴染ませる", "明るさを保てる", "プリンになりにくい", "メンテナンス間隔が長め"] },
              { label: "白髪染め（オールカラー）", points: ["白髪を完全に染める", "統一感のある仕上がり", "頻繁なリタッチが必要", "暗めのトーンに"] },
              { label: "グレイヘア移行", points: ["白髪を活かした銀髪へ", "薬剤ダメージを減らせる", "段階的に移行できる", "個性的なスタイルに"] },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/70 border border-hair-border p-5"
                style={{ borderRadius: "4px" }}
              >
                <p className="text-xs tracking-wider font-cormorant mb-3 uppercase" style={{ color: accent }}>
                  {item.label}
                </p>
                <ul className="space-y-1.5">
                  {item.points.map((pt) => (
                    <li key={pt} className="text-xs text-hair-muted flex items-start gap-2">
                      <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: `${accent}80` }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 店舗案内 */}
        <section>
          <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
            高知で白髪ぼかしができるサロン
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white/70 border border-hair-border p-6" style={{ borderRadius: "4px" }}>
              <p className="text-xs tracking-[0.2em] font-cormorant mb-1 uppercase" style={{ color: accent }}>香南市</p>
              <h3 className="font-mincho text-lg text-hair-text mb-3">fleurami</h3>
              <ul className="space-y-1.5 text-xs text-hair-muted mb-5">
                <li>📍 高知県香南市野市町西野230</li>
                <li>📞 0887-56-5566</li>
                <li>🕐 9:00〜18:00（月・第1/3火 定休）</li>
                <li>🚗 のいち駅から車4分 / 駐車場7台無料</li>
              </ul>
              <div className="flex gap-4">
                <a href="https://beauty.hotpepper.jp/slnH000528388/" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] tracking-wider font-cormorant hover:opacity-70 transition-opacity uppercase" style={{ color: accent }}>
                  予約する →
                </a>
                <Link href="/blog/hair/fleur-ami" className="text-[11px] tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors">
                  症例を見る →
                </Link>
              </div>
            </div>

            <div className="bg-white/70 border border-hair-border p-6" style={{ borderRadius: "4px" }}>
              <p className="text-xs tracking-[0.2em] font-cormorant mb-1 uppercase" style={{ color: accent }}>高知市</p>
              <h3 className="font-mincho text-lg text-hair-text mb-3">Riv.by fleurami</h3>
              <ul className="space-y-1.5 text-xs text-hair-muted mb-5">
                <li>📍 高知県高知市南川添9-21 2F</li>
                <li>📞 088-884-5566</li>
                <li>🕐 9:30〜18:30（月・第1/3火 定休）</li>
                <li>🚗 高知ICから車4分 / 駐車場5台無料</li>
              </ul>
              <div className="flex gap-4">
                <a href="https://beauty.hotpepper.jp/slnH000634137/" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] tracking-wider font-cormorant hover:opacity-70 transition-opacity uppercase" style={{ color: accent }}>
                  予約する →
                </a>
                <Link href="/blog/hair/riv" className="text-[11px] tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors">
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
                <p className="text-sm font-medium text-hair-text mb-2 leading-snug">Q. {item.q}</p>
                <p className="text-sm text-hair-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="font-mincho text-xl text-hair-text mb-6 tracking-wide border-b border-hair-border pb-3">
              白髪ぼかし・関連コラム
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="hair" />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/blog/hair/tag/%E7%99%BD%E9%AB%AA%E3%81%BC%E3%81%8B%E3%81%97"
                className="text-xs tracking-wider font-cormorant hover:opacity-70 transition-opacity uppercase" style={{ color: accent }}>
                白髪ぼかしの記事をすべて見る →
              </Link>
            </div>
          </section>
        )}

        <div className="text-center pb-4">
          <Link href="/blog/hair" className="text-xs tracking-wider font-cormorant text-hair-muted hover:text-hair-accent-warm transition-colors">
            ← ヘア一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
