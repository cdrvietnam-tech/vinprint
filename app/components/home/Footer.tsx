import Link from "next/link";
import ConversionLink from "../ConversionLink";

const serviceLinks = [
  ["Tem UV DTF", "/san-pham/tem-uv-dtf"],
  ["Tem giấy", "/san-pham/tem-giay"],
  ["Tem nhựa chống nước", "/san-pham/tem-nhua-chong-nuoc"],
  ["Tem hologram", "/san-pham/tem-7-mau"],
] as const;

const companyLinks = [
  ["Giới thiệu", "/gioi-thieu"],
  ["Liên hệ", "/lien-he"],
  ["Chính sách", "/chinh-sach"],
  ["Bảo hành", "/bao-hanh"],
  ["Case study", "/case-study"],
] as const;

export default function Footer({ hasMobileActionBar = false }: { hasMobileActionBar?: boolean }) {
  return (
    <footer id="lien-he" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 border-t border-gray-200 px-4 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-black uppercase tracking-wider text-gray-950">VinPrint</h3>
          <p className="max-w-xs leading-7 text-gray-700">In tem nhãn theo yêu cầu tại TP.HCM. Hỗ trợ thiết kế, nhận số lượng ít và giao hàng toàn quốc.</p>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">Sản phẩm</h3>
          <ul className="space-y-1 text-gray-700">{serviceLinks.map(([label, href]) => <li key={href}><Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href={href}>{label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">VinPrint</h3>
          <ul className="space-y-1 text-gray-700">{companyLinks.map(([label, href]) => <li key={href}><Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href={href}>{label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">Liên hệ xưởng</h3>
          <ul className="space-y-3 leading-6 text-gray-700">
            <li><ConversionLink href="tel:0844998499" eventName="click_phone" eventPosition="footer" className="inline-flex min-h-11 items-center font-bold underline">0844 998 499</ConversionLink></li>
            <li>254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM</li>
            <li>09:00–17:30 · Thứ 2–Thứ 7<br />Nghỉ Chủ nhật và ngày lễ</li>
          </ul>
        </div>
      </div>
      <div className={`mx-auto flex max-w-[1440px] flex-col items-center gap-4 border-t border-gray-200 px-4 py-8 text-center text-sm font-medium text-gray-700 sm:flex-row sm:justify-between sm:pb-8 sm:text-left ${hasMobileActionBar ? "pb-28" : "pb-8"}`}>
        <span>© 2026 VinPrint. In ấn siêu tốc.</span>
        <nav aria-label="Liên kết pháp lý" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/chinh-sach">Chính sách</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/bao-hanh">Bảo hành</Link>
        </nav>
      </div>
    </footer>
  );
}
