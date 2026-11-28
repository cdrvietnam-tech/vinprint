export const freeTools = [
  {id:"compress",name:"Nén ảnh",description:"Giảm dung lượng ảnh, giữ tỷ lệ và nền trong suốt.",group:"Chuẩn bị file",icon:"archive",local:true},
  {id:"heic",name:"HEIC sang JPG",description:"Đổi ảnh iPhone sang định dạng dễ gửi và in.",group:"Chuẩn bị file",icon:"phone",local:true},
  {id:"pdf",name:"PDF sang PNG",description:"Xuất trang PDF thành ảnh, chọn độ phân giải in.",group:"Chuẩn bị file",icon:"file",local:true},
  {id:"remove-bg",name:"Tách nền sản phẩm",description:"Giữ chủ thể, tải ảnh PNG có nền trong suốt.",group:"Chỉnh ảnh",icon:"cut",local:false},
  {id:"white-bg",name:"Đổi nền trắng",description:"Ảnh sản phẩm nền trắng cho gian hàng và catalog.",group:"Chỉnh ảnh",icon:"image",local:false},
  {id:"enhance",name:"Làm nét ảnh thường",description:"Làm rõ ảnh bằng chế độ tiêu chuẩn miễn phí.",group:"Chỉnh ảnh",icon:"sparkles",local:false},
  {id:"erase",name:"Xóa vật thể, xóa chữ",description:"Tô vùng chi tiết thừa để xóa khỏi ảnh.",group:"Chỉnh ảnh",icon:"eraser",local:false},
  {id:"album",name:"Tải album sản phẩm",description:"Lấy ảnh từ liên kết sản phẩm trên sàn thương mại.",group:"Bán hàng",icon:"images",local:false},
  {id:"video",name:"Tải video",description:"Lưu video công khai từ liên kết được hỗ trợ.",group:"Bán hàng",icon:"video",local:false},
  {id:"pts",name:"PTS online",description:"Mở PSD, chỉnh ảnh theo lớp và tải PNG hoặc PSD.",group:"Thiết kế & bản vẽ",icon:"image",local:true},
  {id:"cdr",name:"Đọc file CDR",description:"Xem bản vẽ Corel, chọn trang và đối chiếu ảnh gốc.",group:"Thiết kế & bản vẽ",icon:"file",local:false},
] as const;
export type FreeToolId=typeof freeTools[number]["id"];
export type FreeTool=typeof freeTools[number];
export type FreeAsset={url:string;name:string;type:"image"|"video"|"audio"};
export const IMAGE_LIMIT=12*1024*1024;
export function downloadFileName(name:string,mime:string){
 const ext:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","image/avif":"avif","video/mp4":"mp4","video/webm":"webm","audio/mpeg":"mp3"};
 return ext[mime]?name.replace(/\.[a-z0-9]+$/i,"")+"."+ext[mime]:name;
}
export function validateImageFile(file:{type:string;size:number}){
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))return "Chọn ảnh JPG, PNG hoặc WebP.";
 return !file.size||file.size>IMAGE_LIMIT?"Chọn ảnh có dung lượng từ 1 byte đến 12 MB.":"";
}
