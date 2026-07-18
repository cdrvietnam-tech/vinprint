"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export default function Reviews() {
  const tabs = ["Tất cả", "Google", "Shopee", "Facebook"];
  const reviews = [
    { name: "Nguyễn Thị Hồng", platform: "Google", text: "Tem in rất đẹp, màu sắc chuẩn, giao hàng nhanh, tư vấn nhiệt tình. Sẽ ủng hộ lâu dài!", rating: 5 },
    { name: "Trần Minh Tuấn", platform: "Shopee", text: "In tem UV DTF nổi cực đẹp, chống nước tốt, đóng ngay gửi cẩn thận.", rating: 5 },
    { name: "Lê Hoàng Yến", platform: "Facebook", text: "Thiết kế bằng AI rất ưng ý, chỉnh sửa nhanh chóng. Chất lượng in quá tốt!", rating: 5 },
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col h-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-end mb-8 gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase mb-2">
            Khách hàng nói gì về VinPrint
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-orange-800">4.9/5</span>
            <div className="text-[13px] font-medium text-gray-500">
              (32k+ đánh giá)
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pb-2 xl:pb-0">
          {tabs.map((tab, i) => (
            <button 
              key={i}
              className={`min-h-11 whitespace-nowrap px-4 py-2 rounded-full border text-[13px] font-bold transition-colors ${
                i === 0 ? "border-gray-200 bg-white text-gray-900 shadow-sm" : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          {reviews.map((rev, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex items-center gap-1 text-[#F5A623] mb-4">
                {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-800" aria-hidden="true">
                  {rev.name.split(" ").at(-1)?.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{rev.name}</div>
                  <div className="text-[12px] uppercase font-bold text-gray-600">{rev.platform} Review</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed flex-1">
                &ldquo;{rev.text}&rdquo;
              </p>

              {rev.platform === "Google" && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.87-4.53-5.84-4.53z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
              )}

              {rev.platform === "Shopee" && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#FF5722] text-xs font-bold">
                    <span className="text-sm">🧡</span> Shopee
                  </div>
                  <a href="https://shopee.vn" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                    Xem tất cả đánh giá →
                  </a>
                </div>
              )}

              {rev.platform === "Facebook" && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <svg className="w-5 h-5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      <div className="text-center mt-10">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors">
          Xem tất cả đánh giá <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
