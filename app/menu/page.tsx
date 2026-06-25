import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import MenuTabs from "@/app/components/MenuTabs";
import ReservationChannels from "@/app/components/ReservationChannels";

const BLOG_URL = process.env.BLOG_URL ?? "https://fleurami-group-blog.com";

export const metadata: Metadata = {
  title: "メニュー一覧",
  description:
    "fleur GROUPのメニュー一覧。髪質改善・白髪ぼかし・縮毛矯正・艶カラー（Riv.by fleurami / fleurami）、まつげパーマ・ラッシュリフト・眉毛WAX（Raffine）など幅広くご用意しています。",
  alternates: { canonical: "https://fleurami-group.jp/menu" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "メニュー", url: "https://fleurami-group.jp/menu" },
];

export default async function MenuPage() {
  const content = await getContentCached();

  // menus と salons を Record<string, ...> 型に変換
  const menus = content.menus as unknown as Record<string, import("@/lib/content").MenuCategory[]>;
  const salons = content.salons as unknown as Record<string, import("@/lib/content").SalonContent>;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ページヘッダー */}
      <div className="pt-14 sm:pt-16 bg-white border-b border-site-greige">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
          <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2">/</span>
            <span>メニュー</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Menu</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text">メニュー一覧</h1>
        </div>
      </div>

      {/* タブ＋メニュー本体 */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <MenuTabs
            salonOrder={content.salonOrder}
            menus={menus}
            salons={salons}
          />
        </div>
      </section>

      {/* メニュー関連の記事（メニュー→ブログ内部リンク） */}
      <section className="py-14 sm:py-16 bg-white border-t border-site-greige">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.4em] text-site-accent uppercase">Blog</span>
            <div className="w-6 h-px bg-site-accent" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-site-text text-center mb-3">メニューに関する記事</h2>
          <p className="text-xs text-site-muted text-center mb-8">各メニューの仕上がり・施術例は症例ブログで詳しくご紹介しています</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/hair/kamiushitsu-kaizen", label: "髪質改善の症例・効果を見る", sub: "fleurami（香南市）・Riv.（高知市）" },
              { href: "/hair", label: "縮毛矯正・白髪ぼかし・艶カラーの記事一覧", sub: "美容室（fleurami・Riv.）" },
              { href: "/eyelash/raffine", label: "まつげパーマ・マツエク・眉WAXの記事一覧", sub: "Raffine（高知市 はりまや橋）" },
            ].map((l) => (
              <a
                key={l.href}
                href={`${BLOG_URL}${l.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 border border-site-greige px-5 py-4 hover:border-site-accent transition-colors"
              >
                <span>
                  <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors">{l.label}</span>
                  <span className="block text-[10px] text-site-muted mt-0.5">{l.sub}</span>
                </span>
                <span className="text-site-accent text-xs flex-shrink-0">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 予約 CTA（電話 / Web予約 / LINE / Instagram / ホットペッパー） */}
      <section className="py-16 bg-site-light border-t border-site-greige">
        <div className="px-6 sm:px-10 lg:px-16">
          <ReservationChannels salonOrder={content.salonOrder} salons={salons} groupByType />
        </div>
      </section>
    </>
  );
}
