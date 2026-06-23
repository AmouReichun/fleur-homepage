"use client";

import { useState } from "react";
import type { StaffMember } from "@/lib/content";

type Category = "all" | "hair" | "eyelash";
type Salon = "all" | "fleurami" | "Riv.by fleurami" | "Raffine";

const HAIR_SALONS: Salon[] = ["fleurami", "Riv.by fleurami"];
const EYELASH_SALONS: Salon[] = ["Raffine"];

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
  const [category, setCategory] = useState<Category>("all");
  const [salon, setSalon] = useState<Salon>("all");

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    setSalon("all");
  }

  // フィルタリング
  const filtered = staff.filter((m) => {
    if (category === "hair") {
      const inHair = HAIR_SALONS.includes(m.salon as Salon);
      if (!inHair) return false;
      return salon === "all" || m.salon === salon;
    }
    if (category === "eyelash") {
      return EYELASH_SALONS.includes(m.salon as Salon);
    }
    return true; // "all"
  });

  // 各タブの件数
  const countAll = staff.length;
  const countHair = staff.filter((m) => HAIR_SALONS.includes(m.salon as Salon)).length;
  const countEyelash = staff.filter((m) => EYELASH_SALONS.includes(m.salon as Salon)).length;
  const countSalon = (s: Salon) => staff.filter((m) => m.salon === s).length;

  // 上段タブ設定
  const categoryTabs = [
    { label: "すべて", value: "all" as Category, count: countAll },
    { label: "美容室", value: "hair" as Category, count: countHair },
    { label: "アイラッシュサロン", value: "eyelash" as Category, count: countEyelash },
  ];

  // 下段タブ（美容室選択時のみ）
  const salonSubTabs: { label: string; value: Salon }[] = [
    { label: "すべて", value: "all" },
    { label: "fleurami", value: "fleurami" },
    { label: "Riv.by fleurami", value: "Riv.by fleurami" },
  ];

  return (
    <div>
      {/* ─── 上段：業態タブ ─── */}
      <div className="border-b border-site-greige overflow-x-auto">
        <div className="flex min-w-max">
          {categoryTabs.map((tab) => (
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
              <span
                className={`ml-1.5 text-[9px] ${
                  category === tab.value ? "text-site-accent" : "text-site-muted/60"
                }`}
              >
                ({tab.count})
              </span>
              {category === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-site-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 下段：店舗タブ（美容室選択時） ─── */}
      {category === "hair" && (
        <div className="border-b border-site-greige/60 bg-site-bg overflow-x-auto">
          <div className="flex min-w-max px-2">
            {salonSubTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSalon(tab.value)}
                className={`relative px-4 sm:px-6 py-2.5 text-[11px] tracking-[0.18em] whitespace-nowrap transition-colors duration-200 ${
                  salon === tab.value
                    ? "text-site-accent"
                    : "text-site-muted hover:text-site-text"
                }`}
              >
                {tab.label}
                {tab.value !== "all" && (
                  <span className="ml-1 text-[9px] text-site-muted/60">
                    ({countSalon(tab.value)})
                  </span>
                )}
                {salon === tab.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-site-accent/60" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── 現在の絞り込みラベル ─── */}
      <div className="flex items-center gap-3 mt-10 mb-10">
        <div className="w-6 h-px bg-site-accent" />
        <p className="text-[10px] tracking-[0.35em] text-site-accent uppercase">
          {category === "all" && "すべてのスタッフ"}
          {category === "hair" && salon === "all" && "美容室スタッフ"}
          {category === "hair" && salon === "fleurami" && "fleurami スタッフ"}
          {category === "hair" && salon === "Riv.by fleurami" && "Riv.by fleurami スタッフ"}
          {category === "eyelash" && "アイラッシュサロン スタッフ"}
        </p>
        <span className="text-[10px] text-site-muted">— {filtered.length}名</span>
      </div>

      {/* ─── スタッフグリッド ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {filtered.map((member, i) => (
          <StaffCard key={`${member.name}-${i}`} member={member} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-site-muted text-sm py-16">
          スタッフ情報がありません
        </p>
      )}
    </div>
  );
}
