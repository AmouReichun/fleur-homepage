import { getContentLatest } from "@/lib/content";
import { getLpStore } from "@/lib/lp";
import AdminSidebar from "../components/AdminSidebar";
import LpEditor from "../sections/LpEditor";

export const dynamic = "force-dynamic";

export default async function AdminLpPage() {
  const content = await getContentLatest();
  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <LpEditor
          store={getLpStore(content)}
          salonLineUrls={{ fleurami: content.salons.fleurami?.lineUrl ?? "", riv: content.salons.riv?.lineUrl ?? "" }}
        />
      </div>
    </div>
  );
}
