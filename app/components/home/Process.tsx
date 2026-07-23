"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Calculator, Palette, Printer, Truck } from "lucide-react";

export default function Process() {
  const steps = [
    { icon: MessageSquare, title: "Gửi yêu cầu", desc: "Gửi file hoặc ý tưởng trực tiếp qua Zalo" },
    { icon: Calculator, title: "Báo giá nhanh", desc: "Nhận báo giá chỉ sau vài phút" },
    { icon: Palette, title: "Thiết kế & Duyệt", desc: "Đơn từ 200.000đ, tối đa 3 lần chỉnh sửa" },
    { icon: Printer, title: "In ấn chất lượng", desc: "In bằng máy hiện đại, kiểm tra kỹ lưỡng" },
    { icon: Truck, title: "Giao hàng tận nơi", desc: "Giao hàng nhanh chóng, đúng hẹn, toàn quốc" },
  ];

  return (
    <section id="quy-trinh" className="py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          
          <div className="lg:w-[20%] shrink-0 text-center lg:text-left w-full">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase mb-3 leading-tight">
              Quy trình đặt in đơn giản
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Chỉ 5 bước - Nhanh chóng và chuyên nghiệp
            </p>
          </div>

          <div className="lg:flex-1 w-full grid grid-cols-5 gap-1 sm:gap-3 lg:gap-4 items-stretch">
            {steps.map((step, i) => {
              // Different colors for each step to match mockup
              const colors = [
                "bg-purple-600", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"
              ];
              return (
                <div key={i} className="flex items-center gap-1 sm:gap-2 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="w-full bg-white rounded-2xl p-1.5 py-3 sm:p-4 xl:p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center relative h-full"
                  >
                    <div className="relative mb-3 sm:mb-6">
                      <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${colors[i]} text-white shadow-md`}>
                        <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div className="absolute -bottom-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-black text-white bg-inherit" style={{ backgroundColor: "inherit" }}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center ${colors[i]} border border-white sm:border-2`}>
                          {i + 1}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 mb-1 sm:mb-2 leading-tight">{step.title}</h3>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed hidden sm:block">{step.desc}</p>
                  </motion.div>
                  
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
