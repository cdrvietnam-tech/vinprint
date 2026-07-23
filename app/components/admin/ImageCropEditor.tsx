"use client";

import { Check, Maximize2, X } from "lucide-react";
import { type KeyboardEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type CropItem = { title: string; width: number | null; height: number | null };
type CropMode = "contain" | "cover";

type Props = {
  item: CropItem;
  file: File;
  onCancel: () => void;
  onApply: (file: File) => void;
};

function drawAdjustedImage(canvas: HTMLCanvasElement, image: HTMLImageElement, mode: CropMode, zoom: number, positionX: number, positionY: number) {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (mode === "contain") {
    const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom;
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const freeX = canvas.width - drawWidth;
    const freeY = canvas.height - drawHeight;
    const drawX = freeX / 2 + (positionX / 100) * (Math.abs(freeX) / 2);
    const drawY = freeY / 2 + (positionY / 100) * (Math.abs(freeY) / 2);
    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    return;
  }

  const targetRatio = canvas.width / canvas.height;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  let cropWidth = image.naturalWidth;
  let cropHeight = image.naturalHeight;
  if (imageRatio > targetRatio) cropWidth = image.naturalHeight * targetRatio;
  else cropHeight = image.naturalWidth / targetRatio;
  const coverZoom = Math.max(1, zoom);
  cropWidth /= coverZoom;
  cropHeight /= coverZoom;
  const sourceX = (image.naturalWidth - cropWidth) * ((100 - positionX) / 200);
  const sourceY = (image.naturalHeight - cropHeight) * ((100 - positionY) / 200);
  context.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
}

function clampPosition(value: number) {
  return Math.max(-100, Math.min(100, value));
}

export default function ImageCropEditor({ item, file, onCancel, onApply }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; positionX: number; positionY: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState<CropMode>("contain");
  const [zoom, setZoom] = useState(0.85);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();
    image.onload = () => {
      imageRef.current = image;
      setReady(true);
    };
    image.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !ready) return;
    const targetRatio = (item.width || image.naturalWidth) / (item.height || image.naturalHeight);
    if (targetRatio >= 1) {
      canvas.width = 900;
      canvas.height = Math.max(320, Math.round(900 / targetRatio));
    } else {
      canvas.height = 720;
      canvas.width = Math.max(320, Math.round(720 * targetRatio));
    }
    drawAdjustedImage(canvas, image, mode, zoom, positionX, positionY);
  }, [item.height, item.width, mode, positionX, positionY, ready, zoom]);

  const startDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, positionX, positionY };
    setDragging(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPositionX(clampPosition(drag.positionX + ((event.clientX - drag.startX) / Math.max(bounds.width, 1)) * 200));
    setPositionY(clampPosition(drag.positionY + ((event.clientY - drag.startY) / Math.max(bounds.height, 1)) * 200));
  };

  const endDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const moveWithKeyboard = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const movement = event.shiftKey ? 10 : 3;
    if (event.key === "ArrowLeft") setPositionX((value) => clampPosition(value - movement));
    else if (event.key === "ArrowRight") setPositionX((value) => clampPosition(value + movement));
    else if (event.key === "ArrowUp") setPositionY((value) => clampPosition(value - movement));
    else if (event.key === "ArrowDown") setPositionY((value) => clampPosition(value + movement));
    else return;
    event.preventDefault();
  };

  const apply = async () => {
    const image = imageRef.current;
    if (!image) return;
    setSaving(true);
    const originalWidth = item.width || image.naturalWidth;
    const originalHeight = item.height || image.naturalHeight;
    const outputScale = Math.min(1, 2400 / Math.max(originalWidth, originalHeight));
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(originalWidth * outputScale));
    output.height = Math.max(1, Math.round(originalHeight * outputScale));
    drawAdjustedImage(output, image, mode, zoom, positionX, positionY);
    const blob = await new Promise<Blob | null>((resolve) => output.toBlob(resolve, "image/webp", 0.92));
    if (blob) onApply(new File([blob], `${item.title.replaceAll(/\s+/g, "-").toLowerCase()}-can-chinh.webp`, { type: "image/webp" }));
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-gray-950/75 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Cắt và căn ${item.title}`}>
      <div className="max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">Trình căn ảnh thông minh</p>
            <h2 className="mt-1 text-2xl font-black">{item.title}</h2>
            <p className="mt-1 text-sm font-medium text-gray-600">Khung xuất: {item.width || "tự động"}×{item.height || "tự động"}px</p>
          </div>
          <button type="button" onClick={onCancel} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100" aria-label="Đóng"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-5 flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:24px_24px] p-3">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Kéo ảnh để thay đổi vị trí trong khung"
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={moveWithKeyboard}
            className={`max-h-[58vh] max-w-full touch-none shadow-xl outline-none ring-orange-500 focus-visible:ring-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          />
          <p className="mt-3 rounded-full bg-gray-950/80 px-4 py-2 text-xs font-black text-white">Cầm chuột kéo ảnh ngang hoặc dọc để căn vị trí</p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
            <button type="button" onClick={() => { setMode("contain"); setZoom(0.85); setPositionX(0); setPositionY(0); }} className={`rounded-xl px-3 py-3 text-xs font-black ${mode === "contain" ? "bg-white text-orange-700 shadow" : "text-gray-600"}`}>Giữ trọn ảnh</button>
            <button type="button" onClick={() => { setMode("cover"); setZoom(1); setPositionX(0); setPositionY(0); }} className={`rounded-xl px-3 py-3 text-xs font-black ${mode === "cover" ? "bg-white text-orange-700 shadow" : "text-gray-600"}`}>Lấp đầy khung</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-xs font-black text-gray-700">Tỷ lệ ảnh: {Math.round(zoom * 100)}%<input type="range" min={mode === "cover" ? "1" : "0.5"} max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full accent-orange-600" /></label>
            <button type="button" onClick={() => { setPositionX(0); setPositionY(0); }} className="min-h-11 rounded-full bg-gray-100 px-5 text-xs font-black text-gray-700">Căn giữa lại</button>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="min-h-12 rounded-full bg-gray-100 px-6 text-sm font-black text-gray-700">Hủy</button>
          <button type="button" onClick={() => void apply()} disabled={!ready || saving} className="min-h-12 rounded-full bg-orange-600 px-7 text-sm font-black text-white disabled:opacity-50">
            {saving ? <Maximize2 className="mr-2 inline h-4 w-4 animate-pulse" /> : <Check className="mr-2 inline h-4 w-4" />} Dùng ảnh đã căn
          </button>
        </div>
      </div>
    </div>
  );
}
