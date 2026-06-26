import GenerateClient from "./GenerateClient";

export const metadata = { title: "記事生成 | 管理画面" };

export default function GeneratePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#CCC" }}>
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin/blog"
            className="text-xs"
            style={{ color: "#555" }}
          >
            ← 管理画面
          </a>
          <h1 className="text-base font-medium" style={{ color: "#C8A860" }}>
            記事生成
          </h1>
        </div>

        <p className="text-xs mb-6 leading-relaxed" style={{ color: "#666" }}>
          スタッフ投稿・Instagram 投稿から記事を自動生成します。<br />
          生成後は GitHub に draft 記事としてコミットされ、Vercel が約1分で自動更新します。<br />
          公開するには管理画面からドラフト記事を確認し、<code style={{ color: "#888" }}>draft: false</code> に変更してください。
        </p>

        <GenerateClient />
      </div>
    </div>
  );
}
