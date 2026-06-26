const GRAPH = "https://api.github.com";

export const UPLOAD_SALON_INFO = {
  fleurami: { name: "fleur ami",         category: "hair"     as const },
  riv:      { name: "Riv. by fleur ami", category: "hair"     as const },
  raffine:  { name: "Raffine",           category: "eyelash"  as const },
} as const;

export type StaffUploadSalonKey = keyof typeof UPLOAD_SALON_INFO;

export type StaffUpload = {
  id: string;
  type: "upload";
  imageGithubPath: string;  // "public/images/uploads/fleurami/fleurami-abc.jpg"
  memo: string;
  salonKey: StaffUploadSalonKey;
  salonName: string;
  category: "hair" | "eyelash";
  timestamp: string;
  jsonGithubPath: string;   // "content/uploads/fleurami-abc.json"
};

function ghCfg() {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT ?? "";
  const owner = process.env.GITHUB_OWNER ?? "AmouReichun";
  const repo  = process.env.GITHUB_REPO  ?? "fleur-blog";
  return { token, owner, repo };
}

function ghHeaders(token: string): Record<string, string> {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function fetchUploadJson(downloadUrl: string): Promise<StaffUpload | null> {
  try {
    const r = await fetch(downloadUrl, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as StaffUpload;
  } catch {
    return null;
  }
}

export async function getStaffUploads(): Promise<StaffUpload[]> {
  const { token, owner, repo } = ghCfg();
  const res = await fetch(
    `${GRAPH}/repos/${owner}/${repo}/contents/content/uploads`,
    { headers: ghHeaders(token), cache: "no-store" },
  );
  if (!res.ok) return []; // ディレクトリ未作成の場合は空配列

  const files = (await res.json()) as { name: string; download_url: string }[];
  const jsonFiles = files.filter((f) => f.name.endsWith(".json"));

  // 全ファイルを並列取得
  const results = await Promise.all(jsonFiles.map((f) => fetchUploadJson(f.download_url)));
  const uploads = results.filter((u): u is StaffUpload => u !== null);

  return uploads.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

/** GitHub Contents API でバイナリファイルを base64 で取得 */
export async function getFileBase64FromGithub(
  githubPath: string,
): Promise<string | null> {
  const { token, owner, repo } = ghCfg();
  try {
    const res = await fetch(
      `${GRAPH}/repos/${owner}/${repo}/contents/${githubPath}`,
      { headers: ghHeaders(token), cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { content: string };
    return data.content.replace(/\n/g, "");
  } catch {
    return null;
  }
}

/** スタッフ投稿画像の管理画面プロキシ URL を返す */
export function uploadImageProxyUrl(imageGithubPath: string): string {
  return `/api/admin/upload-image?path=${encodeURIComponent(imageGithubPath)}`;
}
