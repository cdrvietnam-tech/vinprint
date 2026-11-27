import type { ManagedMediaItem, MediaCollectionId } from "./media-collections";

export const PRODUCT_THEME_KEYS = ["tem-uv-dtf","tem-giay","tem-nhua-chong-nuoc","tem-nhua-trong","tem-bac","tem-vang","tem-7-mau","tem-bao-hanh","tem-phu-san-pham","sticker-trang-tri","tem-kraft","to-roi"] as const;
export type ProductThemeKey = typeof PRODUCT_THEME_KEYS[number];
export function productThemeImage(key:ProductThemeKey){return "/images/tet-2027/products/"+key+".webp";}
const legacy:Record<string,ProductThemeKey> = {
  "/images/products/tem-uv-dtf.webp":"tem-uv-dtf",
  "/images/products/tem-giay.webp":"tem-giay",
  "/images/products/tem-nhua-chong-nuoc.webp":"tem-nhua-chong-nuoc",
  "/images/products/tem-nhua-trong.webp":"tem-nhua-trong",
  "/images/products/tem-bac.webp":"tem-bac",
  "/images/products/tem-ep-kim.webp":"tem-vang",
  "/images/holographic_sticker.webp":"tem-7-mau",
  "/images/products/tem-bao-hanh.webp":"tem-bao-hanh",
  "/images/products/tem-phu-san-pham.webp":"tem-phu-san-pham",
  "/images/products/sticker-trang-tri.webp":"sticker-trang-tri",
  "/images/mockups/cosmetic_bottle.webp":"tem-nhua-trong",
  "/images/mockups/zip_pouch.webp":"tem-kraft",
  "/images/mockups/glass_jar.webp":"tem-vang",
  "/images/mockups/kraft_box.webp":"tem-giay",
  "/images/mockups/plastic_cup.webp":"tem-nhua-chong-nuoc",
  "/images/mockups/paper_box.webp":"tem-phu-san-pham",
  "/images/hot-products/tra-sua-kim-hieu.png":"tem-nhua-chong-nuoc",
  "/images/hot-products/hu-my-pham-thy-kieu.png":"tem-nhua-trong",
  "/images/hot-products/mat-ong-mina.png":"tem-vang",
};
export const LEGACY_PRODUCT_THUMBNAILS=Object.keys(legacy);
const galleryFallback:ProductThemeKey[]=["tem-nhua-trong","tem-kraft","tem-vang","tem-giay","tem-nhua-chong-nuoc","tem-phu-san-pham","tem-7-mau","tem-uv-dtf","tem-giay","tem-vang","sticker-trang-tri","tem-giay"];
function normalized(text:string){return text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase();}
export function themeForMedia(item:ManagedMediaItem,collection:MediaCollectionId,index=0):ProductThemeKey{
  const text=normalized(item.title+" "+item.category);
  if(/to roi|flyer/.test(text))return "to-roi";
  if(/uv.?dtf/.test(text))return "tem-uv-dtf";
  if(/hologra|7 mau/.test(text))return "tem-7-mau";
  if(/xi bac|tem bac|anh bac/.test(text))return "tem-bac";
  if(/ep kim|xi vang|tem vang|mat ong|anh kim/.test(text))return "tem-vang";
  if(/bao hanh|niem phong/.test(text))return "tem-bao-hanh";
  if(/tem phu|thong tin san pham/.test(text))return "tem-phu-san-pham";
  if(/kraft|tra gung|tui tra/.test(text))return "tem-kraft";
  if(/nhua trong|tem trong|my pham|serum/.test(text))return "tem-nhua-trong";
  if(/chong nuoc|do uong|dan ly|tem nhua|tra sua/.test(text))return "tem-nhua-chong-nuoc";
  if(/sticker/.test(text))return "sticker-trang-tri";
  const known=legacy[item.src.split("?")[0]];
  if(known)return known;
  const slug=item.href.match(/^\/san-pham\/([^/?#]+)/)?.[1];
  if(slug&&PRODUCT_THEME_KEYS.includes(slug as ProductThemeKey))return slug as ProductThemeKey;
  return collection==="gallery"?galleryFallback[index%galleryFallback.length]:"tem-giay";
}
// Explicit migration only: a later admin upload must remain editable, never remapped on every GET.
export function applyTetProductImages(collection:MediaCollectionId,items:ManagedMediaItem[]):ManagedMediaItem[]{
  if(collection==="ai247")return items.map(item=>({...item}));
  return items.map((item,index)=>{
    const image=productThemeImage(themeForMedia(item,collection,index));
    if(item.kind==="video")return {...item,poster:image};
    if(item.src.startsWith("/images/tet-2027/products/"))return {...item};
    return {...item,kind:"image",src:image};
  });
}
export function isThemedProductImage(src:string){return src.startsWith("/images/tet-2027/products/");}
