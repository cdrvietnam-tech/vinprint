import type { ContentPageData } from "./content-pages";

// Trang theo mùa (Tết, cuối năm). Slug không chứa năm để dùng lại mỗi mùa:
// khi sang mùa mới chỉ cần cập nhật title, description, mốc ngày và updatedAt.
// Không ghi giá, hạn chót nhận đơn hoặc cam kết giao hàng ở đây khi chưa được duyệt.
export const SEASON_UPDATED_AT = "2026-11-27";

export const seasonalPages: Record<string, ContentPageData> = {
  "tem-nhan-tet": {
    slug: "tem-nhan-tet",
    title: "In tem Tết lấy liền tại TP.HCM: tem hộp quà, bánh mứt 2027",
    description: "In tem Tết lấy liền tại TP.HCM cho hộp quà, hũ mứt, bánh kẹo, đặc sản Tết 2027. Nhận số lượng ít, hỗ trợ thiết kế, nhắn Zalo để xưởng xác nhận thời gian.",
    eyebrow: "Theo mùa · Tết 2027",
    intro: "Mùa Tết, cùng một sản phẩm thường cần thêm tem logo, tem thông tin, tem niêm phong và tem chúc Tết. Trang này giúp bạn chọn đúng loại tem cho từng bao bì và chuẩn bị đủ thông tin để xưởng báo giá nhanh.",
    updatedAt: SEASON_UPDATED_AT,
    sections: [
      {
        heading: "Hàng Tết thường cần những loại tem nào?",
        paragraphs: [
          "Một set hàng Tết hiếm khi chỉ có một chiếc tem. Tem mặt trước tạo nhận diện, tem phụ chứa thông tin sản phẩm, tem niêm phong cho người nhận biết hộp chưa bị mở, còn tem chúc Tết làm món quà có không khí lễ.",
          "Liệt kê từng vị trí dán trên bao bì trước khi đặt in giúp gom các mẫu vào cùng một lần in và tránh thiếu tem khi đã vào mùa đóng gói.",
        ],
        bullets: [
          "Tem logo dán hộp quà, túi giấy, túi kraft",
          "Tem thông tin cho hũ mứt, hạt, bánh kẹo",
          "Tem niêm phong nắp hũ, miệng hộp",
          "Tem chúc Tết, tem cảm ơn kèm đơn hàng",
          "Sticker logo nổi UV DTF cho hộp cứng, ly, bình quà tặng",
        ],
      },
      {
        heading: "Chọn chất liệu theo bao bì Tết",
        paragraphs: [
          "Bao bì khô như hộp giấy, túi kraft có thể dùng tem giấy để tối ưu chi phí. Hũ thủy tinh, hũ nhựa bảo quản lạnh hoặc dễ dính dầu, đường nên dùng tem nhựa chống nước và thử độ bám trên đúng bao bì.",
          "Tem vàng ánh kim và tem hologram phù hợp làm điểm nhấn cho logo hoặc tem niêm phong trên hộp quà. Nên dùng tiết chế để chữ thông tin vẫn dễ đọc.",
        ],
        bullets: [
          "Hộp giấy, túi kraft khô: tem giấy",
          "Hũ mứt, hũ hạt, chai lọ để lạnh: tem nhựa chống nước",
          "Hũ thủy tinh muốn nhìn xuyên sản phẩm: tem nhựa trong",
          "Hộp quà cao cấp: tem vàng ánh kim hoặc UV DTF nổi",
        ],
      },
      {
        heading: "In tem Tết lấy liền: cần chuẩn bị gì?",
        paragraphs: [
          "Đơn in tem Tết lấy liền đi nhanh nhất khi file đã sẵn sàng in và quy cách đơn giản: tem giấy hoặc tem nhựa, hình tròn, vuông, chữ nhật, không cần gia công đặc biệt. Tem ánh kim, hologram, UV DTF hoặc đơn cần thiết kế mới sẽ cần thêm thời gian.",
          "Nhắn Zalo kèm file, kích thước và số lượng trước khi qua xưởng tại Số 13, Đường Thạnh Lộc 42, An Phú Đông, TP.HCM. Xưởng xác nhận có nhận lấy liền với quy cách đó hay không và giờ nhận hàng cụ thể trước khi in.",
        ],
        bullets: [
          "File đúng kích thước thành phẩm, hình ảnh đủ nét",
          "Chốt chất liệu: tem giấy hoặc tem nhựa chống nước",
          "Ghi rõ số lượng và giờ cần nhận",
          "Giờ làm việc: 09:00–17:30, Thứ 2–Thứ 7",
        ],
      },
      {
        heading: "Nên đặt in tem Tết từ khi nào?",
        paragraphs: [
          "Mùng 1 Tết Đinh Mùi rơi vào thứ Bảy, ngày 6/2/2027. Tem cần có trước ngày đóng gói, vì vậy hãy tính lùi từ ngày bạn bắt đầu giao hàng Tết rồi cộng thêm thời gian duyệt mẫu, thử tem trên bao bì thật và vận chuyển.",
          "Càng sát Tết, lịch sản xuất và vận chuyển càng kín. Nhắn Zalo cho xưởng kèm quy cách đơn để được xác nhận thời gian cụ thể trước khi chốt.",
        ],
      },
      {
        heading: "Thông tin cần gửi để nhận báo giá",
        paragraphs: [
          "Báo giá phụ thuộc kích thước, số lượng, chất liệu và kỹ thuật gia công. Gửi càng đủ thông tin trong một tin nhắn, xưởng xác nhận càng nhanh.",
        ],
        bullets: [
          "Ảnh bao bì thật và vị trí dán tem",
          "Kích thước từng mẫu tem",
          "Số lượng mỗi mẫu",
          "File thiết kế, hoặc logo và nội dung nếu cần hỗ trợ thiết kế",
          "Ngày bạn cần nhận tem",
        ],
      },
    ],
    faqs: [
      { q: "Có in tem Tết lấy liền trong ngày được không?", a: "Tùy quy cách. Đơn có file sẵn, chất liệu thông dụng và không gia công đặc biệt dễ xử lý nhanh nhất. Hãy nhắn Zalo 0844 998 499 kèm file, kích thước và số lượng để xưởng xác nhận giờ nhận hàng trước khi bạn qua lấy." },
      { q: "Có nhận in tem Tết số lượng ít không?", a: "Có. VinPrint nhận số lượng ít để thử mẫu trước khi đặt nhiều, và có thể gom nhiều mẫu tem trên cùng một khổ in." },
      { q: "Chưa có file thiết kế tem Tết thì làm thế nào?", a: "Gửi logo, nội dung và phong cách mong muốn qua Zalo. Xưởng hỗ trợ thiết kế và gửi mẫu để bạn duyệt trước khi in; điều kiện hỗ trợ thiết kế được xác nhận khi báo giá." },
      { q: "Hũ mứt để tủ lạnh nên dùng tem gì?", a: "Nên dùng tem nhựa chống nước thay cho tem giấy, và thử dán trên đúng hũ sau khi làm lạnh để kiểm tra độ bám trước khi in số lượng lớn." },
      { q: "Giá in tem Tết được tính thế nào?", a: "Giá phụ thuộc kích thước, số lượng, chất liệu và kỹ thuật gia công. Bạn có thể xem bảng giá tham khảo trên trang chủ; giá cuối cùng được xác nhận sau khi xưởng kiểm tra file và quy cách." },
    ],
    related: [
      { label: "Tem bánh mứt, hạt và đặc sản Tết", href: "/nganh/tem-banh-mut-tet" },
      { label: "Sticker logo dán hộp quà Tết", href: "/nganh/sticker-hop-qua-tet" },
      { label: "Tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc" },
      { label: "Tem vàng ánh kim", href: "/san-pham/tem-vang" },
      { label: "Bảng giá tham khảo", href: "/#bang-gia" },
      { label: "Cách chọn chất liệu tem", href: "/huong-dan/chon-chat-lieu-tem" },
    ],
  },
  "tem-banh-mut-tet": {
    slug: "tem-banh-mut-tet",
    title: "In tem nhãn bánh mứt, hạt và đặc sản Tết",
    description: "In tem nhãn cho hũ mứt, hạt dinh dưỡng, bánh kẹo và đặc sản Tết: chọn tem giấy hay tem nhựa, bố cục thông tin dễ đọc, tem niêm phong nắp hũ.",
    eyebrow: "Theo mùa · Thực phẩm Tết",
    intro: "Mứt, hạt và bánh kẹo Tết thường đóng trong hũ, túi zip hoặc hộp giấy. Mỗi loại bao bì cần chất liệu tem và cách bố trí thông tin khác nhau để tem bám tốt và người mua đọc được ngay.",
    updatedAt: SEASON_UPDATED_AT,
    sections: [
      {
        heading: "Chọn tem theo bao bì thực phẩm Tết",
        paragraphs: [
          "Hũ nhựa PET và hũ thủy tinh đựng mứt, hạt thường bị dính đường, dầu hoặc được để tủ lạnh, nên tem nhựa chống nước là lựa chọn an toàn hơn tem giấy. Túi kraft và hộp giấy đựng bánh khô có thể dùng tem giấy để tối ưu chi phí.",
          "Tên gọi túi kraft có thể chỉ màu sắc, nhiều túi có lớp màng ghép bên ngoài. Hãy thử tem trên đúng bao bì đã đóng hàng trước khi in số lượng lớn.",
        ],
        bullets: [
          "Hũ PET, hũ thủy tinh: tem nhựa chống nước",
          "Hũ muốn nhìn thấy sản phẩm: tem nhựa trong",
          "Túi kraft, hộp giấy khô: tem giấy",
          "Nắp hũ, miệng hộp: tem niêm phong tròn hoặc dài",
        ],
      },
      {
        heading: "Bố cục thông tin trên tem thực phẩm",
        paragraphs: [
          "Mặt chính nên trả lời nhanh sản phẩm là gì, vị nào và khối lượng bao nhiêu. Thành phần, ngày sản xuất, hạn sử dụng, hướng dẫn bảo quản và thông tin đơn vị chịu trách nhiệm có thể đặt ở tem phụ phía sau hoặc dưới đáy.",
          "Xưởng in đúng nội dung khách đã duyệt. Chủ sản phẩm cần tự kiểm tra nội dung nhãn theo quy định của thị trường đang bán trước khi gửi in.",
        ],
        bullets: [
          "Tên sản phẩm và vị ở mặt chính",
          "Chừa ô trống nếu ghi ngày sản xuất bằng tay hoặc đóng dấu",
          "Giữ cỡ chữ thông tin đủ đọc ở kích thước thật",
          "Không đặt chữ nhỏ qua đường cong của hũ",
        ],
      },
      {
        heading: "Kích thước tem cho hũ mứt và hũ hạt",
        paragraphs: [
          "Đo vùng phẳng có thể dán trên thân hũ, không tính phần vai và đường gân. Với hũ tròn, không nên để hai mép tem chạm nhau trừ khi thiết kế dạng quấn vòng.",
          "Cắt một mẫu giấy đúng kích thước rồi dán thử lên hũ đã đóng hàng là cách kiểm tra nhanh nhất trước khi chốt.",
        ],
        bullets: [
          "Đo bằng milimet",
          "Bo góc với tem nhỏ để giảm bong mép",
          "Chụp ảnh mẫu dán thử gửi xưởng đối chiếu",
        ],
      },
    ],
    faqs: [
      { q: "Tem giấy có dùng được cho hũ mứt không?", a: "Dùng được nếu hũ khô và không để lạnh. Nếu hũ dễ dính đường, dầu hoặc bảo quản trong tủ lạnh, nên chuyển sang tem nhựa chống nước và thử trên hũ thật." },
      { q: "Có in được nhiều vị trên cùng một đơn không?", a: "Có. Bạn có thể gom nhiều mẫu tem cho các vị khác nhau trên cùng một khổ in; hãy gửi số lượng từng mẫu để xưởng sắp khổ và báo giá." },
      { q: "Xưởng có kiểm tra nội dung nhãn thực phẩm không?", a: "Xưởng hỗ trợ bố cục và quy cách in. Nội dung bắt buộc trên nhãn do chủ sản phẩm chịu trách nhiệm kiểm tra và duyệt trước khi in." },
    ],
    related: [
      { label: "In tem Tết lấy liền tại TP.HCM", href: "/nganh/tem-nhan-tet" },
      { label: "Tem nhãn thực phẩm và bao bì", href: "/nganh/thuc-pham" },
      { label: "Tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc" },
      { label: "Tem nhãn giấy", href: "/san-pham/tem-giay" },
      { label: "Tem phụ sản phẩm", href: "/san-pham/tem-phu-san-pham" },
      { label: "Tem thực phẩm cho túi kraft", href: "/blog/tem-thuc-pham-cho-tui-kraft" },
    ],
  },
  "sticker-hop-qua-tet": {
    slug: "sticker-hop-qua-tet",
    title: "In sticker logo dán hộp quà Tết cho shop và doanh nghiệp",
    description: "In sticker logo, tem niêm phong và tem chúc Tết dán hộp quà, túi giấy, ly bình quà tặng. Tem vàng ánh kim, UV DTF nổi, nhận số lượng ít.",
    eyebrow: "Theo mùa · Quà Tết",
    intro: "Một chiếc sticker logo đúng chất liệu giúp hộp quà có sẵn trở thành quà mang thương hiệu của bạn mà không cần in riêng cả lô hộp.",
    updatedAt: SEASON_UPDATED_AT,
    sections: [
      {
        heading: "Biến hộp quà có sẵn thành quà mang thương hiệu",
        paragraphs: [
          "Shop và doanh nghiệp nhỏ thường mua hộp, túi giấy có sẵn rồi dán logo. Cách này linh hoạt về số lượng: cần bao nhiêu hộp thì dán bấy nhiêu, và đổi mẫu theo từng đợt quà.",
          "Ngoài logo, tem niêm phong miệng hộp và tem chúc Tết in tên người gửi là hai vị trí nhỏ nhưng tạo cảm giác chỉn chu khi người nhận mở quà.",
        ],
        bullets: [
          "Sticker logo mặt hộp, mặt túi giấy",
          "Tem niêm phong miệng hộp",
          "Tem chúc Tết có tên thương hiệu",
          "Logo nổi cho ly, bình giữ nhiệt quà tặng",
        ],
      },
      {
        heading: "Chất liệu tạo cảm giác quà cao cấp",
        paragraphs: [
          "Tem vàng ánh kim làm logo bắt sáng trên hộp màu đỏ, đen hoặc kraft. Tem hologram đổi màu theo góc nhìn, hợp với tem niêm phong. UV DTF cho logo nổi bóng không có nền thừa, dán được trên bề mặt cứng như hộp cứng, thủy tinh, kim loại.",
          "Hiệu ứng ánh kim nên dùng cho logo và chi tiết ngắn. Nên xem mẫu vật liệu thật và thử trên đúng hộp trước khi in số lượng lớn.",
        ],
        bullets: [
          "Hộp giấy mỹ thuật, hộp cứng: tem vàng ánh kim, UV DTF",
          "Túi giấy, túi kraft: tem giấy hoặc tem nhựa",
          "Ly sứ, bình giữ nhiệt, chai thủy tinh: UV DTF nổi",
          "Niêm phong: tem tròn ánh kim hoặc hologram",
        ],
      },
      {
        heading: "Chuẩn bị file và thông tin đặt in",
        paragraphs: [
          "Gửi logo dạng vector nếu có để đường cắt bế và chi tiết nhỏ được sắc nét. Nếu chỉ có ảnh, hãy gửi ảnh rõ nhất; xưởng sẽ kiểm tra và tư vấn kích thước tối thiểu phù hợp.",
          "Mỗi đơn được xác nhận lại nội dung, kích thước, chất liệu, số lượng và thời gian dự kiến; bạn duyệt mẫu trước khi xưởng in.",
        ],
        bullets: [
          "Ảnh hộp hoặc túi và vị trí dán",
          "Kích thước sticker mong muốn",
          "Số lượng hộp quà dự kiến",
          "Ngày bắt đầu đóng quà",
        ],
      },
    ],
    faqs: [
      { q: "UV DTF dán được trên hộp giấy không?", a: "UV DTF phù hợp bề mặt cứng và tương đối phẳng như hộp cứng, thủy tinh, kim loại, gỗ. Với hộp giấy mềm hoặc bề mặt sần, nên thử mẫu trước hoặc chọn tem ánh kim." },
      { q: "Doanh nghiệp cần vài chục hộp quà có đặt in được không?", a: "Được. VinPrint nhận số lượng ít; hãy gửi kích thước và số lượng để xưởng tư vấn cách sắp khổ in phù hợp." },
      { q: "Có in tên từng đối tác lên tem chúc Tết được không?", a: "Hãy gửi danh sách tên và mẫu thiết kế qua Zalo để xưởng kiểm tra khả năng in nhiều nội dung khác nhau và báo giá theo quy cách thực tế." },
    ],
    related: [
      { label: "In tem Tết lấy liền tại TP.HCM", href: "/nganh/tem-nhan-tet" },
      { label: "Tem UV DTF nổi", href: "/san-pham/tem-uv-dtf" },
      { label: "Tem vàng ánh kim", href: "/san-pham/tem-vang" },
      { label: "Tem hologram 7 màu", href: "/san-pham/tem-7-mau" },
      { label: "Tem bạc hay tem vàng ánh kim?", href: "/blog/tem-bac-hay-tem-vang-anh-kim" },
      { label: "Tem UV DTF là gì?", href: "/blog/tem-uv-dtf-la-gi" },
    ],
  },
};
