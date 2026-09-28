import json,sys,os,subprocess,concurrent.futures as cf
items=json.load(open(sys.argv[1])); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
def dl(it):
    if not it.get('src'): return 'nosrc'
    ext='png' if '.png' in it['src'].split('?')[0] else 'jpg'
    f=os.path.join(out,f"{it['id']}.jpg")
    if os.path.exists(f) and os.path.getsize(f)>0: return 'skip'
    r=subprocess.run(['curl','-sfL','--max-time','40','-o',f,it['src']])
    return 'ok' if r.returncode==0 else f'fail{r.returncode}'
with cf.ThreadPoolExecutor(8) as ex: res=list(ex.map(dl,items))
from collections import Counter; print(Counter(res))
