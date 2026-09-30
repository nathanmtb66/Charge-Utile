# MISSION — Charge Utile : tout savoir sur l'entraînement, et en faire un business

> Tu es une session Claude Code lancée par Nathan, l'entraîneur qui a créé Charge Utile. Tu as du temps et un budget dédié. Ta mission est longue, et c'est voulu : **tu travailles jusqu'à ce que toute la checklist de fin (section 9) soit cochée**. Ne t'arrête pas parce que « ça a l'air pas mal ». Tu t'arrêtes quand chaque livrable existe, passe `python3 recherche/verifie.py`, a été relu de façon critique et poussé.

---

## 0. Qui, quoi, pourquoi

**Nathan** vit à Font-Romeu (1800 m, à côté du CREPS, centre d'entraînement d'athlètes de haut niveau). Il est étudiant en L3 STAPS (Entraînement sportif), compétiteur en VTT (Coupes de France), et photographe-vidéaste sport outdoor en micro-entreprise. Il entraîne bénévolement **7 athlètes d'endurance** : VTT cross-country (XCO), route, trail court. Ils ont entre 18 et 25 ans, un niveau régional à national, 8 à 20 h d'endurance par semaine et 1 à 3 séances de muscu. Il suit leur charge sur **intervals.icu**.

**Charge Utile** est sa web-app (PWA) de musculation, déjà utilisée :

- Nathan **dicte une séance à Claude**, qui écrit un JSON et le publie sur GitHub Pages.
- L'athlète ouvre son lien personnel (pas de compte) et suit la séance **hors-ligne**. Il a un mannequin 3D animé, les bips de tempo et les minuteurs. Après chaque série, il donne son RPE et l'appli **ajuste la charge**.
- Il y a aussi : proprio à 4 niveaux auto-ajustés, pliométrie, vidéo d'une série, tests guidés (max estimé, mobilité mesurée au capteur du téléphone), onglet Récup (routine générée + respiration guidée + conseils nutrition chiffrés) et plan de saison (blocs, courses A/B/C).
- **Relais intervals.icu** (Cloudflare Worker, clé du coach) : chaque séance faite part dans intervals, et la vue coach affiche forme, volume par sport et séances faites ou ratées. Tout athlète coaché apparaît automatiquement.
- 190 exercices, animations faites à la main.

**Ce que Nathan veut de toi, dans l'ordre d'importance :**

1. **Un business rentable.** Pourquoi un coach ou un athlète choisirait cette appli plutôt qu'une autre ? Qu'est-ce qui la rend meilleure, et pourquoi elle marcherait face à ce qui existe (TrainHeroic, TrainingPeaks, intervals.icu + tableur, etc.) ? Comment révolutionner l'intégration de la force dans l'entraînement d'endurance de façon **crédible**, pas avec du marketing ?
2. **Que l'appli « sache tout »** : une base de connaissances scientifique complète, graduée par niveau de preuve, sur tout ce qui touche à l'entraînement de ces athlètes.
3. **Le plus d'exercices utiles possible**, au format exact de l'appli, prêts à intégrer.
4. Des **séances modèles** et des **règles codables** qui transforment ce savoir en fonctionnalités.

Pour que tu comprennes le produit, lis d'abord (sans rien modifier) :

- `CONTEXTE-charge-utile.md`, `README.md`, `docs/data/SCHEMA.md`, `relais/README.md`.
- `docs/data/tests.json` et `docs/data/anims-meta.json` (les animations réutilisables).
- Le catalogue, via `python3 coach.py liste <famille>` et `python3 coach.py cherche <mots>`.
- Pour le code : `grep` dans `docs/js/app.js` et `docs/js/coach.js`, **ne le lis pas en entier**.

Tu peux aussi ouvrir le site : https://nathanmtb66.github.io/Charge-Utile/?a=demo (athlète de démo) et `coach.html`.

---

## 1. Règles absolues

1. **Branche `recherche` uniquement.** Crée-la depuis `main`. **Ne pousse jamais sur `main`**, n'ouvre pas de PR, ne merge rien : `main` est le site public en production.
2. **Tu n'écris que dans `recherche/`.** Ne modifie jamais `docs/`, `relais/`, `tools/`, `qa/`, `coach.py`, `CONTEXTE-charge-utile.md`. L'intégration dans l'appli sera faite ensuite, avec Nathan.
3. **Zéro référence inventée.** Chaque source citée a été ouverte par toi (WebFetch sur le DOI, PubMed, l'éditeur ou le résumé). Si tu n'as pas pu l'ouvrir, tu ne la cites pas. Dans `sources.json`, `"verifie": true` veut dire « je l'ai ouverte ». Une fausse référence détruit la crédibilité de tout le travail.
4. **Honnêteté radicale.** Dis quand la preuve est faible, contradictoire ou absente. Dis quand une idée de Nathan ou une hypothèse business est fausse. Pas de langage marketing, pas de « révolutionnaire » sans preuve. Si une fonctionnalité est un gadget, écris-le.
5. **Droits d'auteur.** Tu résumes avec tes mots. Citations directes de 15 mots maximum, entre guillemets, avec la source. Jamais de reproduction de chapitres, de programmes payants ou de transcriptions complètes de podcasts.
6. **Vie privée.** Le dépôt est **public**. Aucun nom de famille, aucun détail médical d'une personne réelle, aucune donnée d'athlète. Le dossier `prive/` n'est pas dans le dépôt, et c'est normal.
7. **Pas de diagnostic médical.** On parle d'« écart », de « zone à travailler », de « gêne ». Quand il faut orienter vers un kiné, un médecin ou un diététicien, écris-le.
8. **Français** pour tous les livrables : phrases courtes, tutoiement dans les textes destinés aux athlètes. Les sources peuvent être en anglais.
9. **Commit + push après chaque livrable terminé**, avec un message clair (`recherche: phase 2 — science B plio/tendons`). Ne garde jamais plus d'une heure de travail non poussé : si le budget s'arrête, ce qui est poussé est sauvé.
10. **`python3 recherche/verifie.py` doit passer avant chaque commit** qui touche `exercices/`, `modeles/` ou `sources.json`. S'il échoue, corrige avant de pousser. Ne modifie pas `verifie.py` pour le faire passer (tu peux l'enrichir, jamais l'assouplir).

---

## 2. Méthode de travail

**Sous-agents.** Nathan t'autorise à lancer des sous-agents en parallèle pour la collecte : 4 à 6 à la fois, pas plus, pour ne pas gaspiller le budget. Ce qu'ils font et ce que tu fais :

- Chaque sous-agent a un sujet précis, rend un fichier brut dans `recherche/_brut/` (notes + liste de sources vérifiées) et un résumé court.
- **Toi**, tu synthétises, tu tranches les contradictions, tu vérifies les sources douteuses, tu écris les livrables finaux et tu tiens le journal.
- Pour chaque livrable important, lance ensuite un sous-agent **contradicteur**. Consigne : « trouve les erreurs, les sources fausses ou mal lues, les affirmations trop fortes, les trous ». Corrige ce qu'il trouve.

**Hiérarchie des sources (de la plus forte à la plus faible) :**

1. Déclarations de consensus : CIO, ACSM, ECSS, ISSN, AIS, NSCA position stands.
2. Méta-analyses et revues systématiques récentes (2018-2026).
3. Essais contrôlés randomisés.
4. Revues narratives d'auteurs reconnus.
5. Études observationnelles.
6. Avis d'experts : podcasts, livres, coachs de haut niveau.
7. Pratiques de terrain.

Cherche activement les méta-analyses qui **contredisent** une idée populaire.

**Techniques de recherche :**

- Moteurs : PubMed, Google Scholar, Europe PMC, Semantic Scholar, SPORTDiscus via les résumés.
- Remonte les citations des méta-analyses clés (« snowballing »), dans les deux sens.
- Cherche les auteurs de référence de chaque domaine et leurs publications récentes.
- Podcasts : show notes, résumés, transcriptions publiques. Fast Talk Labs, Uphill Athlete, Science of Ultra, Empirical Cycling, Stronger By Science, The Science of Sport, Sigma Nutrition, Huberman seulement pour vérifier ses affirmations contre la littérature, Physiologically Speaking, Koop, TrainerRoad Ask a Cycling Coach, Evoke Endurance. Français : Sport & Science, Yann Le Meur, Kiné Sport, Grégoire Millet (altitude), INSEP. Traite-les comme des avis (niveau D) sauf s'ils citent des données.
- Business : sites officiels, pages de prix, avis App Store et Google Play, G2 et Capterra, Reddit (r/Velo, r/trailrunning, r/cycling, r/AdvancedRunning, r/Ultramarathon, r/triathlon, r/personaltraining, r/StrengthTraining), forum intervals.icu, forum TrainerRoad, Slowtwitch, Product Hunt, Crunchbase, rapports de marché, interviews de fondateurs.

**Format de chaque affirmation dans les fichiers science :**

| Affirmation | Preuve | Chiffres | Sources | Application pour l'appli / le coach |
|---|---|---|---|---|
| La force lourde améliore l'économie de pédalage | B | +x % à y % après 8-12 sem | [@ronnestad2014] | Bloc PPG : 2×/sem, 4×4-6 à RPE 8 |

**Niveaux de preuve :**

- **A** : consensus ou méta-analyses cohérentes.
- **B** : plusieurs essais cohérents.
- **C** : peu d'études, études contradictoires ou populations éloignées.
- **D** : avis d'expert ou pratique de terrain.

**Citer.** Dans les `.md`, écris `[@cle]`. Chaque clé existe dans `recherche/sources.json` :

```json
[{"cle": "ronnestad2014", "auteurs": "Rønnestad BR, Mujika I", "annee": 2014, "titre": "…", "revue": "Scand J Med Sci Sports", "doi": "10.…", "url": "https://…", "type": "revue|meta-analyse|essai|consensus|podcast|site|livre", "niveau": "A|B|C|D", "verifie": true, "note": "ce que la source montre en une phrase"}]
```

**Journal.** Tiens `recherche/JOURNAL.md` à jour : checklist de la section 9 avec les cases cochées, heure de début et de fin de chaque phase, problèmes rencontrés, décisions prises.

---

## 3. PHASE 1 — Business et marché (priorité n°1)

Dossier `recherche/business/`. C'est ce que Nathan attend le plus. Sois exhaustif, chiffré, sourcé et **franc**.

### 1.1 Concurrence — `01-concurrence.md` + `concurrents.csv`
Au moins **35 produits**, avec une fiche chacun : cible, fonctions, prix 2026 vérifié sur la page officielle (date de vérification), modèle (coach paie / athlète paie / club), intégrations (Garmin, Strava, TrainingPeaks, intervals.icu, Apple Santé, Google Fit), plateformes, forces, faiblesses et avis utilisateurs réels (lien).

Minimum à couvrir :

- **Coaching force** : TrainHeroic, TeamBuildr, Bridge Athletic, TrueCoach, Everfit, Trainerize, CoachRx, Exercise.com, PT Distinction, My PT Hub, Volt Athletics.
- **Apps de force grand public** : Hevy (+ Hevy Coach), Strong, Fitbod, Future, Ladder, JuggernautAI, RP Hypertrophy.
- **Plateformes d'endurance** : TrainingPeaks (dont Strength Builder), intervals.icu, Final Surge, Today's Plan, Nolio, Humango, Enduco, JOIN, TrainerRoad, Xert, Runna (volet force), Strava.
- **Endurance + force** : Uphill Athlete, Dialed Health, Strength Running, et toute appli « strength for cyclists / runners ».
- **Mesure** : Vert, Output Sports, Metric VBT, Enode, VBT par caméra.
- **Haut de gamme** : Kinexon, Catapult, Hudl, Smartabase.
- **Français** : MyCoach, Nolio, Kiffit… vérifie ce qui existe réellement.
- **IA de coaching** (2025-2026) : toutes les apps qui génèrent des séances par IA ou par la voix.

Pour **chacune**, dis ce qu'elle fait mieux que Charge Utile et ce que Charge Utile fait qu'elle ne fait pas. Termine par une **matrice fonctions × produits**.

### 1.2 Marché — `02-marche.md`
- Taille et croissance de ces marchés : logiciels de coaching en ligne, apps de fitness et de force, endurance (vélo, trail, triathlon), en France, en Europe et dans le monde. Distingue les chiffres sérieux des rapports « market research » gonflés, et dis-le.
- Nombre d'entraîneurs d'endurance indépendants en France : licenciés FFC, FFA trail, FFTri, FF Ski nordique, UFOLEP, FSGT ; diplômés BPJEPS, DEJEPS, STAPS ES.
- Nombre de clubs, pôles espoirs, CREPS, structures d'entraînement.
- Qui paie aujourd'hui, et combien : prix par athlète et par mois chez les coachs, ce que dépense un coach en logiciels.

### 1.3 L'écosystème intervals.icu — `03-intervals-ecosysteme.md`
C'est peut-être la meilleure porte d'entrée. Étudie-le à fond :

- Nombre d'utilisateurs, de coachs, croissance, modèle économique (dons/abonnement), position de son créateur sur les intégrations tierces.
- API (ce qu'on peut lire et écrire), applis tierces qui s'y branchent déjà.
- Demandes sur le forum autour de la **musculation** : fils, votes, ce qui manque. Liste les fils les plus pertinents avec liens.
- Est-ce que les coachs d'endurance y gèrent la force ? Comment (description texte, tableur, autre appli) ?
- Opportunité : « le module force qui manque à intervals.icu (et à TrainingPeaks) ». Vérifie si c'est vrai, et quelle taille ça représente.
- Risques : dépendance à une plateforme, conditions de l'API, clé API du coach dans un relais.

### 1.4 Douleurs utilisateurs — `04-douleurs.md`
Au moins **120 citations courtes** (≤ 15 mots, lien vers la source) de coachs et d'athlètes d'endurance, classées par thème :

- « la muscu n'est pas suivie » ;
- « le coach ne sait pas si l'athlète a fait sa séance » ;
- « exos mal faits » ;
- « trop compliqué » ;
- « double saisie » ;
- « pas de lien avec la charge d'endurance » ;
- « prix » ;
- etc.

Compte les occurrences par thème. C'est la preuve du besoin, ou de son absence.

### 1.5 Positionnement — `05-positionnement.md`
- **Pourquoi Charge Utile et pas une autre** : une phrase, puis la démonstration point par point, avec preuves.
- Les avantages réels et défendables :
  - l'IA qui transforme la voix du coach en séance ;
  - le lien direct avec la charge d'endurance (intervals) ;
  - l'appli pensée pour l'endurant (pas pour le bodybuilder) ;
  - les tests au capteur, le hors-ligne, pas de compte pour l'athlète ;
  - les animations ;
  - le prix ;
  - Nathan lui-même : athlète, coach, STAPS, créateur de contenu photo/vidéo avec réseau à Font-Romeu et au CREPS.
- Pour chacun, dis s'il est **copiable en 3 mois** par un concurrent.
- Les faiblesses qui tuent : animations faites main, pas d'app native, dépendance à Claude et à intervals, un seul développeur, etc.
- 3 positionnements possibles, comparés. Recommande-en un, argumenté.
- Ce qui serait **révolutionnaire de façon crédible**, et ce qui ne l'est pas.

### 1.6 Modèle économique — `06-modele-economique.md`
Compare au moins 5 modèles :

- SaaS coach, prix par athlète ;
- freemium athlète ;
- licence club / CREPS / pôle / fédération ;
- marketplace de programmes créés par des coachs ;
- service « coach + appli » vendu par Nathan lui-même ;
- mixte.

Pour chacun :

- prix recommandé, avec la justification par les prix concurrents ;
- **coûts unitaires réels** : hébergement Cloudflare/GitHub, coût API Claude par séance dictée (tokens estimés × tarif public), stockage vidéo, support ;
- marge, point mort, CAC estimé par canal, LTV ;
- projection à 12 et 36 mois en 3 scénarios (pessimiste, réaliste, optimiste), en disant **à quel point c'est incertain**.

Contexte à respecter : Nathan est étudiant, seul et en micro-entreprise. Donne les seuils de chiffre d'affaires, la TVA et les obligations.

### 1.7 Juridique et technique pour vendre — `07-juridique-technique.md`

- **RGPD** :
  - le RPE, les douleurs et les résultats de tests sont-ils des **données de santé** (art. 9) ?
  - conséquences : consentement, registre, DPO ?
  - **hébergement HDS** obligatoire en France ou non pour ce cas ?
  - position de la CNIL sur les applis sport et bien-être.
- **Dispositif médical** : règlement (UE) 2017/745, règle 11. Où est la ligne à ne pas franchir, quelles formulations éviter.
- CGU, responsabilité en cas de blessure, assurance RC pro.
- Comptes utilisateurs, sécurité, sauvegarde.
- PWA ou App Store / Play Store en 2026 : limites iOS (notifications, stockage, installation), coûts, avantages. Faut-il une appli native, et quand ?
- Droits : animations, liens vidéos externes, nom et marque (recherche INPI / EUIPO sur « Charge Utile » : disponible ? risques ?).

### 1.8 Mise sur le marché — `08-go-to-market.md`

- Premiers clients réalistes en France : CREPS Font-Romeu, pôles espoirs VTT/trail/ski nordique/biathlon, clubs FFC, comités régionaux, coachs indépendants, étudiants STAPS, groupes Facebook et Discord de coachs, influenceurs trail et VTT.
- Comment Nathan utilise son talent de **photographe-vidéaste** (Instagram @nathan_rsslle) comme canal d'acquisition.
- **Script d'entretien** de découverte : 15 questions, pour 20 coachs à interroger avant de coder quoi que ce soit.
- Tests de prix : page d'atterrissage, liste d'attente, préventes.
- **Critères d'arrêt** : quels signaux doivent faire abandonner ou pivoter.
- Calendrier de saison : quand les coachs choisissent leurs outils.

### 1.9 Plan — `09-plan-12-mois.md`
Plan mois par mois sur 12 mois, compatible avec les études de Nathan (L3) et sa saison de VTT : objectifs chiffrés, décisions à prendre, jalons. Plus une section « **Ce qui est faux dans nos hypothèses** » : liste franche de ce qui pourrait faire échouer le projet.

---

## 4. PHASE 2 — La base de connaissances scientifique

Dossier `recherche/science/`, un fichier par domaine. Pour **chaque domaine** :

- au moins **30 sources vérifiées**, dont au moins **10 méta-analyses, revues systématiques ou consensus** ;
- le tableau d'affirmations (format section 2) ;
- une section **Chiffres clés** ;
- une section **Mythes et verdicts** ;
- une section **Règles pour l'entraîneur** : 20 à 40 règles actionnables avec leur niveau de preuve ;
- une section **Ce que l'appli devrait faire** avec ce savoir.

Les domaines :

**A — Force et endurance** (`A-force-endurance.md`)
- Entraînement concurrent : interférence, méta-analyses récentes, ordre et délai entre les séances, même jour.
- Effets de la force lourde, explosive et pliométrique sur l'économie de course et de pédalage, la puissance et la fatigue tardive, avec tailles d'effet.
- Dosages : %1RM, reps, séries, fréquence, volume minimal efficace, maintien en saison, affûtage.
- Méthodes : RIR/RPE, VBT, perte de vitesse, cluster sets, unilatéral vs bilatéral, isométrie.
- Hypertrophie et masse chez le grimpeur.
- Demandes spécifiques : XCO (haut du corps, préhension, descentes), route (sprint), trail (excentrique, descente).

**B — Pliométrie, tendons, prévention, os** (`B-plio-tendons-prevention.md`)
- Pliométrie : dosage en contacts, RSI.
- Tendons : charge lente lourde (HSR), isométrie et douleur, fréquence de charge, collagène + vitamine C.
- Prévention : Nordic, Copenhague, proprio et entorses, mollet et soléaire, genou (douleur fémoro-patellaire, bandelette), épaule du vététiste après chute, bas du dos.
- **Densité osseuse des cyclistes** : point important.
- Tests de terrain et asymétries (critique des seuils de 10-15 %).
- Critique de l'ACWR.

**C — Mobilité, étirements, échauffement, respiration** (`C-mobilite-respiration.md`)
- Étirements : statiques (effet aigu, chronique, sur la force), dynamiques, PNF, étirement chargé ; dose-réponse de l'amplitude.
- Échauffement : RAMP, PAPE, échauffement avant XCO, trail et contre-la-montre.
- Rouleau de massage.
- Besoins d'amplitude réels par sport.
- Yoga et pilates.
- Respiration : diaphragmatique, IMT, nasale, lente et VFC, soupir physiologique, box breathing, Wim Hof, hypoventilation, respiration en altitude.
- **8 protocoles de respiration prêts à coder** : timing en secondes, durée, but, preuve.

**D — Récupération, charge, sommeil, altitude** (`D-recuperation-charge.md`)
- Récupération : froid (et atténuation des gains de force), chaleur et sauna, compression, massage, électrostimulation.
- Sommeil.
- Suivi de la charge : sRPE, questionnaires de bien-être, VFC, CTL/ATL/TSB et leurs limites.
- Surmenage (consensus ECSS/ACSM), RED-S (CIO 2023) : signaux d'alerte non médicaux.
- Décharge et affûtage.
- Altitude 1800 m : vivre en haut, fer, hydratation, sommeil, retour en plaine.
- **Un « score de forme du jour »** calculable par l'appli : entrées, pondération, seuils, et limites de validité.

**E — Nutrition et compléments** (`E-nutrition.md`)
- Disponibilité énergétique.
- Glucides : périodisation, apports à l'effort (60-120 g/h), entraînement de l'intestin.
- Protéines : dose, répartition, avant le sommeil.
- Hydratation et sodium.
- Récupération entre deux séances.
- Compléments selon le cadre AIS A/B/C/D : caféine, créatine, nitrate, bêta-alanine, bicarbonate, vitamine D, fer, oméga-3, collagène, cétones, antioxydants.
- Dopage involontaire et labels.
- Alcool, alimentation végétale, poids chez le grimpeur (prudence, jamais de prescription de perte de poids), altitude.
- **Tableau « conseil de fin de séance »** par type de séance, en quantités par kg.

**F — Spécificités des sports et des publics** (`F-sports-publics.md`)
- Profils physiologiques et demandes : XCO, route, trail court, gravel, triathlon, ski nordique et biathlon (le CREPS de Font-Romeu est un marché), course sur route.
- Publics :
  - femmes (cycle menstruel : état réel de la preuve, souvent faible) ;
  - juniors (la loi et les précautions si l'appli a des mineurs) ;
  - masters ;
  - débutants en muscu.

**G — Psychologie, motivation, adhésion** (`G-adhesion.md`)
**Crucial pour le produit.** Pourquoi les athlètes d'endurance sautent la muscu. Ce qui augmente l'adhésion à un programme : feedback, relation au coach, gamification (preuve ?), rappels, durée des séances, autonomie. Changement de comportement (COM-B, théorie de l'autodétermination). Ce qui marche vraiment dans les applis de santé et de sport. Données d'abandon des applis de fitness.

**H — Tests, mesure et technologie** (`H-tests-mesure.md`)
- Validité et fiabilité des tests de terrain.
- Mesure d'angle par le capteur d'un téléphone : études de validité des inclinomètres de smartphone.
- VBT par téléphone : validité.
- Estimation du 1RM (Epley et autres), RIR et RPE : précision réelle.
- Analyse vidéo du mouvement par IA en 2026 : ce qui est fiable, ce qui ne l'est pas.
- Montres et capteurs : ce qui est exploitable.

**I — Programmation et périodisation** (`I-periodisation.md`)
Modèles (linéaire, ondulatoire, par blocs, autorégulation) : preuves comparées. Intégration de la force dans une saison d'endurance : PPG, PPO, PPS, PPC, affûtage, transition. Gestion du calendrier de courses A/B/C. Semaines type par sport et par phase.

---

## 5. PHASE 3 — Les exercices

Dossier `recherche/exercices/`.

### 3.1 Carte de couverture — `exercices/README.md`
Construis une matrice **besoins × catalogue actuel**. Les besoins sont :

- sport : XCO, route, trail, triathlon, nordique ;
- qualité : force max, puissance, plio, excentrique, isométrie, gainage anti-mouvement, préhension, proprio, mobilité, étirement, respiration, échauffement ;
- zone : pied, cheville, genou, hanche, dos, épaule, cou, poignet ;
- matériel : salle complète, haltères seuls, élastique, rien (hôtel, voyage) ;
- niveau : 1-3.

Liste chaque **case vide ou faible**. C'est ta liste de courses.

### 3.2 Fiches candidates — `exercices/<famille>.json`
Vise **au moins 250 exercices nouveaux**, dont au moins **80 en priorité 1**, qui comblent les trous de la carte. Pour chacun, le **format exact** de `docs/data/SCHEMA.md`, plus des champs de recherche :

- **Contenu de la fiche** :
  - `id` : kebab-case, en français, inédit ;
  - `nom`, `famille`, `type`, `unilateral`, `muscles` (clés valides seulement), `musclesTxt`, `materiel`, `niveau` ;
  - `consignes` : 3 consignes de **48 caractères maximum**, tutoiement ;
  - `erreurs` : 2 erreurs fréquentes ;
  - `pourquoi` : relié au VTT, à la route ou au trail ;
  - `respiration`, `securite`, `tags`, `zones` (obligatoires en mobilité et étirement) ;
  - `alternatives` : ids **existants** du catalogue ;
  - `tempoConseille`, `progression` (si l'exercice appartient à une chaîne de niveaux), `dureeConseillee` et `repsConseillees` pour la récup ;
  - `voirEnVrai` : lien vidéo **ouvert et vérifié**, sinon `null` ;
  - `valide` : toujours `false`.
- **Animation** :
  - `anim` et `opts` : **réutilise une animation existante** de `docs/data/anims-meta.json` quand le mouvement est proche, en regardant comment les fiches existantes utilisent `opts` ;
  - sinon `anim: null` et `animAFaire` : description précise de la pose (départ `s=0`, position basse ou étirée `s=1`, appuis, angles approximatifs, matériel), pour qu'un animateur puisse la coder selon `qa/BRIEF-AGENT.md`.
- **Champs de recherche** :
  - `priorite` : 1, 2 ou 3 ;
  - `prescription` : texte, par exemple « 3×6-8/jambe, tempo 3-1-1-0, 2 min » ;
  - `preuve` : lettre + clé de source, par exemple « B · [@blagrove2018] » ;
  - `sports` : tableau ;
  - `varianteDe` : id existant ou `null`.

Contenu attendu (liste non limitative) :

- **Force** :
  - variantes unilatérales, trap bar, split squat, step-up haut, sissy squat, reverse Nordic ;
  - isométries : mid-thigh pull, wall sit unijambe, isométrie de mollet, Spanish squat variantes ;
  - soleus raise genou fléchi, tibialis raise, charnières, landmine, sac lesté, poussées de hanche ;
  - excentriques de descente.
- **Puissance** : bonds, sauts, lancers de medecine-ball, kettlebell, sprints courts en côte, gammes athlétiques.
- **Haut du corps et gainage VTT** : dead hang, carries, tirages, pompes, anti-rotation, anti-extension, Turkish get-up, stabilité d'épaule en charge.
- **Pied et cheville** : short foot, isométries d'éversion, heel drops, marche pieds nus.
- **Mobilité et étirements** : les 40 plus utiles pour ces sports, dont ceux faisables en 5 minutes après une sortie.
- **Respiration** : exercices guidés (types `hold`/`cardio`).
- **Échauffements** spécifiques (avant muscu, avant XCO, avant trail) et exercices « sur le vélo » ou en voyage sans matériel.

Chaque exercice doit être **réellement utile** et **distinct** de l'existant. Pas de remplissage : 250 bons valent mieux que 400 moyens. Mais ne t'arrête pas à 250 si des trous restent dans la carte.

### 3.3 Tests de terrain manquants — `exercices/tests-proposes.md`
Au moins 12 tests à ajouter à la batterie actuelle (voir `docs/data/tests.json`). Pour chacun :

- protocole pas à pas ;
- ce qui est mesurable au téléphone (capteur, chrono, vidéo) ;
- fiabilité et validité publiées ;
- repères ou normes avec source ;
- erreurs de mesure ;
- sport concerné.

---

## 6. PHASE 4 — Séances modèles

Dossier `recherche/modeles/`. Au moins **60 séances** au format `seances` de `SCHEMA.md`, réparties en fichiers par sport (`vtt.json`, `route.json`, `trail.json`, `triathlon.json`, `nordique.json`, `transversal.json`). Chaque fichier est un objet `{"seances": [...]}`.

Chaque séance a les champs du SCHEMA, plus :

- `sport` ;
- `phase` : PPG, PPO, PPS, PPC, AFFUTAGE, TRANSITION, RECUP ;
- `duree` en minutes ;
- `materiel` : `salle`, `halteres`, `elastique` ou `aucun` ;
- `niveau` ;
- `pourquoi` : 1 phrase ;
- `preuve` : lettre + clés.

Couvre au minimum :

- **Toutes les phases** pour chaque sport principal.
- **Contextes** : séance de maintien de 25-30 min en pleine saison, séance voyage sans matériel, prévention genou, prévention cheville, épaule après chute, retour de coupure, veille de course (activation légère).
- **Ciblées** : plio trail, force max PPG, puissance PPO.
- **Récupération** : récup active + mobilité.

Les exercices sont des ids existants **ou** des ids de tes fiches candidates. `verifie.py` doit passer.

---

## 7. PHASE 5 — Règles codables

`recherche/regles/regles.json` + `regles.md`. Au moins **50 règles** qu'un programme peut appliquer, chacune au format :

```json
{"id": "interference-delai", "domaine": "planification", "condition": "séance muscu jambes lourde et séance vélo intense le même jour", "action": "placer la muscu ≥ 6 h après, ou en premier si l'objectif du bloc est la force ; alerter le coach", "parametres": {"delai_h": 6}, "preuve": "B", "sources": ["cle1", "cle2"], "limite": "ce que la règle ne sait pas"}
```

Domaines à couvrir :

- autorégulation de la charge par RPE/RIR (vérifie et améliore ce que fait l'appli) ;
- progression et régression proprio/plio ;
- décharge automatique ;
- garde-fou de compétition ;
- espacement concurrent muscu/endurance selon la charge intervals (CTL/ATL/TSB) ;
- score de forme ;
- alerte surmenage et RED-S (non médicale : « parles-en à ton coach ») ;
- nutrition de fin de séance ;
- choix de la routine de récup ;
- tests et retests (fréquence) ;
- asymétries ;
- douleurs (quand retirer un exercice, quand orienter vers un kiné).

---

## 8. PHASE 6 — Le produit : rendre l'appli meilleure et vendable

Dossier `recherche/produit/`. Appuie-toi sur les phases 1 à 5.

- **`vision.md`** : le problème précis que Charge Utile résout, pour qui, et le « job to be done ». Pourquoi maintenant (IA vocale, intervals.icu, coût quasi nul du logiciel sur mesure). Ce que ça devient dans 3 ans si ça marche.
- **`fonctionnalites.md`** : liste classée **impact × effort** de toutes les améliorations possibles, en séparant « pour Nathan et ses 7 athlètes maintenant » et « pour vendre ». Pour chaque idée :
  - le problème résolu, avec preuve (douleurs de 1.4, science) ;
  - ce que font les concurrents ;
  - la complexité ;
  - le verdict **à faire / plus tard / gadget à ne pas faire**.

  Nathan veut une appli **simple** : chaque fonctionnalité doit mériter sa place. Mets explicitement en avant ce qu'il faut **supprimer ou ne pas faire**.
- **`mvp-vendable.md`** : spécification du plus petit produit qu'un autre coach paierait.
  - Comptes coach, ajout d'athlètes, création de séances par la voix ou le texte via IA (coût par séance, garde-fous contre les erreurs de l'IA, validation par le coach).
  - Lien intervals.icu et TrainingPeaks : OAuth ou clé, ce qui est possible légalement et techniquement.
  - Sécurité, données, prix, onboarding en moins de 5 minutes.
  - Architecture technique recommandée depuis l'existant (PWA + Cloudflare), sans réécrire ce qui marche.
- **`experiences.md`** : 10 expériences pour valider la demande avant de coder. Pour chacune : hypothèse, test, critère de succès chiffré, coût, durée.
- **`idees-folles.md`** : les idées ambitieuses (IA qui analyse la vidéo de la série, coach vocal, séance ajustée à la VFC du matin, lien automatique avec la charge vélo…). Pour chacune : **faisabilité réelle en 2026**, preuve scientifique, coût, et verdict franc.

---

## 9. Checklist de fin — tu ne t'arrêtes pas avant d'avoir tout coché

Recopie cette liste dans `JOURNAL.md` et coche au fur et à mesure.

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
- [ ] `recherche/SYNTHESE.md`, **à lire en 10 minutes** :
  - la réponse en 5 lignes à « pourquoi cette appli, et est-ce un business viable ? » ;
  - les 30 décisions recommandées à Nathan, classées ;
  - les 20 exercices à intégrer en premier ;
  - les 10 fonctionnalités à construire en premier ;
  - les 5 choses à ne surtout pas faire ;
  - ce que tu n'as pas pu vérifier.
- [ ] Tout est commité et poussé sur la branche `recherche`.

**Si tu penses avoir fini :**

1. Relis cette checklist ligne par ligne.
2. Relis la carte de couverture et le fichier des douleurs utilisateurs.
3. Demande-toi : « qu'est-ce qu'un expert en préparation physique d'endurance, un investisseur et un coach concurrent trouveraient de faible ici ? ».
4. Traite les réponses.
5. Recommence jusqu'à ce que tu n'aies plus rien de sérieux à ajouter.

Il n'existe pas de « solution miracle », et tu ne dois pas en inventer une. Le but est la meilleure réponse que les preuves permettent.

**Si le budget arrive au bout :**

1. Finis et pousse le fichier en cours.
2. Écris `SYNTHESE.md` avec ce qui existe.
3. Note dans `JOURNAL.md` exactement ce qui reste, pour qu'une autre session reprenne là où tu t'es arrêté.
