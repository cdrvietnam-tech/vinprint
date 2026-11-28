import fs from "node:fs/promises";
const input=process.argv[2];
if(!input)throw Error("Usage: node scripts/patch-heic-csp.mjs <upstream heic2any.min.js>");
let source=await fs.readFile(input,"utf8");
const named=/new Function\("body",.{0,250}?\)\(e\)/g;
const pointer='new Function("dynCall","rawFunction",i)(A,n)';
const invoker=/function xe\(A,e,r,i,f\)\{[\s\S]*?\}function Pe\(/;
if([...source.matchAll(named)].length!==2||!source.includes(pointer)||!invoker.test(source))throw Error("Unsupported heic2any version: expected 4 known dynamic wrappers");
// Embind uses these wrappers to supply cosmetic function names and bind a pointer.
// Static closures preserve this/arguments and pointer binding without eval.
source=source.replace(named,'function(){return e.apply(this,arguments)}').replace(pointer,'function(){return A.apply(null,[n].concat(Array.prototype.slice.call(arguments)))}');
source=source.replace(invoker,'function xe(A,e,r,i,f){var n=e.length,t=null!==e[1]&&null!==r,o=false;if(n<2)HA(A);for(var a=1;a<n;a++)if(null!==e[a]&&void 0===e[a].destructorFunction){o=true;break}var wrapper=function(){if(arguments.length!==n-2)HA(A);var destructors=o?[]:null,values=[f],wired=[];if(t){wired[1]=e[1].toWireType(destructors,this);values.push(wired[1])}for(var p=0;p<n-2;p++){wired[p+2]=e[p+2].toWireType(destructors,arguments[p]);values.push(wired[p+2])}var rv=i.apply(null,values);if(o)CA(destructors);else for(var z=t?1:2;z<n;z++)if(null!==e[z].destructorFunction)e[z].destructorFunction(wired[z]);if(e[0].name!==String.fromCharCode(118,111,105,100))return e[0].fromWireType(rv)};Object.defineProperty(wrapper,String.fromCharCode(108,101,110,103,116,104),{value:n-2});return wrapper}function Pe(');
if(source.includes("new Function"))throw Error("Dynamic function remains");
await fs.writeFile("public/vendor/heic2any/heic2any.min.js","/* heic2any 0.0.4, MIT; VinPrint CSP-compatible static closures. See README.md. */\n"+source);
console.log("Patched 4 known HEIC wrappers for CSP without unsafe-eval.");
