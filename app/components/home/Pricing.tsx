"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Gift, Minus, Plus, Sparkles, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";

const pricingPosters = [
  {
    title: "Bảng giá tem nhãn tổng hợp",
    note: "Combo tem giấy và các ứng dụng phổ biến",
    src: "/images/pricing/bang-gia-tem-nhan-tong-hop.webp",
    alt: "Bảng giá tem nhãn VinPrint với combo 1.000 tem tròn từ 3 đến 6 cm",
    width: 1122,
    height: 1402,
    details: [
      "1.000 tem tròn 3 cm: 99.000đ",
      "1.000 tem tròn 4 cm: 141.000đ",
      "1.000 tem tròn 5 cm: 229.000đ",
      "1.000 tem tròn 6 cm: 320.000đ",
      "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
      "Poster quảng bá giá tận xưởng, rẻ hơn đến 30% so với thị trường.",
    ],
  },
  {
    title: "Bảng giá tem nhãn tham khảo",
    note: "Tem giấy, tem nhựa và nhiều kiểu cắt bế",
    src: "/images/pricing/bang-gia-tem-nhan-tham-khao.webp",
    alt: "Bảng giá tham khảo in tem nhãn VinPrint kèm mẫu ứng dụng trên bao bì",
    width: 1122,
    height: 1402,
    details: [
      "1.000 tem tròn 3 cm: 99.000đ",
      "1.000 tem tròn 4 cm: 141.000đ",
      "1.000 tem tròn 5 cm: 229.000đ",
      "1.000 tem tròn 6 cm: 320.000đ",
      "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
      "Giá có thể thay đổi tùy theo chất liệu và thiết kế.",
    ],
  },
  {
    title: "Bảng giá tem tròn",
    note: "Combo 1.000 tem theo đường kính",
    src: "/images/pricing/bang-gia-tem-tron.webp",
    alt: "Bảng giá in tem tròn VinPrint theo đường kính 3, 4, 5 và 6 cm",
    width: 1122,
    height: 1402,
    details: [
      "1.000 tem tròn 3 cm: 99.000đ",
      "1.000 tem tròn 4 cm: 141.000đ",
      "1.000 tem tròn 5 cm: 229.000đ",
      "1.000 tem tròn 6 cm: 320.000đ",
      "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
    ],
  },
  {
    title: "Bảng giá sticker UV DTF",
    note: "Khổ tờ và khổ mét cho nhu cầu lấy liền",
    src: "/images/pricing/bang-gia-sticker-uv-dtf.webp",
    alt: "Bảng giá in sticker UV DTF VinPrint theo khổ A5, A4, A3 và mét",
    width: 1024,
    height: 1536,
    details: [
      "Tờ A5: 25.000đ",
      "Tờ A4: 45.000đ",
      "Tờ A3: 80.000đ",
      "1 mét: 250.000đ/m",
      "3 mét: 200.000đ/m",
      "5 mét: 185.000đ/m",
      "Đơn giá chưa bao gồm VAT và phí vận chuyển.",
      "Hỗ trợ thiết kế miễn phí cho đơn từ 1 mét trở lên.",
    ],
  },
] as const;

const benefits = [
  "Tư vấn miễn phí",
  "Duyệt mẫu trước khi in",
  "Hỗ trợ thiết kế đơn từ 200.000đ",
  "Tối đa 3 lần chỉnh sửa",
  "Freeship đơn từ 500.000đ",
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const [selectedPoster, setSelectedPoster] = useState<(typeof pricingPosters)[number] | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent("view_pricing", { position: "pricing_section" });
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedPoster) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPoster(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      lastTriggerRef.current?.focus();
    };
  }, [selectedPoster]);

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <section id="bang-gia" ref={sectionRef} className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="relative overflow-hidden rounded-[32px] bg-[#24104f] p-6 text-white shadow-2xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple-700/40 to-transparent" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 mb-9 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-orange-200">
                <Gift className="h-4 w-4" /> Bảng giá tại xưởng
              </span>
              <h2 className="max-w-3xl text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">Bảng giá in tem nhãn</h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-purple-100 sm:text-base">
                Chọn bảng giá phù hợp và bấm vào ảnh để xem rõ từng chi tiết. Kích thước khác hoặc số lượng lớn, VinPrint báo giá theo đúng quy cách cần in.
              </p>
              <p className="mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-orange-100/90">
                Giá và ưu đãi được xác nhận lại theo vật liệu, quy cách, số lượng và thời điểm đặt in.
              </p>
            </div>
            <a
              href="#nhan-bao-gia"
              onClick={() => trackEvent("view_pricing", { position: "pricing_wholesale_quote" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold transition-colors hover:bg-white/20"
            >
              Nhận báo giá sỉ <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative z-10 grid items-start gap-6 md:grid-cols-2">
            {pricingPosters.map((poster, index) => (
              <motion.article
                key={poster.src}
                data-pricing-poster
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300/50"
              >
                <button
                  type="button"
                  aria-label={`Phóng to ${poster.title}`}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setZoom(1);
                    setSelectedPoster(poster);
                    trackEvent("view_pricing", { position: `pricing_poster_${index + 1}` });
                  }}
                  className="relative block w-full cursor-zoom-in overflow-hidden rounded-[22px] bg-[#fff7d6] text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"
                >
                  <Image
                    src={poster.src}
                    alt={poster.alt}
                    width={poster.width}
                    height={poster.height}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 767px) calc(100vw - 48px), 680px"
                    className="h-auto w-full transition duration-500 group-hover:scale-[1.015]"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-2 text-xs font-black text-white shadow-lg backdrop-blur-sm">
                    <ZoomIn className="h-4 w-4" /> Xem rõ
                  </span>
                </button>
                <div className="flex items-center justify-between gap-4 px-3 py-3 sm:px-4">
                  <div>
                    <h3 className="text-base font-black text-white sm:text-lg">{poster.title}</h3>
                    <p className="mt-0.5 text-xs font-medium text-purple-100 sm:text-sm">{poster.note}</p>
                  </div>
                  <ZoomIn className="h-5 w-5 shrink-0 text-orange-200" />
                </div>
                <div className="sr-only">
                  <h4>{poster.title} dạng chữ</h4>
                  <ul>
                    {poster.details.map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#F5A623]" />
                <span className="text-[13px] font-bold text-purple-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPoster && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Xem chi tiết ${selectedPoster.title}`}
          onKeyDown={trapDialogFocus}
          onClick={() => setSelectedPoster(null)}
          className="fixed inset-0 z-[100] overflow-auto bg-black/90 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="fixed left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white p-1.5 text-gray-950 shadow-xl"
          >
            <button
              type="button"
              aria-label="Thu nhỏ bảng giá"
              disabled={zoom <= 1}
              onClick={() => setZoom((current) => Math.max(1, current - 0.5))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="min-w-14 text-center text-xs font-black">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              aria-label="Phóng to bảng giá"
              disabled={zoom >= 2}
              onClick={() => setZoom((current) => Math.min(2, current + 0.5))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Đóng bảng giá"
            onClick={() => setSelectedPoster(null)}
            className="fixed right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-950 shadow-xl transition hover:scale-105"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            onClick={(event) => event.stopPropagation()}
            className={`flex min-h-full min-w-full items-start px-3 pb-6 pt-20 sm:px-6 ${zoom > 1 ? "justify-start" : "justify-center"}`}
          >
            <Image
              src={selectedPoster.src}
              alt={selectedPoster.alt}
              width={selectedPoster.width}
              height={selectedPoster.height}
              sizes="100vw"
              style={{
                width: `min(${Math.round(zoom * 100)}vw, ${Math.round(selectedPoster.width * zoom)}px)`,
                maxWidth: "none",
                flexShrink: 0,
              }}
              className="h-auto max-w-none shrink-0 cursor-default rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
