import Image from "next/image";
import Link from "next/link";
import type { ContentPageData } from "../../lib/content-pages";
import Header from "../home/Header";
import Footer from "../home/Footer";
import ConversionLink from "../ConversionLink";
import GuideFrame from "../storefront/GuideFrame";
import MaterialVisualComparison from "./MaterialVisualComparison";

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
    ...(data.updatedAt ? { dateModified: data.updatedAt } : {}),
  };
  const faqSchema = data.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  const isGuide=canonicalPath.startsWith("/huong-dan/");
  const page=(
      <main id="main-content" tabIndex={-1} className={isGuide?"vp-guide-content":"pt-20"}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
        <section className={"border-b border-black/10 bg-[#171310] px-4 py-12 text-white"+(isGuide?" vp-guide-intro":"")}>
          <div className="mx-auto max-w-5xl">
            <Link href="/" className="inline-flex min-h-11 items-center text-sm font-bold text-orange-300 hover:text-white">← Trang chủ</Link>
            <p className="vp-guide-eyebrow mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#D5FF43]">{data.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">{data.title}</h1>
            <p className="vp-guide-summary mt-7 max-w-3xl text-lg leading-8 text-white/80">{data.intro}</p>
          </div>
        </section>

        {isGuide&&<nav className="vp-guide-toc" aria-label="Mục lục hướng dẫn"><span>Trong hướng dẫn này</span>{data.sections.map((section,index)=><a key={section.heading} href={"#guide-section-"+(index+1)}>{section.heading}</a>)}</nav>}
        <article className="mx-auto max-w-5xl space-y-8 px-4 py-12">
          {data.updatedAt && <p className="text-sm text-gray-600">Nội dung: VinPrint · Cập nhật <time dateTime={data.updatedAt}>{data.updatedAt.split("-").reverse().join("/")}</time></p>}
          {data.sections.map((section,index) => (
            <section id={isGuide?"guide-section-"+(index+1):undefined} key={section.heading} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">{section.heading}</h2>
              {section.image && <figure className="mt-6"><Image src={section.image.src} alt={section.image.alt} width={1200} height={1200} className="mx-auto h-auto w-full max-w-2xl rounded-2xl" /><figcaption className="mt-3 text-sm text-gray-600">{section.image.caption}</figcaption></figure>}
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 text-base leading-8 text-gray-700">{paragraph}</p>)}
              {section.visualComparison&&<MaterialVisualComparison/>}
              {isGuide&&section.table&&<p className="vp-guide-table-hint">Vuốt ngang bảng để xem đủ các tiêu chí →</p>}
              {section.table && <div className="mt-6 overflow-x-auto rounded-2xl border border-red-100" role="region" aria-label={section.table.caption} tabIndex={0}><table className="w-full min-w-[580px] border-collapse text-left text-sm leading-7"><caption className="bg-red-50 px-5 py-3 text-left font-bold text-red-900">{section.table.caption}</caption><thead><tr>{section.table.columns.map(column=><th scope="col" key={column} className="border-b border-red-100 bg-[#fffaf7] px-5 py-3 font-bold">{column}</th>)}</tr></thead><tbody>{section.table.rows.map(row=><tr key={row[0]}>{row.map((cell,index)=>index===0?<th scope="row" key={index} className="border-b border-red-50 px-5 py-4 align-top font-bold text-gray-950">{cell}</th>:<td key={index} className="border-b border-red-50 px-5 py-4 align-top text-gray-700">{cell}</td>)}</tr>)}</tbody></table></div>}
              {section.bullets && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.bullets.map((item) => <li key={item} className="rounded-2xl bg-orange-50 px-5 py-4 font-semibold text-gray-900">✓ {item}</li>)}
                </ul>
              )}
              {section.links && <div className="mt-5 flex flex-wrap gap-4">{section.links.map((link) => <Link key={link.href} href={link.href} className="font-bold text-[#4933D4] underline underline-offset-4">{link.label}</Link>)}</div>}
            </section>
          ))}

          {data.faqs?.length ? (
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">Câu hỏi thường gặp</h2>
              <dl className="mt-6 space-y-5">
                {data.faqs.map((item) => (<div key={item.q}><dt className="text-lg font-black text-gray-950">{item.q}</dt><dd className="mt-2 text-base leading-8 text-gray-700">{item.a}</dd></div>))}
              </dl>
            </section>
          ) : null}

          {data.related?.length ? (
            <nav aria-label="Nội dung liên quan" className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">Xem thêm</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {data.related.map((item) => (<li key={item.href}><Link href={item.href} className="flex min-h-12 items-center rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-900 hover:border-[#D83B00] hover:text-[#D83B00]">{item.label} →</Link></li>))}
              </ul>
            </nav>
          ) : null}

          {!isGuide&&<aside className="rounded-3xl bg-[#6545ED] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
            <div><h2 className="text-2xl font-black">Cần tư vấn theo sản phẩm thật?</h2><p className="mt-2 text-white/80">Gửi hình bao bì, kích thước và số lượng để xưởng kiểm tra.</p></div>
            <ConversionLink href="https://zalo.me/0844998499" target="_blank" rel="noreferrer" eventName="click_zalo" eventPosition={`content_${data.slug}`} className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-black text-[#3D28BC] sm:mt-0">Nhắn Zalo nhận tư vấn</ConversionLink>
          </aside>}
        </article>
      </main>
  );
  return isGuide?<GuideFrame>{page}</GuideFrame>:<div className="min-h-screen bg-[#F7F4EE] text-gray-950"><Header/>{page}<Footer/></div>;
}

