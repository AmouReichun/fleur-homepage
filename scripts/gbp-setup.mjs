#!/usr/bin/env node
// GBP（Googleビジネスプロフィール）自動投稿のセットアップ補助スクリプト。
//
// これ1本で次を自動化します:
//   1. OAuth同意（ブラウザ）→ リフレッシュトークンの取得
//   2. 管理下のアカウント/店舗（ロケーション）を一覧し、
//      環境変数 GBP_LOCATIONS 用の JSON テンプレートを出力
//
// 事前準備（Google側・ユーザー作業。ここだけは手動が必要）:
//   A) Google Cloud Console で OAuth クライアント（種類: デスクトップアプリ）を作成
//   B) そのクライアントの「承認済みリダイレクト URI」に  http://127.0.0.1:5858  を追加
//      （デスクトップアプリ型なら不要な場合もあるが、念のため追加推奨）
//   C) 「Google My Business API」など Business Profile 系 API の利用申請が承認済みであること
//
// 使い方:
//   GBP_CLIENT_ID=xxxx GBP_CLIENT_SECRET=yyyy node scripts/gbp-setup.mjs
//
// 実行するとブラウザで同意 → ターミナルに refresh_token と GBP_LOCATIONS が表示されます。

import http from "node:http";
import { URL } from "node:url";
import { exec } from "node:child_process";

const PORT = 5858;
const REDIRECT_URI = `http://127.0.0.1:${PORT}`;
const SCOPE = "https://www.googleapis.com/auth/business.manage";

const CLIENT_ID = process.env.GBP_CLIENT_ID;
const CLIENT_SECRET = process.env.GBP_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n❌ GBP_CLIENT_ID と GBP_CLIENT_SECRET を環境変数で渡してください。\n" +
      "   例: GBP_CLIENT_ID=xxx GBP_CLIENT_SECRET=yyy node scripts/gbp-setup.mjs\n"
  );
  process.exit(1);
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {});
}

function buildAuthUrl() {
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id", CLIENT_ID);
  u.searchParams.set("redirect_uri", REDIRECT_URI);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", SCOPE);
  u.searchParams.set("access_type", "offline");
  u.searchParams.set("prompt", "consent");
  return u.toString();
}

async function exchangeCode(code) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function api(url, accessToken) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`${url}\n  → ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function listLocations(accessToken) {
  // アカウント一覧（Account Management API v1）
  const accountsData = await api(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    accessToken
  );
  const accounts = accountsData.accounts ?? [];
  const rows = [];
  for (const acc of accounts) {
    // acc.name = "accounts/123456"
    let pageToken = "";
    do {
      const url = new URL(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${acc.name}/locations`
      );
      url.searchParams.set("readMask", "name,title,storefrontAddress");
      url.searchParams.set("pageSize", "100");
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      const locData = await api(url.toString(), accessToken);
      for (const loc of locData.locations ?? []) {
        // loc.name = "locations/789" → v4 用に accounts/*/locations/* へ
        const locId = loc.name.split("/").pop();
        rows.push({
          account: acc.name,
          title: loc.title ?? "(名称なし)",
          resource: `${acc.name}/locations/${locId}`,
        });
      }
      pageToken = locData.nextPageToken ?? "";
    } while (pageToken);
  }
  return rows;
}

function printResult(refreshToken, rows) {
  console.log("\n\n==================== 取得結果 ====================\n");
  console.log("✅ リフレッシュトークン（Vercel の GBP_REFRESH_TOKEN に設定）:\n");
  console.log(refreshToken + "\n");

  if (rows.length === 0) {
    console.log(
      "⚠️ 店舗（ロケーション）が0件でした。API利用申請の承認、またはこのGoogleアカウントの店舗管理権限を確認してください。\n"
    );
    return;
  }

  console.log("✅ 管理下の店舗一覧:\n");
  for (const r of rows) {
    console.log(`   ・${r.title}`);
    console.log(`     resource: ${r.resource}`);
  }

  // GBP_LOCATIONS テンプレート（店舗キーは content.json の salonOrder に合わせて手で対応付け）
  const template = {};
  const salonKeys = ["fleurami", "riv", "raffine"];
  rows.forEach((r, i) => {
    template[salonKeys[i] ?? `store${i + 1}`] = r.resource;
  });
  console.log(
    "\n✅ GBP_LOCATIONS のたたき台（店舗キーが正しいか title を見て確認・修正してください）:\n"
  );
  console.log(JSON.stringify(template) + "\n");
  console.log(
    "   ※ 店舗キーは fleurami / riv / raffine。上の title と resource の対応を確認し、\n" +
      "     必要ならキーを入れ替えて Vercel の GBP_LOCATIONS に1行で設定してください。\n"
  );
}

const authUrl = buildAuthUrl();
const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, REDIRECT_URI);
  const code = reqUrl.searchParams.get("code");
  const err = reqUrl.searchParams.get("error");
  if (!code && !err) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    "<html><body style='font-family:sans-serif;padding:40px'>認証が完了しました。ターミナルに戻ってください。このタブは閉じて構いません。</body></html>"
  );
  server.close();
  try {
    if (err) throw new Error(`認可エラー: ${err}`);
    console.log("\n⏳ トークンを取得中...");
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) {
      console.error(
        "\n❌ refresh_token が返りませんでした。once同意済みの場合は、Googleアカウントの\n" +
          "   「サードパーティのアクセス」から当該アプリを削除して再実行してください。"
      );
      process.exit(1);
    }
    console.log("⏳ 店舗一覧を取得中...");
    let rows = [];
    try {
      rows = await listLocations(tokens.access_token);
    } catch (e) {
      console.error("\n⚠️ 店舗一覧の取得に失敗（トークンは有効です）:\n" + e.message);
    }
    printResult(tokens.refresh_token, rows);
    process.exit(0);
  } catch (e) {
    console.error("\n❌ 失敗:", e.message);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log("\n🔑 GBP セットアップを開始します。");
  console.log(`   リダイレクトURI: ${REDIRECT_URI}  （OAuthクライアントに登録されている必要があります）`);
  console.log("\n👉 ブラウザで同意画面を開きます。開かない場合は次のURLを手動で開いてください:\n");
  console.log(authUrl + "\n");
  openBrowser(authUrl);
});
