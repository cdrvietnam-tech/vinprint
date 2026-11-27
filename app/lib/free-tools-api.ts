import {IMAGE_LIMIT,validateImageFile,type FreeAsset} from "./free-tools";
const DEFAULT_ORIGIN="https://www.muse-aistudio.com";
const imageHost=/^(?:vinprint\.vn|www\.vinprint\.vn|www\.muse-aistudio\.com|(?:[a-z0-9-]+\.)*(?:susercontent\.com|shopee\.vn|shopeemobile\.com|alicdn\.com|lazcdn\.com|lazada\.vn|tiki\.vn|tikicdn\.com|tiktokcdn\.com|tiktokcdn-us\.com|byteimg\.com|ibytedtos\.com))$/i;
const platformHost=/^(?:vinprint\.vn|www\.vinprint\.vn|(?:[a-z0-9-]+\.)*(?:shopee\.vn|shp\.ee|tiki\.vn|lazada\.vn|tiktok\.com|tiktokshop\.com|taobao\.com|tmall\.com|1688\.com|douyin\.com|facebook\.com|fb\.watch|youtube\.com|youtu\.be|instagram\.com))$/i;
export function allowedPublicSource(value:unknown,kind:"image"|"platform"){
 if(typeof value!=="string"||value.length>4096)return false;
 try{const u=new URL(value);return u.protocol==="https:"&&!u.username&&!u.password&&!u.port&&(kind==="image"?imageHost:platformHost).test(u.hostname);}catch{return false;}
}
export function museAssetPath(value:unknown){return typeof value==="string"&&/^\/(?:clean_media|uploads)\/[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|avif|gif|mp4|webm|mp3|m4a)$/i.test(value)&&!value.includes("..");}
const json=(status:number,value:unknown)=>Response.json(value,{status,headers:{"cache-control":"no-store"}});
const fail=(status=502)=>json(status,{success:false,message:"Chưa xử lý được yêu cầu này. Anh thử file nhỏ hơn hoặc thử lại sau ít phút nhé."});
type Options={origin?:string;fetchImpl?:typeof fetch};
// Rebuild every request: no client mode, token, cookie or paid quality reaches Muse.
export async function handleFreeToolRequest(request:Request,{origin=DEFAULT_ORIGIN,fetchImpl=fetch}:Options={}){
 const url=new URL(request.url),action=url.pathname.split("/").pop()||"";
 const local=["127.0.0.1","localhost"].includes(url.hostname);
 const caller=request.headers.get("origin");
 if(caller&&caller!==url.origin&&!(local&&/^http:\/\/(?:127\.0\.0\.1|localhost):418[01]$/.test(caller)))return fail(403);
 const base=new URL(origin).origin;
 if(action==="asset"){
  if(request.method!=="GET")return fail(405);
  const source=url.searchParams.get("source")||"";
  if(!museAssetPath(source)&&!allowedPublicSource(source,"image"))return fail(400);
  try{
   const target=museAssetPath(source)?base+source:source;
   const range=request.headers.get("range");
   if(range&&!/^bytes=\d*-\d*$/.test(range))return fail(400);
   const r=await fetchImpl(target,{signal:AbortSignal.timeout(30000),redirect:"error",...(range?{headers:{range}}:{})});
   const type=r.headers.get("content-type")?.split(";")[0]||"";
   if(!r.ok||!(/^(?:image\/(?:png|jpeg|webp|gif|avif)|video\/(?:mp4|webm)|audio\/(?:mpeg|mp4|x-m4a)|application\/octet-stream)$/.test(type)))return fail();
   if(Number(r.headers.get("content-length")||0)>100*1024*1024)return fail(413);
   const outputHeaders=new Headers({"content-type":type,"cache-control":"no-store","x-content-type-options":"nosniff","content-disposition":"inline"});
   for(const key of ["content-range","accept-ranges"])if(r.headers.has(key))outputHeaders.set(key,r.headers.get(key)!);
   return new Response(r.body,{status:r.status,headers:outputHeaders});
  }catch{return fail();}
 }
 if(!["enhance","remove-bg","white-bg","erase","album","video"].includes(action))return fail(404);
 if(request.method!=="POST")return fail(405);
 if(Number(request.headers.get("content-length")||0)>35*1024*1024)return fail(413);
 try{
  let endpoint:string,body:FormData|string,headers:Record<string,string>|undefined;
  if(["enhance","remove-bg","white-bg"].includes(action)){
   const input=await request.formData(),file=input.get("file");
   if(!file||typeof file==="string")return fail(400);
   const validation=validateImageFile(file);if(validation)return json(400,{success:false,message:validation});
   if(file.size>IMAGE_LIMIT)return fail(413);
   const form=new FormData();form.set("file",file,"vinprint-input."+(file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg"));
   endpoint=action==="enhance"?"/api/image-tools":"/api/remove-background";
   if(action==="enhance"){form.set("mode","enhance");form.set("quality","standard");form.set("scale","2x");}
   body=form;
  }else{
   const text=await request.text();if(text.length>35*1024*1024)return fail(413);
   const input=JSON.parse(text);headers={"content-type":"application/json"};
   if(action==="erase"){
    const dataImage=(value:unknown)=>typeof value==="string"&&/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(value)&&value.length<=17*1024*1024;
    if(!dataImage(input.image)||!dataImage(input.mask))return fail(400);
    endpoint="/api/magic-eraser";body=JSON.stringify({image:input.image,mask:input.mask,radius:5,method:"lama"});
   }else{
    if(!allowedPublicSource(input.url,"platform"))return json(400,{success:false,message:"Dán liên kết HTTPS công khai từ sàn thương mại hoặc nền tảng video được hỗ trợ."});
    endpoint=action==="album"?"/api/scrape-product-images":"/api/download-social-video";
    body=JSON.stringify({url:input.url,...(action==="video"?{quality:"best"}:{})});
   }
  }
  const r=await fetchImpl(base+endpoint,{method:"POST",body,headers,signal:AbortSignal.timeout(95000),redirect:"error"});
  const data=await r.json() as Record<string,unknown>;
  if(!r.ok||data.success!==true||Number(data.creditsDeducted||0)>0)return fail(r.status===429?429:502);
  const sources=action==="album"&&Array.isArray(data.images)?data.images.slice(0,24).map(i=>typeof i==="string"?i:(i as {url?:unknown}).url):[data.resultUrl||data.imageUrl||data.cleanedUrl||data.downloadUrl||data.videoUrl];
  const assets:FreeAsset[]=[];
  for(const source of [...new Set(sources)]){
   if(!museAssetPath(source)&&!allowedPublicSource(source,"image"))continue;
   const path=String(source),type=/\.(?:mp4|webm)(?:\?|$)/i.test(path)?"video":/\.(?:mp3|m4a)(?:\?|$)/i.test(path)?"audio":"image";
   assets.push({url:"/api/free-tools/asset?source="+encodeURIComponent(path),name:`vinprint-${action}-${assets.length+1}`+(type==="video"?".mp4":type==="audio"?".mp3":/\.webp(?:\?|$)/i.test(path)?".webp":/\.jpe?g(?:\?|$)/i.test(path)?".jpg":".png"),type});
  }
  if(!assets.length)return fail();
  return json(200,{success:true,assets,brandMarked:data.brandMarked===true,creditsDeducted:0});
 }catch{return fail();}
}
