"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { reserveSalons, type ReserveSalonEntry } from "@/app/components/reserveSalons";

/**
 * スマホ画面下の固定「ご予約」バー（2026-11-21 社長・Codexと決定）
 * - 最初の画面をスクロールしてから出す（最初の画面の予約ボタンと重ねない）
 * - 店ページ（/salon/◯◯）ではその店の予約先に直結。それ以外は3店から選ぶシートを開く
 * - 一番大きく見せる予約：美容室2店＝Web予約、Raffine＝ホットペッパー（社長決定）
 * - クリックは layout.tsx の reserve_click 計測がそのまま拾う
 */

function primaryOf(s: ReserveSalonEntry) {
  if (s.key === "raffine") return { label: "ホットペッパーで予約", href: s.hotpepperUrl };
  return { label: "Web予約", href: s.webReserveUrl ?? s.hotpepperUrl };
}

function telOf(phone: string) {
  return `tel:${phone.replace(/-/g, "")}`;
}

function SubLinks({ s }: { s: ReserveSalonEntry }) {
  return (
    <div className="flex gap-2 mt-2">
      {s.lineUrl && (
        <a href={s.lineUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs border border-site-greige py-2 text-site-text">
          LINE
        </a>
      )}
      <a href={telOf(s.phone)} className="flex-1 text-center text-xs border border-site-greige py-2 text-site-text">
        電話
      </a>
      {s.key !== "raffine" ? (
        <a href={s.hotpepperUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs border border-site-greige py-2 text-site-text">
          ホットペッパー
        </a>
      ) : (
        s.webReserveUrl && (
          <a href={s.webReserveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs border border-site-greige py-2 text-site-text">
            Web予約
          </a>
        )
      )}
    </div>
  );
}

export default function MobileReserveBar() {
  const pathname = usePathname() ?? "/";
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // スタッフ用の投稿ページには出さない
  if (pathname.startsWith("/blog/staff")) return null;

  const current = reserveSalons.find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`));

  return (
    <>
      {/* バーで本文の最後が隠れないための余白 */}
      <div className="h-16 lg:hidden" aria-hidden="true" />

      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-site-greige/70 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {current ? (
          <div className="flex gap-2">
            <a
              href={primaryOf(current).href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] text-center text-[13px] tracking-[0.02em] text-white bg-site-accent py-3"
            >
              {primaryOf(current).label}
            </a>
            {current.lineUrl && (
              <a href={current.lineUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-sm border border-site-greige py-3 text-site-text">
                LINE
              </a>
            )}
            <a href={telOf(current.phone)} className="flex-1 text-center text-sm border border-site-greige py-3 text-site-text">
              電話
            </a>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full text-center text-sm tracking-[0.15em] text-white bg-site-accent py-3"
          >
            ご予約（店舗を選ぶ）
          </button>
        )}
      </div>

      {/* 3店から選ぶシート */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="ご予約の店舗を選ぶ">
          <button type="button" aria-label="閉じる" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-white px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs tracking-[0.25em] text-site-accent">RESERVATION</p>
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-site-muted px-2">閉じる</button>
            </div>
            <ul className="space-y-5">
              {reserveSalons.map((s) => (
                <li key={s.key}>
                  <p className="font-serif text-lg mb-0.5">{s.name}</p>
                  <p className="text-[11px] text-site-muted mb-2">
                    {s.key === "raffine" ? "まつ毛・眉毛｜高知市はりまや町" : s.key === "riv" ? "美容室｜高知市南川添" : "美容室｜香南市野市町"}
                  </p>
                  <a
                    href={primaryOf(s).href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm tracking-[0.1em] text-white bg-site-accent py-3"
                  >
                    {primaryOf(s).label}
                  </a>
                  <SubLinks s={s} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
