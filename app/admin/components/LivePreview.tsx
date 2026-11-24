"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 管理画面の右側プレビュー：本物の公開ページを iframe でそのまま映す（2026-11-24 社長）。
 * 以前は管理画面用の「簡単な見本」を手作りしていたが、本物のデザインとずれていくので廃止。
 * - 保存に成功したら自動で読み込み直す（保存すると revalidateTag で公開ページがすぐ新しくなる）
 * - 入力中（未保存）の内容は映らない
 * - スマホ幅／PC幅を切り替えられる（PC幅は縮小して表示）
 */
const SP_WIDTH = 390;
const PC_WIDTH = 1280;

export default function LivePreview({ path, saveStatus }: { path: string; saveStatus: "idle" | "success" | "error" }) {
  const [device, setDevice] = useState<"sp" | "pc">("sp");
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const frameRef = useRef<HTMLIFrameElement>(null);

  // 保存できたら読み込み直す
  useEffect(() => {
    if (saveStatus === "success") {
      setLoading(true);
      setReloadKey((k) => k + 1);
    }
  }, [saveStatus]);

  // プレビュー欄の大きさを測る（PC幅を縮小するため）
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [pathname, hash = ""] = path.split("#");
  const src = `${pathname}${pathname.includes("?") ? "&" : "?"}_preview=${reloadKey}${hash ? `#${hash}` : ""}`;

  // 読み込みが終わったら「読み込み中」を消して、「#faq」などの場所まで下げる。
  // （管理画面の準備より先に読み込みが終わることがあるので、onLoad ではなくここで見張る）
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const onReady = () => {
      setLoading(false);
      if (!hash) return;
      const doc = frame.contentDocument;
      if (!doc) return;
      // 画像などの読み込みで位置がずれるので、数秒間は合わせ直す（自分でスクロールしたらやめる）
      let userMoved = false;
      const stop = () => { userMoved = true; };
      doc.addEventListener("wheel", stop, { once: true, passive: true });
      doc.addEventListener("touchstart", stop, { once: true, passive: true });
      doc.addEventListener("keydown", stop, { once: true });
      [100, 600, 1500, 3000, 5000, 8000].forEach((ms) =>
        timers.push(setTimeout(() => {
          if (userMoved) return;
          try {
            doc.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" as ScrollBehavior });
          } catch { /* 何もしない */ }
        }, ms))
      );
    };
    const doc = frame.contentDocument;
    if (doc && doc.readyState === "complete" && doc.URL !== "about:blank") onReady();
    frame.addEventListener("load", onReady);
    return () => {
      frame.removeEventListener("load", onReady);
      timers.forEach(clearTimeout);
    };
  }, [reloadKey, device, hash]);

  const frameW = device === "sp" ? SP_WIDTH : PC_WIDTH;
  const scale = box.w > 0 ? Math.min(1, (box.w - 24) / frameW) : 1;
  const frameH = box.h > 0 ? (box.h - 24) / scale : 800;

  return (
    <>
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2 flex-wrap">
        <p className="text-xs font-semibold text-[#666] tracking-wider mr-auto">👁　プレビュー（本物のページ）</p>
        <div className="flex rounded-md border border-gray-300 overflow-hidden text-[11px]">
          {(["sp", "pc"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`px-2.5 py-1 ${device === d ? "bg-[#2A2A2A] text-white" : "bg-white text-[#666] hover:bg-gray-100"}`}
            >
              {d === "sp" ? "スマホ" : "パソコン"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); setReloadKey((k) => k + 1); }}
          className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 bg-white text-[#666] hover:bg-gray-100"
        >
          ↻ 読み込み直す
        </button>
        <a href={path} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2.5 py-1 rounded-md border border-gray-300 bg-white text-[#666] hover:bg-gray-100">
          新しいタブで開く ↗
        </a>
      </div>
      <p className="px-4 py-1.5 text-[10px] text-[#999] bg-gray-50 border-b border-gray-200">
        「保存する」を押すと、ここに保存した内容が本物の見た目で映ります（入力中の内容は保存するまで映りません）
      </p>
      <div ref={boxRef} className="relative flex-1 min-h-0 overflow-hidden bg-[#EDEBE8] flex justify-center p-3">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[#999] pointer-events-none z-10">読み込み中…</div>
        )}
        <div style={{ width: frameW * scale, height: frameH * scale }} className="relative flex-shrink-0">
          <iframe
            key={`${reloadKey}-${device}`}
            src={src}
            title="公開ページのプレビュー"
            ref={frameRef}
            style={{ width: frameW, height: frameH, transform: `scale(${scale})`, transformOrigin: "top left" }}
            className="absolute top-0 left-0 bg-white border border-gray-300 rounded shadow-sm"
          />
        </div>
      </div>
    </>
  );
}
