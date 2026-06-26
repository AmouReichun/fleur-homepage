import Link from "next/link";

const salons = [
  {
    name: "fleur ami",
    sub: "ヘアサロン",
    address: "高知県香南市野市町西野230",
    hours: "9:00〜18:00",
    closed: "月曜・第1/3火曜",
    hpb: "https://beauty.hotpepper.jp/slnH000528388/",
    instagram: "https://www.instagram.com/fleurami_info/",
  },
  {
    name: "Riv. by fleur ami",
    sub: "ヘアサロン",
    address: "高知県高知市南川添9-21 フルールアミー3 2F",
    hours: "9:30〜18:30",
    closed: "月曜・第1/3火曜",
    hpb: "https://beauty.hotpepper.jp/slnH000634137/",
    instagram: "https://www.instagram.com/riv.kochi/",
  },
  {
    name: "Raffine",
    sub: "マツエク・まゆげサロン",
    address: "高知県高知市はりまや町1-4-8 TNはりまやビル 3F",
    hours: "9:30〜18:30",
    closed: "不定休",
    hpb: "https://beauty.hotpepper.jp/kr/slnH000767549/",
    instagram: "https://www.instagram.com/raffine0815/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-group-bg border-t border-group-border mt-20">
      <div className="max-w-wide mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-xs text-group-muted tracking-widest uppercase mb-1">fleur group</p>
          <p className="text-sm text-group-muted">高知県のヘア・アイラッシュサロングループ</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {salons.map((salon) => (
            <div key={salon.name}>
              <p className="text-xs text-group-muted mb-1">{salon.sub}</p>
              <p className="font-medium text-group-text text-sm mb-2">{salon.name}</p>
              <p className="text-xs text-group-muted leading-relaxed">{salon.address}</p>
              <p className="text-xs text-group-muted mt-1">
                {salon.hours}　定休：{salon.closed}
              </p>
              <div className="flex gap-3 mt-2">
                <a
                  href={salon.hpb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  ホットペッパー
                </a>
                <a
                  href={salon.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-group-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <nav className="flex flex-wrap gap-4">
            <Link href="/blog/hair" className="text-xs text-group-muted hover:text-group-text transition-colors">
              ヘア症例
            </Link>
            <Link href="/blog/eyelash" className="text-xs text-group-muted hover:text-group-text transition-colors">
              アイラッシュ症例
            </Link>
            <Link href="/blog/about" className="text-xs text-group-muted hover:text-group-text transition-colors">
              グループについて
            </Link>
            <a
              href="https://www.fleurami-group.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-group-muted hover:text-group-text transition-colors"
            >
              フルールグループ 公式サイト ↗
            </a>
          </nav>
          <p className="text-xs text-group-muted">
            © {new Date().getFullYear()} fleur group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
