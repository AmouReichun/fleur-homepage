# LINE誘導LP（/lp）運用メモ

## 構成
| 役割 | 場所 |
|---|---|
| 公開ページ | `/lp`（`app/lp/page.tsx` → `app/lp/LpView.tsx`） |
| 管理画面 | `/admin/lp`（ログイン必須。左メニュー「📣 LINE誘導LP」） |
| 下書きプレビュー | `/admin/lp/preview`（ログイン必須・計測なし） |
| データ | `data/content.json` の `lp` キー（`draft` / `published`）。未作成の間は `lib/lp.ts` の `DEFAULT_LP` を表示 |
| 画像 | 既存の Vercel Blob ストア `lp/` 配下（アップロード時に長辺1800px・WebPへ自動変換。表示時は next/image が AVIF/WebP を出し分け） |

追加の有料サービス・新しい依存パッケージはありません（既存の Next.js / Tailwind / sharp / Vercel Blob / GitHub保存の仕組みを利用）。

## 更新の流れ
1. `/admin/lp` で編集 →「下書き保存」
2. 右側のプレビューで「スマホ / PC」を切り替えて確認
3. 「公開する」で `/lp` に反映（最大1分程度）

## 計測（GA4 / GTM）
送信イベント（`lib/lp-track.ts`）

| イベント | 意味 | 主なパラメータ |
|---|---|---|
| `lp_view` | LP表示 | utm_*, lp_variant, device |
| `lp_cta_click` | LINEボタン押下（店舗選択を開いた） | cta_position, menu |
| `line_click` | **公式LINEへ遷移（主要KPI）** | cta_position, menu, salon |
| `lp_scroll` | スクロール到達率 | percent (25/50/75/100) |
| `lp_section_view` / `lp_menu_view` | セクション・メニュー閲覧 | section / menu |
| `lp_gallery_filter` / `lp_gallery_open` | ギャラリー操作 | category, gallery_id |
| `lp_faq_open` | FAQ開閉 | faq_index |

cta_position の値: `hero` `header` `menu_kaizen` `menu_shiraga` `menu_cut` `gallery_modal` `gallery_after` `flow` `final` `salon_card` `sticky` `floating_pc`

GA4側でやること
- 管理 → カスタム定義 → イベントスコープで `cta_position` `menu` `salon` `lp_variant` を登録
- 管理 → イベント → `line_click` を「キーイベント」に設定
- 店舗別成果 = `line_click` を `salon` で分解。デバイス別 = 標準のデバイスカテゴリ

注意: `line_click` は「LINEを開いた数」。友だち追加数・予約完了数は LINE公式アカウント（Lステップ等）・予約システム側の数字で別管理する。
LINE側でLP経由を区別したい場合は、Lステップ等でLP専用の流入経路URLを発行し、管理画面「LINE・SEO・計測」タブの店舗別LINE URLに入力する（LINE URLに独自パラメータは付けていません）。

## 同意管理
LPでは Consent Mode v2 の既定値を設定（解析は現行サイト同様に有効、広告系Cookieは同意まで無効）。スクロール後に小さな同意バナーを表示し、「拒否」で解析・広告とも無効化。

## A/Bテスト
管理画面「LINE・SEO・計測」→ A/Bテストを有効化し、Bの文言を入れて公開。訪問者は50%ずつ固定で振り分けられ、全イベントに `lp_variant` が付く。
