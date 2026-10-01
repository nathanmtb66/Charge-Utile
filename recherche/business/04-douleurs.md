# 04 — Douleurs des utilisateurs : la preuve du besoin (ou de son absence)

*Collecte du 30 septembre 2026. 189 citations courtes (≤ 15 mots) tirées de 52 fils ou pages réellement ouverts. Liste brute complète, avec le détail de chaque source : `_brut/douleurs.md`.*

## En 30 secondes

- **Le besoin le plus massif ne porte pas sur un outil.** Il porte sur la **cohabitation muscu ↔ endurance** : 68 citations sur 188 comptées (36 %). Peur de la fatigue ou du poids (34), manque de temps (15), ne pas savoir quoi faire ni où placer la muscu (19). Charge Utile gagne sur ce terrain s'il **dose et place** la muscu, pas s'il la note seulement.
- **Le besoin « outil » est prouvé, mais chez un public très data** (forums intervals.icu, TrainerRoad, TrainingPeaks) :
  - la muscu ne compte pas dans la charge d'endurance : 30 citations en thème principal, 33 mentions ;
  - la ressaisie entre applis : 15 / 21 ;
  - le bricolage multi-applis : 22 / 27.
- **« Le coach ne sait pas si l'athlète a fait sa muscu » est à peine documenté** : 4 citations en thème principal après relecture, 5 mentions, dont 3 venues d'athlètes. C'est pourtant l'hypothèse de départ du produit côté coach. **Elle n'est pas démontrée en ligne** et doit être testée en entretien (voir `08-go-to-market.md`).
- **Les contre-preuves sont sérieuses** : 19 citations en thème principal, 24 mentions. Beaucoup se satisfont de Strong, Hevy, d'un tableur ou d'un carnet. Un simple carnet de muscu de plus n'a aucune chance.
- **88 % des citations viennent d'athlètes** (166 sur 189, contre-preuves comprises). Les coachs d'endurance s'expriment peu en public, et surtout sur l'éparpillement des plateformes.

## Relecture contradictoire (1er octobre 2026)

- **Fidélité** : 90 citations sur 189 revérifiées **mot pour mot** par un sous-agent contradicteur (intervals.icu et TrainerRoad lus en JSON Discourse, Slowtwitch, vo2cycling). **Aucune citation inventée ni déformée**, toutes ≤ 15 mots.
- **Corrections appliquées** :
  - « accountability… TR calendar » reclassée de T2 vers T8 : l'auteur parle de son propre engagement, pas d'un coach ;
  - la citation « math homework » est sortie du comptage (message promotionnel).
- **Datation** : environ **15 citations datent d'avant 2024** et visent des problèmes en partie réglés depuis :
  - fil UserVoice TrainingPeaks de 2015-2018, avant le Strength Builder de juillet 2024 ;
  - fil TrainerRoad de 2019 sur le TSS muscu, avant la saisie des séries en 2024 ;
  - fil intervals.icu n° 685, marqué « résolu ».

  Les thèmes T1, T4 et T6 sont donc **un peu surestimés** pour 2026. Le classement des thèmes ne change pas.
- **Côté coach, nuance** : 2 coachs d'endurance demandent un **suivi centralisé** de la muscu de leurs athlètes (fils intervals.icu 113468 et 128015). Ce n'est toujours pas « je ne sais pas s'ils la font ». Le verdict « non démontré » tient.

## Méthode et biais

- **Sources** : forum intervals.icu (lu par l'API publique de Discourse), forum TrainerRoad, Slowtwitch, forum Evoke Endurance, boîte à idées TrainingPeaks, deux forums vélo et VTT français, avis d'applis (Runna, TrainHeroic, TrueCoach). **Reddit a été bloqué** (403, refus de lecture) : aucune citation Reddit. **Kikourou et G2 aussi** (403).
- **Biais de sélection** : les forums intervals.icu et TrainerRoad attirent des athlètes qui mesurent tout. Ils sur-représentent les thèmes « charge » et « ressaisie ». L'athlète de 20 ans qui ne lit pas de forum, soit le cœur de cible de Nathan, n'est presque pas représenté.
- **Trous** : ski nordique (0 citation), trail et course (seulement via les avis Runna), sources françaises (2 fils, dont un ancien d'environ 2009-2010), coachs d'endurance (18 citations sur 189).
- **Classement** : chaque citation a un thème principal (colonne « principal ») et peut toucher un second thème (colonne « mentions »).

## Comptage par thème

| # | Thème | Principal | Mentions | dont coachs | dont athlètes | Lecture |
|---|---|---|---|---|---|---|
| T9 | Peur de la fatigue ou du poids pour l'endurance | 34 | 35 | 0 | 35 | **Douleur n° 1.** Besoin de dosage, pas d'outil |
| T6 | La muscu ne compte pas dans la charge (TSS, fitness) | 30 | 33 | 3 | 30 | Prouvée chez les athlètes data ; débat réel sur l'utilité (voir T12) |
| T4 | Trop compliqué / trop d'applis / outil inadapté | 22 | 27 | 9 | 18 | Prouvée, y compris chez les coachs (« 2-3 plateformes par client ») |
| T10 | Je ne sais pas quoi faire / programmes génériques | 19 | 22 | 2 | 20 | Prouvée : demande de programmes pensés pour cyclistes et coureurs |
| T12 | **Contre-preuves** : satisfaits (Strong, Hevy, tableur, papier) | 19 | 24 | 2 | 22 | Frein sérieux : la simplicité gratuite suffit à beaucoup |
| T5 | Double saisie / ressaisie à la main | 14 (+1 exclue) | 20 | 1 | 19 | Prouvée : copier-coller, doublons, scripts perso |
| T8 | Pas le temps / je saute la muscu | 15 | 16 | 0 | 16 | Prouvée : argument pour des séances courtes |
| T1 | La muscu n'est pas suivie / pas enregistrée | 13 | 15 | 4 | 11 | Moyenne |
| T7 | Prix | 9 | 11 | 1 | 10 | Modérée : surtout « pas un 2e abonnement » |
| T2 | Le coach ne sait pas si c'est fait | 4 | 5 | 2 | 3 | **Faible / non démontrée** |
| T3 | Exos mal faits / technique | 3 | 5 | 2 | 3 | Faible en ligne (mais les coachs en parlent : voir T13) |
| T13 | Besoin de vidéos / démonstrations | 3 | 4 | 2 | 2 | Faible mais concrète : liens vidéo collés dans les descriptions |
| T11 | Pas de salle / voyage | 3 | 3 | 0 | 3 | Quasi absente (seulement le COVID) |
| | **Total** | **189 (188 comptées)** | | **23** | **166** | |

*5 des 23 citations de coachs viennent de personnes hors endurance (BMX, préparateurs TrueCoach et TrainHeroic).*

## Ce que ça veut dire pour Charge Utile

1. **Le cœur de la valeur, c'est la muscu qui ne casse pas le vélo.** Les athlètes ont peur de rater leurs séances clés : jambes lourdes, courbatures de plusieurs jours, kilos en plus. C'est le thème le plus cité, en anglais comme en français. Ce que Charge Utile fait déjà va dans ce sens : RIR, charge ajustée, tempo, plan de saison. **Il faut le rendre visible** (« cette séance est placée à 48 h de ta sortie longue », « volume réduit en semaine de course »), et c'est là que la science de la phase 2 devient un argument de vente.
2. **Le lien avec la charge d'endurance est un vrai manque, mais il divise.** Les uns réclament un TSS muscu, les autres le jugent « inventé » ou inutile.
   - La réponse honnête : envoyer une **charge sRPE** (RPE × durée, méthode de Foster, reconnue ; voir la phase 2 D), sans prétendre à un TSS précis.
   - Montrer surtout la séance **dans le calendrier** de l'athlète et du coach.
   - C'est exactement ce que fait déjà le relais intervals.icu. C'est un vrai différenciateur face à TrainHeroic et Hevy, qui n'envoient rien vers intervals.
3. **La ressaisie est la douleur « outil » la plus concrète** : copier-coller dans les notes, doublons Garmin/Strava, scripts perso, chaînes Hevy → Santé → Garmin → intervals. Un produit qui supprime la ressaisie règle un problème réel, pour une petite population très motivée.
4. **Le côté coach reste à prouver.** On n'a trouvé **aucune citation publique d'un coach d'endurance** disant « je ne sais pas si mes athlètes font leur muscu ».
   - Les coachs se plaignent surtout d'avoir plusieurs plateformes par athlète, et de devoir coller des liens vidéo dans les descriptions.
   - Si Charge Utile se vend aux coachs, l'argument vérifié est « tout au même endroit, dans intervals ». « Enfin tu sais ce qu'ils font » reste à valider.
5. **Le prix doit être proche de zéro pour l'athlète.** Les athlètes refusent un 2e abonnement. Les solutions gratuites (Strong, Hevy, tableur) sont jugées suffisantes par beaucoup. Si quelqu'un paie, c'est plutôt le coach ou la structure (voir `06-modele-economique.md`).
6. **Le voyage / sans salle (T11) n'est pas une douleur exprimée.** Les séances « voyage » restent utiles pour la continuité, mais ce n'est pas un argument commercial.

## Verdict franc

- **Besoin prouvé** : 1) « je ne sais pas doser la muscu sans abîmer mon endurance » (le plus massif) ; 2) « ma muscu vit dans une autre appli et ne compte pas dans ma charge » (athlètes data, surtout cyclistes).
- **Besoin non démontré** : « le coach ne sait pas si c'est fait ».
- **Frein démontré** : la concurrence gratuite et simple (Strong, Hevy, tableur) satisfait une partie importante des gens.
- **Ce que la collecte ne dit pas** : ce que pensent les jeunes athlètes de niveau régional ou national qui ne vont pas sur les forums, et les coachs français. Seuls des entretiens le diront (voir `08-go-to-market.md`, script de 15 questions).

## Sources principales (fils les plus riches)

- intervals.icu : ressaisie et contournements [@intervals-weight-lifting-improvements] ; demande d'intégration Hevy [@intervals-hevy-integration] ; coach de juniors cherchant un flux d'enregistrement [@intervals-workflows-logging] ; liens vidéo dans les descriptions [@intervals-video-exercise] ; charge muscu [@intervals-factoring-strength] [@intervals-loads-no-longer-counted].
- TrainerRoad : muscu et fatigue [@tr-struggling-gym-riding] [@tr-strength-killed-fitness] ; débat sur le TSS muscu [@tr-weights-weekly-tss] ; recherche d'applis [@tr-app-for-strength].
- TrainingPeaks : votes sur la muscu [@tp-uservoice-strength-interface] [@tp-uservoice-bring-back-strength] ; Strength Builder sans TSS [@evoke-tp-strength-builder].
- Français : [@vo2cycling-muscu-hivernale] [@26in-muscu-vtt].

## Toutes les citations, classées par thème principal

Format : citation d'origine — traduction — qui — [thèmes] — lien. Les pseudos ne sont pas repris.

### T1 — La muscu n'est pas suivie / pas enregistrée (13 citations en thème principal)

- « I use intervals.icu to track my strength workouts now, but it's not ideal. » *je suis ma muscu dans intervals.icu, mais ce n'est pas idéal.* — athlète — [T1] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « not too much of a hassle for them to get it logged » *[je cherche un process] pas trop pénible pour qu'ils l'enregistrent.* — coach de juniors — [T1 / T2] — <https://forum.intervals.icu/t/workflows-for-logging-strength-training/113468>
- « I do program strength into my athlete's schedules, so this would be a difference maker » *je programme de la muscu à mes athlètes, ce serait décisif.* — coach triathlon / gravel / ultra — [T1] — <https://forum.intervals.icu/t/strength-training-module/68281>
- « theres a gap in intervals in terms of features for folks that do strength training » *il manque des fonctions pour ceux qui font de la muscu.* — athlète — [T1] — <https://forum.intervals.icu/t/gym-workout-log/90810>
- « All of the exercises, sets, and reps are lost. » *tous les exercices, séries et reps sont perdus [à la synchro].* — athlète — [T1 / T5] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « Weight Lifting desperately needs support. » *la muscu a désespérément besoin d'être gérée.* — cycliste — [T1] — <https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927>
- « I'd like the ability to log my actual sets , reps and weights. » *j'aimerais pouvoir saisir mes vraies séries, reps et charges.* — cycliste — [T1] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « I also need help remembering week to week what weight I'm at » *j'ai besoin d'aide pour me rappeler ma charge d'une semaine à l'autre.* — cycliste — [T1] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « is a huge part of my coaching practice » *[la muscu] est une grosse part de ma pratique de coach.* — coach endurance (idée à 99 votes, statut « Completed » mai 2024) — [T1] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/45506320-strength-training-interface>
- « Please include sets/reps/weight for structured strength workouts. » *ajoutez séries/reps/charges aux séances muscu structurées.* — utilisateur — [T1] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/45506320-strength-training-interface>
- « I just like to see the ability to record what exercises I performed » *je veux juste pouvoir noter les exercices faits.* — athlète (2018) — [T1] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « Garmin removes the exercise names and workout structure from the API export. » *Garmin retire noms d'exercices et structure dans l'export API.* — athlète — [T1 / T5] — <https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015>
- « Unfortunately, Intervals isn't using that data… » *malheureusement intervals n'utilise pas ces données.* — pratiquant — [T1] — <https://forum.intervals.icu/t/strength-training-exercises-as-intervals-laps-on-the-timeline-hr-per-exercise-possible/128015>

### T2 — Le coach ne sait pas si l'athlète a fait sa séance (4 citations en thème principal après relecture)

- « copy/paste the workout from Strong to a TrainingPeaks comment as text for my coach » *copier-coller la séance en commentaire TrainingPeaks pour que mon coach la voie.* — cycliste coaché — [T2 / T5] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « This also allows my coach to see. » *ça permet aussi à mon coach de voir.* — athlète coaché — [T2] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/45506320-strength-training-interface>
- « We answer more questions about strength workouts, which is more time spent » *on répond à plus de questions sur la muscu : plus de temps perdu.* — coach (2015) — [T2 / T3] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « you might need a coach for motivation and accountability » *il te faut peut-être un coach pour la motivation et le suivi.* — triathlète — [T2] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>

### T3 — Exos mal faits / technique (3 citations en thème principal)

- « actual coaching for proper form is more critical » *un vrai coaching de la technique est plus important.* — pratiquant — [T3] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « How someone performs an exercise makes an infinite difference » *la façon d'exécuter un exercice change tout.* — cycliste ex-haltérophile — [T3] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « in person session with her at her gym every 6-8 months to double check form » *une séance en présentiel tous les 6-8 mois pour vérifier la technique.* — triathlète coaché — [T3] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>

### T4 — Trop compliqué / trop d'applis / outil inadapté (22 citations en thème principal)

- « the Garmin strength workout builder is an atrocity » *le créateur de séances muscu de Garmin est une horreur.* — athlète — [T4] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « getting bogged down in gadgety muscle group references and a million different plans » *[les applis muscu] s'enlisent dans des gadgets de groupes musculaires et mille programmes.* — athlète — [T4] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « so we have all their work in one place » *pour avoir tout leur travail au même endroit.* — coach de juniors — [T4] — <https://forum.intervals.icu/t/workflows-for-logging-strength-training/113468>
- « I wish there were a magic solution to cater to both » *j'aimerais une solution magique pour les deux [vélo et muscu].* — athlète vélo + CrossFit — [T4] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « including popular ones, but none of them have a public API » *[d'innombrables applis muscu], même populaires, aucune n'a d'API publique.* — athlète-développeur — [T4] — <https://forum.intervals.icu/t/weight-training-apps-with-public-api/125221>
- « the notes become pretty unreadable » *les notes deviennent illisibles.* — athlète — [T4 / T5] — <https://forum.intervals.icu/t/gym-workout-log/90810>
- « they just open app and start training » *[il faut que mes clients] ouvrent l'appli et s'entraînent, c'est tout.* — coach — [T4] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « a handful of tools that are missing or areas of poor workflow » *[tout coach citera] des outils manquants ou un flux de travail pénible.* — coach (présumé) — [T4] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « the Garmin strength builder sucks massively » *le créateur muscu de Garmin est vraiment nul.* — pratiquant — [T4] — <https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927>
- « some annoying interface quirks with Hevy » *des bizarreries d'interface agaçantes dans Hevy.* — cycliste — [T4] — <https://www.trainerroad.com/forum/t/strength-app-including-progressions/79901>
- « Annoying, but hopefully short-term. » *pénible, mais j'espère provisoire.* — coach — [T4] — <https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/>
- « not have to use 2-3 different platforms for each client » *ne plus devoir utiliser 2-3 plateformes par client.* — coach endurance kiné — [T4] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/45506320-strength-training-interface>
- « I coach endurance athletes so it doesn't make sense to have people on multiple platforms » *je coache de l'endurance, pas logique d'avoir les gens sur plusieurs plateformes.* — coach endurance (2017, idée à 219 votes) — [T4] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « inability of my coach to modify workouts, create sets, reps, ranges, etc. is quite frustrating » *que mon coach ne puisse ni modifier ni créer séries/reps, c'est frustrant.* — athlète (2015) — [T4] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « I now have hundreds of unusable workouts and templates » *j'ai maintenant des centaines de séances et modèles inutilisables.* — utilisateur (coach présumé, 2016) — [T4] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « Not able to edit the exercises in an existing workout » *impossible de modifier les exercices d'une séance existante.* — athlète (2015) — [T4] — <https://peaksware.uservoice.com/forums/106657-trainingpeaks-customer-feedback/suggestions/9594369-bring-back-functionality-of-strength-workouts>
- « The flow goes Hevy > Apple Health > Breakaway > Garmin > intervals.Icu » *le circuit : Hevy > Santé > Breakaway > Garmin > intervals.* — athlète — [T4 / T5] — <https://forum.intervals.icu/t/integration-with-hevy/114887>
- « an app where I can flexibly plan strength workouts and sync the data » *une appli pour planifier la muscu et synchroniser les données.* — athlète — [T4 / T5] — <https://forum.intervals.icu/t/strength-planning/130895>
- « it's tedious to have to go back and adjust the entire plan » *fastidieux de devoir réajuster tout le plan.* — utilisateur TrainHeroic (hors endurance) — [T4] — <https://apps.apple.com/us/app/955074569?see-all=reviews&platform=iphone>
- « The slowest app I have ever encountered » *l'appli la plus lente que j'aie jamais vue.* — utilisateur TrainHeroic (hors endurance) — [T4] — <https://apps.apple.com/us/app/955074569?see-all=reviews&platform=iphone>
- « crashes approximately every 90 seconds » *[l'appli coach] plante environ toutes les 90 secondes.* — coach, TrainHeroic (hors endurance) — [T4] — <https://apps.apple.com/us/app/955074569?see-all=reviews&platform=iphone>
- « it is a bit clumsy to use the program in my phone's browser » *un peu maladroit à utiliser dans le navigateur du téléphone.* — coach, TrueCoach (hors endurance, août 2022) — [T4] — <https://capterra.com/p/155784/truecoach/reviews/>

### T5 — Double saisie / ressaisie à la main (14 citations comptées en thème principal, 1 exclue car promotionnelle)

- « I would not bother entering details like reps or weights on the watch » *je ne m'embêterais pas à saisir reps et charges sur la montre.* — athlète — [T5] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « so I have to manually edit the description again » *je dois ré-éditer la description à la main.* — athlète — [T5] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « Although it is a dull work. » *[copier-coller les séances], c'est un travail ennuyeux.* — pratiquant — [T5] — <https://forum.intervals.icu/t/strength-training-module/68281>
- « Currently I am manually copying and pasting across into the notes field » *je copie-colle à la main dans les notes.* — athlète — [T5] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « since Hevy doesn't record HR it comes into intervals a little silly » *Hevy n'enregistrant pas la FC, ça arrive bizarrement dans intervals.* — athlète — [T5 / T6] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « I have to delete the entry that Garmin creates in Strava so it's not double » *je dois supprimer le doublon Garmin dans Strava.* — athlète — [T5] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « The weight lifted has to be entered manually, however. » *le poids soulevé doit être saisi à la main.* — athlète — [T5] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « you still need to manually enter the total weight lifted and load (tss) » *il faut quand même saisir à la main tonnage et TSS.* — cycliste (Hevy → Strava → intervals) — [T5 / T6] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « I just wished it sync to TR but it doesn't at the moment. » *j'aimerais que ça se synchronise avec TR, ce n'est pas le cas.* — cycliste — [T5 / T4] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « scribbling sets and reps like I'm doing math homework in the squat rack » *griffonner séries et reps comme un devoir de maths sous la barre.* — cycliste (ton promotionnel possible) — [T5] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664> — **exclue du comptage (message promotionnel pour PT Distinction)**
- « I create a blank strength workout below the new strength workout and input TSS » *je crée une séance muscu vide en dessous pour y mettre le TSS.* — coach — [T5 / T6] — <https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/>
- « an old Strength Builder session to record duration and TSS, and a new one » *une ancienne séance pour durée et TSS, une nouvelle pour séries et reps.* — athlète — [T5] — <https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/>
- « If direct integration with intervals.icu was available that would be much easier for everyone. » (14 mots) *une intégration directe simplifierait la vie de tous.* — athlète — [T5] — <https://forum.intervals.icu/t/integration-with-hevy/114887>
- « the workout data from Hevy doesnt seem to get picked up well by strava » *les données Hevy passent mal dans Strava.* — athlète — [T5] — <https://forum.intervals.icu/t/integration-with-hevy/114887>
- « Another resounding "Yes Please". » *encore un grand « oui, svp ».* — athlète (le fil compte une quinzaine de « +1 » pour une intégration Hevy) — [T5] — <https://forum.intervals.icu/t/integration-with-hevy/114887>

### T6 — Pas de lien avec la charge d'endurance (TSS, fitness) (30 citations en thème principal)

- « Is there a way to set (automatically) a fixed load to strength training activities » *peut-on attribuer automatiquement une charge fixe aux séances de muscu ?* — athlète — [T6] — <https://forum.intervals.icu/t/fixed-load-to-strength-training-activities/46718>
- « RPE is realy hard to use sometimes. » *le RPE est parfois vraiment dur à utiliser.* — athlète — [T6] — <https://forum.intervals.icu/t/fixed-load-to-strength-training-activities/46718>
- « I think the HR is probably not sufficient, if you lift very heavy » *la FC ne suffit sans doute pas si on soulève très lourd.* — athlète — [T6] — <https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637>
- « the discussions reach from 0% to 100%. So no clear picture here. » *les avis vont de 0 à 100 % : rien de clair.* — athlète — [T6] — <https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637>
- « a total weight lifted metric isnt super useful » *le tonnage total n'est pas très utile.* — athlète — [T6] — <https://forum.intervals.icu/t/feature-request-kg-lifted-for-strength-training/5637>
- « i want to take in account the other sports for fatigue » *je veux compter les autres sports dans la fatigue.* — athlète vélo + CrossFit — [T6] — <https://forum.intervals.icu/t/include-tss-value-of-strength-training/14061>
- « the estimated load appears in brackets but isn't counted » *la charge estimée apparaît entre parenthèses mais n'est pas comptée.* — coach BMX (hors endurance) — [T6] — <https://forum.intervals.icu/t/training-load-for-strength-sessions-no-power-hr-unreliable-how-to-make-prescribed-load-count/130900>
- « HR-only load systematically mis-ranks gym work. » *une charge basée sur la seule FC classe mal le travail en salle.* — pratiquant — [T6] — <https://forum.intervals.icu/t/training-load-for-strength-sessions-no-power-hr-unreliable-how-to-make-prescribed-load-count/130900>
- « Trying to calculate a load for each exercise = way too complex. » *calculer une charge par exercice = bien trop compliqué.* — athlète — [T6 / T4] — <https://forum.intervals.icu/t/factoring-strength-workouts-into-training-load-fitness-fatigue/56500>
- « if I don't count it, I risk not capturing important fatigue. » *si je ne la compte pas, je rate une fatigue importante.* — athlète — [T6] — <https://forum.intervals.icu/t/factoring-strength-workouts-into-training-load-fitness-fatigue/56500>
- « none of the squatting had ever entered the model. » *aucun squat n'était jamais entré dans le modèle.* — coureur 60 km/sem (promo : présente son appli) — [T6] — <https://forum.intervals.icu/t/a-free-app-that-adds-strength-training-into-your-load-picture-tonnage-trimp-in-one-number/132161>
- « weight training tends to show up as a flat estimate or not at all » *la muscu apparaît en estimation plate, ou pas du tout.* — coureur (promo) — [T6 / T1] — <https://forum.intervals.icu/t/a-free-app-that-adds-strength-training-into-your-load-picture-tonnage-trimp-in-one-number/132161>
- « It's all guess work and probably not worth the effort. » *tout ça c'est du pifomètre, sans doute pas la peine.* — pratiquant — [T6 / T12] — <https://forum.intervals.icu/t/weight-lifting-improvements/56656>
- « I had found this really helpful to be able to see the entire training load » *c'était très utile de voir toute la charge d'entraînement.* — athlète vélo — [T6] — <https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685>
- « being frustrated that my bootcamp workouts weren't counted towards my training load » *frustré que mes séances bootcamp ne comptent pas dans ma charge.* — athlète — [T6] — <https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685>
- « I don't think load calculation is as straightforward » *je ne pense pas que le calcul de charge soit si simple.* — pratiquant — [T6] — <https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927>
- « Otherwise you will be constantly triggering nonsense yellow and red days. » *sinon tu déclenches sans arrêt des jours jaunes/rouges absurdes.* — cycliste — [T6] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « Even if you record it, TR doesn't always adapt your workouts. » *même enregistrée, TR n'adapte pas toujours les séances.* — cycliste — [T6] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « I find the way TR has implemented recording strangth training quite baffling » *la façon dont TR enregistre la muscu me laisse perplexe.* — cycliste — [T6 / T4] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « I'm not certain whether or not I should be entering my sets. » *je ne sais pas si je dois saisir mes séries.* — cycliste (audax) — [T6] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « our recommendations for logging sets could use some work » *nos consignes pour saisir les séries sont à revoir.* — membre de l'équipe TrainerRoad (aveu éditeur) — [T6] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « Strength training + TR Plan = mostly red/yellow » (titre du fil) *muscu + plan TR = surtout des jours rouges/jaunes.* — cycliste débutant en muscu — [T6] — <https://www.trainerroad.com/forum/t/strength-training-tr-plan-mostly-red-yellow/105065>
- « It's so hard to know what the AI will and won't do! » *impossible de savoir ce que l'IA fera ou non !* — cycliste — [T6 / T4] — <https://www.trainerroad.com/forum/t/red-days-after-strength-training-on-masters-low-volume-plan/106687>
- « I have seen lot of red days, but was not feeling drained » *beaucoup de jours rouges, sans me sentir vidé.* — cycliste — [T6] — <https://www.trainerroad.com/forum/t/red-days-after-strength-training-on-masters-low-volume-plan/106687>
- « if I don't record the gym TSS I don't have anything to reference » *sans TSS de salle, je n'ai aucune référence.* — vététiste — [T6] — <https://www.trainerroad.com/forum/t/adding-weights-to-weekly-tss-strength-training/11808>
- « It's essentially made up and not tied to a trackable metric » *c'est inventé, pas lié à une mesure suivable.* — triathlète — [T6 / T12] — <https://www.trainerroad.com/forum/t/adding-weights-to-weekly-tss-strength-training/11808>
- « I like to see the entire picture. » *j'aime voir le tableau complet.* — pratiquant multisport — [T6] — <https://www.trainerroad.com/forum/t/adding-weights-to-weekly-tss-strength-training/11808>
- « the inability to record a TSS for a strength session […] is baffling » *ne pas pouvoir saisir de TSS pour une séance muscu avec le nouveau builder, c'est sidérant.* — athlète (prépa alpinisme) — [T6] — <https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/>
- « Surely not being able to record TSS for strength sessions defeats the purpose » *ne pas pouvoir saisir de TSS, ça enlève tout l'intérêt du suivi.* — athlète (alpinisme) — [T6] — <https://evokeendurance.com/forums/topic/new-strength-builder-in-trainingpeaks-opinions/>
- « I think TR will see that im not training enough » *TR va croire que je ne m'entraîne pas assez.* — cycliste — [T6] — <https://www.trainerroad.com/forum/t/fit-in-strength-training/110409>

### T7 — Prix (9 citations en thème principal)

- « I've yet to see a simple cheap one. » *je n'en ai pas encore vu une simple et pas chère.* — athlète — [T7 / T4] — <https://forum.intervals.icu/t/strength-training-feature-set/114622>
- « I definitely don't want to pay a monthly fee higher than I pay TR! » *je ne veux surtout pas payer plus par mois que TrainerRoad.* — cycliste — [T7] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « The main downside is it is $39/month » *le gros défaut : 39 $/mois [Peak Strength, prix cité par l'utilisateur en mars 2025].* — cycliste sprinteur — [T7] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « Cons - expensive up front plus monthly subscription. » *inconvénient [Tonal] : cher à l'achat plus abonnement mensuel.* — pratiquant — [T7] — <https://forum.slowtwitch.com/t/strength-and-conditioning-advice/1287713>
- « Les prix décourage .. Une saison de vélo est assez couteuse » — cycliste (prix de la salle) — [T7] — <https://www.vo2cycling.fr/forum/entrainement/43167-pour-ou-contre-la-musculation-hivernale>
- « aside from the costs of the 2 platforms » *sans parler du coût des deux plateformes.* — cycliste (TrainingPeaks + intervals) — [T7] — <https://forum.intervals.icu/t/trainingpeaks-stick-with-it-or-not/86465>
- « you have to pay for an EXPENSIVE subscription to keep using after a week » *il faut payer un abonnement CHER au bout d'une semaine.* — coureur (Runna) — [T7] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « It is super expensive » *c'est super cher.* — coureur (Runna) — [T7] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « Its bit expensive compared to others in the same market. » *un peu cher par rapport au marché.* — préparateur physique, TrueCoach (hors endurance, déc. 2023) — [T7] — <https://capterra.com/p/155784/truecoach/reviews/>

### T8 — Pas le temps / je saute la muscu (15 citations en thème principal après relecture)

- « I like the accountability of having sessions in the TR calendar » *j'aime l'engagement que donne la séance inscrite au calendrier.* — cycliste — [T8 (reclassée : engagement personnel, pas le coach) ; était T2 / T12] — <https://www.trainerroad.com/forum/t/recording-strength-training-in-tr/113435>
- « I am struggling to fit in strength training. » *J'ai du mal à caser la muscu.* — athlète vélo — [T8] — <https://forum.intervals.icu/t/tips-for-fitting-in-off-the-bike-strength-training/64203>
- « If you are like me and hate to spend time in the gym » *Si comme moi tu détestes passer du temps en salle.* — athlète endurance, ~60 ans — [T8] — <https://forum.intervals.icu/t/tips-for-fitting-in-off-the-bike-strength-training/64203>
- « super hard to schedule a strength workout 6h distant from my hard bike workouts » *très dur de placer la muscu à 6 h des séances vélo dures.* — cycliste (critérium) — [T8] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « i've ditched the gym entirely » *j'ai complètement laissé tomber la salle.* — cycliste — [T8 / T9] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « surrounded by other people working out, I'll get it done » *entouré d'autres gens qui s'entraînent, je la fais.* — triathlète — [T8 (motivation)] — <https://forum.slowtwitch.com/t/strength-training-in-gym-vs-at-home/818797>
- « In general, I don't love strength training, I love s/b/r » *je n'aime pas la muscu, j'aime nager-rouler-courir.* — triathlète — [T8] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>
- « still have to solve the puzzle of where best to fit S&C work » *il faut encore résoudre le casse-tête : où placer la muscu.* — triathlète — [T8 / T10] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « The best program is the one that I will actually complete. » *le meilleur programme est celui que je finirai vraiment.* — triathlète master — [T8] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « simply don't have time for anything other than s/b/r » *[les gens sérieux] n'ont pas le temps pour autre chose que les 3 sports.* — triathlète — [T8] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « je ride presque plus dans la semaine » — vététiste — [T8] — <https://www.26in.fr/forums/autres/autres-sports/sujet-50962-qui-fais-de-la-musculation-en-plus-du-.html>
- « difficult for me to find a way to have 4 bike days » [et 2 jours muscu] *dur de caser 4 jours vélo et 2 de muscu.* — cycliste — [T8] — <https://www.trainerroad.com/forum/t/fit-in-strength-training/110409>
- « most of us run into time limiters » *la plupart d'entre nous butent sur le temps.* — triathlète (10 Ironman) — [T8] — <https://www.trainerroad.com/forum/t/starting-strength-triathlon-is-it-possible/77007>
- « the strength workouts are very long even when it says it will take 45 minutes » *les séances muscu sont très longues même annoncées à 45 min.* — coureur (Runna) — [T8] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « pair strength training with your running plan, which was something I neglected » *associer muscu et plan de course, ce que je négligeais.* — coureur (Runna, avis positif) — [T8 / T12] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>

### T9 — Peur de la fatigue ou du poids pour l'endurance (34 citations en thème principal)

- « your on bike workouts are going to be compromised in some capacity for a while » *tes séances vélo vont être compromises un moment.* — pratiquant (conseil à un débutant) — [T9] — <https://forum.intervals.icu/t/tips-for-fitting-in-off-the-bike-strength-training/64203>
- « I find it hard to bike after very hard strength training lessons. » *j'ai du mal à rouler après des séances de muscu très dures.* — cycliste — [T9] — <https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685>
- « it takes some juggling and careful consideration to strength train » *faire de la muscu demande de jongler et de bien réfléchir.* — pratiquant pro-muscu — [T9 / T10] — <https://forum.intervals.icu/t/could-weight-training-hurt-my-ftp-aerobic-power/1420>
- « in order to minimise disruption in aerobic performance? » *pour perturber le moins possible la performance aérobie ?* — coureur cycliste sur route — [T9] — <https://forum.intervals.icu/t/could-weight-training-hurt-my-ftp-aerobic-power/1420>
- « do a couple strength workouts is challenging for me from a recovery standpoint » *caser deux séances de muscu est dur côté récupération.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « I felt like my strength workouts were hurting my hard biking workouts. » *j'avais l'impression que la muscu abîmait mes séances vélo dures.* — cycliste (critérium) — [T9] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « I'm not trying to become Arnold » *je n'essaie pas de devenir Schwarzenegger.* — cycliste — [T9 (poids)] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « I just get too much fatigue in the legs and I can't shed it » *trop de fatigue dans les jambes, je n'arrive pas à l'évacuer.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « It made my bike training a struggle / less enjoyable » *ça a rendu mon vélo pénible, moins agréable.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « I don't do legs in the gym. I know you're supposed to » *je ne fais pas de jambes en salle ; je sais qu'il faudrait.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « I am in forever DOMS cycle and i dont know what to do. » *courbatures permanentes, je ne sais pas quoi faire.* — cycliste + trail — [T9 / T10] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « I am not looking to add much size/weight » *je ne cherche pas à prendre du volume ni du poids.* — cycliste — [T9 (poids)] — <https://www.trainerroad.com/forum/t/failing-workouts-after-taking-up-weight-training/55117>
- « I have failed two workouts in the last ten days » *j'ai raté deux séances en dix jours [depuis la muscu].* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/failing-workouts-after-taking-up-weight-training/55117>
- « It's so disappointing to fail » *c'est tellement décevant d'échouer [les séances vélo].* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/failing-workouts-after-taking-up-weight-training/55117>
- « So it seems to me I really just can't do both. » *j'ai l'impression de ne pas pouvoir faire les deux.* — cycliste (femme, ostéopénie) — [T9] — <https://www.trainerroad.com/forum/t/heavy-strength-training-cycling-isnt-working/97775>
- « Heavy lifting and endurance exercise are antagonistic. » *force lourde et endurance sont antagonistes.* — pratiquant — [T9] — <https://www.trainerroad.com/forum/t/heavy-strength-training-cycling-isnt-working/97775>
- « inevitably I do lose a few watts of my FTP » *je perds forcément quelques watts de FTP.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/heavy-strength-training-cycling-isnt-working/97775>
- « I want to get stronger but also need to keep my weight down » *je veux être plus fort mais garder mon poids bas.* — triathlète Ironman — [T9 (poids)] — <https://forum.slowtwitch.com/t/how-to-do-strength-training-without-adding-bulk/820283>
- « Thought I'd trim down the bulk but instead…gained 10lbs! » *je pensais m'affiner, j'ai pris 4,5 kg !* — triathlète 70.3 — [T9 (poids)] — <https://forum.slowtwitch.com/t/how-to-do-strength-training-without-adding-bulk/820283>
- « My goal is to strength train without bulking up » *mon but : me renforcer sans grossir.* — triathlète Ironman — [T9 (poids)] — <https://forum.slowtwitch.com/t/how-to-do-strength-training-without-adding-bulk/820283>
- « I find 30 mins of strength training significantly more fatiguing than aerobic work. » *30 min de muscu me fatiguent bien plus que l'aérobie.* — triathlète — [T9] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « on peut avoir tendance à prendre de la masse » — cycliste — [T9 (poids)] — <https://www.vo2cycling.fr/forum/entrainement/43167-pour-ou-contre-la-musculation-hivernale>
- « pour éviter à la fin de l'hiver d'avoir pris 3 à 4kg » — cycliste — [T9 (poids)] — <https://www.vo2cycling.fr/forum/entrainement/43167-pour-ou-contre-la-musculation-hivernale>
- « courbatures pendant 4, 5 même 6 jour à la reprise » — cycliste — [T9 (fatigue)] — <https://www.vo2cycling.fr/forum/entrainement/43167-pour-ou-contre-la-musculation-hivernale>
- « tu roules moins vite qu'avant » — vététiste — [T9] — <https://www.26in.fr/forums/autres/autres-sports/sujet-50962-qui-fais-de-la-musculation-en-plus-du-.html>
- « c'est impossible de rouler » [après la séance complémentaire] — vététiste — [T9] — <https://www.26in.fr/forums/autres/autres-sports/sujet-50962-qui-fais-de-la-musculation-en-plus-du-.html>
- « what I've found when doing just 1 session a week is the DOMs are horrible » *avec une seule séance/sem, les courbatures sont horribles.* — cycliste master — [T9] — <https://www.trainerroad.com/forum/t/fitting-in-gym-sessions/102590>
- « if I go back and start heavy I smoke my legs for a week » *si je reprends lourd, je grille mes jambes une semaine.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/fitting-in-gym-sessions/102590>
- « The leg work fatigues me too much and impacts bike workouts. » *le travail de jambes me fatigue trop et pénalise le vélo.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/fitting-in-gym-sessions/102590>
- « Strength training seems to have killed my cycling fitness » (titre) *la muscu semble avoir tué ma forme à vélo.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/strength-training-seems-to-have-killed-my-cycling-fitness/50875>
- « the fear that strength training will have a negative impact on my workouts » *la peur que la muscu nuise à mes séances.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/strength-training-seems-to-have-killed-my-cycling-fitness/50875>
- « dont want to have my cycling workouts suffer from some heavy legs or muscle pain » *je ne veux pas que mes séances vélo pâtissent de jambes lourdes.* — cycliste — [T9] — <https://www.trainerroad.com/forum/t/fit-in-strength-training/110409>
- « my riding was suffering bad » *mon vélo en souffrait beaucoup.* — cycliste ~50 ans — [T9] — <https://www.trainerroad.com/forum/t/starting-strength-triathlon-is-it-possible/77007>
- « take a huge toll on your body » *[les gros soulevés] coûtent énormément à l'organisme.* — triathlète — [T9] — <https://www.trainerroad.com/forum/t/starting-strength-triathlon-is-it-possible/77007>

### T10 — Je ne sais pas quoi faire / programmes génériques (19 citations en thème principal)

- « how to most efficiently improve in the context of weights and endurance » *comment progresser au mieux en combinant muscu et endurance.* — triathlète — [T10] — <https://forum.intervals.icu/t/weightlifting-and-fitness-fatigue/105454>
- « not a strength focused coach, but would find this very useful for my athletes » *pas coach de force, mais ce serait très utile pour mes athlètes.* — coach endurance — [T10 / T1] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « it doesn't look like it is coaching you » *[Hevy] n'a pas l'air de te coacher.* — cycliste — [T10] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « I always have to self-coach to sort out what's achievable for me. » *je dois toujours m'auto-coacher pour savoir ce qui est faisable.* — cycliste master — [T10] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « Could anyone recommend a strength program I can do alongside 10 to 20 hours » *quelqu'un a un programme de force compatible avec 10-20 h de vélo ?* — cycliste — [T10] — <https://www.trainerroad.com/forum/t/manageable-strength-training-routines/113784>
- « still haven't found the best weekly balance » *je n'ai toujours pas trouvé le bon équilibre hebdo.* — cycliste — [T10] — <https://www.trainerroad.com/forum/t/struggling-managing-gym-riding-help/106095>
- « Until TR offers a cycling specific strength training app » *en attendant que TR sorte une appli muscu spéciale vélo.* — cycliste CX / sprint — [T10] — <https://www.trainerroad.com/forum/t/strength-app-including-progressions/79901>
- « massive amounts of contradictory information that is out there » *la masse d'infos contradictoires qui circulent.* — triathlète Ironman — [T10] — <https://forum.slowtwitch.com/t/how-to-do-strength-training-without-adding-bulk/820283>
- « I never felt like I was getting anything of real value » *je n'avais jamais l'impression d'en tirer quelque chose.* — triathlète 60+ — [T10] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>
- « Why don't triathletes actually hire an s&c coach » *pourquoi les triathlètes ne prennent-ils pas un préparateur physique ?* — préparateur physique (présumé) — [T10] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « still don't have a perfect solution » *toujours pas de solution parfaite [pour placer la muscu].* — triathlète — [T10] — <https://forum.slowtwitch.com/t/about-the-intensity-and-frequency-of-strength-training-for-triathlete/829138>
- « I find there is no ideal training structure » *il n'existe pas de structure idéale [vélo + course + muscu].* — cycliste-coureur — [T10] — <https://www.trainerroad.com/forum/t/fitting-in-gym-sessions/102590>
- « If I could add 20% to my FTP, I'd be really encouraged to lift. » *si ça ajoutait 20 % de FTP, je serais motivé pour soulever.* — cycliste — [T10 (bénéfice incertain)] — <https://www.trainerroad.com/forum/t/incorporating-strength-into-your-training-plan-did-it-actually-work-for-you/66392>
- « don't use generic strength plans like 5x5 » *n'utilise pas de plans génériques type 5x5.* — cycliste — [T10] — <https://www.trainerroad.com/forum/t/strength-training-seems-to-have-killed-my-cycling-fitness/50875>
- « I've never really found strength training to improve my cycling directly. » *la muscu n'a jamais amélioré mon vélo directement.* — cycliste — [T10 (doute sur le bénéfice)] — <https://www.trainerroad.com/forum/t/strength-training-seems-to-have-killed-my-cycling-fitness/50875>
- « This is def a confusing area of our hobby still. » *c'est encore un domaine confus de notre sport.* — triathlète — [T10] — <https://www.trainerroad.com/forum/t/starting-strength-triathlon-is-it-possible/77007>
- « the strength training 'plans' are poorly made and likely computer generated » *les « plans » de muscu sont mal faits, sans doute générés par ordinateur.* — coureur (avis Runna) — [T10] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « I was doing weighted forward lunges for every part of my body » *je faisais des fentes lestées pour toutes les parties du corps.* — coureur (Runna) — [T10] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « It seems a bit all over the place » *[la muscu] part un peu dans tous les sens.* — coureur (Runna) — [T10] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>

### T11 — Pas de salle / voyage (3 citations en thème principal)

- « get a home strength routine going and I never stick to it » *[j'ai essayé] une routine muscu à la maison, je ne tiens jamais.* — triathlète — [T11 / T8] — <https://forum.slowtwitch.com/t/strength-training-in-gym-vs-at-home/818797>
- « I wouldn't be consistent with it if I had to go to a gym. » *je savais que je ne serais pas régulier s'il fallait aller en salle.* — cycliste — [T11] — <https://www.trainerroad.com/forum/t/incorporating-strength-into-your-training-plan-did-it-actually-work-for-you/66392>
- « I too have decided to suspend my membership » *moi aussi j'ai suspendu mon abonnement de salle [COVID, 2020].* — cycliste — [T11] — <https://www.trainerroad.com/forum/t/unable-to-lift-in-gym/31357>

### T12 — Contre-preuves : satisfaits de leur solution actuelle (19 citations en thème principal)

- « it really doesn't make a dent in the total anyway. » *de toute façon ça ne pèse rien dans le total.* — cycliste (n'entre que le vélo) — [T12] — <https://forum.intervals.icu/t/solved-strength-workout-loads-no-longer-counted/685>
- « It's dead simple » *c'est ultra simple [Strong].* — cycliste qui fait beaucoup de salle — [T12] — <https://forum.intervals.icu/t/gym-workout-log/90810>
- « I don't use any apps. I just use my Garmin » *je n'utilise aucune appli, juste ma Garmin.* — pratiquant — [T12] — <https://forum.intervals.icu/t/gym-workout-log/90810>
- « Which is many still use Google Sheets. » *c'est pourquoi beaucoup utilisent encore Google Sheets.* — coach (présumé) — [T12] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « I've been using Hevy and it is great. » *j'utilise Hevy, c'est super.* — athlète — [T12] — <https://forum.intervals.icu/t/advanced-strength-workout-builder/115495>
- « Currently I'm creating training plan in a spreadsheet. » *je fais mon plan dans un tableur.* — pratiquant — [T12] — <https://forum.intervals.icu/t/weightlifting-rly-needs-support-3/97927>
- « I've used Strong for years. Its free and simple. » *j'utilise Strong depuis des années, gratuit et simple.* — cycliste — [T12] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « I'm actually still on paper and pencil! » *moi j'en suis toujours au papier-crayon !* — cycliste — [T12] — <https://www.trainerroad.com/forum/t/app-for-strength-training/101664>
- « I personally do not count TSS for non-bike related training » *je ne compte pas de TSS hors vélo.* — cycliste — [T12] — <https://www.trainerroad.com/forum/t/adding-weights-to-weekly-tss-strength-training/11808>
- « it's never delivered anything actionable or worthwhile, so I've stopped worrying about it. » *[le TSS muscu] ne m'a jamais rien apporté d'exploitable, j'ai arrêté.* — triathlète — [T12] — <https://www.trainerroad.com/forum/t/adding-weights-to-weekly-tss-strength-training/11808>
- « Simple, clean no bs app. Highly recommended. » *[Strong] simple, propre, sans chichis. Recommandé.* — cycliste — [T12] — <https://www.trainerroad.com/forum/t/strength-app-including-progressions/79901>
- « Seeing great results on and off the bike » *[Dialed Health] super résultats, sur le vélo et en dehors.* — cycliste — [T12] — <https://www.trainerroad.com/forum/t/strength-app-including-progressions/79901>
- « I know it's expensive and all that but Tonal was a […] game changer » *je sais que c'est cher, mais Tonal a tout changé.* — triathlète — [T12 / T7] — <https://forum.slowtwitch.com/t/strength-training-in-gym-vs-at-home/818797>
- « They have video demonstrations for each exercise in the app. » *[TrainHeroic] a des vidéos de démo pour chaque exercice.* — triathlète coaché — [T12 / T13] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>
- « En VTT c'est très intéressant » — vététiste — [T12] — <https://www.vo2cycling.fr/forum/entrainement/43167-pour-ou-contre-la-musculation-hivernale>
- « Resultats bien visibles après 3 mois » — vététiste — [T12] — <https://www.26in.fr/forums/autres/autres-sports/sujet-50962-qui-fais-de-la-musculation-en-plus-du-.html>
- « J'ai grave senti la diff sur le bike » — vététiste — [T12] — <https://www.26in.fr/forums/autres/autres-sports/sujet-50962-qui-fais-de-la-musculation-en-plus-du-.html>
- « you can't beat the price » *imbattable niveau prix.* — coureur (Runna) — [T12 / T7 (avis contraire)] — <https://justuseapp.com/en/app/1594204443/runna-running-training-plans/reviews>
- « Copying & pasting has saved me soooo much time » *le copier-coller m'a fait gagner un temps fou.* — préparateur physique, TrueCoach (hors endurance) — [T12] — <https://capterra.com/p/155784/truecoach/reviews/>

### T13 — Besoin de vidéos / démonstrations (3 citations en thème principal)

- « is there an easy way to include videos showing the exercises to do? » *y a-t-il un moyen simple d'inclure des vidéos des exercices ?* — utilisateur (coach présumé) — [T13 / T3] — <https://forum.intervals.icu/t/video-exercise-for-strength-training-sessions/131079>
- « what I do with my athletes is provide a video link in the workout description » *je mets un lien vidéo dans la description de la séance.* — coach — [T13 (bricolage)] — <https://forum.intervals.icu/t/video-exercise-for-strength-training-sessions/131079>
- « All of the exercises are linked to YouTube videos for form instruction » *chaque exercice renvoie à une vidéo YouTube pour la technique.* — athlète coaché en ligne (programme orienté VTT) — [T13 / T12] — <https://forum.slowtwitch.com/t/strength-training-coaching-types/1281977>
