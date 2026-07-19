"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ACTIVE_AI_DESIGN_SHOWCASE } from "./ai-design-showcases";

export default function AIDesignFlow() {
  const leftFeatures = [
    "Bố cục rõ ràng",
    "Màu sắc hài hòa",
    "Dễ đọc - Dễ nhớ",
    "Tăng giá trị sản phẩm"
  ];

  const kimHieuShowcase = {
    old: <Image src={ACTIVE_AI_DESIGN_SHOWCASE.old.src} width={ACTIVE_AI_DESIGN_SHOWCASE.old.width} height={ACTIVE_AI_DESIGN_SHOWCASE.old.height} alt={ACTIVE_AI_DESIGN_SHOWCASE.old.alt} sizes="(max-width: 768px) 30vw, 20vw" className="w-full h-full object-contain drop-shadow-md" />,
    ai: <Image src={ACTIVE_AI_DESIGN_SHOWCASE.ai.src} width={ACTIVE_AI_DESIGN_SHOWCASE.ai.width} height={ACTIVE_AI_DESIGN_SHOWCASE.ai.height} alt={ACTIVE_AI_DESIGN_SHOWCASE.ai.alt} sizes="(max-width: 768px) 30vw, 20vw" className="w-full h-full object-contain drop-shadow-lg" />,
    final: <Image src={ACTIVE_AI_DESIGN_SHOWCASE.final.src} width={ACTIVE_AI_DESIGN_SHOWCASE.final.width} height={ACTIVE_AI_DESIGN_SHOWCASE.final.height} alt={ACTIVE_AI_DESIGN_SHOWCASE.final.alt} sizes="(max-width: 768px) 30vw, 20vw" className="w-full h-full rounded-2xl object-contain drop-shadow-xl" />
  };

  return (
    <section id="ai-thiet-ke" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Text */}
          <div className="lg:w-[25%] w-full shrink-0">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold tracking-widest uppercase mb-4">
              AI Design
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 uppercase leading-tight">
              Tem cũ hay tem AI?<br/>
              <span className="text-[#FF4D00]">Khác biệt ở đẳng cấp!</span>
            </h2>
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              VinPrint ứng dụng AI kết hợp Designer để tạo ra mẫu tem đẹp, <br/> chuyên nghiệp và đúng ngành hàng.
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
          <div className="lg:flex-1 w-full flex flex-row items-stretch justify-between gap-2 md:gap-4">
            
            {/* Step 1 */}
            <div className="flex-1 bg-gray-50 rounded-2xl p-2 sm:p-4 xl:p-6 border border-gray-100 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[220px] md:min-h-[320px] xl:min-h-[420px]">
              <div className="text-xs xl:text-[20px] font-black text-red-700 uppercase mb-2 sm:mb-4 bg-red-50 border border-red-100 px-2 py-1 sm:px-4 sm:py-1.5 xl:px-6 xl:py-2 rounded-full shadow-sm text-center whitespace-nowrap">
                <span className="xl:hidden">Tem cũ</span>
                <span className="hidden xl:inline">Tem cũ (Khách gửi)</span>
              </div>
              <div className="flex-1 w-full relative min-h-[80px] sm:min-h-[120px] md:min-h-[180px] xl:min-h-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-100"
                >
                  {kimHieuShowcase.old}
                </motion.div>
              </div>
            </div>

            <ArrowRight className="hidden xl:flex w-6 h-6 text-gray-300 shrink-0 self-center" />

            {/* Step 2 */}
            <div className="flex-1 bg-orange-50/50 rounded-2xl p-2 sm:p-4 xl:p-6 border border-orange-100 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[220px] md:min-h-[320px] xl:min-h-[420px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-pink-100/30 pointer-events-none" />
              <div className="text-xs xl:text-[20px] font-black text-orange-800 uppercase mb-2 sm:mb-4 bg-white px-2 py-1 sm:px-4 sm:py-1.5 xl:px-6 xl:py-2 rounded-full shadow-sm z-10 border border-orange-100 text-center whitespace-nowrap">
                <span className="xl:hidden">Thiết kế AI</span>
                <span className="hidden xl:inline">AI + Designer</span>
              </div>
              <div className="flex-1 w-full relative z-10 flex items-center justify-center min-h-[80px] sm:min-h-[120px] md:min-h-[180px] xl:min-h-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-100"
                >
                  {kimHieuShowcase.ai}
                </motion.div>
                {/* Ping nodes */}
                <div className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-ping" />
                <div className="absolute bottom-2 left-1 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.8s' }} />
              </div>
            </div>

            <ArrowRight className="hidden xl:flex w-6 h-6 text-gray-300 shrink-0 self-center" />

            {/* Step 3 */}
            <div className="flex-1 bg-white rounded-2xl p-2 sm:p-4 xl:p-6 border border-green-200 shadow-xl shadow-green-500/5 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[220px] md:min-h-[320px] xl:min-h-[420px] relative overflow-hidden">
              <div className="text-xs xl:text-[20px] font-black text-white bg-green-700 uppercase mb-2 sm:mb-4 px-2 py-1 sm:px-4 sm:py-1.5 xl:px-6 xl:py-2 rounded-full shadow-md z-10 text-center whitespace-nowrap">
                Thành phẩm
              </div>
              <div className="flex-1 w-full relative z-10 flex items-center justify-center min-h-[80px] sm:min-h-[120px] md:min-h-[180px] xl:min-h-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center scale-90 sm:scale-100"
                >
                  {kimHieuShowcase.final}
                </motion.div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </section>
  );
}
