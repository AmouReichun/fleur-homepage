import type { ConversationItem } from "./posts";

const BASE = "/images/staff-characters";

const STAFF_MAP: Record<string, string> = {
  "西内みゆき":   `${BASE}/nishiuchimiyuki.webp`,
  "西内 みゆき":  `${BASE}/nishiuchimiyuki.webp`,
  "山岡悠弥":     `${BASE}/yamaokayuya.webp`,
  "山岡 悠弥":    `${BASE}/yamaokayuya.webp`,
  "川上凛":       `${BASE}/kawakamirin.webp`,
  "川上 凛":      `${BASE}/kawakamirin.webp`,
  "高田和花":     `${BASE}/takata.webp`,
  "高田 和花":    `${BASE}/takata.webp`,
  "髙田和花":     `${BASE}/takata.webp`,
  "髙田 和花":    `${BASE}/takata.webp`,
  "西森心大":     `${BASE}/nishimorikota.webp`,
  "西森 心大":    `${BASE}/nishimorikota.webp`,
  "細川彩香":     `${BASE}/hosokawasayaka.webp`,
  "細川 彩香":    `${BASE}/hosokawasayaka.webp`,
  "沢村瑞希":     `${BASE}/sawamuramisaki.webp`,
  "沢村 瑞希":    `${BASE}/sawamuramisaki.webp`,
  "安井未琉":     `${BASE}/yasui.webp`,
  "安井 未琉":    `${BASE}/yasui.webp`,
  "やすい":       `${BASE}/yasui.webp`,
  "尾崎あい":     `${BASE}/ozaki.webp`,
  "尾崎 あい":    `${BASE}/ozaki.webp`,
  "おざき":       `${BASE}/ozaki.webp`,
  "おおの":       `${BASE}/oono.webp`,
  "くろせ":       `${BASE}/kurose.webp`,
};

const CUSTOMER_MAP: Record<NonNullable<ConversationItem["customer_type"]>, string> = {
  "hair-young":  `${BASE}/customer-hair-young.webp`,
  "hair-mature": `${BASE}/customer-hair-mature.webp`,
  "eyelash":     `${BASE}/customer-eyelash.webp`,
  "male":        `${BASE}/customer-male.webp`,
};

export function getStylistImage(author: string): string | null {
  return STAFF_MAP[author.trim()] ?? null;
}

export function getCustomerImage(type: ConversationItem["customer_type"]): string {
  if (!type) return CUSTOMER_MAP["hair-young"];
  return CUSTOMER_MAP[type] ?? CUSTOMER_MAP["hair-young"];
}
