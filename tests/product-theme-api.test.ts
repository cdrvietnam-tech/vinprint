import assert from "node:assert/strict";
import {test} from "node:test";
import type {ManagedMediaItem} from "../app/lib/media-collections";
const ctx={waitUntil(){},passThroughOnException(){}};
async function setup(){
 const {default:worker}=await import(new URL("../dist/server/index.js",import.meta.url).href);
 const original:ManagedMediaItem[]=[{id:"custom-1",kind:"image",src:"/media/collections/gallery/custom-1",title:"Tem nhựa trong",category:"Nhóm riêng",href:"/san-pham/tem-nhua-trong"}];
 const store=new Map<string,string>([["collections/manifests/gallery.json",JSON.stringify(original)]]);
 const bucket={async get(key:string){const value=store.get(key);return value===undefined?null:{json:async()=>JSON.parse(value),text:async()=>value,body:value};},async put(key:string,value:unknown){store.set(key,String(value));},async delete(key:string){store.delete(key);}};
 async function call(action:string,host="localhost"){return worker.fetch(new Request(`${host==="localhost"?"http":"https"}://${host}/api/admin/media-collections?collection=gallery&action=${action}`,{method:"POST"}),{HERO_IMAGES:bucket},ctx);}
 return {store,original,call};
}
test("theme API makes an immutable backup, preserves custom metadata and restores originals",async()=>{
 const {store,original,call}=await setup();
 let response=await call("theme-tet-2027");assert.equal(response.status,200);
 const changed=(await response.json() as {items:ManagedMediaItem[]}).items;
 assert.equal(changed[0].src,"/images/tet-2027/products/tem-nhua-trong.webp");assert.equal(changed[0].title,original[0].title);assert.equal(changed[0].href,original[0].href);
 const key="collections/backups/tet-2027/gallery.json",backup=store.get(key);assert.equal(backup,JSON.stringify(original));
 response=await call("theme-tet-2027");assert.equal(response.status,200);assert.equal(store.get(key),backup);
 response=await call("restore-tet-2027");assert.equal(response.status,200);assert.deepEqual((await response.json() as {items:ManagedMediaItem[]}).items,original);
});
test("theme API does not repopulate empty collections and refuses restore without backup",async()=>{
 const {store,call}=await setup();assert.equal((await call("restore-tet-2027")).status,404);
 store.set("collections/manifests/gallery.json","[]");const response=await call("theme-tet-2027");assert.equal(response.status,200);assert.deepEqual((await response.json() as {items:ManagedMediaItem[]}).items,[]);
});
test("theme API retains existing admin authorization",async()=>{
 const {call}=await setup();assert.equal((await call("theme-tet-2027","vinprint.vn")).status,401);
});
