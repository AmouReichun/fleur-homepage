import { getContentLatest } from "@/lib/content";
import { getLpStore } from "@/lib/lp";
import LpView from "@/app/lp/LpView";
import { buildSalonInfo } from "@/app/lp/salons";
import { lpEnFont } from "@/app/lp/font";

// 管理画面からのみ見られる下書きプレビュー（/admin 配下なので middleware でログイン必須）
export const dynamic = "force-dynamic";

export default async function LpPreviewPage() {
  const content = await getContentLatest();
  const lp = getLpStore(content).draft;
  return (
    <div className={lpEnFont.variable}>
      <LpView lp={lp} salons={buildSalonInfo(content, lp)} preview />
    </div>
  );
}
