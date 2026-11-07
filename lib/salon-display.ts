/**
 * 店舗の「表示名」を返すヘルパー。
 *
 * 内部キー（content.json の salons キー・salonOrder・staff[].salon・記事 frontmatter の salon 値・URL）は
 * 旧表記（"fleurami" / "Riv. by fleurami" / "riv" / "raffine" など）のまま残しているため、
 * 画面・JSON-LD・メタ情報に出すときは必ずここを通して正式表記に変換する。
 * 入力値そのもの（照合用のキー）は変えないこと。
 */

export const SALON_DISPLAY = {
  fleurami: "fleur ami",
  riv: "Riv. by fleur ami",
  raffine: "Raffine",
} as const;

export type SalonDisplayKey = keyof typeof SALON_DISPLAY;

/** 旧表記・内部キー・正式表記のどれを渡しても店舗キーを返す（該当なしは null） */
export function salonDisplayKeyOf(keyOrName: string | null | undefined): SalonDisplayKey | null {
  if (!keyOrName || /[\/／]/.test(keyOrName)) return null;
  const s = keyOrName.toLowerCase().replace(/[\s.・]/g, "");
  if (!s) return null;
  // "Riv. by fleurami" / "Riv.byfleurami" / "riv" / "Riv. by fleur ami" など
  if (s.startsWith("riv")) return "riv";
  if (s.includes("raffine") || s.includes("ラフィーネ")) return "raffine";
  if (s === "fleurami" || s === "フルールアミー") return "fleurami";
  return null;
}

/** 店舗の表示名。未知の値はそのまま返す（"fleurami/ Riv" のような複数店表記も変換する） */
export function salonDisplayName(keyOrName: string | null | undefined): string {
  if (!keyOrName) return "";
  const key = salonDisplayKeyOf(keyOrName);
  if (key) return SALON_DISPLAY[key];
  // 「fleurami/ Riv.」のような複数店表記
  if (/[\/／]/.test(keyOrName)) {
    return keyOrName
      .split(/[\/／]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => salonDisplayName(p))
      .join(" / ");
  }
  return keyOrName;
}
