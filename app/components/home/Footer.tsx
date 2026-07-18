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

export default function Footer() {
  return (
    <footer id="lien-he" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 border-t border-gray-200 px-4 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-black uppercase tracking-wider text-gray-950">VinPrint</h3>
          <p className="max-w-xs leading-7 text-gray-700">In tem nhãn theo yêu cầu tại TP.HCM. Hỗ trợ thiết kế, nhận số lượng ít và giao hàng toàn quốc.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://shopee.vn/chaucay_senda" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold text-orange-700 underline">Shopee</a>
            <a href="https://maps.app.goo.gl/M4w2H7F9p95XF9oT9" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center font-bold text-blue-800 underline">Google Maps</a>
          </div>
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
            <li>09:00–17:30 · Thứ 2–Thứ 7</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-gray-200 px-4 py-8 text-sm font-medium text-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 VinPrint. In ấn siêu tốc.</span>
        <div className="flex gap-5"><Link href="/chinh-sach">Chính sách</Link><Link href="/bao-hanh">Bảo hành</Link><Link href="/llms.txt">llms.txt</Link></div>
      </div>
    </footer>
  );
}
