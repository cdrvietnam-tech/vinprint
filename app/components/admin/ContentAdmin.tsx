"use client";

import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SiteContent,
} from "../../lib/site-content";

type Status = { kind: "idle" | "loading" | "saving" | "ok" | "error"; message?: string };

/** Cập nhật bất biến theo đường dẫn (path) trong object nội dung. */
function setIn<T>(obj: T, path: (string | number)[], value: unknown): T {
  const clone = structuredClone(obj) as T;
  let cursor = clone as unknown as Record<string | number, unknown>;
  for (let i = 0; i < path.length - 1; i += 1) {
    cursor = cursor[path[i]] as Record<string | number, unknown>;
  }
  cursor[path[path.length - 1]] = value;
  return clone;
}

function Field({
  label,
  value,
  onChange,
  area = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-gray-600">{label}</span>
      {area ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      )}
    </label>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span>
          <span className="text-base font-black text-gray-900">{title}</span>
          {hint ? <span className="ml-2 text-xs font-medium text-gray-500">{hint}</span> : null}
        </span>
        <span className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open ? <div className="space-y-4 border-t border-gray-100 px-5 py-5">{children}</div> : null}
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function ItemCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wide text-gray-400">#{index + 1}</span>
        <button type="button" onClick={onRemove} className="rounded-md px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50">
          Xoá
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-bold text-gray-600 hover:border-orange-400 hover:text-orange-600">
      + {label}
    </button>
  );
}

export default function ContentAdmin() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  const update = (path: (string | number)[], value: unknown) =>
    setContent((current) => setIn(current, path, value));

  useEffect(() => {
    fetch("/api/admin/site-content", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((data) => {
        setContent(mergeSiteContent(data));
        setStatus({ kind: "idle" });
      })
      .catch(() => setStatus({ kind: "error", message: "Không tải được nội dung. Kiểm tra đăng nhập quản trị (Cloudflare Access)." }));
  }, []);

  const save = async () => {
    setStatus({ kind: "saving" });
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus({ kind: "ok", message: "Đã lưu. Tải lại trang chủ để xem thay đổi." });
    } catch {
      setStatus({ kind: "error", message: "Lưu thất bại. Thử lại hoặc kiểm tra đăng nhập." });
    }
  };

  const resetAll = async () => {
    if (!window.confirm("Khôi phục toàn bộ về nội dung mặc định? Thao tác này xoá nội dung đã lưu.")) return;
    setStatus({ kind: "saving" });
    try {
      const response = await fetch("/api/admin/site-content", { method: "DELETE" });
      if (!response.ok) throw new Error(String(response.status));
      setContent(DEFAULT_SITE_CONTENT);
      setStatus({ kind: "ok", message: "Đã khôi phục nội dung mặc định." });
    } catch {
      setStatus({ kind: "error", message: "Khôi phục thất bại. Kiểm tra đăng nhập quản trị." });
    }
  };

  const c = content;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AdminNav active="noi-dung" />
      <header className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Quản trị nội dung trang chủ</h1>
        <p className="mt-1 text-sm text-gray-600">Sửa chữ và số trên trang chủ. Ảnh/video quản lý ở trang riêng. Nhấn <b>Lưu</b> để áp dụng.</p>
      </header>

      {status.kind === "loading" ? (
        <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600">Đang tải nội dung…</p>
      ) : (
        <div className="space-y-4">
          <Section title="Thông tin liên hệ" hint="dùng chung toàn site">
            <Row>
              <Field label="SĐT (bấm gọi)" value={c.contact.phone} onChange={(v) => update(["contact", "phone"], v)} />
              <Field label="SĐT (hiển thị)" value={c.contact.phoneDisplay} onChange={(v) => update(["contact", "phoneDisplay"], v)} />
            </Row>
            <Field label="Link Zalo" value={c.contact.zaloUrl} onChange={(v) => update(["contact", "zaloUrl"], v)} />
            <Field label="Địa chỉ" value={c.contact.address} onChange={(v) => update(["contact", "address"], v)} />
            <Row>
              <Field label="Giờ làm việc (dòng 1)" value={c.contact.hoursWeekday} onChange={(v) => update(["contact", "hoursWeekday"], v)} />
              <Field label="Giờ làm việc (dòng 2)" value={c.contact.hoursWeekend} onChange={(v) => update(["contact", "hoursWeekend"], v)} />
            </Row>
          </Section>

          <Section title="Header (menu)">
            <Field label="Dòng slogan dưới logo" value={c.header.tagline} onChange={(v) => update(["header", "tagline"], v)} />
            <Row>
              <Field label="Nút 'Xem combo'" value={c.header.ctaComboLabel} onChange={(v) => update(["header", "ctaComboLabel"], v)} />
              <Field label="Nút 'Nhắn Zalo'" value={c.header.ctaZaloLabel} onChange={(v) => update(["header", "ctaZaloLabel"], v)} />
            </Row>
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-600">Các mục menu</span>
              {c.header.menu.map((item, i) => (
                <ItemCard key={i} index={i} onRemove={() => update(["header", "menu"], c.header.menu.filter((_, j) => j !== i))}>
                  <Row>
                    <Field label="Tên hiển thị" value={item.label} onChange={(v) => update(["header", "menu", i, "label"], v)} />
                    <Field label="Đường dẫn" value={item.href} onChange={(v) => update(["header", "menu", i, "href"], v)} />
                  </Row>
                </ItemCard>
              ))}
              <AddButton label="Thêm mục menu" onClick={() => update(["header", "menu"], [...c.header.menu, { label: "Mục mới", href: "/" }])} />
            </div>
          </Section>

          <Section title="Hero (đầu trang)">
            <Field label="Nhãn nhỏ phía trên" value={c.hero.eyebrow} onChange={(v) => update(["hero", "eyebrow"], v)} />
            <Row>
              <Field label="Tiêu đề dòng 1" value={c.hero.titleLine1} onChange={(v) => update(["hero", "titleLine1"], v)} />
              <Field label="Tiêu đề dòng 2 (màu cam)" value={c.hero.titleLine2} onChange={(v) => update(["hero", "titleLine2"], v)} />
            </Row>
            <Field label="Mô tả" area value={c.hero.subtitle} onChange={(v) => update(["hero", "subtitle"], v)} />
            <div className="space-y-2">
              <span className="block text-xs font-bold text-gray-600">4 điểm mạnh</span>
              {c.hero.features.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input value={item} onChange={(e) => update(["hero", "features", i], e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <button type="button" onClick={() => update(["hero", "features"], c.hero.features.filter((_, j) => j !== i))} className="rounded-md px-2 text-xs font-bold text-red-600 hover:bg-red-50">Xoá</button>
                </div>
              ))}
              <AddButton label="Thêm điểm mạnh" onClick={() => update(["hero", "features"], [...c.hero.features, "Điểm mạnh mới"])} />
            </div>
            <Row>
              <Field label="Nút chính - chữ" value={c.hero.primaryCta.label} onChange={(v) => update(["hero", "primaryCta", "label"], v)} />
              <Field label="Nút chính - link" value={c.hero.primaryCta.href} onChange={(v) => update(["hero", "primaryCta", "href"], v)} />
            </Row>
            <Row>
              <Field label="Nút phụ - chữ" value={c.hero.secondaryCta.label} onChange={(v) => update(["hero", "secondaryCta", "label"], v)} />
              <Field label="Nút phụ - link" value={c.hero.secondaryCta.href} onChange={(v) => update(["hero", "secondaryCta", "href"], v)} />
            </Row>
            <Row>
              <Field label="Điểm đánh giá" value={c.hero.ratingValue} onChange={(v) => update(["hero", "ratingValue"], v)} />
              <Field label="Link đánh giá" value={c.hero.ratingHref} onChange={(v) => update(["hero", "ratingHref"], v)} />
            </Row>
            <Field label="Dòng chữ đánh giá" value={c.hero.ratingText} onChange={(v) => update(["hero", "ratingText"], v)} />
          </Section>

          <Section title="Thanh số liệu" hint="dải nền tối dưới hero">
            {c.stats.map((item, i) => (
              <ItemCard key={i} index={i} onRemove={() => update(["stats"], c.stats.filter((_, j) => j !== i))}>
                <Row>
                  <Field label="Số" value={item.value} onChange={(v) => update(["stats", i, "value"], v)} />
                  <Field label="Nhãn" value={item.label} onChange={(v) => update(["stats", i, "label"], v)} />
                </Row>
              </ItemCard>
            ))}
            <AddButton label="Thêm số liệu" onClick={() => update(["stats"], [...c.stats, { value: "0", label: "Nhãn" }])} />
          </Section>

          <Section title="Bảng giá" hint="chữ; ảnh poster quản ở trang ảnh">
            <Field label="Nhãn nhỏ" value={c.pricing.badge} onChange={(v) => update(["pricing", "badge"], v)} />
            <Field label="Tiêu đề" value={c.pricing.title} onChange={(v) => update(["pricing", "title"], v)} />
            <Field label="Mô tả" area value={c.pricing.subtitle} onChange={(v) => update(["pricing", "subtitle"], v)} />
            <Field label="Dòng lưu ý" area value={c.pricing.disclaimer} onChange={(v) => update(["pricing", "disclaimer"], v)} />
            <Field label="Nút báo giá sỉ" value={c.pricing.quoteCtaLabel} onChange={(v) => update(["pricing", "quoteCtaLabel"], v)} />
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-600">4 poster (chữ)</span>
              {c.pricing.posters.map((poster, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3">
                  <span className="mb-2 block text-xs font-black uppercase text-gray-400">Poster #{i + 1}</span>
                  <div className="space-y-3">
                    <Field label="Tiêu đề poster" value={poster.title} onChange={(v) => update(["pricing", "posters", i, "title"], v)} />
                    <Field label="Chú thích" value={poster.note} onChange={(v) => update(["pricing", "posters", i, "note"], v)} />
                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-gray-600">Các dòng chi tiết</span>
                      {poster.details.map((line, k) => (
                        <div key={k} className="flex gap-2">
                          <input value={line} onChange={(e) => update(["pricing", "posters", i, "details", k], e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                          <button type="button" onClick={() => update(["pricing", "posters", i, "details"], poster.details.filter((_, j) => j !== k))} className="rounded-md px-2 text-xs font-bold text-red-600 hover:bg-red-50">Xoá</button>
                        </div>
                      ))}
                      <AddButton label="Thêm dòng" onClick={() => update(["pricing", "posters", i, "details"], [...poster.details, "Nội dung mới"])} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <span className="block text-xs font-bold text-gray-600">Quyền lợi (dòng cuối)</span>
              {c.pricing.benefits.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input value={item} onChange={(e) => update(["pricing", "benefits", i], e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <button type="button" onClick={() => update(["pricing", "benefits"], c.pricing.benefits.filter((_, j) => j !== i))} className="rounded-md px-2 text-xs font-bold text-red-600 hover:bg-red-50">Xoá</button>
                </div>
              ))}
              <AddButton label="Thêm quyền lợi" onClick={() => update(["pricing", "benefits"], [...c.pricing.benefits, "Quyền lợi mới"])} />
            </div>
          </Section>

          <Section title="Quy trình">
            <Row>
              <Field label="Tiêu đề" value={c.process.title} onChange={(v) => update(["process", "title"], v)} />
              <Field label="Phụ đề" value={c.process.subtitle} onChange={(v) => update(["process", "subtitle"], v)} />
            </Row>
            {c.process.steps.map((step, i) => (
              <ItemCard key={i} index={i} onRemove={() => update(["process", "steps"], c.process.steps.filter((_, j) => j !== i))}>
                <Field label="Tên bước" value={step.title} onChange={(v) => update(["process", "steps", i, "title"], v)} />
                <Field label="Mô tả bước" value={step.desc} onChange={(v) => update(["process", "steps", i, "desc"], v)} />
              </ItemCard>
            ))}
            <AddButton label="Thêm bước" onClick={() => update(["process", "steps"], [...c.process.steps, { title: "Bước mới", desc: "" }])} />
          </Section>

          <Section title="Đánh giá">
            <Row>
              <Field label="Tiêu đề" value={c.reviews.title} onChange={(v) => update(["reviews", "title"], v)} />
              <Field label="Điểm" value={c.reviews.ratingValue} onChange={(v) => update(["reviews", "ratingValue"], v)} />
            </Row>
            <Field label="Số lượng đánh giá (chữ)" value={c.reviews.ratingCount} onChange={(v) => update(["reviews", "ratingCount"], v)} />
            {c.reviews.items.map((review, i) => (
              <ItemCard key={i} index={i} onRemove={() => update(["reviews", "items"], c.reviews.items.filter((_, j) => j !== i))}>
                <Row>
                  <Field label="Tên khách" value={review.name} onChange={(v) => update(["reviews", "items", i, "name"], v)} />
                  <Field label="Nền tảng (Google/Shopee/Facebook)" value={review.platform} onChange={(v) => update(["reviews", "items", i, "platform"], v)} />
                </Row>
                <Field label="Nội dung" area value={review.text} onChange={(v) => update(["reviews", "items", i, "text"], v)} />
              </ItemCard>
            ))}
            <AddButton label="Thêm đánh giá" onClick={() => update(["reviews", "items"], [...c.reviews.items, { name: "Khách hàng", platform: "Shopee", text: "" }])} />
          </Section>

          <Section title="FAQ + Quét Zalo">
            <Field label="Tiêu đề FAQ" value={c.faq.title} onChange={(v) => update(["faq", "title"], v)} />
            {c.faq.items.map((item, i) => (
              <ItemCard key={i} index={i} onRemove={() => update(["faq", "items"], c.faq.items.filter((_, j) => j !== i))}>
                <Field label="Câu hỏi" value={item.q} onChange={(v) => update(["faq", "items", i, "q"], v)} />
                <Field label="Trả lời" area value={item.a} onChange={(v) => update(["faq", "items", i, "a"], v)} />
              </ItemCard>
            ))}
            <AddButton label="Thêm câu hỏi" onClick={() => update(["faq", "items"], [...c.faq.items, { q: "Câu hỏi mới?", a: "" }])} />
            <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3">
              <span className="mb-2 block text-xs font-black uppercase text-purple-400">Khối quét Zalo</span>
              <div className="space-y-3">
                <Field label="Tiêu đề" value={c.faq.qrTitle} onChange={(v) => update(["faq", "qrTitle"], v)} />
                <Field label="Phụ đề" value={c.faq.qrSubtitle} onChange={(v) => update(["faq", "qrSubtitle"], v)} />
                <Field label="Nút" value={c.faq.qrCtaLabel} onChange={(v) => update(["faq", "qrCtaLabel"], v)} />
              </div>
            </div>
          </Section>

          <Section title="Banner CTA cuối trang">
            <Field label="Tiêu đề" value={c.finalCta.title} onChange={(v) => update(["finalCta", "title"], v)} />
            <Field label="Phụ đề" value={c.finalCta.subtitle} onChange={(v) => update(["finalCta", "subtitle"], v)} />
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-600">3 nhãn nhỏ (tick xanh / gạch đỏ)</span>
              {c.finalCta.badges.map((badge, i) => (
                <ItemCard key={i} index={i} onRemove={() => update(["finalCta", "badges"], c.finalCta.badges.filter((_, j) => j !== i))}>
                  <Field label="Chữ" value={badge.text} onChange={(v) => update(["finalCta", "badges", i, "text"], v)} />
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input type="checkbox" checked={badge.ok} onChange={(e) => update(["finalCta", "badges", i, "ok"], e.target.checked)} />
                    Dấu tick xanh (bỏ chọn = gạch đỏ)
                  </label>
                </ItemCard>
              ))}
              <AddButton label="Thêm nhãn" onClick={() => update(["finalCta", "badges"], [...c.finalCta.badges, { text: "Nhãn mới", ok: true }])} />
            </div>
            <Row>
              <Field label="Nút Zalo" value={c.finalCta.zaloLabel} onChange={(v) => update(["finalCta", "zaloLabel"], v)} />
              <Field label="Nút combo" value={c.finalCta.comboLabel} onChange={(v) => update(["finalCta", "comboLabel"], v)} />
            </Row>
            <Field label="Dòng tin cậy" value={c.finalCta.trustText} onChange={(v) => update(["finalCta", "trustText"], v)} />
          </Section>

          <Section title="Footer (chân trang)">
            <Field label="Mô tả VinPrint" area value={c.footer.about} onChange={(v) => update(["footer", "about"], v)} />
            <Field label="Dòng bản quyền" value={c.footer.copyright} onChange={(v) => update(["footer", "copyright"], v)} />
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-600">Cột “Sản phẩm”</span>
              {c.footer.productLinks.map((item, i) => (
                <ItemCard key={i} index={i} onRemove={() => update(["footer", "productLinks"], c.footer.productLinks.filter((_, j) => j !== i))}>
                  <Row>
                    <Field label="Tên" value={item.label} onChange={(v) => update(["footer", "productLinks", i, "label"], v)} />
                    <Field label="Link" value={item.href} onChange={(v) => update(["footer", "productLinks", i, "href"], v)} />
                  </Row>
                </ItemCard>
              ))}
              <AddButton label="Thêm liên kết sản phẩm" onClick={() => update(["footer", "productLinks"], [...c.footer.productLinks, { label: "Mục mới", href: "/" }])} />
            </div>
            <div className="space-y-3">
              <span className="block text-xs font-bold text-gray-600">Cột “VinPrint”</span>
              {c.footer.companyLinks.map((item, i) => (
                <ItemCard key={i} index={i} onRemove={() => update(["footer", "companyLinks"], c.footer.companyLinks.filter((_, j) => j !== i))}>
                  <Row>
                    <Field label="Tên" value={item.label} onChange={(v) => update(["footer", "companyLinks", i, "label"], v)} />
                    <Field label="Link" value={item.href} onChange={(v) => update(["footer", "companyLinks", i, "href"], v)} />
                  </Row>
                </ItemCard>
              ))}
              <AddButton label="Thêm liên kết" onClick={() => update(["footer", "companyLinks"], [...c.footer.companyLinks, { label: "Mục mới", href: "/" }])} />
            </div>
          </Section>
        </div>
      )}

      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-gray-200 bg-white/95 py-4 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={status.kind === "saving" || status.kind === "loading"}
          className="rounded-full bg-orange-600 px-6 py-3 text-sm font-black text-white shadow hover:bg-orange-700 disabled:opacity-50"
        >
          {status.kind === "saving" ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={resetAll}
          disabled={status.kind === "saving" || status.kind === "loading"}
          className="rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Khôi phục mặc định
        </button>
        {status.message ? (
          <span className={`text-sm font-bold ${status.kind === "error" ? "text-red-600" : "text-green-700"}`}>{status.message}</span>
        ) : null}
      </div>
    </div>
  );
}
