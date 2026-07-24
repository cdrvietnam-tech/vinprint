import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "../../components/content/ContentPage";
import { areaPages } from "../../lib/content-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(areaPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = areaPages[slug];
  if (!data) return {};
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `/khu-vuc/${slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const data = areaPages[slug];
  if (!data) notFound();
  return <ContentPage data={data} canonicalPath={`/khu-vuc/${slug}`} />;
}
