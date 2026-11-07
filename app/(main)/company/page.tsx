import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { organizationSchema, breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "fleur GROUPの会社概要。株式会社フルール・アミー（2006年設立／美容室 fleur ami・Riv. by fleur ami）と株式会社フルール・ロータス（まつげ・眉毛の専門店 Raffine）が運営する高知県の美容グループ。代表：今井信人。艶カラー・ミルボンの髪質改善が人気。",
  alternates: { canonical: "https://fleur-group.jp/company" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "会社概要", url: "https://fleur-group.jp/company" },
];

export default async function CompanyPage() {
  const { company, salonOrder, salons } = await getContentCached();

  const companies = [
    {
      name: "株式会社フルール・アミー",
      founded: "2006年2月10日",
      address: "高知県香南市野市町西野230",
      salons: ["fleur ami（香南市・美容室）", "Riv. by fleur ami（高知市・美容室）"],
    },
    {
      name: "株式会社フルール・ロータス",
      founded: "2025年5月29日",
      address: "高知県南国市陣山592",
      salons: ["Raffine（高知市・まつげ・眉毛の専門店）"],
    },
  ];

  const tableRows = [
    { label: "グループ名", value: "fleur GROUP（フルールグループ）" },
    { label: "運営会社", value: company.name },
    { label: "代表者", value: company.representative },
    { label: "電話番号", value: company.phone },
    { label: "メールアドレス", value: company.email },
    { label: "事業内容", value: company.business },
    { label: "店舗数", value: `${salonOrder.length}店舗` },
    { label: "営業エリア", value: "高知県高知市・香南市" },
  ].filter((r) => r.value);

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

      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
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
            {tableRows.map((row) => (
              <div key={row.label} className="flex border-b border-site-greige last:border-b-0">
                <div className="w-36 sm:w-44 bg-site-bg px-5 py-4 text-sm font-medium text-site-text flex-shrink-0">
                  {row.label}
                </div>
                <div className="px-5 py-4 text-sm text-site-muted whitespace-pre-line">{row.value}</div>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">運営会社と店舗</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {companies.map((c) => (
              <div key={c.name} className="border border-site-greige p-5">
                <p className="font-serif text-base font-semibold text-site-text mb-2">{c.name}</p>
                <dl className="text-sm text-site-muted space-y-1">
                  <div><dt className="inline font-medium text-site-text">代表者：</dt><dd className="inline">{company.representative}</dd></div>
                  <div><dt className="inline font-medium text-site-text">設立：</dt><dd className="inline">{c.founded}</dd></div>
                  <div><dt className="inline font-medium text-site-text">本店所在地：</dt><dd className="inline">{c.address}</dd></div>
                  <div><dt className="inline font-medium text-site-text">運営店舗：</dt><dd className="inline">{c.salons.join("、")}</dd></div>
                </dl>
              </div>
            ))}
          </div>

          <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">グループについて</h2>
          <div className="prose max-w-none text-sm text-site-muted leading-loose space-y-4">
            <p>
              fleur GROUPは、高知市・香南市で美容室2店舗（Riv. by fleur ami・fleur ami）とまつげ・眉毛の専門店1店舗（Raffine）を運営するグループです。美容室2店は株式会社フルール・アミー、Raffineは株式会社フルール・ロータスが運営しています。2006年の創業以来、高知県内のお客様に支持され続けてきたサロングループです。
            </p>
            <p>
              「髪と目元の悩みに寄り添い、毎日が扱いやすく、自分らしく綺麗でいられる」ことをコンセプトに、お客様一人ひとりに合わせたデザインをご提案しています。カウンセリングを施術の出発点とし、なりたいイメージと実際の骨格・髪質・ライフスタイルをすり合わせながら最適なプランをご提案します。
            </p>
            <p>
              高知市南川添の「Riv. by fleur ami」と香南市野市町の「fleur ami」は、どちらも一番人気の艶カラーと、ミルボンの髪質改善トリートメント（グローバルミルボン）が得意な美容室です。白髪ぼかし・縮毛矯正・似合わせカットにも対応しています。Riv.は高知IC車4分・駐車場無料、fleur amiは無料駐車場7台完備でお車でのアクセスも便利です。高知市はりまや橋の「Raffine（ラフィーネ）」はまつげパーマ・まつげエクステ・眉毛WAXに特化したアイラッシュ専門サロンです。
            </p>
            <p>
              各店舗ともホットペッパービューティーまたはLINEよりご予約いただけます。初めてのご来店でも丁寧にカウンセリングを行いますので、お気軽にご相談ください。スタッフ一同、お客様に心地よい時間をお届けできるよう、技術と接客の両面を日々追求しています。
            </p>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-site-text mb-6">店舗一覧</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {salonOrder.map((key) => {
                const s = salons[key as keyof typeof salons];
                if (!s) return null;
                return (
                  <Link
                    key={key}
                    href={`/salon/${key}`}
                    className="border border-site-greige p-5 hover:border-site-accent transition-colors duration-200 block"
                  >
                    <p className="text-xs text-site-accent mb-1">{s.area}</p>
                    <p className="font-serif text-base font-semibold mb-0.5">{s.name}</p>
                    <p className="text-xs text-site-muted">{s.salonType}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
