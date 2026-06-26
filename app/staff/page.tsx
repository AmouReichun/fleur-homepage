import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import StaffTabs from "@/app/components/StaffTabs";
import ReservationChannels from "@/app/components/ReservationChannels";

export const metadata: Metadata = {
  title: "スタッフ紹介",
  description:
    "fleur GROUPのスタッフ紹介。fleurami・Riv.by fleurami・Raffineで活躍するスタイリスト・アイリストをご紹介します。",
  alternates: { canonical: "https://fleurami-group.jp/staff" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "スタッフ紹介", url: "https://fleurami-group.jp/staff" },
];

export default async function StaffPage() {
  const content = await getContentCached();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      {/* ページヘッダー */}
      <div className="pt-14 sm:pt-16 bg-white border-b border-site-greige">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
          <nav className="text-[10px] text-site-muted mb-6 tracking-wider">
            <Link href="/" className="hover:text-site-accent transition-colors">ホーム</Link>
            <span className="mx-2">/</span>
            <span>スタッフ紹介</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Staff</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-site-text">スタッフ紹介</h1>
        </div>
      </div>

      {/* タブ＋グリッド */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <StaffTabs staff={content.staff} />
        </div>
      </section>

      {/* 予約 CTA（全チャネル） */}
      <section className="py-16 bg-site-light border-t border-site-greige">
        <div className="px-6 sm:px-10 lg:px-16">
          <ReservationChannels
            salonOrder={content.salonOrder}
            salons={content.salons as unknown as Record<string, import("@/lib/content").SalonContent>}
            heading="ご指名・ご予約はこちら"
            note="スタッフへのご指名はご予約時にお申し付けください"
            groupByType
          />
        </div>
      </section>
    </>
  );
}
