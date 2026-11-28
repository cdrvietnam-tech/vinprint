"""Bounded public metadata research. No assets, forms, login, or full article storage."""
import json, sys, time, urllib.request, urllib.error, urllib.robotparser
from html.parser import HTMLParser
from urllib.parse import urlsplit
from pathlib import Path

URLS = [
    "https://fasto.vn/vi/dich-vu-in-tem-nhan-decal",
    "https://inanhono.com/in-tem-nhan/",
    "https://thegioiinan.com/sanpham/in-nhan-decal-uv-dtf-nhan-decal-uv-noi-tem-nhan-uv-dtf.html",
    "https://indaiviet.com/san-pham/in-decal/",
]
AGENT = "VinPrintResearch/1.0 (+https://vinprint.vn; public metadata research)"
class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.active = None; self.buffer = []; self.title = ""; self.headings = []
    def handle_starttag(self, tag, attrs):
        if tag in ("title", "h1", "h2"):
            self.active = tag; self.buffer = []
    def handle_data(self, data):
        if self.active: self.buffer.append(data)
    def handle_endtag(self, tag):
        if tag == self.active:
            value = " ".join(" ".join(self.buffer).split())[:180]
            if tag == "title": self.title = value
            elif value and len(self.headings) < 10: self.headings.append({"level": tag, "text": value})
            self.active = None
def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(request, timeout=18) as response:
        if response.url.split('/')[2] != url.split('/')[2]: raise ValueError("cross-host redirect skipped")
        raw = response.read(3_000_001)
        if len(raw) > 3_000_000: raise ValueError("response too large")
        return response.status, raw.decode("utf-8", errors="replace")
results = []
for url in URLS:
    item = {"url": url}; base = f"{urlsplit(url).scheme}://{urlsplit(url).netloc}"
    try:
        try:
            status, robots = fetch(base + "/robots.txt")
            parser = urllib.robotparser.RobotFileParser(); parser.parse(robots.splitlines())
            item["robotsStatus"] = status
            if not parser.can_fetch(AGENT, url):
                item["status"] = "robots-disallowed"; results.append(item); continue
        except urllib.error.HTTPError as error:
            item["robotsStatus"] = error.code
            if error.code != 404: raise
        time.sleep(.5)
        status, html = fetch(url); parsed = Metadata(); parsed.feed(html)
        item.update(status=status, title=parsed.title, headings=parsed.headings)
    except Exception as error:
        item["status"] = "skipped"; item["reason"] = type(error).__name__
    results.append(item); time.sleep(.5)
output = Path(sys.argv[1] if len(sys.argv) > 1 else ".preview/competitor-metadata.json")
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps({"scope": "4 selected public pages; robots respected; no full article or asset storage", "pages": results}, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps([{ "url": p["url"], "status": p["status"] } for p in results]))
