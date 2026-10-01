"""Calcule la carte de couverture besoins × catalogue (exercices/README.md, sections 1 à 3).
Usage : python3 recherche/_outils/carte_couverture.py [--avec-candidats]  → imprime les tableaux Markdown.
Classification automatique (famille, type, matériel, muscles, nom) : approximative par construction."""
import json, glob, os, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); ROOT = os.path.dirname(R)
d = json.load(open(os.path.join(ROOT, 'docs', 'data', 'exercises.json')))
if '--avec-candidats' in sys.argv:
    for f in sorted(glob.glob(os.path.join(R, 'exercices', '*.json'))): d += json.load(open(f))
def qual(x):
    q = set(); f = x['famille']; t = x['type']; n = x['nom'].lower(); m = set(x.get('materiel', []))
    lourd = bool(m & {'barre', 'halteres', 'kettlebell', 'machine', 'sac-leste', 'disque', 'elastique'})
    if f in ('squat', 'fente', 'charniere', 'haut-du-corps', 'mollet-cheville') and t == 'reps' and (lourd or x.get('niveau') == 3): q.add('force max')
    if t in ('plyo', 'effort') or 'explosivite' in x.get('tags', []): q.add('puissance')
    if f == 'plio' or t == 'plyo': q.add('plio')
    if any(k in n for k in ('excentr', 'nordic', 'descente', 'frein', 'heel drop')): q.add('excentrique')
    if t == 'hold' and f in ('squat', 'fente', 'charniere', 'mollet-cheville', 'haut-du-corps'): q.add('isométrie')
    if f == 'gainage': q.add('gainage anti-mouvement')
    if 'forearms' in x['muscles']: q.add('préhension')
    if f == 'proprio': q.add('proprio')
    if f == 'mobilite': q.add('mobilité')
    if f == 'etirement': q.add('étirement')
    if 'respir' in n or 'souffle' in n or 'cohérence' in n or 'soupir' in n: q.add('respiration')
    if f == 'echauffement' or 'echauffement' in x.get('tags', []): q.add('échauffement')
    return q
def zones(x):
    z = set(x.get('zones', [])); mm = set(x['muscles']); tg = set(x.get('tags', [])); out = set()
    if 'pieds' in z: out.add('pied')
    if 'chevilles' in z or 'cheville' in tg or mm & {'calves', 'shins'}: out.add('cheville')
    if 'genoux' in z or 'genou' in tg or mm & {'quads', 'quadsL'}: out.add('genou')
    if z & {'hanches', 'fessiers', 'adducteurs'} or 'hanche' in tg or mm & {'glutes', 'hipflex', 'adductors'}: out.add('hanche')
    if z & {'bas-du-dos', 'haut-du-dos'} or 'dos' in tg or mm & {'lowback', 'upperback', 'lats'}: out.add('dos')
    if 'epaules' in z or mm & {'delts', 'pecs'}: out.add('épaule')
    if 'cou' in z: out.add('cou')
    if 'poignets' in z or 'forearms' in mm: out.add('poignet')
    return out
def mat(x):
    m = set(x.get('materiel', [])) - {'tapis', 'mur'}; out = set()
    if not m or m == {'aucun'}: out.add('rien')
    if 'halteres' in m and m <= {'halteres', 'aucun', 'banc', 'marche'}: out.add('haltères seuls')
    if 'elastique' in m: out.add('élastique')
    if m & {'barre', 'machine', 'box', 'banc', 'barre-traction', 'kettlebell', 'disque', 'swissball', 'demi-swissball', 'rameur', 'ski-erg', 'plots', 'sangle', 'sac-leste'}: out.add('salle')
    return out
Q = ['force max', 'puissance', 'plio', 'excentrique', 'isométrie', 'gainage anti-mouvement', 'préhension', 'proprio', 'mobilité', 'étirement', 'respiration', 'échauffement']
Z = ['pied', 'cheville', 'genou', 'hanche', 'dos', 'épaule', 'cou', 'poignet']; M = ['salle', 'haltères seuls', 'élastique', 'rien']
c = lambda n: f'**{n}**' if n <= 2 else str(n)
print(f'*{len(d)} exercices comptés.*\n')
print('| Qualité | Total | Salle | Haltères seuls | Élastique | Rien (hôtel, voyage) |\n|---|---|---|---|---|---|')
for q in Q:
    xs = [x for x in d if q in qual(x)]
    print(f'| {q} | {c(len(xs))} | ' + ' | '.join(c(sum(1 for x in xs if m in mat(x))) for m in M) + ' |')
print('\n| Qualité | Niveau 1 | Niveau 2 | Niveau 3 |\n|---|---|---|---|')
for q in Q:
    xs = [x for x in d if q in qual(x)]
    print(f'| {q} | ' + ' | '.join(c(sum(1 for x in xs if x.get('niveau') == n)) for n in (1, 2, 3)) + ' |')
print('\n| Zone | Total | ' + ' | '.join(Q) + ' |\n|---|---|' + '|'.join('---' for _ in Q) + '|')
for z in Z:
    xs = [x for x in d if z in zones(x)]
    print(f'| {z} | {len(xs)} | ' + ' | '.join(c(sum(1 for x in xs if q in qual(x))) for q in Q) + ' |')
