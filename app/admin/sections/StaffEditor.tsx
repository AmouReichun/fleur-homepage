"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import ImageUpload from "../components/ImageUpload";
import { TextField } from "../components/FormField";
import type { StaffMember } from "@/lib/content";
import Image from "next/image";

export default function StaffEditor({ initial }: { initial: StaffMember[] }) {
  const [data, setData] = useState<StaffMember[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  function update(i: number, field: keyof StaffMember, value: string) {
    const next = [...data];
    next[i] = { ...next[i], [field]: value };
    setData(next);
  }

  function add() {
    setData((prev) => [
      ...prev,
      { name: "", role: "スタイリスト", salon: "", bio: "", imageSrc: "" },
    ]);
  }

  function remove(i: number) {
    setData((prev) => prev.filter((_, idx) => idx !== i));
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
      <h2 className="text-2xl font-semibold text-[#2A2A2A] mb-8 text-center">スタッフ紹介</h2>
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        {data.map((member, i) => (
          <div key={i} className="border border-[#E8E4E0] overflow-hidden">
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
        {data.length === 0 && (
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
      <div className="space-y-5">
        {data.map((member, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#B8956A]">スタッフ {i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                削除
              </button>
            </div>
            <TextField label="名前" value={member.name} onChange={(v) => update(i, "name", v)} />
            <TextField label="役職" value={member.role} onChange={(v) => update(i, "role", v)} placeholder="スタイリスト / アイリスト" />
            <TextField label="サロン" value={member.salon} onChange={(v) => update(i, "salon", v)} placeholder="Riv.by fleurami" />
            <TextField label="紹介文" value={member.bio} onChange={(v) => update(i, "bio", v)} multiline rows={3} />
            <ImageUpload
              label="写真"
              value={member.imageSrc}
              onChange={(v) => update(i, "imageSrc", v)}
              section={`staff-${i}`}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm"
        >
          + スタッフを追加
        </button>
      </div>
    </SectionLayout>
  );
}
