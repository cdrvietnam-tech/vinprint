"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { ZaloIcon } from "../icons";
import { trackEvent } from "../../lib/analytics";
import { CUSTOMER_AVATARS } from "./customer-avatars";
import { ACTIVE_AI_DESIGN_SHOWCASE } from "./ai-design-showcases";

export default function FAQAndMockup() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Có in tem số lượng ít không?",
      a: "Có. VinPrint hỗ trợ in từ số lượng ít (chỉ từ vài chục tem), giúp các shop nhỏ tiết kiệm chi phí ban đầu và dễ dàng thử mẫu trước khi sản xuất số lượng lớn.",
    },
    {
      q: "Thời gian hoàn thành là bao lâu?",
      a: "Chỉ từ 1–2 ngày làm việc sau khi chốt thiết kế. Có hỗ trợ in nhanh lấy ngay trong ngày nếu cần gấp — liên hệ Zalo để xác nhận.",
    },
    {
      q: "Tem nhãn có chống nước không?",
      a: "Tem nhựa PVC dẻo dai chống nước 100%, bền màu, phù hợp chai lọ, mỹ phẩm và đồ uống. Tem giấy rẻ hơn nhưng không chống nước, phù hợp bao bì khô.",
    },
    {
      q: "Chưa có file thiết kế thì sao?",
      a: "Không cần lo! Chỉ cần gửi ý tưởng hoặc logo. AI & Designer của VinPrint sẽ dựng mẫu thiết kế hoàn toàn miễn phí và cho xem trước kết quả trên sản phẩm thật.",
    },
    {
      q: "Có giao hàng toàn quốc không?",
      a: "VinPrint hỗ trợ giao hàng nhanh toàn quốc qua các đơn vị vận chuyển uy tín. Tem được đóng gói chống nước cẩn thận, đảm bảo nguyên vẹn khi đến tay bạn.",
    },
  ];

  return (
    <>
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.6fr] gap-6 items-stretch">
            
            {/* Left Column: FAQ & QR (1:1 ratio side-by-side) */}
            <div className="grid grid-cols-2 gap-4 items-stretch min-w-0 w-full">
              
              {/* FAQ Card */}
              <div id="faq" className="bg-white rounded-[24px] sm:rounded-[32px] p-3 sm:p-6 lg:p-8 flex flex-col border border-gray-100 shadow-sm h-full min-w-0">
                <h2 className="text-[12px] sm:text-lg lg:text-xl font-extrabold text-gray-900 uppercase mb-4 sm:mb-6">
                  Câu hỏi thường gặp
                </h2>
                <div className="flex flex-col flex-1 min-w-0">
                  {faqs.map((faq, i) => {
                    const isOpen = activeIndex === i;
                    return (
                      <div key={i} className={`${i !== faqs.length - 1 ? 'border-b border-gray-100' : ''} min-w-0`}>
                        <button
                          onClick={() => setActiveIndex(isOpen ? null : i)}
                          className="flex min-h-11 justify-between items-center py-2 sm:py-3 text-left group min-w-0 w-full"
                          aria-expanded={isOpen}
                        >
                          <span className={`text-xs sm:text-sm font-bold transition-colors pr-1 text-left flex-1 min-w-0 ${isOpen ? 'text-indigo-700' : 'text-gray-900 group-hover:text-blue-700'}`}>{faq.q}</span>
                          <span className={`transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-45 text-indigo-500' : 'text-indigo-400'}`}>
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </span>
                        </button>
                        {isOpen && (
                          <p className="text-xs sm:text-sm text-gray-700 font-medium pb-2 sm:pb-3 leading-relaxed pr-2">{faq.a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Card */}
              <div className="bg-purple-50/30 rounded-[24px] sm:rounded-[32px] p-3 sm:p-6 lg:p-8 flex flex-col border border-purple-100 shadow-sm h-full items-center text-center justify-center min-w-0 w-full">
                <h2 className="text-[12px] sm:text-lg lg:text-xl font-extrabold text-[#5C45FD] uppercase mb-1 leading-tight">
                  Quét Zalo nhận tư vấn
                </h2>
                <p className="text-xs font-medium text-gray-700 mb-4 sm:mb-6 leading-tight">
                  Báo giá nhanh - Không chờ lâu!
                </p>
                
                <div className="relative mb-4 aspect-square w-full max-w-28 shrink-0 overflow-hidden rounded-2xl border border-purple-100 bg-white p-2 shadow-sm sm:mb-6 sm:max-w-36">
                  <Image src="/images/zalo-qr.png" alt="Mã QR Zalo VinPrint" fill loading="lazy" sizes="(max-width: 640px) 112px, 144px" className="object-contain p-2" />
                </div>

                <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_zalo", { position: "faq_qr" })} className="inline-flex min-h-11 items-center gap-1.5 px-3 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#6545ED] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#5234D2] transition-colors w-full justify-center">
                  Mở Zalo ngay <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
              </div>

            </div>

            {/* Right Column: AI Mockup */}
            <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col border border-gray-100 shadow-sm h-full items-center text-center">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase mb-8">
                Xem thử tem trên sản phẩm (AI Mockup)
              </h2>
              
              <div className="flex flex-col items-center justify-center flex-1 w-full relative">
                {/* Connecting lines between steps */}
                <div className="hidden sm:block absolute top-[50px] sm:top-[56px] left-[15%] right-[15%] h-0.5 bg-gray-100 z-0" />
                
                <div className="flex items-start justify-between w-full relative z-10">
                  {[
                    { step: 1, title: "Tải mẫu tem của bạn", sub: "Định dạng ảnh/pdf", img: ACTIVE_AI_DESIGN_SHOWCASE.old.src },
                    { step: 2, title: "Chọn sản phẩm muốn dán xem", sub: "AI dán tự động", img: ACTIVE_AI_DESIGN_SHOWCASE.final.src },
                    { step: 3, title: "Gửi cho xưởng in", sub: "Báo giá nhanh chóng", img: "/images/mockups/kraft_box.webp" }
                  ].map((s, i) => (
                    <div key={s.step} className="relative flex flex-col items-center gap-5 w-1/3 px-2">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1.5 flex items-center justify-center relative group">
                        <div className="absolute top-1.5 left-1.5 text-[11px] font-black text-indigo-500 z-10 bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">{s.step}</div>
                        <Image src={s.img} alt={s.title} fill loading="lazy" sizes="112px" className="object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <div className="text-[13px] sm:text-[14px] font-extrabold text-gray-900 leading-tight max-w-[140px] mx-auto">{s.title}</div>
                        <div className="text-[11px] font-medium text-gray-500 mt-1">{s.sub}</div>
                      </div>
                      {i < 2 && <ArrowRight className="absolute top-10 sm:top-12 -right-5 w-6 h-6 text-indigo-300 hidden sm:block" />}
                    </div>
                  ))}
                </div>
              </div>

              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_ai_mockup_interest", { position: "mockup_panel" })} className="inline-flex min-h-11 items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity w-full sm:w-auto justify-center mt-6">
                Gửi mẫu để dựng mockup <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Full width CTA Banner */}
      <section className="bg-gradient-to-r from-[#FF4D00] to-[#FF0055] py-20 relative overflow-hidden">
        {/* Background decorative dots */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-[1440px] mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="text-white text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black mb-3 drop-shadow-sm">Bạn đã có file thiết kế?</h2>
            <p className="text-2xl lg:text-3xl font-extrabold mb-8 drop-shadow-sm opacity-95">Gửi ngay để nhận báo giá trong 5 phút!</p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[15px] font-bold text-orange-50">
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-green-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✔</span> Báo giá nhanh</span>
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-green-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✔</span> Duyệt mẫu trước khi in</span>
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-red-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✖</span> Không ép đặt hàng</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_zalo", { position: "final_cta" })} className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-white text-blue-800 text-lg font-black shadow-xl hover:bg-gray-50 hover:scale-105 transition-all shrink-0">
                <ZaloIcon className="w-6 h-6" />
                Nhắn Zalo nhận giá <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#bang-gia" onClick={() => trackEvent("view_pricing", { position: "final_cta" })} className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full border-2 border-white/70 text-white text-lg font-black hover:bg-white/10 hover:border-white transition-all shrink-0">
                Xem bảng giá ngay
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-3" aria-label="Avatar khách hàng minh họa">
                {CUSTOMER_AVATARS.map((avatar) => (
                  <span key={avatar} className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-[#D80045] bg-white shadow-md">
                    <Image src={avatar} alt="" fill loading="lazy" sizes="40px" className="object-cover" />
                  </span>
                ))}
              </div>
              <div className="text-[13px] font-black text-white/90">Hơn 90.000 khách hàng đã tin tưởng VinPrint</div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
