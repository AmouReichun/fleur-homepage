import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog/posts";

type Props = {
  current: PostMeta;
  all: PostMeta[];
  world: "hair" | "eyelash";
};

function scoreRelated(current: PostMeta, candidate: PostMeta): number {
  if (candidate.slug === current.slug) return -1;
  let score = 0;
  if (candidate.salon === current.salon) score += 2;
  for (const tag of current.tags) {
    if (candidate.tags.includes(tag)) score += 1;
  }
  return score;
}

export default function RelatedArticles({ current, all, world }: Props) {
  const related = all
    .map((p) => ({ post: p, score: scoreRelated(current, p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  if (related.length === 0) return null;

  const isHair = world === "hair";

  return (
    <div className="mt-12 pt-10" style={{ borderTop: `1px solid ${isHair ? "#DDD0BE" : "#EDD9DC"}` }}>
      <p
        className={`text-[10px] tracking-[0.3em] uppercase mb-5 ${isHair ? "font-cormorant text-hair-accent-warm" : "font-jakarta text-eye-accent"}`}
      >
        Related Articles
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${world}/${post.slug}`}
            className="group block"
          >
            <div
              className="relative aspect-[4/3] overflow-hidden mb-2"
              style={{ borderRadius: isHair ? "2px" : "8px" }}
            >
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 240px"
              />
            </div>
            <p
              className={`text-[11px] leading-snug line-clamp-2 ${isHair ? "font-mincho text-hair-text" : "font-kaku text-eye-text"}`}
            >
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
