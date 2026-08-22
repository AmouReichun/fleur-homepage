"use client";

import { useEffect, useRef, useState } from "react";

/**
 * スクロールでビューに入ったらフェードイン＋少し上昇する汎用ラッパー。
 * サーバーコンポーネントの中でも children を渡して使える。
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // 動きを減らす設定・IO非対応環境ではアニメーションせず即表示（アクセシビリティ / 堅牢性）
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setAnimate(false);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    // 保険: 何らかの理由で発火しなくても必ず表示する
    const fallback = setTimeout(() => setVisible(true), 1500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={
        animate
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : `translateY(${y}px)`,
              transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
