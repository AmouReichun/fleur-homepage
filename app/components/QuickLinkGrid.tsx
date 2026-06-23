"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { QuickLinkCard } from "@/lib/content";

const FALLBACKS = [
  "from-[#2c2018] to-[#0f0a06]",
  "from-[#1c2028] to-[#080b10]",
  "from-[#201c18] to-[#0a0806]",
  "from-[#1a1c20] to-[#080a0c]",
  "from-[#241a10] to-[#100806]",
  "from-[#18201c] to-[#080c0a]",
  "from-[#201818] to-[#0c0808]",
  "from-[#1c1820] to-[#08060c]",
];

function CardItem({ card, index }: { card: QuickLinkCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), index * 70);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [index]);

  const inner = (
    <>
      {/* 画像 or グラデーション（画像はhover時にスケール） */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full transition-transform duration-700 ease-out md:group-hover:scale-[1.05]">
          {card.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.imageSrc}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${FALLBACKS[index % FALLBACKS.length]}`}
            />
          )}
        </div>
      </div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:group-hover:from-black/60 transition-all duration-300" />

      {/* テキスト */}
      <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-4">
        <h3 className="text-white font-serif text-[13px] sm:text-sm lg:text-[15px] font-medium leading-tight tracking-wide mb-0.5">
          {card.title}
        </h3>
        {card.description && (
          <p className="text-white/50 text-[10px] sm:text-[11px] tracking-wider leading-snug">
            {card.description}
          </p>
        )}
      </div>

      {/* 外部リンクアイコン */}
      {card.external && (
        <div className="absolute top-3 right-3 opacity-35">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 9L9 1M9 1H3M9 1V7"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
  );

  const linkClass =
    "relative block overflow-hidden group h-[155px] sm:h-[168px] lg:h-[190px] bg-stone-900";

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
    >
      {card.external ? (
        <a
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {inner}
        </a>
      ) : (
        <Link href={card.href} className={linkClass}>
          {inner}
        </Link>
      )}
    </div>
  );
}

export default function QuickLinkGrid({ cards }: { cards: QuickLinkCard[] }) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-10 pt-6 pb-10 sm:pt-8 sm:pb-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card, i) => (
            <CardItem key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
