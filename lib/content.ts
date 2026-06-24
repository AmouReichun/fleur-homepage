import fs from "fs";
import path from "path";

export interface FaqItem {
  q: string;
  a: string;
  salon?: string;
}

export interface MenuItem {
  name: string;
  price: string;
  desc: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export interface SalonContent {
  salonType: string;
  name: string;
  area: string;
  tagline: string;
  description: string;
  features: string[];
  address: string;
  phone: string;
  hoursWeekday: string;
  hoursSaturday: string;
  closed: string;
  parking: string;
  hotpepperUrl: string;
  instagramUrl: string;
  imageSrc: string;
  nameReading?: string;
  mapEmbedUrl: string;
  faq: FaqItem[];
  menuNotes?: string[];
}

export interface PopularMenu {
  name: string;
  desc: string;
  salon: string;
  category: "hair" | "eyelash";
}

export interface QuickLinkCard {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  imageSrc: string;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  date: string;
  salon?: string;
  imageSrc?: string;
}

export interface StaffMember {
  name: string;
  role: string;
  history?: string;
  salon: string;
  bio: string;
  imageSrc: string;
}

export interface RecruitPosition {
  title: string;
  salon: string;
  description: string;
}

export interface SiteContent {
  salonOrder: string[];
  hero: {
    title: string;
    subtitle: string;
    cta1: string;
    cta2: string;
    images: string[];
  };
  salons: Record<string, SalonContent>;
  menus: Record<string, MenuCategory[]>;
  topFaq: FaqItem[];
  popularMenus: PopularMenu[];
  quickLinks: QuickLinkCard[];
  staff: StaffMember[];
  recruit: {
    headline: string;
    description: string;
    benefits: string[];
    positions: RecruitPosition[];
  };
  company: {
    name: string;
    representative: string;
    founded: string;
    address: string;
    phone: string;
    email: string;
    business: string;
  };
  news: NewsItem[];
  contact: {
    note: string;
  };
}

const CONTENT_PATH = path.join(process.cwd(), "data/content.json");

export function getContent(): SiteContent {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, "utf-8"));
}

export async function saveContent(content: SiteContent): Promise<void> {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2));
}

// 管理画面用: 常に最新をGitHubから取得（キャッシュなし）
export async function getContentLatest(): Promise<SiteContent> {
  if (
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  ) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/data/content.json`,
        {
          headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const json = await res.json();
        return JSON.parse(Buffer.from(json.content, "base64").toString("utf-8"));
      }
    } catch { /* fallback */ }
  }
  return getContent();
}

// 公開ページ用: タグベースキャッシュ（保存時に revalidateTag('site-content') で即時更新）
export async function getContentCached(): Promise<SiteContent> {
  if (
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_OWNER &&
    process.env.GITHUB_REPO
  ) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/data/content.json`,
        {
          headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
          next: { tags: ["site-content"] },
        }
      );
      if (res.ok) {
        const json = await res.json();
        return JSON.parse(Buffer.from(json.content, "base64").toString("utf-8"));
      }
    } catch { /* fallback */ }
  }
  return getContent();
}
