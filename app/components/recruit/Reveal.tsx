"use client";

import { useEffect, useRef, useState } from "react";

/**
 * スクロールで要素が画面に入ったら、ポンッと弾むように出てくるラッパー（採用ページ専用）。
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
    transform: visible ? "translateY(0) scale(1)" : `translateY(${y}px) scale(0.86)`,
    // 採用ページ用：ポンッと弾んで出る
    transition: `opacity 0.5s ease ${delay}ms, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
  };

  // @ts-expect-error ref typing across element kinds is fine here
  return <Tag ref={ref} style={style} className={className}>{children}</Tag>;
}
