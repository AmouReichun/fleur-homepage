import Link from "next/link";
import { getContent } from "@/lib/content";
import AdminSidebar from "./components/AdminSidebar";
import SalonOrderEditor from "./components/SalonOrderEditor";

const otherSections = [
  { key: "news", label: "最新情報", desc: "キャンペーン・お知らせの追加・編集・削除", href: "/admin/news" },
  { key: "hero", label: "ヒーローセクション", desc: "トップページのキャッチコピー・画像・ボタン", href: "/admin/hero" },
  { key: "menus", label: "メニュー・価格", desc: "各店舗のメニューと価格", href: "/admin/menus" },
  { key: "faq", label: "よくある質問", desc: "トップページのFAQセクション", href: "/admin/faq" },
  { key: "staff", label: "スタッフ紹介", desc: "スタッフの情報・写真・紹介文", href: "/admin/staff" },
  { key: "recruit", label: "採用情報", desc: "求人情報・待遇・応募方法", href: "/admin/recruit" },
  { key: "company", label: "会社概要", desc: "グループの基本情報", href: "/admin/company" },
];

export default function AdminPage() {
  const content = getContent();
  const salonTypes: Record<string, string> = {
    riv: content.salons.riv.salonType,
    fleurami: content.salons.fleurami.salonType,
    raffine: content.salons.raffine.salonType,
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl space-y-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#B8956A] uppercase mb-2">Dashboard</p>
            <h1 className="text-2xl font-semibold text-white">コンテンツ管理</h1>
          </div>

          {/* 店舗管理（並び替え付き） */}
          <section>
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">店舗管理</h2>
            <SalonOrderEditor initialOrder={content.salonOrder} salonTypes={salonTypes} />
          </section>

          {/* その他セクション */}
          <section>
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">その他のコンテンツ</h2>
            <div className="grid grid-cols-1 gap-2">
              {otherSections.map((section) => (
                <Link
                  key={section.key}
                  href={section.href}
                  className="flex items-center justify-between bg-[#242424] border border-[#333] rounded-sm px-5 py-4 hover:border-[#B8956A] transition-colors duration-200 group"
                >
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-[#B8956A] transition-colors">
                      {section.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{section.desc}</p>
                  </div>
                  <span className="text-gray-500 group-hover:text-[#B8956A] transition-colors">&rarr;</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
