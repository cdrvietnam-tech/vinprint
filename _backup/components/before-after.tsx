"use client";

import { useState } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { trackEvent } from "../lib/analytics";

/**
 * Một cặp so sánh Trước/Sau.
 * LƯU Ý: hãy thay `before`/`after` bằng ảnh thật của cùng một sản phẩm
 * (ảnh chưa dán tem và ảnh đã dán tem) để hiệu ứng thuyết phục nhất.
 */
export type ComparePair = {
  id: string;
  label: string;
  category: string;
  before: string;
  after: string;
  alt: string;
};

const DEFAULT_PAIRS: ComparePair[] = [
  {
    id: "chai-my-pham",
    label: "Chai mỹ phẩm",
    category: "Tem nhựa chống nước",
    before: "/images/application-photo.webp",
    after: "https://down-vn.img.susercontent.com/file/407127d75601b611b790bfcf05663f79",
    alt: "So sánh chai mỹ phẩm trước và sau khi dán tem nhãn VinPrint",
  },
  {
    id: "ly-binh",
    label: "Ly · Bình giữ nhiệt",
    category: "UV DTF không nền",
    before: "/images/materials-flatlay.webp",
    after: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5membc1",
    alt: "So sánh ly, bình trước và sau khi dán tem UV DTF nổi",
  },
  {
    id: "hop-giay",
    label: "Hộp giấy · Túi kraft",
    category: "Tem giấy sắc nét",
    before: "/images/hero-collage.webp",
    after: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lklsrilsqsq267",
    alt: "So sánh hộp giấy trước và sau khi dán tem giấy in màu",
  },
];

export default function BeforeAfter({
  pairs = DEFAULT_PAIRS,
}: {
  pairs?: ComparePair[];
}) {
  const [active, setActive] = useState(pairs[0]?.id ?? "");
  const current = pairs.find((pair) => pair.id === active) ?? pairs[0];

  if (!current) return null;

  return (
    <div className="ba">
      <div className="ba__tabs" role="tablist" aria-label="Chọn sản phẩm để so sánh">
        {pairs.map((pair) => (
          <button
            key={pair.id}
            type="button"
            role="tab"
            aria-selected={pair.id === active}
            className={pair.id === active ? "ba__tab ba__tab--on" : "ba__tab"}
            onClick={() => {
              setActive(pair.id);
              trackEvent("before_after_switch", { pair: pair.id });
            }}
          >
            {pair.label}
          </button>
        ))}
      </div>

      <div className="ba__stage">
        <span className="ba__badge ba__badge--before">TRƯỚC</span>
        <span className="ba__badge ba__badge--after">SAU</span>
        <ReactCompareSlider
          className="ba__slider"
          transition="0.25s ease-out"
          itemOne={
            <ReactCompareSliderImage
              src={current.before}
              alt={`Trước: ${current.alt}`}
              style={{ objectFit: "cover" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={current.after}
              alt={`Sau: ${current.alt}`}
              style={{ objectFit: "cover" }}
            />
          }
        />
      </div>

      <p className="ba__hint">
        <span className="ba__chip">{current.category}</span>
        Kéo thanh trượt để thấy khác biệt — dùng chuột hoặc chạm trên điện thoại.
      </p>
    </div>
  );
}
