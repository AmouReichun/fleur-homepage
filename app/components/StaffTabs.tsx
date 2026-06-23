"use client";

import { useState } from "react";
import type { StaffMember } from "@/lib/content";

const SALON_TABS = [
  { label: "fleurami", value: "fleurami" },
  { label: "Riv.by fleurami", value: "Riv.by fleurami" },
  { label: "Raffine", value: "Raffine" },
] as const;

type SalonValue = typeof SALON_TABS[number]["value"];

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
  const [activeSalon, setActiveSalon] = useState<SalonValue>("fleurami");

  const filtered = staff.filter((m) => m.salon === activeSalon);

  return (
    <div>
      {/* 店舗タブ */}
      <div className="border-b border-site-greige overflow-x-auto">
        <div className="flex min-w-max">
          {SALON_TABS.map((tab) => {
            const count = staff.filter((m) => m.salon === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveSalon(tab.value)}
                className={`relative px-5 sm:px-8 py-4 text-xs tracking-[0.2em] whitespace-nowrap transition-colors duration-200 ${
                  activeSalon === tab.value
                    ? "text-site-text font-medium"
                    : "text-site-muted hover:text-site-text"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-[9px] ${activeSalon === tab.value ? "text-site-accent" : "text-site-muted/60"}`}>
                  ({count})
                </span>
                {activeSalon === tab.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-site-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 絞り込みラベル */}
      <div className="flex items-center gap-3 mt-10 mb-10">
        <div className="w-6 h-px bg-site-accent" />
        <p className="text-[10px] tracking-[0.35em] text-site-accent uppercase">
          {activeSalon} スタッフ
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
