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

const woodBg = {
  background: `
    repeating-linear-gradient(
      88deg,
      transparent 0px,
      transparent 3px,
      rgba(160,120,72,0.025) 3px,
      rgba(160,120,72,0.04)  4px,
      transparent 4px,
      transparent 11px,
      rgba(160,120,72,0.02)  11px,
      rgba(160,120,72,0.035) 12px,
      transparent 12px,
      transparent 22px
    ),
    linear-gradient(180deg, #F8F2EA 0%, #F4EDE0 100%)
  `,
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return getSlugs("hair").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost("hair", params.slug).catch(() => null);
  if (!post) return {};
  const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/hair/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [
        `${SITE_URL}/api/og?title=${encodeURIComponent(post.title)}&salon=${encodeURIComponent(post.salon)}&category=hair`,
      ],
    },
  };
}

export default async function HairArticlePage({ params }: Props) {
  const post = await getPost("hair", params.slug).catch(() => null);
  if (!post || post.draft) notFound();

  const allHairPosts = getAllPosts("hair");
  const validTags = new Set(getAllTags("hair"));
  const salonKey = salonKeyOf(post);
  const area = SALONS[salonKey].area;
  const relatedMenus = relatedMenusFor(post, validTags, post.contentHtml);
  const svcCrumb = primaryServiceCrumb(post, validTags, post.contentHtml);
  const linkedHtml = autoLinkBody(post.contentHtml, "hair", validTags, area);

  const artSchema = articleSchema(post, params.slug);
  const faqSc = faqSchema(post.faq);
  const bizSchema = localBusinessSchema(salonKey as "fleurami" | "riv");
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: "ヘア", url: "/blog/hair" },
    ...(svcCrumb ? [svcCrumb] : []),
    { name: post.title, url: `/blog/hair/${params.slug}` },
  ]);
  const authorAddress = salonKey === "fleurami" ? "野市町西野230" : "南川添9-21";
  const authorSc = post.author
    ? personSchema(post.author, post.author_role || "スタイリスト", post.salon, "HairSalon", authorAddress, `/blog/author/${encodeURIComponent(post.author)}`)
    : null;
  const howTo = post.steps?.length
    ? howToSchema(post.title, post.excerpt, post.steps, `/blog/hair/${params.slug}`)
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artSchema) }} />
      {faqSc && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSc) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />
      {authorSc && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSc) }} />}
      {howTo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />}

      <div className="min-h-screen" style={woodBg}>
        {/* Breadcrumb */}
        <nav className="px-4 py-3 border-b border-hair-border bg-white/60 backdrop-blur-sm">
          <div className="max-w-article mx-auto flex items-center gap-2 text-xs text-hair-muted">
            <Link href="/" className="hover:text-hair-text transition-colors">トップ</Link>
            <span className="text-hair-border">›</span>
            <Link href="/blog/hair" className="hover:text-hair-text transition-colors">ヘア</Link>
            <span className="text-hair-border">›</span>
            {svcCrumb && (
              <>
                <Link href={svcCrumb.url} className="hover:text-hair-text transition-colors whitespace-nowrap">{svcCrumb.name}</Link>
                <span className="text-hair-border">›</span>
              </>
            )}
            <span className="text-hair-text truncate max-w-[200px]">{post.title}</span>
          </div>
        </nav>

        <article className="max-w-article mx-auto px-4 py-10">
          {/* ブランドラベル */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs px-3 py-1 border border-hair-accent-warm/50 text-hair-accent-warm font-cormorant tracking-widest bg-white/60">
              {post.salon}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/hair/tag/${encodeURIComponent(tag)}`}
                className="text-xs text-hair-muted tracking-wide hover:text-hair-accent-warm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-mincho text-xl sm:text-2xl lg:text-[1.75rem] font-medium text-hair-text leading-snug mb-5 tracking-wide">
            {post.title}
          </h1>

          {/* Question → Answer box — 羊皮紙風 */}
          {post.question && (
            <div
              id="article-qa"
              className="p-5 sm:p-6 mb-7 border border-hair-accent-warm/30"
              style={{
                background: "linear-gradient(135deg, #F5EDE0, #F0E6D4)",
                borderRadius: "2px",
              }}
            >
              <p className="text-[11px] tracking-[0.18em] text-hair-accent-warm uppercase font-cormorant mb-2">
                Q. この記事が答える質問
              </p>
              <p className="font-mincho text-sm font-medium text-hair-text mb-4 leading-relaxed">
                {post.question}
              </p>
              {post.answer_summary && (
                <>
                  <div className="w-8 h-px bg-hair-accent-warm/40 mb-3" />
                  <p className="text-[11px] tracking-[0.18em] text-hair-accent-warm uppercase font-cormorant mb-2">
                    A. 結論
                  </p>
                  <p className="text-sm text-hair-text leading-relaxed">{post.answer_summary}</p>
                </>
              )}
            </div>
          )}

          {/* Thumbnail */}
          <div
            className="relative aspect-[16/9] overflow-hidden mb-7 bg-[#EAD9C4]"
            style={{ borderRadius: "2px" }}
          >
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
            <p className="text-[11px] text-hair-muted tracking-widest font-dm">公開: {post.date}</p>
            {post.updated && (
              <p className="text-[11px] text-hair-muted tracking-widest font-dm">更新: {post.updated}</p>
            )}
          </div>
          {post.author && (
            <a
              href={`/blog/author/${encodeURIComponent(post.author)}`}
              className="flex items-start gap-3 p-4 mb-8 hover:opacity-80 transition-opacity"
              style={{ background: "linear-gradient(90deg, #F5EDE0, #FAF5EE)", borderLeft: "2px solid #BBA98A40", borderRadius: "2px", display: "flex" }}
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] text-hair-accent-warm uppercase font-cormorant mb-0.5">
                  {post.author_role || "スタイリスト"} — {post.salon}
                </p>
                <p className="text-sm font-mincho text-hair-text font-medium">{post.author}</p>
              </div>
            </a>
          )}

          {/* Body（本文内に関連メニューへの内部リンクを自動挿入） */}
          <div className="prose-hair" dangerouslySetInnerHTML={{ __html: linkedHtml }} />

          {/* FAQ */}
          <div id="faq-section">
            <FAQSection faq={post.faq} world="hair" />
          </div>

          {/* 関連記事 */}
          <RelatedArticles current={post} all={allHairPosts} world="hair" />

          {/* 関連メニュー・店舗・ご予約（内部リンク） */}
          <ArticleInternalLinks world="hair" salonKey={salonKey} menus={relatedMenus} />

          {/* Back */}
          <div className="mt-8 pt-8 border-t border-hair-border/60">
            <Link
              href="/blog/hair"
              className="inline-flex items-center gap-2 text-sm text-hair-accent hover:gap-3 transition-all font-mincho tracking-wide"
            >
              ← ヘア一覧へ
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
