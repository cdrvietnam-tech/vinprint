import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "../../components/storefront/ProductDetail";
import { productBySlug, products } from "../../lib/products";
import { productGuides } from "../../lib/product-guides";
import { productOrderContext } from "../../lib/product-order-context";
import { blogPostBySlug } from "../../lib/blog-posts";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug[slug];
  if (!product) return {};

  return {
    title: `In ${product.name} theo yêu cầu tại TP.HCM`,
    description: `${product.description} Xem ứng dụng, giá tham khảo và gửi file để VinPrint báo giá nhanh.`,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      title: `${product.name} | VinPrint`,
      description: product.description,
      url: `/san-pham/${product.slug}`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = productBySlug[slug];
  if (!product) notFound();

  const orderContext = productOrderContext[product.slug];
  const related = (orderContext?.related ?? []).map(slug => productBySlug[slug]).filter(Boolean);
  const guide = productGuides[product.slug];
  const guidePosts = (guide?.posts ?? []).map((postSlug) => blogPostBySlug[postSlug]).filter(Boolean);
  const faqSchema = guide ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": product.price ? "Product" : "Service",
    name: product.name,
    description: product.description,
    image: new URL(product.image, "https://vinprint.vn").href,
    brand: { "@type": "Brand", name: "VinPrint" },
    category: "Tem nhãn in theo yêu cầu",
    url: `https://vinprint.vn/san-pham/${product.slug}`,
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "VND",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: `https://vinprint.vn/san-pham/${product.slug}`,
            seller: { "@type": "Organization", name: "VinPrint" },
          },
        }
      : { provider: { "@type": "Organization", name: "VinPrint", url: "https://vinprint.vn" } }),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://vinprint.vn/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sản phẩm",
          item: "https://vinprint.vn/san-pham",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://vinprint.vn/san-pham/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ProductDetail product={product} guide={guide} orderContext={orderContext} related={related} posts={guidePosts.map(post=>({slug:post.slug,title:post.title}))}/>
    </>
  );
}
