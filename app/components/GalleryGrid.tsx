import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";

export default function GalleryGrid({ posts }: { posts: PostMeta[] }) {
  const shown = posts.filter((p) => p.thumbnail).slice(0, 9);
  if (shown.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-site-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
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

        {/* 3×3 grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
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
                sizes="(max-width: 640px) 33vw, (max-width: 1280px) 25vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* ホバーオーバーレイ */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                <p className="text-white text-[10px] leading-tight line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
