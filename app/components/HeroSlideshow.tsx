"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface HeroSlideshowProps {
  images: string[];
  children: React.ReactNode;
  hasImage: boolean;
}

function addToSet(s: Set<number>, val: number): Set<number> {
  const next = new Set<number>();
  s.forEach((v) => next.add(v));
  next.add(val);
  return next;
}

export default function HeroSlideshow({ images, children, hasImage }: HeroSlideshowProps) {
  const [active, setActive] = useState(0);
  // 初期表示は0番目のみ DOM に追加。次の画像は遷移直前にプリロード。
  const [loaded, setLoaded] = useState<Set<number>>(() => {
    const s = new Set<number>();
    s.add(0);
    return s;
  });

  const advance = useCallback(() => {
    setActive((prev) => {
      const next = (prev + 1) % images.length;
      setLoaded((s) => addToSet(s, next));
      return next;
    });
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    // 遷移の3秒前に次の画像をプリロード
    const preload = setTimeout(() => {
      setLoaded((s) => addToSet(s, 1 % images.length));
    }, 3000);
    const timer = setInterval(advance, 6000);
    return () => {
      clearTimeout(preload);
      clearInterval(timer);
    };
  }, [images.length, advance]);

  /*
   * 黄金比（1 : 1.618）のトップ（2026-11-24 社長「黄金比で考えて」）
   * - 画面の分け方：文字 38.2% ｜ 写真 61.8%（スマホは 写真 61.8% → 文字）
   * - 余白・文字の大きさ：8 → 13 → 21 → 34 → 55 → 89（1つ前×1.618）
   * - 写真に暗い膜はかけない（明るく見せる）
   */
  return (
    <section className="relative bg-site-bg pt-14 sm:pt-16 lg:min-h-[100svh] lg:grid lg:grid-cols-[38.2fr_61.8fr]">
      {/* 写真（61.8%） */}
      <div className="relative h-[61.8svh] lg:h-auto lg:order-2 overflow-hidden">
        {hasImage ? (
          images.map((src, i) =>
            loaded.has(i) ? (
              <Image
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 1024px) 100vw, 62vw"
                quality={75}
                priority={i === 0}
                className="object-cover animate-kenburns"
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: "opacity 1.5s ease-in-out",
                }}
              />
            ) : null
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2420] to-[#1a1a1a]" />
        )}

        {/* 黄金比の補助線（写真を 61.8 : 38.2 で区切る細い金の線） */}
        <div aria-hidden className="pointer-events-none absolute inset-[13px] sm:inset-[21px] border border-white/50">
          <span className="absolute top-0 bottom-0 left-[61.8%] w-px bg-white/40" />
          <span className="absolute left-[61.8%] right-0 top-[61.8%] h-px bg-white/40" />
        </div>

        {/* dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-[34px] right-[34px] flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setLoaded((s) => addToSet(s, i));
                  setActive(i);
                }}
                aria-label={`画像 ${i + 1}`}
                className="h-px transition-all duration-500"
                style={{
                  width: i === active ? 34 : 13,
                  backgroundColor: i === active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 文字（38.2%） */}
      <div className="relative lg:order-1 flex flex-col justify-center px-[21px] sm:px-[34px] lg:px-[55px] xl:px-[89px] py-[34px] sm:py-[55px]">
        {children}
      </div>
    </section>
  );
}
