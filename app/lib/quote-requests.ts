export const QUOTE_REQUEST_MAX_BYTES = 64 * 1024;

export const QUOTE_MATERIALS = [
  "Tem giấy",
  "Tem nhựa trắng",
  "Tem nhựa trong",
  "Tem giấy kraft",
  "Tem vàng",
  "Tem bạc",
  "Tem hologram 7 màu",
  "Tem UV DTF",
  "Sticker",
  "Vật liệu khác",
] as const;

export type QuotePriceTier = "retail" | "wholesale";

export type QuoteRequestRecord = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  material: string;
  widthMm: number;
  heightMm: number;
  quantity: number;
  priceTier: QuotePriceTier;
  productSlug: string;
  productTitle: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string;
};
