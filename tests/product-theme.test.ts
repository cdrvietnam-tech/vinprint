import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import path from "node:path";
import {test} from "node:test";
import {products} from "../app/lib/products";
import {PRODUCT_THEME_KEYS, productThemeImage, applyTetProductImages, themeForMedia} from "../app/lib/product-theme";
import {type ManagedMediaItem} from "../app/lib/media-collections";
test("every catalog thumbnail and all theme assets use the new product image set",()=>{
 for(const product of products)assert.match(product.image,/^\/images\/tet-2027\/products\//);
 for(const key of PRODUCT_THEME_KEYS)assert.ok(existsSync(path.join(process.cwd(),"public",productThemeImage(key))),key);
});
test("theme migration preserves identities, metadata, order and empty collections",()=>{
 const old:ManagedMediaItem[]=[{id:"original-1",kind:"image",src:"/media/collections/hot-products/original-1",title:"Tem UV DTF 3D nổi",category:"Riêng của chủ",href:"/san-pham/tem-uv-dtf"}];
 const next=applyTetProductImages("hot-products",old);
 assert.equal(next[0].src,productThemeImage("tem-uv-dtf"));
 for(const key of ["id","title","category","href"] as const)assert.equal(next[0][key],old[0][key]);
 assert.equal(old[0].src,"/media/collections/hot-products/original-1");
 assert.deepEqual(applyTetProductImages("gallery",[]),[]);
 assert.deepEqual(applyTetProductImages("hot-products",next),next);
});
test("videos retain their source and only receive a new poster",()=>{
 const video:ManagedMediaItem={id:"video-1",kind:"video",src:"/media/collections/hot-products/video-1",title:"Tem chống nước",category:"Video",href:"/san-pham"};
 const next=applyTetProductImages("hot-products",[video])[0];
 assert.equal(next.kind,"video");assert.equal(next.src,video.src);assert.equal(next.poster,productThemeImage("tem-nhua-chong-nuoc"));
 assert.deepEqual(applyTetProductImages("ai247",[video]),[video]);
});
test("material names determine suitable imagery",()=>{
 const item={id:"test",kind:"image",src:"/old.png",title:"Tem giấy Kraft",category:"",href:"/san-pham"} as ManagedMediaItem;
 assert.equal(themeForMedia(item,"hot-products"),"tem-kraft");
 assert.equal(themeForMedia({...item,title:"in tờ rơi giá rẻ"},"hot-products"),"to-roi");
});
