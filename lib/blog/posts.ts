import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import { filterStoreBasicFaq } from "./article-prompt";

export type Category = "hair" | "eyelash";

export type FaqItem = {
  q: string;
  a: string;
};

export type ConversationItem = {
  speaker: "stylist" | "customer";
  customer_type?: "hair-young" | "hair-mature" | "eyelash" | "male";
  text: string;
};

export type HowToStep = { name: string; text: string };

export type PostMeta = {
  title: string;
  /** カードのリンク先slug（親記事へまとめた実例は親記事）。未指定なら slug */
  linkSlug?: string;
  /** 検索結果用の短いタイトル（任意）。なければ seoTitle() が自動で作る */
  seoTitle?: string;
  slug: string;
  category: Category;
  salon: string;
  date: string;
  updated: string;
  excerpt: string;
  thumbnail: string;
  tags: string[];
  question: string;
  answer_summary: string;
  faq: FaqItem[];
  author: string;
  author_role: string;
  steps: HowToStep[];
  instagram_permalink?: string;
  instagram_id?: string;
  conversation?: ConversationItem[];
};

export type Post = PostMeta & {
  contentHtml: string;
};

const contentDir = path.join(process.cwd(), "content");

export function getSlugs(category: Category): string[] {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getPostMeta(category: Category, slug: string): PostMeta & { draft?: boolean } {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    title: data.title ?? "",
    ...(data.seoTitle ? { seoTitle: String(data.seoTitle) } : {}),
    slug: data.slug ?? slug,
    category: data.category ?? category,
    salon: data.salon ?? "",
    date: data.date ?? "",
    updated: data.updated ?? "",
    excerpt: data.excerpt ?? "",
    thumbnail: data.thumbnail ?? "/images/placeholder.jpg",
    tags: data.tags ?? [],
    question: data.question ?? "",
    answer_summary: data.answer_summary ?? "",
    faq: filterStoreBasicFaq(data.faq ?? []),
    author: data.author ?? "",
    author_role: data.author_role ?? "",
    steps: data.steps ?? [],
    draft: (data.draft ?? false) || Boolean(data.merged_into),
    instagram_permalink: data.instagram_permalink,
    instagram_id: data.instagram_id,
    conversation: data.conversation ?? [],
  };
}

export async function getPost(category: Category, slug: string): Promise<Post & { draft?: boolean }> {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processed.toString();

  return {
    title: data.title ?? "",
    ...(data.seoTitle ? { seoTitle: String(data.seoTitle) } : {}),
    slug: data.slug ?? slug,
    category: data.category ?? category,
    salon: data.salon ?? "",
    date: data.date ?? "",
    updated: data.updated ?? "",
    excerpt: data.excerpt ?? "",
    thumbnail: data.thumbnail ?? "/images/placeholder.jpg",
    tags: data.tags ?? [],
    question: data.question ?? "",
    answer_summary: data.answer_summary ?? "",
    faq: filterStoreBasicFaq(data.faq ?? []),
    author: data.author ?? "",
    author_role: data.author_role ?? "",
    steps: data.steps ?? [],
    contentHtml,
    draft: (data.draft ?? false) || Boolean(data.merged_into),
    instagram_permalink: data.instagram_permalink,
    instagram_id: data.instagram_id,
    conversation: data.conversation ?? [],
  };
}

export function getAllPosts(category: Category): PostMeta[] {
  const slugs = getSlugs(category);
  return slugs
    .map((slug) => getPostMeta(category, slug))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsMeta(): PostMeta[] {
  const hair = getAllPosts("hair");
  const eyelash = getAllPosts("eyelash");
  return [...hair, ...eyelash].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllAuthors(): { name: string; role: string; salon: string; category: Category }[] {
  const hair = getAllPosts("hair");
  const eyelash = getAllPosts("eyelash");
  const map = new Map<string, { name: string; role: string; salon: string; category: Category }>();
  for (const p of [...hair, ...eyelash]) {
    if (p.author && !map.has(p.author)) {
      map.set(p.author, { name: p.author, role: p.author_role || "スタイリスト", salon: p.salon, category: p.category });
    }
  }
  return Array.from(map.values());
}

export function getPostsByAuthor(author: string): PostMeta[] {
  const hair = getAllPosts("hair");
  const eyelash = getAllPosts("eyelash");
  return [...hair, ...eyelash].filter((p) => p.author === author).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export type MonthSummary = {
  year: string;
  month: string;
  label: string; // "2026年6月"
  count: number;
};

export function getAvailableMonths(category: Category): MonthSummary[] {
  const posts = getAllPosts(category);
  const map = new Map<string, number>();
  for (const p of posts) {
    const ym = p.date.slice(0, 7);
    map.set(ym, (map.get(ym) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([ym, count]) => ({
      year: ym.slice(0, 4),
      month: ym.slice(5, 7),
      label: `${ym.slice(0, 4)}年${parseInt(ym.slice(5, 7))}月`,
      count,
    }));
}

export function getPostsByYearMonth(category: Category, year: string, month: string): PostMeta[] {
  return getAllPosts(category).filter((p) => p.date.startsWith(`${year}-${month}`));
}

export type SearchPostMeta = Pick<PostMeta, "slug" | "category" | "title" | "excerpt" | "tags" | "salon" | "question">;

export function getPostsForSearch(): SearchPostMeta[] {
  const hair = getAllPosts("hair");
  const eyelash = getAllPosts("eyelash");
  return [...hair, ...eyelash]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ slug, category, title, excerpt, tags, salon, question }) => ({
      slug, category, title, excerpt, tags, salon, question,
    }));
}

export function getAllTags(category: Category): string[] {
  const posts = getAllPosts(category);
  const set = new Set<string>();
  for (const p of posts) for (const t of p.tags) set.add(t);
  return Array.from(set).sort();
}


/**
 * 親記事へまとめた「新しい実例」（2026-11-07以降に、事実だけのルールで作られたスタッフ写真・インスタの実例）。
 * 記事ページは非公開（親記事へ転送）だが、写真は本物の施術実例なので、地域×メニューページの「最新の施術事例」には出す。
 * リンク先は親記事。薬機法フラグ付き・サムネなしは除外。
 */
export const MERGED_CASE_SINCE = "2026-11-07";
export function getMergedCaseMetas(category: Category): PostMeta[] {
  const out: PostMeta[] = [];
  for (const slug of getSlugs(category)) {
    const raw = fs.readFileSync(path.join(contentDir, category, `${slug}.md`), "utf8");
    const { data } = matter(raw);
    if (!data.merged_into || data.yakkihou_flag === true || !data.thumbnail) continue;
    if (String(data.date ?? "") < MERGED_CASE_SINCE) continue;
    const meta = getPostMeta(category, slug);
    out.push({ ...meta, linkSlug: String(data.merged_into) });
  }
  return out;
}

/** 親記事にまとめた新しい実例（親記事のページに写真つきで並べる用）。新しい順 */
export function getMergedCasesFor(category: Category, parentSlug: string): PostMeta[] {
  return getMergedCaseMetas(category)
    .filter((p) => p.linkSlug === parentSlug)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
