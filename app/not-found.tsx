import Link from "next/link";

export const metadata = {
  title: "ページが見つかりません | fleur GROUP",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0F0F0F", color: "#E8E8E8" }}
    >
      <p
        className="font-cormorant text-[11px] tracking-[0.5em] uppercase mb-8"
        style={{ color: "#C8A860" }}
      >
        fleur GROUP
      </p>

      <p
        className="font-cormorant text-[80px] leading-none font-light mb-4"
        style={{ color: "#C8A860", opacity: 0.4 }}
      >
        404
      </p>

      <h1
        className="text-sm tracking-[0.2em] mb-3"
        style={{ color: "#E8E8E8" }}
      >
        ページが見つかりません
      </h1>

      <p
        className="text-xs text-center leading-relaxed mb-10 max-w-xs"
        style={{ color: "#888" }}
      >
        お探しのページは削除・移動されたか、
        <br />
        URLが間違っている可能性があります。
      </p>

      <div className="h-px w-12 mb-10" style={{ background: "#C8A860", opacity: 0.4 }} />

      <div className="flex flex-col items-center gap-4">
        <Link
          href="/"
          className="text-xs tracking-[0.25em] px-8 py-3 transition-opacity hover:opacity-70"
          style={{
            border: "1px solid #C8A860",
            color: "#C8A860",
          }}
        >
          ← トップページへ
        </Link>
        <Link
          href="/blog"
          className="text-xs tracking-widest transition-opacity hover:opacity-70"
          style={{ color: "#666" }}
        >
          ブログを見る
        </Link>
      </div>
    </div>
  );
}
