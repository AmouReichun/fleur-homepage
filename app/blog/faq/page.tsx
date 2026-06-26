import { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog/posts";
import { breadcrumbSchema } from "@/lib/blog/structured-data";
import FaqTabs, { type FaqEntry } from "@/components/FaqTabs";

export const metadata: Metadata = {
  title: "よくある質問（FAQ）",
  description:
    "高知のヘアサロン（fleur ami・Riv.）とまつげ・まゆげサロン（Raffine）に関するよくある質問。ヘアカラー・縮毛矯正・髪質改善・まつげパーマ・マツエクについて解説します。",
  alternates: { canonical: "/blog/faq" },
};

export default function FaqPage() {
  const posts = getAllPostsMeta();

  const hairFaqs: FaqEntry[] = [];
  const eyelashFaqs: FaqEntry[] = [];

  for (const p of posts) {
    for (const f of p.faq) {
      const entry: FaqEntry = {
        q: f.q,
        a: f.a,
        sourceTitle: p.title,
        sourceSlug: p.slug,
        category: p.category,
        tags: p.tags,
      };
      if (p.category === "hair") hairFaqs.push(entry);
      else eyelashFaqs.push(entry);
    }
  }

  const allFaqs = [...hairFaqs, ...eyelashFaqs];

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "よくある質問", url: "/blog/faq" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }}
      />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #F9F5EF 0%, #F4EDE3 100%)" }}>
        {/* Breadcrumb */}
        <nav className="px-4 py-3 border-b border-hair-border bg-white/60 backdrop-blur-sm">
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs text-hair-muted">
            <Link href="/" className="hover:text-hair-text transition-colors">トップ</Link>
            <span className="text-hair-border">›</span>
            <span className="text-hair-text">よくある質問</span>
          </div>
        </nav>

        {/* Hero */}
        <div
          className="px-4 py-12 sm:py-16 border-b border-hair-border/60"
          style={{ background: "linear-gradient(135deg, #F5EDE0 0%, #EAD9C4 100%)" }}
        >
          <div className="max-w-wide mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
              <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">
                FAQ — Frequently Asked Questions
              </span>
              <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
            </div>
            <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3 tracking-wide">
              よくある質問
            </h1>
            <p className="text-sm text-hair-muted leading-relaxed max-w-xl">
              フルールグループの各サロンに寄せられるよくある質問をまとめました。
              スタイリスト・アイリストが詳しく回答しています。
            </p>
            <p className="text-xs text-hair-muted mt-3">
              全 {allFaqs.length} 件（ヘア {hairFaqs.length}件 / アイラッシュ {eyelashFaqs.length}件）
            </p>
          </div>
        </div>

        {/* タブ + FAQリスト */}
        <FaqTabs hairFaqs={hairFaqs} eyelashFaqs={eyelashFaqs} />
      </div>
    </>
  );
}
