"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Tem giấy", desc: "(Decal giấy)", tag: "🔥 Bán chạy", image: "/images/products/tem-giay.webp", slug: "tem-giay" },
  { name: "Tem UV DTF", desc: "(Nổi không nền)", tag: "✨ UV DTF", image: "/images/products/tem-uv-dtf.webp", slug: "tem-uv-dtf" },
  { name: "Tem nhựa", desc: "(Decal nhựa)", tag: "💧 Chống nước", image: "/images/mockups/plastic_cup.webp", slug: "tem-nhua-chong-nuoc" },
  { name: "Tem bạc", desc: "(Decal bạc)", image: "/images/mockups/zip_pouch.webp", slug: "tem-bac" },
  { name: "Tem trong suốt", desc: "(Decal trong)", image: "/images/mockups/glass_jar.webp", slug: "tem-nhua-trong" },
  { name: "Tem hologram", desc: "(7 màu)", image: "/images/holographic_sticker.webp", slug: "tem-7-mau" },
  { name: "Tem kraft", desc: "(Giấy kraft)", image: "/images/mockups/kraft_box.webp", slug: "tem-giay" },
  { name: "Tem ép kim", desc: "(Vàng / Bạc)", image: "/images/products/tem-ep-kim.webp", slug: "tem-vang" },
  { name: "Tem phản quang", desc: "(Phản sáng)", image: "/images/mockups/cosmetic_bottle.webp", slug: "tem-bac" },
  { name: "Tem 7 màu", desc: "(Hologram)", tag: "🔥 Hot", image: "/images/holographic_sticker.webp", slug: "tem-7-mau" },
];

export default function Categories() {
  return (
    <section id="cac-loai-tem" className="py-12 bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 uppercase">
              Các loại tem nhãn phổ biến tại VinPrint
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative overflow-hidden w-full group">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex gap-4 w-max hover:[animation-play-state:paused]"
          >
            {[...categories, ...categories].map((cat, i) => (
              <Link
                key={i}
                href={`/san-pham/${cat.slug}`}
                className="w-[140px] md:w-[160px] flex flex-col items-center group/item cursor-pointer"
              >
                <div className="w-full aspect-square rounded-2xl bg-white shadow-sm border border-gray-100 mb-4 flex items-center justify-center relative overflow-hidden group-hover/item:shadow-md transition-all group-hover/item:border-orange-200">
                  {cat.tag && (
                    <div className="absolute top-0 right-0 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-bl-xl whitespace-nowrap z-10">
                      {cat.tag}
                    </div>
                  )}
                  <Image src={cat.image} alt={cat.name} fill loading="lazy" sizes="160px" className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gray-100/10 group-hover/item:bg-transparent transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 text-center">{cat.name}</h3>
                <p className="text-xs font-medium text-gray-700 text-center">{cat.desc}</p>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
