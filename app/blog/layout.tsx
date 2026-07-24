import type { Metadata } from "next";
import { Noto_Sans_JP, Shippori_Mincho, Cormorant_Garamond, Zen_Kaku_Gothic_New, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { organizationSchema, webSiteSchema } from "@/lib/blog/structured-data";

// ブログ専用フォント。全て preload:false でメインサイトの LCP に影響させない。
const shipporiMincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-shippori", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap", preload: false });
const zenKakuGothic = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-kaku", display: "swap", preload: false });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jakarta", display: "swap", preload: false });
const notoForBlog = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-noto", display: "swap", preload: false });

export const metadata: Metadata = {
  title: {
    default: "症例ブログ | fleur GROUP",
    template: "%s | fleur GROUP",
  },
  description:
    "高知の美容室 fleur ami・Riv. by fleurami、アイラッシュサロン Raffine の症例・スタイル・コラム。白髪ぼかし・髪質改善・縮毛矯正・まつげパーマ・眉毛WAXの実例を発信。",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const org = organizationSchema();
  const site = webSiteSchema();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
      <div className={`${shipporiMincho.variable} ${cormorant.variable} ${zenKakuGothic.variable} ${plusJakarta.variable} ${notoForBlog.variable}`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
