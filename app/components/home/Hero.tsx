"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { ZaloIcon } from "../icons";
import { trackEvent } from "../../lib/analytics";
import { CUSTOMER_AVATARS } from "./customer-avatars";

export default function Hero() {
  return (
    <section id="trang-chu" className="pt-32 relative overflow-hidden bg-white">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Content */}
          <div className="lg:w-[45%] text-center lg:text-left z-10 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold tracking-widest uppercase mb-8 border border-indigo-100"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              In ấn các loại tem nhãn và ấn phẩm
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] xl:text-[72px] font-black tracking-tight text-gray-900 mb-6 leading-[1.25]">
              <span className="sm:whitespace-nowrap">XƯỞNG IN SIÊU TỐC</span><br/>
              <span className="text-[#FF4D00]">Gửi file là chốt.</span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-[20px] text-gray-600 mb-10 max-w-[540px] mx-auto lg:mx-0 leading-snug font-medium"
            >
              VinPrint giúp sản phẩm của bạn nổi bật hơn,<br className="hidden lg:block"/>chuyên nghiệp hơn và bán chạy hơn.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-x-6 gap-y-5 mb-12 max-w-xl mx-auto lg:mx-0 text-left"
            >
              {[
                "Thiết kế bằng AI & Designer",
                "Chất liệu cao cấp - Bền đẹp",
                "In sắc nét - Chuẩn màu",
                "Số lượng ít vẫn nhận"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[15px] font-bold text-gray-800">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_zalo", { position: "hero" })} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-[#D83B00] text-white text-[15px] font-bold h-[52px] px-8 shadow-[0_8px_30px_rgb(216,59,0,0.28)] hover:scale-105 transition-transform">
                <ZaloIcon className="w-5 h-5" fill="white" />
                Nhắn Zalo nhận giá →
              </a>
              <a href="#ai-thiet-ke" onClick={() => trackEvent("ai_design_click", { position: "hero" })} className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border-2 border-[#6545ED] text-[#5635D8] text-[15px] font-bold h-[52px] px-8 hover:bg-purple-50 transition-colors">
                Thiết kế tem bằng AI <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-2" aria-label="Avatar khách hàng minh họa">
                {CUSTOMER_AVATARS.map((avatar) => (
                  <div key={avatar} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-orange-50 shadow-sm">
                    <Image src={avatar} alt="" fill loading="lazy" sizes="40px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 flex-col justify-center text-left">
                <div className="flex items-center gap-1 text-[#F5A623]">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  <span className="text-gray-900 font-extrabold text-[15px] ml-1">4.9/5</span>
                </div>
                <a href="https://shopee.vn/chaucay_senda" target="_blank" rel="noreferrer" className="mt-0.5 max-w-[260px] text-[12px] font-bold leading-tight text-gray-700 underline decoration-gray-300 underline-offset-2">Hơn 32000 lượt đánh giá cho shop ở Shopee</a>
              </div>
            </motion.div>

            {/* Badges row for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 flex flex-wrap gap-2 justify-center lg:hidden w-full max-w-xl mx-auto text-left"
            >
              <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                </div>
                <span className="text-[12px] font-bold text-gray-800">Giao toàn quốc</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                </div>
                <span className="text-[12px] font-bold text-gray-800">In nhanh · Chuẩn đẹp · Giá tốt</span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                </div>
                <span className="text-[12px] font-bold text-gray-800">Sai hàng hoàn tiền 100%</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:w-[55%] relative w-full h-[320px] sm:h-[450px] lg:h-[600px] block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="absolute inset-0"
            >
              <div className="w-full h-full relative flex items-center justify-center">
                  <div className="w-full h-full relative flex items-center justify-center">
                    {/* Floating star sparks */}
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], rotate: [0, 90, 180] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 right-10 w-10 h-10 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,1)] z-10 scale-75 lg:scale-100">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/></svg>
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4], rotate: [0, -90, -180] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="absolute bottom-20 right-5 w-8 h-8 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,1)] z-10 scale-75 lg:scale-100">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/></svg>
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.6, 1.6, 0.6], rotate: [0, 180, 360] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="absolute top-1/3 left-10 w-6 h-6 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,1)] z-10 scale-75 lg:scale-100">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/></svg>
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5], rotate: [0, -180, -360] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-1/3 right-1/4 w-7 h-7 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,1)] z-10 scale-75 lg:scale-100">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/></svg>
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.7, 1.4, 0.7], rotate: [0, 90, 180] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute top-0 right-1/2 w-9 h-9 text-[#F5A623] drop-shadow-[0_0_20px_rgba(245,166,35,1)] z-10 scale-75 lg:scale-100">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor"/></svg>
                    </motion.div>

                    {/* Curvy arrow */}
                    <motion.div 
                      animate={{ y: [0, -10, 0], x: [0, 5, 0], rotate: [-12, -20, -12] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[65%] left-[-10px] w-12 h-12 text-[#8B5CF6] z-20 scale-75 lg:scale-100"
                    >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 18h4v-4"/><path d="M14 18c-3.31-3.31-8.22-3.8-12-1.5"/></svg>
                    </motion.div>

                    <Image
                      src="/images/hero-products.webp"
                      alt="Bộ sưu tập tem nhãn VinPrint"
                      fill
                      priority
                      fetchPriority="high"
                      quality={82}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      style={{ objectFit: "contain", objectPosition: "center" }}
                      className="p-4 drop-shadow-2xl sm:p-6 lg:p-10"
                    />
                  </div>

                  {/* Floating Badges (Left stacked - Desktop only) */}
                  <div className="absolute left-[-40px] xl:left-[-120px] top-[40%] hidden lg:flex flex-col gap-4 z-20 scale-90 lg:scale-100 origin-left">
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white px-4 py-2.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2.5 w-max">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>
                      <span className="text-[13px] font-bold text-gray-700">Giao toàn quốc</span>
                    </motion.div>
                    <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="bg-white px-4 py-2.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2.5 w-max ml-6">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>
                      <span className="text-[13px] font-bold text-gray-700">In nhanh-Chuẩn đẹp-Giá tốt</span>
                    </motion.div>
                    <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="bg-white px-4 py-2.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2.5 w-max">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>
                      <span className="text-[13px] font-bold text-gray-700">Sai hàng đảm bảo hoàn tiền 100%</span>
                    </motion.div>
                  </div>

                  {/* Floating Customer Rating Card (Right) */}
                  <motion.div 
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-0 lg:right-[-10px] bg-white px-5 py-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center z-20 text-center w-32 sm:w-40 scale-75 sm:scale-100 origin-right"
                  >
                    <div className="text-2xl font-black text-[#FF4D00] leading-none mb-1">4.9/5</div>
                    <div className="flex gap-0.5 text-[#F5A623] mb-2">
                      {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-[12px] font-bold text-gray-700 tracking-wide">Đánh giá từ khách hàng</span>
                  </motion.div>
                  
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="w-full bg-[#1A1A2E] py-6 relative z-20 shadow-2xl">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x md:divide-white/10">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center gap-2 text-[#F5A623]">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span className="text-[28px] font-black leading-none">90.000+</span>
              </div>
              <span className="text-[13px] font-bold text-white/80">Khách hàng</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center gap-2 text-[#F5A623]">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/></svg>
                <span className="text-[28px] font-black leading-none">211.000+</span>
              </div>
              <span className="text-[13px] font-bold text-white/80">Mẫu tem đã thực hiện</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center gap-2 text-[#F5A623]">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
                <span className="text-[28px] font-black leading-none">100K+</span>
              </div>
              <span className="text-[13px] font-bold text-white/80">Đơn hàng đã in</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="flex items-center gap-2 text-[#F5A623]">
                <Star className="w-7 h-7 fill-current" />
                <span className="text-[28px] font-black leading-none">4.9/5</span>
              </div>
              <span className="text-[13px] font-bold text-white/80">Đánh giá trung bình</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
