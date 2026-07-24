"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { QUOTE_MATERIALS } from "../../lib/quote-requests";

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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const materialOptions = productTitle
    ? [productTitle, ...QUOTE_MATERIALS.filter((material) => material !== productTitle)]
    : [...QUOTE_MATERIALS];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as SubmitResult;
      if (!response.ok) throw new Error(result.error || "submit_failed");
      setStatus("success");
      setMessage(`Đã nhận yêu cầu ${result.code || ""}. VinPrint sẽ báo giá theo vật liệu, kích thước và số lượng anh đã chọn.`);
      form.reset();
      trackEvent("submit_quote_request", {
        position: productSlug ? `product_${productSlug}` : "homepage",
      });
    } catch (error) {
      const code = error instanceof Error ? error.message : "submit_failed";
      setStatus("error");
      setMessage(
        code === "storage_unavailable"
          ? "Hệ thống nhận yêu cầu đang tạm gián đoạn. Anh nhắn Zalo để được báo giá."
          : "Chưa gửi được yêu cầu. Anh thử lại hoặc nhắn Zalo để được báo giá.",
      );
    }
  };

  const fieldClass = tone === "light"
    ? "min-h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-bold text-gray-950 outline-none transition focus:border-orange-500 focus:bg-white"
    : "min-h-12 w-full rounded-2xl border border-white/25 bg-white/95 px-4 text-sm font-bold text-gray-950 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30";

  return (
    <form
      id={productSlug ? `nhan-bao-gia-${productSlug}` : "nhan-bao-gia"}
      onSubmit={submit}
      className={tone === "light"
        ? "rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
        : "w-full rounded-[28px] border border-white/20 bg-black/20 p-5 text-left shadow-xl backdrop-blur sm:p-6"}
    >
      <div className="mb-5">
        <span className={tone === "light" ? "text-xs font-black uppercase tracking-[0.14em] text-orange-700" : "text-xs font-black uppercase tracking-[0.14em] text-orange-100"}>
          Báo giá lẻ &amp; sỉ
        </span>
        <h3 className={tone === "light" ? "mt-1 text-2xl font-black text-gray-950" : "mt-1 text-2xl font-black text-white"}>
          Không cần gửi file
        </h3>
        <p className={tone === "light" ? "mt-2 text-sm font-medium text-gray-600" : "mt-2 text-sm font-medium text-white/80"}>
          Chỉ cần vật liệu, kích thước và số lượng. Chọn giá sỉ khi cần in số lượng lớn.
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
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Vật liệu cần in</span>
          <select className={fieldClass} name="material" required defaultValue={productTitle || ""}>
            {!productTitle && <option value="" disabled>Chọn vật liệu</option>}
            {materialOptions.map((material) => <option key={material} value={material}>{material}</option>)}
          </select>
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Số lượng dự kiến</span>
          <input className={fieldClass} name="quantity" type="number" inputMode="numeric" min={1} max={10000000} required placeholder="Ví dụ: 1.000" />
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Chiều ngang (mm)</span>
          <input className={fieldClass} name="widthMm" type="number" inputMode="decimal" min={1} max={10000} step="0.1" required placeholder="Ví dụ: 50" />
        </label>
        <label className="block">
          <span className={tone === "light" ? "mb-1.5 block text-xs font-black text-gray-700" : "mb-1.5 block text-xs font-black text-white"}>Chiều cao (mm)</span>
          <input className={fieldClass} name="heightMm" type="number" inputMode="decimal" min={1} max={10000} step="0.1" required placeholder="Ví dụ: 30" />
        </label>
      </div>

      <fieldset className="mt-3">
        <legend className={tone === "light" ? "mb-2 text-xs font-black text-gray-700" : "mb-2 text-xs font-black text-white"}>Loại báo giá</legend>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "retail", title: "Giá lẻ", note: "Số lượng thông thường" },
            { value: "wholesale", title: "Giá sỉ", note: "Dành cho số lượng lớn" },
          ].map((option, index) => (
            <label key={option.value} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="priceTier" value={option.value} defaultChecked={index === 0} />
              <span className={`block min-h-16 rounded-2xl border px-4 py-3 transition peer-checked:border-orange-500 peer-checked:ring-2 peer-checked:ring-orange-200 ${
                tone === "light" ? "border-gray-200 bg-gray-50 text-gray-950" : "border-white/25 bg-white/95 text-gray-950"
              }`}>
                <strong className="block text-sm font-black">{option.title}</strong>
                <small className="mt-0.5 block text-[11px] font-semibold text-gray-500">{option.note}</small>
              </span>
            </label>
          ))}
        </div>
        <p className={tone === "light" ? "mt-2 text-[11px] font-medium text-gray-500" : "mt-2 text-[11px] font-medium text-white/70"}>
          Mức giá sỉ được xưởng xác nhận theo vật liệu, kích thước và tổng số lượng.
        </p>
      </fieldset>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-black text-white shadow-lg transition hover:bg-orange-700 disabled:cursor-wait disabled:opacity-70"
      >
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
        {status === "sending" ? "Đang gửi yêu cầu…" : "Nhận báo giá ngay"}
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
