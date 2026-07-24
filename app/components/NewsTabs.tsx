"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/content";

export type NewsSalonMeta = {
  key: string;
  name: string;
  category: "hair" | "eyelash";
};

const CATEGORIES: { key: "hair" | "eyelash"; label: string; en: string }[] = [
  { key: "hair", label: "美容室", en: "Hair Salon" },
  { key: "eyelash", label: "アイラッシュ", en: "Eyelash Salon" },
];

export default function NewsTabs({
  news,
  salons,
}: {
  news: NewsItem[];
  salons: NewsSalonMeta[];
}) {
  // 記事が存在するカテゴリのみタブに出す（両方なければ全カテゴリ表示）
  const availableCats = useMemo(() => {
    const keysByCat: Record<string, string[]> = {
      hair: salons.filter((s) => s.category === "hair").map((s) => s.key),
      eyelash: salons.filter((s) => s.category === "eyelash").map((s) => s.key),
    };
    const cats = CATEGORIES.filter((c) =>
      news.some((n) => {
        const s = n.salon ?? "";
        return s === "" || keysByCat[c.key].includes(s);
      })
    );
    return cats.length > 0 ? cats : CATEGORIES;
  }, [news, salons]);

  const [cat, setCat] = useState<"hair" | "eyelash">(availableCats[0].key);
  const [store, setStore] = useState<string>(""); // "" = すべて

  const storesInCat = salons.filter((s) => s.category === cat);
  const catSalonKeys = storesInCat.map((s) => s.key);
  const salonName = (key: string) => salons.find((s) => s.key === key)?.name ?? key;

  function selectCat(c: "hair" | "eyelash") {
    setCat(c);
    setStore("");
  }

  const sorted = useMemo(
    () =>
      [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [news]
  );

  const filtered = sorted.filter((item) => {
    const s = item.salon ?? "";
    if (s === "") return true; // 全店舗共通はどのタブにも表示
    if (!catSalonKeys.includes(s)) return false; // 別カテゴリの店舗は除外
    if (store && s !== store) return false; // 店舗サブフィルタ
    return true;
  });

  return (
    <div>
      {/* カテゴリタブ（美容室 / アイラッシュ） */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex border border-site-greige rounded-full p-1 bg-site-light">
          {availableCats.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => selectCat(c.key)}
              className={`px-6 sm:px-8 py-2 rounded-full text-sm tracking-wider transition-colors ${
                cat === c.key
                  ? "bg-site-accent text-white"
                  : "text-site-muted hover:text-site-text"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 店舗サブフィルタ（その業態に店舗が複数ある場合のみ） */}
      {storesInCat.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setStore("")}
            className={`text-xs px-3 py-1.5 border rounded-full transition-colors ${
              store === ""
                ? "border-site-accent text-site-accent"
                : "border-site-greige text-site-muted hover:text-site-text"
            }`}
          >
            すべて
          </button>
          {storesInCat.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStore(s.key)}
              className={`text-xs px-3 py-1.5 border rounded-full transition-colors ${
                store === s.key
                  ? "border-site-accent text-site-accent"
                  : "border-site-greige text-site-muted hover:text-site-text"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <p className="text-center text-site-muted text-sm py-16">
          現在お知らせはありません
        </p>
      ) : (
        <div className="divide-y divide-site-greige">
          {filtered.map((item) => (
            <article key={item.id} className="py-8 first:pt-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <time dateTime={item.date} className="text-xs text-site-muted tabular-nums">
                  {item.date.replace(/-/g, ".")}
                </time>
                <span className="text-[10px] tracking-wider text-site-accent border border-site-accent/40 px-2 py-0.5">
                  {item.salon ? salonName(item.salon) : "全店舗共通"}
                </span>
              </div>
              <h2 className="font-serif text-lg font-semibold text-site-text mb-3">
                {item.title}
              </h2>
              {item.imageSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  loading="lazy"
                  className="w-full max-h-80 object-cover mb-4"
                />
              )}
              <p className="text-sm text-site-muted leading-relaxed whitespace-pre-line">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
