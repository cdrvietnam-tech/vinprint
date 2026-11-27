// Nội dung tư vấn cho từng trang sản phẩm: cách chọn, lưu ý và câu hỏi thường gặp.
// Chỉ ghi điều xưởng đã công bố ở nơi khác trên web. Không ghi giá, thời gian giao
// hay cam kết mới ở đây; giá nằm trong app/lib/products.ts.
export type ProductGuide = {
  paragraphs: string[];
  chooseWhen: string[];
  watchOut: string[];
  faqs: { q: string; a: string }[];
  /** Slug bài trong /blog; bài chưa xuất bản sẽ tự bị bỏ qua. */
  posts: string[];
  /** Trang ngành hoặc hướng dẫn liên quan. */
  links: { label: string; href: string }[];
};

const quoteAnswer = "Giá phụ thuộc kích thước, số lượng, chất liệu và kỹ thuật gia công. Gửi file hoặc ảnh tham khảo kèm kích thước và số lượng qua Zalo 0844 998 499 để xưởng báo giá theo quy cách thật.";

export const productGuides: Record<string, ProductGuide> = {
  "tem-uv-dtf": {
    paragraphs: [
      "Tem UV DTF là lớp mực UV nổi được chuyển từ màng lên bề mặt sản phẩm. Sau khi dán và bóc màng, chỉ còn lại phần hình và chữ, không có nền decal bao quanh, nên logo trông như được in trực tiếp lên vật.",
      "Loại tem này hợp với bề mặt cứng và tương đối phẳng. Trước khi đặt số lượng lớn, nên dán thử một mẫu trên đúng sản phẩm để kiểm tra độ bám và cảm giác nổi.",
    ],
    chooseWhen: ["Cần logo nổi, bóng, không viền nền", "Dán lên ly sứ, bình giữ nhiệt, chai thủy tinh, kim loại, hộp cứng", "Làm quà tặng có logo với số lượng linh hoạt"],
    watchOut: ["Bề mặt mềm, sần hoặc cong gắt cần thử mẫu trước", "Chi tiết quá mảnh và chữ quá nhỏ dễ khó bóc", "Lau sạch bụi và dầu trên bề mặt trước khi dán"],
    faqs: [
      { q: "Tem UV DTF khác decal thường ở điểm nào?", a: "Decal thường có lớp nền giấy hoặc nhựa mang hình in. UV DTF chỉ để lại phần mực nổi trên bề mặt, không có nền thừa quanh logo." },
      { q: "UV DTF dán được trên những bề mặt nào?", a: "Phù hợp bề mặt cứng như gốm sứ, thủy tinh, kim loại, gỗ, hộp cứng. Với bề mặt mềm hoặc sần, hãy thử một mẫu trước." },
      { q: "Giá tem UV DTF tính thế nào?", a: "Tem UV DTF được tính theo khổ in hoặc theo mét; bảng giá tham khảo có trên trang chủ. " + quoteAnswer },
    ],
    posts: ["tem-uv-dtf-la-gi", "tem-uv-dtf-ten-ca-nhan-hoa", "tem-nhan-nen-thom"],
    links: [{ label: "Sticker logo dán hộp quà Tết", href: "/nganh/sticker-hop-qua-tet" }, { label: "Các kỹ thuật in và gia công tem", href: "/huong-dan/ky-thuat-in-tem" }],
  },
  "tem-giay": {
    paragraphs: [
      "Tem giấy là lựa chọn tiết kiệm cho bao bì khô: hộp giấy, túi kraft, tem cảm ơn, tem niêm phong hộp. Giấy lên màu đẹp và dễ in số lượng ít để thử mẫu.",
      "Tem giấy không dành cho nơi thường xuyên gặp nước. Nếu sản phẩm để tủ lạnh, dễ dính dầu hoặc được cầm bằng tay ướt, nên chuyển sang tem nhựa chống nước.",
    ],
    chooseWhen: ["Bao bì khô: hộp bánh, túi kraft, hộp giấy", "Cần tối ưu chi phí hoặc in thử nhiều mẫu", "Tem cảm ơn, tem logo kèm đơn hàng"],
    watchOut: ["Không dùng cho chai lạnh, phòng tắm, đồ đông lạnh", "Túi kraft ghép màng cần thử độ bám trên túi thật", "Nền kraft làm màu in trông khác so với nền trắng"],
    faqs: [
      { q: "Tem giấy có chống nước không?", a: "Không. Tem giấy phù hợp bao bì khô; với môi trường ẩm hoặc lạnh nên dùng tem nhựa chống nước." },
      { q: "Có in tem giấy số lượng ít được không?", a: "Có. VinPrint nhận số lượng ít để thử mẫu và có thể gom nhiều mẫu trên cùng một khổ in." },
      { q: "Giá tem giấy tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-giay-va-tem-nhua-nen-chon-loai-nao", "tem-thuc-pham-cho-tui-kraft", "tem-cam-on-cho-shop-online", "tem-hop-mang-di"],
    links: [{ label: "Tem nhãn thực phẩm và bao bì", href: "/nganh/thuc-pham" }, { label: "Tem bánh mứt, hạt và đặc sản Tết", href: "/nganh/tem-banh-mut-tet" }],
  },
  "tem-nhua-chong-nuoc": {
    paragraphs: [
      "Tem nhựa chống nước dùng nền nhựa thay cho giấy nên bền ẩm hơn và giữ màu lâu hơn. Đây là lựa chọn an toàn cho mỹ phẩm, đồ uống, thực phẩm bảo quản lạnh và sản phẩm thường xuyên được cầm nắm.",
      "Độ bám còn phụ thuộc bề mặt và điều kiện sử dụng. Với chai lạnh có đọng sương, hãy thử dán sau khi làm lạnh để đánh giá đúng thực tế.",
    ],
    chooseWhen: ["Chai lọ mỹ phẩm, hũ kem, chai serum", "Ly và chai đồ uống, hũ để tủ lạnh", "Sản phẩm dễ dính nước, dầu hoặc hay lau chùi"],
    watchOut: ["Bề mặt phải sạch và khô khi dán", "Bo góc tem nhỏ để giảm bong mép", "Tránh dán qua đường gân hoặc vai chai"],
    faqs: [
      { q: "Tem nhựa chống nước khác tem giấy thế nào?", a: "Tem nhựa bền ẩm hơn và duy trì màu lâu hơn tem giấy, phù hợp nơi tiếp xúc nước hoặc lạnh. Tem giấy tiết kiệm hơn cho bao bì khô." },
      { q: "Dán lên chai để tủ lạnh có bong không?", a: "Tem nhựa và keo phù hợp bám tốt hơn trong môi trường lạnh, nhưng nên thử mẫu trên đúng chai sau khi làm lạnh trước khi in nhiều." },
      { q: "Giá tem nhựa chống nước tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-chong-nuoc-cho-my-pham-va-do-uong", "tem-ly-ca-phe-chong-nuoc", "thu-tem-trong-moi-truong-lanh", "tem-cho-hu-kem"],
    links: [{ label: "Tem nhãn đồ uống chống nước", href: "/nganh/do-uong" }, { label: "Tem nhãn mỹ phẩm", href: "/nganh/my-pham" }],
  },
  "tem-nhua-trong": {
    paragraphs: [
      "Tem nhựa trong có nền trong suốt, giữ lại màu và chất liệu của chai lọ phía sau. Thiết kế trông tối giản như in thẳng lên bao bì, hợp với chai serum, hũ thủy tinh và ly nhựa trong.",
      "Vì nền trong, màu in sẽ bị ảnh hưởng bởi màu sản phẩm bên trong. Chữ nhạt màu trên nền chai sáng có thể khó đọc, nên cần xem mẫu trên đúng chai.",
    ],
    chooseWhen: ["Chai lọ trong suốt muốn nhìn xuyên sản phẩm", "Thiết kế tối giản, ít mảng màu", "Muốn nhãn hòa vào bao bì"],
    watchOut: ["Kiểm tra độ tương phản giữa chữ và màu sản phẩm", "Bụi và bọt khí dưới tem trong dễ thấy hơn", "Nên thử trên chai đã chứa sản phẩm"],
    faqs: [
      { q: "Tem trong có chống nước không?", a: "Tem nhựa trong bền ẩm hơn tem giấy. Hãy thử trên đúng bề mặt và điều kiện sử dụng trước khi in số lượng lớn." },
      { q: "In chữ trắng trên tem trong được không?", a: "Hãy gửi file và ảnh chai qua Zalo để xưởng kiểm tra phương án in phù hợp với thiết kế và màu sản phẩm." },
      { q: "Giá tem nhựa trong tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-nhua-trong-cho-chai", "tem-chai-serum", "tem-truoc-tem-sau-cho-chai-lo"],
    links: [{ label: "Tem dán chai lọ theo kích thước", href: "/nganh/chai-lo" }, { label: "Cách chọn chất liệu tem", href: "/huong-dan/chon-chat-lieu-tem" }],
  },
  "tem-bac": {
    paragraphs: [
      "Tem bạc ánh kim có bề mặt phản sáng như kim loại, thường dùng cho nhãn thông số, tem máy móc, thiết bị điện tử và logo cần cảm giác kỹ thuật, bền chắc.",
      "Bề mặt ánh kim làm màu in trông khác so với nền trắng. Nên dùng cho logo và nội dung ngắn, giữ độ tương phản cao để chữ dễ đọc.",
    ],
    chooseWhen: ["Nhãn thông số, tem thiết bị", "Logo cần hiệu ứng kim loại", "Bao bì tông lạnh, hiện đại"],
    watchOut: ["Chữ nhỏ trên nền phản sáng khó đọc hơn", "Xem mẫu vật liệu thật trước khi chốt màu", "Hiệu ứng nên dùng tiết chế"],
    faqs: [
      { q: "Nên chọn tem bạc hay tem vàng?", a: "Tem bạc hợp tông lạnh và sản phẩm kỹ thuật; tem vàng hợp quà tặng, mỹ phẩm và bao bì tông ấm. Xem bài so sánh trong phần bài viết liên quan." },
      { q: "Tem bạc có in màu lên được không?", a: "Hãy gửi file qua Zalo để xưởng tư vấn; màu in trên nền ánh kim sẽ khác so với trên nền trắng nên cần xem mẫu." },
      { q: "Giá tem bạc tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-bac-hay-tem-vang-anh-kim", "can-bong-va-can-mo-cho-tem"],
    links: [{ label: "Các kỹ thuật in và gia công tem", href: "/huong-dan/ky-thuat-in-tem" }, { label: "Tem vàng ánh kim", href: "/san-pham/tem-vang" }],
  },
  "tem-vang": {
    paragraphs: [
      "Tem vàng ánh kim bắt sáng và tạo cảm giác sang trọng cho hộp quà, mỹ phẩm, nến thơm mà không cần in lại toàn bộ bao bì. Chỉ một chiếc tem logo cũng đủ đổi diện mạo của hộp có sẵn.",
      "Hiệu ứng vàng mạnh nên hợp nhất với logo, viền và chi tiết ngắn. Thông tin dài nên đặt ở tem phụ để dễ đọc.",
    ],
    chooseWhen: ["Hộp quà, túi giấy quà tặng", "Mỹ phẩm, nến thơm, sản phẩm cao cấp", "Tem niêm phong, tem logo điểm nhấn"],
    watchOut: ["Nền vàng làm màu in thay đổi, cần xem mẫu", "Tránh chữ quá nhỏ trên nền ánh kim", "Thử trên đúng hộp trước khi in nhiều"],
    faqs: [
      { q: "Tem vàng ánh kim hợp với bao bì màu gì?", a: "Tem vàng nổi bật trên nền đỏ, đen, xanh đậm hoặc kraft. Nên xem mẫu vật liệu thật trên đúng bao bì." },
      { q: "Có dùng tem vàng cho hộp quà Tết số lượng ít được không?", a: "Được. VinPrint nhận số lượng ít; gửi kích thước và số lượng để xưởng tư vấn cách sắp khổ in." },
      { q: "Giá tem vàng tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-bac-hay-tem-vang-anh-kim", "tem-nhan-trung-thu-hop-qua", "tem-logo-cho-tui-giay"],
    links: [{ label: "Sticker logo dán hộp quà Tết", href: "/nganh/sticker-hop-qua-tet" }, { label: "In tem Tết lấy liền tại TP.HCM", href: "/nganh/tem-nhan-tet" }],
  },
  "tem-7-mau": {
    paragraphs: [
      "Tem hologram 7 màu đổi sắc theo góc nhìn. Hiệu ứng này khó bỏ qua nên thường dùng làm tem niêm phong, tem phiên bản giới hạn hoặc điểm nhấn nhận diện.",
      "Bề mặt chuyển sắc làm nội dung in khó đọc hơn nền trơn. Nên giữ thiết kế đơn giản: logo, một dòng chữ lớn, độ tương phản cao.",
    ],
    chooseWhen: ["Tem niêm phong hộp, nắp hũ", "Sản phẩm cần hiệu ứng thị giác mạnh", "Phụ kiện, mỹ phẩm, bản giới hạn"],
    watchOut: ["Không phù hợp nội dung dài, chữ nhỏ", "Xem mẫu vật liệu thật vì ảnh chụp không thể hiện hết hiệu ứng", "Dùng làm điểm nhấn thay vì phủ toàn bộ nhãn"],
    faqs: [
      { q: "Tem hologram có phải tem chống hàng giả không?", a: "Tem hologram 7 màu tại đây là tem in trên vật liệu chuyển sắc để tạo hiệu ứng và dấu hiệu nhận diện. Nếu cần giải pháp chống giả chuyên biệt, hãy trao đổi yêu cầu cụ thể với xưởng." },
      { q: "In logo màu lên tem hologram được không?", a: "Gửi file qua Zalo để xưởng tư vấn; màu in trên nền chuyển sắc sẽ khác nền trắng nên cần xem mẫu trước." },
      { q: "Giá tem hologram tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-hologram-7-mau", "tem-bac-hay-tem-vang-anh-kim"],
    links: [{ label: "Các kỹ thuật in và gia công tem", href: "/huong-dan/ky-thuat-in-tem" }, { label: "Tem bảo hành", href: "/san-pham/tem-bao-hanh" }],
  },
  "tem-bao-hanh": {
    paragraphs: [
      "Tem bảo hành giúp cửa hàng kiểm soát thời hạn bảo hành và tình trạng sản phẩm. Tùy nhu cầu có thể chọn tem vỡ, tem dai hoặc tem đánh dấu thời gian, in logo và thông tin riêng của shop.",
      "Nên chốt trước vị trí dán, kích thước tối thiểu để đọc được thông tin và cách ghi ngày tháng, vì tem bảo hành thường rất nhỏ.",
    ],
    chooseWhen: ["Điện tử, linh kiện, thiết bị", "Niêm phong hộp và vị trí ốc vít", "Cần tem có logo và số điện thoại shop"],
    watchOut: ["Tem nhỏ cần chữ đủ lớn để đọc", "Bề mặt dán phải sạch, khô và phẳng", "Xác nhận loại tem phù hợp mục đích trước khi in"],
    faqs: [
      { q: "Tem bảo hành in logo riêng được không?", a: "Được. Tem được thiết kế theo nhận diện riêng của shop; gửi logo và nội dung để xưởng tư vấn bố cục." },
      { q: "Nên chọn kích thước tem bảo hành thế nào?", a: "Đo vị trí dán trên sản phẩm rồi gửi kích thước và ảnh cho xưởng. Tem càng nhỏ càng cần giản lược nội dung." },
      { q: "Giá tem bảo hành tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-qr-cho-shop", "cach-chon-kich-thuoc-tem-nhan"],
    links: [{ label: "Cách đo và chọn kích thước tem", href: "/huong-dan/chon-kich-thuoc-tem" }, { label: "Tem hologram 7 màu", href: "/san-pham/tem-7-mau" }],
  },
  "tem-phu-san-pham": {
    paragraphs: [
      "Tem phụ bổ sung thông tin cho sản phẩm: thành phần, công dụng, hướng dẫn sử dụng, đơn vị chịu trách nhiệm, xuất xứ. Đây là loại tem nhiều chữ, cỡ nhỏ, nên bố cục và khả năng đọc quan trọng hơn hiệu ứng.",
      "Xưởng in đúng nội dung khách đã duyệt. Chủ sản phẩm cần tự kiểm tra nội dung nhãn theo quy định của thị trường đang bán trước khi gửi in.",
    ],
    chooseWhen: ["Hàng nhập khẩu cần nhãn phụ tiếng Việt", "Mỹ phẩm, thực phẩm, đồ gia dụng", "Cần thêm thông tin mà không in lại bao bì"],
    watchOut: ["Giữ cỡ chữ đủ đọc ở kích thước thật", "Chọn tem nhựa nếu sản phẩm gặp ẩm hoặc lạnh", "Kiểm tra kỹ chính tả và số liệu trước khi duyệt"],
    faqs: [
      { q: "Tem phụ nên dùng giấy hay nhựa?", a: "Bao bì khô có thể dùng tem giấy để tối ưu chi phí. Sản phẩm gặp nước, dầu hoặc bảo quản lạnh nên dùng tem nhựa chống nước." },
      { q: "Xưởng có soạn nội dung nhãn phụ không?", a: "Xưởng hỗ trợ bố cục và quy cách in. Nội dung bắt buộc trên nhãn do chủ sản phẩm chịu trách nhiệm kiểm tra và duyệt." },
      { q: "Giá tem phụ tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-truoc-tem-sau-cho-chai-lo", "loi-thiet-ke-tem-nhan", "tem-nhieu-vi-san-pham"],
    links: [{ label: "Tem nhãn mỹ phẩm", href: "/nganh/my-pham" }, { label: "Tem nhãn thực phẩm và bao bì", href: "/nganh/thuc-pham" }],
  },
  "sticker-trang-tri": {
    paragraphs: [
      "Sticker trang trí được cắt bế theo đường viền hình: logo, nhân vật, chữ. Shop thường dùng làm quà kèm đơn, sticker thương hiệu hoặc bộ sưu tập theo mùa.",
      "Đường cắt nên đơn giản. Góc quá nhọn và chi tiết quá nhỏ dễ khó bóc và nhanh bong khi sử dụng.",
    ],
    chooseWhen: ["Sticker logo, sticker tặng kèm đơn hàng", "Dán laptop, bình nước, nón bảo hiểm", "Bộ sticker theo chủ đề hoặc theo mùa"],
    watchOut: ["Chọn tem nhựa nếu dán nơi gặp nước hoặc ngoài trời", "Chừa viền an toàn quanh hình để cắt bế", "Gửi file đủ nét, đúng kích thước thành phẩm"],
    faqs: [
      { q: "Sticker cắt theo hình bất kỳ được không?", a: "Sticker được cắt bế theo đường viền của mẫu. Nên tránh góc quá nhọn và chi tiết quá nhỏ để dễ bóc và bền hơn." },
      { q: "In nhiều mẫu sticker trong một đơn được không?", a: "Được. Có thể gom nhiều mẫu trên cùng một khổ in; gửi số mẫu, kích thước và số lượng từng mẫu để xưởng báo giá." },
      { q: "Giá sticker tính thế nào?", a: quoteAnswer },
    ],
    posts: ["tem-cam-on-cho-shop-online", "chuan-bi-file-in-tem-khong-bi-mo", "tem-logo-cho-tui-giay"],
    links: [{ label: "Sticker và tem handmade số lượng ít", href: "/nganh/handmade" }, { label: "Sticker logo dán hộp quà Tết", href: "/nganh/sticker-hop-qua-tet" }],
  },
};
