'use client'

export default function RevertButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="text-xs px-4 py-2 rounded-sm transition-colors hover:opacity-70"
      style={{ background: "#1E1500", color: "#888", border: "1px solid #3A2A00" }}
      onClick={(e) => {
        if (!confirm(`「${title}」を下書きに戻しますか？`)) e.preventDefault()
      }}
    >
      下書きに戻す
    </button>
  )
}
