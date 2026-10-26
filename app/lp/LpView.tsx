// LP本体（サーバーコンポーネント）。公開ページ /lp と 管理画面プレビュー /admin/lp/preview の両方で使う。
import Image from "next/image";
import type { LpContent } from "@/lib/lp";
import { LP_GALLERY_CATEGORIES } from "@/lib/lp";
import { LineButton, LineCtaProvider, LineIcon, type LpSalonInfo } from "./components/LineCta";
import Gallery from "./components/Gallery";
import {
  AbText,
  ConcernLink,
  ConsentBanner,
  FaqList,
  FloatingCta,
  LpBoot,
  MenuGalleryLink,
  StickyCta,
} from "./components/LpClient";

function SectionHead({ en, ja, lead, align = "center" }: { en: string; ja: string; lead?: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="lp-en text-[13px] md:text-[14px] tracking-[0.28em] text-[#A98B6D] uppercase">{en}</p>
      <h2 className="mt-3 font-serif text-[23px] md:text-[30px] leading-[1.6] tracking-[0.06em] text-[#3A3430] whitespace-pre-line text-balance">{ja}</h2>
      {lead && <p className={`mt-4 text-[14px] md:text-[15px] leading-[1.95] text-[#6E655E] ${align === "center" ? "mx-auto max-w-[34em]" : ""}`}>{lead}</p>}
    </div>
  );
}

export default function LpView({ lp, salons, preview = false }: { lp: LpContent; salons: LpSalonInfo[]; preview?: boolean }) {
  const exp = lp.experiment.enabled ? lp.experiment.id : "";
  const menuName = (key: string) => lp.menus.items.find((m) => m.key === key)?.name ?? "";
  const galleryCats = new Set(lp.gallery.items.filter((i) => !i.hidden && i.images.length).map((i) => i.category));
  const reviews = lp.reviews.items.filter((r) => r.permission && r.body.trim());

  return (
    <LineCtaProvider salons={salons}>
      <LpBoot preview={preview} experimentId={exp} />
      <div className="lp-root bg-[#FBF9F6] text-[#3A3430]">
        {preview && (
          <div className="sticky top-0 z-[80] bg-[#3A3430] text-white text-center text-[12px] py-1.5 tracking-wider">
            プレビュー表示（下書き）— 公開ページには「公開する」まで反映されません
          </div>
        )}

        {/* ヘッダー */}
        <header className="absolute inset-x-0 top-0 z-30 md:static">
          <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 md:px-8 h-14 md:h-[72px]">
            <a href="https://fleur-group.jp" className="lp-en text-[18px] md:text-[20px] tracking-[0.18em] text-[#3A3430]">
              fleur GROUP
            </a>
            <LineButton position="header" label="LINEで相談" variant="light" className="!h-9 !px-4 !text-[12px] hidden md:inline-flex" />
          </div>
        </header>

        <main>
          {/* 01 ファーストビュー */}
          <section data-lp-section="hero" className="relative md:grid md:grid-cols-2 md:min-h-[min(760px,calc(100svh-72px))] md:max-w-[1180px] md:mx-auto md:px-8 md:gap-12 md:items-center">
            <div className="relative h-[54svh] min-h-[340px] max-h-[560px] md:order-2 md:h-full md:max-h-none md:min-h-[600px] overflow-hidden md:rounded-[24px]">
              <picture>
                {lp.hero.imageMobile && (
                  <source media="(max-width: 767px)" srcSet={`/_next/image?url=${encodeURIComponent(lp.hero.imageMobile)}&w=828&q=75`} />
                )}
                <Image
                  src={lp.hero.image.src}
                  alt={lp.hero.image.alt}
                  fill
                  priority
                  sizes="(min-width:768px) 56vw, 100vw"
                  className="object-cover object-[50%_30%]"
                />
              </picture>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FBF9F6] to-transparent md:hidden" />
            </div>
            <div className="relative px-6 -mt-10 md:mt-0 md:px-0 md:order-1">
              <p className="text-[12px] tracking-[0.18em] text-[#8E857D]">{lp.hero.eyebrow}</p>
              <h1 className="mt-3 font-serif text-[28px] sm:text-[32px] md:text-[30px] lg:text-[38px] xl:text-[42px] leading-[1.55] tracking-[0.06em] text-[#3A3430] whitespace-pre-line">
                <AbText a={lp.hero.title} b={lp.experiment.heroTitleB} experimentId={exp} />
              </h1>
              <p className="mt-4 text-[14px] md:text-[16px] leading-[1.95] text-[#6E655E] whitespace-pre-line">
                <AbText a={lp.hero.subtitle} b={lp.experiment.heroSubtitleB} experimentId={exp} />
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="主なメニュー">
                {lp.menus.items.map((m) => (
                  <li key={m.key} className="rounded-full border border-[#DED5CA] bg-white/70 px-3 py-1 text-[12px] text-[#5F5750]">
                    {m.name}
                  </li>
                ))}
              </ul>
              <div id="lp-hero-cta" className="mt-7 pb-10 md:pb-0">
                <LineButton position="hero" label={<AbText a={lp.hero.ctaLabel} b={lp.experiment.ctaLabelB} experimentId={exp} />} size="lg" className="w-full md:w-auto" />
                <p className="mt-3 text-[12px] text-[#8E857D] text-center md:text-left">
                  {lp.hero.ctaNote}｜香南市・高知市の2店舗
                </p>
              </div>
            </div>
          </section>

          {/* 02 お悩み */}
          <section data-lp-section="concerns" className="px-5 py-20 md:py-28 bg-[#F4EFE9]">
            <div className="mx-auto max-w-[1080px]">
              <SectionHead en="Your concerns" ja={lp.concerns.heading} lead={lp.concerns.lead} />
              <ul className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {lp.concerns.items.map((c, i) => (
                  <li key={i}>
                    <ConcernLink menuKey={c.menuKey} menuName={menuName(c.menuKey)}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EFE9] text-[#A98B6D]" aria-hidden="true">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                      </span>
                      <p className="mt-3 text-[14px] md:text-[15px] leading-[1.75] text-[#3A3430]">{c.text}</p>
                    </ConcernLink>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 03 おすすめメニュー */}
          <section data-lp-section="menus" className="px-5 py-20 md:py-28">
            <div className="mx-auto max-w-[1080px]">
              <SectionHead en="Recommended menu" ja={lp.menus.heading} lead={lp.menus.lead} />
              <div className="mt-12 md:mt-16 space-y-16 md:space-y-24">
                {lp.menus.items.map((m, i) => {
                  const cat = LP_GALLERY_CATEGORIES.find((c) => c.key === m.key)?.key;
                  return (
                    <article
                      key={m.key}
                      id={`menu-${m.key}`}
                      data-lp-menu={m.key}
                      className="scroll-mt-6 md:grid md:grid-cols-2 md:gap-16 md:items-center"
                    >
                      <div className={`relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#EFE9E2] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                        {m.image.src && (
                          <Image src={m.image.src} alt={m.image.alt || m.name} fill sizes="(min-width:768px) 520px, 100vw" className="object-cover" />
                        )}
                        <span className="absolute left-4 top-4 lp-en text-[44px] leading-none text-white/90 drop-shadow-sm">0{i + 1}</span>
                      </div>
                      <div className="mt-7 md:mt-0">
                        <p className="text-[13px] tracking-[0.14em] text-[#A98B6D]">{m.catch}</p>
                        <h3 className="mt-2 font-serif text-[24px] md:text-[30px] tracking-[0.05em] text-[#3A3430]">{m.name}</h3>
                        <p className="mt-4 text-[14px] leading-[1.9] text-[#5F5750]">{m.target}</p>
                        <ul className="mt-5 space-y-2.5">
                          {m.features.filter(Boolean).map((f, j) => (
                            <li key={j} className="flex gap-3 text-[14px] leading-[1.8] text-[#5F5750]">
                              <span className="mt-[0.7em] h-px w-3 shrink-0 bg-[#A98B6D]" aria-hidden="true" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <dl className="mt-6 grid grid-cols-2 rounded-[14px] border border-[#E7E0D7] bg-white text-center">
                          <div className="py-4 border-r border-[#E7E0D7]">
                            <dt className="text-[11px] tracking-wider text-[#8E857D]">料金</dt>
                            <dd className="mt-1 font-serif text-[20px] text-[#3A3430]">
                              {m.price || <span className="text-[13px] font-sans text-[#5F5750]">LINEでご案内</span>}
                            </dd>
                          </div>
                          <div className="py-4">
                            <dt className="text-[11px] tracking-wider text-[#8E857D]">施術時間の目安</dt>
                            <dd className="mt-1 font-serif text-[18px] text-[#3A3430]">{m.duration || "—"}</dd>
                          </div>
                        </dl>
                        {m.priceNote && <p className="mt-2.5 text-[12px] leading-relaxed text-[#8E857D]">※{m.priceNote}</p>}
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                          <LineButton position={`menu_${m.key}`} menu={m.key} menuLabel={m.name} label={m.ctaLabel} className="w-full sm:w-auto" />
                          {cat && galleryCats.has(cat) && <MenuGalleryLink category={cat} />}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 04 ギャラリー */}
          {galleryCats.size > 0 && (
            <section id="gallery" data-lp-section="gallery" className="scroll-mt-4 px-4 py-20 md:py-28 bg-[#F4EFE9]">
              <div className="mx-auto max-w-[1180px]">
                <SectionHead en="Style gallery" ja={lp.gallery.heading} lead={lp.gallery.lead} />
                <div className="mt-10">
                  <Gallery items={lp.gallery.items} ctaLabel={lp.gallery.ctaLabel} />
                </div>
                <div className="mt-12 rounded-[18px] bg-white px-5 py-7 md:py-9 text-center border border-[#ECE5DC]">
                  <p className="font-serif text-[17px] md:text-[19px] text-[#3A3430]">気になるスタイルは見つかりましたか？</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6E655E]">画像を保存してLINEで送っていただくと、似合わせのご提案がスムーズです。</p>
                  <LineButton position="gallery_after" label="スタイルをLINEで相談する" className="mt-5 w-full sm:w-auto" />
                </div>
              </div>
            </section>
          )}

          {/* 05 選ばれる理由 */}
          <section data-lp-section="reasons" className="px-5 py-20 md:py-28">
            <div className="mx-auto max-w-[1080px]">
              <SectionHead en="Our policy" ja={lp.reasons.heading} />
              <ol className="mt-12 grid md:grid-cols-2 gap-x-14 gap-y-10">
                {lp.reasons.items.map((r, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="lp-en text-[34px] leading-none text-[#CFC5B8]">0{i + 1}</span>
                    <div className="pt-1">
                      <h3 className="font-serif text-[18px] md:text-[19px] leading-snug text-[#3A3430]">{r.title}</h3>
                      <p className="mt-2.5 text-[14px] leading-[1.9] text-[#5F5750]">{r.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 06 お客様の声（掲載許可のあるもののみ） */}
          {reviews.length > 0 ? (
            <section data-lp-section="reviews" className="px-5 py-20 md:py-28 bg-[#F4EFE9]">
              <div className="mx-auto max-w-[1080px]">
                <SectionHead en="Voice" ja={lp.reviews.heading} />
                <ul className="mt-10 grid md:grid-cols-3 gap-4 md:gap-6">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-[16px] bg-white border border-[#ECE5DC] p-6">
                      <p className="text-[14px] leading-[1.95] text-[#3A3430] whitespace-pre-line">{r.body}</p>
                      <p className="mt-4 text-[12px] text-[#8E857D]">
                        {[r.attribute, r.menu, r.salon === "riv" ? "Riv. by fleurami" : r.salon === "fleurami" ? "fleurami" : ""].filter(Boolean).join("｜")}
                      </p>
                      {r.source && <p className="mt-1 text-[11px] text-[#A39A92]">出典：{r.source}</p>}
                    </li>
                  ))}
                </ul>
                {lp.reviews.note && <p className="mt-6 text-center text-[11px] text-[#8E857D]">※{lp.reviews.note}</p>}
              </div>
            </section>
          ) : (
            preview && (
              <section className="px-5 py-10 bg-[#F4EFE9] text-center text-[12px] text-[#8E857D]">
                【プレビューのみ表示】掲載許可済みのお客様の声が0件のため、公開ページではこのセクションを表示しません。
              </section>
            )
          )}

          {/* 07 予約の流れ */}
          <section data-lp-section="flow" className="px-5 py-20 md:py-28">
            <div className="mx-auto max-w-[1080px]">
              <SectionHead en="How to book" ja={lp.steps.heading} lead={lp.steps.lead} />
              <ol className="mt-12 grid md:grid-cols-3 gap-4 md:gap-6">
                {lp.steps.items.map((s, i) => (
                  <li key={i} className="relative rounded-[16px] border border-[#E7E0D7] bg-white p-6 md:p-7">
                    <p className="lp-en text-[13px] tracking-[0.24em] text-[#A98B6D]">STEP {i + 1}</p>
                    <h3 className="mt-2 font-serif text-[18px] text-[#3A3430]">{s.title}</h3>
                    <p className="mt-2.5 text-[14px] leading-[1.85] text-[#5F5750]">{s.text}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10 text-center">
                <LineButton position="flow" label={lp.hero.ctaLabel} className="w-full sm:w-auto" />
              </div>
            </div>
          </section>

          {/* 08 FAQ */}
          <section data-lp-section="faq" className="px-5 py-20 md:py-28 bg-[#F4EFE9]">
            <div className="mx-auto max-w-[820px]">
              <SectionHead en="Q&A" ja={lp.faq.heading} />
              <div className="mt-10">
                <FaqList items={lp.faq.items} />
              </div>
            </div>
          </section>

          {/* 09 最終CTA */}
          <section id="lp-final" data-lp-section="final" className="relative overflow-hidden md:bg-[#3A3430]">
            {/* スマホ: 全面写真＋暗幕／PC: 左半分に写真、右半分に文字 */}
            <div className="absolute inset-0 md:right-1/2">
              {lp.final.image.src && (
                <Image src={lp.final.image.src} alt={lp.final.image.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-[40%_30%]" />
              )}
              <div className="absolute inset-0 bg-[#2B2522]/45 md:hidden" />
            </div>
            <div className="relative px-6 py-24 md:py-36 text-center text-white md:mx-auto md:max-w-[1180px] md:flex md:justify-end">
              <div className="md:w-1/2 md:pl-14 md:text-left">
              <p className="lp-en text-[14px] tracking-[0.3em] text-white/85">Contact</p>
              <h2 className="mt-4 font-serif text-[27px] md:text-[36px] lg:text-[40px] leading-[1.6] tracking-[0.08em] whitespace-pre-line">{lp.final.title}</h2>
              <p className="mt-5 text-[14px] md:text-[16px] leading-[1.95] text-white/90 max-w-[30em] mx-auto md:mx-0">{lp.final.text}</p>
              <LineButton
                position="final"
                label={lp.final.ctaLabel}
                size="lg"
                className="mt-9 w-full max-w-[380px]"
              />
              </div>
            </div>
          </section>

          {/* 店舗情報 */}
          <section data-lp-section="salons" className="px-5 py-16 md:py-20">
            <div className="mx-auto max-w-[1080px] grid md:grid-cols-2 gap-4 md:gap-6">
              {salons.map((s) => (
                <div key={s.key} className="rounded-[18px] border border-[#E7E0D7] bg-white p-6 md:p-8">
                  <p className="text-[12px] tracking-wider text-[#A98B6D]">{s.area}</p>
                  <h3 className="mt-1 font-serif text-[21px] text-[#3A3430]">{s.name}</h3>
                  <dl className="mt-4 space-y-1.5 text-[13px] leading-relaxed text-[#5F5750]">
                    <div className="flex gap-3"><dt className="w-16 shrink-0 text-[#8E857D]">住所</dt><dd>{s.address}</dd></div>
                    <div className="flex gap-3"><dt className="w-16 shrink-0 text-[#8E857D]">営業時間</dt><dd>{s.hours}</dd></div>
                    <div className="flex gap-3"><dt className="w-16 shrink-0 text-[#8E857D]">定休日</dt><dd>{s.closed}</dd></div>
                    <div className="flex gap-3"><dt className="w-16 shrink-0 text-[#8E857D]">駐車場</dt><dd>{s.parking}</dd></div>
                    <div className="flex gap-3"><dt className="w-16 shrink-0 text-[#8E857D]">電話</dt><dd><a href={`tel:${s.phone.replace(/-/g, "")}`} className="underline underline-offset-2">{s.phone}</a></dd></div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <LineButton position="salon_card" salon={s.key} label={`${s.name}に相談`} variant="light" className="!h-11 !text-[13px]" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name} ${s.address}`)}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex h-11 items-center rounded-full border border-[#DED5CA] px-5 text-[13px] text-[#5F5750] hover:border-[#A98B6D]"
                    >
                      地図を見る
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="px-5 pt-10 pb-28 md:pb-12 border-t border-[#ECE5DC] text-center">
          <p className="lp-en text-[18px] tracking-[0.18em] text-[#3A3430]">fleur GROUP</p>
          <nav className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-[#8E857D]">
            <a href="https://fleur-group.jp/menu" className="hover:text-[#3A3430]">メニュー・料金一覧</a>
            <a href="https://fleur-group.jp/staff" className="hover:text-[#3A3430]">スタッフ</a>
            <a href="https://fleur-group.jp/company" className="hover:text-[#3A3430]">会社概要</a>
          </nav>
          <p className="mt-5 text-[11px] text-[#A39A92]">© fleur GROUP</p>
        </footer>
      </div>

      <StickyCta label={lp.stickyCtaLabel} />
      <FloatingCta label={lp.stickyCtaLabel} />
      <ConsentBanner preview={preview} />
      {/* JavaScript無効時でもLINEへ遷移できる導線 */}
      <noscript>
        <div className="fixed inset-x-0 bottom-0 bg-white p-3 text-center text-[13px]">
          {salons.filter((s) => s.lineUrl).map((s) => (
            <a key={s.key} href={s.lineUrl} className="mx-2 inline-flex items-center gap-1 text-[#06C755]">
              <LineIcon className="w-4 h-4" />
              {s.name}
            </a>
          ))}
        </div>
      </noscript>
    </LineCtaProvider>
  );
}
