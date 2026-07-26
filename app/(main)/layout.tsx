import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { organizationSchema, webSiteSchema } from "@/lib/structured-data";

const BASE = "https://fleur-group.jp";

const siteNavigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "サイトナビゲーション",
  itemListElement: [
    { "@type": "SiteNavigationElement", position: 1, name: "店舗案内", url: `${BASE}/salon` },
    { "@type": "SiteNavigationElement", position: 2, name: "メニュー", url: `${BASE}/menu` },
    { "@type": "SiteNavigationElement", position: 3, name: "スタッフ", url: `${BASE}/staff` },
    { "@type": "SiteNavigationElement", position: 4, name: "最新情報", url: `${BASE}/news` },
    { "@type": "SiteNavigationElement", position: 5, name: "ブログ", url: `${BASE}/blog` },
    { "@type": "SiteNavigationElement", position: 6, name: "採用情報", url: `${BASE}/recruit` },
    { "@type": "SiteNavigationElement", position: 7, name: "会社概要", url: `${BASE}/company` },
    { "@type": "SiteNavigationElement", position: 8, name: "お問い合わせ", url: `${BASE}/contact` },
  ],
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
