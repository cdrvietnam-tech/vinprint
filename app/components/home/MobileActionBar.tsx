"use client";

import { Phone, Tag } from "lucide-react";
import { ZaloIcon } from "../icons";
import { trackEvent } from "../../lib/analytics";

const ZALO_URL = "https://zalo.me/0844998499";
const PHONE = "tel:0844998499";

export default function MobileActionBar() {
  return (
    <nav
      aria-label="Liên hệ nhanh"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-3 gap-2 px-3 py-2">
        <a
          href={PHONE}
          aria-label="Gọi ngay 0844 998 499"
          onClick={() => trackEvent("click_phone", { position: "mobile_bar" })}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-gray-800 font-bold text-xs hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
          Gọi ngay
        </a>
        <a
          href="#bang-gia"
          aria-label="Xem combo ưu đãi"
          onClick={() => trackEvent("view_pricing", { position: "mobile_bar" })}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-indigo-700 font-bold text-xs hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Tag className="w-5 h-5" aria-hidden="true" />
          Combo ưu đãi
        </a>
        <a
          href={ZALO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chốt in qua Zalo với VinPrint"
          onClick={() => trackEvent("click_zalo", { position: "mobile_bar" })}
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-blue-700 text-white font-bold text-xs shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-900"
        >
          <ZaloIcon className="w-5 h-5" aria-hidden="true" />
          Chốt in Zalo
        </a>
      </div>
    </nav>
  );
}
