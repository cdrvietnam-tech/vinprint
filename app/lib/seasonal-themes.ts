import {DEFAULT_TET_HOME, type TetHomeContent} from "./tet-home";

export const SEASON_IDS = ["tet", "everyday", "noel", "march8", "october20", "november20"] as const;
export type SeasonId = typeof SEASON_IDS[number];
export type ThemePresentation = {home: TetHomeContent; banner: string};
export type SeasonalThemes = {activeId: SeasonId; presets: Record<SeasonId, ThemePresentation>};
export const SEASON_CATALOG: {id: SeasonId; name: string; occasion: string; accent: string; dark: string; light: string; title: string; subtitle: string}[] = [
  {id:"tet",name:"Tết sum vầy",occasion:"Tết Nguyên đán",accent:"#bd0011",dark:"#850011",light:"#fff1ed",title:"In ấn chuẩn Tết",subtitle:"Giữ nguyên giao diện Tết anh đã duyệt."},
  {id:"everyday",name:"VinPrint thường ngày",occasion:"Dùng quanh năm",accent:"#075985",dark:"#083344",light:"#eaf5fa",title:"Tem đẹp cho từng sản phẩm",subtitle:"Tem nhãn, decal và bao bì đồng bộ nhận diện. Chọn chất liệu phù hợp với sản phẩm của bạn."},
  {id:"noel",name:"Giáng sinh an lành",occasion:"Noel · 24–25/12",accent:"#13634b",dark:"#073c31",light:"#edf6ef",title:"Gói trọn mùa Giáng sinh",subtitle:"Tem nhãn, thiệp và bao bì quà tặng Giáng sinh. Chuẩn bị diện mạo mới cho mùa lễ hội."},
  {id:"march8",name:"Rạng rỡ tháng Ba",occasion:"Quốc tế Phụ nữ · 8/3",accent:"#a52660",dark:"#651c41",light:"#fff0f5",title:"Gửi lời thương qua từng món quà",subtitle:"Tem nhãn, thiệp và bao bì cho ngày 8/3. Thêm dấu ấn tinh tế cho sản phẩm và quà tặng."},
  {id:"october20",name:"Tôn vinh nét đẹp Việt",occasion:"Phụ nữ Việt Nam · 20/10",accent:"#8d3566",dark:"#50243f",light:"#fbf0f5",title:"Trao yêu thương, nâng niu nét đẹp",subtitle:"Đồng bộ tem nhãn và hộp quà cho ngày 20/10. Chuẩn bị lời chúc và nhận diện theo thương hiệu của bạn."},
  {id:"november20",name:"Tri ân người gieo chữ",occasion:"Nhà giáo Việt Nam · 20/11",accent:"#83501a",dark:"#49321e",light:"#fbf3e6",title:"Gửi trọn lời tri ân",subtitle:"Thiệp, tem nhãn và bao bì quà tặng ngày 20/11. Chăm chút từng chi tiết cho món quà tri ân thầy cô."},
];
export function isSeasonId(value: unknown): value is SeasonId {return typeof value === "string" && SEASON_IDS.includes(value as SeasonId);}
export function defaultSeasonalThemes(): SeasonalThemes {
  const presets = Object.fromEntries(SEASON_CATALOG.map(t => [t.id, {banner:"", home: t.id === "tet" ? structuredClone(DEFAULT_TET_HOME) : {...structuredClone(DEFAULT_TET_HOME), titleLine1:t.title, titleLine2:"Nâng tầm thương hiệu", subtitle:t.subtitle, secondaryCta:{label:"Chọn mẫu tem phù hợp",href:"#san-pham-tet"}}}])) as Record<SeasonId,ThemePresentation>;
  return {activeId:"tet",presets};
}
export function seasonalArtwork(id: SeasonId, box: string, reference = false) {
  if(id === "tet" || box === "18 0 178 77")return reference ? "/images/tet-2027/reference-products.webp" : "/images/tet-2027/artwork.webp";
  return `/images/themes/${id}.svg`;
}
export function validThemeBanner(value: string) {return !value || (/^\/images\/[a-zA-Z0-9/_ .%-]+\.(webp|png|jpe?g|svg)$/i.test(value) || /^\/media\/[a-zA-Z0-9/_ .%-]+$/i.test(value)) && !value.includes("..");}

export function croppedSeasonalArtwork(id:SeasonId,box:string){
 const names:Record<string,string>={"18 0 178 77":"logo","223 0 230 70":"peach","0 746 222 137":"gift","244 90 1516 335":"hero"};
 if((id!=="tet"&&box!=="18 0 178 77")||!names[box])return null;
 const [x,y,width,height]=box.split(" ").map(Number);
 return {src:"/images/tet-2027/crops/"+names[box]+".webp",x,y,width,height};
}
