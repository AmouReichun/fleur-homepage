import { NextResponse } from "next/server";
import { getAllPostsMeta } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";

export async function GET() {
  let posts;
  try {
    posts = getAllPostsMeta();
  } catch {
    return NextResponse.json({ error: "記事データの取得に失敗しました" }, { status: 500 });
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "フルールグループ 症例・コラム 記事データ",
    description: "高知県のヘアサロン（fleur ami・Riv.）とまつげ・まゆげサロン（Raffine）の施術症例・コラム記事の構造化データ。",
    url: `${SITE_URL}/api/articles.json`,
    publisher: {
      "@type": "Organization",
      name: "フルールグループ",
      url: SITE_URL,
    },
    dateModified: new Date().toISOString(),
    totalItems: posts.length,
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.category}/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
      author: p.author
        ? { "@type": "Person", name: p.author, jobTitle: p.author_role }
        : { "@type": "Organization", name: p.salon },
      description: p.excerpt,
      about: {
        "@type": "Thing",
        name: p.question,
      },
      keywords: p.tags.join(", "),
      isPartOf: {
        "@type": p.category === "hair" ? "HairSalon" : "BeautySalon",
        name: p.salon,
      },
      mainEntity: {
        "@type": "Question",
        name: p.question,
        acceptedAnswer: { "@type": "Answer", text: p.answer_summary },
      },
      hasPart: p.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    })),
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
