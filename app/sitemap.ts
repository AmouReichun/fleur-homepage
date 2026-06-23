import { MetadataRoute } from "next";

const BASE = "https://fleurami-group.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/salon`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/riv`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/fleurami`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/salon/raffine`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/menu`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/staff`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/recruit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/company`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}
