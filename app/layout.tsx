import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// メインサイトは本文・見出しとも端末内蔵フォント（iPhone=ヒラギノ角ゴ/明朝など）を使用。
// 日本語Webフォントは全サブセットの @font-face を送りレンダーブロックCSSが巨大化するため、
// LCP/初期描画を最優先して不採用にした（ブログ専用フォントは app/blog/layout.tsx 側）。

const BASE_URL = "https://fleur-group.jp";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "高知県の美容室・アイラッシュサロン | fleur GROUP",
    template: "%s | fleur GROUP",
  },
  description:
    "高知県（高知市・香南市）で美容室2店舗（Riv. by fleurami・fleurami）、アイラッシュサロン1店舗（Raffine）を展開するfleur GROUP。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAXなど幅広いメニューをご用意しています。",
  keywords: [
    "高知 美容室",
    "高知県 美容室",
    "高知市 美容室",
    "高知市 髪質改善",
    "高知 ヘアサロン",
    "高知 縮毛矯正",
    "高知 白髪ぼかし",
    "香南市 美容室",
    "香南市 ヘアサロン",
    "野市 美容室",
    "野市 縮毛矯正",
    "まつげパーマ 高知",
    "ラッシュリフト 高知",
    "眉毛WAX 高知",
    "高知市 アイラッシュサロン",
    "はりまや橋 まつげパーマ",
    "縮毛矯正 香南市",
    "fleurami",
    "Raffine",
    "Riv. by fleurami",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "fleur GROUP",
    url: BASE_URL,
    title: "高知県の美容室・アイラッシュサロン | fleur GROUP",
    description:
      "高知県（高知市・香南市）で3サロンを展開。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAX。",
    images: [
      {
        url: "/images/admin/hero-1782190629178.jpg",
        width: 1200,
        height: 630,
        alt: "高知県の美容室・アイラッシュサロン | fleur GROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "高知県の美容室・アイラッシュサロン | fleur GROUP",
    description:
      "高知県（高知市・香南市）で3サロンを展開。髪質改善・白髪ぼかし・縮毛矯正・まつげパーマ・眉毛WAX。",
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
  // Header/Footer は app/(main)/layout.tsx に分離。ルートはhtml/body・フォント・GAのみで
  // headers() を使わないため、各ページが静的/ISR＝エッジキャッシュ可能になる。
  return (
    <html lang="ja">
      <head>
        {/* JS無効時はスクロール表示ラッパーを常に可視にして本文が消えないようにする */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body className="bg-site-bg text-site-text antialiased">
        {children}

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
