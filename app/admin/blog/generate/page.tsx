import Link from "next/link";
import { logout } from "../actions";
import GenerateClient from "./GenerateClient";

export const metadata = { title: "記事作成 | 管理画面" };

export default function GeneratePage() {
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
              className="text-xs px-3 py-1.5 rounded-sm transition-colors"
              style={{ background: "#222", color: "#E8E8E8" }}
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

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#C8A860" }}>
            Create Article
          </p>
          <div className="h-px flex-1" style={{ background: "#222" }} />
        </div>

        <p className="text-xs mb-6 leading-relaxed" style={{ color: "#666" }}>
          スタッフ投稿・Instagram 投稿から記事を自動生成します。<br />
          生成後は GitHub に draft 記事としてコミットされ、Vercel が約1分で自動更新します。<br />
          公開するには「下書き」タブから記事を確認し、公開ボタンで反映してください。
        </p>

        <GenerateClient />
      </main>
    </>
  );
}
