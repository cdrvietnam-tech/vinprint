import {spawn} from "node:child_process";
import {createInterface} from "node:readline";
import {fileURLToPath} from "node:url";
export function createCutoutService({python=process.env.PYTHON_BIN||"python",idleMs=120000,timeoutMs=60000}={}){
 let child=null,idle=null,serial=0;const pending=new Map();
 function close(){clearTimeout(idle);const owned=child;child=null;owned?.kill();for(const job of pending.values()){clearTimeout(job.timer);job.reject(Error("Không xử lý được ảnh."));}pending.clear();}
 function start(){if(child)return;const processHandle=spawn(python,["-u",fileURLToPath(new URL("./cutout_worker.py",import.meta.url))],{windowsHide:true,stdio:["pipe","pipe","pipe"],env:{...process.env,PYTHONIOENCODING:"utf-8",OMP_NUM_THREADS:"2"}});child=processHandle;
 const reader=createInterface({input:processHandle.stdout});reader.on("line",line=>{try{const result=JSON.parse(line),job=pending.get(result.id);if(!job)return;pending.delete(result.id);clearTimeout(job.timer);if(result.ok)job.resolve();else job.reject(Error("Không xử lý được ảnh."));if(!pending.size){idle=setTimeout(close,idleMs);idle.unref();}}catch{/* Non-protocol diagnostics are ignored. */}});
 processHandle.stderr.on("data",()=>{});processHandle.on("error",()=>{if(child===processHandle)close();});processHandle.on("exit",()=>{reader.close();if(child===processHandle)close();});}
 return {close,run(input,output){if(pending.size>=2)return Promise.reject(Error("Đang xử lý ảnh khác. Anh thử lại sau."));clearTimeout(idle);start();return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(close,timeoutMs);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({id,input,output})+"\n",err=>{if(err)close();});});}};
}
