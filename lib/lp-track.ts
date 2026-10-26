// LP（/lp）の計測ヘルパー（クライアント専用）。
// GA4（gtag）と GTM（dataLayer）の両方に同じイベントを送る。GAタグ本体は app/layout.tsx で読み込み済み。
//
// 主なイベント:
//   lp_cta_click   … LINEボタンが押された（店舗選択シートを開いた時点）
//   line_click     … 実際に公式LINEへ遷移した（＝LPの主要KPI。友だち追加・予約完了とは別指標）
//   lp_scroll      … スクロール到達率（25/50/75/100）
//   lp_section_view / lp_menu_view / lp_gallery_filter / lp_gallery_open / lp_faq_open
//
// UTM（Google広告・Instagram広告）は初回着地時に sessionStorage へ保持し、全イベントに付ける。
// ※ LINE側はこれらのパラメータを受け取れないため、LINE URL には付与しない（計測はGA側で完結させる）。

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
const UTM_STORE = "lp_utm";
const VARIANT_STORE = "lp_variant";

let disabled = false;
/** 管理画面のプレビューでは計測しない */
export function disableTracking() {
  disabled = true;
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") window.gtag(...args);
  // GAタグ読込前でも取りこぼさないよう、gtag と同じ形式でキューに積む
  else window.dataLayer.push(args as unknown as IArguments);
}

export function captureUtm(): Params {
  try {
    const q = new URLSearchParams(window.location.search);
    const found: Params = {};
    for (const k of UTM_KEYS) {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 100);
    }
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(UTM_STORE, JSON.stringify(found));
      return found;
    }
    return JSON.parse(sessionStorage.getItem(UTM_STORE) || "{}");
  } catch {
    return {};
  }
}

/** A/Bテストの振り分け（同じ訪問者は同じパターンを見続ける） */
export function getVariant(experimentId: string): "A" | "B" {
  try {
    const raw = localStorage.getItem(VARIANT_STORE);
    const saved = raw ? JSON.parse(raw) : null;
    if (saved?.id === experimentId && (saved.v === "A" || saved.v === "B")) return saved.v;
    const v = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(VARIANT_STORE, JSON.stringify({ id: experimentId, v }));
    return v;
  } catch {
    return "A";
  }
}

let common: Params = {};
export function setCommonParams(p: Params) {
  common = { ...common, ...p };
}

export function track(event: string, params: Params = {}) {
  if (disabled || typeof window === "undefined") return;
  const payload = { ...common, ...params, page: "lp" };
  gtag("event", event, payload);
  // GTMで使う場合のためのカスタムイベント（GTM側で "lp_*" / "line_click" をトリガーに設定）
  window.dataLayer?.push({ event, ...payload });
}

// ── 同意管理（Consent Mode v2）──────────────────────────────
export type ConsentChoice = "granted" | "denied";
const CONSENT_STORE = "lp_consent";

export function readConsent(): ConsentChoice | null {
  try {
    const v = localStorage.getItem(CONSENT_STORE);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORE, choice);
  } catch {
    /* プライベートブラウズ等 */
  }
  gtag("consent", "update", {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
}

/**
 * GAタグより先に実行するインラインスクリプト（app/lp/page.tsx で出力）。
 * 未選択の間: 解析は現行サイトと同じく有効、広告系Cookieは無効。拒否済みならすべて無効。
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var c=null;try{c=localStorage.getItem('${CONSENT_STORE}');}catch(e){}
gtag('consent','default',{analytics_storage:c==='denied'?'denied':'granted',ad_storage:c==='granted'?'granted':'denied',ad_user_data:c==='granted'?'granted':'denied',ad_personalization:c==='granted'?'granted':'denied',wait_for_update:500});
`;
