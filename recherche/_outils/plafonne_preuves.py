"""Aligne la lettre de preuve des fiches candidates et des séances modèles sur la revue contradictoire des domaines A à H.
Une fiche ne peut pas afficher une preuve plus forte que la meilleure des sources qu'elle cite.
Plafonds tirés de _brut/revue-science-AD.md (problème 14 et bloquants) et _brut/revue-science-EH.md.
Usage : python3 recherche/_outils/plafonne_preuves.py   (idempotent)"""
import json, glob, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = "burnley2005 christensen2015 johnson2014 solli2020 vangsoe2020 balban2023 bernardi2001 bilo2012 citherlet2021 woorons2019 opplert2018 dorn2012 albracht2013 hilkens2024 kristoffersen2019 giandolini2016b giandolini2016a hays2021 bejder2019 robineau2016 ronnestad2010b ronnestad2016 chapman2014 chapman2016 palmer2001 devantierthomas2024 kasap2025 lauersen2014 lauersen2018 spiering2021 khassetarash2023 lemire2021 macdermid2014 miller2017 blechschmied2026 lum2019 yamamoto2010 zamboni2024 olmedillas2012 steffens2016 shiri2018 mah2011".split()
B = "robinson2024 halperin2022 llanoslagos2026 precart2025 zhao2014 illi2012 petre2021 haddad2017 impellizzeri2020".split()
CAP = {k: 'C' for k in C}; CAP.update({k: 'B' for k in B})
def plafonne(p):
    m = re.match(r'^([ABCD])\b', str(p))
    if not m: return p, False
    keys = re.findall(r'\[@([A-Za-z0-9_\-]+)\]', p)
    if not keys: return p, False
    best = min(CAP.get(k, 'A') for k in keys)          # la meilleure source citée
    if m.group(1) < best: return best + p[1:], True
    return p, False
n = 0
for f in sorted(glob.glob(os.path.join(R, 'exercices', '*.json'))):
    d = json.load(open(f)); ch = 0
    for x in d:
        x['preuve'], c = plafonne(x.get('preuve', '')); ch += c
    if ch: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=1); print(os.path.basename(f), ch); n += ch
for f in sorted(glob.glob(os.path.join(R, 'modeles', '*.json'))):
    d = json.load(open(f)); ch = 0
    for s in d['seances']:
        s['preuve'], c = plafonne(s.get('preuve', '')); ch += c
    if ch: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=1); print(os.path.basename(f), ch); n += ch
print(n, 'lettre(s) de preuve abaissée(s)')
