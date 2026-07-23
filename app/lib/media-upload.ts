import type { MediaCollectionId } from "./media-collections";

export type CollectionImageProfile = {
  maxWidth: number;
  maxHeight: number;
  quality: number;
};

export type OptimizedImageUpload = {
  file: File;
  originalBytes: number;
  optimizedBytes: number;
  optimized: boolean;
};

const collectionImageProfiles: Record<MediaCollectionId, CollectionImageProfile> = {
  hero: { maxWidth: 1600, maxHeight: 1200, quality: 0.82 },
  "hot-products": { maxWidth: 1200, maxHeight: 1200, quality: 0.82 },
  gallery: { maxWidth: 1200, maxHeight: 1200, quality: 0.82 },
};

const optimizableStillImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/avif"]);

export function getCollectionImageProfile(collection: MediaCollectionId) {
  return collectionImageProfiles[collection];
}

export function isOptimizableStillImage(contentType: string) {
  return optimizableStillImageTypes.has(contentType);
}

export function resolveOptimizedDimensions(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function webpFilename(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "").replaceAll(/[^a-zA-Z0-9À-ỹ_-]+/g, "-").replaceAll(/-+/g, "-").replace(/^-|-$/g, "");
  return `${base || "vinprint-image"}.webp`;
}

export async function optimizeImageWithProfile(file: File, profile: CollectionImageProfile): Promise<OptimizedImageUpload> {
  if (!isOptimizableStillImage(file.type)) {
    return { file, originalBytes: file.size, optimizedBytes: file.size, optimized: false };
  }

  const bitmap = await createImageBitmap(file);
  try {
    const dimensions = resolveOptimizedDimensions(bitmap.width, bitmap.height, profile.maxWidth, profile.maxHeight);
    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("canvas_unavailable");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", profile.quality));
    if (!blob) throw new Error("image_optimization_failed");

    const shouldUseOptimized = blob.size < file.size || dimensions.width !== bitmap.width || dimensions.height !== bitmap.height;
    if (!shouldUseOptimized) {
      return { file, originalBytes: file.size, optimizedBytes: file.size, optimized: false };
    }

    const optimizedFile = new File([blob], webpFilename(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    });
    return {
      file: optimizedFile,
      originalBytes: file.size,
      optimizedBytes: optimizedFile.size,
      optimized: true,
    };
  } finally {
    bitmap.close();
  }
}

export function optimizeImageForUpload(file: File, collection: MediaCollectionId) {
  return optimizeImageWithProfile(file, getCollectionImageProfile(collection));
}

export function formatUploadSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
