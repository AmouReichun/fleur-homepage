import { cookies } from "next/headers";
import { verifySessionToken } from "./admin-auth";

// サーバーアクションは Next-Action ヘッダー付きで「任意のURL」へPOSTすれば呼べるため、
// /admin 配下を守る middleware だけでは不十分。管理用アクションは先頭で必ずこれを呼ぶ。
// ※ "use server" ファイルではない（ここからエクスポートしてもアクションにはならない）
export const ADMIN_AUTH_ERROR = "ログインの有効期限が切れました。再度ログインしてください。";

export async function isAdmin(): Promise<boolean> {
  return verifySessionToken(cookies().get("admin_session")?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error(ADMIN_AUTH_ERROR);
}
