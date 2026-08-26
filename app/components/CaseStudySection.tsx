import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import type { PostMeta } from "@/lib/blog/posts";

/**
 * 「最新の施術事例」を自動表示する共通セクション。
 * メニューLP・スタッフページ・店舗ページで、店舗×メニュー×スタッフの一次情報（症例）へ内部リンクする。
 * posts が空なら何も描画しない（空セクション・リンク切れを防ぐ）。
 */
export default function CaseStudySection({
  posts,
  world,
  heading,
  subheading,
  moreHref,
  moreLabel,
  bg = "bg-white",
}: {
  posts: PostMeta[];
  world: "hair" | "eyelash";
  heading: string;
  subheading?: string;
  moreHref?: string;
  moreLabel?: string;
  bg?: string;
}) {
  if (!posts || posts.length === 0) return null;
  return (
    <section className={`py-12 sm:py-16 ${bg} border-t border-site-greige`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-2 text-center">{heading}</h2>
        {subheading && <p className="text-xs text-site-muted text-center mb-8">{subheading}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <ArticleCard key={post.slug} post={post} world={world} priority={i < 3} />
          ))}
        </div>
        {moreHref && (
          <div className="text-center mt-8">
            <Link href={moreHref} className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-site-text hover:text-site-accent transition-colors group">
              <span>{moreLabel ?? "施術事例をもっと見る"}</span>
              <span className="w-6 h-px bg-current group-hover:w-9 transition-all duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
