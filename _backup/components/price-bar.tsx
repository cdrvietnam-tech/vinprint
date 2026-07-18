"use client";

import { trackEvent } from "../lib/analytics";

const ZALO_URL = "https://zalo.me/0844998499";

// Bảng giá tham khảo theo mockup. Anh chỉnh số ở đây nếu giá thật thay đổi.
const TIERS = [
  { name: "TEM GIẤY COUCHE", price: "Từ 150đ", unit: "/ tem", note: "Số lượng càng nhiều, giá càng tốt", tone: "lime" },
  { name: "TEM NHỰA A TRẮNG", price: "Từ 250đ", unit: "/ tem", note: "Chống nước · Bền màu", tone: "coral" },
  { name: "TEM TRONG SUỐT", price: "Từ 350đ", unit: "/ tem", note: "Sang trọng · Thẩm mỹ cao", tone: "aqua" },
  { name: "TEM UV DTF NỔI", price: "Từ 450đ", unit: "/ tem", note: "Nổi bật · Không có nền", tone: "violet" },
  { name: "TEM BẠC / VÀNG", price: "Từ 400đ", unit: "/ tem", note: "Cao cấp · Chống giả", tone: "gold" },
];

const FEATURES = [
  "Miễn phí tư vấn",
  "Báo giá trong 5 phút",
  "Không ép đặt hàng",
  "Duyệt mẫu trước khi in",
  "Giao hàng toàn quốc",
];

export default function PriceBar() {
  return (
    <div className="pbar">
      <div className="pbar__head">
        <div>
          <b>BẢNG GIÁ THAM KHẢO</b>
          <small>Giá chưa bao gồm thiết kế · xác nhận chính xác qua Zalo</small>
        </div>
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent("zalo_clicked", { location: "pricebar" })}
        >
          Xem đầy đủ &amp; nhận báo giá
        </a>
      </div>

      <div className="pbar__grid">
        {TIERS.map((tier) => (
          <div className={`pbar__tier pbar__tier--${tier.tone}`} key={tier.name}>
            <span className="pbar__name">{tier.name}</span>
            <strong className="pbar__price">{tier.price}<em>{tier.unit}</em></strong>
            <small className="pbar__note">{tier.note}</small>
          </div>
        ))}
      </div>

      <ul className="pbar__features">
        {FEATURES.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </div>
  );
}
