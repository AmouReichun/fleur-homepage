import Link from "next/link";
import { getContent } from "@/lib/content";
import { organizationSchema, faqPageSchema } from "@/lib/structured-data";
import HeroSlideshow from "@/app/components/HeroSlideshow";
import QuickLinkGrid from "@/app/components/QuickLinkGrid";
import SalonSlider from "@/app/components/SalonSlider";
import PopularMenuSlider from "@/app/components/PopularMenuSlider";
import FaqSalonGroup from "@/app/components/FaqSalonGroup";
import BlogSlider from "@/app/components/BlogSlider";



const BLOG_URL = process.env.BLOG_URL ?? "https://fleur-blog.vercel.app";

type BlogPost = {
  title: string;
  slug: string;
  category: string;
  salon: string;
  date: string;
  excerpt: string;
  thumbnail: string;
};

function SectionLabel({ index, en, ja }: { index: string; en: string; ja: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-px bg-site-accent" />
        <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">{index}. {en}</span>
      </div>
      <h2 className="font-serif text-4xl sm:text-5xl font-light text-site-text">{ja}</h2>
    </div>
  );
}

export default async function HomePage() {
  const content = getContent();
  const salons = content.salonOrder.map((key) => {
    const s = content.salons[key as keyof typeof content.salons];
    return { key, ...s, href: `/salon/${key}` };
  });

  const heroImages = content.hero?.images?.filter(Boolean) ?? [];
  const hasImage = heroImages.length > 0;
  const popularMenus = content.popularMenus ?? [];
  const topFaq = content.topFaq ?? [];
  const faqGroups = content.salonOrder
    .map((key) => ({
      key,
      name: content.salons[key as keyof typeof content.salons]?.name ?? key,
      items: topFaq.filter((f) => f.salon === key),
    }))
    .filter((g) => g.items.length > 0);
  const commonFaqs = topFaq.filter((f) => !f.salon);

  let recentPosts: BlogPost[] = [];
  try {
    const res = await fetch(`${BLOG_URL}/api/posts/recent?count=12`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) recentPosts = await res.json();
  } catch {
    // ブログが取得できない場合はスキップ
  }
  const hairPosts = recentPosts.filter((p) => p.category === "hair").slice(0, 5);
  const eyelashPosts = recentPosts.filter((p) => p.category === "eyelash").slice(0, 5);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />

      {/* ─── Hero ─── */}
      <HeroSlideshow images={heroImages} hasImage={hasImage}>
        <p className="text-[10px] tracking-[0.45em] text-white/50 uppercase mb-5">
          Kochi, Japan — Hair & Eyelash
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-white leading-[1.1] mb-8">
          髪と目元の<br />
          美しさを<br />
          <span className="text-[#D4AD80]">叶える場所</span>
        </h1>
        <div className="flex items-center gap-5 mb-10">
          <div className="w-10 h-px bg-white/40" />
          <p className="text-xs text-white/55 tracking-[0.25em]">高知市・香南市 / 3 Salons</p>
        </div>
        <Link
          href="/salon"
          className="inline-flex items-center gap-4 text-xs text-white/80 tracking-[0.25em] hover:text-white transition-colors duration-300 group"
        >
          <span>店舗を見る</span>
          <span className="w-12 h-px bg-white/50 group-hover:w-16 transition-all duration-400 group-hover:bg-white/80" />
        </Link>
      </HeroSlideshow>

      {/* ─── Quick Links ─── */}
      <QuickLinkGrid cards={content.quickLinks ?? []} />

      {/* ─── Salons ─── */}
      <section className="py-24 sm:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="01" en="Salon" ja="店舗案内" />
        </div>
        <SalonSlider salons={salons} />
      </section>

      {/* ─── Menu ─── */}
      <section className="py-24 sm:py-36 bg-site-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="02" en="Menu" ja="人気メニュー" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
            {popularMenus.some((m) => m.category === "hair") && (
              <PopularMenuSlider
                items={popularMenus.filter((m) => m.category === "hair")}
                en="Hair Salon"
              />
            )}
            {popularMenus.some((m) => m.category === "eyelash") && (
              <PopularMenuSlider
                items={popularMenus.filter((m) => m.category === "eyelash")}
                en="Eyelash Salon"
              />
            )}
          </div>

          <div className="mt-14">
            <Link
              href="/menu"
              className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-site-text hover:text-site-accent transition-colors duration-200 group"
            >
              <span>メニュー一覧</span>
              <span className="w-10 h-px bg-current group-hover:w-14 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Blog ─── */}
      <section className="py-24 sm:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="03" en="Blog" ja="最新ブログ" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
            {hairPosts.length > 0 && (
              <BlogSlider posts={hairPosts} blogUrl={BLOG_URL} en="Hair Salon" />
            )}
            {eyelashPosts.length > 0 && (
              <BlogSlider posts={eyelashPosts} blogUrl={BLOG_URL} en="Eyelash Salon" />
            )}
          </div>

          <div className="mt-14">
            <Link
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-site-text hover:text-site-accent transition-colors duration-200 group"
            >
              <span>ブログをもっと見る</span>
              <span className="w-10 h-px bg-current group-hover:w-14 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 sm:py-36 bg-site-light">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <SectionLabel index="04" en="FAQ" ja="よくあるご質問" />

          {/* 共通FAQ（サロン指定なし） */}
          {commonFaqs.length > 0 && (
            <div className="mb-14">
              <FaqSalonGroup name="共通" items={commonFaqs} />
            </div>
          )}

          {/* サロン別FAQ */}
          <div className="space-y-14">
            {faqGroups.map((group) => (
              <FaqSalonGroup key={group.key} name={group.name} items={group.items} />
            ))}
          </div>

          {topFaq.length === 0 && (
            <p className="text-sm text-site-muted text-center py-12">FAQがまだ登録されていません</p>
          )}
        </div>
      </section>

      {/* ─── Recruit ─── */}
      <section className="py-24 sm:py-36 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-site-accent" />
              <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Recruit</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white leading-tight mb-6">
              高知で一緒に<br />
              働きませんか
            </h2>
            <p className="text-sm text-white/50 leading-loose mb-12 max-w-md">
              技術と接客の両方を大切にするグループで、<br />
              一緒に成長しませんか。経験者・未経験者ともに歓迎しています。
            </p>
            <Link
              href="/recruit"
              className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <span>採用情報を見る</span>
              <span className="w-12 h-px bg-white/40 group-hover:w-16 group-hover:bg-white/70 transition-all duration-400" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
