# Coûts unitaires techniques (collecte directe, 30/09/2026)

## API Claude (claude.com/pricing, lu le 30/09/2026)
Par million de tokens (entrée / sortie) : Fable 5.1 10 $ / 50 $ ; Opus 5.5 4 $ / 20 $ ; Sonnet 5.5 2 $ / 10 $ ; Haiku 4.5 1 $ / 5 $.
Cache : lecture 0,20 $ (Sonnet 5.5), 0,10 $ (Haiku 4.5) ; écriture 2,50 $ (Sonnet 5.5). Traitement par lots : -50 %.
Abonnement grand public : Pro 20 $/mois (17 $ en annuel), Max à partir de 100 $/mois.

## Taille réelle d'une séance (mesurée dans le dépôt)
- `docs/data/sessions/demo.json` : 5 séances de 393 à 2 982 caractères JSON ; `kjvtsl.json` : 2 séances de 2 641 et 2 721 caractères.
- Séance type ≈ 2 700 caractères ≈ 900 à 1 100 tokens de sortie (JSON français ≈ 2,7 car./token).
- Contexte à fournir au modèle : `SCHEMA.md` 10,6 ko (≈ 3 500 tokens) + index compact du catalogue (190 ids + noms ≈ 2 500 tokens) + profil athlète et dernières séances (≈ 1 500 tokens) + dictée (≈ 300 tokens) + consignes système (≈ 1 500 tokens) ≈ 9 000 à 10 000 tokens d'entrée.
- Constat à noter : au 30/09/2026, 3 des 4 fichiers de séances d'athlètes réels sont vides (0 séance en cours), 1 en a 2. L'usage réel mesurable dans le dépôt est faible (peut s'expliquer par le nettoyage des séances faites : à vérifier avec Nathan).

## Hébergement
- GitHub Pages (docs.github.com, lu le 30/09/2026) : site ≤ 1 Go, bande passante « soft » 100 Go/mois. **Usage commercial / SaaS interdit** : Pages n'est pas autorisé pour « providing commercial software as a service (SaaS) ». → Un Charge Utile vendu doit quitter GitHub Pages (Cloudflare Pages est l'option naturelle).
- Cloudflare Pages gratuit : 500 builds/mois, 20 000 fichiers, 25 Mio par fichier ; la page des limites ne mentionne pas de plafond de bande passante.
- Cloudflare Workers : gratuit 100 000 requêtes/jour, 10 ms CPU/appel ; payant 5 $/mois (10 M requêtes + 30 M ms CPU inclus, puis 0,30 $/M requêtes).
- KV gratuit : 100 000 lectures/j, 1 000 écritures/j, 1 Go. D1 gratuit : 5 M lignes lues/j, 100 000 écrites/j, 5 Go. Payant : D1 5 Go inclus puis 0,75 $/Go-mois.
- R2 (vidéos) : 10 Go-mois gratuits, puis 0,015 $/Go-mois ; sortie gratuite ; écritures 4,50 $/M, lectures 0,36 $/M.

## Sources vérifiées
```json
[
{"cle": "anthropic-prix-2026", "auteurs": "Anthropic", "annee": 2026, "titre": "Claude pricing", "revue": "site officiel", "doi": null, "url": "https://claude.com/pricing", "type": "site", "niveau": "D", "verifie": true, "note": "Tarifs API par million de tokens : Sonnet 5.5 2 $/10 $, Haiku 4.5 1 $/5 $, Opus 5.5 4 $/20 $ ; lots -50 %."},
{"cle": "github-pages-limites", "auteurs": "GitHub", "annee": 2026, "titre": "GitHub Pages limits", "revue": "GitHub Docs", "doi": null, "url": "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits", "type": "site", "niveau": "D", "verifie": true, "note": "1 Go, 100 Go/mois de bande passante ; usage SaaS commercial interdit."},
{"cle": "cloudflare-workers-prix", "auteurs": "Cloudflare", "annee": 2026, "titre": "Workers pricing", "revue": "Cloudflare Docs", "doi": null, "url": "https://developers.cloudflare.com/workers/platform/pricing/", "type": "site", "niveau": "D", "verifie": true, "note": "Gratuit 100 000 req/j ; payant 5 $/mois ; tarifs KV, D1, R2."},
{"cle": "cloudflare-r2-prix", "auteurs": "Cloudflare", "annee": 2026, "titre": "R2 pricing", "revue": "Cloudflare Docs", "doi": null, "url": "https://developers.cloudflare.com/r2/pricing/", "type": "site", "niveau": "D", "verifie": true, "note": "10 Go gratuits, 0,015 $/Go-mois, sortie gratuite."},
{"cle": "cloudflare-pages-limites", "auteurs": "Cloudflare", "annee": 2026, "titre": "Pages limits", "revue": "Cloudflare Docs", "doi": null, "url": "https://developers.cloudflare.com/pages/platform/limits/", "type": "site", "niveau": "D", "verifie": true, "note": "Gratuit : 500 builds/mois, 20 000 fichiers, 25 Mio/fichier."}
]
```
