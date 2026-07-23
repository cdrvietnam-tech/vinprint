import type { Metadata } from "next";
import QuoteRequestsAdmin from "../../components/admin/QuoteRequestsAdmin";

export const metadata: Metadata = {
  title: "Yêu cầu báo giá | VinPrint",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function QuoteRequestsAdminPage() {
  return <QuoteRequestsAdmin />;
}
