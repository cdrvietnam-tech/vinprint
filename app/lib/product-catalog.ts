export type ProductCatalogCategoryKey = "all" | "labels" | "office" | "advertising" | "packaging";

export type ProductCatalogItem = {
  id: string;
  name: string;
  href: string | null;
  image: string;
};

export type ProductCatalogGroup = {
  key: Exclude<ProductCatalogCategoryKey, "all">;
  title: string;
  description: string;
  tone: string;
  items: ProductCatalogItem[];
};

export const PRODUCT_CATALOG_GROUPS: ProductCatalogGroup[] = [
  {
    key: "labels",
    title: "Tem nhãn dán sản phẩm",
    description: "Đủ chất liệu cho chai lọ, hộp, túi, mỹ phẩm, thực phẩm và đồ uống.",
    tone: "from-orange-100 to-rose-50 text-orange-800",
    items: [
      { id: "catalog-tem-giay", name: "Tem giấy", href: "/san-pham/tem-giay", image: "/images/products/tem-giay.webp" },
      { id: "catalog-tem-nhua-chong-nuoc", name: "Tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc", image: "/images/products/tem-nhua-chong-nuoc.webp" },
      { id: "catalog-tem-giay-kraft", name: "Tem giấy kraft", href: "/san-pham/tem-giay", image: "/images/mockups/kraft_box.webp" },
      { id: "catalog-tem-trong", name: "Tem trong", href: "/san-pham/tem-nhua-trong", image: "/images/products/tem-nhua-trong.webp" },
      { id: "catalog-sticker-trang-tri", name: "Sticker trang trí", href: "/san-pham/sticker-trang-tri", image: "/images/products/tem-nhua-chong-nuoc.webp" },
      { id: "catalog-tem-vang", name: "Tem vàng", href: "/san-pham/tem-vang", image: "/images/products/tem-ep-kim.webp" },
      { id: "catalog-tem-bac", name: "Tem bạc", href: "/san-pham/tem-bac", image: "/images/products/tem-bac.webp" },
      { id: "catalog-tem-uv-dtf", name: "Tem UV DTF", href: "/san-pham/tem-uv-dtf", image: "/images/products/tem-uv-dtf.webp" },
      { id: "catalog-tem-hologram", name: "Tem hologram", href: "/san-pham/tem-7-mau", image: "/images/holographic_sticker.webp" },
      { id: "catalog-tem-bao-hanh", name: "Tem bảo hành", href: "/san-pham/tem-bao-hanh", image: "/images/products/tem-bac.webp" },
      { id: "catalog-tem-phu-san-pham", name: "Tem phụ sản phẩm", href: "/san-pham/tem-phu-san-pham", image: "/images/products/tem-nhua-trong.webp" },
    ],
  },
  {
    key: "office",
    title: "Ấn phẩm văn phòng",
    description: "Bộ ấn phẩm đồng bộ giúp thương hiệu xuất hiện chuyên nghiệp trong mọi giao dịch.",
    tone: "from-blue-100 to-cyan-50 text-blue-800",
    items: [
      { id: "catalog-in-catalog", name: "In catalog", href: null, image: "/images/hero-admin/hero-1.png" },
      { id: "catalog-in-card-visit", name: "In card visit", href: null, image: "/images/materials-flatlay.webp" },
      { id: "catalog-in-voucher", name: "In voucher", href: null, image: "/images/hero-admin/hero-2.png" },
      { id: "catalog-in-bao-thu", name: "In bao thư", href: null, image: "/images/mockups/paper_box.webp" },
      { id: "catalog-in-folder", name: "In folder", href: null, image: "/images/hero-admin/hero-3.png" },
      { id: "catalog-in-hoa-don", name: "In hóa đơn", href: null, image: "/images/materials-flatlay.webp" },
      { id: "catalog-in-tieu-de-thu", name: "In tiêu đề thư", href: null, image: "/images/hero-admin/hero-4.png" },
    ],
  },
  {
    key: "advertising",
    title: "Ấn phẩm quảng cáo",
    description: "Truyền tải ưu đãi và thông tin bán hàng rõ ràng tại điểm bán hoặc sự kiện.",
    tone: "from-violet-100 to-fuchsia-50 text-violet-800",
    items: [
      { id: "catalog-in-to-roi", name: "In tờ rơi", href: null, image: "/images/hero-admin/hero-2.png" },
      { id: "catalog-in-brochure", name: "In brochure", href: null, image: "/images/hero-admin/hero-1.png" },
      { id: "catalog-in-poster", name: "In poster", href: null, image: "/images/hero-products.webp" },
      { id: "catalog-in-menu", name: "In menu", href: null, image: "/images/materials-flatlay.webp" },
      { id: "catalog-in-standee", name: "In standee", href: null, image: "/images/application-photo.webp" },
      { id: "catalog-in-phieu-bao-hanh", name: "In phiếu bảo hành", href: null, image: "/images/products/tem-bac.webp" },
    ],
  },
  {
    key: "packaging",
    title: "Bao bì & phụ kiện",
    description: "Hoàn thiện trải nghiệm mở hộp và tăng nhận diện thương hiệu ngay từ bao bì.",
    tone: "from-emerald-100 to-lime-50 text-emerald-800",
    items: [
      { id: "catalog-in-tui-giay", name: "In túi giấy", href: null, image: "/images/hero-admin/hero-3.png" },
      { id: "catalog-in-hop-giay", name: "In hộp giấy", href: null, image: "/images/mockups/paper_box.webp" },
      { id: "catalog-in-the-treo", name: "In thẻ treo", href: null, image: "/images/products/tem-giay.webp" },
      { id: "catalog-in-tag-san-pham", name: "In tag sản phẩm", href: null, image: "/images/mockups/kraft_box.webp" },
      { id: "catalog-in-giay-goi", name: "In giấy gói", href: null, image: "/images/materials-flatlay.webp" },
    ],
  },
];
