import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import NewsEditor from "../sections/NewsEditor";

export default async function AdminNewsPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <NewsEditor initial={content.news ?? []} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
