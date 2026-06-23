"use client";

import { useState, useTransition, useRef } from "react";
import { saveContent, uploadImage } from "../actions";
import SectionLayout from "../components/SectionLayout";
import type { QuickLinkCard } from "@/lib/content";
import Image from "next/image";

export default function QuickLinkEditor({ initial }: { initial: QuickLinkCard[] }) {
  const [cards, setCards] = useState<QuickLinkCard[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  function updateCard(id: string, field: keyof QuickLinkCard, value: string | boolean) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function addCard() {
    const newCard: QuickLinkCard = {
      id: `card-${Date.now()}`,
      title: "新しいリンク",
      description: "",
      href: "/",
      external: false,
      imageSrc: "",
    };
    setCards((prev) => [...prev, newCard]);
  }

  function moveCard(index: number, dir: -1 | 1) {
    setCards((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const targetId = uploadTargetId.current;
    if (!file || !targetId) return;
    if (!file.type.startsWith("image/")) return;

    setUploadingId(targetId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", "quicklinks");
      const url = await uploadImage(formData);
      updateCard(targetId, "imageSrc", url);
    } catch {
      // エラーは無視
    } finally {
      setUploadingId(null);
      uploadTargetId.current = null;
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function triggerUpload(id: string) {
    uploadTargetId.current = id;
    fileInputRef.current?.click();
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveContent("quickLinks", cards);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    });
  }

  const preview = (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
        {cards.slice(0, 8).map((card, i) => (
          <div
            key={card.id}
            className="relative overflow-hidden"
            style={{ height: 90 }}
          >
            {card.imageSrc ? (
              <Image src={card.imageSrc} alt={card.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-stone-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-[10px] font-medium leading-tight">{card.title || `カード ${i + 1}`}</p>
              {card.description && (
                <p className="text-white/50 text-[8px] leading-tight">{card.description}</p>
              )}
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p className="col-span-2 text-center text-[#888] text-xs py-6">カードがありません</p>
        )}
      </div>
      {cards.length > 8 && (
        <p className="text-center text-xs text-[#888] mt-2">＋{cards.length - 8}枚（プレビューは先頭8枚）</p>
      )}
    </div>
  );

  return (
    <SectionLayout
      title="クイックリンク（トップページ）"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
    >
      <p className="text-xs text-[#888] mb-4 leading-relaxed">
        ヒーローの直下に表示される画像グリッド。スマホ2列・タブレット3列・PC4列で表示されます。
      </p>

      <div className="space-y-3">
        {cards.map((card, i) => (
          <div
            key={card.id}
            className="bg-white border border-[#E0DCD8] rounded-xl overflow-hidden"
          >
            {/* カードヘッダー */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#F8F6F4] border-b border-[#E8E4E0]">
              <span className="text-xs font-semibold text-[#B8956A]">
                {String(i + 1).padStart(2, "0")} — {card.title || "（タイトル未入力）"}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveCard(i, -1)}
                  disabled={i === 0}
                  className="text-[11px] px-2 py-1 border border-[#D0CCC8] rounded hover:bg-[#EDE9E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveCard(i, 1)}
                  disabled={i === cards.length - 1}
                  className="text-[11px] px-2 py-1 border border-[#D0CCC8] rounded hover:bg-[#EDE9E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeCard(card.id)}
                  className="text-[11px] px-2 py-1 border border-red-200 text-red-400 rounded hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  削除
                </button>
              </div>
            </div>

            <div className="p-4 flex gap-4">
              {/* 画像エリア */}
              <div className="flex-shrink-0">
                <div
                  className="relative overflow-hidden rounded-lg border border-[#E8E4E0] cursor-pointer group"
                  style={{ width: 80, height: 80 }}
                  onClick={() => triggerUpload(card.id)}
                >
                  {card.imageSrc ? (
                    <Image src={card.imageSrc} alt={card.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                      <span className="text-white/40 text-[10px] text-center leading-tight px-1">画像<br/>なし</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-center leading-tight">
                      {uploadingId === card.id ? "..." : "クリックで\n変更"}
                    </span>
                  </div>
                </div>
                {card.imageSrc && (
                  <button
                    type="button"
                    onClick={() => updateCard(card.id, "imageSrc", "")}
                    className="w-full mt-1 text-[10px] text-red-400 hover:text-red-600 transition-colors text-center"
                  >
                    削除
                  </button>
                )}
              </div>

              {/* テキスト・リンク */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">タイトル</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(card.id, "title", e.target.value)}
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">説明文（小文字）</label>
                  <input
                    type="text"
                    value={card.description}
                    onChange={(e) => updateCard(card.id, "description", e.target.value)}
                    placeholder="省略可"
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#555] mb-1">リンク先 URL</label>
                  <input
                    type="text"
                    value={card.href}
                    onChange={(e) => updateCard(card.id, "href", e.target.value)}
                    placeholder="/salon または https://..."
                    className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all font-mono"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!card.external}
                    onChange={(e) => updateCard(card.id, "external", e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#B8956A]"
                  />
                  <span className="text-[11px] text-[#555]">外部リンク（新しいタブで開く）</span>
                </label>
              </div>
            </div>
          </div>
        ))}

        {/* 追加ボタン */}
        <button
          type="button"
          onClick={addCard}
          className="w-full text-sm text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors py-3 border-2 border-dashed border-[#D0CCC8] rounded-xl hover:border-[#B8956A]"
        >
          ＋ カードを追加する
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </SectionLayout>
  );
}
