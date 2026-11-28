import http from "node:http";
import net from "node:net";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_SITE_CONTENT, isValidSiteContent, mergeSiteContent } from "../app/lib/site-content.ts";
import {createPreviewMedia} from "./preview-media.mjs";
const builtPort=Number(process.env.VINPRINT_PREVIEW_BUILT_PORT||0);
if(builtPort&&builtPort!==4182)throw Error("Built preview must use local port 4182");
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const mediaHandler=await createPreviewMedia(root);
const stateFile=path.join(root,".preview","site-content.json");
await fs.mkdir(path.dirname(stateFile),{recursive:true});
try{await fs.access(stateFile);}catch{
  let initial={};
  try{const r=await fetch("https://vinprint.vn/api/site-content",{signal:AbortSignal.timeout(10000)});if(r.ok)initial=await r.json();}catch{}
  await fs.writeFile(stateFile,JSON.stringify(mergeSiteContent(initial),null,2));
}
async function localContent(){try{return mergeSiteContent(JSON.parse(await fs.readFile(stateFile,"utf8")));}catch{return DEFAULT_SITE_CONTENT;}}
function json(res,status,value){res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"});res.end(JSON.stringify(value));}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,"http://127.0.0.1:4181");
  try{if(await mediaHandler(req,res,url,json))return;}catch{json(res,413,{error:"local_media_request_failed"});return;}
  if(url.pathname==="/api/site-content"&&req.method==="GET"){return json(res,200,await localContent());}
  if(url.pathname==="/api/admin/site-content"){
    const origin=req.headers.origin;
    if(origin&&!["http://127.0.0.1:4181","http://localhost:4181"].includes(origin))return json(res,403,{error:"Local preview only"});
    if(req.method==="GET")return json(res,200,await localContent());
    if(req.method==="DELETE"){await fs.writeFile(stateFile,JSON.stringify(DEFAULT_SITE_CONTENT,null,2));return json(res,200,{ok:true,scope:"local-preview"});}
    if(req.method==="PUT"){
      let body="";for await(const chunk of req){body+=chunk;if(body.length>200000)return json(res,413,{error:"content_too_large"});}
      try{const value=JSON.parse(body);if(!isValidSiteContent(value))return json(res,400,{error:"invalid_content"});await fs.writeFile(stateFile,JSON.stringify(mergeSiteContent(value),null,2));return json(res,200,{ok:true,scope:"local-preview"});}catch{return json(res,400,{error:"invalid_json"});}
    }
    return json(res,405,{error:"method_not_allowed"});
  }
  if(req.method==="GET"&&(url.pathname==="/api/media/collections"||url.pathname.startsWith("/media/"))){
    try{const r=await fetch("https://vinprint.vn"+url.pathname+url.search,{signal:AbortSignal.timeout(10000)});res.writeHead(r.status,{"content-type":r.headers.get("content-type")||"application/octet-stream","cache-control":"no-store"});res.end(Buffer.from(await r.arrayBuffer()));return;}catch{return json(res,503,{error:"media_unavailable"});}
  }
  const port=builtPort||4180;
  const upstream=http.request({hostname:"127.0.0.1",port,path:req.url,method:req.method,headers:{...req.headers,host:"127.0.0.1:"+port}},r=>{const headers={...r.headers};if(headers.location){const target=new URL(headers.location,"http://127.0.0.1:"+port);if(target.hostname==="127.0.0.1"&&target.port===String(port))headers.location=target.pathname+target.search+target.hash;}res.writeHead(r.statusCode||502,headers);r.pipe(res);});
  upstream.on("error",()=>{if(!res.headersSent)res.writeHead(502);res.end("Preview application unavailable");});
  req.pipe(upstream);
});
server.on("upgrade",(req,socket,head)=>{
  const upstream=net.connect(4180,"127.0.0.1",()=>{upstream.write((req.method||"GET")+" "+req.url+" HTTP/1.1\r\n"+Object.entries({...req.headers,host:"127.0.0.1:4180"}).map(([k,v])=>k+": "+v).join("\r\n")+"\r\n\r\n");if(head.length)upstream.write(head);socket.pipe(upstream).pipe(socket);});
  upstream.on("error",()=>socket.destroy());socket.on("error",()=>upstream.destroy());
});
server.listen(4181,"127.0.0.1",()=>console.log("VinPrint integrated preview http://127.0.0.1:4181 — content writes stay in .preview/site-content.json"));
