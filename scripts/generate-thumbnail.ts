import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

dotenv.config({ path: ".env.local" });

// TF ログを抑制（起動時のノイズを防ぐ）
process.env.TF_CPP_MIN_LOG_LEVEL = "3";
process.env.TF_ENABLE_ONEDNN_OPTS = "0";

const THUMB_DIR = path.join(process.cwd(), "public", "images", "thumbnails");
const THUMB_WIDTH  = 1200;
const THUMB_HEIGHT = 630;
const PHOTO_H      = THUMB_HEIGHT; // テキスト帯なし → 写真が全体を占める

export type ThumbInput = {
  slug: string;
  title: string;
  salonName: string;
  category: "hair" | "eyelash";
  tags: string[];
  sourceImagePath: string;
};

// ─────────────────────────────────────────────────────────
// 目の位置を検出（eyelash カテゴリ専用）
// ─────────────────────────────────────────────────────────
// モデルは遅延ロード（最初のeyelash処理時のみ初期化）
let _blazeModel: import("@tensorflow-models/blazeface").BlazeFaceModel | null = null;

async function detectEyeCenter(
  imgPath: string,
  srcW: number,
  srcH: number,
): Promise<{ x: number; y: number } | null> {
  try {
    if (!_blazeModel) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@tensorflow/tfjs-node");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const blazeface = require("@tensorflow-models/blazeface");
      _blazeModel = await blazeface.load();
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const tf = require("@tensorflow/tfjs-node");
    const imgBuf = fs.readFileSync(imgPath);
    const tensor = tf.node.decodeImage(imgBuf, 3) as import("@tensorflow/tfjs-core").Tensor3D;
    const preds = (await _blazeModel!.estimateFaces(tensor, false)) as Array<{
      landmarks: number[][];
      topLeft: number[];
      bottomRight: number[];
    }>;
    tensor.dispose();

    if (!preds || preds.length === 0) return null;

    // 最初の顔を使用。landmarks[0]=右目、[1]=左目
    const { landmarks } = preds[0];
    const eyeX = (landmarks[0][0] + landmarks[1][0]) / 2;
    const eyeY = (landmarks[0][1] + landmarks[1][1]) / 2;
    return { x: eyeX, y: eyeY };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────
// 写真エリアを生成（カテゴリ別クロップ）
// ─────────────────────────────────────────────────────────
async function buildPhotoBuffer(
  localSrc: string,
  category: "hair" | "eyelash",
): Promise<Buffer> {
  const meta = await sharp(localSrc).metadata();
  const srcW = meta.width!;
  const srcH = meta.height!;

  if (category === "hair") {
    // ヘア：単純な中央基準クロップ
    return sharp(localSrc)
      .resize(THUMB_WIDTH, PHOTO_H, { fit: "cover", position: "center" })
      .toBuffer();
  }

  // ── eyelash：目の位置を検出してクロップ ──────────────────
  const eyeCenter = await detectEyeCenter(localSrc, srcW, srcH);

  let anchorX: number;
  let anchorY: number;

  if (eyeCenter) {
    anchorX = eyeCenter.x;
    anchorY = eyeCenter.y;
    console.log(`     👁  目を検出: (${Math.round(anchorX)}, ${Math.round(anchorY)})`);
  } else {
    // フォールバック：中央（クローズアップ目元写真は目が中心にある）
    anchorX = srcW * 0.5;
    anchorY = srcH * 0.5;
    console.log(`     👁  未検出 → 中央基準`);
  }

  // cover スケールで拡大後、アンカー中心に切り出す
  const scale  = Math.max(THUMB_WIDTH / srcW, PHOTO_H / srcH);
  const scaledW = Math.round(srcW * scale);
  const scaledH = Math.round(srcH * scale);

  const left = Math.round(
    Math.max(0, Math.min(anchorX * scale - THUMB_WIDTH / 2, scaledW - THUMB_WIDTH)),
  );
  const top  = Math.round(
    Math.max(0, Math.min(anchorY * scale - PHOTO_H  / 2, scaledH - PHOTO_H)),
  );

  return sharp(localSrc)
    .resize(scaledW, scaledH, { fit: "fill" })
    .extract({ left, top, width: THUMB_WIDTH, height: PHOTO_H })
    .toBuffer();
}

// ─────────────────────────────────────────────────────────
// SVG ヘルパー
// ─────────────────────────────────────────────────────────
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const KINSOKU = new Set(["。","、","！","？","」","』","）","〉","》","〕","】","…","・","：","；","!","?",")","]","}"]);

function splitTitle(title: string, maxPerLine = 16): string[] {
  if (title.length <= maxPerLine) return [title];
  const ideal = Math.ceil(title.length / 2);
  let cut = Math.min(ideal, maxPerLine);
  while (cut < title.length && KINSOKU.has(title[cut])) cut++;
  const line1 = title.slice(0, cut);
  const rest  = title.slice(cut);
  if (rest.length <= maxPerLine) return [line1, rest];
  let end2 = maxPerLine - 1;
  while (end2 < rest.length && KINSOKU.has(rest[end2])) end2++;
  return [line1, rest.slice(0, end2) + "…"];
}

// ─────────────────────────────────────────────────────────
// テキスト帯 SVG（写真の下に配置）
// ─────────────────────────────────────────────────────────
// すべてのテキストを x=600 中央揃えにする
// → カードが ±180px クロップしても安全圏（180–1020px）に収まる
function buildBandSvg(
  title: string,
  salon: string,
  tags: string[],
  category: "hair" | "eyelash",
): Buffer {
  const cx        = THUMB_WIDTH / 2; // 600px
  const bandTop   = PHOTO_H;         // 420px
  const bandH     = THUMB_HEIGHT - PHOTO_H; // 210px
  const lines     = splitTitle(title);
  const tagsText  = esc(tags.slice(0, 3).map((t) => `#${t}`).join("  "));
  const FONT_SIZE = 34;
  const LINE_H    = 46;
  const salonY    = bandTop + 32;
  const titleY    = bandTop + 76;
  const tagsY     = THUMB_HEIGHT - 18;

  const titleLines = lines
    .map(
      (line, i) => `
  <text x="${cx}" y="${titleY + i * LINE_H}" text-anchor="middle"
    font-family="${category === "hair"
      ? "'Hiragino Mincho ProN','Yu Mincho','Georgia',serif"
      : "'Hiragino Kaku Gothic ProN','Noto Sans JP','Arial',sans-serif"}"
    font-size="${FONT_SIZE}" fill="white" font-weight="500">${esc(line)}</text>`,
    )
    .join("");

  const bgColor     = category === "hair" ? "#0e0a06" : "#180b12";
  const accentColor = category === "hair" ? "#BBA98A" : "#D4A0B0";

  return Buffer.from(`<svg width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="${bandTop}" width="${THUMB_WIDTH}" height="${bandH}" fill="${bgColor}"/>
  <rect x="0" y="${bandTop}" width="${THUMB_WIDTH}" height="3" fill="${accentColor}"/>
  <text x="${cx}" y="${salonY}" text-anchor="middle"
    font-family="'Helvetica Neue',Arial,sans-serif"
    font-size="12" fill="${accentColor}" letter-spacing="5">${esc(salon.toUpperCase())}</text>
  ${titleLines}
  <text x="${cx}" y="${tagsY}" text-anchor="middle"
    font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.4)">${tagsText}</text>
</svg>`);
}

// ─────────────────────────────────────────────────────────
// メイン生成関数
// ─────────────────────────────────────────────────────────
export async function generateThumbnail(input: ThumbInput): Promise<string | null> {
  const localSrc = path.join(process.cwd(), "public", input.sourceImagePath);
  if (!fs.existsSync(localSrc)) {
    console.error(`  ❌ 元画像が見つかりません: ${localSrc}`);
    return null;
  }

  const outFile = path.join(THUMB_DIR, `${input.slug}.jpg`);
  if (!fs.existsSync(THUMB_DIR)) fs.mkdirSync(THUMB_DIR, { recursive: true });

  try {
    // 写真のみ（テキスト帯なし）。タイトルはカードの HTML 側で表示。
    // buildPhotoBuffer が 1200×630 を直接出力するので再リサイズ不要。
    const photoBuffer = await buildPhotoBuffer(localSrc, input.category);
    await sharp(photoBuffer)
      .jpeg({ quality: 88 })
      .toFile(outFile);

    return `/images/thumbnails/${input.slug}.jpg`;
  } catch (e) {
    console.error(`  ❌ サムネ生成失敗: ${input.slug}`, e);
    return null;
  }
}

// Buffer 渡し版（Vercel API ルートで使用 — /tmp に書き出して処理）
export async function generateThumbnailToBuffer(
  input: Omit<ThumbInput, "sourceImagePath">,
  imageBuffer: Buffer,
): Promise<Buffer | null> {
  const tmpSrc = path.join("/tmp", `fleur-src-${input.slug}.jpg`);
  try {
    fs.writeFileSync(tmpSrc, imageBuffer);
    const photoBuffer = await buildPhotoBuffer(tmpSrc, input.category);
    return await sharp(photoBuffer).jpeg({ quality: 88 }).toBuffer();
  } catch (e) {
    console.error(`  ❌ サムネ生成失敗（buffer）: ${input.slug}`, e);
    return null;
  } finally {
    if (fs.existsSync(tmpSrc)) fs.unlinkSync(tmpSrc);
  }
}

export async function generateAllThumbnails(inputs: ThumbInput[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  for (const input of inputs) {
    console.log(`  🖼  ${input.slug}`);
    const outPath = await generateThumbnail(input);
    if (outPath) {
      results.set(input.slug, outPath);
      console.log(`     ✅ ${outPath}`);
    }
  }
  return results;
}

// ─────────────────────────────────────────────────────────
// 単体実行：生成済み記事からサムネを再生成
// ─────────────────────────────────────────────────────────
const SALON_DIR: Record<string, string> = {
  "fleur ami":         "fleurami",
  "riv. by fleur ami": "riv",
  "raffine":           "raffine",
};

if (process.argv[1].endsWith("generate-thumbnail.ts")) {
  const glob = (dir: string) =>
    fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));

  const inputs: ThumbInput[] = [];

  for (const file of [
    ...glob(path.join(process.cwd(), "content", "hair")),
    ...glob(path.join(process.cwd(), "content", "eyelash")),
  ]) {
    const raw   = fs.readFileSync(file, "utf-8");
    const titleM = raw.match(/^title:\s*"(.+)"/m);
    const slugM  = raw.match(/^slug:\s*"(.+)"/m);
    const tagsM  = raw.match(/^tags:\s*\[(.+)\]/m);
    const salonM = raw.match(/^salon:\s*"(.+)"/m);
    const catM   = raw.match(/^category:\s*"(.+)"/m);
    const igIdM  = raw.match(/^instagram_id:\s*"(.+)"/m);

    if (!titleM || !slugM) continue;
    const igId = igIdM?.[1] ?? "";
    if (!igId) continue;

    const salon    = salonM?.[1] ?? "";
    const salonDir = SALON_DIR[salon.toLowerCase()] ?? "fleurami";

    inputs.push({
      title:           titleM[1],
      slug:            slugM[1],
      salonName:       salon,
      category:        (catM?.[1] ?? "hair") as "hair" | "eyelash",
      tags:            tagsM ? tagsM[1].split(",").map((t) => t.trim().replace(/"/g, "")) : [],
      sourceImagePath: `/images/instagram/${salonDir}/${igId}.jpg`,
    });
  }

  console.log(`🖼  ${inputs.length} 件のサムネを生成します\n`);
  generateAllThumbnails(inputs).then((results) => {
    console.log(`\n✅ ${results.size} 件のサムネ生成完了`);
  });
}
