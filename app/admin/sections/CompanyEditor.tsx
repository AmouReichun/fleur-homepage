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
  const [saveError, setSaveError] = useState<string>("");

  function update<K extends keyof CompanyData>(key: K, value: CompanyData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await saveContent("company", JSON.stringify(data));
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

  return (
    <SectionLayout
      title="会社概要"
      previewPath={"/company"}
      onSave={handleSave}
      saving={isPending}
      saveStatus={saveStatus}
      saveError={saveError}
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
