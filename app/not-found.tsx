import type { Metadata } from "next";
import Link from "next/link";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import ConversionLink from "./components/ConversionLink";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false, follow: true },
};

const links = [
  { label: "Tất cả sản phẩm", href: "/san-pham" },
  { label: "Bảng giá tham khảo", href: "/#bang-gia" },
  { label: "In tem Tết lấy liền", href: "/nganh/tem-nhan-tet" },
  { label: "Cẩm nang in ấn", href: "/blog" },
  { label: "Liên hệ xưởng", href: "/lien-he" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="px-4 pb-20 pt-32">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D83B00]">Lỗi 404</p>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Trang này không còn hoặc đã đổi địa chỉ</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">Bạn có thể xem các loại tem, bảng giá hoặc nhắn Zalo để xưởng tư vấn trực tiếp.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {links.map((item) => (
              <li key={item.href}><Link href={item.href} className="flex min-h-12 items-center rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]">{item.label} →</Link></li>
            ))}
          </ul>
          <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition="not_found" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#6545ED] px-6 font-black text-white">Nhắn Zalo nhận tư vấn</ConversionLink>
        </div>
      </main>
      <Footer />
    </div>
  );
}
