import { salonCta } from "@/lib/salon-cta";

// Googleクチコミ投稿への導線（MEO強化）。対象店舗のキー配列を渡す。
export default function GoogleReviewCTA({
  salonKeys,
  heading = "クチコミのお願い",
}: {
  salonKeys: string[];
  heading?: string;
}) {
  const items = salonKeys.map(salonCta).filter(Boolean) as {
    name: string;
    reviewUrl: string;
    mapsUrl: string;
  }[];
  if (items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-site-greige">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Review</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3">{heading}</h2>
        <p className="text-sm text-site-muted leading-relaxed mb-8">
          ご来店いただいた感想を Google に投稿いただけると、とても励みになります。
          これからサロンを探す方の参考にもなります。
        </p>
        <div className="space-y-3 max-w-sm mx-auto">
          {items.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-3 border border-site-greige p-4">
              <span className="text-sm font-medium text-site-text">{s.name}</span>
              <a
                href={s.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-white bg-site-accent px-4 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                ★ クチコミを書く
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
