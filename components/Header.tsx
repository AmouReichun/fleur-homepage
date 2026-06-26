"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/blog/hair", label: "ヘア", shortLabel: "ヘア" },
  { href: "/blog/eyelash", label: "アイラッシュ", shortLabel: "まつげ" },
  { href: "/blog/faq", label: "FAQ", shortLabel: "FAQ" },
  { href: "/blog/about", label: "グループについて", shortLabel: "概要" },
];

export default function Header() {
  const pathname = usePathname();
  const isEyelash = pathname.startsWith("/blog/eyelash");

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-group-border">
      <div className="max-w-wide mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className={`text-sm tracking-widest font-medium ${
              isEyelash ? "text-eye-accent font-kaku" : "text-hair-accent font-mincho"
            }`}
          >
            fleur group
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          <Link
            href="/blog/search"
            className="p-2 rounded transition-colors text-group-muted hover:text-group-text shrink-0"
            aria-label="記事を検索"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const isEyelashLink = item.href === "/blog/eyelash";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-1.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors whitespace-nowrap ${
                  active
                    ? isEyelashLink
                      ? "bg-eye-accent-soft text-eye-accent font-medium"
                      : "bg-hair-accent/10 text-hair-accent font-medium"
                    : "text-group-muted hover:text-group-text"
                }`}
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <a
            href="https://www.fleurami-group.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-1.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded transition-colors text-group-muted hover:text-group-text whitespace-nowrap"
          >
            <span className="sm:hidden">公式</span>
            <span className="hidden sm:inline">公式サイト</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
