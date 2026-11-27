// Local harness for the packaged Cloudflare Worker, including its static asset binding.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import worker from "../dist/server/index.js";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const mime={".js":"text/javascript",".css":"text/css",".woff":"font/woff",".woff2":"font/woff2",".json":"application/json",".txt":"text/plain",".pfb":"application/octet-stream",".ttf":"font/ttf",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".pack":"application/octet-stream"};
async function asset(request){
 const pathname=decodeURIComponent(new URL(request.url).pathname);
 for(const folder of ["dist/client","public"]){const base=path.resolve(root,folder),file=path.resolve(base,"."+pathname);if(!file.startsWith(base+path.sep))continue;try{const stat=await fs.stat(file);if(!stat.isFile())continue;return new Response(await fs.readFile(file),{headers:{"content-type":mime[path.extname(file)]||"application/octet-stream"}});}catch{}}
 return new Response("Not found",{status:404});
}
http.createServer(async(req,res)=>{try{const url=new URL(req.url,"http://127.0.0.1:4182"),headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(typeof value==="string")headers.set(key,value);const body=[];for await(const chunk of req)body.push(chunk);const request=new Request(url,{method:req.method,headers,...(["GET","HEAD"].includes(req.method)?{}:{body:Buffer.concat(body)})});let response;if(url.pathname.startsWith("/assets/")||url.pathname.startsWith("/vendor/"))response=await asset(request);else response=await worker.fetch(request,{ASSETS:{fetch:asset},MUSE_FREE_TOOLS_ORIGIN:"http://127.0.0.1:5000"},{waitUntil(){},passThroughOnException(){}});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){console.error(e.message);res.writeHead(500);res.end("Local Worker preview unavailable");}}).listen(4182,"127.0.0.1",()=>console.log("Packaged VinPrint Worker preview http://127.0.0.1:4182"));
