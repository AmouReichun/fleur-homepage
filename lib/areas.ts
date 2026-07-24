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
        a: "高知市南川添の「Riv. by fleurami（リヴ バイ フルールアミー）」が髪質改善トリートメントと白髪ぼかしを得意としています。カウンセリング重視で、大人女性の髪のお悩みに丁寧に対応。Googleクチコミ4.65（674件）。電話088-884-5566。",
      },
      {
        q: "高知市でまつ毛パーマができるサロンを教えてください。",
        a: "高知市はりまや橋のアイラッシュサロン「Raffine（ラフィーネ）」がまつ毛パーマ（パリジャンリフト・ラッシュリフト）・まつエク・眉毛WAXに特化したサロンです。持続は4〜6週間が目安。Googleクチコミ4.82（200件以上）。電話090-7120-5566。",
      },
      {
        q: "高知市で縮毛矯正をするならどこがいい？",
        a: "高知市南川添の「Riv. by fleurami」で縮毛矯正を受けられます。くせ毛・うねりの状態に合わせた薬剤選定で、ダメージを抑えた自然なストレートに仕上げます。",
      },
      {
        q: "高知市の美容室・アイラッシュサロンの予約方法は？",
        a: "Riv. by fleuramiはホットペッパービューティーまたはLINEで予約できます。RaffineはホットペッパービューティーまたはInstagramのDMからご予約いただけます。公式サイトhttps://fleur-group.jp/salonからも各予約ページへアクセスできます。",
      },
      {
        q: "高知市で眉毛WAXができる場所はありますか？",
        a: "高知市はりまや橋の「Raffine（ラフィーネ）」で眉毛WAX（アイブロウ）を受けられます。メンズ眉WAXにも対応。黄金比に整えるデザインで顔印象がすっきりします。まつげメニューとの同日施術も可能。",
      },
      {
        q: "高知市で白髪ぼかし・グレイカラーができる美容室はどこですか？",
        a: "高知市南川添の「Riv. by fleurami」が白髪ぼかしカラーを得意としています。ハイライトで白髪をなじませ、伸びても境目が目立ちにくいグレイブレンドカラーで大人世代に人気です。",
      },
      {
        q: "高知市でまつげエクステ（マツエク）ができるサロンはどこですか？",
        a: "高知市はりまや橋の「Raffine（ラフィーネ）」でまつげエクステを提供しています。韓国束感・フラットラッシュ・LEDエクステに対応。丁寧なカウンセリングで似合うデザインをご提案。",
      },
      {
        q: "高知市で韓国風ヘアスタイル・レイヤーカットができる美容室は？",
        a: "高知市南川添の「Riv. by fleurami」では韓国風スタイル・くびれヘア・レイヤーカットに対応しています。骨格・髪質に合わせた再現しやすいデザインをご提案します。",
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
        a: "香南市野市町の「fleurami（フルールアミー）」が縮毛矯正を得意としています。くせ毛・うねり・広がりにお悩みの方に対応し、ダメージを抑えた自然なストレートに仕上げます。無料駐車場7台完備。電話0887-56-5566。",
      },
      {
        q: "香南市で白髪ぼかし・グレイカラーに対応している美容室はどこですか？",
        a: "香南市の「fleurami」が白髪ぼかしカラーに対応しています。ハイライトを使った白髪ぼかし・グレイブレンドカラーで、伸びても目立ちにくい自然な仕上がりが人気です。",
      },
      {
        q: "香南市の美容室の駐車場は？",
        a: "「fleurami」（香南市野市町西野230）は無料駐車場が7台あります。のいち駅から車で約4分。お車でのアクセスが便利な立地です。",
      },
      {
        q: "香南市で髪質改善トリートメントを受けられる美容室は？",
        a: "香南市の「fleurami」で髪質改善トリートメントを受けられます。うねり・ダメージ・広がりが気になる方向けに、手触りや指通りが整いやすい施術をご提案します。",
      },
      {
        q: "香南市の美容室の予約方法を教えてください。",
        a: "「fleurami」はホットペッパービューティーまたはLINEからご予約いただけます。初めての方もお気軽にどうぞ。Web予約：https://fleur-group.jp/salon/fleurami",
      },
      {
        q: "野市にある美容室はどこですか？",
        a: "香南市野市町に「fleurami（フルールアミー）」があります。住所：香南市野市町西野230。電話：0887-56-5566。縮毛矯正・髪質改善・艶カラーが得意な美容室。Googleクチコミ4.67（388件）。",
      },
      {
        q: "香南市でアイラッシュ・まつげパーマはできますか？",
        a: "香南市にはアイラッシュサロンはありませんが、同じfleur GROUPの「Raffine（ラフィーネ）」が高知市はりまや橋にあり、まつげパーマ・まつエク・眉毛WAXを提供しています。",
      },
    ],
  },
  {
    slug: "noichi",
    name: "野市",
    salonKeys: ["fleurami"],
    faq: [
      {
        q: "野市にある美容室はどこですか？",
        a: "香南市野市町に「fleurami（フルールアミー）」があります。住所：香南市野市町西野230。電話：0887-56-5566。無料駐車場7台完備。Googleクチコミ4.67（388件）。",
      },
      {
        q: "野市で縮毛矯正ができる美容室は？",
        a: "野市（香南市野市町）の「fleurami」が縮毛矯正を得意としています。くせ毛・うねりをサラサラのストレートへ。ダメージを抑えた自然な仕上がり。",
      },
      {
        q: "野市の美容室の駐車場は？",
        a: "「fleurami」（野市町西野230）は無料駐車場7台完備。のいち駅から車で約4分のアクセス便利な立地。",
      },
      {
        q: "野市で髪質改善ができる美容室は？",
        a: "野市の「fleurami（フルールアミー）」で髪質改善トリートメントを提供しています。うねり・パサつき・ダメージを補修してツヤ髪へ。",
      },
    ],
  },
  {
    slug: "harimayabashi",
    name: "はりまや橋",
    salonKeys: ["raffine"],
    faq: [
      {
        q: "はりまや橋でまつげパーマができるサロンはどこですか？",
        a: "高知市はりまや橋の「Raffine（ラフィーネ）」でまつげパーマ（パリジャンリフト・ラッシュリフト）を提供しています。住所：高知市はりまや町1-4-8 TNはりまやビル3F。電話：090-7120-5566。Googleクチコミ4.82（200件以上）。",
      },
      {
        q: "はりまや橋でまつげエクステ（マツエク）できるサロンは？",
        a: "高知市はりまや橋の「Raffine（ラフィーネ）」でまつげエクステを提供しています。韓国束感・フラットラッシュ・LEDエクステに対応。全席半個室で快適に施術。",
      },
      {
        q: "はりまや橋周辺のアイラッシュサロンはどこですか？",
        a: "「Raffine（ラフィーネ）」が高知市はりまや橋周辺のアイラッシュ専門サロンです。まつげパーマ・まつエク・眉毛WAX・メンズ眉WAXに特化。高知市内でトップクラスのGoogleクチコミ評価（4.82）。",
      },
      {
        q: "はりまや橋で眉毛WAXができる場所は？",
        a: "「Raffine（ラフィーネ）」（高知市はりまや町1-4-8）で眉毛WAX・アイブロウを提供。メンズ眉WAXにも対応。まつげメニューとの同日施術も可能。",
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
