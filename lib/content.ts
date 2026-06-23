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
  salons: {
    riv: SalonContent;
    fleurami: SalonContent;
    raffine: SalonContent;
  };
  menus: {
    riv: MenuCategory[];
    fleurami: MenuCategory[];
    raffine: MenuCategory[];
  };
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
