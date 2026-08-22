"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";
import { reserveSalons } from "@/app/components/reserveSalons";

const navLinks = [
  { href: "/salon", label: "店舗案内" },
  { href: "/menu", label: "メニュー" },
  { href: "/staff", label: "スタッフ" },
  { href: "/news", label: "最新情報" },
  { href: "/blog", label: "ブログ" },
  { href: "/recruit", label: "採用情報" },
  { href: "/company", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

/** ご予約ポップオーバー / モバイルメニュー共通の店舗別予約チャネル一覧 */
function ReserveList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-5">
      {reserveSalons.map((s) => (
        <div key={s.key}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs font-medium text-site-text">{s.name}</span>
            <span className="text-[10px] text-site-muted">{s.area}</span>
          </div>
          {/* SalonReserveIcons の各チャネル(<a>)クリックでメニューを閉じる */}
          <div onClick={onNavigate}>
            <SalonReserveIcons salon={s} uid={`reserve-${s.key}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ページ遷移時にメニュー・ポップオーバーを閉じる
  useEffect(() => {
    setReserveOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const solid = !isHome || scrolled || isOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? "bg-white/95 backdrop-blur-md border-b border-gray-100" : ""
      }`}
    >
      {/* ヒーロー上（未スクロール時）は明るい写真で白文字が埋もれるため、薄い暗color scrim を敷いて可読性を確保 */}
      {!solid && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-transparent pointer-events-none"
          aria-hidden
        />
      )}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className={`font-serif text-sm tracking-[0.2em] font-medium transition-colors duration-400 ${
              solid ? "text-site-text" : "text-white"
            }`}
          >
            fleur GROUP
          </Link>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            <nav className="flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-[0.08em] whitespace-nowrap transition-colors duration-400 ${
                    solid
                      ? "text-site-text hover:text-site-accent"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ご予約ボタン + ポップオーバー（PC） */}
            <div className="relative">
              <button
                onClick={() => setReserveOpen((v) => !v)}
                aria-expanded={reserveOpen}
                className="px-5 py-2 rounded-full bg-site-accent text-white text-[11px] tracking-[0.18em] whitespace-nowrap hover:opacity-90 transition-opacity duration-200"
              >
                ご予約
              </button>
              {reserveOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setReserveOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-full mt-3 z-50 w-[340px] bg-white rounded-xl shadow-xl border border-gray-100 p-5">
                    <p className="text-[10px] tracking-[0.3em] text-site-accent uppercase mb-1">Reservation</p>
                    <p className="text-xs text-site-muted mb-4">ご希望の店舗・方法をお選びください</p>
                    <ReserveList onNavigate={() => setReserveOpen(false)} />
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <span
              className={`block w-5 h-px transition-all duration-300 ${solid ? "bg-site-text" : "bg-white"} ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`}
            />
            <span
              className={`block w-5 h-px transition-all duration-300 ${solid ? "bg-site-text" : "bg-white"} ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-px transition-all duration-300 ${solid ? "bg-site-text" : "bg-white"} ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          {/* ご予約（モバイルメニュー先頭） */}
          <div className="px-8 py-5 border-b border-gray-100">
            <p className="text-[10px] tracking-[0.3em] text-site-accent uppercase mb-3">Reservation</p>
            <ReserveList onNavigate={() => setIsOpen(false)} />
          </div>
          <nav className="flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-8 py-4 text-[11px] tracking-[0.2em] text-site-text hover:text-site-accent hover:bg-site-light/50 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
