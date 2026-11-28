import JSZip from 'jszip';
import { cdrPreviewFiles, previewFormat as getPreviewFormat, previewMime } from './cdrPreviewPages.js';

export const RIFF_VERSION_MAP = {
  'CDR3': 'CorelDRAW 3',
  'CDR4': 'CorelDRAW 4',
  'CDR5': 'CorelDRAW 5',
  'CDR6': 'CorelDRAW 6',
  'CDR7': 'CorelDRAW 7',
  'CDR8': 'CorelDRAW 8',
  'CDR9': 'CorelDRAW 9',
  'CDRA': 'CorelDRAW 10',
  'CDRB': 'CorelDRAW 11',
  'CDRC': 'CorelDRAW 12',
  'CDRD': 'CorelDRAW X3 (v13)'
};

/**
 * Gắn BITMAPFILEHEADER (14 bytes) vào dữ liệu DIB để tạo file BMP hoàn chỉnh
 */
export function convertDibToBmpBlob(dibUint8) {
  const view = new DataView(dibUint8.buffer, dibUint8.byteOffset, dibUint8.byteLength);
  const biSize = view.getUint32(0, true);
  const biBitCount = view.getUint16(14, true);
  let clrUsed = view.getUint32(32, true);
  if (clrUsed === 0 && biBitCount <= 8) {
    clrUsed = 1 << biBitCount;
  }
  const paletteSize = clrUsed * 4;
  const bfOffBits = 14 + biSize + paletteSize;
  const fileSize = 14 + dibUint8.byteLength;

  const bmpBuffer = new Uint8Array(fileSize);
  const bmpView = new DataView(bmpBuffer.buffer);

  // 'BM'
  bmpBuffer[0] = 0x42;
  bmpBuffer[1] = 0x4D;
  // File size
  bmpView.setUint32(2, fileSize, true);
  // Reserved (0)
  bmpView.setUint32(6, 0, true);
  // Offset to pixel data
  bmpView.setUint32(10, bfOffBits, true);

  // Sao chép toàn bộ khối DIB vào sau header 14 bytes
  bmpBuffer.set(dibUint8, 14);

  return new Blob([bmpBuffer], { type: 'image/bmp' });
}

/**
 * Chuyển Blob ảnh (BMP hoặc PNG) thành DataURL và kích thước ảnh thật
 */
export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Đo kích thước tự nhiên của ảnh (Natural Width x Height) qua Image
 */
export function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
    };
    img.src = url;
  });
}

/**
 * Nâng cấp độ nét ảnh (Super Resolution & Sharpening) trực tiếp trên Client Canvas
 * Sử dụng nội suy đa tầng + ma trận tích chập Unsharp Mask (Làm rõ cạnh chữ & viền nét)
 */
export function enhanceImageBlobClient(sourceBlob, scale = 4, sharpness = 1.8, contrast = 1.15) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceBlob);

    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const targetW = Math.round(origW * scale);
        const targetH = Math.round(origH * scale);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Áp dụng tăng nhẹ độ tương phản trong quá trình vẽ
        ctx.filter = `contrast(${contrast}) brightness(1.02)`;
        ctx.drawImage(img, 0, 0, targetW, targetH);
        ctx.filter = 'none';

        // Áp dụng thuật toán Unsharp Mask 3x3 Convolution để làm sắc nét cạnh chữ & vector
        if (sharpness > 1.0) {
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const src = imgData.data;
          const output = ctx.createImageData(targetW, targetH);
          const dst = output.data;

          const amount = (sharpness - 1.0) * 0.8;
          const center = 1 + 4 * amount;
          const edge = -amount;

          for (let y = 1; y < targetH - 1; y++) {
            const row = y * targetW;
            for (let x = 1; x < targetW - 1; x++) {
              const i = (row + x) * 4;

              for (let c = 0; c < 3; c++) {
                const val = center * src[i + c] +
                  edge * (src[i - 4 + c] + src[i + 4 + c] + src[i - targetW * 4 + c] + src[i + targetW * 4 + c]);
                dst[i + c] = val > 255 ? 255 : val < 0 ? 0 : val;
              }
              dst[i + 3] = src[i + 3]; // Giữ nguyên Alpha
            }
          }

          // Xử lý viền ngoài 1px
          for (let x = 0; x < targetW; x++) {
            const topIdx = x * 4;
            const btmIdx = ((targetH - 1) * targetW + x) * 4;
            for (let k = 0; k < 4; k++) {
              dst[topIdx + k] = src[topIdx + k];
              dst[btmIdx + k] = src[btmIdx + k];
            }
          }
          for (let y = 0; y < targetH; y++) {
            const leftIdx = (y * targetW) * 4;
            const rightIdx = (y * targetW + targetW - 1) * 4;
            for (let k = 0; k < 4; k++) {
              dst[leftIdx + k] = src[leftIdx + k];
              dst[rightIdx + k] = src[rightIdx + k];
            }
          }

          ctx.putImageData(output, 0, 0);
        }

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              resolve({
                blob,
                width: targetW,
                height: targetH,
                scale
              });
            } else {
              reject(new Error('Lỗi xuất Blob nâng cấp ảnh'));
            }
          },
          'image/png',
          1.0
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/**
 * Vẽ Blob sang Canvas để xuất ra PNG hoặc JPG chuẩn sắc nét
 */
export function convertBlobToFormat(sourceBlob, format = 'image/png', quality = 1.0) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceBlob);
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (format === 'image/jpeg') {
          // Nền trắng cho JPG tránh nền đen khi trong suốt
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (convertedBlob) => {
            URL.revokeObjectURL(objectUrl);
            if (convertedBlob) resolve(convertedBlob);
            else reject(new Error('Lỗi chuyển đổi Canvas sang Blob'));
          },
          format,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

/**
 * Phân tích file CorelDRAW RIFF nhị phân (v3 đến X3)
 */
export function parseRiffCdrClient(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const bytes = new Uint8Array(arrayBuffer);

  const sig = String.fromCharCode(...bytes.subarray(0, 4));
  if (sig !== 'RIFF' && sig !== 'RIFX') return null;

  const formType = String.fromCharCode(...bytes.subarray(8, 12));
  let detectedVersion = RIFF_VERSION_MAP[formType] || `CorelDRAW Legacy (${formType})`;
  let rawVersionNum = null;
  let bmpBlob = null;
  let width = null;
  let height = null;
  let bitCount = null;

  let offset = 12;
  const maxScan = Math.min(arrayBuffer.byteLength - 8, 5000000);

  while (offset < maxScan) {
    const chunkId = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const chunkSize = view.getUint32(offset + 4, true);

    if (chunkId === 'LIST' || chunkId === 'RIFF') {
      offset += 12;
      continue;
    }

    if (chunkId === 'vrsn' && chunkSize >= 2) {
      rawVersionNum = view.getUint16(offset + 8, true);
      const major = Math.floor(rawVersionNum / 100);
      const minor = rawVersionNum % 100;
      if (major === 13) detectedVersion = `CorelDRAW X3 (v13.${minor})`;
      else if (major > 0) detectedVersion = `CorelDRAW ${major}.${minor}`;
    }

    if (chunkId === 'DISP' && !bmpBlob) {
      const dispData = bytes.subarray(offset + 8, offset + 8 + chunkSize);
      const dispView = new DataView(dispData.buffer, dispData.byteOffset, dispData.byteLength);

      let dibOffset = -1;
      for (let i = 0; i < Math.min(64, dispData.length - 4); i++) {
        if (dispView.getUint32(i, true) === 40) {
          dibOffset = i;
          break;
        }
      }

      if (dibOffset >= 0) {
        const dib = dispData.subarray(dibOffset);
        const dibView = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);
        width = dibView.getInt32(4, true);
        height = dibView.getInt32(8, true);
        bitCount = dibView.getUint16(14, true);
        bmpBlob = convertDibToBmpBlob(dib);
      }
    }

    offset += 8 + chunkSize;
    if (chunkSize % 2 !== 0) offset++;
    if (bmpBlob && rawVersionNum) break;
  }

  return {
    architecture: 'RIFF (Legacy Binary)',
    version: detectedVersion,
    rawVersionNum,
    formType,
    hasPreview: !!bmpBlob,
    previewFormat: 'bmp',
    previewBlob: bmpBlob,
    dimensions: width && height ? `${width} x ${height} px` : null,
    bitCount
  };
}

/**
 * Phân tích file CorelDRAW PKZip (X4 đến 2024+)
 */
export async function parseZipCdrClient(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const sig = String.fromCharCode(...bytes.subarray(0, 4));
  if (sig !== 'PK\x03\x04') return null;

  const zip = await JSZip.loadAsync(arrayBuffer);

  const pagePreviews = cdrPreviewFiles(zip);
  const thumbFile = pagePreviews.primary;

  let previewBlob = null;
  let previewFormat = 'png';
  if (thumbFile) {
    const u8 = await thumbFile.async('uint8array');
    if (thumbFile.name.toLowerCase().endsWith('.bmp')) {
      previewFormat = 'bmp';
      previewBlob = new Blob([u8], { type: 'image/bmp' });
    } else if (thumbFile.name.toLowerCase().endsWith('.jpg') || thumbFile.name.toLowerCase().endsWith('.jpeg')) {
      previewFormat = 'jpg';
      previewBlob = new Blob([u8], { type: 'image/jpeg' });
    } else {
      previewFormat = 'png';
      previewBlob = new Blob([u8], { type: 'image/png' });
    }
  }

  // 2. Tìm danh sách các trang khác
  const additionalPages = [];
  for (const { file: pf, pageNumber } of pagePreviews.additional) {
    const u8 = await pf.async('uint8array');
    const format = getPreviewFormat(pf.name);
    const mime = previewMime(format);
    additionalPages.push({
      name: pf.name,
      pageNumber,
      blob: new Blob([u8], { type: mime }),
      format
    });
  }

  // 3. Phân tích Metadata XML
  let metadataXml = null;
  const metaFile = zip.file('META-INF/metadata.xml') || zip.file('metadata/metadata.xml') || zip.file(/metadata\.xml/i)[0];

  let productName = 'CorelDRAW (Hiện đại)';
  let appVersion = null;
  let numPages = 1;
  let pageDimensions = null;
  let createDate = null;
  let modifyDate = null;
  let colorProfile = null;
  let totalObjects = null;

  if (metaFile) {
    metadataXml = await metaFile.async('text');

    const prodMatch = metadataXml.match(/<cdr:ProductName>([^<]+)<\/cdr:ProductName>/i);
    if (prodMatch) productName = prodMatch[1].trim();

    const appVerMatch = metadataXml.match(/<cdr:AppVersion>([^<]+)<\/cdr:AppVersion>/i);
    if (appVerMatch) appVersion = appVerMatch[1].trim();

    const pagesMatch = metadataXml.match(/<cdrinfo:NumPages>([^<]+)<\/cdrinfo:NumPages>/i);
    if (pagesMatch) numPages = parseInt(pagesMatch[1].trim(), 10) || 1;

    const dimMatch = metadataXml.match(/<cdrinfo:PageDimensions>([^<]+)<\/cdrinfo:PageDimensions>/i);
    if (dimMatch) pageDimensions = dimMatch[1].trim();

    const createMatch = metadataXml.match(/<xmp:CreateDate>([^<]+)<\/xmp:CreateDate>/i);
    if (createMatch) createDate = createMatch[1].trim();

    const modMatch = metadataXml.match(/<xmp:ModifyDate>([^<]+)<\/xmp:ModifyDate>/i);
    if (modMatch) modifyDate = modMatch[1].trim();

    const colorMatch = metadataXml.match(/inClr:RgbProfileName="([^"]+)"/i) || metadataXml.match(/inClr:CmykProfileName="([^"]+)"/i);
    if (colorMatch) colorProfile = colorMatch[1].trim();

    const objMatch = metadataXml.match(/<inObj:Total>([^<]+)<\/inObj:Total>/i);
    if (objMatch) totalObjects = parseInt(objMatch[1].trim(), 10);
  }

  return {
    architecture: 'PKZip (Modern Open XML)',
    version: productName,
    appVersion,
    numPages: Math.max(numPages, pagePreviews.primaryNumber||1, ...pagePreviews.additional.map(p => p.pageNumber)),
    previewPageNumber: pagePreviews.primaryNumber,
    pageDimensions,
    createDate,
    modifyDate,
    colorProfile,
    totalObjects,
    hasPreview: !!previewBlob,
    previewFormat,
    previewBlob,
    additionalPages
  };
}

/**
 * Đọc file CorelDRAW bất kỳ từ File hoặc ArrayBuffer trực tiếp trên trình duyệt
 */
export async function parseCorelFileClient(fileOrBuffer) {
  let arrayBuffer;
  let fileName = 'document.cdr';
  let fileSize = 0;

  if (fileOrBuffer instanceof File) {
    fileName = fileOrBuffer.name;
    fileSize = fileOrBuffer.size;
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else if (fileOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer;
    fileSize = fileOrBuffer.byteLength;
  } else if (fileOrBuffer.buffer instanceof ArrayBuffer) {
    arrayBuffer = fileOrBuffer.buffer;
    fileSize = fileOrBuffer.byteLength;
  } else {
    throw new Error('Dữ liệu đầu vào không hợp lệ.');
  }

  const bytes = new Uint8Array(arrayBuffer);
  const sig = String.fromCharCode(...bytes.subarray(0, 4));

  let parsed = null;
  if (sig === 'PK\x03\x04') {
    parsed = await parseZipCdrClient(arrayBuffer);
  } else if (sig === 'RIFF' || sig === 'RIFX') {
    parsed = parseRiffCdrClient(arrayBuffer);
  } else {
    throw new Error('File không phải định dạng CorelDRAW (.cdr) hợp lệ (Thiếu mã nhận diện PKZip hoặc RIFF).');
  }

  return {
    fileName,
    fileSize,
    ...parsed
  };
}
