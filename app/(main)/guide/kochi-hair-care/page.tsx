import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "高知の美容室ヘアケア完全ガイド｜縮毛矯正・髪質改善・白髪ぼかしの選び方",
  description:
    "高知県（高知市・香南市）の美容室でのヘアケア完全ガイド。縮毛矯正と髪質改善の違い、白髪ぼかしと白髪染めの比較、高知の湿気対策、40代・50代の大人女性向けの施術選び方まで、fleur GROUPのスタイリストの知見をもとに解説します。",
  alternates: { canonical: `${BASE}/guide/kochi-hair-care` },
  openGraph: {
    title: "高知の美容室ヘアケア完全ガイド｜縮毛矯正・髪質改善・白髪ぼかしの選び方",
    description:
      "高知の湿気対策・縮毛矯正・髪質改善・白髪ぼかしの選び方。fleur GROUPのスタイリストが高知の気候に合わせた髪のケアと美容室選びを解説。",
    url: `${BASE}/guide/kochi-hair-care`,
  },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のヘアケアガイド", url: `${BASE}/guide/kochi-hair-care` },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE}/guide/kochi-hair-care`,
  headline: "高知の美容室ヘアケア完全ガイド｜縮毛矯正・髪質改善・白髪ぼかしの選び方",
  description:
    "高知県の美容室でのヘアケアについて、縮毛矯正と髪質改善の違い、白髪ぼかし、高知の湿気対策、40代50代向け施術を解説するガイド記事。",
  url: `${BASE}/guide/kochi-hair-care`,
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
    { "@type": "Thing", name: "縮毛矯正" },
    { "@type": "Thing", name: "髪質改善" },
    { "@type": "Thing", name: "白髪ぼかし" },
    { "@type": "Thing", name: "美容室" },
    { "@type": "Place", name: "高知県" },
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#hair-guide-intro", "#hair-faq dt"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "縮毛矯正と髪質改善トリートメントはどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正は薬剤とアイロンでくせ毛を半永久的にまっすぐに整える施術で、くせの強い方に向いています。施術した部分は半永久的にストレートが持続しますが、新しく生えてくる根元のクセには定期的なメンテナンスが必要です。髪質改善トリートメントは髪の内部を補修してツヤ・まとまり・手触りを改善する施術で、くせを伸ばすというよりも扱いやすい質感に整えることが目的です。軽いくせ・ダメージが気になる方に向いています。どちらが向いているかは髪の状態によって異なるため、高知市の「Riv. by fleurami」・香南市の「fleurami」ではカウンセリングで最適な施術をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知の梅雨・夏の湿気で髪が広がる・うねる場合はどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知県は梅雨から夏にかけて湿度が高く、くせ毛や広がりが出やすい環境です。根本的な解決策としては①縮毛矯正（くせを半永久的に整える）や②髪質改善トリートメント（髪の内部を補修してまとまりを改善）が効果的です。ホームケアでは洗い流さないトリートメントやヘアオイルの活用も有効です。高知市の「Riv. by fleurami」・香南市の「fleurami」では高知の気候を考慮した施術をご提案しています。",
      },
    },
    {
      "@type": "Question",
      name: "白髪ぼかし（グレイカラー）と白髪染めの違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染めは白髪を暗い色で覆い隠す技術で、根元が伸びると白髪が目立ちやすくなります。施術頻度が高くなりやすい傾向があります。白髪ぼかし（グレイブレンドカラー）はハイライトや細かい明るめのカラーを使って白髪を髪全体に自然になじませる技術で、伸びても境目が目立ちにくく、長く楽しめるのが特長です。40代・50代の大人女性に人気の技術で、「Riv. by fleurami（高知市）」と「fleurami（香南市）」が得意としています。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正はどのくらいの頻度でかければいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "かけた部分のストレートは半永久的に持続しますが、新しく生えてくる根元のくせが目立ち始める3〜6ヶ月を目安に根元部分を施術するサイクルが一般的です。くせの強さや髪の伸びの速さによって最適なタイミングが変わるため、「Riv. by fleurami（高知市）」「fleurami（香南市）」のカウンセリングでアドバイスします。",
      },
    },
    {
      "@type": "Question",
      name: "40代・50代の白髪・髪のお悩みを相談できる美容室は高知にありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市南川添）」は40代・50代の大人女性のお客様が多いサロンです。白髪ぼかし（ハイライトで白髪をなじませるグレイカラー）・髪質改善トリートメント・艶カラーなど、年齢とともに変化する髪の悩みに特化したメニューと丁寧なカウンセリングで対応します。「fleurami（香南市）」も同様のお悩みに対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "グレイヘア（白髪を活かしたシルバースタイル）に移行したい場合はどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染めをやめてグレイヘアに移行する場合、根元と既染部分の段差をハイライトや段階的なカラーで自然につなぐ方法が一般的です。急に全部やめると境目が目立つため、段階を踏んで移行するプランが好評です。「Riv. by fleurami（高知市）」「fleurami（香南市）」ではグレイカラー移行に対応しており、お客様のペースに合わせたプランをカウンセリングで提案します。",
      },
    },
    {
      "@type": "Question",
      name: "ヘアカラーのダメージを抑えながらカラーを楽しむには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "①全体ブリーチを使わないハイライトやインナーカラーで傷みを分散する、②カラーの度にトリートメントを組み合わせる、③自宅でのホームケア（洗い流さないトリートメント・ヘアオイル）を継続する、の3つが基本です。「Riv. by fleurami（高知市）」「fleurami（香南市）」では艶カラー・透明感カラーなどダメージを抑えたメニューを揃えており、カラーと髪質改善の同日施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市・香南市で縮毛矯正が上手い美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「fleurami（香南市野市）」と「Riv. by fleurami（高知市南川添）」が縮毛矯正を得意とするfleur GROUPの美容室です。くせ毛・うねりの状態に合わせた薬剤選定で、ダメージを抑えた自然なストレートに仕上げます。初めての縮毛矯正の方もカウンセリングで髪の状態を確認してから施術します。",
      },
    },
    {
      "@type": "Question",
      name: "縮毛矯正をかけた後にカラーはできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "縮毛矯正後は薬剤の影響で髪がデリケートな状態になっているため、2週間〜1ヶ月程度空けることをおすすめしています。同日施術ができる場合もありますが、髪のダメージ状態によって判断が異なるため、カウンセリングでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "ボブやショートヘアに向いている施術はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ボブ・ショートヘアには①縮毛矯正（広がりやクセをしっかり抑える）、②髪質改善（まとまりを高め扱いやすくする）、③カット設計（乾かしやすいカットで自宅での再現性を高める）の3つが効果的です。「Riv. by fleurami（高知市）」「fleurami（香南市）」では骨格に合わせた大人ボブ・ショートの設計が人気で、毎日のスタイリングが楽になると好評です。",
      },
    },
    {
      "@type": "Question",
      name: "髪質改善の効果はどのくらい持続しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "髪の状態やホームケアによりますが、目安として数週間〜1〜2ヶ月程度です。継続して施術することで状態を保ちやすくなります。洗い流さないトリートメントやヘアオイルの日常使いと組み合わせると効果が長持ちしやすくなります。高知市・香南市のfleur GROUPサロンでは、ホームケアのアドバイスもお伝えしています。",
      },
    },
    {
      "@type": "Question",
      name: "高知市・香南市の美容室で予約するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市南川添、TEL:088-884-5566）」「fleurami（香南市野市町、TEL:0887-56-5566）」ともにホットペッパービューティーまたはLINEからご予約いただけます。初めての方もお気軽にどうぞ。駐車場：Riv.は無料5台、fleuramiは無料7台完備。",
      },
    },
  ],
};

const sections = [
  {
    id: "humidity",
    title: "高知の気候と髪の悩み",
    content: `高知県は日本有数の多雨・多湿地帯です。特に梅雨（6〜7月）と夏（8〜9月）は湿度が80〜90%を超える日も多く、この湿気がくせ毛・広がり・うねりを引き起こす主な原因になります。

髪は湿気を吸って内部が膨張することで、もともと持っているくせが強調されたり、まとまりが崩れたりします。特に「ダメージがある髪」「くせ毛の方」「細い髪の方」は湿気の影響を受けやすい傾向があります。

高知市・香南市の美容室「fleur GROUP（Riv. by fleurami・fleurami）」では、高知の気候を熟知したうえで薬剤と施術を選定し、梅雨や夏でも扱いやすい髪を実現するプランをご提案しています。`,
  },
  {
    id: "treatment-compare",
    title: "縮毛矯正 vs 髪質改善：どちらを選ぶべきか",
    content: `高知の美容室でよく相談されるのが「縮毛矯正と髪質改善、どちらがいいの？」という質問です。

**縮毛矯正が向いている方:**
くせが強い・うねりがひどい・雨の日に爆発的に広がる・ストレートヘアにしたい方に適しています。薬剤とアイロンでくせを半永久的にまっすぐ整える施術で、持続性が高いのが特長です。

**髪質改善が向いている方:**
くせは軽め・ダメージが気になる・ツヤが欲しい・扱いやすさを改善したい方に適しています。髪の内部を補修してまとまりとツヤを引き出す施術で、カラーとの組み合わせもしやすいのが特長です。

どちらが最適かは髪の状態・くせの強さ・普段のスタイリング・なりたいイメージによって異なります。fleur GROUPでは丁寧なカウンセリングで最適な施術をご提案します。`,
  },
  {
    id: "shiraga",
    title: "白髪ぼかしと白髪染め：大人世代の選び方",
    content: `40代・50代の方から多くいただく相談が「白髪どうすればいい？」という質問です。

**白髪染め（オールカラー）の特徴:**
白髪を暗い色で均一に染め、すぐに白髪を隠せます。ただし根元が伸びると白髪が目立ちやすく、施術頻度が1〜2ヶ月に1回になりがちです。

**白髪ぼかし（グレイブレンドカラー）の特徴:**
ハイライトを使って白髪を髪全体に自然になじませる技術で、伸びても境目が目立ちにくいのが最大の特長です。最初は複数回の施術が必要ですが、長期的には施術間隔を延ばせる場合があります。

「Riv. by fleurami（高知市）」「fleurami（香南市）」では40代・50代の大人女性に白髪ぼかしが特に人気で、「楽になった」「自分らしさが出た」と喜ばれています。`,
  },
];

export default function KochiHairCareGuidePage() {
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
            <span>高知のヘアケアガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Hair Care Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知の美容室<br className="sm:hidden" />ヘアケア完全ガイド
          </h1>
          <p id="hair-guide-intro" className="text-sm text-site-text leading-loose mt-4 max-w-2xl">
            縮毛矯正・髪質改善・白髪ぼかしの選び方から、高知県特有の湿気対策、40代・50代向けの髪のケアまで。
            fleur GROUPのスタイリストが高知の美容室でできるヘアケアを詳しく解説します。
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
              <a href="#hair-faq" className="text-sm text-site-accent hover:underline">
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
      <section id="hair-faq" className="py-12 sm:py-16 bg-site-light">
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
            <Link href="/service/kamishitsu-kaizen" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">髪質改善トリートメント</span>
              <span className="block text-xs text-site-muted">高知市・香南市の美容室で受けられる髪質改善の詳細</span>
            </Link>
            <Link href="/service/shukumou-kyousei" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">縮毛矯正</span>
              <span className="block text-xs text-site-muted">くせ毛・うねりをストレートへ。料金・効果・FAQ</span>
            </Link>
            <Link href="/service/shiraga-bokashi" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">白髪ぼかし・グレイカラー</span>
              <span className="block text-xs text-site-muted">伸びても目立ちにくいグレイブレンドカラー</span>
            </Link>
            <Link href="/area/kochi" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">高知市の美容室メニュー</span>
              <span className="block text-xs text-site-muted">Riv. by fleuramiが提供する全サービス一覧</span>
            </Link>
            <Link href="/area/konan" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">香南市の美容室メニュー</span>
              <span className="block text-xs text-site-muted">fleuramiが提供する全サービス一覧</span>
            </Link>
            <Link href="/guide" className="border border-site-greige p-4 hover:border-site-accent transition-colors group">
              <span className="block text-sm font-medium text-site-text group-hover:text-site-accent mb-1">美容ガイド トップ</span>
              <span className="block text-xs text-site-muted">アイラッシュ・眉毛ガイドもこちらから</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 店舗CTA */}
      <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-site-accent mb-4 uppercase">Consultation</p>
          <h2 className="font-serif text-xl font-semibold text-site-text mb-3">
            髪のお悩みはカウンセリングで解決
          </h2>
          <p className="text-sm text-site-muted mb-8 leading-loose">
            高知市・香南市のfleur GROUPサロンでは、<br />
            初めての方も丁寧なカウンセリングで最適な施術をご提案します。
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/salon/riv" className="text-xs px-6 py-3 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors tracking-wider">
              Riv. by fleurami（高知市）
            </Link>
            <Link href="/salon/fleurami" className="text-xs px-6 py-3 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors tracking-wider">
              fleurami（香南市）
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
