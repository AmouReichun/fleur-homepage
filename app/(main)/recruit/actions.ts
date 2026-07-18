"use server";

import { Resend } from "resend";
import { guardFormSubmission, isValidEmail, sanitizeField } from "@/lib/form-guard";

export async function sendApplication(formData: FormData) {
  // ボット/スパム/連投対策（ハニーポット・送信タイミング・IPレート制限）
  const guard = guardFormSubmission(formData);
  if (!guard.ok) return { success: false, error: guard.error };

  const name       = sanitizeField(formData.get("name"), 100);
  const kana       = sanitizeField(formData.get("kana"), 100);
  const email      = sanitizeField(formData.get("email"), 254);
  const phone      = sanitizeField(formData.get("phone"), 40);
  const position   = sanitizeField(formData.get("position"), 60);
  const salon      = sanitizeField(formData.get("salon"), 60);
  const experience = sanitizeField(formData.get("experience"), 60);
  const applyType  = sanitizeField(formData.get("applyType"), 20);
  const portfolio  = sanitizeField(formData.get("portfolio"), 300);
  const message    = sanitizeField(formData.get("message"), 3000);

  if (!name || !email || !phone || !position) {
    return { success: false, error: "必須項目（お名前・メール・電話・希望職種）を入力してください" };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  const apiKey  = process.env.RESEND_API_KEY;
  // 採用応募の宛先（recruit@）。環境変数 RECRUIT_EMAIL で上書き可。
  const toEmail = process.env.RECRUIT_EMAIL ?? "recruit@fleur-group.jp";

  if (!apiKey) {
    return { success: false, error: "メール送信が設定されていません。お手数ですが各店舗まで直接ご連絡ください。" };
  }

  const resend = new Resend(apiKey);

  const applyTypeLabel: Record<string, string> = {
    apply: "応募",
    visit: "サロン見学希望",
    both: "応募＋見学希望",
  };

  try {
    // 採用担当あて通知
    await resend.emails.send({
      from: "fleur GROUP 採用応募 <noreply@fleur-group.jp>",
      to: toEmail,
      replyTo: email,
      subject: `【採用応募】${position} - ${name}様`,
      text: [
        "採用応募フォームから新しい応募がありました。",
        "",
        `応募種別: ${applyTypeLabel[applyType] ?? "応募"}`,
        `お名前: ${name}${kana ? `（${kana}）` : ""}`,
        `メール: ${email}`,
        `電話: ${phone}`,
        `希望職種: ${position}`,
        `希望サロン: ${salon || "不問"}`,
        `経験年数: ${experience || "未記入"}`,
        portfolio ? `ポートフォリオ/SNS: ${portfolio}` : "",
        "",
        "【自己PR・メッセージ】",
        message || "（記入なし）",
      ].filter(Boolean).join("\n"),
    });

    // 応募者あて自動返信（受付確認）
    await resend.emails.send({
      from: "fleur GROUP 採用 <noreply@fleur-group.jp>",
      to: email,
      replyTo: toEmail,
      subject: "【fleur GROUP】ご応募ありがとうございます",
      text: [
        `${name} 様`,
        "",
        "この度はfleur GROUPの採用にご応募いただき、誠にありがとうございます。",
        "下記の内容でご応募を受け付けました。担当者より追ってご連絡いたしますので、今しばらくお待ちください。",
        "",
        "──────────────",
        `応募種別: ${applyTypeLabel[applyType] ?? "応募"}`,
        `希望職種: ${position}`,
        `希望サロン: ${salon || "不問"}`,
        `経験年数: ${experience || "未記入"}`,
        "──────────────",
        "",
        "※本メールは送信専用アドレスから自動送信しています。ご返信いただいてもお答えできかねますので、ご了承ください。",
        "※心当たりのない場合は、お手数ですがこのメールを破棄してください。",
        "",
        "fleur GROUP 採用担当",
      ].join("\n"),
    });

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `送信エラー: ${msg}` };
  }
}
