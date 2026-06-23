"use client";

import { useState } from "react";
import type { MenuCategory, SalonContent } from "@/lib/content";

interface MenuTabsProps {
  salonOrder: string[];
  menus: Record<string, MenuCategory[]>;
  salons: Record<string, SalonContent>;
}

export default function MenuTabs({ salonOrder, menus, salons }: MenuTabsProps) {
  const [activeKey, setActiveKey] = useState<string>(salonOrder[0] ?? "");

  const salon = salons[activeKey];
  const categories = menus[activeKey] ?? [];

  return (
    <div>
      {/* 店舗タブ */}
      <div className="border-b border-site-greige overflow-x-auto">
        <div className="flex min-w-max">
          {salonOrder.map((key) => {
            const s = salons[key];
            if (!s) return null;
            return (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`relative px-5 sm:px-8 py-4 text-xs tracking-[0.2em] whitespace-nowrap transition-colors duration-200 ${
                  activeKey === key
                    ? "text-site-text font-medium"
                    : "text-site-muted hover:text-site-text"
                }`}
              >
                {s.name}
                {activeKey === key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-site-accent" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* メニュー本体 */}
      {salon && (
        <div className="mt-12">
          {/* サロンヘッダー */}
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
                href={`/salon/${activeKey}`}
                className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-site-text border border-site-greige px-5 py-2.5 hover:border-site-accent hover:text-site-accent transition-all group"
              >
                <span>詳細</span>
                <span className="w-3 h-px bg-current group-hover:w-5 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* カテゴリ別メニュー */}
          {categories.length === 0 ? (
            <p className="text-center text-site-muted text-sm py-16">メニュー情報がありません</p>
          ) : (
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
          )}

          <p className="text-[10px] text-site-muted mt-6 tracking-wider">
            ※ 価格は税込みです。詳細はホットペッパービューティーをご確認ください。
          </p>
        </div>
      )}
    </div>
  );
}
