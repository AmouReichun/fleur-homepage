"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface SalonSlide {
  key: string;
  href: string;
  name: string;
  area: string;
  salonType: string;
  description: string;
  features: string[];
  imageSrc: string;
  hotpepperUrl: string;
}

export default function SalonSlider({ salons }: { salons: SalonSlide[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const paused = useRef(false);
  const total = salons.length;

  const pause = useCallback(() => {
    paused.current = true;
    setTimeout(() => { paused.current = false; }, 5000);
  }, []);

  const prev = useCallback(() => { pause(); setCurrent((c) => (c - 1 + total) % total); }, [total, pause]);
  const next = useCallback(() => { pause(); setCurrent((c) => (c + 1) % total); }, [total, pause]);

  // 自動スライド（5秒間隔、ホバー・タッチ中は停止）
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  const onTouchStart = (e: React.TouchEvent) => {
    paused.current = true;
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    // 操作後3秒は自動再開を待つ
    setTimeout(() => { paused.current = false; }, 3000);
  };

  return (
    <div>
      {/* スライドトラック */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {salons.map((s) => (
            <div key={s.key} className="min-w-full flex flex-col md:flex-row">
              {/* 画像 */}
              <div className="md:w-[58%] overflow-hidden bg-site-light">
                <div className="w-full aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] sm:min-h-[420px] overflow-hidden">
                  {s.imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.imageSrc}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-site-muted text-sm tracking-wider">[店舗写真]</span>
                    </div>
                  )}
                </div>
              </div>

              {/* テキスト */}
              <div className="md:w-[42%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 bg-white">
                <p className="text-[10px] tracking-[0.45em] text-site-accent uppercase mb-4">
                  {s.area} — {s.salonType}
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl font-light mb-5">{s.name}</h3>
                <p className="text-sm text-site-muted leading-loose mb-8 max-w-xs">{s.description}</p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {s.features.map((f) => (
                    <span key={f} className="text-[10px] tracking-wider border border-site-greige text-site-muted px-3 py-1">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <a
                    href={s.hotpepperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-[0.2em] text-white bg-site-accent px-6 py-3 hover:bg-opacity-90 transition-all duration-200"
                  >
                    予約する
                  </a>
                  <Link
                    href={s.href}
                    className="inline-flex items-center gap-3 text-xs tracking-[0.15em] text-site-text hover:text-site-accent transition-colors duration-200 group"
                  >
                    <span>詳細を見る</span>
                    <span className="w-6 h-px bg-current group-hover:w-8 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ナビゲーション */}
      <div className="flex items-center justify-between px-8 sm:px-12 lg:px-16 pt-6 pb-2">
        {/* カウンター + ドット */}
        <div className="flex items-center gap-5">
          <span className="text-[10px] font-mono tracking-widest text-site-muted">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-2 items-center">
            {salons.map((_, i) => (
              <button
                key={i}
                onClick={() => { pause(); setCurrent(i); }}
                aria-label={`スライド ${i + 1}`}
                className={`block h-px transition-all duration-300 ${
                  i === current ? "w-8 bg-site-accent" : "w-3 bg-site-greige hover:bg-site-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 矢印 */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label="前の店舗"
            className="w-10 h-10 border border-site-greige flex items-center justify-center text-site-muted hover:border-site-accent hover:text-site-accent transition-all duration-200 text-sm"
          >
            ←
          </button>
          <button
            onClick={next}
            aria-label="次の店舗"
            className="w-10 h-10 border border-site-greige flex items-center justify-center text-site-muted hover:border-site-accent hover:text-site-accent transition-all duration-200 text-sm"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
