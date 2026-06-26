export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0F0F0F", color: "#E8E8E8" }}>
      {children}
    </div>
  )
}
