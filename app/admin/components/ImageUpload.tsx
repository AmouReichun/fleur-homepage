"use client";

import { useState, useRef } from "react";
import { uploadImage } from "../actions";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  section: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, section, label = "画像" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("画像ファイルを選択してください"); return; }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);
      const url = await uploadImage(formData);
      onChange(url);
    } catch {
      setError("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-2">{label}</label>
      <div className="flex items-start gap-4 p-4 bg-white border border-[#D0CCC8] rounded-lg">
        {value ? (
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-[#E8E4E0] flex-shrink-0">
            <Image src={value} alt="preview" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-28 h-28 bg-[#F4F2EF] rounded-lg border-2 border-dashed border-[#D0CCC8] flex flex-col items-center justify-center flex-shrink-0 text-center">
            <span className="text-2xl mb-1">🖼</span>
            <span className="text-xs text-[#888]">画像なし</span>
          </div>
        )}

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full text-sm bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 font-medium"
          >
            {uploading ? "アップロード中..." : "📁　画像を選択"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-full text-xs text-red-500 hover:text-red-700 py-1.5 transition-colors border border-red-200 rounded-lg"
            >
              画像を削除
            </button>
          )}
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <p className="text-xs text-[#888] mb-1">または URL を直接入力：</p>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/images/admin/photo.jpg"
              className="w-full border border-[#D0CCC8] bg-[#F8F8F6] text-[#1A1A1A] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] transition-all"
            />
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
