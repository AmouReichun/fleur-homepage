const BASE = "https://fleur-group.jp";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "fleur GROUP",
  alternateName: "フルールグループ",
  url: BASE,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/icon.png`,
    width: 512,
    height: 512,
  },
  description:
    "2006年設立。高知市・香南市で美容室2店舗（Riv. by fleurami・fleurami）とアイラッシュサロン（Raffine）を展開する美容グループ。髪質改善・白髪ぼかし・縮毛矯正・まつ毛パーマ・眉毛WAXを得意とし、大人女性を中心に高知県内で選ばれ続けている。",
  slogan: "髪と目元で、なりたい自分へ。",
  foundingDate: "2006",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 13,
  },
  founder: {
    "@type": "Person",
    name: "今井 信人",
  },
  areaServed: [
    { "@type": "City", name: "高知市", containedInPlace: { "@type": "State", name: "高知県" } },
    { "@type": "City", name: "香南市", containedInPlace: { "@type": "State", name: "高知県" } },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "088-884-5566",
      contactType: "customer service",
      areaServed: "JP",
      availableLanguage: "Japanese",
      name: "Riv. by fleurami",
    },
    {
      "@type": "ContactPoint",
      telephone: "0887-56-5566",
      contactType: "customer service",
      areaServed: "JP",
      availableLanguage: "Japanese",
      name: "fleurami",
    },
    {
      "@type": "ContactPoint",
      telephone: "090-7120-5566",
      contactType: "customer service",
      areaServed: "JP",
      availableLanguage: "Japanese",
      name: "Raffine",
    },
  ],
  subOrganization: [
    { "@type": "HairSalon", "@id": `${BASE}/salon/fleurami`, name: "fleurami" },
    { "@type": "HairSalon", "@id": `${BASE}/salon/riv`, name: "Riv. by fleurami" },
    { "@type": "BeautySalon", "@id": `${BASE}/salon/raffine`, name: "Raffine" },
  ],
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://www.instagram.com/fleurami_info",
    "https://www.instagram.com/riv.kochi",
    "https://www.instagram.com/raffine0815",
    "https://g.page/r/CVY6rOf-UWbxEAE",
    "https://g.page/r/CdEFX3xXBBF7EAE",
    "https://g.page/r/CbD8dVZGgEeuEAE",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "美容サービス",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "髪質改善" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "白髪ぼかし" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "縮毛矯正" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "まつげパーマ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "眉毛WAX" } },
    ],
  },
};

export const rivSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${BASE}/salon/riv`,
  name: "Riv. by fleurami",
  alternateName: ["Riv.by fleurami", "リヴ バイ フルールアミー", "Riv. by fleur ami"],
  description:
    "高知市のヘアカラー・髪質改善専門の美容室。白髪ぼかし・艶カラー・縮毛矯正・大人女性向けの似合わせカットが得意。高知市南川添にあるヘアサロン。定休日：月曜・第1第3火曜。",
  image: `${BASE}/images/admin/salon-riv-1782197568767.jpg`,
  url: `${BASE}/salon/riv`,
  hasMap: "https://maps.google.com/?q=高知市南川添9-21",
  telephone: "088-884-5566",
  address: {
    "@type": "PostalAddress",
    streetAddress: "南川添9-21 フルールアミー3 2F",
    addressLocality: "高知市",
    addressRegion: "高知県",
    postalCode: "781-0082",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.57251447334136,
    longitude: 133.5586512753919,
  },
  areaServed: ["高知市", "高知県"],
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:30",
      closes: "18:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.65",
    reviewCount: "674",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "得意メニュー",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "髪質改善トリートメント" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "白髪ぼかしカラー" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "縮毛矯正" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ハイライト・艶カラー" } },
    ],
  },
  knowsAbout: ["髪質改善", "白髪ぼかし", "艶カラー", "ヘアカラー", "縮毛矯正", "似合わせカット"],
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://www.instagram.com/riv.kochi",
    "https://g.page/r/CdEFX3xXBBF7EAE",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP", url: BASE },
};

export const fleuramiSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${BASE}/salon/fleurami`,
  name: "fleurami",
  alternateName: ["フルールアミー", "fleur ami"],
  description:
    "高知県香南市の美容室。縮毛矯正・髪質改善・艶カラー・カットが得意。香南市野市町でくせ毛・うねりにお悩みの方に対応するヘアサロン。定休日：月曜・第1第3火曜。",
  image: `${BASE}/images/admin/salon-fleurami-1782197558743.jpg`,
  url: `${BASE}/salon/fleurami`,
  hasMap: "https://maps.google.com/?q=香南市野市町西野230",
  telephone: "0887-56-5566",
  address: {
    "@type": "PostalAddress",
    streetAddress: "野市町西野230",
    addressLocality: "香南市",
    addressRegion: "高知県",
    postalCode: "781-5232",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.57442497334058,
    longitude: 133.69426107539203,
  },
  areaServed: ["香南市", "高知県"],
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.67",
    reviewCount: "388",
    bestRating: "5",
    worstRating: "1",
  },
  knowsAbout: ["縮毛矯正", "髪質改善", "艶カラー", "ヘアカラー", "くせ毛矯正"],
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://www.instagram.com/fleurami_info",
    "https://g.page/r/CVY6rOf-UWbxEAE",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP", url: BASE },
};

export const raffineSalonSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${BASE}/salon/raffine`,
  name: "まつげとまゆげの専門店 Raffine【ラフィーネ】",
  alternateName: ["Raffine", "ラフィーネ", "Raffine高知"],
  description:
    "高知市はりまや橋のまつげ・眉毛専門サロン。まつげパーマ・ラッシュリフト・韓国束感まつエク・眉毛WAX・メンズ眉WAXに対応。高知市のアイラッシュサロン。",
  image: `${BASE}/images/admin/salon-raffine-1782206000346.JPG`,
  url: `${BASE}/salon/raffine`,
  hasMap: "https://maps.google.com/?q=高知市はりまや町1-4-8",
  telephone: "090-7120-5566",
  address: {
    "@type": "PostalAddress",
    streetAddress: "はりまや町1-4-8 TNはりまやビル3F",
    addressLocality: "高知市",
    addressRegion: "高知県",
    postalCode: "780-0822",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.56076797334597,
    longitude: 133.54073617539132,
  },
  areaServed: ["高知市", "高知県"],
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
      opens: "09:30",
      closes: "18:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:30",
      closes: "18:30",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.82",
    reviewCount: "200",
    bestRating: "5",
    worstRating: "1",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "得意メニュー",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "まつ毛パーマ（ラッシュリフト）" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "まつエク（フラットラッシュ・韓国束感）" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "眉毛WAX（メンズ対応）" } },
    ],
  },
  knowsAbout: ["まつげパーマ", "ラッシュリフト", "まつエク", "眉毛WAX", "まつ毛パーマ", "アイラッシュ"],
  sameAs: [
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://www.instagram.com/raffine0815",
    "https://g.page/r/CbD8dVZGgEeuEAE",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP", url: BASE },
};

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "高知市で髪質改善が得意な美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市の「Riv.by fleurami」は髪質改善を得意としています。ダメージを補修しながら扱いやすい髪質へと導くトリートメントメニューをご用意しています。大人女性の髪の悩みに丁寧に寄り添います。",
      },
    },
    {
      "@type": "Question",
      name: "香南市で縮毛矯正ができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "香南市の「fleurami」では縮毛矯正に対応しています。くせ毛・うねり毛でお悩みの方に、サラサラで扱いやすい仕上がりをご提供します。髪質改善との組み合わせも人気です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市ではりまや橋近くのアイラッシュサロンはどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋周辺の「Raffine（ラフィーネ）」がアイラッシュサロンです。住所は高知市はりまや町1-4-8 TNはりまやビル3Fです。電話番号は090-7120-5566。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でまつげパーマができるサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋周辺の「Raffine」でまつげパーマ（ラッシュリフト）をご提供しています。自まつげを活かした自然な仕上がりで、韓国風の束感まつげも対応可能です。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXは男性もできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Raffineではメンズ眉WAXにも対応しています。眉の形を整えることで顔全体の印象がスッキリします。初めての方もお気軽にご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "fleur GROUPはどこにありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleur GROUPは高知県内に3店舗展開しています。fleurami（香南市野市町西野230、電話0887-56-5566）、Riv.by fleurami（高知市南川添9-21、電話088-884-5566）、Raffine（高知市はりまや町1-4-8、電話090-7120-5566）です。",
      },
    },
  ],
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "fleur GROUP",
  url: "https://fleur-group.jp",
  description: "高知市・香南市で美容室・アイラッシュサロンを3店舗展開するfleur GROUP。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAX。",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://fleur-group.jp/blog/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export function salonFaqPageSchema(faqs: { q: string; a: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
