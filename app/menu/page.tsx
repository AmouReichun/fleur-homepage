import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import MenuTabs from "@/app/components/MenuTabs";

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

export default function MenuPage() {
  const content = getContent();

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

      {/* 予約 CTA */}
      <section className="py-16 bg-site-light border-t border-site-greige">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-sm text-site-muted mb-8 tracking-wider">ご予約はホットペッパービューティーから</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {content.salonOrder.map((key) => {
              const s = salons[key];
              if (!s) return null;
              return (
                <a
                  key={key}
                  href={s.hotpepperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-site-accent text-white px-6 py-3 text-xs tracking-[0.2em] hover:bg-opacity-90 transition-all group"
                >
                  <span>{s.name}を予約</span>
                  <span className="w-3 h-px bg-white group-hover:w-5 transition-all duration-300" />
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
