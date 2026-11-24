import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "高知市の美容室・まつ毛サロン｜艶カラー・髪質改善・眉毛WAX｜fleur GROUP" },
  description:
    "高知市・香南市の美容室・まつ毛サロン fleur GROUP。Googleクチコミ4.5〜4.9。一番人気の艶カラーとミルボンの髪質改善、白髪ぼかし・縮毛矯正（Riv.・fleur ami）、まつ毛パーマ・眉毛WAX（Raffine）。土日OK・駐車場あり・Web予約当日受付。",
  alternates: { canonical: "https://fleur-group.jp" },
};
import { getContentCached } from "@/lib/content";
import { rivSalonSchema, fleuramiSalonSchema, raffineSalonSchema, founderPersonSchema } from "@/lib/structured-data";
import HeroSlideshow from "@/app/components/HeroSlideshow";
import { scriptFont, handJaFont, StarBurst, Spark, Swoosh, OvalSticker, ScriptLabel } from "@/app/components/HeroDecor";
import QuickLinkGrid from "@/app/components/QuickLinkGrid";
import SalonCards from "@/app/components/SalonCards";
import PopularMenuSlider from "@/app/components/PopularMenuSlider";
import FaqSalonGroup from "@/app/components/FaqSalonGroup";
import BlogSlider from "@/app/components/BlogSlider";
import Reveal from "@/app/components/Reveal";
import StaffPreview from "@/app/components/StaffPreview";
import GalleryGrid from "@/app/components/GalleryGrid";
import ReservationChannels from "@/app/components/ReservationChannels";
import RecruitFeature from "@/app/components/RecruitFeature";
import { getAllPostsMeta } from "@/lib/blog/posts";

const BrandMovieSection = dynamic(() => import("@/app/components/BrandMovieSection"), {
  ssr: false,
  loading: () => <div className="py-20 sm:py-28 bg-[#111111]" aria-hidden="true" />,
});

const SCRIPT_EN: Record<string, string> = { Salon: "Our Salon", Menu: "Popular Menu", Blog: "Blog", FAQ: "Q & A" };

function SectionLabel({ index, en, ja }: { index: string; en: string; ja: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        {/* 手書き風の英字（2026-11-24 トップのデザインに合わせて） */}
        <span className="sr-only">{index}. {en}</span>
        <ScriptLabel text={SCRIPT_EN[en] ?? en} />
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
  // 構造化データは「画面に出ているFAQ」と同じ中身にする（表示と食い違うとAI・Googleが信用しない）
  const topFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  // ブログ統合: ローカルの記事メタから直接取得
  const allPosts = getAllPostsMeta();
  const pickPosts = (category: string) =>
    allPosts.filter((p) => p.category === category).slice(0, 5);
  const hairPosts = pickPosts("hair");
  const eyelashPosts = pickPosts("eyelash");
  // GalleryGrid用：カテゴリ別15件ずつ（内部でサロン別6件に絞る）
  const galleryPosts = [
    ...allPosts.filter((p) => p.category === "hair").slice(0, 30),
    ...allPosts.filter((p) => p.category === "eyelash").slice(0, 15),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderPersonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(topFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(rivSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fleuramiSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(raffineSalonSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://fleur-group.jp/",
        name: "fleur GROUP｜高知市・香南市の美容室・アイラッシュサロン",
        url: "https://fleur-group.jp/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-catch", "#top-faq dt"],
        },
        about: { "@type": "Organization", "@id": "https://fleur-group.jp/#organization", name: "fleur GROUP" },
      }) }} />

      {/* ─── Hero ─── */}
      <HeroSlideshow images={heroImages} hasImage={hasImage}>
        {/* 飾り：ピンクの星（ギザギザ）・キラッ・ステッカー */}
        {/* 大きいピンクの星（白い枠をまたぐ）＋下からのぞく星 */}
        <StarBurst className="absolute z-10 right-[4px] top-[58px] sm:right-[5%] sm:top-[80px] lg:right-[6%] lg:top-[64px] w-[176px] h-[176px] sm:w-[240px] sm:h-[240px] lg:w-[300px] lg:h-[300px] rotate-[-10deg]" inner={36} points={13} irregular>
          <span className={`${handJaFont.className} text-[14px] sm:text-[21px] lg:text-[26px] leading-[1.4] -rotate-6`}>髪と目元で、<br />なりたい自分へ。</span>
          <span className="mt-2.5 sm:mt-3.5 text-[6px] sm:text-[9px] tracking-[0.06em] sm:tracking-[0.2em] whitespace-nowrap border-b border-white/80 pb-0.5">HAIR &amp; EYELASH SALON</span>
        </StarBurst>
        <StarBurst className="absolute z-10 left-[34%] -bottom-[55px] w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] lg:left-[30%] lg:-bottom-[60px] lg:w-[170px] lg:h-[170px]" points={8} inner={20} spin={false} />
        <Spark className="absolute top-[18%] left-[38%] w-[34px] h-[34px] lg:top-[16%] lg:left-[30%]" />
        <Spark className="absolute top-[46%] left-[6%] w-[26px] h-[26px] lg:top-[58%] lg:left-[5%]" style={{ animationDelay: "-1s" }} />
        <Spark className="absolute top-[52%] right-[10%] w-[21px] h-[21px] lg:top-[64%] lg:right-[36%]" style={{ animationDelay: "-1.8s" }} />
        <OvalSticker className="absolute right-[55px] bottom-[55px] lg:right-[89px] lg:bottom-[55px] hidden sm:block" />

        <h1 className="relative self-start w-fit text-[11px] sm:text-[12px] lg:text-[13px] font-medium tracking-[0.2em] sm:tracking-[0.3em] text-site-text [text-shadow:0_0_4px_rgba(255,255,255,0.95),0_0_10px_rgba(255,255,255,0.8)] z-20 mb-[21px] sm:mb-[34px] lg:mb-[55px] animate-fadeinup">
          高知県の美容室・アイラッシュサロン
        </h1>
        {/* 手書き風の英字：3行で大きく（書いていくように出る） */}
        <p aria-hidden className={`${scriptFont.className} hd-write relative text-site-accent text-[58px] sm:text-[80px] lg:text-[104px] leading-[0.92] -rotate-[8deg] origin-left mb-[13px] mt-[8px]`}>
          Find<br />
          <span className="pl-[34px] sm:pl-[55px]">your</span><br />
          <span className="pl-[55px] sm:pl-[89px]">Beauty</span>
          <Swoosh className="block w-[210px] sm:w-[300px] lg:w-[380px] h-[20px] sm:h-[26px] ml-[55px] sm:ml-[89px] -mt-[13px]" />
        </p>
        <p className="hero-catch relative font-sans text-[13px] sm:text-[15px] font-medium tracking-[0.25em] text-site-text leading-[2] mb-[21px] whitespace-pre-line animate-fadeinup-slow">
          {content.hero.title || "上品なのに、\n抜け感。"}
        </p>
        {content.hero.subtitle && <p className="sr-only">{content.hero.subtitle}</p>}
        {/* 最初の画面の予約ボタン（2026-11-21）：同じページの店舗一覧へ */}
        <a
          href="#salons"
          style={{ animation: "fadeinup 0.9s ease-out 0.6s both" }}
          className="relative inline-flex items-center justify-center gap-[13px] rounded-full bg-site-rose text-white text-[13px] tracking-[0.2em] px-[34px] py-[13px] shadow-[0_8px_21px_rgba(255,0,70,0.3)] hover:scale-105 transition-transform duration-300"
        >
          店舗を選んで予約
          <span aria-hidden="true" className="inline-block w-[34px] h-px bg-white relative after:absolute after:right-0 after:-top-[3px] after:w-[7px] after:h-[7px] after:border-r after:border-t after:border-white after:rotate-45" />
        </a>
        {/* 店舗ページへの直接リンク（Googleマップから来た人が1回で自分の店へ。2026-11-21） */}
        <dl
          style={{ animation: "fadeinup 0.9s ease-out 0.8s both" }}
          className="relative mt-[21px] grid grid-cols-[auto_1fr] gap-x-[13px] gap-y-1 text-[11px] sm:text-xs text-site-text/80 tracking-[0.12em] leading-loose"
        >
          <dt>美容室</dt>
          <dd>
            <Link href="/salon/riv" className="whitespace-nowrap underline underline-offset-4 decoration-site-accent/40 hover:text-site-rose">Riv.（高知市）</Link>
            <span className="hidden sm:inline mx-1.5 text-site-text/30">・</span><br className="sm:hidden" />
            <Link href="/salon/fleurami" className="whitespace-nowrap underline underline-offset-4 decoration-site-accent/40 hover:text-site-rose">fleur ami（香南市）</Link>
          </dd>
          <dt>まつげ・眉毛</dt>
          <dd>
            <Link href="/salon/raffine" className="whitespace-nowrap underline underline-offset-4 decoration-site-accent/40 hover:text-site-rose">Raffine（はりまや橋）</Link>
          </dd>
        </dl>
      </HeroSlideshow>

      {/* ─── Quick Links ─── */}
      <QuickLinkGrid cards={content.quickLinks ?? []} />

      {/* ─── Salons ─── */}
      <section id="salons" className="scroll-mt-16 py-20 sm:py-24 glow-surface-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <SectionLabel index="01" en="Salon" ja="店舗案内" />
          <Reveal delay={80} className="-mt-8 mb-12 sm:mb-16">
            <p className="text-sm text-site-muted max-w-xl leading-relaxed">
              高知県（高知市・香南市）で美容室・アイラッシュサロンを3店舗展開するfleur GROUP。髪質改善・縮毛矯正・白髪ぼかし・まつ毛パーマ・眉毛WAXをご提供しています。
            </p>
          </Reveal>
        </div>
        <Reveal delay={150}>
          <SalonCards salons={salons} />
        </Reveal>
      </section>

      {/* ─── Menu ─── */}
      <section id="popular-menu" className="scroll-mt-16 py-20 sm:py-24 glow-surface">
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
      <section className="py-20 sm:py-24 glow-surface-white">
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

      {/* ─── Brand Movie ─── */}
      <BrandMovieSection />

      {/* ─── Gallery ─── */}
      <GalleryGrid posts={galleryPosts} />

      {/* ─── Staff Preview ─── */}
      <StaffPreview staff={content.staff.filter((m) => !m.hidden)} />

      {/* ─── FAQ ─── */}
      <section id="faq" className="scroll-mt-16 py-20 sm:py-24 glow-surface">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <SectionLabel index="07" en="FAQ" ja="よくあるご質問" />

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

          <div className="mt-10 text-center">
            <Link
              href="/guide"
              className="inline-flex items-center gap-4 text-xs tracking-[0.2em] text-site-text hover:text-site-accent transition-colors group"
            >
              <span>施術の選び方・美容ガイドを見る</span>
              <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Reservation CTA ─── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <ReservationChannels
            salonOrder={content.salonOrder}
            salons={content.salons}
            heading="ご予約はこちら"
            note={"お電話・Web・LINE・ホットペッパーから\nご予約いただけます"}
            groupByType
          />
        </div>
      </section>

      {/* ─── Recruit（採用特集） ─── */}
      <RecruitFeature stats={content.recruit?.stats} voices={content.recruit?.staffVoices} />
    </>
  );
}
