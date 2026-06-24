"use client";

interface SectionLayoutProps {
  title: string;
  children: React.ReactNode;
  preview: React.ReactNode;
  onSave: () => void;
  saving: boolean;
  saveStatus: "idle" | "success" | "error";
  saveError?: string;
}

export default function SectionLayout({
  title,
  children,
  preview,
  onSave,
  saving,
  saveStatus,
  saveError,
}: SectionLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-2 pl-16 pr-4 md:px-6 py-3 md:py-4 bg-white border-b border-[#E8E4E0] shadow-sm sticky top-0 z-20">
        <h1 className="text-sm md:text-base font-semibold text-[#1A1A1A] truncate">{title}</h1>
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {saveStatus === "success" && (
            <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 md:px-3 py-1 rounded-full whitespace-nowrap">
              ✓ 保存しました
            </span>
          )}
          {saveStatus === "error" && (
            <span className="hidden sm:inline text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full max-w-[40vw] truncate" title={saveError}>
              保存に失敗しました{saveError ? `：${saveError.slice(0, 60)}` : ""}
            </span>
          )}
          <button
            onClick={() => onSave()}
            disabled={saving}
            className="bg-[#B8956A] text-white text-sm px-4 md:px-6 py-2 md:py-2.5 rounded-lg hover:bg-[#A07850] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm whitespace-nowrap"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>

      {/* モバイル用エラーバナー */}
      {saveStatus === "error" && (
        <div className="sm:hidden px-4 py-2 bg-red-50 border-b border-red-200 text-xs text-red-600">
          保存に失敗しました{saveError ? `：${saveError.slice(0, 120)}` : ""}
        </div>
      )}

      {/* 左右分割（モバイルは縦積み） */}
      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
        {/* 左：編集フォーム */}
        <div className="w-full md:w-1/2 md:overflow-y-auto bg-[#F4F2EF] border-b md:border-b-0 md:border-r border-[#E8E4E0]">
          <div className="px-4 py-3 bg-[#EDE9E4] border-b border-[#E0DCD8] sticky top-0 z-10">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">✏️　編集エリア</p>
          </div>
          <div className="p-4 md:p-5 space-y-4">{children}</div>
        </div>

        {/* 右：プレビュー */}
        <div className="w-full md:w-1/2 md:overflow-y-auto bg-white">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">👁　プレビュー（実際の見た目）</p>
          </div>
          <div className="text-[#2A2A2A]">{preview}</div>
        </div>
      </div>
    </div>
  );
}
