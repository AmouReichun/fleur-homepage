// エリア×メニューのランディングページ用データ。
// 「高知市の縮毛矯正」「香南市の白髪ぼかし」のようなローカル検索（SEO/MEO/AIO）を狙う。
// /area/[area] と /area/[area]/[service] を生成する。
import { SERVICES, type ServiceDef, type ServiceSalonKey } from "@/lib/services";

export interface AreaDef {
  slug: string;       // URL用（kochi / konan）
  name: string;       // 表示名（高知市 / 香南市）
  salonKeys: ServiceSalonKey[]; // このエリアにある店舗
}

export const AREAS: AreaDef[] = [
  { slug: "kochi", name: "高知市", salonKeys: ["riv", "raffine"] },
  { slug: "konan", name: "香南市", salonKeys: ["fleurami"] },
];

export function getArea(slug: string): AreaDef | undefined {
  return AREAS.find((a) => a.slug === slug);
}

/** そのエリアで受けられるサービス（エリア内店舗が提供しているもの） */
export function servicesInArea(area: AreaDef): ServiceDef[] {
  return SERVICES.filter((svc) => svc.salonKeys.some((k) => area.salonKeys.includes(k)));
}

/** エリア×サービスで、そのエリア内で提供している店舗キー */
export function offerSalonKeysInArea(area: AreaDef, svc: ServiceDef): ServiceSalonKey[] {
  return svc.salonKeys.filter((k) => area.salonKeys.includes(k));
}

export function getAreaService(
  areaSlug: string,
  serviceSlug: string,
): { area: AreaDef; svc: ServiceDef; salonKeys: ServiceSalonKey[] } | undefined {
  const area = getArea(areaSlug);
  if (!area) return undefined;
  const svc = SERVICES.find((s) => s.slug === serviceSlug);
  if (!svc) return undefined;
  const salonKeys = offerSalonKeysInArea(area, svc);
  if (salonKeys.length === 0) return undefined;
  return { area, svc, salonKeys };
}

/** generateStaticParams 用：全エリア×サービスの組み合わせ */
export function getAllAreaServiceParams(): { area: string; service: string }[] {
  const params: { area: string; service: string }[] = [];
  for (const area of AREAS) {
    for (const svc of servicesInArea(area)) {
      params.push({ area: area.slug, service: svc.slug });
    }
  }
  return params;
}
