"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import type { PopularMenu } from "@/lib/content";

export default function PopularMenuEditor({ initial }: { initial: PopularMenu[] }) {
  const [items, setItems] = useState<PopularMenu[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  function update(i: number, field: keyof PopularMenu, value: string) {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  function add() {
    setItems((prev) => [...prev, { name: "", desc: "", salon: "", category: "hair" }]);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("popularMenus", JSON.stringify(items));
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

  const hairItems = items.filter((m) => m.category === "hair");
  const eyelashItems = items.filter((m) => m.category === "eyelash");

  const preview = (
    <div className="bg-[#FAFAF8] py-8 px-4">
      <p className="text-[9px] tracking-[0.4em] text-[#B8956A] uppercase mb-1 text-center">02. Menu</p>
      <h2 className="text-lg font-semibold text-[#2A2A2A] mb-6 text-center">人気メニュー</h2>

      {hairItems.length > 0 && (
        <div className="mb-6 max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] tracking-[0.3em] text-[#999] uppercase">Hair Salon</span>
            <div className="flex-1 h-px bg-[#E8E4E0]" />
          </div>
          {hairItems.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-[#E8E4E0]">
              <span className="text-[10px] text-[#B8956A] font-mono pt-0.5 flex-shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-[#2A2A2A]">{item.name || "（名前未入力）"}</p>
                <p className="text-[11px] text-[#888] mt-0.5">{item.desc}</p>
                <p className="text-[10px] text-[#B8956A] mt-1">{item.salon}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {eyelashItems.length > 0 && (
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] tracking-[0.3em] text-[#999] uppercase">Eyelash Salon</span>
            <div className="flex-1 h-px bg-[#E8E4E0]" />
          </div>
          {eyelashItems.map((item, i) => (
            <div key={i} className="flex items-start gap-4 py-3 border-b border-[#E8E4E0]">
              <span className="text-[10px] text-[#B8956A] font-mono pt-0.5 flex-shrink-0 w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium text-[#2A2A2A]">{item.name || "（名前未入力）"}</p>
                <p className="text-[11px] text-[#888] mt-0.5">{item.desc}</p>
                <p className="text-[10px] text-[#B8956A] mt-1">{item.salon}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p className="text-center text-[#888] text-xs py-6">メニューがありません</p>
      )}
    </div>
  );

  return (
    <SectionLayout
      title="人気メニュー（トップページ）"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      <p className="text-xs text-[#888] mb-4 leading-relaxed">
        トップページの「02. Menu 人気メニュー」に表示される項目です。順番・内容を自由に編集できます。
      </p>

      <div className="space-y-2.5">
        {items.map((item, i) => (
          <div key={i} className="bg-white border border-[#E0DCD8] rounded-xl overflow-hidden">
            {/* ヘッダー行 */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8F6F4] border-b border-[#E8E4E0]">
              <span className="text-[11px] font-semibold text-[#B8956A]">
                {String(i + 1).padStart(2, "0")} — {item.name || "（名前未入力）"}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-[11px] px-2 py-1 border border-[#D0CCC8] rounded hover:bg-[#EDE9E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >▲</button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                  className="text-[11px] px-2 py-1 border border-[#D0CCC8] rounded hover:bg-[#EDE9E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >▼</button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="text-[11px] px-2 py-1 border border-red-200 text-red-400 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                >削除</button>
              </div>
            </div>

            {/* 入力フィールド */}
            <div className="p-4 space-y-3">
              {/* カテゴリトグル */}
              <div>
                <label className="block text-[11px] font-medium text-[#555] mb-1.5">カテゴリ</label>
                <div className="inline-flex rounded-lg overflow-hidden border border-[#D0CCC8]">
                  <button
                    type="button"
                    onClick={() => update(i, "category", "hair")}
                    className={`px-4 py-1.5 text-[11px] font-medium transition-colors ${
                      (item.category ?? "hair") === "hair"
                        ? "bg-[#B8956A] text-white"
                        : "bg-[#FAFAF8] text-[#555] hover:bg-[#EDE9E4]"
                    }`}
                  >
                    💇 美容室
                  </button>
                  <button
                    type="button"
                    onClick={() => update(i, "category", "eyelash")}
                    className={`px-4 py-1.5 text-[11px] font-medium border-l border-[#D0CCC8] transition-colors ${
                      item.category === "eyelash"
                        ? "bg-pink-400 text-white"
                        : "bg-[#FAFAF8] text-[#555] hover:bg-[#EDE9E4]"
                    }`}
                  >
                    ✨ アイラッシュ
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">メニュー名</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => update(i, "name", e.target.value)}
                    placeholder="例: 髪質改善"
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">説明文</label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => update(i, "desc", e.target.value)}
                    placeholder="例: ダメージを補修し扱いやすい髪へ"
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">対応サロン</label>
                  <input
                    type="text"
                    value={item.salon}
                    onChange={(e) => update(i, "salon", e.target.value)}
                    placeholder="例: Riv / fleurami"
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="w-full text-sm text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors py-3 border-2 border-dashed border-[#D0CCC8] rounded-xl hover:border-[#B8956A]"
        >
          ＋ メニューを追加する
        </button>
      </div>
    </SectionLayout>
  );
}
