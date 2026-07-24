import Link from "next/link";
import { SALONS, SALON_ORDER, reservationChannels, type SalonKey, type RelatedMenu, type ReservationChannel } from "@/lib/blog/internal-links";

const CHANNEL_ICON: Record<ReservationChannel["kind"], string> = {
  tel: "☎",
  web: "🖥",
  line: "💬",
  instagram: "📷",
  hpb: "🅷",
};
const CHANNEL_SHORT: Record<ReservationChannel["kind"], string> = {
  tel: "電話",
  web: "Web予約",
  line: "LINE",
  instagram: "Instagram",
  hpb: "ホットペッパー",
};

type Props = {
  world: "hair" | "eyelash";
  salonKey: SalonKey;
  menus: RelatedMenu[];
};

/**
 * 記事下部の内部リンク群（SEO/AIO向け）
 *  - 関連メニュー（キーワードアンカー）
 *  - このメニューが受けられる店舗（内部ハブへ）
 *  - ご予約はこちら（3店舗・キーワードアンカー）
 * 「こちら」だけの文言は使わず、地域＋メニュー＋店舗名を含める。
 */
export default function ArticleInternalLinks({ world, salonKey, menus }: Props) {
  const isHair = world === "hair";
  const accent = isHair ? "#9C7B4A" : "#C8788A";
  const border = isHair ? "#DDD0BE" : "#EDD9DC";
  const soft = isHair ? "#F5EDE0" : "#FDF4F6";
  const labelCls = isHair ? "font-cormorant text-hair-accent-warm" : "font-jakarta text-eye-accent";
  const textCls = isHair ? "text-hair-text font-mincho" : "text-eye-text font-kaku";
  const mutedCls = isHair ? "text-hair-muted" : "text-eye-muted";

  return (
    <section className="mt-12 space-y-8" aria-label="関連メニュー・店舗・ご予約">
      {/* 関連メニュー */}
      {menus.length > 0 && (
        <div className="pt-8" style={{ borderTop: `1px solid ${border}` }}>
          <p className={`text-[10px] tracking-[0.3em] uppercase mb-4 ${labelCls}`}>Related Menu — 関連メニュー</p>
          <ul className="flex flex-col gap-2">
            {menus.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={`inline-flex items-center gap-2 text-sm ${textCls} hover:opacity-70 transition-opacity`}
                >
                  <span style={{ color: accent }}>›</span>
                  <span style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>{m.anchor}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* このメニューが受けられる店舗 */}
      <div className="pt-8" style={{ borderTop: `1px solid ${border}` }}>
        <p className={`text-[10px] tracking-[0.3em] uppercase mb-4 ${labelCls}`}>Salon — このメニューが受けられる店舗</p>
        <div className="grid grid-cols-1 gap-2.5">
          {SALON_ORDER.map((key) => {
            const s = SALONS[key];
            const isOwn = key === salonKey;
            return (
              <div
                key={key}
                className="px-4 py-3 bg-white/70"
                style={{ border: `1px solid ${border}`, borderRadius: isHair ? "2px" : "10px", borderLeft: isOwn ? `3px solid ${accent}` : `1px solid ${border}` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span>
                    <span className={`text-sm font-medium ${textCls}`}>{s.name}</span>
                    <span className={`text-[11px] ml-2 ${mutedCls}`}>{s.area}</span>
                    {isOwn && <span className="text-[10px] ml-2" style={{ color: accent }}>← この記事の店舗</span>}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link href={s.hub} className={`text-[11px] hover:opacity-70 transition-opacity`} style={{ color: accent }}>
                      記事を見る →
                    </Link>
                    <Link href={`/salon/${key}`} className={`text-[11px] hover:opacity-70 transition-opacity`} style={{ color: accent }}>
                      店舗詳細 →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ご予約はこちら（店舗ごとに 電話 / Web予約 / LINE / Instagram / ホットペッパー） */}
      <div className="pt-8" style={{ borderTop: `1px solid ${border}` }}>
        <p className={`text-[10px] tracking-[0.3em] uppercase mb-1 ${labelCls}`}>Reservation — ご予約はこちら</p>
        <p className={`text-[11px] mb-4 ${mutedCls}`}>ご希望の方法でご予約いただけます。</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SALON_ORDER.map((key) => {
            const s = SALONS[key];
            const channels = reservationChannels(key);
            const isOwn = key === salonKey;
            return (
              <div
                key={key}
                className="p-3.5"
                style={{ background: soft, border: `1px solid ${border}`, borderRadius: isHair ? "2px" : "10px", borderLeft: isOwn ? `3px solid ${accent}` : `1px solid ${border}` }}
              >
                <p className={`text-[13px] font-medium ${textCls}`}>
                  {s.name}
                  <span className={`text-[10px] ml-1.5 ${mutedCls}`}>{s.area}</span>
                </p>
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {channels.map((c) => {
                    const inner = (
                      <>
                        <span aria-hidden style={{ color: accent }}>{CHANNEL_ICON[c.kind]}</span>
                        <span style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>{CHANNEL_SHORT[c.kind]}で予約</span>
                      </>
                    );
                    const cls = `inline-flex items-center gap-1.5 text-xs ${textCls} hover:opacity-70 transition-opacity`;
                    return (
                      <li key={c.kind}>
                        {c.external ? (
                          <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={c.label}>{inner}</a>
                        ) : (
                          <a href={c.href} className={cls} aria-label={c.label}>{inner}</a>
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
    </section>
  );
}
