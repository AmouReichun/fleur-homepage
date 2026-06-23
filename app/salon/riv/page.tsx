import type { Metadata } from "next";
import Link from "next/link";
import { rivSalonSchema, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Riv.by fleurami | 高知市の美容室 - 髪質改善・白髪ぼかし",
  description:
    "高知市の美容室「Riv.by fleurami」。髪質改善・白髪ぼかし・艶カラー・大人女性向けの似合わせカットが得意。毎日扱いやすく、自分らしく綺麗でいられるスタイルをご提案します。",
};

const menus = [
  { name: "髪質改善トリートメント", price: "¥[価格]〜", desc: "ダメージ補修しながら扱いやすい質感へ" },
  { name: "白髪ぼかしカラー", price: "¥[価格]〜", desc: "白髪を活かしたナチュラルグレイカラー" },
  { name: "艶カラー", price: "¥[価格]〜", desc: "透明感と艶感のあるダメージレスカラー" },
  { name: "似合わせカット", price: "¥[価格]〜", desc: "骨格・顔型・ライフスタイルに合わせたカット" },
  { name: "縮毛矯正", price: "¥[価格]〜", desc: "くせ毛をサラサラに整える" },
  { name: "カラー+カット", price: "¥[価格]〜", desc: "カラーとカットがセットでお得に" },
];

const faqs = [
  {
    q: "髪質改善と縮毛矯正の違いは何ですか？",
    a: "縮毛矯正はくせをしっかりと伸ばすのに対して、髪質改善はくせを和らげながら髪のダメージを補修し、扱いやすくする施術です。Riv.by fleuramiではお客様の髪質・お悩みに合わせて最適なメニューをご提案します。",
  },
  {
    q: "白髪が多くても白髪ぼかしはできますか？",
    a: "白髪の量が多い方でも白髪ぼかしは可能です。白髪の割合や髪の状態によって仕上がりが異なりますので、カウンセリングでご相談ください。白髪を活かしてナチュラルなグレイカラーに仕上げます。",
  },
  {
    q: "予約なしでも来店できますか？",
    a: "当日空きがある場合はご対応可能ですが、待ち時間が発生する場合がございます。ホットペッパービューティーからのご予約をおすすめしています。",
  },
  {
    q: "駐車場はありますか？",
    a: "[駐車場情報プレースホルダー]",
  },
];

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "Riv.by fleurami", url: "https://fleurami-group.jp/salon/riv" },
];

export default function RivPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSalonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ヘッダー */}
      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/salon" className="hover:text-site-accent">店舗案内</Link>
            <span className="mx-2">/</span>
            <span>Riv.by fleurami</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">高知市 / 美容室</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text mb-3">
            Riv.by fleurami
          </h1>
          <p className="text-sm sm:text-base text-site-muted max-w-xl leading-relaxed">
            大人女性の「なりたい」を叶える美容室。髪質改善・白髪ぼかしで、毎日が扱いやすく自分らしく綺麗でいられるスタイルを。
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
            Riv.by fleuramiの特徴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "髪質改善の専門技術",
                body: "ダメージを補修しながら扱いやすい髪質へと導く髪質改善を得意としています。カウンセリングで一人ひとりの髪の状態を丁寧に確認します。",
              },
              {
                title: "白髪ぼかしで自然に",
                body: "白髪を染めて隠すのではなく、白髪を活かしてグラデーションに仕上げる白髪ぼかし。リタッチ頻度が減り、髪へのダメージも抑えられます。",
              },
              {
                title: "大人女性のための似合わせ",
                body: "骨格・顔型・ライフスタイルに合わせた似合わせカットで、お客様それぞれの魅力を引き出します。年齢に合った上品なスタイルをご提案。",
              },
              {
                title: "丁寧なカウンセリング",
                body: "お悩みやご要望をじっくりとお聞きしてから施術に入ります。初めての方もお気軽にご相談ください。",
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
              { label: "サロン名", value: "Riv.by fleurami" },
              { label: "住所", value: "高知県高知市 [住所プレースホルダー]" },
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
            <Link href="/salon/fleurami" className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200">
              fleurami（香南市）
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
