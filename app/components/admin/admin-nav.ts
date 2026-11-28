import type { LucideIcon } from "lucide-react";
import {
  BarChart3, ExternalLink, FileText, Gauge, Image as ImageIcon,
  LayoutDashboard, LayoutTemplate, Map as MapIcon, Search,
} from "lucide-react";

// Nguồn duy nhất cho menu quản trị: sidebar, Ctrl+K và tiêu đề trang đều đọc từ đây.
// Thêm khu vực quản trị mới: thêm một dòng ở đây rồi bọc trang bằng <AdminShell active="...">.
export type AdminKey = "home" | "themes" | "noi-dung" | "hinh-anh" | "bai-viet";

export type AdminNavItem = {
  id: string;
  title: string;
  pageTitle: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  keywords?: string;
};

export type AdminNavGroup = { group: string; items: AdminNavItem[] };

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    group: "Tổng quan",
    items: [
      { id: "home", title: "Tổng quan", pageTitle: "Tổng quan VinPrint", href: "/admin", icon: LayoutDashboard, keywords: "trung tam bang dieu khien dashboard" },
    ],
  },
  {
    group: "Nội dung",
    items: [
      { id: "themes", title: "Theme theo dịp lễ", pageTitle: "Theme theo dịp lễ", href: "/admin/themes", icon: LayoutTemplate, keywords: "theme giao dien tet noel giang sinh 8/3 20/10 20/11" },
      { id: "noi-dung", title: "Nội dung trang chủ", pageTitle: "Nội dung trang chủ", href: "/admin/noi-dung", icon: LayoutTemplate, keywords: "hero bang gia faq lien he footer menu chu so" },
      { id: "hinh-anh", title: "Hình ảnh & video", pageTitle: "Hình ảnh & video", href: "/admin/hinh-anh", icon: ImageIcon, keywords: "anh video poster mau thuc te thu vien" },
      { id: "bai-viet", title: "Bài viết", pageTitle: "Bài viết (Cẩm nang in ấn)", href: "/admin/bai-viet", icon: FileText, keywords: "blog cam nang bai viet seo" },
    ],
  },
  {
    group: "Kiểm tra nhanh",
    items: [
      { id: "site", title: "Xem web", pageTitle: "Xem web", href: "/", icon: ExternalLink, external: true, keywords: "trang chu vinprint" },
      { id: "sitemap", title: "Sitemap", pageTitle: "Sitemap", href: "/sitemap.xml", icon: MapIcon, external: true, keywords: "sitemap xml" },
      { id: "gsc", title: "Search Console", pageTitle: "Google Search Console", href: "https://search.google.com/search-console?resource_id=sc-domain%3Avinprint.vn", icon: Search, external: true, keywords: "google search console index tu khoa" },
      { id: "ga4", title: "Google Analytics", pageTitle: "Google Analytics", href: "https://analytics.google.com/", icon: BarChart3, external: true, keywords: "ga4 analytics luot xem zalo" },
      { id: "pagespeed", title: "Tốc độ trang", pageTitle: "PageSpeed Insights", href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fvinprint.vn", icon: Gauge, external: true, keywords: "pagespeed toc do core web vitals" },
    ],
  },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

export function getAdminPageTitle(id: AdminKey): string {
  return ADMIN_NAV_ITEMS.find((item) => item.id === id)?.pageTitle ?? "Quản trị VinPrint";
}

export function normalizeAdminQuery(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
}

export function filterAdminNav(query: string): AdminNavItem[] {
  const needle = normalizeAdminQuery(query);
  if (!needle) return ADMIN_NAV_ITEMS;
  return ADMIN_NAV_ITEMS.filter((item) =>
    normalizeAdminQuery(`${item.title} ${item.pageTitle} ${item.keywords ?? ""}`).includes(needle),
  );
}
