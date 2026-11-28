// One conditional R2 document serializes admissions across Worker isolates/locations.
// Never use caller-supplied forwarding headers. Cloudflare overwrites CF-Connecting-IP.
type Bucket=Pick<R2Bucket,"get"|"put">;
type Counter={minute:number;minuteCount:number;dayCount:number};
type State={day:number;hour:number;hourCount:number;ips:Record<string,Counter>;leases:{id:string;until:number}[]};
const key="limits/vinprint-free-tools-v1.json";
export function limitedResponse(status=429,retry=60){return Response.json({success:false,message:status===429?"Đã đạt giới hạn xử lý miễn phí. Anh chờ một lát rồi thử lại, hoặc gửi file qua Zalo để được hỗ trợ.":"Công cụ đang tạm nghỉ. Anh thử lại sau hoặc gửi file qua Zalo nhé."},{status,headers:{"cache-control":"no-store","retry-after":String(retry)}});}
async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,"0")).join("");}
export async function admitFreeTool(request:Request,bucket?:Bucket,now=Date.now()):Promise<{response?:Response;release:()=>Promise<void>}>{
 const denied=(status=429,retry=60)=>({response:limitedResponse(status,retry),release:async()=>{}});
 if(!bucket)return denied(503);
 const url=new URL(request.url),local=["localhost","127.0.0.1"].includes(url.hostname);
 const ip=local?"local-preview":request.headers.get("cf-connecting-ip");
 if(!ip||ip.length>64||!/^[:.a-fA-F0-9]+$/.test(ip)&&!local)return denied(503);
 // IPv6 /64 buckets prevent cheap per-interface address rotation.
 let identity=ip;
 if(ip.includes(":")){try{const host=new URL("http://["+ip+"]").hostname.slice(1,-1),parts=host.split("::"),a=parts[0]?parts[0].split(":"):[],b=parts[1]?parts[1].split(":"):[];identity=[...a,...Array(8-a.length-b.length).fill("0"),...b].slice(0,4).map(v=>parseInt(v||"0",16).toString(16)).join(":")+"/64";}catch{return denied(503);}}
 const day=Math.floor(now/86400000),minute=Math.floor(now/60000),hour=Math.floor(now/3600000);
 const asset=url.pathname.endsWith("/asset"),hash=await digest(day+":"+identity+":"+(asset?"asset":"job")),id=crypto.randomUUID();
 try{for(let attempt=0;attempt<8;attempt++){
  const current=await bucket.get(key);let state:State=current?await current.json():{day,hour,hourCount:0,ips:{},leases:[]};
  if(state.day!==day)state={day,hour,hourCount:0,ips:{},leases:[]};
  if(state.hour!==hour){state.hour=hour;state.hourCount=0;}
  state.leases=state.leases.filter(l=>l.until>now);
  const counter=state.ips[hash]||{minute,minuteCount:0,dayCount:0};
  if(counter.minute!==minute){counter.minute=minute;counter.minuteCount=0;}
  if(counter.dayCount>=(asset?120:12))return denied(429,Math.ceil(((day+1)*86400000-now)/1000));
  if(counter.minuteCount>=(asset?20:2))return denied(429,Math.ceil(((minute+1)*60000-now)/1000));
  if(!asset&&(state.leases.length>=2||state.hourCount>=100))return denied();
  if(!state.ips[hash]&&Object.keys(state.ips).length>=4096)return denied();
  counter.minuteCount++;counter.dayCount++;state.ips[hash]=counter;
  if(!asset){state.hourCount++;state.leases.push({id,until:now+110000});}
  const saved=await bucket.put(key,JSON.stringify(state),{onlyIf:current?{etagMatches:current.etag}:{etagDoesNotMatch:"*"},httpMetadata:{contentType:"application/json",cacheControl:"no-store"}});
  if(!saved)continue;
  return {release:async()=>{if(asset)return;try{for(let n=0;n<8;n++){const entry=await bucket.get(key);if(!entry)return;const latest=await entry.json<State>();latest.leases=latest.leases.filter(l=>l.id!==id);if(await bucket.put(key,JSON.stringify(latest),{onlyIf:{etagMatches:entry.etag},httpMetadata:{contentType:"application/json",cacheControl:"no-store"}}))return;}}catch{/* Lease expires; fail closed until then. */}}};
 }}catch{return denied(503);}
 return denied();
}
