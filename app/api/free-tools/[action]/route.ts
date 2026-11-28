import {handleLimitedFreeToolRequest} from "../../../lib/free-tools-api";
function handle(request:Request){return handleLimitedFreeToolRequest(request,{origin:process.env.MUSE_FREE_TOOLS_ORIGIN||(process.env.NODE_ENV==="development"?"http://127.0.0.1:5000":undefined)});}
export const POST=handle;
export const GET=handle;
