"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Gallery() {
  const tabs = ["Tất cả", "Mỹ phẩm", "Thực phẩm", "Đồ uống", "Trà - Cafe", "Handmade", "Pet"];
  const images = [
    "/images/mockups/cosmetic_bottle.png",
    "/images/mockups/zip_pouch.png",
    "/images/mockups/glass_jar.png",
    "/images/mockups/kraft_box.png",
    "/images/ai-design/honey_final.png",
    "/images/mockups/plastic_cup.png",
    "/images/mockups/paper_box.png",
    "/images/ai-design/coffee_old.png",
    "/images/holographic_sticker.png",
    "/images/ai-design/coffee_ai.png",
    "/images/ai-design/honey_ai.png",
    "/images/mockups/cosmetic_bottle.png"
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex items-center justify-between gap-2 mb-6 shrink-0 w-full">
        <h2 className="text-base sm:text-2xl font-extrabold text-gray-900 uppercase">
          Thành phẩm thực tế
        </h2>
        <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-[#5C45FD] text-white text-[10px] sm:text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0">
          Xem thêm 40+ mẫu <span className="hidden xs:inline">thực tế</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 shrink-0">
        {tabs.map((tab, i) => (
          <button 
            key={i}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors border ${
              i === 0 ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 flex-1">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden relative group aspect-square"
          >
            <img src={img} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
