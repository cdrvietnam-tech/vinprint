import Link from "next/link";

// Dải điều hướng theo mùa trên trang chủ. Chỉ dẫn link tới các trang theo mùa;
// không chứa giá, ưu đãi hay hạn chót. Hết mùa: bỏ <SeasonalBanner /> trong app/page.tsx.
const links = [
  { label: "Tem nhãn Tết 2027", href: "/nganh/tem-nhan-tet" },
  { label: "Tem bánh mứt, đặc sản", href: "/nganh/tem-banh-mut-tet" },
  { label: "Sticker hộp quà Tết", href: "/nganh/sticker-hop-qua-tet" },
];

export default function SeasonalBanner() {
  return (
    <section aria-label="In tem nhãn mùa Tết 2027" className="border-y border-black/10 bg-[#171310] px-4 py-5 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D5FF43]">Mùa Tết 2027</p>
          <h2 className="mt-1 text-lg font-black sm:text-xl">In tem nhãn cho hàng Tết: hộp quà, bánh mứt, đặc sản</h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 text-sm font-bold text-white hover:border-[#D5FF43] hover:text-[#D5FF43]">
                {item.label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
