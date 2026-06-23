"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import ImageUpload from "../components/ImageUpload";
import { TextField } from "../components/FormField";
import type { StaffMember, SalonContent } from "@/lib/content";
import Image from "next/image";

export default function StaffEditor({
  initial,
  salons,
  salonOrder,
}: {
  initial: StaffMember[];
  salons: Record<string, SalonContent>;
  salonOrder: string[];
}) {
  const SALON_TABS = salonOrder.map((k) => ({ label: salons[k]?.name ?? k, value: salons[k]?.name ?? k }));
  const [data, setData] = useState<StaffMember[]>(initial);
  const [activeTab, setActiveTab] = useState<string>(SALON_TABS[0]?.value ?? "");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  // 現在タブの staff と全体インデックスのペア
  const tabEntries = data
    .map((member, index) => ({ member, index }))
    .filter(({ member }) => member.salon === activeTab);

  function update(globalIdx: number, field: keyof StaffMember, value: string) {
    const next = [...data];
    next[globalIdx] = { ...next[globalIdx], [field]: value };
    setData(next);
  }

  function add() {
    setData((prev) => [
      ...prev,
      { name: "", role: "スタイリスト", salon: activeTab, bio: "", imageSrc: "" },
    ]);
  }

  function remove(globalIdx: number) {
    setData((prev) => prev.filter((_, idx) => idx !== globalIdx));
  }

  // タブ内での順番入れ替え（全体配列の該当2要素をスワップ）
  function move(globalIdx: number, direction: -1 | 1) {
    const pos = tabEntries.findIndex((e) => e.index === globalIdx);
    const targetPos = pos + direction;
    if (targetPos < 0 || targetPos >= tabEntries.length) return;
    const targetGlobalIdx = tabEntries[targetPos].index;
    const next = [...data];
    [next[globalIdx], next[targetGlobalIdx]] = [next[targetGlobalIdx], next[globalIdx]];
    setData(next);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveContent("staff", data);
      if (res.success) {
        setSaveStatus("success");
        setSaveError("");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setSaveError(res.error ?? "不明なエラー");
      }
    });
  }

  const preview = (
    <div className="py-12 px-4">
      <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-2 uppercase text-center">Staff</p>
      <h2 className="text-2xl font-semibold text-[#2A2A2A] mb-2 text-center">スタッフ紹介</h2>
      <p className="text-xs text-[#888] text-center mb-6">{activeTab}</p>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        {tabEntries.map(({ member, index }) => (
          <div key={index} className="border border-[#E8E4E0] overflow-hidden">
            {member.imageSrc ? (
              <div className="relative h-40 w-full">
                <Image src={member.imageSrc} alt={member.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="bg-[#F5F0EA] h-40 flex items-center justify-center">
                <span className="text-[#888] text-xs">[写真]</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-[#F5F0EA] text-[#2A2A2A] px-2 py-0.5 rounded-full">
                  {member.salon || "サロン"}
                </span>
                <span className="text-xs text-[#888]">{member.role || "役職"}</span>
              </div>
              <p className="text-sm font-semibold mb-1">{member.name || "（名前）"}</p>
              <p className="text-xs text-[#888] leading-relaxed">{member.bio || "（紹介文）"}</p>
            </div>
          </div>
        ))}
        {tabEntries.length === 0 && (
          <p className="text-sm text-[#888] col-span-2 text-center">スタッフがいません</p>
        )}
      </div>
    </div>
  );

  return (
    <SectionLayout
      title="スタッフ紹介"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      {/* 店舗タブ */}
      <div className="flex border-b border-[#333] -mx-6 px-6 mb-5">
        {SALON_TABS.map((tab) => {
          const count = data.filter((m) => m.salon === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`text-xs px-4 py-2.5 transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? "text-[#B8956A] border-b-2 border-[#B8956A] -mb-px"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              <span className="ml-1 text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* スタッフカード一覧 */}
      <div className="space-y-5">
        {tabEntries.map(({ member, index }, pos) => (
          <div key={index} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-3">
            {/* ヘッダー行 */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={pos === 0}
                  className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1 py-0.5"
                >▲</button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={pos === tabEntries.length - 1}
                  className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1 py-0.5"
                >▼</button>
              </div>
              <span className="text-xs text-[#B8956A] flex-1">スタッフ {pos + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                削除
              </button>
            </div>

            <TextField label="名前" value={member.name} onChange={(v) => update(index, "name", v)} />
            <TextField label="役職" value={member.role} onChange={(v) => update(index, "role", v)} placeholder="スタイリスト / アイリスト" />
            <TextField label="サロン" value={member.salon} onChange={(v) => update(index, "salon", v)} placeholder="Riv.by fleurami" />
            <TextField label="経歴" value={member.history ?? ""} onChange={(v) => update(index, "history", v)} placeholder="例: 経験15年" />
            <TextField label="紹介文" value={member.bio} onChange={(v) => update(index, "bio", v)} multiline rows={3} />
            <ImageUpload
              label="写真"
              value={member.imageSrc}
              onChange={(v) => update(index, "imageSrc", v)}
              section={`staff-${index}`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm"
        >
          + {activeTab} にスタッフを追加
        </button>
      </div>
    </SectionLayout>
  );
}
