import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import RecruitForm from "@/app/components/RecruitForm";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "fleur GROUPでは美容師・アイリストを募集しています。高知市・香南市で働きたい方、技術と接客の両方を大切にしたい方、ぜひご応募ください。",
  alternates: { canonical: "https://fleurami-group.jp/recruit" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "採用情報", url: "https://fleurami-group.jp/recruit" },
];

export default async function RecruitPage() {
  const { recruit, salonOrder, salons } = await getContentCached();

  const positionTitles = Array.from(
    new Set(recruit.positions.map((p) => p.title).filter(Boolean))
  );
  const salonNames = salonOrder
    .map((key) => salons[key as keyof typeof salons]?.name)
    .filter((n): n is string => Boolean(n));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      <div className="bg-site-text text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">ホーム</Link>
            <span className="mx-2">/</span>
            <span>採用情報</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-4 uppercase">Recruit</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
            {recruit.headline || "採用情報"}
          </h1>
          {recruit.description && (
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl whitespace-pre-line">
              {recruit.description}
            </p>
          )}
        </div>
      </div>

      {/* 待遇・福利厚生 */}
      {recruit.benefits.length > 0 && (
        <section className="py-12 sm:py-16 bg-site-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              待遇・福利厚生
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recruit.benefits.map((b) => (
                <div key={b} className="bg-white p-5 border border-site-greige flex items-start gap-3">
                  <span className="text-site-accent flex-shrink-0">✓</span>
                  <p className="text-sm text-site-muted">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 募集職種 */}
      {recruit.positions.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              募集職種
            </h2>
            <div className="space-y-5">
              {recruit.positions.map((pos, i) => (
                <div key={i} className="border border-site-greige overflow-hidden">
                  <div className="bg-site-light px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold">{pos.title}</h3>
                    <span className="text-xs bg-white text-site-text px-2.5 py-1 border border-site-greige w-fit">
                      {pos.salon}
                    </span>
                  </div>
                  {pos.description && (
                    <div className="p-6">
                      <p className="text-sm text-site-muted leading-relaxed whitespace-pre-line">
                        {pos.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 応募方法 */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-6 text-center">
            応募方法
          </h2>
          <p className="text-sm text-site-muted leading-relaxed mb-8 text-center">
            下記の応募フォームより、希望のポジション・サロンをご記入のうえお送りください。
            担当者より通常2〜3営業日以内にご連絡いたします。見学のみのご相談も歓迎しています。
          </p>

          <RecruitForm positions={positionTitles} salons={salonNames} />

          <p className="text-xs text-site-muted leading-relaxed mt-6 text-center">
            一般的なお問い合わせは
            <Link href="/contact" className="text-site-accent underline underline-offset-2 mx-1">
              お問い合わせフォーム
            </Link>
            をご利用ください。
          </p>
        </div>
      </section>
    </>
  );
}
