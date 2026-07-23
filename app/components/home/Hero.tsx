"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ZaloIcon } from "../icons";
import { trackEvent } from "../../lib/analytics";
import { CUSTOMER_AVATARS } from "./customer-avatars";
import { DEFAULT_MEDIA_COLLECTIONS, type ManagedMediaItem } from "../../lib/media-collections";

const defaultHeroSlides = DEFAULT_MEDIA_COLLECTIONS.hero;

const sparklePositions = [
  ["12%", "17%", "-0.1s", "text-orange-400"],
  ["78%", "13%", "-0.35s", "text-violet-500"],
  ["88%", "38%", "-0.6s", "text-amber-400"],
  ["15%", "55%", "-0.85s", "text-pink-500"],
  ["75%", "70%", "-1.1s", "text-orange-500"],
  ["32%", "10%", "-1.35s", "text-yellow-400"],
  ["8%", "80%", "-1.6s", "text-violet-400"],
  ["92%", "82%", "-1.85s", "text-pink-400"],
] as const;

export default function Hero() {
  const [heroSlides, setHeroSlides] = useState<ManagedMediaItem[]>(defaultHeroSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const heroCarouselRef = useRef<HTMLDivElement>(null);
  const lastManualSlideAtRef = useRef(0);
  const isInteracting = isHeroHovered || isDragging;

  useEffect(() => {
    fetch("/api/media/collections?collection=hero", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ items: ManagedMediaItem[] }> : null)
      .then((result) => {
        if (result?.items.length) {
          setHeroSlides(result.items);
          setActiveSlide(0);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const syncHoverWithPointer = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const box = heroCarouselRef.current?.getBoundingClientRect();
      if (!box) return;
      setIsHeroHovered(event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom);
    };
    window.addEventListener("pointermove", syncHoverWithPointer, { passive: true });
    return () => window.removeEventListener("pointermove", syncHoverWithPointer);
  }, []);

  useEffect(() => {
    if (isInteracting) return;
    const timer = window.setInterval(() => {
      if (Date.now() - lastManualSlideAtRef.current < 1500) return;
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length, isInteracting]);

  const slide = heroSlides[activeSlide % heroSlides.length] || defaultHeroSlides[0];

  return (
    <section id="trang-chu" className="relative overflow-hidden bg-[#fffdf9] pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,77,0,0.12),transparent_34%),radial-gradient(circle_at_10%_80%,rgba(101,69,237,0.08),transparent_28%)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-14">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
          <div className="z-10 w-full text-center lg:w-[calc(50%-1.75rem)] lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-700"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              In ấn các loại tem nhãn và ấn phẩm
            </motion.div>

            <h1 className="mb-6 text-4xl font-black leading-[1.18] tracking-tight text-gray-950 sm:text-5xl lg:text-[44px] xl:text-[58px]">
              <span className="lg:whitespace-nowrap">XƯỞNG IN SIÊU TỐC</span><br />
              <span className="text-[#FF4D00]">In nhanh - Chuẩn đẹp - Giá tốt</span>
            </h1>

            <p className="mx-auto mb-8 max-w-[540px] text-lg font-medium leading-relaxed text-gray-700 lg:mx-0 lg:text-[20px]">
              VinPrint giúp sản phẩm của bạn nổi bật hơn, chuyên nghiệp hơn và bán chạy hơn.
            </p>

            <div className="mx-auto mb-9 grid max-w-xl grid-cols-2 gap-x-5 gap-y-4 text-left lg:mx-0">
              {["Hỗ trợ thiết kế đơn từ 200.000đ", "Chất liệu cao cấp - Bền đẹp", "In sắc nét - Chuẩn màu", "Số lượng ít vẫn nhận"].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F5A623]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-[14px] font-bold leading-snug text-gray-800">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_zalo", { position: "hero" })} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#D83B00] px-8 text-[15px] font-black text-white shadow-[0_8px_30px_rgb(216,59,0,0.25)] transition-transform hover:scale-[1.03] sm:w-auto">
                <ZaloIcon className="h-5 w-5" fill="white" /> Nhắn Zalo chốt in →
              </a>
              <a href="#bang-gia" onClick={() => trackEvent("view_pricing", { position: "hero_combo" })} className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full border-2 border-[#6545ED] px-8 text-[15px] font-black text-[#5635D8] transition-colors hover:bg-purple-50 sm:w-auto">
                Xem combo siêu hời <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              <div className="flex -space-x-2" aria-label="Avatar khách hàng minh họa">
                {CUSTOMER_AVATARS.map((avatar) => (
                  <span key={avatar} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-orange-50 shadow-sm">
                    <Image src={avatar} alt="" fill loading="lazy" sizes="40px" className="object-cover" />
                  </span>
                ))}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1 text-[#F5A623]">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="h-4 w-4 fill-current" />)}
                  <span className="ml-1 text-[15px] font-extrabold text-gray-900">4.9/5</span>
                </div>
                <a href="https://shopee.vn/chaucay_senda" target="_blank" rel="noreferrer" className="mt-0.5 block max-w-[270px] text-[12px] font-bold leading-tight text-gray-700 underline decoration-gray-300 underline-offset-2">
                  Hơn 32000 lượt đánh giá cho shop ở Shopee
                </a>
              </div>
            </div>
          </div>

          <div
            ref={heroCarouselRef}
            data-hero-carousel="large-auto-drag"
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
            className="relative h-[470px] w-full min-w-0 overflow-hidden sm:h-[580px] lg:h-[650px] lg:w-[calc(50%-1.75rem)]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
              {sparklePositions.map(([left, top, delay, color], index) => (
                <span key={`${left}-${top}`} style={{ left, top, animationDelay: delay }} className={`hero-sparkle-star absolute ${color} ${index % 3 === 0 ? "text-xl" : index % 2 === 0 ? "text-sm" : "text-lg"}`}>✦</span>
              ))}
            </div>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.figure
                key={slide.src}
                initial={{ x: "100%", opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.7 }}
                transition={{ x: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                dragDirectionLock
                onDragStart={() => {
                  lastManualSlideAtRef.current = Date.now();
                  setIsDragging(true);
                }}
                onDragEnd={(_, info) => {
                  lastManualSlideAtRef.current = Date.now();
                  if (info.offset.x < -45) setActiveSlide((current) => (current + 1) % heroSlides.length);
                  if (info.offset.x > 45) setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
                  setIsDragging(false);
                }}
                className="absolute inset-0 cursor-grab select-none active:cursor-grabbing"
              >
                <div className="relative h-full w-full p-5 sm:p-8">
                  <Image src={slide.src} alt={slide.title} fill priority={activeSlide === 0} unoptimized={slide.kind === "gif" || slide.src.startsWith("/media/")} sizes="(max-width: 1024px) 100vw, 57vw" className="pointer-events-none object-contain p-2 sm:p-4" />
                </div>
              </motion.figure>
            </AnimatePresence>

            <div className="absolute bottom-7 right-7 z-20 flex gap-2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur" aria-label="Vị trí ảnh hero">
              {heroSlides.map((item, index) => (
                <button key={item.id} type="button" aria-label={`Xem ${item.title}`} aria-current={index === activeSlide} onClick={() => setActiveSlide(index)} className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-[#D83B00]" : "w-2.5 bg-gray-400 hover:bg-gray-600"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 w-full bg-[#1A1A2E] py-5 shadow-2xl">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 text-center text-white md:grid-cols-4">
          {[["90.000+", "Khách hàng"], ["211.000+", "Mẫu tem đã thực hiện"], ["100K+", "Đơn hàng đã in"], ["4.9/5", "Đánh giá trung bình"]].map(([value, label]) => (
            <div key={label} className="flex flex-col items-center justify-center gap-1 border-white/10 md:border-r md:last:border-r-0">
              <strong className="text-2xl font-black text-[#F5A623] lg:text-3xl">{value}</strong>
              <span className="text-xs font-bold text-gray-200">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
