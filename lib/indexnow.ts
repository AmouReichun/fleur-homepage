// IndexNow: 更新したURLをBing/Yandex等へ即時通知し、再クロール/インデックスを高速化する。
// （ChatGPT SearchはBingのインデックスを参照するため、AI検索の反映も早まる）
//
// 仕組み: キー文字列を公開ファイル `public/<KEY>.txt` として配信し、
// API へ { host, key, keyLocation, urlList } を POST するだけ。キーは秘匿情報ではない
// （公開ファイルとして誰でも取得できる）ため、コードに定数として置く。差し替えたい場合は
// 環境変数 INDEXNOW_KEY を設定し、public/<KEY>.txt も同じ名前・内容で用意する。

const HOST = "fleur-group.jp";
const BASE = `https://${HOST}`;

/** public/<KEY>.txt のファイル名・中身と必ず一致させること */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "2a842f5205b6208b1878ceb4d6411135";

const KEY_LOCATION = `${BASE}/${INDEXNOW_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * URL群をIndexNowに送信する。呼び出し側の処理を止めないよう、失敗時は例外を投げず false を返す。
 * @returns 受理された(2xx)なら true
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const urlList = Array.from(
    new Set(urls.filter((u) => typeof u === "string" && u.startsWith(BASE)))
  ).slice(0, 10000); // IndexNowの1リクエスト上限

  if (urlList.length === 0) {
    console.log("IndexNow: 送信対象URLなし、スキップ");
    return true;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    });
    // 200 OK / 202 Accepted = 受理。IndexNowは受理後に非同期でクロールする。
    const ok = res.status === 200 || res.status === 202;
    console.log(
      `IndexNow: ${res.status} ${res.statusText} — ${urlList.length}件送信${ok ? "" : " (未受理)"}`
    );
    if (!ok) {
      const body = await res.text().catch(() => "");
      if (body) console.log(`IndexNow応答: ${body.slice(0, 300)}`);
    }
    return ok;
  } catch (e) {
    console.error(
      `IndexNow送信エラー: ${e instanceof Error ? e.message : String(e)}`
    );
    return false;
  }
}

export { BASE as SITE_BASE };
