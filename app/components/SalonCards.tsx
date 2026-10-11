import Link from "next/link";
import Image from "next/image";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";

type Salon = {
  key: string;
  href: string;
  name: string;
  area: string;
  salonType: string;
  description: string;
  tagline?: string;
  features: string[];
  imageSrc: string;
  hotpepperUrl: string;
  phone: string;
  instagramUrl: string;
  lineUrl?: string;
  webReserveUrl?: string;
};

// 3店舗を同時に比べられるカード（自動スライドをやめた版）。強みは先頭3つだけ表示して見やすくする。
export default function SalonCards({ salons }: { salons: Salon[] }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid gap-10 lg:grid-cols-3">
      {salons.map((s, i) => (
        <article key={s.key} className="group flex flex-col bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] border border-site-greige/60">
          <Link href={s.href} className="block relative aspect-[4/3] overflow-hidden bg-site-light" aria-label={`${s.name}の店舗詳細`}>
            {s.imageSrc && (
              <Image
                src={s.imageSrc}
                alt={`${s.name}（${s.area}の${s.salonType}）`}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                priority={i === 0}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute left-5 bottom-4 text-xs tracking-[0.3em] text-white/90">
              {s.area} — {s.salonType}
            </span>
          </Link>

          <div className="flex flex-col flex-1 px-7 sm:px-8 py-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-4">
              <Link href={s.href} className="hover:text-site-accent transition-colors">{s.name}</Link>
            </h3>
            <p className="text-[15px] text-site-muted leading-loose mb-6">{s.description || s.tagline}</p>
            <ul className="flex flex-wrap gap-2 mb-8">
              {s.features.slice(0, 3).map((f) => (
                <li key={f} className="text-xs tracking-wider border border-site-greige text-site-muted px-3 py-1.5">{f}</li>
              ))}
            </ul>
            <div className="mt-auto">
              <p className="text-xs tracking-[0.2em] text-site-accent uppercase mb-3">Reservation</p>
              <SalonReserveIcons salon={s} uid={s.key} />
              <Link href={s.href} className="inline-flex items-center gap-3 text-sm tracking-[0.12em] text-site-text hover:text-site-accent transition-colors group/l mt-7">
                <span>店舗詳細を見る</span>
                <span className="w-6 h-px bg-current group-hover/l:w-10 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
