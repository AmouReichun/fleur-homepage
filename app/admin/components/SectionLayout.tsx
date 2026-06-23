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
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E4E0] shadow-sm">
        <h1 className="text-base font-semibold text-[#1A1A1A]">{title}</h1>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
              ✓ 保存しました
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full" title={saveError}>
              保存に失敗しました{saveError ? `：${saveError.slice(0, 60)}` : ""}
            </span>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-[#B8956A] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#A07850] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
        </div>
      </div>

      {/* 左右分割 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左：編集フォーム */}
        <div className="w-1/2 overflow-y-auto bg-[#F4F2EF] border-r border-[#E8E4E0]">
          <div className="px-4 py-3 bg-[#EDE9E4] border-b border-[#E0DCD8]">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">✏️　編集エリア</p>
          </div>
          <div className="p-5 space-y-4">{children}</div>
        </div>

        {/* 右：プレビュー */}
        <div className="w-1/2 overflow-y-auto bg-white">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <p className="text-xs font-semibold text-[#666] uppercase tracking-wider">👁　プレビュー（実際の見た目）</p>
          </div>
          <div className="text-[#2A2A2A]">{preview}</div>
        </div>
      </div>
    </div>
  );
}
