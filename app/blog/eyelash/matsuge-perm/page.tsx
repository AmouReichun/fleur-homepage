import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "まつげパーマ・ラッシュリフト 高知｜Raffine（ラフィーネ）はりまや橋",
  description:
    "高知市はりまや橋のアイラッシュサロン・Raffineのまつげパーマ（ラッシュリフト）。自まつげを活かした自然な仕上がり。韓国束感まつげ・パリジェンヌラッシュリフトにも対応。施術時間・持ち・マツエクとの違いも解説。",
  alternates: { canonical: "/blog/eyelash/matsuge-perm" },
  keywords: [
    "まつげパーマ 高知",
    "ラッシュリフト 高知",
    "まつ毛パーマ 高知市",
    "まつ毛パーマ はりまや橋",
    "まつげパーマ 高知県",
    "パリジェンヌラッシュリフト 高知",
    "Raffine まつげパーマ",
    "アイラッシュサロン 高知市",
  ],
};

const faq = [
  {
    q: "高知市でまつげパーマができるサロンはどこですか？",
    a: "高知市はりまや町1-4-8 TNはりまやビル3FのRaffine（ラフィーネ）がまつげパーマ（ラッシュリフト）に対応しています。電話番号は090-7120-5566。はりまや橋から徒歩圏内で便利なアクセスです。",
  },
  {
    q: "まつげパーマとラッシュリフトの違いは？",
    a: "まつげパーマとラッシュリフトはほぼ同じ施術で、自まつげを根元から立ち上げてカールをつける技術です。パリジェンヌラッシュリフトは特にカール度合いが強く、まつげを真上に立てるようなデザインが特徴です。",
  },
  {
    q: "まつげパーマの施術時間はどのくらいですか？",
    a: "まつげパーマ（ラッシュリフト）の施術時間は60〜90分が目安です。まつげの状態やデザインによって変わります。眉毛WAXと組み合わせた施術も可能です。",
  },
  {
    q: "まつげパーマはどのくらい持ちますか？",
    a: "まつげパーマの持続期間は1〜2ヶ月程度が目安です。まつげの成長周期に合わせてかかりが落ち着いてきます。定期的にかけ直すことでいつもキレイな状態を保てます。",
  },
  {
    q: "まつげパーマとマツエクはどちらがおすすめですか？",
    a: "自まつげを活かしたい方・ナチュラルな仕上がりを求める方にはまつげパーマ（ラッシュリフト）がおすすめ。より長さやボリュームをしっかり出したい方にはマツエク（まつげエクステ）が向いています。Raffineではどちらにも対応しています。",
  },
  {
    q: "メンズのまつげパーマはできますか？",
    a: "はい、Raffineではメンズのまつげパーマにも対応しています。男性でもまつげを立ち上げるだけで目元の印象が変わります。眉毛WAXとのセットも人気です。",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "まつげパーマ・ラッシュリフト 高知｜Raffine",
  description: "高知市はりまや橋のRaffineのまつげパーマ（ラッシュリフト）。",
  url: "https://fleur-group.jp/blog/eyelash/matsuge-perm",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "アイラッシュ", item: "https://fleur-group.jp/blog/eyelash" },
      { "@type": "ListItem", position: 2, name: "まつげパーマ", item: "https://fleur-group.jp/blog/eyelash/matsuge-perm" },
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

export default function MatsugePermPage() {
  const relatedPosts = getAllPosts("eyelash")
    .filter((p) => p.tags?.some((t) =>
      ["まつげパーマ", "まつ毛パーマ", "ラッシュリフト", "パリジェンヌ"].includes(t)
    ))
    .slice(0, 6);

  const accent = "#C8788A";
  const bg = "linear-gradient(160deg, #FBF8F8 0%, #F9F0F3 50%, #F5E6EA 100%)";

  return (
    <div className="min-h-screen" style={{ background: "#FBF8F8" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 border-b border-eye-border" style={{ background: bg }}>
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[75px] sm:text-[120px] font-cormorant font-semibold leading-none select-none pointer-events-none italic whitespace-nowrap"
          style={{ color: "rgba(200,120,138,0.07)" }}
          aria-hidden="true"
        >
          Lash Lift
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
            <span className="text-xs tracking-[0.2em] font-jakarta" style={{ color: accent }}>
              Raffine — Eyelash Perm &amp; Lash Lift
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: accent }} />
          </div>

          <h1 className="font-kaku text-2xl sm:text-3xl font-medium text-eye-text mb-3 leading-snug">
            高知のまつげパーマ・ラッシュリフトサロン
          </h1>
          <p className="text-sm text-eye-muted leading-relaxed max-w-lg">
            自まつげを活かした、ナチュラルで洗練された目元へ。<br className="hidden sm:block" />
            高知市はりまや橋・Raffineがラッシュリフトで<br className="hidden sm:block" />
            毎朝のビューラー不要のまつげを実現します。
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {["まつげパーマ", "ラッシュリフト", "パリジェンヌ", "韓国束感", "自まつげ"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 border bg-white/50 tracking-wide"
                style={{ borderRadius: "20px", borderColor: `${accent}60`, color: accent }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-wide mx-auto px-4 py-12 space-y-16">

        {/* まつげパーマとは */}
        <section>
          <h2 className="font-kaku text-xl text-eye-text mb-6 tracking-wide border-b border-eye-border pb-3">
            まつげパーマ（ラッシュリフト）とは
          </h2>
          <div className="prose prose-sm max-w-none text-eye-muted leading-relaxed space-y-4">
            <p>
              まつげパーマ（ラッシュリフト）とは、自まつげに薬剤を使ってカールをつけ、
              根元から立ち上げる施術です。エクステと違い自まつげを活かすため、
              ナチュラルな仕上がりが特徴です。毎朝のビューラーが不要になり、
              すっぴんでも目元がキレイに見えます。
            </p>
            <p>
              施術時間の目安は<strong className="text-eye-text">60〜90分</strong>。
              効果の持続は<strong className="text-eye-text">1〜2ヶ月</strong>程度です。
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "ラッシュリフト（ナチュラル）", points: ["自然なカールで日常使いに", "自まつげを活かす", "施術時間60〜90分", "持続1〜2ヶ月"] },
              { label: "パリジェンヌラッシュリフト", points: ["まつげを真上に立てるデザイン", "目を大きく見せる効果大", "印象的な目元に", "韓国風の仕上がりも"] },
              { label: "マツエクとの違い", points: ["エクステなし・自まつげのみ", "ケアが楽（コーティング不要）", "マスカラ・クレンジング制限なし", "よりナチュラルな仕上がり"] },
            ].map((item) => (
              <div key={item.label} className="bg-white/70 border border-eye-border p-5" style={{ borderRadius: "12px" }}>
                <p className="text-xs tracking-wider font-jakarta mb-3 uppercase" style={{ color: accent }}>{item.label}</p>
                <ul className="space-y-1.5">
                  {item.points.map((pt) => (
                    <li key={pt} className="text-xs text-eye-muted flex items-start gap-2">
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
          <h2 className="font-kaku text-xl text-eye-text mb-6 tracking-wide border-b border-eye-border pb-3">
            高知でまつげパーマが受けられるサロン
          </h2>
          <div className="bg-white/70 border border-eye-border p-6 max-w-lg" style={{ borderRadius: "16px" }}>
            <p className="text-xs tracking-[0.2em] font-jakarta mb-1 uppercase" style={{ color: accent }}>高知市 / はりまや橋</p>
            <h3 className="font-kaku text-lg text-eye-text mb-3">Raffine（ラフィーネ）</h3>
            <ul className="space-y-1.5 text-xs text-eye-muted mb-5">
              <li>📍 高知市はりまや町1-4-8 TNはりまやビル3F</li>
              <li>📞 090-7120-5566</li>
              <li>🕐 9:30〜18:30（水・第2/4木 定休）</li>
              <li>🚇 はりまや橋から徒歩圏内</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="https://beauty.hotpepper.jp/kr/slnH000767549/" target="_blank" rel="noopener noreferrer"
                className="text-xs px-4 py-2 text-white tracking-wide font-jakarta" style={{ background: accent, borderRadius: "20px" }}>
                ホットペッパーで予約
              </a>
              <Link href="/blog/eyelash/raffine" className="text-xs px-4 py-2 border tracking-wide font-jakarta text-eye-text"
                style={{ borderRadius: "20px", borderColor: `${accent}40` }}>
                症例を見る
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-kaku text-xl text-eye-text mb-6 tracking-wide border-b border-eye-border pb-3">
            よくある質問
          </h2>
          <div className="space-y-5">
            {faq.map((item) => (
              <div key={item.q} className="border-b border-eye-border/50 pb-5">
                <p className="text-sm font-medium text-eye-text mb-2 leading-snug">Q. {item.q}</p>
                <p className="text-sm text-eye-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 関連記事 */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="font-kaku text-xl text-eye-text mb-6 tracking-wide border-b border-eye-border pb-3">
              まつげパーマ・関連コラム
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="eyelash" />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/blog/eyelash/tag/%E3%81%BE%E3%81%A4%E3%81%92%E3%83%91%E3%83%BC%E3%83%9E"
                className="text-xs tracking-wider font-jakarta hover:opacity-70 transition-opacity" style={{ color: accent }}>
                まつげパーマの記事をすべて見る →
              </Link>
            </div>
          </section>
        )}

        <div className="text-center pb-4">
          <Link href="/blog/eyelash" className="text-xs tracking-wider font-jakarta text-eye-muted hover:text-eye-accent transition-colors">
            ← アイラッシュ一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
