"""Crée le fichier de séances d'un nouvel athlète avec un code secret.
Usage : python3 tools/nouvel_athlete.py "Prénom" [code] [--focus genoux,chevilles]  → affiche le lien à envoyer à l'athlète."""
import json, os, secrets, string, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZON = {'cou','epaules','haut-du-dos','bas-du-dos','hanches','fessiers','adducteurs','quadriceps','ischios','genoux','mollets','chevilles','pieds','poignets'}
args, focus = sys.argv[1:], []
if '--focus' in args:
    i = args.index('--focus'); focus = [z.strip() for z in args[i + 1].split(',') if z.strip()]; del args[i:i + 2]
    bad = [z for z in focus if z not in ZON]
    if bad: sys.exit(f"Zone inconnue : {', '.join(bad)}. Zones possibles : {', '.join(sorted(ZON))}")
prenom = args[0] if args else ''
code = args[1] if len(args) > 1 else ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
f = os.path.join(ROOT, 'docs', 'data', 'sessions', f'{code}.json')
if os.path.exists(f): sys.exit(f'Le code {code} existe déjà.')
json.dump({'athlete': code, 'prenom': prenom, 'coach': 'Nathan', 'focus': focus, 'seances': []}, open(f, 'w'), ensure_ascii=False, indent=1)
base = open(os.path.join(ROOT, 'SITE_URL')).read().strip() if os.path.exists(os.path.join(ROOT, 'SITE_URL')) else 'https://<compte>.github.io/charge-utile/'
print(f'{prenom} → code {code}\nLien à envoyer : {base}?a={code}')
