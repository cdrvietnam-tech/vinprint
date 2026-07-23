"use client";

import { ArrowLeft, CheckCircle2, ExternalLink, ImageUp, Loader2, RotateCcw, Scissors, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatUploadSize, optimizeImageWithProfile } from "../../lib/media-upload";
import ImageCropEditor from "./ImageCropEditor";
import VideoAdmin from "./VideoAdmin";

type CatalogItem = {
  path: string;
  title: string;
  category: string;
  categoryLabel: string;
  width: number | null;
  height: number | null;
  bytes: number;
  usages: Array<{ href: string; label: string }>;
};

type OverrideItem = { path: string; bytes: number; uploadedAt: string; uploadedBy: string };
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);
const maxFileSize = 8 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function getImageDimensions(file: File) {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export default function HeroImageAdmin() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [overrides, setOverrides] = useState<Record<string, OverrideItem>>({});
  const [versions, setVersions] = useState<Record<string, number>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [openingCrop, setOpeningCrop] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [changedFirst, setChangedFirst] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cropRequest, setCropRequest] = useState<{ item: CatalogItem; file: File } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/image-catalog.json", { cache: "no-store" }).then((response) => response.json() as Promise<{ items: CatalogItem[] }>),
      fetch("/api/admin/images", { cache: "no-store" }).then(async (response) => response.ok ? response.json() as Promise<{ items: OverrideItem[] }> : { items: [] }),
    ]).then(([catalogResult, overrideResult]) => {
      setCatalog(catalogResult.items);
      setOverrides(Object.fromEntries(overrideResult.items.map((item) => [item.path, item])));
    }).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, { id: string; label: string; count: number }>();
    for (const item of catalog) {
      const current = counts.get(item.category);
      counts.set(item.category, { id: item.category, label: item.categoryLabel, count: (current?.count || 0) + 1 });
    }
    return [...counts.values()].sort((a, b) => a.label.localeCompare(b.label, "vi"));
  }, [catalog]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = catalog.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = !normalizedQuery || `${item.title} ${item.path} ${item.categoryLabel}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
    return changedFirst ? filtered.sort((a, b) => Number(Boolean(overrides[b.path])) - Number(Boolean(overrides[a.path]))) : filtered;
  }, [catalog, category, changedFirst, overrides, query]);

  const upload = async (item: CatalogItem, file?: File) => {
    if (!file) return;
    if (!allowedTypes.has(file.type) || file.size > maxFileSize) {
      setMessages((current) => ({ ...current, [item.path]: "Chỉ nhận PNG, JPG, WebP hoặc AVIF dưới 8 MB." }));
      return;
    }

    try {
      const dimensions = await getImageDimensions(file);
      if (item.width && item.height) {
        const originalRatio = item.width / item.height;
        const newRatio = dimensions.width / dimensions.height;
        if (Math.abs(newRatio / originalRatio - 1) > 0.18 && !window.confirm(`Ảnh mới có tỷ lệ ${dimensions.width}×${dimensions.height}, khác đáng kể ảnh gốc ${item.width}×${item.height}. Vẫn thay ảnh?`)) return;
      }
    } catch {
      setMessages((current) => ({ ...current, [item.path]: "Không đọc được kích thước ảnh. Hãy chọn tệp ảnh khác." }));
      return;
    }

    setUploading(item.path);
    setMessages((current) => ({ ...current, [item.path]: "Đang nén và chuẩn hóa ảnh cho web…" }));
    let optimization;
    try {
      optimization = await optimizeImageWithProfile(file, {
        maxWidth: Math.min(2400, Math.max(1200, (item.width || 800) * 2)),
        maxHeight: Math.min(2400, Math.max(1200, (item.height || 800) * 2)),
        quality: 0.82,
      });
    } catch {
      optimization = { file, originalBytes: file.size, optimizedBytes: file.size, optimized: false };
    }
    const uploadFile = optimization.file;
    const previewUrl = URL.createObjectURL(uploadFile);
    setPreviewUrls((current) => {
      if (current[item.path]) URL.revokeObjectURL(current[item.path]);
      return { ...current, [item.path]: previewUrl };
    });
    try {
      const response = await fetch(`/api/admin/images?path=${encodeURIComponent(item.path)}`, {
        method: "PUT",
        headers: { "content-type": uploadFile.type },
        body: uploadFile,
      });
      const result = await response.json() as { error?: string; version?: number };
      if (!response.ok) throw new Error(result.error || "upload_failed");

      const changed: OverrideItem = { path: item.path, bytes: uploadFile.size, uploadedAt: new Date().toISOString(), uploadedBy: "" };
      setOverrides((current) => ({ ...current, [item.path]: changed }));
      setVersions((current) => ({ ...current, [item.path]: result.version || Date.now() }));
      const optimizationNote = optimization.optimized
        ? ` · Đã nén ${formatUploadSize(optimization.originalBytes)} → ${formatUploadSize(optimization.optimizedBytes)} WebP`
        : " · Ảnh đã đạt dung lượng tối ưu";
      setMessages((current) => ({ ...current, [item.path]: `Đã thay ảnh thành công${optimizationNote}` }));
    } catch (error) {
      const code = error instanceof Error ? error.message : "upload_failed";
      setMessages((current) => ({
        ...current,
        [item.path]: code === "storage_unavailable" ? "Kho ảnh chưa được kết nối." : "Không thể tải ảnh. Vui lòng thử lại.",
      }));
      setPreviewUrls((current) => {
        if (current[item.path] !== previewUrl) return current;
        const next = { ...current };
        delete next[item.path];
        URL.revokeObjectURL(previewUrl);
        return next;
      });
    } finally {
      setUploading(null);
    }
  };

  const openCurrentImageInCropper = async (item: CatalogItem) => {
    setOpeningCrop(item.path);
    setMessages((current) => ({ ...current, [item.path]: "Đang mở ảnh hiện tại…" }));
    try {
      const response = await fetch(`/api/admin/images?path=${encodeURIComponent(item.path)}&cropv=${versions[item.path] || Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("load_failed");
      const blob = await response.blob();
      if (!allowedTypes.has(blob.type)) throw new Error("invalid_image_type");
      const extension = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] || "png";
      const file = new File([blob], `${item.title}.${extension}`, { type: blob.type });
      setCropRequest({ item, file });
      setMessages((current) => {
        const next = { ...current };
        delete next[item.path];
        return next;
      });
    } catch {
      setMessages((current) => ({ ...current, [item.path]: "Không thể mở ảnh hiện tại để cắt. Vui lòng thử lại." }));
    } finally {
      setOpeningCrop(null);
    }
  };

  const restore = async (item: CatalogItem) => {
    if (!window.confirm(`Khôi phục ảnh gốc cho “${item.title}”?`)) return;
    setUploading(item.path);
    try {
      const response = await fetch(`/api/admin/images?path=${encodeURIComponent(item.path)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("restore_failed");
      setOverrides((current) => {
        const next = { ...current };
        delete next[item.path];
        return next;
      });
      setVersions((current) => ({ ...current, [item.path]: Date.now() }));
      setPreviewUrls((current) => {
        const next = { ...current };
        if (next[item.path]) URL.revokeObjectURL(next[item.path]);
        delete next[item.path];
        return next;
      });
      setMessages((current) => ({ ...current, [item.path]: "Đã khôi phục ảnh gốc" }));
    } catch {
      setMessages((current) => ({ ...current, [item.path]: "Không thể khôi phục ảnh lúc này." }));
    } finally {
      setUploading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 text-gray-950 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm">
            <ArrowLeft className="h-4 w-4" /> Về trang chủ
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/yeu-cau-bao-gia" className="inline-flex min-h-11 items-center rounded-full bg-orange-700 px-5 text-sm font-black text-white">Yêu cầu báo giá</Link>
            <Link href="/admin/noi-dung" className="inline-flex min-h-11 items-center rounded-full bg-violet-700 px-5 text-sm font-black text-white">Quản trị bài viết & sản phẩm</Link>
            <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-black text-green-700">{Object.keys(overrides).length} ảnh đã thay</span>
          </div>
        </div>

        <div className="mt-7 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Thư viện hình ảnh VinPrint</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Quản trị toàn bộ hình ảnh</h1>
          <p className="mt-4 font-medium leading-relaxed text-gray-700">
            Tìm ảnh theo nhóm, xem ảnh đang xuất hiện ở đâu, kéo thả ảnh mới để thay và khôi phục ảnh gốc bất cứ lúc nào.
          </p>
        </div>

        <VideoAdmin />

        <details className="group mt-8 overflow-visible rounded-3xl border border-orange-100 bg-white shadow-sm">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-5 py-5 text-base font-black text-gray-900 marker:content-none sm:px-6">
            <span>Ảnh hệ thống khác <span className="ml-2 text-xs font-bold text-gray-500">(nâng cao)</span></span>
            <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-700 group-open:hidden">Mở thư viện</span>
            <span className="hidden rounded-full bg-gray-100 px-4 py-2 text-xs font-black text-gray-700 group-open:inline">Thu gọn</span>
          </summary>
          <div className="border-t border-orange-100 px-3 pb-6 sm:px-5">
        <section className="sticky top-3 z-40 mt-5 rounded-3xl border border-orange-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên ảnh, đường dẫn hoặc nhóm…" className="min-h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-bold outline-none focus:border-orange-400" />
            </label>
            <button type="button" onClick={() => setChangedFirst((value) => !value)} className={`min-h-12 rounded-full px-5 text-sm font-black ${changedFirst ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-800"}`}>
              <Sparkles className="mr-2 inline h-4 w-4" /> Ảnh đã thay lên trước
            </button>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Lọc ảnh theo nhóm">
            <button type="button" onClick={() => setCategory("all")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${category === "all" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-700"}`}>Tất cả ({catalog.length})</button>
            {categories.map((item) => (
              <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${category === item.id ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-700"}`}>{item.label} ({item.count})</button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleItems.map((item) => {
              const changed = overrides[item.path];
              return (
                <article key={item.path} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void upload(item, event.dataTransfer.files?.[0]); }} className="overflow-hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-[0_12px_36px_rgba(65,34,10,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[linear-gradient(45deg,#f4f4f4_25%,transparent_25%),linear-gradient(-45deg,#f4f4f4_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f4f4f4_75%),linear-gradient(-45deg,transparent_75%,#f4f4f4_75%)] bg-[length:20px_20px]">
                    <Image key={previewUrls[item.path] || versions[item.path] || 0} src={previewUrls[item.path] || `${item.path}?adminv=${versions[item.path] || 0}`} alt={item.title} fill unoptimized={Boolean(previewUrls[item.path])} className="object-contain" />
                    {changed && <span className="absolute left-3 top-3 rounded-full bg-green-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">Đã thay</span>}
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-700">{item.categoryLabel}</p>
                    <h2 className="mt-1 truncate text-base font-black" title={item.title}>{item.title}</h2>
                    <p className="mt-1 truncate text-xs font-medium text-gray-500" title={item.path}>{item.path}</p>
                    <p className="mt-2 text-xs font-bold text-gray-600">Ảnh gốc: {item.width}×{item.height}px · {formatBytes(item.bytes)}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.usages.map((usage) => (
                      <Link key={usage.href} href={usage.href} target="_blank" className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700">
                        {usage.label} <ExternalLink className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-gray-950 px-4 py-2 text-xs font-black text-white hover:bg-orange-700">
                      {uploading === item.path ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
                      Thay ảnh
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" disabled={uploading !== null} onChange={(event) => { void upload(item, event.target.files?.[0]); event.currentTarget.value = ""; }} />
                    </label>
                    <button type="button" disabled={uploading !== null || openingCrop !== null} onClick={() => void openCurrentImageInCropper(item)} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-black text-orange-700 hover:bg-orange-100 disabled:cursor-wait disabled:opacity-50">
                      {openingCrop === item.path ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />} Cắt & căn
                    </button>
                    <button type="button" disabled={!changed || uploading !== null} onClick={() => void restore(item)} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-black text-gray-700 disabled:cursor-not-allowed disabled:opacity-40">
                      <RotateCcw className="h-4 w-4" /> Khôi phục
                    </button>
                  </div>
                  {messages[item.path] && <p className="mt-3 flex items-start gap-2 text-xs font-bold text-gray-700" role="status"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{messages[item.path]}</p>}
                </article>
              );
            })}
          </div>
        )}
          </div>
        </details>
      </div>
      {cropRequest && (
        <ImageCropEditor
          item={cropRequest.item}
          file={cropRequest.file}
          onCancel={() => setCropRequest(null)}
          onApply={(file) => {
            const item = cropRequest.item;
            setCropRequest(null);
            void upload(item, file);
          }}
        />
      )}
    </main>
  );
}
