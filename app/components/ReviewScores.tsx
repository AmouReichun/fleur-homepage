// Googleクチコミ集計スコア表示（個別レビューは表示しない）
// 評価が変わった場合はここの数値を更新する

const RATINGS = [
  {
    name: "fleur ami",
    sub: "香南市 · ヘアサロン",
    rating: 4.67,
    count: 388,
    mapUrl: "https://g.page/r/CVY6rOf-UWbxEAE",
  },
  {
    name: "Riv. by fleur ami",
    sub: "高知市 · ヘアサロン",
    rating: 4.65,
    count: 674,
    mapUrl: "https://g.page/r/CdEFX3xXBBF7EAE",
  },
  {
    name: "Raffine",
    sub: "高知市はりまや橋 · アイラッシュ",
    rating: 4.82,
    count: 200,
    mapUrl: "https://g.page/r/CbD8dVZGgEeuEAE",
  },
];

function StarBar({ rating }: { rating: number }) {
  const pct = Math.round((rating / 5) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-20 h-3.5 overflow-hidden">
        {/* 背景（空星） */}
        <div className="absolute inset-0 flex gap-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 bg-site-greige rounded-sm" />
          ))}
        </div>
        {/* 塗り（塗り星） */}
        <div
          className="absolute inset-y-0 left-0 flex gap-px overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 bg-amber-400 rounded-sm" />
          ))}
        </div>
      </div>
      <span className="text-[11px] font-medium text-amber-500 tabular-nums">{rating.toFixed(2)}</span>
    </div>
  );
}

export default function ReviewScores() {
  const total = RATINGS.reduce((s, r) => s + r.count, 0);

  return (
    <section className="py-16 sm:py-24 bg-site-bg border-t border-site-greige">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* ヘッダー */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Google Review</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-site-text mb-2">お客様の評価</h2>
          <p className="text-xs text-site-muted tracking-wide">
            3店舗合計 <span className="font-medium text-site-text">{total.toLocaleString()}件以上</span> のGoogleクチコミ
          </p>
        </div>

        {/* 3サロン */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {RATINGS.map((r) => (
            <a
              key={r.name}
              href={r.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 p-6 bg-white border border-site-greige hover:border-site-accent/40 hover:shadow-sm transition-all duration-300"
            >
              <div>
                <p className="font-serif text-lg font-light text-site-text group-hover:text-site-accent transition-colors">{r.name}</p>
                <p className="text-[10px] text-site-muted mt-0.5">{r.sub}</p>
              </div>

              <StarBar rating={r.rating} />

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light text-site-text tabular-nums">{r.rating.toFixed(2)}</span>
                <span className="text-xs text-site-muted">/ 5  ·  {r.count}件{r.count >= 200 && "以上"}</span>
              </div>

              <span className="text-[10px] tracking-[0.2em] text-site-accent/70 group-hover:text-site-accent transition-colors mt-auto">
                Googleマップで見る →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
