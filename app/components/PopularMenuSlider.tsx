"use client";

import { useState, useEffect, useRef } from "react";
import type { PopularMenu } from "@/lib/content";

const INTERVAL = 4000;

export default function PopularMenuSlider({
  items,
  en,
  salonNames = {},
}: {
  items: PopularMenu[];
  en: string;
  /** 店舗キー → 表示名。salons 配列のラベル化に使用 */
  salonNames?: Record<string, string>;
}) {
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);
  const total = items.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % total);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [total]);

  function goTo(i: number) {
    paused.current = true;
    setCurrent(i);
    setTimeout(() => { paused.current = false; }, INTERVAL);
  }

  if (total === 0) return null;

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.35em] text-site-muted uppercase whitespace-nowrap">{en}</span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>

      {/* スライドエリア（クロスフェード） */}
      <div className="relative">
        {items.map((item, i) => (
          <div
            key={i}
            className={`transition-opacity duration-500 ${
              i === current
                ? "opacity-100 relative"
                : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div className="flex items-start gap-6 pb-7 border-b border-site-greige">
              <span className="text-[10px] text-site-accent font-mono pt-1 flex-shrink-0 tracking-wider w-5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                <p className="text-sm text-site-muted leading-relaxed mb-2">{item.desc}</p>
                <p className="text-[10px] text-site-accent tracking-wider">
                  {item.salons && item.salons.length > 0
                    ? item.salons.map((k) => salonNames[k] ?? k).join(" / ")
                    : item.salon}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ドットインジケーター */}
      {total > 1 && (
        <div className="flex items-center gap-2.5 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`メニュー ${i + 1}`}
              className={`block h-px transition-all duration-300 ${
                i === current ? "w-6 bg-site-accent" : "w-2.5 bg-site-greige hover:bg-site-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-[10px] font-mono text-site-muted tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
