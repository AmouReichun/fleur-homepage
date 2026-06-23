import { notFound } from "next/navigation";
import { getContentLatest } from "@/lib/content";
import AdminSidebar from "../../components/AdminSidebar";
import SalonEditor from "../../sections/SalonEditor";

interface Props {
  params: { salonKey: string };
}

export default async function AdminSalonPage({ params }: Props) {
  const content = await getContentLatest();
  const salon = content.salons[params.salonKey];
  if (!salon) notFound();

  return (
    <div className="flex h-screen">
      <AdminSidebar content={content} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <SalonEditor salonKey={params.salonKey} initial={salon} />
      </div>
    </div>
  );
}
