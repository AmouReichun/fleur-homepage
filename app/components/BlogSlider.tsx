"use client";

import { useState, useEffect, useRef } from "react";

type BlogPost = {
  title: string;
  slug: string;
  category: string;
  salon: string;
  date: string;
  excerpt: string;
  thumbnail: string;
};

const INTERVAL = 5000;

export default function BlogSlider({
  posts,
  blogUrl,
  en,
}: {
  posts: BlogPost[];
  blogUrl: string;
  en: string;
}) {
  const [current, setCurrent] = useState(0);
  const paused = useRef(false);
  const total = posts.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % total);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [total]);

  function goTo(i: number) {
    paused.current = true;
    setCurrent(i);
    setTimeout(() => { paused.current = false; }, INTERVAL);
  }

  if (total === 0) return null;

  return (
    <div
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.35em] text-site-muted uppercase whitespace-nowrap">{en}</span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>

      {/* スライドエリア */}
      <div className="relative" style={{ minHeight: "320px" }}>
        {posts.map((post, i) => {
          const postUrl = `${blogUrl}/${post.category}/${post.slug}`;
          const thumbUrl = `${blogUrl}${post.thumbnail}`;
          const dateLabel = post.date
            ? `${post.date.slice(0, 4)}年${parseInt(post.date.slice(5, 7))}月`
            : "";
          return (
            <div
              key={post.slug}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="overflow-hidden bg-site-light mb-5 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <p className="text-[10px] text-site-accent tracking-[0.3em] uppercase mb-2">{post.category}</p>
                <h3 className="font-serif text-base font-light leading-snug mb-2 group-hover:text-site-accent transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-[10px] text-site-muted tracking-wider">{post.salon} — {dateLabel}</p>
              </a>
            </div>
          );
        })}
      </div>

      {/* ドット + カウンター */}
      {total > 1 && (
        <div className="flex items-center gap-2.5 mt-5">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`ブログ ${i + 1}`}
              className={`block h-px transition-all duration-300 ${
                i === current ? "w-6 bg-site-accent" : "w-2.5 bg-site-greige hover:bg-site-muted"
              }`}
            />
          ))}
          <span className="ml-2 text-[10px] font-mono text-site-muted tracking-widest">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
