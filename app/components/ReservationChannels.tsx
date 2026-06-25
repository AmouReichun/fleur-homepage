import type { SalonContent } from "@/lib/content";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";

/**
 * 各店舗の予約チャネル（電話 / Web予約 / LINE / Instagram / ホットペッパー）。
 * 公式風アイコンで表示。URL未設定のチャネルは自動で非表示。
 * groupByType=true で「美容室 / アイラッシュサロン」など業態別に分けて表示。
 */
function SalonCard({ s, uid }: { s: SalonContent; uid: string }) {
  return (
    <div className="border border-site-greige bg-white p-5">
      <p className="text-sm font-medium text-site-text mb-4">
        {s.name}
        <span className="text-[10px] text-site-muted ml-1.5">{s.area}</span>
      </p>
      <SalonReserveIcons salon={s} uid={uid} />
    </div>
  );
}

export default function ReservationChannels({
  salonOrder,
  salons,
  heading = "ご予約はこちら",
  note = "ご希望の方法でご予約いただけます",
  groupByType = false,
}: {
  salonOrder: string[];
  salons: Record<string, SalonContent>;
  heading?: string;
  note?: string;
  groupByType?: boolean;
}) {
  const keys = salonOrder.filter((k) => salons[k]);

  // 業態別グループ（出現順を維持）
  const groups: { type: string; keys: string[] }[] = [];
  for (const k of keys) {
    const type = salons[k].salonType || "その他";
    const g = groups.find((x) => x.type === type);
    if (g) g.keys.push(k);
    else groups.push({ type, keys: [k] });
  }

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

      {groupByType ? (
        <div className="space-y-10">
          {groups.map((g) => (
            <div key={g.type}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-medium text-site-text tracking-wider whitespace-nowrap">{g.type}</span>
                <div className="flex-1 h-px bg-site-greige" />
              </div>
              <div className={`grid grid-cols-1 gap-4 ${g.keys.length >= 2 ? "sm:grid-cols-2" : ""}`}>
                {g.keys.map((key) => (
                  <SalonCard key={key} s={salons[key]} uid={key} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {keys.map((key) => (
            <SalonCard key={key} s={salons[key]} uid={key} />
          ))}
        </div>
      )}
    </div>
  );
}
