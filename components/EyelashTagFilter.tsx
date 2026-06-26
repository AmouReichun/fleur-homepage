"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";

type Props = { posts: PostMeta[]; activeTag: string };

export default function EyelashTagFilter({ posts, activeTag }: Props) {
  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* アクティブタグ */}
      {activeTag && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-eye-muted">タグ：</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-eye-accent-soft text-eye-accent">
            {activeTag}
            <Link
              href="/blog/eyelash"
              className="ml-0.5 text-eye-muted hover:text-eye-accent transition-colors leading-none"
              aria-label="タグをクリア"
            >
              ×
            </Link>
          </span>
          <span className="text-xs text-eye-muted">{filtered.length}件</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-eye-muted text-sm">該当する記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} world="eyelash" />
          ))}
        </div>
      )}
    </>
  );
}
