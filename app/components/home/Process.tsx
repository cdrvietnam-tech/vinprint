"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Calculator, Palette, Printer, Truck } from "lucide-react";

export default function Process() {
  const steps = [
    { icon: MessageSquare, title: "Gửi yêu cầu", desc: "Gửi file / ý tưởng qua Zalo hoặc Website" },
    { icon: Calculator, title: "Báo giá nhanh", desc: "Nhận báo giá chỉ sau vài phút" },
    { icon: Palette, title: "Thiết kế & Duyệt", desc: "AI & Designer thiết kế, bạn duyệt mẫu" },
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

          <div className="lg:flex-1 w-full flex flex-col lg:flex-row justify-between items-stretch gap-4">
            {steps.map((step, i) => {
              // Different colors for each step to match mockup
              const colors = [
                "bg-purple-600", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"
              ];
              const lightColors = [
                "bg-purple-50 text-purple-600", "bg-emerald-50 text-emerald-600", "bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-orange-50 text-orange-600"
              ];
              
              return (
                <div key={i} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 flex-1 min-w-0 w-full">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="w-full bg-white rounded-3xl p-4 xl:p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-start relative h-full"
                  >
                    <div className="relative mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[i]} text-white shadow-lg`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white bg-inherit" style={{ backgroundColor: "inherit" }}>
                        <div className={`w-full h-full rounded-full flex items-center justify-center ${colors[i]} border-2 border-white`}>
                          {i + 1}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-extrabold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                  </motion.div>
                  
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 hidden lg:block" />
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
