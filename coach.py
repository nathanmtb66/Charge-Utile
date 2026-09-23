#!/usr/bin/env python3
"""Outil coach Charge Utile — cherche des exercices et vérifie une séance sans lire tout le catalogue.

  python3 coach.py cherche squat barre      → les exercices qui correspondent
  python3 coach.py fiche squat-barre        → la fiche complète d'un exercice
  python3 coach.py liste fente              → tous les exercices d'une famille
  python3 coach.py verifie kjvtsl           → contrôle le fichier de séances d'un athlète
  python3 coach.py seances                  → ce que chaque athlète a au programme
"""
import json, os, sys, unicodedata, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(ROOT, 'docs')
EX = json.load(open(os.path.join(SITE, 'data', 'exercises.json'), encoding='utf-8'))
BYID = {e['id']: e for e in EX}

def sans_accent(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')

def ligne(e):
    mat = ','.join(e.get('materiel', [])) or '-'
    pg = e.get('progression')
    niv = f" [niveau {pg['niveau']} {pg['nom']}]" if pg else ''
    ko = '' if e.get('valide', True) else '  ⚠ NON VALIDÉ'
    return f"{e['id']:38} {e['nom'][:44]:46} {e['famille']:16} {e['type']:7} {mat}{niv}{ko}"

def cherche(mots):
    q = [sans_accent(m) for m in mots]
    out = [e for e in EX if all(m in sans_accent(e['id'] + ' ' + e['nom'] + ' ' + ' '.join(e.get('tags', [])) + ' ' + ' '.join(e.get('zones', []) or [])) for m in q)]
    print(f"{len(out)} exercice(s)")
    for e in sorted(out, key=lambda x: x['famille']): print(ligne(e))

def liste(famille):
    out = [e for e in EX if e['famille'] == famille]
    print(f"{len(out)} exercice(s) dans « {famille} »")
    for e in out: print(ligne(e))
    if not out: print('familles :', ', '.join(sorted({e['famille'] for e in EX})))

def fiche(i):
    e = BYID.get(i)
    if not e: return print(f"« {i} » introuvable. Essaie : python3 coach.py cherche {i.replace('-', ' ')}")
    print(json.dumps(e, ensure_ascii=False, indent=1))

def verifie(code):
    f = os.path.join(SITE, 'data', 'sessions', f'{code}.json')
    if not os.path.exists(f): return print(f"pas de fichier pour « {code} »")
    d = json.load(open(f, encoding='utf-8')); errs = []
    ZON = {'cou','epaules','haut-du-dos','bas-du-dos','hanches','fessiers','adducteurs','quadriceps','ischios','genoux','mollets','chevilles','pieds','poignets'}
    for z in d.get('focus', []):
        if z not in ZON: errs.append(f"focus inconnu : {z}")
    ids = [s['id'] for s in d.get('seances', [])]
    if len(ids) != len(set(ids)): errs.append('deux séances ont le même id')
    for s in d.get('seances', []):
        try: datetime.date.fromisoformat(s['date'])
        except Exception: errs.append(f"{s.get('id')} : date invalide")
        for b in s['blocs']:
            if b['type'] not in {'cardio','circuit','series','libre'}: errs.append(f"{s['id']} / {b['nom']} : type de bloc inconnu")
            for it in b.get('items', []):
                e = BYID.get(it['ex'])
                if not e: errs.append(f"{s['id']} / {b['nom']} : exercice inconnu « {it['ex']} »")
                elif not e.get('valide', True): errs.append(f"{s['id']} / {b['nom']} : « {it['ex']} » est marqué non validé")
                if 'reps' not in it and 'duree' not in it and b['type'] != 'libre':
                    errs.append(f"{s['id']} / {b['nom']} / {it['ex']} : ni reps ni durée")
    print('\n'.join(errs) if errs else f"{code} : OK ({len(ids)} séance(s))")

def seances():
    for f in sorted(os.listdir(os.path.join(SITE, 'data', 'sessions'))):
        d = json.load(open(os.path.join(SITE, 'data', 'sessions', f), encoding='utf-8'))
        s = ', '.join(f"{x['date']} {x['titre']}" for x in d.get('seances', [])) or 'aucune séance'
        print(f"{d.get('prenom') or '?':10} {f[:-5]:10} focus={','.join(d.get('focus', [])) or '-':22} {s}")

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__)
    elif a[0] == 'cherche': cherche(a[1:])
    elif a[0] == 'fiche': fiche(a[1])
    elif a[0] == 'liste': liste(a[1] if len(a) > 1 else '')
    elif a[0] == 'verifie': verifie(a[1])
    elif a[0] == 'seances': seances()
    else: print(__doc__)
