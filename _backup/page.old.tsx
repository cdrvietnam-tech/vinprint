/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CloseIcon,
  MessageIcon,
  SparkIcon,
  StarIcon,
} from "./components/icons";
import { products, productBySlug, productSources, SHOPEE_SHOP_URL } from "./lib/products";
import { trackEvent } from "./lib/analytics";
import Reveal from "./components/reveal";
import Counter from "./components/counter";
import BeforeAfter from "./components/before-after";
import PriceCalculator from "./components/price-calculator";
import Gallery from "./components/gallery";
import AiFlow from "./components/ai-flow";
import PriceBar from "./components/price-bar";
import TemTypes from "./components/tem-types";

const ZALO_URL = "https://zalo.me/0844998499";

const shopByNeed = [
  {
    number: "01",
    eyebrow: "CHAI LỌ · MỸ PHẨM · ĐỒ UỐNG",
    title: "Cần tem chịu nước?",
    answer: "Chọn tem nhựa",
    note: "Bền ẩm, dễ vệ sinh, phù hợp tủ lạnh và bề mặt thường xuyên tiếp xúc nước.",
    slug: "tem-nhua-chong-nuoc",
  },
  {
    number: "02",
    eyebrow: "HỘP · TÚI KRAFT · SẢN PHẨM KHÔ",
    title: "Cần tối ưu chi phí?",
    answer: "Chọn tem giấy",
    note: "Mức giá dễ bắt đầu, màu in đẹp và linh hoạt cho đơn số lượng ít.",
    slug: "tem-giay",
  },
  {
    number: "03",
    eyebrow: "LY · BÌNH · KÍNH · KIM LOẠI",
    title: "Cần logo nổi không nền?",
    answer: "Chọn UV DTF",
    note: "Bề mặt nổi 3D, thành phẩm gọn và nhìn như in trực tiếp lên sản phẩm.",
    slug: "tem-uv-dtf",
  },
  {
    number: "04",
    eyebrow: "QUÀ TẶNG · NIÊM PHONG · MÁY MÓC",
    title: "Cần hiệu ứng cao cấp?",
    answer: "Chọn tem đặc biệt",
    note: "Bạc, vàng và hologram 7 màu tạo hiệu ứng bắt sáng và nhận diện nổi bật.",
    slug: "tem-bac",
  },
];

const materials = [
  {
    id: "paper",
    number: "01",
    name: "Tem giấy",
    headline: "Rẻ và dễ bắt đầu",
    benefit: "Màu in đẹp, chi phí thấp, phù hợp sản phẩm khô và bao bì dùng trong nhà.",
    uses: "Hộp bánh · Túi kraft · Tem cảm ơn · Tem phụ",
    tone: "lime",
  },
  {
    id: "plastic",
    number: "02",
    name: "Tem nhựa",
    headline: "Chống nước tốt",
    benefit: "Chịu ẩm, bền màu và dễ vệ sinh hơn tem giấy.",
    uses: "Chai lọ · Mỹ phẩm · Đồ uống · Đông lạnh · Ngoài trời",
    tone: "coral",
  },
  {
    id: "metallic",
    number: "03",
    name: "Bạc · Vàng · 7 màu",
    headline: "Bắt sáng cao cấp",
    benefit: "Bề mặt ánh kim hoặc đổi màu tạo điểm nhấn rõ ràng cho thương hiệu.",
    uses: "Máy móc · Mỹ phẩm · Quà tặng · Tem niêm phong",
    tone: "holo",
  },
  {
    id: "uv",
    number: "04",
    name: "Tem UV DTF",
    headline: "Nổi và không nền",
    benefit: "Logo nổi 3D, không có viền nền thừa, nhìn như in trực tiếp lên sản phẩm.",
    uses: "Gốm · Kính · Kim loại · Nhựa cứng · Hộp giấy",
    tone: "violet",
  },
];

const cases = [
  {
    tag: "UV DTF",
    title: "Logo nổi trên bình và ly",
    description: "Hiệu ứng không nền giúp logo gọn, nổi rõ trên bề mặt cong và vật liệu cứng.",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5membc1",
    source: productSources.uv,
    metric: "4K+ đã bán",
  },
  {
    tag: "TEM NHÃN",
    title: "Nhãn chai lọ theo nhận diện",
    description: "Từ logo và nội dung thô đến nhãn có hệ màu, phân cấp chữ và tỷ lệ rõ ràng.",
    image: "https://down-vn.img.susercontent.com/file/407127d75601b611b790bfcf05663f79",
    source: productSources.label,
    metric: "90K+ đã bán",
  },
  {
    tag: "SỐ LƯỢNG ÍT",
    title: "Thử mẫu trước khi in nhiều",
    description: "Dễ kiểm tra màu, tỷ lệ và cách dán trước khi tăng số lượng sản xuất.",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly3shefsnetf63",
    source: productSources.label,
    metric: "Nhận từ 2 tờ A4",
  },
  {
    tag: "CHI TIẾT NHỎ",
    title: "Chữ và logo vẫn rõ",
    description: "Phù hợp logo, ký hiệu và chữ ngắn cần tạo điểm nhấn sắc nét trên bao bì.",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5mf1tad",
    source: productSources.uv,
    metric: "4.9/5",
  },
  {
    tag: "TEM GIẤY",
    title: "Bao bì đẹp với chi phí gọn",
    description: "Màu sắc rõ, bố cục linh hoạt cho hộp, túi và sản phẩm tiêu dùng nhanh.",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lklsrilsqsq267",
    source: productSources.label,
    metric: "Từ 10.000đ",
  },
  {
    tag: "KHO MẪU",
    title: "Dễ đối chiếu trước khi chọn",
    description: "Xem hình thành phẩm và ứng dụng công khai để chọn đúng loại tem trước khi gửi yêu cầu.",
    image: "https://down-vn.img.susercontent.com/file/642690f2753959deb5b48093e7b43680",
    source: SHOPEE_SHOP_URL,
    metric: "238 sản phẩm",
  },
];

const reviews = [
  {
    user: "hithaa",
    product: "Tem nhãn giấy",
    quote: "Cực kì nhanh chóng và chỉnh chu, shop in nhanh và rep tin cũng nhanh lắm luôn. Đóng gói cẩn thận, in rõ nét, giá hạt dẻ.",
    date: "14.04.2024",
    proof: "/images/reviews/064c6d82-4d23-499d-9e47-3f2f7950debf.png",
    source: productSources.label,
  },
  {
    user: "diikuon",
    product: "Tem UV DTF",
    quote: "Tem in rất nét, đẹp và có vẻ bền theo thời gian. Hiệu ứng nổi 3D tạo cảm giác hiện đại, điểm nhấn.",
    date: "20.05.2026",
    proof: "/images/reviews/da4ccfbd-d01c-4d63-8318-3b646ddf24ed.png",
    source: productSources.uv,
  },
  {
    user: "nttruong86",
    product: "Tem UV DTF",
    quote: "In sắc nét kể cả những hình rất nhỏ, hình nổi khi dán lên nhìn rất đẹp. Tư vấn nhiệt tình, giao hàng nhanh.",
    date: "11.03.2026",
    proof: "/images/reviews/da4ccfbd-d01c-4d63-8318-3b646ddf24ed.png",
    source: productSources.uv,
  },
  {
    user: "t*****3",
    product: "Tem UV DTF",
    quote: "Tem in đẹp, màu sắc rõ nét, chữ sắc sảo và bám dính tốt. Kích thước đúng mô tả, dán lên sản phẩm nhìn chuyên nghiệp.",
    date: "09.06.2026",
    proof: "/images/reviews/00e16dbd-7847-4b12-b875-3932f1273d92.png",
    source: productSources.uv,
  },
  {
    user: "nhungdo523",
    product: "Tem nhãn",
    quote: "Chất lượng đảm bảo, màu sắc chuẩn và rõ nét nếu đúng hướng dẫn. Sản phẩm được in rõ nét, độ phân giải đúng chất lượng bản in.",
    date: "04.06.2026",
    proof: "/images/reviews/c94586dc-ac29-4edc-b6ce-aebdeacf0f47.png",
    source: productSources.label,
  },
  {
    user: "dohoangquynhan",
    product: "Tem giấy",
    quote: "Sản phẩm đúng mô tả, chất lượng tốt. Shop đóng gói và gửi hàng khá nhanh, in sắc nét, hỗ trợ nhiệt tình trong khi đặt hàng.",
    date: "08.09.2025",
    proof: "/images/reviews/ba764839-91f3-4c20-b43c-f6b4bb4139bd.png",
    source: productSources.label,
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "VinPrint - Xưởng in nhanh TP.HCM",
  url: "https://vinprint.vn",
  telephone: "+84844998499",
  image: "https://vinprint.vn/images/hero-collage.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: "254/5/40 Lê Văn Thọ",
    addressLocality: "Phường Thông Tây Hội",
    addressRegion: "TP.HCM",
    addressCountry: "VN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:30",
    },
  ],
  sameAs: [SHOPEE_SHOP_URL, "https://vinprint.vn"],
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dịch vụ in tem nhãn VinPrint",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image.startsWith("http") ? product.image : `https://vinprint.vn${product.image}`,
      url: `https://vinprint.vn/san-pham/${product.slug}`,
      ...(product.price
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "VND",
              price: product.price,
              availability: "https://schema.org/InStock",
              url: product.source,
            },
          }
        : {}),
    },
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { q: "Đặt in cần gửi những gì?", a: "Chỉ cần file thiết kế, số lượng và chất liệu đã chọn. Nhân viên xem file, báo giá; anh/chị đặt cọc, gửi thông tin nhận hàng và chờ tem về." },
    { q: "Giá trên website có phải giá cuối không?", a: "Không. Đây là giá tham khảo. Giá cuối phụ thuộc kích thước, số lượng, chất liệu và gia công; nhân viên xác nhận qua Zalo sau khi xem file." },
    { q: "Điểm khác nhau chính giữa các loại tem?", a: "Tem giấy có lợi thế về giá; tem nhựa chống nước; tem bạc, vàng, 7 màu tạo hiệu ứng bắt sáng; UV DTF có độ nổi và không có nền thừa." },
    { q: "VinPrint có nhận in số lượng ít không?", a: "Có. Một số nhóm tem nhận từ 2 tờ A4, phù hợp shop mới cần thử mẫu trước khi tăng số lượng." },
    { q: "VinPrint làm việc giờ nào?", a: "09:00–17:30 từ Thứ 2 đến Thứ 7. Chủ nhật nghỉ. Tin nhắn ngoài giờ sẽ được xử lý vào ca làm việc tiếp theo." },
  ].map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/materials-flatlay.webp";
      }}
    />
  );
}

function Stars({ label = "5 trên 5 sao" }: { label?: string }) {
  return (
    <span className="stars" aria-label={label}>
      {[0, 1, 2, 3, 4].map((star) => <StarIcon key={star} />)}
    </span>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [proofImage, setProofImage] = useState("");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const proofCloseRef = useRef<HTMLButtonElement>(null);

  const visibleProducts = useMemo(
    () => (showAllProducts ? products : products.slice(0, 8)),
    [showAllProducts],
  );

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProofImage("");
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!proofImage) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    window.requestAnimationFrame(() => proofCloseRef.current?.focus());
    return () => previousFocus?.focus();
  }, [proofImage]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <main className="sales-home" id="main-content" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="announcement">
        <div className="shell announcement__inner">
          <span><b aria-hidden="true">●</b> Xưởng đang nhận yêu cầu</span>
          <span>Thứ 2–Thứ 7 · 09:00–17:30</span>
          <a href="tel:0844998499" onClick={() => trackEvent("phone_clicked", { location: "topbar" })}>Zalo/Hotline: 0844 998 499</a>
        </div>
      </div>

      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/" aria-label="VinPrint - trang chủ">
            <span className="brand__mark">V</span>
            <span><b>VINPRINT</b><small>STICKER LAB</small></span>
          </Link>

          <nav className={mobileOpen ? "nav nav--open" : "nav"} aria-label="Điều hướng chính">
            <a href="#solutions" onClick={closeMenu}>Chọn loại tem</a>
            <a href="#pricing" onClick={closeMenu}>Bảng giá</a>
            <a href="#calculator" onClick={closeMenu}>Tính giá</a>
            <a href="#products" onClick={closeMenu}>Sản phẩm</a>
            <a href="#reviews" onClick={closeMenu}>Đánh giá</a>
            <a href="#process" onClick={closeMenu}>Quy trình</a>
          </nav>

          <div className="nav-actions">
            <a className="nav-zalo" href={ZALO_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("zalo_clicked", { location: "header" })}>
              Chốt đơn Zalo <ArrowUpRightIcon />
            </a>
            <button className="menu-button" type="button" aria-expanded={mobileOpen} aria-label={mobileOpen ? "Đóng menu" : "Mở menu"} onClick={() => setMobileOpen((current) => !current)}><span /><span /></button>
          </div>
        </div>
      </header>

      <section className="hero sales-hero" id="top">
        <div className="hero-grid hero-grid--one" aria-hidden="true" />
        <div className="hero-grid hero-grid--two" aria-hidden="true" />
        <div className="shell hero__layout">
          <div className="hero__copy">
            <div className="hero__index"><span>XƯỞNG IN TEM NHÃN TẠI TP.HCM</span><b>NHẬN SỐ LƯỢNG ÍT</b></div>
            <h1>Tem đẹp đúng chất.<br /><em>Gửi file là chốt.</em></h1>
            <p className="hero__lead">Chọn loại tem, gửi <strong>file + số lượng + chất liệu</strong>. VinPrint kiểm tra và trả giá thẳng qua Zalo — gọn từ lần đầu.</p>

            <div className="hero__actions">
              <a className="button-primary" href={ZALO_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("zalo_clicked", { location: "hero" })}>
                <MessageIcon /> Nhắn Zalo nhận giá <ArrowUpRightIcon />
              </a>
              <a href="#ai-design" className="button-secondary">✨ Thiết kế tem bằng AI ngay <ArrowDownIcon /></a>
            </div>

            <div className="hero__promise sales-proof-pills">
              <span><CheckIcon /><b>4.9/5</b> trên Shopee</span>
              <span><CheckIcon /><b>90K+</b> đã bán</span>
              <span><CheckIcon /><b>Ảnh thật</b> có nguồn</span>
            </div>
          </div>

          <div className="hero__visual sales-hero__visual">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero__visual-frame">
              <Image src="/images/hero-collage.webp" alt="Bộ sưu tập tem nhãn và ứng dụng sản phẩm VinPrint" width={1448} height={1086} priority unoptimized />
              <span className="hero-tag hero-tag--one">TEM GIẤY GIÁ TỐT</span>
              <span className="hero-tag hero-tag--two">UV DTF KHÔNG NỀN</span>
              <span className="hero-tag hero-tag--three">NHỰA CHỐNG NƯỚC</span>
              <span className="hero-sticker hero-sticker--1" aria-hidden="true">4.9★</span>
              <span className="hero-sticker hero-sticker--2" aria-hidden="true">GỬI FILE LÀ CHỐT</span>
              <span className="hero-sticker hero-sticker--3" aria-hidden="true">SL ÍT</span>
            </div>

            <div className="sales-order-ticket">
              <div className="sales-order-ticket__head"><span>ĐẶT IN TRONG 1 PHÚT</span><b>01—04</b></div>
              <h2>Gửi đủ 3 thông tin.</h2>
              <ul>
                <li><CheckIcon /><span><b>File thiết kế</b><small>PDF, AI, PSD, PNG/JPG rõ nét</small></span></li>
                <li><CheckIcon /><span><b>Số lượng cần in</b><small>Số tem hoặc số tờ dự kiến</small></span></li>
                <li><CheckIcon /><span><b>Chất liệu đã chọn</b><small>Giấy, nhựa, UV DTF hoặc đặc biệt</small></span></li>
              </ul>
              <a href={ZALO_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("zalo_clicked", { location: "hero_ticket" })}>
                <MessageIcon /> Gửi Zalo 0844 998 499 <ArrowUpRightIcon />
              </a>
            </div>

            <div className="hero-proof-card sales-rating-card">
              <div><small>ĐÁNH GIÁ CÔNG KHAI</small><strong>4.9 <Stars /></strong></div>
              <p><b>90K+</b> đã bán ở listing tem nhãn nổi bật</p>
              <a href={SHOPEE_SHOP_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("shopee_source_clicked", { location: "hero" })}>Kiểm chứng trên Shopee <ArrowUpRightIcon /></a>
            </div>
          </div>
        </div>

        <div className="shell hero-marquee" aria-label="Dịch vụ nổi bật">
          <span>Tem giấy giá tốt</span><i aria-hidden="true">•</i><span>Tem nhựa chống nước</span><i aria-hidden="true">•</i><span>UV DTF nổi không nền</span><i aria-hidden="true">•</i><span>Bạc · Vàng · 7 màu</span>
        </div>
      </section>

      <section className="trust-dashboard" aria-label="Bằng chứng công khai từ Shopee">
        <div className="shell trust-dashboard__grid">
          <div className="trust-dashboard__intro"><span>SHOPEE PUBLIC PROOF</span><p>Số liệu công khai, có liên kết kiểm chứng và ngày cập nhật rõ ràng.</p></div>
          <div><strong>4.9<small>/5</small></strong><span>Điểm đánh giá shop</span></div>
          <div><strong>33,3K</strong><span>Người theo dõi</span></div>
          <div><strong><Counter value={90} grouping={false} suffix="K+" /></strong><span>Đã bán · listing nổi bật</span></div>
          <div><strong><Counter value={238} /></strong><span>Sản phẩm trên gian hàng</span></div>
          <a href={SHOPEE_SHOP_URL} target="_blank" rel="noreferrer">Xem nguồn <ArrowUpRightIcon /><small>Cập nhật 16.07.2026</small></a>
        </div>
      </section>

      <section className="before-after-section section-pad" id="before-after">
        <div className="shell">
          <Reveal className="v3-section__head">
            <span className="v3-section__eyebrow">MỘT CHIẾC TEM NHỎ</span>
            <h2 className="v3-section__title">Thay đổi cả sản phẩm.</h2>
            <p className="v3-section__lead">Cùng một sản phẩm, chỉ khác chiếc tem. Kéo thanh trượt để thấy khác biệt trước và sau.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      <section className="ai-design-section section-pad" id="ai-design">
        <div className="shell">
          <Reveal className="v3-section__head">
            <span className="v3-section__eyebrow">AI + DESIGNER</span>
            <h2 className="v3-section__title">Tem cũ hay tem AI? Khác biệt ở đẳng cấp.</h2>
            <p className="v3-section__lead">VinPrint dùng AI kết hợp Designer để tạo mẫu tem đẹp, chuyên nghiệp, đúng ngành hàng — từ khi bạn gửi file đến lúc tem lên sản phẩm thật.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <AiFlow />
          </Reveal>
        </div>
      </section>

      <section className="decision-section section-pad" id="solutions">
        <div className="shell">
          <header className="section-heading section-heading--split">
            <div><span className="section-index">01 / CHỌN THEO SẢN PHẨM</span><h2>Đang cần dán tem<br /><em>lên sản phẩm gì?</em></h2></div>
            <p>Không cần nhớ thuật ngữ ngành in. Chọn đúng tình huống sử dụng để xem loại tem, ưu điểm và mức giá phù hợp.</p>
          </header>

          <div className="decision-grid">
            {shopByNeed.map((item) => {
              const product = productBySlug[item.slug];
              return (
                <article className={`decision-card decision-card--${product.tone}`} key={item.slug}>
                  <Link className="decision-card__image" href={`/san-pham/${item.slug}`}>
                    <ProductImage src={product.image} alt={`Ảnh thật ${product.name} dùng cho ${item.eyebrow.toLowerCase()}`} />
                    <span>{item.number}</span>
                  </Link>
                  <div className="decision-card__body">
                    <small>{item.eyebrow}</small>
                    <h3>{item.title}</h3>
                    <strong>{item.answer}</strong>
                    <p>{item.note}</p>
                    <footer><b>{product.priceLabel}</b><Link href={`/san-pham/${item.slug}`} aria-label={`Xem chi tiết ${product.name}`}><ArrowUpRightIcon /></Link></footer>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="temtypes-section section-pad" id="tem-types">
        <div className="shell">
          <Reveal className="v3-section__head">
            <span className="v3-section__eyebrow">CÁC LOẠI TEM NHÃN PHỔ BIẾN</span>
            <h2 className="v3-section__title">Chọn đúng loại tem cho sản phẩm.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <TemTypes />
          </Reveal>
        </div>
      </section>

      <section className="pricing-section section-pad" id="pricing">
        <div className="shell">
          <header className="pricing-heading">
            <div><span className="section-index section-index--light">02 / GIÁ THAM KHẢO</span><h2>Biết khoảng giá.<br /><em>Chốt nhanh hơn.</em></h2></div>
            <div className="pricing-heading__note"><span>GIÁ CUỐI CÙNG</span><p>Nhân viên xác nhận sau khi xem file, kích thước, số lượng và gia công. Website không tự đoán báo giá.</p></div>
          </header>

          <Reveal>
            <PriceBar />
          </Reveal>

          <div className="price-action">
            <div><CheckIcon /><p><b>Đã có file?</b><span>Gửi file + số lượng + chất liệu để nhân viên xem và trả giá.</span></p></div>
            <div><a href="#process"><CheckIcon /> Xem quy trình</a><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /> Hỏi giá qua Zalo</a></div>
          </div>
        </div>
      </section>

      <section className="calculator-section section-pad" id="calculator">
        <div className="shell">
          <Reveal className="v3-section__head">
            <span className="v3-section__eyebrow">CÔNG CỤ TÍNH GIÁ</span>
            <h2 className="v3-section__title">Ước tính chi phí trong 10 giây.</h2>
            <p className="v3-section__lead">Chọn chất liệu, kích thước và số lượng để xem giá tham khảo tức thì, rồi chốt chính xác qua Zalo.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <PriceCalculator />
          </Reveal>
        </div>
      </section>

      <section className="products-section section-pad" id="products">
        <div className="shell">
          <header className="section-heading section-heading--split">
            <div><span className="section-index">03 / SẢN PHẨM THẬT</span><h2>Mỗi loại tem.<br /><em>Một lợi thế rõ ràng.</em></h2></div>
            <p>Ảnh đại diện lấy từ sản phẩm công khai của VinPrint và Shopee. Nhấn vào từng loại để xem ứng dụng, ưu điểm và nguồn đối chiếu.</p>
          </header>

          <div className="product-wall">
            {visibleProducts.map((product, index) => (
              <article className={`product-tile product-tile--${product.tone}`} key={product.slug}>
                <Link className="product-tile__image" href={`/san-pham/${product.slug}`} onClick={() => trackEvent("product_viewed", { slug: product.slug })}>
                  <ProductImage src={product.image} alt={`Ảnh thật ${product.name} VinPrint`} />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{product.eyebrow}</small>
                </Link>
                <div className="product-tile__body">
                  <h3><Link href={`/san-pham/${product.slug}`}>{product.name}</Link></h3>
                  <p>{product.benefit}</p>
                  <footer><strong>{product.priceLabel}</strong><Link href={`/san-pham/${product.slug}`} aria-label={`Xem ${product.name}`}><ArrowUpRightIcon /></Link></footer>
                </div>
              </article>
            ))}
          </div>
          {!showAllProducts && <button className="product-more" type="button" onClick={() => { setShowAllProducts(true); trackEvent("catalog_expanded"); }}>Xem đủ 10 nhóm sản phẩm <span aria-hidden="true">＋</span></button>}
        </div>
      </section>

      <section className="order-process section-pad" id="process">
        <div className="shell">
          <header className="process-heading"><span>04 / 4 BƯỚC. KHÔNG VÒNG VO.</span><h2>Từ file đến<br /><em>tem trên tay.</em></h2><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /> Nhắn Zalo ngay <ArrowUpRightIcon /></a></header>
          <div className="process-line">
            <article><span>01</span><b>Gửi file</b><p>File thiết kế + số lượng + chất liệu đã chọn.</p></article>
            <article><span>02</span><b>Nhận báo giá</b><p>Nhân viên xem file và trả giá trực tiếp qua Zalo.</p></article>
            <article><span>03</span><b>Đặt cọc</b><p>Xác nhận đơn và gửi đầy đủ thông tin nhận hàng.</p></article>
            <article><span>04</span><b>Chờ tem về</b><p>Xưởng sản xuất, đóng gói và giao theo thỏa thuận.</p></article>
          </div>
          <div className="process-note"><MessageIcon /><p><b>Cần giá ngay?</b><span>Nhắn Zalo 0844998499 trong giờ làm việc. Không cần điền form dài.</span></p><a href={ZALO_URL} target="_blank" rel="noreferrer">Mở Zalo <ArrowUpRightIcon /></a></div>
        </div>
      </section>

      <section className="case-section section-pad" id="proof">
        <div className="shell">
          <header className="section-heading section-heading--split section-heading--case">
            <div><span className="section-index">05 / ỨNG DỤNG THẬT</span><h2>Không chỉ đẹp trên màn hình.<br /><em>Dán lên sản phẩm mới tính.</em></h2></div>
            <p>Hình và số liệu dẫn từ gian hàng công khai. Mỗi thẻ đều có liên kết để khách hàng tự kiểm chứng.</p>
          </header>
          <div className="case-grid">
            {cases.map((item, index) => (
              <article className={index === 0 || index === 5 ? "case-card case-card--wide" : "case-card"} key={item.title}>
                <div className="case-card__image"><ProductImage src={item.image} alt={item.title} /><span>{item.tag}</span><b>{item.metric}</b></div>
                <div className="case-card__body"><small>CASE {String(index + 1).padStart(2, "0")}</small><h3>{item.title}</h3><p>{item.description}</p><a href={item.source} target="_blank" rel="noreferrer" onClick={() => trackEvent("case_source_clicked", { case: index + 1 })}>Kiểm chứng nguồn <ArrowUpRightIcon /></a></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gallery-section section-pad" id="gallery">
        <div className="shell">
          <Reveal className="v3-section__head">
            <span className="v3-section__eyebrow">THÀNH PHẨM THỰC TẾ</span>
            <h2 className="v3-section__title">Khách hàng nói gì qua sản phẩm.</h2>
            <p className="v3-section__lead">Lọc theo ngành hàng để xem tem đã lên sản phẩm thật. Bấm “Xem thêm” để tải tiếp.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Gallery />
          </Reveal>
        </div>
      </section>

      <section className="reviews-section section-pad" id="reviews">
        <div className="shell">
          <div className="reviews-top">
            <div><span className="section-index section-index--light">06 / ĐÁNH GIÁ CÓ NGUỒN</span><h2>Khách nói thật.<br /><em>Ảnh gốc vẫn còn.</em></h2></div>
            <a href={SHOPEE_SHOP_URL} target="_blank" rel="noreferrer"><strong>4.9</strong><span><Stars /><small>Xem gian hàng Shopee <ArrowUpRightIcon /></small></span></a>
          </div>
          <div className="reviews-grid">
            {reviews.map((review, index) => (
              <blockquote key={`${review.user}-${review.date}`} className={index === 1 ? "review-card review-card--accent" : "review-card"}>
                <div className="review-card__stars"><Stars /><small>ĐÃ ĐỐI CHIẾU</small></div>
                <p>“{review.quote}”</p>
                <footer><span>{review.user.slice(0, 2).toUpperCase()}</span><div><b>{review.user}</b><small>{review.product} · {review.date}</small></div></footer>
                <div className="review-card__links"><button type="button" onClick={() => { setProofImage(review.proof); trackEvent("review_proof_opened", { index: index + 1 }); }}>Xem ảnh đánh giá gốc</button><a href={review.source} target="_blank" rel="noreferrer">Nguồn Shopee <ArrowUpRightIcon /></a></div>
              </blockquote>
            ))}
          </div>
          <div className="review-conversion"><p><b>Đủ bằng chứng rồi?</b><span>Nhắn Zalo để VinPrint xem yêu cầu và chốt đơn của anh/chị.</span></p><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /> Chốt đơn qua Zalo <ArrowUpRightIcon /></a></div>
        </div>
      </section>

      <section className="materials-section section-pad" id="materials">
        <div className="shell materials-layout">
          <div className="materials-intro">
            <span className="section-index section-index--light">07 / KHÁC BIỆT CHẤT LIỆU</span>
            <h2>Chọn theo<br />lợi thế cần dùng.</h2>
            <p>Giấy để tiết kiệm. Nhựa để chống nước. Bạc, vàng, 7 màu để tạo hiệu ứng. UV DTF để có độ nổi và không nền.</p>
            <div className="materials-photo"><Image src="/images/materials-flatlay.webp" alt="Các mẫu tem giấy, tem nhựa, tem ánh kim và UV DTF" width={1536} height={1024} unoptimized /><span>Ảnh vật liệu VinPrint</span></div>
          </div>
          <div className="materials-list">
            {materials.map((material, index) => (
              <button type="button" key={material.id} className={activeMaterial === index ? `material-row material-row--active material-row--${material.tone}` : `material-row material-row--${material.tone}`} aria-expanded={activeMaterial === index} onClick={() => { setActiveMaterial(index); trackEvent("material_explored", { material: material.id }); }}>
                <span>{material.number}</span><div><small>{material.name}</small><h3>{material.headline}</h3><p>{material.benefit}</p><b>{material.uses}</b></div><i aria-hidden="true">{activeMaterial === index ? "−" : "+"}</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section section-pad" id="faq">
        <div className="shell faq-layout">
          <div className="faq-title"><span>NEED TO KNOW</span><h2>Trước khi<br />chốt đơn.</h2><p>Không thấy câu trả lời? Nhân viên phản hồi trong khung giờ làm việc.</p><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /> Hỏi qua Zalo <ArrowUpRightIcon /></a></div>
          <div className="faq-list">
            <details open><summary>Đặt in cần gửi những gì?<span>＋</span></summary><p>Chỉ cần file thiết kế, số lượng và chất liệu đã chọn. Nhân viên xem file, báo giá; anh/chị đặt cọc, gửi thông tin nhận hàng và chờ tem về.</p></details>
            <details><summary>Giá trên website có phải giá cuối không?<span>＋</span></summary><p>Không. Đây là giá tham khảo. Giá cuối phụ thuộc kích thước, số lượng, chất liệu và gia công; nhân viên xác nhận qua Zalo sau khi xem file.</p></details>
            <details><summary>Điểm khác nhau chính giữa các loại tem?<span>＋</span></summary><p>Tem giấy có lợi thế về giá; tem nhựa chống nước; tem bạc, vàng, 7 màu tạo hiệu ứng bắt sáng; UV DTF có độ nổi và không có nền thừa.</p></details>
            <details><summary>VinPrint có nhận in số lượng ít không?<span>＋</span></summary><p>Có. Một số nhóm tem nhận từ 2 tờ A4, phù hợp shop mới cần thử mẫu trước khi tăng số lượng.</p></details>
            <details><summary>VinPrint làm việc giờ nào?<span>＋</span></summary><p>09:00–17:30 từ Thứ 2 đến Thứ 7. Chủ nhật nghỉ. Tin nhắn ngoài giờ sẽ được xử lý vào ca làm việc tiếp theo.</p></details>
          </div>
        </div>
      </section>

      <section className="final-cta sales-final-cta">
        <div className="shell final-cta__inner">
          <div><span>FILE + SỐ LƯỢNG + CHẤT LIỆU</span><h2>Sẵn file rồi?<br />Gửi một lần, <em>chốt cho gọn.</em></h2></div>
          <div><p>Không cần làm báo giá phức tạp. Nhân viên xem yêu cầu và phản hồi trực tiếp qua Zalo trong giờ làm việc.</p><div className="final-cta__actions"><a href="#pricing"><ArrowDownIcon /> Xem bảng giá</a><a href={ZALO_URL} target="_blank" rel="noreferrer"><MessageIcon /> Chốt đơn Zalo <ArrowUpRightIcon /></a></div></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand"><Link className="brand brand--footer" href="/"><span className="brand__mark">V</span><span><b>VINPRINT</b><small>STICKER LAB</small></span></Link><p>In nhanh, yêu cầu rõ và đồng hành cùng thương hiệu Việt từ chiếc tem đầu tiên.</p></div>
          <div><b>Sản phẩm</b><Link href="/san-pham/tem-giay">Tem giấy</Link><Link href="/san-pham/tem-nhua-chong-nuoc">Tem nhựa</Link><Link href="/san-pham/tem-uv-dtf">UV DTF</Link><Link href="/san-pham/tem-bac">Tem ánh kim</Link></div>
          <div><b>Đặt in</b><a href="#process">Quy trình 4 bước</a><a href="#pricing">Bảng giá tham khảo</a><a href="#reviews">Đánh giá Shopee</a><a href={SHOPEE_SHOP_URL} target="_blank" rel="noreferrer">Gian hàng Shopee</a></div>
          <div><b>Liên hệ xưởng</b><a href="tel:0844998499">0844 998 499</a><span>254/5/40 Lê Văn Thọ<br />Phường Thông Tây Hội, TP.HCM</span><small>09:00–17:30 · Thứ 2–Thứ 7<br />Chủ nhật nghỉ</small></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 VinPrint · In ấn siêu tốc.</span><span>Giá và concept cần được xưởng kiểm tra trước khi sản xuất.</span></div>
      </footer>

      <aside className="sales-fab" aria-label="Liên hệ nhanh qua Zalo">
        <span><MessageIcon /></span>
        <div><small>NHÂN VIÊN VINPRINT</small><b>Chốt đơn qua Zalo</b><em>09:00–17:30 · T2–T7</em></div>
        <a href={ZALO_URL} target="_blank" rel="noreferrer" aria-label="Mở Zalo 0844998499" onClick={() => trackEvent("zalo_clicked", { location: "floating" })}><ArrowUpRightIcon /></a>
      </aside>

      <div className="mobile-cta mobile-cta--v3">
        <a className="mcta mcta--zalo" href={ZALO_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("zalo_clicked", { location: "mobilebar" })}><MessageIcon /> Zalo</a>
        <a className="mcta mcta--ai" href="#ai-design" onClick={() => trackEvent("ai_design_clicked", { location: "mobilebar" })}><SparkIcon /> AI Design</a>
        <a className="mcta mcta--call" href="tel:0844998499" onClick={() => trackEvent("phone_clicked", { location: "mobilebar" })}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg> Gọi</a>
      </div>

      {proofImage && (
        <div className="proof-modal" role="presentation" onMouseDown={() => setProofImage("")}>
          <div role="dialog" aria-modal="true" aria-label="Ảnh đánh giá gốc từ Shopee" aria-describedby="proof-modal-note" onMouseDown={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Tab") { event.preventDefault(); proofCloseRef.current?.focus(); } }}>
            <button ref={proofCloseRef} type="button" onClick={() => setProofImage("")} aria-label="Đóng ảnh đánh giá"><CloseIcon /></button>
            <img src={proofImage} alt="Ảnh chụp đánh giá công khai trên Shopee" />
            <p id="proof-modal-note">Ảnh đánh giá gốc do khách hàng cung cấp từ gian hàng Shopee.</p>
          </div>
        </div>
      )}
    </main>
  );
}
