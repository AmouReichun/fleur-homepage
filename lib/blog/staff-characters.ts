import type { ConversationItem } from "./posts";

const BASE = "/images/staff-characters";

const STAFF_MAP: Record<string, string> = {
  "西内みゆき":   `${BASE}/nishiuchimiyuki.png`,
  "西内 みゆき":  `${BASE}/nishiuchimiyuki.png`,
  "山岡悠弥":     `${BASE}/yamaokayuya.png`,
  "山岡 悠弥":    `${BASE}/yamaokayuya.png`,
  "川上凛":       `${BASE}/kawakamirin.png`,
  "川上 凛":      `${BASE}/kawakamirin.png`,
  "高田和花":     `${BASE}/takata.png`,
  "高田 和花":    `${BASE}/takata.png`,
  "髙田和花":     `${BASE}/takata.png`,
  "髙田 和花":    `${BASE}/takata.png`,
  "西森心大":     `${BASE}/nishimorikota.png`,
  "西森 心大":    `${BASE}/nishimorikota.png`,
  "細川彩香":     `${BASE}/hosokawasayaka.png`,
  "細川 彩香":    `${BASE}/hosokawasayaka.png`,
  "沢村瑞希":     `${BASE}/sawamuramisaki.png`,
  "沢村 瑞希":    `${BASE}/sawamuramisaki.png`,
  "やすい":       `${BASE}/yasui.png`,
  "おざき":       `${BASE}/ozaki.png`,
  "おおの":       `${BASE}/oono.png`,
  "くろせ":       `${BASE}/kurose.png`,
};

const CUSTOMER_MAP: Record<NonNullable<ConversationItem["customer_type"]>, string> = {
  "hair-young":  `${BASE}/customer-hair-young.png`,
  "hair-mature": `${BASE}/customer-hair-mature.png`,
  "eyelash":     `${BASE}/customer-eyelash.png`,
  "male":        `${BASE}/customer-male.png`,
};

export function getStylistImage(author: string): string | null {
  return STAFF_MAP[author.trim()] ?? null;
}

export function getCustomerImage(type: ConversationItem["customer_type"]): string {
  if (!type) return CUSTOMER_MAP["hair-young"];
  return CUSTOMER_MAP[type] ?? CUSTOMER_MAP["hair-young"];
}
