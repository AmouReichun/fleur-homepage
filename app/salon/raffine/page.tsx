import type { Metadata } from "next";
import Link from "next/link";
import { raffineSalonSchema, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Raffine | 高知市はりまや橋のアイラッシュサロン - まつげパーマ・眉毛WAX",
  description:
    "高知市はりまや橋周辺のアイラッシュサロン「Raffine」。ラッシュリフト・まつげパーマ・韓国束感まつげ・眉毛WAX・メンズ眉WAXに対応。目元の美しさを引き出します。",
};

const menus = [
  { name: "ラッシュリフト", price: "¥[価格]〜", desc: "自まつげを上向きに立ち上げる施術" },
  { name: "まつげパーマ", price: "¥[価格]〜", desc: "自まつげに自然なカールをつける" },
  { name: "韓国束感まつげ", price: "¥[価格]〜", desc: "束感のある韓国風まつげに仕上げる" },
  { name: "眉毛WAX脱毛", price: "¥[価格]〜", desc: "眉の形を整えるWAX脱毛" },
  { name: "メンズ眉WAX", price: "¥[価格]〜", desc: "男性向けの眉毛WAX脱毛" },
  { name: "まつげカール+眉WAXセット", price: "¥[価格]〜", desc: "まつげとまゆのセットメニュー" },
];

const faqs = [
  {
    q: "まつげパーマとラッシュリフトの違いは何ですか？",
    a: "まつげパーマはロッドを使ってカールをつける施術、ラッシュリフトはシリコンのパッドで自まつげを根元から立ち上げる施術です。ラッシュリフトの方がより自然な仕上がりになる傾向があります。カウンセリングでご希望に合わせてご提案します。",
  },
  {
    q: "まつげエクステはしていますか？",
    a: "現在Raffineではまつげエクステのメニューは提供しておりません。自まつげを活かしたラッシュリフト・まつげパーマを得意としています。",
  },
  {
    q: "眉毛WAXは痛いですか？",
    a: "施術時に多少の刺激はありますが、短時間で終わるため多くのお客様が「思ったより大丈夫だった」とおっしゃいます。敏感肌の方はご相談ください。",
  },
  {
    q: "男性でも来店できますか？",
    a: "はい、Raffineではメンズ眉WAXにも対応しています。眉の形を整えることで顔全体の印象がスッキリします。男性のお客様も多くご来店いただいています。",
  },
];

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
  { name: "Raffine", url: "https://fleurami-group.jp/salon/raffine" },
];

export default function RaffinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ヘッダー */}
      <div className="bg-site-greige py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/salon" className="hover:text-site-accent">店舗案内</Link>
            <span className="mx-2">/</span>
            <span>Raffine</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">高知市 はりまや橋 / アイラッシュサロン</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text mb-3">
            Raffine
          </h1>
          <p className="text-sm sm:text-base text-site-muted max-w-xl leading-relaxed">
            目元を美しく彩るアイラッシュ専門サロン。まつげ・眉毛の専門技術で、あなたの魅力を最大限に引き出します。
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
            Raffineの特徴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "ラッシュリフトで自然な美まつげ",
                body: "自まつげを根元から立ち上げるラッシュリフトで、まつげマスカラいらずの目元へ。お客様一人ひとりのまつげの状態に合わせて、最適なカールをご提案します。",
              },
              {
                title: "韓国束感まつげが人気",
                body: "自まつげの束感を強調した韓国風の仕上がりが人気です。自然な束感でかわいい目元を演出します。",
              },
              {
                title: "眉毛WAXで印象チェンジ",
                body: "眉の形を整えるWAX脱毛で、顔全体の印象がスッキリと変わります。骨格に合わせた眉の形をご提案します。",
              },
              {
                title: "メンズも歓迎",
                body: "Raffineではメンズのお客様も大歓迎です。男性向け眉WAXで清潔感のある印象に。初めての方もお気軽にご相談ください。",
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
              { label: "サロン名", value: "Raffine" },
              { label: "住所", value: "高知県高知市はりまや橋 [住所プレースホルダー]" },
              { label: "電話", value: "[電話番号プレースホルダー]" },
              { label: "営業時間", value: "10:00〜19:00（最終受付 [時間]）" },
              { label: "定休日", value: "[定休日プレースホルダー]" },
              { label: "駐車場", value: "[駐車場プレースホルダー]" },
              { label: "アクセス", value: "はりまや橋より徒歩[X]分 / [アクセスプレースホルダー]" },
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
          <p className="text-xs text-site-muted mb-4">美容室もご覧ください</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/salon/riv" className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200">
              Riv.by fleurami（高知市）
            </Link>
            <Link href="/salon/fleurami" className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200">
              fleurami（香南市）
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
