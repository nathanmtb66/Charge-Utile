# Journal de la mission de recherche

Session Claude Code (Opus 5.5), branche `recherche`, lancée le 30 septembre 2026 à 20 h 30 (heure de Paris).

## Checklist (section 9 de MISSION.md)

**Business**
- [ ] 01 à 09 écrits ; `concurrents.csv` avec ≥ 35 lignes et prix datés.
- [ ] ≥ 120 citations d'utilisateurs classées et comptées (04).
- [ ] Unités économiques chiffrées pour ≥ 5 modèles, coût API Claude par séance calculé (06).
- [ ] Recommandation claire de positionnement et de modèle, avec les raisons de ne pas choisir les autres.
- [ ] Section « Ce qui est faux dans nos hypothèses » (09).

**Science**
- [ ] 9 domaines A à I écrits, chacun avec ≥ 30 sources vérifiées dont ≥ 10 méta-analyses/consensus, tableau d'affirmations, chiffres clés, mythes, règles, « ce que l'appli devrait faire ».
- [ ] 8 protocoles de respiration codables (C) ; score de forme (D) ; tableau nutrition de fin de séance (E).

**Exercices, séances, règles**
- [ ] Carte de couverture ; ≥ 250 fiches candidates dont ≥ 80 en priorité 1 ; chaque case vide de la carte comblée ou justifiée.
- [ ] ≥ 12 tests de terrain proposés.
- [ ] ≥ 60 séances modèles couvrant toutes les phases et tous les contextes listés.
- [ ] ≥ 50 règles codables.

**Produit**
- [ ] vision, fonctionnalités (avec liste « à ne pas faire »), MVP vendable, expériences, idées folles.

**Qualité**
- [ ] `python3 recherche/verifie.py` passe (0 problème).
- [ ] `sources.json` : toutes les sources citées présentes, `verifie: true` partout. Échantillon de 30 sources re-vérifié au hasard par un sous-agent contradicteur, erreurs corrigées.
- [ ] Revue contradictoire de chaque livrable majeur faite et corrigée (trace dans JOURNAL.md).

**Synthèse**
- [ ] `recherche/README.md` : index de tous les fichiers, mode d'emploi.
- [ ] `recherche/SYNTHESE.md`, à lire en 10 minutes.
- [ ] Tout est commité et poussé sur la branche `recherche`.

## Phases

| Phase | Début | Fin |
|---|---|---|
| 1 — Business | 30/09 20 h 30 | |
| 2 — Science | | |
| 3 — Exercices | | |
| 4 — Séances modèles | | |
| 5 — Règles | | |
| 6 — Produit | | |

## Décisions

- Les sous-agents de collecte écrivent dans `recherche/_brut/` ; seules les sources qu'ils ont réellement ouvertes (WebFetch) passent dans `sources.json`.

## Problèmes rencontrés

- 30/09 20 h 35 — `git push` impossible depuis la session : pas d'identifiants GitHub dans le terminal (ni `gh`, ni clé SSH, ni credential helper). Je ne vais pas chercher de jeton dans le trousseau. **Tous les commits restent locaux sur la branche `recherche`** : il suffit de la publier depuis GitHub Desktop (Publish branch / Push origin). Jamais rien sur `main`.

## Revues contradictoires
