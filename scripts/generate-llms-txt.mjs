// ビルド後に public/llms.txt を自動生成するスクリプト
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const contentDir = path.join(root, "content");
const SITE_URL = process.env.SITE_URL ?? "https://fleur-group.jp";

function readFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) fm[key.trim()] = rest.join(":").trim().replace(/^"|"$/g, "");
  }
  return fm;
}

function collectPosts(category) {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const fm = readFrontmatter(path.join(dir, f));
      if (!fm) return null;
      return { title: fm.title, slug: fm.slug ?? f.replace(".md", ""), excerpt: fm.excerpt };
    })
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const hairPosts = collectPosts("hair");
const eyelashPosts = collectPosts("eyelash");

const lines = [
  `# フルールグループ`,
  ``,
  `> 高知県のヘアサロン（fleur ami・香南市 / Riv.・高知市）とアイラッシュサロン（Raffine・高知市はりまや）を展開するグループ。白髪ぼかし・艶カラー・髪質改善・縮毛矯正・マツエク（まつげエクステ）・まつげパーマ・眉毛を専門とする。`,
  ``,
  `## ヘア症例・コラム`,
  ...hairPosts.map(
    (p) => `- [${p.title}](${SITE_URL}/hair/${p.slug}): ${p.excerpt ?? ""}`
  ),
  ``,
  `## アイラッシュ症例・コラム`,
  ...eyelashPosts.map(
    (p) => `- [${p.title}](${SITE_URL}/eyelash/${p.slug}): ${p.excerpt ?? ""}`
  ),
  ``,
  `## グループ情報`,
  `- [フルールグループとは](${SITE_URL}/about): 高知県のヘア・アイラッシュサロングループ。店舗情報・アクセス・得意メニュー。`,
  ``,
  `## 店舗`,
  `- fleur ami（フルールアミー）: 高知県香南市野市町西野230。ヘアサロン。白髪ぼかし・艶カラー・髪質改善・縮毛矯正。`,
  `- Riv. by fleur ami（リヴ）: 高知県高知市南川添9-21。ヘアサロン。髪質改善・縮毛矯正・ハイライト・白髪ぼかし。`,
  `- Raffine（ラフィーネ）: 高知県高知市はりまや町1-4-8。マツエク・まつげパーマ・眉毛WAX。半個室・女性専用。`,
];

const output = lines.join("\n");
fs.writeFileSync(path.join(root, "public", "llms.txt"), output, "utf8");
console.log("✓ public/llms.txt generated");
