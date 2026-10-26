import type { SiteContent } from "@/lib/content";
import { LP_SALON_KEYS, resolveLineUrls, type LpContent } from "@/lib/lp";
import type { LpSalonInfo } from "./components/LineCta";

/** 店舗情報は既存の店舗データ（管理画面 > 店舗）から取り、LINE URL だけ LP 設定を優先する */
export function buildSalonInfo(content: SiteContent, lp: LpContent): LpSalonInfo[] {
  const urls = resolveLineUrls(lp, content.salons);
  return LP_SALON_KEYS.filter((k) => content.salons[k]).map((k) => {
    const s = content.salons[k];
    const hours = s.hoursWeekday === s.hoursSaturday || !s.hoursSaturday ? s.hoursWeekday : `平日 ${s.hoursWeekday}／土日 ${s.hoursSaturday}`;
    return {
      key: k,
      name: s.name,
      area: s.area,
      address: s.address,
      hours,
      closed: s.closed,
      parking: s.parking,
      phone: s.phone,
      lineUrl: urls[k],
    };
  });
}
