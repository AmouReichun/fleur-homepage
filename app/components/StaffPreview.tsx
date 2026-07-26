import Image from "next/image";
import Link from "next/link";
import type { StaffMember } from "@/lib/content";

const STRUCTURE = [
  {
    categoryLabel: "美容室",
    en: "Hair Salon",
    salons: [
      { label: "fleur ami", salonKey: "fleurami" },
      { label: "Riv. by fleur ami", salonKey: "Riv. by fleurami" },
    ],
  },
  {
    categoryLabel: "アイラッシュサロン",
    en: "Eyelash Salon",
    salons: [
      { label: "Raffine", salonKey: "Raffine" },
    ],
  },
];

function StaffRow({ members, salonLabel }: { members: StaffMember[]; salonLabel: string }) {
  if (members.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-[11px] tracking-[0.25em] text-site-text font-medium">{salonLabel}</span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>

      <div
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {members.map((member) => (
          <Link
            key={member.slug ?? member.name}
            href={member.slug ? `/staff#${member.slug}` : "/staff"}
            className="group flex-none w-36 sm:w-44"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-site-greige mb-2">
              {member.imageSrc ? (
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-2xl text-site-muted/40">{member.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <p className="font-serif text-sm font-light text-site-text group-hover:text-site-accent transition-colors">
              {member.name}
            </p>
            <p className="text-[10px] text-site-muted mt-0.5">{member.role}</p>
            {member.history && (
              <p className="text-[9px] text-site-muted/60 mt-0.5">{member.history}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StaffPreview({ staff }: { staff: StaffMember[] }) {
  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* セクションヘッダー */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Staff</span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-site-text">スタッフ紹介</h2>
            <Link
              href="/staff"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] text-site-muted hover:text-site-accent transition-colors duration-200 group shrink-0"
            >
              <span>全員を見る</span>
              <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* 大分類ごとのブロック */}
        <div className="space-y-14 sm:space-y-20">
          {STRUCTURE.map((group) => {
            const salonSections = group.salons
              .map((s) => ({
                label: s.label,
                members: staff.filter((m) => m.salon === s.salonKey),
              }))
              .filter((s) => s.members.length > 0);
            if (salonSections.length === 0) return null;

            return (
              <div key={group.categoryLabel}>
                {/* 大分類ラベル */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-site-accent" />
                    <span className="font-serif text-xl sm:text-2xl font-light text-site-text">{group.categoryLabel}</span>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-site-muted uppercase">{group.en}</span>
                  <div className="flex-1 h-px bg-site-greige" />
                </div>

                {/* 店舗ごとの横スクロール列 */}
                <div className="space-y-10">
                  {salonSections.map((s) => (
                    <StaffRow key={s.label} members={s.members} salonLabel={s.label} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
