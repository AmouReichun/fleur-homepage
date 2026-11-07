import { MetadataRoute } from "next";
import { getAllServiceSlugs } from "@/lib/services";
import { AREAS, getAllAreaServiceParams } from "@/lib/areas";
import { isNoindexAreaService } from "@/lib/area-service-extras";
import { getAllRoleSlugs } from "@/lib/recruit-roles";
import { getAllPosts, getAllTags, getAllAuthors, getAvailableMonths } from "@/lib/blog/posts";
import { getContent } from "@/lib/content";

const BASE = "https://fleur-group.jp";

// 固定ページの最終更新日（ビルド日時にすると毎回「全ページ更新」に見えるため固定値にする）。
// 固定ページの中身を大きく変えたらこの日付を更新する。
const STATIC_LASTMOD = new Date("2026-11-07T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = STATIC_LASTMOD;
  const services: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${BASE}/service/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // ── エリア×メニューのランディング（ローカルSEO/MEO） ──
  const areaHubs: MetadataRoute.Sitemap = AREAS.map((a) => ({
    url: `${BASE}/area/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const areaServices: MetadataRoute.Sitemap = getAllAreaServiceParams().filter(({ area, service }) => !isNoindexAreaService(area, service)).map(({ area, service }) => ({
    url: `${BASE}/area/${area}/${service}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const hairPosts = getAllPosts("hair");
  const eyelashPosts = getAllPosts("eyelash");
  // ブログ一覧・タグ等は「最新記事の日付」を最終更新日にする
  const latestPostTime = Math.max(
    ...[...hairPosts, ...eyelashPosts].map((p) => new Date(p.updated || p.date).getTime()).filter((t) => !Number.isNaN(t)),
    0,
  );
  const blogLastMod = latestPostTime > 0 ? new Date(latestPostTime) : STATIC_LASTMOD;
  // ── ブログ統合（/blog 配下）──
  const blogStatic: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: blogLastMod, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/blog/hair`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/blog/eyelash`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/blog/about`, lastModified: blogLastMod, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/faq`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/blog/hair/fleur-ami`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/hair/riv`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/hair/kamiushitsu-kaizen`, lastModified: blogLastMod, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/hair/shiraga-bokashi`, lastModified: blogLastMod, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/hair/shukumou-kyousei`, lastModified: blogLastMod, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/eyelash/raffine`, lastModified: blogLastMod, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/eyelash/matsuge-perm`, lastModified: blogLastMod, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/area`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
  ];
  const blogPosts: MetadataRoute.Sitemap = [
    ...hairPosts.map((p) => ({ url: `${BASE}/blog/hair/${p.slug}`, lastModified: new Date(p.updated || p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...eyelashPosts.map((p) => ({ url: `${BASE}/blog/eyelash/${p.slug}`, lastModified: new Date(p.updated || p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  // タグページは記事数 5件以上のものだけインデックス＆サイトマップ掲載（薄いコンテンツ回避）
  const TAG_INDEX_THRESHOLD = 5;
  const indexableHairTags = getAllTags("hair").filter(
    (t) => hairPosts.filter((p) => p.tags.includes(t)).length >= TAG_INDEX_THRESHOLD
  );
  const indexableEyelashTags = getAllTags("eyelash").filter(
    (t) => eyelashPosts.filter((p) => p.tags.includes(t)).length >= TAG_INDEX_THRESHOLD
  );

  const blogTaxonomy: MetadataRoute.Sitemap = [
    ...indexableHairTags.map((t) => ({ url: `${BASE}/blog/hair/tag/${encodeURIComponent(t)}`, lastModified: blogLastMod, changeFrequency: "weekly" as const, priority: 0.65 })),
    ...indexableEyelashTags.map((t) => ({ url: `${BASE}/blog/eyelash/tag/${encodeURIComponent(t)}`, lastModified: blogLastMod, changeFrequency: "weekly" as const, priority: 0.65 })),
    ...getAllAuthors().map((a) => ({ url: `${BASE}/blog/author/${encodeURIComponent(a.name)}`, lastModified: blogLastMod, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getAvailableMonths("hair").map(({ year, month }) => ({ url: `${BASE}/blog/hair/archive/${year}/${month}`, lastModified: blogLastMod, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getAvailableMonths("eyelash").map(({ year, month }) => ({ url: `${BASE}/blog/eyelash/archive/${year}/${month}`, lastModified: blogLastMod, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  // スタッフ個別ページ（/staff/[slug] の generateStaticParams と同じ条件）
  const staffPages: MetadataRoute.Sitemap = (getContent().staff ?? [])
    .filter((m) => m.slug && !m.hidden)
    .map((m) => ({ url: `${BASE}/staff/${m.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.65 }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/salon`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/riv`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/fleurami`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/raffine`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/service`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    ...services,
    ...areaHubs,
    ...areaServices,
    { url: `${BASE}/menu`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/lp`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/staff`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...staffPages,
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/recruit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...getAllRoleSlugs().map((role) => ({
      url: `${BASE}/recruit/${role}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${BASE}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/guide/kochi-hair-care`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-eyelash-care`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-color-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-adult-beauty`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-mens-beauty`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-perm-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-head-spa-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE}/guide/kochi-shiraga-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    { url: `${BASE}/guide/kochi-salon-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/guide/kochi-kamishitsu-kaizen-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/guide/kochi-beauty-price-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.87 },
    { url: `${BASE}/guide/kochi-shukumou-kyosei-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.82 },
    { url: `${BASE}/guide/kochi-mayu-salon-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/guide/kochi-matsuge-perm-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/company`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...blogStatic,
    ...blogPosts,
    ...blogTaxonomy,
  ];
}
