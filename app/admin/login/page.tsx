"use client";

import { useState, useTransition } from "react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F2EF]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] text-[#B8956A] mb-3 uppercase font-medium">Admin</p>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">fleurami GROUP</h1>
          <p className="text-sm text-[#888] mt-1">管理画面へログイン</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#E8E4E0] p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">パスワード</label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-[#D8D4D0] text-[#1A1A1A] text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-[#B8956A] focus:ring-2 focus:ring-[#B8956A]/20 transition-all bg-white placeholder-[#CCC]"
              placeholder="パスワードを入力"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#B8956A] text-white py-3.5 text-sm font-medium tracking-wider rounded-lg hover:bg-[#A07850] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "ログイン中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
}
