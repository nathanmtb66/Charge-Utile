# Revue contradictoire de `01-concurrence.md` (+ `concurrents.csv`) et `04-douleurs.md`

*Relecture critique du 1er octobre 2026. Pages rouvertes moi-même (WebFetch, WebSearch, ou API JSON publique de Discourse pour le forum intervals.icu). Gravité : **bloquant** (change une conclusion du « En 1 minute » ou du positionnement), **important** (fait faux ou trop fort, à corriger avant diffusion), **mineur** (précision, devise, cohérence).*

## Bilan express

- **Les faits lourds tiennent** : rachat Garmin (22/07/2026), prix Nolio, TrainHeroic, Dialed, RideStrong, intervals.icu, refonte force de Strava (21/05/2026), serveur MCP intervals (364 étoiles, GPL-3.0), interdiction GitHub Pages pour un SaaS commercial.
- **Quatre affirmations d'exclusivité sont fausses ou trop fortes** : « créneau occupé par personne, en particulier sur intervals.icu », « aucun outil de coach ne fait l'ajustement automatique », « bips de tempo vus nulle part », « mobilité au capteur du téléphone vue nulle part ».
- **Trous** : Watts & Weights, PacePartner, CoachingPortal, Peak Strength, Kiprun Pacer et Campus Coach manquent ; le prix coach de TrainingPeaks est faux dans la matrice.
- **01 contredit 03** : `03-intervals-ecosysteme.md` liste déjà Watts & Weights, PacePartner, Trevo, LOAD, MyTrainPal, ponts Hevy… que `01` ignore.
- **Citations de `04`** : 90 citations vérifiées **mot pour mot** (intervals.icu, TrainerRoad, Slowtwitch, vo2cycling), toutes ≤ 15 mots. Aucune citation inventée trouvée. Les problèmes de `04` sont de **datation et d'interprétation**, pas de fidélité.

---

## Problèmes trouvés

### 1. [BLOQUANT] « Créneau occupé par personne, en particulier pas sur intervals.icu » : faux, et contredit `03`

- **Où** : `01`, « En 1 minute » point 2 ; point 2 du « Ce que CU fait qu'aucun ne fait » (« Remontée automatique dans intervals.icu ») ; « Lecture » de la matrice (« seule pleine sur … intervals.icu ») ; tableau des menaces (aucun acteur intervals hors « LLM + MCP »).
- **Preuves (fils ouverts en JSON le 01/10/2026)** :
  - **Watts & Weights** (22/09/2026) : appli de muscu **PWA**, IA (clé Anthropic de l'utilisateur), qui lit le wellness et la charge intervals et **écrit les séances de force faites** dans intervals avec une charge Foster ou TRIMP, `kg_lifted`, RPE ; planifie muscu et cardio ensemble. C'est, fonction par fonction, le plus proche de Charge Utile (côté athlète seul). https://forum.intervals.icu/t/watts-weights-a-hybrid-strength-cardio-app-built-on-top-of-intervals-icu/132550
  - **PacePartner** : coach IA branché sur intervals par OAuth ; « Strength Sync » en bêta depuis le 15/03/2026 (Hevy, Liftosaur) ; selon son auteur, génère des séances de force par chat et renvoie les séances faites dans intervals ; **fonctions coach en essai** depuis avril 2026, cherche des coachs de 2 à 10 athlètes (le profil exact de Nathan). https://forum.intervals.icu/t/tool-pacepartner-app-an-ai-coach-that-reads-your-intervals-icu-data-and-adapts-your-plan-o/123736 et message du 28/03/2026 dans https://forum.intervals.icu/t/integration-with-hevy/114887
  - **Trevo** : appli de coaching kettlebell / force + course, **appli OAuth approuvée** par intervals (27/09/2026). https://forum.intervals.icu/t/push-strength-exercises-exercise-reps-weight-to-garmin-in-planned-workouts/132623
  - **MyTrainPal** : assistant IA connecté à intervals ; suit les séances de force sur montre ou téléphone et affiche cible (charge/séries/RPE) contre réalisé (message de l'éditeur, 24/04/2026). https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015
  - **LOAD** (loadtraining.app, 31/08/2026) : tonnage Hevy + TRIMP en un seul chiffre de charge, ACWR. https://forum.intervals.icu/t/a-free-app-that-adds-strength-training-into-your-load-picture-tonnage-trimp-in-one-number/132161
  - **Ponts Hevy → intervals** : service hébergé icu.corentvn.dev (10 à 20 utilisateurs actifs déclarés le 01/07/2026) et outil libre Hevy2Intervals qui **estime la charge** à partir du tonnage ou du RPE (27/03/2026). Fil Hevy ci-dessus, messages 7, 27, 38.
- **Ce qui reste vrai** : aucun de ces outils ne réunit « coach humain qui prescrit + exécution guidée + remontée intervals » ; la plupart visent l'athlète seul ; tous sont jeunes (bêta, prototype). C'est d'ailleurs la conclusion de `03` (ligne 268).
- **Correction** : remplacer « n'est occupé par personne » par « est en train d'être investi par une dizaine de projets indépendants nés entre nov. 2025 et sept. 2026, tous orientés athlète seul et IA ; aucun ne combine coach humain + exécution guidée ». Ajouter une fiche « Applis tierces sur intervals.icu » (renvoi à `03`) et une ligne Watts & Weights + PacePartner dans la matrice et dans le tableau des menaces (rang 3 à 5 : même tuyau, même cible athlète, et PacePartner vise désormais les petits coachs). Retirer « Remontée automatique dans intervals.icu » de la liste « ce qu'aucun ne fait ».

### 2. [BLOQUANT] « Aucun outil de coach ne fait l'ajustement automatique » : faux

- **Où** : « En 1 minute » point 4 ; « Ce que CU fait qu'aucun ne fait » point 2.
- **Preuves** :
  - **CoachingPortal**, logiciel pour coachs de force : le client saisit les répétitions faites, le système en déduit la force et **fixe la charge de la séance suivante** ; le coach accepte, modifie ou bloque ; gratuit jusqu'à 3 clients. https://coachingportal.io/auto-periodization-software
  - **Volt Athletics**, fiché dans `01` lui-même (fiche 11) : vendu aux lycées et équipes (900 $/an pour 30 athlètes), avec « Smart Sets » qui ajustent la charge. C'est un outil de structure/coach : **contradiction interne**.
  - **BridgeAthletic** : `01` le note « ◐ annoncé ».
  - **Enode Pro** (fiche 4 de la partie 3) : outil pour préparateurs, recommandations de charge et mode RIR.
- **Ce qui reste défendable** : « ajustement **série par série** au RPE/RIR, dans un outil où un coach humain écrit la séance » n'a pas été trouvé. CoachingPortal ajuste d'une séance à l'autre, pas d'une série à l'autre.
- **Correction** : « L'ajustement automatique existe chez quelques outils de coach (Volt, CoachingPortal, annoncé chez BridgeAthletic), mais d'une séance à l'autre ; l'ajustement série par série dans un outil de coach n'a pas été trouvé. » Ajouter CoachingPortal au CSV.

### 3. [IMPORTANT] « Bips de tempo vus nulle part » : faux, et la preuve 10W2S est mal lue

- **Où** : « En 1 minute » point 5 ; fiche 10W2S.
- **Preuves** :
  - **StrengthTempo: Rep Timer** (App Store, lancée en mars 2025) : réglage de chaque phase (excentrique, pause, concentrique), **sons distincts par phase** et vibrations, « without staring at the screen ». https://apps.apple.com/us/app/strengthtempo-rep-timer/id6743028089
  - WebSearch renvoie aussi Tempo Coach, Tempo Training, Lifting Tempo (non ouverts, non cités).
  - **Contradiction interne** : la matrice met Ladder à « ◐ rythme audio ».
  - **10W2S** : l'avis (04/10/2023) reproche l'absence de **bip de fin de travail / début de repos** (minuteur), pas de bip de tempo. https://apps.apple.com/us/app/10w2s-strength-for-running/id1535607096 (avis rouvert : confirmé).
- **Correction** : « Des applis de métronome de tempo existent (StrengthTempo…), mais aucun **outil de coach ni outil d'endurance** étudié ne guide le tempo au son pendant une séance prescrite. » Corriger la lecture de l'avis 10W2S (« minuteur sonore », pas « tempo »).

### 4. [IMPORTANT] TrainingPeaks : « sync Garmin des séances de force » contredit la page officielle

- **Où** : fiche TrainingPeaks (partie 2), « Ce qu'il fait mieux que CU » et « Forces » ; matrice (« ◐ » Garmin implicite).
- **Preuve** : la page officielle Strength dit : « Strength workouts cannot be exported to 3rd party apps and devices ». https://www.trainingpeaks.com/strength/ (rouverte le 01/10/2026). La note de `sources.json` (`tp-strength-coachs`) le dit déjà.
- **Ce que la fiche confond** : un **fichier d'activité** Garmin peut se rattacher après coup à une séance de force (extrait d'aide non lu), mais la **séance prescrite** n'est pas envoyée à la montre.
- **Correction** : « Les séances de force ne partent pas vers la montre (page officielle) ; seul le fichier enregistré peut s'y rattacher (non vérifié). »

### 5. [IMPORTANT] Prix TrainingPeaks pour un coach : faux dans la matrice, absent ailleurs

- **Où** : matrice (« Premium 19,95 $/mois ; athlète Basic gratuit ») ; CSV (« coachs 149-359 $/mois (offres de coaching) ») ; fiche 25 (« prix non relevé »).
- **Preuves** :
  - Les offres Bronze / Silver / Gold (149 à 359 $/mois) sont des **services de coaching** achetés par l'athlète, pas un logiciel pour coach. https://www.trainingpeaks.com/pricing/
  - Le logiciel coach (« Coach Edition ») coûte **21,99 $/mois + 99 $ de frais d'ouverture**, avec 4 athlètes Basic et 1 Premium inclus ; chaque athlète Premium en plus coûte 9 $/mois (dégressif). https://www.trainingpeaks.com/pricing/for-coaches/
  - Pour Nathan (7 athlètes) : 4 Basic + 1 Premium ne suffisent pas, il faut passer à l'offre Unlimited ou payer des Premium. L'offre Unlimited (54,99 $/mois selon un résultat de recherche) n'est **pas affichée** sur la page ouverte : non vérifiée.
- **Correction** : matrice « coach 21,99 $/mois + 99 $ d'ouverture (4 Basic + 1 Premium) » ; CSV : séparer « logiciel coach » et « coaching acheté ». Le « Builder de force = Premium ou coach » doit aussi entrer dans le coût réel pour l'alternative n° 4 du point 7.

### 6. [IMPORTANT] Nolio : « aucun guidage d'exécution » trop fort

- **Où** : « En 1 minute » point 2 (« Aucun guidage d'exécution ni ajustement automatique n'a été trouvé ») ; matrice « ◐ vidéos » ; tableau des menaces (« Pas de guidage d'exécution »).
- **Preuve** : la page officielle décrit un **« player mobile »** pour exécuter la séance, avec **minuteurs de séries et de récupération**, vidéos, cibles kg/RPE/RIR. https://www.nolio.io/workout-builder/strength/coach/ (rouverte le 01/10/2026). Pas de son, pas d'ajustement auto, pas d'animation : ça, c'est confirmé.
- **Correction** : « Nolio a un lecteur mobile avec vidéos et minuteurs ; ni tempo sonore, ni ajustement automatique, ni animation trouvés. » Matrice : « ● vidéos + minuteurs ».
- **Aussi** : « grenoblois » (tableau des menaces) n'a pas de source citée. C'est exact (siège à Grenoble, issu de Grenoble INP, d'après une recherche web qui renvoie la page https://www.grenoble-inp.fr/fr/entreprises/nolio-simplifie-la-planification-des-entrainements-sportifs, non ouverte) : il suffit d'ajouter une source.

### 7. [IMPORTANT] Rachat Garmin : fait confirmé, conséquence présentée comme probable sans appui

- **Confirmé** : communiqué Garmin du 22/07/2026, rachat **réalisé** de TrainingPeaks et TrainHeroic, 120 salariés, **aucun détail d'intégration**. https://www.garmin.com/en-US/newsroom/press-release/corporate/garmin-acquires-trainingpeaks-and-trainheroic-leading-endurance-and-strength-training-platforms-for-athletes-and-coaches/ — TrainHeroic « 500,000 users and 10,000 coaches » : confirmé chez DC Rainmaker. https://www.dcrainmaker.com/2026/07/garmin-acquires-training-trainheroic.html
- **Problème** : « Dans 12 à 24 mois, une offre "endurance + force" Garmin est probable » et « la fenêtre se ferme » ne s'appuient sur rien. DC Rainmaker juge au contraire **« virtually zero chance »** d'une intégration native de TrainingPeaks dans Garmin Connect et s'attend à des intégrations de type partenariat ; TrainingPeaks promet de rester multiplateforme.
- **Correction** : présenter le scénario comme **hypothèse** de l'équipe, citer l'avis contraire de DC Rainmaker. Garder le rang n° 1 si on veut, mais sans « probable ».

### 8. [IMPORTANT] WHOOP : fonction en bêta, présentée comme acquise

- **Où** : « En 1 minute » point 3 ; fiche 23 ; « Preuves que la génération est banalisée » n° 1.
- **Preuve** : l'article (blog de fans, 22/02/2026) parle d'un déploiement **progressif**, lié à l'environnement **bêta** « Strength Trainer » ; pas de disponibilité générale annoncée. https://gadgetsandwearables.com/2026/02/22/whoop-ai-beta/
- **Correction** : « WHOOP teste en bêta (depuis février 2026) la génération… (source : blog non officiel) ». Fait confirmé sur le fond (texte ou capture d'écran → séance avec séries, reps, charges suggérées).

### 9. [IMPORTANT] intervals.icu (partie 4) : description datée de la muscu

- **Où** : `01`, partie 4 (« Aucun champ exercice / série / répétition », « appli mobile annoncée en 2026 »).
- **Preuves** :
  - Un champ « Weight Lifted » a été ajouté aux activités manuelles le 22/05/2026 (annonce sur le forum). https://forum.intervals.icu/t/weight-lifted-field/130121
  - Les **séries Garmin** (catégorie d'exercice, poids, répétitions) arrivent bien dans le fichier FIT reçu par intervals, mais intervals ne les affiche pas ; un utilisateur les affiche avec un graphique personnalisé (avril 2026). https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015
  - L'export de séances de force prévues vers Garmin perd exercices, reps et charges (« Go 0:40 ») : limite qui touche aussi le relais de Charge Utile. Fil Trevo, point 1.
  - « Plus de 160 000 athlètes » et « France 2e pays » : la page de prix rouverte n'en dit rien, et aucune clé n'est citée. **Non vérifié** ici : sourcer (`03` ?) ou retirer.
  - Prix : **Supporter 4 $/mois confirmé**. https://www.intervals.icu/pricing/
- **Correction** : « Pas de structure exercice/série native ; seulement un champ "kg soulevés" (mai 2026) ; les séries Garmin arrivent mais ne sont pas exploitées. » Renvoyer à `03` pour ne pas maintenir deux versions.

### 10. [IMPORTANT] Contradictions internes Strava / Garmin / Volt

- **Strava** : fiche 24 (« Faiblesses : … pas de musculation ») contredit fiche 11 (refonte force du 21/05/2026, confirmée : journal séries/reps/poids, cartes musculaires, 14 partenaires, plus de 500 millions d'envois de force en 2025). https://press.strava.com/articles/strava-overhauls-strength-experience-with-expanded-partner-ecosystem-new-workout-log-and-muscle-maps — Correction : « pas de prescription ni de séance guidée ».
- **Strava, prix** : CSV ligne « Strava (Athlete Intelligence) » dit « Strava seul non vérifié » alors que la ligne « Strava » donne 59,99 €/an vérifié ; le pack Strava + Runna vaut 149,99 $/an (communiqué de juillet 2025) dans une fiche et 139,99 €/an (page d'abonnement 2026) dans l'autre. Harmoniser sur la page d'abonnement, avec devise et date.
- **Garmin Connect+** : 8,99 €/mois (Clubic, 2025) dans une fiche, 6,99 $/mois (communiqué) dans l'autre, et « 6,99-8,99 /mois » **sans devise** dans la matrice. Écrire « 6,99 $ (US) / 8,99 € (FR), prix 2025 non revérifiés en 2026 ».
- **Garmin, fonctions** : fiche 22 (« pas de programmation de musculation mentionnée ») contredit fiche 20 (1 600 exercices, Fitness Coach avec séances de force). Fusionner.
- **Volt** : tableau des menaces (rang 8) : « Seul acteur de la force à proposer des programmes d'endurance » — faux d'après `01` lui-même (Runna, RideStrong, Dialed, StrengthApp, 10W2S). Correction : « seul à combiner programmes d'endurance et ajustement automatique ».

### 11. [IMPORTANT] « Workout Generator » IA de TrainingPeaks : source faible, présenté comme acquis

- **Où** : « En 1 minute » point 3 ; fiche 25 ; matrice (« ◐ endurance seulement »).
- **Problème** : la seule source est un extrait WebSearch d'un article d'aide intitulé « Structured Workout Builder » (page en 403, non lue). La page de prix rouverte ne mentionne **aucune IA** (https://www.trainingpeaks.com/pricing/). La fiche note elle-même la contradiction, mais le résumé l'efface.
- **Correction** : dans le résumé, « TrainingPeaks aurait un générateur texte → séance (aide non lue directement) ».

### 12. [MINEUR] Prix et paliers légèrement faux

- **Hevy Coach** : la page affiche une offre unique **dès 25 $/mois** pour **1 à 500 clients** (le prix suit le nombre de clients), essai 30 jours sans carte, Hevy Pro offert aux clients. `01` écrit « 1-10 clients, paliers jusqu'à 1 000 ». https://hevycoach.com/pricing/
- **Everfit** : Pro « dès 16 $ » est le prix **annuel** ; en mensuel c'est **19 $/mois** (5 clients). Gratuit ≤ 5 clients : confirmé. https://everfit.io/pricing/
- **TrainHeroic** : tous les paliers confirmés (9,99 $ → 399,99 $, 17,99 $ pour 5, essai 14 jours, coach assistant 9,99 $). https://www.trainheroic.com/pricing/
- **Nolio** : tous les prix confirmés (athlète 0 € / Premium 6,90 € ; coach 19,90 / 29,90 / 39,90 € ; club 29,90 / 49,90 €), force structurée dans toutes les offres payantes. https://www.nolio.io/en/pricing/
- **RideStrong** : 20 $/mois ou 200 $/an, **PWA confirmée** (« download to your homescreen »), rien sur RPE, tempo ni intégrations. https://www.everathlete.com/ridestrong
- **Dialed Health** : 30 $/mois ou 300 $/an, TrainingPeaks Premium inclus, tarif de lancement jusqu'au 01/01/2027, coaching 300 / 600 / 1 250 $, consultation 200 $ : confirmé. https://www.dialedhealth.com/pricing
- **Runna** : 19,99 $/mois ou 119,99 $/an : confirmé. La page de prix **ne parle pas de force** ; l'info force vient de l'aide, rouverte et confirmée (point 22). https://www.runna.com/pricing

### 13. [MINEUR] Comptage « 67 produits »

- Le CSV compte bien 67 lignes. Mais Garmin, Strava et TrainingPeaks ont aussi **deux fiches chacun** (pas seulement TrainingPeaks et TrainerRoad comme l'écrit l'introduction), et certains « produits » sont des contenus (Strength Running, Uphill Athlete) ou des services fermés (Today's Plan). Écrire « 67 lignes, environ 60 produits distincts ».

### 14. [MINEUR] Faits confirmés sans réserve

- **GitHub Pages** : la documentation interdit d'utiliser Pages pour un site « primarily directed at … providing commercial software as a service (SaaS) » ; 1 Go, 100 Go/mois. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits — confirmé.
- **Serveur MCP intervals** : 364 étoiles, GPL-3.0, création/modification/suppression d'événements au calendrier. Il ne gère pas spécifiquement la muscu. https://github.com/mvilanova/intervals-mcp-server — confirmé.

---

## `04-douleurs.md` : vérification des citations

### 15. Fidélité des citations : bonne (aucune erreur trouvée)

- **90 citations vérifiées** (bien plus que les 10 demandées), toutes **présentes mot pour mot** et toutes ≤ 15 mots :
  - 43 du forum intervals.icu, relues dans le JSON Discourse (`https://forum.intervals.icu/t/<id>.json`) : fils 114622, 113468, 68281, 90810, 115495, 56656, 125221, 114887, 130895, 130900, 132161, 685, 131079 (et 128015 pour les citations 89-90) ;
  - 35 du forum TrainerRoad (JSON Discourse) : fils 101664, 113784, 106095, 11808, 113435 ;
  - 6 de Slowtwitch (JSON Discourse) : fil 1281977 ;
  - 6 de vo2cycling (HTML), y compris les citations en français.
- Thèmes cohérents dans l'ensemble, à deux exceptions près (voir 15 bis).
- **Nuance** : « Unfortunately, Intervals isn't using that data… » (fil 128015, message 9) est une **citation d'un autre membre reprise** dans un message ; attribution « pratiquant » acceptable, mais ce n'est pas l'auteur du message.

### 15 bis. [IMPORTANT] Citations mal classées, dont une qui gonfle le thème coach (T2)

- « I like the accountability of having sessions in the TR calendar » (TrainerRoad 113435, message 11, 07/05/2026) est classée **T2 « le coach ne sait pas si c'est fait »**. Dans le message, l'auteur parle de **son propre engagement** : une séance inscrite au calendrier, il la fait plus volontiers. Aucun coach en jeu. https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435
  - Correction : la passer en T8 ou T12. **T2 tombe à 4 citations en thème principal**, ce qui renforce le verdict « non démontré ».
- « scribbling sets and reps like I'm doing math homework in the squat rack » (TrainerRoad 101664, message 18, 19/01/2026) vient d'un message qui fait **l'éloge de PT Distinction**, au ton publicitaire. `04` le signale (« ton promotionnel possible »), mais la citation est quand même comptée comme douleur T5. Correction : la retirer du comptage.
- « The main downside is it is $39/month » (101664, message 16) : prix de **Peak Strength** (Garage Strength), une appli de force qui propose un plan pour le sprint en cyclisme. C'est un concurrent, absent de `01` (voir 18).

### 16. [IMPORTANT] Citations datées présentées comme douleurs actuelles

- **Où** : T1, T4, T2 (citations TrainingPeaks UserVoice de 2015 à 2018).
- **Problème** : les citations du fil UserVoice « bring back functionality of strength workouts » (4 en T4 datées 2015-2017, 1 en T2 de 2015, 1 en T1 de 2018) visent l'**ancien** outil de force de TrainingPeaks. Le Strength Builder est sorti le 25/07/2024 et l'idée voisine « strength training interface » est marquée « Completed » (mai 2024, selon `04` lui-même). Ces 6 citations décrivent donc un problème **en grande partie réglé**. Même chose pour le fil TrainerRoad « Adding weights to weekly TSS » : les 5 citations datent de **2019**, avant la saisie des « Working Sets » (juillet 2024). Le fil intervals 685 (2020-2023) est titré « [SOLVED] ».
- **Correction** : ajouter une colonne « année » et refaire les totaux sur 2024-2026 seulement, ou au moins signaler les citations d'avant 2024 (environ 15 sur 189 rien que pour ces trois fils).

### 17. [IMPORTANT] Le côté coach : « aucune citation » un peu trop fort

- **Où** : « Ce que ça veut dire » point 4 ; verdict.
- **Preuves** : le coach de juniors (fil 113468, 10/10/2025) veut un enregistrement de la muscu « palatable to juniors » pour avoir « all their work in one place » ; un coach (fil 128015, message 3, 24/04/2026) souhaite centraliser la **prescription** de force dans intervals.
- **Correction** : ce n'est toujours pas « je ne sais pas s'ils la font », donc le verdict « non démontré » tient. Mais écrire « 2 coachs d'endurance demandent un suivi centralisé de la muscu de leurs athlètes », plutôt que « aucune citation ».

### 18. [IMPORTANT] Concurrents nommés dans `04` mais absents de `01`

- **Peak Strength** (Garage Strength) : 32 sports, **charges recommandées en temps réel selon la performance**, iOS et Android, prix non affiché sur le site (39 $/mois selon un utilisateur TrainerRoad, mars 2025). Un utilisateur y suit un plan de sprint cycliste. Absente de `01`, alors que c'est à la fois une « force pour cyclistes » et un ajustement automatique. https://peakstrength.app
- **Tonal** (salle connectée qui règle la charge électroniquement) : absente de `01`, alors que c'est un « ajustement automatique » très connu.
- **LOAD** (citations T6 du fil 132161) : citée comme source de douleur, absente de `01` (cf. problème 1).

### 19. [IMPORTANT] Trous de collecte (déjà signalés en partie, à souligner)

- Reddit (r/Velo, r/MTB, r/trailrunning, r/AdvancedRunning), lieu principal des discussions des 18-25 ans, est **absent** (403). Les forums français se limitent à 2 fils, dont un d'environ 2009-2010.
- Aucun avis App Store sur la partie force de Nolio, TrainingPeaks Strength ou Garmin, alors que ce sont les vrais concurrents.
- 88 % des citations viennent d'athlètes : le pourcentage est donné sur les « plaintes » alors qu'il inclut les 19 contre-preuves (T12), qui ne sont pas des plaintes. Écrire « des citations ».

---

## Vérifications complémentaires

### 20. [IMPORTANT] « Mobilité mesurée au capteur du téléphone : vue nulle part » : trop fort

- **Où** : « En 1 minute » point 5 ; « Ce que CU fait qu'aucun ne fait » point 4.
- **Preuves** :
  - Des applis d'inclinomètre sur smartphone mesurent l'amplitude articulaire et ont été validées : Clinometer, validité excellente pour hanche et genou (r > 0,90), moyenne pour la cheville (Montenegrin Journal of Sports Science and Medicine, 2021). https://www.mjssm.me/?sekcija=article&artid=222
  - **Yogger** mesure l'amplitude de la hanche, du genou, de la cheville, de l'épaule… par la **caméra** du téléphone, avec rapports PDF pour coachs de force ; abonnements de 9,99 à 74,99 $/mois. https://apps.apple.com/us/app/yogger-movement-analysis/id1576592816
- **Ce qui reste vrai** : aucun **outil de coach d'endurance** étudié n'intègre un test de mobilité au capteur dans le suivi de l'athlète.
- **Correction** : « La mesure de mobilité au téléphone existe (inclinomètres, Yogger) ; ce qui est rare, c'est de l'intégrer au suivi coach-athlète d'endurance. »

### 21. [IMPORTANT] Concurrents français oubliés : course et trail

`01` ne fiche aucun outil français grand public de course et trail, alors que Charge Utile vise aussi le trail.

- **Kiprun Pacer** (Decathlon) : **gratuit, sans publicité**, plans trail jusqu'à plus de 120 km, séances de **renforcement musculaire** dans les plans ; 4,7/5 sur 19 000 notes (App Store FR). https://apps.apple.com/fr/app/kiprun-pacer-courir-running/id1597264549
- **Campus Coach** : 19 €/mois ou 149 €/an, plans trail et ultra conçus par Mathieu Blanchard, séances de renfo « ciblées et avec exemple vidéo » selon un avis ; 4,8/5 sur plus de 4 400 avis. https://apps.apple.com/fr/app/running-trail-campus-coach/id6446962176
- **RunMotion Coach** (Alpes) : cité par une recherche web, non ouvert.
- **Correction** : ajouter Kiprun Pacer et Campus Coach (catégorie « force pour endurants, B2C, FR »). Kiprun Pacer, gratuit et adossé à Decathlon, est le vrai « gratuit » face auquel un traileur jugera Charge Utile.

### 22. [MINEUR] Autres faits rouverts : confirmés

- **Ladder** : 29,99 $/mois ou 179,99 $/an, « in-ear coaching » et « precise pacing built-in ». Confirme la case « ◐ rythme audio » de la matrice (et contredit « bips de tempo vus nulle part », point 3). https://www.joinladder.com/pricing
- **Strava** : 59,99 €/an, famille 99,99 €/an, étudiant 29,99 €/an, Strava + Runna 139,99 €/an. https://www.strava.com/subscribe
- **Runna (aide force)** : 3 niveaux, matériel, 30/45/60 min, jusqu'à 4 séances/sem, animations, journal reps/poids, synchro Strava mais **pas les montres**, aucune progression automatique ni RPE décrits. Fiche exacte. https://support.runna.com/en/articles/15624879-adding-strength-training-to-your-runna-plan
- **intervals.icu** : « 160,000+ Active Athletes » sur la page d'accueil : **confirmé** (mais `01` ne cite pas la source : ajouter https://intervals.icu/). « France 2e pays » : non vérifié ici.
- **Hevy → Strava** et **ponts Hevy → intervals** : confirmés (fil Hevy, voir point 1).

### 23. Synthèse des 26 affirmations factuelles rouvertes

| # | Affirmation | Verdict | URL ouverte |
|---|---|---|---|
| 1 | Garmin rachète TrainingPeaks + TrainHeroic le 22/07/2026 | Confirmé (rachat conclu, aucune intégration annoncée) | garmin.com (communiqué) |
| 2 | TrainHeroic : 500 000 utilisateurs, 10 000 coachs | Confirmé (DC Rainmaker) | dcrainmaker.com |
| 3 | « Offre endurance + force Garmin probable dans 12-24 mois » | Non étayé ; DC Rainmaker dit l'inverse | dcrainmaker.com |
| 4 | Nolio coach 19,90-39,90 €/mois, athlète gratuit | Confirmé | nolio.io/en/pricing |
| 5 | Nolio : pas de guidage d'exécution | Faux (lecteur mobile + minuteurs) | nolio.io/workout-builder/strength/coach |
| 6 | Hevy Coach 25 $/mois, clients gratuits | Confirmé ; paliers mal décrits (1-500 clients) | hevycoach.com/pricing |
| 7 | Everfit gratuit ≤ 5 clients ; Pro dès 16 $ | Confirmé ; 16 $ = annuel, 19 $ en mensuel | everfit.io/pricing |
| 8 | TrainHeroic 17,99 $ pour 5 athlètes | Confirmé | trainheroic.com/pricing |
| 9 | TrainingPeaks Premium 19,95 $/mois | Confirmé, mais c'est le prix **athlète**, pas coach | trainingpeaks.com/pricing |
| 10 | Prix coach TrainingPeaks | Absent de `01` : 21,99 $/mois + 99 $ | trainingpeaks.com/pricing/for-coaches |
| 11 | TrainingPeaks synchronise les séances de force avec Garmin | Faux (« cannot be exported to 3rd party … devices ») | trainingpeaks.com/strength |
| 12 | RideStrong 20 $/mois, PWA | Confirmé | everathlete.com/ridestrong |
| 13 | Dialed Health 30 $/mois via TrainingPeaks | Confirmé | dialedhealth.com/pricing |
| 14 | Runna 19,99 $/mois | Confirmé | runna.com/pricing |
| 15 | intervals.icu Supporter 4 $/mois | Confirmé | intervals.icu/pricing |
| 16 | intervals.icu : 160 000+ athlètes | Confirmé (non sourcé dans `01`) | intervals.icu |
| 17 | « Aucun outil de coach ne fait l'ajustement auto » | Faux (CoachingPortal, Volt) | coachingportal.io |
| 18 | « Bips de tempo vus nulle part » | Faux (StrengthTempo ; Ladder « pacing ») | apps.apple.com (StrengthTempo), joinladder.com |
| 19 | Avis 10W2S « absence de repères sonores » | Confirmé, mais vise le minuteur, pas le tempo | apps.apple.com (10W2S) |
| 20 | « Aucun des 18 n'envoie vers intervals.icu » / créneau vide | Vrai pour les 18, faux pour le marché (Watts & Weights, PacePartner, Trevo, ponts Hevy) | forum.intervals.icu (132550, 123736, 132623, 114887) |
| 21 | WHOOP génère des séances de muscu par IA depuis février 2026 | Confirmé **en bêta**, déploiement progressif | gadgetsandwearables.com |
| 22 | Strava refonte force le 21/05/2026, 14 partenaires | Confirmé | press.strava.com |
| 23 | Serveur MCP intervals, 364 étoiles, GPL-3.0 | Confirmé | github.com/mvilanova |
| 24 | GitHub Pages interdit pour un SaaS commercial | Confirmé | docs.github.com |
| 25 | intervals.icu : aucun champ muscu | Partiellement faux (champ « Weight Lifted » depuis le 22/05/2026) | forum.intervals.icu/t/130121 |
| 26 | Mobilité au capteur du téléphone vue nulle part | Faux (Clinometer, Yogger) | mjssm.me, apps.apple.com (Yogger) |

**Bilan** : 17 confirmés (dont 6 avec une réserve), 6 faux, 3 non étayés, absents ou partiels. Les prix sont fiables ; les affirmations d'exclusivité (« personne », « nulle part », « aucun ») sont le point faible du livrable.

### 24. Corrections prioritaires (dans l'ordre)

1. Réécrire les points 2, 4 et 5 de « En 1 minute » et la liste « Ce que CU fait qu'aucun ne fait » (problèmes 1, 2, 3, 20).
2. Aligner `01` sur `03` pour l'écosystème intervals.icu, et ajouter Watts & Weights, PacePartner, CoachingPortal, Peak Strength, Kiprun Pacer et Campus Coach au CSV.
3. Corriger TrainingPeaks : pas d'envoi des séances de force vers la montre, prix coach réel (problèmes 4 et 5).
4. Marquer WHOOP « bêta » et le scénario Garmin « hypothèse » (problèmes 7 et 8).
5. Dans `04` : dater les citations, reclasser la citation « accountability », sortir la citation publicitaire, refaire les totaux (problèmes 15 bis et 16).

## Sources vérifiées

Nouvelles pages ouvertes pendant cette revue, absentes de `sources.json`. Les autres pages rouvertes (prix Garmin, Nolio, Hevy Coach, Everfit, TrainHeroic, TrainingPeaks, RideStrong, Dialed, Runna, intervals.icu, Strava, Ladder, WHOOP, MCP, GitHub Pages, fils intervals.icu / TrainerRoad / Slowtwitch / vo2cycling) y figurent déjà.

```json
[
 {
  "cle": "coachingportal-autoperiodisation",
  "auteurs": "CoachingPortal",
  "annee": 2026,
  "titre": "Auto-Periodization Software for Strength & Fitness Coaches",
  "revue": "site officiel",
  "doi": null,
  "url": "https://coachingportal.io/auto-periodization-software",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Outil de coach : la charge de la séance suivante est fixée à partir des reps saisies par le client, le coach peut accepter ou modifier ; gratuit jusqu'à 3 clients (lu le 01/10/2026)."
 },
 {
  "cle": "strengthtempo-appstore",
  "auteurs": "StrengthTempo",
  "annee": 2026,
  "titre": "StrengthTempo: Rep Timer",
  "revue": "App Store US",
  "doi": null,
  "url": "https://apps.apple.com/us/app/strengthtempo-rep-timer/id6743028089",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Minuteur de tempo par phase (excentrique, pause, concentrique) avec sons distincts et vibrations ; 3,99 $/mois à 79,99 $ à vie ; lancé en mars 2025."
 },
 {
  "cle": "forum-intervals-weight-lifted-field",
  "auteurs": "forum intervals.icu",
  "annee": 2026,
  "titre": "Weight Lifted Field",
  "revue": "forum",
  "doi": null,
  "url": "https://forum.intervals.icu/t/weight-lifted-field/130121",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "22/05/2026 : ajout d'un champ « Weight Lifted » aux activités manuelles ; les utilisateurs réclament exercices, séries et reps (lu en JSON)."
 },
 {
  "cle": "peakstrength-site",
  "auteurs": "Peak Strength (Garage Strength)",
  "annee": 2026,
  "titre": "Peak Strength app",
  "revue": "site officiel",
  "doi": null,
  "url": "https://peakstrength.app",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Appli de force par sport (32 sports), charges recommandées en temps réel selon la performance, iOS et Android ; prix non affiché."
 },
 {
  "cle": "clinometer-mjssm-2021",
  "auteurs": "Montenegrin Journal of Sports Science and Medicine",
  "annee": 2021,
  "titre": "Validity and Reliability of a Smartphone and Digital Inclinometer in Measuring the Lower Extremity Joints Range of Motion",
  "revue": "Montenegrin Journal of Sports Science and Medicine",
  "doi": null,
  "url": "https://www.mjssm.me/?sekcija=article&artid=222",
  "type": "article",
  "niveau": "B",
  "verifie": true,
  "note": "Appli Clinometer : validité excellente pour hanche et genou (r > 0,90), moyenne pour la cheville ; preuve que la mobilité au capteur du téléphone existe ailleurs."
 },
 {
  "cle": "yogger-appstore",
  "auteurs": "Yogger",
  "annee": 2026,
  "titre": "Yogger: Movement Analysis",
  "revue": "App Store US",
  "doi": null,
  "url": "https://apps.apple.com/us/app/yogger-movement-analysis/id1576592816",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Amplitudes articulaires mesurées par la caméra du téléphone, rapports pour coachs de force ; 9,99 à 74,99 $/mois."
 },
 {
  "cle": "kiprun-pacer-appstore",
  "auteurs": "Decathlon",
  "annee": 2026,
  "titre": "Kiprun Pacer Courir Running",
  "revue": "App Store FR",
  "doi": null,
  "url": "https://apps.apple.com/fr/app/kiprun-pacer-courir-running/id1597264549",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Gratuit sans publicité, plans trail jusqu'à plus de 120 km avec renforcement musculaire ; 4,7/5 sur 19 000 notes."
 },
 {
  "cle": "campus-coach-appstore",
  "auteurs": "Campus Coach",
  "annee": 2026,
  "titre": "Running & Trail - Campus Coach",
  "revue": "App Store FR",
  "doi": null,
  "url": "https://apps.apple.com/fr/app/running-trail-campus-coach/id6446962176",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "19 €/mois ou 149 €/an ; plans trail et ultra, séances de renfo avec vidéos ; 4,8/5 sur plus de 4 400 avis."
 }
]
```
