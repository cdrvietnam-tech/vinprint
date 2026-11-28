import JSZip from 'jszip';
const four=(bytes,p)=>String.fromCharCode(...bytes.subarray(p,p+4));
const view=bytes=>new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
function join(parts){const output=new Uint8Array(parts.reduce((sum,part)=>sum+part.length,0));let p=0;for(const part of parts){output.set(part,p);p+=part.length;}return output;}
export function selectCdrPage(root,pageNumber,pageCount) {
  const pages=[];
  function records(start,end,depth=0){
    if(depth>64)throw Error('CDR chứa quá nhiều lớp lồng nhau.');const result=[];
    for(let p=start;p+8<=end;){const size=view(root).getUint32(p+4,true),next=p+8+size;if(next>end)throw Error('Cấu trúc trang CDR không hợp lệ.');const id=four(root,p),type=(id==='LIST'||id==='RIFF')?four(root,p+8):null;
      const node={start:p,end:next+size%2,id,type};if(type==='page')pages.push(node);if(type&&type!=='page')node.children=records(p+12,next,depth+1);result.push(node);p=next+size%2;
    }
    return result;
  }
  if(root.length<12||four(root,0)!=='RIFF')throw Error('Không đọc được danh sách trang Corel.');
  const tree=records(12,root.length),hasMaster=pages.length===pageCount+1;
  if(!hasMaster&&pages.length!==pageCount)throw Error('Không đối chiếu được đầy đủ trang trong CDR. Hãy xuất các trang thành SVG từ CorelDRAW.');
  if(!Number.isInteger(pageNumber)||pageNumber<1||pageNumber>pageCount)throw Error('Số trang CDR không hợp lệ.');
  const selected=pages[pageNumber-1+(hasMaster?1:0)],master=hasMaster?pages[0]:null;
  function encode(nodes){return join(nodes.flatMap(node=>{
    if(node.type==='page'&&node!==selected&&node!==master)return [];
    if(!node.children)return [root.subarray(node.start,node.end)];
    const body=join([root.subarray(node.start+8,node.start+12),encode(node.children)]),header=root.slice(node.start,node.start+8);view(header).setUint32(4,body.length,true);
    return [header,body,...(body.length%2?[new Uint8Array(1)]:[])];
  }));}
  const body=join([root.subarray(8,12),encode(tree)]),header=root.slice(0,8);view(header).setUint32(4,body.length,true);return join([header,body]);
}
/** @param {File} file @param {{signal?:AbortSignal,onProgress?:(progress:object)=>void}} [options] */
export async function readCdrDocumentPages(file,options={}) {
  const {signal,onProgress=()=>{}}=options;
  const check=()=>{if(signal?.aborted)throw new DOMException('Cancelled','AbortError');};check();
  const bytes=new Uint8Array(await file.arrayBuffer());check();
  if(four(bytes,0)!=='PK\x03\x04')return {pageCount:null,pages:[{file,pageNumber:1}]};
  const zip=await JSZip.loadAsync(bytes),entry=zip.file('META-INF/metadata.xml');
  if(!entry)return {pageCount:null,pages:[{file,pageNumber:1}]};
  if(entry._data.uncompressedSize>1024*1024)throw Error('Metadata CDR vượt giới hạn.');
  const metadata=await entry.async('string'),count=Number(metadata.match(/<(?:[\w-]+:)?NumPages>(\d+)</)?.[1]);
  if(!Number.isInteger(count)||count<1)return {pageCount:null,pages:[{file,pageNumber:1}]};
  if(count===1)return {pageCount:1,pages:[{file,pageNumber:1}]};
  if(count>20)throw Error('CDR vượt quá 20 trang. Hãy tách file trước khi mở.');
  if(Object.values(zip.files).reduce((sum,item)=>sum+(item._data?.uncompressedSize||0),0)>80*1024*1024)throw Error('Nội dung CDR sau giải nén vượt quá 80 MB. Hãy tách file.');
  const rootEntry=zip.file('content/root.dat');if(!rootEntry||rootEntry._data.uncompressedSize>4*1024*1024)throw Error('Không đọc được cấu trúc nhiều trang trong CDR.');
  const root=await rootEntry.async('uint8array'),pages=[];
  for(let number=1;number<=count;number++){
    check();onProgress({phase:'splitting-cdr',pageNumber:number,pageCount:count});
    zip.file('content/root.dat',selectCdrPage(root,number,count));
    zip.file('META-INF/metadata.xml',metadata.replace(/(<(?:[\w-]+:)?NumPages>)\d+(<)/,(_match,before,after)=>before+'1'+after));
    const buffer=await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:3}});check();
    pages.push({file:new File([buffer],file.name.replace(/\.cdr$/i,`-trang-${number}.cdr`),{type:'application/octet-stream'}),pageNumber:number});
  }
  return {pageCount:count,pages};
}
