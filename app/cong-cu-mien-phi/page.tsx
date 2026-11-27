import type {Metadata} from "next";
import FreeToolsHub from "../components/free-tools/FreeToolsHub";
export const metadata:Metadata={title:"Công cụ ảnh và file miễn phí",description:"Nén ảnh, đổi HEIC, xuất PDF, tách nền, làm nét và chuẩn bị ảnh ngay trong VinPrint.",alternates:{canonical:"/cong-cu-mien-phi"}};
export default async function FreeToolsPage({searchParams}:{searchParams:Promise<{tool?:string}>}){const {tool}=await searchParams;return <FreeToolsHub initialTool={tool}/>;}
