import type { PostMeta } from "./posts";

/* ───────── 店舗情報（内部ハブ・予約・地域） ───────── */
export type SalonKey = "fleurami" | "riv" | "raffine";

export const SALONS: Record<
  SalonKey,
  {
    key: SalonKey; name: string; area: string; world: "hair" | "eyelash"; hub: string;
    hpb: string; phone: string; instagram: string; line: string; web: string;
  }
> = {
  fleurami: {
    key: "fleurami", name: "fleurami", area: "香南市", world: "hair", hub: "/blog/hair/fleur-ami",
    hpb: "https://beauty.hotpepper.jp/slnH000528388/",
    phone: "0887-56-5566", instagram: "https://www.instagram.com/fleurami_info",
    line: "https://liff.line.me/2000133690-w9PO3qD9/l/2fI1c0c94p/hair",
    web: "https://beauty.postas.asia/reserve/top?CODE=3df04abf87b551597a2b2595613d7d63b3843d96225b54738262420b60f751ff",
  },
  riv: {
    key: "riv", name: "Riv.by fleurami", area: "高知市", world: "hair", hub: "/blog/hair/riv",
    hpb: "https://beauty.hotpepper.jp/slnH000634137/",
    phone: "088-884-5566", instagram: "https://www.instagram.com/riv.kochi",
    line: "https://liff.line.me/2006084473-gbABZ6Lz/l/2a078394G2/hair",
    web: "https://beauty.postas.asia/reserve/top?CODE=440902d92d79129b32212b06e9514dc4f94094ed05e7ea4a5e1c175af56570a1",
  },
  raffine: {
    key: "raffine", name: "Raffine", area: "高知市", world: "eyelash", hub: "/blog/eyelash/raffine",
    hpb: "https://beauty.hotpepper.jp/kr/slnH000767549/",
    phone: "090-7120-5566", instagram: "https://www.instagram.com/raffine0815",
    line: "https://liff.line.me/2007963689-Ddk29bRo/l/2N8fd97deza/kirei",
    web: "https://beauty.postas.asia/reserve/top?CODE=41e62da8591af0f29eb176ca79e4dff362421b2d78c581fe9500753350728f12",
  },
};

/* 各店舗の予約チャネル（URL未設定のものは自動で非表示）。
   アンカーは店舗名＋手段のキーワードにする（「こちら」単独は使わない）。 */
export type ReservationChannel = { kind: "tel" | "web" | "line" | "instagram" | "hpb"; label: string; href: string; external: boolean };

export function reservationChannels(key: SalonKey): ReservationChannel[] {
  const s = SALONS[key];
  const ch: ReservationChannel[] = [];
  if (s.phone) ch.push({ kind: "tel", label: `${s.name}に電話で予約`, href: `tel:${s.phone.replace(/[^0-9]/g, "")}`, external: false });
  if (s.web) ch.push({ kind: "web", label: `${s.name}のWeb予約`, href: s.web, external: true });
  if (s.line) ch.push({ kind: "line", label: `${s.name}にLINEで予約`, href: s.line, external: true });
  if (s.instagram) ch.push({ kind: "instagram", label: `${s.name}にInstagramのDMで予約`, href: s.instagram, external: true });
  if (s.hpb) ch.push({ kind: "hpb", label: `${s.name}をホットペッパーで予約`, href: s.hpb, external: true });
  return ch;
}

export const SALON_ORDER: SalonKey[] = ["riv", "fleurami", "raffine"];

export function salonKeyOf(post: PostMeta): SalonKey {
  if (post.category === "eyelash") return "raffine";
  if (post.salon?.startsWith("Riv")) return "riv";
  return "fleurami";
}

/* ───────── メニュー（サービス）定義 ─────────
   kw: 本文・タグ・タイトルから検出するキーワード
   label: 表示名／アンカー用
   hub: 専用ハブページがある場合のURL（無ければタグページにフォールバック）
   tag: タグページのタグ名（実在タグのみリンク） */
type ServiceDef = { kw: string[]; label: string; hub?: string; tag?: string };

const HAIR_SERVICES: ServiceDef[] = [
  { kw: ["髪質改善"], label: "髪質改善", hub: "/blog/hair/kamiushitsu-kaizen", tag: "髪質改善" },
  { kw: ["縮毛矯正"], label: "縮毛矯正", tag: "縮毛矯正" },
  { kw: ["白髪ぼかし", "白髪"], label: "白髪ぼかし", tag: "白髪ぼかし" },
  { kw: ["艶カラー", "ツヤカラー", "イヤリングカラー", "ハイライト", "グレイカラー"], label: "艶カラー", tag: "艶カラー" },
  { kw: ["切りっぱなしボブ", "ショートボブ", "ボブ"], label: "ボブスタイル", tag: "ボブ" },
  { kw: ["メンズ", "刈り上げ", "フェード"], label: "メンズスタイル", tag: "メンズ" },
  { kw: ["パーマ"], label: "パーマ", tag: "パーマ" },
];

const EYE_SERVICES: ServiceDef[] = [
  { kw: ["まつげパーマ", "まつ毛パーマ", "ラッシュリフト", "パリジェンヌ"], label: "まつげパーマ", tag: "まつげパーマ" },
  { kw: ["マツエク", "まつげエクステ", "まつエク", "エクステ", "束感", "エクパーマ", "LEDエクステ"], label: "まつげエクステ", tag: "まつげエクステ" },
  { kw: ["眉毛WAX", "眉WAX", "眉ワックス", "眉毛", "眉"], label: "眉毛WAX", tag: "眉毛WAX" },
];

export function servicesFor(world: "hair" | "eyelash"): ServiceDef[] {
  return world === "hair" ? HAIR_SERVICES : EYE_SERVICES;
}

/* 記事テキスト（タイトル＋タグ＋本文）にサービスkwが含まれるか */
function postMatchesService(post: PostMeta, svc: ServiceDef, haystack: string): boolean {
  if (post.tags.some((t) => svc.kw.some((k) => t.includes(k)))) return true;
  return svc.kw.some((k) => haystack.includes(k));
}

/* サービスの内部リンク先を解決（実在タグ or ハブのみ。無ければnull） */
function resolveServiceHref(world: "hair" | "eyelash", svc: ServiceDef, validTags: Set<string>): string | null {
  if (svc.hub) return svc.hub;
  if (svc.tag && validTags.has(svc.tag)) return `/${world}/tag/${encodeURIComponent(svc.tag)}`;
  return null;
}

export type RelatedMenu = { label: string; href: string; anchor: string };

/* 記事に対する「関連メニュー」（キーワード一致＋有効リンクのみ） */
export function relatedMenusFor(post: PostMeta, validTags: Set<string>, bodyText = ""): RelatedMenu[] {
  const world = post.category;
  const area = SALONS[salonKeyOf(post)].area;
  const haystack = `${post.title} ${post.tags.join(" ")} ${bodyText}`;
  const out: RelatedMenu[] = [];
  for (const svc of servicesFor(world)) {
    if (!postMatchesService(post, svc, haystack)) continue;
    const href = resolveServiceHref(world, svc, validTags);
    if (!href) continue;
    if (out.some((o) => o.href === href)) continue;
    out.push({ label: svc.label, href, anchor: `${area}の${svc.label}メニューを見る` });
  }
  // フォールバック：何も一致しなければ記事タグをメニュー扱いでリンク
  if (out.length === 0) {
    for (const t of post.tags) {
      if (validTags.has(t)) {
        out.push({ label: t, href: `/${world}/tag/${encodeURIComponent(t)}`, anchor: `「${t}」の記事一覧を見る` });
      }
      if (out.length >= 3) break;
    }
  }
  return out.slice(0, 5);
}

/* パンくず用：記事の主要サービス（1つ）。HOME > 世界 > サービス > 記事 */
export function primaryServiceCrumb(
  post: PostMeta,
  validTags: Set<string>,
  bodyText = ""
): { name: string; url: string } | null {
  const world = post.category;
  const haystack = `${post.title} ${post.tags.join(" ")} ${bodyText}`;
  for (const svc of servicesFor(world)) {
    if (!postMatchesService(post, svc, haystack)) continue;
    const href = resolveServiceHref(world, svc, validTags);
    if (href) return { name: svc.label, url: href };
  }
  return null;
}

/* ───────── 本文への内部リンク自動挿入 ─────────
   <p> 内テキストの最初の出現のみリンク化。見出し・既存<a>・リスト内は対象外。
   1キーワード1回・記事全体で最大 maxLinks 件。 */
export function autoLinkBody(
  html: string,
  world: "hair" | "eyelash",
  validTags: Set<string>,
  area: string,
  maxLinks = 4
): string {
  const accent = world === "hair" ? "#9C7B4A" : "#C8788A";
  const used = new Set<string>();
  let count = 0;

  // リンク対象（ラベル→href）。長いキーワード優先で誤マッチ低減
  const targets: { kw: string; href: string; label: string }[] = [];
  for (const svc of servicesFor(world)) {
    const href = resolveServiceHref(world, svc, validTags);
    if (!href) continue;
    for (const kw of svc.kw) targets.push({ kw, href, label: svc.label });
  }
  targets.sort((a, b) => b.kw.length - a.kw.length);

  return html.replace(/<p>([\s\S]*?)<\/p>/g, (full, inner: string) => {
    if (count >= maxLinks) return full;
    if (/<a[\s>]/.test(inner)) return full; // 既にリンクを含む段落はスキップ
    let replaced = inner;
    for (const t of targets) {
      if (count >= maxLinks) break;
      if (used.has(t.href)) continue;
      const idx = replaced.indexOf(t.kw);
      if (idx === -1) continue;
      // タグ属性内などに割り込まないよう、直前が "<" でないことを簡易確認
      const before = replaced.slice(Math.max(0, idx - 1), idx);
      if (before === "<" || before === "/") continue;
      const title = `${area}の${t.label}について詳しく見る`;
      const anchor = `<a href="${t.href}" style="color:${accent};text-decoration:underline;text-underline-offset:2px;font-weight:600" title="${title}">${t.kw}</a>`;
      replaced = replaced.slice(0, idx) + anchor + replaced.slice(idx + t.kw.length);
      used.add(t.href);
      count++;
    }
    return `<p>${replaced}</p>`;
  });
}
