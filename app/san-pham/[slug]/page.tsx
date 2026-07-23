import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock3,
  FileCheck2,
  MessageCircle,
  PackageCheck,
  Ruler,
  Sparkles,
} from "lucide-react";
import ConversionLink from "../../components/ConversionLink";
import Header from "../../components/home/Header";
import Footer from "../../components/home/Footer";
import MobileActionBar from "../../components/home/MobileActionBar";
import ScrollToTop from "../../components/home/ScrollToTop";
import QuoteRequestForm from "../../components/quote/QuoteRequestForm";
import { products } from "../../lib/products";
import { getProductFaqs } from "../../lib/product-faqs";
import { getManagedProduct, getManagedProducts } from "../../lib/content-overrides.server";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getManagedProduct(slug);
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
  const product = await getManagedProduct(slug);
  if (!product) notFound();

  const related = (await getManagedProducts()).filter((item) => item.slug !== product.slug).slice(0, 3);
  const productFaqs = getProductFaqs(product);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http") ? product.image : `https://vinprint.vn${product.image}`,
    brand: { "@type": "Brand", name: "VinPrint" },
    category: "Tem nhãn in theo yêu cầu",
    url: `https://vinprint.vn/san-pham/${product.slug}`,
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
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="product-page pt-20" id="main-content" tabIndex={-1}>
        <section
          className={`product-showcase product-showcase--${product.tone}`}
          data-product-showcase="premium"
        >
          <div className="shell">
            <nav className="product-breadcrumb" aria-label="Breadcrumb">
              <ArrowLeft aria-hidden="true" />
              <Link href="/">Trang chủ</Link>
              <span aria-hidden="true">›</span>
              <Link href="/san-pham">Sản phẩm</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">{product.name}</span>
            </nav>

            <div className="product-showcase__grid">
              <div className="product-showcase__visual">
                <div className="product-showcase__halo" aria-hidden="true" />
                <span className="product-showcase__badge">
                  <Sparkles aria-hidden="true" />
                  Mẫu in nổi bật
                </span>
                <div className="product-showcase__image">
                  <Image
                    src={product.image}
                    alt={`Mẫu ${product.name} của VinPrint`}
                    fill
                    priority
                    sizes="(max-width: 900px) 92vw, 46vw"
                    className="object-contain"
                  />
                </div>
                {product.source && (
                  <a className="product-showcase__source" href={product.source} target="_blank" rel="noreferrer">
                    Xem nguồn ảnh <ArrowUpRight aria-hidden="true" />
                  </a>
                )}
                <div className="product-showcase__float product-showcase__float--top">
                  <BadgeCheck aria-hidden="true" />
                  Màu in sắc nét
                </div>
                <div className="product-showcase__float product-showcase__float--bottom">
                  <Clock3 aria-hidden="true" />
                  Báo giá nhanh qua Zalo
                </div>
              </div>

              <div className="product-showcase__copy">
                <span className="product-showcase__eyebrow">{product.eyebrow}</span>
                <h1>{product.name}</h1>
                <p className="product-showcase__lead">{product.description}</p>

                <div className="product-showcase__benefit">
                  <span><Sparkles aria-hidden="true" /> Điểm đáng tiền</span>
                  <strong>{product.benefit}</strong>
                </div>

                <ul className="product-showcase__proof" aria-label="Cam kết dịch vụ">
                  <li><Check aria-hidden="true" /> Nhận số lượng ít</li>
                  <li><Check aria-hidden="true" /> Hỗ trợ chỉnh file</li>
                  <li><Check aria-hidden="true" /> Giao hàng toàn quốc</li>
                </ul>

                <div className="product-showcase__quote">
                  <div>
                    <span>Giá tham khảo</span>
                    <strong>{product.priceLabel}</strong>
                  </div>
                  <small>Giá chính xác theo kích thước, số lượng, chất liệu và gia công.</small>
                </div>

                <div className="product-showcase__actions">
                  <ConversionLink
                    href="https://zalo.me/0844998499"
                    target="_blank"
                    rel="noreferrer"
                    eventName="click_zalo"
                    eventPosition={`product_${product.slug}`}
                  >
                    <MessageCircle aria-hidden="true" />
                    Nhắn Zalo chốt in
                    <ArrowRight aria-hidden="true" />
                  </ConversionLink>
                  <Link href="/#bang-gia">
                    Xem combo ưu đãi
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="product-fit section-pad">
          <div className="shell">
            <div className="product-section-heading">
              <span>Phù hợp với</span>
              <h2>Một chất liệu.<br />Nhiều cách dùng.</h2>
              <p>Chọn đúng bề mặt ngay từ đầu giúp tem bám đẹp, màu in ổn định và thành phẩm trông chuyên nghiệp hơn.</p>
            </div>
            <div className="product-use-grid">
              {product.uses.map((use, index) => (
                <article key={use}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{use}</strong>
                    <small>Phù hợp để ứng dụng {product.name.toLocaleLowerCase("vi-VN")}</small>
                  </div>
                  <Check aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="product-brief">
          <div className="shell product-brief__inner">
            <div>
              <span>Gửi file là báo giá được</span>
              <h2>Chỉ cần 3 thông tin.</h2>
            </div>
            <div className="product-brief__items">
              <article>
                <FileCheck2 aria-hidden="true" />
                <strong>File thiết kế</strong>
                <small>AI, PDF, CDR hoặc ảnh mẫu rõ nét</small>
              </article>
              <article>
                <Ruler aria-hidden="true" />
                <strong>Kích thước</strong>
                <small>Ngang × cao hoặc đường kính tem</small>
              </article>
              <article>
                <PackageCheck aria-hidden="true" />
                <strong>Số lượng</strong>
                <small>Số tem hoặc số tờ dự kiến cần in</small>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf4] py-14 sm:py-20">
          <div className="shell grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Thông tin trước khi đặt in</span>
              <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">Câu hỏi về {product.name}</h2>
              <div className="mt-6 space-y-3">
                {productFaqs.map((faq) => (
                  <details key={faq.q} className="group rounded-[22px] border border-orange-100 bg-white p-5 shadow-sm">
                    <summary className="cursor-pointer list-none pr-7 text-sm font-black text-gray-950 marker:hidden">
                      {faq.q}
                    </summary>
                    <p className="mt-3 text-sm font-medium leading-7 text-gray-600">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <QuoteRequestForm productSlug={product.slug} productTitle={product.name} tone="light" />
          </div>
        </section>

        <section className="product-order">
          <div className="shell product-order__grid">
            <div>
              <span>QUY TRÌNH ĐẶT IN</span>
              <h2>Từ file đến<br />thành phẩm.</h2>
              <p>Mỗi bước đều có người kiểm tra trực tiếp trước khi chuyển sang công đoạn tiếp theo.</p>
            </div>
            <ol>
              <li><b>01</b><span><strong>Gửi yêu cầu</strong><small>File + kích thước + số lượng</small></span></li>
              <li><b>02</b><span><strong>Chốt quy cách</strong><small>Tư vấn chất liệu và báo giá</small></span></li>
              <li><b>03</b><span><strong>Xác nhận in</strong><small>Duyệt file và tiến hành sản xuất</small></span></li>
              <li><b>04</b><span><strong>Nhận thành phẩm</strong><small>Nhận tại xưởng hoặc giao tận nơi</small></span></li>
            </ol>
          </div>
        </section>

        <section className="related-products section-pad">
          <div className="shell">
            <header className="product-section-heading product-section-heading--related">
              <span>Có thể anh cũng cần</span>
              <h2>So sánh thêm<br />trước khi chốt.</h2>
            </header>
            <div>
              {related.map((item) => (
                <Link href={`/san-pham/${item.slug}`} key={item.slug}>
                  <span className="related-products__image">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="(max-width: 720px) 88vw, 30vw"
                      className="object-contain"
                    />
                  </span>
                  <small>{item.eyebrow}</small>
                  <strong>{item.name}</strong>
                  <span>{item.benefit}</span>
                  <b>Xem sản phẩm <ArrowRight aria-hidden="true" /></b>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer hasMobileActionBar />
      <MobileActionBar />
      <ScrollToTop />
    </>
  );
}
