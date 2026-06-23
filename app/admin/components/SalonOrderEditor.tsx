"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveSalonOrder } from "../actions";

interface SalonEntry { key: string; name: string; area: string; salonType: string }

const SALON_INFO: Record<string, { name: string; area: string; href: string }> = {
  riv: { name: "Riv.by fleurami", area: "高知市", href: "/admin/salon/riv" },
  fleurami: { name: "fleurami", area: "香南市", href: "/admin/salon/fleurami" },
  raffine: { name: "Raffine", area: "高知市 はりまや橋", href: "/admin/salon/raffine" },
};

export default function SalonOrderEditor({
  initialOrder,
  salonTypes,
}: {
  initialOrder: string[];
  salonTypes: Record<string, string>;
}) {
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const salons: SalonEntry[] = order.map((key) => ({
    key,
    name: SALON_INFO[key]?.name ?? key,
    area: SALON_INFO[key]?.area ?? "",
    salonType: salonTypes[key] ?? "",
  }));

  const groups: Record<string, SalonEntry[]> = {};
  for (const s of salons) {
    if (!groups[s.salonType]) groups[s.salonType] = [];
    groups[s.salonType].push(s);
  }

  function move(key: string, dir: -1 | 1) {
    const i = order.indexOf(key);
    const next = [...order];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setOrder(next);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveSalonOrder(order);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    });
  }

  const typeConfig: Record<string, { label: string; color: string; dot: string }> = {
    "美容室": { label: "美容室", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "💇" },
    "アイラッシュサロン": { label: "アイラッシュサロン", color: "text-pink-600 bg-pink-50 border-pink-200", dot: "✨" },
  };

  return (
    <div className="bg-white border border-[#E8E4E0] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4E0] bg-[#FAF8F5]">
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">店舗の表示順を変更</p>
          <p className="text-xs text-[#888] mt-0.5">▲▼ で並べ替えて「保存する」を押すとサイトに反映されます</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">✓ 保存しました</span>}
          {saveStatus === "error" && <span className="text-xs text-red-500">失敗しました</span>}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-[#B8956A] text-white text-xs px-5 py-2.5 rounded-lg hover:bg-[#A07850] transition-all disabled:opacity-50 font-medium"
          >
            {isPending ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {["美容室", "アイラッシュサロン"].map((type) => {
          const group = groups[type];
          if (!group?.length) return null;
          const cfg = typeConfig[type];
          return (
            <div key={type}>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${cfg.color}`}>
                {cfg.dot} {cfg.label}
              </span>
              <div className="space-y-2">
                {group.map((salon) => {
                  const i = order.indexOf(salon.key);
                  return (
                    <div key={salon.key} className="flex items-center gap-3 bg-[#F8F6F3] border border-[#E8E4E0] px-4 py-3 rounded-lg">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => move(salon.key, -1)}
                          disabled={i === 0}
                          className="w-6 h-6 flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-white rounded disabled:opacity-20 transition-all text-xs"
                        >▲</button>
                        <button
                          type="button"
                          onClick={() => move(salon.key, 1)}
                          disabled={i === order.length - 1}
                          className="w-6 h-6 flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-white rounded disabled:opacity-20 transition-all text-xs"
                        >▼</button>
                      </div>
                      <span className="text-lg font-bold text-[#D0CCC8] w-5 text-center">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#1A1A1A]">{salon.name}</p>
                        <p className="text-xs text-[#888]">{salon.area}</p>
                      </div>
                      <Link href={SALON_INFO[salon.key]?.href ?? "#"} className="text-xs text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors">
                        編集する →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
