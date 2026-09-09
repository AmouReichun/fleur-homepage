import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "高知の40代・50代向け美容ガイド｜白髪・くせ毛・エイジングヘアの対策",
  description:
    "高知県（高知市・香南市）の美容室での40代・50代向け美容ガイド。白髪ぼかし・縮毛矯正・髪質改善・グレイヘア移行・産後の髪の変化まで、年齢と共に変化する髪の悩みをfleur GROUPのスタイリストが解説します。",
  alternates: { canonical: `${BASE}/guide/kochi-adult-beauty` },
  openGraph: {
    title: "高知の40代・50代向け美容ガイド｜白髪・くせ毛・エイジングヘアの対策",
    description:
      "高知の40代・50代の髪の悩みを解説。白髪ぼかし・縮毛矯正・髪質改善・グレイヘア移行の選び方をfleur GROUPスタイリストが丁寧に案内。",
    url: `${BASE}/guide/kochi-adult-beauty`,
  },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知の大人向け美容ガイド", url: `${BASE}/guide/kochi-adult-beauty` },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE}/guide/kochi-adult-beauty`,
  headline: "高知の40代・50代向け美容ガイド｜白髪・くせ毛・エイジングヘアの対策",
  description:
    "高知市・香南市の美容室での40代・50代向け美容ガイド。年齢による髪の変化と対策をfleur GROUPスタイリストが解説。",
  url: `${BASE}/guide/kochi-adult-beauty`,
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
    { "@type": "Thing", name: "エイジングヘアケア" },
    { "@type": "Thing", name: "白髪ぼかし" },
    { "@type": "Thing", name: "縮毛矯正" },
    { "@type": "Thing", name: "髪質改善" },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-adult-beauty`,
  name: "高知の40代・50代向け美容ガイド",
  url: `${BASE}/guide/kochi-adult-beauty`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#adult-guide-intro", "#adult-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "40代になってから急に髪の量が減った・細くなったのはなぜですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "40代以降は女性ホルモン（エストロゲン）の分泌が減少し、髪のハリ・コシが落ちやすくなります。また、頭皮の血行不良や栄養不足も影響します。ヘッドスパで頭皮環境を整え、髪質改善トリートメントで毛髪内部を補修することで変化を感じる方も多くいます。高知市のRiv. by fleuramiでご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "50代で縮毛矯正をかけても大丈夫ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "50代でも縮毛矯正は可能ですが、年齢とともに髪が細くなりやすいため、薬剤の選定が重要です。ダメージに配慮しながら自然なストレートを保つ技術が必要です。「Riv. by fleurami（高知市）」と「fleurami（香南市）」ではカウンセリングで髪の状態を確認した上で、最適な薬剤と工程をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で40代・50代の大人女性が多く通う美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」と香南市野市の「fleurami」は、40代・50代の大人女性のお客様が多く、白髪ぼかし・髪質改善・艶カラー・縮毛矯正など年齢とともに変化する髪の悩みに対応したメニューを得意としています。Googleクチコミ（Riv.:4.62/739件、fleurami:4.67/388件）の高評価もいただいています。",
      },
    },
    {
      "@type": "Question",
      name: "産後の抜け毛・髪質の変化はいつ頃に落ち着きますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "産後脱毛は一般的に産後2〜4ヶ月頃から始まり、産後6ヶ月〜1年程度で落ち着くことが多いです。ただし個人差があります。産後は頭皮のホルモンバランスが変化し、髪の質感・くせが変わる方もいます。fleur GROUPでは産後のデリケートな頭皮・髪の状態に配慮した施術とホームケアのアドバイスを提供しています。",
      },
    },
    {
      "@type": "Question",
      name: "白髪が増えてきたが、暗くなりたくない場合はどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪ぼかし（グレイカラー）がおすすめです。ハイライトを使って白髪を全体になじませることで、暗くせず明るさを保ちながら白髪を目立たなくできます。根元が伸びても境目が目立ちにくいため、来店頻度を抑えられる点も大きなメリットです。高知市の「Riv. by fleurami」と香南市の「fleurami」でご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "グレイヘア（白髪を活かしたシルバーグレースタイル）に移行したいのですが？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "グレイヘアへの移行は、白髪染めをやめる段階で根元と既染部分の段差が目立つ点が課題です。白髪ぼかしを段階的に活用することで自然なグラデーションをつくり、無理なく移行できます。ショートボブなら3〜6ヶ月程度、ミディアム〜ロングなら1〜2年程度かかるのが目安です。高知市のRiv. by fleuramiでご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知の梅雨・夏の湿気で40代の髪がまとまらない場合の対策は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "40代以降は髪のキューティクルが傷みやすく、湿気の影響でよりうねりや広がりが出やすくなります。対策として①縮毛矯正でくせを半永久的に伸ばす、②髪質改善トリートメントで内部からダメージを補修してまとまりを改善する、③洗い流さないトリートメントで日常的に保護する、の3つが効果的です。高知の気候に合わせた提案が「Riv. by fleurami」「fleurami」で受けられます。",
      },
    },
    {
      "@type": "Question",
      name: "40代・50代向けのボブスタイルで似合いやすいのはどんな形ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "40〜50代の方に人気なのは、①丸みを出した大人ボブ（フェイスラインをやわらかく見せる）、②前下がりのくびれボブ（首まわりをすっきり見せる）、③毛量を調整したスッキリショートボブ（頭のシルエットを整える）などです。骨格・白髪の量・ライフスタイルに合わせてカウンセリングで最適な形をご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "美容室での施術はどのくらいの頻度で通うのが理想ですか？（40代・50代向け）",
      acceptedAnswer: {
        "@type": "Answer",
        text: "白髪染め：1〜1.5ヶ月ごと。白髪ぼかし：1.5〜2ヶ月ごと。縮毛矯正：3〜6ヶ月ごと（根元の伸びに合わせて）。髪質改善：2〜3ヶ月ごと（継続することで効果が出やすい）。カット：1〜2ヶ月ごと。複数メニューを組み合わせて来店スケジュールを立てると効率よくケアできます。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でヘッドスパ・頭皮ケアができる美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」と香南市野市の「fleurami」でヘッドスパを提供しています。頭皮クレンジング・マッサージで血行促進・毛穴のケアを行い、健やかな髪が育つ環境を整えます。月1回程度のペースで定期ケアをおすすめしています。カラーやカットとの同日施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で初めての白髪ぼかしを相談できる美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleur GROUPの「Riv. by fleurami（高知市南川添9-21、TEL:088-884-5566）」と「fleurami（香南市野市町西野230、TEL:0887-56-5566）」でご相談を承っています。「白髪ぼかしと白髪染めどちらが合っているか」からカウンセリングします。ホットペッパービューティーまたはLINEからご予約ください。",
      },
    },
  ],
};

export default function KochiAdultBeautyPage() {
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
          <span className="text-stone-600">高知の大人向け美容ガイド</span>
        </nav>

        <h1 className="text-2xl font-light tracking-[0.1em] mb-3 text-stone-900">
          高知の40代・50代向け美容ガイド
        </h1>
        <p className="text-xs text-stone-400 tracking-widest mb-8">
          白髪・くせ毛・エイジングヘアの悩みと対策
        </p>

        <p id="adult-guide-intro" className="mb-10 text-stone-600 leading-loose">
          40代・50代になると、髪のハリ・コシが落ちる、白髪が増える、くせが強くなるなど
          様々な変化が起こります。このページでは高知市・香南市のfleur GROUPスタイリストが、
          年齢とともに変化する髪の悩みと、それぞれの施術の選び方を解説します。
        </p>

        <section className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-5 border-b border-stone-200 pb-2">
            40代・50代の髪の変化と主な悩み
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              40代以降の髪の変化は、大きく3つに分類されます。
            </p>
            <div className="space-y-3">
              <div className="border-l-2 border-stone-300 pl-4">
                <h3 className="text-sm font-medium text-stone-800 mb-1">① 白髪の増加</h3>
                <p className="text-xs leading-loose">
                  メラニン色素の生成が減り、白髪が目立ち始めます。白髪染めで頻繁にリタッチするより、
                  白髪ぼかし（グレイカラー）を活用して来店頻度を減らすアプローチが人気です。
                </p>
              </div>
              <div className="border-l-2 border-stone-300 pl-4">
                <h3 className="text-sm font-medium text-stone-800 mb-1">② くせ・うねりの変化</h3>
                <p className="text-xs leading-loose">
                  ホルモンバランスの変化や髪の細化により、若い頃と異なるくせ・うねりが出ることがあります。
                  縮毛矯正や髪質改善を活用することで扱いやすい髪に整えられます。
                </p>
              </div>
              <div className="border-l-2 border-stone-300 pl-4">
                <h3 className="text-sm font-medium text-stone-800 mb-1">③ ハリ・コシ・ボリュームの低下</h3>
                <p className="text-xs leading-loose">
                  髪の1本1本が細くなり、ボリュームが出にくくなります。ヘッドスパで頭皮ケアをしながら、
                  髪質改善トリートメントで内部から補修するアプローチが効果的です。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-5 border-b border-stone-200 pb-2">
            白髪ぼかし・グレイヘア移行の流れ
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              白髪ぼかしは「暗く塗りつぶさない」新しいアプローチです。ハイライトを使って
              白髪を全体になじませることで、根元が伸びても境目がぼやけ、来店頻度を抑えられます。
            </p>
            <p>
              グレイヘア（白髪を活かしたシルバーグレースタイル）への移行を検討する方は、
              白髪染めを急にやめると根元と既染部分の段差が目立つため、白髪ぼかしで段階的に
              移行するのが一般的です。美容師との相談で移行ステップを計画しましょう。
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
            縮毛矯正・髪質改善で扱いやすい髪へ
          </h2>
          <div className="space-y-5 text-stone-600 leading-loose">
            <p>
              40〜50代の方に縮毛矯正をおすすめする場合は、年齢による髪の細化を考慮した
              薬剤選定が重要です。過度なダメージを避けながら、自然なストレートを実現できます。
            </p>
            <p>
              髪質改善はくせを伸ばすのではなく、内部のダメージを補修してまとまりとツヤを
              引き出す施術です。「縮毛ほどはっきり伸ばしたくないが、うねりを和らげたい」という方に
              向いています。継続することで効果が蓄積されやすくなります。
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/service/shukumou-kyousei" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → 縮毛矯正サービスページ
            </Link>
            <Link href="/service/kamishitsu-kaizen" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → 髪質改善サービスページ
            </Link>
            <Link href="/guide/kochi-hair-care" className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800">
              → ヘアケア完全ガイド
            </Link>
          </div>
        </section>

        <section id="adult-faq" className="mb-14">
          <h2 className="text-base font-light tracking-[0.1em] mb-6 border-b border-stone-200 pb-2">
            40代・50代の美容に関するよくある質問
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
          <p className="text-sm font-light text-stone-800 mb-3">大人世代の美容のご相談はfleur GROUPへ</p>
          <p className="text-xs text-stone-500 leading-loose mb-4">
            高知市のRiv. by fleurami・香南市のfleuramiで、白髪・くせ毛・エイジングヘアのカウンセリングを承っています。
            「今の状態を見てほしい」というご来店も歓迎しています。
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
