import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleurami-group.jp";

export const metadata: Metadata = {
  title: "メニュー・サービス一覧 | 高知市・香南市の美容室・アイラッシュサロン",
  description:
    "fleur GROUPのサービス一覧。髪質改善・白髪ぼかし・縮毛矯正・艶カラー（美容室）、まつげパーマ・マツエク・眉毛WAX（アイラッシュ）など、高知市・香南市で人気のメニューをご紹介します。",
  alternates: { canonical: `${BASE}/service` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "サービス一覧", url: `${BASE}/service` },
];

export default function ServiceIndexPage() {
  const hair = SERVICES.filter((s) => s.world === "hair");
  const eyelash = SERVICES.filter((s) => s.world === "eyelash");

  const Section = ({ title, items }: { title: string; items: typeof SERVICES }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-medium text-site-text tracking-wider whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((s) => (
          <Link key={s.slug} href={`/service/${s.slug}`} className="group block border border-site-greige bg-white hover:border-site-accent transition-colors p-5">
            <p className="font-serif text-lg font-medium text-site-text group-hover:text-site-accent transition-colors">{s.name}</p>
            <p className="text-xs text-site-muted mt-1 leading-relaxed line-clamp-2">{s.description}</p>
            <span className="inline-block text-[11px] text-site-accent mt-3">詳しく見る →</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <div className="pt-14 sm:pt-16 bg-white border-b border-site-greige">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14 sm:py-20">
          <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2">/</span>
            <span>サービス一覧</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Service</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text">サービス一覧</h1>
          <p className="text-sm text-site-muted mt-4 leading-relaxed">高知市・香南市で人気のメニューを、お悩み・効果・FAQとあわせてご紹介します。</p>
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-site-bg">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <Section title="美容室（Hair）" items={hair} />
          <Section title="アイラッシュ・アイブロウ（Eyelash & Brow）" items={eyelash} />
          <div className="text-center mt-4">
            <Link href="/menu" className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-site-text hover:text-site-accent transition-colors group">
              <span>料金つきメニュー一覧を見る</span>
              <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
