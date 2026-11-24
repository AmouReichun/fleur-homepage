/* 採用ページ用のPOPな飾り（ライム×ラベンダー）。すべて装飾なので aria-hidden */

const LIME = "#C7F500";
const LAV = "#C697EF";
const INK = "#2A2A2A";

/** ぐにゃっとした図形 */
export function Blob({ className = "", color = "lav", variant = 0 }: { className?: string; color?: "lav" | "lime"; variant?: 0 | 1 | 2 }) {
  const paths = [
    "M44,-58C57,-47,67,-33,72,-16C77,1,77,21,67,35C57,49,37,58,17,63C-3,68,-23,69,-40,61C-57,53,-71,36,-74,17C-77,-2,-69,-23,-56,-36C-43,-49,-25,-54,-7,-58C11,-62,31,-69,44,-58Z",
    "M30,-50C42,-38,57,-32,66,-19C75,-6,78,13,70,26C62,39,43,46,25,55C7,64,-10,75,-27,72C-44,69,-61,52,-69,33C-77,14,-76,-7,-67,-24C-58,-41,-41,-54,-24,-63C-7,-72,10,-77,21,-71C32,-65,18,-62,30,-50Z",
    "M-60,-10C-62,-30,-48,-48,-28,-52C-8,-56,12,-46,34,-40C56,-34,80,-32,82,-20C84,-8,64,14,44,24C24,34,4,32,-18,34C-40,36,-58,10,-60,-10Z",
  ];
  return (
    <svg aria-hidden viewBox="-90 -90 180 180" className={`pointer-events-none select-none ${className}`}>
      <path d={paths[variant]} fill={color === "lav" ? LAV : LIME} />
    </svg>
  );
}

/** ニコちゃん */
export function Smiley({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={`pointer-events-none select-none ${className}`}>
      <circle cx="20" cy="20" r="17" fill="none" stroke={INK} strokeWidth="2.5" />
      <circle cx="14" cy="16" r="2.2" fill={INK} />
      <circle cx="26" cy="16" r="2.2" fill={INK} />
      <path d="M12 23 Q20 31 28 23" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** くねくね線 */
export function Squiggle({ className = "", color = "lav" }: { className?: string; color?: "lav" | "lime" | "ink" }) {
  const c = color === "lav" ? LAV : color === "lime" ? LIME : INK;
  return (
    <svg aria-hidden viewBox="0 0 120 24" className={`pointer-events-none select-none ${className}`}>
      <path d="M4 14 Q16 2 28 12 T52 12 T76 12 T100 12 T116 10" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** ✳ / ✕ のキラキラ */
export function Spark({ className = "", shape = "star" }: { className?: string; shape?: "star" | "x" }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`pointer-events-none select-none ${className}`}>
      {shape === "x" ? (
        <path d="M5 5 L19 19 M19 5 L5 19" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M12 2 V22 M2 12 H22 M5 5 L19 19 M19 5 L5 19" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** 丸いシール「GOOD PEOPLE GOOD VIBES ☺」 */
export function VibesSticker({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none select-none w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-lime border-[3px] border-site-text flex flex-col items-center justify-center rotate-[-12deg] shadow-[4px_4px_0_#2A2A2A] ${className}`}>
      <span className="text-[10px] sm:text-[11px] font-black tracking-widest leading-tight text-center text-site-text">GOOD PEOPLE<br />GOOD VIBES</span>
      <Smiley className="w-6 h-6 mt-1" />
    </div>
  );
}

/** セクションの英語ラベル（傾いたライムのワッペン） */
export function PopLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-block text-[11px] tracking-[0.25em] font-black uppercase px-4 py-1.5 rounded-full -rotate-2 mb-4 ${dark ? "bg-lav text-site-text" : "bg-lime text-site-text"}`}>
      {children}
    </span>
  );
}
