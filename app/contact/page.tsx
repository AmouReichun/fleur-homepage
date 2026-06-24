import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import ContactForm from "@/app/components/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "fleur GROUPへのお問い合わせはこちら。店舗に関するご質問、採用に関するご相談など、お気軽にお問い合わせください。",
  alternates: { canonical: "https://fleurami-group.jp/contact" },
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "お問い合わせ", url: "https://fleurami-group.jp/contact" },
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
            <h2 className="font-serif text-lg font-semibold text-site-text mb-4 text-center">ご予約・各店舗へのお問い合わせ</h2>
            <div className="grid grid-cols-1 gap-3">
              {salonOrder.map((key) => {
                const s = salons[key as keyof typeof salons];
                if (!s) return null;
                return (
                  <a
                    key={key}
                    href={s.hotpepperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-site-greige px-5 py-4 hover:border-site-accent transition-colors duration-200 group"
                  >
                    <div>
                      <p className="text-xs text-site-muted mb-0.5">{s.area}</p>
                      <p className="font-serif text-sm font-semibold">{s.name}</p>
                    </div>
                    <span className="text-xs text-site-accent group-hover:underline">ホットペッパーで予約 &rarr;</span>
                  </a>
                );
              })}
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
