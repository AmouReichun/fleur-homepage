import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import PopularMenuEditor from "../sections/PopularMenuEditor";

export default function AdminPopularMenusPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <PopularMenuEditor initial={content.popularMenus ?? []} />
      </div>
    </div>
  );
}
