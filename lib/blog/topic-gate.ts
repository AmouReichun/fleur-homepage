/**
 * 記事テーマの重複ガード（2026-11-07 Raffine記事の整理で導入）
 *
 * 同じテーマの記事が量産されると、Google・AIがどれを出せばいいか迷い、全部が弱くなる。
 * 「もう親記事があるテーマ」は新しい記事を作らない（親記事の更新で対応する）。
 * 一重・まつげが少ない・パリジェンヌ・本数／カール指定などの「独自の切り口」がある場合だけ通す。
 */

type Gate = { name: string; parent: string; match: RegExp };

// Raffine：親記事があるテーマ（上から順に判定）
const RAFFINE_COVERED: Gate[] = [
  { name: "料金", parent: "kochi-matsuge-pama-matsuek-ryokin-souba", match: /料金|相場|値段|いくら/ },
  { name: "パーマとマツエクの比較", parent: "kochi-matsuek-vs-matsuge-pama-hikaku", match: /(パーマ|リフト).*(マツエク|エクステ).*(違い|比較|どっち|どちら)|(マツエク|エクステ).*(パーマ|リフト).*(違い|比較|どっち|どちら)/ },
  { name: "持ち・頻度", parent: "kochi-matsuge-pama-mochi-hindo-nagamochi", match: /持ち|頻度|長持ち|続かない|落ちやすい|かけ直し/ },
  { name: "メンズ眉", parent: "kochi-mens-eyebrow-wax-matsuge", match: /メンズ|男性/ },
  { name: "まつげ＋眉の同時", parent: "kochi-lashperm-eyebrow-wax-set-raffine", match: /(まつ|マツ|ラッシュ).*(眉|まゆ|アイブロウ)|(眉|まゆ|アイブロウ).*(まつ|マツ|ラッシュ)/ },
  { name: "眉サロン選び・眉WAX", parent: "kochi-eyebrow-salon-erabikata", match: /眉|まゆ|アイブロウ/ },
  { name: "自然なマツエク・マツエク選び", parent: "kochi-matsuge-eyelash-extension-supppin-meryoku-raffine", match: /マツエク|まつげエクステ|まつ毛エクステ|エクステ/ },
  { name: "まつげパーマの選び方・仕上がり", parent: "kochi-matsuge-perm-first-time-20s-impression", match: /まつ毛パーマ|まつげパーマ|まつパ|ラッシュリフト|まつ毛|まつげ/ },
];

// これがタイトルに入っていれば「独自の切り口」として通す（実例・悩み別・特殊メニュー）
const RAFFINE_DISTINCT = /一重|奥二重|逆さ|少ない|短い|下がり|パリジェンヌ|エクパーマ|フラットラッシュ|バインドロック|LED|束感マツエク|韓国|[0-9０-９]+本|[CDJＣＤＪ]カール|トラブル|しみ|アレルギー|下まつ/;

export type TopicGateResult = { ok: true } | { ok: false; reason: string; parent?: string };

function norm(t: string): string {
  return t.replace(/高知県|高知市|高知|はりまや橋|Raffine|ラフィーネ|fleur ?ami|fleurami|Riv\.?|【決定版】|[｜|：:？?！!「」『』（）()、。・×\s]/g, "");
}
function bigrams(t: string): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i < t.length - 1; i++) s.add(t.slice(i, i + 2));
  return s;
}
export function titleSimilarity(a: string, b: string): number {
  const A = bigrams(norm(a));
  const B = bigrams(norm(b));
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / Math.max(1, A.size + B.size - inter);
}

/**
 * @param salonName 記事の salon（"Raffine" など）
 * @param title 生成された記事タイトル
 * @param existingTitles 同じサロンの既存タイトル（統合済み・下書きも含める）
 */
export function checkTopicGate(salonName: string, title: string, existingTitles: string[]): TopicGateResult {
  // 全サロン共通：ほぼ同じタイトルが既にある
  for (const t of existingTitles) {
    const s = titleSimilarity(title, t);
    if (s >= 0.6) return { ok: false, reason: `既存記事とタイトルがほぼ同じ（類似度${s.toFixed(2)}：${t}）` };
  }
  if (salonName === "Raffine" && !RAFFINE_DISTINCT.test(title)) {
    const g = RAFFINE_COVERED.find((x) => x.match.test(title));
    if (g) return { ok: false, reason: `テーマ「${g.name}」は親記事あり（${g.parent}）。新記事ではなく親記事を更新する`, parent: g.parent };
  }
  return { ok: true };
}
