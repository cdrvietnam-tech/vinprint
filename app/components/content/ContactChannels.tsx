"use client";
import {useSiteContent} from "../SiteContentProvider";
import ConversionLink from "../ConversionLink";
import {safePublicHref} from "../../lib/storefront";
export default function ContactChannels(){const {contact}=useSiteContent();return <nav className="vp-contact-channels" aria-label="Liên hệ trực tiếp"><ConversionLink href={safePublicHref(contact.zaloUrl)} eventName="click_zalo" eventPosition="contact_page" target="_blank" rel="noreferrer" className="red">Nhắn Zalo gửi mẫu</ConversionLink><ConversionLink href={"tel:"+contact.phone.replace(/[^+\d]/g,"")} eventName="click_phone" eventPosition="contact_page">Gọi {contact.phoneDisplay}</ConversionLink><a href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(contact.address)} target="_blank" rel="noreferrer">Xem đường đến xưởng</a></nav>}
