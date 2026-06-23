import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import CompanyEditor from "../sections/CompanyEditor";

export default function AdminCompanyPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <CompanyEditor initial={content.company} />
      </div>
    </div>
  );
}
