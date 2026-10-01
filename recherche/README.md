# Recherche Charge Utile — index et mode d'emploi

*Travail de recherche mené du 30 septembre au 1er octobre 2026 par une session Claude Code, sur la branche `recherche`. Rien n'a été modifié hors de ce dossier. La consigne est dans `MISSION.md`, le déroulé et les relectures dans `JOURNAL.md`.*

## Par où commencer

1. **`SYNTHESE.md`** : 10 minutes. La réponse à « pourquoi cette appli, et est-ce un business viable ? », les 30 décisions, les 20 exercices et les 10 fonctionnalités à faire en premier, les 5 choses à ne pas faire, ce qui n'a pas pu être vérifié.
2. **`business/09-plan-12-mois.md`** : le plan mois par mois, et « ce qui est faux dans nos hypothèses ».
3. **`_prive/securite-relais.md`** (sur ton Mac seulement, non versionné) : deux défauts de sécurité du site actuel, à corriger en priorité.

## Le contenu

### `business/` — Phase 1 : business et marché
| Fichier | Contenu |
|---|---|
| `01-concurrence.md` | 74 lignes, environ 66 produits : synthèse, classement par menace, matrice fonctions × produits, fiches détaillées |
| `concurrents.csv` | Le même tableau, exploitable dans un tableur (prix datés, liens) |
| `02-marche.md` | Tailles de marché réelles, licenciés, coachs, structures, prix des coachs et de leurs outils |
| `03-intervals-ecosysteme.md` | intervals.icu : API, OAuth, manque de force, applis tierces, risques |
| `04-douleurs.md` | 189 citations d'utilisateurs classées en 13 thèmes et comptées |
| `05-positionnement.md` | La phrase, les avantages (copiables ou non), les faiblesses, 3 positionnements, la recommandation |
| `06-modele-economique.md` | Coûts unitaires, 5 modèles + mixte, projections à 12 et 36 mois, seuils fiscaux |
| `07-juridique-technique.md` | RGPD, hébergement, dispositif médical, carte professionnelle, micro-entreprise, PWA ou magasins d'applis, licences, marque |
| `08-go-to-market.md` | 10 premiers contacts, contenu vidéo, script de 15 questions, tests de prix, critères d'arrêt, calendrier |
| `09-plan-12-mois.md` | Plan mois par mois, objectifs honnêtes, 14 hypothèses qui peuvent être fausses |

### `science/` — Phase 2 : base de connaissances
Chaque fichier contient : « En 1 minute », un tableau d'affirmations (preuve A à D, chiffres, sources, application), les chiffres clés, les mythes, 20 à 40 règles pour l'entraîneur, ce que l'appli devrait faire (et ne pas faire), les limites, les sources.

| Fichier | Domaine | À ne pas manquer |
|---|---|---|
| `A-force-endurance.md` | Force et endurance | Interférence, dosages, maintien en saison |
| `B-plio-tendons-prevention.md` | Pliométrie, tendons, os | Contacts de sauts, os des cyclistes, asymétries, critique de l'ACWR |
| `C-mobilite-respiration.md` | Mobilité, échauffement, respiration | **8 protocoles de respiration prêts à coder** (tableau + JSON) |
| `D-recuperation-charge.md` | Récupération, charge, sommeil, altitude | **Score de forme du jour** (pseudo-code + JSON + limites) |
| `E-nutrition.md` | Nutrition et compléments | **Tableau « conseil de fin de séance »** par kg (+ JSON) |
| `F-sports-publics.md` | Sports et publics | XCO, route, trail, triathlon, nordique ; femmes, juniors, masters, débutants |
| `G-adhesion.md` | Psychologie et adhésion | Ce qui fait faire les séances ; ce qui est un gadget |
| `H-tests-mesure.md` | Tests, mesure, technologie | Cohérence de `tests.json` avec la littérature ; ce que valent le téléphone et les montres |
| `I-periodisation.md` | Programmation | Phases de la saison, semaines types par sport |

**Niveaux de preuve** : A consensus ou méta-analyses cohérentes · B plusieurs essais · C peu d'études ou population éloignée · D avis d'expert ou choix de terrain.

### `exercices/` — Phase 3
| Fichier | Contenu |
|---|---|
| `README.md` | Carte de couverture besoins × catalogue, liste des trous, bilan |
| `force-bas-du-corps.json`, `mollet-pied-proprio.json`, `plio-puissance.json`, `haut-du-corps-gainage.json`, `mobilite-etirements.json`, `echauffement-respiration-voyage.json` | Fiches candidates au format de `docs/data/SCHEMA.md`, plus `priorite`, `prescription`, `preuve`, `sports`, `varianteDe`, et `animAFaire` quand il faut créer l'animation. **Toutes ont `valide: false`.** |
| `tests-proposes.md` | 15 tests de terrain à ajouter, avec protocole, fiabilité, erreur de mesure ; tests écartés ; batterie C |

### `modeles/` — Phase 4 : séances modèles
`vtt.json`, `route.json`, `trail.json`, `triathlon.json`, `nordique.json`, `transversal.json` : chaque fichier est `{"seances": [...]}`, au format de l'appli, avec en plus `sport`, `phase`, `duree`, `materiel`, `niveau`, `contextes`, `pourquoi`, `preuve`. Pas de charge en kg : un RPE cible et un repère en note.

### `regles/` — Phase 5 : règles codables
`regles.json` (pour un programme) et `regles.md` (pour lire) : même contenu, 70 règles, 12 domaines. Source unique : `_outils/regles_source.py`.

### `produit/` — Phase 6
`vision.md`, `fonctionnalites.md` (à faire / plus tard / à ne pas faire), `mvp-vendable.md`, `experiences.md` (10 expériences), `idees-folles.md` (17 verdicts).

### Fichiers transversaux
| Fichier | Contenu |
|---|---|
| `sources.json` | Toutes les sources citées (les clés entre crochets précédées d'une arobase dans les fichiers). `verifie: true` = la page ou le résumé a été ouvert |
| `verifie.py` | Contrôle avant chaque commit (fiches, séances, sources). Durci pendant la mission : une source doit avoir `verifie: true` |
| `SYNTHESE.md`, `JOURNAL.md`, `MISSION.md` | Synthèse, journal de bord, consigne |
| `audit.md` | Audit technique de l'appli (bonus), s'il a pu être fait |

### `_brut/` — la collecte
Notes brutes des sous-agents de collecte (une source = une page ouverte), rapports des relecteurs contradicteurs (`revue-*.md`) et comptes rendus de corrections (`corrections-*.md`). Utile pour vérifier d'où vient un chiffre. Les fichiers `science-*.md` y sont les **sources** des fichiers publiés dans `science/`.

### `_outils/` — pour refaire ou prolonger
| Script | Rôle |
|---|---|
| `verifie_index.sh` | Lance `verifie.py` sur ce qui est indexé par git |
| `verifie_fiches.py <fichier>` | Contrôle strict d'un fichier de fiches candidates |
| `verifie_modeles.py [fichier]` | Contrôle strict des séances modèles ; sans argument : couverture par sport, phase et contexte |
| `fusion_sources.py` | Reconstruit `sources.json` à partir des blocs de sources de `_brut/` |
| `normalise_cles.py` | Rend les clés de sources cohérentes entre fichiers (par DOI) |
| `publie_science.py <lettre> <nom>` | Publie `_brut/science-X.md` vers `science/` en contrôlant les quotas de sources |
| `plafonne_preuves.py` | Aligne les lettres de preuve des fiches et des séances sur la relecture scientifique |
| `carte_couverture.py [--avec-candidats]` | Recalcule la carte de couverture |
| `regles_source.py` | Source des règles : génère `regles.json` et `regles.md` |
| `modele_eco.py` | Modèle économique : change une hypothèse en tête de fichier, relance |

## Mode d'emploi

### Intégrer un exercice candidat dans l'appli
1. Choisis la fiche dans `exercices/<famille>.json` (commence par les 20 de `SYNTHESE.md`).
2. Si `anim` est rempli : vérifie à l'écran que l'animation réutilisée correspond. Si `anim` est `null` : crée l'animation à partir de `animAFaire` (voir `qa/BRIEF-AGENT.md`).
3. Copie la fiche dans `docs/data/exercises/<famille>.json` en retirant les champs de recherche (`priorite`, `prescription`, `preuve`, `sports`, `varianteDe`, `animAFaire`).
4. Relis les 3 consignes à voix haute, puis passe `valide` à `true`.
5. `python3 tools/build.py`.

### Utiliser une séance modèle
Copie la séance dans le fichier de l'athlète, ajoute `date`, mets les charges (ou des `pct`), retire les champs `sport`, `phase`, `duree`, `materiel`, `niveau`, `contextes`, `pourquoi`, `preuve`. Les exercices candidats utilisés doivent d'abord être intégrés.

### Vérifier une affirmation
Cherche la clé (le mot entre crochets après l'arobase) dans `sources.json` : auteurs, revue, DOI, et une note sur ce que la source montre. En cas de doute, le rapport du relecteur concerné est dans `_brut/revue-*.md`.

### Ce qui n'est pas dans le dépôt
`_prive/` (exclu de git par `recherche/.gitignore`) contient les détails des défauts de sécurité du site actuel. À ne pas publier avant correction.
