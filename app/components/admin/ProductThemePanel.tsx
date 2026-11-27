"use client";
import {useState} from "react";
import Image from "next/image";
import {PRODUCT_THEME_KEYS,productThemeImage} from "../../lib/product-theme";
export default function ProductThemePanel({onChanged}:{onChanged:()=>void}){
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  async function apply(action:string){
    if(!window.confirm(action==="theme-tet-2027"?"Đổi ảnh trong ba bộ sưu tập sang bộ Tết 2027? Ảnh hiện tại được sao lưu ở lần áp dụng đầu tiên.":"Khôi phục ba bộ sưu tập về bản sao trước lần đổi bộ Tết đầu tiên? Thay đổi sau đó sẽ được thay bằng bản sao này."))return;
    setBusy(true);setMessage("");const done:string[]=[];
    try{for(const collection of ["hero","hot-products","gallery"]){const r=await fetch(`/api/admin/media-collections?collection=${collection}&action=${action}`,{method:"POST"});if(!r.ok)throw Error();done.push(collection);}setMessage(action==="theme-tet-2027"?"Đã áp dụng bộ Tết cho 3 bộ sưu tập. Tên, liên kết và thứ tự được giữ nguyên.":"Đã khôi phục bản sao của 3 bộ sưu tập.");}
    catch{setMessage(`Đã xử lý ${done.length}/3 bộ sưu tập. Có mục chưa lưu được, anh vui lòng thử lại.`);}
    finally{setBusy(false);onChanged();}
  }
  return <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5" aria-labelledby="theme-images-title"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 id="theme-images-title" className="text-lg font-bold">Bộ ảnh sản phẩm Tết 2027</h2><p className="mt-1 max-w-2xl text-sm text-gray-500">12 mẫu minh họa đồng bộ nền kem, đỏ và vàng. Áp dụng cho hero, sản phẩm hot và thư viện; anh vẫn có thể thay từng ảnh sau đó.</p></div><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void apply("theme-tet-2027")} className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-50">{busy?"Đang xử lý…":"Áp dụng bộ ảnh Tết"}</button><button disabled={busy} onClick={()=>void apply("restore-tet-2027")} className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-semibold disabled:opacity-50">Khôi phục bộ trước</button></div></div><div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 xl:grid-cols-12">{PRODUCT_THEME_KEYS.map(key=><Image key={key} unoptimized src={productThemeImage(key)} alt={key.replaceAll("-"," ")} width={160} height={120} className="aspect-[4/3] w-full rounded-lg object-contain"/>)}</div><p role="status" className="mt-3 text-sm">{message}</p></section>;
}
