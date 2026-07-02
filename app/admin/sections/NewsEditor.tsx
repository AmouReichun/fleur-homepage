"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import ImageUpload from "../components/ImageUpload";
import type { NewsItem, SalonContent } from "@/lib/content";

function today() {
  return new Date().toISOString().slice(0, 10);
}

type Category = "hair" | "eyelash";

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "hair", label: "美容室" },
  { key: "eyelash", label: "アイラッシュ" },
];

function salonCategory(salonType?: string): Category {
  return salonType?.includes("アイラッシュ") ? "eyelash" : "hair";
}

export default function NewsEditor({
  initial,
  salons,
  salonOrder,
}: {
  initial: NewsItem[];
  salons: Record<string, SalonContent>;
  salonOrder: string[];
}) {
  const [data, setData] = useState<NewsItem[]>(initial);
  const [activeCat, setActiveCat] = useState<Category>("hair");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");
  const [gbpNote, setGbpNote] = useState<string>("");

  // 業態ごとの店舗キー
  const catSalonKeys = salonOrder.filter(
    (k) => salonCategory(salons[k]?.salonType) === activeCat
  );

  // 対象店舗セレクトの選択肢（現在のタブの業態 + 全店舗共通）
  const SALON_OPTIONS = [
    { value: "", label: "全店舗共通" },
    ...catSalonKeys.map((k) => ({ value: k, label: salons[k]?.name ?? k })),
  ];

  const salonLabel = (key?: string) =>
    key ? salons[key]?.name ?? key : "全店舗共通";

  // 現在のタブに表示する記事（全店舗共通は両タブに表示）
  const sorted = [...data]
    .filter((item) => {
      const s = item.salon ?? "";
      return s === "" || catSalonKeys.includes(s);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
      // 追加した記事が現在のタブに表示されるよう、その業態の先頭店舗を初期値に
      salon: catSalonKeys[0] ?? "",
    };
    setData((prev) => [newItem, ...prev]);
  }

  function remove(id: string) {
    setData((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("news", JSON.stringify(data));
        if (res.success) {
          setSaveStatus("success");
          setSaveError("");
          setGbpNote(res.warning ?? "");
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
    <div className="p-6">
      <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-1 uppercase">News</p>
      <h2 className="text-xl font-semibold text-[#2A2A2A] mb-4">最新情報</h2>
      {/* 業態タブ（プレビュー） */}
      <div className="inline-flex border border-[#E8E4E0] rounded-full p-0.5 bg-[#F4F2EF] mb-6">
        {CATEGORY_TABS.map((t) => (
          <span
            key={t.key}
            className={`px-4 py-1 rounded-full text-xs ${
              activeCat === t.key ? "bg-[#B8956A] text-white" : "text-[#888]"
            }`}
          >
            {t.label}
          </span>
        ))}
      </div>
      {sorted.length === 0 ? (
        <p className="text-xs text-[#888] text-center py-8">お知らせがありません</p>
      ) : (
        <div className="divide-y divide-[#E8E4E0]">
          {sorted.map((item) => (
            <div key={item.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-[#888]">{item.date.replace(/-/g, ".")}</span>
                <span className="text-[10px] text-[#B8956A] border border-[#B8956A]/40 px-1.5 py-0.5">
                  {salonLabel(item.salon)}
                </span>
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
        {gbpNote && (
          <div className="bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs px-3 py-2 rounded-sm">
            ⚠️ {gbpNote}
          </div>
        )}

        {/* 業態タブ（美容室 / アイラッシュ） */}
        <div className="flex gap-2">
          {CATEGORY_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveCat(t.key)}
              className={`flex-1 py-2 rounded-sm text-sm transition-colors border ${
                activeCat === t.key
                  ? "bg-[#B8956A] text-white border-[#B8956A]"
                  : "bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {sorted.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-3">
            {/* ヘッダー */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] text-[#666] truncate">{item.id}</span>
                {item.gbpPostedAt ? (
                  <span className="text-[10px] text-green-400 border border-green-700/50 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                    GBP投稿済み
                  </span>
                ) : (
                  <span className="text-[10px] text-[#888] border border-[#444] px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                    保存でGBPへ投稿
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
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

            {/* 画像 */}
            <ImageUpload
              label="画像（任意）"
              value={item.imageSrc ?? ""}
              onChange={(v) => update(item.id, "imageSrc", v)}
              section={`news-${item.id}`}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm"
        >
          + 「{CATEGORY_TABS.find((t) => t.key === activeCat)?.label}」にお知らせを追加
        </button>
      </div>
    </SectionLayout>
  );
}
