import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const TITLE = "高知のヘッドスパガイド｜頭皮ケア・抜け毛・産後の髪の悩み";
const DESC =
  "高知市・香南市でヘッドスパを検討中の方へ。ヘッドスパの効果・施術の流れ・産後の髪の悩みへの対応・料金目安をfleur GROUPが解説します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `${BASE}/guide/kochi-head-spa-guide` },
  openGraph: { title: TITLE, description: DESC, url: `${BASE}/guide/kochi-head-spa-guide` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "美容ガイド", url: `${BASE}/guide` },
  { name: "高知のヘッドスパガイド", url: `${BASE}/guide/kochi-head-spa-guide` },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESC,
  url: `${BASE}/guide/kochi-head-spa-guide`,
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  author: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
  about: [
    { "@type": "Thing", name: "ヘッドスパ" },
    { "@type": "Thing", name: "頭皮ケア" },
    { "@type": "Service", name: "ヘッドスパ", areaServed: "高知市" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市・香南市でヘッドスパができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUPの「Riv. by fleurami（高知市南川添）」と「fleurami（香南市野市）」でヘッドスパを受けられます。頭皮の状態に合わせたスカルプトリートメントと頭皮マッサージで、健やかな髪の土台を整えます。",
      },
    },
    {
      "@type": "Question",
      name: "ヘッドスパにはどんな効果がありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ヘッドスパの主な効果は、①頭皮の血行促進（髪の成長サイクルを整える）、②皮脂・汚れの除去（毛穴詰まりの改善）、③リラクゼーション（肩こり・頭痛の緩和）、④髪の毛に栄養を届ける（ハリ・コシのアップ）の4つです。継続して受けることでより効果が実感しやすくなります。",
      },
    },
    {
      "@type": "Question",
      name: "産後の抜け毛・髪の変化に悩んでいます。ヘッドスパは効果がありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "産後は女性ホルモンの変化で抜け毛が増えることが多いですが、ヘッドスパで頭皮の血行を促進し、毛根に栄養が届きやすい状態を作ることが重要です。fleur GROUPのヘッドスパでは産後の頭皮環境を整えるケアにも対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "ヘッドスパはどれくらいの頻度で受けるのがよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "月1回を目安にすると継続的な効果を実感しやすいです。抜け毛・頭皮のかゆみ・べたつきなどが気になる場合は2〜3週間に1回のペースで受けることもおすすめです。",
      },
    },
    {
      "@type": "Question",
      name: "ヘッドスパの施術時間はどれくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ヘッドスパ単体で30〜60分が目安です。カットやカラーと合わせて受けることも可能で、その場合は施術時間が長くなります。予約時にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知のヘッドスパの料金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "fleur GROUP（2026年9月時点）のヘッドスパは4,000〜6,000円前後が目安です。使用するトリートメントやオプションによって異なります。詳細はメニューページまたはホットペッパービューティーでご確認ください。",
      },
    },
    {
      "@type": "Question",
      name: "ヘッドスパとヘアカラー・縮毛矯正は同日にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ヘッドスパはカラーや縮毛矯正と同日に組み合わせることが可能です。ただし施術の順序や頭皮の状態によって判断が変わるため、予約時にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "頭皮のかゆみ・フケ・べたつきにヘッドスパは効果的ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "ヘッドスパで頭皮の皮脂・汚れをしっかり落とし、頭皮の状態を整えることでかゆみやフケ・べたつきの改善が期待できます。ただし頭皮トラブルが重い場合は皮膚科への受診をおすすめします。",
      },
    },
  ],
};

const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE}/guide/kochi-head-spa-guide`,
  name: TITLE,
  url: `${BASE}/guide/kochi-head-spa-guide`,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#head-spa-intro", "#head-spa-faq dt"],
  },
  about: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP" },
};

export default function KochiHeadSpaGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/guide" className="hover:text-site-accent">美容ガイド</Link>
            <span className="mx-2">/</span>
            <span>高知のヘッドスパガイド</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Head Spa Guide</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text leading-snug">
            高知のヘッドスパガイド
          </h1>
          <p className="mt-2 text-sm text-site-muted">頭皮ケア・抜け毛・産後の髪の悩みと対策</p>
        </div>
      </div>

      <article className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">

          <section id="head-spa-intro">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              ヘッドスパとは
            </h2>
            <p className="text-sm sm:text-base text-site-text leading-loose">
              ヘッドスパは頭皮のクレンジング・マッサージ・トリートメントを組み合わせた頭皮ケアの施術です。頭皮の血行を促進して毛根に栄養を届けやすくし、抜け毛の予防・髪質改善・リラクゼーション効果が期待できます。fleur GROUPでは高知市・香南市のお客様に向けて、頭皮の状態に合わせたヘッドスパをご提供しています。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              ヘッドスパの主な効果
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "血行促進・育毛サポート", desc: "頭皮マッサージで血流を改善し、毛根への栄養供給を助けます。薄毛・抜け毛の予防につながります。" },
                { title: "頭皮の汚れ除去", desc: "毛穴に詰まった皮脂・汚れを落とすことで頭皮環境を整え、フケ・かゆみ・べたつきを改善します。" },
                { title: "リラクゼーション", desc: "頭部のマッサージは副交感神経を優位にし、肩こり・頭痛・眼精疲労の緩和にも効果的です。" },
                { title: "髪質改善", desc: "スカルプトリートメントで毛根を強化し、ハリ・コシのある健やかな髪の土台を整えます。" },
              ].map((item) => (
                <div key={item.title} className="border border-site-greige p-5 bg-site-light">
                  <h3 className="font-medium text-sm text-site-text mb-2">{item.title}</h3>
                  <p className="text-xs text-site-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              産後の抜け毛・頭皮ケア
            </h2>
            <p className="text-sm text-site-text leading-loose">
              出産後は女性ホルモン（エストロゲン）の急激な変化で、3〜6ヶ月後に抜け毛が一時的に増えることがあります。この時期に頭皮マッサージで血行を促し、毛根への栄養を届けることが大切です。fleur GROUPのヘッドスパでは産後の頭皮環境の変化に合わせたケアを行います。授乳中のカラー薬剤についてもカウンセリングでご相談ください。
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              ヘッドスパの料金・時間の目安
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-site-greige">
                <thead>
                  <tr className="bg-site-light">
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">メニュー</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">料金目安（税込）</th>
                    <th className="text-left p-3 text-site-text font-medium border-b border-site-greige">所要時間</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-site-greige">
                  <tr>
                    <td className="p-3 text-site-text">ヘッドスパ（単体）</td>
                    <td className="p-3 text-site-muted">4,000〜6,000円</td>
                    <td className="p-3 text-site-muted">30〜60分</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-site-text">カット＋ヘッドスパ</td>
                    <td className="p-3 text-site-muted">8,000〜11,000円</td>
                    <td className="p-3 text-site-muted">1.5〜2時間</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-site-text">カラー＋ヘッドスパ</td>
                    <td className="p-3 text-site-muted">12,000〜20,000円</td>
                    <td className="p-3 text-site-muted">2〜3時間</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-site-muted mt-3">※料金は2026年9月時点の目安です。詳細はメニューページをご確認ください。</p>
            <p className="mt-3">
              <Link href="/service/head-spa" className="text-site-accent text-sm hover:underline">
                ヘッドスパサービス詳細はこちら →
              </Link>
            </p>
          </section>

          <section id="head-spa-faq">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-6">
              よくある質問
            </h2>
            <dl className="space-y-6">
              {faqSchema.mainEntity.map((item, i) => (
                <div key={i} className="border-b border-site-greige pb-5">
                  <dt className="text-sm font-medium text-site-text mb-2">
                    <span className="text-site-accent mr-2">Q.</span>{item.name}
                  </dt>
                  <dd className="text-sm text-site-muted leading-relaxed pl-5">
                    <span className="text-site-accent mr-1">A.</span>{item.acceptedAnswer.text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-site-text mb-4">
              高知市・香南市のヘッドスパ対応サロン
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { href: "/salon/riv", name: "Riv. by fleurami", area: "高知市南川添", note: "ヘッドスパ・髪質改善・白髪ぼかし" },
                { href: "/salon/fleurami", name: "fleurami", area: "香南市野市", note: "ヘッドスパ・縮毛矯正・髪質改善" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block border border-site-greige p-5 hover:border-site-accent transition-colors group"
                >
                  <span className="block font-medium text-sm text-site-text group-hover:text-site-accent mb-1">{s.name}</span>
                  <span className="block text-xs text-site-muted mb-2">{s.area}</span>
                  <span className="block text-xs text-site-accent">{s.note}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-site-light p-6">
            <h2 className="font-serif text-lg font-semibold text-site-text mb-3">関連ガイド</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide/kochi-adult-beauty" className="text-site-accent hover:underline">
                  高知の大人向け美容ガイド（40代・50代の白髪・エイジングヘア）
                </Link>
              </li>
              <li>
                <Link href="/guide/kochi-hair-care" className="text-site-accent hover:underline">
                  高知のヘアケア完全ガイド（縮毛矯正・髪質改善・白髪ぼかし）
                </Link>
              </li>
              <li>
                <Link href="/service/head-spa" className="text-site-accent hover:underline">
                  ヘッドスパサービス詳細
                </Link>
              </li>
            </ul>
          </section>

          <div className="pt-4 border-t border-site-greige">
            <Link href="/guide" className="inline-flex items-center gap-3 text-sm text-site-text hover:text-site-accent transition-colors group">
              <span className="w-4 h-px bg-current group-hover:w-6 transition-all duration-300" />
              <span>美容ガイド一覧に戻る</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
