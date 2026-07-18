"use client";

import { ArrowRight, Plus } from "lucide-react";
import { ZaloIcon } from "../icons";

export default function FAQAndMockup() {
  const faqs = [
    "Có nhận in số lượng ít không?",
    "Thời gian sản xuất và giao hàng là bao lâu?",
    "Tem có chống nước không?",
    "Có hỗ trợ thiết kế không?",
    "Có xuất hóa đơn VAT không?",
    "Tôi cần chuẩn bị file như thế nào?"
  ];

  return (
    <>
      <section className="py-12 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_max-content] gap-6 items-stretch">
            
            {/* FAQ Column */}
            <div id="faq" className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col border border-gray-100 shadow-sm h-full">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase mb-6">
                Câu hỏi thường gặp
              </h2>
              <div className="flex flex-col flex-1">
                {faqs.map((faq, i) => (
                  <button key={i} className={`flex justify-between items-center py-3 text-left ${i !== faqs.length - 1 ? 'border-b border-gray-100' : ''} group`}>
                    <span className="text-[13px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors pr-4">{faq}</span>
                    <Plus className="w-4 h-4 text-indigo-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Mockup Column */}
            <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col border border-gray-100 shadow-sm h-full items-center text-center">
              <h2 className="text-xl font-extrabold text-gray-900 uppercase mb-8">
                Xem thử tem trên sản phẩm (AI Mockup)
              </h2>
              
              <div className="flex flex-col items-center justify-center flex-1 w-full relative">
                {/* Connecting lines between steps */}
                <div className="hidden sm:block absolute top-[50px] sm:top-[56px] left-[15%] right-[15%] h-0.5 bg-gray-100 z-0" />
                
                <div className="flex items-start justify-between w-full relative z-10">
                  {[
                    { step: 1, title: "Tải mẫu tem của bạn", sub: "Định dạng ảnh/pdf", img: "/images/ai-design/honey_old.png" },
                    { step: 2, title: "Chọn sản phẩm muốn dán xem", sub: "AI dán tự động", img: "/images/ai-design/honey_final.png" },
                    { step: 3, title: "Gửi cho xưởng in", sub: "Báo giá nhanh chóng", img: "/images/mockups/kraft_box.png" }
                  ].map((s, i) => (
                    <div key={s.step} className="relative flex flex-col items-center gap-5 w-1/3 px-2">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1.5 flex items-center justify-center relative group">
                        <div className="absolute top-1.5 left-1.5 text-[11px] font-black text-indigo-500 z-10 bg-white/90 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">{s.step}</div>
                        <img src={s.img} alt={s.title} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500" />
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

              <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[13px] font-bold shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
                Trải nghiệm AI Mockup ngay <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Column */}
            <div className="w-[280px] shrink-0 bg-purple-50/30 rounded-[32px] p-6 lg:p-8 flex flex-col border border-purple-100 shadow-sm h-full items-center text-center justify-center">
              <h2 className="text-xl font-extrabold text-[#5C45FD] uppercase mb-1">
                Quét Zalo nhận tư vấn
              </h2>
              <p className="text-[11px] font-medium text-gray-500 mb-6">
                Báo giá nhanh - Không chờ lâu!
              </p>
              
              <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 relative">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-md p-1 flex items-center justify-center">
                     <ZaloIcon className="w-full h-full" />
                  </div>
                </div>
              </div>

              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#8B5CF6] text-white text-[13px] font-bold shadow-lg shadow-purple-500/30 hover:bg-[#7C3AED] transition-colors w-full sm:w-auto justify-center">
                Mở Zalo ngay <ArrowRight className="w-4 h-4" />
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
              <span className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full"><span className="text-[#00E676] bg-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none">✔</span> Báo giá nhanh</span>
              <span className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full"><span className="text-[#00E676] bg-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none">✔</span> Duyệt mẫu trước khi in</span>
              <span className="flex items-center gap-2 bg-black/10 px-4 py-2 rounded-full"><span className="text-[#FF3D00] bg-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] leading-none">✖</span> Không ép đặt hàng</span>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full bg-white text-blue-600 text-lg font-black shadow-xl hover:bg-gray-50 hover:scale-105 transition-all shrink-0">
                <ZaloIcon className="w-6 h-6" />
                Nhắn Zalo nhận giá <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#bang-gia" className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full border-2 border-white/40 text-white text-lg font-black hover:bg-white/10 hover:border-white transition-all shrink-0">
                Xem bảng giá ngay
              </a>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+40}`} alt="Customer" className="w-10 h-10 rounded-full border-[3px] border-[#FF0055] shadow-md object-cover" />
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
