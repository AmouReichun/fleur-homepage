"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import type { MenuCategory, MenuItem } from "@/lib/content";

interface MenuEditorData {
  riv: MenuCategory[];
  fleurami: MenuCategory[];
  raffine: MenuCategory[];
}

type SalonTab = "riv" | "fleurami" | "raffine";

const salonLabels: Record<SalonTab, string> = {
  riv: "Riv.by fleurami",
  fleurami: "fleurami",
  raffine: "Raffine",
};

export default function MenuEditor({ initial }: { initial: MenuEditorData }) {
  const [data, setData] = useState<MenuEditorData>(initial);
  const [activeTab, setActiveTab] = useState<SalonTab>("riv");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  const categories = data[activeTab];

  function updateCategories(cats: MenuCategory[]) {
    setData((prev) => ({ ...prev, [activeTab]: cats }));
  }

  function addCategory() {
    updateCategories([...categories, { category: "", items: [] }]);
  }

  function removeCategory(i: number) {
    updateCategories(categories.filter((_, idx) => idx !== i));
  }

  function moveCategory(i: number, direction: -1 | 1) {
    const next = [...categories];
    const target = i + direction;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    updateCategories(next);
  }

  function updateCategoryName(i: number, name: string) {
    const next = [...categories];
    next[i] = { ...next[i], category: name };
    updateCategories(next);
  }

  function addItem(catIndex: number) {
    const next = [...categories];
    next[catIndex] = {
      ...next[catIndex],
      items: [...next[catIndex].items, { name: "", price: "", desc: "" }],
    };
    updateCategories(next);
  }

  function removeItem(catIndex: number, itemIndex: number) {
    const next = [...categories];
    next[catIndex] = {
      ...next[catIndex],
      items: next[catIndex].items.filter((_, idx) => idx !== itemIndex),
    };
    updateCategories(next);
  }

  function updateItem(catIndex: number, itemIndex: number, field: keyof MenuItem, value: string) {
    const next = [...categories];
    const items = [...next[catIndex].items];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    next[catIndex] = { ...next[catIndex], items };
    updateCategories(next);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveContent("menus", data);
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
    <div className="p-6">
      <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-1 uppercase">
        {salonLabels[activeTab]}
      </p>
      <h2 className="text-xl font-semibold text-[#2A2A2A] mb-6">メニュー</h2>
      {categories.map((cat, i) => (
        <div key={i} className="mb-6">
          <p className="text-sm font-semibold text-[#2A2A2A] mb-3 border-b border-[#E8E4E0] pb-2">
            {cat.category || "（カテゴリー）"}
          </p>
          <div className="space-y-2">
            {cat.items.map((item, j) => (
              <div
                key={j}
                className="bg-[#FAFAF8] border border-[#E8E4E0] p-4 flex justify-between items-start gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#2A2A2A]">{item.name || "（名前）"}</p>
                  {item.desc && (
                    <p className="text-xs text-[#888]">{item.desc}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-[#B8956A] whitespace-nowrap">
                  {item.price || "—"}
                </p>
              </div>
            ))}
            {cat.items.length === 0 && (
              <p className="text-xs text-[#888] italic">（メニューなし）</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <SectionLayout
      title="メニュー編集"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      {/* Salon tabs */}
      <div className="flex border-b border-[#333] -mx-6 px-6 mb-4">
        {(["riv", "fleurami", "raffine"] as SalonTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`text-xs px-4 py-2.5 transition-colors ${
              activeTab === tab
                ? "text-[#B8956A] border-b-2 border-[#B8956A] -mb-px"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {salonLabels[tab]}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, -1)}
                  disabled={catIdx === 0}
                  className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1 py-0.5"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveCategory(catIdx, 1)}
                  disabled={catIdx === categories.length - 1}
                  className="text-[10px] text-gray-400 hover:text-white disabled:opacity-20 leading-none px-1 py-0.5"
                >
                  ▼
                </button>
              </div>
              <input
                type="text"
                value={cat.category}
                onChange={(e) => updateCategoryName(catIdx, e.target.value)}
                placeholder="カテゴリー名"
                className="flex-1 bg-[#242424] border border-[#444] text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[#B8956A] transition-colors"
              />
              <button
                type="button"
                onClick={() => removeCategory(catIdx)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              >
                削除
              </button>
            </div>

            <div className="space-y-2 mb-3">
              {cat.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(catIdx, itemIdx, "name", e.target.value)}
                    placeholder="メニュー名"
                    className="bg-[#242424] border border-[#444] text-white text-xs px-2.5 py-2 rounded-sm focus:outline-none focus:border-[#B8956A]"
                  />
                  <input
                    type="text"
                    value={item.price}
                    onChange={(e) => updateItem(catIdx, itemIdx, "price", e.target.value)}
                    placeholder="価格 (例: ¥5,000〜)"
                    className="bg-[#242424] border border-[#444] text-white text-xs px-2.5 py-2 rounded-sm focus:outline-none focus:border-[#B8956A]"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(catIdx, itemIdx)}
                    className="text-red-400 hover:text-red-300 text-xs px-2 py-2 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addItem(catIdx)}
              className="text-xs text-[#B8956A] hover:text-white transition-colors"
            >
              + メニュー追加
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="text-xs text-[#B8956A] hover:text-white transition-colors py-1 border border-dashed border-[#444] w-full py-3 rounded-sm"
        >
          + カテゴリー追加
        </button>
      </div>
    </SectionLayout>
  );
}
