"use client";

import { useState, useTransition } from "react";
import { saveContent } from "../actions";
import SectionLayout from "../components/SectionLayout";
import { TextField } from "../components/FormField";

interface CompanyData {
  name: string;
  representative: string;
  founded: string;
  address: string;
  phone: string;
  email: string;
  business: string;
}

export default function CompanyEditor({ initial }: { initial: CompanyData }) {
  const [data, setData] = useState<CompanyData>(initial);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  function update<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveContent("company", data);
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("error");
      }
    });
  }

  const rows = [
    { label: "グループ名", value: "fleurami GROUP" },
    { label: "会社名", value: data.name },
    { label: "代表者", value: data.representative },
    { label: "設立", value: data.founded },
    { label: "所在地", value: data.address },
    { label: "電話番号", value: data.phone },
    { label: "メール", value: data.email },
    { label: "事業内容", value: data.business },
  ];

  const preview = (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-2 uppercase">Company</p>
        <h1 className="text-2xl font-semibold text-[#2A2A2A] mb-8">会社概要</h1>
        <div className="border border-[#E8E4E0] overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="flex border-b border-[#E8E4E0] last:border-b-0">
              <div className="w-32 bg-[#FAFAF8] px-4 py-3 text-xs font-medium text-[#2A2A2A] flex-shrink-0">
                {row.label}
              </div>
              <div className="px-4 py-3 text-sm text-[#888] whitespace-pre-line">{row.value || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SectionLayout
      title="会社概要"
      preview={preview}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
    >
      <TextField label="会社名（法人名）" value={data.name} onChange={(v) => update("name", v)} multiline rows={2} hint="2社ある場合は改行して入力" />
      <TextField label="代表者名" value={data.representative} onChange={(v) => update("representative", v)} multiline rows={2} hint="複数いる場合は改行して入力" />
      <TextField label="設立年月" value={data.founded} onChange={(v) => update("founded", v)} multiline rows={2} placeholder="例: 2020年4月" hint="複数ある場合は改行" />
      <TextField label="住所" value={data.address} onChange={(v) => update("address", v)} multiline rows={2} hint="2社ある場合は改行して入力" />
      <TextField label="電話番号" value={data.phone} onChange={(v) => update("phone", v)} multiline rows={2} hint="複数ある場合は改行" />
      <TextField label="メールアドレス" value={data.email} onChange={(v) => update("email", v)} multiline rows={2} hint="複数ある場合は改行" />
      <TextField label="事業内容" value={data.business} onChange={(v) => update("business", v)} multiline rows={3} />
    </SectionLayout>
  );
}
