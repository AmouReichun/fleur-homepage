/**
 * 統合した記事の「親記事」を書き直す（2026-11-07 Raffine記事の整理で導入）。
 *
 * content/ の merged_into: "親slug" を集め、親ごとに
 *   親記事の本文 ＋ 子記事（統合済み）の要点
 * を渡して「そのテーマの決定版」1本に書き直す。slug・date・thumbnail・instagram_id は変えない。
 *
 * 使い方: npx tsx scripts/merge-rewrite-parents.ts [親slug ...]   （省略時は子記事を持つ親すべて）
 * 実行は GitHub Actions（.github/workflows/merge-rewrite.yml）から。
 */
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import { buildBasePrompt, JSON_INSTRUCTION, AREA_BY_KEY, fixFixedPriceTilde } from "../lib/blog/article-prompt";
import { autoFixNgWords, checkNgWords } from "../lib/blog/ng-words";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SALON_KEY: Record<string, string> = { fleurami: "fleurami", "Riv. by fleurami": "riv", Raffine: "raffine" };

// 親記事から案内する「地域×メニュー」ページ（店選び・料金はこちらが担当）
function areaLinksFor(title: string): string[] {
  const links: string[] = [];
  if (/パーマ|リフト|まつ毛|まつげ/.test(title)) links.push("[高知市のまつげパーマ（Raffineの料金・担当・よくある質問）](/area/kochi/matsuge-perm)");
  if (/マツエク|エクステ/.test(title)) links.push("[高知市のまつげエクステ（Raffineの料金・本数・よくある質問）](/area/kochi/matsuek)");
  if (/眉|まゆ|アイブロウ/.test(title)) links.push("[高知市の眉毛WAX（Raffineの料金・メンズ対応・よくある質問）](/area/kochi/mayuge-wax)");
  if (/料金|相場/.test(title)) {
    for (const l of ["[高知市のまつげパーマ](/area/kochi/matsuge-perm)", "[高知市のまつげエクステ](/area/kochi/matsuek)", "[高知市の眉毛WAX](/area/kochi/mayuge-wax)"]) links.push(l);
  }
  return Array.from(new Set(links));
}

type Child = { slug: string; title: string; body: string; faq: { q: string; a: string }[] };

function collect(): Map<string, { cat: string; children: Child[] }> {
  const map = new Map<string, { cat: string; children: Child[] }>();
  for (const cat of ["hair", "eyelash"]) {
    const dir = path.join(process.cwd(), "content", cat);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf-8"));
      if (!data.merged_into) continue;
      const p = String(data.merged_into);
      if (!map.has(p)) map.set(p, { cat, children: [] });
      map.get(p)!.children.push({ slug: f.replace(/\.md$/, ""), title: String(data.title ?? ""), body: content, faq: data.faq ?? [] });
    }
  }
  return map;
}

async function rewriteParent(parentSlug: string, cat: string, children: Child[]) {
  const filePath = path.join(process.cwd(), "content", cat, `${parentSlug}.md`);
  const { data: fm, content: body } = matter(fs.readFileSync(filePath, "utf-8"));
  const key = SALON_KEY[String(fm.salon)];
  if (!key) throw new Error(`店舗を特定できません: ${fm.salon}`);
  const salonName = String(fm.salon);
  const category = cat as "hair" | "eyelash";
  const base = buildBasePrompt({ category, salonName, area: AREA_BY_KEY[key], articleType: "rewrite" });
  const per = Math.max(500, Math.floor(30000 / Math.max(1, children.length)));
  const childText = children.map((c, i) => `--- 統合した記事${i + 1}：${c.title}\n${c.body.slice(0, per)}\nFAQ: ${c.faq.map((f) => f.q).join(" / ")}`).join("\n\n");
  const links = areaLinksFor(String(fm.title ?? ""));

  const instruction = `
【統合リライト指示】
同じテーマの記事が${children.length + 1}本に分かれていたため、1本に統合しました。下の「親記事」を、このテーマの決定版として書き直してください。

方針:
1. 読者の疑問（このテーマで高知の人が検索・AIに聞くこと）に、最初の段落で結論から答える
2. 子記事から取り入れてよいのは「店の事実（上の店舗情報・メニュー表と一致する内容）」と「一般的に正しい説明・注意点」だけ。子記事にある架空のお客様の事例・会話・年齢・感想・「〜と好評」などは使わない
3. 似た見出しの繰り返しをやめ、見出しは4〜6個にまとめる。「20代向け」などの年齢で分けない
4. FAQは子記事の質問から、検索されそうなものを重複なく4〜5問に絞る
5. 本文の最後に「店の詳しい料金・担当・予約方法」として次のリンクを入れる：
${links.map((l) => "   - " + l).join("\n") || "   - （なし）"}
6. タイトルは今の検索意図を保ちつつ、年齢を入れず、テーマが一目で分かる形にする（32字前後）
7. slug・date・thumbnail は変えない（JSONのslugは「${parentSlug}」のまま返す）

【親記事（今の内容）】
タイトル: ${fm.title ?? ""}
${body.slice(0, 6000)}

【統合した記事（要点を拾う材料。事実だけ使う）】
${childText}`;

  const prompt = `${base}\n\n${instruction}\n\n${JSON_INSTRUCTION}`;
  let g: Record<string, unknown> | null = null;
  for (let attempt = 1; attempt <= 3 && !g; attempt++) {
    const res = await client.messages.create({ model: "claude-sonnet-5-5", max_tokens: 16000, messages: [{ role: "user", content: prompt }] });
    if (res.stop_reason === "max_tokens") { console.error(`  attempt ${attempt}: 出力が上限で途切れた`); continue; }
    const text = (res.content.find((b) => b.type === "text") as { text: string } | undefined)?.text ?? "";
    const m = text.match(/\{[\s\S]+\}/);
    if (!m) { console.error(`  attempt ${attempt}: JSONなし`); continue; }
    try { g = JSON.parse(m[0]); } catch (e) { console.error(`  attempt ${attempt}: JSON不正`, e); }
  }
  if (!g) throw new Error(`生成失敗: ${parentSlug}`);

  const fix = (s: unknown) => fixFixedPriceTilde(salonName, autoFixNgWords(String(s ?? "")));
  const faq = ((g.faq as { q: string; a: string }[]) ?? fm.faq ?? []).map((f) => ({ q: autoFixNgWords(f.q), a: fix(f.a) }));
  const newBody = fix(g.body ?? body);
  const ng = checkNgWords([g.title, g.excerpt, g.answer_summary, newBody, ...faq.map((f) => f.q + f.a)].join(" "));

  const newFm = {
    ...fm,
    title: autoFixNgWords(String(g.title ?? fm.title)),
    excerpt: fix(g.excerpt ?? fm.excerpt),
    tags: (g.tags as string[]) ?? fm.tags,
    question: autoFixNgWords(String(g.question ?? fm.question ?? "")),
    answer_summary: fix(g.answer_summary ?? fm.answer_summary),
    faq,
    steps: (g.steps as unknown[]) ?? [],
    conversation: [],
    yakkihou_flag: ng.length > 0,
    yakkihou_words: ng,
    updated: new Date(Date.now() + 9 * 3600000).toISOString().slice(0, 10),
  };
  delete (newFm as Record<string, unknown>).seoTitle; // タイトルを変えるので古い短縮タイトルは外す
  fs.writeFileSync(filePath, matter.stringify(newBody, newFm), "utf-8");
  console.log(`  ✅ ${parentSlug} ← ${children.length}本を統合: ${newFm.title}${ng.length ? `（⚠ NG語: ${ng.join(",")}）` : ""}`);
}

async function main() {
  const only = process.argv.slice(2);
  const groups = collect();
  let ok = 0, ng = 0;
  for (const [parent, { cat, children }] of Array.from(groups.entries())) {
    if (only.length && !only.includes(parent)) continue;
    try { await rewriteParent(parent, cat, children); ok++; } catch (e) { console.error(`  ❌ ${parent}`, e); ng++; }
  }
  console.log(`完了: ${ok}本 / 失敗 ${ng}本`);
  if (ok === 0 && ng > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
