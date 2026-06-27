import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP, Shippori_Mincho, Cormorant_Garamond, Zen_Kaku_Gothic_New, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// 日本語フォントは文字数が膨大でサブセットが多数に分割されるため、preload:true だと
// 数百件の <link rel=preload as=font> が生成され表示速度を著しく落とす。
// CJKフォントは preload:false が定石（必要なサブセットだけ display:swap で遅延読込される）。
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false,
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

// ── ブログ統合用フォント（/blog 配下で使用） ──
const shipporiMincho = Shippori_Mincho({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-shippori", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const zenKakuGothic = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-kaku", display: "swap", preload: false });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jakarta", display: "swap" });
// ブログcomponentsは --font-noto も参照
const notoForBlog = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-noto", display: "swap", preload: false });

const BASE_URL = "https://fleur-group.jp";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "fleur GROUP | 高知の美容室・アイラッシュサロン",
    template: "%s | fleur GROUP",
  },
  description:
    "高知市・香南市で美容室2店舗（Riv.by fleurami・fleurami）、アイラッシュサロン1店舗（Raffine）を展開するfleur GROUP。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAXなど幅広いメニューをご用意しています。",
  keywords: [
    "高知 美容室",
    "高知市 髪質改善",
    "香南市 美容室",
    "まつげパーマ 高知",
    "眉毛WAX 高知",
    "fleurami",
    "Raffine",
    "白髪ぼかし 高知",
    "高知市 アイラッシュサロン",
    "縮毛矯正 香南市",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "fleur GROUP",
    url: BASE_URL,
    title: "fleur GROUP | 高知の美容室・アイラッシュサロン",
    description:
      "高知市・香南市で3サロンを展開。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAX。",
    images: [
      {
        url: "/images/admin/hero-1782190629178.jpg",
        width: 1200,
        height: 630,
        alt: "fleur GROUP | 高知の美容室・アイラッシュサロン",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "fleur GROUP | 高知の美容室・アイラッシュサロン",
    description:
      "高知市・香南市で3サロンを展開。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAX。",
    images: ["/images/admin/hero-1782190629178.jpg"],
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") ?? "";
  // /admin と /blog は独自レイアウト（HPのHeader/Footerを出さない）
  const isBare = pathname.startsWith("/admin") || pathname.startsWith("/blog");

  return (
    <html lang="ja" className={`${notoSerifJP.variable} ${notoSansJP.variable} ${shipporiMincho.variable} ${cormorant.variable} ${zenKakuGothic.variable} ${plusJakarta.variable} ${notoForBlog.variable}`}>
      <body className="bg-site-bg text-site-text antialiased">
        {isBare ? (
          <>{children}</>
        ) : (
          <>
            <Header />
            <main>{children}</main>
            <Footer />
          </>
        )}

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        {/* デプロイ後の古いチャンクエラーを検知して自動リロード */}
        <Script id="chunk-error-handler" strategy="afterInteractive">
          {`
            window.addEventListener('error', function(e) {
              var msg = e.message || '';
              if (e.error && (e.error.name === 'ChunkLoadError' || (msg.indexOf('chunk') !== -1 && msg.indexOf('fetch') === -1))) {
                window.location.reload();
              }
            });
            window.addEventListener('unhandledrejection', function(e) {
              var msg = (e.reason && e.reason.message) || '';
              if ((e.reason && e.reason.name === 'ChunkLoadError') || msg.indexOf('chunk') !== -1 || msg.indexOf('Loading chunk') !== -1) {
                window.location.reload();
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
