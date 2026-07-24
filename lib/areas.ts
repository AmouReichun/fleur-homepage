// エリア×メニューのランディングページ用データ。
// 「高知市の縮毛矯正」「香南市の白髪ぼかし」のようなローカル検索（SEO/MEO/AIO）を狙う。
// /area/[area] と /area/[area]/[service] を生成する。
import { SERVICES, type ServiceDef, type ServiceSalonKey } from "@/lib/services";

export interface AreaFaq {
  q: string;
  a: string;
}

export interface AreaDef {
  slug: string;       // URL用（kochi / konan）
  name: string;       // 表示名（高知市 / 香南市）
  salonKeys: ServiceSalonKey[]; // このエリアにある店舗
  faq?: AreaFaq[];
}

export const AREAS: AreaDef[] = [
  {
    slug: "kochi",
    name: "高知市",
    salonKeys: ["riv", "raffine"],
    faq: [
      {
        q: "高知市で髪質改善が得意な美容室はどこですか？",
        a: "高知市南川添のRiv.by fleuramiが髪質改善トリートメントと白髪ぼかしを得意としています。カウンセリング重視で、大人女性の髪のお悩みに対応しています。",
      },
      {
        q: "高知市でまつ毛パーマができるサロンを教えてください。",
        a: "高知市はりまや橋のアイラッシュサロンRaffineがまつ毛パーマ（パリジャンリフト）・まつエク・眉毛WAXに特化したサロンです。4〜6週間の持続が目安です。",
      },
      {
        q: "高知市で縮毛矯正をするならどこがいい？",
        a: "高知市のRiv.by fleuramiで縮毛矯正を受けられます。くせ毛・うねりのお悩みに対応しており、施術後の仕上がりと扱いやすさを重視したご提案をしています。",
      },
      {
        q: "高知市の美容室・アイラッシュサロンの予約方法は？",
        a: "Riv.by fleuramiはホットペッパービューティーまたはLINEで予約できます。RaffineはホットペッパービューティーまたはInstagramのDMからご予約いただけます。",
      },
      {
        q: "高知市で眉毛WAXができる場所はありますか？",
        a: "高知市はりまや橋のRaffineで眉毛WAXを受けられます。メンズ眉WAXにも対応しており、黄金比に整えます。",
      },
    ],
  },
  {
    slug: "konan",
    name: "香南市",
    salonKeys: ["fleurami"],
    faq: [
      {
        q: "香南市で縮毛矯正ができる美容室はありますか？",
        a: "香南市野市町のfleur amiが縮毛矯正を得意としています。くせ毛・うねり・広がりにお悩みの方に対応し、経験豊富なスタイリストが担当します。",
      },
      {
        q: "香南市で白髪ぼかし・グレイカラーに対応している美容室はどこですか？",
        a: "香南市のfleur amiが白髪ぼかしカラーに対応しています。白髪を活かしたグレイブレンドカラーで、自然なグラデーションに仕上げます。",
      },
      {
        q: "香南市の美容室の駐車場は？",
        a: "fleur ami（香南市野市町西野230）は無料駐車場が7台あります。のいち駅から車で約4分です。",
      },
      {
        q: "香南市で髪質改善トリートメントを受けられる美容室は？",
        a: "香南市のfleur amiで髪質改善トリートメントを受けられます。うねり・ダメージ・広がりが気になる方向けに、手触りや指通りが整いやすい施術をご提案しています。",
      },
      {
        q: "香南市の美容室の予約方法を教えてください。",
        a: "fleur amiはホットペッパービューティーまたはLINEからご予約いただけます。初めての方もお気軽にどうぞ。",
      },
    ],
  },
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
