import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import AdminNav from "../components/admin/AdminNav";
import { allBlogArticles, selectPublicArticles } from "../lib/blog-posts";

export const metadata: Metadata = {
  title: "Trung tâm quản trị | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  const totalArticles = allBlogArticles.length;
  const liveArticles = selectPublicArticles(allBlogArticles, new Date()).length;

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
      meta: `${liveArticles}/${totalArticles} bài đang hiển thị`,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fffaf4] px-4 py-8 sm:px-8 sm:py-10 text-gray-950">
      <div className="mx-auto max-w-5xl">
        <AdminNav active="home" />

        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-700">Bảng điều khiển</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Trung tâm quản trị VinPrint</h1>
          <p className="mt-3 max-w-2xl font-medium leading-relaxed text-gray-700">
            Chọn khu vực cần chỉnh sửa. Mọi thay đổi được lưu an toàn và có thể khôi phục về mặc định.
          </p>
        </header>

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
              <h2 className="text-lg font-black text-gray-900">{card.title}</h2>
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
  );
}
