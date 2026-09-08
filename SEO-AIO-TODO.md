# SEO・AIO 管理者入力 TODO

**最終更新:** 2026年9月9日

このファイルには、実際のデータが必要な項目をまとめています。  
架空の数値を入力しないでください。空欄のまま `null` で管理し、実数値が確認できたときだけ更新します。

---

## 🔴 最優先（Google・AIの正確な引用に関わる）

### 1. Google 口コミ件数・評価の最新値確認

**現在の値（要確認）:**

| 店舗 | 現在の ratingValue | 現在の ratingCount | 最終確認日 |
|------|--------------------|--------------------|------------|
| Riv. by fleurami | 4.65 | 674件 | 不明 |
| fleurami | 4.67 | 388件 | 不明 |
| Raffine | 4.82 | 200件（概算） | 不明 |

**更新箇所:**
- `lib/structured-data.ts` → `rivSalonSchema.aggregateRating`
- `lib/structured-data.ts` → `fleuramiSalonSchema.aggregateRating`
- `lib/structured-data.ts` → `raffineSalonSchema.aggregateRating`
- `app/llms.txt/route.ts` → 各店舗の件数テキスト
- `lib/areas.ts` → FAQ の件数テキスト

**確認方法:** 各店舗のGoogleマップページを開き、クチコミ件数・評価を確認する。

---

## 🟡 重要（専門性・信頼性に関わる）

### 2. スタッフ詳細プロフィール

管理者は `/admin/staff` から各スタッフの以下を入力してください。

#### fleurami

| スタッフ | 得意技術 (specialties) | 得意スタイル (styles) | 得意年代 | Instagram URL |
|----------|------------------------|----------------------|----------|---------------|
| 西内みゆき | 髪質改善・白髪ぼかし（記入済） | 未入力 | 未入力 | 未入力 |
| 山岡悠弥 | 縮毛矯正・似合わせカット | 未入力 | 未入力 | 未入力 |
| 川上凛 | 艶カラー | 未入力 | 未入力 | 未入力 |
| 高田和花 | 未入力 | 未入力 | 未入力 | 未入力 |

#### Riv. by fleurami

| スタッフ | 得意技術 (specialties) | 得意スタイル (styles) | 得意年代 | Instagram URL |
|----------|------------------------|----------------------|----------|---------------|
| 西森心大 | 縮毛矯正（`specialties: []` → 要入力） | 未入力 | 未入力 | 未入力 |
| 細川彩香 | 白髪ぼかし・グレイカラー（記入済） | 未入力 | 未入力 | 未入力 |
| 沢村瑞希 | 似合わせカット（記入済） | 未入力 | 未入力 | 未入力 |
| 西田ななみ | 未入力 | 未入力 | 未入力 | 未入力 |
| 高木太久馬 | 未入力 | 未入力 | 未入力 | 未入力 |

#### Raffine

| スタッフ | アイリスト歴 (history) | 得意施術 (specialties) | Instagram URL |
|----------|------------------------|------------------------|---------------|
| やすい | 未入力 | まつげパーマ・ラッシュリフト | 未入力 |
| おざき | 未入力 | まつげパーマ・眉毛WAX | 未入力 |
| おおの | 未入力 | マツエク・眉毛WAX | 未入力 |
| くろせ | 未入力 | 眉毛WAX | 未入力 |

---

### 3. 年間施術件数（`data/salon-stats.json` の `_annualStats` セクション）

実際のPOSデータや記録から数値を確認して入力してください。  
**絶対に架空の件数を入力しないこと。**

```json
"_annualStats": {
  "fleurami": {
    "対象年": "2026",            ← 対象年を入力
    "髪質改善トリートメント件数": null,   ← 実数を入力
    "縮毛矯正件数": null,
    "白髪ぼかし件数": null,
    "カラー件数": null,
    "カット件数": null,
    "新規来店件数": null
  },
  ...
}
```

入力後は `lib/structured-data.ts` のサロン説明文やブログ記事で活用可能です。

---

## 🟢 推奨（将来的に追加すると効果的）

### 4. 各スタッフの担当 Instagram URL
各スタッフが個人 Instagram を持っている場合は `instagramUrl` フィールドに入力。  
Person Schema の `sameAs` に自動で追加されます。

### 5. fleur GROUP 公式 YouTube・TikTok URL
動画コンテンツがある場合は `lib/structured-data.ts` の `organizationSchema.sameAs` に追記。

### 6. Raffine の正確な Google クチコミ件数
`raffineSalonSchema.aggregateRating.ratingCount: 200` は概算値です。  
Googleマップで正確な件数を確認し、更新してください。

---

## 📋 定期メンテナンス（月1回推奨）

- [ ] Google クチコミ件数・評価の確認（3店舗）
- [ ] llms.txt の件数テキスト更新
- [ ] `lib/structured-data.ts` の aggregateRating 更新
- [ ] スタッフの追加・退職があった場合は `/admin/staff` から更新

---

## 🔧 開発者向け TODO

- [ ] `salon-stats.json` の `_annualStats` を管理画面（/admin）から編集できるUIを追加
- [ ] Google クチコミの自動取得・定期更新の仕組みを検討（Places API）
- [ ] `/company/media/` プレスページの実装（メディア・取材問い合わせ窓口）
- [ ] 高品質な記事テンプレートの実装（`/guide/` 配下への展開）
