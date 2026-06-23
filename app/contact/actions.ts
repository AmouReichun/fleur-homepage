"use server";

import { Resend } from "resend";

export async function sendContact(formData: FormData) {
  const type    = formData.get("type") as string;
  const name    = formData.get("name") as string;
  const email   = formData.get("email") as string;
  const phone   = formData.get("phone") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "必須項目を入力してください" };
  }

  const apiKey     = process.env.RESEND_API_KEY;
  const toEmail    = process.env.CONTACT_EMAIL ?? "info@fleurami-group.jp";

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
    await resend.emails.send({
      from: "fleurami GROUP お問い合わせ <noreply@fleurami-group.jp>",
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

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `送信エラー: ${msg}` };
  }
}
