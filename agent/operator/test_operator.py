import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('vinprint_audit',Path(__file__).with_name('audit.py'))
audit=importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)

class OperatorTests(unittest.TestCase):
    def test_live_and_unknown_actions_are_blocked(self):
        for action in ('publish','delete_page','redirect','change_url','price','brand_claim','layout','canonical','robots','schema','deploy','merge'):
            self.assertEqual(audit.policy_decision(action),'owner_approval_required_no_executor')
        self.assertEqual(audit.policy_decision('invented_action'),'deny')
        self.assertEqual(audit.policy_decision('write_draft','agent/operator/drafts/example.md'),'allow_local_only')
        for path in ('agent/operator/drafts/../../app/page.tsx','agent/operator/drafts/a.py','C:/agent/operator/drafts/a.md','agent/operator/drafts//a.md'):
            self.assertEqual(audit.policy_decision('write_draft',path),'deny')
    def test_log_detects_tampering(self):
        with tempfile.TemporaryDirectory() as folder:
            p=Path(folder)/'log.jsonl'
            audit.append_log(p,{'action':'first'})
            audit.append_log(p,{'action':'second'})
            p.write_text(p.read_text().replace('first','other'))
            with self.assertRaises(ValueError): audit.append_log(p,{'action':'third'})
    def test_parser_reads_nested_heading_and_schema(self):
        p=audit.parse_page({'url':'https://vinprint.vn/a','final_url':'https://vinprint.vn/a','body':'<title>A &amp; B</title><h1>In <span>tem</span></h1><meta name="robots" content="noindex"><link rel="canonical" href="/a"><script type="application/ld+json">{"@graph":[{"@type":"LocalBusiness","name":"VinPrint"}]}</script><script>ignored()</script>'})
        self.assertEqual(p['h1'],['In tem'])
        self.assertEqual(p['title'],'A & B')
        self.assertEqual(p['canonical'],['https://vinprint.vn/a'])
        self.assertEqual(p['schema_types'],['LocalBusiness'])
        self.assertEqual(p['nap'][0]['name'],'VinPrint')
    def test_scope_prevents_credentials_cross_host_and_admin(self):
        c=json.loads(Path(__file__).with_name('config.json').read_text())
        client=audit.Client(c)
        for u in ('https://127.0.0.1/a','https://vinprint.vn.evil.example/','https://vinprint.vn:1234/','https://user:secret@vinprint.vn/'):
            self.assertFalse(client.allowed(u))
        self.assertTrue(client.allowed('https://vinprint.vn/'))
        for u in ('/api/delete','/checkout','/admin','/foo?token=secret','javascript:alert(1)'):
            self.assertIsNone(audit.clean_url(u,'https://vinprint.vn/'))
    def test_overlap_is_only_a_candidate(self):
        rows=[{'keys':['tem giấy','https://vinprint.vn/a'],'clicks':3,'impressions':100,'position':8,'ctr':.03},{'keys':['tem giấy','https://vinprint.vn/b'],'clicks':2,'impressions':80,'position':12,'ctr':.025},{'keys':['ít dữ liệu','https://vinprint.vn/c'],'impressions':2,'position':6}]
        candidates, overlaps=audit.opportunities(rows,30)
        self.assertEqual(len(candidates),2)
        self.assertEqual(len(overlaps),1)
        self.assertIn('possible',overlaps[0]['status'])
        self.assertEqual(audit.opportunities([],30),([],[]))
    def test_dashboard_escapes_external_content(self):
        with tempfile.TemporaryDirectory() as folder:
            r={'at':'test','coverage':{'pages_checked':1,'sitemap_urls':1},'findings':[audit.issue('x','https://vinprint.vn/','<script>alert(1)</script>')],'google':{'gsc':{'status':'not_connected'},'ga4':{'status':'not_connected'}},'cwv':{'status':'unavailable'}}
            audit.render(r,Path(folder))
            self.assertNotIn('<script>alert(1)</script>',(Path(folder)/'dashboard.html').read_text(encoding='utf-8'))

if __name__=='__main__': unittest.main()
