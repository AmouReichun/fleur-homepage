"use client";

import { useState, useRef, useCallback } from "react";

type Props = {
  salonKey: string;
  salonLabel: string;
  salonSub: string;
};

// ファイルが画像っぽいか判定（type が空の端末でも拡張子で救う）
function looksLikeImage(f: File): boolean {
  return (
    f.type.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|heic|heif|bmp|tiff?|avif)$/i.test(f.name)
  );
}

// 画像を読み込んで描画ソースと寸法を返す。
// createImageBitmap は EXIF 回転補正・HEIC デコード（iOS Safari）に強く、
// 失敗した場合のみ <img> にフォールバックする。
async function decodeImage(
  file: File,
): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      /* フォールバックへ */
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () =>
        reject(new Error("画像を読み込めませんでした（対応していない形式の可能性があります）"));
      im.src = url;
    });
    return {
      source: img,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (e) {
    URL.revokeObjectURL(url);
    throw e;
  }
}

async function compressImage(file: File, maxPx = 1600, quality = 0.82): Promise<Blob> {
  const { source, width, height, cleanup } = await decodeImage(file);
  try {
    if (!width || !height) throw new Error("画像サイズを取得できませんでした");

    const scale = Math.min(1, maxPx / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("画像処理に失敗しました");
    // 白背景で塗ってから描画（透過PNG等が黒くならないように）
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (blob && blob.size > 0) return blob;

    // 古い iOS Safari は toBlob が null を返すことがあるため dataURL で代替
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const base64 = dataUrl.split(",")[1];
    if (!base64) throw new Error("画像の変換に失敗しました");
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: "image/jpeg" });
  } finally {
    cleanup();
  }
}

export default function StaffUploadForm({ salonKey, salonLabel, salonSub }: Props) {
  const [memo, setMemo]       = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile]       = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((picked: FileList | null) => {
    const f = picked?.[0];
    if (!f) return;
    if (!looksLikeImage(f)) {
      setError("画像ファイルを選んでください");
      return;
    }
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, [preview]);

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file)        { setError("写真を選んでください"); return; }
    if (!memo.trim()) { setError("メモを入力してください"); return; }
    setError("");
    setSubmitting(true);

    let compressed: Blob;
    try {
      compressed = await compressImage(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "画像の変換に失敗しました");
      setSubmitting(false);
      return;
    }

    try {
      const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
      const formData = new FormData();
      formData.append("salon", salonKey);
      formData.append("memo", memo);
      formData.append("images", compressed, `${baseName}.jpg`);

      const res = await fetch("/api/staff/upload", { method: "POST", body: formData });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) { setError(json.error ?? "送信に失敗しました。通信環境を確認してもう一度お試しください"); setSubmitting(false); return; }
      setDone(true);
    } catch {
      setError("送信に失敗しました。通信環境を確認してもう一度お試しください");
      setSubmitting(false);
    }
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setMemo("");
    setSubmitting(false); setDone(false); setError("");
  };

  // ── 完了画面 ─────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 text-center">
        <div className="text-5xl">✅</div>
        <div>
          <p className="text-base font-light mb-1" style={{ color: "#D4C8B0" }}>送信完了！</p>
          <p className="text-xs" style={{ color: "#666" }}>管理者が確認後、記事を作成します</p>
        </div>
        <button
          onClick={reset}
          className="mt-2 px-8 py-3 rounded-full text-sm font-medium"
          style={{ background: "#222", color: "#888", border: "1px solid #333" }}
        >
          続けて送る
        </button>
      </div>
    );
  }

  // ── 送信中 ────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#C8A860", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#666" }}>送信中...</p>
      </div>
    );
  }

  // ── フォーム ──────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <header className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #1A1A1A" }}>
        <div>
          <p className="text-sm font-medium" style={{ color: "#C8A860" }}>{salonLabel}</p>
          <p className="text-[11px]" style={{ color: "#444" }}>{salonSub}</p>
        </div>
        <p className="text-[10px] tracking-widest uppercase" style={{ color: "#333" }}>症例アップロード</p>
      </header>

      <main className="max-w-md mx-auto px-5 py-8 space-y-6">
        {error && (
          <div className="px-4 py-3 rounded text-sm" style={{ background: "#1F0D0D", border: "1px solid #5A1A1A", color: "#E08080" }}>
            {error}
          </div>
        )}

        {/* 写真 */}
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "#555" }}>症例写真（1枚）</p>
          {!preview ? (
            <div
              onClick={() => fileRef.current?.click()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files); }}
              onDragOver={(e) => e.preventDefault()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer"
              style={{ border: "1.5px dashed #2A2A2A", padding: "36px 16px", background: "#111" }}
            >
              <span className="text-3xl">📷</span>
              <p className="text-sm" style={{ color: "#555" }}>タップして写真を選ぶ</p>
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden" style={{ background: "#1A1A1A" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
              >×</button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { handleFile(e.target.files); e.target.value = ""; }}
          />
        </div>

        {/* メモ */}
        <div className="space-y-2">
          <p className="text-xs" style={{ color: "#555" }}>ひとことメモ</p>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={4}
            placeholder={"例：白髪ぼかしハイライト、40代、艶重視\n仕上がりは自然な馴染み感を希望"}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
            style={{ background: "#111", border: "1px solid #2A2A2A", color: "#E8E8E8", lineHeight: 1.7 }}
            onFocus={(e) => (e.target.style.borderColor = "#444")}
            onBlur={(e)  => (e.target.style.borderColor = "#2A2A2A")}
          />
          <p className="text-xs" style={{ color: "#333" }}>施術内容・ターゲット・仕上がりのポイントなど</p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-4 rounded-xl text-sm font-medium tracking-wide"
          style={{ background: "linear-gradient(135deg,#C8A860,#A88840)", color: "#0F0F0F" }}
        >
          送信する
        </button>
      </main>
    </div>
  );
}
