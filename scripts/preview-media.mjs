import fs from "node:fs/promises";
import path from "node:path";
import {DEFAULT_MEDIA_COLLECTIONS} from "../app/lib/media-collections.ts";
import {applyTetProductImages} from "../app/lib/product-theme.ts";

export async function createPreviewMedia(root){
  const dir=path.join(root,".preview"), manifest=path.join(dir,"media-collections.json"), overridesFile=path.join(dir,"image-overrides.json");
  const read=async(file,fallback)=>{try{return JSON.parse(await fs.readFile(file,"utf8"));}catch{return fallback;}};
  const write=async(file,value)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,JSON.stringify(value,null,2));};
  try{await fs.access(manifest);}catch{
    const initial={};
    for(const collection of Object.keys(DEFAULT_MEDIA_COLLECTIONS)){
      try{const r=await fetch("https://vinprint.vn/api/media/collections?collection="+collection,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();initial[collection]=(await r.json()).items;}catch{initial[collection]=DEFAULT_MEDIA_COLLECTIONS[collection];}
    }
    await write(manifest,initial);
  }
  async function body(req,limit){const chunks=[];let size=0;for await(const c of req){size+=c.length;if(size>limit)throw Error("too_large");chunks.push(c);}return Buffer.concat(chunks);}
  const validId=id=>typeof id==="string"&&/^[a-z0-9][a-z0-9-]{2,80}$/i.test(id);
  const validCollection=c=>Object.hasOwn(DEFAULT_MEDIA_COLLECTIONS,c);
  const types=new Set(["image/png","image/jpeg","image/webp","image/avif","image/gif","video/mp4","video/webm"]);
  return async(req,res,url,json)=>{
    const admin=url.pathname.startsWith("/api/admin/");
    if(admin&&req.headers.origin&&!["http://127.0.0.1:4181","http://localhost:4181"].includes(req.headers.origin)){json(res,403,{error:"local_only"});return true;}
    if(url.pathname==="/api/media/collections"||url.pathname==="/api/admin/media-collections"){
      const collection=url.searchParams.get("collection");
      if(!validCollection(collection)){json(res,400,{error:"invalid_collection"});return true;}
      const data=await read(manifest,DEFAULT_MEDIA_COLLECTIONS);let items=data[collection]||[];
      const done=async()=>{data[collection]=items;await write(manifest,data);json(res,200,{ok:true,collection,items,version:Date.now()});return true;};
      if(req.method==="GET"){json(res,200,{collection,items});return true;}
      if(!admin){json(res,405,{error:"method_not_allowed"});return true;}
      const id=url.searchParams.get("id"), action=url.searchParams.get("action");
      if(req.method==="POST"){
        if(action==="theme-tet-2027"||action==="restore-tet-2027"){
          if(collection==="ai247"){json(res,400,{error:"invalid_collection"});return true;}
          const backup=path.join(dir,"theme-backups",collection+".json");
          if(action==="theme-tet-2027"){try{await fs.access(backup);}catch{await write(backup,items);}items=applyTetProductImages(collection,items);}
          else {const saved=await read(backup,null);if(!saved){json(res,404,{error:"backup_not_found"});return true;}items=saved;}
          return done();
        }
        if(action==="restore-missing"){const ids=new Set(items.map(i=>i.id));items=[...items,...DEFAULT_MEDIA_COLLECTIONS[collection].filter(i=>!ids.has(i.id))];return done();}
        const index=items.findIndex(i=>i.id===id), original=DEFAULT_MEDIA_COLLECTIONS[collection].find(i=>i.id===id);
        if(action==="restore-item"&&original){items=index<0?[...items,original]:items.map(i=>i.id===id?original:i);return done();}
        if(action==="update-meta"&&index>=0){const current=items[index];const href=url.searchParams.get("href");items[index]={...current,title:(url.searchParams.get("title")??current.title).trim().slice(0,120)||current.title,category:(url.searchParams.get("category")??current.category).trim().slice(0,80)||current.category,href:href?.startsWith("/")&&!href.startsWith("//")?href.slice(0,200):current.href};return done();}
        json(res,400,{error:"invalid_action"});return true;
      }
      if(!validId(id)){json(res,400,{error:"invalid_id"});return true;}
      if(req.method==="DELETE"){items=items.filter(i=>i.id!==id);return done();}
      if(req.method==="PUT"){
        const mime=(req.headers["content-type"]||"").split(";")[0];
        if(!types.has(mime)||(mime.startsWith("video/")&&!["hot-products","ai247"].includes(collection))){json(res,415,{error:"invalid_type"});return true;}
        const bytes=await body(req,mime.startsWith("video/")?95*1024*1024:12*1024*1024);
        if(!bytes.length){json(res,400,{error:"empty_file"});return true;}
        const file=path.join(dir,"media-assets",collection,id);await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes);await fs.writeFile(file+".mime",mime);
        const href=url.searchParams.get("href")||"/san-pham";
        const item={id,kind:mime.startsWith("video/")?"video":mime==="image/gif"?"gif":"image",src:`/media/collections/${collection}/${id}`,title:(url.searchParams.get("title")||"Mẫu sản phẩm mới").slice(0,120),category:(url.searchParams.get("category")||"Sản phẩm VinPrint").slice(0,80),href:href.startsWith("/")&&!href.startsWith("//")?href.slice(0,200):"/san-pham"};
        items=items.some(i=>i.id===id)?items.map(i=>i.id===id?item:i):[...items,item];return done();
      }
      json(res,405,{error:"method_not_allowed"});return true;
    }
    if(url.pathname==="/api/admin/images"){
      const overrides=await read(overridesFile,{});
      if(req.method==="GET"){json(res,200,{items:Object.values(overrides)});return true;}
      const imagePath=url.searchParams.get("path"),catalog=await read(path.join(root,"public","image-catalog.json"),{items:[]});
      if(!catalog.items.some(i=>i.path===imagePath)){json(res,400,{error:"invalid_path"});return true;}
      const file=path.join(dir,"image-assets",Buffer.from(imagePath).toString("hex"));
      if(req.method==="DELETE"){delete overrides[imagePath];await write(overridesFile,overrides);json(res,200,{ok:true});return true;}
      if(req.method==="PUT"){
        const mime=(req.headers["content-type"]||"").split(";")[0];if(!["image/png","image/jpeg","image/webp","image/avif"].includes(mime)){json(res,415,{error:"invalid_type"});return true;}
        const bytes=await body(req,8*1024*1024);if(!bytes.length){json(res,400,{error:"empty_file"});return true;}
        await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,bytes);await fs.writeFile(file+".mime",mime);
        overrides[imagePath]={path:imagePath,bytes:bytes.length,uploadedAt:new Date().toISOString(),uploadedBy:"local-preview"};await write(overridesFile,overrides);json(res,200,{ok:true,version:Date.now()});return true;
      }
      json(res,405,{error:"method_not_allowed"});return true;
    }
    if(req.method==="GET"){
      let file;
      const match=url.pathname.match(/^\/media\/collections\/([^/]+)\/([^/]+)$/);
      if(match&&validCollection(match[1])&&validId(match[2]))file=path.join(dir,"media-assets",match[1],match[2]);
      if(url.pathname.startsWith("/images/")&&(await read(overridesFile,{}))[url.pathname])file=path.join(dir,"image-assets",Buffer.from(url.pathname).toString("hex"));
      if(file){try{const bytes=await fs.readFile(file),mime=await fs.readFile(file+".mime","utf8");res.writeHead(200,{"content-type":mime,"cache-control":"no-store"});res.end(bytes);return true;}catch{}}
    }
    return false;
  };
}
