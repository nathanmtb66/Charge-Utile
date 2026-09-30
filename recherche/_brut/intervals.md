# Écosystème intervals.icu — étude brute

Collecte du 30/09/2026. Méthode : pages officielles (intervals.icu, /pricing), forum Discourse lu via ses URL `.json` (`/t/{id}.json`, `/search.json?q=`), spécification OpenAPI publique (`https://intervals.icu/api/v1/docs`), presse, recherches web. Les chiffres de « vues » et « likes » viennent du JSON du forum au 30/09/2026. Pseudos de forum cités seulement quand c'est utile (développeurs d'outils publics).

---

## 1. intervals.icu : l'entreprise

### Qui, quoi
- Créé par **David Tinker**, développeur logiciel basé au Cap (Afrique du Sud), qui s'est mis au vélo à 35 ans et a codé l'outil d'analyse qu'il ne trouvait pas ailleurs ([Bicycling SA, 21/05/2026](https://www.bicycling.co.za/news-people/the-local-coder-changing-the-training-game/)). En ligne depuis 2018 (page d'accueil).
- Cœur du produit : analyse d'activités (détection automatique d'intervalles), modèle forme/fatigue (CTL/ATL/TSB), courbes de puissance, calendrier, constructeur de séances en texte, graphiques et champs personnalisés en JavaScript, vue coach (liste d'athlètes, tags, chat).

### Utilisateurs et croissance
- Page d'accueil (30/09/2026) : **« 160,000+ Active Athletes »**, « 193M+ Activities Analyzed », « 250+ » applis tierces, 21 langues ([intervals.icu](https://www.intervals.icu/)). Chiffre marketing non audité ; pas de définition de « actif ».
- Bicycling SA (mai 2026) : utilisateurs surtout aux **États-Unis, puis France, Royaume-Uni**, Chine dans le top 5 ; 23 langues ; équipes pro clientes, dont **Uno-X Mobility**. La France en n°2 est un point notable pour Charge Utile.
- Pas de chiffre public du nombre de coachs ni du nombre d'abonnés payants (« supporters ») : **introuvable**.
- Signes de croissance vus sur le forum : fil « API access » à ~105 400 vues ; explosion en 2025-2026 des fils « applis IA branchées sur intervals » (plusieurs fils de 300 à 1 200 messages, cf. §3).

### Modèle économique
- **Freemium**. Gratuit sans limite de durée ; abonnement optionnel **« Supporter » à 4 $/mois** (vérifié le 30/09/2026 sur [intervals.icu/pricing](https://www.intervals.icu/pricing/)). Résiliable à tout moment.
- Facturation : David a expliqué en 2024 que l'abonnement se paie **tous les 3 mois (12 $) ou à l'année** ; le trimestre sert à réduire les frais de paiement ; un utilisateur montre 48 $/an ([forum, fil « One time support payment », fév. 2024](https://forum.intervals.icu/t/one-time-support-payment/59550)). La page de prix 2026 n'affiche que « $4 /month ».
- Ce que débloque Supporter (page prix) : météo avancée, **planificateur de plan annuel**, import complet de l'historique Strava, zones entièrement personnalisées, import CSV de flux, **« Teams and coaching organisations »**, **« Bulk configure athletes »**, accès bêta, demandes de fonctions priorisées. Le coaching de base (vue coach, calendrier des athlètes) reste gratuit ; la page ne donne **aucune limite de nombre d'athlètes**.
- Revenus annexes : commissions d'affiliation (ex. code promo Hexis dont « Intervals.icu earns a commission », [annonce Hexis, nov. 2024](https://forum.intervals.icu/t/hexis-fuelling-plans-has-integrated-with-intervals-icu/78679)) ; boutique de maillots « supporters » expédiés par Ciovita (juin 2026, [fil merch](https://forum.intervals.icu/t/merch-for-intervals-icu-supporters/130317)).
- Piste évoquée : une **option « white label » payante** pour créer des utilisateurs par l'API (« We are considering… », [Cookbook API, nov. 2024](https://forum.intervals.icu/t/intervals-icu-api-integration-cookbook/80090)). Non confirmée depuis.

### Équipe
- Longtemps **un seul développeur**. En février 2024 David annonce quitter son emploi fin 2024 pour travailler **à plein temps** sur intervals.icu ([fil 59550, message 8](https://forum.intervals.icu/t/one-time-support-payment/59550)).
- Avril 2025 : « l'équipe de développement a doublé » — **Eva** rejoint comme ingénieure front-end et designer ([news 29/04/2025](https://forum.intervals.icu/t/intervals-icu-news-2025-04-29/99720)).
- Mai 2026 : **3 personnes** selon Bicycling SA.
- Le support de premier niveau du forum est assuré par des **modérateurs bénévoles** pour « soulager david » ([un modérateur, mars 2025](https://forum.intervals.icu/t/temperature-field-incorrect-with-indoor-workouts/93669)).

### Interviews / podcasts
- **« Mastering Your Metrics: Inside Intervals.icu with David Tinker »**, podcast sorti le 08/12/2025 ([annonce forum](https://forum.intervals.icu/t/podcast-about-intervals-icu/117113), [Apple Podcasts](https://podcasts.apple.com/gb/podcast/mastering-your-metrics-inside-intervals-icu-with-david/id1859510634?i=1000740148890)). D'après la description relayée par la recherche web : origine du projet, retours utilisateurs, IA, accès aux données. **Épisode non écouté** : contenu détaillé non vérifié.
- **Tour de Tools (dataroots)** : épisode avec David Tinker ; page Medium en **403**, non lue.
- **Bicycling SA (21/05/2026)** : seul entretien écrit lu. Annonce une appli mobile en cours, une intégration avec des fabricants de montres, le planificateur annuel.

### Position du créateur sur les intégrations tierces
- **Très ouverte, c'est l'ADN du produit.** API publique depuis avril 2020, OAuth depuis 2021, **CGU de l'API autorisant explicitement l'usage commercial** (cf. §2). Un utilisateur résume en 2026 : API lecture/écriture complète, JavaScript dans l'interface, « tiny dev team » à l'écoute ([fil juillet 2026](https://forum.intervals.icu/t/how-long-did-it-take-before-intervals-forums-really-clicked-for-you/130654)).
- David annonce lui-même des partenaires sur le forum (Hexis, Zwift…) et tient un annuaire public d'applis (« public app directory ») où l'on entre après un e-mail au support ([fil OAuth](https://forum.intervals.icu/t/intervals-icu-oauth-support/2759)).
- Contrainte subie : **Strava**. Depuis déc. 2024, les activités importées de Strava ne sont plus visibles par l'API ni, en principe, par les coachs (conditions Strava) ; David a ensuite négocié que le coaching reste possible ([Strava visibility update, 21/11/2024](https://forum.intervals.icu/t/strava-visibility-update-coaching-is-ok/80331)) ; mais via l'API : « Intervals.icu cannot supply Strava activities via the API » ([oct. 2025](https://forum.intervals.icu/t/solved-mcp-server-for-coaches-via-api-do-not-see-athletes-activities-brought-from-strava-ans-strava-api-forbids-data-fowarding/113828)). Conséquence pour un relais : un athlète qui ne synchronise que via Strava est **invisible** pour une appli tierce.

---

## 2. L'API

Sources : [fil « API access to Intervals.icu »](https://forum.intervals.icu/t/api-access-to-intervals-icu/609) (735 messages, ~105 400 vues, 1er message mis à jour par David), [fil OAuth](https://forum.intervals.icu/t/intervals-icu-oauth-support/2759), [Cookbook](https://forum.intervals.icu/t/intervals-icu-api-integration-cookbook/80090), [CGU de l'API](https://forum.intervals.icu/t/intervals-icu-api-terms-and-conditions/114087), spec OpenAPI `https://intervals.icu/api/v1/docs` (118 chemins, lue le 30/09/2026). La page `intervals.icu/api-docs.html` est une interface JS ; son contenu ne s'affiche pas en lecture simple, d'où le passage par la spec JSON.

### Authentification
- **Clé API personnelle** (Réglages → « Developer Settings ») en Basic Auth (`API_KEY` / clé). Destinée à « personal use ».
- **OAuth2 obligatoire pour une appli multi-utilisateurs** : « Apps intended to be used by more than one person should use OAuth and Bearer tokens » (fil 609).
- Procédure OAuth : formulaire `intervals.icu/oauth/apply`, appli en statut **« Pending » jusqu'à approbation manuelle** ; pas de flux OAuth possible avant. Puis mail au support pour figurer dans l'annuaire public. Échange du code en 2 min, jeton Bearer, révocation par `DELETE /api/v1/disconnect-app`.
- **Portées (scopes)** : ACTIVITY, WELLNESS, CALENDAR (séances prévues), CHATS, LIBRARY (bibliothèque de séances), SETTINGS ; chacune en READ ou WRITE.
- **Cas du coach** : une clé API de coach agit sur **lui-même et tous les athlètes qu'il coache** (« For API key calls this only works for yourself and athlete's you have coach access to », [fév. 2026](https://forum.intervals.icu/t/updating-icu-notes-is-not-supported-by-update-an-athlete-put-api-v1-athlete-id-method/121623)). L'endpoint `GET /api/v1/athletes` (athlètes suivis/coachés) **exige une clé API, pas un jeton OAuth** ([juin 2026](https://forum.intervals.icu/t/onboarding-athletes-and-coaching-groups/108864)). C'est exactement le montage de Charge Utile (relais avec clé du coach) — pratique, mais la clé donne un accès complet à tous les athlètes du coach.

### Ce qu'on peut lire / écrire (spec OpenAPI)
- **Activités** (52 endpoints) : lister, lire, envoyer un fichier FIT/TCX/GPX, **créer une activité manuelle** (`POST /activities/manual`, et `/manual/bulk` avec upsert sur `external_id`), commentaires d'activité. Le schéma Activity contient `icu_training_load`, `icu_rpe`, `session_rpe`, `feel`, **`kg_lifted`**, `compliance`. Le type `WeightTraining` existe dans l'énumération des sports. **Aucun champ exercice / série / répétition** dans toute la spec (recherche de « exercise », « reps », « sets » : 0 résultat).
- **Wellness** : lecture/écriture par jour, en masse, CSV ; champs personnalisés possibles.
- **Événements (calendrier)** : créer/modifier/supprimer séances prévues et notes, en masse, marquer comme fait (`mark-done` crée une activité manuelle), télécharger en .zwo/.mrc/.erg/.fit.
- **Bibliothèque** : dossiers, plans, séances, partage de dossiers avec des athlètes, application de plans.
- **Athlètes** : profil, réglages par sport, connexions, plan d'entraînement, résumé des athlètes suivis.
- **Chats**, **Custom Items** (graphiques/champs perso), météo, matériel, routes.
- **Webhooks** pour les applis OAuth (ACTIVITY_UPLOADED, ACTIVITY_ANALYZED, CALENDAR_UPDATED…) ; pas pour les activités venues de Strava.

### Limites (fil 609)
- Clé API : **5 000 requêtes/jour et 2 500 par fenêtre glissante de 15 min**, plus 10 req/s par IP. Au-delà : 429 + `Retry-After`.
- Applis OAuth : 100 req/utilisateur/jour jusqu'à 500 utilisateurs (plafond 50 000/jour, plancher 5 000), 1/8 par 15 min ; plus sur demande au support.
- Cloudflare peut bloquer certains clients HTTP (ex. Python-urllib) : il faut un User-Agent de navigateur.
- Largement suffisant pour 7 athlètes.

### Conditions (CGU de l'API, effectives au 23/10/2025)
- Licence **non exclusive, mondiale, gratuite, perpétuelle, « including commercial use »** ; sorties réutilisables et sous-licenciables sans attribution.
- Seule obligation : **attribution Garmin** si l'appli affiche des données issues d'appareils Garmin (champ `device_name`).
- Suspension possible en cas d'abus, avec 7 jours de préavis « where possible » ; CGU modifiables avec 30 jours de préavis ; API fournie « as is » ; droit sud-africain.
- Donc : **vendre Charge Utile avec une intégration intervals.icu est explicitement permis.** À noter : pas d'engagement de disponibilité (SLA).

### Complément au §1 : nouveautés en cours (veille)
- **Serveur MCP officiel** (connexion directe ChatGPT/Claude) : « We are working on an official MCP server. It is at the spec stage currently » (David, 09/09/2026, [fil](https://forum.intervals.icu/t/request-for-official-mcp-support-for-ai-tools-chatgpt-claude/126164)).
- **Appli native iOS/Android « in progress »** ; gros travail d'ergonomie mobile ([news du 23/09/2026](https://forum.intervals.icu/t/intervals-icu-news-2026-09-23/132557)).
- **Annuaire des coachs** public depuis mars 2026 ([fil](https://forum.intervals.icu/t/coach-directory-on-www-intervals-icu/124643), [page](https://www.intervals.icu/coaches/)) : **108 coachs listés** au 30/09/2026, dont **7 en France** (inscription volontaire, donc très en dessous du nombre réel de coachs). Un coach **basé à Font-Romeu** a demandé à y figurer le 29/09/2026 : il existe déjà au moins un coach local sur intervals.icu (contact ou concurrent direct pour Nathan).

---

## 3. Applis tierces branchées sur intervals.icu

Le forum a deux catégories dédiées : **« External projects »** (206 fils) et **« AI tools »** (104 fils, 5 772 messages, créée vu l'afflux). La page d'accueil revendique « 250+ » intégrations. Liste ci-dessous non exhaustive, triée par pertinence pour Charge Utile. Chiffres = messages / vues du fil au 30/09/2026.

### A. Force / musculation (le plus pertinent)
| Outil | Ce qu'il fait avec intervals.icu | Statut | Lien |
|---|---|---|---|
| **Pont Hevy (Corentvn)** | Webhook Hevy → activité intervals (durée, liste d'exercices en note, volume soulevé). Besoin de Hevy Pro + clé API intervals. « 10 à 20 utilisateurs actifs » (juil. 2026). Hébergé sur le serveur perso du dev, sans garantie. | Gratuit, bricolage | [icu.corentvn.dev](https://icu.corentvn.dev/), [GitHub](https://github.com/Corentvn/hevy-icu-webhook-wync) |
| **Hevy2Intervals** | Script open-source : crée des activités `WeightTraining` avec exercices/séries/charges/RPE en description, **charge estimée** depuis tonnage + densité ou RPE. | Open-source (mars 2026) | [GitHub](https://github.com/sebdenes/Hevy2Intervals) |
| **Watts & Weights** | Appli de muscu « hybride » qui **lit** 21 j de wellness/activités/seuils intervals et **écrit** des séances `WeightTraining` avec `icu_training_load` (Foster ou TRIMP), `kg_lifted`, `icu_rpe`, FC ; IA qui planifie muscu + cardio ensemble. Formule de repli √(kg soulevés)×1,2. | Prototype, 1 message, 55 vues (22/09/2026) | [fil](https://forum.intervals.icu/t/watts-weights-a-hybrid-strength-cardio-app-built-on-top-of-intervals-icu/132550), [GitHub](https://github.com/yuchtak/watts-weights) |
| **LOAD (loadtraining.app)** | Additionne TRIMP cardio (Strava/Polar) et tonnage Hevy normalisé au poids de corps ; ACWR combiné. Ne passe pas par l'API intervals (poste sur le forum intervals). | Gratuit, projet perso (31/08/2026) | [fil](https://forum.intervals.icu/t/a-free-app-that-adds-strength-training-into-your-load-picture-tonnage-trimp-in-one-number/132161) |
| **Trevo** | Coaching kettlebell / force + course, **appli OAuth approuvée**. Bloque sur l'envoi des exercices/répétitions/charges vers Garmin via intervals. | En construction (27/09/2026) | [fil](https://forum.intervals.icu/t/push-strength-exercises-exercise-reps-weight-to-garmin-in-planned-workouts/132623) |
| **PacePartner** | Coach IA sur données intervals ; bêta d'intégration Hevy et Liftosaur : génère des séances de force par chat et renvoie les séances faites vers intervals. | Bêta (mars 2026) | [pacepartner.app](https://pacepartner.app), [fil](https://forum.intervals.icu/t/tool-pacepartner-app-an-ai-coach-that-reads-your-intervals-icu-data-and-adapts-your-plan-o/123736) |
| **MyTrainPal** | Assistant IA mobile ; depuis avril 2026 les séances de force générées ont séries/répétitions et un **mode séance en direct** ; cible vs réalisé ; Garmin direct prévu. Un utilisateur jugeait la partie muscu « weak point » avant ce correctif. | 299 msg / 6 960 vues | [mytrainpal.app](https://mytrainpal.app), [fil](https://forum.intervals.icu/t/mytrainpal-ai-assistant-connected-to-intervals/122009) |
| **Coach Watts** | Coach IA ; **intégration Hevy** annoncée déc. 2025 ; multi-sports dont « strength ». | 500 msg / 15 152 vues | [coachwatts.com](https://coachwatts.com/), [fil](https://forum.intervals.icu/t/yes-another-ai-coach-coach-watts/117996) |
| **Fit File Forge** | Génère par IA des séances structurées Garmin (dont muscu) ; pas d'envoi vers intervals. | Gratuit | [fitfileforge.com](https://www.fitfileforge.com/) |
| **Intervals Companion (iOS)** | Apple Santé → intervals ; permet la chaîne Hevy → Apple Santé → intervals avec FC. Plus de 1 400 utilisateurs en fév. 2025 (selon le dev). | App Store | [App Store](https://apps.apple.com/us/app/intervals-icu-companion/id6739638454), [fil v3](https://forum.intervals.icu/t/intervals-companion-v3-updates-for-apple-health-and-workout-syncing/124208) |
| Autres cités (non ouverts) | LiftTrack (séances muscu sur Garmin), hevy2garmin, liftosaur2garmin, weightxreps (import Strong/Hevy, syntaxe texte), HealthFit, Breakaway (iOS). | — | cités dans les fils du §4 |

### B. IA / coachs automatiques (vague 2025-2026)
| Outil | Fil (msg / vues) | Lien |
|---|---|---|
| IntervalCoach — séances adaptées chaque jour à la récup ; a ajouté « Strength » comme sport générant des séances basiques (fév. 2026) | 1 211 / 36 763 | [intervalcoach.app](https://www.intervalcoach.app/) |
| Montis.icu — GPT ChatGPT gratuit (rapports hebdo) | 831 / 27 022 | [README GitHub](https://github.com/revo2wheels/intervalsicugptcoach-public/blob/main/README.md) |
| LeCoach.app — coach vélo IA | 703 / 17 358 | [lecoach.app](http://lecoach.app/) |
| IcuSync — connecteur MCP Claude sans installation | 337 / 14 272 | [icusync.icu](https://icusync.icu) |
| Intervals Pro — « AI augmentation » | 319 / 14 163 | [intervals.pro](https://intervals.pro/) |
| athletedata — coach IA qui écrit le matin (Garmin/WHOOP/Oura) | 128 / 4 791 | [athletedata.health](https://www.athletedata.health/) |
| Domestique — planificateur vélo open-source | 99 / 2 970 | [GitHub](https://github.com/platypus45/domestique) |
| + ~40 autres fils 2026 : AskMyCoach, Easy Intervals, ICU Visor, Gregaria MCP, WorkoutContext, VeloForge, TriCoach AI, PaceForm, Steve… Un fil s'intitule même « Are we tired of new AI coaching apps yet ». | | [catégorie AI tools](https://forum.intervals.icu/c/ai-tools/17) |

Constat : l'écosystème IA est **saturé côté endurance** (plans vélo/course), presque vide côté **force correctement modélisée**. Plusieurs devs IA reconnaissent que la muscu « rentrée au chausse-pied » dans le format endurance donne de mauvais résultats (dev de MyTrainPal, avril 2026).

### C. Autres intégrations établies
tp2intervals (copie de plans TrainingPeaks/TrainerRoad → intervals, [GitHub](https://github.com/freekode/tp2intervals), 296 msg / 26 583 vues), Hexis (nutrition, partenaire affilié), Zwift, Auuki, SubIntervals, Ride Cave, Concept2 (ErgZone, Intervals Row). Plateformes « officielles » citées sur l'accueil : Strava, Garmin, Wahoo, Zwift, Coros, Polar, Oura, WHOOP, Dropbox.

---

## 4. La musculation sur le forum intervals.icu

### Ce qu'intervals.icu gère aujourd'hui (vérifié)
- **Type d'activité `WeightTraining`** (alias « Strength », « Gym », « Weights » ; [liste des types, 2022](https://forum.intervals.icu/t/differences-among-activity-types/8430)). Les FIT Garmin « strength training » sont mappés vers Weight Training depuis août 2022.
- **Champ « kg lifted »** (poids total soulevé) ajouté par David en janvier 2022, affiché dans les totaux et la page fitness ([fil](https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637)) ; extraction du total depuis les enregistrements de séries du FIT Garmin (juin 2022). Présent dans l'API (`kg_lifted`).
- **Charge** : calculée depuis la FC si montre ; par défaut la muscu compte **pour la fatigue mais 0 % pour la forme (fitness)** — choix assumé de David depuis 2020 (« strength workouts now only count towards fatigue and not fitness », [fil 2020](https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685)), réglable par sport. Charge fixe possible via un champ JavaScript personnalisé : David a lui-même écrit un script (charge fixe, puis **32 de charge par heure**) ([fil 2023-2024](https://forum.intervals.icu/t/fixed-load-to-strength-training-activities/46718)).
- **Séances prévues** : on peut créer une séance de muscu dans le calendrier avec une charge saisie et une **description texte** ; le constructeur de séances accepte des étapes chronométrées, pas d'exercices / séries / répétitions / charges. Envoyées à Garmin, elles deviennent des étapes « Go 0:40 » sans exercice ; le parseur ignore les étapes FIT de type REPS (Trevo, sept. 2026).
- **Aucun** suivi par exercice, 1RM, progression, tonnage par groupe musculaire, vidéo intégrée. La spec API ne contient aucun champ exercice/série/répétition.
- Les enregistrements de séries du FIT Garmin arrivent bien (message 225) mais **ne sont pas exploités** ; un utilisateur les affiche via un champ + graphique JavaScript maison ; Garmin retire les noms d'exercices du fichier transmis par l'API ([fil avril 2026](https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015)).
- Les séances Weight Training ne comptent pas dans le temps en zones (« If something isn't contributing towards fitness… », David, [juin 2025](https://forum.intervals.icu/t/hr-zones-for-weight-training-workout-and-yoga/107959)).

### Fils les plus pertinents (triés par intérêt pour Charge Utile)
| Fil | Date | Messages / vues / likes | Demande | Réponse de David |
|---|---|---|---|---|
| [Weight Lifting improvements](https://forum.intervals.icu/t/weight-lifting-improvements/56656) | janv. 2024 → mars 2026 | 63 / **12 315** / 70 | Syntaxe texte type weightxreps, suivi par exercice, 1RM « qui décroît comme la FTP », INOL, import Hevy/Liftosaur, charge auto | **Aucune** dans le fil. Contournements : description texte copiée depuis Hevy, charge saisie à la main, séances « manuelles » à charge fixe glissées dans le calendrier (conseil d'un modérateur) |
| [Integration with Hevy](https://forum.intervals.icu/t/integration-with-hevy/114887) | nov. 2025 → sept. 2026 | 44 / 2 706 / 82 (1er message 29 likes) | Intégration native Hevy | **Aucune**. « No plans on this feature? » (juin 2026) resté sans réponse. Solutions communautaires : pont Corentvn, Hevy2Intervals, Apple Santé + Companion/HealthFit, PacePartner |
| [Advanced Strength Workout Builder](https://forum.intervals.icu/t/advanced-strength-workout-builder/115495) | nov. 2025 → sept. 2026 | 23 / 2 647 / 75 (**1er message 50 likes**) | Constructeur de séances de force : exercice, séries, reps, charge, RIR, %1RM, vitesse (VBT), tempo, repos, notes, supersets. Un coach d'endurance : « not a strength focused coach, but would find this very useful » | **Aucune** de David (il est interpellé). Un utilisateur : beaucoup de dev hors du cœur du produit, « not likely… anytime soon ». Un coach note que beaucoup de coachs restent sur **Google Sheets** faute de bon outil |
| [Strength Training Feature Set](https://forum.intervals.icu/t/strength-training-feature-set/114622) | oct. 2025 | 8 / 2 118 / 40 | Workflow complet programmation + réalisation ; auteur qui gère des **juniors** | Aucune. Un utilisateur décrit son flux : séance en description, puis réécriture des « réels » à la main après « Mark done » |
| [Workflows for Logging Strength Training](https://forum.intervals.icu/t/workflows-for-logging-strength-training/113468) | oct. 2025 | 1 / 141 | Un entraîneur de **jeunes athlètes** cherche comment consigner leur muscu dans intervals | **Zéro réponse** |
| [Strength Training Module](https://forum.intervals.icu/t/strength-training-module/68281) | juin 2024 | 4 / 609 / 10 | Coach tri/gravel/ultra : séries, reps, **vidéos de démo** « comme TrainingPeaks » ; ce serait décisif pour migrer | Aucune |
| [Training load for strength sessions](https://forum.intervals.icu/t/training-load-for-strength-sessions-no-power-hr-unreliable-how-to-make-prescribed-load-count/130900) | août 2026 | 4 / 148 | **Coach BMX** : la charge prescrite des séances de muscu affiche 0 | Modérateur : régler Fitness à 100 % pour Weight Training ; un autre suggère sRPE (Foster) |
| [Strength exercises as intervals/laps](https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015) | avril 2026 | 15 / 363 | Voir chaque série Garmin sur la courbe FC | Rien de natif ; script maison partagé |
| [Video exercise for strength sessions](https://forum.intervals.icu/t/video-exercise-for-strength-training-sessions/131079) | août 2026 | 3 / 187 | Vidéos d'exercices | Un coach met un lien YouTube non répertorié dans la description ; note que TP intègre la vidéo |
| [Push strength exercises to Garmin](https://forum.intervals.icu/t/push-strength-exercises-exercise-reps-weight-to-garmin-in-planned-workouts/132623) | 27/09/2026 | 1 | Dev de Trevo : supporter `duration_type=REPS` et nom/charge d'exercice vers Garmin | Pas encore de réponse |
| [Feature Request – Questionnaires & Strength Tracking](https://forum.intervals.icu/t/feature-request-integrated-questionnaires-strength-training-tracking/130102) | mai 2026 | 2 / 77 | Coach d'endurance (profil francophone) : suivi muscu intégré | Modérateur : « Can't give you any timeframe », renvoie aux votes |
| [Feature Request: kg lifted](https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637) | déc. 2021 | 13 / 1 754 | Poids total soulevé | **Fait par David en 5 jours** (« Important thing to track for strength work ») |
| [Fixed load to strength training activities](https://forum.intervals.icu/t/fixed-load-to-strength-training-activities/46718) | août 2023 | 7 / 860 | Charge fixe pour la muscu | **David écrit le script** JS (charge fixe puis 32/h) |
| [Weight Training Apps with public API](https://forum.intervals.icu/t/weight-training-apps-with-public-api/125221) | mars 2026 | 2 / 167 | Un utilisateur qui construit un agent IA note l'absence de « format de données standard » pour la force dans intervals | — |

### Lecture d'ensemble
- La demande est **réelle mais minoritaire** : les plus gros fils muscu font 2 000 à 12 000 vues, contre 17 000 à 37 000 pour les fils d'IA et 105 000 pour l'API. Les « votes » (likes du 1er message) plafonnent à 50.
- **David ne s'est jamais engagé** sur un module de force complet. Il fait les petites choses rapidement (kg lifted, mapping Garmin, script de charge) mais considère la muscu comme hors cardio (0 % fitness par défaut). Un utilisateur (homonyme, pas le créateur) dit que c'est pour lui un de ses types d'activité les moins utilisés et « not high priority ».
- Les modérateurs renvoient systématiquement vers les votes et les contournements.
- Les demandes convergent sur : (1) séances structurées exercice/séries/reps/charge/RIR, (2) vidéos, (3) suivi 1RM et progression, (4) **charge d'entraînement crédible** pour la muscu dans le modèle forme/fatigue, (5) envoi vers Garmin, (6) import Hevy. Charge Utile coche (1), (2), (3) partiellement, (4) via RPE ; pas (5) ni (6).

---

## 5. Les coachs d'endurance gèrent-ils la force dans intervals.icu ?

**Réponse courte : oui, beaucoup en prescrivent, mais « à la main » et sans outil adapté.** Aucun témoignage lu ne décrit un flux satisfaisant.

Méthodes observées (forum intervals.icu, 2023-2026) :
1. **Texte libre dans la description** de la séance prévue (exercices, séries, reps), éventuellement un **lien YouTube non répertorié** pour la démo — c'est la méthode d'un coach en sept. 2026, qui note que TrainingPeaks intègre la vidéo et intervals non ([fil vidéos](https://forum.intervals.icu/t/video-exercise-for-strength-training-sessions/131079)). Un autre membre : on peut **coller les séances dans la bibliothèque et faire copier-coller**, « dull work » ([Strength Training Module](https://forum.intervals.icu/t/strength-training-module/68281)).
2. **Bibliothèque de séances « manuelles » avec une charge fixe**, glissées dans le calendrier puis « Mark done » (conseil de modérateur, [Weight Lifting improvements](https://forum.intervals.icu/t/weight-lifting-improvements/56656)). Le **coach BMX** d'août 2026 fait exactement cela et découvre que la charge compte 0 en forme par défaut ([fil](https://forum.intervals.icu/t/training-load-for-strength-sessions-no-power-hr-unreliable-how-to-make-prescribed-load-count/130900)). Il souligne que la FC sous-estime les séances de force max — argument pour un RPE de séance.
3. **Tableur** : « Currently I'm creating training plan in a spreadsheet » (un utilisateur, nov. 2025, [fil](https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927)) ; un intervenant affirme que beaucoup de coachs restent sur **Google Sheets** car même les outils de force financés ont des trous ([Advanced Strength Workout Builder, message 12](https://forum.intervals.icu/t/advanced-strength-workout-builder/115495)).
4. **Appli de muscu à part** (Hevy, Strong, Liftosaur, StrongLifts, weightxreps, Trainerize, LiftTrack, Garmin Connect) + recopie du texte ou pont maison (cf. §3). Un coach de clients individuels utilise **Trainerize** et regarde Kinesis ([même fil, message 18](https://forum.intervals.icu/t/advanced-strength-workout-builder/115495)).
5. **Rien / abandon** : le fil d'un entraîneur de jeunes cherchant un flux de suivi muscu est resté **sans aucune réponse** ([Workflows for Logging Strength Training](https://forum.intervals.icu/t/workflows-for-logging-strength-training/113468)).
6. Appli **VBT Spleeft** (vitesse de barre) : se connecte à intervals pour que le coach voie la force « à côté » de l'endurance ; David a ajusté l'affichage pour elle en 1 jour ([fil, janv. 2026](https://forum.intervals.icu/t/introducing-spleeft-vbt-data-integrated-into-the-intervals-icu-workflow/118959)).

Profils de coachs qui le demandent : triathlon/gravel/ultra (2024), jeunes/juniors (2025, deux fils), BMX race (2026), coach d'endurance généraliste « not a strength focused coach » (2025), coach d'endurance francophone (2026).

Débat de fond sur la **charge** de la muscu (intéresse directement l'ajustement RPE de Charge Utile) : plusieurs membres rappellent que le modèle forme/fatigue d'intervals est cardio ; la FC est un mauvais indicateur en muscu ; propositions : sRPE de Foster (RPE × minutes), tonnage rapporté à une référence, charge fixe par séance ; un autre répond que la charge d'une séance de force bien programmée reste presque constante ([Measuring Weight Training Load](https://forum.intervals.icu/t/measuring-weight-training-load/87488), 2 772 vues ; [Weightlifting Rly Needs Support](https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927)). **Pas de consensus.**

**Reddit : non vérifié.** reddit.com bloque l'outil de recherche et renvoie 403 aux requêtes directes. Un site concurrent (Coachbox) affirme que des coachs y cherchent régulièrement « TrainingPeaks + TrainHeroic » réunis — **non vérifié**, source intéressée : à ne pas citer comme fait.

---

## 6. Et sur TrainingPeaks ?

TrainingPeaks **a** un module de force, contrairement à intervals.icu :
- **Strength Workout Builder** lancé le **25/07/2024** ([communiqué PR Newswire](https://www.prnewswire.com/news-releases/trainingpeaks-muscles-up-with-new-strength-feature-302206105.html)) : bibliothèque de **1 000+ vidéos** d'exercices, exercices perso avec vidéo YouTube/Vimeo, supersets, échauffement/retour au calme, bibliothèque de séances, conformité par couleur ([page coachs](https://www.trainingpeaks.com/strength/)).
- L'athlète exécute et coche ses séries **dans l'appli mobile TP** ; la construction se fait **uniquement sur ordinateur** ; **Premium requis** pour construire/déplacer, un athlète Basic ne peut qu'exécuter ce que le coach a prévu ([page athlètes](https://www.trainingpeaks.com/strength-athlete/)).
- **Pas d'export** des séances de force vers les montres/applis tierces « at this time » (pages coach et athlète, 30/09/2026).
- Prescription **RPE/RIR** (selon l'avis Coachbox, concurrent déclaré, [30/09/2026](https://coachbox.app/en/compare/trainingpeaks-review/)).
- **Charge (TSS)** : d'après l'extrait de la FAQ TP renvoyé par la recherche, un **TSS prévu est saisi à la main** ; le TSS réel vient du fichier de la montre. La FAQ elle-même renvoie **403** : non lue directement.
- Prix coach (Coachbox, non vérifié sur la page TP) : Coach Edition **21,99 $/mois** (1 athlète Premium inclus), Unlimited **54,99 $/mois**, **+9 $/mois par athlète Premium**, frais d'entrée 99 $.

Avis et limites :
- Idée « TrainHeroic ↔ TrainingPeaks » sur le UserVoice TP : **50 votes**, ouverte en 2020, statut « Future Opportunity » ; des athlètes disent **recopier à la main** les séances de leur coach de force (TrainHeroic) vers le calendrier de leur coach d'endurance (TP) ([UserVoice](https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/41882029-trainheroic-link-button-as-a-add-a-workout-op)).
- Vieille idée « tracking strength training » (2011) : commentaires sur l'impossibilité de saisir charges/reps/séries après coup et l'absence de TSS de force — **antérieurs au Strength Builder de 2024**, donc datés ([UserVoice](https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/2289895-add-support-for-tracking-strength-training)).
- Côté intervals.icu, des coachs citent TP comme **la** référence pour la force avec vidéos (fils 2024 et 2026).
- **Fait majeur 2026 : Garmin a racheté TrainingPeaks et TrainHeroic** (annoncé le 22/07/2026). TrainHeroic ≈ **500 000 utilisateurs et 10 000 coachs** ; 120 salariés rejoignent Garmin ; TP promet de rester multi-plateformes ([DC Rainmaker](https://www.dcrainmaker.com/2026/07/garmin-acquires-training-trainheroic.html)). Probable à moyen terme : une offre Garmin endurance + force intégrée (TP + TrainHeroic + montres). C'est le vrai concurrent structurel d'un « module force pour coach d'endurance ».
- Avis détaillés de coachs sur le Strength Builder (Reddit, forums) : **non trouvés / non accessibles**. La note App Store/Play de l'appli TP (4,7 / 4,2) vient d'un extrait de recherche, non ouvert : non retenue.

---

## 7. Opportunité : « le module force qui manque à intervals.icu (et TrainingPeaks) » — vrai ou faux ?

### Pour intervals.icu : **VRAI**, avec nuances
- Manque avéré et durable : pas d'exercices/séries/reps/charges, pas de 1RM, pas de vidéo, pas d'exécution guidée, pas d'envoi de séances de force aux montres (§4). Demandes répétées depuis 2021, jamais prises en charge par David ; aucune annonce de roadmap. Les modérateurs renvoient vers des solutions tierces.
- L'écosystème **laisse la place aux tiers** et l'API autorise l'usage commercial. Les champs `WeightTraining`, `kg_lifted`, `icu_training_load`, `icu_rpe`, `session_rpe`, `feel`, description texte permettent déjà d'**écrire une séance de force réalisée proprement** dans intervals (ce que fait Charge Utile et ce que font Hevy2Intervals et Watts & Weights).
- Nuances :
  - **Concurrence qui arrive** : ponts Hevy communautaires (gratuits), Watts & Weights, LOAD, Trevo, PacePartner, MyTrainPal, Coach Watts, IntervalCoach — tous nés entre nov. 2025 et sept. 2026. Aucun n'est encore une référence ni ne cible le **coach** qui prescrit de la force à ses athlètes d'endurance avec exécution guidée ; la plupart ciblent l'athlète seul avec IA.
  - **Risque qu'intervals le fasse lui-même** : faible à court terme (priorités affichées : appli mobile native, MCP officiel, tests de fatigue), mais David réalise vite les petites demandes. Un simple ajout (étapes REPS vers Garmin, champ séries) réduirait une partie de l'avantage.
  - Les utilisateurs qui veulent juste « séries + charge + reps » trouvent Hevy suffisant ; la valeur de Charge Utile est ailleurs : prescription par le coach, **exécution guidée hors-ligne** (animations, tempo, minuteurs), ajustement RPE/RIR, proprio, tests, puis **remontée dans intervals**.
- **Intégration Hevy → intervals native : n'existe pas** (30/09/2026). Seulement des ponts tiers (Corentvn, Hevy2Intervals, PacePartner, Coach Watts, chaîne Apple Santé + Intervals Companion/HealthFit).

### Pour TrainingPeaks : **FAUX tel quel**
TP a un Strength Builder depuis 2024, avec vidéos et exécution mobile, et Garmin possède maintenant TP + TrainHeroic. Les angles restants sont plus étroits : prix (Premium par athlète), pas d'export vers les montres, construction sur ordinateur seulement, pas d'ajustement auto de charge série par série (non vérifié : rien vu qui l'indique), pas de proprio/pliométrie/tests dédiés.

### Taille estimée (hypothèses explicites, aucun chiffre ci-dessous n'est vérifié sauf mention)
| Paramètre | Valeur | Source / statut |
|---|---|---|
| Athlètes actifs intervals.icu | 160 000+ | page d'accueil, marketing (vérifié comme affirmation) |
| Coachs dans l'annuaire public | 108 (7 en France) | vérifié, inscription volontaire = plancher |
| Coachs TrainHeroic (repère) | ~10 000 | DC Rainmaker |
| Part des athlètes intervals suivis par un coach sur la plateforme | **hypothèse 5 à 10 %** → 8 000 à 16 000 athlètes coachés | pas de donnée |
| Athlètes par coach | **hypothèse 5 à 15** (Nathan : 7) → **~500 à 3 000 coachs** actifs sur intervals | pas de donnée |
| Coachs qui font faire de la muscu | **hypothèse 50 à 70 %** (les fils montrent tri, ultra, BMX, jeunes, route) → ~250 à 2 100 | hypothèse |
| Coachs prêts à payer un outil force dédié | **hypothèse 10 à 20 %** → **~25 à 400 coachs dans le monde** | hypothèse |
| Part France | **hypothèse 10 à 15 %** (France = n°2 des utilisateurs) → **~3 à 60 coachs** | hypothèse, s'appuie sur Bicycling SA |

Lecture : marché **de niche** si l'on reste « module force pour coachs intervals.icu ». Il s'élargit si l'on compte (a) les athlètes autonomes qui lèvent (fils Hevy : quelques dizaines de « +1 » visibles, milliers de vues), (b) les coachs sur TrainingPeaks qui trouvent le Strength Builder cher ou limité, (c) les clubs/structures (CREPS, pôles, sections sport-études) où un préparateur gère beaucoup d'athlètes. Pour une première vente, intervals.icu est surtout un **canal de visibilité** peu coûteux : catégorie « External projects », annuaire d'applis, communauté qui teste volontiers — les fils d'applis y obtiennent des centaines à des milliers de vues.

---

## 8. Risques

1. **Dépendance à une très petite équipe.** Un fondateur (plein temps depuis fin 2024), 3 personnes en mai 2026, support par des modérateurs bénévoles. Pas de SLA sur l'API (« as is »). Historique plutôt rassurant : API stable depuis 2020, David répond vite et ajoute des champs pour les développeurs. Mais une panne ou un départ du fondateur toucherait tout l'écosystème. **Parade** : Charge Utile doit fonctionner **sans** intervals (déjà le cas : relais optionnel), file d'attente et renvoi si l'API est indisponible.
2. **Changements d'API / de conditions.** CGU modifiables avec **30 jours de préavis**, suspension possible (7 jours « where possible »). Précédent : les changements imposés par **Strava** (déc. 2024 : activités Strava invisibles par l'API ; juin 2026 : Strava durcit ses conditions développeurs et vise les « plateformes intermédiaires », [fil](https://forum.intervals.icu/t/strava-api-update-new-terms-subs-required-for-api-access/130240)). Conséquence concrète : un athlète synchronisé **seulement via Strava** n'est pas visible par le relais ; la vue coach de Charge Utile serait vide pour lui. Garmin peut aussi réduire ce qu'il transmet (il retire déjà noms d'exercices et structure des FIT de force envoyés par API, §4).
3. **Clé API du coach stockée dans le relais — le point le plus sensible.**
   - Position officielle : la clé donne accès à toutes vos données, « Be careful what you do with it! », la régénérer si compromise ; la clé est pour l'**usage personnel**, les applis utilisées par plus d'une personne doivent passer par **OAuth** ([fil API](https://forum.intervals.icu/t/api-access-to-intervals-icu/609)).
   - Une clé de **coach** agit aussi sur **tous ses athlètes coachés** (lecture/écriture, y compris suppression d'événements). Une fuite du Worker = accès complet aux données de santé (FC, HRV, sommeil, poids) de mineurs ou jeunes adultes → enjeu **RGPD**.
   - Pour un usage par Nathan seul, c'est conforme à l'esprit « personal use ». **Pour vendre à d'autres coachs, il faudra une appli OAuth** (demande + approbation manuelle). Mais un jeton OAuth ne donne accès **qu'aux données de la personne qui autorise**, pas à ses athlètes coachés — choix de conception confirmé par un modérateur (« by design », [déc. 2025](https://forum.intervals.icu/t/intervals-pro-ai-augmentation-for-intervals/116453)) ; et `GET /api/v1/athletes` refuse les jetons OAuth ([juin 2026](https://forum.intervals.icu/t/onboarding-athletes-and-coaching-groups/108864)). Donc en version commerciale, **chaque athlète** devrait autoriser Charge Utile via OAuth (scopes ACTIVITY:WRITE et, pour la vue coach, ACTIVITY:READ/WELLNESS:READ). Cela change le parcours « lien sans compte » actuel.
   - Plusieurs applis tierces (IcuSync, PaceKeeper, pont Hevy) demandent quand même la clé API ; certaines sont passées à OAuth en 2026 (Domestique : « no more API keys »). C'est la tendance.
   - Mesures minimales si la clé reste : secret chiffré côté Cloudflare (pas dans le dépôt public ni dans le JSON publié), relais limité aux seuls endpoints nécessaires (création d'activité, lecture résumée), jamais de clé côté client, rotation documentée, journalisation.
4. **Concurrence d'un acteur puissant** : Garmin (TP + TrainHeroic + montres) peut sortir une offre endurance + force intégrée ; intervals peut ajouter un minimum de force (étapes REPS vers Garmin). Et la vague d'applis IA sur intervals rend la visibilité plus difficile (« Are we tired of new AI coaching apps yet », mai 2026).
5. **Risque de modèle de charge** : aucun consensus sur la façon de convertir la muscu en charge comparable au TSS. Si Charge Utile écrit `icu_training_load`, il faut documenter la formule (sRPE de Foster = RPE × minutes est la plus défendable) et rappeler que, par défaut, intervals compte la muscu à **0 % pour la forme**.


---

## Ce qui n'a pas pu être vérifié
- Nombre d'abonnés Supporter, nombre total de coachs, chiffre d'affaires : non publics.
- Contenu des podcasts (Mastering Your Metrics, Tour de Tools) : non écoutés ; page Medium en 403.
- Reddit (r/Velo, r/triathlon, r/cycling…) : inaccessible (403 et domaine bloqué pour la recherche). Aucun témoignage Reddit cité.
- FAQ du Strength Builder TrainingPeaks : 403 ; seul un extrait de recherche indique un TSS prévu saisi à la main.
- Page `intervals.icu/api-docs.html` : interface JavaScript illisible en lecture simple ; remplacée par la spec JSON.
- Toutes les tailles de marché du §7 sont des hypothèses.

## Sources vérifiées

```json
[
 {
  "cle": "intervals-accueil",
  "auteurs": "Intervals.icu",
  "annee": 2026,
  "titre": "Free Cycling, Running, Triathlon Training Platform",
  "revue": "site officiel",
  "doi": null,
  "url": "https://www.intervals.icu/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Page d'accueil : 160 000+ athlètes actifs, 193 M d'activités, 21 langues, 250+ intégrations ; aucune fonction muscu mise en avant."
 },
 {
  "cle": "intervals-prix",
  "auteurs": "Intervals.icu",
  "annee": 2026,
  "titre": "Pricing",
  "revue": "site officiel",
  "doi": null,
  "url": "https://www.intervals.icu/pricing/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Gratuit + Supporter à 4 $/mois ; liste des fonctions Supporter dont équipes/organisations de coaching ; vérifié le 30/09/2026."
 },
 {
  "cle": "intervals-annuaire-coachs",
  "auteurs": "Intervals.icu",
  "annee": 2026,
  "titre": "Coaches",
  "revue": "site officiel",
  "doi": null,
  "url": "https://www.intervals.icu/coaches/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Annuaire public : 108 coachs listés dont 7 en France au 30/09/2026 (inscription volontaire)."
 },
 {
  "cle": "intervals-openapi",
  "auteurs": "Intervals.icu",
  "annee": 2026,
  "titre": "Intervals.icu API (OpenAPI v1.0.0)",
  "revue": "site officiel",
  "doi": null,
  "url": "https://intervals.icu/api/v1/docs",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Spécification JSON : 118 chemins ; champs kg_lifted, icu_rpe, session_rpe, icu_training_load ; aucun champ exercice/série/répétition."
 },
 {
  "cle": "forum-api-access",
  "auteurs": "David Tinker",
  "annee": 2020,
  "titre": "API access to Intervals.icu",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/api-access-to-intervals-icu/609",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Doc de référence : clé API perso en Basic Auth, OAuth pour applis multi-utilisateurs, limites de débit (5 000/jour pour clé API)."
 },
 {
  "cle": "forum-oauth",
  "auteurs": "David Tinker",
  "annee": 2021,
  "titre": "Intervals.icu OAuth support",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-icu-oauth-support/2759",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Procédure OAuth : demande, approbation manuelle (Pending), scopes ACTIVITY/WELLNESS/CALENDAR/CHATS/LIBRARY/SETTINGS."
 },
 {
  "cle": "forum-api-cookbook",
  "auteurs": "David Tinker",
  "annee": 2024,
  "titre": "Intervals.icu API Integration Cookbook",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-icu-api-integration-cookbook/80090",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Exemples d'appels ; webhooks ; option white label payante envisagée."
 },
 {
  "cle": "forum-api-cgu",
  "auteurs": "David Tinker",
  "annee": 2025,
  "titre": "Intervals.icu API Terms and Conditions",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-icu-api-terms-and-conditions/114087",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "CGU API au 23/10/2025 : usage commercial autorisé, attribution Garmin, préavis de 30 jours, droit sud-africain."
 },
 {
  "cle": "forum-onboarding-coachs",
  "auteurs": "David Tinker",
  "annee": 2025,
  "titre": "Onboarding athletes and coaching groups",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/onboarding-athletes-and-coaching-groups/108864",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Groupes de coaching (fonction Supporter) ; GET /api/v1/athletes exige une clé API, pas un jeton OAuth (juin 2026)."
 },
 {
  "cle": "forum-icu-notes-api",
  "auteurs": "David Tinker",
  "annee": 2026,
  "titre": "Updating icu_notes via PUT athlete",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/updating-icu-notes-is-not-supported-by-update-an-athlete-put-api-v1-athlete-id-method/121623",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Une clé API agit sur soi et les athlètes dont on est coach."
 },
 {
  "cle": "forum-oauth-coach-limite",
  "auteurs": "R2Tom (modérateur)",
  "annee": 2025,
  "titre": "Intervals Pro – message 87",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-pro-ai-augmentation-for-intervals/116453",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Les jetons OAuth ne donnent pas accès aux athlètes coachés, par conception."
 },
 {
  "cle": "forum-strava-api",
  "auteurs": "David Tinker",
  "annee": 2025,
  "titre": "MCP server for coaches: Strava activities via API",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/solved-mcp-server-for-coaches-via-api-do-not-see-athletes-activities-brought-from-strava-ans-strava-api-forbids-data-fowarding/113828",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Intervals.icu ne peut pas fournir les activités Strava via l'API."
 },
 {
  "cle": "forum-strava-coaching-ok",
  "auteurs": "David Tinker",
  "annee": 2024,
  "titre": "Strava visibility update: coaching is OK",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/strava-visibility-update-coaching-is-ok/80331",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Après les nouvelles conditions Strava, le coaching reste possible dans intervals."
 },
 {
  "cle": "forum-strava-2026",
  "auteurs": "app4g",
  "annee": 2026,
  "titre": "Strava API Update - New Terms & Subs required",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/strava-api-update-new-terms-subs-required-for-api-access/130240",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "E-mail Strava de juin 2026 : abonnement requis pour les développeurs Standard, plateformes intermédiaires visées."
 },
 {
  "cle": "forum-supporter-paiement",
  "auteurs": "David Tinker",
  "annee": 2024,
  "titre": "One time support payment",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/one-time-support-payment/59550",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Paiement trimestriel ou annuel ; David passe à plein temps fin 2024."
 },
 {
  "cle": "forum-news-2025-04",
  "auteurs": "David Tinker",
  "annee": 2025,
  "titre": "Intervals.icu News 2025-04-29",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-icu-news-2025-04-29/99720",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "L'équipe double : arrivée d'Eva (front-end, design)."
 },
 {
  "cle": "forum-news-2026-09",
  "auteurs": "David Tinker",
  "annee": 2026,
  "titre": "Intervals.icu News 2026-09-23",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-icu-news-2026-09-23/132557",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Refonte mobile ; appli native en cours ; tests de fatigue sous-maximaux en bêta."
 },
 {
  "cle": "forum-mcp-officiel",
  "auteurs": "David Tinker",
  "annee": 2026,
  "titre": "Request for official MCP support",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/request-for-official-mcp-support-for-ai-tools-chatgpt-claude/126164",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Serveur MCP officiel au stade de spécification (09/09/2026)."
 },
 {
  "cle": "forum-annuaire-coachs",
  "auteurs": "David Tinker",
  "annee": 2026,
  "titre": "Coach directory on www.intervals.icu",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/coach-directory-on-www-intervals-icu/124643",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Lancement de l'annuaire des coachs (mars 2026) ; inscription sur demande."
 },
 {
  "cle": "forum-hexis",
  "auteurs": "David Tinker",
  "annee": 2024,
  "titre": "Hexis fuelling plans has integrated with Intervals.icu",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/hexis-fuelling-plans-has-integrated-with-intervals-icu/78679",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Partenariat avec commission d'affiliation."
 },
 {
  "cle": "forum-merch",
  "auteurs": "David Tinker",
  "annee": 2026,
  "titre": "Merch for Intervals.icu supporters",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/merch-for-intervals-icu-supporters/130317",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Boutique de tenues expédiées par Ciovita."
 },
 {
  "cle": "forum-moderateurs",
  "auteurs": "MedTechCD (modérateur)",
  "annee": 2025,
  "titre": "Temperature field incorrect with indoor workouts",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/temperature-field-incorrect-with-indoor-workouts/93669",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Les modérateurs sont bénévoles et filtrent les demandes pour soulager David."
 },
 {
  "cle": "forum-podcast",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Podcast about Intervals.icu!",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/podcast-about-intervals-icu/117113",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Annonce du podcast Mastering Your Metrics avec David Tinker (déc. 2025) ; épisode non écouté."
 },
 {
  "cle": "forum-clicked",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "How long did it take before intervals forums really clicked for you",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/how-long-did-it-take-before-intervals-forums-really-clicked-for-you/130654",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Utilisateur soulignant l'API ouverte et la petite équipe à l'écoute."
 },
 {
  "cle": "bicycling-za-2026",
  "auteurs": "Bicycling South Africa",
  "annee": 2026,
  "titre": "The Local Coder Changing The Training Game",
  "revue": "Bicycling SA",
  "doi": null,
  "url": "https://www.bicycling.co.za/news-people/the-local-coder-changing-the-training-game/",
  "type": "presse",
  "niveau": "D",
  "verifie": true,
  "note": "Portrait de David Tinker (21/05/2026) : équipe de 3, USA puis France puis UK, Uno-X Mobility, freemium."
 },
 {
  "cle": "forum-weight-lifting-improvements",
  "auteurs": "communauté",
  "annee": 2024,
  "titre": "Weight Lifting improvements",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/weight-lifting-improvements/56656",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Fil muscu le plus lu (12 315 vues) : demandes et contournements, aucune réponse du créateur."
 },
 {
  "cle": "forum-hevy",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Integration with Hevy",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/integration-with-hevy/114887",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Demande d'intégration Hevy (82 likes) ; ponts communautaires ; pas de réponse officielle."
 },
 {
  "cle": "forum-strength-builder",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Advanced Strength Workout Builder",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/advanced-strength-workout-builder/115495",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Demande de constructeur de séances de force (50 likes au 1er message) ; témoignages de coachs ; Trevo."
 },
 {
  "cle": "forum-strength-feature-set",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Strength Training Feature Set",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/strength-training-feature-set/114622",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Proposition de flux complet de force ; flux manuel décrit par les utilisateurs."
 },
 {
  "cle": "forum-strength-workflows",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Workflows for Logging Strength Training",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/workflows-for-logging-strength-training/113468",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Entraîneur de jeunes cherchant un flux ; aucune réponse."
 },
 {
  "cle": "forum-strength-module",
  "auteurs": "communauté",
  "annee": 2024,
  "titre": "Strength Training Module",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/strength-training-module/68281",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach tri/ultra demandant séries, reps et vidéos comme TrainingPeaks."
 },
 {
  "cle": "forum-strength-load-bmx",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "Training load for strength sessions",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/training-load-for-strength-sessions-no-power-hr-unreliable-how-to-make-prescribed-load-count/130900",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach BMX : charge de muscu à 0 en forme par défaut ; réglage à 100 % ; sRPE."
 },
 {
  "cle": "forum-strength-laps",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "Strength training exercises as intervals/laps",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Séries FIT Garmin non exploitées ; Garmin retire les noms d'exercices via l'API ; script maison."
 },
 {
  "cle": "forum-strength-video",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "Video exercise for strength training sessions",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/video-exercise-for-strength-training-sessions/131079",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach mettant des liens vidéo dans la description ; TP intègre la vidéo."
 },
 {
  "cle": "forum-strength-garmin-reps",
  "auteurs": "flemes (Trevo)",
  "annee": 2026,
  "titre": "Push strength exercises to Garmin in planned workouts",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/push-strength-exercises-exercise-reps-weight-to-garmin-in-planned-workouts/132623",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Les séances WeightTraining prévues arrivent sur Garmin sans exercices ni reps."
 },
 {
  "cle": "forum-strength-questionnaires",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "Integrated Questionnaires & Strength Training Tracking",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/feature-request-integrated-questionnaires-strength-training-tracking/130102",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Modérateur : pas de calendrier pour la force, renvoi aux votes."
 },
 {
  "cle": "forum-kg-lifted",
  "auteurs": "David Tinker",
  "annee": 2022,
  "titre": "Feature Request: kg lifted for strength training",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Champ kg lifted ajouté par David en janvier 2022."
 },
 {
  "cle": "forum-fixed-load",
  "auteurs": "David Tinker",
  "annee": 2023,
  "titre": "Fixed load to strength training activities",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/fixed-load-to-strength-training-activities/46718",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Script JS de charge fixe puis 32 de charge par heure écrit par David."
 },
 {
  "cle": "forum-strength-fatigue-only",
  "auteurs": "David Tinker",
  "annee": 2020,
  "titre": "Strength workout loads no longer counted",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Par défaut la muscu compte en fatigue et pas en forme ; réglable."
 },
 {
  "cle": "forum-activity-types",
  "auteurs": "David Tinker",
  "annee": 2022,
  "titre": "Differences among activity types",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/differences-among-activity-types/8430",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Liste des types dont WeightTraining (alias Strength, Gym, Weights)."
 },
 {
  "cle": "forum-hr-zones-weights",
  "auteurs": "David Tinker",
  "annee": 2025,
  "titre": "HR zones for weight training, workout and yoga",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/hr-zones-for-weight-training-workout-and-yoga/107959",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Les activités non cardio ne comptent pas dans le temps en zones."
 },
 {
  "cle": "forum-weight-apps-api",
  "auteurs": "communauté",
  "annee": 2026,
  "titre": "Weight Training Apps with public API",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/weight-training-apps-with-public-api/125221",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Pas de format de données standard pour la force dans intervals."
 },
 {
  "cle": "forum-weightlifting-rly",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Weightlifting Rly Needs Support",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Demande de charge basée sur le tonnage ; planification en tableur ; débat sur la charge."
 },
 {
  "cle": "forum-measuring-load",
  "auteurs": "communauté",
  "annee": 2025,
  "titre": "Measuring Weight Training Load",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/measuring-weight-training-load/87488",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Pratiques de charge fixe pour la muscu ; FC peu pertinente."
 },
 {
  "cle": "forum-spleeft",
  "auteurs": "Spleeft",
  "annee": 2026,
  "titre": "Introducing Spleeft: VBT data integrated into the Intervals.icu workflow",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/introducing-spleeft-vbt-data-integrated-into-the-intervals-icu-workflow/118959",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Appli VBT connectée à intervals ; David ajuste l'affichage en 1 jour."
 },
 {
  "cle": "forum-watts-weights",
  "auteurs": "Watts & Weights",
  "annee": 2026,
  "titre": "Watts & Weights — a hybrid strength/cardio app",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/watts-weights-a-hybrid-strength-cardio-app-built-on-top-of-intervals-icu/132550",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Appli muscu IA qui lit intervals et écrit des WeightTraining avec charge, kg_lifted, RPE."
 },
 {
  "cle": "forum-load-app",
  "auteurs": "LOAD",
  "annee": 2026,
  "titre": "A free app that adds strength training into your load picture",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/a-free-app-that-adds-strength-training-into-your-load-picture-tonnage-trimp-in-one-number/132161",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Appli combinant TRIMP et tonnage Hevy, ACWR combiné."
 },
 {
  "cle": "forum-pacepartner",
  "auteurs": "PacePartner",
  "annee": 2026,
  "titre": "PacePartner.app — an AI coach",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/tool-pacepartner-app-an-ai-coach-that-reads-your-intervals-icu-data-and-adapts-your-plan-o/123736",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach IA ; bêta force Hevy/Liftosaur."
 },
 {
  "cle": "forum-mytrainpal",
  "auteurs": "MyTrainPal",
  "annee": 2026,
  "titre": "MyTrainPal - AI Assistant connected to Intervals",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/mytrainpal-ai-assistant-connected-to-intervals/122009",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Assistant IA ; séances de force avec séries/reps et mode séance en direct depuis avril 2026."
 },
 {
  "cle": "forum-coachwatts",
  "auteurs": "Coach Watts",
  "annee": 2025,
  "titre": "Yes, another AI Coach... Coach Watts",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/yes-another-ai-coach-coach-watts/117996",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach IA ; intégration Hevy annoncée en décembre 2025."
 },
 {
  "cle": "forum-intervalcoach",
  "auteurs": "IntervalCoach",
  "annee": 2026,
  "titre": "IntervalCoach - AI workouts that adapt daily",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervalcoach-ai-workouts-that-adapt-daily-to-your-recovery-and-goals/120045",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Plus gros fil IA (1 211 messages) ; ajout de la force comme sport en février 2026."
 },
 {
  "cle": "forum-montis",
  "auteurs": "Montis.icu",
  "annee": 2025,
  "titre": "(Yet Another) AI Coach - Montis.icu",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/yet-another-ai-coach-montis-icu/117856",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "GPT ChatGPT gratuit branché sur intervals."
 },
 {
  "cle": "forum-lecoach",
  "auteurs": "LeCoach",
  "annee": 2025,
  "titre": "LeCoach.app - AI cycling coach for Intervals",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/lecoach-app-ai-cycling-coach-for-intervals/117602",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach vélo IA."
 },
 {
  "cle": "forum-icusync",
  "auteurs": "IcuSync",
  "annee": 2026,
  "titre": "IcuSync - Claude AI MCP connector",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/icusync-claude-ai-mcp-connector-for-intervals-icu-no-technical-setup-required/126632",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Connecteur MCP ; mode coach par clé API (juin 2026)."
 },
 {
  "cle": "forum-intervalspro",
  "auteurs": "Intervals Pro",
  "annee": 2025,
  "titre": "Intervals Pro - AI Augmentation for Intervals",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-pro-ai-augmentation-for-intervals/116453",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Assistant IA pour intervals."
 },
 {
  "cle": "forum-companion",
  "auteurs": "Intervals Companion",
  "annee": 2025,
  "titre": "A new Intervals Companion App. With widgets!",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/a-new-intervals-companion-app-with-widgets/92334",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Appli iOS compagnon, 1 400 utilisateurs revendiqués en février 2025."
 },
 {
  "cle": "forum-companion-v3",
  "auteurs": "Intervals Companion",
  "annee": 2026,
  "titre": "Intervals Companion v3 updates",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/intervals-companion-v3-updates-for-apple-health-and-workout-syncing/124208",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Synchro Apple Santé ; utilisé pour la chaîne Hevy vers intervals."
 },
 {
  "cle": "forum-tp2intervals",
  "auteurs": "tp2intervals",
  "annee": 2024,
  "titre": "Tp2intervals - Copy TrainingPeaks and TrainerRoad workouts",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/tp2intervals-copy-trainingpeaks-and-trainerroad-workouts-plans-to-intervals/63375",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Outil de copie de plans TP/TrainerRoad vers intervals."
 },
 {
  "cle": "forum-fitfileforge",
  "auteurs": "Fit File Forge",
  "annee": 2026,
  "titre": "Fit File Forge – Free AI Tool for Garmin Structured Workouts",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/fit-file-forge-free-ai-tool-for-instant-garmin-structured-workouts/118588",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Générateur IA de séances Garmin, y compris muscu."
 },
 {
  "cle": "forum-athletedata",
  "auteurs": "athletedata",
  "annee": 2026,
  "titre": "Your AI coach messages you first",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/your-ai-coach-messages-you-first-intervals-icu-garmin-whoop-oura/126280",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Coach IA proactif multi-sources."
 },
 {
  "cle": "forum-domestique",
  "auteurs": "Domestique",
  "annee": 2026,
  "titre": "Domestique - a free, open source cycling training app",
  "revue": "forum intervals.icu",
  "doi": null,
  "url": "https://forum.intervals.icu/t/domestique-a-free-open-source-science-based-cycling-training-app/130388",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Planificateur open-source ; passage à OAuth (plus de clé API) en juin 2026."
 },
 {
  "cle": "tp-strength-coachs",
  "auteurs": "TrainingPeaks",
  "annee": 2026,
  "titre": "Strength from TrainingPeaks for Coaches",
  "revue": "site officiel",
  "doi": null,
  "url": "https://www.trainingpeaks.com/strength/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Strength Builder : 1 000+ vidéos, exercices perso, Premium requis, pas d'export vers appareils tiers."
 },
 {
  "cle": "tp-strength-athletes",
  "auteurs": "TrainingPeaks",
  "annee": 2026,
  "titre": "Strength from TrainingPeaks for Athletes",
  "revue": "site officiel",
  "doi": null,
  "url": "https://www.trainingpeaks.com/strength-athlete/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Exécution mobile uniquement, conformité par couleur, compte Basic limité à l'exécution."
 },
 {
  "cle": "tp-communique-2024",
  "auteurs": "TrainingPeaks",
  "annee": 2024,
  "titre": "TrainingPeaks Muscles Up with New Strength Feature",
  "revue": "PR Newswire",
  "doi": null,
  "url": "https://www.prnewswire.com/news-releases/trainingpeaks-muscles-up-with-new-strength-feature-302206105.html",
  "type": "communique",
  "niveau": "D",
  "verifie": true,
  "note": "Lancement du Strength Workout Builder le 25/07/2024."
 },
 {
  "cle": "tp-uservoice-trainheroic",
  "auteurs": "utilisateurs TrainingPeaks",
  "annee": 2020,
  "titre": "TrainHeroic link button as an add a workout option",
  "revue": "UserVoice TrainingPeaks",
  "doi": null,
  "url": "https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/41882029-trainheroic-link-button-as-a-add-a-workout-op",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "50 votes ; recopie manuelle TrainHeroic vers TP ; statut Future Opportunity."
 },
 {
  "cle": "tp-uservoice-strength-2011",
  "auteurs": "utilisateurs TrainingPeaks",
  "annee": 2011,
  "titre": "Add support for tracking strength training",
  "revue": "UserVoice TrainingPeaks",
  "doi": null,
  "url": "https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/2289895-add-support-for-tracking-strength-training",
  "type": "forum",
  "niveau": "D",
  "verifie": true,
  "note": "Ancienne demande marquée terminée ; critiques antérieures au Strength Builder."
 },
 {
  "cle": "coachbox-tp-review",
  "auteurs": "Coachbox",
  "annee": 2026,
  "titre": "TrainingPeaks Review 2026",
  "revue": "coachbox.app (concurrent)",
  "doi": null,
  "url": "https://coachbox.app/en/compare/trainingpeaks-review/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Prix coach TP (21,99 $ / 54,99 $ / +9 $ par athlète Premium) ; source concurrente déclarée."
 },
 {
  "cle": "coachbox-trainheroic-review",
  "auteurs": "Coachbox",
  "annee": 2026,
  "titre": "TrainHeroic Review 2026",
  "revue": "coachbox.app (concurrent)",
  "doi": null,
  "url": "https://coachbox.app/en/compare/trainheroic-review/",
  "type": "site",
  "niveau": "D",
  "verifie": true,
  "note": "Prix TrainHeroic de 9,99 $ (1 athlète) à 399,99 $ (1 000 athlètes) ; source concurrente."
 },
 {
  "cle": "dcrainmaker-garmin-tp",
  "auteurs": "DC Rainmaker",
  "annee": 2026,
  "titre": "Garmin Acquires TrainingPeaks & TrainHeroic",
  "revue": "dcrainmaker.com",
  "doi": null,
  "url": "https://www.dcrainmaker.com/2026/07/garmin-acquires-training-trainheroic.html",
  "type": "presse",
  "niveau": "D",
  "verifie": true,
  "note": "Rachat annoncé le 22/07/2026 ; TrainHeroic ~500 000 utilisateurs et 10 000 coachs."
 }
]
```

```csv
produit,categorie,cible,modele,prix_2026,date_verif_prix,url_prix,integrations,plateformes,fait_mieux_que_CU,CU_fait_en_plus,avis_url
intervals.icu,plateforme d'analyse et de planification endurance (coach + athlète),"athlètes d'endurance autonomes et coachs (vélo, course, tri); 160 000+ athlètes actifs revendiqués","freemium : gratuit + Supporter optionnel","0 $ ; Supporter 4 $/mois (payable par trimestre ou à l'année)",30/09/2026,https://www.intervals.icu/pricing/,"Strava, Garmin, Wahoo, Zwift, Coros, Polar, Oura, WHOOP, Dropbox, 250+ applis tierces ; API publique REST + OAuth, usage commercial autorisé","web (appli mobile native en cours), API","analyse endurance (puissance, FC, intervalles, forme/fatigue), calendrier et plans, vue coach multi-athlètes, groupes et chat, envoi des séances d'endurance aux montres, écosystème de 250+ applis, gratuit","séances de muscu structurées (exercices/séries/reps/charges), exécution guidée hors-ligne avec animations 3D, tempo et minuteurs, ajustement de charge par RPE/RIR série par série, proprio, pliométrie, tests de max et de mobilité, onglet récup, vidéos d'exercices",https://forum.intervals.icu/t/weight-lifting-improvements/56656
```
