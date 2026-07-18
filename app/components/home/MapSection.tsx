"use client";

import { MapPin, Clock, Phone, Navigation } from "lucide-react";

export default function MapSection() {
  return (
    <section id="google-map" className="py-20 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
            📍 Địa chỉ xưởng
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 uppercase">
            Ghé thăm VinPrint
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            Xem trực tiếp hàng trăm mẫu tem nhãn thực tế và được tư vấn trực tiếp về chất liệu, gia công.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF4D00]" /> Địa chỉ xưởng
                </h3>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed pl-7">
                  254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, Quận Gò Vấp, TP.HCM
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF4D00]" /> Giờ làm việc
                </h3>
                <p className="text-sm text-gray-600 pl-7 leading-relaxed font-semibold">
                  Thứ 2 – Thứ 7: <span className="text-gray-900 font-bold">09:00 – 17:30</span><br />
                  Chủ nhật: <span className="text-orange-500 font-bold">Nghỉ</span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#FF4D00]" /> Điện thoại hỗ trợ
                </h3>
                <p className="text-sm font-semibold text-gray-700 pl-7">
                  <a href="tel:0844998499" className="hover:text-orange-500">0844 998 499</a>
                </p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/M4w2H7F9p95XF9oT9"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold transition-colors w-full"
            >
              <Navigation className="w-4 h-4" /> Chỉ đường Google Maps
            </a>
          </div>

          {/* Map Frame */}
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm min-h-[350px] lg:min-h-[450px] relative bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7758368508537!2d106.6631853!3d10.8284534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290130dfd7f5%3A0x632e1858a74e50eb!2zMjU0LzUvNDAgTMSqIFbEg24gVGjhu40sIFBoxrDhu51uZyAxMSwgR8OyIFbhuqVwLCBI4buTIENow60gTWluaCwgVmllaG5hbQ!5e0!3m2!1svi!2s!4v1721210000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Địa chỉ xưởng VinPrint trên Google Maps"
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
