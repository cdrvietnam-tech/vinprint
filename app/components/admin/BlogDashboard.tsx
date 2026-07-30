"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import AdminNav from "./AdminNav";

export type BlogRow = {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  status: "draft" | "rejected" | "scheduled" | "published";
  publishAt: string;
  updatedAt: string;
  readingMinutes: number;
  qualityTotal: number;
  isLive: boolean;
};

const STATUS_META: Record<BlogRow["status"], { label: string; cls: string }> = {
  published: { label: "Đã đăng", cls: "bg-emerald-100 text-emerald-800" },
  scheduled: { label: "Đã lên lịch", cls: "bg-blue-100 text-blue-800" },
  draft: { label: "Bản nháp", cls: "bg-amber-100 text-amber-800" },
  rejected: { label: "Bị loại", cls: "bg-red-100 text-red-700" },
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function BlogDashboard({ rows }: { rows: BlogRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | BlogRow["status"]>("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((row) => map.set(row.category, row.categoryLabel));
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [rows]);

  const counts = useMemo(() => {
    const base = { total: rows.length, live: 0, published: 0, scheduled: 0, draft: 0, rejected: 0 };
    rows.forEach((row) => {
      base[row.status] += 1;
      if (row.isLive) base.live += 1;
    });
    return base;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (category !== "all" && row.category !== category) return false;
      if (q && !row.title.toLowerCase().includes(q) && !row.slug.includes(q)) return false;
      return true;
    });
  }, [rows, query, status, category]);

  const summary = [
    { label: "Tổng bài", value: counts.total, cls: "text-gray-900" },
    { label: "Đang hiển thị", value: counts.live, cls: "text-emerald-700" },
    { label: "Đã đăng", value: counts.published, cls: "text-emerald-700" },
    { label: "Lên lịch", value: counts.scheduled, cls: "text-blue-700" },
    { label: "Nháp", value: counts.draft, cls: "text-amber-700" },
    { label: "Bị loại", value: counts.rejected, cls: "text-red-600" },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 sm:px-8 sm:py-10 text-gray-950">
      <div className="mx-auto max-w-6xl">
        <AdminNav active="bai-viet" />

        <header className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Cẩm nang in ấn</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Theo dõi bài viết</h1>
          <p className="mt-3 max-w-2xl font-medium leading-relaxed text-gray-700">
            Danh sách toàn bộ bài blog và trạng thái. Đây là bảng theo dõi (chỉ xem); bài viết được tạo và kiểm định qua quy trình biên tập tự động.
          </p>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
              <div className={`text-2xl font-black ${item.cls}`}>{item.value}</div>
              <div className="mt-1 text-xs font-bold text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tiêu đề hoặc slug…"
            className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 lg:max-w-sm"
          />
          <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium">
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="draft">Bản nháp</option>
            <option value="rejected">Bị loại</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium">
            <option value="all">Tất cả chuyên mục</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-black">Tiêu đề</th>
                <th className="px-4 py-3 font-black">Chuyên mục</th>
                <th className="px-4 py-3 font-black">Trạng thái</th>
                <th className="px-4 py-3 font-black">Ngày đăng</th>
                <th className="px-4 py-3 font-black">Phút đọc</th>
                <th className="px-4 py-3 font-black">Điểm CL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <tr key={row.slug} className="align-top hover:bg-orange-50/40">
                  <td className="px-4 py-3">
                    {row.isLive ? (
                      <Link href={`/blog/${row.slug}`} target="_blank" className="font-bold text-gray-900 hover:text-orange-700 hover:underline">
                        {row.title}
                      </Link>
                    ) : (
                      <span className="font-bold text-gray-700">{row.title}</span>
                    )}
                    <div className="mt-0.5 text-xs text-gray-400">/{row.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.categoryLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_META[row.status].cls}`}>
                      {STATUS_META[row.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(row.publishAt)}</td>
                  <td className="px-4 py-3 text-gray-700">{row.readingMinutes}&apos;</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${row.qualityTotal >= 80 ? "text-emerald-700" : row.qualityTotal >= 60 ? "text-amber-700" : "text-gray-500"}`}>
                      {row.qualityTotal}/100
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm font-medium text-gray-400">
                    Không có bài nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
