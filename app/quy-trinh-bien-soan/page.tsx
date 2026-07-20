import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import ConversionLink from "../components/ConversionLink";
import Footer from "../components/home/Footer";
import Header from "../components/home/Header";

const canonicalUrl = "https://vinprint.vn/quy-trinh-bien-soan";
const editorialTeamId = `${canonicalUrl}#editorial-team`;

export const metadata: Metadata = {
  title: "Quy trình biên soạn nội dung tem nhãn",
  description: "Cách đội ngũ VinPrint biên soạn, kiểm tra nguồn, sử dụng AI và cập nhật nội dung tư vấn về tem nhãn.",
  alternates: { canonical: "/quy-trinh-bien-soan" },
  openGraph: {
    title: "Quy trình biên soạn nội dung | VinPrint",
    description: "Ai chịu trách nhiệm, nguồn nào được sử dụng và cách VinPrint rà soát nội dung kỹ thuật về tem nhãn.",
    url: "/quy-trinh-bien-soan",
    type: "article",
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Quy trình biên soạn nội dung VinPrint",
      description: "Cách đội ngũ VinPrint biên soạn, kiểm tra nguồn, sử dụng AI và cập nhật nội dung tư vấn về tem nhãn.",
      datePublished: "2026-07-20",
      dateModified: "2026-07-20",
      inLanguage: "vi-VN",
      mainEntity: { "@id": editorialTeamId },
    },
    {
      "@type": "Organization",
      "@id": editorialTeamId,
      name: "Đội ngũ biên tập VinPrint",
      url: canonicalUrl,
      parentOrganization: { "@id": "https://vinprint.vn/#localbusiness" },
      knowsAbout: ["Vật liệu tem nhãn", "Kỹ thuật in tem", "Chuẩn bị file in", "Ứng dụng tem trên bao bì"],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://vinprint.vn/" },
        { "@type": "ListItem", position: 2, name: "Quy trình biên soạn", item: canonicalUrl },
      ],
    },
  ],
};

const workflow = [
  "Xác định câu hỏi thực tế người đặt in cần giải quyết.",
  "Đối chiếu dữ liệu sản phẩm, hướng dẫn công khai và nguồn kỹ thuật phù hợp.",
  "Viết câu trả lời theo điều kiện sử dụng thật, nêu rõ giới hạn và bước thử mẫu.",
  "Gắn nguồn, ngày cập nhật và rà soát lại khi vật liệu hoặc quy cách thay đổi.",
];

export default function EditorialProcessPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        <header className="border-b border-black/10 bg-[#171310] px-4 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-5xl">
            <Link href="/blog" className="inline-flex min-h-11 items-center text-sm font-bold text-orange-300 hover:text-white">← Cẩm nang tem nhãn</Link>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#D5FF43]">Minh bạch nội dung</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Quy trình biên soạn nội dung</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">VinPrint công khai người chịu trách nhiệm, cách kiểm chứng và giới hạn của nội dung tư vấn để người đọc biết thông tin được tạo ra như thế nào.</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white/70"><CalendarDays aria-hidden="true" className="h-4 w-4" /> Cập nhật 20/07/2026</p>
          </div>
        </header>

        <article className="mx-auto max-w-5xl space-y-8 px-4 py-12">
          <section className="rounded-[28px] border border-orange-200 bg-orange-50 p-6 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D83B00]">Ai chịu trách nhiệm cho nội dung?</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">Đội ngũ biên tập VinPrint</h2>
            <p className="mt-5 text-lg leading-8 text-gray-800">Đội ngũ VinPrint chịu trách nhiệm biên tập các bài hướng dẫn về vật liệu, kích thước, chuẩn bị file và cách dùng tem trên bao bì. Nội dung được xây dựng từ thông tin sản phẩm đang công khai trên website, hướng dẫn kỹ thuật có liên quan và các nguồn được liệt kê trong từng bài. Chúng tôi ưu tiên nêu điều kiện sử dụng, giới hạn và bước thử mẫu thay vì khẳng định một vật liệu phù hợp cho mọi trường hợp. AI có thể hỗ trợ sắp xếp cấu trúc hoặc tạo bản nháp, nhưng không được dùng làm nguồn chứng cứ. Thông số cuối cùng của đơn hàng vẫn phải được xác nhận theo file, kích thước, số lượng, bề mặt dán và mẫu thực tế. Khi phát hiện nội dung chưa rõ hoặc đã thay đổi, đội ngũ sẽ sửa bài và cập nhật ngày hiển thị trên trang.</p>
          </section>

          <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4933D4]">Cách thực hiện</p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">Nội dung được biên soạn như thế nào?</h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {workflow.map((step, index) => <li key={step} className="flex gap-4 rounded-2xl bg-[#F7F4EE] p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171310] font-black text-white">{index + 1}</span><span className="font-semibold leading-7">{step}</span></li>)}
            </ol>
          </section>

          <div className="grid gap-8 md:grid-cols-2">
            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <ShieldCheck aria-hidden="true" className="h-8 w-8 text-[#D83B00]" />
              <h2 className="mt-4 text-2xl font-black">Nguồn nào được ưu tiên?</h2>
              <ul className="mt-5 space-y-3 leading-7 text-gray-700">
                <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#D83B00]" /> Tài liệu chính thức của nhà sản xuất phần mềm hoặc thiết bị.</li>
                <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#D83B00]" /> Trang sản phẩm và hướng dẫn công khai của VinPrint.</li>
                <li className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#D83B00]" /> Quan sát có thể kiểm tra bằng mẫu thật trên đúng bao bì.</li>
              </ul>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <ExternalLink aria-hidden="true" className="h-8 w-8 text-[#4933D4]" />
              <h2 className="mt-4 text-2xl font-black">AI được sử dụng như thế nào?</h2>
              <p className="mt-5 leading-8 text-gray-700">AI có thể hỗ trợ nhóm ý, kiểm tra cấu trúc và tạo bản nháp. Mỗi bài phải công khai nguồn dùng để kiểm chứng. AI không thay thế việc thử vật liệu, duyệt file hoặc xác nhận quy cách sản xuất.</p>
            </section>
          </div>

          <section className="rounded-[28px] bg-[#EDE8FF] p-6 sm:p-9">
            <h2 className="text-2xl font-black">Cập nhật và sửa lỗi</h2>
            <p className="mt-4 leading-8 text-gray-700">Ngày cập nhật trên bài phản ánh lần thay đổi nội dung đáng kể, không được đổi chỉ để tạo cảm giác mới. Nếu cần góp ý hoặc yêu cầu sửa thông tin, hãy gửi đường dẫn bài và nội dung cần kiểm tra qua trang liên hệ. Đội ngũ sẽ đối chiếu nguồn và cập nhật khi có căn cứ.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/blog" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171310] px-6 font-black text-white">Xem cẩm nang</Link>
              <Link href="/lien-he" className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/20 bg-white px-6 font-black text-gray-950">Gửi yêu cầu sửa lỗi</Link>
            </div>
          </section>

          <aside className="rounded-[28px] bg-[#6545ED] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
            <div><h2 className="text-2xl font-black">Cần kiểm tra trên sản phẩm thật?</h2><p className="mt-2 max-w-xl leading-7 text-white/80">Nội dung trên website là hướng dẫn ban đầu. Xưởng sẽ xác nhận quy cách theo file và bao bì cụ thể.</p></div>
            <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition="editorial_process" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF4D00] to-[#FF0055] px-6 font-black text-white sm:mt-0">Nhắn Zalo cho xưởng</ConversionLink>
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  );
}
