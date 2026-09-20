import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog/posts";

type Props = {
  tags: string[];
  category?: "hair" | "eyelash" | "both";
  limit?: number;
};

export default function GuideRelatedArticles({ tags, category = "both", limit = 6 }: Props) {
  const hair = category !== "eyelash" ? getAllPosts("hair") : [];
  const eyelash = category !== "hair" ? getAllPosts("eyelash") : [];

  type ScoredItem = { post: (typeof hair)[number]; world: "hair" | "eyelash"; score: number };
  const scored: ScoredItem[] = [
    ...hair.map((p) => ({ post: p, world: "hair" as const, score: tags.filter((t) => p.tags.includes(t)).length })),
    ...eyelash.map((p) => ({ post: p, world: "eyelash" as const, score: tags.filter((t) => p.tags.includes(t)).length })),
  ]
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit);

  if (scored.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-site-greige">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-xs tracking-[0.3em] text-site-accent mb-3 uppercase">Related Articles</p>
        <h2 className="font-serif text-xl font-semibold text-site-text mb-8">関連する施術事例・コラム</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {scored.map(({ post, world }) => (
            <Link
              key={post.slug}
              href={`/blog/${world}/${post.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-site-light mb-3">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-site-greige" />
                )}
              </div>
              <p className="text-xs text-site-muted mb-1">{post.date}</p>
              <p className="text-sm font-medium text-site-text group-hover:text-site-accent transition-colors line-clamp-2 leading-relaxed">
                {post.title}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={`/blog/${category === "eyelash" ? "eyelash" : "hair"}`}
            className="text-xs tracking-wider text-site-accent border border-site-accent px-6 py-2 hover:bg-site-accent hover:text-white transition-colors"
          >
            {category === "eyelash" ? "アイラッシュ記事をもっと見る" : category === "hair" ? "ヘア記事をもっと見る" : "ブログをもっと見る"}
          </Link>
        </div>
      </div>
    </section>
  );
}
