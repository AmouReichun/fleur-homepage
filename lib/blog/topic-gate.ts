/**
 * 記事テーマの重複ガード（2026-11-07 Raffine記事の整理で導入）
 *
 * 同じテーマの記事が量産されると、Google・AIがどれを出せばいいか迷い、全部が弱くなる。
 * 「もう親記事があるテーマ」は新しい記事を作らない（親記事の更新で対応する）。
 * 一重・まつげが少ない・パリジェンヌ・本数／カール指定などの「独自の切り口」がある場合だけ通す。
 */

type Gate = { name: string; parent: string; match: RegExp };

// Raffine：親記事があるテーマ（上から順に判定）
const RAFFINE_COVERED: Gate[] = [
  { name: "料金", parent: "kochi-matsuge-pama-matsuek-ryokin-souba", match: /料金|相場|値段|いくら/ },
  { name: "パーマとマツエクの比較", parent: "kochi-matsuek-vs-matsuge-pama-hikaku", match: /(パーマ|リフト).*(マツエク|エクステ).*(違い|比較|どっち|どちら)|(マツエク|エクステ).*(パーマ|リフト).*(違い|比較|どっち|どちら)/ },
  { name: "持ち・頻度", parent: "kochi-matsuge-pama-mochi-hindo-nagamochi", match: /持ち|頻度|長持ち|続かない|落ちやすい|かけ直し/ },
  { name: "メンズ眉", parent: "kochi-mens-eyebrow-wax-matsuge", match: /メンズ|男性/ },
  { name: "まつげ＋眉の同時", parent: "kochi-lashperm-eyebrow-wax-set-raffine", match: /(まつ|マツ|ラッシュ).*(眉|まゆ|アイブロウ)|(眉|まゆ|アイブロウ).*(まつ|マツ|ラッシュ)/ },
  { name: "眉サロン選び・眉WAX", parent: "kochi-eyebrow-salon-erabikata", match: /眉|まゆ|アイブロウ/ },
  { name: "自然なマツエク・マツエク選び", parent: "kochi-matsuge-eyelash-extension-supppin-meryoku-raffine", match: /マツエク|まつげエクステ|まつ毛エクステ|エクステ/ },
  { name: "まつげパーマの選び方・仕上がり", parent: "kochi-matsuge-perm-first-time-20s-impression", match: /まつ毛パーマ|まつげパーマ|まつパ|ラッシュリフト|まつ毛|まつげ/ },
];

// これがタイトルに入っていれば「独自の切り口」として通す（実例・悩み別・特殊メニュー）
const RAFFINE_DISTINCT: RegExp = /一重|奥二重|逆さ|少ない|短い|下がり|パリジェンヌ|エクパーマ|フラットラッシュ|バインドロック|LED|束感マツエク|韓国|[0-9０-９]+本|[CDJＣＤＪ]カール|トラブル|しみ|アレルギー|下まつ/;

// 美容室2店（2026-11-07 Codex案：各店26本を残し396本を統合）。店をまたいで統合しない。上から順に判定
const FLEURAMI_COVERED: Gate[] = [
  { name: "よさこいセット", parent: "yosakoi-hair-set-kochi-fleurami-mslhjj90", match: /よさこい/ },
  { name: "アップ・ヘアセット", parent: "adult-woman-upstyle-korean-look-mqt59sp7", match: /アップスタイル|ヘアセット|ヘアアレンジ/ },
  { name: "アンブレラカラー", parent: "kanan-umbrella-double-color-glossy-fleurami-ms6vwhs8", match: /アンブレラ/ },
  { name: "エンドカラー", parent: "kashima-end-color-orange-adult-women-guide-ms1mf5bu", match: /エンドカラー|毛先カラー/ },
  { name: "カットなし縮毛矯正", parent: "kashokuheki-kakusen-nashi-shrink-straight-fleurami-msirqxe2", match: /カット(なし|無し|せず)|縮毛矯正だけ/ },
  { name: "ハードパーマ", parent: "konan-hard-perm-erabikata-mrcpxvyi", match: /ハードパーマ/ },
  { name: "毛先カット", parent: "konan-kesaki-cut-teens-erabikata-mrx6z55g", match: /毛先カット|毛先だけ.*カット/ },
  { name: "メンズカラー", parent: "konan-mens-color-violet-fade-fleura-mi-mrohl97w", match: /(?=.*(メンズ|男性))(?=.*(カラー|ブリーチ))/ },
  { name: "メンズパーマ", parent: "kananshi-mens-perm-erabikata-fleur-ami", match: /(?=.*(メンズ|男性|男子))(?=.*パーマ)/ },
  { name: "メンズカット", parent: "mens-cut-koubu-sukkiri-kanan-fleurami", match: /メンズ|男性|刈り上げ|フェード/ },
  { name: "白髪ぼかし", parent: "40dai-shiraga-bokashi-highlight-shiagari-mqrjcjaq", match: /白髪ぼかし|白髪を|白髪が|白髪も|白髪ケア|グレイブレンド/ },
  { name: "白髪染め", parent: "shiragage-some-shizen-iroami-30-40dai-mqt5oyst", match: /白髪染め|グレイカラー|リタッチ/ },
  { name: "縮毛矯正＋GM同日", parent: "kananshi-shukumou-shitsukaizen-doji-erabikata-mtr9tqwo", match: /(?=.*縮毛矯正)(?=.*(髪質改善|トリートメント|GM))(?=.*(同日|同時|併用|組み合わせ))/i },
  { name: "縮毛矯正とGMの比較", parent: "shukumo-kyosei-vs-kamishitsu-kaizen-mqt5ece8", match: /(?=.*縮毛矯正)(?=.*(髪質改善|トリートメント|GM))(?=.*(違い|比較|どちら|どっち|選ぶ))/i },
  { name: "縮毛矯正", parent: "koshoku-kyosei-tsuyakuro-bob-konan-fleurami-mt2houmb", match: /縮毛矯正|ストレート/ },
  { name: "インナー・イヤリング", parent: "inner-color-adult-bob-fleur-ami-mqt7crpq", match: /インナーカラー|イヤリングカラー/ },
  { name: "艶カラー＋GM", parent: "konan-color-shitsukaizen-tsuyakami-bob", match: /(?=.*カラー)(?=.*(髪質改善|トリートメント|ミルボン|GM))/i },
  { name: "GM髪質改善", parent: "kosanshi-hairquality-treatment-straight", match: /髪質改善|トリートメント|ミルボン|\bGM\b|サラサラ|さらさら|ツヤ髪|ツヤツヤ/i },
  { name: "ブリーチ・ダブルカラー", parent: "silver-double-color-adult-women-mqrjz08r", match: /ダブルカラー|Wカラー|ハイトーン|デザインカラー|ブリーチ(?!なし|無し)|ケアブリーチ/i },
  { name: "ハイライト", parent: "otona-bob-highlight-change-mqq66hym", match: /ハイライト/ },
  { name: "顔周りレイヤー", parent: "20s-face-layer-cut-konan-fleurami-mt2bfahf", match: /顔(周り|まわり)/ },
  { name: "レイヤーカット", parent: "short-layered-bob-adult-women-mqq67b8n", match: /レイヤー|段カット/ },
  { name: "切りっぱなしボブ", parent: "kirinashi-bob-cut-matome-kochi-konanshi-fleurami", match: /切りっぱなし|タッセル/ },
  { name: "ボブパーマ", parent: "short-bob-perm-finish-mqq5yxm2", match: /パーマ|カールボブ/ },
  { name: "艶カラー・色選び・色持ち", parent: "natural-glossy-hair-color-20s-30s-mqq68564", match: /カラー|髪色|色落ち|色持ち|ブラウン|ベージュ|グレージュ|アッシュ|ピンク|レッド|オリーブ/ },
  { name: "ショート・ボブのカット", parent: "40dai-hair-menu-color-perm-shukumo", match: /ボブ|ショート|カット|後ろ姿|丸み/ },
];

const RIV_COVERED: Gate[] = [
  { name: "酸性ストレート比較", parent: "sansei-straight-vs-shukumou-kyosei-chigai-kochi", match: /酸性ストレート/ },
  { name: "キッズパーマ", parent: "kochi-kids-perm-erabikata-mrvlmpja", match: /(?=.*(キッズ|子ども|子供))(?=.*パーマ)/ },
  { name: "トリプルカラー", parent: "kochi-triplecolor-whitbeige-erabikata-mv0fhvjw", match: /トリプルカラー|ブリーチ(2|２|二)回/ },
  { name: "メンズ縮毛矯正", parent: "mens-shukumou-kyosei-kochi-konan-fleur-group", match: /(?=.*(メンズ|男性))(?=.*縮毛矯正)/ },
  { name: "メンズバレイヤージュ", parent: "mens-balayage-kochi-riv-fleurami-mspl5n4m", match: /(?=.*(メンズ|男性))(?=.*バレイヤージュ)/ },
  { name: "メンズカラー", parent: "kochi-mens-color-cut-style-texture-mumf03ef", match: /(?=.*(メンズ|男性))(?=.*(カラー|ブリーチ))/ },
  { name: "メンズパーマ", parent: "mens-perm-finish-style-explanation-mqt1i8un", match: /(?=.*(メンズ|男性|男子))(?=.*パーマ)/ },
  { name: "メンズカット", parent: "mens-cut-kochishi-fleur-group", match: /メンズ|男性|刈り上げ|フェード/ },
  { name: "白髪ぼかし", parent: "shiraga-bokashi-short-bob-30-40dai-mqq6au6v", match: /白髪ぼかし|白髪を|白髪が|白髪も|白髪ケア|グレイブレンド/ },
  { name: "白髪染め", parent: "shiraga-some-ryokin-kochi-riv-fleurami", match: /白髪染め|グレイカラー|リタッチ/ },
  { name: "縮毛矯正＋GM同日", parent: "kochi-shukumo-shitsukaizen-onedaysession-guide-msh284gn", match: /(?=.*縮毛矯正)(?=.*(髪質改善|トリートメント|GM))(?=.*(同日|同時|併用|組み合わせ))/i },
  { name: "縮毛矯正とGMの比較", parent: "kochi-shitsukaizen-shukumou-chigai", match: /(?=.*縮毛矯正)(?=.*(髪質改善|トリートメント|GM))(?=.*(違い|比較|どちら|どっち|選ぶ))/i },
  { name: "縮毛矯正", parent: "shukumo-kyosei-sarasara-shikumi-mqq629b3", match: /縮毛矯正|ストレート/ },
  { name: "インナー・イヤリング", parent: "kiriippanashi-bob-inner-color-shiatsu-jirei-kochi-mu5j5dyv", match: /インナーカラー|イヤリングカラー/ },
  { name: "艶カラー＋GM", parent: "color-cut-kamishitsu-kaizen-treatment-mqq5zqzx", match: /(?=.*カラー)(?=.*(髪質改善|トリートメント|ミルボン|GM))/i },
  { name: "GM髪質改善", parent: "kamishitsu-kaizen-tsuyakam-otona-josei", match: /髪質改善|トリートメント|ミルボン|\bGM\b|サラサラ|さらさら|ツヤ髪|ツヤツヤ/i },
  { name: "ウルフカット", parent: "kochi-wolf-cut-40dai-jissen-guide", match: /ウルフ/ },
  { name: "グラデーション", parent: "adult-women-hair-menu-guide-color-cut-perm", match: /グラデーション|エンドカラー|毛先カラー/ },
  { name: "ブリーチ・ダブルカラー", parent: "double-color-adult-hair-guide-mqt1l6m9", match: /ダブルカラー|Wカラー|ハイトーン|デザインカラー|ブリーチ(?!なし|無し)|ケアブリーチ/i },
  { name: "レイヤーカット", parent: "kochi-layer-bob-matome-karusa-40dai-mtlh4j7e", match: /レイヤー|段カット/ },
  { name: "切りっぱなしボブ", parent: "kochi-kirinashi-bob-shiagaridiff-jirei-msh14thp", match: /切りっぱなし|タッセル/ },
  { name: "ロングパーマ", parent: "kochi-perm-adult-long-hair-nishimori-mum14c6y", match: /(?=.*ロング)(?=.*パーマ)/ },
  { name: "ボブパーマ", parent: "kochi-bob-perm-40s-women-guide", match: /パーマ|カールボブ/ },
  { name: "艶カラー・色選び・色持ち", parent: "kochi-color-cut-tsuyakami-40dai-riv-msib3hqw", match: /カラー|髪色|色落ち|色持ち|ブラウン|ベージュ|グレージュ|アッシュ|ピンク|レッド|オリーブ/ },
  { name: "ショート・ボブのカット", parent: "bob-cut-kirei-otona-josei", match: /ボブ|ショート|カット|後ろ姿|丸み/ },
  { name: "美容室選び", parent: "kochi-biyoushitsu-erabikata-5points", match: /美容室.*選び|サロン.*選び/ },
];

// 新しい検索意図の候補。キーワード一致だけで自動公開しない。
// 元投稿・施術記録があり、同店に同じ意図の親がない場合に限って通す。
const FLEURAMI_DISTINCT: RegExp =
  /ビビリ毛|切れ毛|施術トラブル|頭皮がしみる|カラーアレルギー|ジアミン|ヘアドネーション|産後の抜け毛|抗がん剤後/;

const RIV_DISTINCT: RegExp =
  /ビビリ毛|切れ毛|施術トラブル|頭皮がしみる|カラーアレルギー|ジアミン|ヘアドネーション|産後の抜け毛|抗がん剤後/;


const GATES: Record<string, { covered: Gate[]; distinct: RegExp }> = {
  Raffine: { covered: RAFFINE_COVERED, distinct: RAFFINE_DISTINCT },
  fleurami: { covered: FLEURAMI_COVERED, distinct: FLEURAMI_DISTINCT },
  "Riv. by fleurami": { covered: RIV_COVERED, distinct: RIV_DISTINCT },
};

export type TopicGateResult = { ok: true } | { ok: false; reason: string; parent?: string };
export type ExistingPost = { title: string; slug: string; mergedInto?: string };

function norm(t: string): string {
  return t.replace(/高知県|高知市|高知|はりまや橋|Raffine|ラフィーネ|fleur ?ami|fleurami|Riv\.?|【決定版】|[｜|：:？?！!「」『』（）()、。・×\s]/g, "");
}
function bigrams(t: string): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i < t.length - 1; i++) s.add(t.slice(i, i + 2));
  return s;
}
export function titleSimilarity(a: string, b: string): number {
  const A = bigrams(norm(a));
  const B = bigrams(norm(b));
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  return inter / Math.max(1, A.size + B.size - inter);
}

/**
 * @param salonName 記事の salon（"Raffine" / "fleurami" / "Riv. by fleurami"）
 * @param title 生成された記事タイトル
 * @param existing 同じサロンの既存記事（統合済み・下書きも含める）
 * 不合格のとき parent に「まとめ先の親slug」を返す（新しい実例は捨てずに親記事へ統合するため）
 */
export function checkTopicGate(salonName: string, title: string, existing: ExistingPost[]): TopicGateResult {
  // 全サロン共通：ほぼ同じタイトルが既にある
  let best = 0;
  let near: ExistingPost | null = null;
  for (const e of existing) {
    const s = titleSimilarity(title, e.title);
    if (s > best) { best = s; near = e; }
  }
  if (near && best >= 0.6) {
    return { ok: false, reason: `既存記事とタイトルがほぼ同じ（類似度${best.toFixed(2)}：${near.title}）`, parent: near.mergedInto ?? near.slug };
  }
  const g = GATES[salonName];
  if (g && !g.distinct.test(title)) {
    const hit = g.covered.find((x) => x.match.test(title));
    if (hit) return { ok: false, reason: `テーマ「${hit.name}」は親記事あり（${hit.parent}）`, parent: hit.parent };
  }
  return { ok: true };
}
