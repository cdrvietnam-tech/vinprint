"use client";
import type {ReactNode} from "react";
import Link from "next/link";
import StorefrontFrame from "./StorefrontFrame";
import "./guide-frame.css";
export default function GuideFrame({children}:{children:ReactNode}){
 return <StorefrontFrame activePath="" product={{name:"Tư vấn quy cách in tem",slug:""}}>{({openQuote,zalo,contact})=><div className="vp-guide-page" onClick={event=>{const anchor=(event.target as HTMLElement).closest(".vp-guide-toc a");const href=anchor?.getAttribute("href");const target=href&&document.querySelector(href);if(!target)return;event.preventDefault();event.stopPropagation();window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-82,behavior:"instant"});}}>{children}<div className="vp-guide-callout"><div><h2>Cần tư vấn theo sản phẩm thật?</h2><p>Gửi hình bao bì, kích thước và số lượng để xưởng kiểm tra.</p></div><div><button className="red" onClick={openQuote}>Chuẩn bị yêu cầu báo giá →</button><a className="vp-action" href={zalo} target="_blank" rel="noreferrer">Nhắn Zalo nhận tư vấn</a></div></div><footer className="vp-detail-footer"><strong>VinPrint</strong><p>{contact.address} · {contact.phoneDisplay}</p><nav><Link href="/san-pham">Chọn loại tem</Link><Link href="/lien-he">Liên hệ</Link><Link href="/chinh-sach">Chính sách đặt in</Link></nav></footer></div>}</StorefrontFrame>;
}
