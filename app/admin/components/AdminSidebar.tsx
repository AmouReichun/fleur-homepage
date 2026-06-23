"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "../actions";

const hairSalons = [
  { key: "salon-fleurami", label: "fleurami", href: "/admin/salon/fleurami" },
  { key: "salon-riv", label: "Riv.by fleurami", href: "/admin/salon/riv" },
];
const eyelashSalons = [
  { key: "salon-raffine", label: "Raffine", href: "/admin/salon/raffine" },
];
const otherSections = [
  { key: "news", label: "最新情報", href: "/admin/news" },
  { key: "quicklinks", label: "クイックリンク", href: "/admin/quicklinks" },
  { key: "popular-menus", label: "人気メニュー（TOP）", href: "/admin/popular-menus" },
  { key: "menus", label: "メニュー・価格", href: "/admin/menus" },
  { key: "faq", label: "よくある質問", href: "/admin/faq" },
  { key: "staff", label: "スタッフ紹介", href: "/admin/staff" },
  { key: "recruit", label: "採用情報", href: "/admin/recruit" },
  { key: "company", label: "会社概要", href: "/admin/company" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        active
          ? "bg-[#B8956A] text-white font-medium shadow-sm"
          : "text-[#555] hover:bg-[#EDE9E4] hover:text-[#1A1A1A]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-[#E8E4E0] flex flex-col h-screen sticky top-0 shadow-sm">
      {/* ロゴ */}
      <div className="px-5 py-5 border-b border-[#E8E4E0]">
        <Link href="/admin" className="block">
          <p className="text-[10px] tracking-[0.25em] text-[#B8956A] uppercase font-medium mb-0.5">Admin</p>
          <p className="text-base font-semibold text-[#1A1A1A]">fleurami GROUP</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* トップページ */}
        <div>
          <NavLink href="/admin/hero" label="🏠　トップページ（ヒーロー）" active={pathname === "/admin/hero"} />
        </div>

        {/* 美容室 */}
        <div>
          <p className="px-3 text-[11px] text-[#B8956A] font-semibold uppercase tracking-wider mb-1.5">
            💇 美容室
          </p>
          <div className="space-y-0.5">
            {hairSalons.map((s) => (
              <NavLink key={s.key} href={s.href} label={s.label} active={pathname === s.href} />
            ))}
          </div>
        </div>

        {/* アイラッシュ */}
        <div>
          <p className="px-3 text-[11px] text-pink-500 font-semibold uppercase tracking-wider mb-1.5">
            ✨ アイラッシュ
          </p>
          <div className="space-y-0.5">
            {eyelashSalons.map((s) => (
              <NavLink key={s.key} href={s.href} label={s.label} active={pathname === s.href} />
            ))}
          </div>
        </div>

        {/* その他 */}
        <div>
          <p className="px-3 text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-1.5">
            📄 その他のコンテンツ
          </p>
          <div className="space-y-0.5">
            {otherSections.map((s) => (
              <NavLink key={s.key} href={s.href} label={s.label} active={pathname === s.href} />
            ))}
          </div>
        </div>
      </nav>

      {/* ログアウト */}
      <div className="px-4 py-4 border-t border-[#E8E4E0]">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-xs text-[#999] hover:text-red-500 py-2 transition-colors duration-150 text-left px-3"
          >
            ログアウト →
          </button>
        </form>
      </div>
    </aside>
  );
}
