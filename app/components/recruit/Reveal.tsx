"use client";

import { useEffect, useRef, useState } from "react";

/**
 * スクロールで要素がビューポートに入ったらフェードイン＋少し上昇する汎用ラッパー。
 * 採用ページ全体のセクション/カードに使用。
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  };

  // @ts-expect-error ref typing across element kinds is fine here
  return <Tag ref={ref} style={style} className={className}>{children}</Tag>;
}
