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
    "/images/ai-design/coffee_old.png"
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-900 uppercase mb-6">
        Thành phẩm thực tế
      </h2>

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`rounded-2xl overflow-hidden relative group ${i === 4 || i === 5 ? 'row-span-2' : 'aspect-square'}`}
          >
            <img src={img} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        ))}
      </div>

      <div className="text-left mt-6 shrink-0 relative z-10">
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5C45FD] text-white text-[13px] font-bold hover:bg-blue-700 transition-colors shadow-lg">
          Xem thêm 40+ mẫu thực tế <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
