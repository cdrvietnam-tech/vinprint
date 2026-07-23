import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

const scenarios = [
  {
    title: "Mỹ phẩm & chăm sóc cá nhân",
    need: "Tem cần chịu ẩm, bám trên chai lọ và giữ nội dung dễ đọc.",
    image: "/images/products/tem-nhua-chong-nuoc.webp",
  },
  {
    title: "Thực phẩm & đồ uống",
    need: "Nhãn cần cân bằng chi phí, màu sắc và điều kiện bảo quản.",
    image: "/images/products/tem-giay.webp",
  },
  {
    title: "Quà tặng & sản phẩm thủ công",
    need: "Tem tạo điểm nhấn thương hiệu trên hộp, túi và bao bì nhỏ.",
    image: "/images/products/tem-ep-kim.webp",
  },
  {
    title: "Chai lọ trong suốt",
    need: "Tem cần giữ vẻ trong trẻo của bao bì nhưng nội dung vẫn đủ tương phản.",
    image: "/images/products/tem-nhua-trong.webp",
  },
  {
    title: "Thiết bị & tem bảo hành",
    need: "Nhãn cần gọn, dễ đọc và phù hợp với bề mặt kim loại hoặc nhựa cứng.",
    image: "/images/products/tem-bac.webp",
  },
  {
    title: "Ly, cốc & quà tặng cứng",
    need: "UV DTF giúp logo nổi bật trên bề mặt cứng khi điều kiện dán phù hợp.",
    image: "/images/products/tem-uv-dtf.webp",
  },
] as const;

export default function CaseStudies() {
  return (
    <section id="case-study" className="flex h-full flex-col rounded-[32px] border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.15em] text-orange-700">Tình huống ứng dụng</span>
          <h2 className="mt-2 text-2xl font-black text-gray-950 sm:text-3xl">Chọn tem theo cách sản phẩm được dùng</h2>
        </div>
        <Link href="/case-study" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gray-950 px-5 text-sm font-black text-white transition hover:bg-orange-700">
          Xem case study <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-gray-600">
        Các tình huống dưới đây giúp chọn vật liệu phù hợp. Để nhận báo giá, chỉ cần cung cấp vật liệu, kích thước, số lượng và nhu cầu giá lẻ hoặc giá sỉ.
      </p>

      <div data-case-study-grid="six" className="mt-6 grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <article data-case-scenario key={scenario.title} className="overflow-hidden rounded-[24px] border border-gray-100 bg-[#fffaf4]">
            <div className="relative aspect-[4/3] bg-white">
              <Image
                src={scenario.image}
                alt={`Mẫu ứng dụng ${scenario.title.toLocaleLowerCase("vi-VN")}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 92vw, (max-width: 1280px) 30vw, 20vw"
                className="object-contain p-4"
              />
            </div>
            <div className="p-4">
              <strong className="flex items-start gap-2 text-sm font-black text-gray-950">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                {scenario.title}
              </strong>
              <p className="mt-2 text-xs font-medium leading-5 text-gray-600">{scenario.need}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
