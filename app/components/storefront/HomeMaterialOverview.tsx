import Link from "next/link";
const cards=[
 {slug:"tem-giay",name:"Tem giấy",crop:"260 493 300 191",description:"Lựa chọn cho sản phẩm khô, hộp giấy và túi kraft."},
 {slug:"tem-nhua-chong-nuoc",name:"Tem nhựa chống nước",crop:"582 493 299 191",description:"Phù hợp chai lọ, đồ uống và bao bì cần độ bền ẩm."},
 {slug:"tem-nhua-trong",name:"Tem trong",crop:"900 493 298 191",description:"Giữ vẻ trong suốt, làm nổi bật chai và nội dung in."},
 {slug:"tem-vang",name:"Tem ánh kim",crop:"1218 493 300 191",description:"Điểm nhấn bắt sáng cho nhãn quà tặng và bao bì."},
];
export default function HomeMaterialOverview(){return <><div className="vp-home-material-grid" id="grid">{cards.map(card=><article className="vp-home-material-card" data-home-material={card.slug} key={card.slug}><Link className="vp-home-material-photo" href={"/san-pham/"+card.slug} aria-label={"Xem "+card.name}><svg viewBox={card.crop} preserveAspectRatio="xMidYMid slice" role="img" aria-label={card.name+" — ảnh minh họa AI"}><image href="/images/tet-2027/home-layout-approved.webp" width="1536" height="1024"/></svg></Link><div className="vp-home-material-copy"><h3><Link href={"/san-pham/"+card.slug}>{card.name}</Link></h3><p>{card.description}</p><Link className="vp-home-material-more" href={"/san-pham/"+card.slug}>Xem chi tiết →</Link></div></article>)}</div><p className="vp-home-layout-caption">Ảnh minh họa AI · Chọn chất liệu để xem quy cách in.</p></>}
