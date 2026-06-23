import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理画面 | fleurami GROUP",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F2EF] text-[#1A1A1A] font-sans">
      {children}
    </div>
  );
}
