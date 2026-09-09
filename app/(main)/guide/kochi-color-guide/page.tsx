import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "高知の美容室カラーガイド｜白髪ぼかし・ブリーチ・インナーカラーの選び方",
  description:
    "高知県（高知市・香南市）の美容室でのヘアカラー完全ガイド。白髪ぼかしとグレイカラーの違い、ブリーチ・ハイトーンのダメージ管理、インナーカラーの配置の選び方、艶カラーで似合わせる方法まで、fleur GROUPスタイリストが解説します。",
  alternates: { canonical: `${BASE}/guide/kochi-color-guide` },
  openGraph: {
    title: "高知の美容室カラーガイド｜白髪ぼかし・ブリーチ・インナーカラーの選び方",
    description:
      "白髪ぼかし・ブリーチ・インナーカラーの選び方を高知の美容師が解説。高知市・香南市のfleur GROUPがカラーの悩みに答えます。",
    url: `${BASE}/guide/kochi-color-guide`,
  },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のカラーガイド", url: `${BASE}/guide/kochi-color-guide` },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE}/guide/kochi-color-guide`,
  headline: "高知の美容室カラーガイド｜白髪ぼかし・ブリーチ・インナーカラーの選び方",
  description:
    "高知市・香南市の美容室でのヘアカラー選び方ガイド。白髪ぼかし・グレイカラー・ブリーチ・インナーカラーをfleur GROUPスタイリストが徹底解説。",
  url: `${BASE}/guide/kochi-color-guide`,
  inLanguage: "ja",
  author: {
    "@type": "Organization",
    name: "fleur GROUP",
    url: BASE,
  },
  publisher: {
    "@type": "Organization",
    name: "fleur GROUP",
    url: BASE,
    logo: { "@type": "ImageObject", url: `${BASE}/images/logo.png` },
  },
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  about: [
    { "@type": "Thing", name: "白髪ぼかしカラー" },
    { "@type": "Thing", name: "ブリーチカラー" },
    { "@type": "Thing", name: "インナーカラー" },
    { "@type": "Thing", name: "艶カラー" },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-color-guide`,
  name: "高知の美容室カラーガイド",
  url: `${BASE}/guide/kochi-color-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#color-guide-intro", "#color-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "白髪ぼかしと白髪染めはどちらを選べばいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪を完全に隠したい・白髪量が多い方は白髪染めが向く場合が多いです。明るさを保ちながらリタッチ頻度を減らしたい方、暗く染めることに抵抗がある方には白髪ぼかし（グレイカラー）が合いやすいです。白髪ぼかしはハイライトで白髪をなじませるため、伸びても境目が目立ちにくいのが最大のメリットです。高知市・香南市のfleur GROUPでカウンセリングして最適な方法をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "グレイヘア（白髪を活かした銀髪スタイル）への移行はどのくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染めをやめてグレイヘアに移行する期間は、髪の長さと既染部分の長さによって異なります。ショート〜ボブなら3〜6ヶ月、ミディアム以上では1〜2年かかるケースもあります。白髪ぼかし（ハイライトカラー）を段階的に使うことで、境目を目立たせずに自然なグラデーションで移行できます。高知市のRiv. by fleuramiでご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "ブリーチは何回まで髪が耐えられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ブリーチは髪へのダメージが大きく、1回ごとに髪の体力が消耗します。一般的に2〜3回程度が安全な目安とされますが、髪のコンディション・過去の施術履歴によって大きく異なります。カウンセリングで必ず髪の状態を確認し、段階的に明るくすることをおすすめします。fleur GROUPでは髪質改善トリートメントをあわせてダメージを補修しながらカラーを楽しめます。",
      },
    },
    {
      "@type": "Question",
      name: "インナーカラーは職場の規定がある場合でも楽しめますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。インナーカラーは髪の内側・耳後ろ・うなじ付近に色を仕込むため、結んでいるか垂らしている状態では見えにくいデザインが多いです。職場の規定に合わせて「普段は見えないが、ほどいたとき・耳にかけたときだけ見える」設計が可能です。黒〜ダークブラウン系のインナーカラーや配置の工夫でさらに目立ちにくくできます。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で透明感カラー・外国人風カラーができる美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」と香南市野市の「fleurami」で透明感カラー・アッシュ・グレージュ・ベージュなど外国人風カラーに対応しています。髪の状態に合わせたブリーチ工程と艶カラーで、発色・色落ち後まで設計した提案が好評です。",
      },
    },
    {
      "@type": "Question",
      name: "カラーの色持ちを良くするホームケアの方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "①カラーシャンプー・カラートリートメントの使用（色素の補給と色落ち防止）、②シャワーは高温を避け38〜40℃程度に、③洗い流さないトリートメントやヘアオイルで毎日保湿、④紫外線の当たる日は帽子やUVスプレーで保護、の4つが効果的です。サロンでもお客様の髪色に合ったカラーシャンプーをご案内しています。",
      },
    },
    {
      "@type": "Question",
      name: "艶カラーとはどんな施術ですか？どんな人に向いていますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "艶カラーは、発色と透明感・ツヤ感を重視した施術です。ダメージを抑えながら上品な光沢のある仕上がりを目指します。大人っぽく洗練された印象にしたい方、明るくなりすぎずツヤのある色味を楽しみたい40〜50代の方に特に人気です。高知市のRiv. by fleuramiでは肌色・骨格に合わせた艶カラーを得意としています。",
      },
    },
    {
      "@type": "Question",
      name: "高知でカラーとパーマを同じ日に施術できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に、パーマ後のカラーは1〜2週間後が推奨されます。同日施術は髪への負担が非常に大きいため、「カラー（脱色系以外）のみ先日→パーマ数日後」や「縮毛矯正→数週間後にカラー」など段階的に施術することをおすすめします。髪の状態により同日可能なケースも稀にありますので、カウンセリングでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "50代以上でも明るいカラーにできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。明るいカラーは年齢に関係なく楽しめます。ただし白髪が多い場合は色の入り方が変わるため、白髪の量・位置・希望の明るさを考慮した配合が必要です。ハイライトを使った白髪ぼかしや、明るめのグレイカラーなど、白髪を活かしながら明るく仕上げる技法が大人世代に人気です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市・香南市でカラー・白髪ぼかしを相談できる美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleur GROUPの「Riv. by fleurami（高知市南川添9-21、TEL:088-884-5566）」と「fleurami（香南市野市町西野230、TEL:0887-56-5566）」で白髪ぼかし・グレイカラー・インナーカラー・ブリーチ・艶カラーに対応しています。どちらもホットペッパービューティーまたはLINEでご予約いただけます。",
      },
    },
    {
      "@type": "Question",
      name: "黒染めをした髪をカラーで明るくできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "黒染め（市販・サロン問わず）をした髪は非常に脱色しにくく、ムラになりやすいのが特徴です。一般的なカラーでは明るくなりにくいため、ブリーチが必要になることが多く、さらに色が思うように入らないケースもあります。黒染めの経過期間・回数・目指す明るさによって対応が異なるため、カウンセリングで履歴をお聞きしたうえで最適なプランをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知でグレージュやアッシュカラーができる美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市）」と「fleurami（香南市）」でグレージュ・アッシュ・ベージュ・ラベンダーなど透明感系カラーに対応しています。日本人の髪に多い赤みを抑えてくすみのある外国人風カラーを仕上げる技術が得意です。",
      },
    },
  ],
};

export default function KochiColorGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="max-w-3xl mx-auto px-5 py-16 text-sm leading-relaxed text-stone-800">
        <nav className="text-xs text-stone-400 mb-8 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-stone-600">ホーム</Link>
          <span>›</span>
          <Link href="/guide" className="hover:text-stone-600">美容ガイド</Link>
          <span>›</span>
          <span className="text-stone-600">高知のカラーガイド</span>
        </nav>

        <h1 className="text-2xl font-light tracking-[0.1em] mb-3 text-stone-900">
          高知の美容室カラーガイド
        </h1>
        <p className="text-xs text-stone-400 tracking-widest mb-8">
          白髪ぼかし・ブリーチ・インナーカラーの選び方
        </p>

        <p id="color-guide-intro" className="mb-10 text-stone-600 leading-loose">
          ヘアカラーは種類が多く「どれを選べばいいかわからない」というお声をよくいただきます。
          このページでは高知市・香南市のfleur GROUPスタイリストが、
          白髪ぼかし・ブリーチ・インナーカラー・艶カラーそれぞれの特徴と選び方を解説します。
        </p>

        <section className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-5 border-b border-stone-200 pb-2">
            白髪ぼかし・グレイカラーの選び方
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              白髪ぼかし（グレイカラー）は、白髪を全体になじませてリタッチ頻度を減らせるカラー技法です。
              ハイライトを使って根元が伸びても境目が目立ちにくくする設計が最大の特長で、
              白髪染めのように2〜3週間でリタッチが必要になる煩わしさから解放されます。
            </p>
            <div className="bg-stone-50 border border-stone-100 rounded-sm p-4">
              <h3 className="text-sm font-medium mb-2 text-stone-800">白髪ぼかし vs 白髪染め 比較</h3>
              <table className="w-full text-xs text-stone-600">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-1 font-medium"></th>
                    <th className="text-left py-1 font-medium">白髪ぼかし</th>
                    <th className="text-left py-1 font-medium">白髪染め</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-stone-100">
                    <td className="py-1 pr-2">リタッチ頻度</td>
                    <td className="py-1 pr-2">1.5〜2ヶ月</td>
                    <td className="py-1">1〜1.5ヶ月</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-1 pr-2">明るさ</td>
                    <td className="py-1 pr-2">明るくなりやすい</td>
                    <td className="py-1">暗くなりがち</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-1 pr-2">白髪の隠れ方</td>
                    <td className="py-1 pr-2">なじませる（目立ちにくい）</td>
                    <td className="py-1">隠す（しっかり染まる）</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-2">グレイヘア移行</td>
                    <td className="py-1 pr-2">向いている</td>
                    <td className="py-1">向かない場合が多い</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              白髪の量・髪の明るさ・ライフスタイルによって最適な選択は変わります。
              「まず現状を見てほしい」という方も、カウンセリングだけのご来店も歓迎しています。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/service/shiraga-bokashi" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → 白髪ぼかしサービスページ
            </Link>
            <Link href="/area/kochi" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → 高知市エリアページ
            </Link>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-5 border-b border-stone-200 pb-2">
            ブリーチ・ハイトーンカラーを楽しむためのポイント
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              透明感のあるグレージュ・ミルクティー・アッシュベージュなどのハイトーンカラーを楽しむためには、
              多くの場合ブリーチが必要です。ブリーチは「何回かければいいか」という問いに対して、
              髪の元の明るさ・過去の履歴・目指す色によって答えが変わります。
            </p>
            <p>
              ブリーチ後の最重要ホームケアは「保湿」です。洗い流さないトリートメントやヘアオイルを
              毎日使い、シャワーは高温を避け（38〜40℃推奨）、カラーシャンプーで色落ちを防ぐ、
              の3点が色持ちと手触りを左右します。
            </p>
            <p>
              また、ブリーチ×パーマの同日施術は髪への負担が非常に大きく、
              原則として数週間以上の間隔を開けることを推奨しています。計画的なスケジュールをスタイリストと
              カウンセリングで立てることで、理想の色を安全に楽しめます。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/service/bleach" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → ブリーチ・ハイトーンサービスページ
            </Link>
            <Link href="/service/inner-color" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → インナーカラーサービスページ
            </Link>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-5 border-b border-stone-200 pb-2">
            艶カラー・透明感カラーで大人の似合わせ
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              艶カラーとは、発色の良さとツヤ感を重視したカラー施術の総称で、
              40〜50代の大人女性に特に選ばれています。明るくなりすぎず、
              肌色（イエベ・ブルべ）・骨格に合わせた色設計で上品な印象を演出します。
            </p>
            <p>
              透明感カラー（アッシュ・グレージュ系）は日本人に多い赤みをおさえ、
              外国人のような柔らかい色味を実現します。ブリーチなしでも明るさ感が出やすい配合を
              選ぶことで、ダメージを抑えながら透明感を楽しめる場合があります。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/service/tsuya-color" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → 艶カラーサービスページ
            </Link>
            <Link href="/salon/riv" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → Riv. by fleurami（高知市）
            </Link>
            <Link href="/salon/fleurami" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → fleurami（香南市）
            </Link>
          </div>
        </section>

        <section id="color-faq" className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-6 border-b border-stone-200 pb-2">
            カラーに関するよくある質問
          </h2>
          <dl className="space-y-5">
            {faqSchema.mainEntity.map((item, i) => (
              <div key={i} className="border-b border-stone-100 pb-5">
                <dt className="font-medium text-stone-800 mb-1">Q. {item.name}</dt>
                <dd className="text-stone-500 leading-loose">
                  {item.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="border border-stone-200 rounded-sm p-6 mt-10">
          <p className="text-sm font-light text-stone-800 mb-3">カラーのご相談はfleur GROUPへ</p>
          <p className="text-xs text-stone-500 leading-loose mb-4">
            高知市のRiv. by fleurami・香南市のfleuramiでカラーカウンセリングを承っています。
            なりたいイメージの写真があるとスムーズです。ホットペッパービューティーまたはLINEからご予約ください。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/salon/riv"
              className="text-xs tracking-[0.15em] text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50"
            >
              Riv. by fleurami（高知市）
            </Link>
            <Link
              href="/salon/fleurami"
              className="text-xs tracking-[0.15em] text-stone-600 border border-stone-300 px-4 py-2 hover:bg-stone-50"
            >
              fleurami（香南市）
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 text-xs tracking-[0.15em] text-stone-400 hover:text-stone-700"
          >
            ← 美容ガイド一覧に戻る
          </Link>
        </div>
      </main>
    </>
  );
}
