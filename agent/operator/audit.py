"""Owner-authorized, bounded read-only website auditor. Python 3.11+, stdlib only.

No production write/deploy/approve operation exists in this program.
Private Google reports and tokens must never be committed to a public repository.
"""
import argparse
import collections
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import time
import urllib.error
import urllib.parse as up
import urllib.request as ur
import urllib.robotparser
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
UTC = dt.timezone.utc
LABELS = {
    'http_not_redirected_to_https':'HTTP chưa chuyển sang HTTPS',
    'www_variant_unavailable':'Chưa truy cập được tên miền www',
    'nap_owner_confirmation_needed':'Cần xác nhận địa chỉ, điện thoại và giờ làm chuẩn',
    'missing_seed_or_sitemap_page':'URL cũ trả 404 — xem lịch sử trước khi xử lý',
    'broken_internal_link':'Liên kết nội bộ bị hỏng',
    'duplicate_title':'Nhiều trang dùng chung tiêu đề',
    'duplicate_description':'Nhiều trang dùng chung mô tả',
    'canonical_count':'Cần kiểm tra canonical',
    'noindex_in_sitemap':'Trang bị noindex vẫn có trong sitemap',
    'fetch_incomplete':'Chưa đọc đủ trang',
}

def now():
    return dt.datetime.now(UTC).isoformat()

def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True).encode()).hexdigest()

def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)

def append_log(path, event):
    path = Path(path)
    previous = '0' * 64
    if path.exists():
        for line in path.read_text(encoding='utf-8').splitlines():
            record = json.loads(line)
            claimed = record.pop('hash')
            if record['previous_hash'] != previous or digest(record) != claimed:
                raise ValueError('Log integrity check failed; preserve evidence and stop')
            previous = claimed
    record = {'at': now(), 'previous_hash': previous, **event}
    record['hash'] = digest(record)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('a', encoding='utf-8') as f:
        f.write(json.dumps(record, ensure_ascii=False) + '\n')

def policy_decision(action, target=''):
    """Fail closed. This is an allowlist, never an approval issuer."""
    if action == 'audit':
        return 'allow_read_only'
    if action in ('write_draft', 'write_report'):
        normal = target.replace('\\', '/')
        parts = normal.split('/')
        prefix = 'agent/operator/drafts/' if action == 'write_draft' else 'agent/reports/operator/'
        if normal.startswith(prefix) and not any(p in ('..', '.', '') for p in parts) and normal.endswith(('.md', '.json')):
            return 'allow_local_only'
        return 'deny'
    if action in ('publish', 'delete_page', 'redirect', 'change_url', 'price', 'brand_claim', 'layout', 'canonical', 'robots', 'schema', 'deploy', 'merge'):
        return 'owner_approval_required_no_executor'
    return 'deny'

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts, self.h1, self.links, self.canonicals = [], [], [], []
        self.meta, self.schema, self.schema_errors = {}, [], []
        self.text_parts, self.scripts = [], []
        self.in_title = False
        self.h1_depth = 0
        self.hidden = 0
        self.jsonld = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1.append(''); self.h1_depth += 1
        if tag in ('script', 'style'):
            self.hidden += 1
            if a.get('src'): self.scripts.append(a['src'])
            if tag == 'script' and a.get('type') == 'application/ld+json': self.jsonld = ''
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split(): self.canonicals.append(a.get('href', ''))
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name in ('description', 'robots', 'googlebot'): self.meta.setdefault(name, []).append(a.get('content', ''))
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'h1': self.h1_depth = max(0, self.h1_depth - 1)
        if tag in ('script', 'style'):
            self.hidden = max(0, self.hidden - 1)
            if tag == 'script' and self.jsonld is not None:
                try: self.schema.append(json.loads(self.jsonld))
                except ValueError: self.schema_errors.append('invalid_json_ld')
                self.jsonld = None
    def handle_data(self, data):
        if self.jsonld is not None: self.jsonld += data
        if self.in_title: self.title_parts.append(data)
        if self.h1_depth and self.h1: self.h1[-1] += data
        if not self.hidden: self.text_parts.append(data)

class NoRedirect(ur.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

class Client:
    def __init__(self, config):
        self.c = config
        self.opener = ur.build_opener(NoRedirect())
        self.count = 0
        self.last = 0
        self.cache = {}
        self.stopped = False
    def allowed(self, url):
        try:
            p = up.urlsplit(url)
            return p.scheme in ('http', 'https') and p.hostname in self.c['allowed_hosts'] and p.port in (None, 80, 443) and not p.username and not p.password
        except ValueError:
            return False
    def get(self, url):
        if url in self.cache: return self.cache[url]
        current, chain = url, []
        result = {'url': url, 'status': None, 'final_url': url, 'redirects': chain}
        for hop in range(7):
            if not self.allowed(current): result['error'] = 'out_of_scope_redirect'; break
            if self.stopped or self.count >= self.c['max_requests']: result['error'] = 'request_budget_or_rate_limit'; break
            time.sleep(max(0, self.c['request_interval_seconds'] - (time.monotonic() - self.last)))
            self.count += 1
            self.last = time.monotonic()
            start = time.monotonic()
            try:
                req = ur.Request(current, headers={'User-Agent': self.c['user_agent'], 'Accept': 'text/html,application/xml,text/plain;q=0.9,*/*;q=0.5'})
                try: response = self.opener.open(req, timeout=self.c['timeout_seconds'])
                except urllib.error.HTTPError as e: response = e
                with response:
                    status = response.status
                    headers = {k.lower(): v for k,v in response.headers.items() if k.lower() in ('content-type','location','x-robots-tag','server','link','cache-control')}
                    raw = response.read(self.c['max_response_bytes'] + 1)
                    charset = response.headers.get_content_charset() or 'utf-8'
                result.update(status=status, final_url=current, headers=headers, response_ms=round((time.monotonic()-start)*1000), bytes=len(raw))
                if len(raw) > self.c['max_response_bytes']: result['error'] = 'body_limit'; break
                if status in (301,302,303,307,308) and headers.get('location'):
                    target = up.urljoin(current, headers['location'])
                    chain.append({'url': current, 'status': status, 'target': target})
                    if target in [x['url'] for x in chain]: result['error'] = 'redirect_loop'; break
                    current = target
                    continue
                if status == 429: self.stopped = True
                result['body'] = raw.decode(charset, errors='replace')
                break
            except Exception as e:
                result['error'] = type(e).__name__
                break
        else: result['error'] = 'redirect_limit'
        self.cache[url] = result
        return result

def clean_url(url, base):
    try:
        p = up.urlsplit(up.urljoin(base, url))
        if p.query or p.scheme not in ('http', 'https'): return None
        if re.search(r'/(api|admin|checkout|cart|wp-admin|wp-login|logout|account)(/|\.|$)', p.path, re.I): return None
        if re.search(r'\.(png|jpg|jpeg|webp|gif|svg|woff2?|pdf|zip|css|js)$', p.path, re.I): return None
        return up.urlunsplit((p.scheme,p.netloc,p.path or '/','',''))
    except ValueError: return None

def parse_page(result):
    p = Page()
    p.feed(result.get('body',''))
    text = ' '.join(' '.join(p.text_parts).split())
    schemas = []
    def walk(v):
        if isinstance(v, list):
            for x in v: walk(x)
        if isinstance(v, dict):
            if '@type' in v: schemas.append(v)
            if '@graph' in v: walk(v['@graph'])
    for value in p.schema: walk(value)
    naps = [{k:v.get(k) for k in ('@type','name','telephone','address','url','openingHours') if k in v} for v in schemas if any(x in str(v.get('@type')) for x in ('Organization','LocalBusiness','Store','ProfessionalService'))]
    phones = sorted(set(re.sub(r'\D','',x) for x in re.findall(r'(?:\+84|0)(?:[ .-]?\d){8,10}', text)))
    addresses = [text[max(0,m.start()-20):m.start()+150] for m in re.finditer(r'Thạnh Lộc|Lê Văn Thọ|An Phú Đồng|An Phú Đông', text)][:5]
    return {**{k:v for k,v in result.items() if k != 'body'}, 'title':' '.join(''.join(p.title_parts).split()), 'description':p.meta.get('description',[]), 'h1':[' '.join(x.split()) for x in p.h1], 'canonical':[up.urljoin(result['final_url'],x) for x in p.canonicals], 'meta_robots':p.meta.get('robots',[]) + p.meta.get('googlebot',[]), 'schema_types':sorted(set(str(v['@type']) for v in schemas)), 'schema_errors':p.schema_errors, 'nap':naps, 'phone_candidates':phones, 'address_evidence':addresses, 'text_hash':hashlib.sha256(text.encode()).hexdigest(), 'text_length':len(text), 'links':p.links, 'tracking_scripts':[x for x in p.scripts if 'googletagmanager' in x or 'analytics' in x]}

def issue(code, url, evidence, impact=3, effort=1, confidence=1):
    return {'id':digest([code,url])[:12], 'code':code,'url':url,'evidence':evidence,'impact':impact,'effort':effort,'confidence':confidence,'priority_score':round(impact*confidence/effort,2),'status':'proposed','approval':'required_before_live_change'}

def google_post(url, payload, token):
    req = ur.Request(url, json.dumps(payload).encode(), {'Authorization':'Bearer '+token,'Content-Type':'application/json'}, method='POST')
    try:
        with ur.urlopen(req, timeout=30) as response: return json.load(response)
    except urllib.error.HTTPError as e: raise RuntimeError('Google API HTTP '+str(e.code)) from None

def opportunities(rows, minimum):
    candidates, grouped = [], collections.defaultdict(list)
    for row in rows:
        keys = row.get('keys', [])
        if len(keys) != 2: continue
        q,p = keys
        impressions = float(row.get('impressions',0))
        pos = float(row.get('position',0))
        if impressions >= minimum and 4 <= pos <= 20:
            candidates.append({'query':q,'page':p,**{k:row.get(k) for k in ('clicks','impressions','ctr','position')},'reason':'Observed position 4–20; review intent, snippet and internal links. No traffic forecast.'})
        grouped[q].append(row)
    overlaps = []
    for q, items in grouped.items():
        total = sum(float(x.get('impressions',0)) for x in items)
        significant = [x for x in items if total and float(x.get('impressions',0))/total >= .2 and float(x.get('impressions',0)) >= minimum]
        if len({x['keys'][1] for x in significant}) > 1:
            overlaps.append({'query':q,'pages':[x['keys'][1] for x in significant],'status':'possible_overlap_needs_intent_and_time_series_review'})
    return sorted(candidates,key=lambda x:x['impressions'],reverse=True), overlaps

def collect_google(c):
    out = {'gsc':{'status':'not_connected'}, 'ga4':{'status':'not_connected'}, 'index':{'status':'not_verified_without_url_inspection'}, 'periods':{}}
    end = dt.date.today() - dt.timedelta(days=3)
    for label, shift in (('current',0),('previous',28)):
        finish = end-dt.timedelta(days=shift)
        out['periods'][label] = {'startDate':str(finish-dt.timedelta(days=27)), 'endDate':str(finish)}
    token = os.getenv('VINPRINT_GOOGLE_ACCESS_TOKEN')
    if not token: return out
    if c.get('gsc_property'):
        try:
            reports = {}
            for label, period in out['periods'].items():
                rows=[]
                for start in (0,25000):
                    response = google_post('https://www.googleapis.com/webmasters/v3/sites/'+up.quote(c['gsc_property'],safe='')+'/searchAnalytics/query', {**period,'dimensions':['query','page'],'type':'web','dataState':'final','rowLimit':25000,'startRow':start},token)
                    batch=response.get('rows',[]); rows.extend(batch)
                    if len(batch)<25000: break
                reports[label]={'rows':rows,'row_cap_reached':len(rows)==50000,'note':'Search Analytics returns top rows; anonymized queries are omitted.'}
            candidates, overlaps=opportunities(reports['current']['rows'],c['minimum_query_impressions'])
            out['gsc']={'status':'connected','reports':reports,'opportunities':candidates,'possible_cannibalization':overlaps}
            inspections=[]
            for path in c['seed_paths'][:5]:
                inspections.append(google_post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {'inspectionUrl':c['site']+path,'siteUrl':c['gsc_property'],'languageCode':'en-US'}, token))
            out['index']={'status':'sampled','results':inspections}
        except Exception as e:
            if out['gsc']['status'] != 'connected': out['gsc']['status']='error'
            out['gsc']['error']=str(e) if isinstance(e,RuntimeError) else type(e).__name__
    if c.get('ga4_property_id'):
        try:
            if not re.fullmatch(r'\d+',str(c['ga4_property_id'])): raise ValueError('numeric GA4 property required')
            reports={}
            for label, period in out['periods'].items():
                reports[label]=google_post('https://analyticsdata.googleapis.com/v1beta/properties/'+str(c['ga4_property_id'])+':runReport', {'dateRanges':[period], 'dimensions':[{'name':'landingPagePlusQueryString'}], 'metrics':[{'name':x} for x in ('sessions','engagedSessions','keyEvents')], 'dimensionFilter':{'filter':{'fieldName':'sessionDefaultChannelGroup','stringFilter':{'matchType':'EXACT','value':'Organic Search'}}},'limit':10000},token)
            out['ga4']={'status':'connected','reports':reports,'note':'Organic sessions and configured key events; contact clicks are leads, not confirmed sales. Review thresholding, rowCount and dataLossFromOtherRow.'}
        except Exception as e: out['ga4']={'status':'error','error':str(e) if isinstance(e,RuntimeError) else type(e).__name__}
    return out

def pagespeed(c):
    query = {'url':c['site'],'strategy':'mobile','category':'performance'}
    if os.getenv('VINPRINT_PSI_API_KEY'): query['key']=os.environ['VINPRINT_PSI_API_KEY']
    try:
        with ur.urlopen('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?'+up.urlencode(query),timeout=45) as response: d=json.load(response)
        lab=d.get('lighthouseResult',{})
        audits=lab.get('audits',{})
        return {'status':'available','fetched_at':now(),'field_url':d.get('loadingExperience'),'field_origin':d.get('originLoadingExperience'),'lab_mobile':{'score':lab.get('categories',{}).get('performance',{}).get('score'),'metrics':{k:audits.get(k,{}).get('numericValue') for k in ('largest-contentful-paint','cumulative-layout-shift','total-blocking-time')}},'note':'Origin and URL field data differ. Lab TBT is not INP. Missing field data means unknown, never passed.'}
    except urllib.error.HTTPError as e: return {'status':'unavailable','http_status':e.code,'note':'No CWV verdict; API denied or quota unavailable.'}
    except Exception as e: return {'status':'unavailable','error':type(e).__name__}

def audit(c):
    client=Client(c)
    root=c['site'].rstrip('/')
    robots=client.get(root+'/robots.txt')
    rp=urllib.robotparser.RobotFileParser()
    robots_ok=robots.get('status')==200 and not robots.get('error')
    rp.parse(robots.get('body','').splitlines() if robots_ok else ['User-agent: *','Disallow: /'])
    sitemap_queue=re.findall(r'^Sitemap:\s*(\S+)',robots.get('body',''),re.M|re.I) or [root+'/sitemap.xml']
    sitemap_seen=set(); sitemap_urls=set(); sitemap_results=[]; findings=[]
    while sitemap_queue and len(sitemap_seen)<c['max_sitemaps'] and robots_ok:
        url=sitemap_queue.pop(0)
        if url in sitemap_seen or not client.allowed(url): continue
        sitemap_seen.add(url)
        r=client.get(url)
        sitemap_results.append({k:v for k,v in r.items() if k!='body'})
        try:
            tree=ET.fromstring(r.get('body',''))
            locs=[n.text.strip() for n in tree.iter() if n.tag.split('}')[-1]=='loc' and n.text]
            if tree.tag.split('}')[-1]=='sitemapindex': sitemap_queue.extend(locs)
            else:
                for node in tree:
                    for loc in node:
                        if loc.tag.split('}')[-1]=='loc' and loc.text and client.allowed(loc.text.strip()): sitemap_urls.add(clean_url(loc.text.strip(),root))
        except ET.ParseError: findings.append(issue('invalid_or_unavailable_sitemap',url,{'status':r['status']},5))
    sitemap_urls.discard(None)
    queue=list(dict.fromkeys([root+x for x in c['seed_paths']] + sorted(sitemap_urls)))
    seen=set(); pages=[]; link_sources=collections.defaultdict(set); skipped=[]
    while queue and len(pages)<c['max_pages'] and not client.stopped:
        url=queue.pop(0)
        if url in seen or not client.allowed(url): continue
        seen.add(url)
        if not robots_ok or not rp.can_fetch(c['user_agent'],url): skipped.append(url); continue
        r=client.get(url)
        if r.get('error')=='request_budget_or_rate_limit': break
        p=parse_page(r); pages.append(p)
        for link in p['links']:
            target=clean_url(link,p['final_url'])
            if target and client.allowed(target):
                link_sources[target].add(url)
                if target not in seen: queue.append(target)
    if not robots_ok: findings.append(issue('robots_unavailable',root+'/robots.txt',{'status':robots['status'],'error':robots.get('error')},5))
    by_url={p['url']:p for p in pages}
    for p in pages:
        url=p['url']; status=p['status']
        if p.get('error'): findings.append(issue('fetch_incomplete',url,p['error'],3))
        if status and status>=400: findings.append(issue('broken_internal_link' if link_sources[url] else 'missing_seed_or_sitemap_page',url,{'status':status,'linked_from':sorted(link_sources[url]),'in_sitemap':url in sitemap_urls},5 if link_sources[url] or url in sitemap_urls else 2))
        if len(p['redirects'])>1: findings.append(issue('redirect_chain',url,p['redirects'],3))
        if p['redirects'] and url in sitemap_urls: findings.append(issue('redirect_in_sitemap',url,p['redirects'],3))
        if status!=200: continue
        if not p['title']: findings.append(issue('missing_title',url,'HTML title absent',4))
        if not p['description'] or not p['description'][0].strip(): findings.append(issue('missing_description',url,'Meta description absent',2))
        if len(p['h1'])!=1: findings.append(issue('h1_count',url,p['h1'],2))
        if len(p['canonical'])!=1: findings.append(issue('canonical_count',url,p['canonical'],4))
        directives=' '.join(p['meta_robots'])+' '+p.get('headers',{}).get('x-robots-tag','')
        if 'noindex' in directives.lower() and url in sitemap_urls: findings.append(issue('noindex_in_sitemap',url,directives,5))
        for canonical in p['canonical']:
            canonical=clean_url(canonical,p['final_url'])
            if not canonical: findings.append(issue('canonical_unchecked',url,p['canonical'],3)); continue
            target=by_url.get(canonical)
            if not client.allowed(canonical): findings.append(issue('external_canonical',url,canonical,5))
            elif target and (target['status']!=200 or target['redirects'] or 'noindex' in ' '.join(target['meta_robots']).lower()): findings.append(issue('canonical_target_problem',url,canonical,5))
            elif canonical.rstrip('/')!=p['final_url'].rstrip('/') and url in sitemap_urls: findings.append(issue('sitemap_canonical_conflict',url,canonical,4))
        if p['schema_errors']: findings.append(issue('invalid_json_ld',url,p['schema_errors'],3))
    for key in ('title','description'):
        groups=collections.defaultdict(set)
        for p in pages:
            value=p[key]
            value='|'.join(value) if isinstance(value,list) else value
            if value and p['status']==200: groups[value].add(p['final_url'])
        for value,urls in groups.items():
            if len(urls)>1: findings.append(issue('duplicate_'+key,sorted(urls)[0],{'value':value,'pages':sorted(urls)},3,2,.8))
    probe=client.get(root+c['expected_missing_path']) if robots_ok and rp.can_fetch(c['user_agent'],root+c['expected_missing_path']) else {'status':None,'error':'robots_not_allowed'}
    if probe['status']==200: findings.append(issue('soft_404_probe',root+c['expected_missing_path'],'Nonexistent test URL returned HTTP 200',4))
    nap_variants=collections.defaultdict(set)
    for p in pages:
        for n in p['nap']:
            if n.get('address'): nap_variants[json.dumps(n['address'],ensure_ascii=False,sort_keys=True)].add(p['url'])
    if len(nap_variants)>1: findings.append(issue('nap_address_variants',root,[{'address':k,'pages':sorted(v)} for k,v in nap_variants.items()],4))
    for p in pages:
        if any('Lê Văn Thọ' in x or 'An Phú Đông' in x for x in p['address_evidence']): findings.append(issue('nap_text_review',p['url'],p['address_evidence'],3,1,.8))
    if not c.get('nap_verified'): findings.append(issue('nap_owner_confirmation_needed',root,'Canonical NAP source has not been approved by owner',4))
    variants=[client.get(u) for u in ('http://vinprint.vn/','https://www.vinprint.vn/')]
    if variants[0]['status']==200 and variants[0]['final_url'].startswith('http:'):
        findings.append(issue('http_not_redirected_to_https','http://vinprint.vn/',{'status':200,'redirects':variants[0]['redirects']},5,1))
    if variants[1].get('error'):
        findings.append(issue('www_variant_unavailable','https://www.vinprint.vn/',{'error':variants[1]['error'],'note':'Check DNS/TLS from another network before changing hosting.'},3,1,.8))
    return {'at':now(),'site':root,'mode':'read_only','pages':pages,'findings':sorted(findings,key=lambda x:-x['priority_score']),'robots':{k:v for k,v in robots.items()},'sitemaps':sitemap_results,'sitemap_urls':sorted(sitemap_urls),'host_variants':[{k:v for k,v in x.items() if k!='body'} for x in variants],'missing_page_probe':{k:v for k,v in probe.items() if k!='body'},'coverage':{'pages_checked':len(pages),'sitemap_urls':len(sitemap_urls),'requests':client.count,'pages_limit':c['max_pages'],'request_limit':c['max_requests'],'remaining_queue':len(set(queue)-seen),'robots_skipped':skipped,'sitemap_queue_remaining':len(sitemap_queue),'external_links':'not_checked_by_default','javascript_rendering':'not_executed','index':'HTTP eligibility only; Google index unverified'},'nap_variants':[{'address':k,'pages':sorted(v)} for k,v in nap_variants.items()]}

def render(report, out):
    findings=report['findings']; coverage=report['coverage']; esc=html.escape
    lines=['# VinPrint Web Operator — trạng thái', '', report['at'], '', f"Đã kiểm tra {coverage['pages_checked']} URL; sitemap có {coverage['sitemap_urls']} URL. Có {len(findings)} mục cần xem xét; không đồng nghĩa từng mục là lỗi SEO đã xác nhận.", '', 'Chế độ: chỉ đọc. Chưa có thay đổi production. Google index/traffic/conversion chỉ kết luận khi nguồn tương ứng có dữ liệu.', '', f"GSC: {report['google']['gsc']['status']}. GA4: {report['google']['ga4']['status']}. Core Web Vitals: {report['cwv']['status']}.", '', '| Ưu tiên | Phát hiện | URL |', '|---:|---|---|']
    lines += [f"| {x['priority_score']} | {LABELS.get(x['code'],x['code'])} | {x['url']} |" for x in findings]
    lines += ['', 'Giới hạn: HTML máy chủ; không chạy JavaScript hoặc gửi form, không tính request audit thành khách truy cập thật. Trùng title/intent là tín hiệu cần kiểm tra, không tự kết luận cannibalization. Chi tiết bằng chứng, phạm vi và dữ liệu còn thiếu trong audit.json.', '', 'Báo cáo kỹ thuật này không chứa dữ liệu truy vấn, doanh thu hoặc thông tin khách hàng.']
    (out/'status.md').write_text('\n'.join(lines),encoding='utf-8')
    rows=''.join('<tr><td>'+str(x['priority_score'])+'</td><td>'+esc(LABELS.get(x['code'],x['code']))+'</td><td>'+esc(x['url'])+'</td><td>'+esc(json.dumps(x['evidence'],ensure_ascii=False))+'</td></tr>' for x in findings)
    doc='''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VinPrint Web Operator</title><style>body{font:16px/1.55 system-ui;background:#f5f6f7;color:#18352d;margin:0}main{max-width:1180px;margin:auto;padding:32px}h1{margin-bottom:4px}.tag{display:inline-block;padding:8px 15px;background:#d7ecdf;border-radius:20px}.cards{display:flex;gap:14px;flex-wrap:wrap;margin:24px 0}.card{background:white;border:1px solid #dce4df;border-radius:14px;padding:20px;flex:1;min-width:160px}strong{font-size:28px}table{border-collapse:collapse;background:white;width:100%;font-size:13px}td,th{padding:12px;text-align:left;border-bottom:1px solid #eee;overflow-wrap:anywhere}td:last-child{max-width:430px}input{padding:12px;width:90%;margin-bottom:15px;border:1px solid #b5c9bd;border-radius:8px}.scroll{overflow:auto}small{color:#53675d}</style><main><small>VINPRINT / VẬN HÀNH WEBSITE</small><h1>VinPrint Web Operator</h1><p class="tag">Chỉ đọc · Thay đổi website cần duyệt</p><p>TIME</p><div class="cards"><div class="card"><strong>PAGES</strong><br>URL đã kiểm tra</div><div class="card"><strong>ITEMS</strong><br>Mục cần xem xét</div><div class="card">Search Console / GA4<br><b>GOOGLE</b></div><div class="card">Core Web Vitals<br><b>CWV</b></div></div><p>Chưa xác minh Google index. Không suy đoán traffic/ranking từ số URL. Báo cáo HTML máy chủ; chưa kiểm tra giao diện bằng JavaScript và toàn bộ link ngoài.</p><input aria-label="Lọc phát hiện" placeholder="Lọc theo URL hoặc vấn đề" oninput="for(const r of document.querySelectorAll('tbody tr'))r.hidden=!r.textContent.toLowerCase().includes(this.value.toLowerCase())"><div class="scroll"><table><thead><tr><th>Impact / effort</th><th>Phát hiện</th><th>URL</th><th>Bằng chứng</th></tr></thead><tbody>ROWS</tbody></table></div><p>Không có nút phê duyệt hoặc triển khai trên dashboard. Phê duyệt phải gắn với diff và phiên bản cụ thể trong PR.</p></main></html>'''
    for k,v in {'TIME':esc(report['at']),'PAGES':str(coverage['pages_checked']),'ITEMS':str(len(findings)),'GOOGLE':esc(report['google']['gsc']['status']+' / '+report['google']['ga4']['status']),'CWV':esc(report['cwv']['status']),'ROWS':rows}.items(): doc=doc.replace(k,v)
    doc=doc.replace('not_connected','Chưa kết nối').replace('unavailable','Chưa đo được').replace('Impact / effort','Điểm ưu tiên')
    (out/'dashboard.html').write_text(doc,encoding='utf-8')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--config',default=str(HERE/'config.json'))
    parser.add_argument('--output',default='work/web-operator')
    parser.add_argument('--skip-psi',action='store_true')
    args=parser.parse_args()
    c=json.loads(Path(args.config).read_text(encoding='utf-8'))
    if c.get('live_writes_enabled'): raise ValueError('This runner never supports live writes')
    out=Path(args.output).resolve(); out.mkdir(parents=True,exist_ok=True)
    lock=out/'.run.lock'
    try: lock_fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
    except FileExistsError: raise SystemExit('Another run may be active. Inspect lock and process before recovery.')
    try:
        os.write(lock_fd,str(os.getpid()).encode()); os.close(lock_fd)
        append_log(out/'events.jsonl',{'action':'audit_started','config_hash':digest(c),'decision':policy_decision('audit')})
        report=audit(c)
        report['cwv']={'status':'not_requested'} if args.skip_psi else pagespeed(c)
        google=collect_google(c)
        # Store sensitive reports locally, and only status summaries in public audit.
        if any(google[k]['status']=='connected' for k in ('gsc','ga4')): write_json(out/'private-google.json',google)
        report['google']={k:{x:y for x,y in google[k].items() if x in ('status','error')} for k in ('gsc','ga4','index')}
        previous=json.loads((out/'state.json').read_text()) if (out/'state.json').exists() else {}
        current={x['id']:digest(x['evidence']) for x in report['findings']}
        old=previous.get('findings',{})
        report['changes']={'new':[k for k in current if k not in old],'changed':[k for k in current if k in old and current[k]!=old[k]],'absent_since_previous':[k for k in old if k not in current], 'note':'Absence is not resolution when crawl coverage differs.'}
        stamp=report['at'].replace(':','-')
        write_json(out/'history'/f'{stamp}.json',report)
        write_json(out/'audit.json',report)
        render(report,out)
        write_json(out/'state.json',{'at':report['at'],'findings':current,'coverage':report['coverage']})
        append_log(out/'events.jsonl',{'action':'audit_completed','report_hash':digest(report),'pages':len(report['pages']),'findings':len(report['findings']),'production_writes':0})
        print(json.dumps({'output':str(out),'pages':len(report['pages']),'findings':len(report['findings']),'google':report['google'],'cwv':report['cwv']['status']},ensure_ascii=False))
    except Exception as e:
        append_log(out/'events.jsonl',{'action':'audit_failed','error_type':type(e).__name__})
        raise
    finally:
        lock.unlink(missing_ok=True)

if __name__=='__main__': main()
