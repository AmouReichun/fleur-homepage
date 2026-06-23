import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import RecruitEditor from "../sections/RecruitEditor";

export default async function AdminRecruitPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <RecruitEditor initial={content.recruit} />
      </div>
    </div>
  );
}
