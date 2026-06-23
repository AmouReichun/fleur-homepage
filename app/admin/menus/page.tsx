import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import MenuEditor from "../sections/MenuEditor";

export default async function AdminMenusPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MenuEditor initial={content.menus} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
