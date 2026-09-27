"use client";

import Link from "next/link";
import ConversionLink from "../ConversionLink";
import { useSiteContent } from "../SiteContentProvider";

export default function Footer({ hasMobileActionBar = false }: { hasMobileActionBar?: boolean }) {
  const { footer, contact } = useSiteContent();

  return (
    <footer id="lien-he" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 border-t border-gray-200 px-4 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-3 text-lg font-black uppercase tracking-wider text-gray-950">VinPrint</h3>
          <p className="max-w-xs leading-7 text-gray-700">{footer.about}</p>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">Sản phẩm</h3>
          <ul className="space-y-1 text-gray-700">{footer.productLinks.map((item) => <li key={item.href}><Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href={item.href}>{item.label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">VinPrint</h3>
          <ul className="space-y-1 text-gray-700">{footer.companyLinks.map((item) => <li key={item.href}><Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href={item.href}>{item.label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-3 font-black uppercase tracking-wider text-gray-950">Liên hệ xưởng</h3>
          <ul className="space-y-3 leading-6 text-gray-700">
            <li><ConversionLink href={`tel:${contact.phone}`} eventName="click_phone" eventPosition="footer" className="inline-flex min-h-11 items-center font-bold underline">{contact.phoneDisplay}</ConversionLink></li>
            <li>{contact.address}</li>
            <li>{contact.hoursWeekday}<br />{contact.hoursWeekend}</li>
          </ul>
        </div>
      </div>
      <div className={`mx-auto flex max-w-[1440px] flex-col items-center gap-4 border-t border-gray-200 px-4 py-8 text-center text-sm font-medium text-gray-700 sm:flex-row sm:justify-between sm:pb-8 sm:text-left ${hasMobileActionBar ? "pb-28" : "pb-8"}`}>
        <span>{footer.copyright}</span>
        <nav aria-label="Liên kết pháp lý" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/chinh-sach">Chính sách</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/bao-hanh">Bảo hành</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/mau-tem-moi">Mẫu tem mới</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-[#D83B00]" href="/ai247">Video AI247</Link>
        </nav>
      </div>
    </footer>
  );
}
