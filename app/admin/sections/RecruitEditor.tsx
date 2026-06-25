"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import { TextField, StringListField } from "../components/FormField";
import ImageUpload from "../components/ImageUpload";
import type {
  RecruitPosition, RecruitBrand, RecruitValue, RecruitStaffVoice,
  RecruitStat, RecruitTimeItem, RecruitEduStep, RecruitReqItem, RecruitFaqItem,
} from "@/lib/content";

interface RecruitData {
  headline: string;
  description: string;
  benefits: string[];
  positions: RecruitPosition[];
  heroTitle?: string;
  heroLead?: string;
  aboutLead?: string;
  brands?: RecruitBrand[];
  values?: RecruitValue[];
  staffVoices?: RecruitStaffVoice[];
  staffVoiceNote?: string;
  stats?: RecruitStat[];
  dayHair?: RecruitTimeItem[];
  dayEye?: RecruitTimeItem[];
  dayHairNote?: string;
  dayEyeNote?: string;
  education?: RecruitEduStep[];
  careerHair?: string[];
  careerEye?: string[];
  requirements?: RecruitReqItem[];
  faq?: RecruitFaqItem[];
}

/* 汎用：オブジェクト配列エディタ（各フィールドは文字列） */
function ObjListEditor<T>({
  heading, items, fields, blank, onChange, imageKey,
}: {
  heading: string;
  items: T[];
  fields: { key: keyof T; label: string; multiline?: boolean; rows?: number; placeholder?: string }[];
  blank: T;
  onChange: (items: T[]) => void;
  imageKey?: keyof T;
}) {
  const update = (i: number, key: keyof T, v: string) => {
    const next = [...items];
    next[i] = { ...next[i], [key]: v } as T;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const add = () => onChange([...items, { ...blank }]);

  return (
    <div className="border-t border-[#333] pt-5 mt-3">
      <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">{heading}（{items.length}）</p>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-[#333] rounded-sm p-4 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[#B8956A]">{heading} {i + 1}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => move(i, -1)} className="text-xs text-gray-400 hover:text-white" title="上へ">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="text-xs text-gray-400 hover:text-white" title="下へ">↓</button>
                <button type="button" onClick={() => remove(i)} className="text-xs text-red-400 hover:text-red-300">削除</button>
              </div>
            </div>
            {imageKey && (
              <ImageUpload value={String(it[imageKey] ?? "")} onChange={(v) => update(i, imageKey, v)} section="recruit" label="画像" />
            )}
            {fields.map((f) => (
              <TextField
                key={String(f.key)}
                label={f.label}
                value={String(it[f.key] ?? "")}
                onChange={(v) => update(i, f.key, v)}
                multiline={f.multiline}
                rows={f.rows}
                placeholder={f.placeholder}
              />
            ))}
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs text-[#B8956A] hover:text-white transition-colors border border-dashed border-[#444] w-full py-3 rounded-sm">＋ 追加</button>
      </div>
    </div>
  );
}

export default function RecruitEditor({ initial }: { initial: RecruitData }) {
  const [data, setData] = useState<RecruitData>({
    ...initial,
    heroTitle: initial.heroTitle ?? "",
    heroLead: initial.heroLead ?? "",
    aboutLead: initial.aboutLead ?? "",
    brands: initial.brands ?? [],
    values: initial.values ?? [],
    staffVoices: initial.staffVoices ?? [],
    staffVoiceNote: initial.staffVoiceNote ?? "",
    stats: initial.stats ?? [],
    dayHair: initial.dayHair ?? [],
    dayEye: initial.dayEye ?? [],
    dayHairNote: initial.dayHairNote ?? "",
    dayEyeNote: initial.dayEyeNote ?? "",
    education: initial.education ?? [],
    careerHair: initial.careerHair ?? [],
    careerEye: initial.careerEye ?? [],
    requirements: initial.requirements ?? [],
    faq: initial.faq ?? [],
  });
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");

  const set = <K extends keyof RecruitData>(key: K, value: RecruitData[K]) =>
    setData((p) => ({ ...p, [key]: value }));

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("recruit", JSON.stringify(data));
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

  const preview = (
    <div className="bg-white">
      <div className="bg-[#2A2A2A] text-white py-12 px-5 text-center">
        <p className="text-[10px] tracking-[0.3em] text-[#B8956A] mb-3 uppercase">Recruit</p>
        <h1 className="text-xl font-semibold whitespace-pre-line">{data.heroTitle || "（ヘッドライン）"}</h1>
      </div>
      <div className="p-5 space-y-2 text-xs text-[#666]">
        <p>ブランドFV: {data.brands?.length ?? 0}件 / 私たちについて: {data.values?.length ?? 0}件</p>
        <p>スタッフ紹介: {data.staffVoices?.length ?? 0}件 / 数字: {data.stats?.length ?? 0}件</p>
        <p>1日の流れ: 美容師{data.dayHair?.length ?? 0} / アイリスト{data.dayEye?.length ?? 0}</p>
        <p>教育: {data.education?.length ?? 0}件 / キャリア: 美{data.careerHair?.length ?? 0}・アイ{data.careerEye?.length ?? 0}</p>
        <p>募集要項: {data.requirements?.length ?? 0}件 / FAQ: {data.faq?.length ?? 0}件</p>
        <div className="grid grid-cols-3 gap-2 pt-3">
          {(data.stats ?? []).map((s, i) => (
            <div key={i} className="text-center border border-[#eee] rounded p-2">
              <p className="text-[#B8956A] font-semibold text-sm">{s.value}{s.suffix ?? ""}</p>
              <p className="text-[9px] text-[#999] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SectionLayout
      title="採用情報"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
    >
      {/* 1. ファーストビュー */}
      <p className="text-xs text-[#B8956A] font-semibold uppercase tracking-wider">1. ファーストビュー</p>
      <TextField label="メインキャッチコピー" hint="改行で2行に分けられます" value={data.heroTitle ?? ""} onChange={(v) => set("heroTitle", v)} multiline rows={2} />
      <TextField label="リード文" hint="改行可" value={data.heroLead ?? ""} onChange={(v) => set("heroLead", v)} multiline rows={3} />

      <ObjListEditor<RecruitBrand>
        heading="ブランド別キャッチコピー"
        items={data.brands ?? []}
        onChange={(v) => set("brands", v)}
        imageKey="image"
        blank={{ key: "", name: "", area: "", type: "", copy: "", strengths: [], image: "", instagram: "" }}
        fields={[
          { key: "name", label: "ブランド名" },
          { key: "area", label: "エリア（例: 香南市）" },
          { key: "type", label: "業態（例: 美容室）" },
          { key: "copy", label: "キャッチコピー", multiline: true, rows: 2 },
          { key: "instagram", label: "Instagram URL" },
        ]}
      />
      {/* brands の strengths（タグ）は別途編集 */}
      {(data.brands ?? []).map((b, i) => (
        <div key={i} className="bg-[#141414] border border-[#2a2a2a] rounded-sm p-3 ml-1">
          <StringListField
            label={`${b.name || `ブランド${i + 1}`} の強みタグ`}
            values={b.strengths ?? []}
            onChange={(vals) => {
              const next = [...(data.brands ?? [])];
              next[i] = { ...next[i], strengths: vals };
              set("brands", next);
            }}
            placeholder="例: 髪質改善"
          />
        </div>
      ))}

      {/* 2. 私たちについて */}
      <p className="text-xs text-[#B8956A] font-semibold uppercase tracking-wider pt-4 border-t border-[#333]">2. 私たちについて</p>
      <TextField label="リード文" value={data.aboutLead ?? ""} onChange={(v) => set("aboutLead", v)} multiline rows={3} />
      <ObjListEditor<RecruitValue>
        heading="理念カード"
        items={data.values ?? []}
        onChange={(v) => set("values", v)}
        blank={{ icon: "♡", title: "", text: "" }}
        fields={[
          { key: "icon", label: "アイコン（記号1文字）", placeholder: "♡ / ↗ / ◎ / ∞" },
          { key: "title", label: "タイトル" },
          { key: "text", label: "本文", multiline: true, rows: 3 },
        ]}
      />

      {/* 3. スタッフ紹介 */}
      <ObjListEditor<RecruitStaffVoice>
        heading="スタッフ紹介カード"
        items={data.staffVoices ?? []}
        onChange={(v) => set("staffVoices", v)}
        imageKey="image"
        blank={{ name: "", role: "", brand: "", years: "", image: "", reason: "", joy: "", holiday: "", goal: "" }}
        fields={[
          { key: "name", label: "名前" },
          { key: "role", label: "役職" },
          { key: "brand", label: "所属ブランド" },
          { key: "years", label: "経歴（例: 美容師歴4年・空欄可）" },
          { key: "reason", label: "入社理由", multiline: true, rows: 2 },
          { key: "joy", label: "やりがい", multiline: true, rows: 2 },
          { key: "holiday", label: "休日の過ごし方", multiline: true, rows: 2 },
          { key: "goal", label: "将来の目標", multiline: true, rows: 2 },
        ]}
      />
      <TextField label="スタッフ紹介の注記（空欄で非表示）" value={data.staffVoiceNote ?? ""} onChange={(v) => set("staffVoiceNote", v)} />

      {/* 4. 数字で見る */}
      <ObjListEditor<RecruitStat>
        heading="数字で見る"
        items={data.stats ?? []}
        onChange={(v) => set("stats", v)}
        blank={{ label: "", value: "", suffix: "" }}
        fields={[
          { key: "value", label: "数値（整数はカウントアップ／「8:2」「定時」等はそのまま表示）", placeholder: "例: 26 / 100 / 8:2 / 定時" },
          { key: "suffix", label: "単位（任意）", placeholder: "歳 / % / 名 / 店舗" },
          { key: "label", label: "ラベル" },
        ]}
      />

      {/* 5. 1日の流れ */}
      <ObjListEditor<RecruitTimeItem>
        heading="1日の流れ（美容師）"
        items={data.dayHair ?? []}
        onChange={(v) => set("dayHair", v)}
        blank={{ time: "", text: "" }}
        fields={[
          { key: "time", label: "時刻", placeholder: "例: 9:30" },
          { key: "text", label: "内容" },
        ]}
      />
      <TextField label="美容師カラムの注記（例: fleuramiの例）" value={data.dayHairNote ?? ""} onChange={(v) => set("dayHairNote", v)} />
      <ObjListEditor<RecruitTimeItem>
        heading="1日の流れ（アイリスト）"
        items={data.dayEye ?? []}
        onChange={(v) => set("dayEye", v)}
        blank={{ time: "", text: "" }}
        fields={[
          { key: "time", label: "時刻", placeholder: "例: 9:00" },
          { key: "text", label: "内容" },
        ]}
      />
      <TextField label="アイリストカラムの注記（例: Raffineの例）" value={data.dayEyeNote ?? ""} onChange={(v) => set("dayEyeNote", v)} />

      {/* 6. 教育制度 */}
      <ObjListEditor<RecruitEduStep>
        heading="教育制度"
        items={data.education ?? []}
        onChange={(v) => set("education", v)}
        blank={{ step: "", title: "", text: "" }}
        fields={[
          { key: "step", label: "番号", placeholder: "例: 01" },
          { key: "title", label: "タイトル" },
          { key: "text", label: "本文", multiline: true, rows: 2 },
        ]}
      />

      {/* 7. キャリアプラン */}
      <div className="border-t border-[#333] pt-5 mt-3">
        <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">7. キャリアプラン</p>
        <StringListField label="美容師（上から順に昇格）" values={data.careerHair ?? []} onChange={(v) => set("careerHair", v)} placeholder="例: アシスタント" />
        <div className="h-3" />
        <StringListField label="アイリスト（上から順に昇格）" values={data.careerEye ?? []} onChange={(v) => set("careerEye", v)} placeholder="例: アシスタント" />
      </div>

      {/* 8. 募集要項 */}
      <ObjListEditor<RecruitReqItem>
        heading="募集要項"
        items={data.requirements ?? []}
        onChange={(v) => set("requirements", v)}
        blank={{ label: "", value: "" }}
        fields={[
          { key: "label", label: "項目名", placeholder: "例: 給与" },
          { key: "value", label: "内容（改行可）", multiline: true, rows: 2 },
        ]}
      />

      {/* 9. FAQ */}
      <ObjListEditor<RecruitFaqItem>
        heading="よくある質問"
        items={data.faq ?? []}
        onChange={(v) => set("faq", v)}
        blank={{ q: "", a: "" }}
        fields={[
          { key: "q", label: "質問" },
          { key: "a", label: "回答", multiline: true, rows: 3 },
        ]}
      />
    </SectionLayout>
  );
}
