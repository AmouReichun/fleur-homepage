import Link from "next/link";
import SalonReserveIcons from "@/app/components/SalonReserveIcons";

const salons = [
  {
    key: "fleurami",
    name: "fleurami",
    area: "高知県香南市野市町西野230",
    href: "/salon/fleurami",
    hotpepperUrl: "https://beauty.hotpepper.jp/slnH000528388/",
    phone: "0887-56-5566",
    instagramUrl: "https://www.instagram.com/fleurami_info",
    lineUrl: "https://liff.line.me/2000133690-w9PO3qD9/l/2fI1c0c94p/hair",
    webReserveUrl: "https://beauty.postas.asia/reserve/top?CODE=3df04abf87b551597a2b2595613d7d63b3843d96225b54738262420b60f751ff",
  },
  {
    key: "riv",
    name: "Riv. by fleurami",
    area: "高知県高知市",
    href: "/salon/riv",
    hotpepperUrl: "https://beauty.hotpepper.jp/slnH000634137/",
    phone: "088-884-5566",
    instagramUrl: "https://www.instagram.com/riv.kochi",
    lineUrl: "https://liff.line.me/2006084473-gbABZ6Lz/l/2a078394G2/hair",
    webReserveUrl: "https://beauty.postas.asia/reserve/top?CODE=440902d92d79129b32212b06e9514dc4f94094ed05e7ea4a5e1c175af56570a1",
  },
  {
    key: "raffine",
    name: "Raffine",
    area: "高知県高知市 はりまや橋周辺",
    href: "/salon/raffine",
    hotpepperUrl: "https://beauty.hotpepper.jp/kr/slnH000767549/",
    phone: "090-7120-5566",
    instagramUrl: "https://www.instagram.com/raffine0815",
    lineUrl: "https://liff.line.me/2007963689-Ddk29bRo/l/2N8fd97deza/kirei",
    webReserveUrl: "https://beauty.postas.asia/reserve/top?CODE=41e62da8591af0f29eb176ca79e4dff362421b2d78c581fe9500753350728f12",
  },
];

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
                  <SalonReserveIcons salon={salon} uid={`footer-${salon.key}`} showLabels={false} />
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
