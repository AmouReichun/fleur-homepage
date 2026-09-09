import { NextResponse } from "next/server";
import { getAllServiceSlugs } from "@/lib/services";
import { AREAS, getAllAreaServiceParams } from "@/lib/areas";
import { getAllPosts } from "@/lib/blog/posts";

const BASE = "https://fleur-group.jp";
const INDEXNOW_KEY = "2a842f5205b6208b1878ceb4d6411135";

function buildUrlList(): string[] {
  const staticUrls = [
    BASE,
    `${BASE}/salon`,
    `${BASE}/salon/riv`,
    `${BASE}/salon/fleurami`,
    `${BASE}/salon/raffine`,
    `${BASE}/service`,
    `${BASE}/menu`,
    `${BASE}/guide`,
    `${BASE}/guide/kochi-hair-care`,
    `${BASE}/guide/kochi-eyelash-care`,
    `${BASE}/guide/kochi-color-guide`,
    `${BASE}/guide/kochi-adult-beauty`,
    `${BASE}/guide/kochi-mens-beauty`,
    `${BASE}/guide/kochi-perm-guide`,
    `${BASE}/guide/kochi-head-spa-guide`,
    `${BASE}/guide/kochi-shiraga-guide`,
    `${BASE}/guide/kochi-salon-guide`,
    `${BASE}/guide/kochi-kamishitsu-kaizen-guide`,
    `${BASE}/guide/kochi-beauty-price-guide`,
    `${BASE}/area`,
    `${BASE}/blog`,
    `${BASE}/blog/hair`,
    `${BASE}/blog/eyelash`,
    `${BASE}/llms.txt`,
  ];

  const serviceUrls = getAllServiceSlugs().map((s) => `${BASE}/service/${s}`);
  const areaUrls = AREAS.map((a) => `${BASE}/area/${a.slug}`);
  const areaServiceUrls = getAllAreaServiceParams().map(
    ({ area, service }) => `${BASE}/area/${area}/${service}`
  );

  const hairPosts = getAllPosts("hair");
  const eyelashPosts = getAllPosts("eyelash");
  const blogUrls = [
    ...hairPosts.map((p) => `${BASE}/blog/hair/${p.slug}`),
    ...eyelashPosts.map((p) => `${BASE}/blog/eyelash/${p.slug}`),
  ];

  return [...staticUrls, ...serviceUrls, ...areaUrls, ...areaServiceUrls, ...blogUrls];
}

export async function POST(req: Request) {
  // 簡易認証: CRON_SECRET または管理者トークンで保護
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlList = buildUrlList();

  const body = {
    host: "fleur-group.jp",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    const status = res.status;
    return NextResponse.json({
      submitted: urlList.length,
      indexnow_status: status,
      ok: status === 200 || status === 202,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET: URLリストの確認用（認証不要）
export async function GET() {
  const urlList = buildUrlList();
  return NextResponse.json({ count: urlList.length, urls: urlList.slice(0, 20) });
}
