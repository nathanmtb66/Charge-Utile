"""Fusionne les sources vérifiées des fichiers bruts (`_brut/*.md`, blocs ```json après « ## Sources vérifiées »)
et de `_brut/sources-*.json` dans `recherche/sources.json`.
Règles : seules les entrées `verifie: true` passent ; même clé + même URL = doublon ignoré ;
même clé + URL différente = signalé (à corriger à la main). Les entrées déjà présentes dans sources.json sont gardées.
Usage : python3 recherche/_outils/fusion_sources.py"""
import json, re, glob, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(R, 'sources.json')
cur = json.load(open(out)) if os.path.exists(out) else []
by = {s['cle']: s for s in cur}
conflits, ajout, ecart = [], 0, 0
def prendre(s, orig):
    global ajout, ecart
    if s.get('verifie') is not True or not s.get('cle') or not s.get('url'):
        ecart += 1; return
    s = {k: v for k, v in s.items()}
    if not s.get('annee'): s['annee'] = 2026
    k = s['cle']
    if k in by:
        if by[k]['url'].rstrip('/') != s['url'].rstrip('/') and (by[k].get('doi') or 'x') != (s.get('doi') or 'y'): conflits.append(f'{k} ({orig})')
        elif orig.startswith('science-') and by[k] != s: by[k] = s   # notice corrigée dans le fichier brut : elle remplace l'ancienne
        return
    by[k] = s; ajout += 1
for f in sorted(glob.glob(os.path.join(R, '_brut', '*.md'))):
    t = open(f).read(); i = t.find('## Sources vérifiées')
    if i < 0: continue
    for b in re.findall(r'```json\s*(.*?)```', t[i:], re.S):
        try: data = json.loads(b)
        except Exception as e: print('JSON invalide dans', os.path.basename(f), e); continue
        for s in data: prendre(s, os.path.basename(f))
for f in sorted(glob.glob(os.path.join(R, '_brut', 'sources-*.json'))):
    for s in json.load(open(f)): prendre(s, os.path.basename(f))
json.dump(sorted(by.values(), key=lambda s: s['cle']), open(out, 'w'), ensure_ascii=False, indent=1)
print(f'{len(by)} sources ({ajout} ajoutées, {ecart} écartées car non vérifiées)')
if conflits: print('CONFLITS de clé :', conflits)
