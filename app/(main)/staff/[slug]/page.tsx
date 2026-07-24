import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import ReservationChannels from "@/app/components/ReservationChannels";
import type { SalonContent } from "@/lib/content";

const BASE = "https://fleur-group.jp";

const SALON_URLS: Record<string, string> = {
  fleurami: `${BASE}/salon/fleurami`,
  "Riv. by fleurami": `${BASE}/salon/riv`,
  Raffine: `${BASE}/salon/raffine`,
};

const SALON_KEYS: Record<string, string> = {
  fleurami: "fleurami",
  "Riv. by fleurami": "riv",
  Raffine: "raffine",
};

const SALON_TYPE: Record<string, string> = {
  fleurami: "HairSalon",
  "Riv. by fleurami": "HairSalon",
  Raffine: "BeautySalon",
};

type Props = { params: { slug: string } };

export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await getContentCached();
  return content.staff
    .filter((m) => m.slug)
    .map((m) => ({ slug: m.slug! }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getContentCached();
  const member = content.staff.find((m) => m.slug === params.slug);
  if (!member) return {};

  const title = `${member.name}（${member.role}）| ${member.salon} | fleur GROUP`;
  const description = `${member.salon}の${member.role}・${member.name}。${member.history ? member.history + "。" : ""}${member.bio}`;
  const url = `${BASE}/staff/${member.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: member.imageSrc ? [member.imageSrc.startsWith("http") ? member.imageSrc : `${BASE}${member.imageSrc}`] : [],
    },
  };
}

export default async function StaffProfilePage({ params }: Props) {
  const content = await getContentCached();
  const member = content.staff.find((m) => m.slug === params.slug);
  if (!member) notFound();

  const salonKey = SALON_KEYS[member.salon] ?? "fleurami";
  const salonUrl = SALON_URLS[member.salon] ?? `${BASE}/salon`;
  const salonType = SALON_TYPE[member.salon] ?? "HairSalon";
  const imageUrl = member.imageSrc
    ? member.imageSrc.startsWith("http")
      ? member.imageSrc
      : `${BASE}${member.imageSrc}`
    : null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/staff/${member.slug}`,
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    ...(imageUrl ? { image: imageUrl } : {}),
    url: `${BASE}/staff/${member.slug}`,
    worksFor: {
      "@type": salonType,
      "@id": salonUrl,
      name: member.salon,
      url: salonUrl,
      parentOrganization: {
        "@type": "Organization",
        name: "fleur GROUP",
        url: BASE,
      },
    },
    ...(member.specialties && member.specialties.length > 0
      ? { knowsAbout: member.specialties }
      : {}),
    ...(member.qualifications && member.qualifications.length > 0
      ? { hasCredential: member.qualifications.map((q) => ({ "@type": "EducationalOccupationalCredential", name: q })) }
      : {}),
    ...(member.instagramUrl ? { sameAs: [member.instagramUrl] } : {}),
  };

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "スタッフ紹介", url: `${BASE}/staff` },
    { name: member.name, url: `${BASE}/staff/${member.slug}` },
  ];

  const salons = content.salons as unknown as Record<string, SalonContent>;
  const isEyelash = member.salon === "Raffine";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />

      {/* ヘッダー */}
      <div className="pt-14 sm:pt-16 bg-white border-b border-site-greige">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 sm:py-14">
          <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/staff" className="hover:text-site-accent transition-colors">スタッフ紹介</Link>
            <span className="mx-2">/</span>
            <span>{member.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
            {/* 写真 */}
            <div className="w-full sm:w-64 flex-shrink-0">
              {member.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.imageSrc}
                  alt={`${member.name}（${member.salon}・${member.role}）`}
                  className="w-full aspect-[3/4] object-cover"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-site-light flex items-center justify-center">
                  <span className="text-site-muted text-xs">[写真]</span>
                </div>
              )}
            </div>

            {/* プロフィール */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] tracking-[0.35em] text-site-accent uppercase">{member.salon}</span>
                <span className="w-px h-3 bg-site-greige" />
                <span className="text-[10px] text-site-muted tracking-wider">{member.role}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-light text-site-text mb-1">{member.name}</h1>
              {member.history && (
                <p className="text-sm text-site-muted tracking-wider mb-5">{member.history}</p>
              )}

              <p className="text-sm text-site-text leading-loose mb-6">{member.bio}</p>

              {/* 得意技術 */}
              {member.specialties && member.specialties.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-[0.35em] text-site-accent mb-2">得意技術</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((s) => (
                      <span key={s} className="text-xs text-site-text border border-site-greige px-3 py-1">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 得意スタイル */}
              {member.styles && member.styles.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-[0.35em] text-site-accent mb-2">得意スタイル</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.styles.map((s) => (
                      <span key={s} className="text-xs text-site-text border border-site-greige px-3 py-1">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 得意年代 */}
              {member.ageGroups && member.ageGroups.length > 0 && (
                <p className="text-xs text-site-muted mb-5">
                  <span className="text-site-accent">得意年代：</span>{member.ageGroups.join("・")}
                </p>
              )}

              {/* 資格 */}
              {member.qualifications && member.qualifications.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-[0.35em] text-site-accent mb-2">資格・認定</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.qualifications.map((q) => (
                      <span key={q} className="text-xs text-site-text border border-site-greige px-3 py-1">{q}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 受賞歴 */}
              {member.awards && member.awards.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] tracking-[0.35em] text-site-accent mb-2">受賞歴</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.awards.map((a) => (
                      <span key={a} className="text-xs text-site-text border border-site-greige px-3 py-1">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* SNS */}
              {member.instagramUrl && (
                <a
                  href={member.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name}のInstagram`}
                  className="inline-flex items-center gap-2 text-xs text-site-muted hover:text-site-accent transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* サロン案内 */}
      <section className="py-12 bg-site-light border-t border-site-greige">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <p className="text-[10px] tracking-[0.35em] text-site-accent mb-4 uppercase">Salon</p>
          <div className="flex items-center gap-4">
            <div>
              <Link href={salonUrl} className="font-serif text-lg text-site-text hover:text-site-accent transition-colors">
                {member.salon}
              </Link>
              <p className="text-xs text-site-muted mt-0.5">
                {member.salon === "fleurami" && "高知県香南市野市町西野230"}
                {member.salon === "Riv. by fleurami" && "高知県高知市南川添9-21"}
                {member.salon === "Raffine" && "高知県高知市はりまや町1-4-8 TNはりまやビル3F"}
              </p>
            </div>
            <Link
              href={salonUrl}
              className="ml-auto text-xs tracking-[0.2em] text-site-muted hover:text-site-accent transition-colors"
            >
              サロン詳細 →
            </Link>
          </div>
        </div>
      </section>

      {/* 施術ブログ */}
      <section className="py-12 bg-white border-t border-site-greige">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <p className="text-[10px] tracking-[0.35em] text-site-accent mb-6 uppercase">Works</p>
          <h2 className="font-serif text-2xl font-light text-site-text mb-3">施術ブログ</h2>
          <p className="text-sm text-site-muted mb-6">
            {member.name}が担当した施術の症例・ビフォーアフターをブログで公開しています。
          </p>
          <Link
            href={isEyelash ? "/blog/eyelash" : "/blog/hair"}
            className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-site-text hover:text-site-accent transition-colors group"
          >
            <span>{isEyelash ? "アイラッシュブログを見る" : "ヘアブログを見る"}</span>
            <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </section>

      {/* 予約 */}
      <section className="py-14 bg-site-light border-t border-site-greige">
        <div className="px-6 sm:px-10">
          <ReservationChannels
            salonOrder={[salonKey]}
            salons={salons}
            heading={`${member.name}へのご指名・ご予約`}
            note="ご予約時に担当者名をお申し付けください"
          />
        </div>
      </section>

      {/* 他スタッフへ */}
      <section className="py-10 bg-white border-t border-site-greige">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 text-center">
          <Link
            href="/staff"
            className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-site-muted hover:text-site-text transition-colors group"
          >
            <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
            <span>スタッフ一覧に戻る</span>
          </Link>
        </div>
      </section>
    </>
  );
}
