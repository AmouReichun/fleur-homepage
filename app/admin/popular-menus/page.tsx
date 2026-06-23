import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import PopularMenuEditor from "../sections/PopularMenuEditor";

export default async function AdminPopularMenusPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <PopularMenuEditor initial={content.popularMenus ?? []} />
      </div>
    </div>
  );
}
