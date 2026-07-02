import { Metadata } from "next";
import Link from "next/link";
import { localBusinessSchema } from "@/lib/blog/structured-data";

export const metadata: Metadata = {
  title: "フルールグループとは",
  description:
    "高知県のヘアサロン fleur ami（香南市）・Riv.（高知市）と、まつ毛パーマ・マツエク・まゆげ専門サロン Raffine（高知市はりまや）を展開するグループ。白髪ぼかし・艶カラー・髪質改善・まつげパーマ・マツエクを得意とする。",
  alternates: { canonical: "/blog/about" },
};

const salonDetails = [
  {
    key: "fleurami" as const,
    name: "fleur ami",
    nameJa: "フルールアミー",
    category: "Hair Salon",
    categoryJa: "ヘアサロン",
    address: "高知県香南市野市町西野230",
    hours: "9:00〜18:00",
    closed: "月曜・第1/3火曜",
    access: "のいち駅から車4分 / 土佐山田駅から車8分。駐車場7台（無料・先着）",
    features: ["艶カラー", "白髪ぼかし", "髪質改善", "縮毛矯正", "カット"],
    target: "大人女性",
    rating: 4.67,
    reviewCount: 388,
    hpb: "https://beauty.hotpepper.jp/slnH000528388/",
    instagram: "https://www.instagram.com/fleurami_info/",
    accentColor: "#BBA98A",
    bgFrom: "#F8F2EA",
    bgTo: "#EAD9C4",
    listLink: "/blog/hair",
    num: "01",
  },
  {
    key: "riv" as const,
    name: "Riv. by fleur ami",
    nameJa: "リヴ バイ フルールアミー",
    category: "Hair Salon",
    categoryJa: "ヘアサロン",
    address: "高知県高知市南川添9-21 フルールアミー3 2F",
    hours: "9:30〜18:30",
    closed: "月曜・第1/3火曜",
    access: "高知ICから車4分 / 高知駅から車5分。駐車場5台（先着・無料）",
    features: ["髪質改善", "縮毛矯正", "ハイライト", "白髪ぼかし", "似合わせカット"],
    target: "20歳代〜40歳代",
    rating: 4.65,
    reviewCount: 674,
    hpb: "https://beauty.hotpepper.jp/slnH000634137/",
    instagram: "https://www.instagram.com/riv.kochi/",
    accentColor: "#BBA98A",
    bgFrom: "#F8F2EA",
    bgTo: "#EAD9C4",
    listLink: "/blog/hair",
    num: "02",
  },
  {
    key: "raffine" as const,
    name: "Raffine",
    nameJa: "ラフィーネ",
    category: "Eyelash & Brow Salon",
    categoryJa: "まつ毛パーマ・マツエク・まゆげサロン",
    address: "高知県高知市はりまや町1-4-8 TNはりまやビル 3F",
    hours: "9:30〜18:30（電話受付 9:30〜17:30）",
    closed: "不定休",
    access: "はりまや橋から徒歩3分 / 蓮池町通駅から徒歩1分。近隣コインパーキング",
    features: ["マツエク", "まつげパーマ", "パリジェンヌ", "眉毛WAX", "韓国束感"],
    target: "20歳代中心・半個室",
    rating: 4.82,
    reviewCount: 200,
    hpb: "https://beauty.hotpepper.jp/kr/slnH000767549/",
    instagram: "https://www.instagram.com/raffine0815/",
    accentColor: "#C8788A",
    bgFrom: "#FBF8F8",
    bgTo: "#F5E6EA",
    listLink: "/blog/eyelash",
    num: "03",
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  return (
    <span className="flex items-center gap-0.5" aria-label={`評価 ${rating}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            color: i < full || (i === full && half) ? "#C8A860" : "#D4C4A8",
            fontSize: "0.75rem",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function AboutPage() {
  return (
    <>
      {salonDetails.map((s) => (
        <script
          key={s.key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(s.key)) }}
        />
      ))}

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <div
        className="relative overflow-hidden px-4 py-24 sm:py-36"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(180,140,70,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(180,140,70,0.10) 0%, transparent 45%), linear-gradient(150deg, #16130F 0%, #231C13 45%, #1A1410 100%)",
        }}
      >
        {/* 装飾ライン 上 */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #C8A860, transparent)" }}
        />

        {/* 透かし文字 */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[130px] sm:text-[230px] font-cormorant italic font-semibold leading-none select-none pointer-events-none whitespace-nowrap tracking-tighter"
          style={{ color: "rgba(200,168,96,0.045)" }}
          aria-hidden="true"
        >
          fleur group
        </span>

        <div className="max-w-wide mx-auto relative z-10">
          {/* ── 上部ラベル ── */}
          <div className="flex items-center justify-center gap-5 mb-10">
            <div
              className="h-px w-16 sm:w-24"
              style={{ background: "linear-gradient(to right, transparent, #C8A860)" }}
            />
            <span
              className="text-[9px] sm:text-[10px] tracking-[0.4em] font-cormorant uppercase"
              style={{ color: "#C8A860" }}
            >
              Fleur Group — Kochi, Japan
            </span>
            <div
              className="h-px w-16 sm:w-24"
              style={{ background: "linear-gradient(to left, transparent, #C8A860)" }}
            />
          </div>

          {/* ── メインタイトル ── */}
          <h1
            className="font-kaku font-normal text-3xl sm:text-[2.75rem] leading-loose tracking-[0.55em] text-center mb-8"
            style={{ color: "#DDD0B8" }}
          >
            フルールグループ
          </h1>

          <p
            className="text-center text-sm sm:text-base leading-loose max-w-lg mx-auto mb-10"
            style={{ color: "#8A7860" }}
          >
            高知県に3店舗を展開する美容グループ。
            <br />
            ヘアと目元、それぞれの専門性で「なりたい」に向き合います。
          </p>

          {/* ── 3店舗バッジ ── */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              { name: "fleur ami", sub: "Hair · 香南市", hpb: "https://beauty.hotpepper.jp/slnH000528388/" },
              { name: "Riv. by fleur ami", sub: "Hair · 高知市", hpb: "https://beauty.hotpepper.jp/slnH000634137/" },
              { name: "Raffine", sub: "Lash & Brow · 高知市", hpb: "https://beauty.hotpepper.jp/kr/slnH000767549/" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.hpb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center group"
              >
                <p
                  className="font-cormorant text-base sm:text-lg tracking-widest mb-0.5 transition-opacity group-hover:opacity-60"
                  style={{ color: "#C8A860" }}
                >
                  {s.name}
                </p>
                <p className="text-[10px] tracking-[0.18em]" style={{ color: "#5A5040" }}>
                  {s.sub}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* 装飾ライン 下 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #C8A86040, transparent)" }}
        />
      </div>

      {/* ═══════════════════════════════════════
          PHILOSOPHY STRIP
      ═══════════════════════════════════════ */}
      <div
        className="py-12 px-4 border-y"
        style={{
          background: "linear-gradient(90deg, #F4EDE3, #F9F5EF, #F4EDE3)",
          borderColor: "#D4C4A8",
        }}
      >
        <div className="max-w-wide mx-auto flex flex-col sm:flex-row gap-8 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x"
          style={{ borderColor: "#D4C4A8" }}>
          {[
            { en: "Specialist", ja: "専門性", desc: "ヘア・目元それぞれの専門スタッフが対応" },
            { en: "Quality", ja: "仕上がり", desc: "一人ひとりの髪質・目元に合わせた提案" },
            { en: "Trust", ja: "信頼感", desc: "高知のお客様に長く愛されるサロンを目指して" },
          ].map((item) => (
            <div
              key={item.en}
              className="flex-1 text-center px-6 sm:px-10 py-4 sm:py-0"
            >
              <p
                className="font-cormorant text-xs tracking-[0.3em] uppercase mb-1"
                style={{ color: "#C8A860" }}
              >
                {item.en}
              </p>
              <p
                className="font-mincho text-xl font-medium mb-2"
                style={{ color: "#1A1818" }}
              >
                {item.ja}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#6B6460" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SALONS
      ═══════════════════════════════════════ */}
      <div
        className="px-4 py-16 sm:py-24"
        style={{ background: "linear-gradient(180deg, #F9F5EF 0%, #F4EDE3 100%)" }}
      >
        <div className="max-w-wide mx-auto">

          {/* セクションヘッダー */}
          <div className="flex items-center gap-5 mb-14">
            <div className="h-px flex-1" style={{ background: "linear-gradient(to right, #D4C4A8, transparent)" }} />
            <span
              className="text-[10px] tracking-[0.35em] font-cormorant uppercase"
              style={{ color: "#A89060" }}
            >
              Our Salons
            </span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(to left, #D4C4A8, transparent)" }} />
          </div>

          {/* サロンカード一覧 */}
          <div className="space-y-10">
            {salonDetails.map((salon, idx) => (
              <section
                key={salon.key}
                className="relative overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  borderRadius: "3px",
                  boxShadow: "0 4px 32px rgba(100,80,40,0.08), 0 1px 4px rgba(100,80,40,0.05)",
                }}
              >
                {/* 左アクセントバー */}
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ background: `linear-gradient(to bottom, ${salon.accentColor}, ${salon.accentColor}80)` }}
                />

                {/* 番号ウォーターマーク */}
                <span
                  className="absolute top-4 right-6 font-cormorant font-bold italic select-none pointer-events-none text-[80px] sm:text-[100px] leading-none"
                  style={{ color: `${salon.accentColor}10` }}
                  aria-hidden="true"
                >
                  {salon.num}
                </span>

                <div className="pl-6 pr-6 sm:pr-10 pt-8 pb-8">

                  {/* ── カードヘッダー ── */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
                    <div>
                      {/* カテゴリラベル */}
                      <p
                        className="text-[10px] tracking-[0.3em] font-cormorant uppercase mb-2"
                        style={{ color: salon.accentColor }}
                      >
                        {salon.category}
                      </p>

                      {/* サロン名 */}
                      <h2 className="font-cormorant text-3xl sm:text-4xl font-medium leading-none mb-1.5">
                        <a
                          href={salon.hpb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-opacity hover:opacity-60"
                          style={{ color: "#1A1818" }}
                        >
                          {salon.name}
                        </a>
                      </h2>
                      <p
                        className="text-xs tracking-[0.2em] font-mincho"
                        style={{ color: "#A89880" }}
                      >
                        {salon.nameJa}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2.5 sm:items-end">
                      {/* 評価 */}
                      <div className="flex items-center gap-2">
                        <Stars rating={salon.rating} />
                        <span className="font-dm text-sm font-medium" style={{ color: "#C8A860" }}>
                          {salon.rating.toFixed(2)}
                        </span>
                        <span className="text-[11px]" style={{ color: "#A89880" }}>
                          ({salon.reviewCount}件)
                        </span>
                      </div>

                      {/* 外部リンク */}
                      <div className="flex items-center gap-4">
                        <a
                          href={salon.hpb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] tracking-[0.15em] uppercase font-cormorant transition-opacity hover:opacity-70"
                          style={{ color: salon.accentColor }}
                        >
                          HotPepper →
                        </a>
                        <a
                          href={salon.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] tracking-[0.15em] uppercase font-cormorant transition-opacity hover:opacity-70"
                          style={{ color: salon.accentColor }}
                        >
                          Instagram →
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ── 区切りライン ── */}
                  <div
                    className="mb-7 h-px"
                    style={{ background: `linear-gradient(to right, ${salon.accentColor}40, transparent)` }}
                  />

                  {/* ── サロン詳細グリッド ── */}
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-8">
                    {[
                      { label: "Address", value: salon.address },
                      { label: "Access", value: salon.access },
                      { label: "Hours", value: `${salon.hours}　定休：${salon.closed}` },
                      { label: "For", value: salon.target },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-3">
                        {/* ラベル縦棒 */}
                        <div
                          className="w-0.5 shrink-0 mt-0.5 rounded-full"
                          style={{ background: `${salon.accentColor}60`, minHeight: "1.1em" }}
                        />
                        <div>
                          <dt
                            className="text-[9px] tracking-[0.25em] uppercase font-cormorant mb-1"
                            style={{ color: salon.accentColor }}
                          >
                            {label}
                          </dt>
                          <dd className="text-sm leading-relaxed" style={{ color: "#3A3530" }}>
                            {value}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>

                  {/* ── メニュータグ ── */}
                  <div className="mb-7">
                    <p
                      className="text-[9px] tracking-[0.25em] uppercase font-cormorant mb-3"
                      style={{ color: salon.accentColor }}
                    >
                      Menu
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {salon.features.map((f) => (
                        <span
                          key={f}
                          className="text-xs px-4 py-1.5 font-mincho transition-colors"
                          style={{
                            border: `1px solid ${salon.accentColor}50`,
                            background: `${salon.accentColor}0C`,
                            color: "#4A4038",
                            borderRadius: "1px",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ── 記事リンク ── */}
                  <div
                    className="pt-5 flex items-center justify-between"
                    style={{ borderTop: `1px solid ${salon.accentColor}25` }}
                  >
                    <Link
                      href={salon.listLink}
                      className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-cormorant transition-opacity hover:opacity-70"
                      style={{ color: salon.accentColor }}
                    >
                      <span>{salon.categoryJa}の症例・コラムを読む</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                    <span
                      className="font-cormorant text-5xl font-bold italic leading-none select-none hidden sm:block"
                      style={{ color: `${salon.accentColor}18` }}
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* ── グループ注記 ── */}
          <div
            className="mt-16 pt-10 flex items-start gap-5"
            style={{ borderTop: "1px solid #D4C4A8" }}
          >
            <div
              className="w-px shrink-0 mt-1"
              style={{ height: "3.5rem", background: "linear-gradient(to bottom, #C8A860, transparent)" }}
            />
            <div className="space-y-1.5">
              <p className="text-xs leading-loose break-keep" style={{ color: "#A89070" }}>
                fleur ami・Riv. by fleur ami は<span style={{ color: "#7A6850" }}>株式会社フルール・アミー</span>が運営します。
              </p>
              <p className="text-xs leading-loose break-keep" style={{ color: "#A89070" }}>
                Raffine（まつげ・まゆげ専門店）は<span style={{ color: "#7A6850" }}>株式会社フルール・ロータス</span>が運営します。
              </p>
              <p className="text-xs leading-loose break-keep" style={{ color: "#A89070" }}>
                両社は同一グループとして連携して活動しています。今後も高知県内でのサロン展開を検討しています。
              </p>
            </div>
          </div>

          {/* ── 公式サイト CTA ── */}
          <div className="mt-10 text-center">
            <a
              href="https://fleur-group.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-[0.2em] font-cormorant transition-opacity hover:opacity-70"
              style={{
                border: "1px solid #C8A860",
                color: "#C8A860",
                borderRadius: "1px",
              }}
            >
              フルールグループ 公式サイトを見る →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
