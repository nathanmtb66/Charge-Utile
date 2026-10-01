"""Contrôle strict des séances modèles (recherche/modeles/*.json), en plus de recherche/verifie.py.
Usage : python3 recherche/_outils/verifie_modeles.py [fichier.json]   (sans argument : tous + couverture globale)"""
import json, glob, os, re, sys, collections
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
R = os.path.join(ROOT, 'recherche')
cat = {x['id']: x for x in json.load(open(os.path.join(ROOT, 'docs', 'data', 'exercises.json')))}
for f in glob.glob(os.path.join(R, 'exercices', '*.json')):
    for x in json.load(open(f)): cat[x['id']] = x
tests = {t['id'] for t in json.load(open(os.path.join(ROOT, 'docs', 'data', 'tests.json')))['tests']}
src = {s['cle'] for s in json.load(open(os.path.join(R, 'sources.json')))}
PHASES = {'PPG', 'PPO', 'PPS', 'PPC', 'AFFUTAGE', 'TRANSITION', 'RECUP'}
SPORTS = {'vtt': 'vtt', 'route': 'route', 'trail': 'trail', 'triathlon': 'triathlon', 'nordique': 'nordique', 'transversal': None}
MAT = {'salle', 'halteres', 'elastique', 'aucun'}
CTX = {'maintien-saison', 'voyage', 'genou', 'cheville', 'epaule', 'retour-coupure', 'veille-course', 'plio-trail', 'force-max', 'puissance', 'recup', 'os', 'express', 'decouverte', 'tests'}
errs = []; toutes = []
files = [os.path.abspath(a) for a in sys.argv[1:]] or sorted(glob.glob(os.path.join(R, 'modeles', '*.json')))
ids = collections.Counter()
for f in files:
    nom = os.path.basename(f)[:-5]
    d = json.load(open(f))
    if not isinstance(d, dict) or not isinstance(d.get('seances'), list): errs.append(f'{nom} : le fichier doit être {{"seances": [...]}}'); continue
    for s in d['seances']:
        E = lambda m: errs.append(f"{nom} / {s.get('id')} : {m}")
        ids[s.get('id')] += 1; toutes.append((nom, s))
        for k in ('id', 'titre', 'rpe', 'dureeMin', 'message', 'blocs', 'sport', 'phase', 'duree', 'materiel', 'niveau', 'pourquoi', 'preuve'):
            if k not in s: E(f'champ manquant {k}')
        if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', str(s.get('id', ''))): E('id en kebab-case')
        if nom in SPORTS and SPORTS[nom] and s.get('sport') != SPORTS[nom]: E(f"sport doit être « {SPORTS[nom]} » dans ce fichier")
        if nom == 'transversal' and s.get('sport') != 'tous': E('sport doit être « tous » dans transversal.json')
        if s.get('phase') not in PHASES: E(f"phase inconnue {s.get('phase')}")
        if s.get('materiel') not in MAT: E(f"materiel : {sorted(MAT)}")
        if s.get('niveau') not in (1, 2, 3): E('niveau 1, 2 ou 3')
        if not isinstance(s.get('duree'), (int, float)) or not 5 <= s['duree'] <= 90: E('duree en minutes, entre 5 et 90')
        if s.get('dureeMin') != s.get('duree'): E('dureeMin (champ de l’appli) doit être égal à duree')
        if not re.match(r'^[ABCD]\b', str(s.get('preuve', ''))): E('preuve : commence par A, B, C ou D')
        for k in re.findall(r'\[@([A-Za-z0-9_\-]+)\]', str(s.get('preuve', ''))):
            if k not in src: E(f'preuve : clé inconnue {k}')
        for c in s.get('contextes', []):
            if c not in CTX: E(f'contexte inconnu {c} ({sorted(CTX)})')
        if len(str(s.get('pourquoi', ''))) > 220: E('pourquoi : une phrase (220 caractères au plus)')
        if not s.get('blocs'): E('aucun bloc')
        for b in s.get('blocs', []):
            bt = b.get('type')
            if bt not in {'cardio', 'circuit', 'series', 'libre', 'test'}: E(f"type de bloc inconnu {bt}"); continue
            if bt != 'libre' and not b.get('items'): E(f"bloc « {b.get('nom')} » vide")
            if bt == 'circuit' and not b.get('tours'): E(f"bloc circuit « {b.get('nom')} » sans tours")
            for it in b.get('items', []):
                if bt == 'test':
                    if it.get('test') not in tests: E(f"test inconnu {it.get('test')}")
                    continue
                x = cat.get(it.get('ex'))
                if not x: E(f"exercice inconnu {it.get('ex')}"); continue
                if bt == 'libre': continue
                if not it.get('reps') and not it.get('duree'): E(f"{it['ex']} : il faut reps ou duree")
                if bt == 'series' and not it.get('series'): E(f"{it['ex']} : il faut series dans un bloc series")
                if bt == 'cardio' and not it.get('duree'): E(f"{it['ex']} : un bloc cardio se donne en durée")
                if 'tempo' in it and (len(it['tempo']) != 4 or not all(str(v) == 'X' or str(v).isdigit() for v in it['tempo'])): E(f"{it['ex']} : tempo invalide")
                if it.get('rpe') is not None and not (isinstance(it['rpe'], (int, float)) and 1 <= it['rpe'] <= 10): E(f"{it['ex']} : rpe hors 1-10")
                if 'pct' in it or 'charge' in it and isinstance(it['charge'], (int, float)): E(f"{it['ex']} : pas de charge en kg ni de pct dans un modèle (utilise rpe et note)")
                if x['type'] == 'hold' and not it.get('duree'): E(f"{it['ex']} : exercice tenu, donne une duree")
        # matériel cohérent avec la promesse
        if s.get('materiel') == 'aucun':
            for b in s.get('blocs', []):
                for it in b.get('items', []):
                    x = cat.get(it.get('ex'))
                    if x and set(x.get('materiel', [])) - {'aucun', 'tapis', 'mur', 'marche'}: E(f"{it['ex']} demande du matériel ({x['materiel']}) dans une séance « aucun »")
for i, n in ids.items():
    if n > 1: errs.append(f'id de séance en double : {i}')
if errs:
    print('\n'.join(errs[:150])); print(f'\n{len(errs)} problème(s)'); sys.exit(1)
print(f'OK · {len(toutes)} séances')
if not sys.argv[1:]:
    par = collections.defaultdict(set); ctx = collections.Counter(); mat = collections.Counter(); cand = set()
    for nom, s in toutes:
        par[s['sport']].add(s['phase']); mat[s['materiel']] += 1
        for c in s.get('contextes', []): ctx[c] += 1
    for sp in ('vtt', 'route', 'trail'):
        manq = PHASES - {'RECUP'} - par[sp] if sp in par else PHASES
        print(f'  {sp} : phases {sorted(par[sp])}' + (f' — MANQUE {sorted(manq)}' if manq else ''))
    for sp in ('triathlon', 'nordique', 'tous'): print(f'  {sp} : phases {sorted(par[sp])}')
    print('  contextes :', dict(ctx)); print('  matériel :', dict(mat))
    need = {'maintien-saison', 'voyage', 'genou', 'cheville', 'epaule', 'retour-coupure', 'veille-course', 'plio-trail', 'force-max', 'puissance', 'recup'}
    if need - set(ctx): print('  CONTEXTES MANQUANTS :', sorted(need - set(ctx)))
