import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllTags } from "@/lib/blog/posts";
import { breadcrumbSchema, tagPageSchema } from "@/lib/blog/structured-data";
import { getHairTagDescription } from "@/lib/blog/tag-descriptions";
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
  const posts = getAllPosts("hair").filter((p) => p.tags.includes(tag));
  // 5件以上あるタグはインデックス対象にする（薄いコンテンツを避けるための閾値）
  const shouldIndex = posts.length >= 5;
  return {
    title: `${tag}の施術例・ヘアコラム一覧 | 高知のヘアサロン fleur GROUP`,
    description: `高知県の美容室 fleurami・Riv. by fleuramiによる「${tag}」に関する施術例とスタイルコラム${posts.length}件をまとめました。髪質改善・白髪ぼかし・縮毛矯正・艶カラー・似合わせカットなど、${tag}のメニュー選びやスタイルの参考にご覧ください。`,
    alternates: { canonical: `/blog/hair/tag/${encodeURIComponent(tag)}` },
    robots: { index: shouldIndex, follow: true },
  };
}

const TAG_INDEX_THRESHOLD = 5;

export default function HairTagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const allPosts = getAllPosts("hair");
  const posts = allPosts.filter((p) => p.tags.includes(tag));
  if (posts.length === 0) notFound();

  // 関連タグ（インデックス済みかつ自分以外、記事数上位8件）
  const allTags = getAllTags("hair");
  const relatedTags = allTags
    .filter((t) => t !== tag && allPosts.filter((p) => p.tags.includes(t)).length >= TAG_INDEX_THRESHOLD)
    .slice(0, 8);

  const description = getHairTagDescription(tag);

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
            <p className="text-sm text-hair-muted mb-4">
              {tag} に関する記事 {posts.length} 件
            </p>
            {description && (
              <p className="text-sm text-hair-text leading-loose max-w-2xl">
                {description}
              </p>
            )}
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

          {/* 関連タグ */}
          {relatedTags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-hair-border">
              <p className="text-xs tracking-[0.2em] uppercase text-hair-accent-warm font-cormorant mb-3">Related Tags</p>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/hair/tag/${encodeURIComponent(t)}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-hair-border text-hair-muted hover:border-hair-accent hover:text-hair-accent transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-hair-border">
            <Link href="/blog/hair" className="text-sm text-hair-accent hover:underline">
              ← ヘア一覧へ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
