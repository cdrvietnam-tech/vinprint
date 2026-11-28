"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect,useState} from "react";
import {DEFAULT_MEDIA_COLLECTIONS,type ManagedMediaItem} from "../../lib/media-collections";
import {safePublicHref} from "../../lib/storefront";
export default function ManagedSampleGallery(){
 const [items,setItems]=useState<ManagedMediaItem[]>(DEFAULT_MEDIA_COLLECTIONS.gallery);
 useEffect(()=>{const controller=new AbortController();fetch("/api/media/collections?collection=gallery",{signal:controller.signal,cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("unavailable");return r.json() as Promise<{items:ManagedMediaItem[]}>;}).then(data=>{if(Array.isArray(data.items))setItems(data.items.filter(item=>item&&item.kind!=="video"&&typeof item.src==="string"));}).catch(()=>{});return ()=>controller.abort();},[]);
 const seen=new Set<string>();const unique=items.filter(item=>{const key=item.src.split(/[?#]/)[0];if(seen.has(key))return false;seen.add(key);return true;});
 return <section className="vp-managed-samples" aria-labelledby="managed-samples-title"><h2 id="managed-samples-title">Mẫu tem theo ứng dụng</h2><p>Tham khảo hình thức và cách bố trí tem trên bao bì. Ảnh bộ Tết là minh họa AI; mẫu in được xác nhận theo yêu cầu của anh chị.</p>{unique.length?<div className="vp-managed-sample-grid">{unique.map(item=><article key={item.id}><Link href={safePublicHref(item.href,"/san-pham")}><Image unoptimized src={safePublicHref(item.src,"/images/hero-products.webp")} alt={item.title} width={640} height={480}/><div><h3>{item.title}</h3><span>Xem loại tem phù hợp →</span></div></Link></article>)}</div>:<p>Thư viện đang được cập nhật. <Link href="/san-pham">Xem các loại tem VinPrint →</Link></p>}</section>;
}
