"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { ZaloIcon } from "../icons";

const navigation = [
  ["Trang chủ", "/#trang-chu"],
  ["Các loại tem", "/#cac-loai-tem"],
  ["Bảng giá", "/#bang-gia"],
  ["Mẫu thực tế", "/#mau-thuc-te"],
  ["Quy trình", "/#quy-trinh"],
  ["Đánh giá", "/#danh-gia"],
  ["Giới thiệu", "/gioi-thieu"],
  ["Liên hệ", "/lien-he"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-5 px-4">
        <Link href="/" className="flex min-h-11 shrink-0 flex-col items-start justify-center">
          <span className="text-[30px] font-black leading-none tracking-tighter">
            <span className="text-[#D83B00]">Vin</span><span className="text-[#1A1A2E]">Print</span>
          </span>
          <span className="mt-1 text-[11px] font-bold tracking-wide text-gray-700">In nhanh · Chuẩn đẹp · Giá tốt</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-gray-800 transition-colors hover:bg-orange-50 hover:text-[#D83B00]">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            href="/#bang-gia"
            onClick={() => trackEvent("view_pricing", { position: "header" })}
            className="inline-flex min-h-11 items-center rounded-full border-2 border-gray-300 px-5 text-sm font-bold text-gray-900 hover:border-gray-500"
          >
            Xem bảng giá
          </Link>
          <a
            href="https://zalo.me/0844998499"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_zalo", { position: "header" })}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#D83B00] px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[#B83200]"
          >
            <ZaloIcon className="h-4 w-4" fill="white" /> Nhắn Zalo
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-900 lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Điều hướng trên thiết bị di động"
        className={`${open ? "flex" : "hidden"} max-h-[calc(100vh-5rem)] flex-col overflow-y-auto border-t border-gray-200 bg-white px-4 pb-6 pt-3 lg:hidden`}
      >
        {navigation.map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-gray-100 px-2 text-base font-bold text-gray-900">
            {label}
          </Link>
        ))}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href="tel:0844998499"
            onClick={() => trackEvent("click_phone", { position: "mobile_menu" })}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-gray-900 font-bold"
          >
            Gọi xưởng
          </a>
          <a
            href="https://zalo.me/0844998499"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_zalo", { position: "mobile_menu" })}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#D83B00] font-bold text-white"
          >
            Nhắn Zalo
          </a>
        </div>
      </nav>
    </header>
  );
}
