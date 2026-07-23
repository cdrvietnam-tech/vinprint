export const QUOTE_FILE_MAX_BYTES = 15 * 1024 * 1024;
export const QUOTE_FILE_EXTENSIONS = ["ai", "pdf", "cdr", "eps", "svg", "png", "jpg", "jpeg", "webp", "zip"] as const;
export const QUOTE_FILE_ACCEPT = QUOTE_FILE_EXTENSIONS.map((extension) => `.${extension}`).join(",");

export type QuoteRequestRecord = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  quantity: number;
  productSlug: string;
  productTitle: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
};
