"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveSalonOrder, addSalon } from "../actions";
import type { SalonContent } from "@/lib/content";

const TYPE_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  "美容室": { label: "美容室", color: "text-blue-600 bg-blue-50 border-blue-200", dot: "💇" },
  "アイラッシュサロン": { label: "アイラッシュサロン", color: "text-pink-600 bg-pink-50 border-pink-200", dot: "✨" },
};

const KNOWN_TYPES = ["美容室", "アイラッシュサロン"];

export default function SalonOrderEditor({
  initialOrder,
  salons,
}: {
  initialOrder: string[];
  salons: Record<string, SalonContent>;
}) {
  const [order, setOrder] = useState<string[]>(initialOrder);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // 新規サロン追加フォーム
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("美容室");
  const [newArea, setNewArea] = useState("");
  const [addPending, startAddTransition] = useTransition();
  const [addError, setAddError] = useState("");

  function move(key: string, dir: -1 | 1) {
    const i = order.indexOf(key);
    const next = [...order];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    setOrder(next);
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveSalonOrder(order);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    });
  }

  function handleAdd() {
    const key = newKey.trim().toLowerCase().replace(/\s+/g, "-");
    if (!key || !newName.trim()) { setAddError("キーと店舗名は必須です"); return; }
    if (salons[key]) { setAddError("同じキーのサロンが既に存在します"); return; }
    setAddError("");
    startAddTransition(async () => {
      const res = await addSalon(key, newName.trim(), newType, newArea.trim());
      if (res.success) {
        setOrder((prev) => [...prev, key]);
        setNewKey(""); setNewName(""); setNewArea(""); setNewType("美容室");
        setShowAdd(false);
        window.location.reload();
      } else {
        setAddError(res.error ?? "追加に失敗しました");
      }
    });
  }

  // グループ化
  const groups: Record<string, string[]> = {};
  const ungrouped: string[] = [];
  for (const key of order) {
    const type = salons[key]?.salonType ?? "";
    if (KNOWN_TYPES.includes(type)) {
      if (!groups[type]) groups[type] = [];
      groups[type].push(key);
    } else {
      ungrouped.push(key);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4E0] rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4E0] bg-[#FAF8F5]">
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">店舗の表示順を変更</p>
            <p className="text-xs text-[#888] mt-0.5">▲▼ で並べ替えて「保存する」を押すとサイトに反映されます</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === "success" && <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">✓ 保存しました</span>}
            {saveStatus === "error" && <span className="text-xs text-red-500">失敗しました</span>}
            <button
              onClick={handleSave}
              disabled={isPending}
              className="bg-[#B8956A] text-white text-xs px-5 py-2.5 rounded-lg hover:bg-[#A07850] transition-all disabled:opacity-50 font-medium"
            >
              {isPending ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {[...KNOWN_TYPES, "__other"].map((type) => {
            const keys = type === "__other" ? ungrouped : (groups[type] ?? []);
            if (!keys.length) return null;
            const cfg = TYPE_CONFIG[type] ?? { label: "その他", color: "text-gray-600 bg-gray-50 border-gray-200", dot: "🏪" };
            return (
              <div key={type}>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${cfg.color}`}>
                  {cfg.dot} {cfg.label}
                </span>
                <div className="space-y-2">
                  {keys.map((key) => {
                    const i = order.indexOf(key);
                    const salon = salons[key];
                    return (
                      <div key={key} className="flex items-center gap-3 bg-[#F8F6F3] border border-[#E8E4E0] px-4 py-3 rounded-lg">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => move(key, -1)}
                            disabled={i === 0}
                            className="w-6 h-6 flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-white rounded disabled:opacity-20 transition-all text-xs"
                          >▲</button>
                          <button
                            type="button"
                            onClick={() => move(key, 1)}
                            disabled={i === order.length - 1}
                            className="w-6 h-6 flex items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-white rounded disabled:opacity-20 transition-all text-xs"
                          >▼</button>
                        </div>
                        <span className="text-lg font-bold text-[#D0CCC8] w-5 text-center">{i + 1}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A1A]">{salon?.name ?? key}</p>
                          <p className="text-xs text-[#888]">{salon?.area ?? ""}</p>
                        </div>
                        <Link
                          href={`/admin/salon/${key}`}
                          className="text-xs text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors"
                        >
                          編集する →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* サロンを追加 */}
      {showAdd ? (
        <div className="bg-white border border-[#B8956A] rounded-xl p-5 space-y-4">
          <p className="text-sm font-semibold text-[#1A1A1A]">新規サロンを追加</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">キー（英数字・ハイフン）</label>
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="例: new-salon"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">店舗名</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例: New Salon"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">業態</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A]"
              >
                {KNOWN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#555] mb-1">エリア</label>
              <input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="例: 高知市"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20"
              />
            </div>
          </div>

          {addError && <p className="text-xs text-red-500">{addError}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={addPending}
              className="bg-[#B8956A] text-white text-xs px-5 py-2.5 rounded-lg hover:bg-[#A07850] transition-all disabled:opacity-50 font-medium"
            >
              {addPending ? "追加中..." : "追加する"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setAddError(""); }}
              className="text-xs text-[#888] hover:text-[#555] px-4 py-2.5 rounded-lg border border-[#E8E4E0] hover:border-[#D0CCC8] transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full text-sm text-[#B8956A] hover:text-[#8A6540] font-medium py-3 border-2 border-dashed border-[#D0CCC8] rounded-xl hover:border-[#B8956A] transition-all"
        >
          ＋ サロンを追加する
        </button>
      )}
    </div>
  );
}
