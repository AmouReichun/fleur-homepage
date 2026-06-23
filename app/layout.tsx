import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "fleurami GROUP | 高知の美容室・アイラッシュサロン",
    template: "%s | fleurami GROUP",
  },
  description:
    "高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）、アイラッシュサロン1店舗（Raffine）を展開するfleurami GROUP。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAXなど幅広いメニューをご用意しています。",
  keywords: [
    "高知 美容室",
    "高知市 髪質改善",
    "香南市 美容室",
    "まつげパーマ 高知",
    "眉毛WAX 高知",
    "fleurami",
    "Raffine",
    "白髪ぼかし 高知",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "fleurami GROUP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansJP.variable}`}>
      <body className="bg-site-bg text-site-text antialiased">
        {isAdmin ? (
          <>{children}</>
        ) : (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
