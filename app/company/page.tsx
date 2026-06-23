import type { Metadata } from "next";
import Link from "next/link";
import { organizationSchema, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "fleurami GROUPの会社概要。高知市・香南市で美容室・アイラッシュサロンを展開するグループの企業情報をご覧いただけます。",
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "会社概要", url: "https://fleurami-group.jp/company" },
];

export default function CompanyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>会社概要</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Company</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">会社概要</h1>
        </div>
      </div>

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="border border-site-greige overflow-hidden mb-12">
            {[
              { label: "グループ名", value: "fleurami GROUP" },
              { label: "設立", value: "[設立年プレースホルダー]" },
              { label: "代表者", value: "[代表者名プレースホルダー]" },
              { label: "所在地（本部）", value: "高知県 [住所プレースホルダー]" },
              { label: "電話番号", value: "[電話番号プレースホルダー]" },
              { label: "事業内容", value: "美容室の経営・運営、アイラッシュサロンの経営・運営" },
              { label: "店舗数", value: "3店舗（美容室2店舗・アイラッシュサロン1店舗）" },
              { label: "営業エリア", value: "高知県高知市・香南市" },
            ].map((row) => (
              <div key={row.label} className="flex border-b border-site-greige last:border-b-0">
                <div className="w-36 sm:w-44 bg-site-bg px-5 py-4 text-sm font-medium text-site-text flex-shrink-0">
                  {row.label}
                </div>
                <div className="px-5 py-4 text-sm text-site-muted whitespace-pre-line">{row.value}</div>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">グループについて</h2>
          <div className="prose max-w-none text-sm text-site-muted leading-loose space-y-4">
            <p>
              fleurami GROUPは、高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）とアイラッシュサロン1店舗（Raffine）を運営するグループです。
            </p>
            <p>
              「髪と目元の悩みに寄り添い、毎日が扱いやすく、自分らしく綺麗でいられる」ことをコンセプトに、お客様一人ひとりに合わせたデザインをご提案しています。
            </p>
            <p>
              高知に根付いたサロングループとして、地域の皆様に長く愛されるサービスを提供し続けることを大切にしています。スタッフ全員が技術と接客の両方を追求し、お客様に心地よい時間をお届けします。
            </p>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">店舗一覧</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Riv.by fleurami", area: "高知市", type: "美容室", href: "/salon/riv" },
                { name: "fleurami", area: "香南市", type: "美容室", href: "/salon/fleurami" },
                { name: "Raffine", area: "高知市 はりまや橋", type: "アイラッシュサロン", href: "/salon/raffine" },
              ].map((salon) => (
                <Link
                  key={salon.name}
                  href={salon.href}
                  className="border border-site-greige p-5 hover:border-site-accent transition-colors duration-200 block"
                >
                  <p className="text-xs text-site-accent mb-1">{salon.area}</p>
                  <p className="font-serif text-base font-semibold mb-0.5">{salon.name}</p>
                  <p className="text-xs text-site-muted">{salon.type}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
