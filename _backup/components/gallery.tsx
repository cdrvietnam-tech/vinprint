"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { trackEvent } from "../lib/analytics";

type GalleryItem = {
  id: string;
  category: string;
  title: string;
  material: string;
  image: string;
};

// Bộ mẫu để dựng giao diện. Anh thay bằng ảnh thành phẩm thật + đúng danh mục.
const ITEMS: GalleryItem[] = [
  { id: "g1", category: "Mỹ phẩm", title: "Nhãn serum tối giản", material: "Tem nhựa trong", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lklsrilsqsq267" },
  { id: "g2", category: "Trà · Cafe", title: "Tem hũ trà oolong", material: "Tem giấy", image: "https://down-vn.img.susercontent.com/file/407127d75601b611b790bfcf05663f79" },
  { id: "g3", category: "Đồ uống", title: "Logo nổi trên bình", material: "UV DTF", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5membc1" },
  { id: "g4", category: "Mỹ phẩm", title: "Chai dưỡng thể", material: "Tem nhựa chống nước", image: "/images/application-photo.webp" },
  { id: "g5", category: "Thực phẩm", title: "Tem hộp bánh", material: "Tem giấy", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly3shefsnetf63" },
  { id: "g6", category: "Handmade", title: "Sticker cắt bế", material: "Decal giấy", image: "/images/materials-flatlay.webp" },
  { id: "g7", category: "Đồ uống", title: "Ly nhựa mang đi", material: "Tem nhựa", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5mf1tad" },
  { id: "g8", category: "Trà · Cafe", title: "Túi zip đựng cafe", material: "Tem giấy", image: "https://down-vn.img.susercontent.com/file/642690f2753959deb5b48093e7b43680" },
  { id: "g9", category: "Pet", title: "Nhãn snack thú cưng", material: "Tem nhựa", image: "https://down-vn.img.susercontent.com/file/407127d75601b611b790bfcf05663f79" },
  { id: "g10", category: "Mỹ phẩm", title: "Hũ kem ánh kim", material: "Tem vàng", image: "/images/hero-collage.webp" },
  { id: "g11", category: "Thực phẩm", title: "Hũ thủy tinh mật ong", material: "Tem giấy", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5membc1" },
  { id: "g12", category: "Handmade", title: "Nến thơm thủ công", material: "Tem giấy mỹ thuật", image: "/images/materials-flatlay.webp" },
];

const STEP = 6;

export default function Gallery() {
  const categories = useMemo(
    () => ["Tất cả", ...Array.from(new Set(ITEMS.map((i) => i.category)))],
    [],
  );
  const [active, setActive] = useState("Tất cả");
  const [visible, setVisible] = useState(STEP);

  const filtered = useMemo(
    () => (active === "Tất cả" ? ITEMS : ITEMS.filter((i) => i.category === active)),
    [active],
  );

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="gallery">
      <div className="gallery__tabs" role="tablist" aria-label="Lọc thành phẩm theo ngành">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={cat === active}
            className={cat === active ? "gallery__tab gallery__tab--on" : "gallery__tab"}
            onClick={() => {
              setActive(cat);
              setVisible(STEP);
              trackEvent("gallery_filter", { category: cat });
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery__grid">
        {shown.map((item) => (
          <figure className="gallery__card" key={item.id}>
            <img src={item.image} alt={`${item.title} — ${item.material}`} loading="lazy" decoding="async" />
            <figcaption>
              <span className="gallery__cat">{item.category}</span>
              <b>{item.title}</b>
              <small>{item.material}</small>
            </figcaption>
          </figure>
        ))}
      </div>

      {hasMore && (
        <div className="gallery__more">
          <button
            type="button"
            className="gallery__more-btn"
            onClick={() => {
              setVisible((v) => v + STEP);
              trackEvent("gallery_load_more", { category: active });
            }}
          >
            Xem thêm thành phẩm
          </button>
        </div>
      )}
    </div>
  );
}
