import type { Product } from "./products";

export type ProductFaq = {
  q: string;
  a: string;
};

const specificFaqs: Record<string, [ProductFaq, ProductFaq]> = {
  "tem-uv-dtf": [
    {
      q: "Tem UV DTF nên dán trên bề mặt nào?",
      a: "UV DTF phù hợp bề mặt cứng, sạch và tương đối phẳng như thủy tinh, kim loại, nhựa cứng hoặc gốm. Nên thử trước trên bề mặt phủ chống dính, có dầu hoặc cong nhiều.",
    },
    {
      q: "Dán UV DTF lên chai cong có bị nhăn không?",
      a: "Độ cong lớn làm lớp chuyển khó ôm đều và có thể tạo nếp. Cần gửi ảnh chai, kích thước vùng dán và ưu tiên mẫu nhỏ để xưởng kiểm tra trước.",
    },
  ],
  "tem-giay": [
    {
      q: "Tem giấy phù hợp với loại bao bì nào?",
      a: "Tem giấy phù hợp hộp giấy, túi kraft và bao bì khô. Nếu sản phẩm thường xuyên gặp nước, hơi lạnh hoặc độ ẩm cao, nên cân nhắc tem nhựa.",
    },
    {
      q: "Tem giấy có cần cán màng không?",
      a: "Cán màng giúp bề mặt hạn chế trầy và chịu ẩm nhẹ tốt hơn, nhưng không biến tem giấy thành tem chống nước hoàn toàn. Xưởng sẽ tư vấn theo điều kiện sử dụng.",
    },
  ],
  "tem-nhua-chong-nuoc": [
    {
      q: "Tem nhựa có dùng được cho chai để lạnh không?",
      a: "Tem nhựa phù hợp hơn tem giấy trong môi trường ẩm và lạnh. Độ bám thực tế vẫn phụ thuộc loại keo, vật liệu chai và việc bề mặt có khô sạch khi dán hay không.",
    },
    {
      q: "Nên thử tem nhựa như thế nào trước khi in nhiều?",
      a: "Nên dán mẫu lên đúng chai hoặc hộp, để trong điều kiện bảo quản thực tế rồi kiểm tra mép tem, độ bám và khả năng đọc trước khi chốt số lượng lớn.",
    },
  ],
  "tem-nhua-trong": [
    {
      q: "Khi nào nên chọn tem nhựa trong?",
      a: "Tem trong phù hợp khi muốn nhìn thấy màu hoặc chất liệu chai phía sau và tạo cảm giác tối giản. Bề mặt chai cần sạch để hạn chế lộ bọt khí hoặc bụi.",
    },
    {
      q: "Tem trong dán chai tối màu có cần mực trắng không?",
      a: "Có thể cần lớp mực trắng lót để chữ và màu in đủ rõ trên chai tối hoặc chất lỏng có màu. Vùng trắng lót cần được xác định ngay trên file.",
    },
  ],
  "tem-bac": [
    {
      q: "Màu in trên tem bạc có giống trên giấy trắng không?",
      a: "Không hoàn toàn. Nền bạc phản sáng làm màu nhìn khác so với nền trắng, vì vậy file cần xác định vùng giữ ánh kim và vùng cần che nền.",
    },
    {
      q: "Tem bạc thường dùng cho sản phẩm nào?",
      a: "Tem bạc thường được cân nhắc cho nhãn thông số, thiết bị, mỹ phẩm hoặc logo cần cảm giác kim loại. Cần thử độ tương phản của chữ nhỏ trước khi in.",
    },
  ],
  "tem-vang": [
    {
      q: "Tem vàng phù hợp làm toàn bộ nhãn hay chỉ làm điểm nhấn?",
      a: "Có thể dùng cả hai, nhưng dùng ánh vàng có chọn lọc thường giúp logo và chi tiết chính dễ đọc hơn. Lượng vùng ánh kim nên được xác định theo thiết kế thật.",
    },
    {
      q: "File tem vàng cần chuẩn bị khác gì tem thường?",
      a: "Cần tách rõ vùng muốn giữ hiệu ứng vàng, vùng in màu và vùng chữ. Xưởng kiểm tra lớp màu, nét nhỏ và độ tương phản trước khi chốt.",
    },
  ],
  "tem-7-mau": [
    {
      q: "Hiệu ứng hologram 7 màu thay đổi như thế nào?",
      a: "Màu sắc thay đổi theo góc nhìn và nguồn sáng. Ảnh trên màn hình chỉ mô phỏng; nên xem mẫu vật liệu nếu hiệu ứng là yếu tố quyết định.",
    },
    {
      q: "Chữ nhỏ có dễ đọc trên tem 7 màu không?",
      a: "Nền chuyển sắc có thể làm chữ mảnh khó đọc. Nội dung quan trọng nên dùng nét đủ lớn, tương phản rõ và chừa khoảng trống hợp lý.",
    },
  ],
  "tem-bao-hanh": [
    {
      q: "Nên chọn tem vỡ hay tem dai để bảo hành?",
      a: "Tem vỡ phù hợp mục đích phát hiện tháo gỡ; tem dai phù hợp khi cần độ bền cao hơn. Lựa chọn phụ thuộc bề mặt dán và cách kiểm soát bảo hành.",
    },
    {
      q: "Tem bảo hành có in số hoặc đánh dấu tháng không?",
      a: "Có thể bố trí số seri, ô tháng/năm hoặc nội dung riêng nếu quy cách cho phép. Cần gửi mẫu quản lý dự kiến để xưởng kiểm tra kích thước chữ.",
    },
  ],
  "tem-phu-san-pham": [
    {
      q: "Ai chịu trách nhiệm kiểm tra nội dung tem phụ?",
      a: "Đơn vị kinh doanh chịu trách nhiệm xác nhận nội dung theo hồ sơ sản phẩm và quy định áp dụng. VinPrint in theo nội dung đã được khách hàng duyệt.",
    },
    {
      q: "Làm sao để chữ trên tem phụ nhỏ mà vẫn dễ đọc?",
      a: "Cần ưu tiên thứ bậc thông tin, cỡ chữ phù hợp, độ tương phản và khoảng cách dòng. Nên kiểm tra bản in ở kích thước thật trước khi duyệt.",
    },
  ],
  "sticker-trang-tri": [
    {
      q: "Sticker bế rời và bế demi khác nhau thế nào?",
      a: "Bế rời cắt tách từng sticker; bế demi chỉ cắt lớp decal và giữ lại đế chung. Cách đóng gói, phát tặng và sử dụng sẽ quyết định phương án phù hợp.",
    },
    {
      q: "Có thể gom nhiều mẫu sticker trên cùng một tờ không?",
      a: "Có thể nếu kích thước, khoảng cách đường bế và tổng số lượng phù hợp khổ in. Gửi toàn bộ mẫu để xưởng sắp xếp và tính phương án.",
    },
  ],
};

export function getProductFaqs(product: Product): ProductFaq[] {
  const productSpecific = specificFaqs[product.slug] || [
    {
      q: `${product.name} phù hợp dán trên bề mặt nào?`,
      a: `${product.description} Các ứng dụng thường gặp gồm ${product.uses.slice(0, 3).join(", ")}.`,
    },
    {
      q: `Cần lưu ý gì trước khi in ${product.name.toLocaleLowerCase("vi-VN")}?`,
      a: "Nên xác nhận bề mặt dán, môi trường sử dụng và yêu cầu gia công trước khi duyệt file in.",
    },
  ];

  return [
    productSpecific[0],
    {
      q: `Giá in ${product.name.toLocaleLowerCase("vi-VN")} được tính như thế nào?`,
      a: "Giá phụ thuộc kích thước, số lượng, chất liệu, hình dáng bế và yêu cầu gia công. VinPrint có báo giá lẻ và báo giá sỉ cho nhu cầu số lượng lớn.",
    },
    {
      q: `Cần gửi gì để báo giá ${product.name.toLocaleLowerCase("vi-VN")}?`,
      a: `Chỉ cần tên, số điện thoại, vật liệu, kích thước thành phẩm và số lượng dự kiến. Với ${product.uses.slice(0, 2).join(" hoặc ").toLocaleLowerCase("vi-VN")}, xưởng có thể hỏi thêm bề mặt sử dụng trước khi chốt sản xuất.`,
    },
    productSpecific[1],
  ];
}
