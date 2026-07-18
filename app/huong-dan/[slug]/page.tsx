import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "../../components/content/ContentPage";
import { guidePages } from "../../lib/content-pages";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return Object.keys(guidePages).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const data = guidePages[slug]; if (!data) return {};
  return { title: data.title, description: data.description, alternates: { canonical: `/huong-dan/${slug}` } };
}
export default async function GuidePage({ params }: Props) {
  const { slug } = await params; const data = guidePages[slug]; if (!data) notFound();
  return <ContentPage data={data} canonicalPath={`/huong-dan/${slug}`} />;
}
