import type { ContentSection } from "./content-pages";

export const materialComparison: ContentSection = {
  heading: "Bảng so sánh chất liệu tem theo cách sử dụng",
  paragraphs: ["Bao bì khô thường có thể dùng tem giấy; chai có hơi nước nên cân nhắc tem nhựa và thử độ bám; logo nổi trên bề mặt cứng có thể chọn UV DTF. Hãy chọn theo điều kiện dùng thực tế trước khi chọn hiệu ứng trang trí."],
  table: {
    caption: "Chọn tem theo bao bì, môi trường và điểm cần kiểm tra",
    columns: ["Loại tem", "Nhu cầu phù hợp", "Cần kiểm tra trước khi in"],
    rows: [
      ["Decal giấy", "Hộp bánh, túi kraft và bao bì khô; ưu tiên chi phí", "Độ bám trên túi phủ màng; tránh nước và hơi ẩm kéo dài"],
      ["Decal nhựa chống nước", "Chai mỹ phẩm, đồ uống có nguy cơ ẩm", "Keo, độ cong và độ bám sau khi làm lạnh; không suy ra khả năng chịu đông sâu"],
      ["Decal nhựa trong", "Giữ màu chai hoặc nhìn thấy sản phẩm bên trong", "Độ tương phản chữ/logo trên màu bao bì thật; trao đổi lớp trắng nếu cần"],
      ["Tem vàng, bạc và hologram", "Logo, hộp quà và chi tiết tạo điểm nhấn", "Độ phản sáng, độ dễ đọc và màu thiết kế trên mẫu vật liệu"],
      ["UV DTF nổi", "Logo không viền nền trên ly, chai và bề mặt cứng phù hợp", "Bề mặt sạch, độ cong và khả năng bóc chuyển chi tiết nhỏ; thử mẫu trước"],
    ],
  },
  links: [
    {href:"/san-pham/tem-giay",label:"Xem tem giấy"},
    {href:"/san-pham/tem-nhua-chong-nuoc",label:"Xem tem nhựa chống nước"},
    {href:"/san-pham/tem-nhua-trong",label:"Xem tem nhựa trong"},
    {href:"/san-pham/tem-uv-dtf",label:"Xem tem UV DTF"},
  ],
};

export const materialTrial: ContentSection = {
  heading: "Thử mẫu trên bao bì thật như thế nào?",
  paragraphs: ["Vật liệu nền và keo là hai yếu tố khác nhau. Một tem chịu nước vẫn có thể bong nếu bề mặt nhiều dầu, có gân hoặc độ cong không phù hợp. Không nên xem cụm từ chống nước là cam kết dùng được trong mọi môi trường."],
  bullets: ["Gửi ảnh bao bì và mô tả môi trường: khô, ẩm, lạnh hay thường xuyên lau chùi.", "Đánh dấu vùng dán; tránh vai chai và đường gân nếu chưa thử mẫu.", "Lau sạch, để bề mặt khô rồi dán mẫu theo hướng dẫn của xưởng.", "Kiểm tra mép tem, chữ và màu sau điều kiện sử dụng dự kiến; trao đổi kết quả trước khi in nhiều."],
  links: [{href:"/huong-dan/chon-kich-thuoc-tem",label:"Đo vùng dán và thử mẫu giấy"},{href:"/nganh/do-uong",label:"Tem cho chai và ly đồ uống"}],
};

export const cutComparison: ContentSection = {
  heading: "Bế demi và cắt rời khác nhau ở đâu?",
  paragraphs: ["Bế demi cắt lớp tem, giữ lớp đế để bóc từng nhãn. Cắt rời tạo từng miếng riêng, thuận tiện phát kèm đơn hoặc chia bộ. Hình dạng và cách giao thành phẩm cần được xác nhận trong yêu cầu báo giá."],
  bullets: ["Dán nhiều tem liên tiếp: trao đổi phương án giữ tem trên tờ hoặc cuộn.", "Phát sticker riêng: trao đổi cách cắt và phần đế để bóc dễ.", "Đường bế nên tách biệt với nội dung; góc nhọn hoặc nét quá nhỏ cần xưởng kiểm tra.", "Gửi mẫu bao bì và cách bóc/dán dự kiến; không chỉ chọn theo hình ảnh thiết kế."],
  links: [{href:"/san-pham/sticker-trang-tri",label:"Sticker cắt theo hình"},{href:"/blog/chuan-bi-file-in-tem-khong-bi-mo",label:"Checklist chuẩn bị file in"}],
};
