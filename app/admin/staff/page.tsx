import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import StaffEditor from "../sections/StaffEditor";

export default async function AdminStaffPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <StaffEditor initial={content.staff} salons={content.salons} salonOrder={content.salonOrder} />
      </div>
    </div>
  );
}
