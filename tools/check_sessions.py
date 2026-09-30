"""Vérifie les fichiers de séances (docs/data/sessions/*.json) contre le catalogue. Usage : python3 tools/check_sessions.py [fichier…]"""
import json, glob, os, sys, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'docs')
ex = {x['id']: x for x in json.load(open(os.path.join(SITE, 'data', 'exercises.json')))}
BT = {'cardio', 'circuit', 'series', 'libre', 'test'}
TESTS = {t['id']: t for t in json.load(open(os.path.join(SITE, 'data', 'tests.json')))['tests']}
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
            if b.get('type') == 'test':
                if not b.get('items'): W(f"bloc « {b.get('nom')} » vide")
                for it in b.get('items', []):
                    t = TESTS.get(it.get('test'))
                    if not t: W(f"test inconnu « {it.get('test')} »"); continue
                    if it['test'] == 'rm':
                        if it.get('ex') not in ex: W(f"test RM : exercice inconnu « {it.get('ex')} »")
                        if not 1 <= int(it.get('reps', 5)) <= 12: W(f"test RM « {it.get('ex')} » : reps entre 1 et 12")
                        if not 0 <= int(it.get('rir', 1)) <= 3: W(f"test RM « {it.get('ex')} » : rir entre 0 et 3")
                    if 'e1rm' in it and not isinstance(it['e1rm'], (int, float)): W(f"« {it['test']} » : e1rm doit être un nombre")
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
                if 'pct' in it or 'base' in it:
                    base = {'squat': 'squat-barre', 'sdt': 'souleve-de-terre'}.get(it.get('base', it['ex']), it.get('base', it['ex']))
                    if base not in ex or not isinstance(it.get('pct'), (int, float)) or not 30 <= it['pct'] <= 105: W(f"« {it['ex']} » : pct (30-105) et base (un exercice du catalogue) vont ensemble")
                    if not isinstance(it.get('charge'), (int, float)): W(f"« {it['ex']} » : en % du max, écris aussi la charge calculée en kg")
    sa = d.get('saison')
    if sa is not None:
        SE = lambda m: E(f'saison : {m}')
        TY = {'TRANSITION', 'PPG', 'PPO', 'PPS', 'PPC', 'AFFUTAGE', 'RECUP'}
        def dt(v, what):
            try: return datetime.date.fromisoformat(v)
            except Exception: SE(f'{what} : date invalide « {v} » (AAAA-MM-JJ)')
        bl = sorted(sa.get('blocs', []), key=lambda b: b.get('debut', ''))
        prev = None
        for b in bl:
            nm = b.get('nom') or b.get('type')
            if b.get('type') not in TY: SE(f"bloc « {nm} » : type {b.get('type')} inconnu ({', '.join(sorted(TY))})")
            a, z = dt(b.get('debut'), f'bloc « {nm} » début'), dt(b.get('fin'), f'bloc « {nm} » fin')
            if a and z and z < a: SE(f'bloc « {nm} » : fin avant début')
            if prev and a and prev[1] and a <= prev[1]: SE(f"blocs « {prev[0]} » et « {nm} » se chevauchent")
            if a and z and 'heures' in b:
                nw = ((z - (a - datetime.timedelta(days=a.weekday()))).days // 7) + 1
                if not isinstance(b['heures'], list) or len(b['heures']) != nw: SE(f'bloc « {nm} » : « heures » doit avoir une valeur par semaine ({nw})')
            prev = (nm, z)
        for c in sa.get('courses', []):
            dt(c.get('date'), f"course « {c.get('nom')} »")
            if c.get('prio') not in ('A', 'B', 'C'): SE(f"course « {c.get('nom')} » : prio A, B ou C")
            if not c.get('nom'): SE('course sans nom')
        for t in sa.get('tests', []): dt(t.get('date'), 'test')
if errs: print('\n'.join(errs)); sys.exit(1)
print(f'{len(files)} fichier(s) de séances OK')
