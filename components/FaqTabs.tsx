"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export type FaqEntry = {
  q: string;
  a: string;
  sourceTitle: string;
  sourceSlug: string;
  category: "hair" | "eyelash";
  tags: string[];
};

type Props = {
  hairFaqs: FaqEntry[];
  eyelashFaqs: FaqEntry[];
};

const HAIR_CATS = ["すべて", "カラー", "縮毛矯正", "髪質改善", "パーマ", "カット", "ヘッドスパ", "メンズ"] as const;
const EYELASH_CATS = ["すべて", "マツエク", "まつげパーマ", "眉毛"] as const;

function hairCatOf(entry: FaqEntry): string {
  const text = [...entry.tags, entry.q, entry.a].join(" ");
  if (/メンズ|男性/.test(text)) return "メンズ";
  if (/縮毛矯正/.test(text)) return "縮毛矯正";
  if (/髪質改善/.test(text)) return "髪質改善";
  if (/ヘッドスパ|頭皮|スカルプ/.test(text)) return "ヘッドスパ";
  if (/パーマ|ウェーブ|デジタルパーマ/.test(text)) return "パーマ";
  if (/カット|ボブ|ショート|ミディアム|スタイル/.test(text)) return "カット";
  if (/カラー|白髪|ハイライト|ブリーチ|グレイ|アッシュ/.test(text)) return "カラー";
  return "カラー"; // デフォルト
}

function eyelashCatOf(entry: FaqEntry): string {
  const text = [...entry.tags, entry.q, entry.a].join(" ");
  if (/眉毛|まゆげ|アイブロウ|ブロウ|WAX|ワックス/.test(text)) return "眉毛";
  if (/パーマ|ラッシュリフト|パリジェンヌ|まつ毛パーマ|まつげパーマ/.test(text)) return "まつげパーマ";
  return "マツエク";
}

export default function FaqTabs({ hairFaqs, eyelashFaqs }: Props) {
  const [activeTab, setActiveTab] = useState<"hair" | "eyelash">("hair");
  const [hairCat, setHairCat] = useState("すべて");
  const [eyelashCat, setEyelashCat] = useState("すべて");

  const hairCounts = useMemo(() => {
    const counts: Record<string, number> = { すべて: hairFaqs.length };
    for (const f of hairFaqs) {
      const c = hairCatOf(f);
      counts[c] = (counts[c] ?? 0) + 1;
    }
    return counts;
  }, [hairFaqs]);

  const eyelashCounts = useMemo(() => {
    const counts: Record<string, number> = { すべて: eyelashFaqs.length };
    for (const f of eyelashFaqs) {
      const c = eyelashCatOf(f);
      counts[c] = (counts[c] ?? 0) + 1;
    }
    return counts;
  }, [eyelashFaqs]);

  const visibleFaqs = useMemo(() => {
    if (activeTab === "hair") {
      return hairCat === "すべて" ? hairFaqs : hairFaqs.filter((f) => hairCatOf(f) === hairCat);
    }
    return eyelashCat === "すべて" ? eyelashFaqs : eyelashFaqs.filter((f) => eyelashCatOf(f) === eyelashCat);
  }, [activeTab, hairCat, eyelashCat, hairFaqs, eyelashFaqs]);

  const isHair = activeTab === "hair";
  const accent = isHair ? "#BBA98A" : "#C8788A";
  const borderColor = isHair ? "rgba(187,169,138,0.30)" : "rgba(200,120,138,0.30)";
  const cardBg = isHair
    ? "linear-gradient(135deg, #FDFAF6, #F8F2EA)"
    : "linear-gradient(135deg, #FDF4F6, #F9EEF3)";
  const cardRadius = isHair ? "2px" : "12px";
  const qFont = isHair ? "font-mincho text-hair-text" : "font-kaku text-eye-text";
  const labelFont = isHair ? "font-cormorant" : "font-jakarta";

  const cats = isHair ? HAIR_CATS : EYELASH_CATS;
  const activeCat = isHair ? hairCat : eyelashCat;
  const setActiveCat = isHair ? setHairCat : setEyelashCat;
  const counts = isHair ? hairCounts : eyelashCounts;

  return (
    <div>
      {/* ── タブバー ── */}
      <div
        className="sticky top-14 z-30 bg-white/95 backdrop-blur-sm border-b"
        style={{ borderColor: "rgba(212,196,168,0.5)" }}
      >
        <div className="max-w-wide mx-auto px-4">
          <div className="flex">
            {(["hair", "eyelash"] as const).map((tab) => {
              const ia = activeTab === tab;
              const ac = tab === "hair" ? "#BBA98A" : "#C8788A";
              const as = tab === "hair" ? "rgba(187,169,138,0.10)" : "rgba(200,120,138,0.10)";
              const total = tab === "hair" ? hairFaqs.length : eyelashFaqs.length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex flex-col items-start px-5 py-3.5 transition-colors ${tab === "hair" ? "font-mincho" : "font-kaku"}`}
                  style={{
                    color: ia ? ac : "#A89880",
                    background: ia ? as : "transparent",
                    minWidth: "140px",
                  }}
                >
                  <span className="text-sm font-medium tracking-wide leading-tight">
                    {tab === "hair" ? "ヘア" : "アイラッシュ"}
                  </span>
                  <span className="text-[10px] tracking-wide mt-0.5" style={{ color: ia ? ac : "#C4B8A0" }}>
                    {tab === "hair" ? "fleur ami・Riv." : "Raffine"} / {total}件
                  </span>
                  {ia && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: ac }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── カテゴリピル ── */}
      <div
        className="sticky z-20 border-b bg-white/90 backdrop-blur-sm"
        style={{ top: "calc(3.5rem + 56px)", borderColor: "rgba(212,196,168,0.4)" }}
      >
        <div className="max-w-wide mx-auto px-4 py-2.5 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {cats.map((cat) => {
              const isActive = activeCat === cat;
              const cnt = counts[cat] ?? 0;
              if (cat !== "すべて" && cnt === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-3.5 py-1.5 text-xs tracking-wide transition-all whitespace-nowrap ${labelFont}`}
                  style={{
                    background: isActive ? accent : "transparent",
                    color: isActive ? "#fff" : accent,
                    border: `1px solid ${isActive ? accent : borderColor}`,
                    borderRadius: isHair ? "2px" : "999px",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {cat}
                  {cat !== "すべて" && (
                    <span
                      className="ml-1.5 text-[10px]"
                      style={{ opacity: isActive ? 0.75 : 0.6 }}
                    >
                      {cnt}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAQリスト ── */}
      <div className="max-w-wide mx-auto px-4 py-8">
        {visibleFaqs.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: "#A89880" }}>
            このカテゴリのQ&Aはまだありません。
          </p>
        ) : (
          <div className="space-y-4">
            {visibleFaqs.map((f, i) => (
              <div
                key={i}
                className="p-5 sm:p-6"
                style={{
                  background: cardBg,
                  borderLeft: `2px solid ${borderColor}`,
                  borderRadius: cardRadius,
                }}
              >
                <p
                  className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${labelFont}`}
                  style={{ color: accent }}
                >
                  Q
                </p>
                <p className={`text-sm font-medium mb-4 leading-relaxed ${qFont}`}>
                  {f.q}
                </p>
                <div className="w-8 h-px mb-3" style={{ background: borderColor }} />
                <p
                  className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${labelFont}`}
                  style={{ color: accent }}
                >
                  A
                </p>
                <p className={`text-sm leading-relaxed mb-4 ${isHair ? "text-hair-text" : "text-eye-text"}`}>
                  {f.a}
                </p>
                <Link
                  href={`/blog/${f.category}/${f.sourceSlug}`}
                  className={`text-[11px] tracking-wide transition-opacity hover:opacity-70 ${labelFont}`}
                  style={{ color: accent }}
                >
                  {f.sourceTitle} →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* フッターナビ */}
        <div className="mt-12 pt-8 flex flex-wrap gap-4" style={{ borderTop: "1px solid #D4C4A8" }}>
          <Link href="/blog/hair" className="text-sm font-cormorant tracking-wide hover:opacity-70 transition-opacity" style={{ color: "#BBA98A" }}>
            ← ヘア記事一覧
          </Link>
          <Link href="/blog/eyelash" className="text-sm font-jakarta tracking-wide hover:opacity-70 transition-opacity" style={{ color: "#C8788A" }}>
            アイラッシュ記事一覧 →
          </Link>
        </div>
      </div>
    </div>
  );
}
