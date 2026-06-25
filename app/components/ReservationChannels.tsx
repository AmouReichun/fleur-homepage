import type { SalonContent } from "@/lib/content";

type Channel = { kind: string; short: string; icon: string; href: string; external: boolean; aria: string };

function channelsForSalon(s: SalonContent): Channel[] {
  const ch: Channel[] = [];
  if (s.phone) ch.push({ kind: "tel", short: "電話", icon: "☎", href: `tel:${s.phone.replace(/[^0-9]/g, "")}`, external: false, aria: `${s.name}に電話で予約` });
  if (s.webReserveUrl) ch.push({ kind: "web", short: "Web予約", icon: "🖥", href: s.webReserveUrl, external: true, aria: `${s.name}のWeb予約` });
  if (s.lineUrl) ch.push({ kind: "line", short: "LINE", icon: "💬", href: s.lineUrl, external: true, aria: `${s.name}にLINEで予約` });
  if (s.instagramUrl) ch.push({ kind: "instagram", short: "Instagram", icon: "📷", href: s.instagramUrl, external: true, aria: `${s.name}にInstagramのDMで予約` });
  if (s.hotpepperUrl) ch.push({ kind: "hpb", short: "ホットペッパー", icon: "🅷", href: s.hotpepperUrl, external: true, aria: `${s.name}をホットペッパーで予約` });
  return ch;
}

/**
 * 各店舗の予約チャネル（電話 / Web予約 / LINE / Instagram / ホットペッパー）。
 * URL未設定のチャネルは自動で非表示。アンカーは店舗名＋手段のキーワード。
 */
export default function ReservationChannels({
  salonOrder,
  salons,
  heading = "ご予約はこちら",
  note = "ご希望の方法でご予約いただけます",
}: {
  salonOrder: string[];
  salons: Record<string, SalonContent>;
  heading?: string;
  note?: string;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center gap-3 mb-3 justify-center">
          <div className="w-6 h-px bg-site-accent" />
          <span className="text-[10px] tracking-[0.4em] text-site-accent uppercase">Reservation</span>
          <div className="w-6 h-px bg-site-accent" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-site-text">{heading}</h2>
        {note && <p className="text-xs text-site-muted mt-2">{note}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {salonOrder.map((key) => {
          const s = salons[key];
          if (!s) return null;
          const channels = channelsForSalon(s);
          return (
            <div key={key} className="border border-site-greige bg-white p-5">
              <p className="text-sm font-medium text-site-text">
                {s.name}
                <span className="text-[10px] text-site-muted ml-1.5">{s.area}</span>
              </p>
              <ul className="mt-3 space-y-2">
                {channels.map((c) => {
                  const cls = "flex items-center gap-2 text-xs text-site-text hover:text-site-accent transition-colors";
                  const inner = (
                    <>
                      <span aria-hidden className="text-site-accent w-4 text-center">{c.icon}</span>
                      <span className="underline underline-offset-2">{c.short}で予約</span>
                    </>
                  );
                  return (
                    <li key={c.kind}>
                      {c.external ? (
                        <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={c.aria}>{inner}</a>
                      ) : (
                        <a href={c.href} className={cls} aria-label={c.aria}>{inner}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
