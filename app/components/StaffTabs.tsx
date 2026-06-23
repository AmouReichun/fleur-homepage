"use client";

import { useState } from "react";
import type { StaffMember } from "@/lib/content";

type Category = "hair" | "eyelash";
type HairSalon = "fleurami" | "Riv.by fleurami";

const HAIR_SALONS: HairSalon[] = ["fleurami", "Riv.by fleurami"];
const EYELASH_SALONS = ["Raffine"];

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="group">
      <div className="overflow-hidden bg-site-light mb-4 aspect-[3/4]">
        {member.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.imageSrc}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-site-muted text-xs tracking-wider">[スタッフ写真]</span>
          </div>
        )}
      </div>
      <div className="px-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] tracking-[0.25em] text-site-accent uppercase">
            {member.salon}
          </span>
          <span className="w-px h-3 bg-site-greige" />
          <span className="text-[10px] text-site-muted tracking-wider">{member.role}</span>
        </div>
        <h3 className="font-serif text-xl font-light mb-1">{member.name}</h3>
        {member.history && (
          <p className="text-[10px] text-site-muted tracking-wider mb-3">{member.history}</p>
        )}
        <p className="text-xs text-site-muted leading-loose">{member.bio}</p>
      </div>
    </div>
  );
}

export default function StaffTabs({ staff }: { staff: StaffMember[] }) {
  const [category, setCategory] = useState<Category>("hair");
  const [hairSalon, setHairSalon] = useState<HairSalon>("fleurami");

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
  }

  const filtered = staff.filter((m) => {
    if (category === "hair") {
      return m.salon === hairSalon;
    }
    return EYELASH_SALONS.includes(m.salon);
  });

  const countHair = staff.filter((m) => HAIR_SALONS.includes(m.salon as HairSalon)).length;
  const countEyelash = staff.filter((m) => EYELASH_SALONS.includes(m.salon)).length;

  return (
    <div>
      {/* 上段：業態タブ（すべてなし） */}
      <div className="border-b border-site-greige overflow-x-auto">
        <div className="flex min-w-max">
          {([
            { label: "美容室", value: "hair" as Category, count: countHair },
            { label: "アイラッシュサロン", value: "eyelash" as Category, count: countEyelash },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleCategoryChange(tab.value)}
              className={`relative px-5 sm:px-8 py-4 text-xs tracking-[0.2em] whitespace-nowrap transition-colors duration-200 ${
                category === tab.value
                  ? "text-site-text font-medium"
                  : "text-site-muted hover:text-site-text"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[9px] ${category === tab.value ? "text-site-accent" : "text-site-muted/60"}`}>
                ({tab.count})
              </span>
              {category === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-site-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 下段：美容室の店舗タブ（すべてなし） */}
      {category === "hair" && (
        <div className="border-b border-site-greige/60 bg-site-bg overflow-x-auto">
          <div className="flex min-w-max px-2">
            {HAIR_SALONS.map((s) => (
              <button
                key={s}
                onClick={() => setHairSalon(s)}
                className={`relative px-4 sm:px-6 py-2.5 text-[11px] tracking-[0.18em] whitespace-nowrap transition-colors duration-200 ${
                  hairSalon === s
                    ? "text-site-accent"
                    : "text-site-muted hover:text-site-text"
                }`}
              >
                {s}
                <span className="ml-1 text-[9px] text-site-muted/60">
                  ({staff.filter((m) => m.salon === s).length})
                </span>
                {hairSalon === s && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-site-accent/60" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 絞り込みラベル */}
      <div className="flex items-center gap-3 mt-10 mb-10">
        <div className="w-6 h-px bg-site-accent" />
        <p className="text-[10px] tracking-[0.35em] text-site-accent uppercase">
          {category === "hair" ? `${hairSalon} スタッフ` : "Raffine スタッフ"}
        </p>
        <span className="text-[10px] text-site-muted">— {filtered.length}名</span>
      </div>

      {/* スタッフグリッド */}
      {filtered.length === 0 ? (
        <p className="text-center text-site-muted text-sm py-16">スタッフ情報がありません</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((member, i) => (
            <StaffCard key={`${member.name}-${i}`} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
