import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import FaqEditor from "../sections/FaqEditor";

export default async function AdminFaqPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <FaqEditor initial={content.topFaq} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
