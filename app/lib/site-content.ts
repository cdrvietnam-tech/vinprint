// Mô hình nội dung trang chủ VinPrint có thể chỉnh sửa qua trang quản trị.
// Nội dung thật lưu dạng JSON trên R2 (settings/home-content.json) và được
// hợp nhất (merge) với DEFAULT_SITE_CONTENT bên dưới. Nếu thiếu field nào,
// trang tự dùng giá trị mặc định — không bao giờ trắng trang.

export type LinkItem = { label: string; href: string };
export type StatItem = { value: string; label: string };
export type PricingPosterText = { title: string; note: string; details: string[] };
export type ProcessStep = { title: string; desc: string };
export type ReviewItem = { name: string; platform: string; text: string };
export type FaqItem = { q: string; a: string };
export type CtaBadge = { text: string; ok: boolean };

export type SiteContent = {
  contact: {
    phone: string;        // dạng bấm gọi, ví dụ 0844998499
    phoneDisplay: string; // dạng hiển thị, ví dụ 0844 998 499
    zaloUrl: string;
    address: string;
    hoursWeekday: string;
    hoursWeekend: string;
  };
  header: {
    tagline: string;
    menu: LinkItem[];
    ctaComboLabel: string;
    ctaZaloLabel: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    features: string[];
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    ratingValue: string;
    ratingText: string;
    ratingHref: string;
  };
  stats: StatItem[];
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    quoteCtaLabel: string;
    posters: PricingPosterText[];
    benefits: string[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  reviews: {
    title: string;
    ratingValue: string;
    ratingCount: string;
    items: ReviewItem[];
  };
  faq: {
    title: string;
    items: FaqItem[];
    qrTitle: string;
    qrSubtitle: string;
    qrCtaLabel: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    badges: CtaBadge[];
    zaloLabel: string;
    comboLabel: string;
    trustText: string;
  };
  footer: {
    about: string;
    productLinks: LinkItem[];
    companyLinks: LinkItem[];
    copyright: string;
  };
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  contact: {
    phone: "0844998499",
    phoneDisplay: "0844 998 499",
    zaloUrl: "https://zalo.me/0844998499",
    address: "Số 13, Đường Thạnh Lộc 42, An Phú Đông, TP.HCM",
    hoursWeekday: "Thứ 2–Thứ 7: Mở cửa 24/24",
    hoursWeekend: "Chủ nhật: Mở cửa 24/24",
  },
  header: {
    tagline: "In nhanh · Chuẩn đẹp · Giá tốt",
    menu: [
      { label: "Trang chủ", href: "/#trang-chu" },
      { label: "Tất cả sản phẩm", href: "/san-pham" },
      { label: "Combo ưu đãi", href: "/#bang-gia" },
      { label: "Mẫu thực tế", href: "/#mau-thuc-te" },
      { label: "Quy trình", href: "/#quy-trinh" },
      { label: "Đánh giá", href: "/#danh-gia" },
      { label: "Cẩm nang in ấn", href: "/blog" },
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Liên hệ", href: "/lien-he" },
    ],
    ctaComboLabel: "Xem combo",
    ctaZaloLabel: "Nhắn Zalo",
  },
  hero: {
    eyebrow: "In ấn các loại tem nhãn và ấn phẩm",
    titleLine1: "XƯỞNG IN SIÊU TỐC",
    titleLine2: "In nhanh - Chuẩn đẹp - Giá tốt",
    subtitle:
      "VinPrint giúp sản phẩm của bạn nổi bật hơn, chuyên nghiệp hơn và bán chạy hơn.",
    features: [
      "Hỗ trợ thiết kế đơn từ 200.000đ",
      "Chất liệu cao cấp - Bền đẹp",
      "In sắc nét - Chuẩn màu",
      "Số lượng ít vẫn nhận",
    ],
    primaryCta: { label: "Nhắn Zalo chốt in →", href: "https://zalo.me/0844998499" },
    secondaryCta: { label: "Xem combo siêu hời", href: "#bang-gia" },
    ratingValue: "4.9/5",
    ratingText: "Hơn 32000 lượt đánh giá cho shop ở Shopee",
    ratingHref: "https://shopee.vn/chaucay_senda",
  },
  stats: [
    { value: "90.000+", label: "Khách hàng" },
    { value: "211.000+", label: "Mẫu tem đã thực hiện" },
    { value: "100K+", label: "Đơn hàng đã in" },
    { value: "4.9/5", label: "Đánh giá trung bình" },
  ],
  pricing: {
    badge: "Bảng giá tại xưởng",
    title: "Bảng giá in tem nhãn",
    subtitle:
      "Chọn bảng giá phù hợp và bấm vào ảnh để xem rõ từng chi tiết. Kích thước khác hoặc số lượng lớn, VinPrint báo giá theo đúng quy cách cần in.",
    disclaimer:
      "Giá và ưu đãi được xác nhận lại theo vật liệu, quy cách, số lượng và thời điểm đặt in.",
    quoteCtaLabel: "Nhận báo giá sỉ",
    posters: [
      {
        title: "Bảng giá tem nhãn tổng hợp",
        note: "Combo tem giấy và các ứng dụng phổ biến",
        details: [
          "1.000 tem tròn 3 cm: 99.000đ",
          "1.000 tem tròn 4 cm: 141.000đ",
          "1.000 tem tròn 5 cm: 229.000đ",
          "1.000 tem tròn 6 cm: 320.000đ",
          "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
          "Poster quảng bá giá tận xưởng, rẻ hơn đến 30% so với thị trường.",
        ],
      },
      {
        title: "Bảng giá tem nhãn tham khảo",
        note: "Tem giấy, tem nhựa và nhiều kiểu cắt bế",
        details: [
          "1.000 tem tròn 3 cm: 99.000đ",
          "1.000 tem tròn 4 cm: 141.000đ",
          "1.000 tem tròn 5 cm: 229.000đ",
          "1.000 tem tròn 6 cm: 320.000đ",
          "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
          "Giá có thể thay đổi tùy theo chất liệu và thiết kế.",
        ],
      },
      {
        title: "Bảng giá tem tròn",
        note: "Combo 1.000 tem theo đường kính",
        details: [
          "1.000 tem tròn 3 cm: 99.000đ",
          "1.000 tem tròn 4 cm: 141.000đ",
          "1.000 tem tròn 5 cm: 229.000đ",
          "1.000 tem tròn 6 cm: 320.000đ",
          "Ưu đãi trong poster: miễn phí thiết kế mẫu và freeship đơn từ 500.000đ.",
        ],
      },
      {
        title: "Bảng giá sticker UV DTF",
        note: "Khổ tờ và khổ mét cho nhu cầu lấy liền",
        details: [
          "Tờ A5: 25.000đ",
          "Tờ A4: 45.000đ",
          "Tờ A3: 80.000đ",
          "1 mét: 250.000đ/m",
          "3 mét: 200.000đ/m",
          "5 mét: 185.000đ/m",
          "Đơn giá chưa bao gồm VAT và phí vận chuyển.",
          "Hỗ trợ thiết kế miễn phí cho đơn từ 1 mét trở lên.",
        ],
      },
    ],
    benefits: [
      "Tư vấn miễn phí",
      "Duyệt mẫu trước khi in",
      "Hỗ trợ thiết kế đơn từ 200.000đ",
      "Tối đa 3 lần chỉnh sửa",
      "Freeship đơn từ 500.000đ",
    ],
  },
  process: {
    title: "Quy trình đặt in đơn giản",
    subtitle: "Chỉ 5 bước - Nhanh chóng và chuyên nghiệp",
    steps: [
      { title: "Gửi yêu cầu", desc: "Gửi file hoặc ý tưởng trực tiếp qua Zalo" },
      { title: "Báo giá nhanh", desc: "Nhận báo giá chỉ sau vài phút" },
      { title: "Thiết kế & Duyệt", desc: "Đơn từ 200.000đ, tối đa 3 lần chỉnh sửa" },
      { title: "In ấn chất lượng", desc: "In bằng máy hiện đại, kiểm tra kỹ lưỡng" },
      { title: "Giao hàng tận nơi", desc: "Giao hàng nhanh chóng, đúng hẹn, toàn quốc" },
    ],
  },
  reviews: {
    title: "Khách hàng nói gì về VinPrint",
    ratingValue: "4.9/5",
    ratingCount: "32k+ đánh giá",
    items: [
      { name: "Nguyễn Thị Hồng", platform: "Google", text: "Tem in rất đẹp, màu sắc chuẩn, giao hàng nhanh, tư vấn nhiệt tình. Sẽ ủng hộ lâu dài!" },
      { name: "Trần Minh Tuấn", platform: "Shopee", text: "In tem UV DTF nổi cực đẹp, chống nước tốt, đóng ngay gửi cẩn thận." },
      { name: "Lê Hoàng Yến", platform: "Facebook", text: "Hỗ trợ chỉnh sửa file nhanh, duyệt mẫu kỹ trước khi in. Chất lượng in quá tốt!" },
    ],
  },
  faq: {
    title: "Câu hỏi thường gặp",
    items: [
      { q: "Có in tem số lượng ít không?", a: "Có. VinPrint hỗ trợ in từ số lượng ít (chỉ từ vài chục tem), giúp các shop nhỏ tiết kiệm chi phí ban đầu và dễ dàng thử mẫu trước khi sản xuất số lượng lớn." },
      { q: "Thời gian hoàn thành là bao lâu?", a: "Chỉ từ 1–2 ngày làm việc sau khi chốt thiết kế. Có hỗ trợ in nhanh lấy ngay trong ngày nếu cần gấp — liên hệ Zalo để xác nhận." },
      { q: "Tem nhãn có chống nước không?", a: "Tem nhựa PVC dẻo dai chống nước 100%, bền màu, phù hợp chai lọ, mỹ phẩm và đồ uống. Tem giấy rẻ hơn nhưng không chống nước, phù hợp bao bì khô." },
      { q: "Chưa có file thiết kế thì sao?", a: "VinPrint hỗ trợ thiết kế cho đơn hàng từ 200.000đ, tối đa 3 lần chỉnh sửa. Bạn chỉ cần gửi logo, nội dung và ý tưởng qua Zalo để được tư vấn." },
      { q: "Có giao hàng toàn quốc không?", a: "VinPrint hỗ trợ giao hàng nhanh toàn quốc qua các đơn vị vận chuyển uy tín. Tem được đóng gói chống nước cẩn thận, đảm bảo nguyên vẹn khi đến tay bạn." },
    ],
    qrTitle: "Quét Zalo nhận tư vấn",
    qrSubtitle: "Báo giá nhanh - Không chờ lâu!",
    qrCtaLabel: "Mở Zalo ngay",
  },
  finalCta: {
    title: "Bạn đã có file thiết kế?",
    subtitle: "Gửi ngay để nhận báo giá trong 5 phút!",
    badges: [
      { text: "Báo giá nhanh", ok: true },
      { text: "Duyệt mẫu trước khi in", ok: true },
      { text: "Không ép đặt hàng", ok: false },
    ],
    zaloLabel: "Nhắn Zalo chốt in",
    comboLabel: "Xem combo siêu hời",
    trustText: "Hơn 90.000 khách hàng đã tin tưởng VinPrint",
  },
  footer: {
    about: "In tem nhãn theo yêu cầu tại TP.HCM. Hỗ trợ thiết kế, nhận số lượng ít và giao hàng toàn quốc.",
    productLinks: [
      { label: "Tem UV DTF", href: "/san-pham/tem-uv-dtf" },
      { label: "Tem giấy", href: "/san-pham/tem-giay" },
      { label: "Tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc" },
      { label: "Tem hologram", href: "/san-pham/tem-7-mau" },
    ],
    companyLinks: [
      { label: "Giới thiệu", href: "/gioi-thieu" },
      { label: "Liên hệ", href: "/lien-he" },
      { label: "Chính sách", href: "/chinh-sach" },
      { label: "Bảo hành", href: "/bao-hanh" },
      { label: "Case study", href: "/case-study" },
      { label: "Cẩm nang tem nhãn", href: "/blog" },
      { label: "Quy trình biên soạn", href: "/quy-trinh-bien-soan" },
    ],
    copyright: "© 2026 VinPrint. In ấn siêu tốc.",
  },
};

export const SITE_CONTENT_KEY = "settings/home-content.json";

// Hợp nhất nội dung lưu trên R2 (có thể là một phần) với mặc định.
// Mảng: nếu người dùng đã lưu mảng thì dùng nguyên mảng đó (cho phép thêm/bớt phần tử).
export function mergeSiteContent(
  partial: unknown,
  base: SiteContent = DEFAULT_SITE_CONTENT,
): SiteContent {
  if (!partial || typeof partial !== "object") return base;
  const source = partial as Record<string, unknown>;
  const result = {} as Record<string, unknown>;
  const baseRecord = base as unknown as Record<string, unknown>;

  for (const key of Object.keys(baseRecord)) {
    const baseValue = baseRecord[key];
    const overrideValue = source[key];

    if (overrideValue === undefined || overrideValue === null) {
      result[key] = baseValue;
    } else if (Array.isArray(baseValue)) {
      result[key] = Array.isArray(overrideValue) ? overrideValue : baseValue;
    } else if (typeof baseValue === "object" && typeof overrideValue === "object") {
      result[key] = mergeSiteContent(overrideValue, baseValue as SiteContent);
    } else {
      result[key] = overrideValue;
    }
  }

  return result as unknown as SiteContent;
}

// Kiểm tra dữ liệu có đúng khuôn SiteContent không: cùng kiểu ở mỗi trường,
// mảng thì mọi phần tử phải khớp khuôn phần tử mặc định. Dùng khi GHI ở worker
// để một payload sai cấu trúc không bao giờ được lưu (tránh vỡ trang công khai).
function conformsToTemplate(value: unknown, template: unknown): boolean {
  if (Array.isArray(template)) {
    return Array.isArray(value) && value.every((element) => conformsToTemplate(element, template[0]));
  }
  if (template !== null && typeof template === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
    const record = value as Record<string, unknown>;
    const shape = template as Record<string, unknown>;
    return Object.keys(shape).every((key) => conformsToTemplate(record[key], shape[key]));
  }
  return typeof value === typeof template;
}

export function isValidSiteContent(data: unknown): boolean {
  return conformsToTemplate(data, DEFAULT_SITE_CONTENT);
}
