"use client";

import { ArrowRight, ChevronDown, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_MEDIA_COLLECTIONS, type ManagedMediaItem } from "../../lib/media-collections";

const defaultHotProducts = DEFAULT_MEDIA_COLLECTIONS["hot-products"];

// Số cột theo bề rộng màn hình (khớp với grid-cols bên dưới) để tính "2 hàng".
function useColumns() {
  const [columns, setColumns] = useState(5);
  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      setColumns(width < 640 ? 2 : width < 1024 ? 3 : 5);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return columns;
}

export default function HotProductsMarquee() {
  const [hotProducts, setHotProducts] = useState<ManagedMediaItem[]>(defaultHotProducts);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const columns = useColumns();

  useEffect(() => {
    fetch("/api/media/collections?collection=hot-products", { cache: "no-store" })
      .then(async (response) => (response.ok ? (response.json() as Promise<{ items: ManagedMediaItem[] }>) : null))
      .then((result) => {
        // Tôn trọng đúng danh sách đã lưu; xóa hết thì ẩn khối.
        if (result && Array.isArray(result.items)) setHotProducts(result.items);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (loaded && hotProducts.length === 0) return null;

  const twoRows = columns * 2;
  const canToggle = hotProducts.length > twoRows;
  const visibleProducts = expanded ? hotProducts : hotProducts.slice(0, twoRows);

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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="group flex flex-col rounded-2xl p-2 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm transition-all duration-300 group-hover:border-orange-300 group-hover:shadow-[0_16px_40px_-12px_rgba(216,59,0,0.35)]">
                {product.kind === "video" ? (
                  <video
                    src={product.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    aria-label={product.title}
                  />
                ) : (
                  <Image
                    src={product.src}
                    alt={product.title}
                    fill
                    loading="lazy"
                    unoptimized={product.kind === "gif" || product.src.startsWith("/media/")}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="mt-3 min-h-11 text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-orange-700">{product.category}</span>
                <h3 className="mt-0.5 text-xs font-black text-gray-950 transition-colors group-hover:text-[#D83B00] sm:text-sm">{product.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        {canToggle && (
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-orange-200 bg-white px-6 text-sm font-black text-[#D83B00] shadow-sm transition-colors hover:bg-orange-50"
            >
              {expanded ? "Thu gọn" : `Xem thêm ${hotProducts.length - twoRows} sản phẩm`}
              <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/san-pham" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-7 py-3 text-sm font-black text-white shadow-xl transition-transform hover:scale-[1.03]">
            Xem tất cả sản phẩm của shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
