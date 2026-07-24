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
import { useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics";
import { type ManagedMediaItem } from "../../lib/media-collections";
import { PRODUCT_CATALOG_GROUPS, type ProductCatalogCategoryKey } from "../../lib/product-catalog";

const tabs: Array<{ key: ProductCatalogCategoryKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "labels", label: "Tem nhãn" },
  { key: "office", label: "Văn phòng" },
  { key: "advertising", label: "Quảng cáo" },
  { key: "packaging", label: "Bao bì" },
];

const groupIcons = {
  labels: Tag,
  office: BriefcaseBusiness,
  advertising: Megaphone,
  packaging: ShoppingBag,
};

const ZALO_URL = "https://zalo.me/0844998499";

export default function ProductCatalogTabs() {
  const [activeTab, setActiveTab] = useState<ProductCatalogCategoryKey>("all");
  const [managedThumbnails, setManagedThumbnails] = useState<Record<string, Pick<ManagedMediaItem, "src" | "title">>>({});
  const visibleGroups = activeTab === "all" ? PRODUCT_CATALOG_GROUPS : PRODUCT_CATALOG_GROUPS.filter((group) => group.key === activeTab);

  useEffect(() => {
    fetch("/api/media/collections?collection=product-thumbnails", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() as Promise<{ items: ManagedMediaItem[] }> : null)
      .then((result) => {
        if (!Array.isArray(result?.items)) return;
        setManagedThumbnails(Object.fromEntries(result.items.map((item) => [item.id, { src: item.src, title: item.title }])));
      })
      .catch(() => undefined);
  }, []);

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
          const Icon = groupIcons[group.key];
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

              <div className="grid gap-x-4 gap-y-6 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-8">
                {group.items.slice(0, 15).map((item) => {
                  const { href } = item;
                  const managed = managedThumbnails[item.id];
                  const name = managed?.title || item.name;
                  const image = managed?.src || item.image;
                  const content = (
                    <>
                      <span
                        className="relative block aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#f3f0e9]"
                        data-catalog-thumbnail={name}
                      >
                        <Image
                          src={image}
                          alt=""
                          fill
                          loading="lazy"
                          unoptimized={image.startsWith("/media/")}
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                        />
                        {!href ? (
                          <span className="absolute left-3 top-3 rounded-full bg-orange-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-md">
                            Nhận giá
                          </span>
                        ) : null}
                        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-950 shadow-md backdrop-blur transition-transform duration-300 group-hover:scale-110">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </span>
                      <span className="block px-1 pt-3">
                        <strong className="line-clamp-2 block text-center text-base font-black leading-snug text-gray-950 sm:text-lg">{name}</strong>
                      </span>
                    </>
                  );

                  const className = "group block min-w-0 rounded-[24px] border border-gray-200 bg-white p-2 pb-4 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_18px_45px_rgba(60,42,24,0.14)] active:scale-[0.98]";
                  return href ? (
                    <Link key={item.id} href={href} aria-label={`Xem ${name}`} className={className} data-catalog-card>{content}</Link>
                  ) : (
                    <a
                      key={item.id}
                      href={ZALO_URL}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Nhắn Zalo nhận giá ${name}`}
                      onClick={() => trackEvent("click_zalo", { position: `catalog_${group.key}` })}
                      className={className}
                      data-catalog-card
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
