'use client'

import { useState, useTransition } from 'react'
import { saveDailyGenerateConfig } from './actions'
import type { DailyGenerateConfig } from './actions'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const COUNTS = [1, 2, 3, 4, 5]

export default function DailyGenerateSettings({
  initialConfig,
}: {
  initialConfig: DailyGenerateConfig
}) {
  const [cfg, setCfg] = useState<DailyGenerateConfig>(initialConfig)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveDailyGenerateConfig(cfg)
      if (result.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  const pad = (n: number) => String(n).padStart(2, '0')
  const hasChanged = JSON.stringify(cfg) !== JSON.stringify(initialConfig)

  return (
    <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #222' }}>
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: '#161616', borderBottom: '1px solid #222' }}
      >
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium" style={{ color: '#D4C8B0' }}>
            自動生成スケジュール
          </p>
          <span
            className="text-[9px] px-2 py-0.5 rounded-sm"
            style={{
              background: cfg.enabled ? '#0D1F12' : '#1A1A1A',
              color: cfg.enabled ? '#6DBF88' : '#555',
              border: `1px solid ${cfg.enabled ? '#1A4A25' : '#333'}`,
            }}
          >
            {cfg.enabled ? '● 稼働中' : '○ 停止中'}
          </span>
        </div>

        {/* ON/OFF トグル */}
        <button
          type="button"
          onClick={() => setCfg(c => ({ ...c, enabled: !c.enabled }))}
          className="flex items-center gap-2 text-xs"
          style={{ color: cfg.enabled ? '#6DBF88' : '#555' }}
        >
          <span
            className="relative inline-block w-9 h-5 rounded-full transition-colors"
            style={{ background: cfg.enabled ? '#2A7A40' : '#2A2A2A' }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
              style={{
                background: cfg.enabled ? '#6DBF88' : '#555',
                left: cfg.enabled ? 'calc(100% - 18px)' : '2px',
              }}
            />
          </span>
          {cfg.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* 設定フォーム */}
      <div className="px-5 py-4 grid grid-cols-2 gap-4" style={{ background: '#141414' }}>
        {/* 生成時刻 */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase mb-2" style={{ color: '#666' }}>
            生成時刻 (JST)
          </label>
          <select
            value={cfg.hourJST}
            onChange={e => setCfg(c => ({ ...c, hourJST: Number(e.target.value) }))}
            className="w-full text-sm px-3 py-2 rounded-sm appearance-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', color: '#D4C8B0' }}
          >
            {HOURS.map(h => (
              <option key={h} value={h} style={{ background: '#1E1E1E' }}>
                {pad(h)}:00
              </option>
            ))}
          </select>
          <p className="text-[9px] mt-1" style={{ color: '#444' }}>
            UTC {pad((cfg.hourJST - 9 + 24) % 24)}:00
          </p>
        </div>

        {/* サロンあたり件数 */}
        <div>
          <label className="block text-[10px] tracking-[0.15em] uppercase mb-2" style={{ color: '#666' }}>
            サロンあたり件数 / 日
          </label>
          <select
            value={cfg.perSalon}
            onChange={e => setCfg(c => ({ ...c, perSalon: Number(e.target.value) }))}
            className="w-full text-sm px-3 py-2 rounded-sm appearance-none"
            style={{ background: '#1E1E1E', border: '1px solid #2A2A2A', color: '#D4C8B0' }}
          >
            {COUNTS.map(n => (
              <option key={n} value={n} style={{ background: '#1E1E1E' }}>
                {n} 件
              </option>
            ))}
          </select>
          <p className="text-[9px] mt-1" style={{ color: '#444' }}>
            3サロン × {cfg.perSalon}件 = 最大 {cfg.perSalon * 3} 件/日
          </p>
        </div>
      </div>

      {/* フッター */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: '#161616', borderTop: '1px solid #1E1E1E' }}
      >
        <p className="text-[10px]" style={{ color: '#555' }}>
          Instagram の未記事化投稿から自動生成（下書き保存）
        </p>
        <div className="flex items-center gap-3">
          {saved && <span className="text-[10px]" style={{ color: '#6DBF88' }}>✓ 保存しました</span>}
          {error && <span className="text-[10px]" style={{ color: '#E08080' }}>✕ {error}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || (!hasChanged && !saved)}
            className="text-xs px-5 py-2 rounded-sm font-medium transition-opacity disabled:opacity-30"
            style={{
              background: hasChanged ? 'linear-gradient(135deg, #C8A860, #A88840)' : '#1E1E1E',
              color: hasChanged ? '#0F0F0F' : '#555',
              border: hasChanged ? 'none' : '1px solid #2A2A2A',
            }}
          >
            {isPending ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
