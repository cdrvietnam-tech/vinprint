const {chromium}=require(process.env.VINPRINT_PLAYWRIGHT_MODULE||'playwright-core');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const origin=process.env.VINPRINT_PREVIEW_ORIGIN||'http://127.0.0.1:4181',out=process.env.VINPRINT_EVIDENCE_DIR||path.join(__dirname,'../outputs/theme-admin-verification');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const result={};try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),api=context.request;const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const collection of ['hero','hot-products','gallery']){
  const before=(await (await api.get(origin+'/api/media/collections?collection='+collection)).json()).items;
  const r=await api.post(origin+`/api/admin/media-collections?collection=${collection}&action=theme-tet-2027`);assert.equal(r.status(),200);
  const after=(await r.json()).items;assert.equal(after.length,before.length);assert.deepEqual(after.map(({id,title,href,category})=>({id,title,href,category})),before.map(({id,title,href,category})=>({id,title,href,category})));
  assert.ok(after.every(i=>(i.poster||i.src).startsWith('/images/tet-2027/products/')));result[collection]=after.length;
 }
 // Local upload must still work after migration, and deletion must not resurrect a row.
 const endpoint=origin+'/api/admin/media-collections?collection=gallery&id=media-local-verification';
 const bytes=fs.readFileSync(path.join(__dirname,'../public/images/tet-2027/products/tem-giay.webp'));
 assert.equal((await api.put(endpoint+'&title=Ảnh kiểm thử&href=/san-pham/tem-giay',{data:bytes,headers:{'content-type':'image/webp'}})).status(),200);
 assert.equal((await api.get(origin+'/media/collections/gallery/media-local-verification')).status(),200);
 assert.equal((await api.delete(endpoint)).status(),200);
 assert.ok(!(await (await api.get(origin+'/api/media/collections?collection=gallery')).json()).items.some(i=>i.id==='media-local-verification'));result.uploadDelete=true;
 // Static catalog overrides can be saved and restored locally.
 const staticUrl=origin+'/api/admin/images?path='+encodeURIComponent('/images/tet-2027/products/tem-giay.webp');
 const previous=(await (await api.get(origin+'/api/admin/images')).json()).items.find(i=>i.path==='/images/tet-2027/products/tem-giay.webp');assert.ok(!previous,'verification expects no previous override on test asset');
 try{assert.equal((await api.put(staticUrl,{data:bytes,headers:{'content-type':'image/webp'}})).status(),200);assert.ok((await (await api.get(origin+'/api/admin/images')).json()).items.some(i=>i.path==='/images/tet-2027/products/tem-giay.webp'));}finally{assert.equal((await api.delete(staticUrl)).status(),200);}result.staticUploadRestore=true;
 await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:60000});
 for(const img of await page.locator('.product img,.vp-material-detail img,.vp-hot-grid img,.vp-gallery-grid img').all()){
  await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());assert.match(await img.getAttribute('src'),/tet-2027\/products/);assert.equal(await img.evaluate(el=>getComputedStyle(el).objectFit),'contain');
 }
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:out+'/new-products-desktop.png'});result.homeImages=true;
 await page.goto(origin+'/admin',{waitUntil:'domcontentloaded',timeout:60000});await page.getByRole('heading',{name:/Chào anh/}).waitFor();assert.equal(await page.locator('.overview-stat').count(),4);
 await page.getByText('Dữ liệu sẵn sàng',{exact:true}).waitFor();await page.screenshot({path:out+'/admin-overview.png'});
 await page.getByLabel('Lọc menu quản trị').fill('hinh anh');assert.equal(await page.locator('nav[aria-label="Điều hướng quản trị"] a').count(),1);await page.getByLabel('Lọc menu quản trị').fill('');
 await page.keyboard.press('Control+k');await page.getByRole('dialog').waitFor();await page.getByLabel('Tìm khu vực quản trị',{exact:true}).fill('noi dung');assert.equal(await page.getByRole('dialog').getByRole('button').count(),1);await page.keyboard.press('Escape');
 await page.getByLabel('Thu gọn menu',{exact:true}).click();await page.waitForFunction(()=>Math.round(document.querySelector('aside').getBoundingClientRect().width)===80);await page.getByLabel('Mở rộng menu',{exact:true}).click();await page.waitForFunction(()=>Math.round(document.querySelector('aside').getBoundingClientRect().width)===256);
 await page.getByLabel('Chuyển giao diện tối').click();assert.equal(await page.locator('.vinprint-admin').getAttribute('data-theme'),'dark');await page.screenshot({path:out+'/admin-dark.png'});await page.getByLabel('Chuyển giao diện sáng').click();result.adminSearchCollapseTheme=true;
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);await page.screenshot({path:out+'/admin-mobile.png'});await page.getByLabel('Mở menu',{exact:true}).click();await page.getByRole('link',{name:'Hình ảnh & video',exact:true}).last().click();await page.getByRole('heading',{name:'Bộ ảnh sản phẩm Tết 2027',exact:true}).waitFor();await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);result.mobileNavigation=true;
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:out+'/admin-images.png'});
 // Exercise the actual apply button and confirm, then check the collection result.
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Áp dụng bộ ảnh Tết',exact:true}).click();await page.getByText('Đã áp dụng bộ Tết cho 3 bộ sưu tập.',{exact:false}).waitFor();result.adminApply=true;
 await page.goto(origin+'/san-pham',{waitUntil:'domcontentloaded',timeout:60000});const old=await page.locator('img[src*="/images/products/"],img[src*="holographic_sticker"]').count();assert.equal(old,0);result.catalog=true;
 assert.deepEqual(errors,[]);result.pageErrors=errors;fs.writeFileSync(out+'/theme-admin-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
