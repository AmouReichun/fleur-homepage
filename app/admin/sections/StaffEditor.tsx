"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import ImageUpload from "../components/ImageUpload";
import { TextField, StringListField } from "../components/FormField";
import type { StaffMember, SalonContent } from "@/lib/content";

export default function StaffEditor({
  initial,
  salons,
  salonOrder,
}: {
  initial: StaffMember[];
  salons: Record<string, SalonContent>;
  salonOrder: string[];
}) {
  const [data, setData] = useState<StaffMember[]>(initial);
  // タブは「スタッフの実際の所属(salon)」で絞り込む。公開ページ(StaffTabs)と同じ基準。
  // salons[].name（表示名）はデータの salon 値とズレることがあるため、ここでは使わない。
  const salonValues = Array.from(new Set(data.map((m) => m.salon).filter(Boolean)));
  const SALON_TABS = (salonValues.length > 0 ? salonValues : salonOrder.map((k) => salons[k]?.name ?? k)).map(
    (v) => ({ label: v, value: v })
  );
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

  function updateArr(globalIdx: number, field: keyof StaffMember, value: string[]) {
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

  function toggleHidden(globalIdx: number) {
    const next = [...data];
    next[globalIdx] = { ...next[globalIdx], hidden: !next[globalIdx].hidden };
    setData(next);
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
      try {
        const res = await saveContent("staff", JSON.stringify(data));
        if (res.success) {
          setSaveStatus("success");
          setSaveError("");
          setTimeout(() => setSaveStatus("idle"), 3000);
        } else {
          setSaveStatus("error");
          setSaveError(res.error ?? "不明なエラー");
        }
      } catch (e) {
        setSaveStatus("error");
        setSaveError(e instanceof Error ? e.message : "保存に失敗しました");
      }
    });
  }

  return (
    <SectionLayout
      title="スタッフ紹介"
      previewPath={"/staff"}
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
          <div
            key={index}
            className={`bg-[#1a1a1a] border rounded-sm p-4 space-y-3 ${
              member.hidden ? "border-[#555] opacity-60" : "border-[#333]"
            }`}
          >
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
              <span className="text-xs text-[#B8956A]">スタッフ {pos + 1}</span>
              {member.hidden && (
                <span className="text-[10px] text-gray-400 border border-[#555] rounded-full px-2 py-0.5">
                  非表示中
                </span>
              )}
              <span className="flex-1" />
              <button
                type="button"
                onClick={() => toggleHidden(index)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                {member.hidden ? "表示する" : "非表示にする"}
              </button>
              <span className="text-[#444]">|</span>
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
            <TextField label="サロン" value={member.salon} onChange={(v) => update(index, "salon", v)} placeholder="Riv. by fleurami" />
            <TextField label="経歴" value={member.history ?? ""} onChange={(v) => update(index, "history", v)} placeholder="例: 経験15年" />
            <TextField label="紹介文" value={member.bio} onChange={(v) => update(index, "bio", v)} multiline rows={3} />
            <TextField label="Instagram URL" value={member.instagramUrl ?? ""} onChange={(v) => update(index, "instagramUrl", v)} placeholder="https://www.instagram.com/..." />
            <StringListField label="得意技術" values={member.specialties ?? []} onChange={(v) => updateArr(index, "specialties", v)} placeholder="例: 髪質改善" />
            <StringListField label="得意年代" values={member.ageGroups ?? []} onChange={(v) => updateArr(index, "ageGroups", v)} placeholder="例: 30代" />
            <StringListField label="得意スタイル" values={member.styles ?? []} onChange={(v) => updateArr(index, "styles", v)} placeholder="例: ショートボブ" />
            <StringListField label="資格・認定" values={member.qualifications ?? []} onChange={(v) => updateArr(index, "qualifications", v)} placeholder="例: 美容師免許 / ヘアカラーリスト認定" />
            <StringListField label="受賞歴" values={member.awards ?? []} onChange={(v) => updateArr(index, "awards", v)} placeholder="例: ブリーチ部門 高知地区1位" />
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
