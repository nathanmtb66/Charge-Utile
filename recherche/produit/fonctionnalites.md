# Fonctionnalités : ce qui mérite sa place, ce qu'il faut supprimer

*Phase 6. Chaque idée est jugée sur son **impact** (preuve du problème : `business/04-douleurs.md`, `science/`) et son **effort** pour un développeur seul. Verdict : **à faire**, **plus tard**, ou **gadget : à ne pas faire**. Nathan veut une appli simple : la liste « à ne pas faire » est aussi importante que l'autre.*

*Échelles : impact 1 (faible) à 5 (fort) ; effort S (moins de 2 jours), M (1 à 2 semaines), L (plus d'un mois). Les notes sont les miennes : elles servent à ordonner.*

## Le principe de tri

1. **Ce qui augmente le taux de séances faites passe avant tout.** Sous environ 75 % de séances faites, rien d'autre ne compte [@viiala2026].
2. **Ce qui protège l'endurance de l'athlète passe ensuite** : c'est la douleur n° 1 (`04`).
3. **Une donnée qui ne sert à aucune décision coûte un tap** (principe déjà écrit dans `SCHEMA.md`).
4. **Tout ce qui ressemble à du soin est exclu** (`business/07`).

## A. Pour Nathan et ses 7 athlètes, maintenant

| # | Fonctionnalité | Problème résolu (preuve) | Ce que font les concurrents | Impact | Effort | Verdict |
|---|---|---|---|---|---|---|
| A1 | **Corriger les deux défauts de sécurité** du site et du relais | Données d'athlètes exposées (`07`, détails hors dépôt) | — | 5 | S-M | **À faire en premier** |
| A2 | **Taux d'adhésion par athlète** dans la vue coach (séances faites ÷ prévues sur 4 et 8 semaines, alerte sous 75 %) | L'effet d'un programme disparaît sous environ 75 % de séances faites [@viiala2026] ; l'adhésion n'est pas mesurée aujourd'hui (`09`) | TrainingPeaks : conformité par couleur | 5 | S | **À faire** (le relais donne déjà « faites / ratées ») |
| A3 | **Boucle coach visible** : « vu par Nathan » + retour d'une ligne après chaque séance | Sans coach qui répond, le remplissage tombe de 84 % à 8-28 % [@saw2015b] | TrueCoach, TrainHeroic : commentaires | 5 | M | **À faire** |
| A4 | **Bouton « j'ai 20 min »** : version courte de la séance (exercices clés, 1 série de moins) | Les cyclistes lâchent par fatigue et manque de temps [@vikestad2025] ; 1 série par exercice maintient la force [@spiering2021] | Runna : 30/45/60 min | 5 | M | **À faire** |
| A5 | **Mode de saison automatique** : développement, maintien (1 séance par semaine), affûtage selon les blocs et les courses A/B/C | Arrêter la force en saison fait perdre les acquis en 8 semaines [@ronnestad2016] ; règles `saison-maintien`, `course-a-affutage` | Aucun outil de coach étudié | 4 | M | **À faire** |
| A6 | **Garde-fou de calendrier** : alerte si une séance de jambes lourde tombe à moins de 6 h d'une séance clé, à moins de 48 h d'une course | Douleur n° 1 : peur de casser l'endurance (`04`) ; [@robineau2016] [@petre2021] | TrainerRoad : les séries saisies allègent le vélo du lendemain | 4 | M | **À faire** (dépend des heures de séance dans intervals) |
| A7 | **Ajustement de charge amélioré** : pas proportionnel, plafond de +10 % par séance, pas de hausse sur la 1re série, arrêt après 2 séries incomplètes | Le RIR est faux d'environ 1 répétition [@halperin2022] ; sécurité (`07`) | Alpha Progression, Enode | 4 | S | **À faire** (règles `autoreg-*`) |
| A8 | **Charge finale proposée pour la séance suivante**, validée par le coach | Aujourd'hui : « Nathan montera la prochaine fois », à la main | CoachingPortal | 4 | S | **À faire** |
| A9 | **Charge sRPE envoyée à intervals** et nommée ainsi | 30 citations sur « la muscu ne compte pas » (`04`) ; méthode valide [@foster2001] | Watts & Weights | 3 | S | **À faire** (vérifier ce que le relais envoie déjà) |
| A10 | **Marge d'erreur visible sur chaque test** (« stable » sous l'erreur de mesure) et correction de 3 valeurs de `tests.json` | Plusieurs `mdc` trop optimistes (`science/H`) | — | 3 | S | **À faire** |
| A11 | **Asymétrie confirmée sur 2 passations** avant d'être affichée | Les seuils de 10-15 % sont arbitraires [@parkinson2021] | — | 3 | S | **À faire** |
| A12 | **Raison d'une séance sautée en un tap** (fatigue, temps, matériel, gêne, pas envie) | Sert au coach à comprendre ; cadre capacité-opportunité-motivation [@michie2011] | — | 3 | S | **À faire** |
| A13 | **Compteur de contacts de pliométrie** par séance et par bloc | Au-delà d'environ 1 000 contacts par bloc, plus de gain [@ramirezcampillo2023] | — | 2 | S | **Plus tard** |
| A14 | **Micro-séance « os » de 5 min** pour les cyclistes purs, 3 à 5 fois par semaine | Densité osseuse basse fréquente chez les cyclistes [@hilkens2024] | — | 3 | S | **À faire** (une séance modèle suffit) |
| A15 | **Bouton « Douleur » renommé « Gêne »**, avec retrait de la zone après 2 signalements | Ligne du dispositif médical (`07`) ; les coureurs continuent malgré la gêne [@besomi2025] | — | 4 | S | **À faire** |
| A16 | **Liste de mots interdits dans les consignes de Claude** (soigner, rééducation, prévenir la blessure…) | Ligne du dispositif médical (`07`) | — | 4 | S | **À faire** |
| A17 | **Intégration des fiches candidates** (phase 3), en commençant par les 20 premières de `SYNTHESE.md` | Trous de la carte de couverture | Bibliothèques de 1 000+ vidéos | 4 | L (animations) | **À faire, par lots** |
| A18 | **Vraies vidéos tournées par Nathan** pour les 30 exercices les plus prescrits | Les animations faites main sont le point faible (`05`) ; lien externe = risque (`07`) ; contenu réutilisable sur Instagram (`08`) | Tous les concurrents | 4 | M | **À faire** |
| A19 | **Score de forme du matin** (5 taps) qui propose garder / alléger / remplacer | Le subjectif suit mieux la charge que l'objectif [@saw2016], mais le score n'est **pas validé** (`science/D`) | WHOOP, ThePerfClub | 2 | M | **Plus tard** : tester d'abord à la main avec les 7 athlètes |
| A20 | **Respiration : passer à 6 cycles par minute après une séance dure**, garder la carrée pour avant un départ | [@laborde2022] | — | 2 | S | **À faire** (réglage) |
| A21 | **Conseils de fin de séance alignés sur `science/E`** : pas de froid après la muscu en développement, pas de poids cible | [@malta2021] [@mountjoy2023] | — | 3 | S | **À faire** |

## B. Pour vendre (seulement si les critères de `business/08` sont atteints)

| # | Fonctionnalité | Pourquoi | Ce que font les concurrents | Impact | Effort | Verdict |
|---|---|---|---|---|---|---|
| B1 | **Comptes coach** (lien magique par e-mail), espace par coach, athlètes ajoutés par invitation | Indispensable à plusieurs coachs ; sécurité (`07`) | Tous | 5 | L | **À faire** (MVP) |
| B2 | **Quitter GitHub Pages** pour Cloudflare Pages + D1, séances servies après authentification du lien | GitHub Pages interdit le SaaS [@github-pages-limites] ; fichiers publics | — | 5 | L | **À faire** (MVP) |
| B3 | **OAuth intervals.icu par athlète** | La clé du coach ne passe pas à l'échelle (`03`) | PacePartner, Trevo | 5 | M | **À faire** (MVP) |
| B4 | **Création de séance par dictée ou texte, avec validation du coach et garde-fous** | C'est le cœur ; l'IA seule n'est plus un argument (`01`) | Trainerize, Everfit, PacePartner | 5 | M | **À faire** (MVP) |
| B5 | **Éditeur manuel de séance** (sans IA) et **séances modèles** réutilisables | Dépendance à Claude (`05`) ; coût de l'API pour un SaaS à 2 € par athlète (`06`) | Tous | 4 | M | **À faire** (MVP) |
| B6 | **Sauvegarde serveur de l'historique athlète** | Safari efface le stockage local d'un site non installé (`07`) | Tous | 4 | M | **À faire** (MVP) |
| B7 | **Paiement** (Stripe ou merchant of record), CGU/CGV, médiateur, résiliation en 3 clics | Obligations légales (`07`) | Tous | 5 | M | **À faire** (MVP) |
| B8 | **Remplacement du squelette AGPL** | Licence (`07`) | — | 5 | M | **À faire avant toute vente** |
| B9 | **Consentement explicite « données de santé »**, politique de confidentialité, pseudonymisation de ce qui part vers Claude | RGPD (`07`) | — | 5 | M | **À faire** (MVP) |
| B10 | **Onboarding en moins de 5 minutes** : séance de démonstration prête, premier athlète invité par lien | Les deux premières semaines décident de l'abandon [@kidman2024] | Hevy Coach : essai de 30 jours | 4 | M | **À faire** (MVP) |
| B11 | **Intégration Nolio et TrainingPeaks** | La plupart des coachs français sont sur Nolio (`02`) | Dialed Health (via TrainingPeaks) | 4 | L | **Plus tard** (vérifier d'abord l'existence d'une API ouverte) |
| B12 | **Vue coach multi-athlètes** : adhésion, dernière séance, gênes signalées, tests | Les coachs veulent « tout au même endroit » (`04`) | TrainHeroic, TeamBuildr | 4 | M | **À faire** (existe en partie) |
| B13 | **Export d'un bilan PDF** pour un club ou un pôle | Demande probable des structures (à tester par fausse porte, `08`) | MyCoach Pro, AthleteMonitoring | 2 | S | **Plus tard** (seulement si la fausse porte est cliquée) |
| B14 | **Appli native (App Store, Play Store)** | Visibilité, confiance ; pas nécessaire techniquement (`07`) | Tous | 3 | L | **Plus tard** (après 100 payants) |
| B15 | **Version anglaise** | Le marché français est trop petit (`02`) | — | 4 | M | **Plus tard** (après la preuve en français) |

## C. À ne pas faire (gadgets, ou contraires à la preuve)

| Idée | Pourquoi non | Preuve |
|---|---|---|
| **Badges, points, niveaux** | Gain marginal, coûteux, peut remplacer la motivation autonome | [@mazeas2022] [@ntoumanis2021] |
| **Série de jours consécutifs** (« streak ») | Incompatible avec le repos ; pousse à s'entraîner avec une gêne | [@ingalls2026] |
| **Classement entre athlètes sur les charges** | Certains décrochent ; à la rigueur, assiduité seule et sur volontariat | [@tong2018] |
| **Notifications quotidiennes** | Effet faible qui s'use ; un seul rappel le jour prévu suffit | [@bidargaddi2018] |
| **« TSS de la musculation »** calculé par exercice | Aucun consensus ; une charge sRPE honnête suffit | [@foster2001] ; débat dans `04` |
| **ACWR et « zone de danger »** | Aucune base causale | [@impellizzeri2020] |
| **Score de risque de blessure** tiré des tests | Les tests ne prédisent pas la blessure | [@moran2017b] |
| **Alerte rouge à 10-15 % d'asymétrie** | Seuils arbitraires | [@parkinson2021] |
| **Détection du valgus ou note de technique par IA sur la vidéo** | Non validé sous charge (`science/H`) ; risque juridique | [@ortiz2016] |
| **1RM estimé par la vitesse de barre au téléphone** | Erreur d'environ 10 % ; pas mieux que les répétitions | [@greig2023] |
| **Calories de la séance, FC du poignet en musculation** | Mesures fausses | [@fuller2020] [@zhang2020] |
| **Programmes par phase du cycle menstruel** | Effet trivial, preuve de qualité basse | [@mcnulty2020] |
| **Conseils de compléments par défaut** (collagène, cétones, nitrate…) | Preuves faibles ou nulles ; risque de dopage involontaire | `science/E` |
| **Poids cible, suivi du poids mis en avant** | Risque de déficit énergétique chez les jeunes endurants | [@mountjoy2023] |
| **Programmes « tendon », « genou douloureux », « retour de blessure »** | C'est du soin : dispositif médical | `business/07` |
| **Coach vocal conversationnel pour l'athlète** | Obligations de l'AI Act, coût, risque d'erreur sans relecture ; le coach humain est l'avantage | `business/07`, `idees-folles.md` |
| **Réseau social, fil d'actualité, partage public** | Strava le fait ; hors sujet | `business/01` |
| **Marketplace de programmes** | Pas avant 2 000 utilisateurs actifs | `business/06` |
| **Version grand public sans coach** | Marché saturé (Runna, Kiprun Pacer gratuit, Garmin) | `business/05` |

## D. À supprimer ou à simplifier dans l'appli actuelle

1. **Les liens « Voir en vrai » vers des recherches YouTube** : à remplacer peu à peu par des vidéos de Nathan (`A18`). Garder le lien simple vers les fiches officielles d'ici là.
2. **Les questions de ressenti sans décision** : toute question dont la réponse ne change rien (ni la série suivante, ni ce que voit le coach) doit disparaître.
3. **La respiration carrée après une séance dure** : la remplacer par le 6 cycles par minute (`A20`).
4. **Le conseil de bain froid après la musculation** en phase de développement (`A21`).
5. **Les repères de tests non vérifiés affichés comme des normes** (13 s d'équilibre, 25 répétitions de pont, 30° de rotation de hanche) : les présenter comme des repères d'usage, ou les retirer (`science/H`).
6. **Le mot « douleur »** dans l'interface et dans les messages envoyés à intervals : « gêne » (`A15`).

## Les 10 à construire en premier

Voir `SYNTHESE.md`. Dans l'ordre : A1, A2, A3, A7 + A8, A4, A5, A6, A15 + A16, A10 + A11, A18.

## Sources

[@viiala2026] [@saw2015b] [@vikestad2025] [@spiering2021] [@ronnestad2016] [@robineau2016] [@petre2021] [@halperin2022] [@foster2001] [@parkinson2021] [@michie2011] [@ramirezcampillo2023] [@hilkens2024] [@besomi2025] [@saw2016] [@laborde2022] [@malta2021] [@mountjoy2023] [@github-pages-limites] [@kidman2024] [@mazeas2022] [@ntoumanis2021] [@ingalls2026] [@tong2018] [@bidargaddi2018] [@impellizzeri2020] [@moran2017b] [@ortiz2016] [@greig2023] [@fuller2020] [@zhang2020] [@mcnulty2020].
