import {execFileSync} from "node:child_process";
import {readFileSync,statSync} from "node:fs";
const index=process.argv.indexOf("--base");
const base=index<0?"HEAD":process.argv[index+1];
if(!base||base.startsWith("-"))throw Error("Provide a valid base ref");
const changed=execFileSync("git",["diff","--name-only","--diff-filter=ACMRT","-z",base,"--"],{encoding:"utf8"});
const untracked=execFileSync("git",["ls-files","--others","--exclude-standard","-z"],{encoding:"utf8"});
let checked=0;
for(const file of new Set((changed+untracked).split("\0").filter(Boolean))){
 if(!/\.(?:md|tsx?|css|[cm]?js|json|py|sh|ya?ml|svg)$/.test(file)||!statSync(file).isFile())continue;
 if(readFileSync(file).includes(0))throw Error("NUL byte in changed text: "+file);
 checked++;
}
console.log("Changed text integrity passed: "+checked+" files");
