"use client";

import { ArrowRight, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_MEDIA_COLLECTIONS, type ManagedMediaItem } from "../../lib/media-collections";

const defaultHotProducts = DEFAULT_MEDIA_COLLECTIONS["hot-products"];

export default function HotProductsMarquee() {
  const [hotProducts, setHotProducts] = useState<ManagedMediaItem[] | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visualRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const visualInfluenceRefs = useRef<number[]>([]);
  const isPausedRef = useRef(false);

  useEffect(() => {
    fetch("/api/media/collections?collection=hot-products", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ items: ManagedMediaItem[] }> : null)
      .then((result) => {
        if (Array.isArray(result?.items)) setHotProducts(result.items);
        else setHotProducts(defaultHotProducts);
      })
      .catch(() => setHotProducts(defaultHotProducts));
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const videos = videoRefs.current;
    const productCount = hotProducts?.length || 0;
    if (!viewport || !track || productCount === 0) return;

    let frame = 0;
    let offset = 0;
    let previous = performance.now();
    let activeCenter = 0;

    const syncPauseWithPointer = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const box = viewport.getBoundingClientRect();
      const shouldPause = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
      isPausedRef.current = shouldPause;
      viewport.dataset.paused = String(shouldPause);
    };

    window.addEventListener("pointermove", syncPauseWithPointer, { passive: true });

    const render = (now: number) => {
      const elapsed = Math.min(now - previous, 40);
      previous = now;
      const loopWidth = track.scrollWidth / 2;

      if (loopWidth > 0) {
        if (!isPausedRef.current) offset -= elapsed * 0.05;
        if (-offset >= loopWidth) offset += loopWidth;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }

      const viewportBox = viewport.getBoundingClientRect();
      const center = viewportBox.left + viewportBox.width / 2;
      const influenceRange = Math.max(230, viewportBox.width * 0.32);
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slotRefs.current.forEach((slot, index) => {
        const card = cardRefs.current[index];
        const visual = visualRefs.current[index];
        if (!slot || !card || !visual) return;

        const itemCenter = viewportBox.left + slot.offsetLeft + offset + slot.offsetWidth / 2;
        const distance = Math.abs(itemCenter - center);
        const targetInfluence = Math.max(0, 1 - distance / influenceRange);
        const previousInfluence = visualInfluenceRefs.current[index] ?? targetInfluence;
        const smoothing = 1 - Math.exp(-elapsed / 90);
        const influence = previousInfluence + (targetInfluence - previousInfluence) * smoothing;
        visualInfluenceRefs.current[index] = influence;
        const pulse = (Math.sin(now / 420) + 1) / 2;
        const scale = 0.68 + influence * 0.38;
        const lift = (-8 + Math.sin(now / 520) * 2.5) * influence;

        visual.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
        visual.style.opacity = String(0.62 + influence * (0.3 + pulse * 0.08));
        card.style.zIndex = String(Math.round(influence * 30));
        card.dataset.centered = String(influence > 0.82);
        const video = videoRefs.current[index];
        if (video) {
          if (influence > 0.82 && video.paused) void video.play().catch(() => undefined);
          else if (influence <= 0.82 && !video.paused) video.pause();
        }

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index % productCount;
        }
      });

      if (closestIndex !== activeCenter) {
        activeCenter = closestIndex;
        viewport.dataset.centerIndex = String(closestIndex);
      }

      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", syncPauseWithPointer);
      videos.forEach((video) => video?.pause());
    };
  }, [hotProducts]);

  const productCount = hotProducts?.length || 0;
  const infiniteProducts = hotProducts ? [...hotProducts, ...hotProducts] : [];
  const setMarqueePaused = (paused: boolean) => {
    isPausedRef.current = paused;
    if (viewportRef.current) viewportRef.current.dataset.paused = String(paused);
  };

  return (
    <section id="san-pham-noi-bat" className="overflow-hidden bg-gradient-to-b from-[#fff7ee] via-white to-violet-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-700 shadow-sm">
            <Flame className="h-4 w-4 fill-current" /> Được khách hàng yêu thích
          </span>
          <h2 className="text-3xl font-black uppercase leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
            Các sản phẩm <span className="text-[#FF4D00]">đang hot</span>
          </h2>
        </div>
      </div>

      <div
        ref={viewportRef}
        data-product-showcase="dynamic-image-gif-video"
        data-center-index="0"
        data-paused="false"
        onMouseEnter={() => setMarqueePaused(true)}
        onMouseMove={() => setMarqueePaused(true)}
        onMouseLeave={() => setMarqueePaused(false)}
        onPointerEnter={() => setMarqueePaused(true)}
        onPointerMove={() => setMarqueePaused(true)}
        onPointerLeave={() => setMarqueePaused(false)}
        onFocusCapture={() => setMarqueePaused(true)}
        onBlurCapture={() => setMarqueePaused(false)}
        className="relative h-[260px] w-full overflow-hidden sm:h-[310px] lg:h-[560px]"
        aria-label="Các sản phẩm nổi bật chạy ngang tự động; rê chuột để tạm dừng"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-12 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-12 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-32" />
        {hotProducts === null ? (
          <div className="absolute inset-0 flex items-center justify-center" aria-label="Đang tải sản phẩm hot">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
          </div>
        ) : productCount === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <p className="rounded-full border border-orange-100 bg-white px-5 py-3 text-sm font-bold text-gray-600 shadow-sm">Chưa có sản phẩm hot. Anh có thể đăng ảnh mới trong trang quản trị.</p>
          </div>
        ) : null}
        <div ref={trackRef} className="hot-products-track absolute left-0 top-6 flex w-max items-center gap-4 px-4 sm:top-8 sm:gap-7 sm:px-7">
          {infiniteProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} ref={(node) => { slotRefs.current[index] = node; }} className="w-[120px] shrink-0 sm:w-[155px] lg:w-[360px]" aria-hidden={index >= productCount}>
              <Link href={product.href} tabIndex={index >= productCount ? -1 : undefined} className="block">
                <article ref={(node) => { cardRefs.current[index] = node; }} data-centered="false" className="hot-product-card relative flex h-[200px] flex-col items-center justify-end sm:h-[250px] lg:h-[510px]">
                  <div ref={(node) => { visualRefs.current[index] = node; }} className="hot-product-visual relative z-10 h-[145px] w-full p-2 sm:h-[190px] sm:p-3 lg:h-[440px]" data-media-fit="contain">
                    <div className="relative h-full w-full">
                      {product.kind === "video" ? (
                        <video ref={(node) => { videoRefs.current[index] = node; }} src={product.src} muted loop playsInline preload="metadata" className="h-full w-full object-contain" aria-label={index < productCount ? product.title : ""} />
                      ) : (
                        <Image src={product.src} alt={index < productCount ? product.title : ""} fill loading="lazy" unoptimized={product.kind === "gif" || product.src.startsWith("/media/")} sizes="(max-width: 640px) 104px, (max-width: 1024px) 131px, 320px" className="object-contain" />
                      )}
                    </div>
                  </div>
                  <div className="relative z-20 mt-3 min-h-9 text-center">
                    <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-orange-700">{product.category}</span>
                    <h3 className="mt-0.5 text-xs font-black text-gray-950 sm:text-sm">{product.title}</h3>
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>

      </div>

      <div className="mx-auto mt-0 flex max-w-[1440px] justify-center px-4">
        <Link href="/san-pham" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-7 py-3 text-sm font-black text-white shadow-xl transition-transform hover:scale-[1.03]">
          Xem tất cả sản phẩm của shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
