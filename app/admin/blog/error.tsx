'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[admin error]', error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0F0F0F" }}
    >
      <div
        className="max-w-md w-full mx-4 p-8 rounded-sm"
        style={{ background: "#141414", border: "1px solid #3A1A00" }}
      >
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-4"
          style={{ color: "#C8A860" }}
        >
          エラーが発生しました
        </p>
        <p className="text-sm mb-2" style={{ color: "#D4C8B0" }}>
          管理画面の処理中にエラーが起きました。
        </p>
        <p className="text-xs mb-6 font-mono break-all" style={{ color: "#666" }}>
          {error.message || 'Unknown error'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="text-xs px-5 py-2 rounded-sm"
            style={{
              background: "linear-gradient(135deg, #C8A860, #A88840)",
              color: "#0F0F0F",
            }}
          >
            再試行
          </button>
          <a
            href="/admin/blog"
            className="text-xs px-5 py-2 rounded-sm"
            style={{ background: "#1E1E1E", color: "#888", border: "1px solid #2A2A2A" }}
          >
            管理画面トップへ
          </a>
        </div>
      </div>
    </div>
  )
}
