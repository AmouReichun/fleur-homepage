import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "fleurami GROUPでは美容師・アイリストを募集しています。高知市・香南市で働きたい方、技術と接客の両方を大切にしたい方、ぜひご応募ください。",
};

const positions = [
  {
    title: "美容師（スタイリスト）",
    salon: "Riv.by fleurami / fleurami",
    type: "正社員・パート",
    requirements: [
      "美容師免許をお持ちの方",
      "経験者優遇（未経験の方もご相談ください）",
      "接客が好きな方",
      "チームワークを大切にできる方",
    ],
    conditions: {
      salary: "[給与プレースホルダー]",
      hours: "[勤務時間プレースホルダー]",
      holiday: "[休日プレースホルダー]",
      benefits: "[福利厚生プレースホルダー]",
    },
  },
  {
    title: "アイリスト",
    salon: "Raffine",
    type: "正社員・パート",
    requirements: [
      "美容師免許をお持ちの方",
      "まつげ施術の経験がある方（未経験でも研修あり）",
      "細かい作業が得意な方",
      "お客様とのコミュニケーションが好きな方",
    ],
    conditions: {
      salary: "[給与プレースホルダー]",
      hours: "[勤務時間プレースホルダー]",
      holiday: "[休日プレースホルダー]",
      benefits: "[福利厚生プレースホルダー]",
    },
  },
];

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "採用情報", url: "https://fleurami-group.jp/recruit" },
];

export default function RecruitPage() {
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
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">採用情報</h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
            高知で美容師・アイリストとして働くならfleurami GROUPへ。技術と接客の両方を大切にするグループで、一緒に成長しませんか。
          </p>
        </div>
      </div>

      {/* グループの魅力 */}
      <section className="py-12 sm:py-16 bg-site-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            fleurami GROUPで働く魅力
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "技術を高める環境",
                body: "定期的な技術研修や外部セミナーへの参加をサポート。常に最新のトレンドや技術を学べる環境を整えています。",
              },
              {
                title: "チームワーク重視",
                body: "美容室とアイラッシュサロンのグループとして、スタッフ同士が助け合い、成長できる職場環境を大切にしています。",
              },
              {
                title: "高知で長く活躍",
                body: "高知市・香南市に根付いたサロングループとして、地域のお客様と長くお付き合いできる安定した環境です。",
              },
              {
                title: "未経験でも安心",
                body: "研修制度を整えています。美容師免許をお持ちであれば、まつげ施術や最新技術も丁寧にお教えします。",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 border border-site-greige">
                <h3 className="font-serif text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-site-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 募集職種 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            募集職種
          </h2>
          <div className="space-y-8">
            {positions.map((pos, i) => (
              <div key={i} className="border border-site-greige overflow-hidden">
                <div className="bg-site-light px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold">{pos.title}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs bg-white text-site-text px-2.5 py-1 border border-site-greige">{pos.salon}</span>
                    <span className="text-xs bg-site-accent text-white px-2.5 py-1">{pos.type}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-5">
                    <p className="text-xs font-medium text-site-text mb-2">応募要件</p>
                    <ul className="space-y-1">
                      {pos.requirements.map((req) => (
                        <li key={req} className="text-sm text-site-muted flex items-start gap-2">
                          <span className="text-site-accent mt-1 flex-shrink-0">&#10003;</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-site-greige pt-5">
                    <p className="text-xs font-medium text-site-text mb-3">待遇</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.entries(pos.conditions).map(([key, val]) => (
                        <div key={key} className="flex gap-2 text-sm">
                          <span className="text-site-muted min-w-[4rem]">
                            {key === "salary" ? "給与" : key === "hours" ? "勤務時間" : key === "holiday" ? "休日" : "福利厚生"}
                          </span>
                          <span className="text-site-muted">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 応募方法 */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-6">
            応募方法
          </h2>
          <p className="text-sm text-site-muted leading-relaxed mb-8">
            まずはお問い合わせフォームよりご連絡ください。簡単な自己紹介と希望のポジション・サロンをご記入のうえお送りください。担当者よりご連絡いたします。見学のみのご相談も歓迎しています。
          </p>
          <Link
            href="/contact"
            className="inline-block bg-site-accent text-white px-10 py-4 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200"
          >
            採用についてお問い合わせする
          </Link>
        </div>
      </section>
    </>
  );
}
