"use client";
 
import Link from "next/link";
import { Search } from "lucide-react";
import { ZaloIcon } from "../icons";
 
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 h-[80px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start justify-center shrink-0">
          <div className="text-[26px] sm:text-[32px] leading-none font-black tracking-tighter">
            <span className="text-[#FF4D00]">Vin</span><span className="text-[#1A1A2E]">Print</span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-wide mt-1 whitespace-nowrap">
            In nhanh - Chuẩn đẹp - Giá tốt
          </span>
        </Link>
 
        {/* Navigation (2 rows on mobile, 1 row on lg) */}
        <nav className="flex flex-col lg:flex-row lg:items-center gap-0.5 lg:gap-4 xl:gap-6 text-[10px] sm:text-[11px] lg:text-[14px] font-extrabold text-[#1A1A2E] flex-1 max-w-xl lg:max-w-none ml-2 sm:ml-4 leading-normal">
          {/* Row 1 */}
          <div className="flex flex-wrap gap-x-2 sm:gap-x-3 lg:gap-x-4 xl:gap-x-6">
            <Link href="#trang-chu" className="text-[#FF4D00]">Trang chủ</Link>
            <Link href="#cac-loai-tem" className="hover:text-[#FF4D00] transition-colors">Các loại tem</Link>
            <Link href="#bang-gia" className="hover:text-[#FF4D00] transition-colors">Bảng giá</Link>
            <Link href="#mau-thuc-te" className="hover:text-[#FF4D00] transition-colors">Mẫu thực tế</Link>
            <Link href="#quy-trinh" className="hover:text-[#FF4D00] transition-colors">Quy trình</Link>
          </div>
          {/* Row 2 */}
          <div className="flex flex-wrap gap-x-2 sm:gap-x-3 lg:gap-x-4 xl:gap-x-6 mt-0.5 lg:mt-0">
            <Link href="#ai-thiet-ke" className="hover:text-[#FF4D00] transition-colors">AI thiết kế</Link>
            <Link href="#danh-gia" className="hover:text-[#FF4D00] transition-colors">Đánh giá</Link>
            <Link href="#faq" className="hover:text-[#FF4D00] transition-colors">FAQ</Link>
            <Link href="#lien-he" className="hover:text-[#FF4D00] transition-colors">Liên hệ</Link>
          </div>
        </nav>
 
        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <button aria-label="Tìm kiếm" className="hidden md:block p-2 text-gray-800 hover:text-[#FF4D00] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg">
            <Search className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
          </button>
          <button className="hidden md:block px-5 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold text-gray-800 hover:border-gray-300 transition-colors">
            Xem giá tham khảo
          </button>
          <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF4D00] text-white text-sm font-bold shadow-lg shadow-orange-500/20 hover:bg-[#E64500] transition-colors">
            <ZaloIcon className="w-4 h-4" fill="white" />
            Nhắn Zalo nhận giá
          </a>
        </div>
      </div>
    </header>
  );
}
