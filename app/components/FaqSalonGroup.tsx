"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";

const LIMIT = 3;

function FaqRow({ faq }: { faq: FaqItem }) {
  return (
    <details className="group py-6">
      <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
        <span className="font-serif text-base font-light leading-relaxed">
          <span className="text-site-accent mr-3 text-sm">Q</span>
          {faq.q}
        </span>
        <span className="flex-shrink-0 w-5 h-5 border border-site-greige flex items-center justify-center text-site-muted text-sm group-open:rotate-45 transition-transform duration-300">
          +
        </span>
      </summary>
      <p className="mt-5 text-sm text-site-muted leading-loose pl-5 border-l border-site-accent/40">
        {faq.a}
      </p>
    </details>
  );
}

export default function FaqSalonGroup({
  name,
  items,
}: {
  name: string;
  items: FaqItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, LIMIT);
  const hasMore = items.length > LIMIT;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-[0.35em] text-site-muted uppercase font-medium whitespace-nowrap">
          {name}
        </span>
        <div className="flex-1 h-px bg-site-greige" />
      </div>

      <div className="divide-y divide-site-greige">
        {visible.map((faq, i) => (
          <FaqRow key={i} faq={faq} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-6 inline-flex items-center gap-3 text-xs tracking-[0.2em] text-site-muted hover:text-site-accent transition-colors duration-200 group"
        >
          <span>{expanded ? "閉じる" : `もっと見る（あと ${items.length - LIMIT} 件）`}</span>
          <span className={`w-5 h-px bg-current transition-all duration-300 ${expanded ? "" : "group-hover:w-7"}`} />
        </button>
      )}
    </div>
  );
}
