"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Gallery() {
  const tabs = ["Tất cả", "Mỹ phẩm", "Thực phẩm", "Đồ uống", "Trà - Cafe", "Handmade", "Pet"];
  const images = [
    "/images/mockups/cosmetic_bottle.webp",
    "/images/mockups/zip_pouch.webp",
    "/images/mockups/glass_jar.webp",
    "/images/mockups/kraft_box.webp",
    "/images/ai-design/honey_final.webp",
    "/images/mockups/plastic_cup.webp",
    "/images/mockups/paper_box.webp",
    "/images/ai-design/coffee_old.webp",
    "/images/holographic_sticker.webp",
    "/images/ai-design/coffee_ai.webp",
    "/images/ai-design/honey_ai.webp",
    "/images/mockups/cosmetic_bottle.webp"
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex items-center justify-between gap-2 mb-6 shrink-0 w-full">
        <h2 className="text-base sm:text-2xl font-extrabold text-gray-900 uppercase">
          Thành phẩm thực tế
        </h2>
        <button className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#4933D4] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#3725AE] sm:px-5 sm:text-sm">
          Xem thêm 40+ mẫu <span className="hidden xs:inline">thực tế</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 shrink-0">
        {tabs.map((tab, i) => (
          <button 
            key={i}
            className={`min-h-11 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-colors border ${
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
            <Image src={img} alt={`Mẫu tem VinPrint ${i + 1}`} fill unoptimized loading="lazy" sizes="(max-width: 640px) 33vw, 180px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
