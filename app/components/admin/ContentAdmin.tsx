"use client";

import { ArrowLeft, CheckCircle2, ExternalLink, FileText, Loader2, Package, RotateCcw, Save, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ManagedArticleOverride, ManagedContentType, ManagedProductOverride } from "../../lib/content-management";

type EditableProduct = ManagedProductOverride;
type EditableArticle = ManagedArticleOverride;
type EditableItem = EditableProduct | EditableArticle;

function isProduct(item: EditableItem): item is EditableProduct {
  return "name" in item;
}

export default function ContentAdmin({ products, articles }: { products: EditableProduct[]; articles: EditableArticle[] }) {
  const [activeType, setActiveType] = useState<ManagedContentType>("products");
  const [productItems, setProductItems] = useState(products);
  const [articleItems, setArticleItems] = useState(articles);
  const [overridden, setOverridden] = useState<Record<ManagedContentType, Set<string>>>({
    products: new Set(),
    articles: new Set(),
  });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all((["products", "articles"] as const).map(async (type) => {
      const response = await fetch(`/api/admin/content?type=${type}`, { cache: "no-store" });
      const result = response.ok ? await response.json() as { items: EditableItem[] } : { items: [] };
      return { type, items: result.items };
    })).then((results) => {
      for (const result of results) {
        setOverridden((current) => ({ ...current, [result.type]: new Set(result.items.map((item) => item.slug)) }));
        if (result.type === "products") {
          const overrides = new Map((result.items as EditableProduct[]).map((item) => [item.slug, item]));
          setProductItems(products.map((item) => overrides.get(item.slug) || item));
        } else {
          const overrides = new Map((result.items as EditableArticle[]).map((item) => [item.slug, item]));
          setArticleItems(articles.map((item) => overrides.get(item.slug) || item));
        }
      }
    }).catch(() => setMessage("Chưa tải được nội dung đã chỉnh. Anh thử tải lại trang."));
  }, [articles, products]);

  const currentItems: EditableItem[] = activeType === "products" ? productItems : articleItems;
  const visibleItems = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi");
    return currentItems.filter((item) => {
      const title = isProduct(item) ? item.name : item.title;
      return !keyword || `${title} ${item.slug}`.toLocaleLowerCase("vi").includes(keyword);
    });
  }, [currentItems, query]);

  const updateItem = (slug: string, patch: Partial<EditableProduct & EditableArticle>) => {
    if (activeType === "products") {
      setProductItems((items) => items.map((item) => item.slug === slug ? { ...item, ...patch } : item));
    } else {
      setArticleItems((items) => items.map((item) => item.slug === slug ? { ...item, ...patch } : item));
    }
  };

  const saveItem = async (item: EditableItem) => {
    setBusy(item.slug);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/content?type=${activeType}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(item),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "save_failed");
      setOverridden((current) => {
        const next = new Set(current[activeType]);
        next.add(item.slug);
        return { ...current, [activeType]: next };
      });
      setMessage(`Đã lưu “${isProduct(item) ? item.name : item.title}”.`);
    } catch {
      setMessage("Không thể lưu. Anh kiểm tra lại nội dung hoặc thử lại.");
    } finally {
      setBusy(null);
    }
  };

  const restoreItem = async (item: EditableItem) => {
    if (!window.confirm("Khôi phục toàn bộ nội dung gốc của mục này?")) return;
    setBusy(item.slug);
    try {
      const response = await fetch(`/api/admin/content?type=${activeType}&slug=${encodeURIComponent(item.slug)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("restore_failed");
      if (activeType === "products") {
        const original = products.find((entry) => entry.slug === item.slug);
        if (original) setProductItems((items) => items.map((entry) => entry.slug === item.slug ? original : entry));
      } else {
        const original = articles.find((entry) => entry.slug === item.slug);
        if (original) setArticleItems((items) => items.map((entry) => entry.slug === item.slug ? original : entry));
      }
      setOverridden((current) => {
        const next = new Set(current[activeType]);
        next.delete(item.slug);
        return { ...current, [activeType]: next };
      });
      setMessage("Đã khôi phục nội dung gốc.");
    } catch {
      setMessage("Không thể khôi phục lúc này.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 text-gray-950 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-black shadow-sm"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/yeu-cau-bao-gia" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-700 px-5 text-sm font-black text-white">Yêu cầu báo giá <ExternalLink className="h-4 w-4" /></Link>
            <Link href="/admin/hinh-anh" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-700 px-5 text-sm font-black text-white">Quản trị hình ảnh <ExternalLink className="h-4 w-4" /></Link>
          </div>
        </div>

        <header className="mt-8 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Trung tâm nội dung VinPrint</p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">Quản trị bài viết và sản phẩm</h1>
          <p className="mt-4 font-medium leading-7 text-gray-700">Chỉnh nội dung đang có mà không đổi đường dẫn, giúp giữ nguyên liên kết SEO. Mỗi mục có thể khôi phục về bản gốc.</p>
        </header>

        <section className="mt-8 rounded-[32px] border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => { setActiveType("products"); setQuery(""); }} className={`flex min-h-16 items-center justify-center gap-3 rounded-2xl font-black ${activeType === "products" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-700"}`}><Package className="h-5 w-5" /> Quản trị sản phẩm ({products.length})</button>
            <button type="button" onClick={() => { setActiveType("articles"); setQuery(""); }} className={`flex min-h-16 items-center justify-center gap-3 rounded-2xl font-black ${activeType === "articles" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-700"}`}><FileText className="h-5 w-5" /> Quản trị bài viết ({articles.length})</button>
          </div>

          <label className="relative mt-5 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={activeType === "products" ? "Tìm sản phẩm…" : "Tìm bài viết…"} className="min-h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-bold outline-none focus:border-orange-500" />
          </label>

          {message && <p role="status" className="mt-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-800"><CheckCircle2 className="h-4 w-4" /> {message}</p>}

          <div className="mt-6 space-y-4">
            {visibleItems.map((item) => (
              <details key={`${activeType}-${item.slug}`} className="group rounded-3xl border border-gray-200 bg-[#fffdf9] p-4 open:border-orange-300 sm:p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black">{isProduct(item) ? item.name : item.title}</p>
                    <p className="mt-1 truncate text-xs font-bold text-gray-500">/{activeType === "products" ? "san-pham" : "blog"}/{item.slug}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${overridden[activeType].has(item.slug) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{overridden[activeType].has(item.slug) ? "Đã chỉnh" : "Bản gốc"}</span>
                </summary>

                <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5">
                  {isProduct(item) ? (
                    <>
                      <Field label="Tên sản phẩm" value={item.name} onChange={(value) => updateItem(item.slug, { name: value })} />
                      <Field label="Dòng giới thiệu ngắn" value={item.eyebrow} onChange={(value) => updateItem(item.slug, { eyebrow: value })} />
                      <Field multiline label="Mô tả sản phẩm" value={item.description} onChange={(value) => updateItem(item.slug, { description: value })} />
                      <Field multiline label="Lợi ích nổi bật" value={item.benefit} onChange={(value) => updateItem(item.slug, { benefit: value })} />
                      <Field label="Ứng dụng (cách nhau bằng dấu phẩy)" value={item.uses.join(", ")} onChange={(value) => updateItem(item.slug, { uses: value.split(",").map((entry) => entry.trim()).filter(Boolean) })} />
                    </>
                  ) : (
                    <>
                      <Field label="Tiêu đề bài viết" value={item.title} onChange={(value) => updateItem(item.slug, { title: value })} />
                      <Field multiline label="Mô tả SEO và danh sách bài viết" value={item.description} onChange={(value) => updateItem(item.slug, { description: value })} />
                      <Field multiline label="Câu trả lời ngắn đầu bài" value={item.directAnswer} onChange={(value) => updateItem(item.slug, { directAnswer: value })} />
                      <div className="space-y-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                        <p className="text-sm font-black text-violet-800">Nội dung chính của bài viết</p>
                        {item.sections.map((section, sectionIndex) => (
                          <div key={`${item.slug}-${sectionIndex}`} className="rounded-2xl bg-white p-4 shadow-sm">
                            <Field
                              label={`Tiêu đề phần ${sectionIndex + 1}`}
                              value={section.heading}
                              onChange={(value) => updateItem(item.slug, {
                                sections: item.sections.map((entry, index) => index === sectionIndex ? { ...entry, heading: value } : entry),
                              })}
                            />
                            <Field
                              multiline
                              label="Các đoạn nội dung (cách nhau bằng một dòng trống)"
                              value={section.paragraphs.join("\n\n")}
                              onChange={(value) => updateItem(item.slug, {
                                sections: item.sections.map((entry, index) => index === sectionIndex
                                  ? { ...entry, paragraphs: value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) }
                                  : entry),
                              })}
                            />
                            {section.bullets && (
                              <Field
                                multiline
                                label="Các ý chính (mỗi dòng một ý)"
                                value={section.bullets.join("\n")}
                                onChange={(value) => updateItem(item.slug, {
                                  sections: item.sections.map((entry, index) => index === sectionIndex
                                    ? { ...entry, bullets: value.split("\n").map((bullet) => bullet.trim()).filter(Boolean) }
                                    : entry),
                                })}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" disabled={busy !== null} onClick={() => void saveItem(item)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-600 px-5 text-sm font-black text-white disabled:opacity-50">{busy === item.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu thay đổi</button>
                  <button type="button" disabled={busy !== null || !overridden[activeType].has(item.slug)} onClick={() => void restoreItem(item)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-100 px-5 text-sm font-black text-gray-700 disabled:opacity-40"><RotateCcw className="h-4 w-4" /> Khôi phục bản gốc</button>
                  <Link href={`/${activeType === "products" ? "san-pham" : "blog"}/${item.slug}`} target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-violet-50 px-5 text-sm font-black text-violet-700">Xem trang <ExternalLink className="h-4 w-4" /></Link>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  const className = "mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold leading-7 outline-none focus:border-orange-500";
  return (
    <label className="block text-sm font-black text-gray-800">
      {label}
      {multiline
        ? <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} className={className} />
        : <input value={value} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  );
}
