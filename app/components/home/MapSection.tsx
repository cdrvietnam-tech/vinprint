"use client";

import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

const MAP_URL = "https://maps.app.goo.gl/M4w2H7F9p95XF9oT9";
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7758368508537!2d106.6631853!3d10.8284534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290130dfd7f5%3A0x632e1858a74e50eb!2zMjU0LzUvNDAgTMSqIFbEg24gVGjhu40sIFBoxrDhu51uZyAxMSwgR8OyIFbhuqVwLCBI4buTIENow60gTWluaCwgVmllaG5hbQ!5e0!3m2!1svi!2s!4v1721210000000!5m2!1svi!2s";

export default function MapSection() {
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="google-map" className="border-t border-gray-200 bg-gray-50/50 py-20">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-900">📍 Địa chỉ xưởng</span>
          <h2 className="text-3xl font-extrabold uppercase text-gray-950">Ghé thăm VinPrint</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-700">Xem trực tiếp mẫu tem nhãn và được tư vấn về chất liệu, kích thước, gia công.</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-950"><MapPin className="h-5 w-5 text-[#D83B00]" /> Địa chỉ xưởng</h3>
                <p className="pl-7 text-sm font-semibold leading-relaxed text-gray-800">254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM</p>
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-950"><Clock className="h-5 w-5 text-[#D83B00]" /> Giờ làm việc</h3>
                <p className="pl-7 text-sm font-semibold leading-relaxed text-gray-700">Thứ 2–Thứ 7: <span className="font-bold text-gray-950">09:00–17:30</span><br />Chủ nhật: <span className="font-bold text-orange-900">Nghỉ</span></p>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-950"><Phone className="h-5 w-5 text-[#D83B00]" /> Điện thoại hỗ trợ</h3>
                <a href="tel:0844998499" onClick={() => trackEvent("click_phone", { position: "map_section" })} className="ml-7 inline-flex min-h-11 items-center font-bold text-gray-900 hover:text-orange-800">0844 998 499</a>
              </div>
            </div>
            <a href={MAP_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("open_google_maps", { position: "map_section" })} className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-6 text-sm font-bold text-white hover:bg-gray-800"><Navigation className="h-4 w-4" /> Chỉ đường Google Maps</a>
          </div>

          <div className="relative min-h-[350px] overflow-hidden rounded-3xl border border-gray-200 bg-[#EDE8DF] shadow-sm lg:min-h-[450px]">
            {showMap ? (
              <iframe src={MAP_EMBED_URL} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Địa chỉ xưởng VinPrint trên Google Maps" className="absolute inset-0 h-full w-full" />
            ) : (
              <button type="button" onClick={() => { setShowMap(true); trackEvent("load_google_map", { position: "map_section" }); }} className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center text-gray-950 hover:bg-white/30">
                <MapPin className="h-12 w-12 text-[#D83B00]" aria-hidden="true" />
                <span className="text-xl font-black">Xem bản đồ xưởng VinPrint</span>
                <span className="max-w-sm text-sm font-medium text-gray-700">Bản đồ chỉ được tải khi bạn chọn xem, giúp trang mở nhanh hơn và hạn chế cookie bên thứ ba.</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
