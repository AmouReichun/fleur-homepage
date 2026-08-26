// 症例（施術事例）記事の抽出ヘルパー。
// 既存の記事メタ（frontmatter）と、internal-links の店舗判定・メニューキーワード定義を再利用し、
// 「店舗 × メニュー × 担当スタッフ」の条件で最新の施術事例を取り出す。
// メニューLP・スタッフページ・店舗ページに「最新の施術事例」を自動表示するために使う（手動リンク不要）。
import { getAllPostsMeta, type PostMeta } from "./posts";
import { salonKeyOf, servicesFor, type SalonKey } from "./internal-links";

/** 氏名の表記ゆれ吸収（全角/半角スペース差など）。記事のauthorとスタッフ名の照合に使う。 */
export function normalizeName(name: string): string {
  return name.replace(/[\s　]/g, "");
}

/** 記事が指定メニュー（/area/[area]/[serviceSlug] の serviceSlug）に該当するか。
 *  既存の HAIR_SERVICES / EYE_SERVICES のキーワード・タグ定義を流用して判定する。 */
function matchesService(post: PostMeta, serviceSlug: string): boolean {
  const svc = servicesFor(post.category).find((s) => s.areaSlug === serviceSlug);
  if (!svc) return false;
  if (svc.tag && post.tags.includes(svc.tag)) return true;
  const haystack = [post.title, post.excerpt, post.question, ...(post.tags ?? [])].join(" ");
  return svc.kw.some((kw) => haystack.includes(kw));
}

export type CaseStudyQuery = {
  salonKeys?: SalonKey[];
  serviceSlug?: string;
  author?: string;
  category?: "hair" | "eyelash";
  limit?: number;
};

/** 条件に一致する施術事例を新しい順で返す。該当なしなら空配列（呼び出し側でセクションを非表示に）。 */
export function getCaseStudies(query: CaseStudyQuery): PostMeta[] {
  const { salonKeys, serviceSlug, author, category, limit = 6 } = query;
  let posts = getAllPostsMeta();
  if (category) posts = posts.filter((p) => p.category === category);
  if (author) {
    const target = normalizeName(author);
    posts = posts.filter((p) => normalizeName(p.author) === target);
  }
  if (salonKeys && salonKeys.length > 0) posts = posts.filter((p) => salonKeys.includes(salonKeyOf(p)));
  if (serviceSlug) posts = posts.filter((p) => matchesService(p, serviceSlug));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
}
