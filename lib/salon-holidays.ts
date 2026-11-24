/**
 * 美容室2店（Riv. by fleur ami・fleur ami）の定休日「第1・第3火曜」を、
 * Google・AIが読める形（specialOpeningHoursSpecification）にする。
 * 毎週の営業時間（openingHoursSpecification）では「第1・第3火曜だけ休み」を表せないため、
 * これから12か月分の該当日を「休業日」として書き出す。
 * （2026-11-25：GoogleのAIモードが「月曜定休」だけと答えていたため追加）
 */
export function firstAndThirdTuesdayClosures(months = 12) {
  // 日本時間の今日
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y0 = now.getUTCFullYear();
  const m0 = now.getUTCMonth();
  const today = Date.UTC(y0, m0, now.getUTCDate());
  const out: { "@type": "OpeningHoursSpecification"; validFrom: string; validThrough: string; opens: string; closes: string }[] = [];
  for (let i = 0; i < months; i++) {
    const y = y0 + Math.floor((m0 + i) / 12);
    const m = (m0 + i) % 12;
    const firstDow = new Date(Date.UTC(y, m, 1)).getUTCDay(); // 0=日
    const firstTue = 1 + ((2 - firstDow + 7) % 7);
    for (const d of [firstTue, firstTue + 14]) {
      const t = Date.UTC(y, m, d);
      if (t < today) continue;
      const iso = new Date(t).toISOString().slice(0, 10);
      out.push({ "@type": "OpeningHoursSpecification", validFrom: iso, validThrough: iso, opens: "00:00", closes: "00:00" });
    }
  }
  return out;
}
