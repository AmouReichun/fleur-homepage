"use client";

import { useEffect, useState } from "react";

/**
 * 採用ページ用のスマホ追従CTA（画面下固定）＋ Instagram追従ボタン。
 * ファーストビューを少しスクロールしたら出現。フッター手前で自然に馴染む。
 * Instagramは押すと3店のメニューが開き、見たい店を選べる。
 */
export default function StickyRecruitCTA({
  instagrams,
}: {
  instagrams: { name: string; url: string }[];
}) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!show) setOpen(false);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const single = instagrams.length === 1 ? instagrams[0].url : null;

  const icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );

  const roundCls = `fixed right-4 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-site-greige text-lav-deep transition-all duration-300 hover:scale-105 ${
    show ? "bottom-24 sm:bottom-8 opacity-100" : "bottom-8 opacity-0 pointer-events-none"
  }`;

  return (
    <>
      {/* Instagram追従ボタン（右下・常時） */}
      {single ? (
        <a href={single} target="_blank" rel="noopener noreferrer" aria-label="Instagramで見る・DMで相談" className={roundCls}>
          {icon}
        </a>
      ) : (
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Instagramで見る・DMで相談（店を選ぶ）" className={roundCls}>
          {icon}
        </button>
      )}

      {/* 店を選ぶメニュー */}
      {open && (
        <>
          <button type="button" aria-label="閉じる" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/20" />
          <div className="recruit-pop fixed right-4 bottom-40 sm:bottom-24 z-50 w-60 bg-white rounded-2xl border-[3px] border-site-text shadow-[4px_4px_0_#2A2A2A] p-3">
            <p className="text-[11px] font-bold text-site-text/70 px-1 pb-2">どのお店のInstagramを見る？</p>
            <ul className="space-y-1.5">
              {instagrams.map((ig) => (
                <li key={ig.url}>
                  <a
                    href={ig.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-full bg-lav-soft hover:bg-lime px-4 py-2.5 text-sm font-bold text-site-text transition-colors"
                  >
                    <span className="text-lav-deep">{icon}</span>
                    {ig.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* 下部固定CTAバー */}
      <div
        className={`recruit-pop fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur border-t border-site-greige px-3 py-3 flex gap-2.5 max-w-2xl mx-auto">
          <a
            href="#entry"
            className="rp-jelly flex-1 text-center bg-lime text-site-text py-3 text-sm font-bold tracking-wide rounded-full hover:brightness-95 transition-all"
          >
            サロン見学・応募する
          </a>
          {single ? (
            <a href={single} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-center border-2 border-lav text-lav-deep px-4 py-3 text-sm font-bold tracking-wide rounded-full hover:bg-lav-soft transition-all">
              Instagram
            </a>
          ) : (
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex-shrink-0 text-center border-2 border-lav text-lav-deep px-4 py-3 text-sm font-bold tracking-wide rounded-full hover:bg-lav-soft transition-all">
              Instagram
            </button>
          )}
        </div>
      </div>
    </>
  );
}
