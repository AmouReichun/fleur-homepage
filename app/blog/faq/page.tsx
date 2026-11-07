import { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog/posts";
import { breadcrumbSchema } from "@/lib/blog/structured-data";
import { faqPageSchema as groupFaqSchema } from "@/lib/structured-data";

// 2026-11-07 作り直し（Codexと相談）：
//  - 上段：店舗・予約・料金・メニュー選びの「正本FAQ」（lib/structured-data.ts の faqPageSchema）を画面に表示し、同じ中身を構造化データに出す
//  - 下段：ブログ記事のFAQを「店ごと」にまとめ、ほぼ同じ質問は1つにして元記事へリンク（構造化データは出さない＝重複させない）
//  - すべて最初のHTMLで読める形（AIのクローラーはJavaScriptを実行しないことが多いため）

export const metadata: Metadata = {
  title: "よくある質問（FAQ）｜高知市・香南市の美容室とまつげサロン",
  description:
    "fleur GROUP（香南市の美容室fleur ami・高知市の美容室Riv. by fleur ami・高知市はりまや町のまつげ眉毛サロンRaffine）のよくある質問。営業時間・予約・駐車場・料金と、艶カラー・髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・マツエク・眉毛WAXの疑問に店ごとに答えます。",
  alternates: { canonical: "/blog/faq" },
};

type QA = { q: string; a: string };

const SALONS = [
  { key: "Riv. by fleurami", name: "Riv. by fleur ami（高知市南川添の美容室）", short: "Riv. by fleur ami" },
  { key: "fleurami", name: "fleur ami（香南市野市町の美容室）", short: "fleur ami" },
  { key: "Raffine", name: "Raffine（高知市はりまや町のまつげ・眉毛サロン）", short: "Raffine" },
] as const;

const PER_SALON_LIMIT = 40;

function norm(q: string): string {
  return q.replace(/高知県|高知市|香南市|高知|fleur ?ami|Riv\.?( by fleur ami)?|Raffine|ラフィーネ|[？?、。「」（）()\s]/g, "");
}

function classify(q: string, a: string): "shop" | "hair" | "eyelash" {
  if (/予約|駐車|営業時間|定休|店舗|クチコミ|口コミ|料金|グループ|準備|持ち物/.test(q)) return "shop";
  if (/Raffine|まつげ|まつ毛|マツエク|眉|ラッシュ|パリジ|フラットラッシュ|エクパーマ/.test(q + a.slice(0, 40))) return "eyelash";
  return "hair";
}

export default function FaqPage() {
  const group: QA[] = (groupFaqSchema.mainEntity as { name: string; acceptedAnswer: { text: string } }[]).map((m) => ({
    q: m.name,
    a: m.acceptedAnswer.text,
  }));
  const groupSections = [
    { id: "shop", title: "店舗・予約・アクセス・料金", items: group.filter((f) => classify(f.q, f.a) === "shop") },
    { id: "hair", title: "美容室（艶カラー・髪質改善・白髪ぼかし・縮毛矯正など）", items: group.filter((f) => classify(f.q, f.a) === "hair") },
    { id: "eyelash", title: "まつげ・眉毛（まつげパーマ・マツエク・眉毛WAX）", items: group.filter((f) => classify(f.q, f.a) === "eyelash") },
  ];

  // ブログ記事のFAQを店ごとに（新しい記事から。ほぼ同じ質問は最初の1つだけ）
  const posts = getAllPostsMeta();
  const seen = new Set(group.map((f) => norm(f.q)));
  const salonSections = SALONS.map((s, idx) => {
    const items: (QA & { slug: string; title: string; cat: string })[] = [];
    for (const p of posts) {
      if (p.salon !== s.key) continue;
      for (const f of p.faq) {
        const k = norm(f.q);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        items.push({ q: f.q, a: f.a, slug: p.slug, title: p.title, cat: p.category });
        if (items.length >= PER_SALON_LIMIT) break;
      }
      if (items.length >= PER_SALON_LIMIT) break;
    }
    return { ...s, id: `salon-${idx}`, items };
  });

  const nav = [
    ...groupSections.map((g) => ({ id: g.id, label: g.title.split("（")[0] })),
    ...salonSections.map((s) => ({ id: s.id, label: s.short })),
  ];

  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "よくある質問", url: "/blog/faq" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(groupFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #F9F5EF 0%, #F4EDE3 100%)" }}>
        <nav className="px-4 py-3 border-b border-hair-border bg-white/60 backdrop-blur-sm">
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs text-hair-muted">
            <Link href="/" className="hover:text-hair-text transition-colors">トップ</Link>
            <span className="text-hair-border">›</span>
            <span className="text-hair-text">よくある質問</span>
          </div>
        </nav>

        <div className="px-4 py-12 sm:py-16 border-b border-hair-border/60" style={{ background: "linear-gradient(135deg, #F5EDE0 0%, #EAD9C4 100%)" }}>
          <div className="max-w-wide mx-auto">
            <span className="text-xs tracking-[0.2em] text-hair-accent-warm font-cormorant">FAQ — Frequently Asked Questions</span>
            <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mt-3 mb-3 tracking-wide">よくある質問</h1>
            <p className="text-sm text-hair-muted leading-relaxed max-w-2xl">
              高知県香南市の美容室「fleur ami」、高知市の美容室「Riv. by fleur ami」、高知市はりまや町のまつげ・眉毛サロン「Raffine」のよくある質問です。
              営業時間・予約・駐車場・料金と、メニューごとの疑問に店ごとにお答えします。
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 text-xs">
              {nav.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="inline-block rounded-full border border-hair-border bg-white/70 px-3 py-1 text-hair-text hover:bg-white">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-wide mx-auto px-4 py-10 space-y-12">
          {groupSections.map((g) => (
            <section key={g.id} id={g.id}>
              <h2 className="font-mincho text-xl text-hair-text mb-4">{g.title}</h2>
              <dl className="space-y-3">
                {g.items.map((f) => (
                  <div key={f.q} className="rounded-xl bg-white/80 border border-hair-border/60 p-4">
                    <dt className="font-medium text-hair-text text-sm">Q. {f.q}</dt>
                    <dd className="mt-2 text-sm text-hair-muted leading-relaxed">A. {f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          {salonSections.map((s) => (
            <section key={s.key} id={s.id}>
              <h2 className="font-mincho text-xl text-hair-text mb-1">{s.name}のよくある質問</h2>
              <p className="text-xs text-hair-muted mb-4">スタッフのブログ記事から。くわしくは各記事へ。</p>
              <div className="space-y-2">
                {s.items.map((f) => (
                  <details key={f.slug + f.q} className="rounded-xl bg-white/80 border border-hair-border/60 p-4">
                    <summary className="cursor-pointer font-medium text-hair-text text-sm">{f.q}</summary>
                    <p className="mt-2 text-sm text-hair-muted leading-relaxed">{f.a}</p>
                    <Link href={`/blog/${f.cat}/${f.slug}`} className="mt-2 inline-block text-xs text-hair-accent-warm underline">
                      記事：{f.title}
                    </Link>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
