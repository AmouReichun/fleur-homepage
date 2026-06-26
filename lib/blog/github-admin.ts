import matter from "gray-matter";

const GRAPH = "https://api.github.com";

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT ?? "";
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function owner() { return process.env.GITHUB_OWNER ?? "AmouReichun"; }
function repo()  { return process.env.GITHUB_REPO  ?? "fleur-blog"; }

type GhFile = { name: string; download_url: string };

export type AdminArticle = {
  slug: string;
  category: string;
  title: string;
  salon: string;
  date: string;
  draft: boolean;
  thumbnail?: string;
  yakkihou_flag?: boolean;
  yakkihou_words?: string[];
};

async function listMdFiles(category: string): Promise<GhFile[]> {
  const res = await fetch(
    `${GRAPH}/repos/${owner()}/${repo()}/contents/content/${category}`,
    { headers: ghHeaders(), cache: "no-store" },
  );
  if (!res.ok) return [];
  const files = (await res.json()) as GhFile[];
  return files.filter((f) => f.name.endsWith(".md"));
}

async function fetchMeta(file: GhFile, category: string): Promise<AdminArticle | null> {
  const res = await fetch(file.download_url, { cache: "no-store" });
  if (!res.ok) return null;
  const raw = await res.text();
  const { data } = matter(raw);
  return {
    slug: file.name.replace(/\.md$/, ""),
    category,
    title: (data.title as string) ?? "",
    salon: (data.salon as string) ?? "",
    date: (data.date as string) ?? "",
    draft: data.draft === true,
    thumbnail: data.thumbnail as string | undefined,
    yakkihou_flag: data.yakkihou_flag as boolean | undefined,
    yakkihou_words: data.yakkihou_words as string[] | undefined,
  };
}

export async function getAdminArticles(category: string): Promise<AdminArticle[]> {
  const files = await listMdFiles(category);
  const results = await Promise.all(files.map((f) => fetchMeta(f, category)));
  return results
    .filter((a): a is AdminArticle => a !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
