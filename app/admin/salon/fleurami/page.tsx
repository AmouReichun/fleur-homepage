import { getContent } from "@/lib/content";
import AdminSidebar from "../../components/AdminSidebar";
import SalonEditor from "../../sections/SalonEditor";

export default function AdminSalonFleuramiPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <SalonEditor salonKey="fleurami" initial={content.salons.fleurami} />
      </div>
    </div>
  );
}
