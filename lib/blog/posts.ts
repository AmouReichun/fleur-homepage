import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export type Category = "hair" | "eyelash";

export type FaqItem = {
  q: string;
  a: string;
};

export type HowToStep = { name: string; text: string };

export type PostMeta = {
  title: string;
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
    faq: data.faq ?? [],
    author: data.author ?? "",
    author_role: data.author_role ?? "",
    steps: data.steps ?? [],
    draft: data.draft ?? false,
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
    faq: data.faq ?? [],
    author: data.author ?? "",
    author_role: data.author_role ?? "",
    steps: data.steps ?? [],
    contentHtml,
    draft: data.draft ?? false,
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
