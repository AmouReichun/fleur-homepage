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
  lineUrl?: string; // LINE予約URL（任意・未設定なら非表示）
  webReserveUrl?: string; // 店舗Web予約URL（任意・未設定なら非表示）
}

export interface PopularMenu {
  name: string;
  desc: string;
  /** 旧形式: 自由入力テキスト（後方互換。新規保存では salons を使用） */
  salon?: string;
  /** 新形式: 店舗キーの配列（salonOrder のキー） */
  salons?: string[];
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
  // 拡張（任意・未設定なら非表示）
  specialties?: string[]; // 得意技術
  ageGroups?: string[]; // 得意年代
  styles?: string[]; // 得意スタイル
  instagramUrl?: string; // InstagramプロフィールURL
}

export interface RecruitPosition {
  title: string;
  salon: string;
  description: string;
}

export interface RecruitBrand {
  key: string;
  name: string;
  area: string;
  type: string;
  copy: string;
  strengths: string[];
  image: string;
  instagram: string;
}
export interface RecruitValue {
  icon: string;
  title: string;
  text: string;
}
export interface RecruitStaffVoice {
  name: string;
  role: string;
  brand: string;
  years: string;
  image: string;
  reason: string;
  joy: string;
  holiday: string;
  goal: string;
}
export interface RecruitStat {
  label: string;
  value: string;
  suffix?: string;
}
export interface RecruitTimeItem {
  time: string;
  text: string;
}
export interface RecruitEduStep {
  step: string;
  title: string;
  text: string;
}
export interface RecruitReqItem {
  label: string;
  value: string;
}
export interface RecruitFaqItem {
  q: string;
  a: string;
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
    // 採用ページ全面リニューアル分（任意。未設定時はページ側のデフォルトを使用）
    heroTitle?: string;
    heroLead?: string;
    brands?: RecruitBrand[];
    aboutLead?: string;
    values?: RecruitValue[];
    staffVoices?: RecruitStaffVoice[];
    staffVoiceNote?: string;
    stats?: RecruitStat[];
    dayHair?: RecruitTimeItem[];
    dayEye?: RecruitTimeItem[];
    dayHairNote?: string;
    dayEyeNote?: string;
    education?: RecruitEduStep[];
    careerHair?: string[];
    careerEye?: string[];
    requirements?: RecruitReqItem[];
    faq?: RecruitFaqItem[];
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

// 公開ページ用: 常にGitHubから最新を取得（保存後すぐ反映される）
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
          // 60秒キャッシュ＋タグ。管理画面の保存で revalidateTag("site-content") が呼ばれ即時反映。
          next: { revalidate: 60, tags: ["site-content"] },
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
