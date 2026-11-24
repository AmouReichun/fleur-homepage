"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import type { FaqItem, SalonContent } from "@/lib/content";

export default function FaqEditor({
  initial,
  salons,
  salonOrder,
}: {
  initial: FaqItem[];
  salons: Record<string, SalonContent>;
  salonOrder: string[];
}) {
  const SALON_OPTIONS = salonOrder.map((k) => ({ key: k, label: salons[k]?.name ?? k }));
  const [data, setData] = useState<FaqItem[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  function update(i: number, field: keyof FaqItem, value: string) {
    const next = [...data];
    next[i] = { ...next[i], [field]: value };
    setData(next);
  }

  function add() { setData((prev) => [...prev, { q: "", a: "", salon: SALON_OPTIONS[0]?.key ?? "" }]); }
  function remove(i: number) { setData((prev) => prev.filter((_, idx) => idx !== i)); }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("topFaq", JSON.stringify(data));
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
    <SectionLayout title="よくある質問（トップページ）" previewPath={"/#faq"} onSave={handleSave} saving={isPending} saveStatus={saveStatus} saveError={saveError}>
      <p className="text-xs text-[#888] mb-4">各質問にサロンを紐付けると、トップページでサロン別にグループ表示されます。</p>
      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="bg-white border border-[#E0DCD8] rounded-lg overflow-hidden">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F6F4] border-b border-[#E8E4E0]">
              <span className="text-[11px] font-semibold text-[#B8956A]">質問 {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">削除</button>
            </div>

            <div className="p-4 space-y-3">
              {/* サロン選択 */}
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1.5">サロン</label>
                <div className="flex flex-wrap gap-1.5">
                  {SALON_OPTIONS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => update(i, "salon", s.key)}
                      className={`px-3 py-1 text-[11px] rounded-full border transition-colors ${
                        item.salon === s.key
                          ? "bg-[#B8956A] border-[#B8956A] text-white"
                          : "border-[#D0CCC8] text-[#555] hover:border-[#B8956A] hover:text-[#B8956A]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => update(i, "salon", "")}
                    className={`px-3 py-1 text-[11px] rounded-full border transition-colors ${
                      !item.salon
                        ? "bg-[#888] border-[#888] text-white"
                        : "border-[#D0CCC8] text-[#999] hover:border-[#888]"
                    }`}
                  >
                    共通
                  </button>
                </div>
              </div>

              <textarea
                value={item.q}
                onChange={(e) => update(i, "q", e.target.value)}
                rows={2}
                placeholder="例：高知市で髪質改善が得意な美容室はどこですか？"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all resize-none"
              />
              <textarea
                value={item.a}
                onChange={(e) => update(i, "a", e.target.value)}
                rows={3}
                placeholder="回答を入力してください"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all resize-y"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={add} className="w-full text-sm text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors py-2.5 border-2 border-dashed border-[#D0CCC8] rounded-lg hover:border-[#B8956A]">
          ＋ 質問を追加する
        </button>
      </div>
    </SectionLayout>
  );
}
