export const productOrderUpdatedAt = "2026-11-28";
export type OrderContext = { related: string[]; checks: { label: string; text: string }[] };
export const productOrderContext: Record<string, OrderContext> = {
  "tem-giay": { related:["tem-nhua-chong-nuoc","tem-phu-san-pham","sticker-trang-tri"],checks:[
    {label:"Bao bì khô",text:"Gửi ảnh hộp hoặc túi thật; nói rõ nếu túi kraft có lớp phủ hoặc cán màng."},
    {label:"Quy cách tem",text:"Ghi ngang × cao hoặc đường kính, số mẫu và số lượng từng mẫu; cho biết muốn giữ trên tờ hay cắt rời."},
    {label:"Nội dung cần đọc",text:"Kiểm tra logo, chữ nhỏ và mã QR ở kích thước thật trước khi duyệt."},
  ]},
  "tem-nhua-chong-nuoc": { related:["tem-nhua-trong","tem-giay","tem-phu-san-pham"],checks:[
    {label:"Môi trường dùng",text:"Nêu sản phẩm có gặp hơi nước, lạnh, dầu hoặc thường xuyên lau chùi; không chỉ ghi yêu cầu chống nước."},
    {label:"Bề mặt dán",text:"Gửi ảnh chai, hũ hoặc ly cùng kích thước vùng dán; đánh dấu đường gân và phần cong."},
    {label:"Thử mẫu",text:"Trao đổi việc thử độ bám trên bao bì thật và điều kiện sử dụng trước khi đặt nhiều."},
  ]},
  "tem-nhua-trong": { related:["tem-nhua-chong-nuoc","tem-uv-dtf","tem-phu-san-pham"],checks:[
    {label:"Màu bao bì",text:"Chụp chai và sản phẩm bên trong dưới ánh sáng thường để trao đổi độ tương phản của chữ."},
    {label:"Nền thiết kế",text:"Đánh dấu phần cần trong suốt và phần cần hiện màu; trao đổi với xưởng nếu thiết kế cần lớp trắng."},
    {label:"Vị trí dán",text:"Gửi kích thước vùng dán và mặt trước/mặt sau; kiểm tra chữ trên đúng màu chai thật."},
  ]},
  "tem-uv-dtf": { related:["tem-nhua-trong","tem-vang","sticker-trang-tri"],checks:[
    {label:"Vật cần dán",text:"Gửi ảnh ly, chai hoặc vật cứng; cho biết bề mặt phẳng, cong hay sần để kiểm tra phương án."},
    {label:"Chi tiết logo",text:"Gửi file rõ nét, kích thước từng hình và số lượng; đánh dấu nét mảnh hoặc chữ rất nhỏ cần kiểm tra."},
    {label:"Cách sử dụng",text:"Nêu điều kiện cầm nắm, lau rửa và vị trí dán; trao đổi thử mẫu trước khi in số lượng lớn."},
  ]},
  "tem-bac": { related:["tem-vang","tem-7-mau","tem-phu-san-pham"],checks:[
    {label:"Thông số",text:"Gửi nội dung và kích thước thật của tem thiết bị hoặc nhãn logo; kiểm tra chữ nhỏ và ký hiệu."},
    {label:"Hiệu ứng bạc",text:"Đánh dấu vùng muốn giữ ánh kim và vùng in màu; xem mẫu vật liệu để đánh giá độ đọc."},
    {label:"Bề mặt thiết bị",text:"Gửi ảnh vùng dán và điều kiện sử dụng để xưởng tư vấn; không suy ra khả năng chịu nhiệt từ màu bạc."},
  ]},
  "tem-vang": { related:["tem-bac","tem-7-mau","tem-giay"],checks:[
    {label:"Bao bì",text:"Gửi ảnh hộp quà, chai hoặc hũ để đối chiếu tông màu và diện tích tem."},
    {label:"Vùng ánh kim",text:"Đánh dấu phần nền hoặc logo cần giữ hiệu ứng vàng; màu trên vật liệu cần xem mẫu thật."},
    {label:"Khả năng đọc",text:"Giữ nội dung rõ ở kích thước thành phẩm, nhất là chữ nhỏ trên nền phản sáng."},
  ]},
  "tem-7-mau": { related:["tem-bac","tem-vang","sticker-trang-tri"],checks:[
    {label:"Thiết kế",text:"Gửi logo và kích thước để cân đối vùng đổi sắc với nội dung cần đọc."},
    {label:"Mẫu vật liệu",text:"Xem hiệu ứng ở nhiều góc sáng; không đánh giá màu cuối chỉ bằng một ảnh trên màn hình."},
    {label:"Mục đích dùng",text:"Nêu nhu cầu trang trí hay nhận diện; hiệu ứng hologram tự nó không chứng minh khả năng chống giả."},
  ]},
  "tem-bao-hanh": { related:["tem-phu-san-pham","tem-bac","tem-7-mau"],checks:[
    {label:"Vị trí niêm phong",text:"Chụp khe mở hoặc vị trí tem bắc qua; đo kích thước có thể dán mà không che thông tin cần thiết."},
    {label:"Nội dung tem",text:"Gửi logo, ô ngày tháng, mã hoặc thông tin cần in; thử đọc ở kích thước thật."},
    {label:"Vật liệu",text:"Nêu yêu cầu kiểm tra khi bóc tem để xưởng tư vấn vật liệu; không mặc định mọi tem bảo hành đều có cùng cơ chế."},
  ]},
  "tem-phu-san-pham": { related:["tem-giay","tem-nhua-chong-nuoc","tem-nhua-trong"],checks:[
    {label:"Nội dung đã duyệt",text:"Gửi bản chữ có thể đối chiếu và nội dung cuối do chủ sản phẩm kiểm tra; xưởng hỗ trợ bố cục in."},
    {label:"Từng phiên bản",text:"Tách số lượng theo ngôn ngữ, dung tích hoặc mẫu sản phẩm để tránh nhầm nội dung giữa các nhãn."},
    {label:"Kích thước và độ bền",text:"Gửi ảnh bao bì, vùng dán và môi trường khô/ẩm để cân đối cỡ chữ với chất liệu."},
  ]},
  "sticker-trang-tri": { related:["tem-giay","tem-nhua-chong-nuoc","tem-uv-dtf"],checks:[
    {label:"Bộ hình",text:"Gửi từng mẫu, kích thước và số lượng tương ứng; cho biết cần chia bộ hay gom chung trên tờ."},
    {label:"Đường cắt",text:"Trao đổi viền trắng, bế demi hoặc cắt rời; đánh dấu những chi tiết nhỏ cần kiểm tra trước khi cắt."},
    {label:"Vị trí sử dụng",text:"Cho biết sticker dùng trên bao bì khô hay vật dễ gặp nước để tư vấn giấy hoặc nhựa phù hợp."},
  ]},
};
