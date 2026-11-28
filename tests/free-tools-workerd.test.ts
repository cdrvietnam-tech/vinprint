import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import path from "node:path";
import {build} from "esbuild";
import {Miniflare} from "miniflare";

test("workerd can proxy assets, image jobs and CDR without following redirects",{timeout:120000},async()=>{
 const hits:string[]=[];let redirectPost=false;
 const backend=http.createServer(async(req,res)=>{hits.push(req.url||"");for await(const _chunk of req){void _chunk;}assert.equal(req.headers.authorization,undefined);assert.equal(req.headers.cookie,undefined);
  if(req.url==="/uploads/redirect.png"||redirectPost){res.writeHead(302,{location:"/should-not-follow"});res.end();return;}
  if(req.url==="/clean_media/result.png"){res.writeHead(200,{"content-type":"image/png"});res.end(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6UisAAAAASUVORK5CYII=","base64"));return;}
  res.setHeader("content-type","application/json");res.end(JSON.stringify(req.url==="/api/cdr/import-vector"?{svg:'<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>'}:{success:true,resultUrl:"/clean_media/result.png",creditsDeducted:0}));
 });
 await new Promise<void>(resolve=>backend.listen(0,"127.0.0.1",resolve));const address=backend.address() as {port:number};let runtime:Miniflare|undefined;
 try{const entry=JSON.stringify(path.resolve("app/lib/free-tools-api.ts"));const bundle=await build({stdin:{contents:`import {handleFreeToolRequest} from ${entry};export default {fetch(request,env){return handleFreeToolRequest(request,{origin:env.ORIGIN});}}`,resolveDir:process.cwd(),sourcefile:"runtime-check.ts"},bundle:true,write:false,format:"esm",platform:"browser",target:"es2022"});runtime=new Miniflare({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:"2025-01-01",bindings:{ORIGIN:`http://127.0.0.1:${address.port}`}});
  const post=async(action:string,form:FormData)=>{const request=new Request("https://vinprint.vn/api/free-tools/"+action,{method:"POST",body:form,headers:{authorization:"Bearer private",cookie:"session=private"}});return runtime!.dispatchFetch(request.url,{method:"POST",headers:Object.fromEntries(request.headers),body:await request.arrayBuffer()});};
  const image=new FormData();image.set("file",new File([new Uint8Array([1,2])],"sample.png",{type:"image/png"}));const enhanced=await post("enhance",image);assert.equal(enhanced.status,200,"workerd image job must reach the backend");
  const asset=await runtime.dispatchFetch("https://vinprint.vn/api/free-tools/asset?source="+encodeURIComponent("/clean_media/result.png"));assert.equal(asset.status,200);assert.equal(asset.headers.get("content-type"),"image/png");assert.ok((await asset.arrayBuffer()).byteLength>0);
  const form=new FormData();form.set("file",new File([new Uint8Array([82,73,70,70,8,0,0,0,67,68,82,68,0,0,0,0])],"sample.cdr"));const cdr=await post("cdr",form);assert.equal(cdr.status,200);assert.match(await cdr.text(),/<svg/);
  const redirected=await runtime.dispatchFetch("https://vinprint.vn/api/free-tools/asset?source="+encodeURIComponent("/uploads/redirect.png"));assert.equal(redirected.status,502);redirectPost=true;const again=new FormData();again.set("file",new File([new Uint8Array([1,2])],"sample.png",{type:"image/png"}));assert.equal((await post("enhance",again)).status,502);assert.equal(hits.includes("/should-not-follow"),false);
 }finally{await runtime?.dispose();backend.closeAllConnections();await new Promise<void>(resolve=>backend.close(()=>resolve()));}
});
