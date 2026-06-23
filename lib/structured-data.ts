export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "fleurami GROUP",
  url: "https://fleurami-group.jp",
  description:
    "高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）、アイラッシュサロン1店舗（Raffine）を展開するグループ。",
  founder: {
    "@type": "Person",
    name: "今井 信人",
  },
  areaServed: ["高知市", "香南市"],
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://fleurami-group-blog.com",
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
  url: "https://fleurami-group.jp/salon/riv",
  address: {
    "@type": "PostalAddress",
    addressRegion: "高知県",
    addressLocality: "高知市",
    addressCountry: "JP",
  },
  areaServed: "高知市",
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://beauty.hotpepper.jp/slnH000634137/"],
  parentOrganization: { "@type": "Organization", name: "fleurami GROUP" },
};

export const fleuramiSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "fleurami",
  alternateName: "フルールアミー",
  description:
    "香南市の美容室。髪質改善・縮毛矯正・艶カラー・カラーカットが得意。",
  url: "https://fleurami-group.jp/salon/fleurami",
  address: {
    "@type": "PostalAddress",
    streetAddress: "野市町西野230",
    addressRegion: "高知県",
    addressLocality: "香南市",
    postalCode: "781-5222",
    addressCountry: "JP",
  },
  areaServed: "香南市",
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://beauty.hotpepper.jp/slnH000528388/"],
  parentOrganization: { "@type": "Organization", name: "fleurami GROUP" },
};

export const raffineSalonSchema = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Raffine",
  alternateName: "ラフィーネ",
  description:
    "高知市はりまや橋周辺のアイラッシュサロン。ラッシュリフト・まつげパーマ・韓国束感まつげ・眉毛WAX・メンズ眉WAXに対応。",
  url: "https://fleurami-group.jp/salon/raffine",
  address: {
    "@type": "PostalAddress",
    addressRegion: "高知県",
    addressLocality: "高知市",
    addressCountry: "JP",
  },
  areaServed: "高知市",
  priceRange: "¥¥",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://beauty.hotpepper.jp/kr/slnH000767549/"],
  parentOrganization: { "@type": "Organization", name: "fleurami GROUP" },
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
      name: "fleurami GROUPはどこにありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleurami GROUPは高知県内に3店舗展開しています。fleurami（香南市野市町西野230）、Riv.by fleurami（高知市）、Raffine（高知市はりまや橋周辺）です。",
      },
    },
    {
      "@type": "Question",
      name: "fleurami GROUPの代表者は誰ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleurami GROUPの代表は今井 信人です。株式会社フルール・アミー（2006年設立）と株式会社フルール・ロータス（2025年設立）の2法人でグループを運営しています。",
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
