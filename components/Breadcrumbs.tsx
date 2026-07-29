import Link from "next/link";

export type Crumb = { name: string; url: string };
type Theme = "hair" | "eyelash" | "site";

// テーマ別の配色（記事詳細ページの既存パンくずと見た目を揃える）
const THEME: Record<Theme, { border: string; sep: string; muted: string; text: string; hover: string }> = {
  hair: {
    border: "border-hair-border",
    sep: "text-hair-border",
    muted: "text-hair-muted",
    text: "text-hair-text",
    hover: "hover:text-hair-accent-warm",
  },
  eyelash: {
    border: "border-eye-border",
    sep: "text-eye-border",
    muted: "text-eye-muted",
    text: "text-eye-text",
    hover: "hover:text-eye-accent",
  },
  site: {
    border: "border-site-greige",
    sep: "text-site-greige",
    muted: "text-site-muted",
    text: "text-site-text",
    hover: "hover:text-site-accent",
  },
};

/**
 * 可視パンくずリスト（BreadcrumbList構造化データと対になる表示要素）。
 * 構造化データと同じ crumbs 配列を渡して、マークアップと可視内容を一致させる。
 * 最後の項目は現在地としてテキスト表示、それ以外はリンク。
 */
export default function Breadcrumbs({ items, theme = "site" }: { items: Crumb[]; theme?: Theme }) {
  if (!items || items.length === 0) return null;
  const t = THEME[theme];
  return (
    <nav aria-label="パンくずリスト" className={`px-4 py-3 border-b ${t.border} bg-white/70 backdrop-blur-sm`}>
      <ol className={`max-w-wide mx-auto flex items-center flex-wrap gap-2 text-xs ${t.muted}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.url}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className={t.sep}>›</span>}
              {last ? (
                <span className={`${t.text} truncate max-w-[220px]`} aria-current="page">
                  {c.name}
                </span>
              ) : (
                <Link href={c.url} className={`${t.hover} transition-colors`}>
                  {c.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
