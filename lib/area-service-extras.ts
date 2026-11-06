// エリア×メニューページの「その地域・その店舗だけの情報」。
// テンプレート文（services.ts の lead/body）の使い回しをやめ、検索で選ばれるページにするためのデータ。
// キーは `${areaSlug}/${serviceSlug}`。ここに無い組み合わせは従来どおりテンプレートで表示する。
//
// 方針（2026-11 社長OK）：
// - 料金・担当・流れなど「うちにしかない事実」だけを書く。推測や誇張（No.1など）は書かない
// - 料金はホットペッパー掲載価格。変わったらここも直す
// - 同じ店舗の重複ページ（野市＝香南市と同じfleurami）は検索に出さない（NOINDEX_AREA_SERVICES）

export interface ExtraPriceRow {
  name: string;
  price: string;
  note?: string;
}

export interface ExtraStep {
  title: string;
  text: string;
}

export interface ExtraStaff {
  slug: string;
  name: string;
  salonName: string;
  text: string;
}

export interface AreaServiceExtra {
  /** <title>（未指定ならテンプレート） */
  title?: string;
  /** meta description */
  description: string;
  /** テンプレートのリード・本文の代わりに表示する独自の導入文 */
  intro: string[];
  price?: { heading: string; rows: ExtraPriceRow[]; note: string };
  flow?: { heading: string; steps: ExtraStep[]; note?: string };
  compare?: { heading: string; head: [string, string, string]; rows: [string, string, string][] };
  staff?: { heading: string; members: ExtraStaff[] };
  access?: string;
  /** このページだけのよくある質問（先頭に表示） */
  faq: { q: string; a: string }[];
  /** テンプレートFAQから何件だけ後ろに付けるか（重複を減らすため） */
  templateFaqLimit?: number;
}

export const AREA_SERVICE_EXTRAS: Record<string, AreaServiceExtra> = {
  "kochi/shiraga-bokashi": {
    title: "高知市の白髪ぼかし｜料金・担当・流れ｜Riv. by fleurami（南川添）",
    description:
      "高知市南川添の美容室Riv. by fleuramiの白髪ぼかし。細いハイライトで白髪をなじませ、根元が伸びても目立ちにくいカラーに。初回11,900円〜の料金表、担当スタイリスト、施術の流れ、白髪染めとの違いを掲載。駐車場5台。",
    intro: [
      "高知市南川添の美容室「Riv. by fleurami（リヴ バイ フルールアミー）」は、「白髪染めをやめたい」「暗く塗りつぶすカラーから卒業したい」という30〜50代の女性が多く通う、白髪ぼかしを得意とするサロンです。",
      "Riv.の白髪ぼかしは、白髪が多い場所に細いハイライト（部分的に明るくする筋）を入れて、白髪と髪の色の差を小さくしてから、全体を艶カラーで整えるのが基本の流れです。根元が伸びても白い線がくっきり出にくいため、短い間隔で白髪染めをくり返すループから抜け出しやすくなります。",
      "ハイライトの本数は「5枚まで・15枚まで・30枚まで」の3段階から、白髪の量とどこまで明るくしたいかで決めます。初めての方は少ない本数から試して、仕上がりを見ながら次回以降に増やしていく方法もあります。",
    ],
    price: {
      heading: "Riv.の白髪ぼかしの料金",
      rows: [
        { name: "【初めての方】白髪ぼかし（ハイライト5枚まで）＋カラー＋カット", price: "11,900円", note: "通常13,900円" },
        { name: "白髪ぼかし 艶ハイライト（15枚まで）＋カラー＋カット", price: "17,800円" },
        { name: "白髪ぼかし 艶ハイライト（30枚まで）＋カラー＋カット", price: "24,900円" },
        { name: "ハイライトの追加", price: "1枚 440円" },
      ],
      note: "ホットペッパービューティー掲載価格（2026年11月時点・税込）。髪の長さや量によって料金が変わる場合があります。2回目以降は、次回予約・再来の方向けの価格もご用意しています。",
    },
    flow: {
      heading: "白髪ぼかしの流れ",
      steps: [
        { title: "1. カウンセリング", text: "白髪の量と出やすい場所（分け目・顔まわり・こめかみ）、普段の結び方や分け方を確認します。" },
        { title: "2. デザインを決める", text: "ハイライトの本数・太さ・入れる場所と、ベースの色（落ち着いた色〜明るめ）を一緒に決めます。" },
        { title: "3. ハイライト", text: "白髪が目立つ場所を中心に、細いハイライトを入れて白髪との色の差をなくしていきます。" },
        { title: "4. 艶カラー", text: "全体を色味で整え、白髪とハイライトをなじませます。" },
        { title: "5. カット・仕上げ", text: "カットとブローで仕上げ、次回の来店の目安とおうちでのケアをお伝えします。" },
      ],
      note: "所要時間はハイライトの本数と髪の長さで変わります。ご予約時に目安の時間をご確認ください。",
    },
    compare: {
      heading: "白髪染めと白髪ぼかしの違い",
      head: ["", "白髪染め", "白髪ぼかし"],
      rows: [
        ["やり方", "白髪を暗い色で隠す", "ハイライトで白髪をなじませる"],
        ["根元が伸びたとき", "白い線が目立ちやすい", "境目がぼやけて目立ちにくい"],
        ["来店の目安", "3〜5週間ごとが多い", "1.5〜2か月ごとが目安"],
        ["仕上がり", "暗め・平たい印象になりやすい", "明るさと立体感を出しやすい"],
        ["向いている人", "白髪をしっかり隠したい方", "暗くしたくない・来店の間隔をあけたい・グレイヘアへ移りたい方"],
      ],
    },
    staff: {
      heading: "白髪ぼかしを担当するスタイリスト",
      members: [
        {
          slug: "hosokawa-ayaka",
          name: "細川 彩香",
          salonName: "Riv. by fleurami",
          text: "美容師歴8年。白髪ぼかし・グレイカラー・髪質改善が得意で、30〜50代の「白髪を染めるのに疲れた」というご相談を多く担当しています。",
        },
      ],
    },
    access: "高知市南川添9-21 フルールアミー3 2F（高知ICから車で約4分）。駐車場5台（先着順）、近くにコインパーキングあり（徒歩3分）。",
    faq: [
      {
        q: "高知市のRiv.で白髪ぼかしはいくらでできますか？",
        a: "初めての方は「白髪ぼかし（ハイライト5枚まで）＋カラー＋カット」が11,900円です。白髪の量が多い方向けに、ハイライト15枚までの17,800円、30枚までの24,900円もあります（ホットペッパー掲載価格・2026年11月時点・税込）。",
      },
      {
        q: "初めての白髪ぼかしは、ハイライトを何本くらい入れますか？",
        a: "白髪の量と、どこまで明るくしたいかで決めます。まずは5枚までで白髪の多い分け目や顔まわりを中心に試し、仕上がりを見て次回以降に本数を増やす方法もあります。カウンセリングでご相談ください。",
      },
      {
        q: "白髪ぼかしの担当を指名できますか？",
        a: "はい。Riv. by fleuramiには白髪ぼかし・グレイカラーを得意とする細川 彩香が在籍しています。ホットペッパービューティーから指名してご予約いただけます（指名料300円）。",
      },
      {
        q: "Riv.に駐車場はありますか？",
        a: "店舗前に5台（先着順）あります。満車の場合は、近くのコインパーキング（徒歩3分）をご利用ください。",
      },
    ],
    templateFaqLimit: 3,
  },
};

/** 同じ店舗の重複ページ（検索には出さない）。キーは `${areaSlug}/${serviceSlug}` */
export const NOINDEX_AREA_SERVICES = new Set<string>([
  // 野市はfleurami（香南市野市町）の所在地で、/area/konan/shiraga-bokashi と同じ内容になるため
  "noichi/shiraga-bokashi",
]);

export function getAreaServiceExtra(areaSlug: string, serviceSlug: string): AreaServiceExtra | undefined {
  return AREA_SERVICE_EXTRAS[`${areaSlug}/${serviceSlug}`];
}

export function isNoindexAreaService(areaSlug: string, serviceSlug: string): boolean {
  return NOINDEX_AREA_SERVICES.has(`${areaSlug}/${serviceSlug}`);
}
