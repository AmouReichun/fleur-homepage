import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllTags } from "@/lib/blog/posts";
import { breadcrumbSchema, tagPageSchema } from "@/lib/blog/structured-data";
import ArticleCard from "@/components/ArticleCard";

type Props = { params: { tag: string } };

// 存在しないタグは実404を返す（ソフト404回避）。タグは記事から生成されるため全網羅。
export const dynamicParams = false;

export async function generateStaticParams() {
  // App Routerでは生（デコード済み）の値を返す。encodeすると二重エンコードで全404になる。
  return getAllTags("hair").map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} | ヘアコラム`,
    description: `高知のヘアサロン fleur ami・Riv. による「${tag}」に関する施術例・コラム一覧。`,
    alternates: { canonical: `/blog/hair/tag/${tag}` },
    robots: { index: false, follow: true },
  };
}

export default function HairTagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const posts = getAllPosts("hair").filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "ヘア", url: "/blog/hair" },
    { name: tag, url: `/blog/hair/tag/${encodeURIComponent(tag)}` },
  ]);
  const tagSchema = tagPageSchema(tag, "hair", posts);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tagSchema) }} />

      <div className="min-h-screen" style={{ background: "#F8F2EA" }}>
        {/* パンくず */}
        <nav className="px-4 py-3 border-b border-hair-border bg-white/60 backdrop-blur-sm">
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs text-hair-muted">
            <Link href="/" className="hover:text-hair-text transition-colors">トップ</Link>
            <span className="text-hair-border">›</span>
            <Link href="/blog/hair" className="hover:text-hair-text transition-colors">ヘア</Link>
            <span className="text-hair-border">›</span>
            <span className="text-hair-text">{tag}</span>
          </div>
        </nav>

        {/* ヘッダー */}
        <div className="px-4 py-10 border-b border-hair-border" style={{ background: "linear-gradient(160deg, #F8F2EA 0%, #F1E7D8 100%)" }}>
          <div className="max-w-wide mx-auto">
            <p className="text-xs tracking-[0.25em] uppercase text-hair-accent-warm font-cormorant mb-2">Tag</p>
            <h1 className="font-mincho text-2xl sm:text-3xl font-medium text-hair-text mb-3">
              {tag}
            </h1>
            <p className="text-sm text-hair-muted">
              {tag} に関する記事 {posts.length} 件
            </p>
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="max-w-wide mx-auto px-4 py-10">
          {posts.length === 0 ? (
            <p className="text-hair-muted text-sm">該当する記事はありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="hair" />
              ))}
            </div>
          )}
          <div className="mt-10 pt-8 border-t border-hair-border">
            <Link href="/blog/hair" className="text-sm text-hair-accent hover:underline">
              ← ヘア一覧へ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
