"use client";

import Link from "next/link";
import { ArrowLeft, Download, FileText, Image as ImageIcon, Loader2, Phone, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { QuoteRequestRecord as QuoteRequest } from "../../lib/quote-requests";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function QuoteRequestsAdmin() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/quote-requests", { cache: "no-store" });
      const result = await response.json() as { items?: QuoteRequest[]; cursor?: string | null; error?: string };
      if (!response.ok) throw new Error(result.error || "load_failed");
      setItems(result.items || []);
      setCursor(result.cursor || null);
    } catch {
      setMessage("Chưa tải được danh sách yêu cầu. Anh thử tải lại trang.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/quote-requests", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { items?: QuoteRequest[]; cursor?: string | null; error?: string };
        if (!response.ok) throw new Error(result.error || "load_failed");
        if (!cancelled) {
          setItems(result.items || []);
          setCursor(result.cursor || null);
        }
      })
      .catch(() => {
        if (!cancelled) setMessage("Chưa tải được danh sách yêu cầu. Anh thử tải lại trang.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/quote-requests?cursor=${encodeURIComponent(cursor)}`, { cache: "no-store" });
      const result = await response.json() as { items?: QuoteRequest[]; cursor?: string | null; error?: string };
      if (!response.ok) throw new Error(result.error || "load_failed");
      setItems((current) => {
        const knownIds = new Set(current.map((item) => item.id));
        return [...current, ...(result.items || []).filter((item) => !knownIds.has(item.id))];
      });
      setCursor(result.cursor || null);
    } catch {
      setMessage("Chưa tải thêm được yêu cầu. Anh thử lại.");
    } finally {
      setLoadingMore(false);
    }
  };

  const remove = async (item: QuoteRequest) => {
    if (!window.confirm(`Xóa yêu cầu báo giá ${item.code}?`)) return;
    setBusyId(item.id);
    try {
      const response = await fetch(`/api/admin/quote-requests?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage(`Đã xóa yêu cầu ${item.code}.`);
    } catch {
      setMessage("Chưa xóa được yêu cầu. Anh thử lại.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 text-gray-950 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-black shadow-sm">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Về trang chủ
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/hinh-anh" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-black text-white">
              <ImageIcon className="h-4 w-4" aria-hidden="true" /> Hình ảnh
            </Link>
            <Link href="/admin/noi-dung" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-black text-white">
              <FileText className="h-4 w-4" aria-hidden="true" /> Nội dung
            </Link>
          </div>
        </div>

        <header className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Yêu cầu từ website</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Quản trị yêu cầu báo giá</h1>
            <p className="mt-4 font-medium leading-7 text-gray-700">
              Xem tên, số điện thoại, vật liệu, kích thước, số lượng và nhu cầu giá lẻ hoặc giá sỉ.
              Dữ liệu chỉ hiển thị trong khu vực được Cloudflare Access bảo vệ.
              Nếu mở file từ yêu cầu cũ, anh vẫn nên quét virus trước.
            </p>
          </div>
          <button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-orange-200 bg-white px-5 text-sm font-black text-orange-800">
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Tải lại
          </button>
        </header>

        {message && <p role="status" className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm">{message}</p>}

        <section className="mt-7 overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 font-bold text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Đang tải yêu cầu…
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
              <FileText className="h-10 w-10 text-orange-300" aria-hidden="true" />
              <strong className="mt-3 text-lg font-black">Chưa có yêu cầu mới</strong>
              <p className="mt-1 text-sm font-medium text-gray-500">Yêu cầu gửi từ form trên trang chủ và trang sản phẩm sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3 sm:p-6">
                {items.map((item) => (
                  <article key={item.id} className="rounded-[24px] border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.12em] text-orange-700">{item.code}</span>
                      <h2 className="mt-1 text-xl font-black">{item.customerName}</h2>
                    </div>
                    <time className="text-right text-[11px] font-bold leading-5 text-gray-500" dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </time>
                  </div>

                  <dl className="mt-5 space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Điện thoại</dt><dd className="font-black">{item.phone}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Vật liệu</dt><dd className="text-right font-black">{item.material || item.productTitle || "Chưa rõ"}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Kích thước</dt><dd className="font-black">{item.widthMm && item.heightMm ? `${item.widthMm} × ${item.heightMm} mm` : "Chưa rõ"}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Số lượng</dt><dd className="font-black">{item.quantity.toLocaleString("vi-VN")}</dd></div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-bold text-gray-500">Báo giá</dt>
                      <dd className={`rounded-full px-2.5 py-1 text-xs font-black ${
                        item.priceTier === "wholesale"
                          ? "bg-violet-100 text-violet-800"
                          : item.priceTier === "retail"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-200 text-gray-700"
                      }`}>
                        {item.priceTier === "wholesale" ? "Giá sỉ" : item.priceTier === "retail" ? "Giá lẻ" : "Chưa phân loại"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Sản phẩm</dt><dd className="text-right font-black">{item.productTitle || "Chưa chọn"}</dd></div>
                    {item.fileName && (
                      <>
                        <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">File cũ</dt><dd className="max-w-[65%] truncate text-right font-black" title={item.fileName}>{item.fileName}</dd></div>
                        <div className="flex justify-between gap-4"><dt className="font-bold text-gray-500">Dung lượng</dt><dd className="font-black">{formatBytes(item.fileSize || 0)}</dd></div>
                      </>
                    )}
                  </dl>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-700 px-3 text-xs font-black text-white ${item.fileName ? "" : "col-span-2"}`}>
                      <Phone className="h-4 w-4" aria-hidden="true" /> Gọi khách
                    </a>
                    {item.fileName && (
                      <a href={`/api/admin/quote-requests?id=${encodeURIComponent(item.id)}&file=1`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-violet-700 px-3 text-xs font-black text-white">
                        <Download className="h-4 w-4" aria-hidden="true" /> Tải file cũ
                      </a>
                    )}
                    <button type="button" disabled={busyId === item.id} onClick={() => void remove(item)} className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-3 text-xs font-black text-red-700 disabled:opacity-60">
                      {busyId === item.id ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                      Xóa yêu cầu
                    </button>
                  </div>
                  </article>
                ))}
              </div>
              {cursor && (
                <div className="border-t border-orange-100 p-4 text-center sm:p-6">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => void loadMore()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-6 text-sm font-black text-white disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    Tải thêm yêu cầu
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
