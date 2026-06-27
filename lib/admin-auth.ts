// 管理画面の署名付きセッショントークン。
// middleware（Edge runtime）とサーバーアクション（Node runtime）の両方から使うため、
// Node固有APIを避け Web Crypto（crypto.subtle）/ btoa / TextEncoder のみで実装している。
//
// 旧実装は admin_session に固定文字列 "authenticated" を入れ、middlewareはCookieの
// 「存在」だけを見ていたため、誰でもCookieを偽造すればログインを突破できた。
// ここでは exp（有効期限）を HMAC-SHA256 で署名し、middlewareで署名と期限を検証する。

const encoder = new TextEncoder();

// 署名鍵: 専用の SESSION_SECRET があればそれを、無ければ既存の ADMIN_PASSWORD を流用。
// （新しい環境変数を必須にするとロックアウトの恐れがあるため、既存の秘密値にフォールバック）
function getSecret(): string {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(msg));
  return toBase64Url(new Uint8Array(sig));
}

const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7日

/** 有効期限付きの署名済みセッショントークンを発行する */
export async function createSessionToken(ttlMs: number = DEFAULT_TTL_MS): Promise<string> {
  const exp = String(Date.now() + ttlMs);
  const sig = await hmac(getSecret(), exp);
  return `${exp}.${sig}`;
}

/** セッショントークンの署名・有効期限を検証する（偽造・期限切れは false） */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const exp = token.slice(0, idx);
  const sig = token.slice(idx + 1);

  if (!/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now()) return false; // 期限切れ

  const expected = await hmac(secret, exp);
  // 長さが違えば不一致。長さが同じ場合は定数時間比較でタイミング攻撃を避ける。
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}
