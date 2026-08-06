import type { ReserveSalon } from "@/app/components/SalonReserveIcons";

/**
 * 予約導線（ヘッダーのご予約ポップオーバー / フッター）で共通利用する店舗の予約チャネル。
 * URL を変更する場合はここだけ直せば全箇所に反映される。
 */
export type ReserveSalonEntry = ReserveSalon & { key: string; area: string; href: string };

export const reserveSalons: ReserveSalonEntry[] = [
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
    area: "高知県高知市南川添9-21 フルールアミー3 2F",
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
