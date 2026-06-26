"use server";

import { Resend } from "resend";

export async function sendApplication(formData: FormData) {
  const name       = formData.get("name") as string;
  const kana       = formData.get("kana") as string;
  const email      = formData.get("email") as string;
  const phone      = formData.get("phone") as string;
  const position   = formData.get("position") as string;
  const salon      = formData.get("salon") as string;
  const experience = formData.get("experience") as string;
  const applyType  = formData.get("applyType") as string;
  const portfolio  = formData.get("portfolio") as string;
  const message    = formData.get("message") as string;

  if (!name || !email || !phone || !position) {
    return { success: false, error: "必須項目（お名前・メール・電話・希望職種）を入力してください" };
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

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: `送信エラー: ${msg}` };
  }
}
