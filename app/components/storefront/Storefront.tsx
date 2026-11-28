"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Home, Tag, Sticker, CircleDot, BadgeCheck, FileText, Gift, Image as ImageIcon, Upload, HelpCircle, ShoppingBag, Phone, Package, Headphones, Grid2X2, Flower2, Archive, Smartphone, Scissors, Sparkles, Eraser, Images, Video, Menu, BookOpen, X, MapPin, type LucideIcon } from "lucide-react";
import { useSiteContent } from "../SiteContentProvider";
import { DEFAULT_MEDIA_COLLECTIONS, type ManagedMediaItem } from "../../lib/media-collections";
import { CUSTOMER_AVATARS } from "../home/customer-avatars";
import { SHOPEE_SHOP_URL } from "../../lib/products";
import { GOOGLE_BUSINESS_PROFILE_EMBED_URL, GOOGLE_BUSINESS_PROFILE_URL } from "../../lib/business-info";
import { trackEvent } from "../../lib/analytics";
import { advertisingItems, featuredImage, selectHomepageMedia, buildQuoteMessage, catalogProducts, featuredItems, featuredProduct, filterFeatured, pricingPosterAssets, safePublicHref, storefrontFilters, type QuoteValues, type StorefrontFilter } from "../../lib/storefront";
import "./storefront.css";
import "./home-tools.css";
import "./storefront-polish.css";
import {freeTools} from "../../lib/free-tools";
import ToolPreview from "./ToolPreview";
import MaterialCatalog from "./MaterialCatalog";
import HomeMaterialOverview from "./HomeMaterialOverview";
import "./home-layout-approved.css";
import { productThemeImage } from "../../lib/product-theme";

const iconMap: Record<string,LucideIcon> = {archive:Archive,smartphone:Smartphone,cut:Scissors,sparkles:Sparkles,eraser:Eraser,images:Images,video:Video,home:Home,tag:Tag,sticker:Sticker,roll:CircleDot,badge:BadgeCheck,file:FileText,gift:Gift,image:ImageIcon,upload:Upload,help:HelpCircle,bag:ShoppingBag,phone:Phone,box:Package,headset:Headphones,grid:Grid2X2,flower:Flower2,menu:Menu,book:BookOpen,map:MapPin};
function Icon({name}:{name:string}) { const Component=iconMap[name]||Tag;return <i aria-hidden="true"><Component /></i>; }
function Artwork({box,reference=false,label}:{box:string;reference?:boolean;label?:string}) {
  return <svg viewBox={box} preserveAspectRatio="xMidYMid slice" role={label?"img":undefined} aria-label={label} aria-hidden={label?undefined:true}><image href={reference?"/images/tet-2027/reference-products.webp":"/images/tet-2027/artwork.webp"} width="1781" height="883" /></svg>;
}


type Modal = {kind:"quote"|"upload"|"order"} | {kind:"poster";index:number} | null;

export default function Storefront(){
  const content=useSiteContent();
  const {contact,tetHome,pricing,process,faq,footer,reviews,finalCta}=content;
  const [filter,setFilter]=useState<StorefrontFilter>("all");
  const [menuOpen,setMenuOpen]=useState(false);
  const [modal,setModal]=useState<Modal>(null);
  const [selectedProduct,setSelectedProduct]=useState("Tem nhãn Tết");
  const [requestText,setRequestText]=useState("");
  const [copied,setCopied]=useState(false);
  const [copyError,setCopyError]=useState("");
  const [showMap,setShowMap]=useState(false);
  const [gallery,setGallery]=useState<ManagedMediaItem[]>(DEFAULT_MEDIA_COLLECTIONS.gallery);
  const dialogRef=useRef<HTMLDialogElement>(null);
  const requestRef=useRef<HTMLTextAreaElement>(null);
  const visible=filterFeatured(filter);
  const homepageMedia=selectHomepageMedia([],gallery);
  const zaloUrl=safePublicHref(contact.zaloUrl);
  const callUrl="tel:"+contact.phone.replace(/[^+\d]/g,"");
  const primaryHref=safePublicHref(tetHome.primaryCta.href,"#nhan-bao-gia");

  useEffect(()=>{const frame=requestAnimationFrame(()=>{if(new URLSearchParams(window.location.search).get("danh-muc")==="print")setFilter("print");});return ()=>cancelAnimationFrame(frame);},[]);
  useEffect(()=>{
    const dialog=dialogRef.current;
    if(modal && dialog && !dialog.open) dialog.showModal();
    if(!modal && dialog?.open) dialog.close();
  },[modal]);
  useEffect(()=>{
    const controller=new AbortController();
    fetch("/api/media/collections?collection=gallery",{cache:"no-store",signal:controller.signal})
      .then(r=>r.ok?r.json() as Promise<{items: ManagedMediaItem[]}>:null)
      .then(data=>{if(Array.isArray(data?.items))setGallery(data.items.filter((item:ManagedMediaItem)=>item&&item.kind!=="video"&&typeof item.src==="string"));})
      .catch(()=>undefined);
    return ()=>controller.abort();
  },[]);
  function openQuote(name:string){setSelectedProduct(name);setRequestText("");setCopied(false);setCopyError("");setModal({kind:"quote"});setMenuOpen(false);}
  function chooseFilter(value:StorefrontFilter){setFilter(value);setMenuOpen(false);}
  function quoteCta(event:MouseEvent<HTMLAnchorElement>,href:string,name="Tem nhãn Tết"){
    if(href==="#nhan-bao-gia"){event.preventDefault();openQuote(name);}
  }
  function prepareQuote(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const data=new FormData(event.currentTarget);
    const values=Object.fromEntries(["product","material","size","quantity","name","phone","deadline","note"].map(key=>[key,String(data.get(key)||"")])) as QuoteValues;
    setRequestText(buildQuoteMessage(values));setCopied(false);setCopyError("");
  }
  async function copyRequest(){
    try{await navigator.clipboard.writeText(requestText);setCopied(true);setCopyError("");}
    catch{requestRef.current?.focus();requestRef.current?.select();setCopyError("Bạn có thể chọn và sao chép nội dung bên dưới để gửi qua Zalo.");}
  }
  function closeDialog(){setModal(null);}
  const navFilter=(name:string,icon:string,value:StorefrontFilter)=><Link prefetch={false} className={"vp-nav vp-action "+(filter===value?"active":"")} href="#san-pham-tet" onClick={()=>chooseFilter(value)}><Icon name={icon}/>{name}</Link>;
  const navLink=(name:string,icon:string,href:string)=><Link prefetch={false} className="vp-nav vp-action" href={safePublicHref(href)} onClick={()=>setMenuOpen(false)}><Icon name={icon}/>{name}</Link>;

  return <div className="vinprint-storefront vp-home-rearranged">
    <aside id="sidebar" className={menuOpen?"open":""}>
      <Link prefetch={false} className="logo" href="/" aria-label="VinPrint — Trang chủ"><Artwork box="18 0 178 77" reference /></Link>
      <nav aria-label="Danh mục dịch vụ">
        <Link className={"vp-nav vp-action "+(filter==="all"||filter==="tet"?"active":"")} href="#trang-chu" onClick={()=>chooseFilter("all")}><Icon name="home"/>Trang chủ</Link>
        <Link className="vp-nav vp-action" href="#san-pham-tet" onClick={()=>chooseFilter("all")}><Icon name="tag"/>Các loại tem nhãn</Link>
        {navFilter("Ấn phẩm quảng cáo","file","print")}
        {navLink("Kho mẫu","image","#mau-thuc-te")}
        {navLink("Công cụ miễn phí","sticker","#cong-cu-mien-phi")}
        {navLink("Hướng dẫn đặt in","book","#quy-trinh")}
        {navLink("Liên hệ","phone","#lien-he-xuong")}
      </nav>
    </aside>

    <div className="workspace">
      <header>
        <button id="menu" aria-label={menuOpen?"Đóng danh mục":"Mở danh mục"} aria-expanded={menuOpen} aria-controls="sidebar" onClick={()=>setMenuOpen(v=>!v)}><Icon name="menu"/></button>
        <Link prefetch={false} className="vp-mobile-logo" href="/" aria-label="VinPrint"><Artwork box="18 0 178 77" reference /></Link>
        <div className="peach" aria-hidden="true"><Artwork box="223 0 230 70" reference /></div>
        <nav aria-label="Tiện ích nhanh" className="toplinks">
          <button onClick={()=>openQuote("In tem nhãn")}><Icon name="file"/>Báo giá nhanh</button>
          <button onClick={()=>setModal({kind:"upload"})}><Icon name="upload"/>Gửi file in</button>
          <Link prefetch={false} className="vp-action" href="#mau-thuc-te"><Icon name="image"/>Kho mẫu</Link>
          <button onClick={()=>setModal({kind:"order"})}><Icon name="box"/>Đơn hàng</button>
          <Link prefetch={false} className="vp-action" href="#quy-trinh"><Icon name="help"/>Hướng dẫn</Link>
        </nav>
        <div className="account">
          <Link prefetch={false} className="coins vp-action" href={callUrl} onClick={()=>trackEvent("click_phone",{position:"tet_header"})}><Icon name="phone"/>{contact.phoneDisplay}</Link>
          <button className="red" onClick={()=>openQuote("In tem nhãn")}><Icon name="headset"/>Đặt in ngay</button>
          <Link prefetch={false} className="bell vp-action" href="#lien-he-xuong" aria-label="Thông tin liên hệ"><Icon name="help"/></Link>
          <Link prefetch={false} className="avatar vp-action vp-contact-avatar" href={zaloUrl} target="_blank" rel="noreferrer" aria-label="Nhắn Zalo VinPrint" onClick={()=>trackEvent("click_zalo",{position:"tet_header"})}>VP</Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="trang-chu" aria-labelledby="hero-title">
          <div className="hero-photo"><Artwork box="244 90 1516 335"/></div>
          <div className="hero-copy">
            <div className="eyebrow">{tetHome.eyebrow}</div>
            <h1 id="hero-title">{tetHome.titleLine1}<br/>{tetHome.titleLine2}</h1>
            <p className="vp-hero-subtitle">{tetHome.subtitle}</p>
            <div className="hero-actions">
              <Link prefetch={false} className="gold vp-action" href={primaryHref} onClick={e=>quoteCta(e,primaryHref)}>{tetHome.primaryCta.label}<span aria-hidden="true">→</span></Link>
              <Link prefetch={false} className="outline vp-action" href={safePublicHref(tetHome.secondaryCta.href,"#san-pham-tet")} onClick={()=>chooseFilter("tet")}>{tetHome.secondaryCta.label}</Link>
            </div>
          </div>
          <div className="benefits">{tetHome.features.slice(0,4).map((feature,index)=><span key={index}>{feature}</span>)}</div>
        </section>

        <div className="vp-home-service-strip" aria-label="Dịch vụ VinPrint">{[{icon:"headset",title:"Tư vấn chất liệu",detail:"Gợi ý đúng nhu cầu sử dụng"},{icon:"image",title:"Duyệt mẫu trước in",detail:"Xác nhận nội dung và quy cách"},{icon:"grid",title:"Linh hoạt số lượng",detail:"Trao đổi theo từng mẫu in"},{icon:"box",title:"Giao hàng toàn quốc",detail:"Xác nhận lịch và vận chuyển"}].map(item=><div key={item.title}><Icon name={item.icon}/><div><strong>{item.title}</strong><span>{item.detail}</span></div></div>)}</div>

        <section id="san-pham-tet" aria-labelledby="product-title">
          <div className="vp-home-products-heading"><h2 id="product-title">{filter==="all"?"Chọn tem phù hợp với sản phẩm":filter==="print"?"Ấn phẩm quảng cáo":filter==="tet"?"Mẫu tem Tết":storefrontFilters.find(f=>f.id===filter)?.label||"Tem nhãn VinPrint"}</h2><nav aria-label="Lọc sản phẩm">{([{id:"all",label:"Tem nhãn"},{id:"print",label:"Quảng cáo"},{id:"tet",label:"Mẫu Tết"}] as const).map(item=><button key={item.id} aria-pressed={filter===item.id} onClick={()=>chooseFilter(item.id)}>{item.label}</button>)}</nav><Link href="/san-pham">Xem tất cả →</Link></div>
          {filter==="all"&&<HomeMaterialOverview/>}
          {filter==="print"&&<div className="vp-advertising" aria-label="Danh mục ấn phẩm quảng cáo"><div className="vp-advertising-intro"><Image unoptimized src={productThemeImage("to-roi")} alt="Mẫu thiết kế tờ rơi và ấn phẩm quảng cáo Tết" width={400} height={300}/><div><h3>Ấn phẩm cho cửa hàng & sự kiện</h3><p>Chọn loại ấn phẩm để chuẩn bị yêu cầu in. Xưởng xác nhận chất liệu, kích thước, số lượng và thời gian trước khi báo giá.</p></div></div><div className="vp-advertising-grid">{advertisingItems.map(item=><article key={item.name}><Icon name={item.icon}/><h3>{item.name}</h3><p>{item.description}</p><button onClick={()=>openQuote(item.name)} aria-label={"Yêu cầu báo giá "+item.name}>Yêu cầu báo giá →</button></article>)}</div></div>}
          {filter!=="all"&&<div className="product-grid" id="grid">{visible.map(item=>{
            const product=featuredProduct(item);
            return <article className="product" key={item.id}>
              <Link prefetch={false} className="art vp-art-link" href={item.href}><Image unoptimized src={featuredImage(item)} alt={item.name+" — ảnh minh họa thiết kế Tết"} width={400} height={300} className="vp-themed-thumbnail"/><span className="ribbon">{item.badge}</span></Link>
              <h3><Link prefetch={false} href={item.href}>{item.name}</Link></h3><p>{item.description}</p>
              <button onClick={()=>openQuote(item.name)} aria-label={"Xem và báo giá "+item.name}>Xem & báo giá →</button>
              <span className="vp-product-source">Chất liệu: {product.name}</span>
            </article>;
          })}</div>}
          {filter!=="print"&&filter!=="all"&&<p className="vp-art-caption">Hình Tết minh họa thiết kế. Xem quy cách, giá tham khảo hoặc gửi yêu cầu để xưởng xác nhận.</p>}
          {filter!=="print"&&filter!=="all"&&<Link prefetch={false} className="vp-inline-link" href="/nganh/tem-nhan-tet">Tư vấn in tem Tết, thời gian nhận hàng và cách chuẩn bị file →</Link>}
        </section>

        <section className="vp-info-section vp-home-tools" id="cong-cu-mien-phi" aria-labelledby="free-tools-title"><div className="vp-section-top"><div><h2 id="free-tools-title">Công cụ miễn phí cho file in</h2><p>Chọn công cụ để bắt đầu. Miễn phí, không cần tài khoản.</p></div><Link className="vp-all-tools" href="/cong-cu-mien-phi">Xem 9 công cụ →</Link></div><div className="vp-home-tool-grid">{["compress","remove-bg","pdf","heic","enhance"].map(id=>freeTools.find(tool=>tool.id===id)!).map(tool=><Link prefetch={false} key={tool.id} className="vp-home-tool" href={"/cong-cu-mien-phi?tool="+tool.id}><ToolPreview tool={tool.id} layoutPreview/><div className="vp-tool-copy"><h3>{tool.name}</h3><p>{tool.description}</p></div><div className="vp-tool-bottom"><span>{tool.group}</span><span className="vp-tool-open">Mở công cụ <span aria-hidden="true">→</span></span></div></Link>)}</div><Link prefetch={false} className="vp-inline-link" href="/blog/chuan-bi-file-in-tem-khong-bi-mo">Kiểm tra kích thước, ảnh, font và đường cắt trước khi gửi in →</Link></section>

        <MaterialCatalog onQuote={openQuote}/>

        <section className="vp-info-section" id="bang-gia" aria-labelledby="pricing-title">
          <div className="vp-section-top"><div><h2 id="pricing-title">{pricing.title}</h2><p>{pricing.subtitle}</p></div><button onClick={()=>openQuote("In tem nhãn theo quy cách")}>{pricing.quoteCtaLabel} →</button></div>
          <p className="vp-notice">{pricing.disclaimer}</p>
          <Link prefetch={false} className="vp-inline-link" href="/blog/gia-in-tem-so-luong-it-phu-thuoc-gi">Giá thay đổi theo kích thước, số mẫu và gia công như thế nào? →</Link>
          <div className="vp-price-grid">{pricing.posters.map((poster,index)=><article className="vp-price-item" key={index}>
            {pricingPosterAssets[index]&&<button data-pricing-poster className="vp-poster" onClick={()=>setModal({kind:"poster",index})} aria-label={"Xem rõ "+poster.title}><Image unoptimized src={pricingPosterAssets[index].src} alt={poster.title} width={pricingPosterAssets[index].width} height={pricingPosterAssets[index].height} loading="lazy"/><span>Xem rõ bảng giá</span></button>}
            <h3>{poster.title}</h3><p>{poster.note}</p><details><summary>Xem giá và điều kiện dạng chữ</summary><ul>{poster.details.map((line,i)=><li key={i}>{line}</li>)}</ul></details>
          </article>)}</div>
          <ul className="vp-benefit-list">{pricing.benefits.map((text,i)=><li key={i}>✓ {text}</li>)}</ul>
        </section>

        <section className="vp-info-section" id="quy-trinh" aria-labelledby="process-title">
          <h2 id="process-title">{process.title}</h2><p>{process.subtitle}</p>
          <ol className="vp-process-grid">{process.steps.map((step,index)=><li key={index}><span>{index+1}</span><h3>{step.title}</h3><p>{step.desc}</p></li>)}</ol>
          <div className="vp-guide-links"><Link prefetch={false} href="/huong-dan/chon-chat-lieu-tem">Chọn chất liệu tem</Link><Link prefetch={false} href="/huong-dan/chon-kich-thuoc-tem">Đo kích thước tem</Link><Link prefetch={false} href="/huong-dan/ky-thuat-in-tem">Đo tem & so sánh cách cắt</Link></div>
        </section>

        <section className="vp-info-section" id="mau-thuc-te" aria-labelledby="gallery-title">
          <div className="vp-section-top"><div><h2 id="gallery-title">Kho mẫu tem tham khảo</h2><p>Tham khảo hình thức, cách bố trí logo và ứng dụng trên bao bì.</p></div><Link prefetch={false} href="/mau-tem-moi">Mẫu tem mới →</Link></div>
          <div className="vp-gallery-grid">{homepageMedia.gallery.map(item=><Link prefetch={false} key={item.id} href={safePublicHref(item.href,"/san-pham")}><Image unoptimized src={safePublicHref(item.src,"/images/hero-products.webp")} alt={item.title} width="320" height="240" loading="lazy"/><span>{item.title}</span></Link>)}</div>
          {homepageMedia.gallery.length===0&&<div className="vp-sample-directory"><Link prefetch={false} href="/nganh/my-pham"><Icon name="tag"/>Mẫu tem mỹ phẩm →</Link><Link prefetch={false} href="/nganh/thuc-pham"><Icon name="box"/>Mẫu tem thực phẩm →</Link><Link prefetch={false} href="/nganh/do-uong"><Icon name="sticker"/>Mẫu tem đồ uống →</Link></div>}
        </section>

        <section className="vp-info-section" id="danh-gia" aria-labelledby="reviews-title">
<div className="vp-section-top"><div><h2 id="reviews-title">{reviews.title}</h2><p>{reviews.ratingValue} · {reviews.ratingCount}</p></div><Link prefetch={false} href={SHOPEE_SHOP_URL} target="_blank" rel="noreferrer">Xem đánh giá tại shop Shopee →</Link></div>
<div className="vp-review-grid">{reviews.items.map((review,index)=><article key={index}><div><Image unoptimized src={CUSTOMER_AVATARS[index % 3]} alt="" width={44} height={44} loading="lazy"/><div><strong>{review.name}</strong><small>{review.platform} · Avatar minh họa</small></div></div><blockquote>{review.text}</blockquote></article>)}</div>
</section>
<section className="vp-info-section vp-quote-callout" id="nhan-bao-gia">
          <div><h2>{finalCta.title}</h2><p>{finalCta.subtitle}</p><p>Chuẩn bị kích thước, số lượng, chất liệu và ngày cần nhận để xưởng xác nhận giá, lịch in và vận chuyển trước khi đặt hàng.</p><div className="vp-customer-proof"><div>{CUSTOMER_AVATARS.map(src=><Image unoptimized key={src} src={src} alt="" width={36} height={36} loading="lazy"/>)}</div><small>{finalCta.trustText} · Avatar minh họa</small></div></div>
          <button className="red" onClick={()=>openQuote("In tem nhãn")}>Chuẩn bị yêu cầu báo giá →</button><Link prefetch={false} className="vp-action" href={zaloUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent("click_zalo",{position:"tet_final_cta"})}>{finalCta.zaloLabel} →</Link>
        </section>



        <section className="vp-info-section vp-faq-contact" aria-label="Hỏi đáp và liên hệ">
          <div id="faq"><h2>{faq.title}</h2>{faq.items.map((item,index)=><details key={index}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
          <div className="vp-contact-card" id="lien-he-xuong">
            <h2>Thông tin xưởng VinPrint</h2><p><Icon name="map"/>{contact.address}</p><p><Icon name="phone"/><Link prefetch={false} href={callUrl} onClick={()=>trackEvent("click_phone",{position:"tet_contact"})}>{contact.phoneDisplay}</Link></p>
            <p>{contact.hoursWeekday}<br/>{contact.hoursWeekend}</p>
            <Link prefetch={false} className="vp-map-link" href={GOOGLE_BUSINESS_PROFILE_URL} target="_blank" rel="noreferrer" onClick={()=>trackEvent("open_google_maps",{position:"tet_contact"})}>Xem bản đồ đường đến xưởng →</Link>
            <button className="vp-map-toggle" aria-expanded={showMap} aria-controls="vinprint-map-panel" onClick={()=>{if(!showMap)trackEvent("load_google_map",{position:"tet_contact"});setShowMap(v=>!v);}}>{showMap?"Ẩn bản đồ":"Xem bản đồ"}</button><div id="vinprint-map-panel" hidden={!showMap} aria-hidden={!showMap}>{showMap&&<iframe src={GOOGLE_BUSINESS_PROFILE_EMBED_URL} title="Địa chỉ xưởng VinPrint trên Google Maps" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>}</div><div className="vp-qr"><Image unoptimized src="/images/zalo-qr.png" alt="Mã QR Zalo VinPrint" width="120" height="120" loading="lazy"/><div><strong>{faq.qrTitle}</strong><p>{faq.qrSubtitle}</p><Link prefetch={false} href={zaloUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent("click_zalo",{position:"tet_contact"})}>{faq.qrCtaLabel} →</Link></div></div>
          </div>
        </section>

        <footer className="vp-footer">
          <div><h2>VinPrint</h2><p>{footer.about}</p></div>
          <nav aria-label="Liên kết pháp lý">{footer.companyLinks.map(item=><Link prefetch={false} key={item.href} href={safePublicHref(item.href)}>{item.label}</Link>)}</nav>
          <nav className="vp-site-links" aria-label="Điều hướng VinPrint">{content.header.menu.map(item=><Link prefetch={false} key={item.href} href={safePublicHref(item.href)}>{item.label}</Link>)}</nav><div className="vp-footer-bottom"><span>{footer.copyright}</span><Link prefetch={false} href="/san-pham">Tất cả sản phẩm</Link><Link prefetch={false} href={callUrl}>{contact.phoneDisplay}</Link></div>
        </footer>
      </main>
    </div>

    <dialog ref={dialogRef} id="dialog" onClose={closeDialog} onClick={e=>{if(e.target===dialogRef.current){const r=dialogRef.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}}}>
      <button id="close" aria-label="Đóng hộp thoại" onClick={closeDialog}><X size={21}/></button>
      {modal?.kind==="quote"&&<div id="dialog-content"><h2>Nhận báo giá in</h2>{!requestText?<><p>Điền quy cách để chuẩn bị yêu cầu gửi VinPrint qua Zalo. Chưa phát sinh đơn hàng hoặc thanh toán.</p>
        <form id="quote-form" onSubmit={prepareQuote}>
          <label htmlFor="quote-product">Sản phẩm cần in</label><select id="quote-product" name="product" defaultValue={selectedProduct}>{Array.from(new Set([selectedProduct,...featuredItems.map(i=>i.name),...advertisingItems.map(i=>i.name),...catalogProducts.map(p=>p.name)])).map(name=><option key={name}>{name}</option>)}</select>
          <div className="vp-form-row"><div><label htmlFor="material">Chất liệu</label><select id="material" name="material"><option>Nhờ xưởng tư vấn</option><option>Decal giấy</option><option>Decal nhựa chống nước</option><option>Decal trong</option><option>Decal ánh kim</option><option>UV DTF</option></select></div><div><label htmlFor="quantity">Số lượng</label><input id="quantity" name="quantity" type="number" min="1" max="1000000" step="1" defaultValue="500" required/></div></div>
          <label htmlFor="size">Kích thước thành phẩm</label><input id="size" name="size" placeholder="Ví dụ: tem tròn 5 cm hoặc 4 × 6 cm" maxLength={80} required/>
          <div className="vp-form-row"><div><label htmlFor="quote-name">Tên liên hệ (không bắt buộc)</label><input id="quote-name" name="name" autoComplete="name" maxLength={80}/></div><div><label htmlFor="quote-phone">Điện thoại (không bắt buộc)</label><input id="quote-phone" name="phone" type="tel" autoComplete="tel" maxLength={20}/></div></div>
          <label htmlFor="deadline">Ngày cần nhận (không bắt buộc)</label><input id="deadline" name="deadline" type="date"/>
          <label htmlFor="quote-note">Nội dung hoặc yêu cầu thêm</label><textarea id="quote-note" name="note" rows={2} maxLength={1200} placeholder="Bề mặt dán, số mẫu, gia công, nhu cầu thiết kế…"/>
          <button className="red" type="submit">Chuẩn bị yêu cầu báo giá →</button>
        </form></>:<><p>Sao chép nội dung rồi mở Zalo để gửi xưởng. File thiết kế được đính kèm trực tiếp trong cuộc trò chuyện.</p><textarea ref={requestRef} className="vp-request-text" rows={10} value={requestText} readOnly aria-label="Nội dung yêu cầu báo giá"/><button className="red" onClick={copyRequest}>{copied?"Đã sao chép yêu cầu":"1. Sao chép yêu cầu"}</button>{copyError&&<p role="status">{copyError}</p>}<Link prefetch={false} className="vp-action vp-zalo-link" href={zaloUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent("click_zalo",{position:"tet_quote"})}>2. Mở Zalo gửi VinPrint →</Link><p className="vp-fine">Yêu cầu chỉ được gửi khi bạn gửi tin nhắn trong Zalo.</p><button onClick={()=>setRequestText("")}>Sửa thông tin</button></>}</div>}
      {modal?.kind==="upload"&&<div id="dialog-content"><h2>Gửi file in cho VinPrint</h2><p>Gửi trực tiếp qua Zalo để xưởng kiểm tra file và xác nhận quy cách trước khi in.</p><ol className="vp-upload-steps"><li>Chuẩn bị file PDF, AI, CDR hoặc ảnh rõ nét; kèm font nếu file cần chỉnh sửa.</li><li>Ghi kích thước, chất liệu, số lượng mỗi mẫu và ngày cần nhận.</li><li>Mở Zalo, đính kèm file và gửi tin nhắn cho VinPrint.</li></ol><Link prefetch={false} className="red vp-action vp-zalo-link" href={zaloUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent("click_zalo",{position:"tet_upload"})}>Mở Zalo gửi file →</Link><Link prefetch={false} className="vp-inline-link" href="/huong-dan/chon-kich-thuoc-tem">Xem hướng dẫn chuẩn bị kích thước</Link><p className="vp-fine">Không có bước tải file lên website trong luồng này.</p></div>}
      {modal?.kind==="order"&&<div id="dialog-content"><h2>Hỗ trợ đơn hàng</h2><p>Gửi mã đơn, tên hoặc số điện thoại đặt hàng qua Zalo để VinPrint kiểm tra và phản hồi tình trạng đơn.</p><Link prefetch={false} className="red vp-action vp-zalo-link" href={zaloUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent("click_zalo",{position:"tet_order"})}>Nhắn Zalo hỗ trợ đơn hàng →</Link><p>Đơn đặt qua Shopee có thể kiểm tra trong mục Đơn mua của ứng dụng Shopee.</p><Link prefetch={false} href={callUrl}>Gọi xưởng: {contact.phoneDisplay}</Link></div>}
      {modal?.kind==="poster"&&<div className="vp-poster-dialog"><h2>{pricing.posters[modal.index]?.title}</h2><Image unoptimized src={pricingPosterAssets[modal.index].src} width={pricingPosterAssets[modal.index].width} height={pricingPosterAssets[modal.index].height} alt={pricing.posters[modal.index]?.title||"Bảng giá VinPrint"}/><p>{pricing.disclaimer}</p></div>}
    </dialog>
  </div>;
}



