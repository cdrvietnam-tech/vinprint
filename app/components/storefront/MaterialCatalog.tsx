import Link from "next/link";
import {productBySlug} from "../../lib/products";
import "./material-catalog.css";
const sheet="/images/tet-2027/catalog-approved-1.webp";
const cards=[
 {slug:"tem-uv-dtf",crop:"574 147 301 262",caption:"Không nền · Nổi 3D"},
 {slug:"tem-nhua-trong",crop:"890 147 303 262",caption:"Trong suốt · Tinh tế"},
 {slug:"tem-nhua-chong-nuoc",crop:"1207 147 305 262",caption:"Bền ẩm · Dễ vệ sinh"},
 {slug:"tem-vang",crop:"574 530 301 254",caption:"Sang trọng · Bắt sáng"},
 {slug:"tem-bac",crop:"890 530 303 254",caption:"Kim loại · Chuyên nghiệp"},
 {slug:"tem-7-mau",crop:"1207 530 305 254",caption:"Đổi sắc theo ánh sáng"},
];
function Photo({crop,name}:{crop:string;name:string}){return <svg className="vp-catalog-photo" viewBox={crop} preserveAspectRatio="xMidYMid slice" role="img" aria-label={name+" — ảnh mẫu minh họa"}><image href={sheet} width="1536" height="1024"/></svg>;}
export default function MaterialCatalog({onQuote}:{onQuote:(name:string)=>void}){
 const paper=productBySlug["tem-giay"];
 return <section className="vp-approved-catalog" id="danh-muc-san-pham" aria-labelledby="catalog-title"><div className="vp-approved-heading"><div><h2 id="catalog-title">Chọn tem đẹp, nâng tầm thương hiệu</h2><p>Các loại tem nhãn VinPrint</p></div><Link prefetch={false} href="/san-pham">Xem tất cả sản phẩm →</Link></div><div className="vp-approved-grid"><article className="vp-catalog-feature" data-catalog-product="tem-giay"><Link prefetch={false} className="vp-catalog-art" href="/san-pham/tem-giay"><Photo crop="24 147 534 577" name={paper.name}/></Link><div className="vp-catalog-feature-body"><h3><Link prefetch={false} href="/san-pham/tem-giay">{paper.name}</Link></h3><p>Tiết kiệm · In sắc nét · Dán hộp & túi</p><strong>{paper.priceLabel}</strong><button onClick={()=>onQuote(paper.name)} aria-label={"Xem mẫu và báo giá "+paper.name}>Xem mẫu & báo giá →</button></div></article>{cards.map(card=>{const product=productBySlug[card.slug];return <article className="vp-catalog-small" data-catalog-product={card.slug} key={card.slug}><Link prefetch={false} className="vp-catalog-art" href={"/san-pham/"+card.slug}><Photo crop={card.crop} name={product.name}/></Link><div className="vp-catalog-small-body"><h3><Link prefetch={false} href={"/san-pham/"+card.slug}>{product.name}</Link></h3><p>{card.caption}</p><Link prefetch={false} className="vp-catalog-explore" href={"/san-pham/"+card.slug}>Khám phá →</Link></div></article>;})}</div><div className="vp-catalog-secondary"><nav aria-label="Các loại tem khác">{["tem-bao-hanh","tem-phu-san-pham","sticker-trang-tri"].map(slug=><Link prefetch={false} key={slug} data-catalog-product={slug} href={"/san-pham/"+slug}>{productBySlug[slug].name}</Link>)}</nav><span>In theo yêu cầu · Hỗ trợ số lượng ít</span></div><Link className="vp-inline-link" prefetch={false} href="/huong-dan/chon-chat-lieu-tem">So sánh giấy, nhựa, tem trong và UV DTF trước khi chọn →</Link><p className="vp-catalog-disclaimer">Ảnh mẫu minh họa chất liệu và thiết kế.</p></section>;
}
