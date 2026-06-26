import Link from 'next/link'
import { logout, getAutoPublishConfig, getDailyGenerateConfig } from './actions'
import DraftList from './DraftList'
import AutoPublishSettings from './AutoPublishSettings'
import DailyGenerateSettings from './DailyGenerateSettings'
import { getAdminArticles } from '@/lib/blog/github-admin'

export const dynamic = 'force-dynamic'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { saved?: string; approved?: string }
}) {
  const [hairAll, eyelashAll, autoPublishConfig, dailyGenerateConfig] = await Promise.all([
    getAdminArticles('hair'),
    getAdminArticles('eyelash'),
    getAutoPublishConfig(),
    getDailyGenerateConfig(),
  ])

  const hairArticles    = hairAll.filter(a => a.draft)
  const eyelashArticles = eyelashAll.filter(a => a.draft)
  const allDrafts = [...hairArticles, ...eyelashArticles].sort(
    (a, b) => (a.date < b.date ? 1 : -1)
  )
  const yakkihouCount = allDrafts.filter(a => a.yakkihou_flag).length

  const hairPublished    = hairAll.filter(a => !a.draft)
  const eyelashPublished = eyelashAll.filter(a => !a.draft)
  const totalPublished   = hairPublished.length + eyelashPublished.length

  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthCount = [...hairPublished, ...eyelashPublished]
    .filter(a => a.date.startsWith(thisMonth)).length

  const salonStats = [
    { name: 'fleur ami',         count: hairPublished.filter(a => a.salon === 'fleur ami').length },
    { name: 'Riv.',              count: hairPublished.filter(a => a.salon?.startsWith('Riv')).length },
    { name: 'Raffine',           count: eyelashPublished.filter(a => a.salon === 'Raffine').length },
  ]

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
              className="text-xs px-3 py-1.5 rounded-sm transition-colors"
              style={{ background: "#222", color: "#E8E8E8" }}
            >
              下書き
            </Link>
            <Link
              href="/admin/blog/published"
              className="text-xs px-3 py-1.5 rounded-sm transition-colors hover:opacity-80"
              style={{ color: "#666" }}
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

      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* 通知バナー */}
        {searchParams.saved && (
          <div
            className="mb-6 px-5 py-3 rounded-sm text-sm flex items-center gap-3"
            style={{ background: "#0D1F12", border: "1px solid #1A4A25", color: "#6DBF88" }}
          >
            <span>✓</span>
            <span>「{searchParams.saved}」を保存しました</span>
          </div>
        )}
        {searchParams.approved && (
          <div
            className="mb-6 px-5 py-3 rounded-sm text-sm flex items-center gap-3"
            style={{ background: "#0D1525", border: "1px solid #1A3A5A", color: "#6A9DBF" }}
          >
            <span>✓</span>
            <span>「{searchParams.approved}」を公開しました — ブログへの反映は約1分後です</span>
          </div>
        )}

        {/* ステータスカード */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: "公開済み合計", value: totalPublished, sub: "全カテゴリ" },
            { label: "ヘア公開",     value: hairPublished.length,    sub: `下書き ${hairArticles.length}` },
            { label: "アイラッシュ公開", value: eyelashPublished.length, sub: `下書き ${eyelashArticles.length}` },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="rounded-sm px-5 py-4"
              style={{ background: "#161616", border: "1px solid #1A3A1A" }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#4A8A4A" }}>{label}</p>
              <p className="text-3xl font-light" style={{ color: "#D4C8B0" }}>{value}</p>
              <p className="text-[10px] mt-1" style={{ color: "#444" }}>{sub}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "今月公開",     value: thisMonthCount, sub: thisMonth },
            { label: "下書き合計",   value: allDrafts.length, sub: `薬機法フラグ ${yakkihouCount}` },
            { label: "店舗別公開",   value: null, subs: salonStats },
          ].map(({ label, value, sub, subs }) => (
            <div
              key={label}
              className="rounded-sm px-5 py-4"
              style={{ background: "#161616", border: "1px solid #222" }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#555" }}>{label}</p>
              {value !== null && value !== undefined ? (
                <>
                  <p className="text-3xl font-light" style={{ color: "#D4C8B0" }}>{value}</p>
                  {sub && <p className="text-[10px] mt-1" style={{ color: "#444" }}>{sub}</p>}
                </>
              ) : (
                <div className="space-y-1 mt-1">
                  {subs?.map(s => (
                    <div key={s.name} className="flex justify-between items-center">
                      <span className="text-[11px]" style={{ color: "#555" }}>{s.name}</span>
                      <span className="text-sm font-light" style={{ color: "#D4C8B0" }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* スケジュール設定 */}
        <div className="mb-3">
          <DailyGenerateSettings initialConfig={dailyGenerateConfig} />
        </div>
        <div className="mb-6">
          <AutoPublishSettings initialConfig={autoPublishConfig} />
        </div>

        {/* 薬機法フラグ警告 */}
        {yakkihouCount > 0 && (
          <div
            className="mb-6 px-5 py-4 rounded-sm flex items-center gap-3 text-sm"
            style={{ background: "#1F1700", border: "1px solid #4A3A00", color: "#C8A840" }}
          >
            <span>⚠</span>
            <span>薬機法フラグが {yakkihouCount} 件あります。公開前に内容を確認してください。</span>
          </div>
        )}

        {/* 記事セクション見出し */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C8A860" }}>
            Draft Articles
          </p>
          <div className="h-px flex-1" style={{ background: "#222" }} />
          <Link
            href="/admin/blog/generate"
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
            style={{
              background: "linear-gradient(135deg, #C8A860, #A88840)",
              color: "#0F0F0F",
            }}
          >
            + 記事生成
          </Link>
        </div>

        <DraftList articles={allDrafts} />

      </main>
    </>
  )
}
