"use client";

import Link from "next/link";
import { CheckCircle2, FileUp, Loader2, Send } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { QUOTE_FILE_ACCEPT, QUOTE_FILE_MAX_BYTES } from "../../lib/quote-requests";

type QuoteRequestFormProps = {
  productSlug?: string;
  productTitle?: string;
  tone?: "light" | "white";
};

type SubmitResult = {
  code?: string;
  error?: string;
};

export default function QuoteRequestForm({
  productSlug = "",
  productTitle = "",
  tone = "white",
}: QuoteRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const artwork = formData.get("artwork");
    if (!(artwork instanceof File) || !artwork.size) {
      setStatus("error");
      setMessage("Anh chọn file thiết kế hoặc ảnh mẫu trước khi gửi.");
      return;
    }
    if (artwork.size > QUOTE_FILE_MAX_BYTES) {
      setStatus("error");
      setMessage("File tối đa 15 MB. Với file lớn hơn, anh gửi qua Zalo giúp em.");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        body: formData,
      });
      const result = await response.json() as SubmitResult;
      if (!response.ok) throw new Error(result.error || "submit_failed");
      setStatus("success");
      setMessage(`Đã nhận yêu cầu ${result.code || ""}. VinPrint sẽ kiểm tra file và liên hệ lại.`);
      form.reset();
      setSelectedFileName("");
      trackEvent("submit_quote_request", {
        position: productSlug ? `product_${productSlug}` : "homepage",
      });
    } catch (error) {
      const code = error instanceof Error ? error.message : "submit_failed";
      setStatus("error");
      setMessage(
        code === "storage_unavailable"
          ? "Kho nhận file đang tạm gián đoạn. Anh gửi file qua Zalo giúp em."
          : "Chưa gửi được yêu cầu. Anh thử lại hoặc gửi file qua Zalo.",
      );
    }
  };

  const fieldClass = tone === "light"
    ? "min-h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-bold text-gray-950 outline-none transition focus:border-orange-500 focus:bg-white"
    : "min-h-12 w-full rounded-2xl border border-white/25 bg-white/95 px-4 text-sm font-bold text-gray-950 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30";

  return (
    <form
      ref={formRef}
      id={productSlug ? `gui-file-${productSlug}` : "gui-file"}
      onSubmit={submit}
      className={tone === "light"
        ? "rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        : "w-full rounded-[28px] border border-white/20 bg-black/20 p-5 text-left shadow-xl backdrop-blur sm:p-6"}
    >
      <div className="mb-5">
        <span className={tone === "light" ? "text-xs font-black uppercase tracking-[0.14em] text-orange-700" : "text-xs font-black uppercase tracking-[0.14em] text-orange-100"}>
          Gửi file nhận báo giá
        </span>
        <h3 className={tone === "light" ? "mt-1 text-2xl font-black text-gray-950" : "mt-1 text-2xl font-black text-white"}>
          Không cần mở Zalo
        </h3>
        <p className={tone === "light" ? "mt-2 text-sm font-medium text-gray-600" : "mt-2 text-sm font-medium text-white/80"}>
          Điền thông tin và tải file lên. Báo giá chính xác sau khi xưởng kiểm tra file.
        </p>
      </div>

      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="productTitle" value={productTitle} />
      <label className="sr-only" htmlFor={`company-website-${productSlug || "home"}`}>Website công ty</label>
      <input
        id={`company-website-${productSlug || "home"}`}
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Tên liên hệ</span>
          <input className={fieldClass} name="customerName" autoComplete="name" minLength={2} maxLength={80} required placeholder="Nguyễn Văn A" />
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Số điện thoại</span>
          <input className={fieldClass} name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={9} maxLength={20} required placeholder="09xx xxx xxx" />
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Số lượng dự kiến</span>
          <input className={fieldClass} name="quantity" type="number" inputMode="numeric" min={1} max={10000000} required placeholder="Ví dụ: 1.000" />
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>File thiết kế / ảnh mẫu</span>
          <span className={`${fieldClass} flex cursor-pointer items-center gap-2 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200`}>
            <FileUp className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
            <span className="truncate">{selectedFileName || "Chọn file tối đa 15 MB"}</span>
            <input
              className="sr-only"
              name="artwork"
              type="file"
              accept={QUOTE_FILE_ACCEPT}
              required
              onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name || "")}
            />
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-black text-white shadow-lg transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
        {status === "sending" ? "Đang gửi file…" : "Gửi file để xưởng báo giá"}
      </button>

      {message && (
        <p
          role="status"
          className={`mt-3 flex items-start gap-2 rounded-2xl px-3 py-2 text-xs font-bold ${
            status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          }`}
        >
          {status === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
          {message}
        </p>
      )}

      <p className={tone === "light" ? "mt-3 text-[11px] font-medium leading-relaxed text-gray-500" : "mt-3 text-[11px] font-medium leading-relaxed text-white/70"}>
        Khi gửi form, anh đồng ý để VinPrint dùng thông tin này nhằm tư vấn và báo giá. Xem{" "}
        <Link className="font-black underline underline-offset-2" href="/chinh-sach">chính sách bảo mật</Link>.
      </p>
    </form>
  );
}
