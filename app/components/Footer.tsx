import Link from "next/link";

const salons = [
  {
    name: "fleurami",
    area: "高知県香南市野市町西野230",
    href: "/salon/fleurami",
    hotpepper: "https://beauty.hotpepper.jp/slnH000528388/",
  },
  {
    name: "Riv.by fleurami",
    area: "高知県高知市",
    href: "/salon/riv",
    hotpepper: "https://beauty.hotpepper.jp/slnH000634137/",
  },
  {
    name: "Raffine",
    area: "高知県高知市 はりまや橋周辺",
    href: "/salon/raffine",
    hotpepper: "https://beauty.hotpepper.jp/kr/slnH000767549/",
  },
];

const links = [
  { href: "/menu", label: "メニュー" },
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
                  <p className="text-xs text-white/35 mb-1">{salon.area}</p>
                  <a
                    href={salon.hotpepper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-site-accent/70 hover:text-site-accent transition-colors tracking-wider"
                  >
                    ホットペッパーで予約 →
                  </a>
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
                  href="https://fleurami-group-blog.com"
                  target="_blank"
                  rel="noopener noreferrer"
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
