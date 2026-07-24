const BASE = "https://fleur-group.jp";

export const founderPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE}/#founder`,
  name: "今井 信人",
  alternateName: "今井信人",
  jobTitle: "代表取締役",
  worksFor: {
    "@type": "Organization",
    name: "fleur GROUP",
    url: BASE,
  },
  knowsAbout: ["美容室経営", "ヘアサロン", "アイラッシュサロン", "高知県美容業"],
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE}/#organization`,
  name: "fleur GROUP",
  alternateName: ["フルールグループ", "株式会社フルール・アミー", "株式会社フルール・ロータス"],
  url: BASE,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/icon.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE}/images/admin/hero-1782190629178.jpg`,
  description:
    "2006年設立。高知市・香南市で美容室2店舗（Riv. by fleurami・fleurami）とアイラッシュサロン（Raffine）を展開する美容グループ。髪質改善・白髪ぼかし・縮毛矯正・まつ毛パーマ・眉毛WAXを得意とし、大人女性を中心に高知県内で選ばれ続けている。高知市南川添・はりまや橋・香南市野市町に店舗あり。",
  slogan: "髪と目元で、なりたい自分へ。",
  foundingDate: "2006",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 13,
  },
  founder: {
    "@id": `${BASE}/#founder`,
    "@type": "Person",
    name: "今井 信人",
  },
  knowsAbout: [
    "髪質改善",
    "白髪ぼかし",
    "縮毛矯正",
    "まつげパーマ",
    "ラッシュリフト",
    "まつげエクステ",
    "眉毛WAX",
    "大人女性のヘアデザイン",
    "高知県の美容",
  ],
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
    { "@type": ["BeautySalon", "HealthAndBeautyBusiness"], "@id": `${BASE}/salon/raffine`, name: "Raffine" },
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "髪質改善トリートメント" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "白髪ぼかし・グレイカラー" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "縮毛矯正" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "まつげパーマ・ラッシュリフト" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "眉毛WAX" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "LEDまつげエクステ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "艶カラー・透明感カラー" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ヘッドスパ" } },
    ],
  },
};

export const rivSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${BASE}/salon/riv`,
  name: "Riv. by fleurami",
  alternateName: ["Riv.by fleurami", "リヴ バイ フルールアミー", "Riv. by fleur ami", "リヴ"],
  description:
    "高知市のヘアカラー・髪質改善専門の美容室。白髪ぼかし・艶カラー・縮毛矯正・大人女性向けの似合わせカットが得意。高知市南川添にあるヘアサロン。定休日：月曜・第1第3火曜。Googleクチコミ4.65（674件）。",
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
  areaServed: [
    { "@type": "City", name: "高知市", containedInPlace: { "@type": "State", name: "高知県" } },
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 33.57251447334136,
      longitude: 133.5586512753919,
    },
    geoRadius: "10000",
  },
  priceRange: "¥¥",
  currenciesAccepted: "JPY",
  paymentAccepted: "現金, クレジットカード, PayPay, LINE Pay",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:30",
      closes: "18:30",
    },
  ],
  specialOpeningHoursSpecification: [],
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "髪質改善トリートメント", description: "うねり・ダメージ・広がりを補修してサラサラのツヤ髪へ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "白髪ぼかしカラー", description: "ハイライトで白髪をなじませ、伸びても目立ちにくいグレイブレンドカラー" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "縮毛矯正", description: "くせ毛・うねりをサラサラのストレートへ。ダメージを抑えた自然な仕上がり" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "艶カラー・透明感カラー", description: "ツヤと透明感を引き出す似合わせカラー" } },
    ],
  },
  knowsAbout: ["髪質改善", "白髪ぼかし", "艶カラー", "ヘアカラー", "縮毛矯正", "似合わせカット", "大人女性ヘアデザイン", "グレイカラー"],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".salon-description", ".faq-answer"],
  },
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000634137/",
    "https://www.instagram.com/riv.kochi",
    "https://g.page/r/CdEFX3xXBBF7EAE",
  ],
  parentOrganization: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP", url: BASE },
};

export const fleuramiSalonSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": `${BASE}/salon/fleurami`,
  name: "fleurami",
  alternateName: ["フルールアミー", "fleur ami", "フルールアミー野市"],
  description:
    "高知県香南市野市町の美容室。縮毛矯正・髪質改善・艶カラー・カットが得意。無料駐車場7台完備。のいち駅から車で約4分。くせ毛・うねりにお悩みの方に対応するヘアサロン。定休日：月曜・第1第3火曜。Googleクチコミ4.67（388件）。",
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
  areaServed: [
    { "@type": "City", name: "香南市", containedInPlace: { "@type": "State", name: "高知県" } },
    { "@type": "AdministrativeArea", name: "野市町" },
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 33.57442497334058,
      longitude: 133.69426107539203,
    },
    geoRadius: "15000",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "無料駐車場", value: true },
    { "@type": "LocationFeatureSpecification", name: "駐車台数", value: "7台" },
  ],
  priceRange: "¥¥",
  currenciesAccepted: "JPY",
  paymentAccepted: "現金, クレジットカード, PayPay, LINE Pay",
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
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "得意メニュー",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "縮毛矯正", description: "くせ毛・うねりをサラサラのストレートへ。ダメージを抑えた自然な仕上がり" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "髪質改善トリートメント", description: "うねり・ダメージを補修してまとまりのあるツヤ髪へ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "艶カラー・透明感カラー" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "デザインカット" } },
    ],
  },
  knowsAbout: ["縮毛矯正", "髪質改善", "艶カラー", "ヘアカラー", "くせ毛矯正", "大人女性ヘア", "白髪ぼかし"],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".salon-description", ".faq-answer"],
  },
  sameAs: [
    "https://beauty.hotpepper.jp/slnH000528388/",
    "https://www.instagram.com/fleurami_info",
    "https://g.page/r/CVY6rOf-UWbxEAE",
  ],
  parentOrganization: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP", url: BASE },
};

export const raffineSalonSchema = {
  "@context": "https://schema.org",
  "@type": ["BeautySalon", "HealthAndBeautyBusiness"],
  "@id": `${BASE}/salon/raffine`,
  name: "まつげとまゆげの専門店 Raffine【ラフィーネ】",
  alternateName: ["Raffine", "ラフィーネ", "Raffine高知", "ラフィーネ高知", "まつげサロン Raffine"],
  description:
    "高知市はりまや橋のまつげ・眉毛専門サロン。まつげパーマ（パリジャンリフト）・ラッシュリフト・韓国束感まつエク・LEDエクステ・眉毛WAX・メンズ眉WAXに対応。全席半個室。Googleクチコミ4.82（200件以上）。高知市で口コミ評価が高いアイラッシュサロン。",
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
  areaServed: [
    { "@type": "City", name: "高知市", containedInPlace: { "@type": "State", name: "高知県" } },
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 33.56076797334597,
      longitude: 133.54073617539132,
    },
    geoRadius: "10000",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "半個室", value: true },
    { "@type": "LocationFeatureSpecification", name: "メンズ対応", value: true },
  ],
  priceRange: "¥¥",
  currenciesAccepted: "JPY",
  paymentAccepted: "現金, クレジットカード, PayPay",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "まつ毛パーマ・パリジャンリフト", description: "自まつげを根元から立ち上げ、ビューラー要らずのぱっちり目元に" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "ラッシュリフト", description: "シリコンパッドで根元から自然に立ち上げる次世代まつげパーマ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "韓国束感まつエク・フラットラッシュ", description: "韓国風の自然な束感デザイン" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "LEDまつげエクステ", description: "短時間装着・当日メイクOK・持ちに優れた次世代エクステ" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "眉毛WAX・アイブロウ（メンズ対応）", description: "黄金比デザインで顔印象をすっきり。メンズも対応" } },
    ],
  },
  knowsAbout: ["まつげパーマ", "パリジャンリフト", "ラッシュリフト", "まつエク", "LEDエクステ", "眉毛WAX", "まつ毛パーマ", "アイラッシュ", "まつげ専門サロン", "韓国束感まつげ", "フラットラッシュ"],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".salon-description", ".faq-answer"],
  },
  sameAs: [
    "https://beauty.hotpepper.jp/kr/slnH000767549/",
    "https://www.instagram.com/raffine0815",
    "https://g.page/r/CbD8dVZGgEeuEAE",
  ],
  parentOrganization: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "fleur GROUP", url: BASE },
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
        text: "高知市の「Riv. by fleurami（リヴ バイ フルールアミー）」は髪質改善を得意としています。高知市南川添9-21に位置し、ダメージを補修しながら扱いやすい髪質へ導くトリートメントメニューが人気です。Googleクチコミ4.65（674件）。電話：088-884-5566。",
      },
    },
    {
      "@type": "Question",
      name: "香南市・野市で縮毛矯正ができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "香南市野市町の「fleurami（フルールアミー）」では縮毛矯正に対応しています。住所：香南市野市町西野230。電話：0887-56-5566。くせ毛・うねりでお悩みの方にサラサラで扱いやすい仕上がりをご提供。無料駐車場7台完備。Googleクチコミ4.67（388件）。",
      },
    },
    {
      "@type": "Question",
      name: "高知市ではりまや橋近くのアイラッシュサロンはどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋周辺の「Raffine（ラフィーネ）」がアイラッシュサロンです。住所：高知市はりまや町1-4-8 TNはりまやビル3F。電話：090-7120-5566。まつげパーマ・まつエク・眉毛WAXに特化した専門店で、Googleクチコミ4.82（200件以上）の高評価サロン。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でまつげパーマができるサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋周辺の「Raffine（ラフィーネ）」でまつげパーマ（パリジャンリフト・ラッシュリフト）を提供しています。自まつげを活かした自然な仕上がり。持ちは約4〜6週間。全席半個室。",
      },
    },
    {
      "@type": "Question",
      name: "高知でおすすめの白髪ぼかしができる美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市の「Riv. by fleurami」と香南市の「fleurami」が白髪ぼかし・グレイカラーを得意としています。ハイライトを使って白髪をなじませ、伸びても目立ちにくい大人世代向けカラーデザインが人気です。",
      },
    },
    {
      "@type": "Question",
      name: "眉毛WAXは男性もできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋の「Raffine（ラフィーネ）」ではメンズ眉WAXに対応しています。黄金比に基づいたデザインで清潔感のある眉に仕上げます。まつげメニューとの同日施術も可能。",
      },
    },
    {
      "@type": "Question",
      name: "fleur GROUPはどこにありますか？店舗一覧を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleur GROUPは高知県内に3店舗展開しています。①fleurami（香南市野市町西野230、電話0887-56-5566）、②Riv. by fleurami（高知市南川添9-21 フルールアミー3 2F、電話088-884-5566）、③Raffine（高知市はりまや町1-4-8 TNはりまやビル3F、電話090-7120-5566）。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で韓国風ヘアスタイルやレイヤーカットができる美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」では韓国風スタイル・くびれヘア・レイヤーカットに対応しています。骨格・髪質に合わせた似合わせカットで、再現しやすいトレンドデザインをご提案します。",
      },
    },
    {
      "@type": "Question",
      name: "高知でLEDまつげエクステができるサロンはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋の「Raffine（ラフィーネ）」でLEDエクステを提供しています。短時間装着・当日メイク・入浴OK、持ちに優れた次世代まつげエクステです。初めての方もご相談ください。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で艶カラー・透明感カラーが得意な美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」が艶カラー・透明感カラーを得意としています。肌色や骨格に合わせた似合わせカラーで、上品な抜け感と透明感を演出します。",
      },
    },
    {
      "@type": "Question",
      name: "fleur GROUPの予約方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "各店舗ともホットペッパービューティーまたはLINEでご予約いただけます。Raffineはinstagram DMからも予約可能。Web予約ページ：https://fleur-group.jp/salon",
      },
    },
    {
      "@type": "Question",
      name: "高知市のRiv. by fleuramiの定休日と営業時間は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Riv. by fleuramiの営業時間は9:30〜18:30（最終受付17:00頃）。定休日は月曜・第1第3火曜です。住所：高知市南川添9-21 フルールアミー3 2F。",
      },
    },
    {
      "@type": "Question",
      name: "香南市fleuramiの定休日と営業時間は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleuramiの営業時間は9:00〜18:00（最終受付17:00頃）。定休日は月曜・第1第3火曜です。無料駐車場7台完備。住所：香南市野市町西野230。",
      },
    },
    {
      "@type": "Question",
      name: "高知市Raffineの定休日と営業時間は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Raffineの営業時間は9:30〜18:30。定休日は水曜です。住所：高知市はりまや町1-4-8 TNはりまやビル3F。全席半個室で完全予約制。",
      },
    },
    {
      "@type": "Question",
      name: "高知市で縮毛矯正が上手い美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市南川添の「Riv. by fleurami」と香南市野市の「fleurami」が縮毛矯正を得意としています。くせ毛・うねりの状態に合わせた薬剤選定で、ダメージを抑えた自然なストレートに仕上げます。",
      },
    },
    {
      "@type": "Question",
      name: "高知でヘッドスパができる美容室はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市の「Riv. by fleurami」と香南市の「fleurami」でヘッドスパを提供しています。頭皮クレンジング・マッサージで血行や頭皮環境を整えます。カラーやカットとの同日施術も可能です。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でまつげエクステ（マツエク）ができるサロンは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋の「Raffine（ラフィーネ）」でまつげエクステ（マツエク）を提供しています。韓国束感・フラットラッシュ・LEDエクステに対応。デザインのカウンセリングが丁寧と好評。",
      },
    },
    {
      "@type": "Question",
      name: "高知でボブや大人ボブが得意な美容室はどこですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市）」と「fleurami（香南市）」が骨格に合わせた似合わせボブ・大人ボブを得意としています。乾かすだけでまとまる再現性の高いデザインが好評です。40代・50代の大人女性に人気。",
      },
    },
    {
      "@type": "Question",
      name: "はりまや橋周辺でまつげパーマができる場所は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋から徒歩圏内の「Raffine（ラフィーネ）」でまつげパーマ（ラッシュリフト・パリジャンリフト）を提供しています。住所：高知市はりまや町1-4-8 TNはりまやビル3F。電話：090-7120-5566。",
      },
    },
    {
      "@type": "Question",
      name: "高知でパリジェンヌ・パリジャンリフトができるサロンは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋の「Raffine（ラフィーネ）」でパリジャンリフト（パリジェンヌラッシュリフト）を提供しています。根元から立ち上がるナチュラルカールで、まつげが長く見える人気メニューです。",
      },
    },
    {
      "@type": "Question",
      name: "高知でフラットラッシュ・ダブルフラットができるまつげサロンは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高知市はりまや橋の「Raffine（ラフィーネ）」でフラットラッシュ・ダブルフラット（韓国束感まつエク）を提供しています。軽い装着感で自然なボリュームを演出します。",
      },
    },
    {
      "@type": "Question",
      name: "高知市でインナーカラーやブリーチが得意な美容室は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市）」と「fleurami（香南市）」でインナーカラー・ブリーチ・ハイトーンカラーに対応しています。髪の状態を見極めながらダメージに配慮した施術を行います。",
      },
    },
    {
      "@type": "Question",
      name: "高知 美容室のクチコミ・評判は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "fleur GROUPの各店舗はGoogleクチコミで高評価を獲得しています。Riv. by fleurami：4.65（674件）、fleurami：4.67（388件）、Raffine：4.82（200件以上）。カウンセリングの丁寧さと仕上がりの満足度で選ばれています。",
      },
    },
    {
      "@type": "Question",
      name: "高知でメンズ美容室・メンズカットができるサロンは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「Riv. by fleurami（高知市）」と「fleurami（香南市）」でメンズカット・メンズカラー・メンズツイストパーマに対応しています。骨格・ライフスタイルに合わせた提案が得意です。",
      },
    },
    {
      "@type": "Question",
      name: "高知県内で複数店舗を展開している美容グループはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「fleur GROUP（フルールグループ）」が高知市・香南市で美容室2店舗（Riv. by fleurami・fleurami）とアイラッシュサロン1店舗（Raffine）を展開しています。2006年設立。代表：今井信人。公式サイト：https://fleur-group.jp",
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
