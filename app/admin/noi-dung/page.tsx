import type { Metadata } from "next";
import ContentAdmin from "../../components/admin/ContentAdmin";

export const metadata: Metadata = {
  title: "Quản trị nội dung trang chủ | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ContentAdminPage() {
  return <ContentAdmin />;
}
