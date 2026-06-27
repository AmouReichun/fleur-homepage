// 人気メニューの「対応店舗」を扱う純粋関数。
// クライアント／サーバー両方から使うため、fs 等を import している lib/content.ts には置かず、
// 型のみ参照（import type）でここに分離している。
import type { PopularMenu, SalonContent } from "./content";

/**
 * 人気メニューの対応店舗キー一覧を返す。
 * 新形式（salons 配列）があればそれを、無ければ旧形式の自由入力テキスト（salon）を
 * 店舗名・キーと突き合わせて店舗キーへ変換する（後方互換）。
 */
export function popularMenuSalonKeys(
  m: Pick<PopularMenu, "salon" | "salons">,
  salons: Record<string, SalonContent>,
  salonOrder: string[]
): string[] {
  if (m.salons && m.salons.length > 0) {
    return m.salons.filter((k) => salonOrder.includes(k));
  }
  if (!m.salon) return [];
  const tokens = m.salon.split(/[/、,，・|\s]+/).map((t) => t.trim()).filter(Boolean);
  const keys: string[] = [];
  for (const token of tokens) {
    const tl = token.toLowerCase();
    const match = salonOrder.find((key) => {
      const name = (salons[key]?.name ?? "").toLowerCase();
      const kl = key.toLowerCase();
      return kl === tl || name === tl || name.includes(tl) || tl.includes(kl);
    });
    if (match && !keys.includes(match)) keys.push(match);
  }
  return keys;
}

/** 人気メニューの対応店舗を表示用ラベルに変換する（新旧両形式に対応） */
export function popularMenuSalonLabel(
  m: Pick<PopularMenu, "salon" | "salons">,
  salons: Record<string, SalonContent>,
  salonOrder: string[]
): string {
  const keys = popularMenuSalonKeys(m, salons, salonOrder);
  if (keys.length > 0) return keys.map((k) => salons[k]?.name ?? k).join(" / ");
  return m.salon ?? "";
}
