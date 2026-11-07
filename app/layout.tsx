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
    default: "高知市の美容室・まつ毛サロン | fleur GROUP｜艶カラー・髪質改善・眉毛WAX",
    template: "%s | fleur GROUP",
  },
  description:
    "高知市・香南市の美容室・まつ毛サロン fleur GROUP。Googleクチコミ4.6以上の3店舗が髪質改善・白髪ぼかし・縮毛矯正・まつ毛パーマ・眉毛WAXに対応。土日OK・駐車場あり・Web予約当日受付。",
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
    "Riv. by fleur ami",
  ],
  // canonical は各ページで指定する（ここで指定すると、指定し忘れたページが全部トップ扱いになるため）
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "fleur GROUP",
    url: BASE_URL,
    title: "高知市の美容室・まつ毛サロン | fleur GROUP｜艶カラー・髪質改善・眉毛WAX",
    description:
      "高知市・香南市の美容室・まつ毛サロン fleur GROUP。Googleクチコミ4.6以上の3店舗が髪質改善・白髪ぼかし・縮毛矯正・まつ毛パーマ・眉毛WAXに対応。土日OK・駐車場あり・Web予約当日受付。",
    images: [
      {
        url: "/images/admin/hero-1782190629178.jpg",
        width: 1200,
        height: 630,
        alt: "高知市の美容室・まつ毛サロン | fleur GROUP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "高知市の美容室・まつ毛サロン | fleur GROUP｜艶カラー・髪質改善・眉毛WAX",
    description:
      "高知市・香南市の美容室・まつ毛サロン fleur GROUP。Googleクチコミ4.6以上の3店舗が髪質改善・白髪ぼかし・縮毛矯正・まつ毛パーマ・眉毛WAXに対応。土日OK・駐車場あり・Web予約当日受付。",
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
        {/* GA4の接続待ち時間を短縮（FCP/TTI改善） */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {/* Instagram/Facebook CDNへのDNS解決を事前に行う */}
        <link rel="dns-prefetch" href="https://www.cdninstagram.com" />
        <link rel="dns-prefetch" href="https://scontent.cdninstagram.com" />
        <link rel="dns-prefetch" href="https://video.cdninstagram.com" />
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
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
            {/* 予約・LINE・電話のクリックを「reserve_click」として記録（GA4のキーイベント。2026-11-07） */}
            <Script id="reserve-click-track" strategy="afterInteractive">
              {`
                (function(){
                  window.dataLayer = window.dataLayer || [];
                  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
                  var SALON = {
                    'slnH000528388':'fleurami','slnH000634137':'riv','slnH000767549':'raffine',
                    '3df04abf87b5':'fleurami','440902d92d79':'riv','41e62da8591a':'raffine',
                    '2000133690':'fleurami','2006084473':'riv','2007963689':'raffine',
                    '0887565566':'fleurami','0888845566':'riv','09071205566':'raffine'
                  };
                  function salonOf(u){ var s=u.replace(/-/g,''); for (var k in SALON){ if (s.indexOf(k)!==-1) return SALON[k]; } return 'unknown'; }
                  document.addEventListener('click', function(e){
                    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
                    if (!a) return;
                    var u = a.getAttribute('href') || '';
                    var ch = /hotpepper\\.jp/.test(u) ? 'hotpepper' : /postas\\.asia/.test(u) ? 'web_reserve' : /(line\\.me|lin\\.ee)/.test(u) ? 'line' : /^tel:/.test(u) ? 'tel' : '';
                    if (!ch) return;
                    window.gtag('event', 'reserve_click', { channel: ch, salon: salonOf(u), link_url: u.slice(0,100), page_path: location.pathname, transport_type: 'beacon' });
                  }, true);
                })();
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
