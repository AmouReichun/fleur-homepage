import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import NewsEditor from "../sections/NewsEditor";

export default function AdminNewsPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <NewsEditor initial={content.news ?? []} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
