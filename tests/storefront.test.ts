import assert from "node:assert/strict";
import { test } from "node:test";
import { buildQuoteMessage, featuredItems, featuredProduct, filterFeatured, safePublicHref } from "../app/lib/storefront";
import { industryPages } from "../app/lib/content-pages";
import { productBySlug } from "../app/lib/products";
import { DEFAULT_SITE_CONTENT, isValidSiteContent, mergeSiteContent } from "../app/lib/site-content";

test("featured cards point to existing product or seasonal pages",()=>{
  for(const item of featuredItems){
    assert.ok(featuredProduct(item),"missing price/material source "+item.id);
    if(item.href.startsWith("/san-pham/"))assert.ok(productBySlug[item.href.slice(10)]);
    else if(item.href.startsWith("/nganh/"))assert.ok(industryPages[item.href.slice(7)]);
    else assert.fail("unexpected featured route "+item.href);
  }
  assert.equal(filterFeatured("all").length,6);
  assert.equal(filterFeatured("pack").length,2);
  assert.ok(filterFeatured("water").every(i=>i.productSlug==="tem-nhua-chong-nuoc"));
});
test("old saved admin content remains valid and merges without losing overrides",()=>{
  const old=JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
  delete old.tetHome;
  old.contact.phone="0901234567";
  old.hero.titleLine1="Nội dung cũ đã chỉnh";
  old.pricing.posters[0].details=["Bảng giá do quản trị sửa"];
  assert.equal(isValidSiteContent(old),true);
  const merged=mergeSiteContent(old);
  assert.equal(merged.contact.phone,"0901234567");
  assert.equal(merged.hero.titleLine1,"Nội dung cũ đã chỉnh");
  assert.deepEqual(merged.pricing.posters[0].details,["Bảng giá do quản trị sửa"]);
  assert.equal(merged.tetHome.titleLine1,"In ấn chuẩn Tết");
  assert.equal(isValidSiteContent({...old,tetHome:{titleLine1:42}}),false);
});
test("quote text contains the customer's specifications without fabricating a price or order",()=>{
  const message=buildQuoteMessage({product:"Tem giấy",material:"Decal giấy",size:"5 cm",quantity:"500",name:"Anh Nam",phone:"0901234567",deadline:"2027-01-20",note:"2 mẫu"});
  assert.match(message,/Tem giấy/);assert.match(message,/500/);assert.match(message,/5 cm/);assert.match(message,/2027-01-20/);
  assert.doesNotMatch(message,/đã gửi|đã thanh toán|mã đơn|tổng tiền/i);
});
test("public links reject executable and protocol-relative URLs",()=>{
  assert.equal(safePublicHref("javascript:alert(1)"),"/lien-he");
  assert.equal(safePublicHref("//bad.example"),"/lien-he");
  assert.equal(safePublicHref("/san-pham/tem-giay"),"/san-pham/tem-giay");
  assert.equal(safePublicHref("#bang-gia"),"#bang-gia");
  assert.equal(safePublicHref("https://zalo.me/0844998499"),"https://zalo.me/0844998499");
});
