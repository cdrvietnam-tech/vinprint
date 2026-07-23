"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { trackEvent } from "../../lib/analytics";

const paperLabelCombos = [
  {
    tag: "GIÁ TẬN XƯỞNG",
    name: "Tròn 3 cm (đường kính)",
    price: "99.000đ",
    tone: "from-orange-50 to-amber-100",
    accent: "text-orange-700",
    benefits: ["1.000 tem giấy", "Đường kính 3 cm", "Duyệt mẫu trước khi in"],
  },
  {
    tag: "BÁN CHẠY",
    name: "Tròn 4 cm (đường kính)",
    price: "141.000đ",
    tone: "from-cyan-50 to-blue-100",
    accent: "text-blue-700",
    benefits: ["1.000 tem giấy", "Đường kính 4 cm", "Duyệt mẫu trước khi in"],
  },
  {
    tag: "PHỔ BIẾN",
    name: "Tròn 5 cm (đường kính)",
    price: "229.000đ",
    tone: "from-violet-50 to-purple-100",
    accent: "text-violet-700",
    benefits: ["1.000 tem giấy", "Đường kính 5 cm", "Duyệt mẫu trước khi in"],
  },
  {
    tag: "TEM KHỔ LỚN",
    name: "Tròn 6 cm (đường kính)",
    price: "320.000đ",
    tone: "from-yellow-50 to-amber-200",
    accent: "text-amber-800",
    benefits: ["1.000 tem giấy", "Đường kính 6 cm", "Duyệt mẫu trước khi in"],
  },
] as const;

const benefits = [
  "Tư vấn miễn phí",
  "Duyệt mẫu trước khi in",
  "Hỗ trợ thiết kế đơn từ 200.000đ",
  "Tối đa 3 lần chỉnh sửa",
  "Freeship đơn từ 500.000đ",
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent("view_pricing", { position: "pricing_section" });
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="bang-gia" ref={sectionRef} className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="relative overflow-hidden rounded-[32px] bg-[#24104f] p-6 text-white shadow-2xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple-700/40 to-transparent" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative z-10 mb-9 flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-orange-200">
                <Gift className="h-4 w-4" /> Bảng giá siêu tiết kiệm
              </span>
              <h2 className="max-w-3xl text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl">Bảng giá combo tem giấy</h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-purple-100 sm:text-base">
                Giá combo cho 1.000 tem giấy tròn, đường kính 3–6 cm. Kích thước khác hoặc số lượng lớn, VinPrint báo giá sỉ theo đúng quy cách cần in.
              </p>
            </div>
            <a
              href="#nhan-bao-gia"
              onClick={() => trackEvent("view_pricing", { position: "pricing_wholesale_quote" })}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 text-sm font-bold transition-colors hover:bg-white/20"
            >
              Nhận báo giá sỉ <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative z-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {paperLabelCombos.map((combo, index) => (
              <motion.article
                key={combo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`flex min-h-[360px] flex-col rounded-[24px] bg-gradient-to-br ${combo.tone} p-5 text-gray-950 shadow-lg ring-1 ring-white/60`}
              >
                <span className={`text-[10px] font-black uppercase tracking-[0.14em] ${combo.accent}`}>{combo.tag}</span>
                <h3 className="mt-2 text-xl font-black">{combo.name}</h3>
                <div className="mt-4 flex items-end gap-2">
                  <strong className="text-3xl font-black tracking-tight text-[#D83B00]">{combo.price}</strong>
                </div>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-gray-600">Giá combo tem giấy</span>

                <ul className="my-6 space-y-3 text-sm font-bold text-gray-800">
                  {combo.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" /> {benefit}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://zalo.me/0844998499"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent("click_zalo", { position: `combo_${index + 1}` })}
                  className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gray-950 px-4 text-sm font-black text-white transition-transform hover:scale-[1.02]"
                >
                  Nhắn Zalo chốt in <ArrowRight className="h-4 w-4" />
                </a>
              </motion.article>
            ))}
          </div>

          <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#F5A623]" />
                <span className="text-[13px] font-bold text-purple-50">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
