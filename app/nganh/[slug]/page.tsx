import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "../../components/content/ContentPage";
import { industryPages } from "../../lib/content-pages";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return Object.keys(industryPages).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const data = industryPages[slug]; if (!data) return {};
  return { title: data.title, description: data.description, alternates: { canonical: `/nganh/${slug}` } };
}
export default async function IndustryPage({ params }: Props) {
  const { slug } = await params; const data = industryPages[slug]; if (!data) notFound();
  return <ContentPage data={data} canonicalPath={`/nganh/${slug}`} />;
}
