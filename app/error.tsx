"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // chunk load error (新デプロイ後に古いキャッシュが残っている場合) は自動リロード
    const msg = error?.message ?? "";
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      msg.includes("chunk") ||
      msg.includes("Loading chunk") ||
      msg.includes("Failed to fetch");
    if (isChunkError) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-site-accent uppercase mb-6">Error</p>
      <h2 className="font-serif text-2xl font-light text-site-text mb-4">
        ページの読み込みに失敗しました
      </h2>
      <p className="text-sm text-site-muted leading-relaxed mb-8 max-w-md">
        一時的なエラーが発生しました。<br />
        ページを再読み込みするか、少し時間をおいてからお試しください。
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="bg-site-accent text-white px-8 py-3 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200"
        >
          再読み込み
        </button>
        <button
          onClick={reset}
          className="border border-site-greige text-site-text px-8 py-3 text-sm font-medium tracking-wider hover:border-site-accent hover:text-site-accent transition-all duration-200"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
