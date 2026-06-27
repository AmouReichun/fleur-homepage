import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { organizationSchema, faqPageSchema } from "@/lib/structured-data";
import HeroSlideshow from "@/app/components/HeroSlideshow";
import QuickLinkGrid from "@/app/components/QuickLinkGrid";
import SalonSlider from "@/app/components/SalonSlider";
import PopularMenuSlider from "@/app/components/PopularMenuSlider";
import FaqSalonGroup from "@/app/components/FaqSalonGroup";
import BlogSlider from "@/app/components/BlogSlider";
import Reveal from "@/app/components/Reveal";
import { getAllPostsMeta } from "@/lib/blog/posts";

function SectionLabel({ index, en, ja }: { index: string; en: string; ja: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal className="flex items-center gap-3 mb-4">
        <div className="w-6 h-px bg-site-accent" />
        <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">{index}. {en}</span>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-serif text-4xl sm:text-5xl font-light text-site-text">{ja}</h2>
      </Reveal>
    </div>
  );
}

export default async function HomePage() {
  const content = await getContentCached();
  const salons = content.salonOrder.map((key) => {
    const s = content.salons[key as keyof typeof content.salons];
    return { key, ...s, href: `/salon/${key}` };
  });

  const heroImages = content.hero?.images?.filter(Boolean) ?? [];
  const hasImage = heroImages.length > 0;
  const popularMenus = content.popularMenus ?? [];
  const salonNames = Object.fromEntries(
    content.salonOrder.map((key) => [key, content.salons[key as keyof typeof content.salons]?.name ?? key])
  );
  const topFaq = content.topFaq ?? [];
  const faqGroups = content.salonOrder
    .map((key) => ({
      key,
      name: content.salons[key as keyof typeof content.salons]?.name ?? key,
      items: topFaq.filter((f) => f.salon === key),
    }))
    .filter((g) => g.items.length > 0);
  const commonFaqs = topFaq.filter((f) => !f.salon);

  // ブログ統合: ローカルの記事メタから直接取得
  const allPosts = getAllPostsMeta();
  const pickPosts = (category: string) =>
    allPosts.filter((p) => p.category === category).slice(0, 5);
  const hairPosts = pickPosts("hair");
  const eyelashPosts = pickPosts("eyelash");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />

      {/* ─── Hero ─── */}
      <HeroSlideshow images={heroImages} hasImage={hasImage}>
        <p className="text-[10px] tracking-[0.4em] text-white/45 mb-8">
          高知市・香南市 — 美容室・アイラッシュサロン
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.25] mb-6 whitespace-pre-line">
          {content.hero.title || "上品なのに、\n抜け感。"}
        </h1>
        {content.hero.subtitle && (
          <p className="text-sm text-white/55 leading-relaxed mb-12 whitespace-pre-line">
            {content.hero.subtitle}
          </p>
        )}
        <Link
          href="/salon"
          className="inline-flex items-center gap-4 text-xs text-white/75 tracking-[0.3em] hover:text-white transition-colors duration-300 group"
        >
          <span>{content.hero.cta1 || "店舗を見る"}</span>
          <span className="w-12 h-px bg-white/40 group-hover:w-16 transition-all duration-400 group-hover:bg-white/70" />
        </Link>
      </HeroSlideshow>

      {/* ─── Quick Links ─── */}
      <QuickLinkGrid cards={content.quickLinks ?? []} />

      {/* ─── Salons ─── */}
      <section className="py-24 sm:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="01" en="Salon" ja="店舗案内" />
        </div>
        <Reveal delay={150}>
          <SalonSlider salons={salons} />
        </Reveal>
      </section>

      {/* ─── Menu ─── */}
      <section className="py-24 sm:py-36 bg-site-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="02" en="Menu" ja="人気メニュー" />

          <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
            {popularMenus.some((m) => m.category === "hair") && (
              <PopularMenuSlider
                items={popularMenus.filter((m) => m.category === "hair")}
                en="Hair Salon"
                salonNames={salonNames}
              />
            )}
            {popularMenus.some((m) => m.category === "eyelash") && (
              <PopularMenuSlider
                items={popularMenus.filter((m) => m.category === "eyelash")}
                en="Eyelash Salon"
                salonNames={salonNames}
              />
            )}
          </Reveal>

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

          <Reveal delay={150} className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20">
            {hairPosts.length > 0 && (
              <BlogSlider posts={hairPosts} en="Hair Salon" />
            )}
            {eyelashPosts.length > 0 && (
              <BlogSlider posts={eyelashPosts} en="Eyelash Salon" />
            )}
          </Reveal>

          <div className="mt-14">
            <Link
              href="/blog"
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
            <Reveal className="mb-14">
              <FaqSalonGroup name="共通" items={commonFaqs} />
            </Reveal>
          )}

          {/* サロン別FAQ */}
          <div className="space-y-14">
            {faqGroups.map((group, i) => (
              <Reveal key={group.key} delay={i * 100}>
                <FaqSalonGroup name={group.name} items={group.items} />
              </Reveal>
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
          <Reveal className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-site-accent" />
              <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Recruit</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-white leading-relaxed tracking-[0.06em] mb-6">
              あなたの技術と感性を、<br />
              高知で咲かせませんか。
            </h2>
            <p className="text-sm text-white/50 leading-loose mb-12 max-w-md">
              美容師・アイリストとして、お客様の「なりたい」に<br />
              真剣に向き合える環境を整えています。
            </p>
            <Link
              href="/recruit"
              className="inline-flex items-center gap-4 text-xs tracking-[0.25em] text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <span>採用情報を見る</span>
              <span className="w-12 h-px bg-white/40 group-hover:w-16 group-hover:bg-white/70 transition-all duration-400" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
