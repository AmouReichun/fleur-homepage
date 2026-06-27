import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// メインサイト（トップ・店舗・サービス・エリア・採用 等）の共通レイアウト。
// Route Group "(main)" でHeaderとFooterをここに分離したことで、ルートレイアウトから
// headers()（x-pathname判定）を排除でき、各ページが静的/ISR＝エッジキャッシュ可能になる。
// /admin と /blog はこのグループ外なので、それぞれ独自レイアウトのまま影響を受けない。
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
