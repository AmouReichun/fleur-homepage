const BASE = "https://fleur-group.jp";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "fleur GROUP",
  url: BASE,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/icon.png`,
    width: 512,
    height: 512,
  },
  description:
    "高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）、アイラッシュサロン1店舗（Raffine）を展開するグループ。",
  founder: {
    "@type": "Person",
    name: "今井 信人",
  },
  areaServed: {
    "@type": "State",
    name: "高知県",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "088-884-5566",
      contactType: "customer service",
      areaServed: "JP",
      availableLanguage: "Japanese",
      name: "Riv.by fleurami",
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
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://www.instagram.com/fleurami_info",
    "https://www.instagram.com/riv.kochi",
    "https://www.instagram.com/raffine0815",
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
  name: "Riv.by fleurami",
  alternateName: "リヴ バイ フルールアミー",
  description:
    "高知市の美容室。髪質改善・白髪ぼかし・艶カラー・大人女性向けの似合わせカットが得意。",
  image: `${BASE}/images/admin/salon-riv-1782197568767.jpg`,
  url: `${BASE}/salon/riv`,
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
  areaServed: "高知市",
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
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
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://www.instagram.com/riv.kochi",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP" },
};

export const fleuramiSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "fleurami",
  alternateName: "フルールアミー",
  description:
    "香南市の美容室。縮毛矯正・髪質改善・艶カラー・カットが得意。",
  image: `${BASE}/images/admin/salon-fleurami-1782197558743.jpg`,
  url: `${BASE}/salon/fleurami`,
  telephone: "0887-56-5566",
  address: {
    "@type": "PostalAddress",
    streetAddress: "野市町西野230",
    addressLocality: "香南市",
    addressRegion: "高知県",
    postalCode: "781-5222",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 33.57442497334058,
    longitude: 133.69426107539203,
  },
  areaServed: "香南市",
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://www.instagram.com/fleurami_info",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP" },
};

export const raffineSalonSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Raffine",
  alternateName: "ラフィーネ",
  description:
    "高知市はりまや橋周辺のアイラッシュサロン。ラッシュリフト・まつげパーマ・韓国束感まつげ・眉毛WAX・メンズ眉WAXに対応。",
  image: `${BASE}/images/admin/salon-raffine-1782206000346.JPG`,
  url: `${BASE}/salon/raffine`,
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
  areaServed: "高知市",
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
  sameAs: [
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://www.instagram.com/raffine0815",
  ],
  parentOrganization: { "@type": "Organization", name: "fleur GROUP" },
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
