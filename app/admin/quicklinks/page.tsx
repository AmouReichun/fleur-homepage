import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import QuickLinkEditor from "../sections/QuickLinkEditor";

export default function AdminQuickLinksPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <QuickLinkEditor initial={content.quickLinks ?? []} />
      </div>
    </div>
  );
}
