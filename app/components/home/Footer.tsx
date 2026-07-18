"use client";

import { ArrowRight } from "lucide-react";
import { ZaloIcon } from "../icons";

export default function Footer() {
  return (
    <footer id="lien-he" className="bg-white">


      {/* Info Columns */}
      <div className="max-w-[1440px] mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 text-sm">
        <div>
          <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wider">VinPrint</h3>
          <p className="text-gray-500 leading-relaxed max-w-xs mb-3">
            In tem nhãn chất lượng cao tại TP.HCM. Hỗ trợ thiết kế bằng AI và giao hàng nhanh toàn quốc.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wider">Liên hệ xưởng</h3>
          <ul className="space-y-2 text-gray-500">
            <li>Hotline/Zalo: <a href="tel:0844998499" className="hover:text-[#FF4D00] font-semibold">0844 998 499</a></li>
            <li>Địa chỉ: <span className="font-medium">254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM</span></li>
            <li>Giờ làm việc: <span>09:00–17:30 · Thứ 2–Thứ 7</span> (Nghỉ Chủ nhật và ngày lễ)</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wider">Đặt hàng nhanh</h3>
          <div className="flex flex-col gap-2">
            <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#FF4D00] font-semibold text-gray-700">
              <ZaloIcon className="w-4 h-4" />
              Chốt đơn Zalo
            </a>
            <a href="#bang-gia" className="inline-flex items-center gap-2 hover:text-[#FF4D00] font-semibold text-gray-700">
              📊 Bảng giá tham khảo
            </a>
            <a href="#danh-gia" className="inline-flex items-center gap-2 hover:text-[#FF4D00] font-semibold text-gray-700">
              ⭐ Đánh giá Shopee
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto px-4 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm font-medium text-gray-500">
          © 2026 VinPrint. In ấn siêu tốc.
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <a href="#" className="hover:text-gray-900">Facebook</a>
          <a href="#" className="hover:text-gray-900">Shopee</a>
          <a href="#" className="hover:text-gray-900">TikTok</a>
        </div>
      </div>
    </footer>
  );
}
