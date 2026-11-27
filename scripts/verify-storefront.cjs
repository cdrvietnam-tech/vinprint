const {chromium}=require(process.env.VINPRINT_PLAYWRIGHT_MODULE || 'playwright-core');
const fs=require('node:fs');
const path=require('node:path');const root=path.resolve(__dirname,'..');const origin=process.env.VINPRINT_PREVIEW_ORIGIN || 'http://127.0.0.1:4181';
const out=process.env.VINPRINT_EVIDENCE_DIR || path.join(root,'outputs','storefront-verification');
fs.mkdirSync(out,{recursive:true});
(async()=>{
const browser=await chromium.launch({channel:'msedge',headless:true});
const result={};let originalContent;
try{
const context=await browser.newContext({viewport:{width:1781,height:960},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
const response=await page.goto(origin+'/',{waitUntil:'networkidle',timeout:60000});
if(response.status()!==200)throw Error('Homepage HTTP '+response.status());
await page.locator('.hero h1').waitFor();if(await page.locator('.vinprint-storefront .nav').count())throw Error('Unscoped legacy nav class returned');
originalContent=await (await context.request.get(origin+'/api/site-content')).json();
const geometry=await page.locator('.hero').boundingBox();
if(Math.abs(geometry.x-244)>2||Math.abs(geometry.y-90)>2||Math.abs(geometry.height-335)>2)throw Error('Approved layout drift '+JSON.stringify(geometry));
if(await page.locator('.vp-catalog-item').count()!==10)throw Error('Catalog incomplete');
if(await page.locator('.vp-price-item').count()!==originalContent.pricing.posters.length)throw Error('Pricing incomplete');
if(await page.locator('.vp-process-grid li').count()!==originalContent.process.steps.length)throw Error('Process incomplete');
if(!(await page.locator('#lien-he-xuong').innerText()).includes(originalContent.contact.phoneDisplay))throw Error('Contact not connected');
if((await page.locator('.account').innerText()).includes('4.949'))throw Error('Fake wallet remains');
await page.screenshot({path:out+'/desktop.png',fullPage:false});
await page.locator('.collection').screenshot({path:out+'/collection.png'});
await page.getByRole('button',{name:/Tem bao bì/}).click();
if(await page.locator('.product').count()!==2)throw Error('Packaging filter');
await page.getByRole('button',{name:/Tất cả sản phẩm/}).first().click();
await page.locator('.product button').first().click();
await page.locator('#size').fill('5 cm');
await page.locator('#quantity').fill('0');await page.locator('#quote-form button[type=submit]').click();if(await page.locator('.vp-request-text').count())throw Error('Invalid quantity accepted');await page.locator('#quantity').fill('600');
await page.locator('#quote-name').fill('Khách kiểm thử local');
await page.locator('#quote-form button[type=submit]').click();
const message=await page.locator('.vp-request-text').inputValue();
if(!message.includes('600')||!message.includes('5 cm'))throw Error('Quote spec missing');
await page.getByRole('button',{name:'1. Sao chép yêu cầu'}).click();await page.getByRole('button',{name:'Đã sao chép yêu cầu',exact:true}).waitFor();
if((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')!==message.replace(/\r\n/g,'\n'))throw Error('Clipboard failed');
const quoteHref=await page.locator('dialog .vp-zalo-link').getAttribute('href');
if(quoteHref!==originalContent.contact.zaloUrl)throw Error('Quote Zalo mismatch');
await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Gửi file in',exact:true}).click();
if(await page.locator('dialog input[type=file]').count())throw Error('Fake upload input remains');
if(!await page.locator('dialog').getByText('Mở Zalo gửi file →').count())throw Error('Real upload handoff missing');
await page.keyboard.press('Escape');
await page.locator('.vp-poster').first().click();
await page.locator('.vp-poster-dialog img').waitFor();
await page.waitForFunction(()=>document.querySelector('.vp-poster-dialog img').naturalWidth>0);
await page.keyboard.press('Escape');
await page.locator('#faq details').first().locator('summary').click();
if(await page.locator('#faq details').first().getAttribute('open')===null)throw Error('FAQ did not open');
if(await page.locator('#danh-gia .vp-review-grid article').count()!==originalContent.reviews.items.length)throw Error('Reviews missing');if(await page.locator('#vinprint-map-panel iframe').count())throw Error('Map loaded before request');await page.locator('.vp-map-toggle').click();if(await page.locator('#vinprint-map-panel iframe').count()!==1)throw Error('Map toggle failed');await page.locator('.vp-map-toggle').click();const routes=await page.locator('a[href^="/"]').evaluateAll(nodes=>Array.from(new Set(nodes.map(n=>n.getAttribute('href').split('#')[0]))).filter(Boolean));
const statuses=[];
for(let i=0;i<routes.length;i+=3){await Promise.all(routes.slice(i,i+3).map(async route=>{const r=await context.request.get('http://127.0.0.1:4181'+route,{timeout:60000});statuses.push({route,status:r.status()});}));}
const bad=statuses.filter(s=>s.status!==200);if(bad.length)throw Error('Broken routes '+JSON.stringify(bad));
const ratios=[];
for(const width of [1366,768,390]){
await page.setViewportSize({width,height:900});await page.waitForTimeout(400);
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+width);
const skew=await page.locator('svg image').evaluateAll(nodes=>nodes.filter(n=>n.getBoundingClientRect().width>0).map(n=>{const m=n.getScreenCTM();return Math.abs(Math.hypot(m.a,m.b)/Math.hypot(m.c,m.d)-1)}));
if(skew.some(v=>v>.005))throw Error('Image distortion '+width);
ratios.push({width,maxScaleError:Math.max(...skew)});
await page.evaluate(()=>document.activeElement.blur());
await page.screenshot({path:out+'/width-'+width+'.png',fullPage:false});
}
await page.locator('#menu').click();await page.getByRole('link',{name:'Tem dán hộp & túi giấy',exact:true}).click();
if(await page.locator('.product').count()!==2||await page.locator('#menu').getAttribute('aria-expanded')!=='false')throw Error('Mobile menu/filter');
await page.setViewportSize({width:1366,height:1000});
await page.goto(origin+'/admin/noi-dung',{waitUntil:'networkidle',timeout:60000});
await page.getByLabel('Tiêu đề Tết dòng 1',{exact:true}).fill('In ấn chuẩn Tết — kiểm thử local');
const savePromise=page.waitForResponse(r=>r.url().endsWith('/api/admin/site-content')&&r.request().method()==='PUT');
await page.getByRole('button',{name:'Lưu thay đổi',exact:true}).click();
const save=await savePromise;if(save.status()!==200)throw Error('Local admin save failed');
await page.goto(origin+'/',{waitUntil:'networkidle'});
await page.getByRole('heading',{level:1}).filter({hasText:'kiểm thử local'}).waitFor();
const changed=await (await context.request.get(origin+'/api/site-content')).json();
if(JSON.stringify(changed.pricing)!==JSON.stringify(originalContent.pricing))throw Error('Admin overwrote old pricing');
await context.request.put(origin+'/api/admin/site-content',{data:originalContent});
await page.goto(origin+'/',{waitUntil:'networkidle'});
if((await page.locator('.hero h1').innerText()).includes('kiểm thử'))throw Error('Local state not restored');
Object.assign(result,{http:response.status(),approvedHeroGeometry:geometry,catalogProducts:10,featured:6,pricingPosters:originalContent.pricing.posters.length,processSteps:originalContent.process.steps.length,quoteClipboard:true,zaloHandoff:quoteHref,fileHandoff:'Zalo, no fake upload',posterLightbox:true,faq:true,reviews:true,mapLoadsOnRequest:true,quantityValidation:true,mobileMenu:true,imageRatios:ratios,routes:statuses,adminSave:'real local API; existing pricing preserved; original restored',adminWriteScope:root+'/.preview/site-content.json',pageErrors});
if(pageErrors.length)throw Error('Page errors '+pageErrors.join(';'));
fs.writeFileSync(out+'/verification.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
}finally{
if(originalContent){await fetch(origin+'/api/admin/site-content',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(originalContent)}).catch(()=>{});}
await browser.close();
}
})().catch(e=>{console.error(e);process.exitCode=1});






