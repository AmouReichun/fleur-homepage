// ────────────────────────────────────────────────────────────────────────
// ブログ記事生成プロンプト（SEO / AIO 対策）2026-11-07 全面改訂
//
// 方針（Codexと検討・Google公式の「役に立つ独自の情報」基準に合わせる）:
// - 1記事＝1つの質問に、冒頭で答える「実例記事」。テンプレの見出しを全記事に強制しない。
// - 事実は「写真・キャプション/メモ・確認済みの店舗データ（data/content.json）」だけ。
//   一般論・架空の会話・推測の施術前状態・他店との一般論比較で文字数を埋めない。
// - 料金はHPの定価（メニュー表）だけ。HPBの初回・クーポン価格は書かない。
// - 店舗の情報は data/content.json から毎回読む（古い固定文が残らないようにする）。
//
// このモジュールは Instagram 連携（lib/blog/article-core.ts）・スタッフ投稿／日次生成
// （scripts/generate-article.ts）・リライト／キーワード記事から import される。
// ────────────────────────────────────────────────────────────────────────

import { getContent } from "../content";
import { SALON_DISPLAY, salonDisplayKeyOf, type SalonDisplayKey } from "../salon-display";
// salonDisplayKeyOf はスタッフの所属店（content.json の staff[].salon）の照合にだけ使う

export const AREA_BY_KEY: Record<string, string> = {
  fleurami: "香南市",
  riv: "高知市",
  raffine: "高知市",
};

// 記事生成で受け付ける店名（内部キー・旧表記・正式表記の完全一致のみ。似た名前で別の店にしない）
const SALON_ALIASES: Record<string, SalonDisplayKey> = {
  fleurami: "fleurami", "fleur ami": "fleurami", "fleur ami【フルールアミー】": "fleurami", フルールアミー: "fleurami",
  riv: "riv", "Riv.": "riv", "Riv. by fleurami": "riv", "Riv. by fleur ami": "riv", "Riv.by fleurami": "riv",
  raffine: "raffine", Raffine: "raffine", ラフィーネ: "raffine",
};

/** 店名 → 地域名（承認済みの店名だけ） */
export const AREA_BY_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(SALON_ALIASES).map(([name, key]) => [name, AREA_BY_KEY[key]]),
);
export function areaBySalonName(name: string): string | undefined {
  const key = SALON_ALIASES[name?.trim()];
  return key ? AREA_BY_KEY[key] : undefined;
}

// 店ごとの「打ち出しの順番」と、メニュー表の組み合わせ定価（社長決定 2026-11-07）
const POSITIONING: Record<SalonDisplayKey, { main: string; audience: string; access: string; combos: string[]; notes: string[] }> = {
  riv: {
    main: "艶カラー → ミルボンの髪質改善（グローバルミルボン／GM） → 白髪ぼかし・縮毛矯正",
    audience: "30〜40代の女性が中心（メンズカット・眉カットも対応）",
    access: "高知ICから車で約4分・LIME LAND真横",
    combos: [
      "カット 4,700円〜",
      "艶カラー＋カット 11,700円〜",
      "艶カラー＋カット＋集中マスクTR 12,800円〜",
      "髪質改善（GM）＋カット 11,700円〜",
      "艶カラー＋カット＋GM 18,700円〜",
      "白髪ぼかし（5枚）＋カラー＋カット 13,900円〜",
      "縮毛矯正＋カット 16,800円〜（ショート。ロングは M 19,300円〜／L 20,300円〜／LL 21,800円〜）",
      "縮毛矯正＋カット＋GM 23,800円〜",
    ],
    notes: ["駐車場は無料5台（先着順）。近くにコインパーキング（徒歩3分）"],
  },
  fleurami: {
    main: "艶カラー → ミルボンの髪質改善（グローバルミルボン／GM） → 白髪ぼかし・縮毛矯正",
    audience: "大人女性が中心（学生・メンズも来店）",
    access: "のいち駅から車で約4分",
    combos: [
      "カット 4,700円〜",
      "艶カラー＋カット 11,700円〜",
      "艶カラー＋カット＋集中マスクTR 12,800円〜",
      "髪質改善（GM）＋カット 11,700円〜",
      "艶カラー＋カット＋GM 18,700円〜",
      "白髪ぼかし（5枚）＋カラー＋カット 13,900円〜／15枚 18,300円〜",
      "縮毛矯正＋カット 16,800円〜（ショート。ロングは M 19,300円〜／L 20,300円〜／LL 21,800円〜）",
      "縮毛矯正＋カット＋GM 23,800円〜",
    ],
    notes: ["駐車場は無料7台（先着順）", "香南市・野市・南国市・高知市東部から来店しやすい"],
  },
  raffine: {
    main: "まつげパーマ（ラッシュリフト） → 眉毛WAX（美眉デザインWAX・メンズ眉毛WAX） → まつげエクステ（フラットラッシュ・エクパーマ）",
    audience: "20〜30代の女性が中心。男性もすべてのメニューを利用できる",
    access: "はりまや橋から徒歩約3分（TNはりまやビル3F）",
    combos: [],
    notes: [
      "全席半個室・予約優先制",
      "男性も利用できる（「女性専用」とは書かない）",
      "近くにコインパーキング（徒歩1〜3分）",
      "初出は「まつげ・眉毛専門店 Raffine（ラフィーネ）」と書く（他業種の店の話は書かない）",
      "エクパーマの順番は「まつげエクステを先に付けて、そのあとにまつげパーマ」（逆に書かない）",
      "まつげパーマ後の注意は「施術後24時間は濡らさない・こすらない」に統一（24〜48時間などと書かない）",
    ],
  },
};

/** 旧表記・正式表記・内部キーから店舗キーを返す。分からない店名はエラー（別の店の情報で書かないため） */
export function resolveSalonKey(salonNameOrKey: string): SalonDisplayKey {
  const key = SALON_ALIASES[salonNameOrKey?.trim()];
  if (!key) throw new Error(`[article-prompt] 店舗を特定できません: "${salonNameOrKey}"`);
  return key;
}

function menuPriceLines(key: SalonDisplayKey): string {
  const menus = (getContent() as unknown as { menus?: Record<string, { category: string; items: { name: string; price: string }[] }[]> }).menus?.[key] ?? [];
  return menus
    .map((c) => `  ・${c.category}：${c.items.map((i) => `${i.name} ${i.price}`).join("／")}`)
    .join("\n");
}

function salonFactsBlock(key: SalonDisplayKey): string {
  const s = (getContent().salons as unknown as Record<string, Record<string, string>>)[key] ?? {};
  const p = POSITIONING[key];
  const reading = key === "raffine" ? "（ラフィーネ）" : key === "riv" ? "（リヴ バイ フルールアミー）" : "（フルールアミー）";
  const lines = [
    `- 正式な店名：${SALON_DISPLAY[key]}${reading}`,
    `- 地域：高知県${AREA_BY_KEY[key]}`,
    `- 住所：${s.address ?? ""}`,
    `- 電話：${s.phone ?? ""}`,
    `- 営業時間：${s.hoursWeekday ?? ""}／定休日：${s.closed ?? ""}`,
    `- アクセス：${p.access}`,
    `- 駐車場：${s.parking ?? ""}`,
    `- 主な客層：${p.audience}`,
    `- 打ち出す順番：${p.main}`,
    ...p.notes.map((n) => `- ${n}`),
    `- 予約：ホットペッパービューティー${key === "raffine" ? "" : "または公式LINE"}。HPの店舗ページ https://fleur-group.jp/salon/${key}`,
  ];
  const combos = p.combos.length
    ? `\n- よく選ばれる組み合わせの定価（税込・メニュー表の合計）：\n${p.combos.map((c) => `  ・${c}`).join("\n")}`
    : "";
  return `【確認済みの店舗情報（ここに書いてあることだけを店の事実として使う）】
${lines.join("\n")}${combos}
- メニュー表の定価（税込）：
${menuPriceLines(key)}`;
}

// 承認済みの別表記（コード内の旧スタッフ一覧にあった漢字表記）。公開名は content.json の name に統一する
const STAFF_ALIASES: Record<string, string[]> = {
  やすい: ["安井未琉", "安井"],
  おざき: ["尾崎あい", "尾崎"],
  くろせ: ["葉月"], // 下の名前（社長確認 2026-11-07）
  高田和花: ["のどか", "和花"], // 読み（社長確認 2026-11-07）
};

/** 同じスタッフの表記ゆれ（例：HPの「やすい」と記事の「安井未琉」）をまとめて返す。空白は除く。 */
export function staffNameVariants(name: string | undefined | null): string[] {
  const n = (name ?? "").replace(/[\s　]/g, "");
  if (!n) return [];
  for (const [key, aliases] of Object.entries(STAFF_ALIASES)) {
    const all = [key, ...aliases].map((x) => x.replace(/[\s　]/g, ""));
    if (all.includes(n)) return all;
  }
  return [n];
}

/** 記事の担当者欄に書く名前（別名表にフルネームがあればそれを使い、既存記事の表記にそろえる） */
function authorNameOf(name: string): string {
  const full = STAFF_ALIASES[name.replace(/[\s　]/g, "")]?.[0];
  // 漢字3文字以上のフルネームのときだけ置き換える（「葉月」のような下の名前だけなら HP の表記のまま）
  return full && /^[一-龥ぁ-んァ-ン]{3,}$/.test(full) && /[一-龥]/.test(full) ? full : name;
}

/**
 * キャプション/メモから担当者を探す（くじ引きで決めない）。
 * 1) 「担当」「施術」「stylist」などの欄に書かれた名前を優先
 * 2) 欄が無ければ、本文中のフルネーム（漢字の場合）が1人だけ一致したときだけ採用
 * 候補が複数・ひらがなだけの名前が欄の外にあるだけ、などは null（店として紹介）
 */
export function detectStaff(salonNameOrKey: string, text: string): { name: string; role: string; history?: string } | null {
  const key = SALON_ALIASES[salonNameOrKey?.trim()] ?? salonDisplayKeyOf(salonNameOrKey);
  if (!key || !text) return null;
  const norm = (x: string) => x.replace(/[\s　]/g, "");
  const staff = getContent().staff.filter((m) => salonDisplayKeyOf(m.salon) === key);
  const namesOf = (m: { name: string }) => {
    const family = m.name.split(/[\s　]/)[0];
    const list = [norm(m.name), ...(STAFF_ALIASES[norm(m.name)] ?? []).map(norm)];
    if (family !== m.name && family.length >= 2) list.push(family);
    return list;
  };
  const pick = (m: (typeof staff)[number]) => ({ name: authorNameOf(m.name), role: m.role, history: m.history });

  // 1) 担当欄
  const fields = [...text.matchAll(/(?:担当|施術|stylist|Stylist|スタイリスト|アイリスト)\s*[：:／/]?\s*([^\s#＃、,。\n]{1,12})/g)].map((x) => norm(x[1]).replace(/(さん|様)$/, ""));
  if (fields.length) {
    const hits = staff.filter((m) => fields.some((f) => namesOf(m).some((n) => f.startsWith(n) || n.startsWith(f) && f.length >= 2)));
    return hits.length === 1 ? pick(hits[0]) : null;
  }
  // 2) 欄が無い：漢字のフルネームが1人だけ一致
  const t = norm(text);
  const hits = staff.filter((m) => /[一-龥]/.test(m.name) && t.includes(norm(m.name)));
  return hits.length === 1 ? pick(hits[0]) : null;
}

/** 定額のメニュー（メニュー表に「〜」が無い金額）に AI が「〜」を付けてしまったものを戻す */
export function fixFixedPriceTilde(salonNameOrKey: string, text: string): string {
  const key = SALON_ALIASES[salonNameOrKey?.trim()];
  if (!key || !text) return text;
  const menus = (getContent() as unknown as { menus?: Record<string, { items: { price: string }[] }[]> }).menus?.[key] ?? [];
  const prices = menus.flatMap((c) => c.items.map((i) => i.price));
  const fixed = new Set(prices.filter((x) => /^¥[\d,]+$/.test(x)).map((x) => x.slice(1)));
  const ranged = new Set([...prices.filter((x) => /〜$/.test(x)).map((x) => x.replace(/^¥|〜$/g, "")), ...POSITIONING[key].combos.flatMap((c) => [...c.matchAll(/([\d,]+)円〜/g)].map((m) => m[1]))]);
  return text.replace(/([\d,]+)円〜/g, (all, n: string) => (fixed.has(n) && !ranged.has(n) ? `${n}円` : all));
}

const COMMON_RULES = `
【この記事の役割】
- {AREA}で{MENU_HINT}を探している人が「この店で、この仕上がりが、いくらで、誰に頼めるか」を判断できる“実例記事”にする。
- ChatGPT・Gemini・GoogleのAI概要などのAIが、そのまま引用できる短く正確な文を入れる（店名・地域・メニュー名・定価・特徴を1文にまとめた要約）。
- 売り込みや自画自賛（すごい・丁寧・高技術・人気No.1など）は書かない。事実で語る。

【使ってよい事実（これ以外は書かない）】
1. 添付写真で実際に見えること（色味・明るさ・長さ・質感・まつげの上がり方・眉の形 など）
2. キャプション/メモに書いてあること（メニュー名・担当・お客様の希望 など）
3. 下の「確認済みの店舗情報」
- 写真やメモに無いこと（施術前の状態・お客様の年代や悩み・使った薬剤・施術時間・持ちの期間・工程の詳細）は推測で補わない。「〜と考えられます」も禁止。
- 一般的な知識（例：白髪ぼかしとは何か）は、記事の質問に答えるのに必要な範囲で短く。一般論で文字数を埋めない。
- お客様のセリフ・体験談を作らない。
- 写真で分かるのは「施術後の見た目」だけ。まっすぐになった・手触りが良くなった・長持ちする・家で再現しやすい・施術前後の変化は、写真から決めつけない（メモに書いてある場合だけ書く）。
- ハッシュタグや店の取扱メニューは「今回その施術をした証拠」にしない。今回のメニューはキャプション/メモの本文に書かれたものだけ。
- 効果・性能・他より優れている点は、根拠（メモ・確認済み情報）がある場合だけ書く。「〜しやすい」「個人差があります」を付ければ書いてよい、ではない。
- 材料が足りない項目（比較・料金・担当など）は省いてよい。
- 料金は「確認済みの店舗情報」の定価だけ。初回価格・クーポン・割引は書かない。金額はメニュー表の書き方のまま（「〜」が無い金額に「〜」を付けない）。{PRICE_NOTE}

【構成】（見出しは記事ごとに内容に合わせて自由に。毎回同じ見出しにしない）
- 本文の最初（見出しの前）に2〜3文の「結論」：質問への答え＋店名（{SALON}）＋地域（高知県{AREA}）＋メニュー名＋定価の目安。AIが引用しやすい言い切りの文にする（効果の断定はしない）。
- 必ず入れる要素：
  1. 今回の実例（写真で見える仕上がりを具体的に。メモにあれば担当・メニュー）。下の形の表を1つ入れる：
     | 項目 | 内容 |
     | --- | --- |
     | 店舗 | {SALON}（高知県{AREA}） |
     | メニュー | （メモ/キャプションにあるメニュー。無ければ写真から分かる範囲で「〜系の仕上がり」） |
     | 担当 | （メモ/キャプションにある場合だけ。無ければこの行を消す） |
     | 定価 | （確認済みの定価から該当メニュー。分からなければ「メニューページを参照」） |
  2. この仕上がり・メニューが合う人／別のメニューが合う人（{SALON}の中のメニュー同士で比べる。他店の一般論比較は書かない）
  3. 予約・来店の情報（予約方法・駐車場/アクセスを1〜2文）
- 文字数は情報量に合わせて800〜1800字。足りない情報を一般論で水増ししない。
- 主メニュー名（例：艶カラー／髪質改善トリートメント／白髪ぼかし／縮毛矯正／まつげパーマ／まつげエクステ／眉毛WAX）を本文に必ず1回以上書く（サイトが関連ページへのリンクを自動で付ける）。
- 地域名は自然に2〜3回（「高知県{AREA}」を1回）。店名は2回以上。キーワードの羅列はしない。

【タイトル】
- 「｜」より前を32文字以内。前半に地域名とメニュー名。その記事の実例ならではの特徴（色名・長さ・デザイン名など）を入れて、既存記事と被らないようにする。
- 例：「高知市の艶カラー実例：ミルクティーベージュで透明感」「香南市で髪質改善×ボブ｜乾かすだけでまとまる艶」「はりまや橋のまつげパーマ実例｜パリジェンヌで自然に上向き」

【FAQ（faq配列）】
- 3〜5個。**この記事の施術・実例についての質問だけ**にする（このメニューはどんな人に向くか・仕上がりの持ち・施術の流れ・他メニューとの違い・この色/デザインの選び方 等）。答えは確認済みの情報と今回の実例だけで書く。
- 店の基本情報の質問（予約方法・駐車場・アクセス・営業時間・定休日・支払い方法・男性も利用できるか）は**入れない**。サイトの「よくある質問」ページで正しい答えを1つにまとめているため、記事ごとに書くと答えがズレる。
- 1つは「{AREA}で〇〇ならどこがいい？」のような話し言葉の質問にし、答えに店名・地域・メニュー名・定価の目安を入れる。

【薬機法・景表法（厳守）】
- 美容室・アイラッシュサロンは医療機関ではない。治る/治療/治癒/改善する（治す意味）/回復/効く/効果がある/効能/若返り/アンチエイジング/老化防止/育毛/発毛/脱毛防止/修復/再生/細胞/薬用/医薬部外品 は使わない。
- 絶対/必ず/完全に/100%/確実に/No.1/日本一/最高/唯一/業界最高/一番 は使わない（「一番人気」も書かない）。「完全に乾かす」→「しっかり乾かす」。
- 変化は見た目・手触り・印象の範囲で（まとまりやすい／手触りが整いやすい／目元の印象を変えやすい）。「〜しやすい」「個人差があります」。
- 「生えにくくなる」「まつげが伸びる・増える」など体の変化の説明は書かない。
- 「人気」「選ばれています」「多くの方が」は、確認済み情報に書いてある場合だけ。`;

const HAIR_HEADER = `あなたは高知県の美容室「{SALON}」（{AREA}）のブログ担当です。{AUTHOR_LINE}
添付したアフター写真と入力情報から、検索とAIに引用されやすい実例ブログ記事を書いてください。
トーン：落ち着いた大人向け。専門用語は短く言い換えを添える。`;

const EYELASH_HEADER = `あなたは高知市のまつげ・眉毛専門店「{SALON}」のブログ担当です。{AUTHOR_LINE}
添付したアフター写真と入力情報から、検索とAIに引用されやすい実例ブログ記事を書いてください。
トーン：軽やかで分かりやすく。専門用語は短く言い換えを添える。`;

// 写真のない解説記事（キーワード記事）では、上の「実例」ルールを次のように置き換える
const GUIDE_OVERRIDE = `【今回は写真のない解説記事（上の「実例」の指示より、こちらを優先）】
- 写真・実例はありません。実例の表・写真の描写・「今回の仕上がり」は書かない。施術事例やお客様の相談例を作らない。
- 狙いの質問に、確認済みの店舗情報（メニュー・定価・アクセス・予約）と、メニューの一般的な説明だけで答える。
- 冒頭の結論（2〜3文）と、店舗情報の表（店舗／地域／該当メニューと定価／予約方法）は入れる。
- 文字数は1200〜2500字。`;

// 既存記事の書き直し
const REWRITE_OVERRIDE = `【今回は既存記事の書き直し（上の「実例」の指示より、こちらを優先）】
- 既存記事に書かれている実例（写真の説明・担当・メニュー）は残してよい。新しい実例・担当・数値・お客様の話は足さない。
- 推測で書かれている部分（施術前の状態・年代・悩み・持ち・所要時間など根拠のないもの）は削る。
- 料金は確認済みの定価に直す。HPBの初回・クーポン価格は消す。`;

export const JSON_INSTRUCTION = `
以下のJSON形式で出力してください。JSON以外は一切出力しないこと。

{
  "title": "地域名＋メニュー＋この実例の特徴（｜より前は32文字以内）",
  "slug": "英数字とハイフンのみ（例：kochi-tsuya-color-milktea-beige）",
  "excerpt": "120文字以内。店名・地域・メニュー・この実例で分かること",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"],
  "question": "記事が答えるメインの質問（1文。例：高知市で透明感の出る艶カラーはいくら？）",
  "answer_summary": "質問への答え（2〜3文。店名・地域・メニュー・定価の目安を含める。AIがそのまま引用できる文）",
  "faq": [
    {"q": "質問1", "a": "回答1"},
    {"q": "質問2", "a": "回答2"},
    {"q": "質問3", "a": "回答3"}
  ],
  "steps": [],
  "conversation": [],
  "body": "マークダウン本文（800〜1800字）。最初に結論の2〜3文、次に実例の表、合う人/別メニューが合う人、予約・来店情報。見出しは内容に合わせて付ける。FAQは本文に書かない。"
}

faqについて：3〜5個。本文には書かず、この配列にまとめる（サイトがQ&Aと構造化データを自動生成する）。確認済みの情報だけで答える。予約・駐車場・営業時間・支払いなど店の基本情報の質問は入れない。
stepsについて：メモ/キャプションに施術の手順が書かれている場合だけ2〜5ステップ。書かれていなければ必ず空配列 []。
conversationについて：作り話の会話になるため、必ず空配列 [] にする。
重要（薬機法・景表法 厳守）：title・slug・excerpt・tags・question・answer_summary・faq・body のすべてで、上の禁止語を1語でも使ったら出力失敗とみなす。`;

/**
 * カテゴリ・店舗に応じた生成プロンプト本体（入力情報ブロックとJSON指示を除く）を組み立てる。
 * 呼び出し側で「入力情報（キャプション/メモ）」と JSON_INSTRUCTION を後ろに連結して使う。
 *
 * @param author - キャプション/メモから確認できた担当者名（無ければ渡さない。くじ引きで決めない）
 * @param existingTitles - 既存記事のタイトル一覧。渡すと「重複しないよう注意」ブロックが追加される。
 */
export function buildBasePrompt(opts: {
  category: "hair" | "eyelash";
  salonName: string;
  area?: string;
  author?: string;
  authorHistory?: string;
  existingTitles?: string[];
  /** case＝写真の実例記事（既定）／guide＝写真なしの解説記事（キーワード記事）／rewrite＝既存記事の書き直し */
  articleType?: "case" | "guide" | "rewrite";
}): string {
  const key = resolveSalonKey(opts.salonName);
  const area = AREA_BY_KEY[key];
  const salon = SALON_DISPLAY[key];
  const header = opts.category === "hair" ? HAIR_HEADER : EYELASH_HEADER;
  const authorLine = opts.author
    ? `今回の担当は${opts.author}${opts.authorHistory ? `（${opts.authorHistory}）` : ""}です。担当者名は実例の表に書き、経験年数は書いてある場合だけ1回触れてよい。`
    : "担当者はキャプション/メモに書かれていないため、担当者名は書かない（店として紹介する）。";
  const menuHint = opts.category === "hair" ? "美容室（艶カラー・髪質改善・白髪ぼかし・縮毛矯正など）" : "まつげパーマ・眉毛WAX・まつげエクステ";

  const type = opts.articleType ?? "case";
  let prompt = `${header}\n${COMMON_RULES}\n\n${salonFactsBlock(key)}`;
  if (type === "guide") {
    prompt += `\n\n${GUIDE_OVERRIDE}`;
  } else if (type === "rewrite") {
    prompt += `\n\n${REWRITE_OVERRIDE}`;
  }

  if (opts.existingTitles && opts.existingTitles.length > 0) {
    const recent = opts.existingTitles.slice(0, 60); // getAllPosts は新しい順
    prompt += `\n\n【既存記事のタイトル（このサロン・直近${recent.length}件）】
同じ「地域＋メニュー＋切り口」のタイトルは作らない。今回の写真ならではの特徴（色名・長さ・デザイン名・組み合わせ）で差をつける：
${recent.map((t) => `- ${t}`).join("\n")}`;
  }

  return prompt
    .replace(/\{AUTHOR_LINE\}/g, authorLine)
    .replace(/\{MENU_HINT\}/g, menuHint)
    .replace(/\{PRICE_NOTE\}/g, opts.category === "hair" ? "「（税込）」を添える。ロング料金はカラーと縮毛矯正だけにかかる（メニュー表のロング料金欄）。長さ別の金額をすでに書いた場合は、さらに「ロング料金別」と書かない。" : "まつげ・眉毛は「（税込）」とだけ書く（ロング料金は無い）。")
    .replace(/\{SALON\}/g, salon)
    .replace(/\{AREA\}/g, area);
}


/**
 * 記事FAQから「店の基本情報」の質問（予約方法・駐車場・アクセス・営業時間・定休日・支払い）を取り除く。
 * これらは /blog/faq の正本に一本化している（記事ごとに書くと答えがズレるため）。2026-11-07
 */
const STORE_BASIC_Q = /予約(方法|の仕方|はどう|できますか|はどこ)|駐車場|アクセス|行き方|営業時間|定休日|お休み|支払い|クレジット|カード|PayPay|電子マネー/;
export function filterStoreBasicFaq<T extends { q: string }>(faq: T[]): T[] {
  return (faq ?? []).filter((f) => !STORE_BASIC_Q.test(f.q));
}
