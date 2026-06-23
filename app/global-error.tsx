"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const msg = error?.message ?? "";
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      msg.includes("Loading chunk") ||
      (msg.includes("chunk") && !msg.includes("fetch"));
    if (isChunkError) {
      window.location.reload();
    }
  }, [error]);

  return (
    <html lang="ja">
      <body style={{ fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0, background: "#FAF8F5" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#B8956A", marginBottom: "1.5rem" }}>ERROR</p>
          <h2 style={{ fontWeight: 300, fontSize: "1.5rem", color: "#2A2A2A", marginBottom: "1rem" }}>
            ページの読み込みに失敗しました
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: "2rem" }}>
            ページを再読み込みしてください。
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#B8956A", color: "#fff", border: "none", padding: "0.75rem 2rem", fontSize: "0.875rem", cursor: "pointer" }}
          >
            再読み込み
          </button>
        </div>
      </body>
    </html>
  );
}
