import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Image as ImageIcon, LayoutTemplate, Package, Layers, CalendarDays, ArrowUpRight } from "lucide-react";
import AdminShell from "../components/admin/AdminShell";
import { allBlogArticles, selectPublicArticles } from "../lib/blog-posts";
import { companyPages, guidePages, industryPages } from "../lib/content-pages";
import { seasonalPages } from "../lib/seasonal-pages";
import { products } from "../lib/products";
export const metadata: Metadata = {title:"Trung tâm quản trị | VinPrint",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
function date(value:string|Date){return new Date(value).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"});}
export default function AdminHomePage(){
 const now=new Date(),live=selectPublicArticles(allBlogArticles,now);
 const pages=Object.keys(companyPages).length+Object.keys(industryPages).length+Object.keys(guidePages).length;
 const stats=[{label:"Bài viết đang hiển thị",value:live.length,note:`${allBlogArticles.length-live.length} bài chưa hiển thị`,icon:FileText},{label:"Trang sản phẩm",value:products.length,note:"Danh mục sản phẩm VinPrint",icon:Package},{label:"Trang nội dung",value:pages,note:"Giới thiệu, ngành & hướng dẫn",icon:Layers},{label:"Trang mùa vụ",value:Object.keys(seasonalPages).length,note:"Nội dung theo chiến dịch",icon:CalendarDays}];
 const months=Array.from({length:6},(_,i)=>{const d=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-5+i,1));const key=d.toISOString().slice(0,7);return {label:`T${d.getUTCMonth()+1}/${String(d.getUTCFullYear()).slice(2)}`,count:live.filter(a=>a.publishAt.slice(0,7)===key).length};});
 const max=Math.max(1,...months.map(m=>m.count));
 return <AdminShell active="home"><main className="admin-overview"><header className="overview-intro"><div><h1>Chào anh, mừng anh trở lại 👋</h1><p>Tổng quan nội dung và hình ảnh của VinPrint hôm nay.</p></div><span className="overview-date">{date(now)}</span></header>
 <dl className="overview-stats">{stats.map(s=><div className="overview-stat" key={s.label}><span className="stat-icon"><s.icon size={19}/></span><dt>{s.label}</dt><dd>{s.value}</dd><dd>{s.note}</dd></div>)}</dl>
 <div className="overview-columns"><section className="overview-panel" aria-labelledby="publishing-title"><div className="overview-panel-header"><div><h2 id="publishing-title">Nhịp đăng bài</h2><p className="panel-note">Số bài đang hiển thị, theo tháng đăng trong 6 tháng gần nhất.</p></div><span className="overview-date">6 tháng</span></div><div className="overview-chart" role="img" aria-label={months.map(m=>`${m.label}: ${m.count} bài`).join(", ")}>{months.map(m=><div className="chart-column" key={m.label}><strong>{m.count}</strong><span className="bar" style={{height:Math.max(2,m.count/max*155)}}/><small>{m.label}</small></div>)}</div><p className="panel-note">Dữ liệu từ danh sách bài viết. Bài hẹn giờ và bài ẩn không được tính.</p></section>
 <section className="overview-panel"><div className="overview-panel-header"><div><h2>Bài viết mới nhất</h2><p className="panel-note">Nội dung đang hiển thị trên website.</p></div><Link href="/admin/bai-viet">Xem tất cả →</Link></div><ul className="overview-recent">{live.slice(0,4).map(a=><li key={a.slug}><Link href={`/blog/${a.slug}`} target="_blank">{a.title}</Link><p><span className="article-dot"/>Đang hiển thị · {date(a.publishAt)}</p></li>)}</ul>{!live.length&&<p className="panel-note">Chưa có bài viết đang hiển thị.</p>}</section></div>
 <div className="overview-actions">{[{href:"/admin/noi-dung",title:"Nội dung trang chủ",description:"Banner, bảng giá, FAQ & liên hệ",icon:LayoutTemplate},{href:"/admin/hinh-anh",title:"Hình ảnh & video",description:"Bộ ảnh Tết, ảnh sản phẩm & thư viện",icon:ImageIcon},{href:"/admin/bai-viet",title:"Cẩm nang in ấn",description:"Bài viết, chuyên mục & lịch đăng",icon:FileText}].map(a=><Link key={a.href} href={a.href}><a.icon size={24}/><span className="flex-1"><strong>{a.title}</strong><small>{a.description}</small></span><ArrowUpRight size={16}/></Link>)}</div>
 <aside className="overview-reminder"><strong className="text-blue-600">Chuẩn bị mùa Tết</strong><p>Kiểm tra hạn chót nhận đơn và lịch nghỉ trong nội dung mùa vụ trước khi công bố. Ảnh sản phẩm Tết là mẫu minh họa thiết kế.</p></aside>
 </main></AdminShell>;
}
