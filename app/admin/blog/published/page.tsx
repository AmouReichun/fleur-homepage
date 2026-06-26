import Link from 'next/link'
import { logout, revertToDraft } from '../actions'
import RevertButton from '../RevertButton'
import { getAdminArticles } from '@/lib/blog/github-admin'

export const dynamic = 'force-dynamic'

export default async function PublishedPage({
  searchParams,
}: {
  searchParams: { reverted?: string; saved?: string }
}) {
  const [hairAll, eyelashAll] = await Promise.all([
    getAdminArticles('hair'),
    getAdminArticles('eyelash'),
  ])

  const hair    = hairAll.filter(a => !a.draft)
  const eyelash = eyelashAll.filter(a => !a.draft)
  const all = [...hair, ...eyelash].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <>
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{
          background: "#111111",
          borderBottom: "1px solid #222222",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-cormorant text-[11px] tracking-[0.4em] uppercase"
            style={{ color: "#C8A860" }}
          >
            Fleur Group
          </span>
          <span style={{ color: "#2A2A2A" }}>|</span>
          <div className="flex items-center gap-1">
            <Link
              href="/admin/blog"
              className="text-xs px-3 py-1.5 rounded-sm transition-colors hover:opacity-80"
              style={{ color: "#666" }}
            >
              下書き
            </Link>
            <Link
              href="/admin/blog/published"
              className="text-xs px-3 py-1.5 rounded-sm transition-colors"
              style={{ background: "#222", color: "#E8E8E8" }}
            >
              公開済み
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-xs tracking-wide transition-colors hover:text-neutral-400"
            style={{ color: "#555" }}
          >
            ← ブログへ
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs" style={{ color: "#555" }}>
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* 通知 */}
        {searchParams.saved && (
          <div
            className="mb-6 px-5 py-3 rounded-sm text-sm flex items-center gap-3"
            style={{ background: "#0D1F12", border: "1px solid #1A4A25", color: "#6DBF88" }}
          >
            <span>✓</span>
            <span>「{searchParams.saved}」を保存しました — ブログへの反映は約1分後です</span>
          </div>
        )}
        {searchParams.reverted && (
          <div
            className="mb-6 px-5 py-3 rounded-sm text-sm flex items-center gap-3"
            style={{ background: "#1F1700", border: "1px solid #4A3A00", color: "#C8A840" }}
          >
            <span>↩</span>
            <span>下書きに戻しました — 約1分後にブログから非表示になります</span>
          </div>
        )}

        {/* 統計 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "公開済み合計", value: all.length },
            { label: "ヘア",         value: hair.length },
            { label: "アイラッシュ", value: eyelash.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-sm px-5 py-4"
              style={{ background: "#161616", border: "1px solid #222" }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#555" }}>{label}</p>
              <p className="text-3xl font-light" style={{ color: "#D4C8B0" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* セクション見出し */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C8A860" }}>
            Published Articles
          </p>
          <div className="h-px flex-1" style={{ background: "#222" }} />
        </div>

        {/* 記事リスト */}
        {all.length === 0 ? (
          <div
            className="text-center py-20 rounded-sm"
            style={{ background: "#141414", border: "1px solid #1E1E1E" }}
          >
            <p className="text-lg" style={{ color: "#444" }}>公開済み記事はありません</p>
          </div>
        ) : (
          <div className="space-y-2">
            {all.map(article => {
              const revertWithParams = revertToDraft.bind(null, article.category, article.slug)
              const isHair = article.category === 'hair'

              return (
                <div
                  key={`${article.category}/${article.slug}`}
                  className="flex items-center gap-4 px-5 py-4 rounded-sm"
                  style={{ background: "#141414", border: "1px solid #1E1E1E" }}
                >
                  {article.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.thumbnail}
                      alt=""
                      className="w-14 h-14 object-cover shrink-0 rounded-sm"
                      style={{ opacity: 0.85 }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 shrink-0 rounded-sm flex items-center justify-center"
                      style={{ background: "#1E1E1E" }}
                    >
                      <span style={{ color: "#333", fontSize: "18px" }}>
                        {isHair ? "✂" : "✦"}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                        style={{
                          background: isHair ? "#1E1A14" : "#1E1218",
                          color: isHair ? "#BBA98A" : "#C8788A",
                          border: `1px solid ${isHair ? "#3A3020" : "#3A2030"}`,
                        }}
                      >
                        {isHair ? "Hair" : "Eyelash"}
                      </span>
                      <span className="text-[11px]" style={{ color: "#555" }}>{article.salon}</span>
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-sm"
                        style={{ background: "#0D1F12", color: "#6DBF88", border: "1px solid #1A4A25" }}
                      >
                        ✓ 公開中
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: "#D4C8B0" }}>
                      {article.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
                      {article.date} · {article.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/${article.category}/${article.slug}`}
                      target="_blank"
                      className="text-xs px-4 py-2 rounded-sm transition-colors"
                      style={{ background: "#1E1E1E", color: "#888", border: "1px solid #2A2A2A" }}
                    >
                      表示 ↗
                    </Link>
                    <Link
                      href={`/admin/blog/edit/${article.category}/${article.slug}`}
                      className="text-xs px-4 py-2 rounded-sm transition-colors"
                      style={{ background: "#1E1E1E", color: "#888", border: "1px solid #2A2A2A" }}
                    >
                      編集
                    </Link>
                    <form action={revertWithParams}>
                      <RevertButton title={article.title} />
                    </form>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
