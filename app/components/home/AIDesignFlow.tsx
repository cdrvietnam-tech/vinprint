"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function AIDesignFlow() {
  const leftFeatures = [
    "Bố cục rõ ràng",
    "Màu sắc hài hòa",
    "Dễ đọc - Dễ nhớ",
    "Tăng giá trị sản phẩm"
  ];

  const rightFeatures = [
    "Bố cục khoa học",
    "Màu sắc nổi bật",
    "Dễ đọc - Dễ nhớ",
    "Tạo dấu ấn thương hiệu",
    "Tăng sức bán hàng"
  ];

  const combos = [
    {
      old: <img src="/images/ai-design/honey_old.png" className="w-full h-full object-contain drop-shadow-md" alt="Tem cũ mật ong" />,
      ai: <img src="/images/ai-design/honey_ai.png" className="w-full h-full object-contain drop-shadow-lg" alt="Thiết kế AI mật ong" />,
      final: <img src="/images/ai-design/honey_final.png" className="w-full h-full object-contain drop-shadow-xl" alt="Thành phẩm mật ong" />
    },
    {
      old: <img src="/images/ai-design/coffee_old.png" className="w-full h-full object-contain drop-shadow-md" alt="Tem cũ cà phê" />,
      ai: <img src="/images/ai-design/coffee_ai.png" className="w-full h-full object-contain drop-shadow-lg" alt="Thiết kế AI cà phê" />,
      final: <img src="/images/mockups/plastic_cup.png" className="w-full h-full object-contain drop-shadow-xl rounded-2xl" alt="Thành phẩm cà phê" />
    },
    {
      old: (
        <div className="w-48 h-48 bg-gray-100 flex flex-col items-center justify-center p-4 border border-gray-300 rounded-2xl opacity-70 grayscale" aria-label="Tem cũ mỹ phẩm">
          <div className="font-sans text-xl font-bold text-gray-500 leading-tight">serum</div>
          <div className="text-[10px] text-gray-400 font-medium uppercase mt-1 tracking-wide">my pham</div>
          <div className="mt-3 h-px w-16 bg-gray-300" />
          <div className="text-[9px] text-gray-400 mt-2">100ml</div>
        </div>
      ),
      ai: (
        <div className="w-48 h-48 bg-white flex flex-col items-center justify-center p-4 border-2 border-orange-200 rounded-full shadow-lg">
          <div className="font-serif text-2xl font-bold text-orange-800 leading-tight">LUXURY</div>
          <div className="text-[10px] text-orange-600 font-bold uppercase mt-1 tracking-wider">SERUM</div>
        </div>
      ),
      final: <img src="/images/mockups/cosmetic_bottle.png" className="w-full h-full object-contain drop-shadow-xl" alt="Thành phẩm mỹ phẩm" />
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [combos.length]);

  const currentCombo = combos[currentIndex];

  return (
    <section id="ai-thiet-ke" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Text */}
          <div className="lg:w-[25%] w-full shrink-0">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-4">
              AI Design
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 uppercase leading-tight">
              Tem cũ hay tem AI?<br/>
              <span className="text-[#FF4D00]">Khác biệt ở đẳng cấp!</span>
            </h2>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              VinPrint ứng dụng AI kết hợp Designer để tạo ra mẫu tem đẹp, chuyên nghiệp và đúng ngành hàng.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {leftFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Flow & Checklist */}
          <div className="lg:flex-1 w-full flex flex-col xl:flex-row items-stretch xl:items-center gap-4 justify-between">
            
            {/* Step 1 */}
            <div className="flex-1 w-full bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[420px]">
              <div className="text-[20px] font-extrabold text-red-500 uppercase mb-4 bg-red-50 border border-red-100 px-6 py-2 rounded-full shadow-sm text-center whitespace-nowrap">
                Tem cũ (Khách gửi)
              </div>
              <div className="flex-1 w-full relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {currentCombo.old}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <ArrowRight className="hidden xl:block w-6 h-6 text-gray-300 shrink-0" />

            {/* Step 2 */}
            <div className="flex-1 w-full bg-orange-50/50 rounded-3xl p-6 border border-orange-100 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-pink-100/30 pointer-events-none" />
              <div className="text-[20px] font-extrabold text-orange-600 uppercase mb-4 bg-white px-6 py-2 rounded-full shadow-sm z-10 border border-orange-100 text-center whitespace-nowrap">
                AI + Designer
              </div>
              <div className="flex-1 w-full relative z-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {currentCombo.ai}
                  </motion.div>
                </AnimatePresence>
                {/* Ping nodes */}
                <div className="absolute top-1 right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
                <div className="absolute bottom-2 left-1 w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
              </div>
            </div>

            <ArrowRight className="hidden xl:block w-6 h-6 text-gray-300 shrink-0" />

            {/* Step 3 */}
            <div className="flex-1 w-full bg-white rounded-3xl p-6 border border-green-200 shadow-xl shadow-green-500/5 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
              <div className="text-[20px] font-extrabold text-white bg-green-600 uppercase mb-4 px-6 py-2 rounded-full shadow-md z-10 text-center whitespace-nowrap">
                Thành phẩm
              </div>
              <div className="flex-1 w-full relative z-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {currentCombo.final}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
}
