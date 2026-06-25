"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 「数字で見る」用のカウントアップ表示。
 * 純粋な整数（例: 26, 100, 200）はビューに入ると0からカウントアップ。
 * 数値でない値（例: 8:2, 定時）はそのまま表示。空なら「集計中」。
 */
export default function StatNumber({
  value,
  suffix,
}: {
  value: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isNumeric = /^\d+$/.test(value);
  const target = isNumeric ? parseInt(value, 10) : 0;
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isNumeric) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setDisplay(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isNumeric, target]);

  if (!value) {
    return (
      <p className="font-serif text-3xl sm:text-4xl leading-none">
        <span className="text-base text-white/40 font-sans">集計中</span>
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className="font-serif text-3xl sm:text-4xl text-site-accent leading-none tabular-nums"
    >
      {isNumeric ? display : value}
      {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
    </p>
  );
}
