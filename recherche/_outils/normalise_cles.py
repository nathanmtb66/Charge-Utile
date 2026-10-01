"""Rend les clés de sources cohérentes entre fichiers bruts, par DOI (ou URL).
- même article (même DOI/URL) sous deux clés → la clé déjà prise (fichier le plus ancien / sources.json) gagne ;
- même clé pour deux articles différents → le second reçoit un suffixe (b, c, …).
Réécrit les citations [@cle] et le JSON des fichiers `_brut/*.md` passés en argument (ou tous les science-*.md).
Usage : python3 recherche/_outils/normalise_cles.py [_brut/science-B.md ...]"""
import json, re, sys, glob, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def ident(s): return (s.get('doi') or s.get('url') or '').lower().rstrip('/').replace('https://doi.org/', '')
canon = {}   # ident -> cle
pris = {}    # cle -> ident
sf = os.path.join(R, 'sources.json')
def enregistre(s):
    i, k = ident(s), s['cle']
    canon.setdefault(i, k); pris.setdefault(k, i)
fichiers = sys.argv[1:] or sorted(glob.glob(os.path.join(R, '_brut', 'science-*.md')))
fichiers = [os.path.join(R, f) if not os.path.isabs(f) else f for f in fichiers]
autres = [f for f in sorted(glob.glob(os.path.join(R, '_brut', '*.md'))) if f not in fichiers]
def blocs(t):
    i = t.find('## Sources vérifiées'); return i, re.findall(r'```json\s*(.*?)```', t[i:], re.S) if i >= 0 else []
for f in autres:
    t = open(f).read(); i, bs = blocs(t)
    for b in bs:
        try: [enregistre(s) for s in json.loads(b) if s.get('cle')]
        except Exception: pass
for f in fichiers:
    t = open(f).read(); i, bs = blocs(t)
    if i < 0: continue
    ren = {}
    nouveaux = []
    for b in bs:
        data = json.loads(b); out = []
        for s in data:
            k, idt = s['cle'], ident(s)
            if idt in canon and canon[idt] != k:
                ren[k] = canon[idt]; s['cle'] = canon[idt]
            elif k in pris and pris[k] != idt:
                n = 'b'
                while k + n in pris: n = chr(ord(n) + 1)
                ren[k] = k + n; s['cle'] = k + n
            enregistre(s); out.append(s)
        nouveaux.append(json.dumps(out, ensure_ascii=False, indent=1))
    if not ren: print(os.path.basename(f), ': rien à renommer'); continue
    tete, queue = t[:i], t[i:]
    # renommage simultané des citations (évite les chaînes a→b→c)
    tete = re.sub(r'\[@([A-Za-z0-9_\-]+)\]', lambda m: f'[@{ren.get(m.group(1), m.group(1))}]', tete)
    for b, nb in zip(bs, nouveaux): queue = queue.replace(b, nb + '\n', 1)
    open(f, 'w').write(tete + queue)
    print(os.path.basename(f), ':', ren)
