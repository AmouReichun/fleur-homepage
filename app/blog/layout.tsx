import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { organizationSchema, webSiteSchema } from "@/lib/blog/structured-data";

export const metadata: Metadata = {
  title: {
    default: "症例ブログ | fleur GROUP",
    template: "%s | fleur GROUP",
  },
  description:
    "高知の美容室 fleur ami・Riv. by fleurami、アイラッシュサロン Raffine の症例・スタイル・コラム。白髪ぼかし・髪質改善・縮毛矯正・まつげパーマ・眉毛WAXの実例を発信。",
  alternates: { canonical: "/blog" },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const org = organizationSchema();
  const site = webSiteSchema();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }} />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
