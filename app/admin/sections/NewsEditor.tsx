"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import type { NewsItem } from "@/lib/content";

const SALON_OPTIONS = [
  { value: "", label: "全店舗共通" },
  { value: "fleurami", label: "fleurami" },
  { value: "riv", label: "Riv.by fleurami" },
  { value: "raffine", label: "Raffine" },
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function NewsEditor({ initial }: { initial: NewsItem[] }) {
  const [data, setData] = useState<NewsItem[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function update(id: string, field: keyof NewsItem, value: string) {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function add() {
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: "",
      body: "",
      date: today(),
      salon: "",
    };
    setData((prev) => [newItem, ...prev]);
  }

  function remove(id: string) {
    setData((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveContent("news", data);
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
      <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-1 uppercase">News</p>
      <h2 className="text-xl font-semibold text-[#2A2A2A] mb-6">最新情報</h2>
      {sorted.length === 0 ? (
        <p className="text-xs text-[#888] text-center py-8">お知らせがありません</p>
      ) : (
        <div className="divide-y divide-[#E8E4E0]">
          {sorted.map((item) => (
            <div key={item.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-[#888]">{item.date.replace(/-/g, ".")}</span>
                {item.salon && (
                  <span className="text-[10px] text-[#B8956A] border border-[#B8956A]/40 px-1.5 py-0.5">
                    {SALON_OPTIONS.find((o) => o.value === item.salon)?.label ?? item.salon}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#2A2A2A] mb-1">{item.title || "（タイトル）"}</p>
              <p className="text-xs text-[#888] leading-relaxed whitespace-pre-line line-clamp-3">
                {item.body || "（内容）"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SectionLayout
      title="最新情報"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      <div className="space-y-4">
        {sorted.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-3">
            {/* ヘッダー */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#666]">{item.id}</span>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                削除
              </button>
            </div>

            {/* 日付 */}
            <div>
              <label className="block text-xs text-[#888] mb-1">日付</label>
              <input
                type="date"
                value={item.date}
                onChange={(e) => update(item.id, "date", e.target.value)}
                className="bg-[#242424] border border-[#444] text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[#B8956A] transition-colors w-44"
              />
            </div>

            {/* 店舗 */}
            <div>
              <label className="block text-xs text-[#888] mb-1">対象店舗</label>
              <select
                value={item.salon ?? ""}
                onChange={(e) => update(item.id, "salon", e.target.value)}
                className="bg-[#242424] border border-[#444] text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[#B8956A] transition-colors w-full"
              >
                {SALON_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-xs text-[#888] mb-1">タイトル</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => update(item.id, "title", e.target.value)}
                placeholder="例: 夏のキャンペーン開始のお知らせ"
                className="bg-[#242424] border border-[#444] text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[#B8956A] transition-colors w-full"
              />
            </div>

            {/* 本文 */}
            <div>
              <label className="block text-xs text-[#888] mb-1">内容</label>
              <textarea
                value={item.body}
                onChange={(e) => update(item.id, "body", e.target.value)}
                rows={4}
                placeholder="お知らせの内容を入力してください"
                className="bg-[#242424] border border-[#444] text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-[#B8956A] transition-colors w-full resize-y"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm"
        >
          + お知らせを追加
        </button>
      </div>
    </SectionLayout>
  );
}
