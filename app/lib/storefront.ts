import { productBySlug, products } from "./products";

export type StorefrontFilter = "all" | "label" | "sticker" | "metal" | "water" | "pack" | "tet";
export type FeaturedItem = {
  id: string; name: string; description: string; badge: string;
  categories: StorefrontFilter[]; productSlug: string; href: string;
  crop: [number, number, number, number];
};
export const featuredItems: FeaturedItem[] = [
  { id:"tem-tet", name:"Tem nhãn Tết", description:"Tem dán hũ mứt, quà Tết, thực phẩm.", badge:"MÙA TẾT", categories:["label","tet"], productSlug:"tem-giay", href:"/nganh/tem-nhan-tet", crop:[254,637,234,147] },
  { id:"sticker-tet", name:"Sticker trang trí Tết", description:"Decal sticker, cắt bế theo hình.", badge:"CẮT THEO MẪU", categories:["sticker","tet"], productSlug:"sticker-trang-tri", href:"/san-pham/sticker-trang-tri", crop:[513,637,232,147] },
  { id:"anh-kim", name:"Tem decal ánh kim", description:"Hiệu ứng kim loại cho nhãn quà Tết.", badge:"ÁNH KIM", categories:["label","metal","tet"], productSlug:"tem-vang", href:"/san-pham/tem-vang", crop:[772,637,226,147] },
  { id:"chong-nuoc", name:"Tem nhãn chống nước", description:"Nhãn dán chai lọ, hũ mứt và đồ uống.", badge:"CHỐNG NƯỚC", categories:["label","water","tet"], productSlug:"tem-nhua-chong-nuoc", href:"/san-pham/tem-nhua-chong-nuoc", crop:[1021,637,225,147] },
  { id:"tui-qua", name:"Tem dán túi quà Tết", description:"Tem logo và niêm phong cho túi quà.", badge:"THEO YÊU CẦU", categories:["pack","tet"], productSlug:"tem-giay", href:"/nganh/sticker-hop-qua-tet", crop:[1273,637,227,147] },
  { id:"hop-qua", name:"Tem dán hộp quà Tết", description:"Sticker thương hiệu cho hộp quà.", badge:"THƯƠNG HIỆU", categories:["pack","tet"], productSlug:"tem-giay", href:"/nganh/sticker-hop-qua-tet", crop:[1529,637,229,147] },
];
export const storefrontFilters: Array<{id:StorefrontFilter;label:string;icon:string}> = [
  {id:"all",label:"Tất cả sản phẩm",icon:"grid"},
  {id:"label",label:"Tem nhãn",icon:"tag"},
  {id:"sticker",label:"Decal sticker",icon:"sticker"},
  {id:"water",label:"Chống nước",icon:"file"},
  {id:"pack",label:"Tem bao bì",icon:"bag"},
  {id:"tet",label:"Mẫu Tết",icon:"flower"},
];
export function filterFeatured(filter: StorefrontFilter) {
  return featuredItems.filter(item=>filter==="all" || item.categories.includes(filter));
}
export function featuredProduct(item: FeaturedItem) { return productBySlug[item.productSlug]; }
export const catalogProducts = products;
export function safePublicHref(value:string, fallback="/lien-he") {
  return /^(?:\/(?!\/)|#|https:\/\/|tel:)/i.test(value) ? value : fallback;
}
export type QuoteValues = {product:string;material:string;size:string;quantity:string;name:string;phone:string;deadline:string;note:string};
export function buildQuoteMessage(values:QuoteValues) {
  return [
    "Chào VinPrint, tôi muốn nhận báo giá in:",
    "Sản phẩm: " + values.product.trim(),
    "Chất liệu: " + values.material.trim(),
    "Kích thước: " + values.size.trim(),
    "Số lượng: " + values.quantity.trim(),
    values.name.trim() ? "Tên: " + values.name.trim() : "",
    values.phone.trim() ? "Điện thoại: " + values.phone.trim() : "",
    values.deadline ? "Ngày cần nhận: " + values.deadline : "",
    values.note.trim() ? "Ghi chú: " + values.note.trim() : "",
    "Vui lòng xác nhận giá và thời gian trước khi in.",
  ].filter(Boolean).join("\n");
}
export const pricingPosterAssets = [
  {src:"/images/pricing/bang-gia-tem-nhan-tong-hop.webp",width:1122,height:1402},
  {src:"/images/pricing/bang-gia-tem-nhan-tham-khao.webp",width:1122,height:1402},
  {src:"/images/pricing/bang-gia-tem-tron.webp",width:1122,height:1402},
  {src:"/images/pricing/bang-gia-sticker-uv-dtf.webp",width:1024,height:1536},
];
