import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import RecruitEditor from "../sections/RecruitEditor";

export default function AdminRecruitPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <RecruitEditor initial={content.recruit} />
      </div>
    </div>
  );
}
