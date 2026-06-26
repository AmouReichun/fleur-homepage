import Link from "next/link";
import { getAllPosts, getPostsForSearch } from "@/lib/blog/posts";
import ArticleCard from "@/components/ArticleCard";
import HomeSearchBar from "@/components/HomeSearchBar";

export default function HomePage() {
  const hairPosts = getAllPosts("hair").slice(0, 3);
  const eyelashPosts = getAllPosts("eyelash").slice(0, 3);
  const allPosts = getPostsForSearch();

  return (
    <>
      {/* Hero */}
      <section className="bg-group-bg border-b border-group-border py-16 sm:py-24 px-4">
        <div className="max-w-wide mx-auto">
          <p className="text-xs tracking-widest text-group-muted uppercase mb-4 font-dm">
            fleur group — Beauty Column &amp; Cases
          </p>
          <h1 className="font-mincho font-medium text-group-text mb-5 max-w-xl">
            <span className="block whitespace-nowrap text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide">
              高知の美容師・アイリストによる
            </span>
            <span className="block text-lg sm:text-2xl lg:text-3xl leading-relaxed tracking-wide">
              施術例とコラム
            </span>
          </h1>
          <p className="text-sm sm:text-base text-group-muted leading-relaxed max-w-xl mb-8">
            fleur ami（香南市）・Riv.（高知市）のヘアスタイリスト、
            <br />
            Raffine（高知市）のアイリストが、
            <br />
            施術の実例と知識を解説します。
          </p>

          {/* インライン検索 */}
          <HomeSearchBar posts={allPosts} />
        </div>
      </section>

      {/* Hair section */}
      <section
        className="py-14 px-4"
        style={{
          background: `
            repeating-linear-gradient(
              88deg,
              transparent 0px, transparent 3px,
              rgba(160,120,72,0.025) 3px, rgba(160,120,72,0.04) 4px,
              transparent 4px, transparent 11px,
              rgba(160,120,72,0.02) 11px, rgba(160,120,72,0.035) 12px,
              transparent 12px, transparent 22px
            ),
            linear-gradient(160deg, #F8F2EA 0%, #F1E7D8 50%, #EAD9C4 100%)
          `,
        }}
      >
        <div className="max-w-wide mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-1 rounded-full bg-hair-accent-warm" />
                <p className="text-xs text-hair-accent-warm tracking-[0.18em] uppercase font-cormorant">
                  fleur ami &amp; Riv. — Hair
                </p>
              </div>
              <h2 className="font-mincho text-xl sm:text-2xl font-medium text-hair-text tracking-wide">
                ヘア症例・コラム
              </h2>
            </div>
            <Link
              href="/blog/hair"
              className="text-sm text-hair-accent hover:text-hair-accent-warm transition-colors underline underline-offset-4"
            >
              すべて見る
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hairPosts.map((post, i) => (
              <ArticleCard key={post.slug} post={post} world="hair" priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Eyelash section */}
      <section className="py-14 px-4" style={{ background: "linear-gradient(160deg, #FBF8F8 0%, #F9EEF1 60%, #F5E6EA 100%)" }}>
        <div className="max-w-wide mx-auto">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-1 rounded-full bg-eye-accent" />
                <p className="text-xs text-eye-accent tracking-[0.18em] uppercase font-jakarta">
                  Raffine — Lash &amp; Brow
                </p>
              </div>
              <h2 className="font-kaku text-xl sm:text-2xl font-medium text-eye-text">
                まつげ・まゆげ症例・コラム
              </h2>
            </div>
            <Link
              href="/blog/eyelash"
              className="text-sm text-eye-accent hover:text-eye-accent/80 transition-colors underline underline-offset-4"
            >
              すべて見る
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eyelashPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} world="eyelash" />
            ))}
          </div>
        </div>
      </section>

      {/* About CTA */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #111009 0%, #1E1810 45%, #160F0A 100%)",
        }}
      >
        {/* 金の横ライン — 上 */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent 0%, #C8A860 30%, #E8C87A 50%, #C8A860 70%, transparent 100%)" }} />

        {/* 背景装飾：大きなローマ数字 */}
        <span
          className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-cormorant font-bold italic leading-none select-none pointer-events-none text-[200px] sm:text-[320px]"
          style={{ color: "rgba(200,168,96,0.032)", letterSpacing: "-0.05em" }}
          aria-hidden="true"
        >
          III
        </span>

        {/* 背景装飾：細かいドット格子 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(200,168,96,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)",
          }}
        />

        <div className="max-w-wide mx-auto px-4 py-20 sm:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* 左：テキストブロック */}
            <div className="flex-1 flex flex-col justify-center">
              {/* ラベル行 */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8" style={{ background: "#C8A860" }} />
                <span className="text-[9px] tracking-[0.5em] font-cormorant uppercase" style={{ color: "#C8A860" }}>
                  Fleur Group
                </span>
                <div className="h-px w-8" style={{ background: "#C8A86060" }} />
              </div>

              {/* 日本語タイトル */}
              <h2
                className="font-mincho font-medium leading-[1.6] tracking-[0.2em] mb-2"
                style={{ color: "#EDE0C8", fontSize: "clamp(1.2rem, 2.5vw, 1.9rem)" }}
              >
                フルールグループとは
              </h2>

              {/* 英語サブタイトル */}
              <p
                className="font-cormorant italic text-base sm:text-lg tracking-widest mb-8"
                style={{ color: "#7A6848" }}
              >
                Hair &amp; Beauty
              </p>

              {/* 区切りライン */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12" style={{ background: "linear-gradient(to right, #C8A860, transparent)" }} />
                <div className="w-1 h-1 rounded-full" style={{ background: "#C8A86060" }} />
              </div>

              {/* 本文 */}
              <p className="text-sm leading-[2.1] mb-10 max-w-[340px]" style={{ color: "#7A7060" }}>
                高知県内に3店舗を展開する、<br />
                ヘア・まつげ・まゆげサロングループです。<br />
                それぞれの専門性を活かして<br />
                「なりたい」に向き合います。
              </p>

              {/* CTAボタン */}
              <div>
                <Link
                  href="/blog/about"
                  className="inline-flex items-center gap-4 group"
                >
                  <span
                    className="flex items-center justify-center w-10 h-10 border transition-all group-hover:scale-110"
                    style={{ borderColor: "#C8A86060", borderRadius: "50%" }}
                  >
                    <span className="text-sm" style={{ color: "#C8A860" }}>→</span>
                  </span>
                  <span
                    className="text-[11px] tracking-[0.3em] uppercase font-cormorant transition-opacity group-hover:opacity-60"
                    style={{ color: "#C8A860" }}
                  >
                    グループ紹介を読む
                  </span>
                </Link>
              </div>
            </div>

            {/* 右：3サロンカード */}
            <div className="lg:w-[380px] flex flex-col justify-center gap-0">
              {/* セクションラベル */}
              <p className="text-[9px] tracking-[0.4em] uppercase font-cormorant mb-5" style={{ color: "#4A4030" }}>
                Our Salons — 3 Locations
              </p>

              {[
                {
                  num: "01",
                  name: "fleur ami",
                  nameJa: "フルールアミー",
                  type: "Hair Salon",
                  area: "高知県香南市",
                  accent: "#BBA98A",
                  hpbUrl: "https://beauty.hotpepper.jp/slnH000528388/",
                },
                {
                  num: "02",
                  name: "Riv. by fleur ami",
                  nameJa: "リヴ バイ フルールアミー",
                  type: "Hair Salon",
                  area: "高知県高知市",
                  accent: "#BBA98A",
                  hpbUrl: "https://beauty.hotpepper.jp/slnH000634137/",
                },
                {
                  num: "03",
                  name: "Raffine",
                  nameJa: "ラフィーネ",
                  type: "Lash & Brow",
                  area: "高知県高知市",
                  accent: "#C8788A",
                  hpbUrl: "https://beauty.hotpepper.jp/kr/slnH000767549/",
                },
              ].map((s, i) => (
                <div
                  key={s.name}
                  className="relative flex items-stretch gap-5 py-6"
                  style={{
                    borderTop: i === 0 ? `1px solid ${s.accent}30` : undefined,
                    borderBottom: `1px solid ${s.accent}20`,
                  }}
                >
                  {/* 番号 */}
                  <span
                    className="font-cormorant font-bold italic text-2xl leading-none pt-0.5 w-8 shrink-0"
                    style={{ color: `${s.accent}40` }}
                  >
                    {s.num}
                  </span>

                  {/* テキスト */}
                  <div className="flex-1">
                    <a
                      href={s.hpbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-cormorant text-xl tracking-wide leading-none mb-1 block hover:opacity-70 transition-opacity"
                      style={{ color: "#C8BCA8" }}
                    >
                      {s.name}
                    </a>
                    <p
                      className="text-[9px] tracking-[0.18em] font-mincho mb-2"
                      style={{ color: "#4A4030" }}
                    >
                      {s.nameJa}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
                        style={{
                          color: s.accent,
                          border: `1px solid ${s.accent}40`,
                          borderRadius: "1px",
                        }}
                      >
                        {s.type}
                      </span>
                      <span className="text-[9px] tracking-wide" style={{ color: "#3A3020" }}>
                        {s.area}
                      </span>
                    </div>
                  </div>

                  {/* アクセントライン右 */}
                  <div
                    className="w-0.5 shrink-0 self-stretch"
                    style={{ background: `linear-gradient(to bottom, ${s.accent}60, transparent)` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 金の横ライン — 下 */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent 0%, #C8A86040 50%, transparent 100%)" }} />
      </section>
    </>
  );
}
