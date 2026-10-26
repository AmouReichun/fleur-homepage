// LINE誘導LP（/lp）のコンテンツ型と初期値。
// データは data/content.json の "lp" キーに { draft, published } で保存し、
// 管理画面（/admin/lp）で下書き保存 → プレビュー → 公開 の順に反映する。
// "lp" キーが未作成の間は下の DEFAULT_LP を表示する（content.json を事前に書き換えないため）。
//
// ※ 料金・実績・口コミは「確認済みの事実」だけを入れること。
//    料金は data/content.json の menus（既存メニュー表）から転記。未確認のものは空欄にし、
//    LP側では「料金はLINEでご案内」と表示する。
import type { SiteContent } from "./content";

export type LpSalonKey = "fleurami" | "riv";
export const LP_SALON_KEYS: LpSalonKey[] = ["fleurami", "riv"];

export type LpGalleryCategory = "before-after" | "kaizen" | "shiraga" | "cut" | "color";

export const LP_GALLERY_CATEGORIES: { key: LpGalleryCategory; label: string }[] = [
  { key: "before-after", label: "Before / After" },
  { key: "kaizen", label: "髪質改善" },
  { key: "shiraga", label: "白髪ぼかし" },
  { key: "cut", label: "カットスタイル" },
  { key: "color", label: "その他カラー" },
];

export interface LpImage {
  src: string;
  alt: string;
}

export interface LpGalleryItem {
  id: string;
  category: LpGalleryCategory;
  title: string;
  /** 紐付けるおすすめメニューの key（LpMenu.key）。空ならメニュー未指定 */
  menuKey: string;
  /** 施術メニュー名（表示用の自由入力） */
  menuLabel: string;
  salon: LpSalonKey | "";
  description: string;
  /** 1枚目がメイン画像。Before/After は [Before, After] の順 */
  images: LpImage[];
  hidden?: boolean;
}

export interface LpMenu {
  key: string;
  name: string;
  catch: string;
  target: string;
  features: string[];
  /** 確認済みの料金のみ。空欄なら「料金はLINEでご案内します」と表示 */
  price: string;
  priceNote: string;
  duration: string;
  image: LpImage;
  ctaLabel: string;
}

export interface LpConcern {
  text: string;
  menuKey: string;
}

export interface LpReason {
  title: string;
  text: string;
}

export interface LpReview {
  id: string;
  body: string;
  /** 例: 「30代・女性」など本人が了承した範囲の属性 */
  attribute: string;
  menu: string;
  salon: LpSalonKey | "";
  /** 例: 「ホットペッパービューティー」「店頭アンケート」 */
  source: string;
  /** 掲載許可を得ているか。true のものだけ公開ページに表示する */
  permission: boolean;
  date: string;
}

export interface LpStep {
  title: string;
  text: string;
}

export interface LpFaq {
  q: string;
  a: string;
}

export interface LpContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: LpImage;
    /** スマホ用に別画像を使う場合（空ならPCと共通） */
    imageMobile: string;
    ctaLabel: string;
    ctaNote: string;
  };
  concerns: { heading: string; lead: string; items: LpConcern[] };
  menus: { heading: string; lead: string; items: LpMenu[] };
  gallery: { heading: string; lead: string; ctaLabel: string; items: LpGalleryItem[] };
  reasons: { heading: string; items: LpReason[] };
  reviews: { heading: string; note: string; items: LpReview[] };
  steps: { heading: string; lead: string; items: LpStep[] };
  faq: { heading: string; items: LpFaq[] };
  final: { title: string; text: string; ctaLabel: string; image: LpImage };
  /** 店舗ごとの公式LINE URL（空なら店舗情報の lineUrl を使用） */
  line: Record<LpSalonKey, string>;
  stickyCtaLabel: string;
  seo: { title: string; description: string; ogImage: string };
  /** A/Bテスト（将来用）: enabled のとき訪問者を A/B に振り分け、B にはこの文言を表示する */
  experiment: { enabled: boolean; id: string; heroTitleB: string; heroSubtitleB: string; ctaLabelB: string };
}

export interface LpStore {
  draft: LpContent;
  published: LpContent | null;
  draftUpdatedAt?: string;
  publishedAt?: string;
}

const img = (src: string, alt: string): LpImage => ({ src, alt });

export const DEFAULT_LP: LpContent = {
  hero: {
    eyebrow: "fleurami ／ Riv. by fleurami",
    title: "あなたらしい美しさを、\nもっと自由に。",
    subtitle: "髪質も、似合うスタイルも、一人ひとり違うから。\nあなたに寄り添うヘアデザインを。",
    image: img(
      "https://0oxripuo8b9stzsz.public.blob.vercel-storage.com/admin/hero-1790487252859.png",
      "柔らかなウェーブのロングヘアの女性"
    ),
    imageMobile: "",
    ctaLabel: "公式LINEで相談・予約する",
    ctaNote: "髪のお悩み相談だけでもお気軽に",
  },
  concerns: {
    heading: "こんなお悩み、ありませんか？",
    lead: "毎日の小さな「気になる」を、髪質と暮らしに合わせたメニューで整えます。",
    items: [
      { text: "髪の広がりやパサつきが気になる", menuKey: "kaizen" },
      { text: "白髪を自然に、おしゃれに見せたい", menuKey: "shiraga" },
      { text: "自分に似合う髪型がわからない", menuKey: "cut" },
      { text: "毎朝のスタイリングをもっと楽にしたい", menuKey: "cut" },
    ],
  },
  menus: {
    heading: "おすすめメニュー",
    lead: "迷ったら、まずはお悩みをLINEで送ってください。髪の状態に合わせてご提案します。",
    items: [
      {
        key: "kaizen",
        name: "髪質改善トリートメント",
        catch: "艶とまとまりを、毎日の手触りに。",
        target: "広がり・パサつき・うねりが気になる方、艶のある髪を目指したい方に",
        features: [
          "髪の状態を見て、GM（グローバルミルボン）プレミアム／サブリミックトリートメントからご提案",
          "クセが強い場合は縮毛矯正との違いもご説明します",
        ],
        price: "¥7,000",
        priceNote: "髪質改善トリートメント単品の料金です。カット・カラーとの組み合わせはLINEでご相談ください。",
        duration: "90〜120分",
        image: img("/images/instagram/riv/18081614006709065.jpg", "髪質改善トリートメント後の艶のあるストレートロング"),
        ctaLabel: "LINEで髪のお悩みを相談",
      },
      {
        key: "shiraga",
        name: "白髪ぼかしカラー",
        catch: "白髪を隠すより、なじませて楽しむ。",
        target: "白髪染めの「伸びてきた境目」が気になる方、明るさも楽しみたい方に",
        features: [
          "ハイライトなどで白髪を自然になじませる、大人のためのカラーデザイン",
          "髪の明るさや白髪の量に合わせて、色味と入れ方を相談しながら決めます",
        ],
        price: "",
        priceNote: "白髪の量・髪の長さ・ハイライトの量によって変わるため、LINEで写真を送っていただくとご案内がスムーズです。",
        duration: "120〜150分",
        image: img("/images/instagram/fleurami/18098202635512273.webp", "白髪ぼかしカラーで仕上げた艶のあるショートボブ"),
        ctaLabel: "LINEでカラーを相談",
      },
      {
        key: "cut",
        name: "似合わせ科学カット",
        catch: "骨格・髪質・暮らしに合う、扱いやすい形へ。",
        target: "似合う髪型がわからない方、朝のスタイリングを楽にしたい方に",
        features: [
          "骨格や髪質、クセ、普段のスタイリング時間をうかがってからデザインをご提案",
          "乾かすだけでまとまりやすいように、自宅での扱いやすさまで考えてカット",
        ],
        price: "¥4,700〜",
        priceNote: "高校生 ¥4,000〜／中学生以下 ¥3,850〜",
        duration: "60〜90分",
        image: img("/images/uploads/fleurami/fleurami-mv6epb2n.webp", "似合わせカットで仕上げた柔らかいレイヤースタイル"),
        ctaLabel: "LINEでヘアスタイルを相談",
      },
    ],
  },
  gallery: {
    heading: "スタイル・施術事例",
    lead: "実際にご来店いただいたお客様の仕上がりです。気になるスタイルは、そのままLINEでご相談いただけます。",
    ctaLabel: "このスタイルをLINEで相談",
    items: [
      {
        id: "g-kaizen-1",
        category: "kaizen",
        title: "艶ストレートロング",
        menuKey: "kaizen",
        menuLabel: "髪質改善トリートメント",
        salon: "riv",
        description: "広がりを抑え、毛先まで艶のあるロングヘアに。",
        images: [img("/images/instagram/riv/18081614006709065.jpg", "髪質改善で艶の出たストレートロング")],
      },
      {
        id: "g-kaizen-2",
        category: "kaizen",
        title: "おさまりの良い短めボブ",
        menuKey: "kaizen",
        menuLabel: "髪質改善トリートメント",
        salon: "fleurami",
        description: "広がりやすい短めボブのおさまりを整えた事例です。",
        images: [img("/images/instagram/fleurami/17958234065938021.jpg", "髪質改善で広がりを抑えた短めボブ")],
      },
      {
        id: "g-shiraga-1",
        category: "shiraga",
        title: "白髪ぼかしの艶ショートボブ",
        menuKey: "shiraga",
        menuLabel: "白髪ぼかしカラー",
        salon: "fleurami",
        description: "白髪をなじませながら、深みのある色味で艶感を。",
        images: [img("/images/instagram/fleurami/18098202635512273.webp", "白髪ぼかしカラーのショートボブ")],
      },
      {
        id: "g-shiraga-2",
        category: "shiraga",
        title: "白髪になじむ艶カラー",
        menuKey: "shiraga",
        menuLabel: "白髪ぼかしカラー",
        salon: "riv",
        description: "白髪ぼかしと艶カラー、どちらが合うかを相談しながら決めた事例です。",
        images: [img("/images/instagram/riv/18133196071640573.webp", "白髪になじむ艶カラー")],
      },
      {
        id: "g-cut-1",
        category: "cut",
        title: "空気感のあるロングレイヤー",
        menuKey: "cut",
        menuLabel: "似合わせ科学カット",
        salon: "fleurami",
        description: "レイヤーで動きを出し、乾かすだけでまとまりやすく。",
        images: [img("/images/uploads/fleurami/fleurami-mv6epb2n.webp", "空気感のあるロングレイヤー")],
      },
      {
        id: "g-cut-2",
        category: "cut",
        title: "大人のレイヤーボブ",
        menuKey: "cut",
        menuLabel: "似合わせ科学カット",
        salon: "riv",
        description: "骨格に合わせてレイヤーの位置を調整したボブスタイル。",
        images: [img("/images/uploads/riv/riv-mv6dwthr.webp", "大人のレイヤーボブ")],
      },
      {
        id: "g-color-1",
        category: "color",
        title: "透明感のあるベージュカラー",
        menuKey: "",
        menuLabel: "カラー",
        salon: "fleurami",
        description: "ベージュ系で柔らかい透明感を出したカラーです。",
        images: [img("/images/uploads/fleurami/fleurami-mv7psb9v.webp", "透明感のあるベージュカラー")],
      },
      {
        id: "g-color-2",
        category: "color",
        title: "ホワイトベージュのトリプルカラー",
        menuKey: "",
        menuLabel: "カラー",
        salon: "riv",
        description: "重ねたカラーで、明るさと透明感を両立したデザイン。",
        images: [img("/images/uploads/riv/riv-mv0f9o72.webp", "ホワイトベージュのトリプルカラー")],
      },
    ],
  },
  reasons: {
    heading: "fleur GROUPが大切にしていること",
    items: [
      {
        title: "髪質と暮らしをうかがうカウンセリング",
        text: "髪のクセやダメージ、普段のスタイリング時間までうかがってから、施術内容をご提案します。",
      },
      {
        title: "髪の状態に合わせて選べるケア",
        text: "髪質改善はGM（グローバルミルボン）プレミアムやサブリミックなど複数のメニューから、髪の状態に合うものを選びます。",
      },
      {
        title: "白髪も楽しむ、大人のカラーデザイン",
        text: "白髪を隠すだけでなく、ハイライトなどでなじませる白髪ぼかしにも対応しています。",
      },
      {
        title: "香南市・高知市の2店舗、駐車場あり",
        text: "香南市野市町の fleurami、高知市南川添の Riv. by fleurami。どちらも駐車場があり、お車でも通いやすい立地です。",
      },
    ],
  },
  reviews: {
    heading: "お客様の声",
    note: "掲載の許可をいただいたお客様の声のみ掲載しています。",
    items: [],
  },
  steps: {
    heading: "LINEでのご予約の流れ",
    lead: "お友だち追加は無料です。ご相談だけでもお気軽にどうぞ。",
    items: [
      { title: "公式LINEを開く", text: "ご希望の店舗を選んで、公式LINEを開きます。" },
      { title: "気になるメニューや希望日時を相談", text: "お悩みや気になるメニュー、ご希望の日時をトークで送ってください。髪の写真があるとご提案がスムーズです。" },
      { title: "予約内容を確認してご来店", text: "スタッフからのご案内で予約内容をご確認いただき、当日ご来店ください。" },
    ],
  },
  faq: {
    heading: "よくあるご質問",
    items: [
      {
        q: "料金はいくらくらいかかりますか？",
        a: "主な料金は、似合わせ科学カット ¥4,700〜、髪質改善トリートメント（GMプレミアム／サブリミック）¥7,000、カラー ¥7,000〜です。髪の長さによって追加料金がかかるメニューがあります。正確な金額は髪の状態によって変わるため、LINEでご相談ください。",
      },
      {
        q: "施術にはどのくらい時間がかかりますか？",
        a: "目安は、カット 60〜90分、髪質改善トリートメント 90〜120分、白髪ぼかし 120〜150分です。髪の長さや組み合わせるメニューによって前後します。",
      },
      {
        q: "どのメニューを選べばいいかわかりません。",
        a: "「広がりが気になる」「白髪が目立ってきた」など、今のお悩みをそのままLINEで送ってください。髪の写真を添えていただくと、合いそうなメニューをご提案しやすくなります。",
      },
      {
        q: "予約はLINE以外でもできますか？",
        a: "はい。公式LINEのほか、ホットペッパービューティーや各店舗のWeb予約、お電話でもご予約いただけます。",
      },
      {
        q: "白髪ぼかしと白髪染めは何が違いますか？",
        a: "白髪染めは白髪をしっかり染めて隠す方法、白髪ぼかしはハイライトなどで白髪を周りの髪になじませる方法です。伸びてきたときの境目が目立ちにくいのが白髪ぼかしの特徴です。どちらが合うかは、白髪の量やなりたい雰囲気によって変わります。",
      },
      {
        q: "駐車場はありますか？",
        a: "fleurami（香南市）は無料駐車場7台（先着順）、Riv. by fleurami（高知市）は駐車場5台（先着順）で、近くにコインパーキング（徒歩3分）もあります。",
      },
      {
        q: "営業時間と定休日を教えてください。",
        a: "fleurami は 9:00〜18:00、Riv. by fleurami は 9:30〜18:30 です。定休日はどちらも月曜日・第1第3火曜日です。",
      },
    ],
  },
  final: {
    title: "次のヘアスタイルを、\nもっと楽しみに。",
    text: "髪のお悩みやメニュー選びも、まずはLINEからお気軽にご相談ください。",
    ctaLabel: "公式LINEで相談・予約する",
    image: img(
      "https://0oxripuo8b9stzsz.public.blob.vercel-storage.com/admin/hero-1790486831979.png",
      "艶のあるショートヘアの女性"
    ),
  },
  line: { fleurami: "", riv: "" },
  stickyCtaLabel: "LINEで相談・予約",
  seo: {
    title: "髪質改善・白髪ぼかし・似合わせカット｜高知市・香南市の美容室 fleurami／Riv. by fleurami",
    description:
      "高知県香南市の fleurami、高知市の Riv. by fleurami。髪の広がり・白髪・似合う髪型のお悩みに、髪質改善トリートメント・白髪ぼかしカラー・似合わせ科学カットでお応えします。ご相談・ご予約は公式LINEから。",
    ogImage: "https://0oxripuo8b9stzsz.public.blob.vercel-storage.com/admin/hero-1790487252859.png",
  },
  experiment: { enabled: false, id: "hero-copy-1", heroTitleB: "", heroSubtitleB: "", ctaLabelB: "" },
};

/** content.json に lp キーが無い場合でも LP を表示できるよう、既定値で補完する */
export function getLpStore(content: Pick<SiteContent, "lp">): LpStore {
  const lp = content.lp;
  if (!lp) return { draft: DEFAULT_LP, published: DEFAULT_LP };
  return {
    ...lp,
    draft: withDefaults(lp.draft),
    published: lp.published ? withDefaults(lp.published) : null,
  };
}

// 後からフィールドを追加しても古い保存データで落ちないよう、セクション単位で既定値を浅くマージする
function withDefaults(c: Partial<LpContent> | undefined): LpContent {
  const src = c ?? {};
  const out = { ...DEFAULT_LP } as LpContent;
  for (const key of Object.keys(DEFAULT_LP) as (keyof LpContent)[]) {
    const v = src[key];
    if (v === undefined) continue;
    const def = DEFAULT_LP[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (out as any)[key] = def && typeof def === "object" && !Array.isArray(def) ? { ...def, ...(v as object) } : v;
  }
  return out;
}

/** 店舗ごとの LINE URL。LP専用の設定が空なら店舗情報（管理画面 > 店舗）の lineUrl を使う */
export function resolveLineUrls(lp: LpContent, salons: SiteContent["salons"]): Record<LpSalonKey, string> {
  return {
    fleurami: lp.line.fleurami || salons.fleurami?.lineUrl || "",
    riv: lp.line.riv || salons.riv?.lineUrl || "",
  };
}
