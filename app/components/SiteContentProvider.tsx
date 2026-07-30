"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_SITE_CONTENT, mergeSiteContent, type SiteContent } from "../lib/site-content";

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

// Nạp nội dung động từ API công khai và hợp nhất với mặc định.
// Render lần đầu dùng mặc định (đã có trong HTML → tốt cho SEO); sau khi tải
// xong sẽ đè nội dung đã chỉnh sửa.
export default function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let active = true;
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data === "object") {
          setContent(mergeSiteContent(data));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
