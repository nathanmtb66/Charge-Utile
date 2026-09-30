"""Contrôle le travail de recherche avant chaque commit.
Usage (depuis la racine du dépôt) : python3 recherche/verifie.py
- recherche/exercices/*.json : fiches candidates (format docs/data/SCHEMA.md + champs de recherche)
- recherche/modeles/*.json   : séances modèles (format « seances » de SCHEMA.md)
- recherche/sources.json     : bibliographie (chaque source citée dans les .md doit y être)
Sort en erreur (code 1) au moindre problème, avec un message clair."""
import json, glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build_catalog import validate, load as load_catalog, FAM   # mêmes règles que le vrai catalogue

R = os.path.join(ROOT, 'recherche')
errs = []
E = errs.append

# ---------- exercices candidats ----------
existing = load_catalog()
old_ids = {x['id'] for x in existing}
anims = set(json.load(open(os.path.join(ROOT, 'qa', 'anims.json'))))
cands = []
for f in sorted(glob.glob(os.path.join(R, 'exercices', '*.json'))):
    try: data = json.load(open(f))
    except Exception as e: E(f'{os.path.basename(f)} : JSON invalide ({e})'); continue
    if not isinstance(data, list): E(f'{os.path.basename(f)} : doit être un tableau de fiches'); continue
    for x in data:
        x['_fichier'] = os.path.basename(f); cands.append(x)
for x in cands:
    w = lambda m: E(f"{x.get('id')} ({x['_fichier']}) : {m}")
    if x.get('id') in old_ids: w('existe déjà dans le catalogue de l’appli')
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', str(x.get('id', ''))): w('id : minuscules, chiffres et tirets seulement')
    for k in ('priorite', 'prescription', 'preuve', 'sports', 'varianteDe'):
        if k not in x: w(f'champ de recherche manquant « {k} »')
    if x.get('priorite') not in (1, 2, 3): w('priorite : 1, 2 ou 3')
    if not re.match(r'^[ABCD]\b', str(x.get('preuve', ''))): w('preuve : doit commencer par A, B, C ou D')
    if x.get('varianteDe') and x['varianteDe'] not in old_ids: w(f"varianteDe : id inconnu {x['varianteDe']}")
    if x.get('valide') is not False: w('valide doit être false (seul Nathan valide)')
    if x.get('anim') is None and not x.get('animAFaire'): w('anim null : décris la pose à créer dans « animAFaire »')
    if len(x.get('erreurs', [])) < 2: w('il faut 2 erreurs fréquentes')
    if not x.get('materiel'): w('materiel manquant (["aucun"] si rien)')
# mêmes règles que le catalogue réel (familles, tags, matériel, consignes ≤ 48, zones…), anim null tolérée si animAFaire
tmp = [dict(x, anim=(x['anim'] if x.get('anim') else next(iter(anims)))) for x in cands]
for m in validate(existing + tmp, anims):
    if any(m.startswith(f"{x['id']} ") for x in cands) or 'en double' in m: E(m)
cand_ids = {x['id'] for x in cands}

# ---------- séances modèles ----------
all_ids = old_ids | cand_ids
tests = {t['id'] for t in json.load(open(os.path.join(ROOT, 'docs', 'data', 'tests.json')))['tests']}
nmod = 0
for f in sorted(glob.glob(os.path.join(R, 'modeles', '*.json'))):
    try: d = json.load(open(f))
    except Exception as e: E(f'{os.path.basename(f)} : JSON invalide ({e})'); continue
    for s in d.get('seances', []):
        nmod += 1
        w = lambda m: E(f"modèle {s.get('id')} ({os.path.basename(f)}) : {m}")
        for k in ('id', 'titre', 'blocs', 'sport', 'phase', 'duree', 'materiel', 'pourquoi', 'preuve'):
            if k not in s: w(f'champ manquant {k}')
        for b in s.get('blocs', []):
            if b.get('type') not in {'cardio', 'circuit', 'series', 'libre', 'test'}: w(f"type de bloc inconnu {b.get('type')}")
            for it in b.get('items', []):
                if 'test' in it:
                    if it['test'] not in tests: w(f"test inconnu {it['test']}")
                elif it.get('ex') not in all_ids: w(f"exercice inconnu {it.get('ex')}")

# ---------- sources ----------
nsrc = 0
sf = os.path.join(R, 'sources.json')
if os.path.exists(sf):
    try:
        src = json.load(open(sf)); nsrc = len(src)
        keys = [s.get('cle') for s in src]
        for s in src:
            if not s.get('cle') or not s.get('url') or not s.get('annee'): E(f"source {s.get('cle')} : cle, url et annee obligatoires")
        if len(keys) != len(set(keys)): E('sources.json : clés en double')
        cited = set()
        for md in glob.glob(os.path.join(R, '**', '*.md'), recursive=True):
            cited |= set(re.findall(r'\[@([A-Za-z0-9_\-]+)\]', open(md).read()))
        missing = cited - set(keys)
        if missing: E(f'citées dans les .md mais absentes de sources.json : {sorted(missing)[:20]}')
    except Exception as e: E(f'sources.json invalide ({e})')

if errs:
    print('\n'.join(errs[:200])); print(f'\n{len(errs)} problème(s).'); sys.exit(1)
print(f'OK · {len(cands)} exercices candidats · {nmod} séances modèles · {nsrc} sources')
