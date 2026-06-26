'use client'

import { useState, type ReactNode } from 'react'
import { saveArticle, approveArticle } from '../../../actions'

type FaqItem = { q: string; a: string }

type ArticleData = {
  title?: string
  excerpt?: string
  tags?: string[]
  question?: string
  answer_summary?: string
  yakkihou_flag?: boolean
  yakkihou_words?: string[]
  faq?: FaqItem[]
  instagram_id?: string
  instagram_permalink?: string
  [key: string]: unknown
}

type Props = {
  category: string
  slug: string
  data: ArticleData
  body: string
  isDraft: boolean
}

function Field({
  label,
  sublabel,
  children,
}: {
  label: string
  sublabel?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="block text-sm text-neutral-300 mb-1">
        {label}
        {sublabel && <span className="text-neutral-600 text-xs ml-2">{sublabel}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2 rounded-lg text-sm ' +
  'placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors'

const textareaCls = inputCls + ' resize-y'

export default function EditForm({ category, slug, data, body, isDraft }: Props) {
  const [faqItems, setFaqItems] = useState<FaqItem[]>(
    Array.isArray(data.faq) ? (data.faq as FaqItem[]) : []
  )
  const [saving, setSaving] = useState(false)
  const [approving, setApproving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSave = async (formData: FormData) => {
    setSaving(true)
    setSaveError(null)
    try {
      await saveArticle(formData)
    } catch (e) {
      setSaveError(String(e))
      setSaving(false)
    }
  }

  const handleApprove = async () => {
    if (!confirm(`「${data.title as string}」を公開しますか？`)) return
    setApproving(true)
    try {
      await approveArticle(category, slug)
    } catch (e) {
      setSaveError(String(e))
      setApproving(false)
    }
  }

  return (
    <form action={handleSave} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="from" value={isDraft ? 'draft' : 'published'} />

      {/* エラー表示 */}
      {saveError && (
        <div className="px-4 py-3 rounded-sm text-sm" style={{ background: "#1F0D0D", border: "1px solid #5A1A1A", color: "#E08080" }}>
          保存エラー: {saveError}
        </div>
      )}

      {/* Title */}
      <Field label="タイトル">
        <input
          type="text"
          name="title"
          defaultValue={data.title as string}
          className={inputCls}
          required
        />
      </Field>

      {/* Excerpt */}
      <Field label="抜粋" sublabel="検索・カード表示で使用">
        <textarea
          name="excerpt"
          defaultValue={data.excerpt as string}
          rows={3}
          className={textareaCls}
        />
      </Field>

      {/* Tags */}
      <Field label="タグ" sublabel="カンマ区切り">
        <input
          type="text"
          name="tags"
          defaultValue={Array.isArray(data.tags) ? (data.tags as string[]).join(', ') : ''}
          className={inputCls}
          placeholder="パーマ, カラー, 40代"
        />
      </Field>

      {/* Question / Answer */}
      <div className="grid grid-cols-1 gap-4">
        <Field label="代表質問" sublabel="FAQ・構造化データ用">
          <textarea
            name="question"
            defaultValue={data.question as string}
            rows={2}
            className={textareaCls}
          />
        </Field>
        <Field label="回答サマリー">
          <textarea
            name="answer_summary"
            defaultValue={data.answer_summary as string}
            rows={3}
            className={textareaCls}
          />
        </Field>
      </div>

      {/* Yakkihou info (read-only) */}
      {data.yakkihou_flag && (
        <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
          <p className="text-amber-400 text-sm font-medium mb-1">⚠ 薬機法フラグ</p>
          <p className="text-amber-200 text-xs">
            対象ワード: {Array.isArray(data.yakkihou_words)
              ? (data.yakkihou_words as string[]).join('、')
              : '—'}
          </p>
          <p className="text-amber-300/60 text-xs mt-1">
            本文内の該当箇所を確認・修正してから公開してください
          </p>
        </div>
      )}

      {/* FAQ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-neutral-300">よくある質問</label>
          <button
            type="button"
            onClick={() => setFaqItems([...faqItems, { q: '', a: '' }])}
            className="text-xs px-3 py-1 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
          >
            + 追加
          </button>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Q{i + 1}</span>
                <button
                  type="button"
                  onClick={() => setFaqItems(faqItems.filter((_, j) => j !== i))}
                  className="text-xs text-red-500 hover:text-red-400 transition-colors"
                >
                  削除
                </button>
              </div>
              <input
                type="text"
                name={`faq_q_${i}`}
                defaultValue={item.q}
                placeholder="質問"
                className={inputCls}
              />
              <textarea
                name={`faq_a_${i}`}
                defaultValue={item.a}
                placeholder="回答"
                rows={3}
                className={textareaCls}
              />
            </div>
          ))}
          {faqItems.length === 0 && (
            <p className="text-neutral-600 text-sm text-center py-4">FAQなし</p>
          )}
        </div>
      </div>

      {/* Body */}
      <Field label="本文" sublabel="Markdown">
        <textarea
          name="body"
          defaultValue={body}
          rows={20}
          className={`${textareaCls} font-mono text-xs leading-relaxed`}
        />
      </Field>

      {/* Instagram info (read-only) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-xs text-neutral-500">
        <p>Instagram ID: <span className="text-neutral-400">{data.instagram_id as string}</span></p>
        <p>
          Permalink:{' '}
          <a
            href={data.instagram_permalink as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white underline transition-colors"
          >
            {data.instagram_permalink as string}
          </a>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-neutral-800">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-neutral-800 text-white rounded-lg font-medium text-sm
                     hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          {saving ? '保存中…' : '保存'}
        </button>
        {isDraft && (
          <button
            type="button"
            onClick={handleApprove}
            disabled={approving}
            className="px-6 py-2.5 bg-white text-neutral-900 rounded-lg font-medium text-sm
                       hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            {approving ? '公開中…' : '公開する'}
          </button>
        )}
        <a
          href={isDraft ? '/admin/blog' : '/admin/blog/published'}
          className="px-4 py-2.5 text-neutral-500 text-sm hover:text-white transition-colors"
        >
          キャンセル
        </a>
      </div>
    </form>
  )
}
