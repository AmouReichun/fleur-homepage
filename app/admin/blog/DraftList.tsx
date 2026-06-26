'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { bulkApprove, deleteArticle, bulkDeleteArticles } from './actions'
import type { AdminArticle } from '@/lib/blog/github-admin'

export default function DraftList({ articles }: { articles: AdminArticle[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const allKeys = articles.map(a => `${a.category}/${a.slug}`)
  const allSelected = allKeys.length > 0 && allKeys.every(k => selected.has(k))

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allKeys))
  }

  function handleDeleteOne(key: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？\nこの操作は取り消せません。`)) return
    const [category, ...rest] = key.split('/')
    setDeletingKey(key)
    setErrorMsg(null)
    startTransition(async () => {
      const result = await deleteArticle(category, rest.join('/'))
      if (result?.error) {
        setErrorMsg(result.error)
        setDeletingKey(null)
      } else {
        router.refresh()
      }
    })
  }

  function handleBulkDelete() {
    if (selected.size === 0 || isPending) return
    const items = Array.from(selected).map(key => {
      const [category, ...rest] = key.split('/')
      return { category, slug: rest.join('/') }
    })
    if (!confirm(`選択した ${items.length} 件を削除しますか？\nこの操作は取り消せません。`)) return
    setErrorMsg(null)
    startTransition(async () => {
      const result = await bulkDeleteArticles(items)
      if (result?.error) {
        setErrorMsg(result.error)
      } else {
        setSelected(new Set())
        router.refresh()
      }
    })
  }

  function handleBulkPublish() {
    if (selected.size === 0 || isPending) return
    const items = Array.from(selected).map(key => {
      const [category, ...rest] = key.split('/')
      return { category, slug: rest.join('/') }
    })
    if (!confirm(`選択した ${items.length} 件を公開しますか？`)) return
    setErrorMsg(null)
    startTransition(async () => {
      const result = await bulkApprove(items)
      if (result?.error) setErrorMsg(result.error)
      // bulkApprove は成功時に redirect() を呼ぶため、失敗時のみここに到達
    })
  }

  if (articles.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-sm"
        style={{ background: "#141414", border: "1px solid #1E1E1E" }}
      >
        <p className="text-lg mb-2" style={{ color: "#444" }}>下書き記事はありません</p>
        <p className="text-sm" style={{ color: "#333" }}>記事生成ボタンから新しい記事を作成してください</p>
      </div>
    )
  }

  return (
    <div>
      {/* エラー表示 */}
      {errorMsg && (
        <div
          className="mb-4 px-5 py-3 rounded-sm text-sm flex items-center gap-3"
          style={{ background: "#1F0D0D", border: "1px solid #5A1A1A", color: "#E08080" }}
        >
          <span>✕</span>
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="ml-auto text-xs opacity-60 hover:opacity-100"
          >
            閉じる
          </button>
        </div>
      )}

      {/* 一括操作バー */}
      <div
        className="flex items-center gap-4 px-4 py-3 mb-3 rounded-sm"
        style={{ background: "#161616", border: "1px solid #222" }}
      >
        {/* 全選択チェックボックス */}
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-2 text-xs shrink-0"
          style={{ color: "#888" }}
        >
          <div
            className="w-4 h-4 border flex items-center justify-center rounded-sm shrink-0"
            style={{
              borderColor: allSelected ? "#C8A860" : "#444",
              background: allSelected ? "#C8A860" : "transparent",
            }}
          >
            {allSelected && <span style={{ color: "#0F0F0F", fontSize: "10px", lineHeight: 1 }}>✓</span>}
          </div>
          全選択
        </button>

        <span style={{ color: "#333" }}>|</span>

        <span className="text-xs flex-1" style={{ color: "#555" }}>
          {selected.size > 0 ? `${selected.size} 件選択中` : '記事を選択してください'}
        </span>

        <button
          type="button"
          onClick={handleBulkDelete}
          disabled={selected.size === 0 || isPending}
          className="text-xs px-4 py-2 rounded-sm font-medium transition-opacity disabled:opacity-30"
          style={{ background: "#2A1010", color: "#E08080", border: "1px solid #5A2020" }}
        >
          {isPending ? '削除中…' : selected.size > 0 ? `${selected.size} 件削除` : '削除'}
        </button>
        <button
          type="button"
          onClick={handleBulkPublish}
          disabled={selected.size === 0 || isPending}
          className="text-xs px-5 py-2 rounded-sm font-medium transition-opacity disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg, #C8A860, #A88840)",
            color: "#0F0F0F",
          }}
        >
          {isPending ? '公開中…' : selected.size > 0 ? `${selected.size} 件を公開` : '公開'}
        </button>
      </div>

      {/* 記事リスト */}
      <div className="space-y-2">
        {articles.map(article => {
          const key = `${article.category}/${article.slug}`
          const isChecked = selected.has(key)
          const isHair = article.category === 'hair'

          return (
            <div
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center gap-4 px-5 py-4 rounded-sm cursor-pointer transition-colors"
              style={{
                background: isChecked ? "#1A1A14" : "#141414",
                border: article.yakkihou_flag
                  ? "1px solid #3A2A00"
                  : isChecked
                  ? "1px solid #C8A860"
                  : "1px solid #1E1E1E",
              }}
            >
              {/* チェックボックス */}
              <div
                className="w-4 h-4 border flex items-center justify-center rounded-sm shrink-0"
                style={{
                  borderColor: isChecked ? "#C8A860" : "#444",
                  background: isChecked ? "#C8A860" : "transparent",
                }}
                onClick={e => { e.stopPropagation(); toggle(key) }}
              >
                {isChecked && <span style={{ color: "#0F0F0F", fontSize: "10px", lineHeight: 1 }}>✓</span>}
              </div>

              {/* サムネイル */}
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

              {/* 記事情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
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
                  {article.yakkihou_flag && (
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-sm"
                      style={{ background: "#1F1700", color: "#C8A840", border: "1px solid #3A2A00" }}
                    >
                      ⚠ 薬機法 [{article.yakkihou_words?.join('、')}]
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium truncate" style={{ color: "#D4C8B0" }}>
                  {article.title}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#444" }}>
                  {article.date} · {article.slug}
                </p>
              </div>

              {/* アクション（クリック伝播を止める） */}
              <div
                className="flex items-center gap-2 shrink-0"
                onClick={e => e.stopPropagation()}
              >
                <Link
                  href={`/admin/blog/edit/${article.category}/${article.slug}`}
                  className="text-xs px-4 py-2 rounded-sm transition-colors"
                  style={{ background: "#1E1E1E", color: "#888", border: "1px solid #2A2A2A" }}
                >
                  編集
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteOne(key, article.title)}
                  disabled={isPending && deletingKey === key}
                  className="text-xs px-3 py-2 rounded-sm transition-colors disabled:opacity-40"
                  style={{ background: "#1A0A0A", color: "#C06060", border: "1px solid #3A1818" }}
                  title="削除"
                >
                  {isPending && deletingKey === key ? '…' : '削除'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
