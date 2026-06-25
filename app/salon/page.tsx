import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";

export const metadata: Metadata = {
  title: "店舗案内",
  description:
    "fleur GROUPは高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）とアイラッシュサロン1店舗（Raffine）を展開しています。",
  alternates: { canonical: "https://fleurami-group.jp/salon" },
};

const SALON_HREFS: Record<string, string> = {
  riv: "/salon/riv",
  fleurami: "/salon/fleurami",
  raffine: "/salon/raffine",
};

const crumbs = [
  { name: "ホーム", url: "https://fleurami-group.jp" },
  { name: "店舗案内", url: "https://fleurami-group.jp/salon" },
];

const TYPE_LABEL: Record<string, string> = {
  "美容室": "美容室",
  "アイラッシュサロン": "アイラッシュサロン",
};

export default async function SalonListPage() {
  const content = await getContentCached();
  const orderedSalons = content.salonOrder
    .map((key) => ({ key, ...content.salons[key as keyof typeof content.salons] }))
    .filter(Boolean);

  // 業態別グループ
  const typesSeen = new Set<string>();
  const types: string[] = [];
  for (const s of orderedSalons) {
    if (!typesSeen.has(s.salonType)) { typesSeen.add(s.salonType); types.push(s.salonType); }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      <div className="bg-site-light py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="text-xs text-site-muted mb-4">
            <Link href="/" className="hover:text-site-accent">ホーム</Link>
            <span className="mx-2">/</span>
            <span>店舗案内</span>
          </nav>
          <p className="text-xs tracking-[0.3em] text-site-accent mb-2 uppercase">Our Salons</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-site-text">店舗案内</h1>
        </div>
      </div>

      {types.map((type) => {
        const salonsOfType = orderedSalons.filter((s) => s.salonType === type);
        return (
          <section key={type} className="py-12 sm:py-16 bg-white border-b border-site-greige last:border-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-3 mb-8">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  type === "美容室"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-pink-50 text-pink-600"
                }`}>
                  {TYPE_LABEL[type] ?? type}
                </span>
                <div className="flex-1 h-px bg-site-greige" />
              </div>

              <div className="space-y-10">
                {salonsOfType.map((salon, i) => (
                  <div
                    key={salon.key}
                    className="border border-site-greige overflow-hidden"
                  >
                    <div className={`flex flex-col lg:flex-row ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      <div className="lg:w-5/12 bg-site-light flex items-center justify-center min-h-[240px]">
                        {salon.imageSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={salon.imageSrc} alt={salon.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-site-muted text-sm">[店舗写真]</span>
                        )}
                      </div>
                      <div className="lg:w-7/12 p-7 sm:p-10">
                        <p className="text-xs text-site-accent tracking-wider mb-2">{salon.area}</p>
                        <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-1">{salon.name}</h2>
                        {salon.nameReading && (
                          <p className="text-xs text-site-muted tracking-widest mb-3">{salon.nameReading}</p>
                        )}
                        {salon.description && (
                          <p className="text-sm text-site-muted leading-relaxed mb-5">{salon.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {salon.features.map((f) => (
                            <span key={f} className="text-xs bg-site-light text-site-text px-2.5 py-1 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-site-muted space-y-1 mb-6">
                          <p><span className="text-site-text font-medium">住所：</span>{salon.address}</p>
                          <p><span className="text-site-text font-medium">営業時間：</span>{salon.hoursWeekday === salon.hoursSaturday ? salon.hoursWeekday : `平日 ${salon.hoursWeekday} / 土曜 ${salon.hoursSaturday}`}</p>
                          <p><span className="text-site-text font-medium">定休日：</span>{salon.closed}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.2em] text-site-accent uppercase mb-3">ご予約</p>
                          <SalonReserveIcons salon={salon} uid={salon.key} />
                          <Link
                            href={SALON_HREFS[salon.key] ?? "#"}
                            className="inline-flex items-center gap-3 text-xs font-medium tracking-wider text-site-text hover:text-site-accent transition-all duration-200 mt-6 group"
                          >
                            <span>店舗詳細を見る</span>
                            <span className="w-6 h-px bg-current group-hover:w-8 transition-all duration-300" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    {salon.mapEmbedUrl && (
                      <div className="h-56 sm:h-64 border-t border-site-greige">
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
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
