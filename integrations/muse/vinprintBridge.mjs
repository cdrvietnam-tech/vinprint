import {timingSafeEqual} from "node:crypto";
const verified=new WeakSet();
export const isVinprintRequest=req=>verified.has(req);
const routes={enhance:"/api/image-tools","remove-bg":"/api/remove-background","white-bg":"/api/remove-background",erase:"/api/magic-eraser",album:"/api/scrape-product-images",video:"/api/download-social-video",cdr:"/api/cdr/import-vector"};
export function createVinprintBridge({getKey}){return (req,res,next)=>{
 if(!req.url.startsWith("/api/vinprint-tools/"))return next();
 const action=req.url.slice("/api/vinprint-tools/".length);
 const actual=Buffer.from(String(req.headers["x-vinprint-key"]||"")),expected=Buffer.from(String(getKey()||""));
 if(expected.length<32||actual.length!==expected.length||!timingSafeEqual(actual,expected))return res.status(403).json({success:false,message:"Không có quyền xử lý."});
 if(req.method!=="POST"||!routes[action])return res.status(404).json({success:false,message:"Không có công cụ này."});
 // Authenticated bridge paths are fixed; no arbitrary URLs or paid actions.
 verified.add(req);delete req.headers.authorization;delete req.headers.cookie;
 req.url=routes[action];next();
 };}
