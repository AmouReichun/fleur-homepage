"use client";

import { useState, useTransition } from "react";
import { sendContact } from "@/app/contact/actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await sendContact(formData);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(res.error ?? "送信に失敗しました");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="border border-site-greige p-6 sm:p-8 text-center">
        <p className="text-2xl mb-4">✓</p>
        <p className="font-serif text-lg font-semibold text-site-text mb-2">送信完了しました</p>
        <p className="text-sm text-site-muted leading-relaxed">
          お問い合わせありがとうございます。<br />
          通常2〜3営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="border border-site-greige p-6 sm:p-8">
      <h2 className="font-serif text-lg font-semibold text-site-text mb-6">お問い合わせフォーム</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            お問い合わせ種別 <span className="text-red-400">*</span>
          </label>
          <select
            name="type"
            required
            className="w-full border border-site-greige px-3 py-2.5 text-sm text-site-text bg-white focus:outline-none focus:border-site-accent transition-colors duration-200"
          >
            <option value="">選択してください</option>
            <option value="reservation">ご予約について</option>
            <option value="menu">メニュー・料金について</option>
            <option value="recruit">採用について</option>
            <option value="other">その他</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            お名前 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="山田 花子"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            メールアドレス <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="example@email.com"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">お電話番号</label>
          <input
            type="tel"
            name="phone"
            placeholder="090-0000-0000"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            メッセージ <span className="text-red-400">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="お問い合わせ内容をご記入ください"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200 resize-none"
          />
        </div>

        <p className="text-xs text-site-muted">
          ご入力いただいた個人情報は、お問い合わせへの回答以外には使用いたしません。
        </p>

        {status === "error" && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-4 py-3">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-site-accent text-white py-3.5 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50"
        >
          {isPending ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
