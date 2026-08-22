import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";

const STRUCTURE = [
  {
    categoryLabel: "美容室",
    en: "Hair Salon",
    salons: [
      { label: "fleurami", match: (p: PostMeta) => p.category === "hair" && p.salon === "fleurami" },
      { label: "Riv. by fleurami", match: (p: PostMeta) => p.category === "hair" && p.salon === "Riv. by fleurami" },
    ],
  },
  {
    categoryLabel: "アイラッシュサロン",
    en: "Eyelash Salon",
    salons: [
      { label: "Raffine", match: (p: PostMeta) => p.category === "eyelash" },
    ],
  },
];

function SalonGrid({ posts, salonLabel }: { posts: PostMeta[]; salonLabel: string }) {
  const shown = posts.filter((p) => p.thumbnail).slice(0, 6);
  if (shown.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] tracking-[0.25em] text-site-text font-medium">{salonLabel}</span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
        {shown.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.category}/${post.slug}`}
            className="group relative aspect-square overflow-hidden bg-site-greige block"
          >
            <Image
              src={post.thumbnail!}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 30vw, (max-width: 1280px) 20vw, 220px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-2">
              <p className="text-white text-[9px] leading-tight line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GalleryGrid({ posts }: { posts: PostMeta[] }) {
  const hasAny = STRUCTURE.some((g) =>
    g.salons.some((s) => posts.filter((p) => p.thumbnail && s.match(p)).length > 0)
  );
  if (!hasAny) return null;

  return (
    <section className="py-16 sm:py-24 glow-surface">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* セクションヘッダー */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Gallery</span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-site-text">施術ギャラリー</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] text-site-muted hover:text-site-accent transition-colors duration-200 group shrink-0"
            >
              <span>ブログへ</span>
              <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* 大分類ごとのブロック */}
        <div className="space-y-14 sm:space-y-20">
          {STRUCTURE.map((group) => {
            const salonSections = group.salons
              .map((s) => ({ label: s.label, posts: posts.filter((p) => p.thumbnail && s.match(p)) }))
              .filter((s) => s.posts.length > 0);
            if (salonSections.length === 0) return null;

            return (
              <div key={group.categoryLabel}>
                {/* 大分類ラベル */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-site-accent" />
                    <span className="font-serif text-xl sm:text-2xl font-light text-site-text">{group.categoryLabel}</span>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-site-muted uppercase">{group.en}</span>
                  <div className="flex-1 h-px bg-site-greige" />
                </div>

                {/* 店舗ごとのグリッド（1店舗でも美容室と同じタイルサイズに揃えるため常に2列） */}
                <div className="grid gap-8 sm:gap-10 sm:grid-cols-2">
                  {salonSections.map((s) => (
                    <SalonGrid key={s.label} posts={s.posts} salonLabel={s.label} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
