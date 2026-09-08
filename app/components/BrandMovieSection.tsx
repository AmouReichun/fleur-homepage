"use client";
import { useRef, useState } from "react";
import Reveal from "./Reveal";

interface VideoCardProps {
  src: string;
  srcWebm?: string;
  label: string;
  labelColor: string;
  title: string;
  subtitle: string;
}

function VideoCard({ src, srcWebm, label, labelColor, title, subtitle }: VideoCardProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      if (v.readyState === 0) v.load();
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-black cursor-pointer" onClick={toggle}>
      <video
        ref={ref}
        className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        preload="none"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        {srcWebm && <source src={srcWebm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
      {/* Play / Pause オーバーレイ */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/30 transition-transform duration-200 group-hover:scale-110">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {/* ラベル */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
        <p className="text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: labelColor }}>{label}</p>
        <p className="text-base font-light text-white leading-snug">{title}</p>
        <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

export default function BrandMovieSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <Reveal className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-site-accent" />
            <span className="text-[10px] tracking-[0.45em] text-site-accent uppercase">Film</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white">ブランドムービー</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Reveal>
            <VideoCard
              src="/videos/fleur-brand.mp4"
              label="Hair Salon"
              labelColor="#BBA98A"
              title="fleur GROUP"
              subtitle="美容室 ブランドムービー"
            />
          </Reveal>
          <Reveal delay={140}>
            <VideoCard
              src="/videos/raffine-cm.mp4"
              srcWebm="/videos/raffine-cm.webm"
              label="Eyelash Salon"
              labelColor="#C8788A"
              title="Raffine"
              subtitle="アイラッシュサロン CM"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
