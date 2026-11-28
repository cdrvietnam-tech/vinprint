// Isolated local integration harness. Never registers routes on the live Muse server.
import http from "node:http";import fs from "node:fs/promises";import path from "node:path";import {pathToFileURL,fileURLToPath} from "node:url";import crypto from "node:crypto";
import {createVinprintBridge} from "../integrations/muse/vinprintBridge.mjs";import {createCutoutService} from "../integrations/muse/cutoutService.mjs";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),storage=path.join(root,".preview/private-bridge");await fs.mkdir(storage,{recursive:true});
const key=crypto.randomBytes(32).toString("hex");await fs.writeFile(path.join(storage,"key"),key);const processor=createCutoutService();
const museRoot=path.resolve(process.env.MUSE_SOURCE_DIR||"D:/CLONEVIDEO");const {runStandardSharpen}=await import(pathToFileURL(path.join(museRoot,"server/services/sharpenService.js")));
const bridge=createVinprintBridge({getKey:()=>key});const upstream="http://127.0.0.1:5000";
const server=http.createServer(async(req,res)=>{try{
 if(req.url.startsWith("/clean_media/")){const filename=path.basename(req.url);if(!/^[a-zA-Z0-9_.-]+$/.test(filename))throw Error();try{const data=await fs.readFile(path.join(storage,filename));res.writeHead(200,{"content-type":"image/png","cache-control":"no-store"});res.end(data);return;}catch{/* Native Muse assets are proxied below. */}}
 const original=req.url;let accepted=false;const adapter={status(code){res.statusCode=code;return this;},json(data){res.setHeader("content-type","application/json");res.end(JSON.stringify(data));}};
 if(original.startsWith("/api/vinprint-tools/"))bridge(req,adapter,()=>accepted=true);else if(!original.startsWith("/clean_media/")&&!original.startsWith("/uploads/")){res.writeHead(404);res.end();return;}
 if(res.writableEnded)return;
 const chunks=[];let length=0;for await(const part of req){length+=part.length;if(length>35*1048576)throw Error();chunks.push(part);}const body=Buffer.concat(chunks);
 if(accepted&&["/api/remove-background","/api/image-tools"].includes(req.url)){
 const form=await new Request("http://localhost",{method:"POST",headers:{"content-type":req.headers["content-type"]},body}).formData();const file=form.get("file");if(!file||typeof file==="string"||file.size>12*1048576)throw Error();
 const id=crypto.randomUUID(),input=path.join(storage,id+".input"),output=path.join(storage,id+".png");await fs.writeFile(input,Buffer.from(await file.arrayBuffer()));let asset;
 try{if(req.url==="/api/remove-background"){await processor.run(input,output);asset="/clean_media/"+path.basename(output);}else{const result=await runStandardSharpen({inputPath:input,outputDir:storage,scale:"2x"});asset="/clean_media/"+result.filename;}}finally{await fs.unlink(input).catch(()=>{});}
 adapter.json({success:true,imageUrl:asset,resultUrl:asset,brandMarked:false,creditsDeducted:0});return;
 }
 const headers={};if(req.headers["content-type"])headers["content-type"]=req.headers["content-type"];if(req.headers.range)headers.range=req.headers.range;
 const response=await fetch(upstream+req.url,{method:req.method,headers,...(req.method==="GET"?{}:{body}),redirect:"manual",signal:AbortSignal.timeout(95000)});res.writeHead(response.status,Object.fromEntries([...response.headers].filter(([key])=>["content-type","content-range","accept-ranges"].includes(key))));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{if(!res.headersSent)res.writeHead(502,{"content-type":"application/json"});res.end(JSON.stringify({success:false,message:"Chưa xử lý được ảnh. Anh thử lại sau nhé."}));}});
server.listen(4184,"127.0.0.1",()=>console.log("Isolated VinPrint bridge preview :4184; live Muse routes unchanged."));
function close(){processor.close();server.closeAllConnections();server.close(()=>process.exit(0));}process.once("SIGINT",close);process.once("SIGTERM",close);
