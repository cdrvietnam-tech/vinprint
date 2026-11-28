import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpRightIcon, MessageIcon } from "../../components/icons";
import ConversionLink from "../../components/ConversionLink";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
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
      <Header />
      <main className="product-page pt-20" id="main-content" tabIndex={-1}>

      <section className={`product-hero product-hero--${product.tone}`}>
        <div className="shell product-hero__grid">
          <div className="product-hero__copy">
              <Link href="/san-pham" className="product-breadcrumb"><ArrowLeftIcon /> SẢN PHẨM / {product.eyebrow}</Link>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="product-hero__benefit"><span>Ưu điểm chính</span><strong>{product.benefit}</strong></div>
            <div className="product-hero__actions">
                <Link href="/#bang-gia">Xem combo ưu đãi <ArrowDownIcon /></Link>
              <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition={`product_${product.slug}`}><MessageIcon /> Hỏi giá qua Zalo <ArrowUpRightIcon /></ConversionLink>
            </div>
            <small>Giá tham khảo: <b>{product.priceLabel}</b>. Xưởng xác nhận sau khi xem file, số lượng và quy cách.</small>
          </div>
          <div className="product-hero__image">
            <Image src={product.image} alt={`Mẫu minh họa thiết kế ${product.name}`} fill sizes="(max-width: 1040px) 100vw, 48vw" className="object-contain" />
            <span>ẢNH MẪU MINH HỌA</span>
            <a href={product.source} target="_blank" rel="noreferrer">Xem sản phẩm tại shop <ArrowUpRightIcon /></a>
          </div>
        </div>
      </section>

      <section className="product-details section-pad">
        <div className="shell product-details__grid">
          <div>
            <span className="section-index">APPLICATION MAP</span>
            <h2>Dùng tốt<br />trên sản phẩm nào?</h2>
          </div>
          <div className="product-use-grid">
            {product.uses.map((use, index) => <div key={use}><span>{String(index + 1).padStart(2, "0")}</span><b>{use}</b></div>)}
          </div>
        </div>
      </section>

      {guide && (
        <section className="bg-white px-4 py-14 sm:py-20" aria-labelledby="product-guide-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 id="product-guide-heading" className="text-3xl font-black leading-tight text-gray-950 sm:text-4xl">{`${product.name}: khi nào nên chọn?`}</h2>
              {guide.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-gray-700">{paragraph}</p>)}
              <ul className="mt-6 flex flex-wrap gap-3">
                {guide.links.map((item) => (
                  <li key={item.href}><Link href={item.href} className="inline-flex min-h-11 items-center rounded-full border border-gray-300 px-4 text-sm font-bold text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]">{item.label} →</Link></li>
                ))}
              </ul>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl bg-orange-50 p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-orange-800">Nên chọn khi</h3>
                <ul className="mt-4 space-y-3">{guide.chooseWhen.map((item) => <li key={item} className="font-semibold text-gray-900">✓ {item}</li>)}</ul>
              </div>
              <div className="rounded-3xl bg-gray-100 p-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-700">Cần lưu ý</h3>
                <ul className="mt-4 space-y-3">{guide.watchOut.map((item) => <li key={item} className="font-semibold text-gray-900">• {item}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {orderContext && <section className="border-y border-red-100 bg-[#fffaf7] px-4 py-10" aria-labelledby="order-checklist-title" data-product-checklist={product.slug}><div className="mx-auto max-w-6xl"><h2 id="order-checklist-title" className="text-2xl font-black text-[#bd0011]">Chuẩn bị đặt in: {product.name}</h2><p className="mt-3 text-sm leading-7 text-gray-700">Gửi file, kích thước, số lượng từng mẫu và ngày cần nhận. Với loại tem này, hãy kiểm tra thêm:</p><dl className="mt-6 grid gap-4 md:grid-cols-3">{orderContext.checks.map(check=><div key={check.label} className="rounded-2xl border border-red-100 bg-white p-5"><dt className="font-bold text-gray-950">{check.label}</dt><dd className="mt-2 text-sm leading-7 text-gray-700">{check.text}</dd></div>)}</dl><nav aria-label="Chuẩn bị đặt in" className="mt-6 flex flex-wrap gap-3">{[{href:"/blog/chuan-bi-file-in-tem-khong-bi-mo",label:"Kiểm tra file in"},{href:"/huong-dan/chon-kich-thuoc-tem",label:"Đo kích thước tem"},{href:"/blog/gia-in-tem-so-luong-it-phu-thuoc-gi",label:"Hiểu quy cách báo giá"}].map(link=><Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-full border border-red-100 bg-white px-4 text-sm font-bold text-[#bd0011]">{link.label} →</Link>)}</nav></div></section>}

      <section className="product-order">
        <div className="shell product-order__grid">
          <div><span>QUY TRÌNH ĐẶT IN</span><h2>Gửi đủ một lần.<br />Xử lý nhanh hơn.</h2></div>
          <ol>
            <li><b>01</b><span><strong>Gửi file</strong><small>File + số lượng + chất liệu</small></span></li>
            <li><b>02</b><span><strong>Nhận báo giá</strong><small>Nhân viên kiểm tra trực tiếp</small></span></li>
            <li><b>03</b><span><strong>Đặt cọc</strong><small>Gửi thông tin nhận hàng</small></span></li>
            <li><b>04</b><span><strong>Chờ tem về</strong><small>Nhận tại xưởng hoặc giao hàng</small></span></li>
          </ol>
        </div>
      </section>

      {guide && (
        <section className="bg-[#F7F4EE] px-4 py-14 sm:py-20" aria-labelledby="product-faq-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="product-faq-heading" className="text-3xl font-black text-gray-950 sm:text-4xl">{`Câu hỏi thường gặp về ${product.name.toLowerCase()}`}</h2>
            <dl className="mt-8 grid gap-5 lg:grid-cols-3">
              {guide.faqs.map((item) => (
                <div key={item.q} className="rounded-3xl border border-gray-200 bg-white p-6">
                  <dt className="text-lg font-black text-gray-950">{item.q}</dt>
                  <dd className="mt-3 text-base leading-7 text-gray-700">{item.a}</dd>
                </div>
              ))}
            </dl>
            {guidePosts.length > 0 && (
              <nav aria-label="Bài viết liên quan" className="mt-10">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-600">Đọc thêm trong cẩm nang</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {guidePosts.map((post) => (
                    <li key={post.slug}><Link href={`/blog/${post.slug}`} className="flex min-h-12 items-center rounded-2xl border border-gray-200 bg-white px-5 py-3 font-bold text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]">{post.title} →</Link></li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </section>
      )}

      <section className="related-products section-pad">
        <div className="shell">
          <header><span className="section-index">RELATED MATERIALS</span><h2>Xem thêm lựa chọn.</h2></header>
          <div>
            {related.map((item) => <Link href={`/san-pham/${item.slug}`} key={item.slug}><small>{item.eyebrow}</small><strong>{item.name}</strong><span>{item.benefit}</span><ArrowUpRightIcon /></Link>)}
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
