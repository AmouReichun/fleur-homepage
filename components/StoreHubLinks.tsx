import Link from "next/link";
import { SALONS, type SalonKey } from "@/lib/blog/internal-links";

/**
 * ブログのまとめページ（店別・メニュー別）から店舗ページへのリンク（2026-11-21）
 * 店舗ページ＝メニュー・料金・アクセス・予約の正本。ここへ文脈のある言葉でつなぐ（SEO/AIO）。
 */
const DESC: Record<SalonKey, string> = {
  riv: "高知市南川添の美容室。艶カラー・髪質改善・白髪ぼかし・縮毛矯正",
  fleurami: "香南市野市町の美容室。艶カラー・髪質改善・白髪ぼかし・縮毛矯正",
  raffine: "高知市はりまや町のまつげ・眉毛専門店。まつげパーマ・マツエク・眉毛WAX",
};

export default function StoreHubLinks({ keys, world }: { keys: SalonKey[]; world: "hair" | "eyelash" }) {
  const isHair = world === "hair";
  const accent = isHair ? "#9C7B4A" : "#C8788A";
  const border = isHair ? "#DDD0BE" : "#EDD9DC";
  const labelCls = isHair ? "font-cormorant text-hair-accent-warm" : "font-jakarta text-eye-accent";
  const textCls = isHair ? "text-hair-text font-mincho" : "text-eye-text font-kaku";
  const mutedCls = isHair ? "text-hair-muted" : "text-eye-muted";

  return (
    <section className="max-w-wide mx-auto px-4 pb-10" aria-label="店舗のメニュー・料金・アクセス">
      <div className="pt-8" style={{ borderTop: `1px solid ${border}` }}>
        <p className={`text-[10px] tracking-[0.3em] uppercase mb-4 ${labelCls}`}>Salon — メニュー・料金・アクセス</p>
        <ul className="flex flex-col gap-3">
          {keys.map((k) => {
            const s = SALONS[k];
            return (
              <li key={k}>
                <Link href={`/salon/${k}`} className={`inline-flex items-center gap-2 text-sm ${textCls} hover:opacity-70 transition-opacity`}>
                  <span style={{ color: accent }}>›</span>
                  <span style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>
                    {s.area}の{s.name}のメニュー・料金・アクセスを見る
                  </span>
                </Link>
                <p className={`text-xs mt-1 ml-4 ${mutedCls}`}>{DESC[k]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
