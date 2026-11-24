import { Yellowtail } from "next/font/google";

/** トップの手書き風デザイン用（2026-11-24 社長：Stelléみたいな手書き風・写真の上に文字） */
export const scriptFont = Yellowtail({ subsets: ["latin"], weight: "400", display: "swap", preload: true });

const PINK = "rgb(var(--site-rose))"; // アクセントのローズピンク

/** Stellé風のギザギザ星（starburst） */
export function StarBurst({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const pts: string[] = [];
  const n = 12;
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? 50 : 34;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`);
  }
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full hd-spin" aria-hidden>
        <polygon points={pts.join(" ")} fill={PINK} />
      </svg>
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white">{children}</div>
    </div>
  );
}

/** 小さい星（4本線の星・キラッ） */
export function Spark({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={`hd-twinkle ${className}`} style={style} aria-hidden>
      <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" fill={PINK} />
    </svg>
  );
}

/** 手書き文字の下にスッと引かれるピンクの線 */
export function Swoosh({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 30" className={className} aria-hidden preserveAspectRatio="none">
      <path className="hd-draw" pathLength={1} d="M4 22 C 80 6, 190 4, 296 14" fill="none" stroke={PINK} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** 楕円のステッカー */
export function OvalSticker({ className = "" }: { className?: string }) {
  return (
    <div className={`hd-wobble ${className}`} aria-hidden>
      <div className="relative rounded-[50%] border-2 border-site-text bg-white px-5 py-2.5 text-center leading-tight -rotate-12 shadow-[3px_3px_0_rgba(0,0,0,0.15)]">
        <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-site-text">HAIR &amp; EYELASH</span>
        <span className="block text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-site-text">IN KOCHI</span>
        <Spark className="absolute -top-2 -right-2 w-5 h-5" />
      </div>
    </div>
  );
}

/** 各段の見出しの上に置く、手書き風の英字（ピンク）＋線＋キラッ */
export function ScriptLabel({ text, center = false }: { text: string; center?: boolean }) {
  return (
    <div className={center ? "flex justify-center mb-[8px]" : "mb-[8px]"} aria-hidden>
      <div className="relative inline-block">
        <span className={`${scriptFont.className} block text-[34px] sm:text-[42px] leading-none text-site-accent -rotate-3 ${center ? "origin-center" : "origin-left"}`}>
          {text}
        </span>
        <Swoosh className={`block w-[110px] sm:w-[150px] h-[10px] -mt-[2px] ${center ? "mx-auto" : "ml-[21px]"}`} />
        <Spark className="absolute -top-[8px] -right-[21px] w-[14px] h-[14px]" />
      </div>
    </div>
  );
}
