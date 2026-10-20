import Link from "next/link";
import Image from "next/image";
import Reveal from "@/app/components/Reveal";
import { ROLES } from "@/lib/recruit-roles";

type Stat = { label: string; value: string; suffix?: string };

// トップページの採用特集。数字・給与は content.json（recruit.stats）と lib/recruit-roles.ts から読む（ここに数字を直書きしない）。
const FEATURE_STAT_LABELS = ["有給取得率", "平均退勤", "スタッフ平均年齢", "店舗数"];
const PHOTOS = [
  { src: "/images/admin/staff-2-1782195045005.webp", alt: "fleurami スタイリストのスタッフ写真", cls: "col-span-1 translate-y-0" },
  { src: "/images/admin/staff-4-1782195059188.webp", alt: "Riv. by fleurami スタイリストのスタッフ写真", cls: "col-span-1 translate-y-8" },
  { src: "/images/admin/staff-7-1782195080215.webp", alt: "Raffine アイリストのスタッフ写真", cls: "col-span-1 translate-y-0" },
];

function manen(n: number) {
  return `${Math.round(n / 1000) / 10}`.replace(/\.0$/, "");
}

type Voice = { name?: string; role?: string; brand?: string; image?: string };

export default function RecruitFeature({ stats, voices }: { stats?: Stat[]; voices?: Voice[] }) {
  // 写真は管理画面「採用情報 → スタッフの声 → 画像」で差し替えられる。未設定のときだけ下の PHOTOS を使う
  const fromAdmin = (voices ?? []).filter((v) => v.image).slice(0, 3);
  const photos = fromAdmin.length === 3
    ? fromAdmin.map((v, i) => ({ src: v.image as string, alt: `${v.brand ?? ""} ${v.role ?? ""} ${v.name ?? ""}`.trim() + " のスタッフ写真", cls: PHOTOS[i].cls }))
    : PHOTOS;
  const shown = FEATURE_STAT_LABELS.map((l) => (stats ?? []).find((s) => s.label === l)).filter(Boolean) as Stat[];
  return (
    <section className="relative py-24 sm:py-32 bg-[#1a1a1a] overflow-hidden" aria-labelledby="recruit-feature-title">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #B8956A 0, transparent 55%)" }} />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px bg-site-accent" />
              <span className="text-xs tracking-[0.4em] text-site-accent uppercase">Recruit</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 id="recruit-feature-title" className="font-serif text-3xl sm:text-5xl font-light text-white leading-[1.5] tracking-[0.05em] mb-8">
                あなたの技術と感性を、<br />高知で咲かせませんか。
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-base text-white/70 leading-loose mb-10 max-w-lg">
                高知市・香南市の美容室2店とまつげサロン1店。勤務時間内のレッスン、外部講習の支援、完全週休2日制。
                「長く、好きな仕事を続けられる」環境を、スタッフと一緒につくっています。
              </p>
            </Reveal>

            {shown.length > 0 && (
              <Reveal delay={260}>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12 border-t border-white/15 pt-8">
                  {shown.map((s) => (
                    <div key={s.label}>
                      <dd className="font-serif text-3xl text-white">
                        {s.value}
                        {s.suffix && <span className="text-base text-white/60 ml-0.5">{s.suffix}</span>}
                      </dd>
                      <dt className="text-xs text-white/55 mt-1 leading-relaxed">{s.label}</dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            <Reveal delay={320} className="flex flex-wrap gap-4">
              <Link href="/recruit#entry" className="inline-flex items-center justify-center bg-site-accent text-white px-8 py-4 text-sm tracking-[0.15em] hover:brightness-110 transition">
                サロン見学・応募はこちら
              </Link>
              <Link href="/recruit" className="inline-flex items-center justify-center border border-white/40 text-white/90 px-8 py-4 text-sm tracking-[0.15em] hover:bg-white/10 transition">
                採用情報を見る
              </Link>
            </Reveal>
            <p className="text-xs text-white/45 mt-4">見学だけでもOK。美容学生・未経験・ブランクのある方も歓迎です。</p>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={150}>
              <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-10 pb-8">
                {photos.map((p) => (
                  <div key={p.src} className={`relative aspect-[3/4] overflow-hidden ${p.cls}`}>
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 20vw, 30vw" className="object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </Reveal>
            <ul className="divide-y divide-white/15 border-y border-white/15">
              {ROLES.map((r) => (
                <li key={r.slug}>
                  <Link href={`/recruit/${r.slug}`} className="flex items-center justify-between gap-4 py-5 group">
                    <span>
                      <span className="block text-white text-base sm:text-lg">{r.title}</span>
                      <span className="block text-xs text-white/55 mt-1">
                        月給 {manen(r.salaryRange.min)}万〜{manen(r.salaryRange.max)}万円 ／ {r.areas.join("・")}
                      </span>
                    </span>
                    <span className="text-xs tracking-[0.2em] text-site-accent group-hover:translate-x-1 transition-transform">詳しく見る →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
