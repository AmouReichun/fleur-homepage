import fs from "node:fs";
import path from "node:path";

// 統合した記事（frontmatter に merged_into: "親slug" がある記事）→ 親記事へ恒久リダイレクト。
// ファイルは残す（instagram_id の再生成防止・元に戻せるように）。2026-11-07 Raffine記事の整理で導入
function mergedPostRedirects() {
  const out = [];
  for (const cat of ["hair", "eyelash"]) {
    const dir = path.join(process.cwd(), "content", cat);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const m = fs.readFileSync(path.join(dir, f), "utf8").match(/^merged_into:\s*["']?([a-z0-9-]+)["']?\s*$/m);
      if (m) out.push({ source: `/blog/${cat}/${f.replace(/\.md$/, "")}`, destination: `/blog/${cat}/${m[1]}`, permanent: true });
    }
  }
  return out;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@next/third-parties"],
    serverComponentsExternalPackages: ["sharp"],
    // 管理画面の写真アップロード（ブラウザ側で長辺2000pxに縮小後に送信）用に上限を少し広げる
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
      },
      {
        // Vercel Blob 公開ストア（管理画面アップロード画像）
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    unoptimized: false,
  },
  async redirects() {
    const merged = mergedPostRedirects();
    const finalDest = new Map(merged.map((r) => [r.source, r.destination]));
    // 古い転送の行き先が統合済みの記事なら、統合先へ直接飛ばす（転送の二重がけを防ぐ）
    const resolve = (list) => list.map((r) => (finalDest.has(r.destination) ? { ...r, destination: finalDest.get(r.destination) } : r));
    return resolve([
      ...merged,
      // 同じ内容の記事（11/7 社長判断で1本に統合）→ 10/19の記事へ
      { source: "/blog/hair/kochi-biyoshitsu-erabikata-5pointo", destination: "/blog/hair/kochi-biyoushitsu-erabikata-5points", permanent: true },
      { source: "/blog/hair/kochi-biyoshitsu-erabikata-5points", destination: "/blog/hair/kochi-biyoushitsu-erabikata-5points", permanent: true },
      {
        source: "/faq",
        destination: "/blog/faq",
        permanent: true,
      },
      // 旧タグ名 → 現タグ名へのリダイレクト（SEMrush 404エラー解消）
      // sourceはURL-encoded形式（日本語をそのまま書くとregexがリテラルになりブラウザのencoded URLと不一致になる）
      {
        source: "/blog/eyelash/tag/%E3%83%91%E3%83%AA%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%8C%E3%83%AA%E3%83%95%E3%83%88",
        destination: "/blog/eyelash/tag/%E3%83%91%E3%83%AA%E3%82%B8%E3%82%A7%E3%83%B3%E3%83%8C%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%83%AA%E3%83%95%E3%83%88",
        permanent: true,
      },
      {
        source: "/blog/eyelash/tag/%E9%9F%93%E5%9B%BD%E6%9D%9F%E6%84%9F%E3%83%9E%E3%83%84%E3%82%A8%E3%82%AF",
        destination: "/blog/eyelash",
        permanent: true,
      },
      {
        source: "/blog/hair/tag/%E3%83%A1%E3%83%B3%E3%82%BA",
        destination: "/blog/hair/tag/%E3%83%A1%E3%83%B3%E3%82%BA%E3%82%AB%E3%83%83%E3%83%88",
        permanent: true,
      },
      // 削除済み記事の404解消
      {
        source: "/blog/hair/kochi-beige-color-40dai-tsuyatomekata-mrylizth",
        destination: "/blog/hair",
        permanent: true,
      },
      {
        source: "/blog/hair/salon-menu-howto-choose-40s",
        destination: "/blog/hair",
        permanent: true,
      },
      // スラッグ変更された記事 → 新スラッグへ集約
      {
        source: "/blog/hair/kochi-shiraganobokashi-highlight-erabikata-mrkdstco",
        destination: "/blog/hair/kochi-shiraganobokashi-highlight-erabikata-mr07elyj",
        permanent: true,
      },
      {
        source: "/blog/hair/konan-inner-color-double-color-erabikata-mrvvquc0",
        destination: "/blog/hair/konan-inner-color-double-color-erabikata-mrvwhl9l",
        permanent: true,
      },
      {
        source: "/blog/hair/konan-shi-akami-brown-color-erabikata-mrvvvtuw",
        destination: "/blog/hair/konan-shi-akami-brown-color-tsuya-mrcqolb5",
        permanent: true,
      },
      // 旧採用URL
      {
        source: "/recruit-1",
        destination: "/recruit",
        permanent: true,
      },
      // 重複記事の統合（同一サムネ・同一テーマ）→ 残した記事へ集約
      {
        source: "/blog/eyelash/kochi-flat-lash-100-cool-design-jireikai-msh4ai5b",
        destination: "/blog/eyelash/kochi-flat-lash-nagashi-design-guide-msh3udwq",
        permanent: true,
      },
      {
        source: "/blog/eyelash/kochi-lash-lift-jirei-mukimuki-msrllehj",
        destination: "/blog/eyelash/kochi-lash-lift-check-points-raffine-msrm7rox",
        permanent: true,
      },
      {
        source: "/blog/hair/kanan-design-color-dark-purple-fleur-ami-ms6sfflm",
        destination: "/blog/hair/kananshi-design-color-navy-purple-fleur-ami-ms6s1cbv",
        permanent: true,
      },
    ]);
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
    return [
      { source: "/:path*", headers: securityHeaders },
      // public/images 配下の静的画像を長期キャッシュ（ファイル名はタイムスタンプ/ハッシュ付きで実質不変）。
      // 直接配信される og:image・JSON-LDサムネ等の再訪DL防止。
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ビルドごとにハッシュが変わる静的アセットをGooglebotから隠す（robots.txtと二重防壁）
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
