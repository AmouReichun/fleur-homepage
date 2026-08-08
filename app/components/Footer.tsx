import Link from "next/link";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";
import { reserveSalons as salons } from "@/app/components/reserveSalons";

const links = [
  { href: "/menu", label: "メニュー" },
  { href: "/area/kochi", label: "高知市のメニュー" },
  { href: "/area/konan", label: "香南市のメニュー" },
  { href: "/staff", label: "スタッフ" },
  { href: "/recruit", label: "採用情報" },
  { href: "/company", label: "会社概要" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-base tracking-[0.2em] font-medium mb-3">fleur GROUP</p>
            <p className="text-xs text-white/40 mb-5 tracking-wider">高知の美容室・アイラッシュサロン</p>
            <p className="text-xs text-white/50 leading-loose">
              高知市・香南市で美容室2店舗、<br />
              アイラッシュサロン1店舗を展開。<br />
              お客様の「なりたい」を叶えます。
            </p>
          </div>

          {/* 店舗 NAP */}
          <div>
            <p className="text-[10px] tracking-[0.35em] text-site-accent mb-5 uppercase">Salons</p>
            <ul className="space-y-5">
              {salons.map((salon) => (
                <li key={salon.href}>
                  <Link href={salon.href} className="text-sm text-white/80 hover:text-white transition-colors duration-200 font-medium block mb-0.5">
                    {salon.name}
                  </Link>
                  <p className="text-xs text-white/35 mb-2">{salon.area}</p>
                  <SalonReserveIcons salon={salon} uid={`footer-${salon.key}`} showLabels={false} compact />
                </li>
              ))}
            </ul>
          </div>

          {/* サイトマップ */}
          <div>
            <p className="text-[10px] tracking-[0.35em] text-site-accent mb-5 uppercase">Menu</p>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/50 hover:text-white/90 transition-colors duration-200 tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/blog"
                  className="text-xs text-white/50 hover:text-white/90 transition-colors duration-200 tracking-wider"
                >
                  症例ブログ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-white/25 tracking-wider">
            &copy; {new Date().getFullYear()} fleur GROUP. All rights reserved.
          </p>
          <p className="text-[10px] text-white/25 tracking-wider">
            株式会社フルール・アミー / 株式会社フルール・ロータス
          </p>
        </div>
      </div>
    </footer>
  );
}
