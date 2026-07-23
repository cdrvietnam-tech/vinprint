"use client";

import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Megaphone,
  Package,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "../../lib/analytics";

type CategoryKey = "all" | "labels" | "office" | "advertising" | "packaging";

const tabs: Array<{ key: CategoryKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "labels", label: "Tem nhãn" },
  { key: "office", label: "Văn phòng" },
  { key: "advertising", label: "Quảng cáo" },
  { key: "packaging", label: "Bao bì" },
];

const groups = [
  {
    key: "labels" as const,
    title: "Tem nhãn dán sản phẩm",
    description: "Đủ chất liệu cho chai lọ, hộp, túi, mỹ phẩm, thực phẩm và đồ uống.",
    icon: Tag,
    tone: "from-orange-100 to-rose-50 text-orange-800",
    items: [
      ["Tem giấy", "/san-pham/tem-giay"],
      ["Tem nhựa chống nước", "/san-pham/tem-nhua-chong-nuoc"],
      ["Tem giấy kraft", "/san-pham/tem-giay"],
      ["Tem trong", "/san-pham/tem-nhua-trong"],
      ["Sticker trang trí", "/san-pham/sticker-trang-tri"],
      ["Tem vàng", "/san-pham/tem-vang"],
      ["Tem bạc", "/san-pham/tem-bac"],
      ["Tem UV DTF", "/san-pham/tem-uv-dtf"],
      ["Tem hologram", "/san-pham/tem-7-mau"],
      ["Tem bảo hành", "/san-pham/tem-bao-hanh"],
      ["Tem phụ sản phẩm", "/san-pham/tem-phu-san-pham"],
    ],
  },
  {
    key: "office" as const,
    title: "Ấn phẩm văn phòng",
    description: "Bộ ấn phẩm đồng bộ giúp thương hiệu xuất hiện chuyên nghiệp trong mọi giao dịch.",
    icon: BriefcaseBusiness,
    tone: "from-blue-100 to-cyan-50 text-blue-800",
    items: [
      ["In catalog", null],
      ["In card visit", null],
      ["In voucher", null],
      ["In bao thư", null],
      ["In folder", null],
      ["In hóa đơn", null],
      ["In tiêu đề thư", null],
    ],
  },
  {
    key: "advertising" as const,
    title: "Ấn phẩm quảng cáo",
    description: "Truyền tải ưu đãi và thông tin bán hàng rõ ràng tại điểm bán hoặc sự kiện.",
    icon: Megaphone,
    tone: "from-violet-100 to-fuchsia-50 text-violet-800",
    items: [
      ["In tờ rơi", null],
      ["In brochure", null],
      ["In poster", null],
      ["In menu", null],
      ["In standee", null],
      ["In phiếu bảo hành", null],
    ],
  },
  {
    key: "packaging" as const,
    title: "Bao bì & phụ kiện",
    description: "Hoàn thiện trải nghiệm mở hộp và tăng nhận diện thương hiệu ngay từ bao bì.",
    icon: ShoppingBag,
    tone: "from-emerald-100 to-lime-50 text-emerald-800",
    items: [
      ["In túi giấy", null],
      ["In hộp giấy", null],
      ["In thẻ treo", null],
      ["In tag sản phẩm", null],
      ["In giấy gói", null],
    ],
  },
] as const;

const ZALO_URL = "https://zalo.me/0844998499";

export default function ProductCatalogTabs() {
  const [activeTab, setActiveTab] = useState<CategoryKey>("all");
  const visibleGroups = activeTab === "all" ? groups : groups.filter((group) => group.key === activeTab);

  return (
    <>
      <div role="tablist" aria-label="Danh mục sản phẩm" className="mb-10 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-black transition-colors ${activeTab === tab.key ? "bg-gray-950 text-white" : "border border-gray-300 bg-white text-gray-800 hover:border-orange-400 hover:text-orange-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-7">
        {visibleGroups.map((group) => {
          const Icon = group.icon;
          return (
            <section key={group.key} className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
              <div className={`flex flex-col gap-4 bg-gradient-to-r ${group.tone} p-6 sm:flex-row sm:items-center sm:p-8`}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-2xl font-black text-gray-950 sm:text-3xl">{group.title}</h2>
                  <p className="mt-1 max-w-3xl text-sm font-medium leading-relaxed text-gray-700 sm:text-base">{group.description}</p>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map(([name, href]) => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
                        {group.key === "labels" ? <Tag className="h-5 w-5" /> : group.key === "office" ? <BookOpen className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                      </span>
                      <span className="flex-1 font-black text-gray-950">{name}</span>
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-orange-700">
                        {href ? "Xem" : "Nhận giá"} <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </>
                  );

                  const className = "group flex min-h-[76px] items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md";
                  return href ? (
                    <Link key={name} href={href} className={className}>{content}</Link>
                  ) : (
                    <a
                      key={name}
                      href={ZALO_URL}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackEvent("click_zalo", { position: `catalog_${group.key}` })}
                      className={className}
                    >
                      {content}
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
