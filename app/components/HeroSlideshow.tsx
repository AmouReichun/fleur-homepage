"use client";

import { useState, useEffect } from "react";

interface HeroSlideshowProps {
  images: string[];
  children: React.ReactNode;
  hasImage: boolean;
}

export default function HeroSlideshow({ images, children, hasImage }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover animate-kenburns"
                style={{
                  opacity: i === current ? 1 : 0,
                  transition: "opacity 1.5s ease-in-out",
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a2420] to-[#1a1a1a]" />
      )}

      {/* content: bottom-left */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
        {children}
      </div>

      {/* dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 sm:right-10 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`画像 ${i + 1}`}
              className="h-px transition-all duration-500"
              style={{
                width: i === current ? 24 : 12,
                backgroundColor: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
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
