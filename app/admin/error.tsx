"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F4F2EF] flex items-center justify-center p-8">
      <div className="bg-white border border-[#E8E4E0] rounded-xl p-8 max-w-md w-full text-center shadow-sm">
        <p className="text-xs tracking-[0.3em] text-red-400 uppercase mb-4">管理パネルエラー</p>
        <h2 className="text-lg font-medium text-[#1A1A1A] mb-3">ページの読み込みに失敗しました</h2>
        <p className="text-sm text-[#888] mb-2 leading-relaxed">
          {error.message || "不明なエラーが発生しました"}
        </p>
        {error.digest && (
          <p className="text-xs text-[#aaa] mb-6 font-mono">digest: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-[#B8956A] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#A07850] transition-colors"
          >
            もう一度試す
          </button>
          <button
            onClick={() => window.location.href = "/admin"}
            className="border border-[#E0DCD8] text-[#1A1A1A] text-sm px-6 py-2.5 rounded-lg hover:border-[#B8956A] transition-colors"
          >
            管理トップへ
          </button>
        </div>
      </div>
    </div>
  );
}
