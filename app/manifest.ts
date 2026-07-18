import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VinPrint - In tem nhãn theo yêu cầu",
    short_name: "VinPrint",
    description: "Xem loại tem, giá tham khảo, ảnh thật và chốt đơn in tem nhãn qua Zalo.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0e7",
    theme_color: "#171310",
    lang: "vi",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
