"use client";

// LPのLINE導線をまとめるコンポーネント群。
// どのボタンも「店舗選択シート」を開き、店舗を選んだ瞬間に line_click を計測して公式LINEへ遷移する。
// （fleurami と Riv. で公式LINEが別アカウントのため、店舗選択を必ず挟む）

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { track } from "@/lib/lp-track";
import type { LpSalonKey } from "@/lib/lp";

export interface LpSalonInfo {
  key: LpSalonKey;
  name: string;
  area: string;
  address: string;
  hours: string;
  closed: string;
  parking: string;
  phone: string;
  lineUrl: string;
}

interface OpenArgs {
  position: string;
  menu?: string;
  menuLabel?: string;
  salon?: LpSalonKey | "";
}

const Ctx = createContext<{ open: (a: OpenArgs) => void } | null>(null);

export function useLineCta() {
  const c = useContext(Ctx);
  if (!c) throw new Error("LineCtaProvider がありません");
  return c;
}

export function LineIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 3C6.48 3 2 6.6 2 11.05c0 3.99 3.55 7.33 8.35 7.96.33.07.77.22.88.5.1.25.07.65.03.9l-.14.85c-.04.25-.2.98.86.53 1.06-.45 5.73-3.38 7.82-5.78C21.24 14.43 22 12.82 22 11.05 22 6.6 17.52 3 12 3Zm-3.6 10.4H6.41a.53.53 0 0 1-.53-.53V8.9a.53.53 0 1 1 1.06 0v3.44H8.4a.53.53 0 1 1 0 1.06Zm2.07-.53a.53.53 0 1 1-1.06 0V8.9a.53.53 0 1 1 1.06 0v3.97Zm4.78 0a.53.53 0 0 1-.95.32l-2.03-2.77v2.45a.53.53 0 1 1-1.06 0V8.9a.53.53 0 0 1 .95-.32l2.03 2.77V8.9a.53.53 0 1 1 1.06 0v3.97Zm3.2-2.51a.53.53 0 1 1 0 1.06h-1.45v.92h1.45a.53.53 0 1 1 0 1.06h-1.98a.53.53 0 0 1-.53-.53V8.9c0-.29.24-.53.53-.53h1.98a.53.53 0 1 1 0 1.06h-1.45v.93h1.45Z" />
    </svg>
  );
}

export function LineCtaProvider({ salons, children }: { salons: LpSalonInfo[]; children: React.ReactNode }) {
  const [state, setState] = useState<OpenArgs | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((a: OpenArgs) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    track("lp_cta_click", { cta_position: a.position, menu: a.menu || "none", salon_hint: a.salon || "none" });
    setState(a);
  }, []);

  const close = useCallback(() => {
    setState(null);
    lastFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!state) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [state, close]);

  // 担当店舗が分かっている場合（ギャラリー等）はその店舗を先頭に
  const ordered = state?.salon
    ? [...salons].sort((a, b) => (a.key === state.salon ? -1 : b.key === state.salon ? 1 : 0))
    : salons;

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="lp-sheet-title">
          <button type="button" aria-label="閉じる" tabIndex={-1} onClick={close} className="absolute inset-0 bg-[#2B2522]/45 backdrop-blur-[2px] lp-fade-in" />
          <div className="relative w-full md:max-w-[560px] bg-[#FBF9F6] rounded-t-[22px] md:rounded-[18px] px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] md:p-8 shadow-2xl lp-sheet-in max-h-[88svh] overflow-y-auto">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#DDD5CB] md:hidden" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="lp-en text-[13px] tracking-[0.2em] text-[#A98B6D]">Select your salon</p>
                <h2 id="lp-sheet-title" className="mt-1 font-serif text-[18px] md:text-[21px] text-[#3A3430] tracking-wide">
                  相談する店舗を選んでください
                </h2>
                {state.menuLabel && (
                  <p className="mt-2 text-[13px] text-[#7D746C]">
                    ご相談内容：<span className="text-[#3A3430]">{state.menuLabel}</span>
                  </p>
                )}
              </div>
              <button ref={closeBtn} type="button" onClick={close} aria-label="閉じる" className="shrink-0 -mr-1 -mt-1 w-10 h-10 rounded-full flex items-center justify-center text-[#7D746C] hover:bg-[#EFE9E2] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <ul className="mt-5 space-y-3">
              {ordered.map((s) => (
                <li key={s.key}>
                  <SalonChoice salon={s} args={state} recommended={state.salon === s.key} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-[#8E857D]">
              LINEアプリが開きます。お友だち追加のあと、トークでお悩みやご希望の日時をお送りください。
            </p>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

function SalonChoice({ salon, args, recommended }: { salon: LpSalonInfo; args: OpenArgs; recommended: boolean }) {
  return (
    <div className={`rounded-2xl border bg-white p-4 ${recommended ? "border-[#A98B6D]" : "border-[#E7E0D7]"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-[17px] text-[#3A3430]">{salon.name}</p>
        <p className="text-[12px] text-[#7D746C] shrink-0">{salon.area}</p>
      </div>
      {recommended && <p className="mt-1 text-[11px] text-[#A98B6D]">このスタイルを担当した店舗です</p>}
      <p className="mt-1.5 text-[12px] leading-relaxed text-[#8E857D]">
        {salon.hours}｜定休日 {salon.closed}
      </p>
      {salon.lineUrl ? (
        <a
          href={salon.lineUrl}
          target="_blank"
          rel="noopener"
          onClick={() =>
            track("line_click", {
              cta_position: args.position,
              menu: args.menu || "none",
              salon: salon.key,
              link_domain: safeHost(salon.lineUrl),
            })
          }
          className="lp-line-btn mt-3 w-full h-12 text-[15px]"
        >
          <LineIcon />
          {salon.name}の公式LINEを開く
        </a>
      ) : (
        <a
          href={`tel:${salon.phone.replace(/-/g, "")}`}
          onClick={() => track("tel_click", { cta_position: args.position, salon: salon.key })}
          className="mt-3 flex w-full h-12 items-center justify-center rounded-full border border-[#3A3430] text-[14px] text-[#3A3430]"
        >
          お電話で相談する（{salon.phone}）
        </a>
      )}
    </div>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

/** LPの各所に置くLINEボタン */
export function LineButton({
  position,
  menu,
  menuLabel,
  salon,
  label,
  size = "md",
  variant = "solid",
  className = "",
}: OpenArgs & { label: React.ReactNode; size?: "md" | "lg"; variant?: "solid" | "light"; className?: string }) {
  const { open } = useLineCta();
  const sizeCls = size === "lg" ? "h-[58px] px-8 text-[16px]" : "h-[52px] px-6 text-[15px]";
  return (
    <button
      type="button"
      onClick={() => open({ position, menu, menuLabel, salon })}
      className={`${variant === "solid" ? "lp-line-btn" : "lp-line-btn-light"} ${sizeCls} ${className}`}
    >
      <LineIcon />
      <span>{label}</span>
    </button>
  );
}
