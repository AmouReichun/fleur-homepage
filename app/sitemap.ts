import { MetadataRoute } from "next";
import { getAllServiceSlugs } from "@/lib/services";
import { AREAS, getAllAreaServiceParams } from "@/lib/areas";
import { getAllRoleSlugs } from "@/lib/recruit-roles";
import { getAllPosts, getAllTags, getAllAuthors, getAvailableMonths } from "@/lib/blog/posts";

const BASE = "https://fleur-group.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
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
  const areaServices: MetadataRoute.Sitemap = getAllAreaServiceParams().map(({ area, service }) => ({
    url: `${BASE}/area/${area}/${service}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ── ブログ統合（/blog 配下）──
  const blogStatic: MetadataRoute.Sitemap = [
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/blog/hair`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/blog/eyelash`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/blog/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/blog/hair/fleur-ami`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/hair/riv`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/hair/kamiushitsu-kaizen`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/hair/shiraga-bokashi`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/hair/shukumou-kyousei`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/blog/eyelash/raffine`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/eyelash/matsuge-perm`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/area`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
  ];
  const hairPosts = getAllPosts("hair");
  const eyelashPosts = getAllPosts("eyelash");
  const blogPosts: MetadataRoute.Sitemap = [
    ...hairPosts.map((p) => ({ url: `${BASE}/blog/hair/${p.slug}`, lastModified: new Date(p.updated || p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...eyelashPosts.map((p) => ({ url: `${BASE}/blog/eyelash/${p.slug}`, lastModified: new Date(p.updated || p.date), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  const blogTaxonomy: MetadataRoute.Sitemap = [
    ...getAllTags("hair").map((t) => ({ url: `${BASE}/blog/hair/tag/${encodeURIComponent(t)}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getAllTags("eyelash").map((t) => ({ url: `${BASE}/blog/eyelash/tag/${encodeURIComponent(t)}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getAllAuthors().map((a) => ({ url: `${BASE}/blog/author/${encodeURIComponent(a.name)}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...getAvailableMonths("hair").map(({ year, month }) => ({ url: `${BASE}/blog/hair/archive/${year}/${month}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...getAvailableMonths("eyelash").map(({ year, month }) => ({ url: `${BASE}/blog/eyelash/archive/${year}/${month}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

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
    { url: `${BASE}/staff`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/recruit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...getAllRoleSlugs().map((role) => ({
      url: `${BASE}/recruit/${role}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${BASE}/company`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...blogStatic,
    ...blogPosts,
    ...blogTaxonomy,
  ];
}
