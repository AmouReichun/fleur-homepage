const GITHUB_API = "https://api.github.com";

function cfg() {
  // Vercel 環境変数は GH_PAT、ローカルは GITHUB_TOKEN でも可
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_PAT ?? "";
  const owner = process.env.GITHUB_OWNER ?? "AmouReichun";
  const repo  = process.env.GITHUB_REPO  ?? "fleur-blog";
  return { token, owner, repo };
}

function headers(token: string) {
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "fleur-blog-admin",
  };
}

/** GitHub からファイル内容を取得 */
export async function getFileContent(filePath: string): Promise<{ content: string; sha: string } | null> {
  const { token, owner, repo } = cfg();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json() as { content: string; sha: string };
  const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf-8");
  return { content, sha: data.sha };
}

/** ファイルを GitHub にコミット（新規作成 or 上書き）
 *  sha を渡すと内部の GET を省略できる（bulkApprove の二重 GET 回避用）
 */
export async function commitFile(
  filePath: string,
  content: string | Buffer,
  message: string,
  knownSha?: string,
): Promise<void> {
  const { token, owner, repo } = cfg();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;
  const hdrs = headers(token);

  // SHA が渡されていない場合のみ取得
  let sha: string | undefined = knownSha;
  if (!sha) {
    const getRes = await fetch(url, { headers: hdrs, cache: "no-store" });
    if (getRes.ok) {
      const existing = await getRes.json() as { sha: string };
      sha = existing.sha;
    }
  }

  const b64 = Buffer.isBuffer(content)
    ? content.toString("base64")
    : Buffer.from(content, "utf-8").toString("base64");

  const body: Record<string, string> = { message, content: b64 };
  if (sha) body.sha = sha;

  const putRes = await fetch(url, {
    method: "PUT",
    headers: hdrs,
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(`GitHub commit failed (${filePath}): ${JSON.stringify(err)}`);
  }
}

/** ファイルを GitHub から削除 */
export async function deleteFile(
  filePath: string,
  message: string,
  knownSha?: string,
): Promise<void> {
  const { token, owner, repo } = cfg();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`;
  const hdrs = headers(token);

  let sha: string | undefined = knownSha;
  if (!sha) {
    const getRes = await fetch(url, { headers: hdrs, cache: "no-store" });
    if (!getRes.ok) throw new Error(`ファイルが見つかりません: ${filePath}`);
    const existing = await getRes.json() as { sha: string };
    sha = existing.sha;
  }

  const delRes = await fetch(url, {
    method: "DELETE",
    headers: hdrs,
    body: JSON.stringify({ message, sha }),
  });

  if (!delRes.ok) {
    const err = await delRes.json().catch(() => ({}));
    throw new Error(`GitHub delete failed (${filePath}): ${JSON.stringify(err)}`);
  }
}
