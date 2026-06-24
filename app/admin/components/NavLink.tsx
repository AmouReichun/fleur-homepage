"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
        active
          ? "bg-[#B8956A] text-white font-medium shadow-sm"
          : "text-[#555] hover:bg-[#EDE9E4] hover:text-[#1A1A1A]"
      }`}
    >
      {label}
    </Link>
  );
}
