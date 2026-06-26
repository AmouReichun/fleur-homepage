"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "../actions";
import type { SiteContent } from "@/lib/content";
import NavLink from "./NavLink";

const HAIR_TYPE = "美容室";
const EYELASH_TYPE = "アイラッシュサロン";

const otherSections = [
  { key: "news", label: "最新情報", href: "/admin/news" },
  { key: "quicklinks", label: "クイックリンク", href: "/admin/quicklinks" },
  { key: "popular-menus", label: "人気メニュー（TOP）", href: "/admin/popular-menus" },
  { key: "menus", label: "メニュー・価格", href: "/admin/menus" },
  { key: "faq", label: "よくある質問", href: "/admin/faq" },
  { key: "staff", label: "スタッフ紹介", href: "/admin/staff" },
  { key: "recruit", label: "採用情報", href: "/admin/recruit" },
  { key: "company", label: "会社概要", href: "/admin/company" },
  { key: "blog", label: "📝　ブログ管理", href: "/admin/blog" },
];

export default function AdminSidebar({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const hairSalons = content.salonOrder
    .filter((k) => content.salons[k]?.salonType === HAIR_TYPE)
    .map((k) => ({ key: k, name: content.salons[k].name, href: `/admin/salon/${k}` }));
  const eyelashSalons = content.salonOrder
    .filter((k) => content.salons[k]?.salonType === EYELASH_TYPE)
    .map((k) => ({ key: k, name: content.salons[k].name, href: `/admin/salon/${k}` }));
  const otherSalons = content.salonOrder
    .filter((k) => content.salons[k] && content.salons[k].salonType !== HAIR_TYPE && content.salons[k].salonType !== EYELASH_TYPE)
    .map((k) => ({ key: k, name: content.salons[k].name, href: `/admin/salon/${k}` }));

  return (
    <>
      {/* モバイル用ハンバーガーボタン */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="メニューを開く"
        className="md:hidden fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-[#E8E4E0] shadow-sm text-[#1A1A1A] active:bg-[#F4F2EF]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* モバイル用オーバーレイ */}
      {open && (
        <div
          onClick={close}
          aria-hidden="true"
          className="md:hidden fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-white border-r border-[#E8E4E0] flex flex-col h-screen shadow-lg transform transition-transform duration-200 ease-out md:static md:z-auto md:w-60 md:max-w-none md:translate-x-0 md:shadow-sm md:sticky md:top-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ロゴ */}
        <div className="px-5 py-5 border-b border-[#E8E4E0] flex items-center justify-between">
          <Link href="/admin" onClick={close} className="block">
            <p className="text-[10px] tracking-[0.25em] text-[#B8956A] uppercase font-medium mb-0.5">Admin</p>
            <p className="text-base font-semibold text-[#1A1A1A]">fleur GROUP</p>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="メニューを閉じる"
            className="md:hidden text-[#999] hover:text-[#1A1A1A] p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* トップページ */}
          <div>
            <NavLink href="/admin/hero" label="🏠　トップページ（ヒーロー）" onClick={close} />
          </div>

          {/* 美容室 */}
          {hairSalons.length > 0 && (
            <div>
              <p className="px-3 text-[11px] text-[#B8956A] font-semibold uppercase tracking-wider mb-1.5">
                💇 美容室
              </p>
              <div className="space-y-0.5">
                {hairSalons.map((s) => (
                  <NavLink key={s.key} href={s.href} label={s.name} onClick={close} />
                ))}
              </div>
            </div>
          )}

          {/* アイラッシュ */}
          {eyelashSalons.length > 0 && (
            <div>
              <p className="px-3 text-[11px] text-pink-500 font-semibold uppercase tracking-wider mb-1.5">
                ✨ アイラッシュ
              </p>
              <div className="space-y-0.5">
                {eyelashSalons.map((s) => (
                  <NavLink key={s.key} href={s.href} label={s.name} onClick={close} />
                ))}
              </div>
            </div>
          )}

          {/* その他業態 */}
          {otherSalons.length > 0 && (
            <div>
              <p className="px-3 text-[11px] text-[#888] font-semibold uppercase tracking-wider mb-1.5">
                🏪 その他店舗
              </p>
              <div className="space-y-0.5">
                {otherSalons.map((s) => (
                  <NavLink key={s.key} href={s.href} label={s.name} onClick={close} />
                ))}
              </div>
            </div>
          )}

          {/* その他コンテンツ */}
          <div>
            <p className="px-3 text-[11px] text-[#999] font-semibold uppercase tracking-wider mb-1.5">
              📄 その他のコンテンツ
            </p>
            <div className="space-y-0.5">
              {otherSections.map((s) => (
                <NavLink key={s.key} href={s.href} label={s.label} onClick={close} />
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
    </>
  );
}
