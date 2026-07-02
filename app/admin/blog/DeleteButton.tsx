'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteArticle } from './actions'

export default function DeleteButton({
  category,
  slug,
  title,
}: {
  category: string
  slug: string
  title: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (isPending) return
    if (!confirm(`「${title}」を削除しますか？\nこの操作は取り消せません。`)) return
    startTransition(async () => {
      const result = await deleteArticle(category, slug)
      if (result?.error) {
        alert(`削除に失敗しました：${result.error}`)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs px-3 py-2 rounded-sm transition-colors disabled:opacity-40"
      style={{ background: "#1A0A0A", color: "#C06060", border: "1px solid #3A1818" }}
      title="削除"
    >
      {isPending ? '…' : '削除'}
    </button>
  )
}
