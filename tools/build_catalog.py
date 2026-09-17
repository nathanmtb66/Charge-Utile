"""Fusionne docs/data/exercises/*.json → docs/data/exercises.json, applique les liens « Voir en vrai » et valide le schéma.
Usage : python3 tools/build_catalog.py   (échoue avec un message clair si une fiche est invalide)"""
import json, glob, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'docs')
FAM = {'squat','fente','charniere','mollet-cheville','plio','proprio','gainage','haut-du-corps','cardio','echauffement','mobilite','etirement'}
ZONES = {'cou','epaules','haut-du-dos','bas-du-dos','hanches','fessiers','adducteurs','quadriceps','ischios','genoux','mollets','chevilles','pieds','poignets'}
TYPES = {'reps','hold','plyo','effort','cardio'}
MUSCLES = {'quads','quadsL','hams','glutes','calves','abs','obliques','lowback','pecs','delts','arms','biceps','triceps','forearms','lats','upperback','adductors','shins','hipflex'}
TAGS = {'descente-vtt','coup-de-pedale','foulee','montee','explosivite','genou','cheville','hanche','dos','gainage','proprio','chaine-posterieure','haut-du-corps','echauffement','cardio','retour-au-calme','mobilite','etirement','recuperation','avant-effort','velo','trail'}
MAT = {'barre','halteres','kettlebell','disque','banc','box','swissball','demi-swissball','plots','elastique','barre-traction','mur','sangle','tapis','marche','rameur','ski-erg','velo','aucun','sac-leste'}
links = json.load(open(os.path.join(ROOT, 'tools', 'liens_fitnessprogramer.json')))

def load():
    out = []
    for f in sorted(glob.glob(os.path.join(SITE, 'data', 'exercises', '*.json'))):
        for x in json.load(open(f)):
            x['_fichier'] = os.path.basename(f); out.append(x)
    return out

def validate(ex, anims=None):
    errs = []
    ids = [x['id'] for x in ex]
    dup = {i for i in ids if ids.count(i) > 1}
    if dup: errs.append(f'ids en double : {sorted(dup)}')
    for x in ex:
        w = lambda m: errs.append(f"{x.get('id')} ({x['_fichier']}) : {m}")
        for k in ('id','nom','famille','anim','type','muscles','consignes','pourquoi','respiration','securite','tags','alternatives','valide'):
            if k not in x: w(f'champ manquant {k}')
        if x.get('famille') not in FAM: w(f"famille inconnue {x.get('famille')}")
        if x.get('type') not in TYPES: w(f"type inconnu {x.get('type')}")
        for m in x.get('muscles', []):
            if m not in MUSCLES: w(f'muscle inconnu {m}')
        for t in x.get('tags', []):
            if t not in TAGS: w(f'tag inconnu {t}')
        for m in x.get('materiel', []):
            if m not in MAT: w(f'matériel inconnu {m}')
        for z in x.get('zones', []):
            if z not in ZONES: w(f'zone inconnue {z}')
        pr = x.get('progression')
        if pr is not None and (not isinstance(pr, dict) or not pr.get('groupe') or pr.get('niveau') not in (1,2,3,4) or not pr.get('nom')): w('progression invalide (groupe, niveau 1-4, nom)')
        if x.get('famille') in ('mobilite','etirement') and not x.get('zones'): w('une fiche mobilité/étirement doit lister ses zones')
        for a in x.get('alternatives', []):
            if a not in ids: w(f'alternative inconnue {a}')
        for c in x.get('consignes', []):
            if len(c) > 48: w(f'consigne trop longue ({len(c)}) : {c}')
        if len(x.get('consignes', [])) < 2: w('il faut au moins 2 consignes')
        if anims is not None and x.get('anim') not in anims: w(f"anim inconnue {x.get('anim')}")
    return errs

if __name__ == '__main__':
    ex = load()
    anims = None
    af = os.path.join(ROOT, 'qa', 'anims.json')
    if os.path.exists(af): anims = set(json.load(open(af)))
    for x in ex:
        slug = links.get(x['id'])
        x['voirEnVrai'] = f'https://fitnessprogramer.com/exercise/{slug}/' if slug else None
    errs = validate(ex, anims)
    if errs:
        print('\n'.join(errs)); sys.exit(1)
    for x in ex: x.pop('_fichier', None)
    ex.sort(key=lambda x: (x['famille'], x['nom']))
    json.dump(ex, open(os.path.join(SITE, 'data', 'exercises.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'{len(ex)} exercices → docs/data/exercises.json ({sum(1 for x in ex if x["voirEnVrai"])} avec lien fitnessprogramer)')
