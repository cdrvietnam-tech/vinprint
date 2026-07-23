export const productSources = {
  label:
    "https://shopee.vn/H%E1%BB%8EA-T%E1%BB%90C-In-tem-nh%C3%A3n-gi%E1%BA%A5y-sticker-decal-trong-decal-nh%E1%BB%B1a-ch%E1%BB%91ng-n%C6%B0%E1%BB%9Bc-C%C3%93-NH%E1%BA%ACN-S%E1%BB%90-L%C6%AF%E1%BB%A2NG-%C3%8DT-h%E1%BB%97-tr%E1%BB%A3-thi%E1%BA%BFt-k%E1%BA%BF-theo-y%C3%AAu-c%E1%BA%A7u-i.234032873.11297404745",
  uv:
    "https://shopee.vn/Tem-d%C3%A1n-UV-DTF-tem-kh%C3%B4ng-vi%E1%BB%81n-tem-sticker-UV-d%C3%A1n-tr%C3%AAn-G%E1%BB%91m-S%E1%BB%A9-Th%E1%BB%A7y-Tinh-Kim-Lo%E1%BA%A1i-G%E1%BB%97-Simila-Da-H%E1%BB%99p-Gi%E1%BA%A5y-%E1%BB%90p-l%C6%B0ng.-i.234032873.28331072712",
  uvBrand:
    "https://shopee.vn/Tem-UV-n%E1%BB%95i-Tem-DTF-logo-th%C6%B0%C6%A1ng-hi%E1%BB%87u-%E2%80%93-Tem-d%C3%A1n-chai-l%E1%BB%8D-h%E1%BB%99p-bao-b%C3%AC-s%E1%BA%A3n-ph%E1%BA%A9m-i.234032873.42322499962",
  supplement:
    "https://shopee.vn/in-Tem-ph%E1%BB%A5-d%C3%A1n-s%E1%BA%A3n-ph%E1%BA%A9m-%28c%C3%B3-nh%E1%BA%ADn-sl-%C3%ADt-in-theo-y%C3%AAu-c%E1%BA%A7u%29-H%E1%BB%8EA-T%E1%BB%90C-tem-c%C3%B3-keo-tem-d%C3%A1n-ph%E1%BB%A5-t%E1%BB%B1-d%C3%ADnh-i.234032873.40202319502",
};

export type Product = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  benefit: string;
  uses: string[];
  priceLabel: string;
  image: string;
  source?: string;
  tone: string;
};

export const products: Product[] = [
  {
    slug: "tem-uv-dtf",
    name: "Tem UV DTF nổi",
    eyebrow: "Không nền · Nổi 3D",
    description:
      "Logo nổi bóng như in trực tiếp, không có nền thừa và dán được trên nhiều bề mặt cứng.",
    benefit: "Độ nổi rõ, thành phẩm gọn và tạo cảm giác cao cấp.",
    uses: ["Bình giữ nhiệt", "Ly sứ", "Chai lọ", "Hộp giấy", "Kim loại"],
    priceLabel: "Từ 25.000đ / A5",
    image: "/images/products/tem-uv-dtf.webp",
    source: productSources.uv,
    tone: "violet",
  },
  {
    slug: "tem-giay",
    name: "Tem nhãn giấy",
    eyebrow: "Tiết kiệm · Sắc nét",
    description:
      "Giải pháp tối ưu chi phí cho bao bì khô, hộp giấy, túi kraft và sản phẩm bán nhanh.",
    benefit: "Giá tốt, lên màu đẹp và linh hoạt khi cần số lượng ít.",
    uses: ["Hộp bánh", "Túi kraft", "Tem cảm ơn", "Bao bì khô"],
    priceLabel: "Từ 10.000đ / tờ",
    image: "/images/products/tem-giay.webp",
    source: productSources.label,
    tone: "lime",
  },
  {
    slug: "tem-nhua-chong-nuoc",
    name: "Tem nhựa chống nước",
    eyebrow: "Bền ẩm · Dễ vệ sinh",
    description:
      "Tem PVC phù hợp sản phẩm thường xuyên tiếp xúc nước, tủ lạnh hoặc môi trường ẩm.",
    benefit: "Chống nước tốt hơn tem giấy và duy trì màu sắc lâu hơn.",
    uses: ["Mỹ phẩm", "Đồ uống", "Đông lạnh", "Dán xe", "Ngoài trời"],
    priceLabel: "Từ 15.000đ / A4",
    image: "/images/products/tem-nhua-chong-nuoc.webp",
    source: productSources.label,
    tone: "coral",
  },
  {
    slug: "tem-nhua-trong",
    name: "Tem nhựa trong",
    eyebrow: "Nhìn xuyên nền · Tinh gọn",
    description:
      "Giữ lại màu và chất liệu của chai lọ phía sau, phù hợp thiết kế tối giản hoặc sản phẩm trong suốt.",
    benefit: "Nhãn hòa vào bao bì, tạo cảm giác sạch và hiện đại.",
    uses: ["Chai serum", "Ly nhựa", "Hũ mỹ phẩm", "Bao bì trong"],
    priceLabel: "Gửi file để xác nhận",
    image: "/images/products/tem-nhua-trong.webp",
    source: productSources.label,
    tone: "aqua",
  },
  {
    slug: "tem-bac",
    name: "Tem bạc ánh kim",
    eyebrow: "Kim loại · Chuyên nghiệp",
    description:
      "Bề mặt ánh bạc phản sáng, phù hợp nhãn thông số và thương hiệu cần cảm giác kỹ thuật, bền chắc.",
    benefit: "Tạo hiệu ứng kim loại nổi bật dưới ánh sáng.",
    uses: ["Máy móc", "Điện tử", "Thông số", "Logo cao cấp"],
    priceLabel: "Gửi file để xác nhận",
    image: "/images/products/tem-bac.webp",
    tone: "silver",
  },
  {
    slug: "tem-vang",
    name: "Tem vàng ánh kim",
    eyebrow: "Ấm sang · Bắt sáng",
    description:
      "Hiệu ứng vàng giúp logo và chi tiết trang trí nổi bật trên bao bì quà tặng hoặc sản phẩm cao cấp.",
    benefit: "Tăng cảm giác sang trọng mà không cần thay toàn bộ bao bì.",
    uses: ["Quà tặng", "Mỹ phẩm", "Nến thơm", "Hộp cao cấp"],
    priceLabel: "Gửi file để xác nhận",
    image: "/images/products/tem-ep-kim.webp",
    source: productSources.uv,
    tone: "gold",
  },
  {
    slug: "tem-7-mau",
    name: "Tem hologram 7 màu",
    eyebrow: "Đổi màu · Khó bỏ qua",
    description:
      "Bề mặt chuyển sắc theo góc nhìn, phù hợp tem niêm phong và thiết kế cần hiệu ứng thị giác mạnh.",
    benefit: "Thu hút ánh nhìn và tạo dấu hiệu nhận diện khác biệt.",
    uses: ["Niêm phong", "Mỹ phẩm", "Phụ kiện", "Sản phẩm giới hạn"],
    priceLabel: "Gửi file để xác nhận",
    image: "/images/holographic_sticker.webp",
    tone: "holo",
  },
  {
    slug: "tem-bao-hanh",
    name: "Tem bảo hành",
    eyebrow: "Niêm phong · Quản lý",
    description:
      "Tem vỡ, tem dai hoặc tem đánh dấu thời gian giúp kiểm soát bảo hành và tình trạng sản phẩm.",
    benefit: "Gọn, dễ kiểm tra và có thể thiết kế theo nhận diện riêng.",
    uses: ["Điện tử", "Linh kiện", "Thiết bị", "Niêm phong hộp"],
    priceLabel: "Gửi quy cách để xác nhận",
    image: "/images/products/tem-nhua-chong-nuoc.webp",
    tone: "ink",
  },
  {
    slug: "tem-phu-san-pham",
    name: "Tem phụ sản phẩm",
    eyebrow: "Đủ thông tin · Dễ đọc",
    description:
      "Bổ sung thành phần, công dụng, hướng dẫn, đơn vị chịu trách nhiệm và xuất xứ cho sản phẩm.",
    benefit: "Bố cục rõ ràng, ưu tiên khả năng đọc ở kích thước nhỏ.",
    uses: ["Hàng nhập", "Mỹ phẩm", "Thực phẩm", "Đồ gia dụng"],
    priceLabel: "Từ 180đ / tem",
    image: "/images/products/tem-nhua-trong.webp",
    source: productSources.supplement,
    tone: "blue",
  },
  {
    slug: "sticker-trang-tri",
    name: "Sticker trang trí",
    eyebrow: "Cắt bế · Cá tính",
    description:
      "Sticker logo, nhân vật hoặc hình trang trí cắt bế theo mẫu, dùng trên nhiều vật dụng hằng ngày.",
    benefit: "Dễ ứng dụng, màu sắc bắt mắt và linh hoạt theo bộ sưu tập.",
    uses: ["Laptop", "Vali", "Nón bảo hiểm", "Xe", "Bình nước"],
    priceLabel: "Theo kích thước & số lượng",
    image: "/images/products/tem-nhua-chong-nuoc.webp",
    tone: "pink",
  },
];

export const productBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product]),
) as Record<string, Product>;
