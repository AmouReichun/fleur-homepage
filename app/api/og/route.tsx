import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function fetchNotoSansJP(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500&text=${encodeURIComponent(text)}`,
      { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120" } },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((.+?)\)\s*format/)?.[1];
    if (!url) return null;
    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "フルールグループ 症例・コラム";
  const salon = searchParams.get("salon") ?? "fleur group";
  const category = searchParams.get("category") ?? "hair";

  const isEyelash = category === "eyelash";
  const bg = isEyelash ? "#1A0A0E" : "#0F0A06";
  const accent = isEyelash ? "#C8788A" : "#C8A860";
  const label = isEyelash ? "EYELASH" : "HAIR";

  const fontData = await fetchNotoSansJP(title + salon + "フルールグループ症例コラム");

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "60px 72px",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}
      >
        {/* Top accent line */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "40px", height: "2px", background: accent }} />
          <span style={{ color: accent, fontSize: "13px", letterSpacing: "0.4em", fontWeight: 500 }}>
            {label}
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
          <p
            style={{
              color: "#FFFFFF",
              fontSize: title.length > 28 ? "38px" : "46px",
              fontWeight: 500,
              lineHeight: 1.4,
              margin: 0,
              maxWidth: "960px",
            }}
          >
            {title.length > 40 ? title.slice(0, 40) + "…" : title}
          </p>
        </div>

        {/* Bottom: salon + branding */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ color: accent, fontSize: "13px", letterSpacing: "0.25em" }}>{salon}</span>
            <span style={{ color: "#444", fontSize: "12px", letterSpacing: "0.15em" }}>高知県</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <span style={{ color: "#555", fontSize: "11px", letterSpacing: "0.4em" }}>fleur group</span>
            <span style={{ color: "#333", fontSize: "10px", letterSpacing: "0.2em" }}>fleur-group.jp</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fontData
        ? [{ name: "Noto Sans JP", data: fontData, weight: 500, style: "normal" }]
        : [],
    },
  );
}
