import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContentCached, type SalonContent } from "@/lib/content";
import { AREAS, getArea, servicesInArea } from "@/lib/areas";
import { breadcrumbSchema, salonFaqPageSchema } from "@/lib/structured-data";
import ReservationChannels from "@/app/components/ReservationChannels";
import GoogleReviewCTA from "@/app/components/GoogleReviewCTA";

const BASE = "https://fleur-group.jp";

// content.staff の salon 表記 → salonKey
const STAFF_SALON: Record<string, string> = { riv: "Riv. by fleurami", fleurami: "fleurami", raffine: "Raffine" };

// エリア別のSEO上書き（主LPの検索意図を明確化。未指定は既存の自動生成を使用）
const AREA_SEO: Record<string, { title: string; description: string }> = {
  kochi: {
    title: "高知市の美容室・美容院｜髪質改善・白髪ぼかしのRiv. by fleurami",
    description:
      "高知市で美容室をお探しの方へ。高知市南川添の「Riv. by fleurami」は髪質改善・白髪ぼかし・縮毛矯正・似合わせカット・艶カラーが得意な大人女性向けの美容室です。所在地・営業時間・スタッフ・メニュー・料金・ご予約方法をまとめて掲載。はりまや橋のアイラッシュサロンRaffineもご紹介。",
  },
};

const AREA_INTRO: Record<string, string> = {
  kochi: "高知市には「Riv. by fleurami（南川添）」と「Raffine（はりまや橋）」の2店舗があります。美容室では髪質改善・白髪ぼかし・縮毛矯正・カット・カラーを、アイラッシュサロンではまつげパーマ・まつげエクステ・眉毛WAXをご提供しています。骨格や髪質・目元のお悩みに合わせた丁寧なカウンセリングのうえで施術を行い、毎日扱いやすく、自分らしく綺麗でいられるスタイルをご提案します。ご予約はホットペッパービューティーまたはLINEからお気軽にどうぞ。",
  konan: "香南市には「fleurami（野市町西野）」があります。縮毛矯正・髪質改善・白髪ぼかし・艶カラー・カットを得意とし、大人女性を中心に地域の皆様に選ばれているヘアサロンです。のいち駅から車で約4分、無料駐車場7台完備でアクセスも便利です。カウンセリングを大切にし、扱いやすく再現しやすいスタイルをご提案しています。ご予約はホットペッパービューティーまたはLINEから承っています。",
  noichi: "野市（香南市野市町）には「fleurami（野市町西野230）」があります。縮毛矯正・髪質改善・白髪ぼかし・カラー・カットが得意なヘアサロンで、くせ毛・うねりにお悩みの方や扱いやすい髪にしたいとお考えの方に数多くご来店いただいています。のいち駅から車で約4分、無料駐車場7台完備です。初めての方もカウンセリングでお気軽にご相談ください。ご予約はホットペッパービューティーまたはLINEから受け付けています。",
  harimayabashi: "はりまや橋（高知市はりまや町）には、まつげ・眉毛の専門サロン「Raffine（ラフィーネ）」があります。まつげパーマ（パリジャンリフト・ラッシュリフト）・まつげエクステ・LEDエクステ・眉毛WAX（メンズ対応）をご提供しています。全席半個室のプライベートな空間で、落ち着いた雰囲気のなかで施術を受けていただけます。Googleクチコミ4.82（200件以上）の高評価サロンです。ご予約はホットペッパービューティーまたはInstagram DMから受け付けています。",
};

type Props = { params: { area: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const area = getArea(params.area);
  if (!area) return {};
  const hasHair = area.salonKeys.some((k) => ["riv", "fleurami"].includes(k));
  const hasEyelash = area.salonKeys.some((k) => k === "raffine");
  const salonLabel = hasHair && hasEyelash
    ? "美容室・アイラッシュサロン"
    : hasEyelash
    ? "アイラッシュサロン"
    : "美容室";
  const serviceHint = hasHair && hasEyelash
    ? "髪質改善・白髪ぼかし・縮毛矯正・艶カラー・まつげパーマ・眉毛WAX"
    : hasEyelash
    ? "まつげパーマ・ラッシュリフト・まつげエクステ・眉毛WAX"
    : "髪質改善・白髪ぼかし・縮毛矯正・艶カラー・デザインカット";
  const override = AREA_SEO[area.slug];
  const title = override?.title ?? `高知県${area.name}の${salonLabel}｜fleur GROUP`;
  const description = override?.description ?? `高知県${area.name}の${salonLabel}「fleur GROUP」。${serviceHint}など、${area.name}で受けられるメニュー一覧と各店舗のご予約案内。`;
  const url = `${BASE}/area/${area.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function AreaPage({ params }: Props) {
  const area = getArea(params.area);
  if (!area) notFound();

  const services = servicesInArea(area);
  const content = await getContentCached();
  const salons = content.salons as unknown as Record<string, SalonContent>;
  const areaSalonKeys = area.salonKeys.filter((k) => salons[k]);

  const hasHair = area.salonKeys.some((k) => ["riv", "fleurami"].includes(k));
  const hasEyelash = area.salonKeys.some((k) => k === "raffine");
  const salonLabel = hasHair && hasEyelash
    ? "美容室・アイラッシュサロン"
    : hasEyelash
    ? "アイラッシュサロン"
    : "美容室";

  const crumbs = [
    { name: "ホーム", url: BASE },
    { name: "エリアから探す", url: `${BASE}/area/${area.slug}` },
  ];

  // メニューをヘア／アイラッシュで分類（美容室メニューを明確に見せる）
  const hairServices = services.filter((s) => s.world === "hair");
  const eyelashServices = services.filter((s) => s.world === "eyelash");

  // 各店舗のスタッフ（既存データ）— 店舗→スタッフのEntity導線
  const staffByKey: Record<string, typeof content.staff> = {};
  for (const k of areaSalonKeys) {
    staffByKey[k] = (content.staff ?? []).filter((m) => m.salon === STAFF_SALON[k] && !m.hidden).slice(0, 4);
  }

  // エリア内店舗のEntity参照（既存の @id を参照。NAPの重複定義はしない）
  const salonItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${area.name}のfleur GROUP店舗`,
    itemListElement: areaSalonKeys.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": salons[k].salonType === "美容室" ? "HairSalon" : "BeautySalon",
        "@id": `${BASE}/salon/${k}`,
        name: salons[k].name,
        url: `${BASE}/salon/${k}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      {area.faq && area.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonFaqPageSchema(area.faq)) }} />
      )}
      {areaSalonKeys.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonItemList) }} />
      )}

      <div className="bg-site-light pt-24 sm:pt-[7.5rem] pb-10 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>{area.name}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Area — {area.name}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">
            {area.name}の{salonLabel}
          </h1>
          {AREA_INTRO[area.slug] && (
            <p className="text-sm text-site-text leading-loose mt-4 max-w-2xl">
              {AREA_INTRO[area.slug]}
            </p>
          )}
          <p className="text-sm text-site-muted mt-3">
            {area.name}のfleur GROUPで受けられるメニューから探せます。
          </p>
        </div>
      </div>

      {/* この地域の店舗（一次情報：NAP・スタッフ・店舗ページへの強い内部リンク） */}
      {areaSalonKeys.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-3 text-center">
              {area.name}の店舗
            </h2>
            <p className="text-xs text-site-muted text-center mb-10">
              所在地・営業時間・スタッフ・得意な施術をご紹介します
            </p>
            <div className="space-y-10">
              {areaSalonKeys.map((k) => {
                const s = salons[k];
                const staff = staffByKey[k] ?? [];
                return (
                  <div key={k} className="border border-site-greige bg-white overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-5">
                      {s.imageSrc && (
                        <div className="relative h-48 sm:h-full sm:min-h-[16rem] sm:col-span-2">
                          <Image src={s.imageSrc} alt={`${s.name}（${s.area}の${s.salonType}）の店内・外観`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 360px" />
                        </div>
                      )}
                      <div className="p-5 sm:p-6 sm:col-span-3">
                        <p className="text-[10px] tracking-[0.25em] text-site-accent uppercase mb-1">{s.area} / {s.salonType}</p>
                        <h3 className="font-serif text-xl font-semibold text-site-text">{s.name}</h3>
                        {s.nameReading && <p className="text-[11px] text-site-muted tracking-widest mb-1">{s.nameReading}</p>}
                        {s.tagline && <p className="text-sm text-site-text/80 mb-3">{s.tagline}</p>}
                        {s.features && s.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {s.features.slice(0, 5).map((f) => (
                              <span key={f} className="text-[10px] text-site-muted border border-site-greige px-2 py-0.5">{f}</span>
                            ))}
                          </div>
                        )}
                        <dl className="text-xs text-site-muted space-y-1 mb-4">
                          {s.address && <div className="flex gap-2"><dt className="text-site-text/70 w-14 flex-shrink-0">住所</dt><dd>{s.address}</dd></div>}
                          {s.hoursWeekday && <div className="flex gap-2"><dt className="text-site-text/70 w-14 flex-shrink-0">営業時間</dt><dd>{s.hoursWeekday}{s.closed ? `／定休：${s.closed}` : ""}</dd></div>}
                          {s.phone && <div className="flex gap-2"><dt className="text-site-text/70 w-14 flex-shrink-0">電話</dt><dd>{s.phone}</dd></div>}
                          {s.parking && <div className="flex gap-2"><dt className="text-site-text/70 w-14 flex-shrink-0">駐車場</dt><dd>{s.parking}</dd></div>}
                        </dl>
                        {staff.length > 0 && (
                          <div className="mb-4">
                            <p className="text-[10px] tracking-[0.2em] text-site-accent uppercase mb-2">Staff — 在籍スタイリスト</p>
                            <div className="flex flex-wrap gap-3">
                              {staff.map((m, i) => (
                                <Link key={`${m.name}-${i}`} href={m.slug ? `/staff/${m.slug}` : "/staff"} className="flex items-center gap-2 group">
                                  {m.imageSrc && (
                                    <span className="relative w-9 h-9 overflow-hidden rounded-full bg-site-bg flex-shrink-0">
                                      <Image src={m.imageSrc} alt={`${m.name}（${s.name}・${m.role}）`} fill className="object-cover" sizes="36px" />
                                    </span>
                                  )}
                                  <span className="text-[11px] text-site-text group-hover:text-site-accent transition-colors">{m.name}<span className="text-site-muted">／{m.role}</span></span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={`/salon/${k}`} className="inline-flex items-center gap-3 bg-site-accent text-white px-5 py-3 text-sm font-medium hover:bg-opacity-90 transition-all group">
                          <span>{s.name}の店舗ページを見る</span>
                          <span className="w-5 h-px bg-current group-hover:w-8 transition-all duration-300" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* メニュー一覧 */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
            {area.name}のメニュー
          </h2>
          {[
            { label: "ヘア（美容室）メニュー", list: hairServices },
            { label: "アイラッシュ・眉毛メニュー", list: eyelashServices },
          ].filter((g) => g.list.length > 0).map((group) => (
            <div key={group.label} className="mb-8 last:mb-0">
              <h3 className="text-xs tracking-[0.3em] text-site-accent uppercase mb-4 flex items-center gap-3">
                {group.label}
                <span className="flex-1 h-px bg-site-greige" />
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {group.list.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={`/area/${area.slug}/${svc.slug}`}
                    className="border border-site-greige bg-white p-5 hover:border-site-accent transition-colors group"
                  >
                    <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors">
                      {area.name}の{svc.name}
                    </span>
                    <span className="block text-[11px] text-site-muted mt-1.5 leading-relaxed">
                      {svc.forWhom[0]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <p className="text-center text-xs text-site-muted mt-8">
            他のエリア：
            {AREAS.filter((a) => a.slug !== area.slug).map((a) => (
              <Link key={a.slug} href={`/area/${a.slug}`} className="text-site-accent underline underline-offset-2 mx-1">
                {a.name}
              </Link>
            ))}
          </p>
        </div>
      </section>

      {/* 対応店舗・ご予約 */}
      <section className="py-12 sm:py-16 bg-white border-t border-site-greige">
        <div className="px-4 sm:px-6">
          <ReservationChannels
            salonOrder={areaSalonKeys}
            salons={salons}
            heading={`${area.name}の店舗・ご予約`}
            note="ご希望の方法でご予約いただけます"
          />
        </div>
      </section>

      {/* よくある質問 */}
      {area.faq && area.faq.length > 0 && (
        <section className="py-12 sm:py-16 bg-site-light border-t border-site-greige">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              {area.name}のよくある質問
            </h2>
            <dl className="space-y-4">
              {area.faq.map((item, i) => (
                <div key={i} className="border border-site-greige p-5">
                  <dt className="text-sm font-medium text-site-text mb-2">Q. {item.q}</dt>
                  <dd className="text-sm text-site-muted leading-relaxed">A. {item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <GoogleReviewCTA salonKeys={areaSalonKeys} />
    </>
  );
}
