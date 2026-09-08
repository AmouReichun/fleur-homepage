# SEO・AIO 実装レポート

**実装日:** 2026年9月9日  
**ビルド結果:** ✅ 成功（861ページ生成、エラー0）

---

## 1. 実施内容サマリー

| カテゴリ | 内容 | ステータス |
|----------|------|----------|
| 事実誤り修正 | Raffine 定休日の表記矛盾（llms.txt）を修正 | ✅ 完了 |
| 名称統一 | Organization 名を全箇所「fleur GROUP」に統一 | ✅ 完了 |
| URL統一 | sameAs の trailing slash を統一（末尾スラッシュなし） | ✅ 完了 |
| Entity強化 | ブログのSALONS定義に `@id` と GBP URL を追加 | ✅ 完了 |
| 新ページ | /guide/ 美容情報ハブページを新規作成 | ✅ 完了 |
| sitemap | /guide を sitemap.ts に追加（priority 0.85） | ✅ 完了 |
| スキーマ | layout.tsx のナビゲーションスキーマに /guide を追加 | ✅ 完了 |
| llms.txt | Raffine 定休日修正 + /guide URL を追加 | ✅ 完了 |
| データ構造 | salon-stats.json に年間件数フィールドを追加 | ✅ 完了 |
| データ品質 | content.json の空文字 styles `[""]` を `[]` に修正 | ✅ 完了 |
| レポート | SEO-AIO-AUDIT.md 作成 | ✅ 完了 |
| レポート | SEO-AIO-TODO.md 作成 | ✅ 完了 |

---

## 2. 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `app/llms.txt/route.ts` | Raffine 定休日「定休:水」→「不定休（Instagramでお知らせ）」。/guide URL を関連リンクに追加 |
| `lib/blog/structured-data.ts` | publisher/Organization 名を「フルールグループ」→「fleur GROUP」に統一。SALONS に `@id` を追加。sameAs に GBP URL 追加・trailing slash 統一。Organization の `@id` を追加。description を詳細化 |
| `lib/structured-data.ts` | aggregateRating に確認用コメントを追加 |
| `app/(main)/layout.tsx` | SiteNavigationElement に「美容ガイド（/guide）」を追加 |
| `app/sitemap.ts` | `/guide` エントリを追加（priority 0.85） |
| `data/content.json` | 沢村瑞希スタッフの `styles: [""]` → `[]` に修正 |
| `data/salon-stats.json` | `_annualStats` セクションを追加（年間施術件数の管理構造） |

---

## 3. 新規作成ファイル

| ファイル | 説明 |
|----------|------|
| `app/(main)/guide/page.tsx` | 高知の美容情報ハブページ。BreadcrumbList・CollectionPage・FAQPage スキーマ実装 |
| `SEO-AIO-AUDIT.md` | 現状監査レポート |
| `SEO-AIO-TODO.md` | 管理者入力待ち項目リスト |
| `SEO-AIO-IMPLEMENTATION.md` | 本ファイル |

---

## 4. /guide/ ページの実装内容

**URL:** `/guide`  
**ページタイプ:** CollectionPage（静的生成）  
**実装スキーマ:**
- `BreadcrumbList` (ホーム > 美容ガイド)
- `CollectionPage` with `ItemList` (サービスページへの参照)
- `FAQPage` (6問の高品質 Q&A)

**内部リンク:**
- ヘアメニュー8種 → `/service/[slug]`
- アイラッシュ・眉毛メニュー6種 → `/service/[slug]`
- エリア4箇所 → `/area/[area]`
- ブログ3箇所 → `/blog/hair`, `/blog/eyelash`, `/blog/faq`
- 店舗3店 → `/salon/[key]`

**SEO狙い検索クエリ:**
- 「高知 美容情報」「高知 ヘアケア」「高知 美容室 選び方」
- 「高知 髪質改善 縮毛矯正 違い」「高知 白髪ぼかし 白髪染め 違い」

---

## 5. Schema.org の改善内容

### Entity ID 強化
`lib/blog/structured-data.ts` の SALONS 定義に `"@id"` を追加することで、ブログ記事の `localBusinessSchema` が生成するスキーマが、メインサイトの `/salon/[key]` と同一エンティティとして参照可能になりました。

**変更前:**
```json
"@type": "HairSalon",
"name": "fleurami"
```

**変更後:**
```json
"@type": "HairSalon",
"@id": "https://fleur-group.jp/salon/fleurami",
"name": "fleurami"
```

### Organization 名の統一
すべての `publisher`・`Organization` スキーマで「fleur GROUP」に統一。Google・AI エンジンが同一エンティティと認識しやすくなります。

### sameAs URL 統一
Instagram・GBP URL の trailing slash を統一し（末尾スラッシュなし）、GBP URL をブログ側 SALONS にも追加。

---

## 6. AIO（AI Overview）改善のポイント

1. **llms.txt の誤情報修正** — Raffine 定休日「水曜」→「不定休」。AI が正確な情報を引用できるように。

2. **/guide/ FAQ の追加** — 「髪質改善と縮毛矯正の違い」「白髪ぼかしと白髪染めの違い」など、AI が直接引用できる Q&A 形式で追加。

3. **Entity Graph 強化** — @id による店舗エンティティの一貫性向上。AI がfleur GROUP → 各店舗 → スタッフ → 施術のグラフを正確に理解しやすくなります。

---

## 7. 残作業（SEO-AIO-TODO.md 参照）

| 項目 | 担当 | 期限 |
|------|------|------|
| Google 口コミ件数の実数確認・更新 | 管理者 | 月1回 |
| スタッフ詳細（得意技術・得意年代）の入力 | 管理者 | 随時 |
| 年間施術件数の入力（salon-stats.json） | 管理者 | 実数確認後 |
| /guide/ 配下への詳細記事追加 | 開発者 | 随時 |
| /company/media/ プレスページ作成 | 開発者 | 将来 |

---

## 8. ビルド結果

```
✓ Compiled successfully
✓ Generating static pages (861/861)
/guide ... ○ (Static)
TypeScript エラー: 0件
ESLint エラー: 0件
```

---

## 9. 自己評価（10点満点）

| 項目 | 点数 | コメント |
|------|------|---------|
| SEO（構造化データ・metadata） | 8/10 | Organization・Salon・Person・FAQPageが充実。aggregateRating の基準日なし・一部スタッフデータ未入力で-2 |
| AIO（AI引用対応） | 7/10 | llms.txt・FAQPage・Q&A形式コンテンツが充実。スタッフ専門性データ未入力・年間件数なし・一次情報量で-3 |
| E-E-A-T | 6/10 | 設立2006年・代表者名・店舗住所・スタッフ資格は揃っている。スタッフ詳細（歴・得意・件数）が未入力で専門性が低め |
| 構造化データ | 8/10 | 多様なSchemaタイプが実装済み。@id による Entity Graph が強化された。JSON-LD の重複定義はなし |
| 内部リンク | 8/10 | 店舗↔スタッフ↔症例↔サービス↔エリアが相互リンク。/guide/ 追加で情報ハブも完成 |
| コンテンツ品質 | 7/10 | 自動生成記事800本以上あるが、ピラーコンテンツ（高品質な解説記事）が不足 |
| 地域SEO（MEO） | 8/10 | NAP・Geo・GBP URL・エリアページ・地名キーワードが充実。住所の郵便番号確認済 |
| スタッフ専門性 | 5/10 | Person Schema は実装済みだが、得意技術・歴・件数がほぼ未入力 |
| 一次情報 | 5/10 | 年間件数データなし。調査データなし。実績の数値が薄い |
| Core Web Vitals | 7/10 | Lazy load・afterInteractive・preconnect実装済み。動画・地図の遅延ロード確認必要 |
| **合計** | **69/100** | **主に未入力のスタッフ・実績データが減点要因。実データ入力で80点台到達可能** |
