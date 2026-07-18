"use client";

/* eslint-disable @next/next/no-img-element */
import { trackEvent } from "../lib/analytics";

type TemType = {
  name: string;
  sub: string;
  image: string;
  badge?: string;
  slug: string;
};

// 10 loại tem theo mockup. Ảnh dùng tạm từ sản phẩm hiện có — anh thay ảnh thật khi có.
const TYPES: TemType[] = [
  { name: "Tem giấy", sub: "Decal couche", image: "https://down-vn.img.susercontent.com/file/407127d75601b611b790bfcf05663f79", badge: "Bán chạy", slug: "tem-giay" },
  { name: "Tem UV DTF", sub: "Nổi không nền", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5membc1", badge: "UV DTF", slug: "tem-uv-dtf" },
  { name: "Tem nhựa", sub: "Chống nước", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ly3shefsnetf63", badge: "Chống nước", slug: "tem-nhua-chong-nuoc" },
  { name: "Tem bạc", sub: "Decal bạc", image: "https://down-vn.img.susercontent.com/file/642690f2753959deb5b48093e7b43680", slug: "tem-bac" },
  { name: "Tem trong suốt", sub: "Decal trong", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lklsrilsqsq267", slug: "tem-nhua-trong" },
  { name: "Tem hologram", sub: "7 màu", image: "/images/materials-flatlay.webp", slug: "tem-7-mau" },
  { name: "Tem kraft", sub: "Giấy kraft", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkws5mf1tad", slug: "tem-giay" },
  { name: "Tem ép kim", sub: "Vàng / Bạc", image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7uwkwspk78x4c", slug: "tem-vang" },
  { name: "Tem phản quang", sub: "Phản sáng", image: "/images/application-photo.webp", slug: "tem-bac" },
  { name: "Tem 7 màu", sub: "Hologram", image: "/images/hero-collage.webp", badge: "Mới", slug: "tem-7-mau" },
];

export default function TemTypes() {
  return (
    <div className="ttypes">
      <div className="ttypes__track">
        {TYPES.map((t) => (
          <a
            className="ttypes__card"
            href={`/san-pham/${t.slug}`}
            key={t.name}
            onClick={() => trackEvent("tem_type_clicked", { slug: t.slug })}
          >
            {t.badge && <span className="ttypes__badge">{t.badge}</span>}
            <span className="ttypes__thumb">
              <img src={t.image} alt={`${t.name} — ${t.sub}`} loading="lazy" decoding="async" />
            </span>
            <b className="ttypes__name">{t.name}</b>
            <small className="ttypes__sub">{t.sub}</small>
          </a>
        ))}
      </div>
      <p className="ttypes__hint">Kéo ngang để xem tất cả loại tem →</p>
    </div>
  );
}
