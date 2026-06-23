"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import { TextField, StringListField } from "../components/FormField";
import type { RecruitPosition } from "@/lib/content";

interface RecruitData {
  headline: string;
  description: string;
  benefits: string[];
  positions: RecruitPosition[];
}

export default function RecruitEditor({ initial }: { initial: RecruitData }) {
  const [data, setData] = useState<RecruitData>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  function updatePosition(i: number, field: keyof RecruitPosition, value: string) {
    const next = [...data.positions];
    next[i] = { ...next[i], [field]: value };
    setData((prev) => ({ ...prev, positions: next }));
  }

  function addPosition() {
    setData((prev) => ({
      ...prev,
      positions: [...prev.positions, { title: "", salon: "", description: "" }],
    }));
  }

  function removePosition(i: number) {
    setData((prev) => ({
      ...prev,
      positions: prev.positions.filter((_, idx) => idx !== i),
    }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("recruit", JSON.stringify(data));
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

  const preview = (
    <div>
      <div className="bg-[#2A2A2A] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-4 uppercase">Recruit</p>
          <h1 className="text-2xl font-semibold mb-4">
            {data.headline || "（ヘッドライン）"}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">
            {data.description || "（説明文）"}
          </p>
        </div>
      </div>
      <div className="py-10 bg-[#FAFAF8] px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-[#2A2A2A] mb-4">待遇・福利厚生</p>
          <ul className="space-y-2 mb-8">
            {data.benefits.map((b, i) => (
              <li key={i} className="text-sm text-[#888] flex items-start gap-2">
                <span className="text-[#B8956A]">✓</span>{b}
              </li>
            ))}
          </ul>
          <p className="text-sm font-semibold text-[#2A2A2A] mb-4">募集職種</p>
          <div className="space-y-4">
            {data.positions.map((pos, i) => (
              <div key={i} className="border border-[#E8E4E0] p-5">
                <p className="font-semibold text-[#2A2A2A] mb-1">{pos.title || "（職種）"}</p>
                <p className="text-xs text-[#B8956A] mb-2">{pos.salon}</p>
                <p className="text-sm text-[#888]">{pos.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SectionLayout
      title="採用情報"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      <TextField
        label="ヘッドライン"
        value={data.headline}
        onChange={(v) => setData((p) => ({ ...p, headline: v }))}
        multiline
        rows={2}
      />
      <TextField
        label="説明文"
        value={data.description}
        onChange={(v) => setData((p) => ({ ...p, description: v }))}
        multiline
        rows={4}
      />
      <StringListField
        label="待遇・福利厚生"
        values={data.benefits}
        onChange={(v) => setData((p) => ({ ...p, benefits: v }))}
        placeholder="例: 完全週休2日制"
      />

      <div className="border-t border-[#333] pt-4 mt-2">
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">募集職種</p>
        <div className="space-y-4">
          {data.positions.map((pos, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-[#B8956A]">職種 {i + 1}</span>
                <button
                  type="button"
                  onClick={() => removePosition(i)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  削除
                </button>
              </div>
              <TextField label="職種名" value={pos.title} onChange={(v) => updatePosition(i, "title", v)} />
              <TextField label="対象サロン" value={pos.salon} onChange={(v) => updatePosition(i, "salon", v)} />
              <TextField label="説明" value={pos.description} onChange={(v) => updatePosition(i, "description", v)} multiline rows={2} />
            </div>
          ))}
          <button
            type="button"
            onClick={addPosition}
            className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm"
          >
            + 職種を追加
          </button>
        </div>
      </div>
    </SectionLayout>
  );
}
