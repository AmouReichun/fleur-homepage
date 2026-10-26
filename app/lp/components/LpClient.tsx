"use client";

// LPの小さなクライアント部品（計測の初期化・下部固定CTA・同意バナー・FAQ・A/B文言など）

import { useEffect, useRef, useState } from "react";
import {
  captureUtm,
  disableTracking,
  getVariant,
  readConsent,
  saveConsent,
  setCommonParams,
  track,
} from "@/lib/lp-track";
import type { LpFaq, LpGalleryCategory } from "@/lib/lp";
import { LineButton } from "./LineCta";
import { GALLERY_FILTER_EVENT } from "./Gallery";

/** 計測の初期化: UTM保持・A/B振り分け・スクロール到達率・セクション/メニュー閲覧 */
export function LpBoot({ preview, experimentId }: { preview: boolean; experimentId: string }) {
  useEffect(() => {
    if (preview) {
      disableTracking();
      return;
    }
    const utm = captureUtm();
    const variant = experimentId ? getVariant(experimentId) : undefined;
    setCommonParams({
      ...utm,
      ...(variant ? { lp_experiment: experimentId, lp_variant: variant } : {}),
      device: window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile",
    });
    if (variant) document.documentElement.dataset.lpVariant = variant;
    track("lp_view");

    // スクロール到達率
    const marks = [25, 50, 75, 100];
    const sent = new Set<number>();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 100;
        for (const m of marks) {
          if (pct >= m - 1 && !sent.has(m)) {
            sent.add(m);
            track("lp_scroll", { percent: m });
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // セクション・メニューの閲覧（画面に40%以上入ったら1回だけ）
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.lpSection) track("lp_section_view", { section: el.dataset.lpSection });
          if (el.dataset.lpMenu) track("lp_menu_view", { menu: el.dataset.lpMenu });
          io.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll<HTMLElement>("[data-lp-section],[data-lp-menu]").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [preview, experimentId]);
  return null;
}

/** A/Bテスト時のみ B パターンの文言に差し替える（無効時は A をそのまま表示） */
export function AbText({ a, b, experimentId }: { a: string; b: string; experimentId: string }) {
  const [text, setText] = useState(a);
  useEffect(() => {
    if (experimentId && b && getVariant(experimentId) === "B") setText(b);
  }, [a, b, experimentId]);
  return <>{text}</>;
}

/** スマホ下部固定のLINEボタン。ファーストビューのCTAが見えている間と最終CTA付近では隠す */
export function StickyCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("lp-hero-cta");
    const final = document.getElementById("lp-final");
    const state = { heroVisible: true, finalVisible: false };
    const update = () => setShow(!state.heroVisible && !state.finalVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.heroVisible = e.isIntersecting;
        if (e.target === final) state.finalVisible = e.isIntersecting;
      }
      update();
    });
    if (hero) io.observe(hero);
    if (final) io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 md:hidden px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#FBF9F6] via-[#FBF9F6]/95 to-transparent transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
      aria-hidden={!show}
    >
      <LineButton position="sticky" label={label} className="w-full shadow-[0_8px_24px_-8px_rgba(6,199,85,0.55)]" />
    </div>
  );
}

/** PC用: 右下の小さなLINEボタン */
export function FloatingCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`hidden md:block fixed right-6 bottom-6 z-50 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <LineButton position="floating_pc" label={label} className="shadow-[0_10px_30px_-10px_rgba(6,199,85,0.6)]" />
    </div>
  );
}

/** Cookie・アクセス解析の同意バナー */
export function ConsentBanner({ preview }: { preview: boolean }) {
  const [open, setOpen] = useState(false);
  // ファーストビューのCTAを隠さないよう、少しスクロールしてから小さく表示する
  useEffect(() => {
    if (preview || readConsent() !== null) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [preview]);
  if (!open) return null;
  const choose = (c: "granted" | "denied") => {
    saveConsent(c);
    setOpen(false);
  };
  return (
    <div className="fixed left-3 right-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:left-6 md:right-auto md:bottom-6 md:max-w-[400px] z-[55] rounded-xl bg-white border border-[#E7E0D7] shadow-lg px-3.5 py-3 lp-fade-in" role="region" aria-label="Cookieの利用について">
      <p className="text-[11px] leading-[1.7] text-[#5F5750]">
        サービス改善と広告効果の測定のため、Cookie を使って Google アナリティクス等にアクセス情報を送信しています（氏名など個人を特定する情報は送信しません）。
      </p>
      <div className="mt-2 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="flex-1 h-8 rounded-full bg-[#3A3430] text-white text-[12px]">
          同意する
        </button>
        <button type="button" onClick={() => choose("denied")} className="flex-1 h-8 rounded-full border border-[#CFC5B8] text-[#3A3430] text-[12px]">
          拒否する
        </button>
      </div>
    </div>
  );
}

export function FaqList({ items }: { items: LpFaq[] }) {
  return (
    <div className="divide-y divide-[#E7E0D7] border-y border-[#E7E0D7]">
      {items.map((f, i) => (
        <details
          key={i}
          className="group"
          onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && track("lp_faq_open", { faq_index: i + 1, question: f.q.slice(0, 60) })}
        >
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 md:py-6 [&::-webkit-details-marker]:hidden">
            <span className="lp-en text-[18px] leading-none text-[#A98B6D] pt-0.5">Q</span>
            <span className="flex-1 text-[15px] leading-relaxed text-[#3A3430]">{f.q}</span>
            <span className="relative mt-1.5 h-3 w-3 shrink-0" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-[#7D746C]" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-[#7D746C] transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="flex gap-4 pb-6 -mt-1">
            <span className="lp-en text-[18px] leading-none text-[#CFC5B8] pt-0.5">A</span>
            <p className="flex-1 text-[14px] leading-[1.95] text-[#5F5750] whitespace-pre-line">{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** お悩みカード → 対応メニューへスクロール */
export function ConcernLink({ menuKey, menuName, children }: { menuKey: string; menuName: string; children: React.ReactNode }) {
  return (
    <a
      href={`#menu-${menuKey}`}
      onClick={() => track("lp_concern_click", { menu: menuKey })}
      className="group flex h-full flex-col rounded-[16px] bg-white border border-[#ECE5DC] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(58,52,48,0.35)]"
    >
      {children}
      <span className="mt-auto pt-4 inline-flex items-start justify-between gap-1.5 text-[11px] md:text-[12px] leading-snug text-[#A98B6D]">
        {menuName}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="transition-transform group-hover:translate-y-0.5"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
      </span>
    </a>
  );
}

/** メニューカード → ギャラリーを該当カテゴリで表示 */
export function MenuGalleryLink({ category }: { category: LpGalleryCategory }) {
  const ref = useRef<HTMLAnchorElement>(null);
  return (
    <a
      ref={ref}
      href="#gallery"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(GALLERY_FILTER_EVENT, { detail: category }));
        track("lp_menu_gallery_click", { category });
      }}
      className="inline-flex items-center gap-1.5 text-[13px] text-[#5F5750] underline decoration-[#CFC5B8] underline-offset-4 hover:text-[#3A3430]"
    >
      このメニューの事例を見る
    </a>
  );
}
