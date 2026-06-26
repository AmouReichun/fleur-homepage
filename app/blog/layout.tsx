import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { organizationSchema, webSiteSchema } from "@/lib/blog/structured-data";

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
