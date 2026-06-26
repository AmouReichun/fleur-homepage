'use client'

export default function PublishButton({ title }: { title: string }) {
  return (
    <button
      type="submit"
      className="text-xs px-4 py-2 rounded-sm transition-opacity hover:opacity-80"
      style={{
        background: "linear-gradient(135deg, #C8A860, #A88840)",
        color: "#0F0F0F",
        fontWeight: 600,
        letterSpacing: "0.05em",
      }}
      onClick={(e) => {
        if (!confirm(`「${title}」を公開しますか？`)) e.preventDefault()
      }}
    >
      公開
    </button>
  )
}
