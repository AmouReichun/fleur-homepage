"use client";

import { useState, useTransition } from "react";
import { sendApplication } from "@/app/recruit/actions";

const POSITIONS = [
  "美容師",
  "スタイリスト",
  "アシスタント",
  "アイリスト",
  "アイリスト(未経験)",
  "その他",
];

export default function RecruitForm({
  salons,
}: {
  salons: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await sendApplication(formData);
      if (res.success) {
        setStatus("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setErrorMsg(res.error ?? "送信に失敗しました");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="border border-site-greige bg-white p-6 sm:p-8 text-center">
        <p className="text-2xl mb-4">✓</p>
        <p className="font-serif text-lg font-semibold text-site-text mb-2">ご応募ありがとうございます</p>
        <p className="text-sm text-site-muted leading-relaxed">
          応募内容を受け付けました。<br />
          担当者より通常2〜3営業日以内にご連絡いたします。
        </p>
      </div>
    );
  }

  const labelCls = "block text-xs font-medium text-site-text mb-1.5";
  const fieldCls =
    "w-full border border-site-greige px-3 py-2.5 text-sm text-site-text bg-white focus:outline-none focus:border-site-accent transition-colors duration-200";

  return (
    <div className="border border-site-greige bg-white p-6 sm:p-8 text-left">
      <h3 className="font-serif text-lg font-semibold text-site-text mb-1">応募フォーム</h3>
      <p className="text-xs text-site-muted mb-6">求人へのご応募・サロン見学のお申し込み専用フォームです。</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 応募種別 */}
        <div>
          <label className={labelCls}>
            応募種別 <span className="text-red-400">*</span>
          </label>
          <select name="applyType" required defaultValue="apply" className={fieldCls}>
            <option value="apply">応募する</option>
            <option value="visit">まずはサロン見学希望</option>
            <option value="both">応募＋見学を希望</option>
          </select>
        </div>

        {/* 希望職種 */}
        <div>
          <label className={labelCls}>
            希望職種 <span className="text-red-400">*</span>
          </label>
          <select name="position" required defaultValue="" className={fieldCls}>
            <option value="" disabled>選択してください</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 希望サロン */}
        <div>
          <label className={labelCls}>希望サロン</label>
          <select name="salon" defaultValue="" className={fieldCls}>
            <option value="">不問・相談したい</option>
            {salons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* 経験年数 */}
        <div>
          <label className={labelCls}>経験年数</label>
          <select name="experience" defaultValue="" className={fieldCls}>
            <option value="">選択してください</option>
            <option value="未経験">未経験</option>
            <option value="1年未満">1年未満</option>
            <option value="1〜3年">1〜3年</option>
            <option value="3〜5年">3〜5年</option>
            <option value="5〜10年">5〜10年</option>
            <option value="10年以上">10年以上</option>
          </select>
        </div>

        {/* 名前 / フリガナ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              お名前 <span className="text-red-400">*</span>
            </label>
            <input type="text" name="name" required placeholder="山田 花子" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>フリガナ</label>
            <input type="text" name="kana" placeholder="ヤマダ ハナコ" className={fieldCls} />
          </div>
        </div>

        {/* メール / 電話 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>
              メールアドレス <span className="text-red-400">*</span>
            </label>
            <input type="email" name="email" required placeholder="example@email.com" className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>
              お電話番号 <span className="text-red-400">*</span>
            </label>
            <input type="tel" name="phone" required placeholder="090-0000-0000" className={fieldCls} />
          </div>
        </div>

        {/* ポートフォリオ */}
        <div>
          <label className={labelCls}>ポートフォリオ・SNS（任意）</label>
          <input type="url" name="portfolio" placeholder="InstagramのURLなど" className={fieldCls} />
        </div>

        {/* メッセージ */}
        <div>
          <label className={labelCls}>自己PR・ご質問など</label>
          <textarea
            name="message"
            rows={5}
            placeholder="これまでのご経歴や、サロンに対する希望・ご質問などをご自由にご記入ください。"
            className={`${fieldCls} resize-none`}
          />
        </div>

        <p className="text-xs text-site-muted">
          ご入力いただいた個人情報は、採用選考に関するご連絡以外には使用いたしません。
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
          {isPending ? "送信中..." : "この内容で応募する"}
        </button>
      </form>
    </div>
  );
}
