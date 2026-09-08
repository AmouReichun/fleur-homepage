# SEO・AIO 監査レポート

**監査日:** 2026年9月9日  
**対象サイト:** https://fleur-group.jp  
**Next.js:** 14.2.x（App Router）  
**担当:** Claude Code（シニアエンジニア役割）

---

## 1. 現状サマリー

| 項目 | 評価 | 詳細 |
|------|------|------|
| metadata (title/description) | ✅ 良好 | ページ固有で適切 |
| OGP / Twitter Card | ✅ 良好 | 全主要ページに設定済み |
| canonical | ✅ 良好 | 各ページに設定済み |
| robots.txt | ✅ 良好 | AI クローラーも明示許可 |
| sitemap.ts | ✅ 良好 | ブログ・タグ・エリア・スタッフ含む |
| Organization Schema | ✅ 良好 | 詳細な設定済み |
| HairSalon / BeautySalon Schema | ✅ 良好 | NAP・geo・hours 設定済み |
| FAQPage Schema | ✅ 良好 | 23問 Q&A 設定済み |
| BreadcrumbList | ✅ 良好 | 主要ページに設定済み |
| Person Schema | ✅ 良好 | スタッフページに設定済み |
| Article / BlogPosting Schema | ✅ 良好 | ブログ記事に設定済み |
| VideoObject Schema | ✅ 良好 | Instagram リンク記事に設定済み |
| HowTo Schema | ✅ 存在 | 関数定義済み（記事で活用中） |
| llms.txt | ✅ 良好 | Q&A 形式で充実 |
| llms-full.txt | ✅ 良好 | 全記事リスト付き |
| WebSite Schema + SearchAction | ✅ 良好 | 設定済み |
| CollectionPage Schema | ✅ 良好 | タグ・アーカイブページに設定済み |
| 内部リンク設計 | ✅ 良好 | 店舗↔スタッフ↔症例↔サービス連携済み |
| エリアページ | ✅ 良好 | 高知市・香南市・野市・はりまや橋 |
| サービスページ | ✅ 良好 | /service/[slug] で各施術を網羅 |
| GA4 | ✅ 設定済み | afterInteractive で遅延ロード |
| preconnect / dns-prefetch | ✅ 設定済み | GTM・Instagram CDN |
| 画像 alt | ✅ 概ね良好 | 店舗名・地域含む説明的な alt |

---

## 2. 問題点・改善項目

### 🔴 HIGH（即時修正が必要）

#### H-1: Raffine 定休日の表記矛盾
- **場所:** `app/llms.txt/route.ts`
- **問題:** llms.txt が「定休:水」と記載しているが、`data/content.json` は「不定休」。`lib/structured-data.ts` FAQ も「定休日は不定休です」と正しく記載。AI が誤引用する可能性が高い。
- **修正:** llms.txt の定休表記を「不定休（Instagramでお知らせ）」に統一

#### H-2: Organization 名の不統一
- **場所:** `lib/blog/structured-data.ts` publisher フィールド
- **問題:** `publisher.name` が「フルールグループ」（カタカナ）。メインの `lib/structured-data.ts` では「fleur GROUP」。Google・AI がエンティティを同一と認識しにくい。
- **修正:** 全箇所で「fleur GROUP」に統一

#### H-3: Google 口コミ件数に基準日なし
- **場所:** `lib/structured-data.ts` 全 salonSchema の `aggregateRating`
- **問題:** `ratingCount` が固定値（674/388/200）で最終更新日・取得元の記載がない。Raffine は「200件以上」と description に書くが `ratingCount: 200` は現在数と乖離の可能性。
- **影響:** AI が古い数値を引用する可能性
- **修正:** 構造化データに `description/datePublished` コンテキスト追加 + TODO.md にデータ更新手順を記載

### 🟡 MEDIUM（今回実装）

#### M-1: `/guide/` 情報ハブが未実装
- **問題:** 「高知の美容・ヘアケア情報」を集約するハブページがない。AI 検索で「高知 美容室 おすすめ」系のクエリに対して、一次情報ページが存在しない。
- **修正:** `/guide/` ハブページを新規作成

#### M-2: 年間施術件数データ構造が未整備
- **場所:** `data/salon-stats.json`
- **問題:** 施術時間・頻度のデータはあるが、年間件数（髪質改善○件など）を管理するフィールドがない。管理者が入力できる構造が必要。
- **修正:** `salon-stats.json` に年間件数フィールドを追加（値は未入力 TODO 状態）

#### M-3: `sameAs` URL の末尾スラッシュ不統一
- **場所:** `lib/structured-data.ts` vs `lib/blog/structured-data.ts`
- **問題:** 同じ Instagram URL で trailing slash あり/なしが混在（例: `riv.kochi` vs `riv.kochi/`）。Schema.org 的には問題ないが、Google のエンティティ照合で不整合を起こす可能性。
- **修正:** すべて trailing slash なしに統一

#### M-4: スタッフの `specialties` が空欄
- **場所:** `data/content.json` staff データ
- **問題:** 西森心大（Riv. マネージャー）の `specialties: []`、川上凛・沢村瑞希の `styles: [""]`（空文字）
- **修正:** 空文字の配列は `[]` に統一（Person schema の knowsAbout に空文字が入るのを防ぐ）

#### M-5: ブログ Speakable Selector が汎用すぎる
- **場所:** `lib/blog/structured-data.ts` の `articleSchema`
- **問題:** `cssSelector: ["h1", "#article-qa", "#faq-section"]` は存在しない ID を含む可能性
- **修正:** 実際に存在する要素セレクタに絞る

### 🟢 LOW（TODO として管理）

#### L-1: `salon-stats.json` 年間件数を実数値に更新（管理者入力待ち）
#### L-2: Raffine `aggregateRating.ratingCount` を実数値に更新（定期確認）
#### L-3: スタッフ専門性データ（美容師歴・得意技術）を充実させる（管理者入力）
#### L-4: `/company/media/` プレスページ（将来実装）
#### L-5: 高知美容料金調査ページ（実データ取得後に実装）
#### L-6: `西田ななみ` スタッフに slug が未設定（content.json に追加が必要）

---

## 3. 現在の強み（維持すべき点）

1. **FAQPage Schema が充実** — 23問の高品質 Q&A。AI 引用されやすい構造。
2. **llms.txt が Q&A 形式で実装済み** — ChatGPT・Perplexity 等への一次情報として機能。
3. **店舗 Schema が詳細** — geo 座標・価格帯・支払い方法・設備・OpeningHours 完備。
4. **内部リンクが体系的** — 店舗↔スタッフ↔症例↔サービス↔エリアが相互リンク。
5. **AI クローラーを全許可** — GPTBot・ClaudeBot・PerplexityBot 等を明示許可。
6. **robots.txt で管理ページを適切に除外** — /admin/ を正しくブロック。
7. **sitemap.ts が網羅的** — 860+ ページを lastModified 付きで登録。
8. **Article Schema に datePublished/dateModified** — 鮮度情報を正確に提供。

---

## 4. 実装優先順位

| 優先度 | 項目 | 理由 |
|--------|------|------|
| 1 | H-1 Raffine 定休日修正 | AI 誤引用防止。即時リスク |
| 2 | H-2 Organization 名統一 | エンティティ同一性の確保 |
| 3 | M-1 /guide/ ハブ作成 | 新しいSEO資産。AI 引用可能な一次情報 |
| 4 | M-2 salon-stats 年間件数フィールド追加 | 実績データ管理の基盤 |
| 5 | M-3 sameAs URL 統一 | エンティティ照合精度向上 |
| 6 | M-4 staff specialties 空文字修正 | Schema.org の品質向上 |
| 7 | 3ファイルレポート作成 | 今後の管理指針 |
