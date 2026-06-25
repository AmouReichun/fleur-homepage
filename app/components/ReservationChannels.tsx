import type { SalonContent } from "@/lib/content";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";

/**
 * 各店舗の予約チャネル（電話 / Web予約 / LINE / Instagram / ホットペッパー）。
 * 公式風アイコンで表示。URL未設定のチャネルは自動で非表示。
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
          return (
            <div key={key} className="border border-site-greige bg-white p-5">
              <p className="text-sm font-medium text-site-text mb-4">
                {s.name}
                <span className="text-[10px] text-site-muted ml-1.5">{s.area}</span>
              </p>
              <SalonReserveIcons salon={s} uid={key} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
