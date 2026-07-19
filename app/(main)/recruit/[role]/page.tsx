import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRole, getAllRoleSlugs, ROLES } from "@/lib/recruit-roles";
import { breadcrumbSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";
const HIRING_ORG = { "@type": "Organization", name: "fleur GROUP", sameAs: BASE };
const DATE_POSTED = "2026-06-01";
const VALID_THROUGH = "2027-06-30";

type Props = { params: { role: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRoleSlugs().map((role) => ({ role }));
}

export function generateMetadata({ params }: Props): Metadata {
  const role = getRole(params.role);
  if (!role) return {};
  const url = `${BASE}/recruit/${role.slug}`;
  const ogImage = `${BASE}/api/og?title=${encodeURIComponent(`${role.title}募集`)}&salon=${encodeURIComponent("高知市・香南市 fleur GROUP")}&category=${role.world}`;
  return {
    title: role.metaTitle,
    description: role.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: role.metaTitle, description: role.metaDescription, url, images: [ogImage] },
    twitter: { card: "summary_large_image", title: role.metaTitle, description: role.metaDescription, images: [ogImage] },
  };
}

export default function RecruitRolePage({ params }: Props) {
  const role = getRole(params.role);
  if (!role) notFound();

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "採用情報", url: `${BASE}/recruit` },
    { name: role.title, url: `${BASE}/recruit/${role.slug}` },
  ];

  // 勤務地ごとに JobPosting を出力（「高知市 ○○ 求人」「香南市 ○○ 求人」を個別に狙う）
  const jobPostings = role.locations.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: `${loc.locality}の${role.title}（${loc.salonName}）`,
    description: `${role.lead} ${role.tasks.join("、")}。${role.salary.map((s) => `${s.label}：${s.amount}`).join("、")}。`,
    datePosted: DATE_POSTED,
    validThrough: VALID_THROUGH,
    employmentType: "FULL_TIME",
    hiringOrganization: HIRING_ORG,
    industry: "美容業",
    occupationalCategory: role.occupation,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.streetAddress,
        addressLocality: loc.locality,
        addressRegion: "高知県",
        postalCode: loc.postalCode,
        addressCountry: "JP",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "JPY",
      value: { "@type": "QuantitativeValue", minValue: role.salaryRange.min, maxValue: role.salaryRange.max, unitText: "MONTH" },
    },
    directApply: true,
  }));

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: role.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      {jobPostings.map((jp, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jp) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      {/* ヘッダー */}
      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/recruit" className="hover:text-site-accent">採用情報</Link>
            <span className="mx-2">/</span>
            <span>{role.title}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Recruit — {role.areas.join("・")}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">
            {role.areas.join("・")}の{role.title}求人
          </h1>
        </div>
      </div>

      {/* リード */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm sm:text-base text-site-text leading-loose">{role.lead}</p>
        </div>
      </section>

      {/* 仕事内容 */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">仕事内容</h2>
          <ul className="space-y-3">
            {role.tasks.map((t) => (
              <li key={t} className="flex items-start gap-3 bg-white border border-site-greige p-4">
                <span className="text-site-accent flex-shrink-0">●</span>
                <span className="text-sm text-site-text leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* こんな方を歓迎 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">こんな方を歓迎します</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {role.forWhom.map((w) => (
              <li key={w} className="flex items-start gap-3 border border-site-greige p-4">
                <span className="text-site-accent flex-shrink-0">✓</span>
                <span className="text-sm text-site-text leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 給与（見える化） */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">給与</h2>
          <div className="border border-site-greige bg-white divide-y divide-site-greige">
            {role.salary.map((s) => (
              <div key={s.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-5">
                <span className="text-sm font-medium text-site-text">{s.label}</span>
                <span className="text-right">
                  <span className="text-lg font-semibold text-site-accent">{s.amount}</span>
                  {s.note && <span className="block text-[11px] text-site-muted">{s.note}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 待遇（見える化） */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">待遇・福利厚生</h2>
          <table className="w-full border border-site-greige text-sm">
            <tbody>
              {role.conditions.map((c) => (
                <tr key={c.label} className="border-b border-site-greige last:border-0 align-top">
                  <th className="bg-site-light text-left font-medium text-site-text p-4 w-32 whitespace-nowrap">{c.label}</th>
                  <td className="p-4 text-site-text leading-relaxed whitespace-pre-line">{c.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* キャリアパス（見える化） */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">キャリアパス</h2>
          <ol className="relative border-l-2 border-site-greige ml-3 space-y-6">
            {role.career.map((c) => (
              <li key={c.step} className="ml-6">
                <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-site-accent" />
                <p className="text-[11px] tracking-widest text-site-accent uppercase mb-1">{c.step}</p>
                <h3 className="font-serif text-base font-medium text-site-text mb-1">{c.title}</h3>
                <p className="text-xs text-site-muted leading-relaxed">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">よくある質問</h2>
          <div className="divide-y divide-site-greige border-y border-site-greige">
            {role.faq.map((f, i) => (
              <details key={i} className="group p-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                  <span className="text-sm font-medium leading-relaxed"><span className="text-site-accent mr-2">Q.</span>{f.q}</span>
                  <span className="flex-shrink-0 text-site-muted text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <p className="mt-4 text-sm text-site-muted leading-relaxed border-t border-site-greige pt-4"><span className="text-site-accent mr-2">A.</span>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 応募CTA */}
      <section className="py-14 sm:py-20 bg-site-accent/10 border-t border-site-greige">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">{role.title}に応募する</h2>
          <p className="text-sm text-site-muted mb-7">応募・サロン見学のお申し込みはこちらから。見学だけでも歓迎です。</p>
          <Link
            href="/recruit"
            className="inline-flex items-center justify-center gap-3 bg-site-accent text-white px-8 py-4 text-sm font-medium tracking-wide rounded-full hover:opacity-90 transition-opacity"
          >
            応募・見学を申し込む
          </Link>

          {/* 他の職種 */}
          <div className="mt-10">
            <p className="text-xs text-site-muted mb-3">他の職種を見る</p>
            <div className="flex flex-wrap justify-center gap-3">
              {ROLES.filter((r) => r.slug !== role.slug).map((r) => (
                <Link key={r.slug} href={`/recruit/${r.slug}`} className="border border-site-greige px-5 py-2.5 text-sm text-site-text hover:border-site-accent hover:text-site-accent transition-colors">
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
