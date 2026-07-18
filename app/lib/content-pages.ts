export type ContentSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ContentPageData = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: ContentSection[];
};

export const companyPages: Record<string, ContentPageData> = {
  "gioi-thieu": {
    slug: "gioi-thieu",
    title: "Giới thiệu xưởng in VinPrint tại TP.HCM",
    description: "Thông tin về VinPrint, quy trình làm việc, địa chỉ xưởng và cam kết khi in tem nhãn theo yêu cầu.",
    eyebrow: "Về VinPrint",
    intro: "VinPrint là xưởng in tem nhãn theo yêu cầu tại TP.HCM, tập trung vào quy trình rõ ràng: nhận file, xác nhận quy cách, duyệt mẫu rồi mới in.",
    sections: [
      { heading: "Chúng tôi giải quyết điều gì?", paragraphs: ["Một chiếc tem cần đúng màu, đúng kích thước và phù hợp bề mặt sử dụng. VinPrint tư vấn từ chất liệu đến cách gia công để khách hàng không phải chọn bằng cảm tính."], bullets: ["Nhận số lượng ít để thử mẫu", "Hỗ trợ thiết kế khi chưa có file hoàn chỉnh", "Báo giá theo kích thước, số lượng và kỹ thuật gia công", "Giao hàng toàn quốc"] },
      { heading: "Quy trình minh bạch", paragraphs: ["Mỗi đơn hàng được xác nhận lại nội dung, kích thước, chất liệu, số lượng và thời gian dự kiến. Khách hàng duyệt mẫu trước khi xưởng tiến hành in."], bullets: ["Gửi yêu cầu và file", "Nhận tư vấn, báo giá", "Duyệt nội dung và mẫu", "In, kiểm tra, đóng gói", "Nhận hàng và phản hồi"] },
      { heading: "Thông tin xưởng", paragraphs: ["Địa chỉ: 254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM. Giờ làm việc: 09:00–17:30 từ Thứ 2 đến Thứ 7. Hotline/Zalo: 0844 998 499."] },
    ],
  },
  "lien-he": {
    slug: "lien-he",
    title: "Liên hệ VinPrint — Nhận tư vấn và báo giá in tem",
    description: "Liên hệ xưởng VinPrint qua điện thoại, Zalo hoặc Google Maps để nhận tư vấn chất liệu và báo giá in tem.",
    eyebrow: "Liên hệ xưởng",
    intro: "Để báo giá chính xác, hãy gửi file hoặc hình tham khảo kèm kích thước, số lượng và bề mặt dự kiến dán tem.",
    sections: [
      { heading: "Kênh liên hệ", paragraphs: ["Hotline/Zalo: 0844 998 499. Địa chỉ: 254/5/40 Lê Văn Thọ, Phường Thông Tây Hội, TP.HCM."], bullets: ["Zalo phù hợp để gửi file và hình ảnh", "Điện thoại phù hợp khi cần xác nhận gấp", "Xem đường đi trên Google Maps trước khi đến xưởng"] },
      { heading: "Thông tin cần gửi", paragraphs: ["Báo giá phụ thuộc vào quy cách thực tế. Càng đủ thông tin, thời gian xác nhận càng nhanh."], bullets: ["Kích thước tem", "Số lượng", "Chất liệu mong muốn", "Hình dạng và kỹ thuật cắt", "Yêu cầu cán màng, ép kim hoặc hiệu ứng khác"] },
      { heading: "Thời gian làm việc", paragraphs: ["VinPrint làm việc 09:00–17:30, Thứ 2–Thứ 7; nghỉ Chủ nhật và ngày lễ. Các tin nhắn ngoài giờ sẽ được phản hồi trong ca làm việc tiếp theo."] },
    ],
  },
  "chinh-sach": {
    slug: "chinh-sach",
    title: "Chính sách đặt in, giao nhận và bảo mật",
    description: "Chính sách đặt in, duyệt mẫu, thanh toán, giao nhận và bảo mật file thiết kế tại VinPrint.",
    eyebrow: "Chính sách dịch vụ",
    intro: "Các điều kiện dưới đây giúp hai bên thống nhất quy cách trước khi sản xuất và giảm rủi ro sai lệch.",
    sections: [
      { heading: "Xác nhận đơn hàng", paragraphs: ["Đơn hàng chỉ được đưa vào sản xuất sau khi khách hàng xác nhận nội dung, kích thước, chất liệu, số lượng, giá và thời gian dự kiến."], bullets: ["Màu trên màn hình có thể khác nhẹ so với bản in", "Nội dung do khách duyệt là căn cứ sản xuất", "Thay đổi sau khi đã in có thể phát sinh chi phí"] },
      { heading: "Thanh toán và giao nhận", paragraphs: ["Mức đặt cọc và phương thức thanh toán được xác nhận theo từng đơn. Phí vận chuyển và thời gian giao phụ thuộc địa chỉ, đơn vị vận chuyển và tình trạng thực tế."], bullets: ["Kiểm tra thông tin nhận hàng trước khi gửi", "Quay video khi mở kiện nếu phát hiện hư hỏng", "Liên hệ ngay khi kiện hàng có dấu hiệu bất thường"] },
      { heading: "Bảo mật file", paragraphs: ["VinPrint sử dụng file khách gửi để tư vấn, thiết kế và sản xuất đơn hàng. File không được công khai làm mẫu nếu chưa có sự đồng ý của khách hàng."] },
    ],
  },
  "bao-hanh": {
    slug: "bao-hanh",
    title: "Chính sách kiểm tra và xử lý lỗi in tem",
    description: "Cách VinPrint tiếp nhận, kiểm tra và xử lý khi tem in sai nội dung, quy cách hoặc bị lỗi sản xuất.",
    eyebrow: "Bảo hành & xử lý lỗi",
    intro: "Nếu thành phẩm khác với nội dung đã duyệt hoặc có lỗi sản xuất, hãy liên hệ VinPrint sớm để được kiểm tra và xử lý.",
    sections: [
      { heading: "Trường hợp được kiểm tra", paragraphs: ["VinPrint tiếp nhận phản hồi về sai nội dung so với mẫu đã duyệt, sai số lượng, sai chất liệu đã xác nhận hoặc lỗi thành phẩm phát sinh trong quá trình sản xuất."], bullets: ["Gửi mã đơn hoặc thông tin liên hệ", "Gửi ảnh và video thể hiện lỗi", "Giữ lại sản phẩm và bao bì để đối chiếu"] },
      { heading: "Phương án xử lý", paragraphs: ["Sau khi xác minh nguyên nhân, VinPrint sẽ trao đổi phương án phù hợp như in bù, in lại hoặc hoàn tiền phần hàng bị lỗi. Phương án cụ thể phụ thuộc mức độ và phạm vi ảnh hưởng."] },
      { heading: "Ngoại lệ", paragraphs: ["Sai nội dung đã được khách duyệt, sử dụng tem trên bề mặt không phù hợp hoặc bảo quản sai hướng dẫn không được xem là lỗi sản xuất. Xưởng vẫn hỗ trợ tư vấn phương án khắc phục nếu có thể."] },
    ],
  },
  "case-study": {
    slug: "case-study",
    title: "Case study ứng dụng tem nhãn theo ngành hàng",
    description: "Các tình huống ứng dụng tem nhãn cho mỹ phẩm, thực phẩm và đồ uống, kèm cách chọn chất liệu và quy cách.",
    eyebrow: "Hồ sơ ứng dụng",
    intro: "Các tình huống dưới đây minh họa cách VinPrint phân tích nhu cầu. Số liệu hiệu quả kinh doanh chỉ được công bố khi có xác nhận của khách hàng.",
    sections: [
      { heading: "Mỹ phẩm: chai thường xuyên cầm nắm", paragraphs: ["Bài toán là tem cần chịu ẩm, bám tốt trên chai và giữ chữ nhỏ dễ đọc. Hướng xử lý thường là decal nhựa, cán phù hợp và thử mẫu trên đúng bề mặt chai trước khi in số lượng lớn."], bullets: ["Ưu tiên độ bền và khả năng đọc", "Tránh chi tiết quá nhỏ", "Kiểm tra độ cong của chai"] },
      { heading: "Thực phẩm: bao bì khô", paragraphs: ["Với túi kraft hoặc hộp giấy khô, decal giấy giúp tối ưu chi phí. Thiết kế cần dành chỗ rõ ràng cho tên sản phẩm, khối lượng, ngày sản xuất và thông tin liên hệ."] },
      { heading: "Đồ uống: môi trường lạnh và ẩm", paragraphs: ["Chai hoặc ly lạnh cần tem chống nước và keo phù hợp. Mẫu nên được thử sau khi bề mặt có hơi nước để đánh giá độ bám trong điều kiện sử dụng thật."] },
    ],
  },
};

export const industryPages: Record<string, ContentPageData> = {
  "my-pham": { slug: "my-pham", title: "In tem nhãn mỹ phẩm theo yêu cầu", description: "Tư vấn in tem mỹ phẩm chống ẩm, sắc nét cho chai serum, hũ kem và bao bì chăm sóc cá nhân.", eyebrow: "Theo ngành · Mỹ phẩm", intro: "Tem mỹ phẩm cần cân bằng thẩm mỹ, độ bền và khả năng đọc trên kích thước nhỏ.", sections: [
    { heading: "Chất liệu nên cân nhắc", paragraphs: ["Decal nhựa phù hợp chai lọ có nguy cơ tiếp xúc nước. Decal trong tạo cảm giác tối giản; tem ánh kim phù hợp điểm nhấn cao cấp."], bullets: ["Thử độ bám trên đúng chai", "Ưu tiên mực và lớp cán chịu ẩm", "Giữ cỡ chữ thông tin đủ đọc"] },
    { heading: "Chuẩn bị file", paragraphs: ["Gửi kích thước vùng dán, ảnh chai thật, logo và nội dung bắt buộc. Với chai cong, cần chừa biên hợp lý để hạn chế nhăn hoặc bong mép."] },
  ]},
  "thuc-pham": { slug: "thuc-pham", title: "In tem nhãn thực phẩm và bao bì", description: "In tem thực phẩm cho túi kraft, hộp giấy, hũ và bao bì khô với nội dung rõ, dễ đọc.", eyebrow: "Theo ngành · Thực phẩm", intro: "Tem thực phẩm cần truyền đạt nhanh tên sản phẩm, thành phần, khối lượng và thông tin liên hệ.", sections: [
    { heading: "Chọn theo môi trường", paragraphs: ["Bao bì khô có thể dùng decal giấy để tối ưu chi phí. Sản phẩm bảo quản lạnh hoặc dễ ẩm nên dùng decal nhựa và thử độ bám thực tế."], bullets: ["Bao bì khô: decal giấy", "Tủ lạnh: decal nhựa", "Hũ quà tặng: kraft hoặc ánh kim"] },
    { heading: "Bố cục nội dung", paragraphs: ["Tên sản phẩm và khối lượng nên dễ thấy. Thành phần, hướng dẫn bảo quản và thông tin đơn vị chịu trách nhiệm cần được bố trí đủ khoảng trắng để đọc ở kích thước thật."] },
  ]},
  "do-uong": { slug: "do-uong", title: "In tem nhãn đồ uống chống nước", description: "In tem chống nước cho ly nhựa, chai nước, cà phê và đồ uống bảo quản lạnh.", eyebrow: "Theo ngành · Đồ uống", intro: "Tem đồ uống thường gặp hơi nước, nhiệt độ thấp và ma sát khi vận chuyển.", sections: [
    { heading: "Ưu tiên độ bám", paragraphs: ["Decal nhựa và keo phù hợp giúp tem bám tốt hơn trong môi trường lạnh. Bề mặt chai cần sạch, khô khi dán."], bullets: ["Thử mẫu sau khi làm lạnh", "Bo góc để giảm bong mép", "Tránh dán qua đường gân chai"] },
    { heading: "Thiết kế dễ nhận biết", paragraphs: ["Logo, tên vị và dung tích nên tạo thứ bậc rõ. Màu nền cần đủ tương phản với chữ trong cả điều kiện ánh sáng cửa hàng và giao hàng."] },
  ]},
  "chai-lo": { slug: "chai-lo", title: "In tem dán chai lọ theo kích thước", description: "Tư vấn kích thước, chất liệu và cách thử tem trên chai tròn, chai vuông, hũ thủy tinh và chai nhựa.", eyebrow: "Theo ứng dụng · Chai lọ", intro: "Độ cong, chất liệu bề mặt và vùng cầm nắm quyết định kích thước cũng như loại keo của tem chai lọ.", sections: [
    { heading: "Đo vùng dán", paragraphs: ["Đo chiều rộng và chiều cao của vùng phẳng, không tính phần vai chai hoặc đường gân. Dùng mẫu giấy thử trước khi chốt kích thước."], bullets: ["Chừa khoảng cách giữa hai mép tem", "Kiểm tra khi chai đầy và lạnh", "Bo góc với tem nhỏ"] },
    { heading: "Chọn vật liệu", paragraphs: ["Decal trong giữ cảm giác nhìn xuyên chai. Decal nhựa trắng cho màu in ổn định hơn. UV DTF phù hợp logo nổi trên bề mặt cứng và phẳng tương đối."] },
  ]},
  "handmade": { slug: "handmade", title: "In sticker và tem handmade số lượng ít", description: "In sticker logo, tem cảm ơn và tem bao bì handmade với số lượng linh hoạt, hỗ trợ thiết kế.", eyebrow: "Theo ngành · Handmade", intro: "Shop handmade thường cần nhiều mẫu nhỏ, thay đổi theo mùa và thử số lượng trước khi đặt lớn.", sections: [
    { heading: "Lựa chọn linh hoạt", paragraphs: ["Decal giấy phù hợp bao bì khô và ngân sách thử nghiệm. Decal kraft tạo cảm giác thủ công; sticker cắt bế phù hợp quà tặng và nhận diện thương hiệu."], bullets: ["Gom nhiều mẫu trên một khổ in", "Giữ logo rõ ở kích thước nhỏ", "Dùng mã màu nhất quán"] },
    { heading: "Chuẩn bị để báo giá", paragraphs: ["Gửi số mẫu, kích thước từng mẫu, số lượng và hình dạng cắt. Nếu chưa có file, hãy gửi logo và phong cách mong muốn để được tư vấn."] },
  ]},
};

export const guidePages: Record<string, ContentPageData> = {
  "chon-chat-lieu-tem": { slug: "chon-chat-lieu-tem", title: "Cách chọn chất liệu tem nhãn phù hợp", description: "So sánh tem giấy, tem nhựa, tem trong, tem ánh kim và UV DTF theo môi trường sử dụng.", eyebrow: "Hướng dẫn · Chất liệu", intro: "Không có chất liệu tốt nhất cho mọi sản phẩm; lựa chọn đúng phụ thuộc bề mặt dán, độ ẩm, thời gian sử dụng và ngân sách.", sections: [
    { heading: "Tem giấy", paragraphs: ["Chi phí hợp lý, màu in đẹp, phù hợp hộp giấy và bao bì khô. Không nên dùng ở nơi thường xuyên tiếp xúc nước."], bullets: ["Phù hợp: hộp, túi kraft, tem cảm ơn", "Không phù hợp: chai lạnh, phòng tắm"] },
    { heading: "Tem nhựa và tem trong", paragraphs: ["Bền ẩm hơn tem giấy. Tem nhựa trắng giúp màu ổn định; tem trong giữ lại màu của bao bì phía sau."], bullets: ["Phù hợp: mỹ phẩm, đồ uống, đông lạnh", "Cần thử độ bám trên bề mặt thật"] },
    { heading: "Tem hiệu ứng", paragraphs: ["Tem ánh kim, hologram và UV DTF tạo điểm nhấn mạnh nhưng cần thiết kế tiết chế để giữ khả năng đọc."] },
  ]},
  "chon-kich-thuoc-tem": { slug: "chon-kich-thuoc-tem", title: "Cách đo và chọn kích thước tem nhãn", description: "Hướng dẫn đo vùng dán, thử mẫu giấy và chọn kích thước tem cho chai, hũ, hộp và túi.", eyebrow: "Hướng dẫn · Kích thước", intro: "Kích thước tem nên được kiểm tra trực tiếp trên bao bì thay vì chỉ dựa vào kích thước file thiết kế.", sections: [
    { heading: "Ba bước đo", paragraphs: ["Đo vùng phẳng có thể dán, trừ phần cong hoặc gân. Cắt một mẫu giấy đúng kích thước rồi dán thử. Cuối cùng chụp ảnh gửi xưởng để đối chiếu."], bullets: ["Đo bằng milimet", "Chừa biên an toàn", "Kiểm tra khả năng đọc ở khoảng cách sử dụng"] },
    { heading: "Chai tròn và hũ", paragraphs: ["Không nên để hai mép tem chạm nhau nếu không thiết kế dạng quấn vòng. Tem nhỏ nên bo góc để giảm nguy cơ bong mép."] },
    { heading: "Kích thước file", paragraphs: ["File nên đúng tỷ lệ thành phẩm, có vùng xén và hình ảnh đủ độ phân giải. Chữ quan trọng cần nằm cách đường cắt một khoảng an toàn."] },
  ]},
  "ky-thuat-in-tem": { slug: "ky-thuat-in-tem", title: "Các kỹ thuật in và gia công tem nhãn", description: "Giải thích cán màng, cắt bế, ép kim, hologram và UV DTF để chọn kỹ thuật phù hợp.", eyebrow: "Hướng dẫn · Kỹ thuật in", intro: "Kỹ thuật gia công ảnh hưởng trực tiếp đến độ bền, cảm giác bề mặt và chi phí của tem.", sections: [
    { heading: "Cán màng", paragraphs: ["Lớp cán giúp bảo vệ bề mặt in và thay đổi cảm giác bóng hoặc mờ. Cán không thay thế hoàn toàn việc chọn đúng vật liệu nền."], bullets: ["Màng bóng: màu nổi, dễ lau", "Màng mờ: giảm phản sáng, cảm giác dịu"] },
    { heading: "Cắt bế", paragraphs: ["Cắt bế tạo hình theo đường viền. Góc quá nhọn hoặc chi tiết quá nhỏ có thể khó bóc và dễ bong khi sử dụng."] },
    { heading: "Ép kim, hologram và UV DTF", paragraphs: ["Các hiệu ứng này phù hợp điểm nhấn logo hoặc chi tiết ngắn. Nên xem mẫu vật liệu thật và thử trên bao bì trước khi sản xuất số lượng lớn."] },
  ]},
};
