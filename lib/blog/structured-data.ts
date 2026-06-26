import { Post, PostMeta } from "./posts";

const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";

export const SALONS = {
  fleurami: {
    "@type": "HairSalon",
    name: "fleur ami",
    alternateName: "フルールアミー",
    telephone: "0887-56-5566",
    address: {
      "@type": "PostalAddress",
      streetAddress: "野市町西野230",
      addressLocality: "香南市",
      addressRegion: "高知県",
      postalCode: "781-5233",
      addressCountry: "JP",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    description:
      "香南市の大人女性向けヘアサロン。艶カラー・髪質改善・白髪ぼかし・縮毛矯正を得意とする。のいち駅から車4分。駐車場7台無料。",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "得意メニュー",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "髪質改善トリートメント",
            description:
              "うねり・ダメージ・広がりを改善し、サラサラのツヤ髪へ近づける施術。施術時間90〜120分程度、1〜2ヶ月ごとの定期ケアが目安。香南市・fleur amiで施術可能。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "縮毛矯正",
            description:
              "くせ毛・チリチリを半永久的にストレートにする施術。施術時間180〜240分、3〜4ヶ月ごとが目安。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "白髪ぼかしカラー",
            description:
              "白髪を活かしたグレイブレンドカラー。自然なグラデーションで白髪をぼかす。施術時間120〜150分程度。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "艶カラー・ハイライト",
            description:
              "光を反射するツヤ感のあるカラー。ハイライトで立体感と透明感をプラス。",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.67",
      reviewCount: "388",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://beauty.hotpepper.jp/slnH000528388/",
      "https://www.instagram.com/fleurami_info/",
    ],
  },
  riv: {
    "@type": "HairSalon",
    name: "Riv. by fleur ami",
    alternateName: "リヴ バイ フルールアミー",
    telephone: "088-884-5566",
    address: {
      "@type": "PostalAddress",
      streetAddress: "南川添9-21 フルールアミー3 2F",
      addressLocality: "高知市",
      addressRegion: "高知県",
      postalCode: "780-0926",
      addressCountry: "JP",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:30",
        closes: "18:30",
      },
    ],
    description:
      "高知市の20〜40代に人気のヘアサロン。髪質改善・縮毛矯正・ハイライト・白髪ぼかし。資生堂の似合わせカット。高知IC車4分、駐車場5台無料。",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "得意メニュー",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "髪質改善トリートメント",
            description:
              "うねり・ダメージ・広がりを改善し、サラサラのツヤ髪へ近づける施術。施術時間90〜120分程度、1〜2ヶ月ごとの定期ケアが目安。高知市・Riv.で施術可能。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "縮毛矯正",
            description:
              "くせ毛・チリチリを半永久的にストレートにする施術。施術時間180〜240分、3〜4ヶ月ごとが目安。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "白髪ぼかしカラー",
            description:
              "白髪を活かしたグレイブレンドカラー。自然なグラデーションで白髪をぼかす。施術時間120〜150分程度。",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "ハイライト・艶カラー",
            description:
              "透明感のある立体的なカラー。似合わせカットと組み合わせてスタイルを提案。",
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.65",
      reviewCount: "674",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://beauty.hotpepper.jp/slnH000634137/",
      "https://www.instagram.com/riv.kochi/",
    ],
  },
  raffine: {
    "@type": "BeautySalon",
    name: "Raffine",
    alternateName: "ラフィーネ",
    telephone: "090-7120-5566",
    address: {
      "@type": "PostalAddress",
      streetAddress: "はりまや町1-4-8 TNはりまやビル3F",
      addressLocality: "高知市",
      addressRegion: "高知県",
      postalCode: "780-0822",
      addressCountry: "JP",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:30",
        closes: "18:30",
      },
    ],
    description:
      "高知市はりまや橋徒歩3分のまつげ・まゆげ専門サロン。マツエク・まつげパーマ・韓国束感まつげ・フラットラッシュ・パリジェンヌ・眉毛WAX。半個室・女性専用。",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.82",
      reviewCount: "200",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [
      "https://beauty.hotpepper.jp/kr/slnH000767549/",
      "https://www.instagram.com/raffine0815/",
    ],
  },
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "フルールグループ",
    url: SITE_URL,
    sameAs: [
      "https://www.fleurami-group.com",
      "https://beauty.hotpepper.jp/slnH000528388/",
      "https://www.instagram.com/fleurami_info/",
      "https://beauty.hotpepper.jp/slnH000634137/",
      "https://www.instagram.com/riv.kochi/",
      "https://beauty.hotpepper.jp/kr/slnH000767549/",
      "https://www.instagram.com/raffine0815/",
    ],
    description:
      "高知県のヘアサロン（fleur ami・香南市 / Riv.・高知市）とまつ毛パーマ・マツエク・まゆげ専門サロン（Raffine・高知市）を展開するグループ。",
    member: [SALONS.fleurami, SALONS.riv, SALONS.raffine],
  };
}

export function localBusinessSchema(salonKey: keyof typeof SALONS) {
  return {
    "@context": "https://schema.org",
    ...SALONS[salonKey],
    url: SITE_URL,
  };
}

export function articleSchema(post: Post | PostMeta, slug: string) {
  const url = `${SITE_URL}/blog/${post.category}/${slug}`;
  const author =
    post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: post.salon || "フルールグループ" };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author,
    publisher: {
      "@type": "Organization",
      name: "フルールグループ",
      url: SITE_URL,
    },
    url,
    image: post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${SITE_URL}${post.thumbnail}`,
    mainEntityOfPage: url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#article-qa", "#faq-section"],
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function tagPageSchema(tag: string, category: "hair" | "eyelash", posts: PostMeta[]) {
  const path = `/blog/${category}/tag/${encodeURIComponent(tag)}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag}の記事一覧`,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${category}/${p.slug}`,
        name: p.title,
      })),
    },
  };
}

export function howToSchema(
  name: string,
  description: string,
  steps: { name: string; text: string }[],
  url: string,
) {
  if (!steps || steps.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    url: `${SITE_URL}${url}`,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "フルールグループ 症例・コラム",
    url: SITE_URL,
    description: "高知県のヘアサロン（fleur ami・Riv.）とアイラッシュサロン（Raffine）による施術例・コラムメディア",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionPageSchema(
  name: string,
  path: string,
  description: string,
  posts: PostMeta[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}${path}`,
    description,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/blog/${p.category}/${p.slug}`,
        name: p.title,
      })),
    },
  };
}

export function personSchema(
  name: string,
  jobTitle: string,
  salonName: string,
  salonType: "HairSalon" | "BeautySalon",
  salonAddress: string,
  authorUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url: `${SITE_URL}${authorUrl}`,
    worksFor: {
      "@type": salonType,
      name: salonName,
      address: {
        "@type": "PostalAddress",
        streetAddress: salonAddress,
        addressRegion: "高知県",
        addressCountry: "JP",
      },
    },
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
