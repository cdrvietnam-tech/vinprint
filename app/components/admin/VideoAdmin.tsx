"use client";

import { CheckCircle2, Film, ImagePlus, Loader2, RotateCcw, Scissors, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DEFAULT_MEDIA_COLLECTIONS, MEDIA_COLLECTIONS, type ManagedMediaItem, type MediaCollectionId } from "../../lib/media-collections";
import ImageCropEditor from "./ImageCropEditor";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif", "video/mp4", "video/webm"]);
const maxImageSize = 12 * 1024 * 1024;
const maxVideoSize = 95 * 1024 * 1024;
const cropSizes: Record<MediaCollectionId, { width: number; height: number }> = {
  hero: { width: 1200, height: 900 },
  "hot-products": { width: 1000, height: 1000 },
  gallery: { width: 1000, height: 1000 },
};

function defaultTitle(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " ").replaceAll(/\s+/g, " ").trim() || "Mẫu sản phẩm mới";
}

function createMediaId() {
  return `media-${globalThis.crypto.randomUUID()}`;
}

function isOriginalItem(collection: MediaCollectionId, item: ManagedMediaItem) {
  const original = DEFAULT_MEDIA_COLLECTIONS[collection].find((entry) => entry.id === item.id);
  return Boolean(original && original.kind === item.kind && original.src === item.src && original.title === item.title && original.category === item.category && original.href === item.href);
}

export default function VideoAdmin() {
  const [collections, setCollections] = useState<Record<MediaCollectionId, ManagedMediaItem[]>>(() => ({
    hero: [...DEFAULT_MEDIA_COLLECTIONS.hero],
    "hot-products": [...DEFAULT_MEDIA_COLLECTIONS["hot-products"]],
    gallery: [...DEFAULT_MEDIA_COLLECTIONS.gallery],
  }));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [cropRequest, setCropRequest] = useState<{ collection: MediaCollectionId; item: ManagedMediaItem; file: File } | null>(null);

  useEffect(() => {
    Promise.all(MEDIA_COLLECTIONS.map(async ({ id }) => {
      const response = await fetch(`/api/admin/media-collections?collection=${id}`, { cache: "no-store" });
      if (!response.ok) return { id, items: DEFAULT_MEDIA_COLLECTIONS[id] };
      const result = await response.json() as { items: ManagedMediaItem[] };
      return { id, items: result.items };
    })).then((results) => {
      setCollections((current) => {
        const next = { ...current };
        for (const result of results) next[result.id] = result.items;
        return next;
      });
    }).finally(() => setLoading(false));
  }, []);

  const validateFile = (collection: MediaCollectionId, allowVideo: boolean, file: File) => {
    if (!allowedTypes.has(file.type) || (!allowVideo && file.type.startsWith("video/"))) {
      setMessages((current) => ({ ...current, [collection]: allowVideo ? "Chỉ nhận ảnh, GIF, MP4 hoặc WebM." : "Khu vực này nhận ảnh hoặc GIF." }));
      return false;
    }
    const limit = file.type.startsWith("video/") ? maxVideoSize : maxImageSize;
    if (!file.size || file.size > limit) {
      setMessages((current) => ({ ...current, [collection]: file.type.startsWith("video/") ? "Video cần nhỏ hơn 95 MB." : "Ảnh hoặc GIF cần nhỏ hơn 12 MB." }));
      return false;
    }
    return true;
  };

  const saveMedia = async (collection: MediaCollectionId, item: Omit<ManagedMediaItem, "kind" | "src">, file: File, successMessage: string) => {
    const definition = MEDIA_COLLECTIONS.find((entry) => entry.id === collection);
    if (!validateFile(collection, Boolean(definition?.allowVideo), file)) return;
    const params = new URLSearchParams({ collection, id: item.id, title: item.title, category: item.category, href: item.href });

    setBusy(`${collection}:${item.id}`);
    setMessages((current) => ({ ...current, [collection]: "Đang lưu nội dung…" }));
    try {
      const response = await fetch(`/api/admin/media-collections?${params}`, {
        method: "PUT",
        headers: { "content-type": file.type },
        body: file,
      });
      const result = await response.json() as { items?: ManagedMediaItem[]; error?: string };
      if (!response.ok || !result.items) throw new Error(result.error || "upload_failed");
      setCollections((current) => ({ ...current, [collection]: result.items || current[collection] }));
      setMessages((current) => ({ ...current, [collection]: successMessage }));
    } catch (error) {
      const code = error instanceof Error ? error.message : "upload_failed";
      setMessages((current) => ({ ...current, [collection]: code === "storage_unavailable" ? "Kho nội dung chưa được kết nối." : "Không thể lưu. Vui lòng thử lại." }));
    } finally {
      setBusy(null);
    }
  };

  const addMedia = async (collection: MediaCollectionId, allowVideo: boolean, file?: File) => {
    if (!file || !validateFile(collection, allowVideo, file)) return;
    const title = window.prompt("Tên hiển thị dưới sản phẩm", defaultTitle(file.name))?.trim();
    if (!title) return;
    const category = collection === "hot-products"
      ? window.prompt("Nhóm sản phẩm", "Sản phẩm VinPrint")?.trim() || "Sản phẩm VinPrint"
      : collection === "hero" ? "Hero" : "Thành phẩm";
    await saveMedia(collection, { id: createMediaId(), title, category, href: "/san-pham" }, file, "Đã đăng thêm thành công. Trang chủ sẽ tự nhận nội dung mới.");
  };

  const replaceMedia = async (collection: MediaCollectionId, item: ManagedMediaItem, file?: File) => {
    if (!file) return;
    await saveMedia(collection, { id: item.id, title: item.title, category: item.category, href: item.href }, file, "Đã thay nội dung và cập nhật ngay trên trang chủ.");
  };

  const openCropper = async (collection: MediaCollectionId, item: ManagedMediaItem) => {
    if (item.kind !== "image") return;
    setBusy(`${collection}:${item.id}:crop`);
    setMessages((current) => ({ ...current, [collection]: "Đang mở ảnh hiện tại để cắt và căn…" }));
    try {
      const currentUrl = new URL(item.src, window.location.origin);
      const source = currentUrl.pathname.startsWith("/images/")
        ? `/api/admin/images?path=${encodeURIComponent(currentUrl.pathname)}&cropv=${Date.now()}`
        : `${item.src}${item.src.includes("?") ? "&" : "?"}cropv=${Date.now()}`;
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) throw new Error("load_failed");
      const blob = await response.blob();
      if (!blob.type.startsWith("image/") || blob.type === "image/gif") throw new Error("invalid_image_type");
      const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "png";
      setCropRequest({ collection, item, file: new File([blob], `${item.title}.${extension}`, { type: blob.type }) });
      setMessages((current) => ({ ...current, [collection]: "" }));
    } catch {
      setMessages((current) => ({ ...current, [collection]: "Không thể mở ảnh hiện tại để cắt. Vui lòng thử lại." }));
    } finally {
      setBusy(null);
    }
  };

  const runRestore = async (collection: MediaCollectionId, action: "restore-item" | "restore-missing", item?: ManagedMediaItem) => {
    const prompt = action === "restore-item" ? `Khôi phục mẫu gốc cho “${item?.title}”?` : "Lấy lại toàn bộ mẫu gốc đã xóa trong khu vực này?";
    if (!window.confirm(prompt)) return;
    setBusy(`${collection}:${item?.id || action}`);
    try {
      const params = new URLSearchParams({ collection, action });
      if (item) params.set("id", item.id);
      const response = await fetch(`/api/admin/media-collections?${params}`, { method: "POST" });
      const result = await response.json() as { items?: ManagedMediaItem[] };
      if (!response.ok || !result.items) throw new Error("restore_failed");
      setCollections((current) => ({ ...current, [collection]: result.items || current[collection] }));
      setMessages((current) => ({ ...current, [collection]: action === "restore-item" ? "Đã khôi phục mẫu gốc." : "Đã lấy lại các mẫu gốc bị xóa." }));
    } catch {
      setMessages((current) => ({ ...current, [collection]: "Không thể khôi phục lúc này." }));
    } finally {
      setBusy(null);
    }
  };

  const removeMedia = async (collection: MediaCollectionId, item: ManagedMediaItem) => {
    if (!window.confirm(`Xóa “${item.title}” khỏi khu vực này?`)) return;
    setBusy(`${collection}:${item.id}`);
    try {
      const params = new URLSearchParams({ collection, id: item.id });
      const response = await fetch(`/api/admin/media-collections?${params}`, { method: "DELETE" });
      const result = await response.json() as { items?: ManagedMediaItem[] };
      if (!response.ok || !result.items) throw new Error("delete_failed");
      setCollections((current) => ({ ...current, [collection]: result.items || [] }));
      setMessages((current) => ({ ...current, [collection]: "Đã xóa khỏi trình chiếu." }));
    } catch {
      setMessages((current) => ({ ...current, [collection]: "Không thể xóa lúc này." }));
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mt-8 rounded-[32px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-orange-50 p-4 shadow-[0_18px_50px_rgba(76,29,149,0.08)] sm:p-6">
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Bộ sưu tập động</p>
        <h2 className="mt-2 text-2xl font-black sm:text-3xl">Quản lý ngay trên từng ảnh hoặc video</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">Mỗi thẻ có đủ thao tác đăng thêm, thay, cắt–căn, khôi phục và xóa. Nội dung mới sẽ xuất hiện đúng khu vực trên trang chủ.</p>
      </div>

      {loading ? (
        <div className="flex min-h-44 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-700" /></div>
      ) : (
        <div className="mt-6 space-y-6">
          {MEDIA_COLLECTIONS.map((collection) => {
            const items = collections[collection.id];
            const missingOriginals = DEFAULT_MEDIA_COLLECTIONS[collection.id].filter((original) => !items.some((item) => item.id === original.id)).length;
            return (
              <article key={collection.id} className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-gray-950">{collection.title} <span className="text-violet-700">({items.length})</span></h3>
                    <p className="mt-1 text-xs font-medium text-gray-500">{collection.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingOriginals > 0 && (
                      <button type="button" disabled={busy !== null} onClick={() => void runRestore(collection.id, "restore-missing")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gray-100 px-4 text-xs font-black text-gray-700 disabled:opacity-40">
                        <RotateCcw className="h-4 w-4" /> Lấy lại {missingOriginals} mẫu gốc
                      </button>
                    )}
                    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-violet-700 px-5 text-xs font-black text-white hover:bg-violet-800">
                      {busy?.startsWith(`${collection.id}:media-`) ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Đăng thêm
                      <input type="file" accept={collection.allowVideo ? "image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm" : "image/png,image/jpeg,image/webp,image/avif,image/gif"} className="sr-only" disabled={busy !== null} onChange={(event) => { void addMedia(collection.id, collection.allowVideo, event.target.files?.[0]); event.currentTarget.value = ""; }} />
                    </label>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {items.map((item) => {
                    const hasOriginal = DEFAULT_MEDIA_COLLECTIONS[collection.id].some((entry) => entry.id === item.id);
                    const changed = hasOriginal && !isOriginalItem(collection.id, item);
                    return (
                      <div key={item.id} className="w-56 shrink-0 rounded-2xl border border-gray-100 bg-gray-50 p-2.5">
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                          {item.kind === "video" ? (
                            <video src={item.src} controls muted playsInline preload="metadata" className="h-full w-full object-contain" aria-label={item.title} />
                          ) : (
                            <Image src={item.src} alt={item.title} fill unoptimized={item.kind === "gif" || item.src.startsWith("/media/")} sizes="224px" className="object-contain" />
                          )}
                          {item.kind !== "image" && <span className="absolute left-2 top-2 rounded-full bg-gray-950/80 px-2 py-1 text-[9px] font-black uppercase text-white">{item.kind === "video" ? <><Film className="mr-1 inline h-3 w-3" />Video</> : "GIF"}</span>}
                          {changed && <span className="absolute right-2 top-2 rounded-full bg-green-600 px-2 py-1 text-[9px] font-black uppercase text-white">Đã thay</span>}
                        </div>
                        <p className="mt-2 truncate text-xs font-black" title={item.title}>{item.title}</p>
                        <p className="mt-0.5 truncate text-[10px] font-bold text-gray-500">{item.category}</p>
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          <label className="flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-full bg-gray-950 px-2 text-[10px] font-black text-white">
                            <Upload className="h-3.5 w-3.5" /> Thay
                            <input type="file" accept={collection.allowVideo ? "image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm" : "image/png,image/jpeg,image/webp,image/avif,image/gif"} className="sr-only" disabled={busy !== null} onChange={(event) => { void replaceMedia(collection.id, item, event.target.files?.[0]); event.currentTarget.value = ""; }} />
                          </label>
                          <button type="button" disabled={busy !== null || item.kind !== "image"} title={item.kind !== "image" ? "GIF và video không thể cắt thành ảnh tĩnh" : undefined} onClick={() => void openCropper(collection.id, item)} className="flex min-h-9 items-center justify-center gap-1 rounded-full bg-orange-50 px-2 text-[10px] font-black text-orange-700 disabled:cursor-not-allowed disabled:opacity-35">
                            {busy === `${collection.id}:${item.id}:crop` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Scissors className="h-3.5 w-3.5" />} Cắt–căn
                          </button>
                          <button type="button" disabled={busy !== null || !changed} onClick={() => void runRestore(collection.id, "restore-item", item)} className="flex min-h-9 items-center justify-center gap-1 rounded-full bg-gray-100 px-2 text-[10px] font-black text-gray-700 disabled:cursor-not-allowed disabled:opacity-35">
                            <RotateCcw className="h-3.5 w-3.5" /> Khôi phục
                          </button>
                          <button type="button" disabled={busy !== null} onClick={() => void removeMedia(collection.id, item)} className="flex min-h-9 items-center justify-center gap-1 rounded-full bg-red-50 px-2 text-[10px] font-black text-red-700 disabled:opacity-40">
                            <Trash2 className="h-3.5 w-3.5" /> Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {messages[collection.id] && <p className="mt-3 flex gap-2 text-xs font-bold text-gray-700" role="status"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />{messages[collection.id]}</p>}
              </article>
            );
          })}
        </div>
      )}
      {cropRequest && (
        <ImageCropEditor
          item={{ title: cropRequest.item.title, ...cropSizes[cropRequest.collection] }}
          file={cropRequest.file}
          onCancel={() => setCropRequest(null)}
          onApply={(file) => {
            const request = cropRequest;
            setCropRequest(null);
            void replaceMedia(request.collection, request.item, file);
          }}
        />
      )}
    </section>
  );
}
