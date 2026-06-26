import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllAuthors, getPostsByAuthor } from "@/lib/blog/posts";
import { personSchema, breadcrumbSchema } from "@/lib/blog/structured-data";
import ArticleCard from "@/components/ArticleCard";

type Props = { params: { name: string } };

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ name: encodeURIComponent(a.name) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURIComponent(params.name);
  const authors = getAllAuthors();
  const author = authors.find((a) => a.name === name);
  if (!author) return {};
  return {
    title: `${name} | ${author.role} — ${author.salon}`,
    description: `${author.salon}の${author.role}${name}による施術例・コラム一覧。高知県の${author.category === "hair" ? "ヘアサロン" : "まつげ・まゆげサロン"}。`,
    alternates: { canonical: `/blog/author/${encodeURIComponent(name)}` },
  };
}

const SALON_ADDRESS: Record<string, { address: string; type: "HairSalon" | "BeautySalon" }> = {
  "fleur ami":         { address: "野市町西野230", type: "HairSalon" },
  "Riv. by fleur ami": { address: "南川添9-21", type: "HairSalon" },
  "Raffine":           { address: "はりまや町1-4-8", type: "BeautySalon" },
};

export default function AuthorPage({ params }: Props) {
  const name = decodeURIComponent(params.name);
  const authors = getAllAuthors();
  const author = authors.find((a) => a.name === name);
  if (!author) notFound();

  const posts = getPostsByAuthor(name);
  const salonInfo = SALON_ADDRESS[author.salon] ?? { address: "", type: "HairSalon" as const };
  const isEyelash = author.category === "eyelash";

  const person = personSchema(
    name,
    author.role,
    author.salon,
    salonInfo.type,
    salonInfo.address,
    `/blog/author/${encodeURIComponent(name)}`,
  );
  const crumb = breadcrumbSchema([
    { name: "トップ", url: "/" },
    { name: isEyelash ? "アイラッシュ" : "ヘア", url: isEyelash ? "/blog/eyelash" : "/blog/hair" },
    { name, url: `/blog/author/${encodeURIComponent(name)}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumb) }} />

      <div className="min-h-screen" style={{ background: isEyelash ? "linear-gradient(180deg,#FBF8F8 0%,#F9F5F6 100%)" : "#F8F2EA" }}>
        {/* パンくず */}
        <nav className="px-4 py-3 border-b bg-white/70 backdrop-blur-sm" style={{ borderColor: isEyelash ? "#F0E0E6" : "#E8D5BB" }}>
          <div className="max-w-wide mx-auto flex items-center gap-2 text-xs" style={{ color: isEyelash ? "#B8899A" : "#9A7A5A" }}>
            <Link href="/" className="hover:opacity-70 transition-opacity">トップ</Link>
            <span>›</span>
            <Link href={isEyelash ? "/blog/eyelash" : "/blog/hair"} className="hover:opacity-70 transition-opacity">
              {isEyelash ? "アイラッシュ" : "ヘア"}
            </Link>
            <span>›</span>
            <span>{name}</span>
          </div>
        </nav>

        {/* プロフィールヘッダー */}
        <div className="px-4 py-12 border-b" style={{ borderColor: isEyelash ? "#F0E0E6" : "#E8D5BB" }}>
          <div className="max-w-wide mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase mb-3 font-cormorant" style={{ color: isEyelash ? "#C8788A" : "#C8A860" }}>
              {author.role}
            </p>
            <h1 className="text-3xl font-medium mb-2 tracking-wide" style={{ fontFamily: "var(--font-shippori)", color: "#1A1410" }}>
              {name}
            </h1>
            <p className="text-sm" style={{ color: "#9A8A7A" }}>
              {author.salon}
            </p>
            <p className="text-sm mt-3" style={{ color: "#7A7070" }}>
              担当記事 {posts.length} 件
            </p>
          </div>
        </div>

        {/* 記事一覧 */}
        <div className="max-w-wide mx-auto px-4 py-10">
          {posts.length === 0 ? (
            <p className="text-sm" style={{ color: "#9A8A7A" }}>記事はまだありません。</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.slug} post={post} world={isEyelash ? "eyelash" : "hair"} />
              ))}
            </div>
          )}
          <div className="mt-10 pt-8 border-t" style={{ borderColor: isEyelash ? "#F0E0E6" : "#E8D5BB" }}>
            <Link href={isEyelash ? "/blog/eyelash" : "/blog/hair"} className="text-sm hover:opacity-70 transition-opacity" style={{ color: isEyelash ? "#C8788A" : "#C8A860" }}>
              ← {isEyelash ? "アイラッシュ" : "ヘア"}一覧へ戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
