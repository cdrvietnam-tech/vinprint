"use client";

import { Film, ImageIcon, Loader2, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_MEDIA_COLLECTIONS, type ManagedMediaItem } from "../../lib/media-collections";

export default function Ai247VideoGallery() {
  const [items, setItems] = useState<ManagedMediaItem[]>(DEFAULT_MEDIA_COLLECTIONS.ai247);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/media/collections?collection=ai247", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<{ items?: ManagedMediaItem[] }> : null)
      .then((result) => {
        if (result?.items && Array.isArray(result.items)) setItems(result.items);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-[32px] border border-white/10 bg-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-orange-400" aria-label="Đang tải video" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-orange-300/40 bg-white/5 px-6 py-16 text-center sm:px-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300"><Film className="h-8 w-8" /></span>
        <h2 className="mt-6 text-2xl font-black text-white">Video đầu tiên đang được chuẩn bị</h2>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-300">Thư viện sẽ cập nhật các video AI marketing của VinPrint tại đây. Anh chị có thể lưu trang để xem nội dung mới.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
          <div className="relative aspect-[4/5] overflow-hidden bg-black">
            {item.kind === "video" ? (
              <video className="h-full w-full object-contain" controls playsInline preload="metadata" aria-label={item.title}>
                <source src={item.src} />
                Trình duyệt của bạn chưa hỗ trợ phát video.
              </video>
            ) : (
              <Image src={item.src} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            )}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
              {item.kind === "video" ? <PlayCircle className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}{item.category}
            </span>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-black leading-snug text-white">{item.title}</h2>
          </div>
        </article>
      ))}
    </div>
  );
}
