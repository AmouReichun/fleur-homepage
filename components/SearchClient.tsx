"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";

type Props = { posts: PostMeta[]; initialQuery?: string };

export default function SearchClient({ posts, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter((p) => {
      const haystack = [p.title, p.excerpt, p.salon, ...p.tags, p.question, p.answer_summary]
        .join(" ")
        .toLowerCase();
      return q.split(/\s+/).every((w) => haystack.includes(w));
    });
  }, [query, posts]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-mincho text-2xl text-group-text mb-8 tracking-wide">記事を検索</h1>

      {/* 検索入力 */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-group-muted pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <circle cx={11} cy={11} r={8} />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードを入力（例：白髪ぼかし、高知、まつげパーマ）"
          className="w-full pl-11 pr-4 py-3 text-sm border border-group-border rounded-sm bg-white text-group-text placeholder:text-group-muted focus:outline-none focus:border-hair-accent transition-colors"
          autoFocus
        />
      </div>

      {/* 結果 */}
      {query.trim() === "" ? (
        <p className="text-sm text-group-muted">キーワードを入力してください</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-group-muted">「{query}」に一致する記事は見つかりませんでした</p>
      ) : (
        <>
          <p className="text-xs text-group-muted mb-5">{results.length} 件見つかりました</p>
          <ul className="space-y-4">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.category}/${p.slug}`}
                  className="block p-4 border border-group-border rounded-sm hover:border-hair-accent transition-colors bg-white group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        p.category === "eyelash"
                          ? "bg-eye-accent-soft text-eye-accent"
                          : "bg-hair-accent/10 text-hair-accent"
                      }`}
                    >
                      {p.category === "eyelash" ? "アイラッシュ" : "ヘア"}
                    </span>
                    <span className="text-[11px] text-group-muted">{p.salon}</span>
                  </div>
                  <p className="text-sm font-medium text-group-text group-hover:text-hair-accent transition-colors leading-snug">
                    {p.title}
                  </p>
                  <p className="text-xs text-group-muted mt-1.5 line-clamp-2">{p.excerpt}</p>
                  {p.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {p.tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] text-group-muted">#{t}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
