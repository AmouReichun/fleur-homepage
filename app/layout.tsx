import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
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

const BASE_URL = "https://fleurami-group.jp";
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
        url: "/images/admin/hero-1782190629178.png",
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
    images: ["/images/admin/hero-1782190629178.png"],
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
              if (e.error && (e.error.name === 'ChunkLoadError' || msg.indexOf('chunk') !== -1 || msg.indexOf('Failed to fetch') !== -1)) {
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
