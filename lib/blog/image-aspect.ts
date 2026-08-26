import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * 画像の原本の向きに合わせて 3:4（縦長）か 4:3（横長）を返す。
 * ビルド時（静的生成）に public 配下の実ファイルを読んで判定する。
 * 取得できない場合は横長の 4:3 をフォールバックとして返す。
 */
export async function getImageAspect(src: string): Promise<"3/4" | "4/3"> {
  try {
    if (!src || /^https?:\/\//.test(src)) return "4/3";
    const filePath = path.join(process.cwd(), "public", src);
    if (!fs.existsSync(filePath)) return "4/3";
    const { width = 0, height = 0 } = await sharp(filePath).metadata();
    if (!width || !height) return "4/3";
    return height > width ? "3/4" : "4/3";
  } catch {
    return "4/3";
  }
}
