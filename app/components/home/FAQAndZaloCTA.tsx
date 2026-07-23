"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import { ZaloIcon } from "../icons";
import { trackEvent } from "../../lib/analytics";
import { homeFaqs } from "../../lib/home-faqs";
import QuoteRequestForm from "../quote/QuoteRequestForm";

export default function FAQAndZaloCTA() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="w-full">
            
            {/* FAQ & QR (1:1 ratio side-by-side) */}
            <div className="grid grid-cols-2 gap-4 items-stretch min-w-0 w-full">
              
              {/* FAQ Card */}
              <div id="faq" className="bg-white rounded-[24px] sm:rounded-[32px] p-3 sm:p-6 lg:p-8 flex flex-col border border-gray-100 shadow-sm h-full min-w-0">
                <h2 className="text-[12px] sm:text-lg lg:text-xl font-extrabold text-gray-900 uppercase mb-4 sm:mb-6">
                  Câu hỏi thường gặp
                </h2>
                <div className="flex flex-col flex-1 min-w-0">
                  {homeFaqs.map((faq, i) => {
                    const isOpen = activeIndex === i;
                    return (
                      <div key={faq.q} className={`${i !== homeFaqs.length - 1 ? 'border-b border-gray-100' : ''} min-w-0`}>
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
          </div>
        </div>
      </section>

      {/* Full width CTA Banner */}
      <section className="bg-gradient-to-r from-[#FF4D00] to-[#FF0055] py-20 relative overflow-hidden">
        {/* Background decorative dots */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-[1440px] mx-auto px-4 relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          
          <div className="text-white text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black mb-3 drop-shadow-sm">Bạn đã có file thiết kế?</h2>
            <p className="text-2xl lg:text-3xl font-extrabold mb-8 drop-shadow-sm opacity-95">Gửi file để xưởng kiểm tra và báo giá.</p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[15px] font-bold text-orange-50">
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-green-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✔</span> Báo giá nhanh</span>
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-green-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✔</span> Duyệt mẫu trước khi in</span>
              <span className="flex items-center gap-2 bg-black/15 px-4 py-2 rounded-full"><span className="text-red-800 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">✖</span> Không ép đặt hàng</span>
            </div>
          </div>

          <div className="w-full">
            <QuoteRequestForm />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_zalo", { position: "final_cta" })} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-blue-800 shadow-lg transition hover:bg-gray-50">
                <ZaloIcon className="h-5 w-5" />
                Hoặc nhắn Zalo <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#bang-gia" onClick={() => trackEvent("view_pricing", { position: "final_cta" })} className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border-2 border-white/70 px-5 text-sm font-black text-white transition hover:bg-white/10">
                Xem combo siêu hời
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
