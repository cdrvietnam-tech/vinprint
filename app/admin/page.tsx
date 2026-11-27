import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import { allBlogArticles, selectPublicArticles } from "../lib/blog-posts";
import { companyPages, guidePages, industryPages } from "../lib/content-pages";
import { seasonalPages } from "../lib/seasonal-pages";
import { products } from "../lib/products";

export const metadata: Metadata = {
  title: "Trung tâm quản trị | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" });
}

export default function AdminHomePage() {
  const now = new Date();
  const totalArticles = allBlogArticles.length;
  const liveArticles = selectPublicArticles(allBlogArticles, now);
  const latestArticle = liveArticles[0];
  const daysSinceLatest = latestArticle
    ? Math.floor((now.getTime() - new Date(latestArticle.publishAt).getTime()) / DAY_MS)
    : null;
  const contentPageCount = Object.keys(companyPages).length + Object.keys(industryPages).length + Object.keys(guidePages).length;
  const seasonalList = Object.values(seasonalPages);

  const stats = [
    { label: "Bài viết đang hiển thị", value: `${liveArticles.length}/${totalArticles}`, note: latestArticle ? `Bài mới nhất: ${formatDate(latestArticle.publishAt)}` : "Chưa có bài nào" },
    { label: "Trang sản phẩm", value: String(products.length), note: "Trong /san-pham" },
    { label: "Trang nội dung", value: String(contentPageCount), note: "Giới thiệu, ngành, hướng dẫn" },
    { label: "Trang mùa vụ", value: String(seasonalList.length), note: "Đang mở trong /nganh" },
  ];

  const reminders: { text: string; href?: string; cta?: string }[] = [];
  if (daysSinceLatest !== null && daysSinceLatest > 30) {
    reminders.push({ text: `Đã ${daysSinceLatest} ngày chưa có bài viết mới. Google ưu tiên trang được cập nhật đều.`, href: "/admin/bai-viet", cta: "Xem bài viết" });
  }
  if (seasonalList.length > 0) {
    reminders.push({ text: "Trang mùa vụ đang mở: kiểm tra hạn chót nhận đơn và lịch nghỉ trước khi vào cao điểm.", href: `/nganh/${seasonalList[0].slug}`, cta: "Mở trang mùa vụ" });
  }

  const cards = [
    {
      href: "/admin/noi-dung",
      icon: LayoutTemplate,
      title: "Nội dung trang chủ",
      desc: "Sửa chữ và số của 9 khối: Hero, bảng giá, đánh giá, FAQ, liên hệ, footer…",
      meta: "Chữ + số",
      tone: "bg-orange-50 text-orange-700",
    },
    {
      href: "/admin/hinh-anh",
      icon: ImageIcon,
      title: "Hình ảnh & video",
      desc: "Thay ảnh hero, ảnh sản phẩm, mẫu thực tế, poster giá và video; khôi phục ảnh gốc.",
      meta: "Ảnh + video",
      tone: "bg-violet-50 text-violet-700",
    },
    {
      href: "/admin/bai-viet",
      icon: FileText,
      title: "Bài viết (Cẩm nang in ấn)",
      desc: "Theo dõi toàn bộ bài blog: trạng thái, chuyên mục, ngày đăng và điểm chất lượng.",
      meta: `${liveArticles.length}/${totalArticles} bài đang hiển thị`,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <AdminShell active="home">
      <main className="px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Bảng điều khiển</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Trung tâm quản trị VinPrint</h1>
            <p className="mt-3 max-w-2xl font-medium leading-relaxed text-gray-700">
              Chọn khu vực cần chỉnh sửa ở menu bên trái, hoặc nhấn Ctrl + K để tìm nhanh.
            </p>
          </header>

          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <dt className="text-xs font-black uppercase tracking-wider text-gray-500">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-black text-gray-950">{stat.value}</dd>
                <dd className="mt-1 text-xs font-medium text-gray-600">{stat.note}</dd>
              </div>
            ))}
          </dl>

          {reminders.length > 0 && (
            <section aria-label="Việc nên làm" className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-sm font-black uppercase tracking-wider text-amber-900">Việc nên làm</h2>
              <ul className="mt-3 space-y-3">
                {reminders.map((item) => (
                  <li key={item.text} className="flex flex-col gap-2 text-sm font-medium text-amber-950 sm:flex-row sm:items-center sm:justify-between">
                    <span>{item.text}</span>
                    {item.href && <Link href={item.href} className="inline-flex min-h-10 shrink-0 items-center font-black text-orange-700 underline">{item.cta} →</Link>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <h2 className="mb-4 mt-10 text-lg font-black text-gray-950">Khu vực quản trị</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
              >
                <span className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}>
                  <card.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-black text-gray-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-gray-600">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-600">
                  {card.meta}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </AdminShell>
  );
}
