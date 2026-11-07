// 実例記事の「施術データ」（店舗・メニュー・定価）を本文の表から取り出す。
// 表はAIが書いたものなので、定価はHPのメニュー表（data/content.json）に同じ金額があるときだけ使う。
// 合わなければ定価は出さない（間違った料金をAIに引用させない）。
import fs from "fs";
import path from "path";
import { getContent } from "@/lib/content";
import { salonKeyOf } from "@/lib/blog/internal-links";
import type { PostMeta } from "@/lib/blog/posts";

export type CaseData = { menu?: string; price?: string };

/** 「¥5,500〜」「5,500円」などを [金額, 〜の有無] にそろえる */
function amounts(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/¥\s?([\d,]+)(〜)?|([\d,]+)円(〜)?/g)) {
    out.push(`${(m[1] ?? m[3]).replace(/,/g, "")}${m[2] ?? m[4] ? "〜" : ""}`);
  }
  return out;
}

export function getCaseData(post: PostMeta): CaseData {
  const file = path.join(process.cwd(), "content", post.category, `${post.slug}.md`);
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, "utf8");
  const rows: Record<string, string> = {};
  for (const m of raw.matchAll(/^\|\s*(メニュー|定価|料金)\s*\|\s*(.+?)\s*\|\s*$/gm)) {
    if (!rows[m[1]]) rows[m[1]] = m[2].replace(/\*\*/g, "").trim();
  }
  const out: CaseData = {};
  if (rows["メニュー"]) out.menu = rows["メニュー"];
  const priceText = rows["定価"] ?? rows["料金"];
  if (priceText) {
    const menus = getContent().menus?.[salonKeyOf(post)] ?? [];
    const valid = new Set(menus.flatMap((c) => c.items.flatMap((i) => amounts(i.price))));
    const found = amounts(priceText);
    if (found.length > 0 && found.every((a) => valid.has(a))) out.price = priceText;
  }
  return out;
}
