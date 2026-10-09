import type { PostMeta } from "./posts";
import { salonKeyOf } from "./internal-links";

/**
 * 検索結果に出す <title> を作る。
 * 記事タイトル（H1）は長い「問い＋｜サブタイトル」形式が多く、検索結果では前半30字前後しか表示されない。
 * そのため <title> は「｜」より前のメイン部分＋短い店名・地域だけにする（H1は変えない）。
 * frontmatter に seoTitle があればそれを最優先する。
 */
const SUFFIX: Record<ReturnType<typeof salonKeyOf>, { short: string; names: RegExp }> = {
  riv: { short: "高知市の美容室Riv.", names: /Riv\.?|リヴ|リブ/ },
  fleurami: { short: "香南市の美容室fleurami", names: /fleur ?ami|フルールアミー/i },
  raffine: { short: "高知市のまつげ眉毛サロンRaffine", names: /Raffine|ラフィーネ/ },
};

/**
 * 店名はタイトルの中の店名・地域名を優先して決める。
 * frontmatter の salon 欄がタイトルと食い違っている記事があるため（例：タイトルはRiv.・salon欄はfleurami）。
 */
function salonFromTitle(post: PostMeta): ReturnType<typeof salonKeyOf> {
  if (post.category === "eyelash") return "raffine";
  const t = post.title;
  if (/Riv\.?|リヴ|リブ/.test(t)) return "riv";
  if (/fleur ?ami|フルールアミー|香南|野市/i.test(t)) return "fleurami";
  if (/高知市/.test(t)) return "riv";
  return salonKeyOf(post);
}

export function seoTitle(post: PostMeta & { seoTitle?: string }): string {
  if (post.seoTitle && post.seoTitle.trim()) return post.seoTitle.trim();
  const key = salonFromTitle(post);
  const main = post.title.split(/[｜|]/)[0].trim();
  const { short, names } = SUFFIX[key];
  // メイン部分に地域名と店名が両方入っていれば、後ろに何も付けない
  if (names.test(main) && /高知|香南|野市/.test(main)) return main;
  return `${main}｜${short}`;
}
