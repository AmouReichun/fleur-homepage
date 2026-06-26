"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { IgPost } from "@/lib/blog/instagram-api";
import type { StaffUpload } from "@/lib/blog/staff-uploads";

type ItemStatus = "idle" | "generating" | "done" | "error";

type IgItem     = IgPost     & { itemType: "instagram"; status: ItemStatus; resultSlug?: string; errorMsg?: string };
type UploadItem = StaffUpload & { itemType: "upload";    status: ItemStatus; resultSlug?: string; errorMsg?: string };
type ListItem   = IgItem | UploadItem;

function proxyUrl(imageGithubPath: string) {
  return `/api/admin/upload-image?path=${encodeURIComponent(imageGithubPath)}`;
}

function categoryLabel(c: string) {
  return c === "hair" ? "ヘア" : "アイラッシュ";
}

export default function GenerateClient() {
  const router = useRouter();
  const [items, setItems]       = useState<ListItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [igError, setIgError]   = useState("");
  const [fetchError, setFetchError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [running, setRunning]   = useState(false);
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/ig-posts")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        if (d.igError) setIgError(d.igError);

        const igItems: IgItem[] = (d.posts as IgPost[]).map((p) => ({
          ...p, itemType: "instagram" as const, status: "idle" as const,
        }));
        const uploadItems: UploadItem[] = (d.uploads as StaffUpload[]).map((u) => ({
          ...u, itemType: "upload" as const, status: "idle" as const,
        }));
        // スタッフ投稿を先頭に表示
        setItems([...uploadItems, ...igItems]);
      })
      .catch((e) => setFetchError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  // 生成しないアイテムを破棄（スタッフ投稿=実削除 / Instagram=一覧から非表示）
  async function discard(item: ListItem, e: React.MouseEvent) {
    e.stopPropagation();
    const isUpload = item.itemType === "upload";
    const ok = window.confirm(
      isUpload
        ? "このスタッフ投稿を削除しますか？（写真とメモを削除します。元に戻せません）"
        : "このInstagram投稿を一覧から非表示にしますか？（投稿自体は削除されません）",
    );
    if (!ok) return;

    setRemoving((prev) => new Set(prev).add(item.id));
    try {
      const body = isUpload
        ? {
            itemType: "upload",
            jsonGithubPath: (item as UploadItem).jsonGithubPath,
            imageGithubPath: (item as UploadItem).imageGithubPath,
          }
        : { itemType: "instagram", igId: item.id };

      const res = await fetch("/api/admin/discard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || d.error) throw new Error(d.error ?? "失敗しました");

      setItems((prev) => prev.filter((p) => p.id !== item.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    } catch (err) {
      window.alert((isUpload ? "削除" : "非表示") + "に失敗しました: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setRemoving((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  }

  async function generate() {
    if (selected.size === 0 || running) return;
    setRunning(true);

    for (const id of Array.from(selected)) {
      const item = items.find((p) => p.id === id);
      if (!item) continue;

      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status: "generating" as const } : p)));

      try {
        const body = item.itemType === "upload"
          ? { upload: item }
          : { post: item };

        const res = await fetch("/api/admin/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const d = await res.json();
        if (!res.ok || d.error) throw new Error(d.error ?? "不明なエラー");

        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "done" as const, resultSlug: d.slug } : p)),
        );
      } catch (e) {
        setItems((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "error" as const, errorMsg: String(e) } : p)),
        );
      }
    }

    setRunning(false);
    setSelected(new Set());
    router.push("/admin/blog");
  }

  const doneCount = items.filter((p) => p.status === "done").length;

  return (
    <div>
      {/* ヘッダー操作 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={generate}
          disabled={selected.size === 0 || running}
          className="px-5 py-2 text-sm font-medium transition-opacity disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #C8A860, #A88840)",
            color: "#0F0F0F",
            borderRadius: "2px",
          }}
        >
          {running ? "生成中..." : `選択した ${selected.size} 件を生成`}
        </button>
        {doneCount > 0 && (
          <p className="text-xs" style={{ color: "#C8A860" }}>
            ✓ {doneCount} 件生成完了 — Vercel が約1分で自動更新されます
          </p>
        )}
      </div>

      {fetchError && (
        <p className="text-sm mb-4" style={{ color: "#E07070" }}>
          取得エラー: {fetchError}
        </p>
      )}
      {igError && (
        <p className="text-xs mb-4 px-3 py-2" style={{ background: "#1A1200", color: "#A08030", borderRadius: "2px" }}>
          ⚠ Instagram 取得エラー（スタッフ投稿のみ表示）: {igError}
        </p>
      )}

      {loading && (
        <p className="text-sm" style={{ color: "#666" }}>投稿を取得中...</p>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const isUpload     = item.itemType === "upload";
          const isSelected   = selected.has(item.id);
          const isDone       = item.status === "done";
          const isGenerating = item.status === "generating";
          const isError      = item.status === "error";

          const imageUrl  = isUpload ? proxyUrl((item as UploadItem).imageGithubPath) : (item as IgItem).media_url;
          const caption   = isUpload ? (item as UploadItem).memo : (item as IgItem).caption;
          const salonName = item.salonName;
          const category  = item.category;
          const timestamp = item.timestamp.slice(0, 10);

          return (
            <div
              key={item.id}
              onClick={() => !isDone && !isGenerating && toggle(item.id)}
              className="flex gap-4 p-4 cursor-pointer transition-colors"
              style={{
                background: isSelected ? "#1A1A1A" : "#111",
                border: `1px solid ${
                  isDone       ? "#3A5A3A" :
                  isSelected   ? "#C8A860" :
                  isUpload     ? "#2A1F35" : "#222"
                }`,
                borderRadius: "3px",
                opacity: isDone ? 0.7 : 1,
              }}
            >
              {/* チェックボックス */}
              <div className="shrink-0 mt-0.5">
                {isDone       ? <span style={{ color: "#5A9A5A" }}>✓</span> :
                 isGenerating ? <span style={{ color: "#C8A860" }}>⋯</span> :
                 isError      ? <span style={{ color: "#E07070" }}>✗</span> : (
                  <div
                    className="w-4 h-4 border flex items-center justify-center"
                    style={{
                      borderColor: isSelected ? "#C8A860" : "#444",
                      background: isSelected ? "#C8A860" : "transparent",
                    }}
                  >
                    {isSelected && <span style={{ color: "#0F0F0F", fontSize: "10px" }}>✓</span>}
                  </div>
                )}
              </div>

              {/* サムネイル */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="w-16 h-16 object-cover shrink-0"
                style={{ borderRadius: "2px", background: "#1A1A1A" }}
              />

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {isUpload && (
                    <span
                      className="text-[10px] px-2 py-0.5"
                      style={{ background: "#251535", color: "#B090D0", borderRadius: "2px" }}
                    >
                      スタッフ投稿
                    </span>
                  )}
                  <span
                    className="text-[10px] px-2 py-0.5"
                    style={{
                      background: category === "hair" ? "#2A1F10" : "#1F0F18",
                      color: category === "hair" ? "#C8A860" : "#C87890",
                      borderRadius: "2px",
                    }}
                  >
                    {categoryLabel(category)}
                  </span>
                  <span className="text-[10px]" style={{ color: "#555" }}>{salonName}</span>
                  <span className="text-[10px]" style={{ color: "#555" }}>{timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#888" }}>
                  {caption.slice(0, 100)}
                </p>
                {isDone && item.resultSlug && (
                  <p className="text-[11px] mt-1" style={{ color: "#5A9A5A" }}>
                    下書き作成: /{category}/{item.resultSlug}
                  </p>
                )}
                {isError && (
                  <p className="text-[11px] mt-1" style={{ color: "#E07070" }}>
                    エラー: {item.errorMsg}
                  </p>
                )}
              </div>

              {/* 破棄ボタン（生成しないアイテムを削除/非表示） */}
              {!isDone && !isGenerating && (
                <button
                  onClick={(e) => discard(item, e)}
                  disabled={removing.has(item.id)}
                  className="shrink-0 self-start text-[11px] px-2 py-1 transition-colors hover:opacity-80 disabled:opacity-40"
                  style={{ color: "#9A6A6A", border: "1px solid #3A2A2A", borderRadius: "2px", background: "transparent" }}
                  title={isUpload ? "このスタッフ投稿を削除" : "一覧から非表示にする"}
                >
                  {removing.has(item.id) ? "…" : isUpload ? "削除" : "非表示"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!loading && items.length === 0 && !fetchError && (
        <p className="text-sm" style={{ color: "#666" }}>未処理の投稿はありません。</p>
      )}
    </div>
  );
}
