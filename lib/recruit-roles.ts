// 職種別の求人ランディングページ用データ。
// 「高知市 美容師 求人」「香南市 美容師 求人」「高知市 アイリスト 求人」「美容師 アシスタント 求人」
// などのロングテール求人検索＋Google しごと検索(JobPosting)を狙う。
// /recruit/[role] を生成する。

export interface SalaryRow {
  label: string;
  amount: string;
  note?: string;
}

export interface CareerStep {
  step: string;
  title: string;
  text: string;
}

export interface RoleLocation {
  locality: string;   // 高知市 / 香南市
  salonName: string;  // 店舗名
  streetAddress: string;
  postalCode: string;
}

export interface RoleDef {
  slug: string;
  title: string;          // 美容師（スタイリスト）
  world: "hair" | "eyelash";
  occupation: string;     // JobPosting occupationalCategory
  metaTitle: string;
  metaDescription: string;
  areas: string[];        // 高知市 / 香南市
  locations: RoleLocation[];
  lead: string;
  tasks: string[];        // 仕事内容
  forWhom: string[];      // こんな方を歓迎
  salary: SalaryRow[];    // 給与（見える化）
  salaryRange: { min: number; max: number };
  conditions: { label: string; value: string }[]; // 待遇（見える化）
  career: CareerStep[];   // キャリアパス（見える化）
  faq: { q: string; a: string }[];
}

const LOC_FLEURAMI: RoleLocation = { locality: "香南市", salonName: "fleurami", streetAddress: "野市町西野230", postalCode: "781-5233" };
const LOC_RIV: RoleLocation = { locality: "高知市", salonName: "Riv.by fleurami", streetAddress: "南川添9-21 フルールアミー3 2F", postalCode: "780-0926" };
const LOC_RAFFINE: RoleLocation = { locality: "高知市", salonName: "Raffine", streetAddress: "はりまや町1-4-8 TNはりまやビル3F", postalCode: "780-0822" };

const COMMON_CONDITIONS = [
  { label: "勤務時間", value: "シフト制（実働時間は面談時にご相談）" },
  { label: "有給・休暇", value: "有給休暇／産休・育休制度あり" },
  { label: "社会保険", value: "社会保険完備" },
  { label: "手当・福利厚生", value: "技術研修あり／外部講習支援／アシスタントからの育成制度" },
];

export const ROLES: RoleDef[] = [
  {
    slug: "stylist",
    title: "美容師（スタイリスト）",
    world: "hair",
    occupation: "美容師",
    metaTitle: "高知市・香南市の美容師（スタイリスト）求人｜fleur GROUP",
    metaDescription:
      "高知市・香南市で美容師（スタイリスト）を募集。髪質改善・白髪ぼかし・艶カラーが学べる地域密着サロン。月給23万円＋歩合、完全週休2日制・社会保険完備。香南市fleurami・高知市Riv.by fleurami。転職・Uターン・ブランクOK。",
    areas: ["高知市", "香南市"],
    locations: [LOC_FLEURAMI, LOC_RIV],
    lead: "高知市・香南市で美容師（スタイリスト）を募集しています。fleur GROUPは髪質改善・白髪ぼかし・艶カラーを強みとする大人女性向けのサロン。指名や単価を伸ばしやすい技術と、長く働ける環境を用意しています。",
    tasks: [
      "カウンセリング〜カット・カラー・髪質改善などの施術",
      "髪質改善・白髪ぼかし・艶カラーなどの得意メニュー提案",
      "リピート・指名につながる接客とアフターフォロー",
    ],
    forWhom: [
      "髪質改善やカラーの技術を伸ばしたい方",
      "大人女性の悩みに寄り添う接客がしたい方",
      "高知でUターン・Iターン就職を考えている方",
      "ブランクがあるが復帰したい方",
    ],
    salary: [
      { label: "スタイリスト", amount: "月給 23万円〜 ＋歩合", note: "経験・実績により優遇" },
    ],
    salaryRange: { min: 230000, max: 350000 },
    conditions: [
      { label: "休日", value: "毎週月曜・第1,3火曜＋シフト休（完全週休2日制）" },
      ...COMMON_CONDITIONS,
      { label: "勤務地", value: "香南市（fleurami）／高知市（Riv.by fleurami）" },
    ],
    career: [
      { step: "STEP 1", title: "入社・オリエン", text: "サロンの方針・メニュー・接客の考え方を共有。既存技術の確認から始めます。" },
      { step: "STEP 2", title: "デビュー・指名づくり", text: "得意メニューを軸に指名・リピートを獲得。単価アップの提案力を磨きます。" },
      { step: "STEP 3", title: "トップスタイリスト", text: "髪質改善・白髪ぼかしなどの専門性を高め、売上・指名を伸ばします。" },
      { step: "STEP 4", title: "教育・マネジメント", text: "後輩育成や店舗づくりに関わる道も。働き方に合わせてキャリアを選べます。" },
    ],
    faq: [
      { q: "ブランクがあっても応募できますか？", a: "はい。技術研修やフォロー体制があるため、ブランクのある方の復帰も歓迎しています。まずはサロン見学だけでも大丈夫です。" },
      { q: "高知市と香南市どちらの店舗で働けますか？", a: "ご希望や通勤を考慮してご相談します。高知市はRiv.by fleurami、香南市はfleuramiが勤務地です。" },
    ],
  },
  {
    slug: "assistant",
    title: "美容師アシスタント",
    world: "hair",
    occupation: "美容師アシスタント",
    metaTitle: "高知市・香南市の美容師アシスタント求人（未経験・新卒OK）｜fleur GROUP",
    metaDescription:
      "高知市・香南市で美容師アシスタントを募集。アシスタントからしっかり育成、技術研修あり。月給22万円・社会保険完備・完全週休2日制。美容学生・新卒・未経験歓迎。香南市fleurami・高知市Riv.by fleurami。",
    areas: ["高知市", "香南市"],
    locations: [LOC_FLEURAMI, LOC_RIV],
    lead: "高知市・香南市で美容師アシスタントを募集しています。fleur GROUPはアシスタントからの育成体制を整え、無理なくスタイリストデビューを目指せる環境。美容学生・新卒・未経験の方も歓迎です。",
    tasks: [
      "シャンプー・ブロー・カラー塗布などの施術アシスト",
      "受付・ご案内・サロンワーク全般",
      "練習・研修を通じた技術習得",
    ],
    forWhom: [
      "美容学生・新卒で高知で働きたい方",
      "未経験から美容師を目指したい方",
      "段階的に技術を身につけたい方",
      "人と接することが好きな方",
    ],
    salary: [
      { label: "アシスタント", amount: "月給 22万円", note: "技術習得に応じてスタイリストへ昇給" },
    ],
    salaryRange: { min: 220000, max: 230000 },
    conditions: [
      { label: "休日", value: "毎週月曜・第1,3火曜＋シフト休（完全週休2日制）" },
      ...COMMON_CONDITIONS,
      { label: "勤務地", value: "香南市（fleurami）／高知市（Riv.by fleurami）" },
    ],
    career: [
      { step: "STEP 1", title: "入社・基礎習得", text: "シャンプーやサロンワークから。接客の基本と土台を身につけます。" },
      { step: "STEP 2", title: "技術研修", text: "カラー・パーマ・カットの研修と練習を重ね、デビューに向け段階的に習得。" },
      { step: "STEP 3", title: "スタイリストデビュー", text: "技術チェックを経てデビュー。指名・リピートづくりを始めます。" },
      { step: "STEP 4", title: "トップスタイリストへ", text: "得意分野を伸ばし、単価・指名を高めていきます。" },
    ],
    faq: [
      { q: "未経験・美容学生でも応募できますか？", a: "はい。アシスタントからの育成制度があるため、未経験・新卒・美容学生の方も歓迎しています。" },
      { q: "どのくらいでスタイリストになれますか？", a: "個人差はありますが、研修と練習を重ねながら段階的にデビューを目指します。一人ひとりのペースに合わせてサポートします。" },
    ],
  },
  {
    slug: "eyelist",
    title: "アイリスト",
    world: "eyelash",
    occupation: "アイリスト",
    metaTitle: "高知市のアイリスト求人（未経験歓迎）｜まつげサロンRaffine・fleur GROUP",
    metaDescription:
      "高知市はりまや橋のまつげサロンRaffineでアイリストを募集。まつげパーマ・LEDエクステ・眉WAX。全席半個室・20代女性中心。経験者月給22万円＋歩合、未経験月給20万円。社会保険完備。高知市 アイリスト求人。",
    areas: ["高知市"],
    locations: [LOC_RAFFINE],
    lead: "高知市はりまや橋のまつげ・まゆげサロンRaffineでアイリストを募集しています。まつげパーマ・LEDエクステ・韓国束感まつげ・眉WAXなどトレンド技術を扱う、全席半個室・女性専用サロンです。",
    tasks: [
      "まつげパーマ・マツエク・LEDエクステの施術",
      "眉毛WAX・アイブロウスタイリング",
      "カウンセリングとデザイン提案・リピートづくり",
    ],
    forWhom: [
      "トレンドのまつげ・眉技術を学びたい方",
      "高知市内で通いやすい職場を探している方",
      "未経験からアイリストを目指したい方",
      "半個室で落ち着いて施術したい方",
    ],
    salary: [
      { label: "アイリスト（経験者）", amount: "月給 22万円〜 ＋歩合" },
      { label: "アイリスト（未経験）", amount: "月給 20万円〜", note: "研修からスタート" },
    ],
    salaryRange: { min: 200000, max: 300000 },
    conditions: [
      { label: "休日", value: "4週8休制＋シフト休" },
      ...COMMON_CONDITIONS,
      { label: "勤務地", value: "高知市（Raffine・はりまや橋徒歩3分）" },
    ],
    career: [
      { step: "STEP 1", title: "入社・基礎研修", text: "サロンの衛生・接客・デザインの考え方を共有。未経験者は技術研修から。" },
      { step: "STEP 2", title: "デビュー", text: "まつげパーマ・エクステの施術デビュー。お客様のデザイン提案を担当します。" },
      { step: "STEP 3", title: "指名アイリスト", text: "束感・韓国デザインなど得意を磨き、指名・リピートを伸ばします。" },
      { step: "STEP 4", title: "教育・店舗づくり", text: "後輩育成や新メニュー導入に関わる道もあります。" },
    ],
    faq: [
      { q: "未経験でもアイリストになれますか？", a: "はい。未経験の方は研修からスタートできます。まつげパーマ・エクステの技術を段階的に習得していきます。" },
      { q: "Raffineはどこにありますか？", a: "高知市はりまや町（はりまや橋から徒歩約3分）です。全席半個室・女性専用のまつげ・まゆげサロンです。" },
    ],
  },
];

export function getRole(slug: string): RoleDef | undefined {
  return ROLES.find((r) => r.slug === slug);
}

export function getAllRoleSlugs(): string[] {
  return ROLES.map((r) => r.slug);
}
