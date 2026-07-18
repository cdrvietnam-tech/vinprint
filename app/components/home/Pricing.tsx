"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Pricing() {
  const prices = [
    { name: "TEM GIẤY COUCHE", price: "150đ", unit: "/tem", desc: "Số lượng càng nhiều giá càng tốt", nameColor: "text-[#5C45FD]", priceColor: "text-[#FF4D00]" },
    { name: "TEM NHỰA TRẮNG", price: "250đ", unit: "/tem", desc: "Chống nước - Bền màu", nameColor: "text-teal-600", priceColor: "text-teal-500" },
    { name: "TEM TRONG SUỐT", price: "350đ", unit: "/tem", desc: "Sang trọng - Thẩm mỹ cao", nameColor: "text-blue-600", priceColor: "text-blue-600" },
    { name: "TEM UV DTF NỔI", price: "450đ", unit: "/tem", desc: "Nổi bật - Không có nền", nameColor: "text-orange-600", priceColor: "text-[#FF4D00]" },
    { name: "TEM BẠC / VÀNG", price: "400đ", unit: "/tem", desc: "Cao cấp - Chống giả", nameColor: "text-[#2E1065]", priceColor: "text-[#5C45FD]" },
  ];

  const benefits = [
    "Miễn phí tư vấn",
    "Báo giá trong 5 phút",
    "Không ép đặt hàng",
    "Duyệt mẫu trước khi in",
    "Giao hàng toàn quốc"
  ];

  return (
    <section id="bang-gia" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="bg-[#2E1065] rounded-[32px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-800/50 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-extrabold uppercase tracking-wide">BẢNG GIÁ THAM KHẢO</h2>
              <span className="text-purple-200 text-[13px] hidden md:block">*Giá chưa bao gồm thiết kế</span>
            </div>
            <button className="flex items-center gap-2 text-[13px] font-bold bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full transition-colors border border-white/10">
              Xem đầy đủ bảng giá <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col xl:flex-row gap-3 relative z-10 items-stretch">
            {prices.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-[20px] p-5 text-center flex flex-col justify-center border border-white/20 hover:shadow-xl transition-all cursor-pointer group flex-1 min-w-0"
              >
                <div className={`text-[11px] font-extrabold mb-1.5 uppercase ${item.nameColor}`}>{item.name}</div>
                <div className={`text-xl font-extrabold mb-1.5 ${item.priceColor}`}>
                  Từ {item.price}<span className="text-[13px] font-bold">{item.unit}</span>
                </div>
                <div className="text-[10px] font-bold text-gray-500 leading-tight">
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 relative z-10">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F5A623] fill-[#F5A623]/20" />
                <span className="text-[13px] font-bold text-purple-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
