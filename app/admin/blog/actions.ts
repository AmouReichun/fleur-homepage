'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import matter from 'gray-matter'
import { commitFile, getFileContent, deleteFile } from '@/lib/blog/github'

// 認証はHP統合の admin_session に一本化（ログインは /admin/login を共用）
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

export async function saveArticle(formData: FormData) {
  const category = formData.get('category') as string
  const slug = formData.get('slug') as string
  const from = (formData.get('from') as string) ?? 'draft'

  const ghPath = `content/${category}/${slug}.md`
  const file = await getFileContent(ghPath)
  if (!file) throw new Error(`GitHub にファイルが見つかりません: ${ghPath}`)

  const { data } = matter(file.content)

  const tags = (formData.get('tags') as string)
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  const faqItems: { q: string; a: string }[] = []
  let i = 0
  while (formData.has(`faq_q_${i}`)) {
    faqItems.push({
      q: (formData.get(`faq_q_${i}`) as string).trim(),
      a: (formData.get(`faq_a_${i}`) as string).trim(),
    })
    i++
  }

  const updatedData = {
    ...data,
    title: formData.get('title') as string,
    excerpt: formData.get('excerpt') as string,
    tags,
    question: formData.get('question') as string,
    answer_summary: formData.get('answer_summary') as string,
    faq: faqItems,
  }

  const body = '\n' + (formData.get('body') as string).trim() + '\n'
  const newContent = matter.stringify(body, updatedData)

  await commitFile(
    `content/${category}/${slug}.md`,
    newContent,
    `edit: ${data.title ?? slug}`,
  )

  const base = from === 'published' ? '/admin/blog/published' : '/admin/blog'
  redirect(`${base}?saved=${encodeURIComponent(data.title ?? slug)}`)
}

export async function revertToDraft(category: string, slug: string) {
  const ghPath = `content/${category}/${slug}.md`
  const file = await getFileContent(ghPath)
  if (!file) throw new Error(`GitHub にファイルが見つかりません: ${ghPath}`)

  if (file.content.includes('draft: true')) {
    redirect('/admin/blog/published')
  }
  const updated = file.content.replace(/^(---\n)/, '$1draft: true\n')

  await commitFile(ghPath, updated, `revert to draft: ${slug}`, file.sha)
  redirect('/admin/blog/published?reverted=1')
}

export async function approveArticle(category: string, slug: string) {
  const ghPath = `content/${category}/${slug}.md`
  const file = await getFileContent(ghPath)
  if (!file) throw new Error(`GitHub にファイルが見つかりません: ${ghPath}`)

  const updated = file.content.replace(/^draft: true\r?\n/m, '')
  await commitFile(ghPath, updated, `publish: ${slug}`, file.sha)
  redirect(`/admin/blog?approved=${encodeURIComponent(slug)}`)
}

export async function bulkApprove(
  items: { category: string; slug: string }[]
): Promise<{ error: string } | undefined> {
  if (items.length === 0) return

  for (const { category, slug } of items) {
    try {
      const ghPath = `content/${category}/${slug}.md`
      const file = await getFileContent(ghPath)
      if (!file) continue
      const updated = file.content.replace(/^draft: true\r?\n/m, '')
      await commitFile(ghPath, updated, `publish: ${slug}`, file.sha)
    } catch (err) {
      return { error: `「${slug}」の公開に失敗しました: ${String(err)}` }
    }
  }

  redirect(`/admin/blog?approved=${encodeURIComponent(`${items.length}件`)}`)
}

// ── 記事削除 ───────────────────────────────────────────────────

export async function deleteArticle(
  category: string,
  slug: string,
): Promise<{ error?: string }> {
  try {
    await deleteFile(
      `content/${category}/${slug}.md`,
      `delete draft: ${slug}`,
    )
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export async function bulkDeleteArticles(
  items: { category: string; slug: string }[]
): Promise<{ error?: string }> {
  if (items.length === 0) return {}
  for (const { category, slug } of items) {
    try {
      await deleteFile(
        `content/${category}/${slug}.md`,
        `delete draft: ${slug}`,
      )
    } catch (err) {
      return { error: `「${slug}」の削除に失敗しました: ${String(err)}` }
    }
  }
  return {}
}

// ── 自動生成設定 ───────────────────────────────────────────────

const DAILY_GENERATE_CONFIG = "config/daily-generate.json"

export type DailyGenerateConfig = {
  enabled: boolean
  hourJST: number    // 0〜23
  perSalon: number   // 1〜5
}

const GENERATE_DEFAULTS: DailyGenerateConfig = {
  enabled: true,
  hourJST: 10,
  perSalon: 1,
}

export async function getDailyGenerateConfig(): Promise<DailyGenerateConfig> {
  const file = await getFileContent(DAILY_GENERATE_CONFIG)
  if (!file) return { ...GENERATE_DEFAULTS }
  try {
    return { ...GENERATE_DEFAULTS, ...(JSON.parse(file.content) as Partial<DailyGenerateConfig>) }
  } catch {
    return { ...GENERATE_DEFAULTS }
  }
}

export async function saveDailyGenerateConfig(
  config: DailyGenerateConfig
): Promise<{ error?: string }> {
  try {
    const file = await getFileContent(DAILY_GENERATE_CONFIG)
    const content = JSON.stringify(config, null, 2) + "\n"
    await commitFile(
      DAILY_GENERATE_CONFIG,
      content,
      `config: daily-generate ${config.enabled ? "ON" : "OFF"} ${config.hourJST}:00 JST ×${config.perSalon}件/サロン`,
      file?.sha,
    )
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

// ── 自動公開設定 ───────────────────────────────────────────────

const AUTO_PUBLISH_CONFIG = "config/auto-publish.json"

export type AutoPublishConfig = {
  enabled: boolean
  publishHourJST: number   // 0〜23
  articlesPerSalon: number // 1〜5
}

const CONFIG_DEFAULTS: AutoPublishConfig = {
  enabled: true,
  publishHourJST: 12,
  articlesPerSalon: 1,
}

export async function getAutoPublishConfig(): Promise<AutoPublishConfig> {
  const file = await getFileContent(AUTO_PUBLISH_CONFIG)
  if (!file) return { ...CONFIG_DEFAULTS }
  try {
    return { ...CONFIG_DEFAULTS, ...(JSON.parse(file.content) as Partial<AutoPublishConfig>) }
  } catch {
    return { ...CONFIG_DEFAULTS }
  }
}

export async function saveAutoPublishConfig(
  config: AutoPublishConfig
): Promise<{ error?: string }> {
  try {
    const file = await getFileContent(AUTO_PUBLISH_CONFIG)
    const content = JSON.stringify(config, null, 2) + "\n"
    await commitFile(
      AUTO_PUBLISH_CONFIG,
      content,
      `config: auto-publish ${config.enabled ? "ON" : "OFF"} ${config.publishHourJST}:00 JST ×${config.articlesPerSalon}件`,
      file?.sha,
    )
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}
