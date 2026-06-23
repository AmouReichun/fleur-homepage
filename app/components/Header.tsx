"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/salon", label: "店舗案内" },
  { href: "/menu", label: "メニュー" },
  { href: "/staff", label: "スタッフ" },
  { href: "/news", label: "最新情報" },
  { href: "/recruit", label: "採用情報" },
  { href: "/company", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const solid = !isHome || scrolled || isOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid ? "bg-white/95 backdrop-blur-md border-b border-gray-100" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            href="/"
            className={`font-serif text-sm tracking-[0.2em] font-medium transition-colors duration-400 ${
              solid ? "text-site-text" : "text-white"
            }`}
          >
            fleur GROUP
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] tracking-[0.08em] whitespace-nowrap transition-colors duration-400 ${
                  solid
                    ? "text-site-text hover:text-site-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

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
