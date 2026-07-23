import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/be-vietnam-pro/800.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import SmoothScroll from "./components/smooth-scroll";
import GoogleTagManager from "./components/GoogleTagManager";

export const metadata: Metadata = {
  metadataBase: new URL("https://vinprint.vn"),
  title: {
    default: "VinPrint — In tem nhãn theo yêu cầu tại TP.HCM",
    template: "%s | VinPrint",
  },
  description:
    "In tem giấy, tem nhựa chống nước, tem ánh kim và UV DTF tại TP.HCM. Xem giá tham khảo, ảnh thật, đánh giá Shopee và gửi file chốt đơn qua Zalo.",
  keywords: [
    "in tem nhãn",
    "in tem nhãn theo yêu cầu",
    "in tem UV DTF",
    "tem nhựa chống nước",
    "tem giấy",
    "in tem TP.HCM",
    "in tem Gò Vấp",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "VinPrint",
    title: "VinPrint — Tem đẹp đúng chất, gửi file là chốt",
    description:
      "Xem các loại tem, giá tham khảo, ảnh thật và gửi file đặt in tại TP.HCM.",
    images: [
      {
        url: "/images/hero-products.webp",
        width: 1024,
        height: 682,
        alt: "Bộ sưu tập tem nhãn VinPrint",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VinPrint — In tem nhãn theo yêu cầu tại TP.HCM",
    description: "Tem giấy, tem nhựa, UV DTF và tem ánh kim. Gửi file để chốt đơn qua Zalo.",
    images: ["/images/hero-products.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "VN-SG",
    "geo.placename": "Phường Thông Tây Hội, TP.HCM",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171310",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <a className="skip-link" href="#main-content">Bỏ qua điều hướng</a>
        <SmoothScroll />
        <GoogleTagManager />
        {children}
      </body>
    </html>
  );
}
