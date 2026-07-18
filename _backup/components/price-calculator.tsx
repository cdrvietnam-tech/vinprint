"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trackEvent } from "../lib/analytics";

const ZALO_URL = "https://zalo.me/0844998499";

/* ------------------------------------------------------------------ *
 * BẢNG GIÁ THAM KHẢO — anh CHỈNH SỐ Ở ĐÂY cho khớp giá thật của xưởng.
 * `base` = giá tham khảo cho 1 tem ở khổ trung bình (M).
 * Con số dưới đây chỉ là ví dụ để hoàn thiện luồng tính giá.
 * ------------------------------------------------------------------ */
const MATERIALS = [
  { id: "paper", name: "Tem giấy", base: 800, tone: "lime", note: "Bao bì khô, hộp, túi kraft" },
  { id: "plastic", name: "Tem nhựa chống nước", base: 1200, tone: "coral", note: "Chai lọ, mỹ phẩm, đồ ẩm" },
  { id: "uv", name: "UV DTF nổi", base: 2000, tone: "violet", note: "Kính, gốm, kim loại, nhựa cứng" },
  { id: "metallic", name: "Ánh kim · 7 màu", base: 1800, tone: "holo", note: "Bạc, vàng, hologram cao cấp" },
] as const;

const SIZES = [
  { id: "s", name: "Nhỏ (≤ 3cm)", mult: 0.7 },
  { id: "m", name: "Vừa (~5cm)", mult: 1 },
  { id: "l", name: "Lớn (~8cm)", mult: 1.5 },
  { id: "xl", name: "Rất lớn (≥ 10cm)", mult: 2.2 },
] as const;

// Số lượng càng nhiều, đơn giá càng giảm.
const QTY_TIERS = [
  { min: 1000, mult: 0.6, label: "≥ 1.000 tem" },
  { min: 500, mult: 0.7, label: "500 – 999 tem" },
  { min: 200, mult: 0.8, label: "200 – 499 tem" },
  { min: 50, mult: 0.9, label: "50 – 199 tem" },
  { min: 1, mult: 1, label: "< 50 tem" },
];

const schema = z.object({
  material: z.enum(["paper", "plastic", "uv", "metallic"]),
  size: z.enum(["s", "m", "l", "xl"]),
  quantity: z
    .number({ invalid_type_error: "Nhập số lượng" })
    .int("Số nguyên")
    .min(1, "Tối thiểu 1 tem")
    .max(1000000, "Số lượng quá lớn"),
});

type FormValues = z.infer<typeof schema>;

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

function tierFor(qty: number) {
  return QTY_TIERS.find((tier) => qty >= tier.min) ?? QTY_TIERS[QTY_TIERS.length - 1];
}

export default function PriceCalculator() {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { material: "plastic", size: "m", quantity: 100 },
    mode: "onChange",
  });

  const values = watch();

  const result = useMemo(() => {
    const material = MATERIALS.find((m) => m.id === values.material);
    const size = SIZES.find((s) => s.id === values.size);
    const qty = Number(values.quantity);
    if (!material || !size || !qty || qty < 1 || Number.isNaN(qty)) return null;

    const tier = tierFor(qty);
    const unit = Math.round(material.base * size.mult * tier.mult);
    const total = unit * qty;
    return { material, size, qty, tier, unit, total };
  }, [values.material, values.size, values.quantity]);

  const zaloHref = useMemo(() => {
    if (!result) return ZALO_URL;
    const msg = `Chào VinPrint, mình muốn báo giá: ${result.material.name}, khổ ${result.size.name}, số lượng ${result.qty} tem (giá tham khảo ~${formatVND(result.total)}).`;
    return `${ZALO_URL}?text=${encodeURIComponent(msg)}`;
  }, [result]);

  return (
    <div className="calc">
      <form className="calc__form" onSubmit={(e) => e.preventDefault()}>
        <div className="calc__field">
          <label>1 · Chất liệu</label>
          <div className="calc__chips">
            {MATERIALS.map((m) => (
              <label key={m.id} className={`calc__chip calc__chip--${m.tone}`}>
                <input type="radio" value={m.id} {...register("material")} />
                <span>
                  <b>{m.name}</b>
                  <small>{m.note}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="calc__row">
          <div className="calc__field">
            <label htmlFor="calc-size">2 · Kích thước tem</label>
            <select id="calc-size" {...register("size")}>
              {SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="calc__field">
            <label htmlFor="calc-qty">3 · Số lượng (tem)</label>
            <input
              id="calc-qty"
              type="number"
              min={1}
              inputMode="numeric"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <span className="calc__error">{errors.quantity.message}</span>
            )}
          </div>
        </div>
      </form>

      <div className="calc__result" aria-live="polite">
        {result ? (
          <>
            <div className="calc__price">
              <span className="calc__price-label">Tạm tính (tham khảo)</span>
              <strong>{formatVND(result.total)}</strong>
              <span className="calc__unit">
                ≈ {formatVND(result.unit)}/tem · {result.tier.label}
              </span>
            </div>
            <ul className="calc__breakdown">
              <li>
                <span>Chất liệu</span>
                <b>{result.material.name}</b>
              </li>
              <li>
                <span>Kích thước</span>
                <b>{result.size.name}</b>
              </li>
              <li>
                <span>Số lượng</span>
                <b>{result.qty.toLocaleString("vi-VN")} tem</b>
              </li>
            </ul>
            <a
              className="calc__cta"
              href={zaloHref}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackEvent("price_calc_zalo", {
                  material: result.material.id,
                  size: result.size.id,
                  quantity: result.qty,
                  estimate: result.total,
                })
              }
            >
              Chốt giá chính xác qua Zalo
            </a>
            <p className="calc__note">
              Đây là <b>giá tham khảo</b>. Giá cuối được xác nhận sau khi kiểm tra
              file, số lượng, chất liệu và gia công thực tế.
            </p>
          </>
        ) : (
          <p className="calc__empty">Nhập số lượng để xem giá tham khảo.</p>
        )}
      </div>
    </div>
  );
}
