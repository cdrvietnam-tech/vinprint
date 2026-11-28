import assert from "node:assert/strict";
import {test} from "node:test";
import {handleFreeToolRequest,allowedPublicSource,museAssetPath} from "../app/lib/free-tools-api";
import {freeTools,downloadFileName} from "../app/lib/free-tools";
const origin="http://localhost";
test("nine free tools have unique ids and preserve the standard sharpening mode",()=>{assert.equal(freeTools.length,9);assert.equal(new Set(freeTools.map(t=>t.id)).size,9);assert.ok(freeTools.find(t=>t.id==="enhance")?.name.includes("thường"));});
test("download extension follows actual file content rather than an opaque album URL",()=>{assert.equal(downloadFileName("vinprint-album-1.png","image/jpeg"),"vinprint-album-1.jpg");assert.equal(downloadFileName("vinprint-video-1.mp4","video/mp4"),"vinprint-video-1.mp4");});
test("image proxy rebuilds a free request, never forwards paid options or user credentials",async()=>{
 const form=new FormData();form.set("file",new File([new Uint8Array([1,2])],"x.png",{type:"image/png"}));form.set("mode","restore");form.set("quality","ai");form.set("token","never-forward");
 let calls=0;
 const fetchImpl=(async(target:unknown,options:RequestInit)=>{calls++;assert.equal(target,"https://www.muse-aistudio.com/api/image-tools");const payload=options.body as FormData;assert.equal(payload.get("mode"),"enhance");assert.equal(payload.get("quality"),"standard");assert.equal(payload.get("token"),null);assert.equal(options.headers,undefined);return Response.json({success:true,resultUrl:"/clean_media/output.png",creditsDeducted:0,engine:"private"});}) as typeof fetch;
 const response=await handleFreeToolRequest(new Request(origin+"/api/free-tools/enhance",{method:"POST",body:form,headers:{authorization:"Bearer secret",cookie:"session=private"}}),{fetchImpl});assert.equal(response.status,200);const text=await response.text();assert.doesNotMatch(text,/private|secret|engine/);assert.match(text,/creditsDeducted":0/);assert.equal(calls,1);
});
test("paid tools, foreign origins, invalid uploads and private URLs are rejected before contacting Muse",async()=>{
 const fetchImpl=(async()=>{throw Error("must not fetch");}) as typeof fetch;
 for(const action of ["restore","outpaint","enhance_ai"]){assert.equal((await handleFreeToolRequest(new Request(origin+"/api/free-tools/"+action,{method:"POST"}),{fetchImpl})).status,404);}
 assert.equal((await handleFreeToolRequest(new Request(origin+"/api/free-tools/enhance",{method:"POST",headers:{origin:"https://elsewhere.example"}}),{fetchImpl})).status,403);
 for(const source of ["http://127.0.0.1:5000/api/health","https://169.254.169.254/latest","https://vinprint.vn@evil.example/a","https://evil.example/image.jpg"]){assert.equal(allowedPublicSource(source,"platform"),false);assert.equal((await handleFreeToolRequest(new Request(origin+"/api/free-tools/asset?source="+encodeURIComponent(source)),{fetchImpl})).status,400);}
 const file=new FormData();file.set("file",new File(["<svg/>"],"test.svg",{type:"image/svg+xml"}));assert.equal((await handleFreeToolRequest(new Request(origin+"/api/free-tools/enhance",{method:"POST",body:file}),{fetchImpl})).status,400);
 assert.equal(museAssetPath("/uploads/../secret.png"),false);
});
test("service errors are actionable and do not expose backend details or fabricate success",async()=>{
 const request=()=>new Request(origin+"/api/free-tools/video",{method:"POST",body:JSON.stringify({url:"https://www.youtube.com/watch?v=test"})});
 const response=await handleFreeToolRequest(request(),{fetchImpl:(async()=>Response.json({success:false,message:"RunningHub ComfyUI GPU localhost internal"},{status:500})) as typeof fetch});assert.equal(response.status,502);const body=await response.text();assert.doesNotMatch(body,/RunningHub|ComfyUI|GPU|localhost|internal/);assert.match(body,/"success":false/);
});
test("video asset requests preserve byte ranges for preview and seeking",async()=>{
 const fetchImpl=(async(_url:unknown,options:RequestInit)=>{assert.deepEqual(options.headers,{range:"bytes=0-9"});return new Response(new Uint8Array(10),{status:206,headers:{"content-type":"video/mp4","content-range":"bytes 0-9/100","accept-ranges":"bytes"}});}) as typeof fetch;
 const response=await handleFreeToolRequest(new Request(origin+"/api/free-tools/asset?source="+encodeURIComponent("/clean_media/video.mp4"),{headers:{range:"bytes=0-9"}}),{fetchImpl});assert.equal(response.status,206);assert.equal(response.headers.get("content-range"),"bytes 0-9/100");
});
test("packaged Worker renders the native tool hub and blocks paid endpoints",async()=>{
 const {default:worker}=await import(new URL("../dist/server/index.js?free-tools",import.meta.url).href);
 const ctx={waitUntil(){},passThroughOnException(){}};
 const page=await worker.fetch(new Request("http://localhost/cong-cu-mien-phi?tool=pdf"),{},ctx);assert.equal(page.status,200);const html=await page.text();assert.match(html,/PDF sang PNG/);assert.match(html,/https:\/\/vinprint.vn\/cong-cu-mien-phi/);assert.doesNotMatch(html,/<iframe/);assert.match(page.headers.get("content-security-policy")||"",/worker-src 'self' blob:/);
 assert.equal((await worker.fetch(new Request("http://localhost/api/free-tools/restore",{method:"POST"}),{},ctx)).status,404);
});
