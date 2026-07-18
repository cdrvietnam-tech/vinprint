/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpRightIcon, MessageIcon } from "../../components/icons";
import { productBySlug, products } from "../../lib/products";

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
    title: product.name,
    description: `${product.description} ${product.benefit} Xem ứng dụng, mức giá tham khảo và gửi hồ sơ đặt in cho VinPrint.`,
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

  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
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
            url: product.source,
            seller: { "@type": "Organization", name: "VinPrint" },
          },
        }
      : {}),
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
        item: "https://vinprint.vn/#products",
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
    <main className="product-page" id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="product-page__header">
        <div className="shell">
          <Link className="brand" href="/" aria-label="VinPrint - trang chủ">
            <span className="brand__mark">V</span>
            <span><b>VINPRINT</b><small>STICKER LAB</small></span>
          </Link>
          <nav aria-label="Điều hướng trang sản phẩm">
            <Link href="/#products">Tất cả sản phẩm</Link>
            <Link href="/#pricing">Bảng giá tham khảo</Link>
            <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer">Gửi yêu cầu <ArrowUpRightIcon /></a>
          </nav>
        </div>
      </header>

      <section className={`product-hero product-hero--${product.tone}`}>
        <div className="shell product-hero__grid">
          <div className="product-hero__copy">
            <Link href="/#products" className="product-breadcrumb"><ArrowLeftIcon /> SẢN PHẨM / {product.eyebrow}</Link>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="product-hero__benefit"><span>Ưu điểm chính</span><strong>{product.benefit}</strong></div>
            <div className="product-hero__actions">
              <Link href="/#pricing">Xem giá tham khảo <ArrowDownIcon /></Link>
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer"><MessageIcon /> Hỏi giá qua Zalo <ArrowUpRightIcon /></a>
            </div>
            <small>Giá tham khảo: <b>{product.priceLabel}</b>. Xưởng xác nhận sau khi xem file, số lượng và quy cách.</small>
          </div>
          <div className="product-hero__image">
            <object data={product.image} type="image/jpeg" aria-label={`Ảnh ${product.name} từ gian hàng VinPrint`}>
              <img src="/images/materials-flatlay.webp" alt={`Minh họa ${product.name}`} />
            </object>
            <span>ẢNH SẢN PHẨM CÔNG KHAI</span>
            <a href={product.source} target="_blank" rel="noreferrer">Xem nguồn <ArrowUpRightIcon /></a>
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

      <section className="related-products section-pad">
        <div className="shell">
          <header><span className="section-index">RELATED MATERIALS</span><h2>Xem thêm lựa chọn.</h2></header>
          <div>
            {related.map((item) => <Link href={`/san-pham/${item.slug}`} key={item.slug}><small>{item.eyebrow}</small><strong>{item.name}</strong><span>{item.benefit}</span><ArrowUpRightIcon /></Link>)}
          </div>
        </div>
      </section>

      <footer className="product-page__footer">
        <div className="shell"><span>VINPRINT · 254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM</span><span>09:00–17:30 · Thứ 2–Thứ 7 · Chủ nhật nghỉ</span></div>
      </footer>
    </main>
  );
}
