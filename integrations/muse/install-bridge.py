"""Prepare the narrowly scoped Muse source integration. Does not restart or set secrets."""
from pathlib import Path
import shutil,sys
root=Path(sys.argv[1]).resolve(); server=root/'server/server.js'; source=server.read_text(encoding='utf-8')
marker="import { createVinprintBridge"
if marker in source: raise SystemExit('Already installed; review existing integration first')
changes=[("app.use(cors(corsOptions));", "app.use(cors(corsOptions));\napp.use(createVinprintBridge({getKey:()=>{try{return fs.readFileSync(path.resolve('server/storage/.vinprint-bridge-key'),'utf8').trim();}catch{return '';}}}));"),
("await runPython(scriptPath, [inputPath, outputPath, ...geminiBoxArgs]);", "if (isVinprintRequest(req)) await vinprintCutout.run(inputPath, outputPath);\n    else await runPython(scriptPath, [inputPath, outputPath, ...geminiBoxArgs]);"),
("let isBrandMarked = shouldApplyBrandMark({ user, fee: isFreeRun ? 0 : 1 });", "let isBrandMarked = !isVinprintRequest(req) && shouldApplyBrandMark({ user, fee: isFreeRun ? 0 : 1 });"),
("let isEnhanceBrandMarked = shouldApplyBrandMark({ user, fee: 0 });", "let isEnhanceBrandMarked = !isVinprintRequest(req) && shouldApplyBrandMark({ user, fee: 0 });")]
for before,after in changes:
 if source.count(before)!=1: raise SystemExit('Source changed; refusing ambiguous patch: '+before[:55])
 source=source.replace(before,after)
source='import { createVinprintBridge, isVinprintRequest } from "./integrations/vinprint/vinprintBridge.mjs";\nimport { createCutoutService } from "./integrations/vinprint/cutoutService.mjs";\nconst vinprintCutout=createCutoutService();\nprocess.once("exit",()=>vinprintCutout.close());\n'+source
folder=root/'server/integrations/vinprint';folder.mkdir(parents=True,exist_ok=True)
for name in ['vinprintBridge.mjs','cutoutService.mjs','cutout_worker.py']: shutil.copy2(Path(__file__).parent/name,folder/name)
server.write_text(source,encoding='utf-8')
print('Prepared source bridge only. No restart; no secret created; existing anonymous policy retained.')
