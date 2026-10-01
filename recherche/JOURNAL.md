# Journal de la mission de recherche

Session Claude Code (Opus 5.5), branche `recherche`, lancée le 30 septembre 2026 à 20 h 30 (heure de Paris).

## Checklist (section 9 de MISSION.md)

**Business**
- [x] 01 à 09 écrits ; `concurrents.csv` avec ≥ 35 lignes et prix datés. *(74 lignes)*
- [x] ≥ 120 citations d'utilisateurs classées et comptées (04). *(189, dont 90 revérifiées mot pour mot)*
- [x] Unités économiques chiffrées pour ≥ 5 modèles, coût API Claude par séance calculé (06). *(5 modèles + mixte ; 0,03 à 0,06 € par séance)*
- [x] Recommandation claire de positionnement et de modèle, avec les raisons de ne pas choisir les autres. *(05, 06)*
- [x] Section « Ce qui est faux dans nos hypothèses » (09). *(14 points)*

**Science**
- [x] 9 domaines A à I écrits, chacun avec ≥ 30 sources vérifiées dont ≥ 10 méta-analyses/consensus, tableau d'affirmations, chiffres clés, mythes, règles, « ce que l'appli devrait faire ». *(sources / dont méta-analyses, revues systématiques, consensus : A 74/33 · B 63/37 · C 66/29 · D 63/27 · E 87/42 · F 76/33 · G 62/34 · H 72/31 · I 100/30 ; quotas contrôlés par `_outils/publie_science.py`)*
- [x] 8 protocoles de respiration codables (C) ; score de forme (D) ; tableau nutrition de fin de séance (E). *(tableau + JSON dans chaque fichier)*

**Exercices, séances, règles**
- [ ] Carte de couverture ; ≥ 250 fiches candidates dont ≥ 80 en priorité 1 ; chaque case vide de la carte comblée ou justifiée.
- [ ] ≥ 12 tests de terrain proposés.
- [ ] ≥ 60 séances modèles couvrant toutes les phases et tous les contextes listés.
- [x] ≥ 50 règles codables. *(70, dont 24 de niveau D assumé)*

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

- **Business 02, 03, 05 à 09** (01/10, sous-agent contradicteur « investisseur / coach concurrent / juriste », rapport `_brut/revue-business.md`) : 40 faits rouverts → 31 confirmés, 7 imprécis, 2 non vérifiables ; aucune source inventée ; arithmétique juste. **2 bloquants corrigés** : (1) le plan faisait vendre du coaching à des compétiteurs dès novembre 2026 alors que Nathan, en L3, n'en a pas le droit → `05`, `06`, `09` recalés (service payant à partir de l'été 2027, tableau « ce que Nathan peut vendre aujourd'hui ») ; (2) `07` décrivait une faille non corrigée dans un dépôt public → détails déplacés dans `recherche/_prive/` (non versionné), fichiers expurgés, **historique local non poussé réécrit**. **Importants corrigés** : micro-entreprise déjà existante (cumul des seuils, pas d'ACRE) ; coûts fixes et heures de Nathan ajoutés au modèle ; prix du marché sur deux étages (8 € standard / 55-80 € personnalisé) ; budget logiciel 1-3 € par athlète (et non 5-15 €) ; marché du coaching 15-55 M€ ; critères de bascule unifiés sur ceux de `08` (paiements réels) ; seuil de rétention corrigé (60 % = repère à 6 mois) ; mineurs sortis de la première vague ; équipe intervals « 3 à 8 personnes » ; statut du pôle VTT de Font-Romeu marqué incertain ; nuance Garmin alignée partout ; effectifs trop petits retirés. **Non traité, noté pour la fin** : doublons d'URL sous deux clés dans `sources.json`.

## Phases

| Phase | Début | Fin |
|---|---|---|
| 1 — Business | 30/09 20 h 30 | 01/10 13 h 30 (3 coupures par limite de session) |
| 2 — Science | 01/10 03 h 00 (collecte lancée en parallèle) | 01/10 14 h 30 (revue contradictoire en cours) |
| 3 — Exercices | 01/10 13 h 30 | |
| 4 — Séances modèles | | |
| 5 — Règles | 01/10 13 h 45 | 01/10 14 h 30 |
| 6 — Produit | | |

## Décisions

- 01/10 — Les sous-agents de collecte écrivent un brut « presque final » ; j'écris la tête de chaque livrable (synthèse, verdicts, recommandations) et j'intègre le brut relu comme partie détaillée. Les corrections du contradicteur priment et sont listées en tête quand elles touchent la partie brute.
- 01/10 — Comme des fichiers bruts sont en cours d'écriture par les sous-agents, `verifie.py` est lancé sur l'état indexé exact (`_outils/verifie_index.sh`) avant chaque commit.

- Les sous-agents de collecte écrivent dans `recherche/_brut/` ; seules les sources qu'ils ont réellement ouvertes (WebFetch) passent dans `sources.json`.

## Problèmes rencontrés

- 01/10 — **Push bloqué** : depuis le 30/09 21 h, l'écran du Mac est verrouillé et la demande de contrôle de l'écran reste sans réponse ; le push par GitHub Desktop (menu Repository > Push) est impossible tant que l'écran est verrouillé. Tous les commits sont locaux sur `recherche`. À pousser dès le déverrouillage (un clic sur « Push origin »).
- 01/10 — 2 failles de sécurité du site actuel repérées par la collecte juridique : détails dans `recherche/_prive/securite-relais.md` (non versionné). Hors périmètre de la mission (interdiction de modifier `docs/` et `relais/`) : à corriger par Nathan en priorité.

- 01/10 01 h 55 — `verifie.py` échouait sur les exemples de format de `MISSION.md` (les clés d'exemple « cle », « ronnestad2014 », « blagrove2018 » écrites au format citation). Correctif : `verifie.py` ignore **uniquement** `MISSION.md` (la consigne, pas un livrable). En contrepartie je l'ai **durci** : toute source de `sources.json` doit avoir `verifie: true`. Les deux références d'exemple ont été vérifiées (Europe PMC) et ajoutées à `sources.json`.
- 30/09 21 h 10 → 01/10 01 h 50 — seconde coupure par limite de session : 5 sous-agents interrompus (marché, concurrence endurance et mesure/IA à moitié écrits ; juridique et go-to-market sans fichier). Repris à 01 h 50.

- 30/09 20 h 35 — `git push` impossible depuis la session : pas d'identifiants GitHub dans le terminal (ni `gh`, ni clé SSH, ni credential helper). Je ne vais pas chercher de jeton dans le trousseau. → Résolu à 20 h 40 avec l'accord de Nathan : je commite en ligne de commande et je pousse en cliquant « Push origin » dans GitHub Desktop (branche `recherche` publiée). Jamais rien sur `main`.

- 30/09 20 h 55 — les 6 sous-agents de la 1re vague ont été coupés par la limite de session (HTTP 429) avant d'écrire. Relancés à 21 h 00 sur les crédits disponibles, avec consigne d'écrire leur fichier au fur et à mesure.

## Revues contradictoires

- **01 concurrence + 04 douleurs** (01/10, sous-agent contradicteur, rapport `_brut/revue-01-04.md`) : 26 faits rouverts → 17 confirmés, 6 faux, 3 non étayés ; 90 citations de 04 revérifiées mot pour mot, aucune inventée. **Corrigé** : 4 affirmations d'exclusivité fausses (créneau intervals « vide », « aucun outil de coach n'ajuste », « bips de tempo nulle part », « mobilité au téléphone nulle part ») ; Garmin présenté en hypothèse (avis contraire de DC Rainmaker) ; WHOOP en bêta ; prix coach TrainingPeaks ; Nolio a un lecteur avec minuteurs ; TrainingPeaks n'exporte pas la force vers les montres ; 7 produits ajoutés (Watts & Weights, PacePartner, CoachingPortal, Peak Strength, StrengthTempo, Kiprun Pacer, Campus Coach) ; 04 : une citation reclassée (T2 → T8), une exclue (promo), datation signalée, total corrigé (68/188 et non 70/189). 05 aligné sur ces corrections.
