import { getContent } from "@/lib/content";
import AdminSidebar from "../components/AdminSidebar";
import HeroEditor from "../sections/HeroEditor";

export default function AdminHeroPage() {
  const content = getContent();
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <HeroEditor initial={content.hero} />
      </div>
    </div>
  );
}
