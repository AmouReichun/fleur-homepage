import sharp from "sharp";

const W = 1200;
const H = 630;

// API ルート用サムネイル生成（TensorFlow なし・sharp のみ・中央クロップ）
export async function generateUploadThumbnail(imageBuffer: Buffer): Promise<Buffer | null> {
  try {
    return await sharp(imageBuffer)
      .resize(W, H, { fit: "cover", position: "center" })
      .jpeg({ quality: 88 })
      .toBuffer();
  } catch (e) {
    console.error("thumbnail-upload error:", e);
    return null;
  }
}
