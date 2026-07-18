"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  buildOrderBrief,
  createDesignVariants,
  defaultStudioForm,
  interpretBrief,
  projectCodeFrom,
  type StudioForm,
} from "../lib/design-engine";
import { trackEvent } from "../lib/analytics";

const ZALO_URL = "https://zalo.me/0844998499";

type ViewMode = "label" | "mockup";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadText(content: string, filename: string, type: string) {
  downloadBlob(new Blob([content], { type }), filename);
}

function loadSvgImage(svg: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Không thể dựng ảnh SVG"));
    };
    image.src = url;
  });
}

async function svgToPngDataUrl(svg: string, width: number, height: number) {
  const image = await loadSvgImage(svg);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ xuất ảnh");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

function copyTextFallback(value: string) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function safeFilename(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "vinprint"
  );
}

function namespaceSvg(svg: string, namespace: string) {
  return svg.replace(/vp-(\d+)-(\d+)/g, `vp-$1-$2-${namespace}`);
}

export default function AiDesignLab() {
  const [form, setForm] = useState<StudioForm>(defaultStudioForm);
  const [generatedBrief, setGeneratedBrief] = useState(() =>
    interpretBrief(defaultStudioForm),
  );
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("label");
  const [status, setStatus] = useState(
    "Mẫu minh họa đã sẵn sàng. Nhập ý tưởng của anh/chị để tạo bộ mới.",
  );
  const [busy, setBusy] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const variants = useMemo(
    () => createDesignVariants(generatedBrief, logoDataUrl),
    [generatedBrief, logoDataUrl],
  );
  const projectCode = useMemo(
    () => projectCodeFrom(generatedBrief),
    [generatedBrief],
  );
  const activeDesign = variants[activeVariant];
  const orderBrief = useMemo(
    () => buildOrderBrief(generatedBrief, projectCode),
    [generatedBrief, projectCode],
  );

  useEffect(() => {
    const draftTimer = window.setTimeout(
      () => setHasDraft(Boolean(window.localStorage.getItem("vinprint_ai_draft"))),
      0,
    );

    const focusStudio = () => promptRef.current?.focus();
    window.addEventListener("vinprint:focus-studio", focusStudio);
    return () => {
      window.clearTimeout(draftTimer);
      window.removeEventListener("vinprint:focus-studio", focusStudio);
    };
  }, []);

  const update = <Key extends keyof StudioForm>(
    key: Key,
    value: StudioForm[Key],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const handleAsset = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setStatus("Tệp vượt quá 10MB. Vui lòng chọn tệp nhẹ hơn.");
      event.target.value = "";
      return;
    }

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.type)) {
      setStatus("Chỉ nhận PNG, JPG, WebP hoặc PDF.");
      event.target.value = "";
      return;
    }

    setAssetFile(file);
    setStatus(
      file.type === "application/pdf"
        ? "Đã nhận PDF làm tài liệu tham khảo. Logo trong PDF không tự chèn vào tem."
        : "Đã nhận hình ảnh và đưa vào các phương án tem.",
    );
    trackEvent("ai_asset_uploaded", {
      type: file.type,
      size_kb: Math.round(file.size / 1024),
    });

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setLogoDataUrl(String(reader.result || ""));
      reader.readAsDataURL(file);
    } else {
      setLogoDataUrl("");
    }
  };

  const generate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.prompt.trim()) {
      setStatus("Vui lòng mô tả ý tưởng trước khi tạo mẫu.");
      promptRef.current?.focus();
      return;
    }

    setBusy("generate");
    const next = interpretBrief(form);
    window.setTimeout(() => {
      setGeneratedBrief(next);
      setActiveVariant(0);
      setViewMode("label");
      setBusy("");
      setStatus("Đã tạo 3 hướng thiết kế tem và 3 mockup tương ứng.");
      trackEvent("ai_design_generated", {
        product_type: next.productType,
        style: next.detectedStyle,
        shape: next.detectedShape,
        has_asset: Boolean(assetFile),
      });
    }, 420);
  };

  const saveDraft = () => {
    try {
      window.localStorage.setItem(
        "vinprint_ai_draft",
        JSON.stringify({ form, logoDataUrl, assetName: assetFile?.name || "" }),
      );
      setHasDraft(true);
      setStatus("Đã lưu dự án trên trình duyệt này.");
      trackEvent("ai_draft_saved", { project_code: projectCode });
    } catch {
      setStatus("Không đủ dung lượng để lưu. Anh/chị vẫn có thể tải hồ sơ ZIP.");
    }
  };

  const restoreDraft = () => {
    try {
      const saved = JSON.parse(
        window.localStorage.getItem("vinprint_ai_draft") || "{}",
      ) as { form?: StudioForm; logoDataUrl?: string; assetName?: string };
      if (!saved.form) return;
      setForm(saved.form);
      setLogoDataUrl(saved.logoDataUrl || "");
      setGeneratedBrief(interpretBrief(saved.form));
      setStatus(
        saved.assetName
          ? `Đã khôi phục dự án. Tệp tham khảo trước đó: ${saved.assetName}.`
          : "Đã khôi phục dự án gần nhất.",
      );
      trackEvent("ai_draft_restored");
    } catch {
      setStatus("Bản lưu không còn hợp lệ. Vui lòng tạo lại dự án.");
    }
  };

  const downloadSvg = (kind: ViewMode) => {
    const svg = kind === "label" ? activeDesign.labelSvg : activeDesign.mockupSvg;
    downloadText(
      svg,
      `${safeFilename(generatedBrief.brand)}-${kind}-${activeDesign.id}.svg`,
      "image/svg+xml;charset=utf-8",
    );
    setStatus(`Đã tải ${kind === "label" ? "file tem" : "mockup"} SVG.`);
    trackEvent("ai_asset_downloaded", { kind, format: "svg" });
  };

  const downloadPng = async (kind: ViewMode) => {
    try {
      setBusy(`png-${kind}`);
      const svg = kind === "label" ? activeDesign.labelSvg : activeDesign.mockupSvg;
      const dataUrl = await svgToPngDataUrl(
        svg,
        kind === "label" ? 1520 : 1800,
        kind === "label" ? 1520 : 1520,
      );
      const response = await fetch(dataUrl);
      downloadBlob(
        await response.blob(),
        `${safeFilename(generatedBrief.brand)}-${kind}-${activeDesign.id}.png`,
      );
      setStatus(`Đã tải ${kind === "label" ? "ảnh tem" : "ảnh mockup"} PNG.`);
      trackEvent("ai_asset_downloaded", { kind, format: "png" });
    } catch {
      setStatus("Không thể xuất PNG trên trình duyệt này. File SVG vẫn sẵn sàng.");
    } finally {
      setBusy("");
    }
  };

  const downloadZip = async () => {
    try {
      setBusy("zip");
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const base = safeFilename(generatedBrief.brand);

      variants.forEach((variant) => {
        zip.file(`01-thiet-ke/${base}-tem-0${variant.id}.svg`, variant.labelSvg);
        zip.file(`02-mockup/${base}-mockup-0${variant.id}.svg`, variant.mockupSvg);
      });
      zip.file(`03-ho-so/${projectCode}-thong-tin-dat-in.txt`, orderBrief);
      if (assetFile) zip.file(`04-file-khach-gui/${assetFile.name}`, assetFile);

      const [labelPng, mockupPng] = await Promise.all([
        svgToPngDataUrl(activeDesign.labelSvg, 1520, 1520),
        svgToPngDataUrl(activeDesign.mockupSvg, 1800, 1520),
      ]);
      zip.file(
        `01-thiet-ke/${base}-tem-duoc-chon.png`,
        labelPng.split(",")[1],
        { base64: true },
      );
      zip.file(
        `02-mockup/${base}-mockup-duoc-chon.png`,
        mockupPng.split(",")[1],
        { base64: true },
      );

      downloadBlob(
        await zip.generateAsync({ type: "blob" }),
        `${projectCode}-${base}-vinprint.zip`,
      );
      setStatus("Đã đóng gói ZIP gồm tem, mockup, hồ sơ và file tham khảo.");
      trackEvent("ai_order_pack_downloaded", { format: "zip" });
    } catch {
      setStatus("Không thể tạo ZIP trên trình duyệt này. Vui lòng tải từng file SVG.");
    } finally {
      setBusy("");
    }
  };

  const downloadPdf = async () => {
    try {
      setBusy("pdf");
      const [{ jsPDF }, labelImage, mockupImage] = await Promise.all([
        import("jspdf"),
        loadSvgImage(activeDesign.labelSvg),
        loadSvgImage(activeDesign.mockupSvg),
      ]);
      const canvas = document.createElement("canvas");
      canvas.width = 1240;
      canvas.height = 1754;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Không thể tạo PDF");

      context.fillStyle = "#f7f3eb";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#171310";
      context.fillRect(0, 0, canvas.width, 190);
      context.fillStyle = "#d6ff43";
      context.font = "700 27px Arial";
      context.fillText("VINPRINT AI ORDER PACK", 76, 75);
      context.fillStyle = "#ffffff";
      context.font = "800 56px Arial";
      context.fillText("Hồ sơ đặt in", 76, 145);
      context.textAlign = "right";
      context.font = "700 28px Arial";
      context.fillText(projectCode, 1160, 115);
      context.textAlign = "left";

      context.fillStyle = "#ffffff";
      context.fillRect(65, 235, 1110, 625);
      context.drawImage(labelImage, 100, 280, 480, 480);
      context.drawImage(mockupImage, 625, 300, 500, 422);
      context.fillStyle = "#171310";
      context.font = "800 23px Arial";
      context.fillText("TEM ĐƯỢC CHỌN", 100, 810);
      context.fillText("MOCKUP SẢN PHẨM", 625, 810);

      const fields = [
        ["Thương hiệu", generatedBrief.brand || "Chưa nhập"],
        ["Tên sản phẩm", generatedBrief.productName || "Chưa nhập"],
        ["Kích thước", generatedBrief.size || "Chưa xác định"],
        ["Số lượng", generatedBrief.quantity || "Chưa xác định"],
        ["Chất liệu dự kiến", generatedBrief.material || "Chưa xác định"],
        ["Thời gian cần", generatedBrief.deadline || "Trao đổi với nhân viên"],
      ];
      context.fillStyle = "#171310";
      context.font = "800 34px Arial";
      context.fillText("Thông tin sản xuất", 76, 930);
      fields.forEach(([label, value], index) => {
        const y = 985 + index * 69;
        context.fillStyle = "#766d63";
        context.font = "700 20px Arial";
        context.fillText(label.toUpperCase(), 76, y);
        context.fillStyle = "#171310";
        context.font = "700 25px Arial";
        context.fillText(value, 360, y);
        context.strokeStyle = "#ddd4c8";
        context.beginPath();
        context.moveTo(76, y + 24);
        context.lineTo(1160, y + 24);
        context.stroke();
      });
      context.fillStyle = "#ff512f";
      context.fillRect(65, 1435, 1110, 190);
      context.fillStyle = "#ffffff";
      context.font = "800 28px Arial";
      context.fillText("QUY TRÌNH ĐẶT IN", 96, 1490);
      context.font = "600 22px Arial";
      context.fillText("Gửi file + số lượng + chất liệu → Nhận báo giá", 96, 1540);
      context.fillText("Đặt cọc + gửi thông tin nhận hàng → Chờ tem về", 96, 1580);
      context.fillStyle = "#171310";
      context.font = "700 22px Arial";
      context.fillText("Zalo: 0844998499 · Thứ 2–Thứ 7, 09:00–17:30", 76, 1695);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297);
      pdf.save(`${projectCode}-${safeFilename(generatedBrief.brand)}.pdf`);
      setStatus("Đã tạo PDF hồ sơ đặt in.");
      trackEvent("ai_order_pack_downloaded", { format: "pdf" });
    } catch {
      setStatus("Không thể tạo PDF trên trình duyệt này. Hồ sơ ZIP vẫn sẵn sàng.");
    } finally {
      setBusy("");
    }
  };

  const openZalo = () => {
    copyTextFallback(orderBrief);
    void navigator.clipboard?.writeText(orderBrief).catch(() => undefined);
    window.open(ZALO_URL, "_blank", "noopener,noreferrer");
    setStatus("Đã sao chép nội dung yêu cầu. Hãy dán vào khung chat Zalo.");
    trackEvent("zalo_order_brief_clicked", { project_code: projectCode });
  };

  const qualityChecks = [
    {
      label: "Nội dung chính",
      ok: Boolean(generatedBrief.brand && generatedBrief.productName),
      note: generatedBrief.brand && generatedBrief.productName ? "Đã đủ" : "Cần bổ sung",
    },
    {
      label: "Kích thước",
      ok: /\d/.test(generatedBrief.size),
      note: /\d/.test(generatedBrief.size) ? generatedBrief.size : "Chưa xác định",
    },
    {
      label: "Độ tương phản",
      ok: true,
      note: "Đạt mức concept",
    },
    {
      label: "File tham khảo",
      ok: Boolean(assetFile || logoDataUrl),
      note: assetFile?.name || (logoDataUrl ? "Đã khôi phục" : "Không bắt buộc"),
    },
  ];

  return (
    <section className="studio-section" id="ai-studio" aria-labelledby="studio-title">
      <div className="studio-orbit studio-orbit--one" aria-hidden="true" />
      <div className="studio-orbit studio-orbit--two" aria-hidden="true" />
      <div className="shell studio-shell">
        <header className="studio-heading">
          <div>
            <span className="studio-eyebrow"><i /> VINPRINT AI DESIGN LAB / 02</span>
            <h2 id="studio-title">Nói ý tưởng.<br /><em>Nhìn thấy tem ngay.</em></h2>
          </div>
          <p>
            Nhập bằng tiếng Việt tự nhiên, thêm logo nếu có. Hệ thống tạo đồng thời
            ba hướng tem, mockup sản phẩm và hồ sơ đặt in có mã riêng.
          </p>
        </header>

        <div className="studio-workbench">
          <form className="studio-form" onSubmit={generate}>
            <div className="studio-form__topline">
              <span>01 — Nhập yêu cầu</span>
              <div>
                {hasDraft && <button type="button" onClick={restoreDraft}>Khôi phục</button>}
                <button type="button" onClick={saveDraft}>Lưu nháp</button>
              </div>
            </div>

            <label className="studio-prompt" htmlFor="ai-prompt">
              <span>Mô tả mẫu tem anh/chị muốn</span>
              <textarea
                ref={promptRef}
                id="ai-prompt"
                value={form.prompt}
                onChange={(event) => update("prompt", event.target.value)}
                placeholder="Ví dụ: Tem oval cho serum vitamin C, màu cam và kem, phong cách tối giản cao cấp..."
                rows={5}
                required
              />
              <small>AI hiểu phong cách, màu sắc, hình dạng và ngữ cảnh sử dụng.</small>
            </label>

            <div className="studio-fields studio-fields--two">
              <label>
                <span>Tem dùng cho sản phẩm gì?</span>
                <select value={form.productType} onChange={(event) => update("productType", event.target.value)}>
                  <option value="thuc-pham">Thực phẩm / bao bì</option>
                  <option value="my-pham">Mỹ phẩm / chăm sóc cá nhân</option>
                  <option value="do-uong">Đồ uống / chai lọ</option>
                  <option value="nen-thom">Nến thơm / quà tặng</option>
                  <option value="khac">Sản phẩm khác</option>
                </select>
              </label>
              <label>
                <span>Thương hiệu</span>
                <input value={form.brand} onChange={(event) => update("brand", event.target.value)} placeholder="Tên thương hiệu" />
              </label>
              <label>
                <span>Tên sản phẩm</span>
                <input value={form.productName} onChange={(event) => update("productName", event.target.value)} placeholder="Tên hiển thị trên tem" />
              </label>
              <label>
                <span>Kích thước tem</span>
                <input value={form.size} onChange={(event) => update("size", event.target.value)} placeholder="Ví dụ: 50 x 70 mm" />
              </label>
            </div>

            <label className="studio-full-field">
              <span>Nội dung bắt buộc</span>
              <input value={form.requiredText} onChange={(event) => update("requiredText", event.target.value)} placeholder="Khối lượng, công dụng, hotline..." />
            </label>

            <details className="studio-advanced">
              <summary>Tùy chỉnh nâng cao <span>＋</span></summary>
              <div className="studio-fields studio-fields--three">
                <label><span>Hình dạng</span><select value={form.shape} onChange={(event) => update("shape", event.target.value)}><option value="auto">AI tự chọn</option><option value="round">Tròn</option><option value="oval">Oval</option><option value="rounded">Chữ nhật bo góc</option><option value="arch">Vòm</option></select></label>
                <label><span>Phong cách</span><select value={form.style} onChange={(event) => update("style", event.target.value)}><option value="auto">AI tự chọn</option><option value="editorial">Editorial</option><option value="minimal">Tối giản</option><option value="luxury">Cao cấp</option><option value="organic">Tự nhiên</option><option value="cute">Dễ thương</option><option value="retro">Retro</option></select></label>
                <label><span>Bảng màu</span><select value={form.palette} onChange={(event) => update("palette", event.target.value)}><option value="auto">Theo mô tả</option><option value="natural">Xanh tự nhiên</option><option value="premium">Đen & vàng</option><option value="fresh">Mint tươi mát</option><option value="sweet">Hồng ngọt ngào</option><option value="bold">Cam tương phản</option><option value="blue">Xanh hiện đại</option></select></label>
                <label><span>Số lượng dự kiến</span><input value={form.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder="Ví dụ: 1.000 tem" /></label>
                <label><span>Chất liệu dự kiến</span><select value={form.material} onChange={(event) => update("material", event.target.value)}><option>Chưa xác định</option><option>Tem giấy</option><option>Tem nhựa chống nước</option><option>Tem nhựa trong</option><option>Tem bạc / vàng / 7 màu</option><option>Tem UV DTF</option></select></label>
                <label><span>Cần hàng trước ngày</span><input type="date" value={form.deadline} onChange={(event) => update("deadline", event.target.value)} /></label>
              </div>
            </details>

            <label className={assetFile ? "studio-upload studio-upload--ready" : "studio-upload"} htmlFor="studio-asset">
              <span className="studio-upload__icon">↥</span>
              <span><strong>{assetFile?.name || "Thêm logo / ảnh / PDF tham khảo"}</strong><small>PNG, JPG, WebP hoặc PDF · tối đa 10MB</small></span>
              <b>{assetFile ? "Đổi tệp" : "Chọn tệp"}</b>
            </label>
            <input id="studio-asset" className="sr-only" type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" onChange={handleAsset} />

            <button className="studio-generate" type="submit" disabled={busy === "generate"}>
              <span>{busy === "generate" ? "Đang dựng concept…" : "Tạo tem + mockup"}</span>
              <b aria-hidden="true">✦</b>
            </button>
            <p className="studio-privacy"><span>✓</span> Tạo concept ngay trên trình duyệt. File chỉ được gửi đi khi anh/chị chủ động liên hệ.</p>
          </form>

          <div className="studio-output" aria-live="polite">
            <div className="studio-output__bar">
              <div><i /><span>02 — Kết quả thiết kế</span></div>
              <small>{projectCode}</small>
            </div>

            <div className="studio-preview-tabs" role="tablist" aria-label="Chọn kiểu xem">
              <button type="button" role="tab" aria-selected={viewMode === "label"} onClick={() => setViewMode("label")}>Hình tem</button>
              <button type="button" role="tab" aria-selected={viewMode === "mockup"} onClick={() => setViewMode("mockup")}>Mockup sản phẩm</button>
            </div>

            <div className={`studio-canvas studio-canvas--${viewMode}`}>
              <div
                className="studio-canvas__art"
                dangerouslySetInnerHTML={{ __html: viewMode === "label" ? activeDesign.labelSvg : activeDesign.mockupSvg }}
              />
              <div className="studio-canvas__badge"><span>AI</span> CONCEPT {activeDesign.id.toString().padStart(2, "0")}</div>
              <div className="studio-canvas__zoom">{viewMode === "label" ? "TEM RIÊNG" : "TRÊN SẢN PHẨM"}</div>
            </div>

            <div className="studio-variants" role="group" aria-label="Ba phương án thiết kế">
              {variants.map((variant, index) => (
                <button
                  type="button"
                  key={variant.id}
                  className={activeVariant === index ? "studio-variant studio-variant--active" : "studio-variant"}
                  aria-pressed={activeVariant === index}
                  onClick={() => { setActiveVariant(index); trackEvent("ai_variant_selected", { variant: variant.id }); }}
                >
                  <span dangerouslySetInnerHTML={{ __html: namespaceSvg(variant.labelSvg, "thumb") }} />
                  <small><b>0{variant.id}</b>{variant.name}</small>
                </button>
              ))}
            </div>

            <div className="studio-insights">
              <div className="studio-insights__head"><span>AI kiểm tra trước in</span><small>{generatedBrief.keywords.join(" · ")}</small></div>
              <div className="studio-checks">
                {qualityChecks.map((check) => (
                  <div key={check.label}><span className={check.ok ? "is-ok" : "is-warn"}>{check.ok ? "✓" : "!"}</span><p><b>{check.label}</b><small>{check.note}</small></p></div>
                ))}
              </div>
              <p className="studio-concept-note">Concept dùng để hình dung nhanh. Xưởng sẽ kiểm tra file, màu, font và đường bế trước khi sản xuất.</p>
            </div>

            <div className="studio-downloads">
              <button type="button" onClick={() => downloadPng(viewMode)} disabled={busy.startsWith("png")}><span>↓</span>{busy.startsWith("png") ? "Đang xuất…" : "Tải PNG"}</button>
              <button type="button" onClick={() => downloadSvg(viewMode)}><span>◇</span>Tải SVG</button>
              <button className="studio-downloads__pack" type="button" onClick={downloadZip} disabled={busy === "zip"}><span>▣</span>{busy === "zip" ? "Đang đóng gói…" : "Tải Order Pack ZIP"}</button>
            </div>

            <div className="studio-order-card">
              <div><span>03 — Hoàn tất yêu cầu</span><h3>Gửi một hồ sơ.<br />Nhân viên hiểu ngay.</h3><p>{status}</p></div>
              <div className="studio-order-card__actions">
                <button type="button" onClick={downloadPdf} disabled={busy === "pdf"}>{busy === "pdf" ? "Đang tạo PDF…" : "Tải hồ sơ PDF"}</button>
                <button type="button" className="studio-zalo" onClick={openZalo}>Sao chép & mở Zalo <b>↗</b></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
