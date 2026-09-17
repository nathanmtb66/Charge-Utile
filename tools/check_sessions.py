"""Vérifie les fichiers de séances (docs/data/sessions/*.json) contre le catalogue. Usage : python3 tools/check_sessions.py [fichier…]"""
import json, glob, os, sys, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'docs')
ex = {x['id']: x for x in json.load(open(os.path.join(SITE, 'data', 'exercises.json')))}
BT = {'cardio', 'circuit', 'series', 'libre'}
files = sys.argv[1:] or sorted(glob.glob(os.path.join(SITE, 'data', 'sessions', '*.json')))
errs = []
for f in files:
    d = json.load(open(f)); name = os.path.basename(f)
    E = lambda m: errs.append(f'{name} : {m}')
    if d.get('athlete') != name[:-5]: E('« athlete » doit être égal au nom du fichier')
    ZON = {'cou','epaules','haut-du-dos','bas-du-dos','hanches','fessiers','adducteurs','quadriceps','ischios','genoux','mollets','chevilles','pieds','poignets'}
    for z in d.get('focus', []):
        if z not in ZON: E(f'focus : zone inconnue {z}')
    ids = [s.get('id') for s in d.get('seances', [])]
    if len(ids) != len(set(ids)): E('ids de séance en double')
    for s in d.get('seances', []):
        W = lambda m: E(f"{s.get('id')} : {m}")
        try: datetime.date.fromisoformat(s['date'])
        except Exception: W('date invalide (AAAA-MM-JJ)')
        for k in ('id', 'titre', 'blocs'):
            if k not in s: W(f'champ manquant {k}')
        for b in s.get('blocs', []):
            if b.get('type') not in BT: W(f"bloc « {b.get('nom')} » : type inconnu {b.get('type')}")
            if b.get('type') == 'libre':
                continue
            if not b.get('items'): W(f"bloc « {b.get('nom')} » vide")
            for it in b.get('items', []):
                x = ex.get(it.get('ex'))
                if not x: W(f"exercice inconnu « {it.get('ex')} »"); continue
                if x.get('valide') is False: W(f"« {it['ex']} » n'est pas validé par Nathan")
                if not it.get('reps') and not it.get('duree'): W(f"« {it['ex']} » : il faut reps ou duree")
                if b['type'] == 'series' and not it.get('series'): W(f"« {it['ex']} » : il faut series dans un bloc series")
                if b['type'] == 'cardio' and not it.get('duree'): W(f"« {it['ex']} » : un bloc cardio se donne en durée")
                if 'tempo' in it and (len(it['tempo']) != 4 or not all(str(v) == 'X' or str(v).isdigit() for v in it['tempo'])): W(f"« {it['ex']} » : tempo invalide")
                if it.get('rpe') is not None and not (1 <= it['rpe'] <= 10): W(f"« {it['ex']} » : rpe hors 1-10")
if errs: print('\n'.join(errs)); sys.exit(1)
print(f'{len(files)} fichier(s) de séances OK')
