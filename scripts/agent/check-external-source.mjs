// Allow slow publisher sites without treating unreachable sources as success.
export async function checkExternalSource(href, {fetchImpl=fetch, timeoutMs=30000, retryDelayMs=1000, sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}) {
  let failure="";
  for(let attempt=1;attempt<=2;attempt++) {
    try {
      const response=await fetchImpl(href,{signal:AbortSignal.timeout(timeoutMs),headers:{"User-Agent":"VinPrintContentAudit/1.0"}});
      await response.body?.cancel();
      if(response.ok || response.status===403)return {ok:true,status:response.status,attempts:attempt};
      failure=`external source returned ${response.status}: ${href}`;
      if(response.status<500 || attempt===2)return {ok:false,error:failure,attempts:attempt};
    } catch(error) {
      failure=`external source unavailable: ${href} (${error instanceof Error?error.message:String(error)})`;
      if(attempt===2)return {ok:false,error:failure,attempts:attempt};
    }
    await sleep(retryDelayMs);
  }
  return {ok:false,error:failure,attempts:2};
}
