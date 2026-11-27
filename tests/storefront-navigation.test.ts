import assert from "node:assert/strict";
import {test} from "node:test";
import {readFileSync} from "node:fs";
import {advertisingItems,featuredImage,featuredItems,selectHomepageMedia} from "../app/lib/storefront";
import type {ManagedMediaItem} from "../app/lib/media-collections";
test("advertising is a category and quoting is an explicit per-item action",()=>{
 const source=readFileSync("app/components/storefront/Storefront.tsx","utf8");
 assert.match(source,/navFilter\("Ấn phẩm quảng cáo","file","print"\)/);
 assert.doesNotMatch(source,/onClick=\{\(\)=>openQuote\("Ấn phẩm quảng cáo"\)\}/);
 assert.equal(advertisingItems.length,6);assert.ok(advertisingItems.some(i=>i.name==="In tờ rơi"));
});
test("featured imagery and secondary sections do not repeat sources",()=>{
 const featured=featuredItems.map(featuredImage);assert.equal(new Set(featured).size,featured.length);
 const media=(id:string,src:string):ManagedMediaItem=>({id,src,kind:"image",title:id,category:"Mẫu",href:"/san-pham"});
 const hot=[media("duplicate-featured",featured[0]),media("hot-1","/unique-a.webp?v=1"),media("hot-2","/unique-a.webp?v=2"),media("hot-3","/unique-b.webp")];
 const gallery=[media("gallery-1","/unique-a.webp"),media("gallery-2","/unique-c.webp"),media("gallery-3","/unique-c.webp?x=2")];
 const result=selectHomepageMedia(hot,gallery);
 assert.deepEqual(result.hot.map(i=>i.id),["hot-1","hot-3"]);assert.deepEqual(result.gallery.map(i=>i.id),["gallery-2"]);
 assert.equal(hot.length,4);assert.deepEqual(selectHomepageMedia([],[]),{hot:[],gallery:[]});
});
