import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "../components/content/ContentPage";
import { companyPages } from "../lib/content-pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(companyPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = companyPages[slug];
  if (!data) return {};
  return { title: data.title, description: data.description, alternates: { canonical: `/${slug}` } };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const data = companyPages[slug];
  if (!data) notFound();
  return <ContentPage data={data} canonicalPath={`/${slug}`} />;
}
