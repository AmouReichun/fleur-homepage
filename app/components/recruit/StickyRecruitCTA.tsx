"use client";

import { useEffect, useState } from "react";

/**
 * 採用ページ用のスマホ追従CTA（画面下固定）＋ Instagram追従ボタン。
 * ファーストビューを少しスクロールしたら出現。フッター手前で自然に馴染む。
 */
export default function StickyRecruitCTA({
  instagramUrl,
}: {
  instagramUrl: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Instagram追従ボタン（右下・常時） */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagramで見る・DMで相談"
        className={`fixed right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-site-greige text-site-accent transition-all duration-300 hover:scale-105 ${
          show ? "bottom-24 sm:bottom-8 opacity-100" : "bottom-8 opacity-0 pointer-events-none"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      </a>

      {/* 下部固定CTAバー */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-t border-site-greige px-3 py-3 flex gap-2.5 max-w-2xl mx-auto">
          <a
            href="#entry"
            className="flex-1 text-center bg-site-accent text-white py-3 text-sm font-medium tracking-wide rounded-sm hover:bg-opacity-90 transition-all"
          >
            サロン見学・応募する
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-center border border-site-accent text-site-accent px-4 py-3 text-sm font-medium tracking-wide rounded-sm hover:bg-site-light transition-all"
          >
            Instagram
          </a>
        </div>
      </div>
    </>
  );
}
