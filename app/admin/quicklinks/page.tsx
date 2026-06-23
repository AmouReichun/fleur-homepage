import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import QuickLinkEditor from "../sections/QuickLinkEditor";

export default async function AdminQuickLinksPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <QuickLinkEditor initial={content.quickLinks ?? []} />
      </div>
    </div>
  );
}
