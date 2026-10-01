# 01 — Concurrence : 74 lignes, environ 66 produits passés au crible

*Collecte du 30 septembre 2026 (3 sous-agents), relue par un contradicteur le 1er octobre 2026 (26 faits rouverts : 17 confirmés, 6 faux, 3 non étayés, tous corrigés ci-dessous ; détail dans `_brut/revue-01-04.md`). Prix relevés sur les pages officielles le 30/09 ou le 01/10/2026, sauf mention contraire. Tableau complet : `concurrents.csv` (74 lignes ; Garmin, Strava, TrainingPeaks et TrainerRoad ont deux lignes, une par angle ; quelques lignes sont des contenus ou des services fermés). Fiches détaillées plus bas. Sources brutes : `_brut/concurrence-*.md`.*

> Légende des verdicts : « non trouvé » veut dire « absent des pages ouvertes », pas « n'existe pas ». La relecture a montré que les affirmations d'exclusivité (« personne », « nulle part ») étaient notre point faible. Elles sont désormais formulées au plus juste.

## En 1 minute

1. **Le fait majeur : le 22 juillet 2026, Garmin a racheté TrainingPeaks et TrainHeroic** [@garmin-rachat-trainingpeaks-trainheroic] [@dcrainmaker-garmin-tp].
   - Garmin réunit ainsi le leader de la planification d'endurance, un acteur majeur de la muscu coachée (TrainHeroic : environ 500 000 utilisateurs et 10 000 coachs selon DC Rainmaker) et le premier fabricant de montres pour cyclistes et coureurs.
   - **Aucune intégration n'est annoncée.** DC Rainmaker juge **quasi nulle** la probabilité d'une intégration native de TrainingPeaks dans Garmin Connect et attend plutôt des partenariats ; TrainingPeaks promet de rester multiplateforme.
   - Notre hypothèse (pas un fait) : à terme, une offre « endurance + force » plus intégrée chez Garmin réduirait l'espace de Charge Utile. **À surveiller, sans en faire une certitude.**
2. **Le créneau « muscu + intervals.icu » est en train d'être investi**, mais **personne ne combine coach humain + exécution guidée + remontée dans la plateforme d'endurance.**
   - Parmi les 18 logiciels de force étudiés, aucun n'envoie vers intervals.icu ; un seul (BridgeAthletic) annonce TrainingPeaks.
   - **Mais une dizaine de projets indépendants sont nés sur intervals.icu entre novembre 2025 et septembre 2026**, tous jeunes (bêta, prototype) et orientés athlète seul + IA :
     - **Watts & Weights** : PWA de muscu qui écrit les séances faites dans intervals avec une charge de Foster ou TRIMP [@forum-watts-weights] ;
     - **PacePartner** : coach IA en OAuth, synchro force en bêta, **fonctions coach en essai pour des coachs de 2 à 10 athlètes**, le profil exact de Nathan [@forum-pacepartner] ;
     - Trevo, MyTrainPal, LOAD, ponts Hevy → intervals [@intervals-hevy-integration]. Voir `03-intervals-ecosysteme.md`.
   - Les plateformes d'endurance ont un constructeur de séances de force avec vidéos (TrainingPeaks Strength [@tp-strength-coachs], qui **n'exporte pas vers les montres**) ; **Nolio a même un lecteur mobile avec vidéos et minuteurs** [@nolio-strength-builder]. Ni tempo sonore, ni ajustement automatique, ni animation n'ont été trouvés chez eux.
3. **Ce qui n'est plus un avantage : écrire une séance par IA.**
   - Trainerize (dès 9 $/mois), Everfit, PT Distinction, My PT Hub, CoachRx, BridgeAthletic et PacePartner le font.
   - WHOOP le **teste en bêta** depuis février 2026 [@whoop-ia-muscu-2026] ; TrainingPeaks **aurait** un générateur texte → séance (page d'aide non lue directement).
   - N'importe quel coach peut brancher Claude ou ChatGPT sur intervals.icu avec un serveur MCP libre [@intervals-mcp-github].
   - La dictée vocale d'une séance n'a été vue nulle part, mais c'est une interface, pas une barrière.
4. **L'ajustement automatique de la charge existe, y compris dans des outils de coach.**
   - Pour l'athlète seul : Volt, JuggernautAI, RP Hypertrophy, Alpha Progression, Enode, Peak Strength [@peakstrength-site].
   - Dans des outils de coach : **CoachingPortal** (charge de la séance suivante calculée, le coach accepte ou modifie) [@coachingportal-autoperiodisation] ; **Volt** (équipes et lycées) ; BridgeAthletic (annoncé). L'ajustement s'y fait **d'une séance à l'autre**.
   - Ce qui n'a pas été trouvé : **l'ajustement série par série au RPE/RIR dans un outil où un coach humain écrit la séance**. C'est le seul énoncé défendable.
5. **Ce qui est rare (pas unique)** :
   - **Le tempo guidé au son** : des métronomes de tempo existent (StrengthTempo [@strengthtempo-appstore]) et Ladder guide le rythme à l'oreille. Mais **aucun outil de coach ni outil d'endurance étudié** ne guide le tempo au son pendant une séance prescrite.
   - **L'accès sans compte athlète** : aucun des concurrents étudiés.
   - **La mobilité mesurée au téléphone** : elle existe (inclinomètres validés comme Clinometer [@clinometer-mjssm-2021], analyse caméra Yogger [@yogger-appstore]) ; ce qui est rare, c'est de **l'intégrer au suivi coach-athlète d'endurance**.
   - **La proprio en 4 niveaux auto-ajustés** : pas vue ailleurs.
6. **Là où Charge Utile perd, franchement** :
   - 190 exercices animés à la main, contre 200 à 3 000 vidéos réelles ailleurs ;
   - pas d'application native, pas de synchro montre, pas de fréquence cardiaque pendant la séance ;
   - un seul développeur, aucune marque, pas de paiement, pas de messagerie ;
   - il faut un coach qui dicte, sans programme prêt à l'emploi pour un athlète seul ;
   - un hébergement sur GitHub Pages **interdit pour un SaaS commercial** [@github-pages-limites].
7. **Pour un coach qui veut « un outil qui marche demain »** :
   - **Nolio** : français, 19,90-39,90 €/mois pour le coach, gratuit pour l'athlète, constructeur de force avec vidéos, minuteurs, RPE/RIR/%1RM [@nolio-prix] ;
   - **Hevy Coach** : dès 25 $/mois, 1 à 500 clients, Hevy Pro offert aux clients [@hevycoach-prix] ;
   - **Everfit** : gratuit jusqu'à 5 clients, Pro à 19 $/mois en mensuel [@everfit-prix] ;
   - **TrainingPeaks** Coach Edition : 21,99 $/mois + 99 $ d'ouverture, 4 athlètes Basic + 1 Premium inclus, puis 9 $ par athlète Premium [@trainingpeaks-prix-coach].

   Pour un athlète seul :
   - VTT ou route : **RideStrong** (20 $/mois, PWA) [@ridestrong-page], **Dialed Health** (30 $/mois, via TrainingPeaks) [@dialed-prix] ;
   - trail en France : **Kiprun Pacer** (Decathlon, gratuit, renforcement inclus dans les plans) [@kiprun-pacer-appstore] et **Campus Coach** (19 €/mois, plans trail avec renfo en vidéo) [@campus-coach-appstore]. **Kiprun Pacer est le vrai « gratuit » face auquel un traileur jugera Charge Utile.**

## Les concurrents par menace

| Rang | Produit | Pourquoi c'est une menace | Ce qui le retient |
|---|---|---|---|
| 1 | **Nolio** | Français, gratuit pour l'athlète, constructeur de force avec vidéos, minuteurs, RPE/RIR/%1RM et lecteur mobile, déjà chez plus de 4 500 coachs revendiqués | Pas de tempo sonore, pas d'ajustement automatique trouvé, pas de lien intervals |
| 2 | **Garmin (TrainingPeaks + TrainHeroic + Connect+)** | Montre, plateforme d'endurance, muscu coachée et 1 600+ exercices animés sur la montre sous un même toit ; « charge de force » testée par sondage en avril 2026 | Aucune intégration annoncée, DC Rainmaker sceptique ; TrainingPeaks Strength n'exporte pas vers les montres |
| 3 | **PacePartner / Watts & Weights** (et la vague d'applis sur intervals) | Même tuyau (intervals.icu), même public, IA ; PacePartner teste des fonctions pour **petits coachs** | Jeunes, en bêta ; orientés athlète seul ; pas d'exécution guidée |
| 4 | **TrainingPeaks Strength** | 1 000+ vidéos, standard des coachs d'endurance | TSS muscu manuel, pas d'export vers les montres, plaintes de coachs (Evoke 2024) [@evoke-tp-strength-builder] |
| 5 | **Strava + Runna** | Audience énorme ; journal de force refait le 21/05/2026 (séries, reps, poids, cartes musculaires, 14 partenaires) [@strava-force-2026] ; muscu dans Runna [@runna-aide-force] | Pas de prescription ni de séance guidée côté Strava ; Runna générique, sans RPE |
| 6 | **Kiprun Pacer / Campus Coach** (trail, France) | Gratuit (Decathlon) ou 19 €/mois ; renfo intégré aux plans trail ; très bien notés | Renfo générique, pas de coach, pas de guidage fin |
| 7 | **LLM + MCP intervals.icu** | Gratuit ; un coach technophile peut « dicter » à Claude ou ChatGPT et écrire dans intervals | Pas d'exécution guidée, rien côté athlète |
| 8 | **Hevy / Hevy Coach** | Carnet préféré des endurants « data » ; ponts communautaires vers intervals | Refus d'accès de Garmin, pas d'endurance, pas de guidage |
| 9 | **RideStrong, Dialed Health, 10W2S, StrengthApp, Peak Strength** | « La force pour cyclistes et coureurs » vendue à l'athlète 7-39 $/mois | Programmes figés ou génériques, pas de coach, pas de lien de charge |
| 10 | **Volt, CoachingPortal** | Ajustement automatique d'une séance à l'autre, pour des structures ou des coachs | Pas d'endurance réelle (Volt : programmes génériques), pas de VTT |

## Matrice fonctions × produits

Légende : ● oui (constaté) · ◐ partiel, annoncé, en bêta ou indirect · ○ non trouvé · ? non vérifié. « Ajust. auto série » = la charge de la série suivante change automatiquement selon le ressenti, **dans la même séance**.

| Produit | Coach prescrit la muscu | Séance guidée (vidéo/anim.) | Tempo guidé au son | Ajust. auto série par série | Ajust. auto séance à séance | IA crée la séance | Sans compte athlète | Hors-ligne | Proprio à niveaux | Mobilité au téléphone | Vers intervals.icu | Vers TrainingPeaks | Muscu dans la charge d'endurance | Pensé endurance | Prix d'entrée 2026 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Charge Utile** | ● (dictée) | ● anim. 3D | ● | ● RPE/RIR | ◐ (charges en % du max) | ● (Claude) | ● | ● | ● | ● capteur | ● relais | ○ | ◐ (RPE × durée) | ● VTT/route/trail | 0 (non vendu) |
| TrainingPeaks (+ Strength) | ● | ◐ vidéos, saisie | ○ | ○ | ○ | ◐ endurance (non vérifié) | ○ | ? | ○ | ○ | ○ | ● | ◐ TSS manuel | ● | coach 21,99 $/mois + 99 $ ; athlète Premium 19,95 $/mois |
| Nolio | ● | ● vidéos + minuteurs | ○ | ○ | ○ | ? | ○ | ? | ○ | ○ | ○ | ○ | ? | ● | coach 19,90-39,90 €/mois |
| intervals.icu | ◐ (texte) | ○ | ○ | ○ | ○ | ○ (via MCP tiers) | ○ | ○ | ○ | ○ | — | ○ | ◐ RPE/durée, « kg soulevés » | ● | gratuit ; soutien 4 $/mois |
| Watts & Weights | ○ (IA) | ? | ? | ? | ◐ | ● | ? | ● PWA | ○ | ○ | ● | ○ | ● Foster/TRIMP | ● | prototype |
| PacePartner | ◐ coachs en essai | ? | ○ | ? | ? | ● | ○ | ? | ○ | ○ | ● OAuth | ○ | ◐ | ● | non vérifié |
| TrainHeroic | ● | ● vidéos | ○ | ○ | ○ | ○ | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | 17,99 $/mois (5 ath.) |
| TrueCoach | ● | ● vidéos | ○ | ○ | ○ | ○ | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | 26,34 $/mois |
| Everfit | ● | ● vidéos | ○ | ○ | ○ | ● | ○ | ● | ○ | ○ | ○ | ○ | ○ | ○ | 0 $ (≤ 5 clients) |
| ABC Trainerize | ● | ● vidéos | ○ | ○ | ○ | ● | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | 9 $/mois (2 clients) |
| CoachingPortal | ● | ? | ○ | ○ | ● | ? | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | gratuit ≤ 3 clients |
| BridgeAthletic | ● | ● vidéos | ○ | ○ | ◐ annoncé | ● bêta | ○ | ? | ○ | ○ | ○ | ◐ annoncé | ○ | ○ | 49 $/mois |
| Hevy Coach | ● | ● vidéos | ○ | ○ | ○ | ○ | ○ | ● | ○ | ○ | ◐ ponts tiers | ○ | ○ | ○ | dès 25 $/mois |
| Volt Athletics | ◐ équipes | ● vidéos | ○ | ? | ● | ◐ | ○ | ? | ○ | ○ | ○ | ○ | ○ | ◐ générique | 19,99 $/mois ; 900 $/an équipe |
| JuggernautAI | ○ (IA) | ● | ○ | ? | ● RPE/RIR | ● | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | 34,99 $/mois |
| Alpha Progression | ○ (IA) | ● 795 vidéos | ○ | ● | ● | ● | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | 12,99 $/mois |
| Peak Strength | ○ (programmes) | ● | ? | ● « temps réel » | ● | ? | ○ | ? | ○ | ○ | ○ | ○ | ○ | ◐ (sprint vélo) | ~39 $/mois (selon un utilisateur) |
| Ladder | ○ (programmes) | ● audio + vidéo | ◐ rythme à l'oreille | ○ | ○ | ○ | ○ | ? | ○ | ○ | ○ | ○ | ○ | ○ | 29,99 $/mois |
| StrengthTempo | ○ | ○ | ● (métronome) | ○ | ○ | ○ | ? | ● | ○ | ○ | ○ | ○ | ○ | ○ | App Store |
| Strong / Hevy | ○ (carnet) | ◐ | ○ | ○ | ○ | ○ | ○ | ● | ○ | ○ | ◐ ponts | ○ | ○ | ○ | 0-4,99 $/mois |
| Runna | ○ (auto) | ● anim. | ○ | ○ | ○ | ● | ○ | ? | ○ | ○ | ○ | ○ | ? | ● course | 19,99 $/mois |
| Kiprun Pacer | ○ (plans) | ? | ○ | ○ | ○ | ◐ | ○ | ? | ○ | ○ | ○ | ○ | ○ | ● course/trail | gratuit |
| Campus Coach | ○ (plans) | ● vidéo (selon un avis) | ○ | ○ | ○ | ? | ○ | ? | ○ | ○ | ○ | ○ | ○ | ● course/trail | 19 €/mois ; 149 €/an |
| RideStrong | ○ (programmes) | ● vidéos | ○ | ○ | ○ | ○ | ○ | ? | ○ | ○ | ○ | ○ | ○ | ● vélo | 20 $/mois |
| Dialed Health | ○ (programmes) | ● vidéos (via TP) | ○ | ○ | ○ | ○ | ○ | ? | ○ | ○ | ○ | ● | ◐ via TP | ● vélo | 30 $/mois |
| TrainerRoad | ○ | ○ | ○ | ○ | ○ | ● (vélo) | ○ | ● | ○ | ○ | ○ | ○ | ● (séries saisies → IA vélo) | ● vélo | 21,99 $/mois |
| Garmin (Connect / Connect+) | ◐ | ● anim. sur la montre, reps auto | ○ | ○ | ○ | ● (Connect+) | ○ | ● | ○ | ○ | ◐ activité | ◐ | ◐ en test | ● | Connect+ 6,99 $ (US) / 8,99 € (FR), prix 2025 |
| WHOOP | ○ (IA) | ◐ | ○ | ○ | ○ | ◐ bêta | ○ | ? | ○ | ○ | ○ | ○ | ● (strain) | ◐ | 199 $/an |
| Strava | ○ | ○ (journal) | ○ | ○ | ○ | ◐ analyse | ○ | ? | ○ | ○ | ◐ | ◐ | ? | ● | 59,99 €/an |
| Yogger | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ? | ○ | ● caméra | ○ | ○ | ○ | ○ | 9,99-74,99 $/mois |
| ThePerfClub (FR) | ◐ | ◐ | ○ | ○ | ◐ séance du jour (bien-être) | ? | ○ | ? | ○ | ○ | ○ | ○ | ● ACWR | ◐ | 78 €/an |
| Enode | ◐ | ◐ | ○ | ● (VBT/RIR) | ● | ◐ | ○ | ? | ○ | ◐ capteur 329 € | ○ | ○ | ○ | ○ | capteur 329 € |
| LLM + MCP intervals | ● (texte) | ○ | ○ | ○ | ○ | ● | — | ○ | ○ | ○ | ● | ◐ non officiel | ○ | ◐ | abonnement LLM |

**Lecture** :
- La ligne Charge Utile est la seule à réunir à la fois les colonnes « coach prescrit », « séance guidée », « tempo au son », « ajustement série par série » et « vers intervals.icu ». **Chaque colonne prise seule existe ailleurs** : c'est la **combinaison** qui est rare, pas une fonction.
- Elle est vide ou faible là où l'argent se gagne aujourd'hui : applis natives, montres, TrainingPeaks, bibliothèque vidéo, paiement.
- **L'avantage est réel mais étroit, et copiable** (voir `05-positionnement.md`).

## Ce que chaque groupe fait mieux que Charge Utile, en une phrase

- **Logiciels de coaching force** (TrainHeroic, TrueCoach, Everfit, Trainerize, CoachingPortal…) : produits mûrs, applis natives, paiement, messagerie, milliers de vidéos réelles, support.
- **Applis grand public** (Hevy, Strong, Fitbod, Ladder, Kiprun Pacer…) : simplicité, millions d'utilisateurs, gratuité ou prix bas, historique riche.
- **Plateformes d'endurance** (TrainingPeaks, Nolio, TrainerRoad…) : ce sont elles que les coachs utilisent déjà. Charge Utile doit s'y greffer, pas les remplacer.
- **Applis nées sur intervals.icu** (Watts & Weights, PacePartner…) : elles avancent vite, avec l'IA, sur le même tuyau.
- **Mesure** (Enode, Output, VERT, Metric) : une vraie mesure physique (vitesse de barre, saut). Charge Utile estime à partir du ressenti.
- **Haut de gamme** (Catapult, Kinexon, Smartabase, Hudl) : conformité, données médicales, contrats fédéraux. Athlète 360 (INSEP, sur Smartabase) est peut-être déjà utilisé par les athlètes listés du CREPS [@athlete360-appstore].
- **IA de coaching** : plans complets automatiques, sans coach.

## Ce que Charge Utile réunit, et que nous n'avons trouvé réuni nulle part

1. Une séance de muscu **dictée par un coach humain** puis **exécutée guidée** (mannequin 3D, **tempo au son**, minuteurs), **hors-ligne** et **sans compte**.
2. L'**ajustement série par série** au RPE/RIR **dans un outil où le coach écrit la séance**. D'autres ajustent d'une séance à l'autre (CoachingPortal, Volt) ou pour un athlète seul (Alpha Progression, Enode, Peak Strength).
3. La **proprio en 4 niveaux** qui montent et descendent selon le ressenti ; la pliométrie avec une question adaptée.
4. Des **tests de mobilité au capteur du téléphone intégrés au suivi coach-athlète**. La mesure seule existe ailleurs (Clinometer, Yogger).
5. La **remontée automatique dans intervals.icu et le calendrier posé dans intervals**, **avec** l'exécution guidée. La remontée seule est en train de se banaliser (Watts & Weights, PacePartner, ponts Hevy).
6. Un outil **pensé pour le VTT XCO, la route et le trail**, pas pour le bodybuilding.

## Corrections apportées aux fiches détaillées (après relecture contradictoire)

Les fiches ci-dessous sont la collecte brute. **Ces corrections priment sur elles** :
- **TrainingPeaks** : les séances de force **ne partent pas vers la montre** (« cannot be exported to 3rd party apps and devices », page officielle) ; prix coach réel : 21,99 $/mois + 99 $ d'ouverture ; les offres à 149-359 $/mois sont des **services de coaching** achetés par l'athlète, pas le logiciel.
- **Nolio** : lecteur mobile avec vidéos et **minuteurs** de séries et de récupération (pas de son, pas d'ajustement automatique).
- **Hevy Coach** : offre unique dès 25 $/mois, 1 à 500 clients. **Everfit** : Pro 16 $/mois en annuel, 19 $/mois en mensuel.
- **10W2S** : l'avis cité reproche l'absence de **minuteur sonore** (fin de travail, début de repos), pas de bip de tempo.
- **Strava** : depuis le 21/05/2026, journal de force avec séries, reps, poids et cartes musculaires. « Pas de musculation » est faux ; « pas de prescription ni de séance guidée » est juste. Strava + Runna : 139,99 €/an (page d'abonnement 2026).
- **Garmin** : la fiche Connect+ (« pas de programmation de musculation ») est à lire avec la fiche Garmin (1 600+ exercices, Fitness Coach avec séances de force). Prix Connect+ : 6,99 $ (US) / 8,99 € (FR), chiffres 2025 non revérifiés en 2026.
- **WHOOP** : génération de séances de force par IA **en bêta**, déploiement progressif (blog non officiel).
- **intervals.icu** : un champ « Weight Lifted » existe depuis le 22/05/2026 [@forum-intervals-weight-lifted-field] ; les séries Garmin arrivent dans le fichier mais ne sont pas exploitées ; les séances de force prévues envoyées vers Garmin perdent exercices, reps et charges.
- **Volt** : ce n'est pas « le seul acteur de la force à proposer des programmes d'endurance » (voir aussi Runna, RideStrong, Dialed Health, StrengthApp, 10W2S). Volt est le seul à **combiner** programmes d'endurance et ajustement automatique.

## Sources

Fiches ci-dessous : chaque affirmation renvoie à une page ouverte (lien direct dans le texte). Entrées principales de `sources.json` : [@trainheroic-prix] [@hevycoach-prix] [@everfit-prix] [@nolio-prix] [@tp-strength-coachs] [@tp-communique-2024] [@trainingpeaks-prix-coach] [@runna-prix] [@strava-force-2026] [@ridestrong-page] [@dialed-prix] [@trainerroad-working-sets] [@garmin-connectplus-2025] [@whoop-ia-muscu-2026] [@lecoach-vs-trainingpeaks] [@intervals-mcp-github] [@theperfclub-accueil] [@mycoachpro-site] [@catapult-fy26] [@enode-prix] [@alphaprogression-site] [@volt-individuels] [@juggernautai-site] [@ladder-prix] [@intervals-prix] [@coachingportal-autoperiodisation] [@strengthtempo-appstore] [@peakstrength-site] [@clinometer-mjssm-2021] [@yogger-appstore] [@kiprun-pacer-appstore] [@campus-coach-appstore] [@forum-watts-weights] [@forum-pacepartner].

---

# Fiches détaillées


## Partie 1 — Logiciels de force et applis grand public

### A. Logiciels de coaching force (le coach paie, l'athlète utilise une appli)

#### 1. TrainHeroic

- **Cible :** coachs de force (salles, préparateurs, équipes, coachs en ligne) et athlètes individuels via un « Marketplace » de programmes. Appartient à Garmin depuis juillet 2026 (même maison que TrainingPeaks).
- **Fonctions clés :** constructeur de programmes, bibliothèque d'exercices personnalisable, messagerie, revue vidéo, tableau de bord de suivi, calculatrice d'entraînement, minuteurs, « Readiness Insights », records et graphiques.
  - Autorégulation RPE/RIR : le RPE se prescrit, mais selon l'aide officielle **dans les notes d'exercice** (pas de moteur qui ajuste la charge série par série — non constaté). Pourcentages de 1RM gérés.
  - Vidéos d'exercices : oui (vidéos, pas d'animation 3D).
  - Hors-ligne : non vérifié.
  - Compte athlète obligatoire : oui (appli avec connexion).
  - Création par IA/voix : rien trouvé sur la page de prix.
- **Prix 2026 (vérifié le 30/09/2026, https://www.trainheroic.com/pricing/) :** payé par le coach, au nombre d'athlètes : 9,99 $/mois (1 athlète), 17,99 $ (≤5), 34,99 $ (≤15), 44,99 $ (≤25), 59,99 $ (≤35), 74,99 $ (≤50), 99,99 $ (≤100)… jusqu'à 399,99 $ (≤1000). Coach assistant +9,99 $/mois. Essai 14 jours sans carte. Côté athlète autonome : « Athlete Pro » 4,99 $/mois ou 29,99 $ (achat intégré App Store).
- **Modèle :** coach paie (+ athlète paie pour Athlete Pro / programmes du Marketplace).
- **Intégrations :** Apple Santé (données de nutrition importées pour Athlete Pro, d'après l'aide officielle renvoyée par la recherche). Garmin : pas d'intégration directe à ce jour selon la recherche (demandée par les utilisateurs), rachat Garmin récent. Strava, TrainingPeaks, intervals.icu, Google Fit : rien trouvé.
- **Plateformes :** iOS (vérifié). Android et web : connus mais non revérifiés ce jour.
- **Forces :** prix d'entrée très bas pour un petit coach (17,99 $ pour 5 athlètes), marketplace pour vendre ses programmes, produit mûr, désormais adossé à Garmin.
- **Faiblesses :** avis App Store mentionnant des bugs de publication de séance et des vidéos qui ne chargent pas ; RPE en simple note ; pas d'IA de création.
- **Avis :** App Store US, 4,3/5 (1,8 k notes) — un coach 4★ : données et communication excellentes, mais « workout publishing frequently fails » (en substance) ; un utilisateur 2★ : l'appli se bloque et les vidéos ne chargent pas. https://apps.apple.com/us/app/trainheroic-strength-training/id955074569
- **Ce qu'il fait mieux que CU :** produit éprouvé à grande échelle, applis natives, messagerie, marketplace et paiement, support, et maintenant l'adossement Garmin/TrainingPeaks qui peut produire à terme une passerelle endurance–force native.
- **Ce que CU fait qu'il ne fait pas :** pas de compte athlète, séance dictée à l'IA, ajustement automatique de la charge série après série selon RPE/RIR, mannequin 3D et bips de tempo, proprio auto-ajustée, tests de mobilité au capteur, export vers intervals.icu, gratuité.
- **Offre endurance :** pas d'offre dédiée à la page de prix ; le lien avec TrainingPeaks n'existe que capitalistiquement (juillet 2026). À surveiller de très près.

#### 2. TeamBuildr

- **Cible :** salles de musculation d'établissements scolaires/universitaires, clubs, salles privées (US surtout). Pensé pour des groupes (écrans TV/tablette en salle).
- **Fonctions clés :** programmation, suivi 1RM, questionnaires de bien-être, classements, affichage salle (Weight Room View), base vidéo (Platinum+), analyse VBT (vitesse de barre) et planificateur annuel (Platinum Pro), module AMS (suivi récupération, charge) en option.
  - RPE/RIR : non mentionné sur la page de prix ; pas d'autorégulation automatique constatée.
  - Vidéos : oui à partir de Platinum.
  - Hors-ligne : oui selon la fiche App Store.
  - Compte athlète : oui.
  - IA/voix : rien trouvé.
- **Prix 2026 (vérifié le 30/09/2026, https://www.teambuildr.com/pricing) :** Silver 90 $/mois (≤50 athlètes), Gold 150 $, Platinum 200 $ (≤500), Platinum Pro 280 $ (≤1000) ; annuel = 10 mois. Options : AMS +50 $/mois, OS (gestion de salle) +200 $/mois.
- **Modèle :** structure/club paie ; coachs illimités.
- **Intégrations :** Garmin, Whoop, Oura, Polar, Apple Watch **indirectement via Apple Santé / Health Connect** (aide officielle : les données Garmin ne passent vers Apple Santé que si Garmin Connect est ouvert au premier plan ; pas de VFC). Perch (VBT) en direct. Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web.
- **Forces :** gestion de gros effectifs, affichage salle, VBT, écosystème complet (réservation, paiements).
- **Faiblesses :** appli athlète mal notée (3,2/5), interface jugée datée, pas de minuteur entre séries selon des avis, cher pour un coach solo.
- **Avis :** App Store US, 3,2/5 (260 notes) — 2★ : mot de passe oublié, lien jamais reçu « 10 times » ; 5★ : service client très réactif. https://apps.apple.com/us/app/teambuildr-training/id1588729407
- **Ce qu'il fait mieux que CU :** gestion multi-équipes et centaines d'athlètes, affichage en salle, VBT, rapports, questionnaires de forme, paiements.
- **Ce que CU fait qu'il ne fait pas :** zéro friction (pas de compte), autorégulation série par série, animation 3D + tempo audio, IA de rédaction, proprio/pliométrie structurées, intervals.icu, prix nul (TeamBuildr démarre à 90 $/mois).
- **Offre endurance :** aucune.

#### 3. BridgeAthletic

- **Cible :** deux gammes — coachs individuels/entraîneurs personnels, et départements sportifs (universités, pros).
- **Fonctions clés :** import par IA de programmes existants (tableur, PDF, photo) et génération de programme par IA (bêta), 3 000+ exercices vidéo (partenaires ALTIS, Westside Barbell), 20+ paramètres de prescription (tempo, fourchettes de reps), suivi en direct avec ajustements, prescrit vs réalisé, nutrition avec ajustement automatique des macros, mode tablette salle, évaluation FMS.
  - RPE : la page « strength coach » annonce des ajustements à la volée selon la forme du jour et le RPE (formulation marketing, mécanique non détaillée).
  - Vidéos : oui (vidéo réelle).
  - Hors-ligne : non vérifié.
  - Compte athlète : oui.
  - IA : oui (import et génération, bêta) — c'est le concurrent le plus proche de la « séance dictée à l'IA » de CU, mais côté texte/fichier, pas voix.
- **Prix 2026 (vérifié le 30/09/2026, https://www.bridgeathletic.com/personal-trainer) :** Standard 49 $/mois (15 clients), Professional 69 $/mois (35), Business 167 $/mois (100, jusqu'à 10 coachs), Enterprise sur devis. Essai 30 jours. Organisations : formules Essential/Extra/Professional/Ultra, prix non affiché (https://www.bridgeathletic.com/strength-coach). (La page /pricing renvoie une 404.)
- **Modèle :** coach ou organisation paie ; le coach peut revendre des programmes aux athlètes (paiement unique ou abonnement via son « Business Hub »).
- **Intégrations :** la page organisations cite WHOOP, Oura, Garmin, Catapult, **TrainingPeaks**, VALD et API. Profondeur non vérifiée. Strava, intervals.icu : rien.
- **Plateformes :** iOS, Android, web, tablette.
- **Forces :** IA d'import très utile pour migrer des coachs sur tableur ; bibliothèque riche ; unique à citer TrainingPeaks.
- **Faiblesses :** avis Google Play plus faibles que sur iOS (selon la recherche : 3,1/5 sur Play) ; un reproche : impossible d'interrompre une séance commencée. Tarif organisation opaque.
- **Avis :** App Store US 4,8/5 (≈3,1-3,2 k notes, chiffre renvoyé par la recherche) ; critique relevée par la recherche sur l'impossibilité d'interrompre une séance. https://apps.apple.com/us/app/bridgeathletic/id1024299963 — page Google Play non lisible par l'outil.
- **Ce qu'il fait mieux que CU :** IA d'import de programmes existants, nutrition, analytics d'équipe, vente de programmes, lien TrainingPeaks annoncé, applis natives.
- **Ce que CU fait qu'il ne fait pas :** gratuité, pas de compte, animation 3D + tempo sonore, ajustement de charge chiffré après chaque série, proprio auto-ajustée, tests de mobilité au capteur, intervals.icu.
- **Offre endurance :** pas d'offre dédiée ; intégration TrainingPeaks côté organisations.

#### 4. TrueCoach

- **Cible :** coachs personnels et coachs en ligne (1 à 250+ clients).
- **Fonctions clés :** constructeur de séances libre (séries, reps, tempo, repos), modèles réutilisables, bibliothèque vidéo (3 000+ selon la page de prix ; 900+ selon l'App Store — chiffres incohérents), import de vidéos YouTube/Instagram, messagerie, habitudes et nutrition, paiements Stripe, automatisations Zapier.
  - RPE/RIR automatique : non constaté.
  - Hors-ligne : oui selon la fiche App Store.
  - Compte athlète : oui (appli client gratuite).
  - IA : rien de central pour la création de séances trouvé (un comparatif tiers mentionne un générateur de plan repas IA, non vérifié sur le site officiel).
- **Prix 2026 (vérifié le 30/09/2026, https://truecoach.co/pricing/) :** Starter 26,34 $/mois (≤5 clients — montant inhabituel affiché tel quel), Standard 57,99 $/mois (≤20), Pro 136,99 $/mois (≤50), sur devis au-delà de 250. Annuel : 1 mois offert (Starter), 2 mois offerts (Standard/Pro). Gratuit pour les clients.
- **Modèle :** coach paie.
- **Intégrations :** MyFitnessPal (tous plans), « Apple, Garmin, WHOOP » et autres objets connectés (Standard et Pro), Apple Santé côté appli, Zapier. Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web.
- **Forces :** très bien noté par les clients, simple, flexible.
- **Faiblesses :** une refonte de l'interface (v11) critiquée par des coachs ; peu d'IA ; pas d'autorégulation.
- **Avis :** App Store US 4,9/5 (35 k notes) — 2★ d'un coach : la nouvelle interface v11 est « a disaster », trop de clics ; 3★ : ses clients ne savent plus naviguer depuis la mise à jour. https://apps.apple.com/us/app/truecoach/id1439127794
- **Ce qu'il fait mieux que CU :** outil commercial complet (paiements, profils publics, appli à la marque), messagerie, grosse base vidéo, robustesse.
- **Ce que CU fait qu'il ne fait pas :** IA de rédaction, autorégulation automatique, pas de compte, animation + tempo audio, proprio/plio/tests guidés, intervals.icu, gratuité.
- **Offre endurance :** aucune.

#### 5. Everfit

- **Cible :** coachs en ligne et studios, du solo (gratuit jusqu'à 5 clients) à l'entreprise.
- **Fonctions clés :** constructeur de séances (dont « AI workout builder » mentionné sur la page de prix), suivi, messagerie, réservation, habitudes, journal alimentaire, macros, plans repas, réponses IA (« AI-powered Smart Response »), forums, portail à la demande, automatisations (Autoflow).
  - RPE/RIR : non constaté comme moteur d'ajustement.
  - Vidéos : oui.
  - Hors-ligne : oui selon la fiche App Store.
  - Compte athlète : oui.
  - IA : générateur de séance IA et réponses IA aux messages.
- **Prix 2026 (vérifié le 30/09/2026, https://everfit.io/pricing/) :** Starter gratuit (≤5 clients). Pro de 16 $ à 255 $/mois selon le nombre de clients (5 à 300) — la page affiche des fourchettes mensuel/annuel peu lisibles. Studio 88 à 430 $/mois (50-500 clients). Entreprise sur devis. Options payantes (Autoflow 24-29 $, plans repas 33-39 $…).
- **Modèle :** coach paie (freemium).
- **Intégrations (https://everfit.io/integration/) :** Apple Santé, Apple Watch, Google Health / Health Connect, Garmin, Fitbit, Oura, WHOOP, MyFitnessPal, Cronometer, Zapier. Données surtout de santé (pas, sommeil, FC, poids). Strava, TrainingPeaks, intervals.icu : absents.
- **Plateformes :** iOS, Android, web.
- **Forces :** offre gratuite réelle jusqu'à 5 clients (concurrent direct du « gratuit » de CU pour un petit coach), large éventail d'intégrations santé, IA déjà présente.
- **Faiblesses :** lenteurs et interface critiquées par certains clients ; empilement d'options payantes.
- **Avis :** App Store US 4,7/5 (2,7 k notes) — 1★ : « Very clunky », très long à charger ; 4★ : bien, mais manque de schémas musculaires et de durée estimée. https://apps.apple.com/us/app/everfit-train-smart/id1438926364
- **Ce qu'il fait mieux que CU :** gratuit pour ≤5 clients **avec** applis natives, intégrations Garmin/Health Connect/Apple, nutrition, automatisations, messagerie.
- **Ce que CU fait qu'il ne fait pas :** pas de compte athlète, autorégulation série par série, 3D + tempo audio, proprio/plio, tests au capteur, export des séances de force vers intervals.icu (Everfit n'envoie rien vers les plateformes endurance).
- **Offre endurance :** aucune.

#### 6. ABC Trainerize

- **Cible :** entraîneurs personnels, coachs en ligne, salles et studios (appartient au groupe ABC Fitness, éditeur de logiciels de gestion de salles).
- **Fonctions clés :** programmes, séances à la demande, cours, bibliothèque d'exercices (vidéos personnalisées à partir de Pro), nutrition (plans repas, suivi calories), messagerie, groupes et défis, rappels automatiques, profil public Trainerize.me.
  - RPE/RIR automatique : non constaté.
  - Vidéos : oui.
  - Hors-ligne : non vérifié.
  - Compte athlète : oui, et le client n'accède à l'appli que via un coach ou une salle abonnée.
  - IA : « AI Workout Builder » inclus dès l'offre Grow (9 $/mois).
- **Prix 2026 (vérifié le 30/09/2026, https://www.trainerize.com/pricing/) :** Basic gratuit (1 client) ; Grow 9 $/mois (2 clients, ≈8,10 $ en annuel) ; Pro à partir de 23 $/mois (5 à 200 clients, paliers) ; Studio Plus à partir de 248 $/mois. Options : nutrition avancée 20-45 $, vidéo 10 $, Stripe 10 $, appli à la marque 169 $ (une fois).
- **Modèle :** coach/structure paie.
- **Intégrations :** Garmin, Withings, Fitbit, MyFitnessPal, YouTube, Zapier, MindBody, Glofox, API, SSO (page de prix) ; Apple Santé et Apple Watch (fiche App Store). Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web.
- **Forces :** très grosse base installée (68 k notes App Store), écosystème salle (ABC), IA de création dès 9 $/mois, Garmin en direct.
- **Faiblesses :** lenteurs et plantages rapportés, synchro Apple Watch critiquée ; beaucoup de fonctions en options payantes.
- **Avis :** App Store US 4,9/5 (68 k notes) — 2★ : l'appli répond lentement, « like a snail » ; 2★ : plante tous les jours, synchro Apple Watch défaillante. https://apps.apple.com/us/app/fitness-app-abc-trainerize/id516851502
- **Ce qu'il fait mieux que CU :** IA de création de séance intégrée dans un produit commercial, intégrations Garmin/Fitbit/Withings, nutrition, paiements, défis, écosystème salle.
- **Ce que CU fait qu'il ne fait pas :** pas de compte, autorégulation série par série, 3D + tempo audio, proprio/plio/tests guidés, intervals.icu, entièrement gratuit pour 7 athlètes (Trainerize : 23 $/mois minimum au-delà de 2 clients).
- **Offre endurance :** aucune.

#### 7. CoachRx (OPEX Fitness)

- **Cible :** coachs « individual design » (programmation 100 % individualisée, relation de long terme), issus de la méthode OPEX.
- **Fonctions clés :** 60+ modèles OPEX, assistant IA « RxBot » pour la création de programmes, calendrier unifié entraînement/nutrition/mode de vie, périodisation, évaluations, communication vidéo/voix/texte, tableau de bord coach, facturation Stripe, boutiques.
  - RPE/RIR automatique : non constaté.
  - Vidéos : non détaillé sur les pages lues.
  - Hors-ligne : non vérifié.
  - Compte athlète : oui.
  - IA : oui (RxBot) ; communication vocale coach-client (pas de création de séance à la voix constatée).
- **Prix 2026 (vérifié le 30/09/2026, https://www.coachrx.app/pricing) :** 1-5 clients 29 $/mois (25 $ en annuel) ; 6-50 clients 79 $/mois (67 $) ; 51-150 clients 199 $/mois (169 $) ; au-delà sur devis. Essai 14 jours. **Incohérence :** la page d'accueil (https://www.coachrx.app/) affiche 149 $/mois pour 51-150 clients.
- **Modèle :** coach paie.
- **Intégrations :** Apple Santé, Garmin (page d'accueil, « wearable integrations »). Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android (fiche Play existante, non ouverte), web.
- **Forces :** philosophie proche de celle d'un préparateur (individualisation, évaluations), support assuré par des coachs, aide à la migration.
- **Faiblesses :** appli client moyennement notée sur l'App Store (3,6/5 sur 79 notes, chiffre renvoyé par la recherche) ; nouvelle appli client attendue selon un avis Capterra ; pas de CRM.
- **Avis :** Capterra 5,0/5 (12 avis, échantillon faible) — un propriétaire de salle : calendrier de programmation fluide, mais attend « new client app » ; un head coach : migration depuis TrueCoach très bien accompagnée. https://www.capterra.com/p/253158/CoachRx/reviews/
- **Ce qu'il fait mieux que CU :** méthode et modèles OPEX, évaluations structurées, mode de vie/nutrition, facturation, support humain.
- **Ce que CU fait qu'il ne fait pas :** pas de compte, autorégulation automatique, 3D + tempo, proprio/plio auto-ajustées, tests au capteur, intervals.icu, gratuité (CoachRx coûte 79 $/mois pour 7 athlètes).
- **Offre endurance :** aucune.

#### 8. Exercise.com

- **Cible :** entreprises du fitness (salles, studios, box CrossFit, préparateurs, kinés, influenceurs) — logiciel de gestion tout-en-un plutôt qu'outil de coach solo.
- **Fonctions clés :** créateur de programmes, suivi, bibliothèque avec progressions de max, classements, habitudes, évaluations ; CRM, marketing e-mail/SMS, réservations, contrôle d'accès, paiements, applis à la marque, livestream et vente de contenus.
  - RPE/RIR automatique : non constaté. Vidéos : oui (bibliothèque). Hors-ligne : non vérifié. Compte athlète : oui. IA : non constatée sur les pages lues.
- **Prix 2026 (vérifié le 30/09/2026, https://www.exercise.com/platform/pricing/) :** **sur devis uniquement** (« Get a Quote », démo). Capterra indique un point de départ à 239 $/mois (https://www.capterra.com/p/152284/exercise-com/) — indicatif, non officiel.
- **Modèle :** entreprise paie (licence), revente aux membres.
- **Intégrations :** la page d'accueil cite Garmin, Apple Santé, Google Fit, Strava, Fitbit (profondeur non détaillée) ; Capterra cite Stripe, Gmail, Google Agenda. TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android (applis à la marque), web.
- **Forces :** couverture fonctionnelle énorme, support 24/7 salué.
- **Faiblesses :** prix opaque et élevé, courbe d'apprentissage, beaucoup de paramétrage manuel.
- **Avis :** Capterra 4,7/5 (249 avis) — un utilisateur loue « 1 software for all pieces of my business » ; d'autres signalent une courbe d'apprentissage et un support qui ralentit. https://www.capterra.com/p/152284/exercise-com/
- **Ce qu'il fait mieux que CU :** tout le volet business (CRM, paiements, réservations, marque blanche), multi-sites.
- **Ce que CU fait qu'il ne fait pas :** simplicité radicale, autorégulation, 3D + tempo, IA de rédaction, contenu spécifique endurance, intervals.icu, gratuité. Ce n'est pas le même marché : Exercise.com n'est pas un concurrent direct d'un coach bénévole.
- **Offre endurance :** aucune.

#### 9. PT Distinction

- **Cible :** entraîneurs personnels et coachs en ligne (très présent au Royaume-Uni).
- **Fonctions clés :** « AI Program Builder », « AI Meal Planner », « AI Assistant », évaluations, entraînement de groupe, messagerie, e-mails/SMS programmés, flux automatisés, habitudes, revue d'exercice filmée par le client, modèles, paiements.
  - RPE/RIR automatique : non constaté. Vidéos : oui (démos). Hors-ligne : non vérifié. Compte athlète : oui. IA : oui (programme et nutrition).
- **Prix 2026 (vérifié le 30/09/2026, https://www.ptdistinction.com/pricing) :** Basic 19,90 $/mois (3 clients, +6 $/client), Pro 59,90 $/mois (25 clients, +2,40 $/client, appli à la marque), Master 89,90 $/mois (50 clients, +1,60 $/client). Essai 1 mois.
- **Modèle :** coach paie.
- **Intégrations :** MyFitnessPal, Fitbit (blog officiel et avis Capterra) ; Apple Santé/Google Fit selon la recherche. **Pas de Garmin** : un entraîneur sur Capterra réclame « Garmin or Apple » ; un autre juge l'outil « not ideal for running training ». Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web.
- **Forces :** excellent rapport fonctions/prix, IA déjà intégrée partout, très bien noté par les coachs (Capterra 4,9/5, 446 avis).
- **Faiblesses :** appli client moins bien notée (4,2/5, 121 notes), perte de données en cours de séance signalée, pas de Garmin, pas adapté au running.
- **Avis :** Capterra 4,9/5 (446 avis) — un entraîneur : il faut « more integrations with fitness trackers like Garmin » ; App Store 4,2/5 — un client 4★ signale une perte de données en pleine séance. https://www.capterra.com/p/141155/PT-Distinction/reviews/ ; https://apps.apple.com/us/app/pt-distinction/id973466681
- **Ce qu'il fait mieux que CU :** IA de programme + nutrition dans un produit commercial abouti, automatisations, paiements, applis à la marque.
- **Ce que CU fait qu'il ne fait pas :** lien avec l'écosystème endurance (intervals.icu), autorégulation série par série, 3D + tempo, proprio/plio/tests au capteur, pas de compte, gratuité.
- **Offre endurance :** aucune ; avis explicites sur l'inadéquation au running.

#### 10. My PT Hub

- **Cible :** entraîneurs personnels et petites structures (britannique, prix en euros).
- **Fonctions clés :** séances et plans nutrition, réservations, habitudes, métriques et photos, messagerie ; « AI workout builder » dès Premium ; « Check-Ins AI » en option.
  - RPE/RIR automatique : non constaté. Vidéos : oui (bibliothèque + vidéos du coach). Hors-ligne : non vérifié. Compte athlète : oui. IA : générateur de séances.
- **Prix 2026 (vérifié le 30/09/2026, https://www.mypthub.net/pricing/) :** Starter 25 €/mois (3 clients), Premium 59 €/mois (clients illimités ; promo 29,50 € les 2 premiers mois), Ultimate 215 €/mois (appli à la marque, 5 coachs). Annuel ≈10-20 % moins cher. Options : appli à la marque 95 €, coach supplémentaire 10 €/mois, etc.
- **Modèle :** coach paie ; clients illimités à prix fixe dès Premium (argument fort).
- **Intégrations (https://www.mypthub.net/features/integrations/) :** directes : Apple Santé, Apple Watch, Google Fit, MyFitnessPal, Fitbit ; indirectes via ces plateformes : Garmin, Whoop, Oura, **Strava**, Nike Run Club (données : calories, pas, sommeil, distance marche/course/vélo). TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web.
- **Forces :** tarif fixe illimité, prix en euros, IA incluse.
- **Faiblesses :** avis sur les bugs (perte de données si on quitte l'écran pendant une séance, réinitialisation de mot de passe), unités et support pensés pour le Royaume-Uni.
- **Avis :** App Store US 4,1/5 (1,9 k notes) — 2★ : « horrendous » pour un utilisateur aux États-Unis (unités, fuseau du support, accès aux données après résiliation). https://apps.apple.com/us/app/my-pt-hub/id1473947709
- **Ce qu'il fait mieux que CU :** outil commercial européen complet, clients illimités, remontée de distance course/vélo via Apple Santé/Google Fit.
- **Ce que CU fait qu'il ne fait pas :** export des séances de force vers la plateforme endurance du coach (intervals.icu), autorégulation série par série, 3D + tempo, proprio/plio/tests, pas de compte, gratuité.
- **Offre endurance :** aucune (seulement lecture de distances via santé).

#### 11. Volt Athletics

- **Cible :** lycées et universités US, équipes, salles de préparation, militaires, et athlètes individuels.
- **Fonctions clés :** programmes par sport (40+), IA « Cortex » qui adapte charges et exercices, algorithme « Smart Sets » de prescription de charge, retour RPE, questionnaires de forme, 1 500+ vidéos d'exercices, mode tablette, messagerie « Volt Chat », export CSV, consultant CSCS.
  - **Autorégulation : oui** — c'est le concurrent le plus proche de CU sur ce point (charge proposée et ajustée selon les retours d'effort ; mécanique exacte non publiée).
  - Vidéos : oui (vidéo réelle). Hors-ligne : non vérifié. Compte athlète : oui. IA : adaptation automatique ; pas de création de séance à la voix.
- **Prix 2026 (vérifiés le 30/09/2026) :** individuel 19,99 $/mois, 39,99 $/trimestre ou 129,99 $/an (https://voltathletics.com/individuals) ; lycées : 900 $/an (≤30 athlètes) ou 1 400 $/an (≤100) (https://voltathletics.com/high-school). Université/entreprise : sur devis (non ouvert).
- **Modèle :** athlète paie (individuel) ou établissement paie (équipe).
- **Intégrations :** Apple Santé (fiche App Store). Garmin, Strava, TrainingPeaks, intervals.icu : rien trouvé.
- **Plateformes :** iOS (+ iPad, Mac, Apple Watch compatible), Android.
- **Forces :** autorégulation automatique mûre, programmes par sport écrits par des préparateurs certifiés, prix d'équipe transparent.
- **Faiblesses :** peu de personnalisation hors des plans (des avis demandent des séances libres), 3 séances/sem figées par programme sport.
- **Avis :** App Store US 4,7/5 (17 k notes) — 4★ : au début « I wish it pushed harder », progression venue après ~6 mois. https://apps.apple.com/us/app/volt-gym-home-workout-plans/id1189345596
- **Ce qu'il fait mieux que CU :** autorégulation éprouvée sur des dizaines de milliers d'utilisateurs, programmes endurance prêts à l'emploi, gestion d'équipe, appli native.
- **Ce que CU fait qu'il ne fait pas :** coach humain qui dicte la séance (pas de programme générique), VTT/XCO spécifique (Volt n'a pas de programme VTT), proprio à 4 niveaux, pliométrie ciblée, tests de mobilité au capteur, 3D + tempo audio, lien intervals.icu avec la charge d'endurance réelle, pas de compte, gratuité.
- **Offre endurance : oui** — programmes Cross Country, Cycling, Running, Marathon, Semi-marathon, Triathlon, Aviron, Natation (https://help.voltathletics.com/what-training-programs-are-available-on-volt). Pas de VTT. Ces programmes ne tiennent pas compte du volume d'endurance réel de l'athlète (aucune intégration endurance constatée).

---

### B. Applications grand public

#### 12. Hevy (+ Hevy Coach)

- **Cible :** Hevy = carnet d'entraînement grand public (pratiquants de salle) ; Hevy Coach = outil pour coachs dont les clients utilisent l'appli Hevy.
- **Fonctions clés :** saisie des séries, minuteurs de repos, graphiques, suivi de surcharge progressive, communauté ; Apple Watch avec synchro en direct. Hevy Coach : constructeur de séances et de plans, superséries/circuits, cibles RPE par série, messagerie, équipe de coachs, bibliothèque 400+ vidéos.
  - Autorégulation RPE/RIR : **RPE saisi et prescrit par série, mais pas d'ajustement automatique de la charge** constaté (la page Hevy Coach parle d'« autoregulation » au sens de fourchettes laissées au client).
  - Vidéos : oui (vidéos de forme).
  - Hors-ligne : oui (fiche App Store).
  - Compte athlète : oui.
  - IA/voix : aucune génération de séance constatée.
- **Prix 2026 (vérifié le 30/09/2026) :** Hevy gratuit ; Hevy Pro 2,99 $/mois, 23,99 $/an, 74,99 $ à vie (achats intégrés App Store, https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350 — la page https://hevy.com/pricing ne s'affiche pas sans JavaScript). Hevy Coach : à partir de 25 $/mois (1-10 clients), paliers jusqu'à 1 000 clients, essai 30 jours, **Hevy Pro offert aux clients** (https://hevycoach.com/pricing/).
- **Modèle :** freemium athlète ; coach paie pour Hevy Coach, client gratuit.
- **Intégrations :** Apple Santé, Apple Watch ; Health Connect (Android) ; **Strava en sens unique** (Hevy → Strava, https://www.hevyapp.com/features/strava-integration/). **Garmin : impossible** — selon l'aide Hevy renvoyée par la recherche, Garmin a refusé à Hevy l'accès à son API d'envoi de séances (page d'aide elle-même bloquée en 403 à l'ouverture directe, donc information à confirmer). TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, web ; Apple Watch.
- **Forces :** énorme base (App Store 4,9/5, 95 k notes), gratuité large, prix Coach bas et client gratuit, Strava.
- **Faiblesses :** outil de saisie, pas de moteur de progression ; pas de Garmin.
- **Avis :** App Store US 4,9/5 (95 k notes) — 5★ : fonctionne très bien « even with just the free option » (en substance). https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350
- **Ce qu'il fait mieux que CU :** ergonomie de carnet très aboutie, Apple Watch, réseau social, Strava, Hevy Coach à 25 $/mois avec appli client gratuite et native — c'est **l'alternative la plus crédible et la moins chère pour un coach comme Nathan**.
- **Ce que CU fait qu'il ne fait pas :** ajustement automatique de la charge après chaque série, séance dictée à l'IA, pas de compte, 3D + tempo audio, proprio/plio/tests guidés, récup, plan de saison, export vers intervals.icu (Hevy ne parle qu'à Strava, qui n'est pas un outil de planification).
- **Offre endurance :** non (Strava sert à l'affichage, pas à la gestion de charge).

#### 13. Strong

- **Cible :** pratiquants de musculation autonomes qui veulent un carnet simple.
- **Fonctions clés :** routines, superséries, exercices personnalisés, RPE, calculateur d'échauffement, graphiques avancés, mensurations, carte de chaleur musculaire, minuteurs, export CSV, Apple Watch, raccourcis Siri.
  - RPE : saisie oui ; autorégulation automatique non.
  - Vidéos/animations : oui (démonstrations, selon la fiche App Store).
  - Hors-ligne : oui.
  - Compte : non vérifié.
  - IA/voix : non (seulement raccourcis Siri).
- **Prix 2026 (vérifié le 30/09/2026, https://apps.apple.com/us/app/strong-workout-tracker-gym-log/id464254577) :** gratuit limité ; PRO 4,99 $/mois, 19,99 $/6 mois, 29,99 $/an, 99,99 $ à vie. Le site officiel (https://www.strong.app/) n'affiche pas les prix.
- **Modèle :** athlète paie.
- **Intégrations :** Apple Santé ; Health Connect sur Android (version 6.0 en bêta publique, aide mise à jour le 21/11/2024 — statut actuel non vérifié) ; plus de Google Fit. Garmin, Strava, TrainingPeaks, intervals.icu : rien trouvé.
- **Plateformes :** iOS, Android, Apple Watch ; pas de Wear OS (selon la recherche).
- **Forces :** simplicité, stabilité, achat à vie, réputation (4,9/5, 109 k notes).
- **Faiblesses :** aucun volet coach, aucune intelligence de programmation ; base d'exercices jugée rigide par certains.
- **Avis :** App Store US 4,9/5 (109 k notes) — 5★ : « The simplest interface » ; 3★ : la base d'exercices manque de souplesse de catégorisation. https://apps.apple.com/us/app/strong-workout-tracker-gym-log/id464254577
- **Ce qu'il fait mieux que CU :** saisie ultra-rapide et fiable, Apple Watch, historique et graphiques mûrs.
- **Ce que CU fait qu'il ne fait pas :** lien coach–athlète, séance prescrite et ajustée automatiquement, 3D + tempo, proprio/plio/tests, récup, intervals.icu.
- **Offre endurance :** non.

#### 14. Fitbod

- **Cible :** pratiquants autonomes qui veulent qu'une IA génère la séance du jour.
- **Fonctions clés :** génération de séances par algorithme selon récupération musculaire, matériel, historique ; 1 000+ exercices avec vidéo professionnelle et consignes écrites ; niveaux de difficulté.
  - Autorégulation : l'algorithme adapte à partir de reps, séries, fatigue et repos (FAQ) ; pas de RPE/RIR explicite documenté.
  - Vidéos : oui. **Hors-ligne : oui** une fois la séance générée (FAQ). **Compte obligatoire : oui** (FAQ). IA : oui (génération), pas de voix.
- **Prix 2026 (vérifié le 30/09/2026, https://fitbod.me/faqs/) :** 15,99 $/mois ou 95,99 $/an, essai 7 jours (l'App Store affiche encore aussi 12,99 $/79,99 $ — anciens tarifs). La page /pricing renvoie une 404.
- **Modèle :** athlète paie.
- **Intégrations :** Apple Santé, Fitbit, Health Connect, **Strava, Garmin** (FAQ officielle). TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iOS, Android, Apple Watch, Wear OS ; web pour l'inscription seulement.
- **Forces :** IA de génération mature, intégrations larges y compris Garmin, montres des deux écosystèmes.
- **Faiblesses :** pas de coach humain, séances génériques ; un avis signale une navigation limitée pendant la séance et des relances commerciales insistantes.
- **Avis :** App Store US 4,8/5 (286 k notes) — 5★ : « Great alternative to expensive personal trainer », avec réserves sur la navigation en séance. https://apps.apple.com/us/app/fitbod-gym-fitness-planner/id1041517543
- **Ce qu'il fait mieux que CU :** génération de séance autonome sans coach, Garmin/Strava/Wear OS, énorme base d'utilisateurs, vidéos professionnelles.
- **Ce que CU fait qu'il ne fait pas :** séance décidée par un coach qui connaît l'athlète et son calendrier de courses, ajustement explicite RPE/RIR série par série, proprio/plio, tests guidés, 3D + tempo, intervals.icu, pas de compte, gratuité.
- **Offre endurance :** non spécifique (il prend en compte les activités importées pour la fatigue musculaire, d'après les intégrations — mécanique non vérifiée).

#### 15. Future

- **Cible :** grand public aisé (US) voulant un coach personnel humain à distance.
- **Fonctions clés :** coach humain dédié qui écrit le programme, messagerie, consultations vidéo, séances guidées avec indications vocales, bibliothèque vidéo, Apple Watch, modules sommeil/nutrition.
  - RPE/RIR automatique : non constaté (c'est le coach qui ajuste). Vidéos : oui. Hors-ligne : non vérifié. Compte : oui. IA : non mise en avant ; guidage vocal en séance.
- **Prix 2026 (vérifié le 30/09/2026, https://www.future.co/) :** 199 $/mois, premier mois 50 $, remboursement sous 30 jours.
- **Modèle :** athlète paie (service de coaching, pas un logiciel pour coach).
- **Intégrations :** Apple Watch / Apple Santé. Garmin, Strava, TrainingPeaks, intervals.icu : rien trouvé.
- **Plateformes :** iOS, watchOS (App Store). Android non trouvé.
- **Forces :** relation humaine et responsabilisation, guidage audio en séance proche de l'esprit CU.
- **Faiblesses :** prix, dépend de la qualité du coach attribué ; un avis 3★ évoque un coach dépassé face à des blessures anciennes et des séances répétitives.
- **Avis :** App Store US 4,9/5 (11 k notes) — 3★ : « trainers seem stretched thin », séances devenues répétitives. https://apps.apple.com/us/app/future-pro-personal-training/id1288178982
- **Ce qu'il fait mieux que CU :** service clé en main avec coach professionnel payé, Apple Watch, guidage audio, suivi de l'engagement.
- **Ce que CU fait qu'il ne fait pas :** gratuité, spécificité endurance (VTT, route, trail), autorégulation chiffrée, proprio/plio/tests, intervals.icu, fonctionne sur Android et sans compte.
- **Offre endurance :** non constatée.

#### 16. Ladder

- **Cible :** grand public (très féminin d'après les avis) qui suit en équipe le programme d'un coach « vedette ».
- **Fonctions clés :** plans hebdomadaires écrits par des coachs, coaching audio dans l'oreille, vidéos de démonstration, rythme des séries guidé, journal de progression, équipes et chat, remplacement d'exercice facile.
  - RPE/RIR automatique : non constaté. Vidéos : oui. Hors-ligne : non vérifié. Compte : oui. IA : non (programmes humains).
- **Prix 2026 (vérifié le 30/09/2026, https://www.joinladder.com/pricing) :** Pro 29,99 $/mois ou 179,99 $/an (14,99 $/mois) ; essai 7 jours sans carte. L'App Store liste aussi des achats jusqu'à 479,99 $ (formules supérieures, non détaillées sur la page officielle).
- **Modèle :** athlète paie.
- **Intégrations :** Apple Watch, Apple Santé, applis de musique. Garmin, Strava, TrainingPeaks, intervals.icu : rien.
- **Plateformes :** iPhone, iPad, Apple Watch, web (séances, chat) ; **pas d'Android**.
- **Forces :** expérience guidée audio + vidéo remarquable (5,0/5 sur 202 k notes, Editors' Choice Apple, finaliste App of the Year 2025), effet communauté.
- **Faiblesses :** iOS seulement, aucune individualisation fine, pas de lien avec un coach personnel.
- **Avis :** App Store US 5,0/5 (202 k notes) — 5★ : échanger un exercice contre une alternative est « extremely easy ». https://apps.apple.com/us/app/ladder-strength-training-plans/id1502936453
- **Ce qu'il fait mieux que CU :** **c'est la référence de l'expérience « suivre une séance guidée »** : audio du coach, vidéo, rythme — exactement ce que CU vise avec son mannequin 3D et ses bips, mais avec des moyens de studio (une levée « over $100 Million » annoncée en novembre 2024 selon le titre d'un communiqué BusinessWire renvoyé par la recherche ; page elle-même bloquée en 403, montant non vérifié).
- **Ce que CU fait qu'il ne fait pas :** individualisation par un coach qui connaît l'athlète, autorégulation, endurance, proprio/plio/tests, intervals.icu, Android, gratuité.
- **Offre endurance :** non.

#### 17. JuggernautAI

- **Cible :** powerlifters et « powerbuilders » intermédiaires à avancés.
- **Fonctions clés :** programme individualisé par IA (conçu par Chad Wesley Smith), score de forme (readiness), autorégulation RPE/RIR, 300+ vidéos avec consignes, conseiller jour de compétition, préparation à une date de compétition, 2 à 6 séances/sem, communauté et questions-réponses hebdomadaires.
  - **Autorégulation RPE/RIR : oui**, cœur du produit — le concurrent le plus proche de CU sur la mécanique.
  - Vidéos : oui. Hors-ligne : non vérifié. Compte : oui. IA : oui (adaptation), pas de voix.
- **Prix 2026 (vérifié le 30/09/2026, https://www.juggernautai.app/) :** 34,99 $/mois ou 349,99 $/an, essai 2 semaines.
- **Modèle :** athlète paie.
- **Intégrations :** rien trouvé (ni Garmin, ni Strava, ni Apple Santé mentionnés).
- **Plateformes :** iOS, Android, web.
- **Forces :** autorégulation mûre et reconnue, calage sur une date de compétition (équivalent des courses A de CU).
- **Faiblesses :** exige de savoir coter son RPE/RIR, trous dans la bibliothèque, petits bugs (minuteur, échauffement) ; spécifique force athlétique, pas endurance.
- **Avis :** App Store US 4,8/5 (5,7 k notes) — 4★ : programmation excellente, mais l'appli « needs UI updates » et a des bugs mineurs. https://apps.apple.com/us/app/juggernautai/id1515756471
- **Ce qu'il fait mieux que CU :** algorithme d'autorégulation entraîné sur une grosse base, périodisation vers une compétition, communauté.
- **Ce que CU fait qu'il ne fait pas :** adaptation au volume d'endurance réel (intervals.icu), contenus proprio/plio/mobilité, 3D + tempo, coach humain, pas de compte, gratuité.
- **Offre endurance :** non.

#### 18. RP Hypertrophy (RP Strength)

- **Cible :** pratiquants orientés hypertrophie, adeptes de la méthode Renaissance Periodization (mésocycles, volume par muscle).
- **Fonctions clés :** 45 à 100+ modèles de mésocycles, « Meso Builder », autorégulation par questionnaires après séance (pump, courbatures, charge de travail) qui ajuste charges, reps et volume ; 250+ vidéos techniques ; spécialisation par groupe musculaire.
  - **Autorégulation : oui** (retours subjectifs par muscle, pas RPE/RIR série par série au sens de CU).
  - Vidéos : oui. **Hors-ligne : non** selon un site concurrent (Mesostrength) et des avis App Store qui réclament le hors-ligne — non confirmé par RP ; l'appli est une application web installable. Compte : oui. IA : non (algorithme), pas de voix.
- **Prix 2026 (vérifié le 30/09/2026, https://rpstrength.com/pages/hypertrophy-app) :** 34,99 $/mois ou 299,99 $/an (24,99 $/mois), garantie 30 jours.
- **Modèle :** athlète paie.
- **Intégrations :** rien trouvé.
- **Plateformes :** web (installable), iOS (US) ; Android annoncé « bientôt » sur Google Play US.
- **Forces :** méthode scientifique réputée, autorégulation du volume par muscle.
- **Faiblesses :** prix élevé, pas de suivi du cardio (avis 3★), hors-ligne absent d'après les retours.
- **Avis :** App Store US 4,3/5 (233 notes) — 3★ : belle interface, mais prix et « lack of cardio logging » (en substance). https://apps.apple.com/us/app/rp-hypertrophy/id1555614554
- **Ce qu'il fait mieux que CU :** gestion du volume hebdomadaire par muscle, modèles de mésocycles scientifiquement étayés, notoriété.
- **Ce que CU fait qu'il ne fait pas :** hors-ligne, endurance (RP ne logue même pas le cardio), force/puissance plutôt qu'hypertrophie, proprio/plio, coach humain, intervals.icu, gratuité.
- **Offre endurance :** non.

---


## Partie 2 — Plateformes d'endurance et « force pour endurants »

### A. Plateformes d'endurance (coach ↔ athlète)

#### 1. TrainingPeaks (+ module Strength)

- **Cible** : coachs d'endurance (triathlon, vélo, course) et athlètes autonomes ; c'est le standard du marché.
- **Fonctions clés** : calendrier, séances structurées envoyées aux montres/home-trainers, métriques TSS/CTL/ATL/TSB (Performance Management Chart), boutique de plans, marketplace de coachs.
- **Musculation (Strength Workout Builder)** — lancé le 25 juillet 2024 ([communiqué PR Newswire](https://www.prnewswire.com/news-releases/trainingpeaks-muscles-up-with-new-strength-feature-302206105.html)) :
  - bibliothèque de « plus de 1 000 » exercices avec vidéos de démonstration ; exercices personnalisés possibles avec vidéo YouTube/Vimeo ([page coachs](https://www.trainingpeaks.com/strength/)) ;
  - blocs : exercice simple, supersets, circuits, échauffement, retour au calme ; prescription en RPE et RIR (d'après l'extrait de l'aide « Using the Strength Workout Builder » renvoyé par la recherche — la page d'aide elle-même renvoie une erreur 403, **non lue directement**) ;
  - construction **uniquement sur le site web** ; exécution **uniquement dans l'appli mobile** ; l'athlète saisit séries/répétitions/charges et voit une conformité colorée par exercice ([page athlètes](https://www.trainingpeaks.com/strength-athlete/)) ;
  - compte Basic : peut exécuter les séances du coach mais pas en créer ni en déplacer ; création = Premium ou coach ;
  - **charge (TSS)** : à la sortie, impossible d'enregistrer un TSS sur une séance de force du nouveau builder — plainte explicite de coachs en août 2024 ([forum Evoke Endurance](https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/)), contournement par une séance vide à côté. Depuis, les notes de version App Store mentionnent l'ajout/édition de la durée et « TSS calculations for strength sessions » ([App Store](https://apps.apple.com/us/app/trainingpeaks-plan-train-lift/id408047715)) ; un extrait d'aide renvoyé par la recherche parle d'un TSS **planifié saisi à la main** et d'un TSS calculé depuis le fichier de la montre. Conclusion prudente : la muscu compte dans le PMC, mais par saisie manuelle ou via la FC de la montre, **pas par un calcul à partir du tonnage/RPE**. Info partiellement vérifiée.
  - Garmin : les fichiers Garmin se rattachent automatiquement aux séances de force structurées (extrait de recherche, page d'aide non lisible).
  - Pas d'animation 3D, pas de tempo sonore, pas d'autorégulation automatique de la charge (le RPE/RIR est une consigne, l'appli ne recalcule pas la charge série après série — non trouvé nulle part).
- **Prix (vérifié le 30/09/2026)** — [trainingpeaks.com/pricing](https://www.trainingpeaks.com/pricing/) : athlète Premium 19,95 $/mois ou 134,99 $/an ; coach Bronze 149 $/mois, Silver 229 $/mois, Gold 359 $/mois (ces paliers incluent un coaching par un coach TrainingPeaks — ce sont des offres « se faire coacher »). La page [Today's Plan alternative](https://www.trainingpeaks.com/todays-plan-alternative/) annonce une « Coach Edition » dès 19 $/mois + 9 $/mois par athlète Premium (non recoupé sur la page de prix coach, qui n'a pas été ouverte). In-app App Store : 19,99 $/mois, 48,99 $/trimestre, 119,99-134,99 $/an.
- **Modèle** : coach paie la plateforme ; l'athlète Basic est gratuit, Premium payant (souvent refacturé ou pris en charge par le coach).
- **Intégrations** : Garmin, Wahoo, Zwift, Apple Watch (page Today's Plan alternative) ; Strava, Coros, Polar, Suunto largement connus mais non revérifiés ici. Export vers intervals.icu possible côté intervals.icu (non revérifié ici).
- **Plateformes** : web + iOS + Android.
- **Forces** : standard de fait, métriques de charge reconnues, énorme bibliothèque d'exercices vidéo, force et endurance dans le même calendrier, sync Garmin.
- **Faiblesses** : builder de force web seulement ; TSS muscu longtemps absent puis manuel ; appli perçue comme outil de suivi plus que de guidage (« designed around tracking », avis App Store 09/2025) ; cher pour un coach bénévole.
- **Avis** :
  - Un coach, août 2024 : l'absence de TSS pour la force « defeats the purpose of tracking strength training » ([Evoke Endurance](https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/)).
  - Avis App Store 01/2024 : « unable to add or modify workout structure » depuis le téléphone ([App Store](https://apps.apple.com/us/app/trainingpeaks-plan-train-lift/id408047715)).
- **Ce qu'il fait mieux que CU** : 1 000+ exercices vidéo réels (contre 190 animations) ; un seul calendrier endurance + force avec PMC ; sync Garmin des séances de force ; crédibilité et écosystème (plans, coachs) ; supersets/circuits dans un éditeur visuel.
- **Ce que CU fait qu'il ne fait pas** : ajustement de la charge série par série à partir du RPE/RIR ; tempo sonore et minuteurs de guidage ; démonstration 3D orientable (TP = vidéos) ; proprio à niveaux auto-ajustés, tests guidés avec capteur du téléphone, routine de récup ; création de séance en langage naturel (pas besoin du builder web) ; pas de compte ni de paiement pour l'athlète ; hors-ligne.

#### 2. Final Surge

- **Cible** : coachs de course à pied (très implanté aux États-Unis, clubs universitaires), triathlon.
- **Fonctions clés** : calendrier, séances structurées multi-cibles (allure, FC, puissance) envoyées aux montres, marketplace de plans, messagerie, rapports de zones.
- **Musculation** : **pas de module de force dédié trouvé**. Seule piste : pièces jointes (vidéos, images, PDF) attachables aux séances, que Final Surge suggère d'utiliser « for strength training, drill routines, proper form » ([blog Final Surge](https://blog.finalsurge.com/introducing-videos-attachments-for-workouts/)). Aucune mention de bibliothèque d'exercices, de saisie séries/charges ou de RPE par série dans la page de prix ni dans les notes de version ([updates](https://site.finalsurge.com/updates), dont la dernière entrée visible date de juin 2022 — page probablement plus maintenue). Des plans « strength training » existent dans la marketplace (contenus de coachs), pas un outil.
- **Prix (vérifié le 30/09/2026)** — [finalsurge.com/pricing](https://www.finalsurge.com/pricing) : athlète gratuit (toutes fonctions athlète) ; coach Starter 19 $/mois (1-5 athlètes), Pro 39 $/mois (jusqu'à 100 athlètes), sur devis au-delà ; -17 % en annuel.
- **Modèle** : coach paie, athlète gratuit.
- **Intégrations** (d'après une revue comparative [Coachbox](https://coachbox.app/en/compare/final-surge-review/), source d'un concurrent) : Garmin, Apple Watch/Apple Santé, Coros, Polar, Suunto, Wahoo (ELEMNT, SYSTM), Strava, Zwift, Rouvy, Stryd, TrainerRoad.
- **Plateformes** : web + iOS + Android.
- **Forces** : athlètes gratuits, prix coach bas, bonnes intégrations montres.
- **Faiblesses** : pas de PMC (charge/forme/fatigue) selon la revue Coachbox ; aide en anglais seulement ; force réduite à du texte + vidéo attachée.
- **Avis** : aucun avis utilisateur spécifique à la muscu trouvé. La revue Coachbox note l'absence de « performance management chart » (source partisane).
- **Ce qu'il fait mieux que CU** : planification endurance complète et envoi aux montres ; prix coach très bas pour 100 athlètes ; marketplace de plans.
- **Ce que CU fait qu'il ne fait pas** : tout le volet musculation guidée (exercices, démonstrations, séries, charges, RPE, ajustement), proprio, tests, récup.

#### 3. Today's Plan — **fermé**

- **Statut** : la page d'accueil [todaysplan.com.au](https://www.todaysplan.com.au/) affiche désormais que le service « is no longer in operation » (lu le 30/09/2026). TrainingPeaks a publié une page de migration ([Today's Plan alternative](https://www.trainingpeaks.com/todays-plan-alternative/)) avec une date butoir « March 12 » (année non précisée sur la page).
- **Cible (historique)** : cyclisme (équipes pro, fédérations), triathlon ; licences en volume.
- **Prix** : sans objet (service arrêté). La page coachs (`/i-am-a-coach/`) renvoie 404.
- **Intérêt pour CU** : signal de marché — même une plateforme utilisée par des équipes pro n'a pas survécu face à TrainingPeaks ; le créneau « plateforme d'endurance généraliste » est saturé et consolidé.
- **Ce qu'il fait mieux / ce que CU fait en plus** : non pertinent, hors marché.

#### 4. Nolio (France)

- **Cible** : coachs et clubs d'endurance francophones (course, trail, vélo, triathlon), athlètes gratuits ; partenariat fédéral avec la FFC (« Nolio by FFC », page fédérale renvoyée par la recherche, non ouverte).
- **Fonctions clés** : calendrier, séances structurées (envoi aux montres), analyse, débrief post-séance (sensations, RPE), marketplace de plans et de coachs.
- **Musculation** — [page « workout builder strength »](https://www.nolio.io/workout-builder/strength/coach/) :
  - « 200+ » exercices avec vidéos, duplicables et modifiables ; exercices personnalisés (texte, image, vidéo) ;
  - supersets ; paramètres rép./durée, cibles et récup ; cibles en kg, RPE, RIR, cibles personnalisées ou pourcentage d'une métrique (ex. 1RM) ;
  - « lecteur » mobile pour exécuter la séance ; l'athlète saisit ses valeurs réelles ; débrief RPE ;
  - la mention « Strength structured workout » figure dans tous les plans coach et club ([pricing](https://www.nolio.io/en/pricing/)).
  - Autorégulation automatique de la charge, tempo sonore, animation : **non trouvés**. Prise en compte de la muscu dans la charge d'entraînement : **non vérifié**.
  - Le chiffre de 51 exercices apparaît dans un extrait de recherche (ancienne version ?) ; la page officielle actuelle dit 200+. L'article d'aide « Construire une séance PPG / Musculation » renvoie 404.
- **Prix (vérifié le 30/09/2026)** — [nolio.io/en/pricing](https://www.nolio.io/en/pricing/) : athlète gratuit « forever » ; athlète Premium 6,90 €/mois ; coach Starter 19,90 €/mois (3 athlètes), Classic 29,90 €/mois (25), Pro 39,90 €/mois (30 athlètes, 2 coachs) ; club Starter 29,90 €/mois (40 athlètes), Classic 49,90 €/mois (80). Attention : l'App Store France affiche d'autres montants in-app (Premium 7,99 €/mois ou 79,99 €/an, coach individuel 29,99 €, club 49,99 €) ([App Store FR](https://apps.apple.com/fr/app/nolio/id1615773607)) — tarifs web ≠ tarifs in-app.
- **Modèle** : coach/club paie, athlète gratuit (Premium optionnel).
- **Intégrations** : Apple Santé, Apple Watch (App Store) ; Garmin, Strava, Coros, Suunto, Polar connus mais non revérifiés dans une page ouverte ici.
- **Plateformes** : web + iOS + Android.
- **Forces** : français, pas cher, athlètes gratuits, vrai builder de force avec RPE/RIR/%1RM et vidéos — c'est le concurrent **le plus direct** de CU pour un coach d'endurance français.
- **Faiblesses** : pas d'ajustement automatique de charge trouvé ; muscu = une séance parmi d'autres, pas de proprio/pliométrie/tests dédiés ; quelques critiques sur le déplacement de séances dans les plans (App Store).
- **Avis** : App Store FR 4,5/5 (288 notes) ; un avis salue une gestion « optimisée pour le travail des coachs » ; aucun avis spécifique muscu trouvé ([App Store FR](https://apps.apple.com/fr/app/nolio/id1615773607)).
- **Ce qu'il fait mieux que CU** : plateforme complète endurance + force dans un seul outil ; athlètes gratuits avec vrai compte ; sync montres ; 200+ exercices vidéo ; cibles en %1RM depuis une métrique stockée ; marketplace et visibilité ; lien FFC.
- **Ce que CU fait qu'il ne fait pas** : ajustement de charge série après série ; tempo sonore ; animation 3D ; proprio à 4 niveaux auto-ajustés ; tests guidés (max estimé, mobilité au capteur) ; onglet Récup (respiration, nutrition chiffrée) ; création par dictée en langage naturel ; zéro compte pour l'athlète.

#### 5. Humango (HumanGO)

- **Cible** : athlètes d'endurance autonomes (course, vélo, triathlon) ; coach IA « Hugo » (présenté comme propulsé par ChatGPT dans des extraits de recherche — non vérifié sur page ouverte).
- **Fonctions clés** : plan généré et réajusté automatiquement selon séances, FC, sommeil, fatigue, disponibilités ; chat IA.
- **Musculation** : l'App Store décrit des « Strength & Recovery Workouts » intégrés au plan, et une mise à jour récente mentionne des séances de force que Hugo « can customize to your own needs » ([App Store](https://apps.apple.com/us/app/humango-ai-training-planner/id1554430755)). **Aucun détail public trouvé** sur la bibliothèque, les vidéos, la saisie des charges ou la prise en compte dans la charge ; la page « how it works » n'en dit rien ([humango.ai](https://humango.ai/how-it-works/athletes)). Info faible.
- **Prix (vérifié le 30/09/2026)** : la page [humango.ai/pricing](https://humango.ai/pricing) n'affiche pas de prix lisible. Achats in-app App Store (US) : Fitness 8,99 $/mois ou 79,99 $/an ; Essential 16,99 $/mois ou 155,99 $/an ; Endurance 18,99 $/mois ou 169,99 $/an ; Premium 28,99 $/mois ou 264,99 $/an ([App Store](https://apps.apple.com/us/app/humango-ai-training-planner/id1554430755)).
- **Modèle** : athlète paie (B2C) ; un usage « assistant de coach humain » est évoqué dans le marketing.
- **Intégrations** (App Store) : Garmin, Apple Watch, Suunto, Strava, Polar, Apple Santé.
- **Plateformes** : iOS, Android, web.
- **Forces** : adaptation automatique du plan d'endurance ; prix d'entrée bas.
- **Faiblesses** : muscu opaque, sans preuve de guidage réel ; peu d'avis (21 notes sur l'App Store US).
- **Avis** : une revue de blog (08/2024) le juge adapté aux athlètes « without the need for a hands-on coach », sans rien dire de précis sur la force ([FueledByLOLZ](https://fueledbylolz.com/2024/08/28/humango-review/)). Aucun avis sur la muscu trouvé.
- **Ce qu'il fait mieux que CU** : planification d'endurance automatique et adaptative ; lecture sommeil/FC ; pas besoin de coach.
- **Ce que CU fait qu'il ne fait pas** (autant qu'on puisse en juger) : muscu guidée détaillée (démonstration 3D, tempo, RPE par série, ajustement de charge), proprio, tests, relation coach humain ↔ athlète.

#### 6. Enduco (Allemagne)

- **Cible** : athlètes d'endurance autonomes (course, vélo, natation, triathlon), marché germanophone surtout.
- **Fonctions clés** : plans IA adaptatifs (séances manquées, maladie), chat « AI Coach » (10 ou 100 messages/semaine selon l'offre), calendrier, sync montres ([enduco.app](https://enduco.app/)).
- **Musculation** : l'App Store mentionne un volet « Strength & Mobility Training » avec des exercices « for strength and stability » et des gammes de course en échauffement ([App Store AT](https://apps.apple.com/at/app/enduco-a-i-personal-coach/id1483216578?l=en)). Rien sur vidéos, charges, RPE par série ou prise en compte dans la charge. Info faible ; ressemble à du renforcement au poids du corps.
- **Prix (vérifié le 30/09/2026)** — [enduco.app](https://enduco.app/) (la page /pricing renvoie 404) : 14,99 €/mois ; Pro 21,99 €/mois ; -30 % en annuel ; 14 jours d'essai ; prix variables selon la région. App Store AT : Pro 14,99-119,99 €, Pro+ 21,99-179,99 €, Pro Family 219,99 €/an.
- **Modèle** : athlète paie.
- **Intégrations** (App Store) : Strava, Garmin, Polar, Suunto, Wahoo, Coros, Fitbit, TrainingPeaks, Zwift, Rouvy, **intervals.icu**, Hammerhead.
- **Plateformes** : iOS, Android, web.
- **Forces** : très bonnes intégrations (dont intervals.icu), IA conversationnelle, prix moyen.
- **Faiblesses** : muscu secondaire ; un avis critique doute de la pertinence des plans pour cyclistes avancés (App Store AT).
- **Avis** : 4,4/5 (36 notes, App Store AT) ; un utilisateur salue le fonctionnement avec sa Garmin Fenix ; aucun avis sur la muscu.
- **Ce qu'il fait mieux que CU** : plan d'endurance complet et adaptatif ; chat IA côté athlète ; intégrations très larges.
- **Ce que CU fait qu'il ne fait pas** : vraie séance de force chargée et guidée, ajustement de charge, proprio/pliométrie structurées, tests, coach humain dans la boucle.

#### 7. JOIN (Pays-Bas)

- **Cible** : cyclistes (route, VTT, gravel) autonomes ; volet course à pied ajouté.
- **Fonctions clés** : plan adaptatif (réagit aux séances ratées et au ressenti), 400+ séances, lecteur indoor, suivi eFTP ([join.cc/pricing](https://join.cc/pricing)).
- **Musculation** : **pas de musculation hors vélo dans l'outil** d'après la page de prix et la revue Cyclist. La catégorie « Strength » de JOIN désigne des **intervalles de force sur le vélo** (bas de cadence, couple élevé) ([join.cc/workout-categories/strength](https://join.cc/workout-categories/strength)). La muscu en salle est traitée seulement dans des articles de blog.
- **Prix (vérifié le 30/09/2026)** — [join.cc/pricing](https://join.cc/pricing) : 16,99 €/mois ou 119,99 €/an ; une seule offre ; 7 jours d'essai.
- **Modèle** : athlète paie.
- **Intégrations** : Garmin, Strava, Wahoo, TrainingPeaks (revue [Cyclist](https://www.cyclist.co.uk/reviews/join-cycling-training-app-review), 12/2023).
- **Plateformes** : iOS, Android, web.
- **Forces** : plans vélo de qualité pour un prix unique ; adaptation automatique.
- **Faiblesses** (Cyclist) : lisibilité du lecteur indoor, bascule ERG peu pratique ; aucune muscu.
- **Avis** : Cyclist (21/12/2023) apprécie qu'on puisse ajuster si on rate une séance ; lecteur jugé peu lisible en effort.
- **Ce qu'il fait mieux que CU** : planification vélo adaptative de bout en bout, travail de force sur le vélo, lecteur home-trainer.
- **Ce que CU fait qu'il ne fait pas** : toute la musculation hors vélo. Complémentaires plutôt que concurrents.

#### 8. TrainerRoad

- **Cible** : cyclistes (et triathlètes) autonomes, très orientés home-trainer et puissance.
- **Fonctions clés** : IA d'adaptation de plan, TrainNow, détection de fatigue « Red Light Green Light », analyses par zones ([pricing](https://www.trainerroad.com/pricing)).
- **Musculation (a-t-il de la force ?)** : **oui mais uniquement en journal**. Depuis juillet 2024, on peut saisir des « Working Sets » (séries proches de l'échec, hors échauffement) par groupe musculaire (haut du corps, tronc, bas du corps, corps entier) sur une activité de musculation, avant ou après import depuis Strava/Garmin ([blog TrainerRoad](https://www.trainerroad.com/blog/enhanced-strength-training-support/)). Ces séries alimentent la détection de fatigue et l'IA, qui allège les séances de vélo suivantes (une journée de jambes lourde pèse plus qu'une séance haut du corps). **Pas de bibliothèque d'exercices, pas de séance guidée, pas de prescription.** La TSS et la forme intègrent les activités non-vélo importées (extrait de recherche, non vérifié sur page ouverte).
- **Prix (vérifié le 30/09/2026)** — [trainerroad.com/pricing](https://www.trainerroad.com/pricing) : 21,99 $/mois ou 209,99 $/an ; garantie 30 jours.
- **Modèle** : athlète paie.
- **Intégrations** (page de prix) : Garmin, Strava, Wahoo, Zwift. Plateformes : iOS, Android, Windows, macOS.
- **Forces** : l'idée « la muscu modifie le vélo du lendemain » est implémentée ; énorme base de données d'activités ; interface soignée.
- **Faiblesses** : force = saisie manuelle, pas de coaching musculaire ; le modèle suppose des séries proches de l'échec, ce qui gêne les utilisateurs qui font de l'entretien.
- **Avis** (forum officiel, août 2024, [page 5 du fil](https://www.trainerroad.com/forum/t/strength-training-upgrade-add-working-sets/95228?page=5)) : un utilisateur trouve que s'entraîner à l'échec en permanence « sounds counterproductive » ; un autre signale que des séries légères provoquent de « false yellows/reds » dans la détection de fatigue.
- **Ce qu'il fait mieux que CU** : faire rétroagir la muscu sur la planification vélo (la muscu modifie automatiquement les séances de vélo suivantes) ; plans vélo et lecteur indoor.
- **Ce que CU fait qu'il ne fait pas** : prescrire et guider la muscu (exercices, démonstrations, tempo, charges, RPE, ajustement), proprio, tests, récup. TrainerRoad **consomme** une séance de muscu, CU la **produit**.

#### 9. Xert

- **Cible** : cyclistes « data », puissance ; modèle de « signature de forme » et XSS (Xert Strain Score).
- **Fonctions clés** : recommandations adaptatives, analyse de percées (MPA), planificateur.
- **Musculation** : **aucune intégration dans les plans**. Sur le forum officiel (août-sept. 2025), un utilisateur confirme que Xert « doesn't directly include any weight training into the plans » ; les conseils : bouger le curseur de fraîcheur ou choisir une séance plus facile ([forum Xert](https://forum.xertonline.com/t/strenght-workout/48386)). Des activités manuelles peuvent ajouter une charge estimée (extrait d'aide renvoyé par la recherche, non ouvert).
- **Prix (vérifié le 30/09/2026)** — [baronbiosys.com/pricing](https://www.baronbiosys.com/pricing/) : 14,99 $/mois ou 99,95 $/an ; 30 jours d'essai sans carte.
- **Modèle** : athlète paie.
- **Intégrations** (page de prix) : Garmin, Wahoo, Zwift, Strava. Plateformes : web, iOS, Android.
- **Forces** : modélisation physiologique fine, prix bas.
- **Faiblesses** : ignore la muscu ; courbe d'apprentissage.
- **Avis** : sur le même fil, un cycliste craint que Xert ne tienne pas compte des jours de force et propose une séance intense le lendemain (forum Xert, 2025).
- **Ce qu'il fait mieux que CU** : modélisation de la performance vélo.
- **Ce que CU fait qu'il ne fait pas** : toute la musculation ; CU pousse la séance dans intervals.icu, ce que Xert ne sait pas quantifier seul.

#### 10. Runna (propriété de Strava depuis avril 2025)

- **Cible** : coureurs grand public, du 5 km au marathon (et trail) ; énorme audience (App Store US 4,9/5, ~35 000 notes).
- **Fonctions clés** : plans de course personnalisés et adaptatifs, sync montres.
- **Musculation** — [aide Runna](https://support.runna.com/en/articles/15624879-adding-strength-training-to-your-runna-plan) :
  - trois niveaux (débutant, intermédiaire, avancé) ; matériel choisi (élastique, barre, box, banc, haltères, kettlebell, barre de traction, swiss ball) ou poids du corps ;
  - séances de 30, 45 ou 60 min, jusqu'à 4/semaine, objectif « Running Focus » (bas du corps/tronc) ou « All Round Strength » ;
  - animation + conseils de technique pour chaque exercice ; onglet « Log » pour saisir reps et poids pendant la séance ; suivi du poids soulevé par exercice ;
  - séances de force envoyées automatiquement à Strava, **pas aux montres** ; pas encore de remplacement d'exercice personnalisé ;
  - autorégulation par RPE et ajustement automatique de charge : **non trouvés**. Prise en compte de la force dans la charge de course : non documentée.
- **Prix (vérifié le 30/09/2026)** — [runna.com/pricing](https://www.runna.com/pricing) : 19,99 $/mois ou 119,99 $/an. Pack Strava + Runna : 139,99 €/an sur [strava.com/subscribe](https://www.strava.com/subscribe).
- **Modèle** : athlète paie (B2C).
- **Intégrations** (page de prix) : Apple Watch, Garmin, Fitbit, Coros, Strava. Plateformes : iOS, Android.
- **Forces** : c'est l'exemple le plus abouti d'un volet muscu **intégré à un plan d'endurance** pour le grand public : matériel pris en compte, animations, journal de charges.
- **Faiblesses** : programmes génériques (pas de coach humain), pas de sync montre pour la force, pas de swap d'exercice, pas de vélo/VTT.
- **Avis** : un avis App Store (08/2024) souligne l'offre « strength and flexibility training » en complément de la course ([App Store](https://apps.apple.com/us/app/runna-running-plans-coach/id1594204443)). Pas trouvé d'avis critique détaillé sur la muscu (Reddit non atteint par la recherche).
- **Ce qu'il fait mieux que CU** : intégration native plan de course + muscu adaptée au matériel ; échelle, finition, marque ; journal de charges par exercice ; propriété de Strava (distribution).
- **Ce que CU fait qu'il ne fait pas** : coach humain qui écrit la séance pour un athlète précis ; RPE/RIR par série avec ajustement de charge ; tempo sonore ; proprio à niveaux, pliométrie structurée, tests guidés, récup ; VTT/route ; gratuit et sans compte.

#### 11. Strava

- **Cible** : réseau social sportif (195 M+ d'utilisateurs revendiqués).
- **Musculation** : refonte le 21 mai 2026 ([communiqué Strava](https://press.strava.com/articles/strava-overhauls-strength-experience-with-expanded-partner-ecosystem-new-workout-log-and-muscle-maps)) : journal de séance (séries, reps, poids), cartes musculaires automatiques, 5 visuels à partager, 14 intégrations partenaires (24 Hour Fitness, Amazfit, Caliber, COROS, Fitbod, Garmin, Hevy, iFIT, JEFIT, Liftoff, Motra, REMAKER, Runna, WHOOP). Strava revendique plus de 500 millions d'activités de force en 2025. **Pas de programmation, pas de séance guidée, pas d'enseignement technique** ; un éditeur d'appli de journal (source partisane) note que Strava « doesn't teach you how to perform them » ([gymlog.eu](https://gymlog.eu/en/blog/strava-strength-training-features-2026)).
- **Prix (vérifié le 30/09/2026)** — [strava.com/subscribe](https://www.strava.com/subscribe) : 59,99 €/an ; famille 99,99 €/an ; étudiant 29,99 €/an ; Strava + Runna 139,99 €/an. Base gratuite.
- **Modèle** : freemium, athlète paie.
- **Intégrations** : quasiment toutes les montres et applis (Garmin, Coros, Apple, Wahoo…) ; c'est un agrégateur.
- **Plateformes** : iOS, Android, web.
- **Forces** : là où les athlètes publient déjà ; la muscu y devient visible (carte musculaire, partage social).
- **Faiblesses** : journal seulement ; aucune prescription.
- **Avis** : la couverture presse (9to5Mac, T3, Wareable, 05/2026) est favorable ; les pages T3 et Wareable n'ont pas pu être lues (contenu tronqué / 403).
- **Ce qu'il fait mieux que CU** : visibilité sociale, carte musculaire, agrégation de toutes les sources ; point d'arrivée naturel d'une séance.
- **Ce que CU fait qu'il ne fait pas** : prescrire, guider, ajuster. **Piste** : CU pourrait pousser ses séances vers Strava (Strava accepte désormais séries/reps/poids via partenaires) — à étudier, l'API partenaire n'est pas documentée ici.

---

### B. Offres « force pour endurants » (contenus, programmes, applis dédiées)

#### 12. Uphill Athlete (plans et « appli »)

- **Cible** : alpinistes, skieurs-alpinistes, traileurs, grimpeurs ; méthode « Training for the Uphill Athlete » (endurance aérobie + endurance musculaire).
- **Appli** : **pas d'appli Uphill Athlete dédiée trouvée** (recherche App Store sans résultat de la marque). Tout est livré **dans TrainingPeaks** : la « Training Library » inclut un compte TrainingPeaks Premium offert ([training-library](https://uphillathlete.com/training-library/)).
- **Musculation** : programmes de force et de récup « at home » dans la bibliothèque ; produit séparé « Chamonix Mountain Fit At-Home Strength Program » : 7 vidéos de 25 à 65 min à suivre, 5 niveaux (0 à 4), 2 fois/semaine, sans matériel jusqu'au niveau 3, kettlebells au niveau 4, animé par un kinésithérapeute ([page produit](https://uphillathlete.com/product/at-home-strength-training-program/)). Pas de saisie de charges ni d'autorégulation propres (celles de TrainingPeaks s'appliquent si le plan utilise le Strength Builder — non vérifié).
- **Prix (vérifié le 30/09/2026)** : Training Library dès 26 $/mois ([page](https://uphillathlete.com/training-library/)) ; programme Chamonix dès 19 $/mois ([page](https://uphillathlete.com/product/at-home-strength-training-program/)) ; groupes d'entraînement dès 53 $/mois et plans à l'unité (49 à 99 $) d'après un extrait de recherche (non ouvert).
- **Modèle** : athlète paie (contenu), coaching individuel en option.
- **Intégrations / plateformes** : celles de TrainingPeaks (web, iOS, Android).
- **Forces** : grande autorité éditoriale en montagne ; contenu vidéo « suivez le kiné » ; tout dans le même calendrier que l'endurance.
- **Faiblesses** : pas d'outil propre ; progression = changer de niveau à la main ; dépendance à TrainingPeaks.
- **Avis** : aucun avis indépendant récent sur la partie force trouvé (Reddit non atteint).
- **Ce qu'il fait mieux que CU** : marque et contenu éducatif de référence pour traileurs/montagnards ; vidéos longues à suivre avec un kiné ; livraison dans l'outil que les coachs utilisent déjà.
- **Ce que CU fait qu'il ne fait pas** : séance individualisée par le coach de l'athlète ; charges et ajustement par RPE ; tests guidés ; proprio à niveaux auto-ajustés ; gratuit.

#### 13. Dialed Health (vélo)

- **Cible** : cyclistes (route, gravel, XC, enduro, ultra) ; fondé en 2016 par un ancien pilote pro de descente.
- **Livraison** : **via TrainingPeaks** (l'abonnement inclut TrainingPeaks Premium) ; l'ancienne appli iOS (App Store CA) renvoie 404 → probablement retirée au profit de TrainingPeaks (déduction, non confirmée par l'éditeur) ([pricing](https://www.dialedhealth.com/pricing)).
- **Musculation** : « 15+ » plans de force structurés par discipline (route, gravel, XC, enduro), vidéos de démonstration propres pour chaque exercice, séances de mobilité et correctives à suivre en vidéo, programmes de 1 à 4 mois selon questionnaire (matériel, niveau, blessures) ([accueil](https://www.dialedhealth.com/)). Charges, RPE, tempo : ceux de TrainingPeaks.
- **Prix (vérifié le 30/09/2026)** — [dialedhealth.com/pricing](https://www.dialedhealth.com/pricing) : 30 $/mois ou 300 $/an (tarif de lancement jusqu'au 01/01/2027) ; coaching individuel : force seule 300 $/mois, force + vélo 600 $/mois, complet 1 250 $/mois, consultation 200 $.
- **Modèle** : athlète paie.
- **Intégrations / plateformes** : celles de TrainingPeaks.
- **Forces** : spécifique vélo/VTT, discipline par discipline (XC inclus) ; philosophie « dose minimale » ; vidéos maison.
- **Faiblesses** (forum TrainerRoad, janv. 2024) : support client lent, ancienne appli jugée instable.
- **Avis** ([fil TrainerRoad](https://www.trainerroad.com/forum/t/dialed-health-review/90227)) : « Exercises and programming are great » (un utilisateur, 01/2024) ; l'appli Android « shonky » selon un autre ; un troisième dit avoir payé deux mois sans réponse du support.
- **Ce qu'il fait mieux que CU** : programmes par discipline déjà écrits, marque reconnue chez les vététistes, vidéos humaines, offre de coaching payant (preuve qu'un marché « force pour cyclistes » paie 25-30 $/mois).
- **Ce que CU fait qu'il ne fait pas** : individualisation par le coach de l'athlète ; ajustement automatique de charge ; tempo, minuteurs et démonstration 3D intégrés ; tests ; hors-ligne sans compte ; gratuit.

#### 14. Strength Running (course)

- **Cible** : coureurs sur route, trail et ultra, souvent blessés à répétition ; média (podcast, blog) d'un coach américain.
- **Produit** : cours numériques, **pas d'appli**. « Injury Prevention for Runners 2.0 » : 17 leçons vidéo de routines de renforcement, 2 livres PDF, 18 plans (5 km à 100 miles) ([page](https://strengthrunning.com/injury-prevention-program/)). D'autres programmes (High Performance Lifting, Bodyweight Power…) sont cités dans des extraits de recherche, prix non revérifiés.
- **Musculation** : routines vidéo et PDF ; aucune saisie de charges, aucun suivi, aucune intégration.
- **Prix (vérifié le 30/09/2026)** : Injury Prevention 179 $ (accès complet) ou 79 $ (livres + vidéos), paiement unique, garantie 30 jours ([page](https://strengthrunning.com/injury-prevention-program/)).
- **Modèle** : athlète paie (infoproduit).
- **Plateformes** : web (téléchargement).
- **Forces** : audience (podcast), pédagogie, prix unique.
- **Faiblesses** : format statique ; mauvaise réputation du service client sur Trustpilot (1,9/5 sur 13 avis, [Trustpilot](https://www.trustpilot.com/review/strengthrunning.com)).
- **Avis** (Trustpilot) : un avis (09/2020) juge le programme de force « okay-ish » ; un autre (11/2022) estime les descriptions texte/vidéo insuffisantes pour qu'un débutant exécute les mouvements en sécurité.
- **Ce qu'il fait mieux que CU** : contenu éducatif, audience, plans de course complets.
- **Ce que CU fait qu'il ne fait pas** : tout l'aspect interactif (guidage, charges, RPE, ajustement, tests, suivi coach) ; la critique « pas assez clair pour un débutant » est précisément ce que le mannequin 3D + tempo visent.

#### 15. RideStrong (EverAthlete) — appli dédiée cyclistes

- **Cible** : cyclistes de tous niveaux, du débutant au pro ; classée n°1 des applis de force pour cyclistes par un média vélo (article du 31/08/2026, [Roadman Cycling](https://roadmancycling.com/best/best-cycling-strength-training-apps) — classement éditorial d'un média qui vend aussi son propre outil de planification).
- **Musculation** — [everathlete.com/ridestrong](https://www.everathlete.com/ridestrong) : 40+ programmes (2-3 séances/semaine ; débutant, jeunes niveaux 1-2, mobilité), vidéos d'exercices, substitutions et adaptations, journal des poids et répétitions, calendrier, activation avant sortie, mobilité ciblée, recommandation de programme par questionnaire (calendrier de courses, expérience, matériel : salle complète, minimaliste, poids du corps). RPE et ajustement automatique : **non mentionnés**.
- **Prix (vérifié le 30/09/2026)** : 20 $/mois ou 200 $/an ([page](https://www.everathlete.com/ridestrong)).
- **Modèle** : athlète paie.
- **Intégrations** : aucune mentionnée (ni Strava, ni Garmin, ni TrainingPeaks).
- **Plateformes** : appli web installable sur l'écran d'accueil (**PWA, comme CU**).
- **Forces** : c'est le **concurrent B2C le plus proche en positionnement** (force pour cyclistes, PWA, programmes par niveau, jeunes).
- **Faiblesses** : programmes génériques, pas de coach humain, pas d'intégration de charge.
- **Avis** : aucun avis utilisateur indépendant trouvé.
- **Ce qu'il fait mieux que CU** : 40+ programmes prêts à l'emploi, substitutions d'exercices, catalogue « jeunes », vente en direct (modèle économique prouvé).
- **Ce que CU fait qu'il ne fait pas** : séance écrite par le coach pour un athlète précis ; RPE/RIR et ajustement ; tempo sonore ; 3D ; proprio à niveaux ; tests au capteur ; récup ; relais intervals.icu ; gratuit.

#### 16. 10W2S — Strength for Running (Australie)

- **Cible** : coureurs ; conçu par un kinésithérapeute.
- **Musculation** : séances de 10 à 40 min, 3 à 5 jours/semaine, avec ou sans matériel, débutant à expert, vidéos, suivi des séances, gainage et pliométrie ([App Store](https://apps.apple.com/us/app/10w2s-strength-for-running/id1535607096)).
- **Prix (vérifié le 30/09/2026)** : 2,49 $/semaine, 6,99 $/mois, 45,99 $/an (App Store US).
- **Modèle** : athlète paie. **Plateformes** : iOS (Android non vérifié). **Intégrations** : aucune mentionnée.
- **Forces** : prix bas, crédibilité kiné, séances courtes.
- **Faiblesses** : peu d'utilisateurs (16 notes, 4,1/5) ; un avis (10/2023) regrette l'absence de repères sonores entre exercices et le besoin de regarder l'écran en permanence.
- **Avis** : « PT in my pocket » (un utilisateur, App Store) ; critique ci-dessus.
- **Ce qu'il fait mieux que CU** : programme autonome prêt à l'emploi pour coureurs, prix d'entrée minime.
- **Ce que CU fait qu'il ne fait pas** : bips de tempo et minuteurs (exactement le manque reproché), ajustement par RPE, coach humain, tests, vélo.

#### 17. StrengthApp — « Run Stronger »

- **Cible** : coureurs sur route, trail, endurance.
- **Musculation** : plans personnalisés après une évaluation initiale, jusqu'à 4 séances/semaine au choix, vidéos, suivi des progrès, unilatéral + pliométrie spécifique course + mobilité ([page](https://www.strengthapp.com/run-stronger/)).
- **Prix (vérifié le 30/09/2026)** : 74,99 $/an (pas d'option mensuelle affichée sur cette page).
- **Modèle** : athlète paie. **Plateformes** : iOS, Android, web. **Intégrations** : aucune mentionnée.
- **Forces** : contenu spécifique course, pliométrie, test initial.
- **Faiblesses** : pas de lien avec la charge d'endurance ; générique.
- **Avis** : la page revendique 4,9/5 sur l'App Store (non recoupé).
- **Ce qu'il fait mieux que CU** : produit B2C prêt à vendre, évaluation d'entrée automatisée.
- **Ce que CU fait qu'il ne fait pas** : coach humain, ajustement série par série, tempo, tests au capteur, récup, relais de charge.

---

### C. Écosystèmes montres / home-trainers

#### 18. Wahoo SYSTM (abonnement Wahoo Pro)

- **Cible** : cyclistes (home-trainer surtout), triathlètes.
- **Musculation** : vidéos de force, yoga et mobilité « à suivre » (instructeur à l'écran), niveaux progressifs, poids du corps majoritairement ; incluses dans l'offre Pro ([page abonnement Wahoo FR](https://fr-eu.wahoofitness.com/wahoo-app-subscription)). Pas de saisie de charges ni de programmation individuelle mentionnée.
- **Prix (vérifié le 30/09/2026)** : Base gratuit ; Core 4,99 €/mois ou 49,99 €/an ; Pro (SYSTM complet, force/yoga/mobilité) 17,99 €/mois ou 179,99 €/an ; 14 jours d'essai.
- **Modèle** : athlète paie. **Plateformes** : iOS, Android, Windows, macOS, Apple TV (non revérifié). **Intégrations** : Strava, TrainingPeaks, Garmin (non revérifié ici).
- **Forces** : vidéos guidées de qualité, intégrées au plan vélo ; test 4DP.
- **Faiblesses** : force légère (poids du corps), non chargée, non individualisée.
- **Avis** : un article BikeRadar (10/2023) ne fait que lister la force parmi les contenus ([guide](https://www.bikeradar.com/advice/buyers-guides/wahoo-systm-guide)) ; pas d'avis précis trouvé.
- **Ce qu'il fait mieux que CU** : vidéos à suivre avec instructeur ; écosystème home-trainer.
- **Ce que CU fait qu'il ne fait pas** : muscu chargée, prescrite par le coach, avec RPE et ajustement ; proprio, tests.

#### 19. Zwift

- **Musculation** : **aucune**. Les séances « Strength » de Zwift sont des intervalles sur le vélo (ex. séance « Strength Training » du plan Crit Crusher : seuil, sur-seuil, sprints) ([whatsonzwift](https://whatsonzwift.com/workouts/crit-crusher/week-3-day-1-strength-training)). Sur le forum officiel (01/2025), un utilisateur rappelle que le travail à basse cadence « just isn't going to cut it » à la place de la muscu ([forum Zwift](https://forums.zwift.com/t/strength-training/643814)).
- **Prix** : non vérifié (page de prix non ouverte).
- **Ce qu'il fait mieux / ce que CU fait en plus** : sans objet côté force ; complémentaire.

#### 20. Garmin (Connect, Connect+, Garmin Coach / Fitness Coach)

- **Cible** : tous les porteurs de montres Garmin — c'est l'environnement réel de la plupart des athlètes de Nathan.
- **Musculation** :
  - création de séances de force dans Garmin Connect parmi « plus de 1 600 » exercices ([blog Garmin](https://www.garmin.com/en-US/blog/fitness/how-to-work-out-with-garmin/)) ; animations sur téléphone et sur certaines montres ; comptage automatique des répétitions ;
  - Connect+ (6,99 $/mois ou 69,99 $/an, lancé le 27/03/2025, [communiqué Garmin](https://www.garmin.com/en-US/newsroom/press-release/wearables-health/elevate-your-health-and-fitness-goals-with-garmin-connect/)) affiche en direct sur le téléphone la FC, les vidéos et les répétitions pendant une séance en salle ;
  - selon the5krunner (03/2026), Garmin Fitness Coach génère des plans adaptatifs incluant des séances de force optionnelles (Fenix 8, Forerunner 970, Vivoactive 6, Venu X1), records par exercice ajoutés au 1er trimestre 2026 ; critique : compteur de répétitions peu fiable, pas de poids pré-rempli depuis la séance précédente ([the5krunner, 24/03/2026](https://the5krunner.com/2026/03/24/garmin-connect-plus-strength-apps/)) ;
  - en avril 2026, un sondage Garmin testait 8 concepts : « Acute Strength Load », préparation neuromusculaire, carte de récupération musculaire, ratio charge force/cardio… ([the5krunner, 02/04/2026](https://the5krunner.com/2026/04/02/garmin-strength-training-features-survey/)). **Signal fort** : Garmin veut quantifier la charge musculaire — exactement le trou que CU comble via intervals.icu. Rien n'est lancé à date (à surveiller).
- **Prix** : fonctions de base gratuites avec la montre ; Connect+ 6,99 $/mois ou 69,99 $/an (communiqué 2025 ; page produit non lisible au 30/09/2026).
- **Modèle** : matériel + abonnement optionnel. **Intégrations** : Strava, TrainingPeaks, intervals.icu, Apple Santé… (écosystème ouvert, non revérifié en détail).
- **Forces** : déjà au poignet ; FC pendant la séance ; comptage auto ; plans adaptatifs.
- **Faiblesses** : saisie pénible (corrections au bouton), pas de progression de charge, pas de prescription par un coach extérieur facile (sauf via TrainingPeaks).
- **Avis** : the5krunner juge que Garmin bâtit un produit de coaching de force « vertically integrated » derrière un abonnement.
- **Ce qu'il fait mieux que CU** : FC et comptage de reps au poignet ; 1 600 exercices ; intégration native dans la charge Garmin ; distribution massive.
- **Ce que CU fait qu'il ne fait pas** : séance écrite par le coach en langage naturel ; RPE/RIR → ajustement de charge ; tempo ; proprio à niveaux ; tests de mobilité au capteur ; récup ; vue coach multi-athlètes gratuite.

#### 21. COROS

- **Musculation** : bibliothèque de 200+ exercices animés dans l'appli, constructeur de séances de force envoyées à la montre, comptage auto des reps, saisie poids/reps, carte thermique musculaire ([the5krunner, 2020](https://the5krunner.com/2020/05/20/coros-strength-training-workout-builder/) — source ancienne). Mises à jour 2025 (extraits de recherche des notes COROS, pages d'aide en 403) : animations téléchargeables sur la montre, édition des reps et du poids en cours de séance, muscles principaux/secondaires dans la carte thermique (juillet 2025) ; report automatique des séries (décembre 2025). En 2020, la muscu n'entrait pas dans la charge d'entraînement ; statut 2026 non vérifié.
- **Prix** : inclus avec la montre (pas d'abonnement trouvé).
- **Modèle** : matériel. **Intégrations** : Strava, TrainingPeaks, intervals.icu (connues, non revérifiées), partenaire de la refonte force de Strava (05/2026).
- **Forces** : gratuit avec la montre, guidage au poignet.
- **Faiblesses** : saisie laborieuse, pas de prescription par un coach tiers, pas d'autorégulation.
- **Ce qu'il fait mieux que CU** : guidage et FC au poignet, comptage auto.
- **Ce que CU fait qu'il ne fait pas** : prescription par le coach, RPE → ajustement, tempo, proprio, tests, récup.

#### 22. Polar (FitSpark)

- **Musculation** : FitSpark propose chaque jour 2-4 séances selon récupération et historique, dont des circuits de force **au temps** (40 s de travail) avec animations et guidage pas à pas ; poids du corps ou avec disque/kettlebell/haltères ; les cibles les plus dures sont bloquées aux niveaux bas ; 17 montres compatibles ([aide Polar](https://support.polar.com/en/fitspark-daily-training-guide)). Saisie des charges : non documentée.
- **Prix** : inclus avec la montre ([polar.com](https://www.polar.com/en/smart-coaching/fit-spark)).
- **Forces** : guidage au poignet, adaptation à la récupération (Nightly Recharge).
- **Faiblesses** : circuits génériques au temps, pas de charge ni de progression en kg.
- **Ce qu'il fait mieux que CU** : sélection automatique de la séance du jour selon la récupération mesurée.
- **Ce que CU fait qu'il ne fait pas** : muscu chargée et prescrite, RPE par série, ajustement, proprio, tests.

#### 23. Suunto

- **Musculation** : guides SuuntoPlus pour suivre des séances de force pas à pas sur la montre ; une appli SuuntoPlus « Strength Tracker » (développée par un modérateur, discutée en 2025) compte les reps à l'accéléromètre et calcule un « Mechanical Load Score » ([forum Suunto](https://forum.suunto.com/topic/15409/strength-tracker)) ; détection jugée imparfaite par des testeurs. Plainte historique (fil ouvert en 07/2020) : pas de détail des exercices ni des poids dans l'appli Suunto ([forum](https://forum.suunto.com/topic/4895/strength-training-lacking-in-suunto-app)).
- **Prix** : inclus avec la montre.
- **Ce qu'il fait mieux que CU** : un « score de charge mécanique » au poignet (expérimental).
- **Ce que CU fait qu'il ne fait pas** : à peu près tout le guidage de la muscu.

---


## Partie 3 — Mesure, haut de gamme, outils français, IA de coaching

### Groupe 1 : mesure (capteurs et caméra)

#### 1. VERT (capteur de saut)

- **Précision sur le nom** : « Vert » a été compris comme VERT (myvert.com), capteur de détente verticale porté à la ceinture. Si la mission visait un autre « Vert », cette fiche est à revoir.
- **Cible** : volleyeurs et basketteurs, individus et équipes, préparateurs qui suivent la charge de sauts.
- **Fonctions** : hauteur de saut, nombre de sauts, force d'atterrissage, « énergie totale », sauts par minute, puissance, asymétrie (avec 2 capteurs) ; programme « Jump Higher » inclus.
- **Prix 2026** : capteur 199,99 $ ; lot de 20 ceintures 299,99 $ ; kits sport 249,99 $ ; offres équipe (VTS Basic/Advanced) sans prix affiché (vérifié le 30/09/2026, https://www.myvert.com/buy-now). Contenu premium de l'appli : 6,99 $/mois (App Store US, https://apps.apple.com/us/app/vert/id750050884).
- **Modèle** : matériel + abonnement optionnel à l'appli.
- **Intégrations** : aucune documentée sur les pages lues.
- **Plateformes** : iOS (fiche produit indique iOS 11 et vieux iPhone, signe d'un produit peu mis à jour) ; dernière mise à jour App Store : 9 septembre 2024.
- **Forces** : mesure objective du volume de sauts, utile en sports de saut ; bonne fiabilité intra-séance selon une étude sur volleyeuses élites (préprint SportRxiv).
- **Faiblesses** : surestime la hauteur absolue par rapport à la plateforme de force (biais de +4,6 à +7,6 cm selon le préprint SportRxiv ; lu via WebSearch, https://sportrxiv.org/index.php/server/preprint/view/733) ; appli vieillissante, note 3,1/5 (22 notes).
- **Avis réels** :
  - App Store US : « Gets worse after update? It was already difficult and clunky » (https://apps.apple.com/us/app/vert/id750050884).
  - App Store US, avis positif : l'appareil l'a « helped me measure my workout progress tremendously » (même lien).
- **Ce qu'il fait mieux que CU** : mesure réelle du saut par capteur (CU ne mesure pas la hauteur de saut en pliométrie) ; comptage automatique des sauts sur une séance entière.
- **Ce que CU fait qu'il ne fait pas** : programmation de musculation, ajustement de charge, proprio, récup, lien avec l'endurance (intervals.icu), gratuité, pas de matériel à acheter.

#### 2. Output Sports (capteur Output Capture V2 + Output Hub)

- **Cible** : préparateurs physiques de clubs pros, universités, lycées US, centres de rééducation, salles (y compris clubs HYROX).
- **Fonctions** : un seul capteur inertiel (IMU) pour plus de 180 tests (force, puissance, vitesse, VBT, pliométrie, mobilité, équilibre), profil charge-vitesse automatique, estimation du 1RM, classements, programmation (« Output Program »), rééducation.
- **Prix 2026** : **sur devis**. La page officielle dit seulement que le capteur coûte moins de 500 $ et que l'abonnement logiciel varie selon les fonctions et le nombre d'athlètes (https://www.outputsports.com/performance/velocity-based-training, lu le 30/09/2026) ; la page « Demo & Pricing » renvoie à une démo (https://www.outputsports.com/demo/demo). Le guide vbtcoach.com (mai 2026) donne « ~500 $ » le capteur et « contact sales » pour l'abonnement.
- **Modèle** : achat du matériel + abonnement annuel logiciel et « sports science support » ; garantie remboursement 30 jours.
- **Intégrations** : non détaillées sur les pages lues (non vérifié).
- **Plateformes** : iOS, Android (Output Capture), web (Output Hub).
- **Forces** : polyvalence (sauts, sprints, Nordic, lancers avec un seul capteur) ; prix matériel bas pour du « pro » ; validité correcte en saut contre-mouvement (étude citée par Output).
- **Faiblesses** : prix logiciel opaque ; le guide vbtcoach.com juge la validité VBT « faible » comparée aux capteurs linéaires ; peu d'avis publics indépendants (9 notes sur l'App Store US).
- **Avis réels** :
  - App Store (résumé via WebSearch) : un utilisateur trouve l'appareil « amazing » et note qu'il tient dans une poche ; un autre critique l'ergonomie du bouton de réglages (https://apps.apple.com/us/app/output-capture/id1547285249). Note : 5,0/5 sur 9 notes (US).
  - SimpliFaster (article de coach, contenu obtenu via WebSearch, page directe refusée en 403) : technologie jugée « user friendly » et « reasonably priced » (https://simplifaster.com/articles/output-sports-technology-review/).
- **Ce qu'il fait mieux que CU** : mesures objectives (vitesse de barre, saut, sprint) au lieu du ressenti RPE/RIR ; batterie de tests normés et comparaison entre athlètes ; suivi de rééducation.
- **Ce que CU fait qu'il ne fait pas** : zéro matériel, gratuit ; mannequin 3D et tempo guidé pour un athlète seul ; proprio auto-ajustée ; onglet Récup ; liaison avec la charge d'endurance via intervals.icu ; pensé pour l'athlète d'endurance, pas pour la salle d'une équipe.

#### 3. Metric (Metric VBT, caméra du téléphone)

- **Cible** : pratiquants de force, entraîneurs personnels, coachs d'équipes lycée/université ; pas de matériel.
- **Fonctions** : vitesse de barre par la caméra (60+ exercices), trajectoire de barre, estimation du 1RM, fatigue ; Metric Jump (hauteur de saut, iOS seulement), Metric Sprint (chrono sans cellules, iOS seulement) ; côté coach : séances multi-athlètes, constructeur de programmes, classements, suivi à distance, retour sonore en temps réel.
- **Prix 2026** : Solo 89,99 $/an (1 athlète, 25 Go de vidéo) ; Coach dès 199 $/an pour 5 athlètes, jusqu'à 500 athlètes ; mensuel possible, annuel ~30 % moins cher (https://www.metric.coach/pricing, lu le 30/09/2026). L'App Store US affiche des achats intégrés de 10,99 à 34,99 $/mois. Le guide vbtcoach.com (mai 2026) indique 64,99 $/an pour « Pro » : **contradiction**, la page officielle fait foi.
- **Modèle** : freemium + abonnement.
- **Intégrations** : non documentées sur les pages lues.
- **Plateformes** : iOS, Android (Lift), web ; Jump et Sprint iOS seulement.
- **Forces** : aucune dépense matérielle ; vidéo + données ; études de validation (r = 0,94 face à GymAware selon Metric, source commerciale) ; outils coach à distance.
- **Faiblesses** : détection des répétitions inégale (une étude PMC trouve un accord faible à modéré avec Vicon sur la vitesse moyenne ; meilleure au squat qu'au développé couché) ; il faut filmer chaque série de profil ; note 4,0/5 (45 notes US).
- **Avis réels** :
  - App Store US : « For not needing to buy equipment this is amazing » (https://apps.apple.com/us/app/metric-vbt-gym-workout-tracker/id1595510857).
  - Même page, avis négatif : reproche l'« inability to recognize reps time after time ».
- **Ce qu'il fait mieux que CU** : mesure objective de la vitesse (CU se fie au RPE/RIR déclaré) ; estimation du 1RM à partir de la vitesse ; saut et sprint mesurés.
- **Ce que CU fait qu'il ne fait pas** : pas besoin de poser un téléphone pour filmer chaque série ; guidage par mannequin 3D et tempo ; proprio, mobilité, récup ; séance écrite par le coach en langage naturel ; lien intervals.icu ; gratuit ; aucun compte.

#### 4. Enode (ex-Vmaxpro), capteur + Enode One / Enode Pro

- **Cible** : Enode One pour les individus ; Enode Pro pour clubs, préparateurs et structures multi-athlètes (revendique 145 000 athlètes depuis 2016).
- **Fonctions** : vitesse en direct, 17+ métriques, prédiction du 1RM, recommandations de charge et de répétitions, saisie manuelle au RIR (sans capteur), Apple Watch (comptage de répétitions), modèles de séances ; « Enode AI » qui guide la séance selon la forme du jour (fiche App Store) ; compatible poulies coniques (flywheel).
- **Prix 2026** : capteur 329 € sur la boutique Enode (d'après WebSearch ; 329 $ chez SimpliFaster) ; kit Enode/Eleiko 829 €. Abonnement Enode Pro+ mensuel : Free 0 € (3 athlètes), Trainer 39 €/mois (30 athlètes), Team 79 €/mois (100), Enterprise dès 159,90 €/mois (illimité) ; jusqu'à -15 % en annuel (https://enode.ai/pages/pricing, lu le 30/09/2026).
- **Modèle** : matériel + freemium/abonnement.
- **Intégrations** : API à partir de l'offre Trainer ; Apple Watch.
- **Plateformes** : iOS, Android (Enode Pro sur Google Play), Apple Watch, portail web.
- **Forces** : prix public clair en euros ; offre gratuite jusqu'à 3 athlètes ; validité correcte en recherche (ICC 0,94-0,99 en puissance, étude MDPI Life 2024) ; mode RIR sans capteur.
- **Faiblesses** : avis App Store très durs sur les répétitions manquées et l'interface de programmation ; surestime les vitesses faibles (étude citée par Enode).
- **Avis réels** :
  - App Store US : « Misses reps constantly » et interface « Horribly unintuitive and confusing » (https://apps.apple.com/us/app/enode-pro/id1571314781).
  - Même page : « the device is terrible. Extremely inconsistent and error prone ».
  - Blog d'un coach de sprint (2022) : « Occasionally I have issues with collecting data in the eccentric phase » (https://sprintingworkouts.com/blogs/training-equipment/enode-vmaxpro-review).
- **Ce qu'il fait mieux que CU** : mesure de vitesse réelle, profils charge-vitesse, API, gestion de 100+ athlètes, Apple Watch.
- **Ce que CU fait qu'il ne fait pas** : aucun capteur à acheter ; mannequin 3D, tempo, proprio, récup, tests de mobilité au téléphone ; séance dictée en langage naturel ; lien avec la charge d'endurance ; accès sans compte ni installation.

#### 5. Qwik VBT (caméra, iOS)

- **Cible** : haltérophiles et powerlifters, coachs de force.
- **Fonctions** : vitesse et trajectoire de barre par vidéo (apprentissage automatique), détection automatique des disques pour calculer la charge, vitesse moyenne/pic, amplitude, pause, comparaison de répétitions, export CSV/JSON.
- **Prix 2026** : gratuit ; Premium 27,99 $ en achat intégré (https://apps.apple.com/us/app/qwik-vbt-velocity-bar-tracker/id1660094818, lu le 30/09/2026).
- **Modèle** : freemium, achat unique.
- **Intégrations** : export de fichiers seulement.
- **Plateformes** : iOS.
- **Forces** : très bon marché ; bien noté (4,8/5, 40 notes) ; validation 2024 jugée « forte » par vbtcoach.com.
- **Faiblesses** : barre olympique seulement ; pas de programmation ni de gestion d'athlètes ; iOS seulement.
- **Avis réels** : App Store US : « This excellent software is free, which seems unbelievable » (lien ci-dessus).
- **Ce qu'il fait mieux que CU** : mesure vidéo de la vitesse et de la trajectoire de barre.
- **Ce que CU fait qu'il ne fait pas** : tout le reste (programmation, guidage, proprio, récup, lien coach-athlète, intervals.icu).

#### 6. My Jump Lab (My Jump 3), caméra

- **Cible** : préparateurs, kinés, chercheurs, étudiants STAPS ; très connu dans le milieu académique (développeur : Carlos Balsalobre, chercheur).
- **Fonctions** : batterie de tests par vidéo/capteurs du téléphone : sauts (CMJ, RSI…), vitesse de barre, sprint, etc.
- **Prix 2026** : gratuit 7 jours puis 5,99 $/mois, 39,99 $/an ou 105,99 $ à vie (d'après la fiche App Store renvoyée par WebSearch : https://apps.apple.com/us/app/my-jump-lab-my-jump-3/id1554077178 ; page non ouverte directement, **à reconfirmer**).
- **Modèle** : abonnement ou licence à vie.
- **Intégrations** : non vérifié.
- **Plateformes** : iOS, Android.
- **Forces** : outil de test validé scientifiquement pour le saut (étude MDPI 2024 comparant Enode et My Jump 3) ; prix bas.
- **Faiblesses** : validation VBT « mitigée » selon vbtcoach.com ; outil de test, pas de programmation.
- **Avis réels** : non collectés (pas d'avis individuel lu).
- **Ce qu'il fait mieux que CU** : tests de saut et de sprint mesurés, avec validité publiée, là où CU estime le max et mesure la mobilité.
- **Ce que CU fait qu'il ne fait pas** : programmation, guidage des séances, ajustement de charge, récup, lien coach-athlète.

**Ce qui existe en 2026 côté VBT par caméra (synthèse)** : d'après le guide vbtcoach.com mis à jour en mai 2026 (https://vbtcoach.com/blog/velocity-based-training-devices-buyers-guide) : Metric, Qwik VBT, My Jump Lab, Eliteform Tracker (iOS, ~5 $/mois), WL Analysis (8,99 $), plus une nouvelle appli LiDAR, BarSpeed (1 note sur l'App Store). Côté caméra fixée au rack, Perch a été racheté par Catapult en juin 2025. Beast Sensor, Push Band et TrueRep ont disparu. Deux constructeurs (Vitruve, Enode) intègrent désormais un générateur de séances « IA ». Source unique pour ce panorama : c'est un blog spécialisé, pas une source neutre.

---

### Groupe 2 : haut de gamme et clubs pros

Point commun : prix non publics pour les clubs, vendus sur devis avec matériel, installation, formation. Charge Utile ne joue pas dans cette catégorie ; ces fiches servent à savoir ce qu'un athlète de pôle ou de club pro connaît déjà, et à ne pas prétendre les concurrencer.

#### 7. Catapult (GPS Vector, Perch, AMS, IMPECT)

- **Cible** : clubs professionnels et universitaires (plus de 5 500 équipes selon Catapult en 2026), surtout sports collectifs d'extérieur.
- **Fonctions** : GPS/inertiel Vector (charge externe, vitesse, accélérations), vidéo, caméra de salle Perch (VBT par caméra fixée au rack, rachetée en juin 2025), analyse vidéo et scouting IMPECT (rachat 2025-2026), gestion d'athlètes.
- **Prix 2026** : **sur devis** pour les équipes. Ordre de grandeur public fiable : Catapult déclare une valeur annuelle de contrat (ACV) **supérieure à 30 000 $ par équipe pro** pour l'exercice 2026 (compte rendu des résultats FY26, 20/05/2026 : https://www.fool.com.au/2026/05/20/catapult-sports-reports-record-revenue-in-fy26/). ACV totale 133,8 M$, rétention client > 96 %. Offre grand public Catapult One : 179,99 $/an avec capteur et gilet (https://us-store.catapultsports.com/products/catapult-one, lu le 30/09/2026), mais d'après les résultats de recherche la vente individuelle a été arrêtée (à confirmer).
- **Modèle** : abonnement annuel (matériel inclus ou en location) + services.
- **Intégrations** : non détaillées dans les pages lues ; écosystème propre (vidéo, AMS, Perch).
- **Plateformes** : matériel porté, logiciels web/tablette, appli mobile.
- **Forces** : standard de fait dans le football et le rugby pros ; plateforme qui réunit GPS, vidéo et salle de muscu ; forte rétention.
- **Faiblesses** : coût ; besoin d'un analyste dédié (« massive amounts of information that can overwhelm coaching staffs », eyesup.football, 16/06/2026) ; pensé pour les sports collectifs, pas pour le VTT ou le trail.
- **Avis réels** :
  - Trustpilot Catapult One (grand public) : note 2,6/5 sur 928 avis ; plaintes récurrentes sur la fiabilité et le capteur lié à un seul abonnement (https://www.trustpilot.com/review/one.catapultsports.com).
  - Article d'analyse 2026 : investissement matériel + abonnement jugé important (https://www.eyesup.football/articles/catapult-sports-gps-review-2026-complete-analysis-for-footba).
- **Ce qu'il fait mieux que CU** : mesure objective de la charge externe sur le terrain ; VBT automatique en salle (Perch) ; vidéo et gestion de toute une équipe ; données fiables pour le staff médical.
- **Ce que CU fait qu'il ne fait pas** : prescription de la séance de muscu et guidage de l'athlète seul (mannequin 3D, tempo) ; ajustement de charge par RPE/RIR ; proprio, récup, nutrition ; gratuit et sans matériel ; lien avec les données d'endurance de l'athlète (intervals.icu).

#### 8. KINEXON Sports (Perform LPS, Perform IMU, GPS Pro)

- **Cible** : ligues, fédérations et clubs pros de sports en salle (NBA, Handball-Bundesliga, basket, volley, hockey), plus de 500 équipes revendiquées.
- **Fonctions** : suivi de position en salle (LPS, antennes), capteur inertiel porté (Perform IMU) utilisable en salle de muscu et en rééducation, sauts, charge d'accélération, étiquetage d'exercices, tableaux de bord, « insights » IA, suivi du retour au jeu ; outils pour ligues (arbitrage, diffusion).
- **Prix 2026** : **sur devis**, aucun prix public trouvé (pages produits lues le 30/09/2026 : https://kinexon-sports.com/products/perform-imu/). Aucun ordre de grandeur public fiable trouvé : **non vérifié**.
- **Modèle** : contrat entreprise (matériel + logiciel + services), souvent via la ligue (ex. partenariat HBL prolongé jusqu'en 2029, selon WebSearch).
- **Intégrations** : se combine avec GPS et LPS, plateforme KINEXON unifiée ; API (d'après un tiers).
- **Plateformes** : capteurs, logiciel web/tablette.
- **Forces** : précision en salle ; très implanté en NBA et en handball allemand ; un profil athlète unique entre terrain, salle et rééducation.
- **Faiblesses** : réservé aux structures pros ; pas de prescription de musculation individuelle ; aucun avis utilisateur public exploitable trouvé.
- **Avis réels** : aucun avis individuel trouvé (pages d'avis inaccessibles, 403 sur wareable.com). **Non vérifié.**
- **Ce qu'il fait mieux que CU** : mesure fine et en direct de la charge de jeu et de saut d'une équipe entière.
- **Ce que CU fait qu'il ne fait pas** : programmer et guider la muscu d'un athlète d'endurance seul, hors-ligne, gratuitement.

#### 9. Hudl (vidéo, Sportscode, Wyscout, WIMU)

- **Cible** : lycées et clubs US, universités, clubs pros et analystes vidéo ; football US, soccer, basket.
- **Fonctions** : captation et analyse vidéo, caméras automatiques Focus, statistiques Assist, Sportscode (analyse pro), GPS WIMU (350+ métriques, API), résumés de performance par IA (offre lycée).
- **Prix 2026** : lycée par programme : Silver+ 1 500 $/an, Gold+ 2 500 $/an, Platinum+ 4 000 $/an ; département sportif et Division I/pro **sur devis** (https://www.hudl.com/pricing/high-school, lu le 30/09/2026). WIMU : sur devis (gilets à 35 $).
- **Modèle** : abonnement annuel par équipe ou par établissement + matériel.
- **Intégrations** : non détaillées sur les pages lues ; API WIMU.
- **Plateformes** : web, iOS, Android, logiciel Mac (Sportscode), capteurs.
- **Forces** : quasi-monopole de la vidéo dans le sport scolaire US ; gamme complète vidéo + GPS.
- **Faiblesses** : prix contesté ; appli mobile moins bonne que le bureau ; peu tourné vers la préparation physique individuelle.
- **Avis réels** :
  - Capterra : « The PRICE!!!! It is a fight every year in a public school » (avis de février 2023, https://www.capterra.com/p/265872/Hudl/).
  - Même page : « It works well on a desktop, easy to use, intuitive » (juin 2025).
- **Ce qu'il fait mieux que CU** : vidéo d'équipe, analyse tactique, captation automatique, GPS pro.
- **Ce que CU fait qu'il ne fait pas** : muscu prescrite et guidée pour l'athlète d'endurance, ajustement de charge, proprio, récup ; gratuité.

#### 10. Teamworks AMS (ex-Smartabase)

- **Cible** : clubs pros, départements sportifs universitaires, comités olympiques et fédérations, armées.
- **Fonctions** : base de données athlètes configurable : charge, tests, questionnaires de bien-être, nutrition, dossier médical, retour au jeu, surveillance des blessures, alertes automatiques, tableaux de bord ; « Teamworks Intelligence » (IA et modèles prédictifs, surtout orientés recrutement universitaire US).
- **Prix 2026** : **sur devis** (https://teamworks.com/ams, lu le 30/09/2026 : aucun prix). Ordre de grandeur : aucun chiffre public fiable trouvé ; un blog d'éditeur (raftlabs.com, non ouvert, contenu vu via WebSearch) affirme que les frais de mise en place égalent souvent la licence de la première année : **info faible**.
- **Modèle** : licence annuelle entreprise + mise en place.
- **Intégrations** : « 100+ intégrations » revendiquées, API, paquet R.
- **Plateformes** : web, applis mobiles ; interface disponible en français.
- **Forces** : très configurable ; conformité (ISO 27001, SOC 2, HIPAA) ; utilisé par des instituts nationaux (le modèle « AMS » des pôles).
- **Faiblesses** : lourd à mettre en place, demande un administrateur ; inadapté aux petites structures (même le site tiers sports.toolsinfo.com le dit) ; ne prescrit pas de séance guidée à l'athlète.
- **Avis réels** : aucun avis public exploitable trouvé (SourceForge : 0 avis ; page Capterra en 404). **Non vérifié.**
- **Ce qu'il fait mieux que CU** : centraliser toutes les données (médical, tests, charge, bien-être) d'une structure entière avec droits d'accès et conformité.
- **Ce que CU fait qu'il ne fait pas** : fabriquer et guider la séance elle-même (3D, tempo, ajustement), sans compte ni administrateur ; gratuit.

---

### Groupe 3 : outils français (ou très utilisés en France)

**Kiffit : introuvable.** Aucune appli française de coaching nommée « Kiffit » n'a été trouvée (recherches du 30/09/2026). Les résultats proches sont KIFF (suivi de dates de péremption, sans rapport) et **KIFIT**, une appli Android/iOS dont l'identifiant (`com.trainerize.kifit`) montre qu'il s'agit d'une appli en marque blanche de Trainerize (plateforme canadienne pour coachs personnels), sans lien établi avec la France (https://play.google.com/store/apps/details?id=com.trainerize.kifit&hl=en_US, vue via WebSearch seulement). **Kiffit n'est donc pas retenu.** Nolio est traité par un autre agent.

#### 11. MyCoach Pro (ex-MyCoach Sport)

- **Cible** : fédérations (volley, baseball-softball, etc., avec des applis « MyCoach by FFvolley », « MyCoach by FFBS »), clubs pros et amateurs, centres de formation, pôles. Site principal passé de mycoachsport.com à mycoachpro.io (redirection 301 constatée le 30/09/2026).
- **Fonctions** : gestion d'équipe (calendrier, messagerie, effectif, présences, statistiques) ; bibliothèque technique fédérale ; volet « AMS » (questionnaires wellness et RPE, charge d'entraînement, état de forme de l'équipe, données médicales) ; module scouting (accès Opta) ; accompagnement par un data scientist ; conformité RGPD/HDS mise en avant.
- **Prix 2026** (lus dans le code de la page https://mycoachpro.io/, application monopage, le 30/09/2026) : licences **par membre du staff**, athlètes illimités : Essentiel 20 € HT/mois, Avancé 40 € HT/mois, Expert 50 € HT/mois ; option « Essentiel Club » 99 € TTC/mois pour 25 staffs ; scouting 40 € HT/mois/utilisateur ; ateliers 250 € HT ; « Pack Saison » data scientist 2 400 à 7 200 € HT/saison ; mise en place 500 € HT. Le site affirme un coût médian client de 5 000 €/an (chiffre de l'éditeur, non vérifiable). Le balisage de la page annonce une offre d'entrée à 49 €. Côté fédérations, l'appli est gratuite pour les licenciés (applis MyCoach by FFvolley/FFBS gratuites).
- **Modèle** : licences SaaS par staff + services ; gratuit pour l'utilisateur final quand une fédération paie.
- **Intégrations** : non détaillées dans ce qui a été lu (mention d'un module GPS ; accord avec la LFFP, ligue de football féminin professionnel).
- **Plateformes** : web, iOS, Android.
- **Forces** : acteur français installé dans l'écosystème fédéral ; prix par staff lisible ; athlètes illimités ; données hébergées en France/UE.
- **Faiblesses** : positionnement qui glisse vers l'AMS de club pro et le scouting, loin du préparateur isolé ; applis fédérales peu mises à jour (FFvolley : dernière version juin 2024) ; discours marketing très appuyé (« assurance » contre les pertes).
- **Avis réels** :
  - App Store, MyCoach by FFvolley : un utilisateur « Very disappointed », interface à revoir, rien ne change (https://apps.apple.com/fr/app/mycoach-by-ffvolley/id1448858141). Note 4,4/5 sur 19 avis.
  - App Store, MyCoach Pro AMS : 4,7/5 sur 13 notes ; avis positif de novembre 2023 (https://apps.apple.com/fr/app/mycoach-pro-ams/id1643524841).
- **Ce qu'il fait mieux que CU** : gestion d'une équipe entière et d'un staff, relais fédéral, questionnaires wellness/RPE à l'échelle d'un club, conformité HDS, scouting.
- **Ce que CU fait qu'il ne fait pas** : la séance de muscu elle-même, guidée pas à pas (3D, tempo, minuteurs) et ajustée série par série ; proprio et pliométrie ; spécialisation endurance et lien intervals.icu ; gratuité pour le coach.

#### 12. Athlète 360 (INSEP / Sport Data Hub)

- **Cible** : sportifs de haut niveau inscrits sur liste ministérielle, leurs entraîneurs et staffs (équipes de France, pôles). C'est l'outil public du réseau haute performance français ; la FF Lutte l'utilise pour ses équipes de France seniors depuis juin 2020.
- **Fonctions** : plans d'entraînement, consignes et exercices, saisie de l'entraînement, des tests et des compétitions, questionnaire wellness quotidien (forme, sommeil, fatigue…), déclaration de douleurs et blessures, RPE et comparaison prévu/réalisé, tableaux de bord (https://www.fflutte.com/athlete-management-system-ams/, lu le 30/09/2026).
- **Point clé** : la fiche App Store indique que l'appli sert à accéder à **la plateforme Smartabase** (https://apps.apple.com/fr/app/athlete360/id1504890953). Athlète 360 est donc une instance de Teamworks AMS (fiche 10) déployée par l'INSEP.
- **Prix 2026** : gratuit pour l'athlète et son staff (financé par l'État) ; accès réservé aux structures du réseau. Aucun prix public.
- **Modèle** : service public.
- **Intégrations** : Apple Santé (si l'administrateur l'active), celles de Smartabase.
- **Plateformes** : iOS, Android, web.
- **Forces** : déjà dans la poche des athlètes de pôle et de liste ; gratuit ; données centralisées au niveau national.
- **Faiblesses** : réservé aux listés ; interface Smartabase en anglais sur l'App Store ; peu de guidage de séance ; 8 notes seulement sur l'App Store FR (4,5/5), dernière version décembre 2024.
- **Avis réels** : aucun avis individuel exploitable lu. **Non vérifié.**
- **Ce qu'il fait mieux que CU** : légitimité institutionnelle, suivi médical et wellness partagé avec toute la structure (médecin, kiné, entraîneur).
- **Ce que CU fait qu'il ne fait pas** : accessible aux non-listés (régional à national, exactement les athlètes de Nathan) ; séance guidée en 3D avec tempo et ajustement automatique ; contenu spécifique VTT/trail ; lien intervals.icu. **Risque** : un athlète de pôle au CREPS de Font-Romeu utilise peut-être déjà Athlète 360 ; CU devrait pouvoir coexister (exporter ou ne pas doubler la saisie).

#### 13. ThePerfClub (start-up française)

- **Cible** : sportifs individuels, préparateurs physiques, coachs en ligne, clubs.
- **Fonctions** : autorégulation quotidienne de la séance selon un questionnaire wellness (Hooper & Mackinnon), charge aiguë/chronique, monotonie, contrainte (Foster), modèle forme/fatigue (Banister) ; corrélations entre comportements de la veille (alcool, écran, sommeil) et forme ; 85 tests interprétés par rapport à des ratios de la littérature ; 44+ programmes (musculation, marathon, sprint, Hyrox, ski, post-LCA…) dont « les premières séances sont générées automatiquement » ; tableau de bord équipe « Coach Control » (https://www.theperfclub.com/, lu le 30/09/2026).
- **Prix 2026** : formule sportif 78 €/an (6,50 €/mois) ou 9 €/mois sans engagement, 14 jours offerts (page d'accueil, lue le 30/09/2026). Formule coach : « dès 29 €/mois » selon un résumé WebSearch, et « à partir de 69 €/mois » selon Capterra Luxembourg (fiche de 2023) : **contradictoire, non vérifié sur une page de prix officielle** (https://www.capterra.lu/software/1018608/theperfclub).
- **Modèle** : abonnement (B2C et B2B).
- **Intégrations** : la page insiste sur le fait qu'aucun capteur n'est nécessaire ; pas d'intégration Garmin/Strava/intervals.icu mentionnée sur la page lue (non vérifié).
- **Plateformes** : web, iOS, Android.
- **Forces** : **le concurrent français le plus proche de CU sur l'idée** (ajuster la séance à l'état du jour par le ressenti) ; références scientifiques affichées ; prix bas pour l'athlète.
- **Faiblesses** : pas de guidage d'exécution en séance visible (vidéo/3D, tempo) ; généraliste (tous sports), pas spécialisé endurance ; peu d'avis publics (aucun sur Capterra) ; l'éditeur publie beaucoup de comparatifs « X vs ThePerfClub » (contenu SEO, à lire comme du marketing).
- **Avis réels** : aucun avis utilisateur trouvé. **Non vérifié.**
- **Ce qu'il fait mieux que CU** : suivi wellness quotidien structuré et modèles de charge (ACWR, monotonie) ; corrélations comportement-forme ; bibliothèque de programmes prêts à l'emploi ; tests comparés à la littérature.
- **Ce que CU fait qu'il ne fait pas** : ajustement **série par série** (RPE/RIR après chaque série) plutôt qu'à la séance ; mannequin 3D et bips de tempo ; proprio 4 niveaux ; mobilité mesurée au capteur du téléphone ; lien avec la charge d'endurance réelle (intervals.icu) ; aucun compte ; gratuit.

#### 14. KINVENT (Montpellier) : capteurs connectés + appli

- **Cible** : kinés, médecins du sport, préparateurs physiques, clubs, chercheurs ; 80+ pays, 50+ distributeurs (https://kinvent.com/, lu le 30/09/2026).
- **Fonctions** : dynamomètres (K-Push, K-Grip, K-Pull), plateformes de force (K-Force Plates, K-Deltas), capteur inertiel K-Power, goniomètre K-Move, EMG K-Myo ; appli avec biofeedback, 100+ protocoles guidés, jeux de rééducation, rapports ; fonctionne hors-ligne (fiche App Store).
- **Prix 2026** : plateformes K-Force Plates 2 290 € chez un revendeur (vu via WebSearch, https://www.elitemedicale.fr/shop/cmarkp73006-kforce-plates-v3-68278, non ouvert) ; licences appli chez le revendeur Sport Orthèse : Starter 280 € puis 28 €/mois, Premium 480 € puis 48 €/mois, Excellence 950 € puis 95 €/mois (https://www.sport-orthese.com/appareils-de-biofeedback/2900-licence-kinvent-physio-starter.html, lu le 30/09/2026). L'App Store FR affiche des achats intégrés de 27,99 à 499,99 €.
- **Modèle** : matériel + licence logicielle.
- **Intégrations** : cloud KINVENT Connect, accès patient MyKINVENT (offres hautes).
- **Plateformes** : iOS, Android, Amazon Appstore.
- **Forces** : français, dispositif médical certifié (CE, ISO 13485) ; mesures objectives de force, d'équilibre et de mobilité ; très utilisé en cabinet de kiné.
- **Faiblesses** : coût du matériel ; orienté bilan et rééducation plus que programmation d'entraînement.
- **Avis réels** : App Store FR : bilans « en moins de 30s » et suivi objectif de la rééducation (https://apps.apple.com/fr/app/kinvent/id1625709856). Note 4,6/5 sur 15 notes.
- **Ce qu'il fait mieux que CU** : mesure réelle de la force, de l'équilibre (proprio) et des asymétries ; valeur médicale.
- **Ce que CU fait qu'il ne fait pas** : proprio et mobilité **sans matériel** (capteur du téléphone), programmation et guidage des séances de muscu, gratuité.

#### 15. AthleteMonitoring (FITSTATS, Canada, interface française)

- **Précision** : éditeur québécois (FITSTATS Technologies), pas français, mais site et tarifs en français et en euros ; fiche retenue parce qu'il se présente comme outil de préparation physique, de suivi médical et de RPE pour clubs et programmes d'excellence. Clients français **non vérifiés** (athletemonitoring.fr renvoie une erreur 403).
- **Cible** : organisations sportives d'élite, comités olympiques, universités, sport-études.
- **Fonctions** : état de forme (wellness), charge d'entraînement, programmation d'entraînements, blessures et maladies, tests.
- **Prix 2026** (https://www.athletemonitoring.com/tarifs/?lang=fr, lu le 30/09/2026), par athlète et par an, pour 50 à 100 athlètes : moins de 18 ans 4 / 11 / 18 € (Starter / Pro / Expert) ; U23 9 / 18 / 31 € ; amateurs élite 23 ans et plus 13 / 38 / 51 € ; pros 25 / 75 / 126 €. Comptes coachs et administrateurs gratuits.
- **Modèle** : abonnement par athlète, dégressif.
- **Intégrations** : non détaillées dans la page lue.
- **Plateformes** : web, iOS, Android.
- **Forces** : prix public et bas par athlète ; multi-sports, multi-équipes, marque personnalisable.
- **Faiblesses** : outil de suivi plus que d'exécution ; pas de guidage de séance.
- **Avis réels** : aucun avis lu. **Non vérifié.**
- **Ce qu'il fait mieux que CU** : suivi médical et blessures, gestion de centaines d'athlètes, rapports pour une structure.
- **Ce que CU fait qu'il ne fait pas** : séance guidée et auto-ajustée pendant l'exécution, 3D, tempo, proprio, récup ; gratuité totale ; aucun compte athlète.

**Autres pistes françaises examinées et non retenues** : SportEasy (gestion de club amateur : convocations, cotisations, pas de préparation physique) et des logiciels pour coachs de fitness (Wellmate, InfinyFit, Hexfit) apparus dans les recherches mais non ouverts ni vérifiés ; ils visent le coaching de salle, pas les clubs ou pôles.


---

### Groupe 4 : IA de coaching 2025-2026

**Vi (LifeBEAM, coach vocal de course, 2017)** : non retenu. Le site getvi.com ne répond plus (échec de connexion, 30/09/2026) ; les seules traces trouvées sont des tests de 2017-2018. Considéré comme **disparu**, sans confirmation officielle de fermeture.

#### 16. Athletica

- **Cible** : athlètes d'endurance autonomes (course, triathlon, vélo, aviron, HYROX), et coachs (profils coach via API).
- **Fonctions** : plan adaptatif selon la performance et la récupération, test de condition initiale, « AI Coach » qui analyse et suggère sans modifier seul le plan (« The AI Coach does not automatically modify your training »), chat avec le coach IA ajouté en 2025-2026 (notes de version App Store).
- **Prix 2026** : 19,90 $/mois, 99 $ les 6 mois, 189 $/an, essai 2 semaines (https://www.athletica.ai/pricing, lu le 30/09/2026 ; mêmes prix sur l'App Store).
- **Modèle** : abonnement B2C.
- **Intégrations** : Garmin, Strava, Coros, Wahoo, Concept2, et **intervals.icu**.
- **Plateformes** : iOS, Android, web.
- **Forces** : prudence revendiquée (l'athlète valide) ; bases scientifiques ; lien intervals.icu.
- **Faiblesses** : pas de musculation guidée ; interface pensée pour la course et le triathlon.
- **Avis réels** : App Store US, 4,2/5 sur 41 notes ; un utilisateur parle de « a game changer » pour adapter les séances à sa forme (https://apps.apple.com/us/app/athletica-ai-training-plans/id6737747559).
- **Ce qu'il fait mieux que CU** : planification complète de l'endurance par IA, sans coach humain.
- **Ce que CU fait qu'il ne fait pas** : séance de muscu détaillée et guidée (3D, tempo, RPE/RIR série par série), proprio, pliométrie ; coach humain qui garde la main ; gratuit.

#### 17. AI Endurance

- **Cible** : coureurs, cyclistes, triathlètes autonomes.
- **Fonctions** : « jumeau numérique » (réseau de neurones entraîné sur les données de l'athlète) qui choisit le plan maximisant la performance prédite ; récupération (VFC), durabilité, nutrition, coach IA conversationnel.
- **Prix 2026** : la page officielle charge ses prix dynamiquement (non lisibles, https://aiendurance.com/en/pricing) ; App Store US : 20 $/mois ou 200 $/an (https://apps.apple.com/us/app/ai-endurance/id6714485075, lu le 30/09/2026). Un résumé WebSearch évoque ~130 $/an en direct : **non vérifié**.
- **Modèle** : abonnement, essai 14 jours sans carte.
- **Intégrations** : synchronisation bidirectionnelle Garmin, Strava, Coros, etc.
- **Plateformes** : iOS, Android (appli web empaquetée), web.
- **Forces** : modèle individuel sophistiqué ; tout-en-un endurance.
- **Faiblesses** : pas de musculation ; confiance des utilisateurs fragile quand il faut corriger l'IA.
- **Avis réels** : App Store US (4,2/5, 24 notes) : « If I have to manually correct the intensity myself, the AI isn't doing » son travail (lien ci-dessus).
- **Ce qu'il fait mieux que CU** : planification endurance automatique et modèle de performance individuel.
- **Ce que CU fait qu'il ne fait pas** : muscu, proprio, guidage d'exécution ; gratuité ; décision gardée par le coach.

#### 18. TrainerRoad (« TrainerRoad AI »)

- **Cible** : cyclistes (surtout home-trainer), triathlètes.
- **Fonctions** : Adaptive Training, AI Training Simulation (vue à 4 semaines, « hundreds of simulations »), détection et prédiction de FTP par IA, prédiction de la fatigue, séances IA à la demande, alternatives de séances (https://www.trainerroad.com/blog/whats-new-with-trainerroad-ai/, article début 2026). Prend en compte les activités de musculation déclarées dans la charge, et propose un « Strength Calculator », mais ne programme pas de séance de muscu guidée.
- **Prix 2026** : 21,99 $/mois ou 209,99 $/an (https://www.trainerroad.com/pricing, lu le 30/09/2026).
- **Modèle** : abonnement.
- **Intégrations** : Garmin, Strava, Wahoo, Zwift.
- **Plateformes** : iOS, Android, Windows, macOS.
- **Forces** : IA d'adaptation mûre et éprouvée ; énorme base d'utilisateurs (4,8/5 revendiqué sur 55 000 avis).
- **Faiblesses** : cyclisme d'abord ; pas de conversation ni de LLM ; muscu absente.
- **Avis réels** : note agrégée revendiquée par TrainerRoad (https://www.trainerroad.com/pricing) ; aucun avis individuel lu. **Faible.**
- **Ce qu'il fait mieux que CU** : prescription du travail vélo, adaptation automatique très fine au home-trainer.
- **Ce que CU fait qu'il ne fait pas** : la muscu spécifique VTT/route guidée, proprio, récup ; gratuité ; coach humain.

#### 19. Freeletics (Coach IA)

- **Cible** : grand public, poids du corps, salle, à la maison.
- **Fonctions** : l'« AI Coach » crée chaque séance selon objectifs, niveau et retours ; 700+ exercices ; poids du corps, haltères, machines ; offre nutrition.
- **Prix 2026** : App Store US : Coach Training 34,99 à 79,99 $ (3/6/12 mois), pack entraînement + nutrition 49,99 à 89,99 $ (https://apps.apple.com/us/app/freeletics-workouts-fitness/id654810212, lu le 30/09/2026). Pas de mensuel.
- **Modèle** : abonnement par blocs.
- **Intégrations** : non vérifié.
- **Plateformes** : iOS, Android.
- **Forces** : marque connue, 22 000 notes à 4,6/5 ; séances courtes générées automatiquement.
- **Faiblesses** : peu de personnalisation manuelle ; pas pensé pour l'athlète d'endurance ni pour un coach.
- **Avis réels** : App Store US : regret de « Not being able to customize the workouts » (lien ci-dessus).
- **Ce qu'il fait mieux que CU** : génération automatique pour un grand public sans coach ; base de contenu massive.
- **Ce que CU fait qu'il ne fait pas** : programmation par un coach qui connaît l'athlète, spécifique endurance, proprio 4 niveaux, lien intervals.icu, gratuit.

#### 20. Alpha Progression

- **Cible** : pratiquants de musculation (hypertrophie, force), débutants à intermédiaires.
- **Fonctions** : génération de programme (splits), recommandations de charge et de répétitions **pour chaque série** selon les performances passées, suivi du RIR, périodisation et décharges (Pro), 795 vidéos d'exercices filmées en salle, fonctionne hors-ligne.
- **Prix 2026** : gratuit (journal illimité) ; Pro 12,99 $/mois ou 79,99 $/an (https://alphaprogression.com/en et App Store, lus le 30/09/2026).
- **Modèle** : freemium.
- **Intégrations** : Apple Santé ; export CSV.
- **Plateformes** : iOS (iPhone), Android.
- **Forces** : **fait déjà ce que CU met en avant (ajustement série par série, RIR)**, très bien noté (4,9/5, 2 200+ notes US), 5 M de téléchargements revendiqués.
- **Faiblesses** : pas de cardio ni de souplesse (sites d'avis) ; plans générés parfois mal ciblés ; pas de coach humain ; pas d'endurance.
- **Avis réels** : App Store : un pratiquant de 20 ans dit que l'appli a « completely replaced my need for a notebook » (https://apps.apple.com/app/id1462277793).
- **Ce qu'il fait mieux que CU** : vidéos réelles de 795 exercices, historique et graphiques riches, maturité produit.
- **Ce que CU fait qu'il ne fait pas** : séance écrite par un coach humain, spécifique endurance ; proprio, pliométrie, tests de mobilité, récup ; tempo audio ; lien avec la charge d'endurance ; aucun compte, gratuit.

#### 21. Dr. Muscle

- **Cible** : pratiquants de musculation, notamment 40 ans et plus.
- **Fonctions** : programme mis à jour automatiquement après chaque séance (périodisation ondulatoire quotidienne, rest-pause, décharges), 500+ exercices, chat communautaire avec coachs.
- **Prix 2026** : 48,99 $/mois ou 399,99 $/an ; repas +18,99 $/mois (https://apps.apple.com/us/app/dr-muscle-ai-personal-trainer/id1073943857, lu le 30/09/2026).
- **Modèle** : abonnement premium.
- **Intégrations** : Apple Santé.
- **Plateformes** : iOS, Android.
- **Forces** : automatisation poussée ; 4,5/5 sur 382 notes.
- **Faiblesses** : l'une des applis grand public les plus chères ; blogs concurrents signalent des difficultés de résiliation (non vérifié directement).
- **Avis réels** : App Store US : « The app does everything for you! » (lien ci-dessus).
- **Ce qu'il fait mieux que CU** : programme d'hypertrophie entièrement automatique.
- **Ce que CU fait qu'il ne fait pas** : spécificité endurance, coach humain, proprio, récup, gratuité (écart de prix : 400 $/an contre 0).

#### 22. Garmin Connect+ (Active Intelligence)

- **Cible** : tous les porteurs de montres Garmin (très répandues chez les vététistes et traileurs).
- **Fonctions** : « Active Intelligence » : conseils du jour générés par IA à partir de la charge, du sommeil, de la VFC ; explications de la récupération ; recommandations de séances poussées vers la montre (d'après shoulditrain.com, blog d'un concurrent) ; tableaux de bord, LiveTrack étendu, badges.
- **Prix 2026** : 8,99 €/mois ou 89,99 €/an, essai 30 jours (Clubic, 27/03/2025 : https://www.clubic.com/actualite-558960-garmin-lance-une-version-premium-de-son-application-de-fitness-avec-une-grosse-dose-d-ia.html) ; 6,99 $/mois aux États-Unis. Page officielle Garmin non ouverte (404 sur l'URL essayée) : prix 2026 **non revérifié sur le site Garmin**.
- **Modèle** : abonnement optionnel ; fonctions de base gratuites.
- **Intégrations** : écosystème Garmin.
- **Plateformes** : iOS, Android, montres Garmin.
- **Forces** : déjà au poignet des athlètes ; données physiologiques riches.
- **Faiblesses** : conseils jugés génériques et sans dialogue ; accueil mitigé (« pas très concret pour 90 €/an », commentaire relayé par Clubic) ; pas de programmation de musculation mentionnée.
- **Avis réels** : lecteur Clubic : une version premium « unnecessary » avec de l'IA (résumé traduit, lien ci-dessus) ; shoulditrain.com : « Real coaching requires dialogue » (https://www.shoulditrain.com/blog/garmin-connect-plus-review, source partiale).
- **Ce qu'il fait mieux que CU** : mesure continue (sommeil, VFC, charge) et conseils quotidiens automatiques.
- **Ce que CU fait qu'il ne fait pas** : séance de muscu construite par un coach, guidée et ajustée ; proprio ; gratuité. **Opportunité** : CU pourrait lire la forme Garmin via intervals.icu plutôt que la concurrencer.

#### 23. WHOOP (WHOOP AI / Coach + Strength Trainer)

- **Cible** : sportifs et grand public « performance », abonnés au bracelet.
- **Fonctions** : coach conversationnel (WHOOP AI) ; depuis février 2026, **génération de séances de musculation par texte ou par capture d'écran** d'un autre programme, avec exercices, séries, répétitions, charges suggérées selon l'historique et le score de récupération ; version allégée proposée si récupération basse ; mesure de la « charge musculaire » (https://gadgetsandwearables.com/2026/02/22/whoop-ai-beta/, lu le 30/09/2026).
- **Prix 2026** : One 199 $/an, Peak 239 $/an, Life 359 $/an, bracelet inclus (https://trackervs.com/pricing/whoop-pricing/, site tiers, lu le 30/09/2026 ; page officielle join.whoop.com refusée en 403).
- **Modèle** : abonnement avec matériel.
- **Intégrations** : non vérifié.
- **Plateformes** : bracelet, iOS, Android.
- **Forces** : **c'est exactement le geste « je décris ma séance, l'IA l'écrit »**, adossé à des données de récupération réelles.
- **Faiblesses** : tout se passe dans un chat, pas de vrai programme proactif (demande d'un utilisateur, forum WHOOP, 12/07/2026 : « Everything living in chat and being manually saved each time », https://www.community.whoop.com/t/request-true-ai-strength-coach-better-workout-flow-and-weight-tracking/15450) ; pas de RPE par exercice ; payant et lié au bracelet.
- **Avis réels** : voir forum ci-dessus.
- **Ce qu'il fait mieux que CU** : génération de séance par IA directement par l'athlète, intégrée à la récupération mesurée.
- **Ce que CU fait qu'il ne fait pas** : coach humain qui écrit et valide, guidage 3D/tempo, RPE/RIR par série, proprio, pas de matériel à 200 $/an.

#### 24. Strava (Athlete Intelligence) et bundle Strava + Runna

- **Cible** : la quasi-totalité des athlètes d'endurance (y compris ceux de Nathan, très probablement).
- **Fonctions** : Athlete Intelligence : résumés en langage naturel après chaque activité (allure, FC, puissance, dénivelé) ; **ne génère pas de séance** (communiqué Strava du 03/10/2024 : https://press.strava.com/articles/stravas-athlete-intelligence-translates-workout-data-into-simple-and). Depuis juillet 2025, bundle Strava + Runna (plans de course adaptatifs ; Runna fiché par un autre agent).
- **Prix 2026** : bundle Strava + Runna 149,99 $/an (communiqué Runna, 02/07/2025 : https://www.runna.com/press/combined-subscription-bundle). Abonnement Strava seul : 79,99 $/an ou 11,99 $/mois selon un site tiers (checkthat.ai, vu via WebSearch, **non ouvert**).
- **Modèle** : abonnement.
- **Intégrations** : quasi toutes les montres et applis.
- **Plateformes** : iOS, Android, web.
- **Forces** : réseau social incontournable ; l'IA y devient une commodité incluse.
- **Faiblesses** : analyse a posteriori seulement ; pas de musculation.
- **Avis réels** : aucun avis individuel lu. **Non vérifié.**
- **Ce qu'il fait mieux que CU** : audience, social, analyse automatique de chaque sortie.
- **Ce que CU fait qu'il ne fait pas** : la muscu (prescription, guidage, ajustement), proprio, récup.

#### 25. TrainingPeaks (Workout Generator)

- **Cible** : coachs d'endurance et leurs athlètes (plateforme de référence).
- **Fonctions IA** : un **« Workout Generator » par IA pour les coachs** : le coach tape une description en langage courant (ex. « 20min warmup, 6x3m @ threshold… ») et l'outil construit la séance structurée ; web uniquement ; **les séances de force structurées ne sont pas prises en charge** (article d'aide officiel, contenu obtenu via WebSearch, page refusée en 403 : https://help.trainingpeaks.com/hc/en-us/articles/235164967-Structured-Workout-Builder). Le guide officiel pour coachs (16/06/2026) ne parle pas d'IA (https://www.trainingpeaks.com/blog/trainingpeaks-guide-for-coaches/). Des sites concurrents affirment l'inverse (« zéro IA ») : **contradiction**, l'article d'aide fait foi.
- **Prix 2026** : non relevé ici (fiche prix probablement faite par un autre agent) : **non vérifié**.
- **Modèle** : abonnement athlète Premium + édition coach.
- **Intégrations** : très nombreuses (Garmin, Wahoo, Zwift…). Un serveur MCP non officiel (176 étoiles GitHub) permet à Claude de créer des séances dans TrainingPeaks en contournant l'API officielle, qui est soumise à approbation (https://github.com/JamsusMaximus/trainingpeaks-mcp).
- **Plateformes** : web, iOS, Android.
- **Forces** : standard des coachs d'endurance ; le « texte vers séance » y existe déjà pour le vélo et la course.
- **Faiblesses** : muscu structurée non générée par l'IA ; outil payant.
- **Avis réels** : non collectés ici.
- **Ce qu'il fait mieux que CU** : écosystème coach complet, paiements, écosystème de montres.
- **Ce que CU fait qu'il ne fait pas** : séance de **muscu** dictée puis guidée (3D, tempo, ajustement), ce que le générateur TrainingPeaks exclut explicitement.

#### 26. LeCoach (appli IA cyclisme adossée à intervals.icu, 2026)

- **Cible** : cyclistes autonomes.
- **Fonctions** : coach IA en chat qui construit le plan selon le profil et **modifie plan et séances « en conversation »** ; suivi d'habitudes (force, mobilité, nutrition) sans vraie programmation de muscu.
- **Prix 2026** : 7,99 €/mois ou 67,10 €/an, essai 14 jours (https://lecoach.app/vs/trainingpeaks, page indiquant des prix vérifiés en juillet 2026, lue le 30/09/2026). Page comparative écrite par l'éditeur.
- **Modèle** : abonnement.
- **Intégrations** : **synchronisation bidirectionnelle intervals.icu** (principale), export Zwift, Garmin, Wahoo, Rouvy, MyWhoosh ; import Garmin, Whoop, Oura, Apple Santé.
- **Plateformes** : non vérifié (web au minimum).
- **Forces** : même tuyauterie que CU (intervals.icu) ; LLM conversationnel ; prix bas.
- **Faiblesses** : cyclisme seulement ; pas de muscu guidée ; jeune produit, pas d'avis trouvés ; pays d'origine non indiqué.
- **Avis réels** : aucun trouvé. **Non vérifié.**
- **Ce qu'il fait mieux que CU** : plan vélo complet généré et modifié par conversation, sans coach.
- **Ce que CU fait qu'il ne fait pas** : musculation guidée, proprio, pliométrie, tests, récup ; coach humain dans la boucle.

#### 27. Coachs qui utilisent ChatGPT ou Claude directement (et les serveurs MCP)

- **Cible** : tout coach ou athlète qui a déjà un abonnement ChatGPT/Claude (20 $/mois environ ; prix non revérifiés ici).
- **Fonctions** : rédaction de séances et de plans en langage naturel ; depuis 2025, des **serveurs MCP libres relient Claude et ChatGPT à intervals.icu** : lecture des activités et du wellness, **création, modification et suppression de séances au calendrier** (https://github.com/mvilanova/intervals-mcp-server, 364 étoiles, licence GPL-3.0, lu le 30/09/2026) ; même chose pour TrainingPeaks (fiche 25).
- **Prix 2026** : gratuit (MCP open source) + abonnement au LLM.
- **Ce que dit la recherche** : ChatGPT produit des programmes de musculation de 12 semaines réalistes et périodisés, mais incomplets : à utiliser comme « brouillon » relu par un expert (Washif et al., Biology of Sport, 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC10955742) ; des plans de course ChatGPT sont jugés sous-optimaux par des coachs experts, meilleurs quand on donne plus d'informations sur l'athlète (Düking et al., J Sports Sci Med, 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC10915606) ; un cas unique de préparation au semi-marathon guidée par un LLM a fonctionné, mais l'auteur pointe l'absence de capteurs, de proactivité et de garde-fous (Lee, arXiv, 30/09/2025, https://arxiv.org/abs/2509.26593).
- **Forces** : gratuit ou presque, flexible, déjà maîtrisé par beaucoup de coachs.
- **Faiblesses** : sortie en texte libre (pas d'appli athlète, pas de guidage, pas d'ajustement pendant la séance) ; qualité dépendante du prompt et de la relecture.
- **Ce qu'il fait mieux que CU** : zéro développement, n'importe quel sport, n'importe quelle question.
- **Ce que CU fait qu'il ne fait pas** : transformer le texte en **séance exécutable** (JSON validé, bibliothèque de 190 exercices animés, bips, minuteurs, RPE/RIR, hors-ligne) et renvoyer le réalisé dans intervals.icu. **C'est précisément ce que CU ajoute à « Claude seul ».**

---

### Section spéciale : l'IA qui écrit les séances est-elle encore un avantage en 2026 ?

**Réponse franche : non, plus comme argument de vente.** Écrire une séance à partir d'une phrase est devenu une fonction banale, souvent incluse gratuitement ou dans un abonnement que l'athlète paie déjà. Ce qui reste un avantage, c'est ce qui se passe **après** l'écriture : la séance exécutable, guidée, ajustée, reliée au reste de l'entraînement, avec un coach humain qui valide.

**Preuves que la génération est banalisée (septembre 2026)** :
1. **WHOOP** génère depuis février 2026 une séance de musculation complète à partir d'une phrase ou d'une capture d'écran, ajustée au score de récupération (fiche 23).
2. **TrainingPeaks** a un « Workout Generator » IA pour les coachs : texte libre vers séance structurée (fiche 25). Il **exclut la musculation structurée** : c'est un trou, pour l'instant.
3. **Garmin Connect+** (8,99 €/mois) pousse des conseils et des séances du jour générés par IA (fiche 22) ; **Strava** résume chaque activité par IA pour tous ses abonnés (fiche 24).
4. Les applis de muscu **Alpha Progression** (12,99 $/mois), **Dr. Muscle**, **Freeletics** génèrent des programmes et ajustent la charge série par série ou séance par séance depuis des années (fiches 19 à 21). **ThePerfClub**, français, ajuste la séance du jour selon le wellness (fiche 13).
5. Même les fabricants de capteurs s'y mettent : « Enode AI » guide la séance selon la forme du jour ; Vitruve inclut un générateur de séances IA (fiche 4 et panorama VBT).
6. Côté endurance : **Athletica** (chat IA), **AI Endurance** (jumeau numérique), **TrainerRoad AI** (simulations), **LeCoach** (plan modifié en conversation, sur intervals.icu). Fitbod, Future, JuggernautAI, Humango, Runna et Enduco (fichés par d'autres agents) occupent le même terrain.
7. N'importe quel coach peut déjà brancher Claude ou ChatGPT sur **intervals.icu** avec un serveur MCP libre et lui faire créer des séances dans le calendrier de l'athlète (fiche 27). C'est la même idée que le relais de CU, en open source.

**Preuves que la génération seule ne suffit pas** : les études disponibles (Washif 2024, Düking 2024, Lee 2025, fiche 27) convergent : un LLM produit un **brouillon correct** qui doit être relu par un expert, et sa qualité dépend de l'information donnée sur l'athlète. Les critiques d'utilisateurs visent l'absence de dialogue (Garmin), le tout-dans-le-chat (WHOOP), l'obligation de corriger l'IA soi-même (AI Endurance). Autrement dit, les utilisateurs ne se plaignent pas que l'IA écrive mal : ils se plaignent qu'elle écrive **dans le vide**.

**Ce que CU peut encore revendiquer (et que personne dans ce panel ne réunit)** :
- **Le coach humain dans la boucle** : l'IA écrit ce que le coach dicte, le coach valide. C'est la recommandation même des études, et c'est l'inverse des applis 100 % automatiques.
- **La couche d'exécution** : mannequin 3D animé, bips de tempo, minuteurs, hors-ligne, sans compte. Aucun générateur IA observé (WHOOP, TrainingPeaks, Garmin, LLM + MCP) ne livre une séance de muscu guidée geste par geste.
- **L'ajustement série par série par RPE/RIR** : réel, mais **pas unique** (Alpha Progression, Enode en mode RIR le font). À présenter comme un standard bien fait, pas comme une innovation.
- **La muscu spécifique aux athlètes d'endurance, reliée à leur charge d'endurance** (intervals.icu) : TrainingPeaks et les coachs IA d'endurance ignorent la muscu structurée ; les applis de muscu ignorent l'endurance. C'est le vrai créneau.
- **Proprio auto-ajustée, pliométrie, mobilité mesurée au téléphone, récup** dans le même outil, sans matériel (contre Output, Enode, KINVENT, VERT qui demandent 200 à 2 300 € de capteurs).
- **Le prix : 0 €.**

**Conséquence pour le discours** : ne pas vendre « l'IA écrit vos séances ». Vendre « vous dictez, votre athlète exécute une séance guidée qui s'ajuste et remonte dans intervals.icu ». Surveiller deux menaces : TrainingPeaks qui ajouterait la muscu à son générateur, et WHOOP/Garmin qui ajouteraient un guidage d'exécution.

---


## Partie 4 — intervals.icu

- **Cible** : athlètes d'endurance « data » et leurs coachs. Plus de 160 000 athlètes actifs revendiqués (chiffre de page d'accueil, non audité). La France est le 2e pays d'utilisateurs.
- **Fonctions** : analyse fine des activités (puissance, FC, allure), courbe de forme CTL/ATL/TSB, calendrier, vue coach gratuite, planificateur annuel, API complète.
- **Musculation** : type d'activité `WeightTraining`, charge par RPE × durée ou par la FC, champ « kg soulevés ». **Aucun champ exercice / série / répétition.** Des demandes reviennent depuis 2021 et aucun engagement n'a été pris. Voir `03-intervals-ecosysteme.md`.
- **Prix 2026** : gratuit ; « Supporter » 4 $/mois (vérifié le 30/09/2026) [@intervals-prix]. Modèle : dons / abonnement volontaire de l'athlète ou du coach.
- **Intégrations** : Garmin, Wahoo, Coros, Polar, Suunto, Zwift, Strava (avec restrictions de l'API Strava), plus de 250 applis tierces revendiquées ; API ouverte avec OAuth.
- **Plateformes** : web (appli mobile annoncée en 2026).
- **Ce qu'il fait mieux que Charge Utile** : toute la partie endurance (analyse, charge, calendrier, communauté, API).
- **Ce que Charge Utile fait en plus** : prescription et exécution guidée de la muscu, ajustement au RPE, proprio, tests au capteur, récup.
- **Relation** : **complémentaire**, pas concurrente. Charge Utile est aujourd'hui un « module force » branché sur intervals.icu.
