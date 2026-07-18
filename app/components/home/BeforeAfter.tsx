"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";

type SliderItem = { name: string; before: string; after: string };

function CustomAutoSlider({ item }: { item: SliderItem }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const position = useMotionValue(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) return;
    const controls = animate(position, [50, 85, 15, 50], {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity
    });
    return () => controls.stop();
  }, [isDragging, position]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    position.set(percentage);
  };

  const clipPath = useTransform(position, p => `polygon(0% 0%, ${p}% 0%, ${p}% 100%, 0% 100%)`);
  const left = useTransform(position, p => `${p}%`);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none touch-none cursor-ew-resize rounded-2xl"
      onPointerDown={(e) => {
        setIsDragging(true);
        handlePointerMove(e);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
    >
       <Image src={item.after} alt={`Sau khi dán tem - ${item.name}`} fill unoptimized sizes="(max-width: 768px) 33vw, 16vw" className="object-cover pointer-events-none" />
       
       <motion.div 
         className="absolute inset-0 w-full h-full pointer-events-none"
         style={{ clipPath, filter: "grayscale(100%) opacity(80%)" }}
       >
         <Image src={item.before} alt={`Trước khi dán tem - ${item.name}`} fill unoptimized sizes="(max-width: 768px) 33vw, 16vw" className="object-cover" />
       </motion.div>

       <motion.div
         style={{ left }}
         className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 -ml-[1px] pointer-events-none"
       >
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
            <div className="flex gap-[3px]">
              <div className="w-0.5 h-3.5 bg-gray-400 rounded-full" />
              <div className="w-0.5 h-3.5 bg-gray-400 rounded-full" />
            </div>
         </div>
       </motion.div>
    </div>
  );
}

export default function BeforeAfter() {
  const cases = [
    { name: "Chai mỹ phẩm", before: "/images/mockups/cosmetic_bottle.webp", after: "/images/mockups/cosmetic_bottle.webp" },
    { name: "Túi zip đựng sản phẩm", before: "/images/mockups/zip_pouch.webp", after: "/images/mockups/zip_pouch.webp" },
    { name: "Hũ thủy tinh", before: "/images/mockups/glass_jar.webp", after: "/images/mockups/glass_jar.webp" },
    { name: "Hộp kraft", before: "/images/mockups/kraft_box.webp", after: "/images/mockups/kraft_box.webp" },
    { name: "Ly nhựa", before: "/images/mockups/plastic_cup.webp", after: "/images/mockups/plastic_cup.webp" },
    { name: "Hộp giấy", before: "/images/mockups/paper_box.webp", after: "/images/mockups/paper_box.webp" },
  ];

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 uppercase">
            Một chiếc tem nhỏ <br /> Thay đổi cả sản phẩm
          </h2>
          <p className="text-gray-700 font-medium text-lg">
            Tem nhỏ mà có võ, nâng cao giá trị sản phẩm của bạn!
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {cases.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-3 sm:mb-4 relative bg-white">
                <CustomAutoSlider item={item} />
                <div className="absolute top-1 left-1 rounded bg-white/95 px-2 py-1 text-xs font-bold text-gray-800 shadow-sm pointer-events-none">Trước</div>
                <div className="absolute top-1 right-1 rounded bg-white/95 px-2 py-1 text-xs font-bold text-orange-800 shadow-sm pointer-events-none">Sau</div>
              </div>
              <span className="text-[11px] sm:text-sm font-semibold text-gray-700 text-center leading-tight">{item.name}</span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            Kéo thanh trượt để xem sự khác biệt 👆
          </span>
        </div>
      </div>
    </section>
  );
}
