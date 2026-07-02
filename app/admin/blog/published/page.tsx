import Link from 'next/link'
import { logout, revertToDraft } from '../actions'
import RevertButton from '../RevertButton'
import DeleteButton from '../DeleteButton'
import { getAdminArticles } from '@/lib/blog/github-admin'

export const dynamic = 'force-dynamic'

// 店舗別グループ（content.json の salonOrder と同順）
const SALON_GROUPS: {
  key: string
  label: string
  type: 'hair' | 'eyelash'
  match: (salon: string) => boolean
}[] = [
  { key: 'fleurami', label: 'fleur ami',         type: 'hair',    match: s => s === 'fleur ami' },
  { key: 'riv',      label: 'Riv. by fleur ami', type: 'hair',    match: s => s.startsWith('Riv') },
  { key: 'raffine',  label: 'Raffine',           type: 'eyelash', match: s => s === 'Raffine' },
]

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

  // 店舗別にグループ化（日付の新しい順）
  const matched = new Set<string>()
  const groups = SALON_GROUPS.map(g => {
    const items = all
      .filter(a => g.match(a.salon))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    items.forEach(a => matched.add(`${a.category}/${a.slug}`))
    return { ...g, items }
  })
  const others = all.filter(a => !matched.has(`${a.category}/${a.slug}`))
  if (others.length > 0) {
    groups.push({ key: 'others', label: 'その他', type: 'hair', match: () => false, items: others })
  }
  const visibleGroups = groups.filter(g => g.items.length > 0)

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
              href="/admin/blog/generate"
              className="text-xs px-3 py-1.5 rounded-sm transition-colors hover:opacity-80"
              style={{ color: "#666" }}
            >
              記事作成
            </Link>
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
            href="/admin"
            className="text-xs tracking-wide transition-colors hover:text-neutral-300"
            style={{ color: "#C8A860" }}
          >
            ← 管理トップ
          </Link>
          <Link
            href="/blog"
            className="text-xs tracking-wide transition-colors hover:text-neutral-400"
            style={{ color: "#555" }}
          >
            ブログを見る ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs" style={{ color: "#555" }}>
              ログアウト
            </button>
          </form>
        </div>
      </header>

      {/* 店舗タブ：各店舗セクションへスクロールジャンプ（ヘッダー直下に追従） */}
      {visibleGroups.length > 1 && (
        <div
          className="sticky top-[57px] z-10 px-6 py-3"
          style={{ background: "#0F0F0F", borderBottom: "1px solid #222" }}
        >
          <nav className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto">
            {visibleGroups.map(group => (
              <a
                key={group.key}
                href={`#pub-${group.key}`}
                className="text-xs px-4 py-2 rounded-full whitespace-nowrap transition-colors hover:opacity-80"
                style={{
                  background: "#161616",
                  color: group.type === 'hair' ? "#BBA98A" : "#C8788A",
                  border: `1px solid ${group.type === 'hair' ? "#3A3020" : "#3A2030"}`,
                }}
              >
                {group.label}
                <span style={{ color: "#555" }}> {group.items.length}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

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

        {/* 記事リスト（店舗別） */}
        {all.length === 0 ? (
          <div
            className="text-center py-20 rounded-sm"
            style={{ background: "#141414", border: "1px solid #1E1E1E" }}
          >
            <p className="text-lg" style={{ color: "#444" }}>公開済み記事はありません</p>
          </div>
        ) : (
          <div className="space-y-10">
            {visibleGroups.map(group => (
              <section key={group.key} id={`pub-${group.key}`} className="scroll-mt-[120px]">
                {/* 店舗見出し（追従） */}
                <div
                  className="flex items-center gap-3 mb-4 py-2 sticky top-[105px] z-[5]"
                  style={{ background: "#0F0F0F" }}
                >
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm"
                    style={{
                      background: group.type === 'hair' ? "#1E1A14" : "#1E1218",
                      color: group.type === 'hair' ? "#BBA98A" : "#C8788A",
                      border: `1px solid ${group.type === 'hair' ? "#3A3020" : "#3A2030"}`,
                    }}
                  >
                    {group.type === 'hair' ? "Hair" : "Eyelash"}
                  </span>
                  <p className="text-sm font-medium" style={{ color: "#C8A860" }}>{group.label}</p>
                  <span className="text-[11px]" style={{ color: "#555" }}>{group.items.length}件</span>
                  <div className="h-px flex-1" style={{ background: "#222" }} />
                </div>

                <div className="space-y-2">
                  {group.items.map(article => {
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
                      href={`/blog/${article.category}/${article.slug}`}
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
                    <DeleteButton
                      category={article.category}
                      slug={article.slug}
                      title={article.title}
                    />
                  </div>
                </div>
              )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
