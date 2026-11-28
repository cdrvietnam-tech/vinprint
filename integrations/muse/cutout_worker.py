import sys,json,os
os.environ.setdefault("OMP_NUM_THREADS","2")
os.environ.setdefault("OPENBLAS_NUM_THREADS","2")
from PIL import Image,ImageOps
from rembg import new_session,remove
# Installed commercially licensed U2Net. Keep session alive between jobs.
session=new_session("u2net",providers=["CPUExecutionProvider"])
for line in sys.stdin:
 try:
  item=json.loads(line)
  with Image.open(item["input"]) as source:
   if source.width*source.height>24000000: raise ValueError("image too large")
   source=ImageOps.exif_transpose(source).convert("RGBA")
   result=remove(source,session=session)
   result.save(item["output"],"PNG")
  print(json.dumps({"id":item["id"],"ok":True}),flush=True)
 except Exception:
  print(json.dumps({"id":item.get("id"),"ok":False}),flush=True)
