import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllTags } from "@/lib/blog/posts";
import { breadcrumbSchema, tagPageSchema } from "@/lib/blog/structured-data";
import { getEyelashTagDescription } from "@/lib/blog/tag-descriptions";
import ArticleCard from "@/components/ArticleCard";

type Props = { params: { tag: string } };

// 存在しないタグは実404を返す（ソフト404回避）。タグは記事から生成されるため全網羅。
export const dynamicParams = false;

export async function generateStaticParams() {
  // App Routerでは生（デコード済み）の値を返す。encodeすると二重エンコードで全404になる。
  return getAllTags("eyelash").map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const posts = getAllPosts("eyelash").filter((p) => p.tags.includes(tag));
  const shouldIndex = posts.length >= 5;
  return {
    title: `${tag}の施術例・アイラッシュコラム一覧 | 高知はりまや橋 Raffine`,
    description: `高知市はりまや橋のまつげ・まゆげ専門店Raffineによる「${tag}」に関する施術例とコラム${posts.length}件をまとめました。まつげパーマ・マツエク・LEDマツエク・眉毛WAXなど、${tag}のデザイン・持ち・料金やメニュー選びの参考にご覧ください。`,
    alternates: { canonical: `/blog/eyelash/tag/${encodeURIComponent(tag)}` },
    robots: { index: shouldIndex, follow: true },
  };
}

const TAG_INDEX_THRESHOLD = 5;

export default function EyelashTagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const allPosts = getAllPosts("eyelash");
  const posts = allPosts.filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();

  // 関連タグ（インデックス済みかつ自分以外）
  const allTags = getAllTags("eyelash");
  const relatedTags = allTags
    .filter((t) => t !== tag && allPosts.filter((p) => p.tags.includes(t)).length >= TAG_INDEX_THRESHOLD)
    .slice(0, 8);

  const description = getEyelashTagDescription(tag);

  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "アイラッシュ", url: "/blog/eyelash" },
    { name: tag, url: `/blog/eyelash/tag/${encodeURIComponent(tag)}` },
  ]);
  const tagSchema = tagPageSchema(tag, "eyelash", posts);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tagSchema) }} />

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FBF8F8 0%, #F9F5F6 100%)" }}>
        {/* パンくず */}
        <nav className="px-4 py-3 border-b border-eye-border bg-white/70 backdrop-blur-sm">
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs text-eye-muted">
            <Link href="/" className="hover:text-eye-text transition-colors">トップ</Link>
            <span className="text-eye-border">›</span>
            <Link href="/blog/eyelash" className="hover:text-eye-text transition-colors">アイラッシュ</Link>
            <span className="text-eye-border">›</span>
            <span className="text-eye-text">{tag}</span>
          </div>
        </nav>

        {/* ヘッダー */}
        <div className="px-4 py-10 border-b border-eye-border" style={{ background: "linear-gradient(160deg, #FBF8F8 0%, #F9EEF1 100%)" }}>
          <div className="max-w-wide mx-auto">
            <p className="text-xs tracking-[0.25em] uppercase text-eye-accent font-jakarta mb-2">Tag</p>
            <h1 className="font-kaku text-2xl sm:text-3xl font-medium text-eye-text mb-3">
              {tag}
            </h1>
            <p className="text-sm text-eye-muted mb-4">
              {tag} に関する記事 {posts.length} 件
            </p>
            {description && (
              <p className="text-sm text-eye-text leading-loose max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="max-w-wide mx-auto px-4 py-10">
          {posts.length === 0 ? (
            <p className="text-eye-muted text-sm">該当する記事はありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} world="eyelash" />
              ))}
            </div>
          )}

          {/* 関連タグ */}
          {relatedTags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-eye-border">
              <p className="text-xs tracking-[0.2em] uppercase text-eye-accent font-jakarta mb-3">Related Tags</p>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/eyelash/tag/${encodeURIComponent(t)}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-eye-border text-eye-muted hover:border-eye-accent hover:text-eye-accent transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-eye-border">
            <Link href="/blog/eyelash" className="text-sm text-eye-accent hover:underline">
              ← アイラッシュ一覧へ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
