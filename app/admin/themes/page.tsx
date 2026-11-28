import type {Metadata} from "next";
import AdminShell from "../../components/admin/AdminShell";
import SeasonalThemeAdmin from "../../components/admin/SeasonalThemeAdmin";
export const metadata:Metadata={title:"Theme theo dịp lễ | VinPrint",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default function ThemesPage(){return <AdminShell active="themes"><SeasonalThemeAdmin/></AdminShell>;}
