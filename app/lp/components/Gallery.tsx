"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { LP_GALLERY_CATEGORIES, type LpGalleryCategory, type LpGalleryItem } from "@/lib/lp";
import { track } from "@/lib/lp-track";
import { LineButton } from "./LineCta";

const SALON_LABEL: Record<string, string> = { fleurami: "fleurami", riv: "Riv. by fleurami" };

/** メニューカードの「事例を見る」から、カテゴリを指定してギャラリーへ移動するためのイベント */
export const GALLERY_FILTER_EVENT = "lp:gallery-filter";

export default function Gallery({ items, ctaLabel }: { items: LpGalleryItem[]; ctaLabel: string }) {
  const visible = useMemo(() => items.filter((i) => !i.hidden && i.images.length > 0), [items]);
  const cats = useMemo(
    () => LP_GALLERY_CATEGORIES.filter((c) => visible.some((i) => i.category === c.key)),
    [visible]
  );
  const [filter, setFilter] = useState<LpGalleryCategory | "all">("all");
  const [active, setActive] = useState<LpGalleryItem | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const shown = filter === "all" ? visible : visible.filter((i) => i.category === filter);

  useEffect(() => {
    const onFilter = (e: Event) => {
      const cat = (e as CustomEvent<LpGalleryCategory>).detail;
      if (visible.some((i) => i.category === cat)) setFilter(cat);
    };
    window.addEventListener(GALLERY_FILTER_EVENT, onFilter);
    return () => window.removeEventListener(GALLERY_FILTER_EVENT, onFilter);
  }, [visible]);

  useEffect(() => {
    scroller.current?.scrollTo({ left: 0 });
  }, [filter]);

  function choose(cat: LpGalleryCategory | "all") {
    setFilter(cat);
    track("lp_gallery_filter", { category: cat });
  }

  function openItem(item: LpGalleryItem) {
    setActive(item);
    track("lp_gallery_open", { gallery_id: item.id, category: item.category, menu: item.menuKey || "none", salon: item.salon || "none" });
  }

  if (visible.length === 0) return null;

  return (
    <div>
      {cats.length > 1 && (
        <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto lp-noscrollbar" role="tablist" aria-label="カテゴリで絞り込む">
          <div className="flex gap-2 w-max md:w-auto md:flex-wrap md:justify-center">
            {[{ key: "all" as const, label: "すべて" }, ...cats].map((c) => (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={filter === c.key}
                onClick={() => choose(c.key)}
                className={`h-9 px-4 rounded-full text-[13px] tracking-wide border transition-colors whitespace-nowrap ${
                  filter === c.key
                    ? "bg-[#3A3430] border-[#3A3430] text-white"
                    : "bg-white border-[#E2DAD0] text-[#5F5750] hover:border-[#A98B6D]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* スマホ: 横スワイプ／PC: グリッド */}
      <div
        ref={scroller}
        className="mt-6 -mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-4 gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory lp-noscrollbar"
      >
        {shown.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openItem(item)}
            className="group snap-start shrink-0 w-[68%] sm:w-[42%] md:w-auto text-left"
            aria-label={`${item.title}の詳細を見る`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[#EFE9E2]">
              {item.category === "before-after" && item.images.length >= 2 ? (
                <div className="absolute inset-0 grid grid-cols-2">
                  {item.images.slice(0, 2).map((im, i) => (
                    <div key={i} className="relative">
                      <Image src={im.src} alt={im.alt || item.title} fill sizes="(min-width:768px) 13vw, 34vw" className="object-cover" loading={idx < 2 ? "eager" : "lazy"} />
                      <span className="absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] tracking-wider text-[#3A3430]">{i === 0 ? "Before" : "After"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  src={item.images[0].src}
                  alt={item.images[0].alt || item.title}
                  fill
                  sizes="(min-width:768px) 25vw, 68vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              )}
              {item.images.length > 1 && item.category !== "before-after" && (
                <span className="absolute right-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] text-white">{item.images.length}枚</span>
              )}
            </div>
            <p className="mt-2.5 text-[14px] text-[#3A3430] leading-snug">{item.title}</p>
            <p className="mt-0.5 text-[12px] text-[#8E857D]">
              {item.menuLabel}
              {item.salon && <span>｜{SALON_LABEL[item.salon]}</span>}
            </p>
          </button>
        ))}
      </div>

      {active && <GalleryModal item={active} ctaLabel={ctaLabel} onClose={() => setActive(null)} />}
    </div>
  );
}

function GalleryModal({ item, ctaLabel, onClose }: { item: LpGalleryItem; ctaLabel: string; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const isBA = item.category === "before-after" && item.images.length >= 2;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, item.images.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label={item.title}>
      <button type="button" tabIndex={-1} aria-label="閉じる" onClick={onClose} className="absolute inset-0 bg-[#2B2522]/60 lp-fade-in" />
      <div className="relative w-full md:max-w-[880px] max-h-[94svh] overflow-y-auto bg-[#FBF9F6] rounded-t-[22px] md:rounded-[18px] lp-sheet-in md:grid md:grid-cols-[1.1fr_1fr]">
        <div
          className="relative bg-[#EFE9E2]"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null || isBA) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx < -40) setIdx((i) => Math.min(i + 1, item.images.length - 1));
            if (dx > 40) setIdx((i) => Math.max(i - 1, 0));
            touchX.current = null;
          }}
        >
          {isBA ? (
            <div className="grid grid-cols-2 gap-px aspect-[4/5]">
              {item.images.slice(0, 2).map((im, i) => (
                <figure key={i} className="relative">
                  <Image src={im.src} alt={im.alt || `${item.title} ${i === 0 ? "施術前" : "施術後"}`} fill sizes="(min-width:768px) 24vw, 50vw" className="object-cover" />
                  <figcaption className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] tracking-wider">{i === 0 ? "Before" : "After"}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="relative aspect-[4/5]">
              <Image src={item.images[idx].src} alt={item.images[idx].alt || item.title} fill sizes="(min-width:768px) 48vw, 100vw" className="object-cover" />
              {item.images.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                  {item.images.map((_, i) => (
                    <button key={i} type="button" aria-label={`${i + 1}枚目`} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-5 bg-white" : "w-1.5 bg-white/60"}`} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-5 md:p-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12px] tracking-wider text-[#A98B6D]">{item.menuLabel}</p>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="閉じる" className="-mr-2 -mt-2 w-10 h-10 rounded-full flex items-center justify-center text-[#7D746C] hover:bg-[#EFE9E2]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <h3 className="mt-1 font-serif text-[20px] text-[#3A3430] leading-snug">{item.title}</h3>
          {item.salon && <p className="mt-1 text-[12px] text-[#8E857D]">担当店舗：{SALON_LABEL[item.salon]}</p>}
          {item.description && <p className="mt-4 text-[14px] leading-[1.9] text-[#5F5750] whitespace-pre-line">{item.description}</p>}
          {isBA && <p className="mt-3 text-[11px] text-[#8E857D]">※同じ条件で撮影した施術前・施術後の写真です。仕上がりには個人差があります。</p>}
          <div className="mt-auto pt-6">
            <LineButton position="gallery_modal" menu={item.menuKey || item.category} menuLabel={item.menuLabel} salon={item.salon} label={ctaLabel} className="w-full" />
            <p className="mt-2 text-center text-[11px] text-[#8E857D]">スクリーンショットを送っていただくとスムーズです</p>
          </div>
        </div>
      </div>
    </div>
  );
}
