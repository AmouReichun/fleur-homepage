import { NextRequest, NextResponse } from "next/server";
import { getAllPostsMeta } from "@/lib/blog/posts";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const count = Math.min(Number(req.nextUrl.searchParams.get("count") ?? "6"), 20);
  const category = req.nextUrl.searchParams.get("category") as "hair" | "eyelash" | null;
  const all = getAllPostsMeta();
  const filtered = category ? all.filter((p) => p.category === category) : all;
  const posts = filtered
    .slice(0, count)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      salon: p.salon,
      date: p.date,
      excerpt: p.excerpt,
      thumbnail: p.thumbnail,
    }));

  return NextResponse.json(posts, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
