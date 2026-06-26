import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSlugs, getPost, getAllPosts, getAllTags } from "@/lib/blog/posts";
import { articleSchema, faqSchema, localBusinessSchema, breadcrumbSchema, personSchema, howToSchema } from "@/lib/blog/structured-data";
import FAQSection from "@/components/FAQSection";
import RelatedArticles from "@/components/RelatedArticles";
import ArticleInternalLinks from "@/components/ArticleInternalLinks";
import { SALONS, salonKeyOf, relatedMenusFor, primaryServiceCrumb, autoLinkBody } from "@/lib/blog/internal-links";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getSlugs("eyelash").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost("eyelash", params.slug).catch(() => null);
  if (!post) return {};
  const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/eyelash/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [
        `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&salon=${encodeURIComponent(post.salon)}&category=eyelash`,
      ],
    },
  };
}

export default async function EyelashArticlePage({ params }: Props) {
  const post = await getPost("eyelash", params.slug).catch(() => null);
  if (!post || post.draft) notFound();

  const allEyelashPosts = getAllPosts("eyelash");
  const validTags = new Set(getAllTags("eyelash"));
  const salonKey = salonKeyOf(post);
  const area = SALONS[salonKey].area;
  const relatedMenus = relatedMenusFor(post, validTags, post.contentHtml);
  const svcCrumb = primaryServiceCrumb(post, validTags, post.contentHtml);
  const linkedHtml = autoLinkBody(post.contentHtml, "eyelash", validTags, area);

  const artSchema = articleSchema(post, params.slug);
  const faqSc = faqSchema(post.faq);
  const bizSchema = localBusinessSchema("raffine");
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "アイラッシュ", url: "/blog/eyelash" },
    ...(svcCrumb ? [svcCrumb] : []),
    { name: post.title, url: `/blog/eyelash/${params.slug}` },
  ]);
  const authorSc = post.author
    ? personSchema(post.author, post.author_role || "アイリスト", post.salon, "BeautySalon", "はりまや町1-4-8", `/blog/author/${encodeURIComponent(post.author)}`)
    : null;
  const howTo = post.steps?.length
    ? howToSchema(post.title, post.excerpt, post.steps, `/blog/eyelash/${params.slug}`)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artSchema) }} />
      {faqSc && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSc) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      {authorSc && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSc) }} />}
      {howTo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />}

      <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FBF8F8 0%, #F9F5F6 100%)" }}>
        {/* Breadcrumb */}
        <nav className="px-4 py-3 border-b border-eye-border bg-white/70 backdrop-blur-sm">
          <div className="max-w-article mx-auto flex items-center gap-2 text-xs text-eye-muted">
            <Link href="/" className="hover:text-eye-text transition-colors">トップ</Link>
            <span className="text-eye-border">›</span>
            <Link href="/blog/eyelash" className="hover:text-eye-text transition-colors">アイラッシュ</Link>
            <span className="text-eye-border">›</span>
            {svcCrumb && (
              <>
                <Link href={svcCrumb.url} className="hover:text-eye-text transition-colors whitespace-nowrap">{svcCrumb.name}</Link>
                <span className="text-eye-border">›</span>
              </>
            )}
            <span className="text-eye-text truncate max-w-[200px]">{post.title}</span>
          </div>
        </nav>

        <article className="max-w-article mx-auto px-4 py-10">
          {/* ブランド */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-eye-accent text-white font-medium tracking-wide font-jakarta">
              Raffine
            </span>
            {post.tags.slice(0, 2).map((tag) => (
              <Link
                key={tag}
                href={`/blog/eyelash/tag/${encodeURIComponent(tag)}`}
                className="text-xs px-2.5 py-0.5 rounded-full bg-eye-accent-soft text-eye-accent hover:bg-eye-accent hover:text-white transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-kaku text-xl sm:text-2xl lg:text-[1.75rem] font-medium text-eye-text leading-snug mb-5">
            {post.title}
          </h1>

          {/* Question → Answer box — Raffine style */}
          {post.question && (
            <div
              id="article-qa"
              className="rounded-2xl p-5 sm:p-6 mb-7"
              style={{ background: "linear-gradient(135deg, #FDF4F6, #F9EEF3)" }}
            >
              <p className="text-[11px] tracking-widest text-eye-accent uppercase font-jakarta mb-2">
                Q. この記事が答える質問
              </p>
              <p className="text-sm font-medium text-eye-text mb-4 leading-snug">{post.question}</p>
              {post.answer_summary && (
                <>
                  <div className="w-8 h-px bg-eye-accent/30 mb-3" />
                  <p className="text-[11px] tracking-widest text-eye-accent uppercase font-jakarta mb-2">
                    A. 結論
                  </p>
                  <p className="text-sm text-eye-text leading-relaxed">{post.answer_summary}</p>
                </>
              )}
            </div>
          )}

          {/* Thumbnail */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-7 bg-[#F5E6EA]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 720px) 100vw, 720px"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-8">
            <p className="text-[11px] text-eye-muted tracking-wide">公開: {post.date}</p>
            {post.updated && (
              <p className="text-[11px] text-eye-muted tracking-wide">更新: {post.updated}</p>
            )}
          </div>
          {post.author && (
            <a
              href={`/blog/author/${encodeURIComponent(post.author)}`}
              className="flex items-start gap-3 p-4 mb-8 rounded-xl hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(135deg, #FDF4F6, #F9EEF3)", borderLeft: "2px solid #C8788A40", display: "flex" }}
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] text-eye-accent uppercase font-jakarta mb-0.5">
                  {post.author_role || "アイリスト"} — Raffine
                </p>
                <p className="text-sm font-kaku text-eye-text font-medium">{post.author}</p>
              </div>
            </a>
          )}

          {/* Body（本文内に関連メニューへの内部リンクを自動挿入） */}
          <div className="prose-eye" dangerouslySetInnerHTML={{ __html: linkedHtml }} />

          {/* FAQ */}
          <div id="faq-section">
            <FAQSection faq={post.faq} world="eyelash" />
          </div>

          {/* 関連記事 */}
          <RelatedArticles current={post} all={allEyelashPosts} world="eyelash" />

          {/* 関連メニュー・店舗・ご予約（内部リンク） */}
          <ArticleInternalLinks world="eyelash" salonKey={salonKey} menus={relatedMenus} />

          {/* Back */}
          <div className="mt-8 pt-8 border-t border-eye-border/50">
            <Link
              href="/blog/eyelash"
              className="inline-flex items-center gap-2 text-sm text-eye-accent hover:gap-3 transition-all"
            >
              ← アイラッシュ一覧へ
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
