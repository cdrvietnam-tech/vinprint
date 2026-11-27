export async function imageBitmap(file:Blob){
 const bitmap=await createImageBitmap(file);
 if(bitmap.width*bitmap.height>24_000_000){bitmap.close();throw Error("Chọn ảnh nhỏ hơn 24 triệu điểm ảnh để xử lý ổn định.");}
 return bitmap;
}
export function canvasBlob(canvas:HTMLCanvasElement,type="image/png",quality=.85){return new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error("Chưa xuất được ảnh. Hãy thử ảnh nhỏ hơn.")),type,quality));}
export async function compressImage(file:Blob,quality:number,maxSide:number,format:string){
 const image=await imageBitmap(file);
 const scale=maxSide?Math.min(1,maxSide/Math.max(image.width,image.height)):1;
 const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
 try{const ctx=canvas.getContext("2d");if(!ctx)throw Error();if(format==="image/jpeg"){ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);}ctx.drawImage(image,0,0,canvas.width,canvas.height);return await canvasBlob(canvas,format,quality);}finally{image.close();canvas.width=canvas.height=0;}
}
export async function whiteBackground(blob:Blob){
 const image=await imageBitmap(blob),canvas=document.createElement("canvas");canvas.width=image.width;canvas.height=image.height;
 try{const ctx=canvas.getContext("2d");if(!ctx)throw Error();ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0);return await canvasBlob(canvas);}finally{image.close();canvas.width=canvas.height=0;}
}
let heicPromise:Promise<void>|undefined;
type HeicWindow=Window&{heic2any?:(options:{blob:Blob;toType:string;quality:number})=>Promise<Blob|Blob[]>};
export async function convertHeic(file:Blob){
 if(!(window as HeicWindow).heic2any){heicPromise??=new Promise<void>((resolve,reject)=>{const script=document.createElement("script");script.src="/vendor/heic2any/heic2any.min.js";script.onload=()=>resolve();script.onerror=()=>{heicPromise=undefined;script.remove();reject(Error("Chưa tải được bộ đổi ảnh. Hãy thử lại."));};document.head.appendChild(script);});await heicPromise;}
 const convert=(window as HeicWindow).heic2any;if(!convert)throw Error("Chưa khởi tạo được bộ đổi ảnh.");
 const result=await convert({blob:file,toType:"image/jpeg",quality:.92});return Array.isArray(result)?result:[result];
}
export function fileDataUrl(file:Blob){return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error("Không đọc được file."));reader.readAsDataURL(file);});}
