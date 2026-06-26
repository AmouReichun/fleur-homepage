import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog/posts";

function tagHref(world: "hair" | "eyelash", tag: string) {
  return `/${world}?tag=${encodeURIComponent(tag)}`;
}

type Props = {
  post: PostMeta;
  world: "hair" | "eyelash";
  priority?: boolean;
};

export default function ArticleCard({ post, world, priority = false }: Props) {
  const isEyelash = world === "eyelash";
  const href = `/${world}/${post.slug}`;

  if (isEyelash) {
    return (
      <article className="group rounded-2xl overflow-hidden bg-eye-surface shadow-sm hover:shadow-md transition-shadow border border-eye-border/60">
        <Link href={href} className="block">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#F5E6EA]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* New バッジ（最新2件に付ける簡易判定） */}
            <span className="absolute top-3 left-3 text-[10px] tracking-widest font-jakarta uppercase bg-eye-accent text-white px-2.5 py-1 rounded-full">
              Raffine
            </span>
          </div>
        </Link>

        <div className="p-4 sm:p-5">
          {/* タグ */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={tagHref(world, tag)}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-eye-accent-soft text-eye-accent hover:opacity-70 transition-opacity"
              >
                {tag}
              </Link>
            ))}
          </div>

          <Link href={href}>
            <h2 className="font-kaku text-sm sm:text-[0.95rem] font-medium leading-snug text-eye-text group-hover:text-eye-accent transition-colors mb-2">
              {post.title}
            </h2>
          </Link>

          <p className="text-xs text-eye-muted leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-3">
            <p className="text-[11px] text-eye-muted">{post.date}</p>
            <Link
              href={href}
              className="text-[11px] text-eye-accent flex items-center gap-1 hover:gap-2 transition-all"
            >
              続きを読む <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Hair world — 木目調
  return (
    <article
      className="group overflow-hidden border border-hair-border transition-shadow hover:shadow-md"
      style={{
        borderRadius: "2px",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5EF 100%)",
      }}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EAD9C4]">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        {/* サロン名 */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span
            className="text-[11px] px-2.5 py-0.5 border border-hair-accent-warm/40 text-hair-accent-warm font-cormorant tracking-widest bg-white/70"
            style={{ borderRadius: "1px" }}
          >
            {post.salon}
          </span>
          {post.tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={tagHref(world, tag)}
              className="text-[11px] text-hair-muted tracking-wide hover:text-hair-accent-warm transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <Link href={href}>
          <h2 className="font-mincho text-sm sm:text-[0.925rem] font-medium leading-snug mb-2 text-hair-text group-hover:text-hair-accent-warm transition-colors tracking-wide">
            {post.title}
          </h2>
        </Link>

        <p className="text-xs text-hair-muted leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-hair-muted font-dm tracking-wide">{post.date}</p>
          <Link
            href={href}
            className="text-[11px] text-hair-accent font-cormorant tracking-wider hover:text-hair-accent-warm transition-colors flex items-center gap-1"
          >
            続きを読む →
          </Link>
        </div>
      </div>
    </article>
  );
}
