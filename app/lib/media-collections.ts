export type MediaKind = "image" | "gif" | "video";

export type ManagedMediaItem = {
  id: string;
  kind: MediaKind;
  src: string;
  title: string;
  category: string;
  href: string;
};

export type MediaCollectionId = "hero" | "hot-products" | "gallery";

export function isValidManagedMediaItemId(value: string | null | undefined): value is string {
  return Boolean(value && /^[a-z0-9][a-z0-9-]{2,80}$/i.test(value));
}

export const MEDIA_COLLECTIONS: Array<{ id: MediaCollectionId; title: string; description: string; allowVideo: boolean }> = [
  { id: "hero", title: "Ảnh hero trang chủ", description: "Trình chiếu lớn ở đầu trang", allowVideo: false },
  { id: "hot-products", title: "Sản phẩm đang hot", description: "Dải tự chạy, phóng lớn ảnh, GIF hoặc video ở giữa", allowVideo: true },
  { id: "gallery", title: "Thành phẩm thực tế", description: "Lưới mẫu sản phẩm trên trang chủ", allowVideo: false },
];

export const DEFAULT_MEDIA_COLLECTIONS: Record<MediaCollectionId, ManagedMediaItem[]> = {
  hero: [
    { id: "hero-1", kind: "image", src: "/images/hero-admin/hero-1.png?managed=2", title: "Bộ mỹ phẩm thảo mộc", category: "Hero", href: "/san-pham" },
    { id: "hero-2", kind: "image", src: "/images/hero-admin/hero-2.png?managed=2", title: "Bộ trà sạch", category: "Hero", href: "/san-pham" },
    { id: "hero-3", kind: "image", src: "/images/hero-admin/hero-3.png?managed=2", title: "Bộ trà gừng", category: "Hero", href: "/san-pham" },
    { id: "hero-4", kind: "image", src: "/images/hero-admin/hero-4.png?managed=2", title: "Mật ong Mina", category: "Hero", href: "/san-pham" },
  ],
  "hot-products": [
    { id: "hot-1", kind: "image", src: "/images/hot-products/tra-sua-kim-hieu.png", title: "Trà sữa Kim Hiếu", category: "Tem đồ uống", href: "/san-pham/sticker-trang-tri" },
    { id: "hot-2", kind: "image", src: "/images/hot-products/hu-my-pham-thy-kieu.png", title: "Body cốt ủ mạnh", category: "Tem mỹ phẩm", href: "/san-pham/tem-nhua-chong-nuoc" },
    { id: "hot-3", kind: "image", src: "/images/hot-products/mat-ong-mina.png", title: "Mật ong Mina", category: "Tem thực phẩm", href: "/san-pham/tem-vang" },
    { id: "hot-4", kind: "image", src: "/images/hot-products/tra-sua-kim-hieu.png", title: "Ly đồ uống nổi bật", category: "Sticker chống nước", href: "/san-pham/tem-nhua-chong-nuoc" },
    { id: "hot-5", kind: "image", src: "/images/hot-products/hu-my-pham-thy-kieu.png", title: "Hũ mỹ phẩm cao cấp", category: "Tem nhựa", href: "/san-pham/tem-nhua-trong" },
    { id: "hot-6", kind: "image", src: "/images/hot-products/mat-ong-mina.png", title: "Hũ quà tặng ánh kim", category: "Tem vàng", href: "/san-pham/tem-vang" },
  ],
  gallery: [
    "/images/mockups/cosmetic_bottle.webp",
    "/images/mockups/zip_pouch.webp",
    "/images/mockups/glass_jar.webp",
    "/images/mockups/kraft_box.webp",
    "/images/mockups/plastic_cup.webp",
    "/images/mockups/paper_box.webp",
    "/images/holographic_sticker.webp",
    "/images/products/tem-uv-dtf.webp",
    "/images/products/tem-giay.webp",
    "/images/products/tem-ep-kim.webp",
  ].map((src, index) => ({ id: `gallery-${index + 1}`, kind: "image" as const, src, title: `Mẫu tem VinPrint ${index + 1}`, category: "Thành phẩm", href: "/san-pham" })),
};
