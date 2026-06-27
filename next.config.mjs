/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@next/third-parties"],
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
    ],
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/blog/faq",
        permanent: true,
      },
    ];
  },
  // 全ページ共通のセキュリティヘッダー。
  // ※ CSP は GA4・Instagram画像・OG等で誤遮断のリスクがあるため、テスト前提で別途導入する。
  async headers() {
    const securityHeaders = [
      // HTTPS強制（2年・サブドメイン含む）。HTTPでの接続を抑止。
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      // クリックジャッキング対策（他サイトのiframe埋め込み禁止）
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
      // MIMEスニッフィング防止
      { key: "X-Content-Type-Options", value: "nosniff" },
      // リファラ送出を最小限に
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // 不要なブラウザ機能を無効化
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
