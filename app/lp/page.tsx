import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentCached } from "@/lib/content";
import { getLpStore, type LpContent } from "@/lib/lp";
import { CONSENT_DEFAULT_SCRIPT } from "@/lib/lp-track";
import { fleuramiSalonSchema, rivSalonSchema } from "@/lib/structured-data";
import LpView from "./LpView";
import { buildSalonInfo } from "./salons";
import { lpEnFont } from "./font";

// 管理画面の「公開」で revalidateTag("site-content") が呼ばれ即時反映。保険として1時間ごとにも再生成。
export const revalidate = 3600;

const BASE = "https://fleur-group.jp";
const URL_LP = `${BASE}/lp`;

async function getPublished(): Promise<{ lp: LpContent; content: Awaited<ReturnType<typeof getContentCached>> } | null> {
  const content = await getContentCached();
  const lp = getLpStore(content).published;
  return lp ? { lp, content } : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublished();
  if (!data) return {};
  const { seo } = data.lp;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: URL_LP },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: "fleur GROUP",
      url: URL_LP,
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage, alt: seo.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: seo.ogImage ? [seo.ogImage] : undefined },
  };
}

function priceValue(price: string): number | undefined {
  const m = price.replace(/,/g, "").match(/¥?(\d{3,})/);
  return m ? Number(m[1]) : undefined;
}

export default async function LpPage() {
  const data = await getPublished();
  if (!data) notFound();
  const { lp, content } = data;
  const salons = buildSalonInfo(content, lp);

  // 構造化データ: LP の FAQ ＋ おすすめメニュー。店舗は各店舗ページの HairSalon を @id で参照する
  // （評価件数などを含む店舗スキーマをLPで重複出力しない）
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${URL_LP}#webpage`,
    url: URL_LP,
    name: lp.seo.title,
    description: lp.seo.description,
    inLanguage: "ja",
    about: [{ "@id": fleuramiSalonSchema["@id"] }, { "@id": rivSalonSchema["@id"] }],
    mainEntity: {
      "@type": "ItemList",
      name: lp.menus.heading,
      itemListElement: lp.menus.items.map((m, i) => {
        const price = priceValue(m.price);
        return {
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: m.name,
            description: m.target,
            serviceType: m.name,
            provider: [{ "@id": fleuramiSalonSchema["@id"] }, { "@id": rivSalonSchema["@id"] }],
            areaServed: ["高知市", "香南市"],
            ...(price
              ? {
                  offers: {
                    "@type": "Offer",
                    priceCurrency: "JPY",
                    ...(m.price.includes("〜")
                      ? { priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "JPY" } }
                      : { price }),
                  },
                }
              : {}),
          },
        };
      }),
    },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: lp.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className={lpEnFont.variable}>
      {/* GAタグより先に同意状態の既定値を設定（Consent Mode v2） */}
      <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <LpView lp={lp} salons={salons} />
    </div>
  );
}
