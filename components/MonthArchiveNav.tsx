import Link from "next/link";
import type { MonthSummary } from "@/lib/blog/posts";

type Props = {
  months: MonthSummary[];
  category: "hair" | "eyelash";
  activeYear?: string;
  activeMonth?: string;
};

export default function MonthArchiveNav({ months, category, activeYear, activeMonth }: Props) {
  if (months.length === 0) return null;

  const isHair = category === "hair";
  const accent = isHair ? "#BBA98A" : "#C8788A";
  const accentSoft = isHair ? "rgba(187,169,138,0.10)" : "rgba(200,120,138,0.10)";
  const borderColor = isHair ? "rgba(187,169,138,0.30)" : "rgba(200,120,138,0.30)";

  // 年ごとにグルーピング
  const byYear = new Map<string, MonthSummary[]>();
  for (const m of months) {
    if (!byYear.has(m.year)) byYear.set(m.year, []);
    byYear.get(m.year)!.push(m);
  }

  return (
    <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${borderColor}` }}>
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`text-[10px] tracking-[0.3em] uppercase ${isHair ? "font-cormorant" : "font-jakarta"}`}
          style={{ color: accent }}
        >
          Archive
        </span>
        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${accent}40, transparent)` }} />
        <span className="text-[10px]" style={{ color: isHair ? "#A89878" : "#B08090" }}>
          月別アーカイブ
        </span>
      </div>

      <div className="space-y-4">
        {Array.from(byYear.entries()).map(([year, ms]) => (
          <div key={year}>
            <p
              className={`text-[10px] tracking-[0.2em] mb-2 ${isHair ? "font-cormorant" : "font-jakarta"}`}
              style={{ color: isHair ? "#A89878" : "#B08090" }}
            >
              {year}
            </p>
            <div className="flex flex-wrap gap-2">
              {ms.map((m) => {
                const isActive = m.year === activeYear && m.month === activeMonth;
                return (
                  <Link
                    key={`${m.year}-${m.month}`}
                    href={`/blog/${category}/archive/${m.year}/${m.month}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all ${isHair ? "font-cormorant" : "font-jakarta"}`}
                    style={{
                      background: isActive ? accent : accentSoft,
                      color: isActive ? "#fff" : accent,
                      border: `1px solid ${isActive ? accent : borderColor}`,
                      borderRadius: isHair ? "2px" : "999px",
                    }}
                  >
                    {parseInt(m.month)}月
                    <span style={{ opacity: 0.65, fontSize: "10px" }}>{m.count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
