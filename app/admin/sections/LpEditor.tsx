"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  LP_GALLERY_CATEGORIES,
  type LpContent,
  type LpGalleryCategory,
  type LpGalleryItem,
  type LpImage,
  type LpReview,
  type LpSalonKey,
  type LpStore,
} from "@/lib/lp";
import { publishLp, saveLpDraft, uploadLpImage } from "../lp/actions";
import { StringListField, TextField } from "../components/FormField";

const inputCls =
  "w-full border border-[#D0CCC8] bg-white text-[#1A1A1A] text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20 transition-all";

const TABS = [
  { key: "hero", label: "ファーストビュー・最後" },
  { key: "menus", label: "お悩み・メニュー" },
  { key: "gallery", label: "写真ギャラリー" },
  { key: "content", label: "理由・流れ・FAQ" },
  { key: "reviews", label: "お客様の声" },
  { key: "settings", label: "LINE・SEO・計測" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const SALON_OPTIONS: { key: LpSalonKey | ""; label: string }[] = [
  { key: "", label: "指定なし" },
  { key: "fleurami", label: "fleurami（香南市）" },
  { key: "riv", label: "Riv. by fleurami（高知市）" },
];

const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function fmt(iso?: string) {
  return iso ? new Date(iso).toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
}

// ── 画像アップロード（ブラウザで縮小してから送信 → サーバーでWebP化）────────────
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const max = 2000;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 3_000_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.88));
  } catch {
    return file; // ブラウザで読めない形式はそのまま送り、サーバー側で変換を試みる
  }
}

async function upload(file: File, section: string): Promise<string> {
  const blob = await shrink(file);
  const fd = new FormData();
  fd.append("file", new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: blob.type || file.type }));
  fd.append("section", section);
  const { url } = await uploadLpImage(fd);
  return url;
}

function imageFiles(list: FileList | null): File[] {
  return Array.from(list ?? []).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
}

/** 1枚の画像（ドラッグ＆ドロップ対応）＋代替テキスト */
function ImageField({ label, value, onChange, section, hint }: { label: string; value: LpImage; onChange: (v: LpImage) => void; section: string; hint?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function handle(files: File[]) {
    if (!files[0]) return;
    setBusy(true);
    setErr("");
    try {
      onChange({ ...value, src: await upload(files[0], section) });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[#333] mb-1.5">{label}</label>
      {hint && <p className="text-xs text-[#888] mb-1.5">{hint}</p>}
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handle(imageFiles(e.dataTransfer.files)); }}
        className={`flex gap-3 p-3 bg-white border rounded-lg ${over ? "border-[#B8956A] bg-[#FBF6EF]" : "border-[#D0CCC8]"}`}
      >
        <div className="relative w-24 h-28 shrink-0 rounded-md overflow-hidden bg-[#F4F2EF] border border-[#E8E4E0]">
          {value.src ? <Image src={value.src} alt="" fill className="object-cover" sizes="96px" /> : <span className="absolute inset-0 flex items-center justify-center text-[11px] text-[#999]">画像なし</span>}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className="w-full text-sm bg-[#1A1A1A] text-white px-3 py-2 rounded-lg disabled:opacity-50">
            {busy ? "アップロード中…" : "画像を選択（またはここへドロップ）"}
          </button>
          <input value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} placeholder="画像の説明（代替テキスト・SEO用）" className={`${inputCls} !py-2 !text-xs`} />
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { handle(imageFiles(e.target.files)); e.target.value = ""; }} />
    </div>
  );
}

function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="bg-white/60 border border-[#E3DED8] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-[#1A1A1A]">{title}</p>
        {actions}
      </div>
      {children}
    </div>
  );
}

function SmallBtn({ onClick, children, danger, disabled }: { onClick: () => void; children: React.ReactNode; danger?: boolean; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-30 ${danger ? "border-red-200 text-red-600 hover:bg-red-50" : "border-[#D0CCC8] text-[#555] hover:bg-[#F4F2EF]"}`}>
      {children}
    </button>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return arr;
  const next = [...arr];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
}

// ─────────────────────────────────────────────────────────────

export default function LpEditor({ store, salonLineUrls }: { store: LpStore; salonLineUrls: Record<LpSalonKey, string> }) {
  const [data, setData] = useState<LpContent>(store.draft);
  const [savedJson, setSavedJson] = useState(JSON.stringify(store.draft));
  const [publishedJson, setPublishedJson] = useState(store.published ? JSON.stringify(store.published) : "");
  const [meta, setMeta] = useState({ draftUpdatedAt: store.draftUpdatedAt, publishedAt: store.publishedAt });
  const [tab, setTab] = useState<TabKey>("hero");
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [previewKey, setPreviewKey] = useState(0);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();

  const json = JSON.stringify(data);
  const dirty = json !== savedJson;
  const unpublished = json !== publishedJson;

  function set<K extends keyof LpContent>(key: K, value: LpContent[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function flash(type: "ok" | "err", text: string) {
    setMsg({ type, text });
    if (type === "ok") setTimeout(() => setMsg(null), 3500);
  }

  function saveDraft() {
    start(async () => {
      const res = await saveLpDraft(json);
      if (!res.success) return flash("err", res.error ?? "保存に失敗しました");
      setSavedJson(json);
      setMeta((m) => ({ ...m, draftUpdatedAt: res.draftUpdatedAt }));
      setPreviewKey((k) => k + 1);
      flash("ok", "下書きを保存しました。右のプレビューで確認できます");
    });
  }

  function publish() {
    if (!confirm("いまの内容を公開ページ（/lp）に反映します。よろしいですか？")) return;
    start(async () => {
      const res = await publishLp(json);
      if (!res.success) return flash("err", res.error ?? "公開に失敗しました");
      setSavedJson(json);
      setPublishedJson(json);
      setMeta({ draftUpdatedAt: res.publishedAt, publishedAt: res.publishedAt });
      setPreviewKey((k) => k + 1);
      flash("ok", "公開しました（反映まで最大1分ほどかかる場合があります）");
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-2 pl-16 pr-4 md:px-6 py-3 bg-white border-b border-[#E8E4E0] shadow-sm sticky top-0 z-20">
        <div className="min-w-0">
          <h1 className="text-sm md:text-base font-semibold text-[#1A1A1A]">LINE誘導LP</h1>
          <p className="text-[11px] text-[#888]">
            下書き保存 {fmt(meta.draftUpdatedAt)}／公開 {fmt(meta.publishedAt)}
            {dirty ? <span className="ml-2 text-amber-600">● 未保存の変更あり</span> : unpublished ? <span className="ml-2 text-amber-600">● 未公開の変更あり</span> : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {msg && (
            <span className={`hidden lg:inline text-xs px-3 py-1 rounded-full border max-w-[28vw] truncate ${msg.type === "ok" ? "text-green-700 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`} title={msg.text}>
              {msg.text}
            </span>
          )}
          <a href="/lp" target="_blank" rel="noopener" className="text-xs text-[#555] underline underline-offset-2 px-1">公開ページ</a>
          <button onClick={saveDraft} disabled={pending} className="text-sm px-4 py-2 rounded-lg border border-[#B8956A] text-[#8A6540] hover:bg-[#FBF6EF] disabled:opacity-50">
            {pending ? "処理中…" : "下書き保存"}
          </button>
          <button onClick={publish} disabled={pending} className="text-sm px-4 py-2 rounded-lg bg-[#B8956A] text-white hover:bg-[#A07850] disabled:opacity-50 font-medium">
            公開する
          </button>
        </div>
      </div>
      {msg && <div className={`lg:hidden px-4 py-2 text-xs border-b ${msg.type === "ok" ? "text-green-700 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"}`}>{msg.text}</div>}

      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        {/* 左: 編集 */}
        <div className="w-full lg:w-[48%] lg:overflow-y-auto bg-[#F4F2EF] border-b lg:border-b-0 lg:border-r border-[#E8E4E0]">
          <div className="sticky top-0 z-10 bg-[#EDE9E4] border-b border-[#E0DCD8] px-3 py-2 overflow-x-auto">
            <div className="flex gap-1 w-max">
              {TABS.map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap ${tab === t.key ? "bg-[#1A1A1A] text-white" : "text-[#555] hover:bg-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {tab === "hero" && <HeroTab data={data} set={set} />}
            {tab === "menus" && <MenusTab data={data} set={set} />}
            {tab === "gallery" && <GalleryTab data={data} set={set} />}
            {tab === "content" && <ContentTab data={data} set={set} />}
            {tab === "reviews" && <ReviewsTab data={data} set={set} />}
            {tab === "settings" && <SettingsTab data={data} set={set} salonLineUrls={salonLineUrls} />}
          </div>
        </div>

        {/* 右: プレビュー */}
        <div className="w-full lg:flex-1 bg-[#E9E6E2] flex flex-col min-h-[80vh] lg:min-h-0">
          <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-[#666]">プレビュー（保存済みの下書き）</p>
            <div className="flex gap-1">
              {(["mobile", "desktop"] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDevice(d)} className={`text-xs px-3 py-1 rounded-full ${device === d ? "bg-[#1A1A1A] text-white" : "text-[#555] hover:bg-white"}`}>
                  {d === "mobile" ? "スマホ" : "PC"}
                </button>
              ))}
              <button type="button" onClick={() => setPreviewKey((k) => k + 1)} className="text-xs px-3 py-1 rounded-full text-[#555] hover:bg-white">再読込</button>
            </div>
          </div>
          {dirty && <p className="px-4 py-1.5 text-[11px] text-amber-700 bg-amber-50 border-b border-amber-200">編集中の内容は「下書き保存」するとプレビューに反映されます</p>}
          <PreviewFrame device={device} reloadKey={previewKey} />
        </div>
      </div>
    </div>
  );
}

function PreviewFrame({ device, reloadKey }: { device: "mobile" | "desktop"; reloadKey: number }) {
  const width = device === "mobile" ? 390 : 1280;
  const [scale, setScale] = useState(1);
  return (
    <div
      ref={(el) => {
        // 枠の幅に合わせて縮小表示（PC表示でも全体が見えるように）
        if (el) {
          const s = Math.min(1, (el.clientWidth - 32) / width);
          if (Math.abs(s - scale) > 0.01) setScale(s);
        }
      }}
      className="flex-1 overflow-auto p-4 flex justify-center"
    >
      <div style={{ width: width * scale, height: (device === "mobile" ? 780 : 820) * scale }} className="shrink-0">
        <iframe
          key={`${reloadKey}-${device}`}
          src="/admin/lp/preview"
          title="LPプレビュー"
          style={{ width, height: device === "mobile" ? 780 : 820, transform: `scale(${scale})`, transformOrigin: "top left" }}
          className="bg-white rounded-xl shadow-lg border border-[#D8D3CD]"
        />
      </div>
    </div>
  );
}

type TabProps = { data: LpContent; set: <K extends keyof LpContent>(key: K, value: LpContent[K]) => void };

// ── ファーストビュー・最終CTA ──────────────────────────────
function HeroTab({ data, set }: TabProps) {
  const h = data.hero;
  const f = data.final;
  return (
    <>
      <Card title="01 ファーストビュー">
        <TextField label="小見出し（店舗名など）" value={h.eyebrow} onChange={(v) => set("hero", { ...h, eyebrow: v })} />
        <TextField label="メインコピー" hint="改行がそのまま反映されます" value={h.title} onChange={(v) => set("hero", { ...h, title: v })} multiline rows={2} />
        <TextField label="サブコピー" value={h.subtitle} onChange={(v) => set("hero", { ...h, subtitle: v })} multiline rows={3} />
        <ImageField label="メイン画像" hint="縦横どちらでも可。人物の顔が中央より上にある写真がおすすめです" value={h.image} onChange={(v) => set("hero", { ...h, image: v })} section="hero" />
        <ImageField
          label="スマホ用メイン画像（任意）"
          hint="スマホだけ別の写真にしたい場合に設定。空ならPCと同じ画像です"
          value={{ src: h.imageMobile, alt: h.image.alt }}
          onChange={(v) => set("hero", { ...h, imageMobile: v.src })}
          section="hero-sp"
        />
        <TextField label="LINEボタンの文言" value={h.ctaLabel} onChange={(v) => set("hero", { ...h, ctaLabel: v })} />
        <TextField label="ボタン下の補足" value={h.ctaNote} onChange={(v) => set("hero", { ...h, ctaNote: v })} />
      </Card>
      <Card title="09 最後のLINE誘導">
        <TextField label="見出し" value={f.title} onChange={(v) => set("final", { ...f, title: v })} multiline rows={2} />
        <TextField label="説明文" value={f.text} onChange={(v) => set("final", { ...f, text: v })} multiline rows={3} />
        <TextField label="LINEボタンの文言" value={f.ctaLabel} onChange={(v) => set("final", { ...f, ctaLabel: v })} />
        <ImageField label="背景画像" value={f.image} onChange={(v) => set("final", { ...f, image: v })} section="final" />
      </Card>
      <Card title="スマホ下部固定ボタン">
        <TextField label="文言" value={data.stickyCtaLabel} onChange={(v) => set("stickyCtaLabel", v)} />
      </Card>
    </>
  );
}

// ── お悩み・おすすめメニュー ─────────────────────────────
function MenusTab({ data, set }: TabProps) {
  const c = data.concerns;
  const m = data.menus;
  const menuOptions = m.items.map((x) => ({ key: x.key, label: x.name }));
  return (
    <>
      <Card title="02 お悩みへの共感">
        <TextField label="見出し" value={c.heading} onChange={(v) => set("concerns", { ...c, heading: v })} />
        <TextField label="リード文" value={c.lead} onChange={(v) => set("concerns", { ...c, lead: v })} multiline rows={2} />
        {c.items.map((it, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input value={it.text} onChange={(e) => set("concerns", { ...c, items: c.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} className={inputCls} placeholder="お悩み" />
            <select value={it.menuKey} onChange={(e) => set("concerns", { ...c, items: c.items.map((x, j) => (j === i ? { ...x, menuKey: e.target.value } : x)) })} className={`${inputCls} !w-44`} aria-label="つなげるメニュー">
              {menuOptions.map((o) => <option key={o.key} value={o.key}>→ {o.label}</option>)}
            </select>
            <SmallBtn danger onClick={() => set("concerns", { ...c, items: c.items.filter((_, j) => j !== i) })}>✕</SmallBtn>
          </div>
        ))}
        <SmallBtn onClick={() => set("concerns", { ...c, items: [...c.items, { text: "", menuKey: menuOptions[0]?.key ?? "" }] })}>＋ お悩みを追加</SmallBtn>
      </Card>

      <Card title="03 おすすめメニュー">
        <p className="text-xs text-[#8A6540] bg-[#FBF6EF] border border-[#EADCC8] rounded-lg p-3 leading-relaxed">
          売上・予約データで裏付けが取れるまでは「人気No.1」「ランキング」などの表記は使わず、「おすすめメニュー」としてください。料金は既存のメニュー表で確認できたものだけを入力し、未確認なら空欄（LPでは「LINEでご案内」と表示）にしてください。
        </p>
        <TextField label="見出し" value={m.heading} onChange={(v) => set("menus", { ...m, heading: v })} />
        <TextField label="リード文" value={m.lead} onChange={(v) => set("menus", { ...m, lead: v })} multiline rows={2} />
      </Card>
      {m.items.map((it, i) => {
        const up = (patch: Partial<typeof it>) => set("menus", { ...m, items: m.items.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
        return (
          <Card
            key={it.key}
            title={`メニュー ${i + 1}：${it.name || "（未入力）"}`}
            actions={
              <div className="flex gap-1">
                <SmallBtn disabled={i === 0} onClick={() => set("menus", { ...m, items: move(m.items, i, i - 1) })}>↑</SmallBtn>
                <SmallBtn disabled={i === m.items.length - 1} onClick={() => set("menus", { ...m, items: move(m.items, i, i + 1) })}>↓</SmallBtn>
              </div>
            }
          >
            <TextField label="メニュー名" value={it.name} onChange={(v) => up({ name: v })} />
            <TextField label="キャッチコピー" value={it.catch} onChange={(v) => up({ catch: v })} />
            <TextField label="こんな方に" value={it.target} onChange={(v) => up({ target: v })} multiline rows={2} />
            <StringListField label="施術の特徴" values={it.features} onChange={(v) => up({ features: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="料金（確認済みのみ）" value={it.price} onChange={(v) => up({ price: v })} placeholder="例: ¥7,000 / ¥4,700〜" />
              <TextField label="施術時間の目安" value={it.duration} onChange={(v) => up({ duration: v })} placeholder="例: 90〜120分" />
            </div>
            <TextField label="料金の補足" value={it.priceNote} onChange={(v) => up({ priceNote: v })} multiline rows={2} />
            <ImageField label="仕上がり写真" value={it.image} onChange={(v) => up({ image: v })} section={`menu-${it.key}`} hint="写真ギャラリーで同じカテゴリの写真を登録すると「このメニューの事例を見る」が表示されます" />
            <TextField label="LINEボタンの文言" value={it.ctaLabel} onChange={(v) => up({ ctaLabel: v })} />
          </Card>
        );
      })}
    </>
  );
}

// ── 写真ギャラリー ──────────────────────────────────────
function GalleryTab({ data, set }: TabProps) {
  const g = data.gallery;
  const [cat, setCat] = useState<LpGalleryCategory | "all">("all");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const items = g.items;
  const shown = useMemo(() => (cat === "all" ? items : items.filter((i) => i.category === cat)), [items, cat]);
  const menuOptions = data.menus.items.map((x) => ({ key: x.key, label: x.name }));

  const setItems = (next: LpGalleryItem[]) => set("gallery", { ...g, items: next });
  const updateItem = (id: string, patch: Partial<LpGalleryItem>) => setItems(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  async function addFiles(files: File[]) {
    if (!files.length) return;
    setErr("");
    const category: LpGalleryCategory = cat === "all" ? "kaizen" : cat;
    const menu = menuOptions.find((o) => o.key === category);
    const added: LpGalleryItem[] = [];
    try {
      if (category === "before-after") {
        // Before/After は2枚で1件（選んだ順に Before → After）
        for (let i = 0; i < files.length; i += 2) {
          setBusy(`アップロード中… ${Math.min(i + 2, files.length)}/${files.length}`);
          const pair = files.slice(i, i + 2);
          const urls = await Promise.all(pair.map((f) => upload(f, "gallery")));
          added.push({ id: uid("g"), category, title: "", menuKey: "", menuLabel: "", salon: "", description: "", images: urls.map((src, k) => ({ src, alt: k === 0 ? "施術前" : "施術後" })) });
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          setBusy(`アップロード中… ${i + 1}/${files.length}`);
          const src = await upload(files[i], "gallery");
          added.push({ id: uid("g"), category, title: "", menuKey: menu?.key ?? "", menuLabel: menu?.label ?? "", salon: "", description: "", images: [{ src, alt: "" }] });
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setBusy("");
      if (added.length) setItems([...added, ...items]);
    }
  }

  async function addImagesTo(item: LpGalleryItem, files: File[]) {
    if (!files.length) return;
    setErr("");
    try {
      setBusy("アップロード中…");
      const urls: string[] = [];
      for (const f of files) urls.push(await upload(f, "gallery"));
      updateItem(item.id, { images: [...item.images, ...urls.map((src) => ({ src, alt: "" }))] });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setBusy("");
    }
  }

  function dropOn(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((x) => x.id === dragId);
    const to = items.findIndex((x) => x.id === targetId);
    setItems(move(items, from, to));
    setDragId(null);
  }

  return (
    <>
      <Card title="04 ヘアスタイル・施術事例">
        <TextField label="見出し" value={g.heading} onChange={(v) => set("gallery", { ...g, heading: v })} />
        <TextField label="リード文" value={g.lead} onChange={(v) => set("gallery", { ...g, lead: v })} multiline rows={2} />
        <TextField label="写真を開いたときのLINEボタン文言" value={g.ctaLabel} onChange={(v) => set("gallery", { ...g, ctaLabel: v })} />
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {[{ key: "all" as const, label: `すべて（${items.length}）` }, ...LP_GALLERY_CATEGORIES.map((c) => ({ ...c, label: `${c.label}（${items.filter((i) => i.category === c.key).length}）` }))].map((c) => (
          <button key={c.key} type="button" onClick={() => setCat(c.key)} className={`text-xs px-3 py-1.5 rounded-full border ${cat === c.key ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white border-[#D0CCC8] text-[#555]"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div
        onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); setOver(true); } }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { if (!e.dataTransfer.files.length) return; e.preventDefault(); setOver(false); addFiles(imageFiles(e.dataTransfer.files)); }}
        onClick={() => !busy && fileRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors ${over ? "border-[#B8956A] bg-[#FBF6EF]" : "border-[#D0CCC8] bg-white hover:border-[#B8956A]"}`}
      >
        <p className="text-sm text-[#333]">{busy || "ここに写真をドラッグ＆ドロップ（複数可）"}</p>
        <p className="mt-1 text-xs text-[#888]">
          またはクリックして選択。追加先カテゴリ：<b>{cat === "all" ? "髪質改善" : LP_GALLERY_CATEGORIES.find((c) => c.key === cat)?.label}</b>
          {cat === "before-after" && "（2枚で1件。Before → After の順に選択）"}
        </p>
        <p className="mt-1 text-[11px] text-[#999]">自動で縮小・WebP変換されます</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(imageFiles(e.target.files)); e.target.value = ""; }} />
      {err && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
      {cat === "before-after" && (
        <p className="text-xs text-[#8A6540] bg-[#FBF6EF] border border-[#EADCC8] rounded-lg p-3">Before/After は同じ場所・同じ光・同じ角度で撮影した写真を優先し、過度な画像補正をした写真は使わないでください。</p>
      )}

      <p className="text-xs text-[#888]">カードの「⋮⋮」をドラッグすると表示順を変更できます（上ほど先に表示）。</p>
      <ul className="space-y-3">
        {shown.map((item) => {
          const idx = items.findIndex((x) => x.id === item.id);
          return (
            <li
              key={item.id}
              onDragOver={(e) => { if (dragId) e.preventDefault(); }}
              onDrop={(e) => { if (dragId) { e.preventDefault(); dropOn(item.id); } }}
              className={`bg-white border rounded-xl p-3 ${dragId === item.id ? "opacity-50" : ""} ${item.hidden ? "border-dashed border-[#CCC]" : "border-[#E3DED8]"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span draggable onDragStart={() => setDragId(item.id)} onDragEnd={() => setDragId(null)} className="cursor-grab select-none text-[#999] px-1" title="ドラッグで並べ替え">⋮⋮</span>
                <span className="text-xs text-[#888]">#{idx + 1}</span>
                <select value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value as LpGalleryCategory })} className="text-xs border border-[#D0CCC8] rounded px-2 py-1 bg-white">
                  {LP_GALLERY_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
                <label className="ml-auto flex items-center gap-1 text-xs text-[#555]">
                  <input type="checkbox" checked={!item.hidden} onChange={(e) => updateItem(item.id, { hidden: !e.target.checked })} />
                  表示
                </label>
                <SmallBtn disabled={idx === 0} onClick={() => setItems(move(items, idx, idx - 1))}>↑</SmallBtn>
                <SmallBtn disabled={idx === items.length - 1} onClick={() => setItems(move(items, idx, idx + 1))}>↓</SmallBtn>
                <SmallBtn danger onClick={() => confirm("この写真をギャラリーから削除しますか？") && setItems(items.filter((x) => x.id !== item.id))}>削除</SmallBtn>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.images.map((im, k) => (
                  <div key={k} className="shrink-0 w-24">
                    <div className="relative w-24 h-28 rounded-md overflow-hidden border border-[#E8E4E0]">
                      <Image src={im.src} alt="" fill className="object-cover" sizes="96px" />
                      <span className="absolute left-1 top-1 bg-black/60 text-white text-[10px] px-1.5 rounded">
                        {item.category === "before-after" ? (k === 0 ? "Before" : k === 1 ? "After" : k + 1) : k === 0 ? "メイン" : k + 1}
                      </span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      <button type="button" title="前へ" disabled={k === 0} onClick={() => updateItem(item.id, { images: move(item.images, k, k - 1) })} className="flex-1 text-[10px] border rounded disabled:opacity-30">◀</button>
                      {k !== 0 && item.category !== "before-after" && (
                        <button type="button" title="メイン画像にする" onClick={() => updateItem(item.id, { images: move(item.images, k, 0) })} className="flex-[2] text-[10px] border rounded text-[#8A6540]">メイン</button>
                      )}
                      <button type="button" title="後へ" disabled={k === item.images.length - 1} onClick={() => updateItem(item.id, { images: move(item.images, k, k + 1) })} className="flex-1 text-[10px] border rounded disabled:opacity-30">▶</button>
                      <button type="button" title="この画像を外す" onClick={() => updateItem(item.id, { images: item.images.filter((_, j) => j !== k) })} className="flex-1 text-[10px] border rounded text-red-500">✕</button>
                    </div>
                    <input value={im.alt} onChange={(e) => updateItem(item.id, { images: item.images.map((x, j) => (j === k ? { ...x, alt: e.target.value } : x)) })} placeholder="代替テキスト" className="mt-1 w-full text-[10px] border border-[#E0DCD8] rounded px-1 py-0.5" />
                  </div>
                ))}
                <label className="shrink-0 w-24 h-28 rounded-md border-2 border-dashed border-[#D0CCC8] flex flex-col items-center justify-center text-[#888] text-[11px] cursor-pointer hover:border-[#B8956A]">
                  ＋ 画像追加
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addImagesTo(item, imageFiles(e.target.files)); e.target.value = ""; }} />
                </label>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <input value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} placeholder="タイトル（例: 艶ストレートロング）" className={`${inputCls} col-span-2 !py-2`} />
                <select
                  value={item.menuKey}
                  onChange={(e) => {
                    const o = menuOptions.find((x) => x.key === e.target.value);
                    updateItem(item.id, { menuKey: e.target.value, menuLabel: o ? o.label : item.menuLabel });
                  }}
                  className={`${inputCls} !py-2`}
                  aria-label="紐付けるメニュー"
                >
                  <option value="">メニュー紐付けなし</option>
                  {menuOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
                <input value={item.menuLabel} onChange={(e) => updateItem(item.id, { menuLabel: e.target.value })} placeholder="施術メニュー名（表示用）" className={`${inputCls} !py-2`} />
                <select value={item.salon} onChange={(e) => updateItem(item.id, { salon: e.target.value as LpSalonKey | "" })} className={`${inputCls} !py-2 col-span-2`} aria-label="担当店舗">
                  {SALON_OPTIONS.map((o) => <option key={o.key} value={o.key}>担当店舗：{o.label}</option>)}
                </select>
                <textarea value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} placeholder="説明文" rows={2} className={`${inputCls} col-span-2 !py-2`} />
              </div>
            </li>
          );
        })}
        {shown.length === 0 && <li className="text-center text-xs text-[#999] py-6">このカテゴリの写真はまだありません</li>}
      </ul>
    </>
  );
}

// ── 選ばれる理由・予約の流れ・FAQ ───────────────────────────
function ContentTab({ data, set }: TabProps) {
  const r = data.reasons;
  const s = data.steps;
  const f = data.faq;
  return (
    <>
      <Card title="05 選ばれる理由">
        <p className="text-xs text-[#8A6540]">根拠のない「No.1」「満足度◯%」などは書かないでください。</p>
        <TextField label="見出し" value={r.heading} onChange={(v) => set("reasons", { ...r, heading: v })} />
        <PairList
          items={r.items.map((x) => ({ a: x.title, b: x.text }))}
          labels={["タイトル", "説明"]}
          onChange={(list) => set("reasons", { ...r, items: list.map((x) => ({ title: x.a, text: x.b })) })}
        />
      </Card>
      <Card title="07 LINE予約までの流れ">
        <TextField label="見出し" value={s.heading} onChange={(v) => set("steps", { ...s, heading: v })} />
        <TextField label="リード文" value={s.lead} onChange={(v) => set("steps", { ...s, lead: v })} />
        <PairList
          items={s.items.map((x) => ({ a: x.title, b: x.text }))}
          labels={["STEPタイトル", "説明"]}
          onChange={(list) => set("steps", { ...s, items: list.map((x) => ({ title: x.a, text: x.b })) })}
        />
      </Card>
      <Card title="08 よくある質問">
        <TextField label="見出し" value={f.heading} onChange={(v) => set("faq", { ...f, heading: v })} />
        <PairList
          items={f.items.map((x) => ({ a: x.q, b: x.a }))}
          labels={["質問", "回答"]}
          onChange={(list) => set("faq", { ...f, items: list.map((x) => ({ q: x.a, a: x.b })) })}
        />
      </Card>
    </>
  );
}

function PairList({ items, labels, onChange }: { items: { a: string; b: string }[]; labels: [string, string]; onChange: (v: { a: string; b: string }[]) => void }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="bg-white border border-[#E3DED8] rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#888] mr-auto">#{i + 1}</span>
            <SmallBtn disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}>↑</SmallBtn>
            <SmallBtn disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}>↓</SmallBtn>
            <SmallBtn danger onClick={() => onChange(items.filter((_, j) => j !== i))}>削除</SmallBtn>
          </div>
          <input value={it.a} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder={labels[0]} className={`${inputCls} !py-2`} />
          <textarea value={it.b} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, b: e.target.value } : x)))} placeholder={labels[1]} rows={3} className={`${inputCls} !py-2`} />
        </div>
      ))}
      <SmallBtn onClick={() => onChange([...items, { a: "", b: "" }])}>＋ 追加</SmallBtn>
    </div>
  );
}

// ── お客様の声 ─────────────────────────────────────────
function ReviewsTab({ data, set }: TabProps) {
  const rv = data.reviews;
  const up = (id: string, patch: Partial<LpReview>) => set("reviews", { ...rv, items: rv.items.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  return (
    <>
      <Card title="06 お客様の声">
        <p className="text-xs text-[#8A6540] bg-[#FBF6EF] border border-[#EADCC8] rounded-lg p-3 leading-relaxed">
          ご本人から掲載の許可をいただいた実際の口コミだけを登録してください。「掲載許可あり」にチェックが入ったものだけが公開ページに表示されます（0件のときはセクションごと非表示）。文章の創作・改変はしないでください。
        </p>
        <TextField label="見出し" value={rv.heading} onChange={(v) => set("reviews", { ...rv, heading: v })} />
        <TextField label="注記" value={rv.note} onChange={(v) => set("reviews", { ...rv, note: v })} />
      </Card>
      {rv.items.map((r, i) => (
        <Card
          key={r.id}
          title={`口コミ ${i + 1}`}
          actions={
            <div className="flex gap-1">
              <SmallBtn disabled={i === 0} onClick={() => set("reviews", { ...rv, items: move(rv.items, i, i - 1) })}>↑</SmallBtn>
              <SmallBtn disabled={i === rv.items.length - 1} onClick={() => set("reviews", { ...rv, items: move(rv.items, i, i + 1) })}>↓</SmallBtn>
              <SmallBtn danger onClick={() => confirm("この口コミを削除しますか？") && set("reviews", { ...rv, items: rv.items.filter((x) => x.id !== r.id) })}>削除</SmallBtn>
            </div>
          }
        >
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={r.permission} onChange={(e) => up(r.id, { permission: e.target.checked })} />
            <span className={r.permission ? "text-green-700" : "text-red-600"}>掲載許可あり（チェックすると公開されます）</span>
          </label>
          <TextField label="口コミ本文（原文のまま）" value={r.body} onChange={(v) => up(r.id, { body: v })} multiline rows={4} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="属性（了承済みの範囲）" value={r.attribute} onChange={(v) => up(r.id, { attribute: v })} placeholder="例: 30代・女性" />
            <TextField label="施術メニュー" value={r.menu} onChange={(v) => up(r.id, { menu: v })} />
            <TextField label="出典" value={r.source} onChange={(v) => up(r.id, { source: v })} placeholder="例: 店頭アンケート" />
            <TextField label="日付" value={r.date} onChange={(v) => up(r.id, { date: v })} placeholder="例: 2026年10月" />
          </div>
          <select value={r.salon} onChange={(e) => up(r.id, { salon: e.target.value as LpSalonKey | "" })} className={inputCls} aria-label="店舗">
            {SALON_OPTIONS.map((o) => <option key={o.key} value={o.key}>店舗：{o.label}</option>)}
          </select>
        </Card>
      ))}
      <SmallBtn onClick={() => set("reviews", { ...rv, items: [...rv.items, { id: uid("r"), body: "", attribute: "", menu: "", salon: "", source: "", permission: false, date: "" }] })}>
        ＋ 口コミを追加
      </SmallBtn>
    </>
  );
}

// ── LINE・SEO・計測 ────────────────────────────────────
function SettingsTab({ data, set, salonLineUrls }: TabProps & { salonLineUrls: Record<LpSalonKey, string> }) {
  const seo = data.seo;
  const ex = data.experiment;
  return (
    <>
      <Card title="公式LINE URL（店舗別）">
        <p className="text-xs text-[#888] leading-relaxed">
          空欄の場合は「店舗」管理画面に登録されたLINE URLを使います。LP専用の流入経路URL（Lステップ等で発行）を使う場合はここに入力すると、LINE側でもLP経由の友だち追加を区別できます。
        </p>
        {(["fleurami", "riv"] as const).map((k) => (
          <TextField
            key={k}
            label={k === "fleurami" ? "fleurami" : "Riv. by fleurami"}
            value={data.line[k]}
            onChange={(v) => set("line", { ...data.line, [k]: v.trim() })}
            placeholder={salonLineUrls[k] || "https://liff.line.me/..."}
          />
        ))}
      </Card>
      <Card title="SEO設定">
        <TextField label={`ページタイトル（${seo.title.length}文字・目安30〜40字）`} value={seo.title} onChange={(v) => set("seo", { ...seo, title: v })} />
        <TextField label={`説明文 meta description（${seo.description.length}文字・目安80〜120字）`} value={seo.description} onChange={(v) => set("seo", { ...seo, description: v })} multiline rows={3} />
        <ImageField label="SNSシェア画像（OGP）" hint="横長 1200×630px 推奨" value={{ src: seo.ogImage, alt: "" }} onChange={(v) => set("seo", { ...seo, ogImage: v.src })} section="og" />
      </Card>
      <Card title="A/Bテスト（任意）">
        <p className="text-xs text-[#888] leading-relaxed">
          有効にすると訪問者を半分ずつAとBに分け、Bの人にだけ下の文言を表示します。GA4のイベントに lp_variant（A/B）が付くので、LINEクリック率を比較できます。テストを変えるときはテストIDも変えてください。
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ex.enabled} onChange={(e) => set("experiment", { ...ex, enabled: e.target.checked })} />
          A/Bテストを有効にする
        </label>
        <TextField label="テストID" value={ex.id} onChange={(v) => set("experiment", { ...ex, id: v.replace(/\s/g, "") })} />
        <TextField label="B：メインコピー（空ならAと同じ）" value={ex.heroTitleB} onChange={(v) => set("experiment", { ...ex, heroTitleB: v })} multiline rows={2} />
        <TextField label="B：サブコピー（空ならAと同じ）" value={ex.heroSubtitleB} onChange={(v) => set("experiment", { ...ex, heroSubtitleB: v })} multiline rows={2} />
        <TextField label="B：ファーストビューのボタン文言（空ならAと同じ）" value={ex.ctaLabelB} onChange={(v) => set("experiment", { ...ex, ctaLabelB: v })} />
      </Card>
      <Card title="計測について">
        <ul className="text-xs text-[#555] leading-relaxed list-disc pl-4 space-y-1">
          <li>GA4に送るイベント：lp_view / lp_cta_click（ボタン押下）/ line_click（LINEへ遷移）/ lp_scroll / lp_section_view / lp_menu_view / lp_gallery_open / lp_faq_open</li>
          <li>line_click には cta_position（押した場所）・menu・salon・UTM が付きます。GA4の「カスタム定義」で cta_position・menu・salon をイベントスコープのディメンションとして登録してください。</li>
          <li>line_click は「LINEを開いた数」です。友だち追加数・予約完了数はLINE公式アカウント／予約システム側の数字と別に管理してください。</li>
        </ul>
      </Card>
    </>
  );
}
