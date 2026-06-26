import Link from "next/link";

const SALONS = [
  { key: "fleurami", label: "fleur ami", sub: "ヘアサロン・香南市" },
  { key: "riv",      label: "Riv.",      sub: "ヘアサロン・高知市" },
  { key: "raffine",  label: "Raffine",   sub: "アイラッシュ・高知市" },
] as const;

export default function StaffIndexPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-8">
      <div className="text-center">
        <p className="text-sm font-medium mb-1" style={{ color: "#C8A860" }}>症例アップロード</p>
        <p className="text-xs" style={{ color: "#444" }}>店舗を選んでください</p>
      </div>
      <div className="w-full max-w-xs space-y-3">
        {SALONS.map((s) => (
          <Link
            key={s.key}
            href={`/blog/staff/${s.key}`}
            className="flex flex-col px-5 py-4 rounded-xl transition-colors"
            style={{ background: "#111", border: "1px solid #222" }}
          >
            <span className="text-sm font-medium" style={{ color: "#C8A860" }}>{s.label}</span>
            <span className="text-[11px]" style={{ color: "#444" }}>{s.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
