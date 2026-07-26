import Image from "next/image";
import Link from "next/link";
import type { StaffMember } from "@/lib/content";

export default function StaffPreview({ staff }: { staff: StaffMember[] }) {
  const shown = staff.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 sm:mb-14">
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

      {/* 横スクロール帯 */}
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth pl-6 sm:pl-10 lg:pl-16 pr-6 pb-4"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {shown.map((member) => (
          <Link
            key={member.slug ?? member.name}
            href={member.slug ? `/staff#${member.slug}` : "/staff"}
            className="group flex-none w-44 sm:w-52"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* 写真 3:4 */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-site-greige mb-3">
              {member.imageSrc ? (
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-3xl text-site-muted/40">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <p className="font-serif text-sm font-light text-site-text group-hover:text-site-accent transition-colors duration-200">
              {member.name}
            </p>
            <p className="text-[10px] text-site-muted mt-0.5">{member.role}</p>
            {member.history && (
              <p className="text-[9px] text-site-muted/70 mt-0.5">{member.history}</p>
            )}
          </Link>
        ))}

        {/* 全員を見るカード */}
        <Link
          href="/staff"
          className="group flex-none w-44 sm:w-52 flex flex-col items-center justify-center bg-site-bg border border-site-greige hover:border-site-accent/40 transition-colors duration-300 aspect-[3/4]"
          style={{ scrollSnapAlign: "start" }}
        >
          <span className="font-serif text-2xl text-site-muted/40 mb-3 group-hover:text-site-accent/50 transition-colors">→</span>
          <span className="text-[10px] tracking-[0.3em] text-site-muted group-hover:text-site-accent transition-colors">全員を見る</span>
        </Link>
      </div>
    </section>
  );
}
