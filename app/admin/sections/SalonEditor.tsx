"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import { TextField, StringListField } from "../components/FormField";
import ImageUpload from "../components/ImageUpload";
import type { SalonContent, FaqItem } from "@/lib/content";

interface SalonEditorProps {
  salonKey: string;
  initial: SalonContent;
}

export default function SalonEditor({ salonKey, initial }: SalonEditorProps) {
  const [data, setData] = useState<SalonContent>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  function update<K extends keyof SalonContent>(key: K, value: SalonContent[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateFaq(i: number, field: keyof FaqItem, value: string) {
    const next = [...data.faq];
    next[i] = { ...next[i], [field]: value };
    setData((prev) => ({ ...prev, faq: next }));
  }

  function addFaq() {
    setData((prev) => ({ ...prev, faq: [...prev.faq, { q: "", a: "" }] }));
  }

  function removeFaq(i: number) {
    setData((prev) => ({ ...prev, faq: prev.faq.filter((_, idx) => idx !== i) }));
  }

  function moveFaq(i: number, direction: -1 | 1) {
    const next = [...data.faq];
    const target = i + direction;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    setData((prev) => ({ ...prev, faq: next }));
  }

  function handleSave(overrideData?: SalonContent) {
    const payload = overrideData ?? data;
    startTransition(async () => {
      try {
        const res = await saveContent(`salons.${salonKey}`, payload);
        if (res.success) {
          setSaveStatus("success");
          setSaveError("");
          setTimeout(() => setSaveStatus("idle"), 3000);
        } else {
          setSaveStatus("error");
          setSaveError(res.error ?? "不明なエラー");
        }
      } catch (e) {
        setSaveStatus("error");
        setSaveError(e instanceof Error ? e.message : "保存に失敗しました");
      }
    });
  }

  function handleImageUpload(url: string) {
    const updated = { ...data, imageSrc: url };
    setData(updated);
    handleSave(updated);
  }

  const bgClass = "bg-[#F5F0EA]";

  const preview = (
    <div>
      <div className={`${bgClass} py-10`}>
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-2 uppercase">
            {data.area}
          </p>
          <h1 className="text-3xl font-semibold text-[#2A2A2A] mb-3">
            {data.name || "（店舗名）"}
          </h1>
          <p className="text-sm text-[#888888] max-w-xl leading-relaxed">
            {data.tagline || "（タグライン）"}
          </p>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {data.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.imageSrc}
            alt={data.name}
            className="w-full h-48 object-cover border border-[#E8E4E0]"
          />
        ) : (
          <div className="bg-[#F5F0EA] h-48 flex items-center justify-center border border-[#E8E4E0]">
            <span className="text-[#888] text-sm">[店舗写真]</span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <p className="text-sm font-semibold text-[#2A2A2A] mb-3">特徴</p>
        <div className="flex flex-wrap gap-2">
          {data.features.map((f, i) => (
            <span key={i} className="text-xs bg-[#F5F0EA] text-[#2A2A2A] px-3 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Info table */}
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="border border-[#E8E4E0] overflow-hidden">
          {[
            { label: "住所", value: data.address },
            { label: "電話", value: data.phone },
            { label: "平日", value: data.hoursWeekday },
            { label: "土曜", value: data.hoursSaturday },
            { label: "定休日", value: data.closed },
            { label: "駐車場", value: data.parking },
          ].map((row) => (
            <div key={row.label} className="flex border-b border-[#E8E4E0] last:border-b-0">
              <div className="w-24 bg-[#FAFAF8] px-3 py-2.5 text-xs font-medium text-[#2A2A2A] flex-shrink-0">
                {row.label}
              </div>
              <div className="px-3 py-2.5 text-xs text-[#888]">{row.value || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ preview */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <p className="text-sm font-semibold text-[#2A2A2A] mb-3">FAQ</p>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={i} className="bg-[#FAFAF8] border border-[#E8E4E0] p-4">
              <p className="text-xs font-medium mb-1">
                <span className="text-[#B8956A] mr-1">Q.</span>{item.q || "（質問）"}
              </p>
              <p className="text-xs text-[#888]">
                <span className="text-[#B8956A] mr-1">A.</span>{item.a || "（回答）"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SectionLayout
      title={`${data.name} 店舗情報`}
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      <TextField label="店舗名" value={data.name} onChange={(v) => update("name", v)} />
      <TextField label="エリア" value={data.area} onChange={(v) => update("area", v)} />
      <TextField label="タグライン" value={data.tagline} onChange={(v) => update("tagline", v)} />
      <TextField
        label="説明文"
        value={data.description}
        onChange={(v) => update("description", v)}
        multiline
        rows={3}
      />
      <StringListField
        label="特徴・得意メニュー"
        values={data.features}
        onChange={(v) => update("features", v)}
        placeholder="例: 髪質改善トリートメント"
      />

      <div className="border-t border-[#E0DCD8] pt-4 mt-2">
        <p className="text-xs text-[#888] font-semibold mb-3 uppercase tracking-wider">📍 店舗情報</p>
      </div>

      <TextField label="住所" value={data.address} onChange={(v) => update("address", v)} />
      <TextField label="電話番号" value={data.phone} onChange={(v) => update("phone", v)} />
      <TextField label="平日営業時間" value={data.hoursWeekday} onChange={(v) => update("hoursWeekday", v)} placeholder="10:00〜19:00" />
      <TextField label="土曜営業時間" value={data.hoursSaturday} onChange={(v) => update("hoursSaturday", v)} placeholder="10:00〜18:00" />
      <TextField label="定休日" value={data.closed} onChange={(v) => update("closed", v)} placeholder="月曜日" />
      <TextField label="駐車場" value={data.parking} onChange={(v) => update("parking", v)} />
      <TextField label="ホットペッパーURL" value={data.hotpepperUrl} onChange={(v) => update("hotpepperUrl", v)} placeholder="https://..." />
      <TextField label="Instagram URL" value={data.instagramUrl} onChange={(v) => update("instagramUrl", v)} placeholder="https://instagram.com/..." />
      <TextField label="Google マップ埋め込みURL" value={data.mapEmbedUrl} onChange={(v) => update("mapEmbedUrl", v)} placeholder="https://maps.google.com/..." />

      <ImageUpload
        label="店舗・施術写真"
        value={data.imageSrc}
        onChange={handleImageUpload}
        section={`salon-${salonKey}`}
      />

      <StringListField
        label="メニュー備考・ご注意事項"
        values={data.menuNotes ?? []}
        onChange={(v) => update("menuNotes", v)}
        placeholder="例: 当日キャンセルはキャンセル料が発生します"
      />

      <div className="border-t border-[#E0DCD8] pt-4 mt-2">
        <p className="text-xs text-[#888] font-semibold mb-3 uppercase tracking-wider">❓ よくある質問（FAQ）</p>
        <div className="space-y-3">
          {data.faq.map((item, i) => (
            <div key={i} className="bg-white border border-[#E0DCD8] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveFaq(i, -1)}
                      disabled={i === 0}
                      className="text-[10px] text-[#999] hover:text-[#B8956A] disabled:opacity-20 leading-none px-1"
                    >▲</button>
                    <button
                      type="button"
                      onClick={() => moveFaq(i, 1)}
                      disabled={i === data.faq.length - 1}
                      className="text-[10px] text-[#999] hover:text-[#B8956A] disabled:opacity-20 leading-none px-1"
                    >▼</button>
                  </div>
                  <span className="text-xs font-semibold text-[#B8956A]">質問 {i + 1}</span>
                </div>
                <button type="button" onClick={() => removeFaq(i)} className="text-xs text-red-400 hover:text-red-600 transition-colors">削除</button>
              </div>
              <textarea
                value={item.q}
                onChange={(e) => updateFaq(i, "q", e.target.value)}
                rows={2}
                placeholder="例：髪質改善とは何ですか？"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20 transition-all resize-none"
              />
              <textarea
                value={item.a}
                onChange={(e) => updateFaq(i, "a", e.target.value)}
                rows={3}
                placeholder="回答を入力してください"
                className="w-full border border-[#D0CCC8] bg-[#FAFAF8] text-[#1A1A1A] text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20 transition-all resize-y"
              />
            </div>
          ))}
          <button type="button" onClick={addFaq} className="w-full text-sm text-[#B8956A] hover:text-[#8A6540] font-medium transition-colors py-2.5 border-2 border-dashed border-[#D0CCC8] rounded-lg hover:border-[#B8956A]">
            ＋ 質問を追加する
          </button>
        </div>
      </div>
    </SectionLayout>
  );
}
