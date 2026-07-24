import type { Metadata } from "next";
import Link from "next/link";
import { AREAS, servicesInArea } from "@/lib/areas";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

export const metadata: Metadata = {
  title: "エリアから探す｜高知市・香南市の美容室・アイラッシュサロン fleur GROUP",
  description:
    "高知市・香南市でfleur GROUPのサロンを探す。高知市（Riv. by fleurami・Raffine）・香南市（fleurami）のエリア別メニュー一覧と予約案内。",
  alternates: { canonical: `${BASE}/area` },
};

const crumbs = [
  { name: "ホーム", url: BASE },
  { name: "エリアから探す", url: `${BASE}/area` },
];

export default function AreaHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      <div className="pt-14 sm:pt-16 min-h-screen bg-white">
        {/* ページヘッダー */}
        <div className="bg-white border-b border-site-greige">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
            <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
              <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
              <span className="mx-2">/</span>
              <span>エリアから探す</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-site-accent" />
              <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Area</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text mb-4">エリアから探す</h1>
            <p className="text-sm text-site-muted max-w-xl leading-relaxed">
              高知市・香南市のfleur GROUP各店舗を、エリア別にご案内します。
              お近くのサロンをお探しの方はエリアをお選びください。
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AREAS.map((area) => {
              const services = servicesInArea(area);
              return (
                <div key={area.slug} className="border border-site-greige rounded-lg overflow-hidden">
                  {/* エリアヘッダー */}
                  <div className="px-8 py-6 border-b border-site-greige bg-site-light">
                    <p className="text-[10px] tracking-[0.4em] text-site-muted uppercase mb-2">
                      {area.slug === "kochi" ? "Kochi City" : "Konan City"}
                    </p>
                    <h2 className="font-serif text-3xl font-light text-site-text mb-3">{area.name}</h2>
                    <Link
                      href={`/area/${area.slug}`}
                      className="inline-flex items-center gap-2 text-xs tracking-wider text-site-accent hover:opacity-70 transition-opacity"
                    >
                      {area.name}の全メニューを見る →
                    </Link>
                  </div>

                  {/* 人気メニュー */}
                  <div className="px-8 py-6">
                    <p className="text-[10px] tracking-[0.4em] text-site-muted uppercase mb-4">メニューから探す</p>
                    <div className="grid grid-cols-2 gap-2">
                      {services.slice(0, 8).map((svc) => (
                        <Link
                          key={svc.slug}
                          href={`/area/${area.slug}/${svc.slug}`}
                          className="text-xs px-3 py-2 border border-site-greige hover:border-site-accent text-site-muted hover:text-site-accent transition-colors rounded text-center"
                        >
                          {svc.name}
                        </Link>
                      ))}
                    </div>
                    {services.length > 8 && (
                      <div className="mt-3 text-center">
                        <Link href={`/area/${area.slug}`} className="text-xs text-site-muted hover:text-site-accent transition-colors">
                          + {services.length - 8}件のメニューを見る
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 地図・アクセスへの誘導 */}
          <div className="mt-16 pt-12 border-t border-site-greige text-center">
            <p className="text-[10px] tracking-[0.4em] text-site-muted uppercase mb-4">Salons</p>
            <p className="text-sm text-site-muted mb-6">各サロンの詳細・アクセス・予約はこちら</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { href: "/salon/fleurami", name: "fleurami（香南市）" },
                { href: "/salon/riv", name: "Riv. by fleurami（高知市）" },
                { href: "/salon/raffine", name: "Raffine（高知市）" },
              ].map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="text-xs px-6 py-3 border border-site-accent text-site-accent hover:bg-site-accent hover:text-white transition-colors tracking-wider"
                  style={{ borderRadius: "2px" }}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
