# Writes the test build start page and its manifest from index.html, pointing at the test build file and the test Worker.
# usage: python3 make-build-entry.py /path/to/app/public build-sinajee-YYYY.MM.DD-bN.js
import re, sys, json, os
pub, bundle = sys.argv[1], sys.argv[2]
UAT_API = "https://reservoir-api-uat.directflow.workers.dev"
PATH = "/sinajee-uat"
h = open(os.path.join(pub, "index.html"), encoding="utf-8").read()
h = h.replace("<title>Reservoir</title>", "<title>Sinajee UAT</title>")
h = h.replace('<meta name="apple-mobile-web-app-title" content="Reservoir">', '<meta name="apple-mobile-web-app-title" content="Sinajee UAT">')
h = re.sub(r'<link rel="icon" type="image/png" href="([^"]*)">', lambda m: m.group(0) + '<link rel="manifest" href="/build-manifest.webmanifest">', h, count=1)
h = re.sub(r'Full-Reservoir-\d{4}\.\d{2}\.\d{2}-v\d+\.js', bundle, h)
h = re.sub(r'<script src="/?' + re.escape(bundle) + '"', f'<script>window.RSV_API="{UAT_API}";window.RSV_REDIRECT=location.origin+"{PATH}"</script>\n<script src="/{bundle}"', h, count=1)
h = h.replace("Reservoir did not load.", "Sinajee UAT did not load.")
assert "RSV_API" in h and bundle in h and "Full-Reservoir" not in h.replace("Full-Reservoir-2026.11.18-v1", "")
open(os.path.join(pub, "build-index.html"), "w", encoding="utf-8").write(h)
man = {"id": PATH, "name": "Sinajee UAT", "short_name": "Sinajee UAT", "start_url": PATH, "scope": "/", "display": "standalone", "background_color": "#434343", "theme_color": "#434343",
       "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"}, {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}]}
open(os.path.join(pub, "build-manifest.webmanifest"), "w", encoding="utf-8").write(json.dumps(man, indent=2) + "\n")
print("build entry written")
