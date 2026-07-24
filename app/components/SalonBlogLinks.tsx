import { getAllPostsMeta } from "@/lib/blog/posts";

type BlogPost = {
  title: string;
  slug: string;
  category: "hair" | "eyelash";
  salon: string;
  date: string;
  excerpt: string;
  thumbnail: string;
};

const HUBS: Record<string, { hub: string; label: string }> = {
  fleurami: { hub: "/hair/fleur-ami", label: "fleuramiのブログ一覧" },
  riv: { hub: "/hair/riv", label: "Riv. by fleuramiのブログ一覧" },
  raffine: { hub: "/eyelash/raffine", label: "Raffineのブログ一覧" },
};

/**
 * 店舗ページに「この店舗の最新ブログ」を表示（内部リンク強化 / 店舗→ブログ）。
 * ブログAPIから該当店舗の記事を取得。アンカーは記事タイトル（具体的キーワード）。
 */
export default async function SalonBlogLinks({
  salonKey,
  salonName,
  area,
}: {
  salonKey: string;
  salonName: string;
  area: string;
}) {
  const world: "hair" | "eyelash" = salonKey === "raffine" ? "eyelash" : "hair";

  // ブログ統合: ローカルの記事メタから直接取得
  const posts = getAllPostsMeta()
    .filter((p) => p.category === world)
    .slice(0, 20) as unknown as BlogPost[];

  const isRiv = (p: BlogPost) => p.salon?.startsWith("Riv");
  const filtered =
    salonKey === "riv"
      ? posts.filter(isRiv)
      : salonKey === "fleurami"
      ? posts.filter((p) => p.salon?.includes("fleur ami") && !isRiv(p))
      : posts; // raffine = 全eyelash
  const list = filtered.slice(0, 4);

  const hub = HUBS[salonKey];
  if (list.length === 0) {
    // 記事が取得できない場合はハブのみ案内（リンク切れ防止）
    if (!hub) return null;
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-6">{salonName}のブログ</h2>
          <a href={`/blog${hub.hub}`}
            className="inline-block border border-site-accent text-site-accent px-8 py-3 text-sm font-medium tracking-wider hover:bg-site-light transition-all">
            {area}・{salonName}の症例ブログを見る →
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-2 text-center">
          {salonName}の最新ブログ
        </h2>
        <p className="text-xs text-site-muted text-center mb-8">{area}・{world === "hair" ? "美容室" : "アイラッシュ"}の症例・スタイル記事</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((p) => (
            <a
              key={p.slug}
              href={`/blog/${p.category}/${p.slug}`}
              className="group flex gap-4 border border-site-greige bg-white hover:border-site-accent transition-colors p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.thumbnail.startsWith("http") ? p.thumbnail : `${p.thumbnail}`} alt={p.title} className="w-20 h-20 object-cover flex-shrink-0" loading="lazy" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-site-text leading-snug line-clamp-3 group-hover:text-site-accent transition-colors">{p.title}</p>
                <p className="text-[10px] text-site-muted mt-1">{p.date}</p>
              </div>
            </a>
          ))}
        </div>

        {hub && (
          <div className="text-center mt-8">
            <a href={`/blog${hub.hub}`}
              className="inline-flex items-center gap-2 text-sm text-site-accent hover:gap-3 transition-all font-medium">
              {area}・{salonName}の症例ブログをもっと見る →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
