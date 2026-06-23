import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import FaqEditor from "../sections/FaqEditor";

export default function AdminFaqPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <FaqEditor initial={content.topFaq} />
      </div>
    </div>
  );
}
