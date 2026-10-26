import { Cormorant_Garamond } from "next/font/google";

// LPの英字見出し用（日本語は端末内蔵の明朝・ゴシックを使い、Webフォントは英字のみ＝軽量）
export const lpEnFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-lp-en", display: "swap" });
