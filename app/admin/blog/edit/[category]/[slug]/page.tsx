import { notFound } from 'next/navigation'
import matter from 'gray-matter'
import EditForm from './EditForm'
import { getFileContent } from '@/lib/blog/github'

export const dynamic = 'force-dynamic'

type Params = { category: string; slug: string }

export default async function EditPage({ params }: { params: Params }) {
  const { category, slug } = params
  const ghPath = `content/${category}/${slug}.md`
  const file = await getFileContent(ghPath)

  if (!file) notFound()

  const { data, content: body } = matter(file.content)

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-neutral-500 text-xs tracking-widest uppercase">fleur group</p>
          <h1 className="text-white font-light text-lg">記事編集</h1>
        </div>
        <a href="/admin/blog" className="text-neutral-400 text-sm hover:text-white transition-colors">
          ← 一覧へ
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-4 flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            category === 'hair' ? 'bg-stone-800 text-stone-300' : 'bg-pink-950 text-pink-300'
          }`}>
            {category === 'hair' ? '✂ Hair' : '✦ Eyelash'}
          </span>
          <span className="text-neutral-500 text-xs">{slug}</span>
          {data.yakkihou_flag && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
              ⚠ 薬機法要確認
            </span>
          )}
        </div>

        <EditForm
          category={category}
          slug={slug}
          data={data}
          body={body.trim()}
          isDraft={data.draft === true}
        />
      </main>
    </div>
  )
}
