import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import StaffTabs from "@/app/components/StaffTabs";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description:
    "fleurami GROUPのスタッフ紹介。fleurami・Riv.by fleurami・Raffineで活躍するスタイリスト・アイリストをご紹介します。",
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "スタッフ紹介", url: "https://fleurami-group.jp/staff" },
];

export default function StaffPage() {
  const content = getContent();

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
            <span>スタッフ紹介</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Staff</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text">スタッフ紹介</h1>
        </div>
      </div>

      {/* タブ＋グリッド */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <StaffTabs staff={content.staff} />
        </div>
      </section>

      {/* 予約 CTA */}
      <section className="py-16 bg-site-light border-t border-site-greige">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-sm text-site-muted mb-8 tracking-wider">
            スタッフへのご指名はご予約時にお申し付けください
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[
              { label: "fleurami へのご予約", href: "https://beauty.hotpepper.jp/slnH000528388/" },
              { label: "Riv.by fleurami へのご予約", href: "https://beauty.hotpepper.jp/slnH000634137/" },
              { label: "Raffine へのご予約", href: "https://beauty.hotpepper.jp/kr/slnH000767549/" },
            ].map((btn) => (
              <a
                key={btn.href}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-site-greige text-site-text px-6 py-3 text-xs tracking-[0.15em] hover:border-site-accent hover:text-site-accent transition-all duration-200 group"
              >
                <span>{btn.label}</span>
                <span className="w-4 h-px bg-current group-hover:w-6 transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
