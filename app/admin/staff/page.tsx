import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import StaffEditor from "../sections/StaffEditor";

export default function AdminStaffPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <StaffEditor initial={content.staff} />
      </div>
    </div>
  );
}
