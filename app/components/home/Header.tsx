"use client";
 
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { ZaloIcon } from "../icons";
 
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start justify-center">
          <div className="text-[32px] leading-none font-black tracking-tighter">
            <span className="text-[#FF4D00]">Vin</span><span className="text-[#1A1A2E]">Print</span>
          </div>
          <span className="text-[9px] font-bold text-gray-500 tracking-wide mt-1 whitespace-nowrap">
            In nhanh - Chuẩn đẹp - Giá tốt
          </span>
        </Link>
 
        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[14px] font-bold text-[#1A1A2E]">
          <Link href="#trang-chu" className="text-[#FF4D00]">Trang chủ</Link>
          <Link href="#cac-loai-tem" className="hover:text-[#FF4D00] transition-colors">Các loại tem</Link>
          <Link href="#bang-gia" className="hover:text-[#FF4D00] transition-colors">Bảng giá</Link>
          <Link href="#mau-thuc-te" className="hover:text-[#FF4D00] transition-colors">Mẫu thực tế</Link>
          <Link href="#quy-trinh" className="hover:text-[#FF4D00] transition-colors">Quy trình</Link>
          <Link href="#ai-thiet-ke" className="hover:text-[#FF4D00] transition-colors">AI thiết kế</Link>
          <Link href="#danh-gia" className="hover:text-[#FF4D00] transition-colors">Đánh giá</Link>
          <Link href="#faq" className="hover:text-[#FF4D00] transition-colors">FAQ</Link>
          <Link href="#lien-he" className="hover:text-[#FF4D00] transition-colors">Liên hệ</Link>
        </nav>
 
        {/* Actions */}
        <div className="flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Mở menu"
            className="lg:hidden p-2 text-gray-800 hover:text-[#FF4D00] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg"
          >
            {isOpen ? <X className="w-6.5 h-6.5" /> : <Menu className="w-6.5 h-6.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed top-[80px] left-0 right-0 bottom-0 z-40 bg-white/95 backdrop-blur-lg flex flex-col p-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-6 text-[18px] font-extrabold text-[#1A1A2E]">
            <Link href="#trang-chu" onClick={() => setIsOpen(false)} className="text-[#FF4D00]">Trang chủ</Link>
            <Link href="#cac-loai-tem" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Các loại tem</Link>
            <Link href="#bang-gia" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Bảng giá</Link>
            <Link href="#mau-thuc-te" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Mẫu thực tế</Link>
            <Link href="#quy-trinh" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Quy trình</Link>
            <Link href="#ai-thiet-ke" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">AI thiết kế</Link>
            <Link href="#danh-gia" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Đánh giá</Link>
            <Link href="#faq" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">FAQ</Link>
            <Link href="#lien-he" onClick={() => setIsOpen(false)} className="hover:text-[#FF4D00] transition-colors">Liên hệ</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
