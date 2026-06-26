"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import type { SearchPostMeta } from "@/lib/blog/posts";

type Props = { posts: SearchPostMeta[] };

export default function HomeSearchBar({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.salon.toLowerCase().includes(q) ||
          (p.question ?? "").toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [query, posts]);

  // 外クリックで閉じる
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isHair = (p: SearchPostMeta) => p.category === "hair";

  return (
    <div ref={wrapRef} className="relative max-w-sm">
      {/* 入力欄 */}
      <div className="flex items-center" style={{ border: "1px solid #D4C4A8", borderRadius: "2px" }}>
        <svg
          className="w-3.5 h-3.5 ml-3 shrink-0"
          style={{ color: "#A89878" }}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx={11} cy={11} r={8} />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="記事を検索（例：縮毛矯正、マツエク…）"
          className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none placeholder:text-group-muted/50 text-group-text"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="px-3 text-group-muted hover:text-group-text transition-colors text-lg leading-none"
            aria-label="クリア"
          >
            ×
          </button>
        )}
      </div>

      {/* ドロップダウン */}
      {open && query.trim() && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white z-50 overflow-hidden"
          style={{
            border: "1px solid #D4C4A8",
            borderRadius: "2px",
            boxShadow: "0 8px 32px rgba(100,80,40,0.12)",
            maxWidth: "420px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-group-muted">
              「{query}」に一致する記事はありません
            </p>
          ) : (
            <>
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.category}/${p.slug}`}
                  onClick={() => { setQuery(""); setOpen(false); }}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-group-bg transition-colors border-b border-group-border/50 last:border-0"
                >
                  {/* カテゴリバッジ */}
                  <span
                    className="shrink-0 mt-0.5 text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 font-cormorant"
                    style={{
                      color: isHair(p) ? "#BBA98A" : "#C8788A",
                      border: `1px solid ${isHair(p) ? "rgba(187,169,138,0.4)" : "rgba(200,120,138,0.4)"}`,
                      borderRadius: isHair(p) ? "1px" : "999px",
                      background: isHair(p) ? "rgba(187,169,138,0.06)" : "rgba(200,120,138,0.06)",
                    }}
                  >
                    {isHair(p) ? "ヘア" : "Lash"}
                  </span>

                  {/* テキスト */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-group-text leading-snug line-clamp-2 font-mincho">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-group-muted mt-0.5 truncate">
                      {p.salon}
                    </p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
