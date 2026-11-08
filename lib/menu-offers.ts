// content.json のメニュー表（menus）から、AI・検索エンジン向けの料金データ（schema.org OfferCatalog）を作る。
// 画面の料金表と同じデータから作るので、料金を変えたときにズレない。
import type { MenuCategory } from "@/lib/content";

const BASE = "https://fleur-group.jp";

type PriceInfo =
  | { kind: "fixed"; value: number }
  | { kind: "from"; value: number }
  | { kind: "addon"; text: string }
  | { kind: "none" };

// "¥4,700〜" → 最低4,700円 / "¥5,500" → 5,500円 / "+¥500" → 追加料金 / "要問い合わせ" → 価格なし
function parsePrice(raw: string): PriceInfo {
  const s = (raw ?? "").trim();
  if (s.startsWith("+") || s.startsWith("＋")) return { kind: "addon", text: s };
  const m = s.match(/[¥￥]\s*([\d,]+)/);
  if (!m) return { kind: "none" };
  const value = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return { kind: "none" };
  return /[〜~]/.test(s) ? { kind: "from", value } : { kind: "fixed", value };
}

function yen(n: number) {
  return `${n.toLocaleString("ja-JP")}円`;
}

/** 店のメニュー表を schema.org の OfferCatalog に変換する（カテゴリ→OfferCatalog、メニュー→Offer）。
 *  ロング料金・時間外料金などの追加料金は単独のメニューにせず、カテゴリの説明に条件として残す。 */
export function salonMenuOfferCatalog(
  salonKey: string,
  salonName: string,
  categories: MenuCategory[],
  featured?: { name: string; description: string }[],
) {
  const salonRef = { "@id": `${BASE}/salon/${salonKey}`, name: salonName };
  const addonNotes: string[] = [];
  const catalogs = [] as Record<string, unknown>[];

  for (const cat of categories) {
    const offers = [] as Record<string, unknown>[];
    for (const item of cat.items) {
      const p = parsePrice(item.price);
      if (p.kind === "addon") {
        addonNotes.push(`${cat.category} ${item.name} ${p.text}`);
        continue;
      }
      const priceText =
        p.kind === "fixed" ? `税込${yen(p.value)}` : p.kind === "from" ? `税込${yen(p.value)}から` : "料金は要問い合わせ";
      const offer: Record<string, unknown> = {
        "@type": "Offer",
        name: item.name,
        description: [item.desc, priceText].filter(Boolean).join("／"),
        itemOffered: {
          "@type": "Service",
          name: item.name,
          category: cat.category,
          provider: salonRef,
        },
        offeredBy: salonRef,
      };
      if (p.kind === "fixed" || p.kind === "from") {
        offer.priceCurrency = "JPY";
        if (p.kind === "fixed") offer.price = p.value;
        offer.priceSpecification = {
          "@type": "PriceSpecification",
          ...(p.kind === "fixed" ? { price: p.value } : { minPrice: p.value }),
          priceCurrency: "JPY",
          valueAddedTaxIncluded: true,
        };
      }
      offers.push(offer);
    }
    if (offers.length > 0) {
      catalogs.push({ "@type": "OfferCatalog", name: cat.category, itemListElement: offers });
    }
  }

  const items: Record<string, unknown>[] = [];
  if (featured && featured.length > 0) {
    items.push({
      "@type": "OfferCatalog",
      name: "得意メニュー",
      itemListElement: featured.map((f) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: f.name, description: f.description, provider: salonRef },
      })),
    });
  }
  items.push(...catalogs);

  return {
    "@type": "OfferCatalog",
    "@id": `${BASE}/salon/${salonKey}#menu`,
    name: `${salonName} メニュー・料金（税込）`,
    url: `${BASE}/salon/${salonKey}`,
    ...(addonNotes.length > 0 ? { description: `追加料金：${addonNotes.join("／")}` } : {}),
    itemListElement: items,
  };
}

/** 既存の店舗スキーマ（得意メニュー5件入り）に、全メニューの料金を足したものを返す */
export function withMenuPrices<T extends { name: string; hasOfferCatalog?: { itemListElement?: unknown[] } }>(
  schema: T,
  salonKey: string,
  categories: MenuCategory[],
): T {
  const featured = (schema.hasOfferCatalog?.itemListElement ?? [])
    .map((o) => (o as { itemOffered?: { name?: string; description?: string } }).itemOffered)
    .filter((s): s is { name: string; description: string } => Boolean(s?.name))
    .map((s) => ({ name: s.name, description: s.description ?? "" }));
  return { ...schema, hasOfferCatalog: salonMenuOfferCatalog(salonKey, schema.name, categories, featured) };
}
