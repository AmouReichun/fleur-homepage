"use server";

import { Resend } from "resend";
import { guardFormSubmission, isValidEmail, sanitizeField } from "@/lib/form-guard";

export async function sendContact(formData: FormData) {
  // ボット/スパム/連投対策（ハニーポット・送信タイミング・IPレート制限）
  const guard = guardFormSubmission(formData);
  if (!guard.ok) return { success: false, error: guard.error };

  const type    = sanitizeField(formData.get("type"), 40);
  const name    = sanitizeField(formData.get("name"), 100);
  const email   = sanitizeField(formData.get("email"), 254);
  const phone   = sanitizeField(formData.get("phone"), 40);
  const message = sanitizeField(formData.get("message"), 3000);

  if (!name || !email || !message) {
    return { success: false, error: "必須項目を入力してください" };
  }
  if (!isValidEmail(email)) {
    return { success: false, error: "メールアドレスの形式が正しくありません" };
  }

  const apiKey     = process.env.RESEND_API_KEY;
  const toEmail    = process.env.CONTACT_EMAIL ?? "info@fleur-group.jp";

  if (!apiKey) {
    return { success: false, error: "メール送信が設定されていません。直接ご連絡ください。" };
  }

  const resend = new Resend(apiKey);

  const typeLabel: Record<string, string> = {
    reservation: "ご予約について",
    menu: "メニュー・料金について",
    recruit: "採用について",
    other: "その他",
  };

  try {
    // 担当あて通知
    await resend.emails.send({
      from: "fleur GROUP お問い合わせ <noreply@fleur-group.jp>",
      to: toEmail,
      replyTo: email,
      subject: `【お問い合わせ】${typeLabel[type] ?? type} - ${name}様`,
      text: [
        `種別: ${typeLabel[type] ?? type}`,
        `お名前: ${name}`,
        `メール: ${email}`,
        phone ? `電話: ${phone}` : "",
        "",
        "【メッセージ】",
        message,
      ].filter(Boolean).join("\n"),
    });

    // お問い合わせ者あて自動返信（受付確認）
    await resend.emails.send({
      from: "fleur GROUP <noreply@fleur-group.jp>",
      to: email,
      replyTo: toEmail,
      subject: "【fleur GROUP】お問い合わせを受け付けました",
      text: [
        `${name} 様`,
        "",
        "この度はfleur GROUPへお問い合わせいただき、誠にありがとうございます。",
        "下記の内容でお問い合わせを受け付けました。担当者より追ってご連絡いたしますので、今しばらくお待ちください。",
        "",
        "──────────────",
        `種別: ${typeLabel[type] ?? type}`,
        "【お問い合わせ内容】",
        message,
        "──────────────",
        "",
        "※本メールは送信専用アドレスから自動送信しています。ご返信いただいてもお答えできかねますので、ご了承ください。",
        "※心当たりのない場合は、お手数ですがこのメールを破棄してください。",
        "",
        "fleur GROUP",
      ].join("\n"),
    });

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `送信エラー: ${msg}` };
  }
}
