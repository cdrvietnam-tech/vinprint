export type TetHomeContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  features: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  collectionTitle: string;
  collectionDescription: string;
  collectionCta: { label: string; href: string };
};
export const DEFAULT_TET_HOME: TetHomeContent = {
  eyebrow: "IN ẤN TEM NHÃN – DECAL – ẤN PHẨM",
  titleLine1: "In ấn chuẩn Tết",
  titleLine2: "Nâng tầm thương hiệu",
  subtitle: "Tem nhãn Tết, decal trang trí, hộp quà, túi giấy và\nấn phẩm quảng bá mùa lễ hội.",
  features: ["In sắc nét", "Thiết kế theo yêu cầu", "Linh hoạt số lượng", "Giao hàng toàn quốc"],
  primaryCta: { label: "Báo giá ngay", href: "#nhan-bao-gia" },
  secondaryCta: { label: "Khám phá mẫu Tết", href: "#san-pham-tet" },
  collectionTitle: "Bộ sưu tập tem nhãn Tết 2027",
  collectionDescription: "Đa dạng mẫu mã – thiết kế sẵn – chỉnh sửa theo yêu cầu.",
  collectionCta: { label: "Xem mẫu Tết ngay", href: "#san-pham-tet" },
};
