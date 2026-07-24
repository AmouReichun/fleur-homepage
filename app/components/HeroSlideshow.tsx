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

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            {images.map((src, i) =>
              loaded.has(i) ? (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="100vw"
                  quality={75}
                  priority={i === 0}
                  className="object-cover animate-kenburns"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transition: "opacity 1.5s ease-in-out",
                  }}
                />
              ) : null
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2420] to-[#1a1a1a]" />
      )}

      {/* content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
        {children}
      </div>

      {/* dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 flex gap-2 z-10">
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
                width: i === active ? 24 : 12,
                backgroundColor: i === active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      )}

      {/* scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[9px] tracking-[0.35em] text-white uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/60 animate-pulse" />
      </div>
    </section>
  );
}
