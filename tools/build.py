"""Construit l'appli Charge Utile.
  python3 tools/build.py          → valide tout, génère docs/index.html + docs/sw.js + dist/apercu.html
Étapes : animations (node tools/anims.js) → catalogue (tools/build_catalog.py) → séances (tools/check_sessions.py) → pages."""
import json, os, subprocess, hashlib, base64, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'docs'); DIST = os.path.join(ROOT, 'dist')
run = lambda *a: subprocess.run(a, cwd=ROOT, check=True)
run('python3', 'tools/build_catalog.py', '--sans-anims')   # 1re passe : fusionne, sans vérifier les anims (la liste est refaite juste après)
run('node', 'tools/anims.js')
run('python3', 'tools/build_catalog.py')   # 2e passe : vérifie aussi que chaque anim existe
run('python3', 'tools/check_sessions.py')

moves = json.load(open(os.path.join(SITE, 'moves', 'index.json')))
tpl = open(os.path.join(SITE, 'index.template.html')).read()
body = open(os.path.join(SITE, 'body.fragment.html')).read()
html = tpl.replace('<!--BODY-->', body).replace('<!--MOVES-->', '\n'.join(f'<script src="moves/{m}.js"></script>' for m in moves))
open(os.path.join(SITE, 'index.html'), 'w').write(html)

cat = open(os.path.join(SITE, 'catalogue.template.html')).read().replace('<!--MOVES-->', '\n'.join(f'<script src="moves/{m}.js"></script>' for m in moves))
open(os.path.join(SITE, 'catalogue.html'), 'w').write(cat)

assets = ['./', 'index.html', 'catalogue.html', 'manifest.webmanifest', 'css/app.css', 'js/three.min.js', 'js/body.js', 'js/engine.js', 'js/app.js',
          'data/exercises.json', 'data/tests.json'] + [f'moves/{m}.js' for m in moves] + sorted('fonts/' + f for f in os.listdir(os.path.join(SITE, 'fonts'))) + sorted('icons/' + f for f in os.listdir(os.path.join(SITE, 'icons')))
h = hashlib.sha1()
for a in assets:
    p = os.path.join(SITE, 'index.html' if a == './' else a); h.update(open(p, 'rb').read())
ver = h.hexdigest()[:10]
sw = open(os.path.join(ROOT, 'tools', 'sw.template.js')).read().replace('__VERSION__', ver).replace('__ASSETS__', json.dumps(assets))
open(os.path.join(SITE, 'sw.js'), 'w').write(sw)

# ---- aperçu en un seul fichier (sans service worker, données intégrées) ----
os.makedirs(DIST, exist_ok=True)
css = open(os.path.join(SITE, 'css', 'app.css')).read()
def font_inline(m):
    data = base64.b64encode(open(os.path.join(SITE, 'fonts', m.group(1)), 'rb').read()).decode()
    return f"url(data:font/woff2;base64,{data})"
css = re.sub(r"url\(\.\./fonts/([^)]+)\)", font_inline, css)
js = lambda p: open(os.path.join(SITE, p)).read().replace('</script', '<\\/script')
sessions = {os.path.basename(f)[:-5]: json.load(open(f)) for f in glob.glob(os.path.join(SITE, 'data', 'sessions', '*.json'))}
data = {'exercises': json.load(open(os.path.join(SITE, 'data', 'exercises.json'))), 'tests': json.load(open(os.path.join(SITE, 'data', 'tests.json'))), 'sessions': sessions, 'defaultCode': 'demo'}
parts = ['<title>Charge Utile</title>', '<meta name="theme-color" content="#0B0E11">', f'<style>{css}</style>', body,
         f'<script>window.CU_DATA = {json.dumps(data, ensure_ascii=False)};try{{if(!localStorage.getItem("cu.code"))localStorage.setItem("cu.code",JSON.stringify("demo"))}}catch(e){{}}</script>']
for p in ['js/three.min.js', 'js/body.js', 'js/engine.js'] + [f'moves/{m}.js' for m in moves] + ['js/app.js']:
    parts.append(f'<script>{js(p)}</script>')
open(os.path.join(DIST, 'apercu.html'), 'w').write('\n'.join(parts))
print(f'docs/ prêt (version {ver}, {len(assets)} fichiers hors-ligne) · dist/apercu.html {os.path.getsize(os.path.join(DIST, "apercu.html"))//1024} Ko')
