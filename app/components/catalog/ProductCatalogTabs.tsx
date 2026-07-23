"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Megaphone,
  ShoppingBag,
  Tag,
} from "lucide-react";
import Image from "next/image";
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
      { name: "Tem giấy", href: "/san-pham/tem-giay", image: "/images/products/tem-giay.webp" },
      { name: "Tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc", image: "/images/products/tem-nhua-chong-nuoc.webp" },
      { name: "Tem giấy kraft", href: "/san-pham/tem-giay", image: "/images/mockups/kraft_box.webp" },
      { name: "Tem trong", href: "/san-pham/tem-nhua-trong", image: "/images/products/tem-nhua-trong.webp" },
      { name: "Sticker trang trí", href: "/san-pham/sticker-trang-tri", image: "/images/products/tem-nhua-chong-nuoc.webp" },
      { name: "Tem vàng", href: "/san-pham/tem-vang", image: "/images/products/tem-ep-kim.webp" },
      { name: "Tem bạc", href: "/san-pham/tem-bac", image: "/images/products/tem-bac.webp" },
      { name: "Tem UV DTF", href: "/san-pham/tem-uv-dtf", image: "/images/products/tem-uv-dtf.webp" },
      { name: "Tem hologram", href: "/san-pham/tem-7-mau", image: "/images/holographic_sticker.webp" },
      { name: "Tem bảo hành", href: "/san-pham/tem-bao-hanh", image: "/images/products/tem-bac.webp" },
      { name: "Tem phụ sản phẩm", href: "/san-pham/tem-phu-san-pham", image: "/images/products/tem-nhua-trong.webp" },
    ],
  },
  {
    key: "office" as const,
    title: "Ấn phẩm văn phòng",
    description: "Bộ ấn phẩm đồng bộ giúp thương hiệu xuất hiện chuyên nghiệp trong mọi giao dịch.",
    icon: BriefcaseBusiness,
    tone: "from-blue-100 to-cyan-50 text-blue-800",
    items: [
      { name: "In catalog", href: null, image: "/images/hero-admin/hero-1.png" },
      { name: "In card visit", href: null, image: "/images/materials-flatlay.webp" },
      { name: "In voucher", href: null, image: "/images/hero-admin/hero-2.png" },
      { name: "In bao thư", href: null, image: "/images/mockups/paper_box.webp" },
      { name: "In folder", href: null, image: "/images/hero-admin/hero-3.png" },
      { name: "In hóa đơn", href: null, image: "/images/materials-flatlay.webp" },
      { name: "In tiêu đề thư", href: null, image: "/images/hero-admin/hero-4.png" },
    ],
  },
  {
    key: "advertising" as const,
    title: "Ấn phẩm quảng cáo",
    description: "Truyền tải ưu đãi và thông tin bán hàng rõ ràng tại điểm bán hoặc sự kiện.",
    icon: Megaphone,
    tone: "from-violet-100 to-fuchsia-50 text-violet-800",
    items: [
      { name: "In tờ rơi", href: null, image: "/images/hero-admin/hero-2.png" },
      { name: "In brochure", href: null, image: "/images/hero-admin/hero-1.png" },
      { name: "In poster", href: null, image: "/images/hero-products.webp" },
      { name: "In menu", href: null, image: "/images/materials-flatlay.webp" },
      { name: "In standee", href: null, image: "/images/application-photo.webp" },
      { name: "In phiếu bảo hành", href: null, image: "/images/products/tem-bac.webp" },
    ],
  },
  {
    key: "packaging" as const,
    title: "Bao bì & phụ kiện",
    description: "Hoàn thiện trải nghiệm mở hộp và tăng nhận diện thương hiệu ngay từ bao bì.",
    icon: ShoppingBag,
    tone: "from-emerald-100 to-lime-50 text-emerald-800",
    items: [
      { name: "In túi giấy", href: null, image: "/images/hero-admin/hero-3.png" },
      { name: "In hộp giấy", href: null, image: "/images/mockups/paper_box.webp" },
      { name: "In thẻ treo", href: null, image: "/images/products/tem-giay.webp" },
      { name: "In tag sản phẩm", href: null, image: "/images/mockups/kraft_box.webp" },
      { name: "In giấy gói", href: null, image: "/images/materials-flatlay.webp" },
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
                {group.items.map(({ name, href, image }) => {
                  const content = (
                    <>
                      <span
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] bg-white shadow-sm"
                        data-catalog-thumbnail={name}
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          loading="lazy"
                          sizes="64px"
                          className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block text-sm font-black leading-snug text-gray-950 sm:text-[15px]">{name}</strong>
                        <small className="mt-1 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.08em] text-orange-700">
                          {href ? "Xem chi tiết" : "Nhận giá"} <ArrowUpRight className="h-3.5 w-3.5" />
                        </small>
                      </span>
                    </>
                  );

                  const className = "group flex min-h-[92px] items-center gap-3 rounded-[20px] border border-gray-200 bg-gray-50 p-3 transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md active:scale-[0.98]";
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
