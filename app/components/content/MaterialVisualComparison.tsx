"use client";
import Link from "next/link";
import Image from "next/image";
import {productBySlug} from "../../lib/products";
import {useRef,useState} from "react";
import {X,ZoomIn} from "lucide-react";
import "./material-visual-comparison.css";
const materials=[
 {slug:"tem-giay",name:"Decal giấy",look:"Nhãn có nền trên hộp kraft và tờ tem.",use:"Hộp giấy, túi kraft và bao bì khô.",check:"Tránh nước và ẩm kéo dài; thử độ bám nếu bao bì phủ màng."},
 {slug:"tem-nhua-chong-nuoc",name:"Decal nhựa chống nước",look:"Nhãn có nền trên chai đồ uống.",use:"Chai lọ có nguy cơ gặp hơi nước hoặc ẩm.",check:"Độ bám sau làm lạnh và loại keo phải thử trên đúng chai."},
 {slug:"tem-nhua-trong",name:"Decal nhựa trong",look:"Nhìn thấy màu chai phía sau chữ và logo.",use:"Bao bì cần giữ cảm giác trong suốt.",check:"Xem độ tương phản chữ trên màu bao bì; trao đổi lớp trắng nếu cần."},
 {slug:"tem-vang",name:"Tem vàng ánh kim",look:"Nền vàng bắt sáng trên tờ tem và nhãn hũ quà.",use:"Hộp quà, logo và bao bì tông ấm.",check:"Xem mẫu vật liệu thật; màu màn hình không thay thế hiệu ứng thực."},
 {slug:"tem-bac",name:"Tem bạc ánh kim",look:"Nền bạc phản sáng trên tờ tem và hộp kim loại.",use:"Nhãn thông số và logo tông kim loại.",check:"Kiểm tra khả năng đọc chữ nhỏ; màu bạc không chứng minh chịu nhiệt."},
 {slug:"tem-7-mau",name:"Tem hologram 7 màu",look:"Bề mặt nhiều sắc phản chiếu quanh hình tem.",use:"Sticker trang trí và điểm nhấn thương hiệu.",check:"Cần xem ở nhiều góc sáng; hiệu ứng không tự chứng minh chống giả."},
 {slug:"tem-uv-dtf",name:"Tem UV DTF nổi",look:"Họa tiết riêng lẻ trên cốc, không có viền nền bao quanh.",use:"Logo trên ly, chai và bề mặt cứng phù hợp.",check:"Thử độ bám và khả năng chuyển chi tiết nhỏ trên vật thật."},
];
type Material=typeof materials[number];
function Photo({material}:{material:Material}){return <Image unoptimized src={productBySlug[material.slug].image} width={1448} height={1086} alt={"Ảnh mẫu minh họa "+material.name}/>;}
export default function MaterialVisualComparison(){
 const [left,setLeft]=useState(materials[0].slug),[right,setRight]=useState(materials[1].slug),[zoom,setZoom]=useState<Material>(materials[0]);const dialog=useRef<HTMLDialogElement>(null);
 function openZoom(material:Material){setZoom(material);dialog.current?.showModal();}
 return <div className="vp-visual-comparison"><div className="vp-visual-heading"><h3>Nhìn mẫu để phân biệt chất liệu</h3><p>Đổi một bên để so sánh. Bấm ảnh để xem lớn.</p></div><div className="vp-visual-panes">{[{side:"left",label:"Mẫu bên trái",value:left,set:setLeft},{side:"right",label:"Mẫu bên phải",value:right,set:setRight}].map(pane=>{const material=materials.find(item=>item.slug===pane.value)!;return <div className="vp-visual-pane" data-comparison-side={pane.side} data-material={material.slug} key={pane.side}><label htmlFor={"compare-"+pane.side}>{pane.label}</label><select id={"compare-"+pane.side} value={pane.value} onChange={event=>pane.set(event.target.value)}>{materials.map(item=><option key={item.slug} value={item.slug}>{item.name}</option>)}</select><button className="vp-visual-photo" onClick={()=>openZoom(material)} aria-label={"Phóng to ảnh "+material.name}><Photo material={material}/><span><ZoomIn aria-hidden="true"/>Xem ảnh lớn</span></button><h4>{material.name}</h4><dl><div><dt>Nhìn trên mẫu</dt><dd>{material.look}</dd></div><div><dt>Nhu cầu phù hợp</dt><dd>{material.use}</dd></div><div><dt>Cần kiểm tra</dt><dd>{material.check}</dd></div></dl><Link href={"/san-pham/"+material.slug}>Xem quy cách {material.name.toLowerCase()} →</Link></div>;})}</div>{left===right&&<p role="status" className="vp-visual-same">Hai bên đang cùng một loại tem. Đổi một bên để xem sự khác nhau.</p>}<p className="vp-visual-disclaimer">Ảnh mẫu minh họa thiết kế và hiệu ứng, không phải kết quả thử vật liệu. Độ chịu nước, độ bám và màu thực tế cần được kiểm tra trên bao bì thật.</p><dialog ref={dialog} className="vp-visual-dialog" aria-labelledby="visual-zoom-title"><button className="vp-visual-close" aria-label="Đóng ảnh phóng to" onClick={()=>dialog.current?.close()}><X/></button><h3 id="visual-zoom-title">{zoom.name}</h3><div className="vp-visual-zoom-photo"><Photo material={zoom}/></div><p>{zoom.look} Ảnh mẫu minh họa.</p></dialog></div>;
}
