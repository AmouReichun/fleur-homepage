"use client";

import { useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";

const FILTERS = [
  { label: "すべて", value: "all" },
  { label: "fleur ami", value: "fleur ami" },
  { label: "Riv. by fleur ami", value: "Riv. by fleur ami" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

type Props = { posts: PostMeta[]; activeTag: string };

export default function HairSalonFilter({ posts, activeTag }: Props) {
  const [salon, setSalon] = useState<FilterValue>("all");

  const filtered = posts
    .filter((p) => salon === "all" || p.salon === salon)
    .filter((p) => !activeTag || p.tags.includes(activeTag));

  return (
    <>
      {/* サロンフィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSalon(value)}
            className={`text-xs px-4 py-1.5 border tracking-wide transition-colors ${
              salon === value
                ? "bg-hair-accent-warm text-white border-hair-accent-warm"
                : "text-hair-accent-warm border-hair-accent-warm/40 bg-white/60 hover:bg-hair-accent-warm/10"
            }`}
            style={{ borderRadius: "2px" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* アクティブタグ */}
      {activeTag && (
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs text-hair-muted">タグ：</span>
          <span
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1 border border-hair-accent-warm text-hair-accent-warm bg-hair-accent-warm/5"
            style={{ borderRadius: "2px" }}
          >
            #{activeTag}
            <Link
              href="/blog/hair"
              className="ml-0.5 text-hair-muted hover:text-hair-accent-warm transition-colors leading-none"
              aria-label="タグをクリア"
            >
              ×
            </Link>
          </span>
          <span className="text-xs text-hair-muted">{filtered.length}件</span>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-hair-muted text-sm">該当する記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} world="hair" />
          ))}
        </div>
      )}
    </>
  );
}
