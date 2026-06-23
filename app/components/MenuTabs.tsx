"use client";

import { useState } from "react";
import type { MenuCategory, SalonContent } from "@/lib/content";

type Category = "hair" | "eyelash";

const HAIR_KEYS = ["fleurami", "riv"] as const;
const EYELASH_KEYS = ["raffine"] as const;

interface MenuTabsProps {
  salonOrder: string[];
  menus: Record<string, MenuCategory[]>;
  salons: Record<string, SalonContent>;
}

function SalonMenuBlock({
  salonKey,
  salon,
  categories,
}: {
  salonKey: string;
  salon: SalonContent;
  categories: MenuCategory[];
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-site-accent uppercase mb-2">
            {salon.area} — {salon.salonType}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light">{salon.name}</h2>
        </div>
        <div className="flex gap-3">
          {salon.hotpepperUrl && (
            <a
              href={salon.hotpepperUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-white bg-site-accent px-5 py-2.5 hover:bg-opacity-90 transition-all"
            >
              予約する
            </a>
          )}
          <a
            href={`/salon/${salonKey}`}
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-site-text border border-site-greige px-5 py-2.5 hover:border-site-accent hover:text-site-accent transition-all group"
          >
            <span>詳細</span>
            <span className="w-3 h-px bg-current group-hover:w-5 transition-all duration-300" />
          </a>
        </div>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-[10px] tracking-[0.4em] text-site-muted uppercase">{cat.category}</h3>
              <div className="flex-1 h-px bg-site-greige" />
            </div>
            <div className="divide-y divide-site-greige/60">
              {cat.items.map((item) => (
                <div key={item.name} className="flex items-start justify-between gap-4 py-3.5">
                  <div>
                    <p className="font-serif text-sm">{item.name}</p>
                    {item.desc && (
                      <p className="text-[11px] text-site-muted mt-0.5 leading-relaxed">{item.desc}</p>
                    )}
                  </div>
                  <p className="text-sm text-site-accent whitespace-nowrap pt-0.5">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-site-muted mt-6 tracking-wider">
        ※ 価格は税込みです。詳細はホットペッパービューティーをご確認ください。
      </p>
    </div>
  );
}

export default function MenuTabs({ salonOrder, menus, salons }: MenuTabsProps) {
  const [category, setCategory] = useState<Category>("hair");
  const [salonKey, setSalonKey] = useState<string>(() => {
    return salonOrder.find((k) => (HAIR_KEYS as readonly string[]).includes(k)) ?? "";
  });

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
    if (cat === "hair") {
      setSalonKey(salonOrder.find((k) => (HAIR_KEYS as readonly string[]).includes(k)) ?? "");
    } else {
      setSalonKey(salonOrder.find((k) => (EYELASH_KEYS as readonly string[]).includes(k)) ?? "");
    }
  }

  const hairKeys = salonOrder.filter((k) => (HAIR_KEYS as readonly string[]).includes(k));
  const eyelashKeys = salonOrder.filter((k) => (EYELASH_KEYS as readonly string[]).includes(k));

  // 表示するキー
  const visibleKeys = category === "hair"
    ? hairKeys.filter((k) => k === salonKey)
    : eyelashKeys;

  return (
    <div>
      {/* 上段：業態タブ（すべてなし） */}
      <div className="border-b border-site-greige overflow-x-auto">
        <div className="flex min-w-max">
          {([
            { label: "美容室", value: "hair" as Category, count: hairKeys.length },
            { label: "アイラッシュサロン", value: "eyelash" as Category, count: eyelashKeys.length },
          ]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleCategoryChange(tab.value)}
              className={`relative px-5 sm:px-8 py-4 text-xs tracking-[0.2em] whitespace-nowrap transition-colors duration-200 ${
                category === tab.value
                  ? "text-site-text font-medium"
                  : "text-site-muted hover:text-site-text"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-[9px] ${category === tab.value ? "text-site-accent" : "text-site-muted/60"}`}>
                ({tab.count})
              </span>
              {category === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-site-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 下段：美容室の店舗タブ（すべてなし） */}
      {category === "hair" && hairKeys.length > 1 && (
        <div className="border-b border-site-greige/60 bg-site-bg overflow-x-auto">
          <div className="flex min-w-max px-2">
            {hairKeys.map((k) => (
              <button
                key={k}
                onClick={() => setSalonKey(k)}
                className={`relative px-4 sm:px-6 py-2.5 text-[11px] tracking-[0.18em] whitespace-nowrap transition-colors duration-200 ${
                  salonKey === k
                    ? "text-site-accent"
                    : "text-site-muted hover:text-site-text"
                }`}
              >
                {salons[k]?.name ?? k}
                {salonKey === k && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-site-accent/60" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* メニュー本体 */}
      <div className="mt-12">
        {visibleKeys.length === 0 ? (
          <p className="text-center text-site-muted text-sm py-16">メニュー情報がありません</p>
        ) : visibleKeys.length === 1 ? (
          <SalonMenuBlock
            salonKey={visibleKeys[0]}
            salon={salons[visibleKeys[0]]}
            categories={menus[visibleKeys[0]] ?? []}
          />
        ) : (
          <div className="space-y-16 divide-y divide-site-greige">
            {visibleKeys.map((key, i) => (
              <div key={key} className={i > 0 ? "pt-16" : ""}>
                <SalonMenuBlock
                  salonKey={key}
                  salon={salons[key]}
                  categories={menus[key] ?? []}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
