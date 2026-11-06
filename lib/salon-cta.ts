// 店舗ごとの Google クチコミ／マップ導線（MEO強化）。
//
// reviewUrl に各店の「クチコミ投稿リンク」を入れるとワンクリックでレビュー画面が開く（最も効果的）。
// 取得方法: Googleビジネスプロフィール → 「レビューを増やす」→ リンクをコピー
//           （https://g.page/r/XXXXXXXX/review のような短縮URL）。
// 未設定の場合は店舗名＋住所のGoogleマップ検索にフォールバックする（リスティングが開き、そこからレビュー可能）。

export type SalonCtaKey = "fleurami" | "riv" | "raffine";

interface SalonCta {
  name: string;
  address: string;
  reviewUrl?: string; // ← g.page/r/.../review を入れるとワンクリック投稿
}

const SALON_CTA: Record<SalonCtaKey, SalonCta> = {
  fleurami: {
    name: "fleur ami",
    address: "高知県香南市野市町西野230",
    reviewUrl: "https://g.page/r/CVY6rOf-UWbxEAE/review",
  },
  riv: {
    name: "Riv. by fleur ami",
    address: "高知県高知市南川添9-21 フルールアミー3 2F",
    reviewUrl: "https://g.page/r/CdEFX3xXBBF7EAE/review",
  },
  raffine: {
    name: "Raffine",
    address: "高知県高知市はりまや町1-4-8 TNはりまやビル3F",
    reviewUrl: "https://g.page/r/CbD8dVZGgEeuEAE/review",
  },
};

function mapsSearchUrl(name: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
}

export function salonCta(key: string): { name: string; reviewUrl: string; mapsUrl: string } | null {
  const s = SALON_CTA[key as SalonCtaKey];
  if (!s) return null;
  const mapsUrl = mapsSearchUrl(s.name, s.address);
  return {
    name: s.name,
    reviewUrl: s.reviewUrl ?? mapsUrl,
    mapsUrl,
  };
}
