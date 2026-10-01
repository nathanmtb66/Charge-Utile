"""Contrôle UN fichier de fiches candidates (mêmes règles que recherche/verifie.py, plus des contrôles de qualité).
Usage : python3 recherche/_outils/verifie_fiches.py recherche/exercices/<fichier>.json
Les ids doivent aussi être inédits par rapport aux autres fichiers de recherche/exercices/."""
import json, glob, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build_catalog import validate, load as load_catalog
R = os.path.join(ROOT, 'recherche')
f = os.path.abspath(sys.argv[1])
existing = load_catalog(); old_ids = {x['id'] for x in existing}
anims = set(json.load(open(os.path.join(ROOT, 'qa', 'anims.json'))))
src = {s['cle'] for s in json.load(open(os.path.join(R, 'sources.json')))}
autres = {}
for g in glob.glob(os.path.join(R, 'exercices', '*.json')):
    if os.path.abspath(g) == f: continue
    try:
        for x in json.load(open(g)): autres[x.get('id')] = os.path.basename(g)
    except Exception: pass
errs = []; E = errs.append
data = json.load(open(f))
assert isinstance(data, list), 'le fichier doit être un tableau JSON'
SPORTS = {'xco', 'route', 'trail', 'triathlon', 'nordique'}
vus = set()
for x in data:
    x['_fichier'] = os.path.basename(f)
    w = lambda m: E(f"{x.get('id')} : {m}")
    i = x.get('id')
    if i in old_ids: w('existe déjà dans le catalogue')
    if i in autres: w(f'id déjà pris dans {autres[i]}')
    if i in vus: w('id en double dans le fichier')
    vus.add(i)
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', str(i or '')): w('id : minuscules, chiffres, tirets')
    for k in ('nom', 'famille', 'type', 'unilateral', 'muscles', 'musclesTxt', 'materiel', 'niveau', 'consignes', 'erreurs', 'pourquoi', 'respiration', 'securite', 'tags', 'alternatives', 'tempoConseille', 'voirEnVrai', 'valide', 'anim', 'priorite', 'prescription', 'preuve', 'sports', 'varianteDe'):
        if k not in x: w(f'champ manquant « {k} »')
    if x.get('priorite') not in (1, 2, 3): w('priorite : 1, 2 ou 3')
    if not re.match(r'^[ABCD]\b', str(x.get('preuve', ''))): w('preuve : commence par A, B, C ou D')
    for k in re.findall(r'\[@([A-Za-z0-9_\-]+)\]', str(x.get('preuve', ''))):
        if k not in src: w(f'preuve : clé de source inconnue {k} (doit exister dans recherche/sources.json)')
    if not re.search(r'\[@', str(x.get('preuve', ''))) and not str(x.get('preuve', '')).startswith('D'): w('preuve A/B/C sans clé de source')
    if x.get('varianteDe') and x['varianteDe'] not in old_ids: w(f"varianteDe inconnu {x['varianteDe']}")
    if x.get('valide') is not False: w('valide doit être false')
    if x.get('anim') is None and not x.get('animAFaire'): w('anim null → décrire la pose dans animAFaire')
    if x.get('anim') is None and len(str(x.get('animAFaire', ''))) < 80: w('animAFaire trop court (départ s=0, position s=1, appuis, angles, matériel)')
    if len(x.get('erreurs', [])) != 2: w('il faut exactement 2 erreurs')
    if len(x.get('consignes', [])) != 3: w('il faut exactement 3 consignes')
    if not x.get('materiel'): w('materiel manquant (["aucun"] si rien)')
    if x.get('niveau') not in (1, 2, 3): w('niveau 1, 2 ou 3')
    if not isinstance(x.get('sports'), list) or not x.get('sports') or set(x['sports']) - SPORTS: w(f'sports : liste parmi {sorted(SPORTS)}')
    t = x.get('tempoConseille')
    if t is not None and not (isinstance(t, list) and len(t) == 4): w('tempoConseille : 4 valeurs ou null')
    if x.get('voirEnVrai') is not None and not str(x['voirEnVrai']).startswith('https://'): w('voirEnVrai : URL https ou null')
    if x.get('type') == 'hold' and x.get('famille') in ('etirement', 'mobilite', 'gainage', 'proprio') and 'dureeConseillee' not in x: w('dureeConseillee attendue (tenue)')
tmp = [dict(x, anim=(x['anim'] if x.get('anim') else next(iter(anims)))) for x in data]
for m in validate(existing + tmp, anims):
    if any(m.startswith(f"{x['id']} ") for x in data) or 'en double' in m: E(m)
if errs:
    print('\n'.join(errs[:150])); print(f'\n{len(errs)} problème(s) dans {os.path.basename(f)}'); sys.exit(1)
import collections
print(f"OK · {len(data)} fiches · priorité {dict(collections.Counter(x['priorite'] for x in data))} · anim réutilisée {sum(1 for x in data if x.get('anim'))} / à créer {sum(1 for x in data if not x.get('anim'))} · liens vidéo {sum(1 for x in data if x.get('voirEnVrai'))}")
