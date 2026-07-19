"use client";

import { ChevronDown, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "../../lib/analytics";
import {
  GOOGLE_BUSINESS_PROFILE_EMBED_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
} from "../../lib/business-info";

export default function MapSection() {
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="google-map" className="border-t border-gray-200 bg-gray-50/50 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-950"><MapPin className="h-5 w-5 text-[#D83B00]" /> Địa chỉ xưởng</h3>
                <p className="pl-7 text-sm font-semibold leading-relaxed text-gray-800">254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM</p>
              </div>
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-950"><Clock className="h-5 w-5 text-[#D83B00]" /> Giờ làm việc</h3>
                <p className="pl-7 text-sm font-semibold leading-relaxed text-gray-700">Thứ 2–Thứ 7: <span className="font-bold text-gray-950">09:00–17:30</span><br />Chủ nhật và ngày lễ: <span className="font-bold text-orange-900">Nghỉ</span></p>
              </div>
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-950"><Phone className="h-5 w-5 text-[#D83B00]" /> Điện thoại hỗ trợ</h3>
                <a href="tel:0844998499" onClick={() => trackEvent("click_phone", { position: "map_section" })} className="ml-7 inline-flex min-h-11 items-center font-bold text-gray-900 hover:text-orange-800">0844 998 499</a>
              </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <button
              type="button"
              aria-expanded={showMap}
              aria-controls="vinprint-map-panel"
              onClick={() => {
                setShowMap((current) => {
                  if (!current) trackEvent("load_google_map", { position: "map_section" });
                  return !current;
                });
              }}
              className="flex min-h-12 w-full items-center justify-between rounded-full bg-gray-950 px-6 text-sm font-bold text-white hover:bg-gray-800"
            >
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {showMap ? "Ẩn bản đồ" : "Xem bản đồ"}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${showMap ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>

            {showMap && (
              <div id="vinprint-map-panel" className="mt-4 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 p-2">
                <div className="relative aspect-video min-h-[280px] overflow-hidden rounded-2xl">
                  <iframe src={GOOGLE_BUSINESS_PROFILE_EMBED_URL} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Địa chỉ xưởng VinPrint trên Google Maps" className="absolute inset-0 h-full w-full" />
                </div>
                <a href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noreferrer" onClick={() => trackEvent("open_google_maps", { position: "map_section" })} className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-gray-950 hover:bg-gray-100"><Navigation className="h-4 w-4" /> Mở chỉ đường Google Maps</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
