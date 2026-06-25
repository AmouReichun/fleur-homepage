import Link from "next/link";
import { getContentCached } from "@/lib/content";
import SalonBlogLinks from "@/app/components/SalonBlogLinks";
import ReservationChannels from "@/app/components/ReservationChannels";

const SALON_LABELS: Record<string, string> = {
  riv: "Riv.by fleurami（高知市）",
  fleurami: "fleurami（香南市）",
  raffine: "Raffine（高知市 はりまや橋）",
};

export default async function SalonDetailPage({ salonKey }: { salonKey: string }) {
  const content = await getContentCached();
  const salon = content.salons[salonKey as keyof typeof content.salons];
  const menus = content.menus[salonKey as keyof typeof content.menus] ?? [];
  const otherSalons = content.salonOrder.filter((k) => k !== salonKey);

  if (!salon) return <div className="p-10 text-center text-site-muted">サロン情報が見つかりません</div>;

  return (
    <>
      {/* ヘッダー */}
      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/salon" className="hover:text-site-accent">店舗案内</Link>
            <span className="mx-2">/</span>
            <span>{salon.name}</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">{salon.area} / {salon.salonType}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text mb-1">{salon.name}</h1>
          {salon.nameReading && (
            <p className="text-xs text-site-muted tracking-widest">{salon.nameReading}</p>
          )}
        </div>
      </div>

      {/* 写真 */}
      {salon.imageSrc && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={salon.imageSrc} alt={salon.name} className="w-full h-64 sm:h-96 object-cover" />
        </div>
      )}

      {/* 予約ボタン */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row gap-3">
        {salon.hotpepperUrl && (
          <a
            href={salon.hotpepperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none sm:w-64 text-center bg-site-accent text-white py-4 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200"
          >
            ホットペッパーで予約する
          </a>
        )}
        {salon.instagramUrl && (
          <a
            href={salon.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none sm:w-64 text-center border border-site-greige text-site-text py-4 text-sm font-medium tracking-wider hover:border-site-accent hover:text-site-accent transition-all duration-200"
          >
            Instagramを見る
          </a>
        )}
      </div>

      {/* 特徴 */}
      {salon.features.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              {salon.name}の特徴
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {salon.features.map((f) => (
                <div key={f} className="bg-site-bg p-5 border border-site-greige flex items-start gap-3">
                  <span className="text-site-accent mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-sm text-site-muted leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
            {salon.description && (
              <p className="mt-6 text-sm text-site-muted leading-loose text-center max-w-2xl mx-auto">
                {salon.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* メニュー */}
      {menus.length > 0 && (
        <section className="py-12 sm:py-16 bg-site-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">メニュー</h2>
            <div className="space-y-8">
              {menus.map((cat) => (
                <div key={cat.category}>
                  <h3 className="text-xs tracking-[0.3em] text-site-accent uppercase mb-4 flex items-center gap-3">
                    {cat.category}
                    <span className="flex-1 h-px bg-site-greige" />
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cat.items.map((item) => (
                      <div key={item.name} className="bg-white border border-site-greige p-4 flex justify-between items-start gap-3">
                        <div>
                          <p className="font-serif text-sm font-semibold mb-0.5">{item.name}</p>
                          {item.desc && <p className="text-xs text-site-muted">{item.desc}</p>}
                        </div>
                        <p className="text-sm font-medium text-site-accent whitespace-nowrap">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-site-muted mt-5 text-center">※価格は税込みです</p>
            {salon.menuNotes && salon.menuNotes.length > 0 && (
              <div className="mt-6 border border-site-greige bg-white p-5">
                <p className="text-xs font-medium text-site-text mb-3 tracking-wider">ご予約時のご注意</p>
                <ul className="space-y-1.5">
                  {salon.menuNotes.map((note, i) => (
                    <li key={i} className="text-xs text-site-muted leading-relaxed flex gap-2">
                      <span className="text-site-accent flex-shrink-0">・</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {salon.faq.length > 0 && (
        <section className="py-12 sm:py-16 bg-site-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">
              よくあるご質問
            </h2>
            <div className="space-y-4">
              {salon.faq.map((faq, i) => (
                <details key={i} className="bg-white border border-site-greige group">
                  <summary className="flex items-start justify-between gap-4 p-5 cursor-pointer list-none">
                    <span className="text-sm font-medium leading-relaxed">
                      <span className="text-site-accent mr-2">Q.</span>{faq.q}
                    </span>
                    <span className="flex-shrink-0 text-site-muted text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-sm text-site-muted leading-relaxed border-t border-site-greige pt-4">
                      <span className="text-site-accent mr-2">A.</span>{faq.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ご予約（電話 / Web予約 / LINE / Instagram / ホットペッパー） */}
      <section className="py-12 sm:py-16 bg-site-light">
        <div className="px-4 sm:px-6">
          <ReservationChannels
            salonOrder={[salonKey]}
            salons={content.salons as unknown as Record<string, import("@/lib/content").SalonContent>}
            heading={`${salon.name} のご予約`}
          />
        </div>
      </section>

      {/* この店舗の最新ブログ（店舗→ブログ内部リンク） */}
      <SalonBlogLinks salonKey={salonKey} salonName={salon.name} area={salon.area} />

      {/* 店舗情報 */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-site-text mb-8 text-center">店舗情報</h2>
          <div className="border border-site-greige overflow-hidden">
            {[
              { label: "サロン名", value: salon.name },
              { label: "住所", value: salon.address },
              { label: "電話", value: salon.phone },
              { label: "営業時間", value: salon.hoursWeekday === salon.hoursSaturday
                  ? salon.hoursWeekday
                  : `平日 ${salon.hoursWeekday} / 土曜 ${salon.hoursSaturday}` },
              { label: "定休日", value: salon.closed },
              { label: "駐車場", value: salon.parking },
            ]
              .filter((r) => r.value)
              .map((row) => (
                <div key={row.label} className="flex border-b border-site-greige last:border-b-0">
                  <div className="w-24 sm:w-32 bg-site-bg px-4 py-3.5 text-xs font-medium text-site-text flex-shrink-0">
                    {row.label}
                  </div>
                  <div className="px-4 py-3.5 text-sm text-site-muted whitespace-pre-line">{row.value}</div>
                </div>
              ))}
          </div>

          {salon.mapEmbedUrl && (
            <div className="mt-6 aspect-video">
              <iframe
                src={salon.mapEmbedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${salon.name} マップ`}
              />
            </div>
          )}
        </div>
      </section>

      {/* 他店舗リンク */}
      {otherSalons.length > 0 && (
        <section className="py-10 bg-site-bg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-site-muted mb-4">他の店舗もご覧ください</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {otherSalons.map((k) => (
                <Link
                  key={k}
                  href={`/salon/${k}`}
                  className="border border-site-greige text-site-text px-6 py-3 text-sm hover:border-site-accent hover:text-site-accent transition-all duration-200"
                >
                  {SALON_LABELS[k] ?? k}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
