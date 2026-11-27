// Tiện ích cho ô "PDF sang PNG" (miễn phí, chạy hoàn toàn trên trình duyệt của khách — file không rời máy).
// Phần tính toán thuần (không đụng DOM) để test được bằng node: tests/pdfToPngTile.test.js

// Bộ đọc PDF đặt sẵn ở client/public/vendor (không qua bundler): chỉ tải khi khách mở ô này.
export const PDF_ENGINE_BASE = '/vendor/pdfjs-4.10.38';

export const PDF_MAX_FILE_BYTES = 200 * 1024 * 1024;
export const PDF_MAX_PAGES_PER_FILE = 300;

// Mức nét cho khách chọn. PDF dùng đơn vị 72 điểm/inch nên tỉ lệ vẽ = dpi / 72.
export const PDF_DPI_PRESETS = [
  { dpi: 96, label: 'Xem màn hình', hint: 'Nhẹ, gửi Zalo/Facebook' },
  { dpi: 150, label: 'Nét', hint: 'Đăng web, trình chiếu' },
  { dpi: 300, label: 'In ấn', hint: 'Chuẩn in 300 DPI' },
  { dpi: 600, label: 'Siêu nét', hint: 'In khổ lớn, chữ nhỏ' }
];
export const PDF_DEFAULT_DPI = 150;
const THUMB_MAX_SIDE = 480;

// Giới hạn kích thước ảnh mà trình duyệt vẽ được (điện thoại thấp hơn máy tính nhiều).
export const CANVAS_LIMITS = {
  desktop: { maxSide: 16000, maxArea: 90_000_000 },
  mobile: { maxSide: 4096, maxArea: 16_000_000 }
};

/**
 * Đổi chuỗi chọn trang ("1-3, 5, 8-") thành danh sách số trang tăng dần, không trùng.
 * Chuỗi rỗng = tất cả các trang. Trả { pages, error }.
 */
export function parsePageRange(input, totalPages) {
  const total = Math.max(0, Math.floor(Number(totalPages) || 0));
  const text = String(input ?? '').trim();
  const all = () => Array.from({ length: total }, (_, i) => i + 1);
  if (!text) return { pages: all(), error: '' };
  const picked = new Set();
  for (const rawPart of text.split(/[,;\s]+/)) {
    const part = rawPart.trim();
    if (!part) continue;
    const m = part.match(/^(\d*)\s*-\s*(\d*)$/);
    let from, to;
    if (m) {
      if (m[1] === '' && m[2] === '') return { pages: [], error: `Không hiểu "${part}". Ví dụ đúng: 1-3, 5, 8-` };
      from = m[1] === '' ? 1 : Number(m[1]);
      to = m[2] === '' ? total : Number(m[2]);
    } else if (/^\d+$/.test(part)) {
      from = to = Number(part);
    } else {
      return { pages: [], error: `Không hiểu "${part}". Ví dụ đúng: 1-3, 5, 8-` };
    }
    if (from > to) [from, to] = [to, from];
    if (from < 1 || to > total) {
      return { pages: [], error: `File chỉ có ${total} trang, không có trang ${from < 1 ? from : to}.` };
    }
    for (let p = from; p <= to; p++) picked.add(p);
  }
  const pages = [...picked].sort((a, b) => a - b);
  if (!pages.length) return { pages: [], error: 'Chưa chọn trang nào.' };
  return { pages, error: '' };
}

/**
 * Tính kích thước ảnh xuất cho một trang. Trang quá lớn so với giới hạn trình duyệt thì tự hạ độ nét
 * (không cắt trang) và báo lại dpi thực tế để hiện cho khách.
 */
export function planPageRender(widthPt, heightPt, dpi, limits = CANVAS_LIMITS.desktop) {
  const w = Math.max(1, Number(widthPt) || 1);
  const h = Math.max(1, Number(heightPt) || 1);
  const wanted = Math.max(1, Number(dpi) || PDF_DEFAULT_DPI) / 72;
  let scale = wanted;
  const side = Math.max(w, h) * scale;
  if (side > limits.maxSide) scale *= limits.maxSide / side;
  const area = w * scale * h * scale;
  if (area > limits.maxArea) scale *= Math.sqrt(limits.maxArea / area);
  const reduced = scale < wanted - 1e-9;
  return {
    scale,
    width: Math.max(1, Math.floor(w * scale)),
    height: Math.max(1, Math.floor(h * scale)),
    dpi: reduced ? Math.max(1, Math.floor(scale * 72)) : Math.round(wanted * 72),
    reduced
  };
}

/** Tên file ảnh: "bao-gia.pdf" trang 2/12 → "bao-gia_trang-02.png"; PDF một trang → "bao-gia.png". */
export function pageFileName(pdfName, pageNumber, totalPages) {
  const base = String(pdfName || 'tai-lieu').replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]+/g, '_').trim() || 'tai-lieu';
  if (Number(totalPages) <= 1) return `${base}.png`;
  const pad = Math.max(2, String(totalPages).length);
  return `${base}_trang-${String(pageNumber).padStart(pad, '0')}.png`;
}

// ---- Ghi độ phân giải (DPI) vào file PNG để phần mềm in/thiết kế mở ra đúng kích thước thật ----
let crcTable = null;
function crc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** Chèn khối pHYs (điểm ảnh/mét) ngay sau IHDR. Nhận và trả Uint8Array; không phải PNG thì trả nguyên. */
export function setPngDpi(pngBytes, dpi) {
  const src = pngBytes instanceof Uint8Array ? pngBytes : new Uint8Array(pngBytes);
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (src.length < 33 || sig.some((b, i) => src[i] !== b)) return src;
  const ihdrEnd = 8 + 4 + 4 + 13 + 4; // chữ ký + độ dài + tên + dữ liệu IHDR + CRC
  // Bỏ khối pHYs cũ (nếu có) nằm ngay sau IHDR để không ghi trùng
  let restStart = ihdrEnd;
  const type = String.fromCharCode(src[ihdrEnd + 4], src[ihdrEnd + 5], src[ihdrEnd + 6], src[ihdrEnd + 7]);
  if (type === 'pHYs') restStart = ihdrEnd + 4 + 4 + 9 + 4;
  const ppm = Math.max(1, Math.round((Number(dpi) || 72) / 0.0254));
  const chunk = new Uint8Array(4 + 4 + 9 + 4);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, 9);
  chunk.set([0x70, 0x48, 0x59, 0x73], 4); // "pHYs"
  view.setUint32(8, ppm);
  view.setUint32(12, ppm);
  chunk[16] = 1; // đơn vị: mét
  view.setUint32(17, crc32(chunk.subarray(4, 17)));
  const out = new Uint8Array(ihdrEnd + chunk.length + (src.length - restStart));
  out.set(src.subarray(0, ihdrEnd), 0);
  out.set(chunk, ihdrEnd);
  out.set(src.subarray(restStart), ihdrEnd + chunk.length);
  return out;
}

/** Kích thước in thật (cm) của một ảnh theo dpi — hiện cho khách làm in ấn. */
export function printSizeCm(widthPx, heightPx, dpi) {
  const d = Math.max(1, Number(dpi) || 72);
  const cm = (px) => Math.round((px / d) * 2.54 * 10) / 10;
  return { width: cm(widthPx), height: cm(heightPx) };
}

export function formatBytes(bytes) {
  const b = Number(bytes) || 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

// ---- Phần chạy trên trình duyệt ----
let enginePromise = null;
export function loadPdfEngine() {
  if (!enginePromise) {
    enginePromise = import(/* webpackIgnore: true */ /* @vite-ignore */ `${PDF_ENGINE_BASE}/pdf.min.js`)
      .then((mod) => {
        mod.GlobalWorkerOptions.workerSrc = `${PDF_ENGINE_BASE}/pdf.worker.min.js`;
        return mod;
      })
      .catch((err) => {
        enginePromise = null; // cho phép thử lại khi mạng chập chờn
        throw err;
      });
  }
  return enginePromise;
}

// Bảng mã chữ Trung/Nhật/Hàn (cho PDF không nhúng font) gói trong MỘT file: 4 byte độ dài mục lục,
// mục lục JSON { tên: [vị trí, độ dài] }, rồi dữ liệu nối liền. Chỉ tải khi PDF thật sự cần.
let cmapPackPromise = null;
function loadCMapPack() {
  if (!cmapPackPromise) {
    cmapPackPromise = fetch(`${PDF_ENGINE_BASE}/cmaps.pack`)
      .then((res) => {
        if (!res.ok) throw new Error('cmaps');
        return res.arrayBuffer();
      })
      .then((buf) => {
        const headLen = new DataView(buf).getUint32(0);
        const index = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, headLen)));
        return { index, bytes: new Uint8Array(buf, 4 + headLen) };
      })
      .catch((err) => {
        cmapPackPromise = null;
        throw err;
      });
  }
  return cmapPackPromise;
}
class PackedCMapReaderFactory {
  async fetch({ name }) {
    const pack = await loadCMapPack();
    const entry = pack.index[name];
    if (!entry) throw new Error(`cmap ${name}`);
    return { cMapData: pack.bytes.slice(entry[0], entry[0] + entry[1]), isCompressed: true };
  }
}

export function isSmallDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (navigator.maxTouchPoints > 1 && /Mac/i.test(navigator.platform || ''));
}

/**
 * Mở một file PDF. Trả { doc } hoặc ném lỗi có .code: 'need_password' | 'wrong_password' | 'bad_file' | 'engine' (chưa tải được bộ đọc).
 */
export async function openPdf(file, password = '') {
  let engine;
  try {
    engine = await loadPdfEngine();
  } catch {
    const e = new Error('engine_failed');
    e.code = 'engine';
    throw e;
  }
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    const doc = await engine.getDocument({
      data,
      password: password || undefined,
      CMapReaderFactory: PackedCMapReaderFactory,
      standardFontDataUrl: `${PDF_ENGINE_BASE}/standard_fonts/`,
      isEvalSupported: false
    }).promise;
    return { doc };
  } catch (err) {
    const e = new Error('open_failed');
    if (err?.name === 'PasswordException') e.code = err.code === 2 ? 'wrong_password' : 'need_password';
    else e.code = 'bad_file';
    throw e;
  }
}

/**
 * Vẽ một trang ra PNG. Trả { blob, thumbBlob, width, height, dpi, reduced }.
 * thumbBlob là ảnh nhỏ để hiện danh sách (không bắt trình duyệt giải mã ảnh gốc hàng chục MB cho mỗi ô).
 */
export async function renderPdfPageToPng(doc, pageNumber, { dpi = PDF_DEFAULT_DPI, transparent = false, limits } = {}) {
  const page = await doc.getPage(pageNumber);
  try {
    const base = page.getViewport({ scale: 1 });
    const plan = planPageRender(base.width, base.height, dpi, limits || (isSmallDevice() ? CANVAS_LIMITS.mobile : CANVAS_LIMITS.desktop));
    const viewport = page.getViewport({ scale: plan.scale });
    const canvas = document.createElement('canvas');
    canvas.width = plan.width;
    canvas.height = plan.height;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('canvas');
    await page.render({
      canvasContext: ctx,
      viewport,
      background: transparent ? 'rgba(0,0,0,0)' : '#ffffff',
      intent: 'print'
    }).promise;
    const raw = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    let thumbBlob = null;
    if (raw) {
      const ratio = Math.min(1, THUMB_MAX_SIDE / Math.max(plan.width, plan.height));
      if (ratio < 1) {
        const small = document.createElement('canvas');
        small.width = Math.max(1, Math.round(plan.width * ratio));
        small.height = Math.max(1, Math.round(plan.height * ratio));
        const sctx = small.getContext('2d');
        sctx.imageSmoothingQuality = 'high';
        sctx.drawImage(canvas, 0, 0, small.width, small.height);
        thumbBlob = await new Promise((resolve) => small.toBlob(resolve, 'image/png'));
        small.width = small.height = 0;
      }
    }
    canvas.width = canvas.height = 0; // trả bộ nhớ sớm
    if (!raw) throw new Error('toBlob');
    const bytes = setPngDpi(new Uint8Array(await raw.arrayBuffer()), plan.dpi);
    return { blob: new Blob([bytes], { type: 'image/png' }), thumbBlob, width: plan.width, height: plan.height, dpi: plan.dpi, reduced: plan.reduced };
  } finally {
    page.cleanup();
  }
}
