// 公開フォーム（お問い合わせ・採用応募）のボット/スパム/悪用対策をまとめた共通ガード。
//
// サーバーレスのインメモリ制限はインスタンス毎・コールドスタートでリセットされるため
// 完全ではないが、無差別なボット送信の敷居を大きく上げる。本気で守るなら Vercel WAF の
// レート制限（無料枠あり）を併用する。
import { headers } from "next/headers";

// ── レート制限（IP毎・ベストエフォート）─────────────────────────
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10分
const RATE_MAX = 5; // 同一IPから10分で5通まで
const submissions = new Map<string, { count: number; first: number }>();

function clientIp(): string {
  const h = headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export type GuardResult = { ok: true } | { ok: false; error: string };

/**
 * 送信前のスパム/ボット判定。順に:
 *  1. ハニーポット（人間には見えない項目）が埋まっていたらボット
 *  2. フォーム表示から送信までが速すぎたらボット
 *  3. 同一IPからの短時間の大量送信をブロック
 */
export function guardFormSubmission(
  formData: FormData,
  opts?: { maxPerWindow?: number },
): GuardResult {
  // 1. ハニーポット（"company" は画面に出さない隠し項目。人間は空のまま）
  const honeypot = (formData.get("company") as string | null)?.trim();
  if (honeypot) {
    // ボットにはエラー内容を悟らせない
    return { ok: false, error: "送信できませんでした。時間をおいて再度お試しください。" };
  }

  // 2. 送信タイミング（表示直後の自動送信を弾く。人間の入力は通常2.5秒以上かかる）
  const ts = Number(formData.get("_ts"));
  if (ts && Number.isFinite(ts) && Date.now() - ts < 2500) {
    return { ok: false, error: "送信が早すぎます。もう一度お試しください。" };
  }

  // 3. レート制限
  const ip = clientIp();
  const now = Date.now();
  const max = opts?.maxPerWindow ?? RATE_MAX;
  const rec = submissions.get(ip);
  if (rec && now - rec.first < RATE_WINDOW_MS && rec.count >= max) {
    return { ok: false, error: "送信回数が上限に達しました。しばらくしてから再度お試しください。" };
  }
  if (!rec || now - rec.first >= RATE_WINDOW_MS) {
    submissions.set(ip, { count: 1, first: now });
  } else {
    rec.count += 1;
  }

  return { ok: true };
}

/** 簡易メール形式チェック（RFC厳密ではなく実用範囲）*/
export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** 制御文字を除き、最大長で切り詰める（巨大入力・不正文字対策）*/
export function sanitizeField(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  // 改行(\n \r)・タブ(\t)以外の制御文字を除去
  // eslint-disable-next-line no-control-regex
  const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  return cleaned.slice(0, maxLen).trim();
}
