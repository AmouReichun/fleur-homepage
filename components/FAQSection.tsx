"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/blog/posts";

type Props = {
  faq: FaqItem[];
  world: "hair" | "eyelash";
};

export default function FAQSection({ faq, world }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const isEyelash = world === "eyelash";

  if (!faq || faq.length === 0) return null;

  if (isEyelash) {
    return (
      <section className="mt-12">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-eye-accent text-xs tracking-widest uppercase font-jakarta">FAQ</span>
          <div className="flex-1 h-px bg-gradient-to-r from-eye-border to-transparent" />
        </div>
        <h2 className="font-kaku text-base font-medium text-eye-text mb-5">
          よくある質問
        </h2>
        <dl className="space-y-3">
          {faq.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-eye-border/60 bg-white"
            >
              <dt>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full text-left px-4 py-3.5 flex justify-between items-start gap-3 text-sm font-medium text-eye-text hover:bg-eye-accent-soft/50 transition-colors"
                  aria-expanded={open === i}
                >
                  <span className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-eye-accent-soft text-eye-accent text-[10px] flex items-center justify-center font-jakarta mt-0.5">
                      Q
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <span
                    className={`shrink-0 text-eye-muted text-base leading-none transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </dt>
              {open === i && (
                <dd className="px-4 pb-4 text-sm leading-relaxed border-t border-eye-border/40 bg-[#FDF8F9]">
                  <div className="flex gap-2.5 items-start pt-3">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-eye-accent text-white text-[10px] flex items-center justify-center font-jakarta mt-0.5">
                      A
                    </span>
                    <span className="text-eye-text/80">{item.a}</span>
                  </div>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </section>
    );
  }

  // Hair world
  return (
    <section className="mt-12">
      <h2 className="font-mincho text-lg sm:text-xl font-medium text-hair-text mb-6">
        よくある質問
      </h2>
      <dl className="space-y-2">
        {faq.map((item, i) => (
          <div key={i} className="border border-hair-border rounded-sm overflow-hidden">
            <dt>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-4 py-3.5 flex justify-between items-start gap-3 text-sm font-medium text-hair-text hover:bg-hair-accent/5 transition-colors"
                aria-expanded={open === i}
              >
                <span className="flex gap-2">
                  <span className="text-hair-accent">Q.</span>
                  {item.q}
                </span>
                <span
                  className={`shrink-0 text-base leading-none transition-transform duration-200 text-hair-muted ${open === i ? "rotate-45" : ""}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </dt>
            {open === i && (
              <dd className="px-4 pb-4 text-sm text-hair-muted leading-relaxed border-t border-hair-border bg-hair-bg">
                <span className="block pt-3 text-hair-accent font-medium text-xs mb-1">A.</span>
                {item.a}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
