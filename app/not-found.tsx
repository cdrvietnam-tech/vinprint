import type { Metadata } from "next";
import Link from "next/link";
import GuideFrame from "./components/storefront/GuideFrame";

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
    <GuideFrame>
      <main id="main-content" tabIndex={-1} className="vp-guide-content">
        <div className="vp-guide-intro">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D83B00]">Lỗi 404</p>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Trang này không còn hoặc đã đổi địa chỉ</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">Bạn có thể xem các loại tem, bảng giá hoặc nhắn Zalo để xưởng tư vấn trực tiếp.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {links.map((item) => (
              <li key={item.href}><Link href={item.href} className="flex min-h-12 items-center rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]">{item.label} →</Link></li>
            ))}
          </ul>

        </div>
      </main>
    </GuideFrame>
  );
}
