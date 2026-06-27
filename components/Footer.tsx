import Link from "next/link";

const salons = [
  {
    name: "fleur ami",
    sub: "ヘアサロン",
    address: "高知県香南市野市町西野230",
    hours: "9:00〜18:00",
    closed: "月曜・第1/3火曜",
    tel: "0887-56-5566",
    web: "https://beauty.postas.asia/reserve/top?CODE=3df04abf87b551597a2b2595613d7d63b3843d96225b54738262420b60f751ff",
    line: "https://liff.line.me/2000133690-w9PO3qD9/l/2fI1c0c94p/hair",
    hpb: "https://beauty.hotpepper.jp/slnH000528388/",
    instagram: "https://www.instagram.com/fleurami_info/",
  },
  {
    name: "Riv. by fleur ami",
    sub: "ヘアサロン",
    address: "高知県高知市南川添9-21 フルールアミー3 2F",
    hours: "9:30〜18:30",
    closed: "月曜・第1/3火曜",
    tel: "088-884-5566",
    web: "https://beauty.postas.asia/reserve/top?CODE=440902d92d79129b32212b06e9514dc4f94094ed05e7ea4a5e1c175af56570a1",
    line: "https://liff.line.me/2006084473-gbABZ6Lz/l/2a078394G2/hair",
    hpb: "https://beauty.hotpepper.jp/slnH000634137/",
    instagram: "https://www.instagram.com/riv.kochi/",
  },
  {
    name: "Raffine",
    sub: "マツエク・まゆげサロン",
    address: "高知県高知市はりまや町1-4-8 TNはりまやビル 3F",
    hours: "9:30〜18:30",
    closed: "不定休",
    tel: "090-7120-5566",
    web: "https://beauty.postas.asia/reserve/top?CODE=41e62da8591af0f29eb176ca79e4dff362421b2d78c581fe9500753350728f12",
    line: "https://liff.line.me/2007963689-Ddk29bRo/l/2N8fd97deza/kirei",
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
              <p className="text-[10px] text-group-muted/70 tracking-wider mt-3 mb-1">ご予約・お問い合わせ</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a
                  href={`tel:${salon.tel.replace(/[^0-9]/g, "")}`}
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  電話
                </a>
                <a
                  href={salon.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  Web予約
                </a>
                <a
                  href={salon.line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  LINE
                </a>
                <a
                  href={salon.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={salon.hpb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-group-muted underline underline-offset-2 hover:text-group-text transition-colors"
                >
                  ホットペッパー
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-group-border pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <nav className="flex flex-wrap gap-4">
            <Link href="/area/kochi" className="text-xs text-group-muted hover:text-group-text transition-colors">
              高知市のメニュー
            </Link>
            <Link href="/area/konan" className="text-xs text-group-muted hover:text-group-text transition-colors">
              香南市のメニュー
            </Link>
            <Link href="/blog/hair" className="text-xs text-group-muted hover:text-group-text transition-colors">
              ヘア症例
            </Link>
            <Link href="/blog/eyelash" className="text-xs text-group-muted hover:text-group-text transition-colors">
              アイラッシュ症例
            </Link>
            <Link href="/blog/about" className="text-xs text-group-muted hover:text-group-text transition-colors">
              グループについて
            </Link>
            <Link
              href="/"
              className="text-xs text-group-muted hover:text-group-text transition-colors"
            >
              フルールグループ 公式サイト ↗
            </Link>
          </nav>
          <p className="text-xs text-group-muted">
            © {new Date().getFullYear()} fleur group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
