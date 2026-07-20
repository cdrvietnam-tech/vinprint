export const blogCategories = [
  { slug: "tat-ca", label: "Tất cả" },
  { slug: "chat-lieu", label: "Chọn chất liệu" },
  { slug: "thiet-ke", label: "Thiết kế tem" },
  { slug: "theo-nganh", label: "Theo ngành" },
  { slug: "ky-thuat-in", label: "Kỹ thuật in" },
] as const;

export type BlogCategorySlug = Exclude<(typeof blogCategories)[number]["slug"], "tat-ca">;

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategorySlug;
  image: string;
  imageAlt: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
};

export type BlogArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type BlogArticleDetails = {
  directAnswer: string;
  sections: BlogArticleSection[];
  relatedProductSlugs: string[];
  sources: { title: string; href: string; note: string }[];
};

export type BlogArticle = BlogPost & BlogArticleDetails;

export const blogPosts: BlogPost[] = [
  {
    slug: "tem-giay-va-tem-nhua-nen-chon-loai-nao",
    title: "Tem giấy và tem nhựa: nên chọn loại nào?",
    description: "So sánh theo môi trường sử dụng, độ bền, bề mặt dán và ngân sách để chọn đúng vật liệu ngay từ đầu.",
    category: "chat-lieu",
    image: "/images/products/tem-giay.webp",
    imageAlt: "Tem giấy và tem nhựa dùng trên bao bì sản phẩm",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 5,
  },
  {
    slug: "tem-uv-dtf-la-gi",
    title: "Tem UV DTF là gì? Phù hợp với sản phẩm nào?",
    description: "Hiểu cấu tạo, ưu điểm, giới hạn và các bề mặt phù hợp trước khi chọn tem UV DTF cho logo thương hiệu.",
    category: "ky-thuat-in",
    image: "/images/products/tem-uv-dtf.webp",
    imageAlt: "Tem UV DTF nổi trên chai lọ và vật dụng",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 6,
  },
  {
    slug: "cach-chon-kich-thuoc-tem-nhan",
    title: "Cách chọn kích thước tem nhãn chuẩn",
    description: "Quy trình đo vùng dán, thử mẫu giấy và kiểm tra khả năng đọc trên chai, hũ, hộp và túi.",
    category: "thiet-ke",
    image: "/images/mockups/glass_jar.webp",
    imageAlt: "Đo kích thước tem nhãn trên hũ thủy tinh",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 5,
  },
  {
    slug: "chuan-bi-file-in-tem-khong-bi-mo",
    title: "Chuẩn bị file in tem thế nào để không bị mờ?",
    description: "Checklist về kích thước thật, độ phân giải, font chữ, hệ màu, vùng xén và đường cắt trước khi gửi xưởng.",
    category: "ky-thuat-in",
    image: "/images/ai-design/milk-tea-ai.webp",
    imageAlt: "File thiết kế tem nhãn sắc nét trước khi in",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 7,
  },
  {
    slug: "tem-chong-nuoc-cho-my-pham-va-do-uong",
    title: "Chọn tem chống nước cho mỹ phẩm và đồ uống",
    description: "Cách chọn vật liệu và lớp hoàn thiện cho chai lọ thường xuyên gặp nước, độ ẩm hoặc nhiệt độ thấp.",
    category: "theo-nganh",
    image: "/images/mockups/cosmetic_bottle.webp",
    imageAlt: "Tem chống nước trên chai mỹ phẩm",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 6,
  },
  {
    slug: "loi-thiet-ke-tem-nhan",
    title: "7 lỗi thiết kế tem khiến sản phẩm kém chuyên nghiệp",
    description: "Nhận biết các lỗi về thứ bậc thông tin, cỡ chữ, tương phản, khoảng an toàn và lựa chọn vật liệu.",
    category: "thiet-ke",
    image: "/images/ai-design/milk-tea-final.webp",
    imageAlt: "Thành phẩm tem nhãn sau khi tối ưu thiết kế",
    publishedAt: "2026-07-20",
    updatedAt: "2026-07-20",
    readingMinutes: 7,
  },
];

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((post) => [post.slug, post]),
) as Record<string, BlogPost>;

const blogArticleDetails: Record<string, BlogArticleDetails> = {
  "tem-giay-va-tem-nhua-nen-chon-loai-nao": {
    directAnswer: "Không có một chất liệu tốt nhất cho mọi sản phẩm. Tem giấy phù hợp bao bì khô, vòng đời sử dụng ngắn và đơn hàng cần tối ưu chi phí; bề mặt giấy cho màu in rõ nhưng dễ ảnh hưởng khi gặp nước hoặc ma sát kéo dài. Tem nhựa phù hợp chai lọ, mỹ phẩm, đồ uống lạnh và môi trường ẩm vì vật liệu bền nước hơn, khó rách hơn và dễ lau bề mặt. Tuy nhiên, độ bám còn phụ thuộc loại keo, độ cong, độ nhám và độ sạch của vị trí dán. Cách chọn an toàn là xác định điều kiện sử dụng thật, chọn hai phương án gần nhất rồi dán thử trên đúng bao bì trước khi sản xuất số lượng lớn. Nếu sản phẩm chỉ dùng trong môi trường khô, tem giấy thường đủ; nếu có nước, hơi lạnh hoặc cầm nắm nhiều, nên ưu tiên tem nhựa.",
    sections: [
      {
        heading: "Khi nào nên chọn tem giấy?",
        paragraphs: [
          "Tem giấy phù hợp khi bao bì được bảo quản khô, ít ma sát và cần thay đổi mẫu thường xuyên. Các ứng dụng phổ biến gồm hộp giấy, túi kraft, tem cảm ơn, nhãn phân loại và bao bì thực phẩm khô.",
          "Ưu điểm lớn nhất là chi phí dễ tiếp cận và bề mặt in màu tốt. Điểm cần cân nhắc là giấy có thể mềm, nhăn hoặc bong khi tiếp xúc nước; cán màng giúp bảo vệ bề mặt nhưng không biến phần nền giấy thành vật liệu chống nước hoàn toàn.",
        ],
        bullets: ["Bao bì khô và sạch", "Nhu cầu thử mẫu hoặc đổi thiết kế", "Ưu tiên chi phí và màu in"],
      },
      {
        heading: "Khi nào nên chọn tem nhựa?",
        paragraphs: [
          "Tem nhựa nên được cân nhắc cho chai mỹ phẩm, ly nước, sản phẩm bảo quản lạnh và bao bì thường xuyên được cầm nắm. Vật liệu bền ẩm và khó rách hơn giấy, nhưng chất lượng cuối cùng vẫn phụ thuộc bề mặt dán và loại keo.",
          "Với chai cong, chai có gân hoặc bề mặt nhám, hãy dán thử một mẫu đúng kích thước. Mẫu thử giúp phát hiện sớm hiện tượng nhăn, hở mép hoặc logo bị biến dạng khi nhìn trên sản phẩm thật.",
        ],
        bullets: ["Môi trường ẩm hoặc có nước", "Chai lọ được cầm nắm nhiều", "Cần độ bền và khả năng lau sạch"],
      },
      {
        heading: "Tem giấy và tem nhựa khác nhau thế nào?",
        paragraphs: ["Bảng dưới đây là hướng chọn ban đầu. Báo giá và vật liệu cuối cùng cần dựa trên kích thước, số lượng, bề mặt dán và yêu cầu gia công thực tế."],
        table: {
          headers: ["Tiêu chí", "Tem giấy", "Tem nhựa"],
          rows: [
            ["Môi trường", "Khô, ít ma sát", "Ẩm, lạnh hoặc có nước"],
            ["Độ bền", "Phù hợp vòng đời ngắn", "Bền ẩm và khó rách hơn"],
            ["Chi phí", "Thường dễ tối ưu", "Cao hơn tùy quy cách"],
            ["Ứng dụng", "Hộp, túi kraft, tem cảm ơn", "Mỹ phẩm, đồ uống, chai lọ"],
          ],
        },
      },
      {
        heading: "Làm sao chốt vật liệu mà không phải đoán?",
        paragraphs: ["Gửi xưởng ảnh bao bì, kích thước vùng dán, số lượng và điều kiện sử dụng. Nếu có thể, thử mẫu trên đúng sản phẩm trong điều kiện lạnh, ẩm hoặc ma sát dự kiến. Quyết định dựa trên mẫu thật đáng tin cậy hơn chỉ nhìn mô phỏng trên màn hình."],
      },
    ],
    relatedProductSlugs: ["tem-giay", "tem-nhua-chong-nuoc", "tem-nhua-trong"],
    sources: [
      { title: "Hướng dẫn chọn chất liệu tem của VinPrint", href: "/huong-dan/chon-chat-lieu-tem", note: "Tổng hợp tiêu chí theo môi trường sử dụng và bề mặt dán." },
      { title: "Trang sản phẩm tem giấy", href: "/san-pham/tem-giay", note: "Thông tin ứng dụng và giá tham khảo công khai." },
      { title: "Trang sản phẩm tem nhựa chống nước", href: "/san-pham/tem-nhua-chong-nuoc", note: "Thông tin ứng dụng cho môi trường ẩm và chai lọ." },
    ],
  },
  "tem-uv-dtf-la-gi": {
    directAnswer: "Tem UV DTF là lớp hình in nổi được chuyển từ màng trung gian sang bề mặt sản phẩm. Sau khi miết và bóc màng, phần logo hoặc chữ ở lại mà không cần một mảng nền lớn như decal thông thường. Loại tem này tạo bề mặt bóng, có độ nổi và phù hợp với nhiều vật liệu cứng, tương đối phẳng như thủy tinh, kim loại, nhựa cứng, gốm hoặc hộp phủ bề mặt. UV DTF không phải lựa chọn mặc định cho mọi sản phẩm: bề mặt quá nhám, nhiều dầu, quá cong, co giãn hoặc thường xuyên chịu ma sát mạnh có thể làm giảm độ bám. Trước khi đặt số lượng lớn, nên vệ sinh bề mặt, dán thử đúng kích thước và theo dõi mép tem trong điều kiện sử dụng thật. Thiết kế càng ít chi tiết cực nhỏ thì quá trình bóc và dán càng ổn định.",
    sections: [
      { heading: "Tem UV DTF hoạt động như thế nào?", paragraphs: ["Hình in được tạo trên một hệ màng chuyển. Người dùng đặt màng lên sản phẩm, miết đều rồi bóc lớp mang đi; phần mực và keo của thiết kế bám lại trên bề mặt.", "Vì phần nền thừa không ở lại, logo có cảm giác gần giống in trực tiếp. Kết quả phụ thuộc đồng thời vào file, kích thước chi tiết, lực miết, loại bề mặt và cách vệ sinh trước khi dán."] },
      { heading: "Bề mặt nào phù hợp với tem UV DTF?", paragraphs: ["Bề mặt cứng, sạch, ít nhám và không co giãn thường cho kết quả dễ kiểm soát hơn. Bề mặt có lớp phủ chống bám, nhiều gân, nhiều dầu hoặc cong gắt cần được thử trước."], table: { headers: ["Mức phù hợp", "Ví dụ", "Lưu ý"], rows: [["Nên thử", "Thủy tinh, kim loại, nhựa cứng, gốm", "Làm sạch và để khô trước khi dán"], ["Cần kiểm tra kỹ", "Bề mặt sơn, cong hoặc có phủ", "Theo dõi mép và độ bám"], ["Không ưu tiên", "Vải, cao su co giãn, bề mặt rất nhám", "Chọn kỹ thuật khác phù hợp hơn"]] } },
      { heading: "File UV DTF cần chuẩn bị ra sao?", paragraphs: ["Ưu tiên logo vector, đường nét đủ dày và khoảng trống rõ. Tránh các hạt rời quá nhỏ hoặc chữ quá mảnh vì chúng khó bóc, khó canh và dễ mất chi tiết trên sản phẩm thật."], bullets: ["Gửi file vector nếu có", "Chốt kích thước thành phẩm bằng milimet", "Tách rõ vùng cần giữ và vùng cần bỏ", "Dán thử trước khi chạy số lượng lớn"] },
      { heading: "Khi nào nên dùng decal thay cho UV DTF?", paragraphs: ["Nếu tem cần chứa nhiều thông tin nhỏ, cần một mảng nền rõ ràng hoặc dán trên bề mặt mềm, decal giấy hay decal nhựa thường dễ đọc và dễ sản xuất hơn. UV DTF phù hợp nhất khi cần logo hoặc chi tiết trang trí nổi, gọn và không có nền thừa."] },
    ],
    relatedProductSlugs: ["tem-uv-dtf", "tem-nhua-trong", "tem-vang"],
    sources: [
      { title: "Trang sản phẩm tem UV DTF VinPrint", href: "/san-pham/tem-uv-dtf", note: "Ứng dụng, ảnh sản phẩm và quy trình đặt in." },
      { title: "Các kỹ thuật in và gia công tem", href: "/huong-dan/ky-thuat-in-tem", note: "So sánh UV DTF với cán màng, cắt bế và hiệu ứng khác." },
    ],
  },
  "cach-chon-kich-thuoc-tem-nhan": {
    directAnswer: "Kích thước tem nhãn nên được chọn từ vùng dán thực tế, không chọn chỉ theo kích thước file hoặc cảm giác trên màn hình. Trước tiên, đo phần bề mặt phẳng bằng milimet và loại trừ vai chai, đường gân, mép gấp hoặc khu vực thường xuyên cầm nắm. Tiếp theo, cắt một mẫu giấy đúng kích thước, đặt lên sản phẩm rồi kiểm tra ở khoảng cách sử dụng bình thường: tên sản phẩm có dễ thấy không, chữ nhỏ có đọc được không và hai mép tem có bị chạm nhau không. Với chai cong, nên chừa khoảng hở giữa hai mép và bo góc để giảm nguy cơ bong. Sau khi chốt kích thước, thiết kế file đúng tỷ lệ thành phẩm, giữ nội dung quan trọng cách đường cắt một khoảng an toàn và gửi ảnh mẫu dán cho xưởng đối chiếu trước khi in.",
    sections: [
      { heading: "Đo vùng dán tem theo ba bước nào?", paragraphs: ["Bước một, đo chiều rộng và chiều cao của vùng phẳng có thể dán. Bước hai, cắt mẫu giấy đúng số đo và đặt lên bao bì. Bước ba, chụp ảnh chính diện và góc nghiêng để kiểm tra độ cong, mép dán và tỷ lệ với toàn bộ sản phẩm."], bullets: ["Dùng đơn vị milimet", "Không tính vai chai hoặc đường gân", "Đo trên đúng mẫu bao bì sẽ sản xuất", "Kiểm tra cả khi sản phẩm được cầm trên tay"] },
      { heading: "Chai, hũ, hộp và túi cần lưu ý gì?", paragraphs: ["Mỗi dạng bao bì có một rủi ro khác nhau. Chai tròn dễ hở hoặc chồng mép; hũ thấp cần ưu tiên khả năng đọc; hộp giấy cần tránh đường gấp; túi mềm có thể làm tem nhăn khi bao bì thay đổi hình dạng."], table: { headers: ["Bao bì", "Ưu tiên", "Tránh"], rows: [["Chai tròn", "Chừa khoảng hở giữa hai mép", "Dán qua vai hoặc gân chai"], ["Hũ thấp", "Tên sản phẩm và logo dễ đọc", "Quá nhiều chữ nhỏ"], ["Hộp giấy", "Canh theo mặt phẳng chính", "Đường gấp và mép mở"], ["Túi mềm", "Tem nhỏ, bo góc", "Mảng tem quá lớn, cứng"]] } },
      { heading: "Khoảng an toàn và vùng xén là gì?", paragraphs: ["Vùng xén là phần hình nền kéo ra ngoài đường cắt để tránh lộ viền trắng khi thành phẩm có sai số nhỏ. Khoảng an toàn là vùng bên trong nơi logo, chữ và mã quan trọng nên được giữ cách xa đường cắt. Mức cụ thể cần hỏi xưởng theo máy và quy cách cắt."],
      },
      { heading: "Cách kiểm tra cuối trước khi gửi in?", paragraphs: ["In thử trên giấy ở tỷ lệ 100%, cắt theo đường thành phẩm rồi dán lên bao bì. Đây là bước đơn giản nhưng giúp phát hiện phần lớn lỗi về tỷ lệ, chữ quá nhỏ, mép chạm nhau và bố cục bị cong."] },
    ],
    relatedProductSlugs: ["tem-nhua-chong-nuoc", "tem-giay", "tem-phu-san-pham"],
    sources: [
      { title: "Hướng dẫn đo và chọn kích thước tem", href: "/huong-dan/chon-kich-thuoc-tem", note: "Quy trình đo vùng dán và thử mẫu giấy của VinPrint." },
      { title: "Ứng dụng tem trên chai lọ", href: "/nganh/chai-lo", note: "Lưu ý theo độ cong và vật liệu bề mặt." },
    ],
  },
  "chuan-bi-file-in-tem-khong-bi-mo": {
    directAnswer: "Để file in tem không bị mờ, hãy chuẩn bị thiết kế đúng kích thước thành phẩm và kiểm tra từng loại nội dung theo nguồn gốc của nó. Logo, chữ và đường cắt nên dùng dữ liệu vector để giữ cạnh sắc khi thay đổi kích thước. Ảnh raster cần đủ số điểm ảnh ở kích thước in thật; 300 ppi là mốc thực hành phổ biến cho bản in chất lượng cao, nhưng vẫn cần xác nhận với xưởng theo thiết bị và vật liệu. Chuyển tài liệu sang hệ màu phù hợp cho in, nhúng hoặc chuyển font thành đường nét khi được yêu cầu, đồng thời kéo nền ra vùng xén để tránh viền trắng sau cắt. Trước khi gửi, xuất PDF chất lượng in, mở lại ở tỷ lệ 100% và kiểm tra chữ nhỏ, mã QR, ảnh, kích thước trang, vùng an toàn và đường cắt. Không nên phóng lớn ảnh lấy từ mạng hoặc ảnh chụp màn hình.",
    sections: [
      { heading: "Vector và ảnh raster khác nhau thế nào khi in tem?", paragraphs: ["Vector mô tả logo và chữ bằng đường nét nên có thể thay đổi kích thước mà vẫn giữ cạnh sắc. Ảnh raster được tạo từ điểm ảnh; khi phóng lớn quá mức, các điểm ảnh lộ ra và thành phẩm trông mờ hoặc răng cưa."], bullets: ["Ưu tiên AI, EPS, SVG hoặc PDF vector cho logo", "Không dùng ảnh chụp màn hình làm logo", "Kiểm tra ảnh ở kích thước in thật", "Không tăng ppi chỉ bằng cách nhập lại con số"] },
      { heading: "Độ phân giải, hệ màu và font cần kiểm tra gì?", paragraphs: ["Adobe xem 300 ppi là mốc tiêu chuẩn phổ biến cho ảnh in chất lượng cao. Với màu sắc, tài liệu in thường cần làm việc trong CMYK và xem trước màu ngoài dải in; màu trên màn hình vẫn có thể khác thành phẩm do thiết bị, vật liệu và lớp hoàn thiện."], table: { headers: ["Hạng mục", "Nên làm", "Rủi ro cần tránh"], rows: [["Logo và chữ", "Giữ dạng vector", "Ảnh nhỏ bị phóng lớn"], ["Ảnh", "Đủ độ phân giải ở kích thước thật", "Chỉ đổi thông số ppi"], ["Màu", "Kiểm tra CMYK và mẫu in", "Kỳ vọng giống tuyệt đối màn hình"], ["Font", "Nhúng hoặc chuyển outline theo yêu cầu", "Thiếu font khi mở file"]] } },
      { heading: "Vùng xén và đường cắt cần đặt thế nào?", paragraphs: ["Nếu nền chạm mép tem, hình nền cần kéo qua đường cắt vào vùng xén. Adobe mô tả bleed là phần mở rộng ngoài mép trang để bù sai lệch nhỏ khi cắt; mức cụ thể phải xác nhận với nhà in vì mỗi quy trình có yêu cầu khác nhau."], bullets: ["Giữ nội dung quan trọng trong vùng an toàn", "Không đặt chữ sát đường cắt", "Tách đường cắt khỏi phần hình in", "Xác nhận quy cách với xưởng trước khi xuất file"] },
      { heading: "Checklist nào nên dùng trước khi gửi xưởng?", paragraphs: ["Mở lại bản PDF cuối cùng thay vì chỉ nhìn file thiết kế đang làm. Kiểm tra kích thước trang, chính tả, mã QR, số điện thoại, độ nét ảnh, font, vùng xén và tên phiên bản. Gửi kèm kích thước, số lượng, chất liệu dự kiến và ảnh bao bì để xưởng đối chiếu."],
      },
    ],
    relatedProductSlugs: ["tem-giay", "tem-nhua-chong-nuoc", "tem-uv-dtf"],
    sources: [
      { title: "Adobe: Resolution specs for printing images", href: "https://helpx.adobe.com/photoshop/desktop/crop-resize-transform/resize-adjust-resolution/resolution-specs-for-printing-images.html", note: "Giải thích độ phân giải ảnh in và mốc 300 ppi." },
      { title: "Adobe: Printer’s marks and bleeds", href: "https://helpx.adobe.com/indesign/desktop/print/page-set-up-and-printer-marks/print-bleed-and-slug-areas.html", note: "Giải thích bleed, slug và dấu cắt trong quy trình in." },
      { title: "Adobe: CMYK color for print", href: "https://helpx.adobe.com/illustrator/desktop/manage-colors/select-and-adjust-colors/make-colors-printable-or-web-safe.html", note: "Hướng dẫn chọn CMYK cho tài liệu in và kiểm tra màu ngoài dải." },
    ],
  },
  "tem-chong-nuoc-cho-my-pham-va-do-uong": {
    directAnswer: "Tem chống nước cho mỹ phẩm và đồ uống nên được chọn theo điều kiện sử dụng, không chỉ theo tên vật liệu. Decal nhựa thường phù hợp hơn decal giấy khi chai gặp nước, hơi lạnh hoặc được lau thường xuyên; lớp cán có thể hỗ trợ bảo vệ bề mặt in nhưng không thay thế việc chọn đúng vật liệu nền và keo. Với chai để lạnh, cần tính đến nước ngưng tụ; với mỹ phẩm, cần tính đến dầu, cồn, ma sát và độ cong của chai. Bề mặt phải được làm sạch và để khô trước khi dán. Cách kiểm tra đáng tin cậy nhất là dán mẫu đúng kích thước lên đúng chai, để sản phẩm trong môi trường sử dụng thật rồi theo dõi mép tem, độ nhăn, màu in và khả năng đọc. Nếu bề mặt quá nhám, có lớp chống bám hoặc cong mạnh, cần thử loại keo hay kỹ thuật khác trước khi sản xuất hàng loạt.",
    sections: [
      { heading: "Mỹ phẩm và đồ uống tạo ra những rủi ro nào?", paragraphs: ["Chai mỹ phẩm có thể tiếp xúc nước, dầu, cồn hoặc ma sát khi cầm. Chai và ly đồ uống lạnh thường xuất hiện hơi nước trên bề mặt. Hai môi trường này đòi hỏi vật liệu bền ẩm, keo phù hợp và thao tác dán đúng."], table: { headers: ["Điều kiện", "Rủi ro", "Hướng xử lý"], rows: [["Nước ngưng tụ", "Bong mép, nhăn", "Tem nhựa và thử lạnh"], ["Dầu hoặc cồn", "Giảm độ bám, ảnh hưởng bề mặt", "Thử tiếp xúc thực tế"], ["Chai cong", "Hở mép, biến dạng", "Giảm kích thước, bo góc"], ["Ma sát", "Trầy mực", "Chọn lớp hoàn thiện phù hợp"]] } },
      { heading: "Cán màng có biến tem giấy thành tem chống nước không?", paragraphs: ["Cán màng bảo vệ bề mặt mực tốt hơn, nhưng cạnh cắt và phần nền giấy vẫn có thể hút ẩm. Vì vậy, sản phẩm thường xuyên gặp nước nên bắt đầu từ vật liệu nhựa thay vì chỉ dựa vào lớp cán."],
      },
      { heading: "Dán tem thế nào để tăng độ bám?", paragraphs: ["Làm sạch bụi, dầu và hơi nước; để bề mặt khô; canh tem một lần rồi miết từ giữa ra ngoài. Không nên dán khi chai vừa lấy khỏi tủ lạnh và đang đọng nước. Sau khi dán, cho keo thời gian ổn định trước khi thử ma sát hoặc ngâm lạnh."], bullets: ["Dán trên bề mặt sạch và khô", "Không chạm tay nhiều vào lớp keo", "Miết đều từ giữa ra mép", "Thử mẫu trong điều kiện sử dụng thật"] },
      { heading: "Khi nào cần yêu cầu mẫu thử?", paragraphs: ["Nên yêu cầu mẫu thử khi dùng chai mới, bề mặt có phủ, sản phẩm chứa dầu hoặc cồn, tem có kích thước lớn, chai cong hoặc đơn hàng có số lượng đáng kể. Một thử nghiệm nhỏ giúp giảm rủi ro tốt hơn việc chọn vật liệu chỉ từ mô tả."],
      },
    ],
    relatedProductSlugs: ["tem-nhua-chong-nuoc", "tem-nhua-trong", "tem-uv-dtf"],
    sources: [
      { title: "Tem nhựa chống nước VinPrint", href: "/san-pham/tem-nhua-chong-nuoc", note: "Thông tin ứng dụng cho mỹ phẩm, đồ uống và môi trường lạnh." },
      { title: "Hướng dẫn tem nhãn mỹ phẩm", href: "/nganh/my-pham", note: "Tiêu chí độ bám, độ đọc và chuẩn bị file cho chai lọ." },
      { title: "Hướng dẫn tem nhãn đồ uống", href: "/nganh/do-uong", note: "Lưu ý về hơi nước, nhiệt độ thấp và ma sát." },
    ],
  },
  "loi-thiet-ke-tem-nhan": {
    directAnswer: "Tem nhãn thường kém chuyên nghiệp khi thông tin không có thứ bậc rõ. Bảy lỗi phổ biến là: logo hoặc tên sản phẩm quá nhỏ; dùng quá nhiều kiểu chữ; tương phản thấp; nhồi quá nhiều nội dung; đặt chữ sát đường cắt; chọn hình ảnh không đủ độ phân giải; và thiết kế không phù hợp vật liệu hoặc hình dạng bao bì. Cách sửa là xác định một thông tin chính người mua phải thấy đầu tiên, giới hạn số kiểu chữ, tăng khoảng trắng, kiểm tra màu trên vật liệu thật và in thử ở kích thước 100%. Với chai cong hoặc tem nhỏ, cần giảm chi tiết thay vì thu nhỏ toàn bộ thiết kế. File đẹp trên màn hình chưa chắc dễ đọc trên sản phẩm; hãy dán mẫu giấy lên bao bì, nhìn ở khoảng cách sử dụng bình thường và kiểm tra lại nội dung cùng đường cắt trước khi in.",
    sections: [
      { heading: "Bảy lỗi thiết kế tem nhãn thường gặp là gì?", paragraphs: ["Danh sách dưới đây tập trung vào các lỗi ảnh hưởng trực tiếp đến khả năng đọc, sản xuất và cảm nhận thương hiệu trên bao bì thật."], bullets: ["Không có thông tin chính nổi bật", "Dùng quá nhiều font hoặc phong cách", "Chữ và nền thiếu tương phản", "Nhồi quá nhiều nội dung trên diện tích nhỏ", "Logo, chữ hoặc mã đặt sát đường cắt", "Ảnh raster bị phóng lớn và mất nét", "Thiết kế không phù hợp vật liệu hoặc độ cong bao bì"] },
      { heading: "Nên sắp xếp thứ bậc thông tin thế nào?", paragraphs: ["Chọn một điểm nhìn đầu tiên: tên thương hiệu hoặc tên sản phẩm. Nhóm thứ hai là công dụng, hương vị hoặc đặc tính chính. Thông tin chi tiết như thành phần, hướng dẫn và liên hệ nên có cỡ chữ đủ đọc nhưng không cạnh tranh với tiêu đề."], table: { headers: ["Cấp độ", "Nội dung", "Mục tiêu"], rows: [["1", "Thương hiệu hoặc tên sản phẩm", "Nhận biết ngay"], ["2", "Loại sản phẩm, công dụng chính", "Hiểu nhanh"], ["3", "Chi tiết, dung tích, liên hệ", "Đọc khi quan tâm"]] } },
      { heading: "Làm sao kiểm tra thiết kế trên sản phẩm thật?", paragraphs: ["In bản thử ở tỷ lệ 100%, cắt theo kích thước rồi dán lên bao bì. Xem tem ở chính diện, góc nghiêng và khoảng cách người mua thường nhìn. Kiểm tra thêm dưới ánh sáng cửa hàng hoặc nơi sử dụng dự kiến."], bullets: ["Đọc được trong vài giây", "Không mất chữ ở vùng cong", "Mép tem không chạm gân hoặc đường gấp", "Màu và vật liệu hỗ trợ đúng phong cách"] },
      { heading: "Khi nào nên giản lược thay vì thêm hiệu ứng?", paragraphs: ["Khi tem nhỏ, nhiều nội dung hoặc bao bì đã có màu mạnh, thêm bóng, viền, họa tiết và nhiều font thường làm giảm khả năng đọc. Giản lược giúp logo rõ hơn, khoảng trắng tốt hơn và file dễ sản xuất ổn định hơn."],
      },
    ],
    relatedProductSlugs: ["tem-giay", "tem-nhua-trong", "tem-vang"],
    sources: [
      { title: "Quy trình thiết kế và duyệt mẫu VinPrint", href: "/#quy-trinh", note: "Các bước gửi yêu cầu, thiết kế, duyệt và sản xuất." },
      { title: "Hướng dẫn chọn kích thước tem", href: "/huong-dan/chon-kich-thuoc-tem", note: "Cách thử mẫu giấy và giữ nội dung trong vùng an toàn." },
      { title: "Case study ứng dụng tem nhãn", href: "/case-study", note: "Ví dụ chọn vật liệu và bố cục theo ngành hàng." },
    ],
  },
};

const missingArticleDetails = blogPosts
  .map((post) => post.slug)
  .filter((slug) => !blogArticleDetails[slug]);
const orphanedArticleDetails = Object.keys(blogArticleDetails)
  .filter((slug) => !blogPostBySlug[slug]);

if (missingArticleDetails.length || orphanedArticleDetails.length) {
  throw new Error(
    `Blog data is inconsistent. Missing details: ${missingArticleDetails.join(", ") || "none"}; orphaned details: ${orphanedArticleDetails.join(", ") || "none"}.`,
  );
}

export function getBlogArticle(slug: string): BlogArticle | undefined {
  const post = blogPostBySlug[slug];
  const details = blogArticleDetails[slug];
  return post && details ? { ...post, ...details } : undefined;
}

export function getBlogCategoryLabel(slug: BlogCategorySlug) {
  return blogCategories.find((category) => category.slug === slug)?.label ?? slug;
}

export function formatBlogDate(date: string) {
  const [year, month, day] = date.split("-");
  return [day, month, year].filter(Boolean).join("/");
}
