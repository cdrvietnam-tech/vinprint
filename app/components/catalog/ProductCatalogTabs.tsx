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

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((item) => {
                  const { href } = item;
                  const managed = managedThumbnails[item.id];
                  const name = managed?.title || item.name;
                  const image = managed?.src || item.image;
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
                          unoptimized={image.startsWith("/media/")}
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
                    <Link key={item.id} href={href} className={className}>{content}</Link>
                  ) : (
                    <a
                      key={item.id}
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
