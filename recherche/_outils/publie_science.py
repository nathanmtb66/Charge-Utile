"""Publie un domaine scientifique : _brut/science-<X>.md → science/<X>-<nom>.md
- découpe les citations multiples « [@a; @b] » en « [@a] [@b] » (contrôlables par verifie.py) ;
- remplace le bloc JSON des sources par la liste des clés (les notices complètes sont dans sources.json) ;
- contrôle les quotas de la mission : ≥ 30 sources vérifiées dont ≥ 10 méta-analyses / revues systématiques / consensus,
  et la présence des sections obligatoires.
Usage : python3 recherche/_outils/publie_science.py A A-force-endurance"""
import json, re, sys, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
X, nom = sys.argv[1], sys.argv[2]
t = open(os.path.join(R, '_brut', f'science-{X}.md')).read()
i = t.find('## Sources vérifiées')
src = [s for b in re.findall(r'```json\s*(.*?)```', t[i:], re.S) for s in json.loads(b)]
ok = [s for s in src if s.get('verifie') is True]
forts = [s for s in ok if s.get('type') in ('meta-analyse', 'revue-systematique', 'consensus')]
corps = t[:i]
def split(m):
    keys = [k.strip().lstrip('@') for k in m.group(1).split(';')]
    return ' '.join(f'[@{k}]' for k in keys)
corps = re.sub(r'\[(@[A-Za-z0-9_\-]+(?:\s*;\s*@[A-Za-z0-9_\-]+)+)\]', split, corps)
cites = set(re.findall(r'\[@([A-Za-z0-9_\-]+)\]', corps))
_glob = {s['cle']: s for s in json.load(open(os.path.join(R, 'sources.json')))} if os.path.exists(os.path.join(R, 'sources.json')) else {}
_prop = {s['cle'] for s in ok}
ok = ok + [_glob[k] for k in sorted(cites) if k not in _prop and k in _glob]   # clés réutilisées d'un autre domaine
forts = [s for s in ok if s.get('type') in ('meta-analyse', 'revue-systematique', 'consensus')]
manq = cites - {s['cle'] for s in ok}
sections = ['## En 1 minute', "## Tableau d'affirmations", '## Chiffres clés', '## Mythes et verdicts', "## Règles pour l'entraîneur", "## Ce que l'appli devrait faire"]
absentes = [s for s in sections if s not in corps]
lignes = len([l for l in corps.split('\n') if re.match(r'^\| .* \| (A|B|C|D)[^|]*\|', l)])
_r = corps[corps.find("## Règles pour l'entraîneur") + 5:]
_fin = re.search(r'^## ', _r, re.M)
regles = len(re.findall(r'^\d+\. ', _r[:_fin.start()] if _fin else _r, re.M))
print(f'{X} : {len(ok)} sources vérifiées, {len(forts)} méta/RS/consensus, {len(cites)} citées, {lignes} lignes d\'affirmations, {regles} règles')
pb = []
if len(ok) < 30: pb.append('moins de 30 sources')
if len(forts) < 10: pb.append('moins de 10 méta-analyses/RS/consensus')
if manq: pb.append(f'citées sans notice : {sorted(manq)}')
if absentes: pb.append(f'sections absentes : {absentes}')
if not 20 <= regles <= 40: pb.append(f'{regles} règles (20 à 40 attendues)')
if pb: print('PROBLÈMES :', ' ; '.join(pb)); sys.exit(1)
pied = (f"\n## Sources\n\n{len(ok)} sources vérifiées (résumé ou page ouverts), dont {len(forts)} méta-analyses, revues systématiques ou consensus. "
        "Notices complètes (auteurs, revue, DOI, ce que la source montre) dans `recherche/sources.json`.\n\n"
        + ' '.join(f'[@{s["cle"]}]' for s in sorted(ok, key=lambda s: s['cle'])) + '\n')
open(os.path.join(R, 'science', f'{nom}.md'), 'w').write(corps.rstrip() + '\n' + pied)
print('écrit science/' + nom + '.md')
