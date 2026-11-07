import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog/posts";
import { getContent } from "@/lib/content";
import { staffNameVariants } from "@/lib/blog/article-prompt";
import { normalizeName } from "@/lib/blog/case-studies";
import { getCaseData } from "@/lib/blog/case-data";
import { salonDisplayName } from "@/lib/salon-display";

/**
 * 親記事にまとめた実例（スタッフ写真・インスタの実例）を、写真つきで親記事の中に並べる。
 * 地域×メニューページなどの事例カードは、ここの各実例（id="case-◯◯"）へ直接リンクする。
 * 中身は実例記事の「答えの要約」（事実だけのルールで作成）と、担当・日付だけ。
 */
export default function MergedCases({ cases, world }: { cases: PostMeta[]; world: "hair" | "eyelash" }) {
  if (cases.length === 0) return null;
  const staff = getContent().staff;
  const eye = world === "eyelash";
  const accent = eye ? "text-eye-accent" : "text-hair-accent";
  const muted = eye ? "text-eye-muted" : "text-hair-muted";
  return (
    <section className="my-12" aria-labelledby="merged-cases-heading">
      <h2 id="merged-cases-heading" className="text-lg font-medium mb-1">この施術の実例（{cases.length}件）</h2>
      <p className={`text-xs ${muted} mb-6`}>スタッフが実際の施術を撮影して投稿した写真です。料金は掲載時点のメニュー表の定価（税込）です。</p>
      <div className="space-y-8">
        {cases.map((c) => {
          const member = c.author
            ? staff.find((s) => staffNameVariants(s.name).includes(normalizeName(c.author)))
            : undefined;
          const slug = (member as { slug?: string } | undefined)?.slug;
          const data = getCaseData(c);
          return (
            <figure key={c.slug} id={`case-${c.slug}`} className="scroll-mt-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
                <Image src={c.thumbnail} alt={c.title} fill sizes="(max-width: 720px) 100vw, 720px" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-sm leading-relaxed">
                <p className="font-medium">{c.title}</p>
                {(c.answer_summary || c.excerpt) && <p className="mt-2">{c.answer_summary || c.excerpt}</p>}
                {/* 施術データ（定価はメニュー表と一致したときだけ） */}
                <table className="mt-3 w-full text-xs border-collapse">
                  <tbody>
                    <tr><th className={`text-left font-normal ${muted} py-1 pr-3 w-24 align-top`}>店舗</th><td className="py-1">{salonDisplayName(c.salon)}</td></tr>
                    {c.author && <tr><th className={`text-left font-normal ${muted} py-1 pr-3 align-top`}>担当</th><td className="py-1">{slug ? <Link href={`/staff/${slug}`} className={`${accent} underline`}>{c.author}</Link> : c.author}{c.author_role ? `（${c.author_role}）` : ""}</td></tr>}
                    {data.menu && <tr><th className={`text-left font-normal ${muted} py-1 pr-3 align-top`}>メニュー</th><td className="py-1">{data.menu}</td></tr>}
                    {data.price && <tr><th className={`text-left font-normal ${muted} py-1 pr-3 align-top`}>定価</th><td className="py-1">{data.price}</td></tr>}
                    <tr><th className={`text-left font-normal ${muted} py-1 pr-3 align-top`}>掲載日</th><td className="py-1">{c.date}</td></tr>
                  </tbody>
                </table>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
