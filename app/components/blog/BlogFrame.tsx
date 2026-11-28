import type {ReactNode} from "react";
import GuideFrame from "../storefront/GuideFrame";
import "./blog-theme.css";
export default function BlogFrame({children}:{children:ReactNode}){return <GuideFrame activePath="/blog">{children}</GuideFrame>}
