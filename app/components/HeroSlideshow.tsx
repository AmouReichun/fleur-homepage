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
   * トップ：写真の上に手書き風の文字（2026-11-24 社長「Stelléみたいな手書き風・写真の上に文字は残す」）
   * - 写真は画面いっぱい。暗い膜はかけず、文字側だけ白っぽくぼかして読みやすく
   * - 白い細枠（Stellé風）。余白は黄金比の段（13/21/34/55）
   */
  return (
    <section className="hero-script relative min-h-[100svh] flex flex-col justify-end lg:justify-center overflow-hidden pt-14 sm:pt-16 bg-[#CCCBCE]">
      {/* 写真：スマホは上 62%、パソコンは右 62%。グレーの無地になじませる（Stellé風） */}
      <div className="absolute inset-x-0 top-14 sm:top-16 h-[62%] lg:h-auto lg:bottom-0 lg:left-auto lg:w-[62%] overflow-hidden">
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
                className="object-cover object-top lg:object-center animate-kenburns"
                style={{
                  opacity: i === active ? 1 : 0,
                  transition: "opacity 1.5s ease-in-out",
                }}
              />
            ) : null
          )
        ) : null}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#CCCBCE] via-[#CCCBCE]/10 to-transparent lg:bg-gradient-to-r lg:from-[#CCCBCE] lg:via-[#CCCBCE]/0 lg:to-transparent" />
      </div>

      {/* 白い細枠 */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[13px] sm:inset-x-[21px] bottom-[13px] sm:bottom-[21px] top-[69px] sm:top-[85px] border-2 border-white/90" />

      {/* 右側のスライド番号（01 02 03） */}
      {images.length > 1 && (
        <div className="absolute right-[26px] sm:right-[42px] top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col items-center gap-[13px]">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setLoaded((s) => addToSet(s, i));
                setActive(i);
              }}
              aria-label={`画像 ${i + 1}`}
              className={`text-[11px] tracking-widest transition-colors ${i === active ? "text-site-text font-bold" : "text-site-text/40"}`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      )}

      {/* 飾りは section 基準で置くので、この箱には relative を付けない */}
      <div className="w-full max-w-7xl mx-auto px-[34px] sm:px-[55px] lg:px-[89px] pb-[55px] lg:pb-[34px]">
        {children}
      </div>
    </section>
  );
}
