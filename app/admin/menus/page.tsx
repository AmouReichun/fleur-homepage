import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import MenuEditor from "../sections/MenuEditor";

export default function AdminMenusPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MenuEditor initial={content.menus} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
