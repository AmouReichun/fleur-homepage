import { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/blog/posts";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "記事検索",
  description: "フルールグループの症例・コラム記事をキーワードで検索できます。",
  robots: { index: false },
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const posts = getAllPostsMeta();
  return <SearchClient posts={posts} initialQuery={searchParams.q ?? ""} />;
}
