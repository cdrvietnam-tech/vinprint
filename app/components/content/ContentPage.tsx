import Link from "next/link";
import type { ContentPageData } from "../../lib/content-pages";
import Header from "../home/Header";
import Footer from "../home/Footer";
import ConversionLink from "../ConversionLink";

type ContentPageProps = {
  data: ContentPageData;
  canonicalPath: string;
};

export default function ContentPage({ data, canonicalPath }: ContentPageProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    mainEntityOfPage: `https://vinprint.vn${canonicalPath}`,
    author: { "@type": "Organization", name: "VinPrint", url: "https://vinprint.vn" },
    publisher: { "@type": "Organization", name: "VinPrint", url: "https://vinprint.vn" },
    inLanguage: "vi-VN",
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-gray-950">
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <section className="border-b border-black/10 bg-[#171310] px-4 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-orange-300 hover:text-white">← Trang chủ</Link>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#D5FF43]">{data.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{data.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">{data.intro}</p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl space-y-8 px-4 py-16 sm:py-24">
          {data.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-gray-700">{paragraph}</p>)}
              {section.bullets && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((item) => <li key={item} className="rounded-2xl bg-orange-50 px-5 py-4 font-semibold text-gray-900">✓ {item}</li>)}
                </ul>
              )}
            </section>
          ))}

          <aside className="rounded-3xl bg-[#6545ED] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
            <div><h2 className="text-2xl font-black">Cần tư vấn theo sản phẩm thật?</h2><p className="mt-2 text-white/80">Gửi hình bao bì, kích thước và số lượng để xưởng kiểm tra.</p></div>
            <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition={`content_${data.slug}`} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-black text-[#3D28BC] sm:mt-0">Nhắn Zalo nhận tư vấn</ConversionLink>
          </aside>
        </article>
      </main>
      <Footer />
    </div>
  );
}
