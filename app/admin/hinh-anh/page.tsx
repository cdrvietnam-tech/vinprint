import type { Metadata } from "next";
import HeroImageAdmin from "../../components/admin/HeroImageAdmin";

export const metadata: Metadata = {
  title: "Thư viện hình ảnh | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function HeroImageAdminPage() {
  return <HeroImageAdmin />;
}
