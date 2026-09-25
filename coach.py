#!/usr/bin/env python3
"""Outil coach Charge Utile — cherche des exercices et vérifie une séance sans lire tout le catalogue.

  python3 coach.py cherche squat barre      → les exercices qui correspondent
  python3 coach.py fiche squat-barre        → la fiche complète d'un exercice
  python3 coach.py liste fente              → tous les exercices d'une famille
  python3 coach.py verifie kjvtsl           → contrôle le fichier de séances d'un athlète
  python3 coach.py seances                  → ce que chaque athlète a au programme

Tests et fiche athlète (la fiche maître vit dans prive/, jamais publiée) :
  python3 coach.py batterie kjvtsl A 2026-10-01   → ajoute la séance de tests A (force) ou B (mobilité) adaptée au profil
  python3 coach.py fiche-ajoute "<message collé>"  → range les lignes FICHE envoyées par l'athlète dans sa fiche
  python3 coach.py athlete kjvtsl                 → derniers résultats, évolution, écarts à travailler
  python3 coach.py charge kjvtsl squat 80         → kilos pour 80 % du max estimé + les champs à mettre dans la séance
  python3 coach.py profil kjvtsl sans_saut=1 sdt=trap  → options de test de l'athlète (privées)
"""
import json, os, sys, unicodedata, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(ROOT, 'docs')
EX = json.load(open(os.path.join(SITE, 'data', 'exercises.json'), encoding='utf-8'))
BYID = {e['id']: e for e in EX}
TESTS = {t['id']: t for t in json.load(open(os.path.join(SITE, 'data', 'tests.json'), encoding='utf-8'))['tests']}
PRIVE = os.path.join(ROOT, 'prive', 'fiches')

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
            if b['type'] not in {'cardio','circuit','series','libre','test'}: errs.append(f"{s['id']} / {b['nom']} : type de bloc inconnu")
            if b['type'] == 'test':
                for it in b.get('items', []):
                    if it.get('test') not in TESTS: errs.append(f"{s['id']} / {b['nom']} : test inconnu « {it.get('test')} »")
                continue
            for it in b.get('items', []):
                e = BYID.get(it['ex'])
                if not e: errs.append(f"{s['id']} / {b['nom']} : exercice inconnu « {it['ex']} »")
                elif not e.get('valide', True): errs.append(f"{s['id']} / {b['nom']} : « {it['ex']} » est marqué non validé")
                if 'reps' not in it and 'duree' not in it and b['type'] != 'libre':
                    errs.append(f"{s['id']} / {b['nom']} / {it['ex']} : ni reps ni durée")
                if ('pct' in it or 'base' in it) and (it.get('base') not in ('squat', 'sdt') or not isinstance(it.get('charge'), (int, float))):
                    errs.append(f"{s['id']} / {it['ex']} : en % du max, il faut base (squat|sdt) et la charge calculée (coach.py charge)")
    print('\n'.join(errs) if errs else f"{code} : OK ({len(ids)} séance(s))")

def seances():
    for f in sorted(os.listdir(os.path.join(SITE, 'data', 'sessions'))):
        d = json.load(open(os.path.join(SITE, 'data', 'sessions', f), encoding='utf-8'))
        s = ', '.join(f"{x['date']} {x['titre']}" for x in d.get('seances', [])) or 'aucune séance'
        print(f"{d.get('prenom') or '?':10} {f[:-5]:10} focus={','.join(d.get('focus', [])) or '-':22} {s}")


# ================= tests et fiche athlète =================
def fiche_path(code): return os.path.join(PRIVE, f'{code}.json')
def fiche_lire(code):
    f = fiche_path(code)
    if os.path.exists(f): return json.load(open(f, encoding='utf-8'))
    book = os.path.join(SITE, 'data', 'sessions', f'{code}.json')
    prenom = json.load(open(book, encoding='utf-8')).get('prenom', '') if os.path.exists(book) else ''
    return {'code': code, 'prenom': prenom, 'profil': {}, 'resultats': []}
def fiche_ecrire(code, d):
    os.makedirs(PRIVE, exist_ok=True)
    json.dump(d, open(fiche_path(code), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

def num(x):
    try: v = float(x.replace(',', '.')); return int(v) if v.is_integer() else v
    except Exception: return x

def fiche_ajoute(texte):
    """Lit les lignes « FICHE code date | test k=v … | … » (message de fin de test ou « Envoyer ma fiche »)."""
    n = 0; codes = set()
    for ligne in texte.splitlines():
        ligne = ligne.strip()
        if not ligne.startswith('FICHE '): continue
        tete, *parts = [x.strip() for x in ligne.split('|')]
        _, code, date = tete.split()[:3]
        d = fiche_lire(code); codes.add(code)
        for p in parts:
            if not p: continue
            mots = p.split(); tid = mots[0]
            v = {k: num(x) for k, x in (m.split('=', 1) for m in mots[1:] if '=' in m)}
            if tid not in TESTS: print(f'  ⚠ test inconnu ignoré : {tid}'); continue
            d['resultats'] = [r for r in d['resultats'] if not (r['test'] == tid and r['date'] == date)]
            d['resultats'].append({'date': date, 'test': tid, 'v': v}); n += 1
        d['resultats'].sort(key=lambda r: (r['date'], r['test']))
        fiche_ecrire(code, d)
    print(f'{n} résultat(s) rangé(s)' + (f' pour {", ".join(sorted(codes))}' if codes else ' : aucune ligne FICHE trouvée'))
    for c in sorted(codes): athlete(c)

def dernier(d, tid, avant=None):
    rs = [r for r in d['resultats'] if r['test'] == tid and 'skip' not in r['v'] and (avant is None or r['date'] < avant)]
    return rs[-1] if rs else None

def e1rm(d, lift):
    r = dernier(d, 'squat-e1rm' if lift == 'squat' else 'sdt-e1rm')
    return (float(r['v']['e1rm']), r['date']) if r else (None, None)

def r25(x): return int(x / 2.5 + 1e-9) * 2.5

def ecarts(t, v):
    out = []
    if t['mode'] == 'video': return [c['pb'] for c in t['criteres'] if str(v.get(c['k'])) == '0']
    if not t.get('cotes') or 'g' not in v or 'd' not in v: return out
    g, dd = float(v['g']), float(v['d']); lo, hi = min(g, dd), max(g, dd); faible = 'gauche' if g < dd else 'droite'
    if t.get('asymPct') and hi > 0 and lo / hi * 100 < t['asymPct']: out.append(f"{faible} à {round(lo/hi*100)} %")
    if t.get('asym') is not None and hi - lo >= t['asym']: out.append(f"{faible} −{round(hi-lo, 1)}{t['unite']}")
    mn = (t.get('repere') or {}).get('min')
    if mn is not None:
        for s, x in (('gauche', g), ('droite', dd)):
            if x < mn: out.append(f"{s} sous le repère ({t['repere']['txt']})")
    return out

def tendance(t, avant, maint):
    if avant is None or maint is None: return ''
    diff = maint - avant; lim = avant * t['mdcPct'] / 100 if t.get('mdcPct') else t.get('mdc', 0)
    return 'stable' if abs(diff) < lim else f"{'+' if diff > 0 else ''}{round(diff, 1)}{t['unite']}"

def athlete(code):
    d = fiche_lire(code)
    print(f"\n{d.get('prenom') or code} ({code}) · profil : {json.dumps(d.get('profil', {}), ensure_ascii=False)}")
    if not d['resultats']: return print('  aucun résultat : envoie-lui une séance de tests (coach.py batterie)')
    cibles = []
    for tid, t in TESTS.items():
        r = dernier(d, tid)
        sauts = [x for x in d['resultats'] if x['test'] == tid and 'skip' in x['v']]
        if not r:
            if sauts: print(f"  {t['court']:16} non fait ({sauts[-1]['v']['skip']}, {sauts[-1]['date']})")
            continue
        v = r['v']; p = dernier(d, tid, r['date'])
        if t['mode'] == 'force':
            val = f"{v['e1rm']} kg estimés ({v.get('kg')} kg × {v.get('reps')}, RIR {v.get('rir')}{', ' + str(v['variante']) if v.get('variante') else ''}{', box ' + str(v['box']) + ' cm' if v.get('box') else ''})"
            tr = tendance(t, float(p['v']['e1rm']), float(v['e1rm'])) if p else ''
        elif t.get('cotes'):
            val = f"G {v.get('g')} · D {v.get('d')} {t['unite']}"
            tr = ' / '.join(x for x in (tendance(t, float(p['v'][s]), float(v[s])) if p and s in p['v'] and s in v else '' for s in 'gd') if x)
        elif t['mode'] == 'video':
            rates = [c['pb'] for c in t['criteres'] if str(v.get(c['k'])) == '0']
            val = f"{v.get('score')}/4" + (f" ({', '.join(rates)})" if rates else ''); tr = tendance(t, float(p['v']['score']), float(v['score'])) if p else ''
        else:
            val = f"{v.get('val')} {t['unite']}"; tr = tendance(t, float(p['v']['val']), float(v['val'])) if p else ''
        ec = ecarts(t, v)
        print(f"  {t['court']:16} {val:52} {r['date']}  {tr}")
        for e in ec: print(f"  {'':16} → à travailler : {e}"); cibles.append(f"{t['court']} ({e})")
    if cibles: print('  À cibler : ' + ' ; '.join(cibles))

def charge(code, lift, pct):
    d = fiche_lire(code); e, date = e1rm(d, lift)
    if e is None: return print(f"Pas de max estimé au {'squat' if lift == 'squat' else 'soulevé de terre'} pour {code} : fais-lui passer le test A.")
    kg = r25(e * pct / 100)
    print(f"{pct} % de {e} kg ({date}) = {kg} kg (arrondi à 2,5 kg en dessous)")
    print(json.dumps({'pct': pct, 'base': lift, 'charge': kg, 'e1rm': e, 'e1rmDate': date}, ensure_ascii=False))

def profil(code, reglages):
    d = fiche_lire(code)
    for r in reglages:
        k, _, v = r.partition('=')
        d.setdefault('profil', {})[k] = num(v) if v not in ('', 'non', 'false') else None
        if d['profil'][k] is None: del d['profil'][k]
    fiche_ecrire(code, d); print(f"{code} : {json.dumps(d['profil'], ensure_ascii=False)}")

def batterie(code, quoi, date):
    f = os.path.join(SITE, 'data', 'sessions', f'{code}.json')
    book = json.load(open(f, encoding='utf-8')); d = fiche_lire(code); pf = d.get('profil', {})
    datetime.date.fromisoformat(date)
    if quoi.upper() == 'A':
        saut = 'assis-debout-unipodal' if pf.get('sans_saut') else 'saut-unipodal'
        items = [{'test': saut}]
        for lift, tid in (('squat', 'squat-e1rm'), ('sdt', 'sdt-e1rm')):
            if pf.get('sans_' + lift): continue
            it = {'test': tid}
            e, ed = e1rm(d, lift)
            if e: it.update({'e1rm': e, 'e1rmDate': ed})
            if lift == 'sdt': it['variante'] = pf.get('sdt', 'trap')
            items.append(it)
        s = {'id': f'{date}-tests-force', 'date': date, 'titre': 'Tests force', 'rpe': '7 à 8', 'dureeMin': 45,
             'message': "Tests du bloc : fais-les reposé (48 h après une séance dure, jamais la veille d'une course), à la même heure que la dernière fois. Aucune série jusqu'à l'échec : il doit toujours t'en rester une.",
             'blocs': [{'nom': 'Échauffement', 'type': 'cardio', 'items': [{'ex': 'velo', 'duree': 300, 'niveau': 'Facile'}, {'ex': 'montees-de-genoux', 'duree': 60}]},
                       {'nom': 'Tests', 'type': 'test', 'items': items}]}
    else:
        ids = ['genou-mur', 'thomas', 'rotation-interne-hanche', 'jambe-tendue', 'flexion-epaule', 'rotation-externe-epaule', 'squat-bras-leves', 'unipodal-yeux-fermes', 'mollet-unipodal', 'pont-unipodal']
        ids = [i for i in ids if not pf.get('sans_' + i)]
        s = {'id': f'{date}-tests-mobilite', 'date': date, 'titre': 'Tests mobilité', 'rpe': '4 à 5', 'dureeMin': 40,
             'message': "Tests du bloc, à faire pieds nus, à la maison ou en salle. Il te faut : un mètre ruban, du scotch, un mur, une table solide, une box ou une chaise d'environ 60 cm, et un brassard pour fixer ton téléphone. Pas de séance dure la veille.",
             'blocs': [{'nom': 'Échauffement', 'type': 'cardio', 'items': [{'ex': 'montees-de-genoux', 'duree': 90}, {'ex': 'talons-fesses', 'duree': 90}]},
                       {'nom': 'Tests', 'type': 'test', 'items': [{'test': i} for i in ids]}]}
    book['seances'] = [x for x in book['seances'] if x['id'] != s['id']] + [s]
    json.dump(book, open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"{code} : séance « {s['titre']} » du {date} ajoutée ({len(s['blocs'][1]['items'])} tests : {', '.join(i['test'] for i in s['blocs'][1]['items'])})")
    verifie(code)

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__)
    elif a[0] == 'cherche': cherche(a[1:])
    elif a[0] == 'fiche': fiche(a[1])
    elif a[0] == 'liste': liste(a[1] if len(a) > 1 else '')
    elif a[0] == 'verifie': verifie(a[1])
    elif a[0] == 'seances': seances()
    elif a[0] == 'batterie': batterie(a[1], a[2], a[3])
    elif a[0] == 'fiche-ajoute': fiche_ajoute(' '.join(a[1:]).replace(' FICHE ', '\nFICHE ') if len(a) > 1 else sys.stdin.read())
    elif a[0] == 'athlete': athlete(a[1])
    elif a[0] == 'charge': charge(a[1], a[2], num(a[3]))
    elif a[0] == 'profil': profil(a[1], a[2:])
    else: print(__doc__)
