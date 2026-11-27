import test from "node:test";
import assert from "node:assert/strict";
import { evaluateApproval, autonomousFile } from "./review-gate.mjs";
const sha = "a".repeat(40);
const base = { files: [{ filename:"content/blog/published/a.json",status:"added" }], headSha:sha, comments:[], adminLogins:["owner"], title:"[Agent Evolution] Publish draft",branch:"agent-evolution/draft" };
const comment = (body, id=1, login="owner",type="User") => ({body,id,user:{login,type},updated_at:`2026-09-12T10:00:0${id}Z`});
test("publishing fails closed without exact owner approval",()=>{
  for(const comments of [[],[comment('/approve-agent-evolution '+"b".repeat(40))],[comment('/approve-agent-evolution '+sha,1,'stranger')],[comment('/approve-agent-evolution '+sha,1,'owner','Bot')],[comment('Looks good')]]) assert.equal(evaluateApproval({...base,comments}).approved,false);
});
test("exact approval, subsequent revocation and changed head",()=>{
  const comments=[comment('/approve-agent-evolution '+sha)];
  assert.equal(evaluateApproval({...base,comments}).approved,true);
  assert.equal(evaluateApproval({...base,comments,headSha:"b".repeat(40)}).approved,false);
  assert.equal(evaluateApproval({...base,comments:[...comments,comment('/revoke-agent-evolution '+sha,2)]}).approved,false);
});
test("renames, removals, source code and path traversal cannot masquerade as drafts",()=>{
  for(const file of [{filename:'agent/reports/a.json',status:'removed'},{filename:'agent/reports/a.md',status:'renamed',previous_filename:'app/page.tsx'},{filename:'agent/reports/../../app/a.md',status:'added'},{filename:'agent/reports/run.js',status:'added'},{filename:'content/blog/drafts/a.json',status:'added'}]) assert.equal(autonomousFile(file),false);
  assert.equal(autonomousFile({filename:'agent/operator/drafts/a.md',status:'added'}),true);
});
test("unknown or incomplete context cannot pass",()=>{
  assert.equal(evaluateApproval({...base,files:[]}).approved,false);
  assert.equal(evaluateApproval({...base,headSha:'HEAD'}).approved,false);
});
