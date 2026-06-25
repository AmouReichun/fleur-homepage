import type { SalonContent } from "@/lib/content";

/* 公式風アイコン（LINE / Instagram は公式ブランド、電話 / Web はデザイン統一の中立アイコン、
   ホットペッパーはブランドカラーのバッジ）。各40px前後の角丸タイル。 */

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M6.6 10.9c1.5 2.9 3.9 5.3 6.8 6.8l2.1-2.1c.3-.3.7-.4 1.1-.3 1.1.4 2.4.6 3.6.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.2c0-.6.5-1 1-1h3.1c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1.1l-2.1 2z" />
    </svg>
  );
}
function WebIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
    </svg>
  );
}
function LineIcon() {
  // 公式LINEアプリアイコン（緑の角丸＋白の吹き出し）
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#06C755" />
      <path
        fill="#fff"
        d="M19 10.5c0-3.1-3.1-5.6-7-5.6s-7 2.5-7 5.6c0 2.8 2.5 5.1 5.8 5.5.2 0 .5.1.6.3.1.2.1.4 0 .6 0 .2-.1.6-.2.8-.1.3-.3.9.5.6.8-.3 4.1-2.4 5.6-4.1h0c1.1-1.1 1.3-2.3 1.3-3.7zM9.3 12.2H7.9c-.2 0-.4-.2-.4-.4V9c0-.2.2-.4.4-.4s.4.2.4.4v2.4h1c.2 0 .4.2.4.4s-.2.4-.4.4zm1.6-.4c0 .2-.2.4-.4.4s-.4-.2-.4-.4V9c0-.2.2-.4.4-.4s.4.2.4.4v2.8zm3.6 0c0 .2-.1.3-.3.4h-.1c-.1 0-.3-.1-.3-.2l-1.4-1.9v1.7c0 .2-.2.4-.4.4s-.4-.2-.4-.4V9c0-.2.1-.3.3-.4.2 0 .3 0 .4.2l1.4 1.9V9c0-.2.2-.4.4-.4s.4.2.4.4v2.8zm2.4-1.8c.2 0 .4.2.4.4s-.2.4-.4.4h-1v.6h1c.2 0 .4.2.4.4s-.2.4-.4.4h-1.4c-.2 0-.4-.2-.4-.4V9c0-.2.2-.4.4-.4h1.4c.2 0 .4.2.4.4s-.2.4-.4.4h-1v.6h1z"
      />
    </svg>
  );
}
function InstagramIcon({ uid }: { uid: string }) {
  const gid = `ig-grad-${uid}`;
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="0.3" cy="1.05" r="1.1">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.25" stopColor="#FF9438" />
          <stop offset="0.5" stopColor="#EE3360" />
          <stop offset="0.75" stopColor="#C32EA3" />
          <stop offset="1" stopColor="#7048C9" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill={`url(#${gid})`} />
      <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="3.6" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.9" fill="none" stroke="#fff" strokeWidth="1.5" />
      <circle cx="16.1" cy="7.9" r="0.95" fill="#fff" />
    </svg>
  );
}
function HpbIcon() {
  // ホットペッパービューティーのブランドバッジ（マゼンタ＋HPB）。flex中央揃え。
  return (
    <span className="w-full h-full flex items-center justify-center" style={{ background: "#E4007F" }} aria-hidden>
      <span style={{ color: "#fff", fontSize: "8px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>HPB</span>
    </span>
  );
}

type Ch = { kind: string; label: string; short: string; href: string; external: boolean };

export type ReserveSalon = Pick<
  SalonContent,
  "name" | "phone" | "hotpepperUrl" | "instagramUrl"
> & { lineUrl?: string; webReserveUrl?: string };

function channelsForSalon(s: ReserveSalon): Ch[] {
  const ch: Ch[] = [];
  if (s.phone) ch.push({ kind: "tel", label: `${s.name}に電話で予約`, short: "電話", href: `tel:${s.phone.replace(/[^0-9]/g, "")}`, external: false });
  if (s.webReserveUrl) ch.push({ kind: "web", label: `${s.name}のWeb予約`, short: "Web予約", href: s.webReserveUrl, external: true });
  if (s.lineUrl) ch.push({ kind: "line", label: `${s.name}にLINEで予約`, short: "LINE", href: s.lineUrl, external: true });
  if (s.instagramUrl) ch.push({ kind: "instagram", label: `${s.name}にInstagramで予約`, short: "Insta", href: s.instagramUrl, external: true });
  if (s.hotpepperUrl) ch.push({ kind: "hpb", label: `${s.name}をホットペッパーで予約`, short: "ホット\nペッパー", href: s.hotpepperUrl, external: true });
  return ch;
}

export default function SalonReserveIcons({
  salon,
  uid,
  align = "start",
  showLabels = true,
}: {
  salon: ReserveSalon;
  uid: string;
  align?: "start" | "center";
  showLabels?: boolean;
}) {
  const channels = channelsForSalon(salon);
  if (channels.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-x-1.5 gap-y-3 ${align === "center" ? "justify-center" : ""}`}>
      {channels.map((c) => {
        const tile =
          c.kind === "tel" || c.kind === "web"
            ? "bg-site-light text-site-accent border border-site-greige"
            : "";
        const inner = (
          <span className="flex flex-col items-center gap-1.5 group w-full">
            <span
              className={`w-10 h-10 rounded-[10px] overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md ${tile}`}
            >
              {c.kind === "tel" && <PhoneIcon />}
              {c.kind === "web" && <WebIcon />}
              {c.kind === "line" && <LineIcon />}
              {c.kind === "instagram" && <InstagramIcon uid={`${uid}-${c.kind}`} />}
              {c.kind === "hpb" && <HpbIcon />}
            </span>
            {showLabels && <span className="text-[9px] text-site-muted text-center leading-tight tracking-tight whitespace-pre-line">{c.short}</span>}
          </span>
        );
        // 各チャネルをタイル幅(40px)の等幅カラムにして整列＋横一列に収める。
        // ラベルは40px内に収まる短さ（長い場合は中央で折返し、タイル列は崩れない）。
        const cls = "shrink-0 w-10 flex";
        return c.external ? (
          <a key={c.kind} href={c.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={c.label} title={c.label}>{inner}</a>
        ) : (
          <a key={c.kind} href={c.href} className={cls} aria-label={c.label} title={c.label}>{inner}</a>
        );
      })}
    </div>
  );
}
