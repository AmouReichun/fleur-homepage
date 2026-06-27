import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import ContactForm from "@/app/components/ContactForm";
import ReservationChannels from "@/app/components/ReservationChannels";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "fleur GROUPへのお問い合わせはこちら。店舗に関するご質問、採用に関するご相談など、お気軽にお問い合わせください。",
  alternates: { canonical: "https://fleur-group.jp/contact" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "お問い合わせ", url: "https://fleur-group.jp/contact" },
];

export default async function ContactPage() {
  const { salonOrder, salons } = await getContentCached();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>お問い合わせ</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Contact</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">お問い合わせ</h1>
        </div>
      </div>

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-site-muted leading-relaxed mb-8 text-center">
            店舗に関するご質問、採用に関するご相談など、お気軽にお問い合わせください。
            通常2〜3営業日以内にご返信いたします。
          </p>

          <div className="mb-10">
            <ReservationChannels
              salonOrder={salonOrder}
              salons={salons as unknown as Record<string, import("@/lib/content").SalonContent>}
              heading="ご予約・各店舗へのお問い合わせ"
              note="ご希望の方法でご予約・お問い合わせいただけます"
              groupByType
            />
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
