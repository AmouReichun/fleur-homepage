"use client";

export default function ContactForm() {
  return (
    <div className="border border-site-greige p-6 sm:p-8">
      <h2 className="font-serif text-lg font-semibold text-site-text mb-6">お問い合わせフォーム</h2>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          alert("送信機能は準備中です。各店舗へ直接ご連絡いただくか、ホットペッパービューティーよりご予約ください。");
        }}
      >
        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            お問い合わせ種別 <span className="text-red-400">*</span>
          </label>
          <select className="w-full border border-site-greige px-3 py-2.5 text-sm text-site-text bg-white focus:outline-none focus:border-site-accent transition-colors duration-200">
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
            placeholder="example@email.com"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">お電話番号</label>
          <input
            type="tel"
            placeholder="090-0000-0000"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-site-text mb-1.5">
            メッセージ <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="お問い合わせ内容をご記入ください"
            className="w-full border border-site-greige px-3 py-2.5 text-sm focus:outline-none focus:border-site-accent transition-colors duration-200 resize-none"
          />
        </div>

        <p className="text-xs text-site-muted">
          ご入力いただいた個人情報は、お問い合わせへの回答以外には使用いたしません。
        </p>

        <button
          type="submit"
          className="w-full bg-site-accent text-white py-3.5 text-sm font-medium tracking-wider hover:bg-opacity-90 transition-all duration-200"
        >
          送信する
        </button>
      </form>
    </div>
  );
}
