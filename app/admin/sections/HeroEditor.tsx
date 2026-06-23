"use client";

import { useState, useTransition, useRef } from "react";
import { saveContent, uploadImage } from "../actions";
import SectionLayout from "../components/SectionLayout";
import { TextField } from "../components/FormField";
import Image from "next/image";

interface HeroData {
  title: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  images: string[];
}

export default function HeroEditor({ initial }: { initial: HeroData }) {
  const [data, setData] = useState<HeroData>({
    ...initial,
    images: initial.images ?? [],
  });
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof HeroData>(key: K, value: HeroData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function removeImage(i: number) {
    setData((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));
  }

  function moveImage(i: number, dir: -1 | 1) {
    setData((prev) => {
      const imgs = [...prev.images];
      const j = i + dir;
      if (j < 0 || j >= imgs.length) return prev;
      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
      return { ...prev, images: imgs };
    });
  }

  async function handleAddFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("画像ファイルを選択してください");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", "hero");
      const url = await uploadImage(formData);
      const updated = { ...data, images: [...data.images, url] };
      setData(updated);
      handleSave(updated);
    } catch {
      setUploadError("アップロードに失敗しました");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSave(overrideData?: HeroData) {
    const payload = overrideData ?? data;
    startTransition(async () => {
      const res = await saveContent("hero", payload);
      if (res.success) {
        setSaveStatus("success");
        setSaveError("");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setSaveError(res.error ?? "不明なエラー");
      }
    });
  }

  const hasImage = data.images.length > 0;

  const preview = (
    <section className={`relative overflow-hidden min-h-[300px] flex items-center ${hasImage ? "" : "bg-[#F5F0EA]"}`}>
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.images[0]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/45" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0E8E8]/40 via-[#F5F0EA] to-white/60" />
      )}
      <div className="relative w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <p className={`text-xs tracking-[0.3em] mb-4 uppercase ${hasImage ? "text-white/80" : "text-[#B8956A]"}`}>
          fleur GROUP
        </p>
        <h1 className={`text-xl font-semibold leading-snug mb-4 ${hasImage ? "text-white" : "text-[#2A2A2A]"}`}>
          {data.title || "（タイトルを入力）"}
        </h1>
        <p className={`text-sm leading-relaxed max-w-2xl mx-auto mb-8 ${hasImage ? "text-white/80" : "text-[#888888]"}`}>
          {data.subtitle || "（サブタイトルを入力）"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <span className="inline-block bg-[#B8956A] text-white px-8 py-3 text-sm font-medium tracking-wider">
            {data.cta1 || "店舗を選ぶ"}
          </span>
          <span className={`inline-block px-8 py-3 text-sm font-medium tracking-wider ${hasImage ? "border border-white text-white" : "border border-[#2A2A2A] text-[#2A2A2A]"}`}>
            {data.cta2 || "ブログを読む"}
          </span>
        </div>
        {data.images.length > 1 && (
          <p className="text-xs text-white/60 mt-4">※ {data.images.length}枚の画像がスライドショーで表示されます</p>
        )}
      </div>
    </section>
  );

  return (
    <SectionLayout
      title="ヒーローセクション"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      <TextField label="メインタイトル" value={data.title} onChange={(v) => update("title", v)} multiline rows={3} />
      <TextField label="サブタイトル" value={data.subtitle} onChange={(v) => update("subtitle", v)} multiline rows={4} />
      <TextField label="ボタン1テキスト（店舗ページリンク）" value={data.cta1} onChange={(v) => update("cta1", v)} placeholder="店舗を選ぶ" />
      <TextField label="ボタン2テキスト（ブログリンク）" value={data.cta2} onChange={(v) => update("cta2", v)} placeholder="ブログを読む" />

      {/* 複数画像管理 */}
      <div>
        <label className="block text-sm font-medium text-[#333] mb-1">背景画像</label>
        <p className="text-xs text-[#888] mb-3">複数追加するとスライドショーになります。左右の矢印で表示順を変更できます。</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {data.images.map((src, i) => (
            <div key={i} className="group relative">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-[#E8E4E0]">
                <Image src={src} alt={`背景画像 ${i + 1}`} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 bg-black/70 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  ✕
                </button>
                <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                  {i + 1}
                </span>
              </div>
              <div className="flex gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="flex-1 text-xs py-1 border border-[#D0CCC8] rounded hover:bg-[#F4F2EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === data.images.length - 1}
                  className="flex-1 text-xs py-1 border border-[#D0CCC8] rounded hover:bg-[#F4F2EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ▶
                </button>
              </div>
            </div>
          ))}

          {/* 追加ボタン */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-video border-2 border-dashed border-[#D0CCC8] rounded-lg flex flex-col items-center justify-center text-[#888] hover:border-[#B8956A] hover:text-[#B8956A] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="text-xs">アップロード中...</span>
            ) : (
              <>
                <span className="text-2xl mb-1 leading-none">＋</span>
                <span className="text-xs">画像を追加</span>
              </>
            )}
          </button>
        </div>

        {uploadError && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-2">{uploadError}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAddFile}
          className="hidden"
        />
      </div>
    </SectionLayout>
  );
}
