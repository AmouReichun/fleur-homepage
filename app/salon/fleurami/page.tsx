import type { Metadata } from "next";
import Link from "next/link";
import { fleuramiSalonSchema, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "fleurami | 香南市の美容室 - 髪質改善・縮毛矯正",
  description:
    "香南市の美容室「fleurami」。髪質改善・縮毛矯正・艶カラー・カラーカットが得意。くせ毛・うねりのお悩みをサラサラに解決します。",
};

const menus = [
  { name: "髪質改善トリートメント", price: "¥[価格]〜", desc: "ダメージ補修で扱いやすい美髪へ" },
  { name: "縮毛矯正", price: "¥[価格]〜", desc: "くせ毛・うねりをサラサラに整える" },
  { name: "縮毛矯正+カット", price: "¥[価格]〜", desc: "縮毛矯正とカットのセットメニュー" },
  { name: "艶カラー", price: "¥[価格]〜", desc: "透明感と艶のあるダメージレスカラー" },
  { name: "カラー+カット", price: "¥[価格]〜", desc: "カラーとカットをまとめてお得に" },
  { name: "似合わせカット", price: "¥[価格]〜", desc: "顔型・ライフスタイルに合わせたカット" },
];

const faqs = [
  {
    q: "縮毛矯正をかけると傷みますか？",
    a: "薬剤の選定と施術技術によってダメージを最小限に抑えることができます。fleuramiでは髪の状態を丁寧に確認してから施術に入りますので、まずはカウンセリングでご相談ください。",
  },
  {
    q: "縮毛矯正と髪質改善は同時にできますか？",
    a: "髪の状態によっては同時施術が可能な場合もありますが、基本的に別々のご来店をおすすめしています。カウンセリングで最適なプランをご提案します。",
  },
  {
    q: "カラーと縮毛矯正は同じ日にできますか？",
    a: "基本的には同日施術が可能ですが、髪のダメージ状態によっては別日をおすすめする場合もあります。カウンセリングで確認しますのでご安心ください。",
  },
  {
    q: "駐車場はありますか？",
    a: "[駐車場情報プレースホルダー]",
  },
];

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "fleurami", url: "https://fleurami-group.jp/salon/fleurami" },
];

export default function FleuramiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiSalonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ヘッダー */}
      <div className="bg-site-pink py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/salon" className="hover:text-site-accent">店舗案内</Link>
            <span className="mx-2">/</span>
            <span>fleurami</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">香南市 / 美容室</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text mb-3">
            fleurami
          </h1>
          <p className="text-sm sm:text-base text-site-muted max-w-xl leading-relaxed">
            髪の悩みに寄り添う美容室。縮毛矯正・髪質改善で、毎日扱いやすく自分らしく輝く髪へ。
          </p>
        </div>
      </div>

      {/* 写真 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-site-light h-64 sm:h-80 flex items-center justify-center border border-site-greige">
          <span className="text-site-muted text-sm">[店舗・施術写真プレースホルダー]</span>
        </div>
      </div>

      {/* 予約ボタン */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row gap-3">
        <a
          href="#"
          className="flex-1 sm:flex-none sm:w-64 text-center bg-site-accent text-white py-4 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200"
        >
          ホットペッパーで予約する
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none sm:w-64 text-center border border-site-greige text-site-text py-4 text-sm font-medium tracking-wider hover:border-site-accent hover:text-site-accent transition-all duration-200"
        >
          Instagramを見る
        </a>
      </div>

      {/* 特徴 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            fleuramiの特徴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "縮毛矯正の高い技術力",
                body: "くせ毛・うねり毛でお悩みの方に、サラサラで扱いやすい仕上がりをご提供。薬剤の選定から施術まで、ダメージを最小限に抑えながら美しい仕上がりを実現します。",
              },
              {
                title: "髪質改善で美髪に",
                body: "繰り返しのカラーやパーマでダメージが気になる方に最適な髪質改善。髪本来の美しさを引き出し、手触り・ツヤ・まとまりを改善します。",
              },
              {
                title: "艶感あふれるカラー",
                body: "ダメージを抑えながら透明感と艶のあるカラーに仕上げます。似合う色選びから丁寧にご提案します。",
              },
              {
                title: "丁寧なカウンセリング",
                body: "初めての方も、以前から通ってくださっている方も、毎回カウンセリングを大切にしています。生活スタイルや理想のスタイルをヒアリングして最適な施術をご提案。",
              },
            ].map((item) => (
              <div key={item.title} className="bg-site-bg p-6 border border-site-greige">
                <h3 className="font-serif text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-site-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 人気メニュー */}
      <section className="py-12 sm:py-16 bg-site-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            人気メニュー
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menus.map((menu) => (
              <div key={menu.name} className="bg-white border border-site-greige p-5 flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-serif text-sm font-semibold mb-1">{menu.name}</h3>
                  <p className="text-xs text-site-muted leading-relaxed">{menu.desc}</p>
                </div>
                <p className="text-sm font-medium text-site-accent whitespace-nowrap">{menu.price}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-site-muted mt-4 text-center">※価格は税込みです。詳細はホットペッパービューティーをご確認ください。</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            よくあるご質問
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white border border-site-greige group">
                <summary className="flex items-start justify-between gap-4 p-5 cursor-pointer list-none">
                  <span className="text-sm font-medium leading-relaxed">
                    <span className="text-site-accent mr-2">Q.</span>{faq.q}
                  </span>
                  <span className="flex-shrink-0 text-site-muted text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm text-site-muted leading-relaxed border-t border-site-greige pt-4">
                    <span className="text-site-accent mr-2">A.</span>{faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 店舗情報 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">店舗情報</h2>
          <div className="border border-site-greige overflow-hidden">
            {[
              { label: "サロン名", value: "fleurami" },
              { label: "住所", value: "高知県香南市 [住所プレースホルダー]" },
              { label: "電話", value: "[電話番号プレースホルダー]" },
              { label: "営業時間", value: "10:00〜19:00（最終受付 [時間]）" },
              { label: "定休日", value: "[定休日プレースホルダー]" },
              { label: "駐車場", value: "[駐車場プレースホルダー]" },
              { label: "アクセス", value: "[アクセスプレースホルダー]" },
            ].map((row) => (
              <div key={row.label} className="flex border-b border-site-greige last:border-b-0">
                <div className="w-28 sm:w-36 bg-site-bg px-4 py-3.5 text-xs font-medium text-site-text flex-shrink-0">
                  {row.label}
                </div>
                <div className="px-4 py-3.5 text-sm text-site-muted">{row.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-site-light h-48 flex items-center justify-center border border-site-greige">
            <span className="text-site-muted text-sm">[Googleマップ埋め込みプレースホルダー]</span>
          </div>
        </div>
      </section>

      {/* 他店舗リンク */}
      <section className="py-10 bg-site-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-site-muted mb-4">他の店舗もご覧ください</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/salon/riv" className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200">
              Riv.by fleurami（高知市）
            </Link>
            <Link href="/salon/raffine" className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200">
              Raffine（高知市 はりまや橋）
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
