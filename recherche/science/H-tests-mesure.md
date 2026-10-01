# H — Tests, mesure et technologie

## En 1 minute

- **Un test ne vaut que par son erreur de mesure.** Pour suivre UN athlète, il faut le SEM et le plus petit changement réel (MDC), pas l'ICC. Sous le MDC, on écrit « stable » [@hopkins2000] [@weir2005].
- **Le téléphone mesure bien un angle**, mais la preuve est solide surtout pour la fiabilité relative, moins pour l'erreur absolue ; la **hanche** est le point faible, l'épaule et la cheville sont les mieux validées [@keogh2019] [@hahn2021] [@kolber2011] [@powden2015].
- **Le RIR se trompe d'environ 1 rep en moyenne**, davantage loin de l'échec et en série longue (jusqu'à 4-5 reps à RIR 5) ; le niveau d'entraînement n'y change rien [@halperin2022] [@zourdos2021].
- **Le 1RM estimé par la vitesse n'est pas plus précis** que par les reps : erreur ≈ 10 %, surestimation ≈ 4 % [@greig2023] [@lemense2024].
- **L'IA vidéo sait compter des reps** (si la caméra est bien placée) et mesure des angles sagittaux à ≈ 4-5° près ; elle n'est **pas** validée pour juger un valgus de genou sous charge [@oliosi2026] [@ogura2026] [@yoma2025].
- **Montres :** FC correcte au repos et en course, **fausse en musculation (-7 bpm) et à vélo (-4,5 bpm)** ; VO2max estimée à ±10 ml/kg/min près ; sommeil et calories approximatifs [@zhang2020] [@molinagarcia2022] [@doherty2024] [@lee2025].
- **Aucun test de dépistage (FMS, Y-balance) ne prédit la blessure** avec des seuils généraux [@moran2017b] [@plisky2021].
- **Dans `tests.json` :** 8 `mdc` sur 13 collent à ce que j'ai lu ; la **rotation interne de hanche (6°) est trop optimiste** (littérature : 11-16°) ; 4 ne sont pas vérifiables dans les résumés lus (assis-debout, équilibre, pont, squat bras levés), et la plupart des repères chiffrés (10 cm, 30°, 70°, 165°…) non plus.

## Tableau d'affirmations

| Affirmation | Preuve | Chiffres | Sources | Application pour l'appli / le coach |
|---|---|---|---|---|
| L'ICC ne suffit pas pour suivre un individu ; il faut l'erreur typique et le MDC | B | MDC95 ≈ 2,77 × SEM ; ~50 sujets et 3 essais pour estimer la fiabilité | [@hopkins2000] [@weir2005] | Garder le champ `mdc` et afficher « stable » en dessous |
| Repères de lecture d'un ICC | B | < 0,5 faible ; 0,5-0,75 modéré ; 0,75-0,9 bon ; > 0,9 excellent | [@koo2016] | Écrire la fiabilité en mots simples dans chaque fiche |
| Le CMJ est le saut vertical le plus fiable | B | CV 2,4-4,6 % ; alpha 0,97-0,98 | [@markovic2004] | Si un saut vertical est ajouté : CMJ, mains aux hanches |
| Une appli vidéo (My Jump) mesure la hauteur de saut aussi bien que le matériel de référence | A | 21 études ; pas de différence de moyenne ; fiabilité quasi parfaite | [@gencoglu2023] [@montalvo2021] | Mesure de CMJ au ralenti du téléphone = crédible |
| Les méthodes de calcul de hauteur ne sont pas interchangeables | A | Temps de vol < double intégration ; 21 articles | [@xu2023] | Ne jamais comparer une valeur d'appli à une valeur de plateforme |
| Le RSI (drop jump) classe bien mais a une grosse erreur absolue | B | ICC ≥ 0,92 mais CV ≥ 12,5 % sur 4 appareils | [@montalvo2021] | Ne pas ajouter le RSI sans MDC large (≈ 15 % et plus) |
| Les hop tests sont fiables mais leur erreur est d'environ 10 % | B | ICC 0,76-0,98 ; SEM 3,4-11,1 % ; plus petite différence réelle 9-31 % | [@kockum2015] [@munro2011] [@reid2007] | MDC du saut unipodal : au moins 8-10 % de la distance |
| Il y a un effet d'apprentissage aux hop tests | B | Progression sur 3 séances hebdomadaires | [@munro2011] | Première passation = familiarisation, pas une référence |
| Chez les sains, la symétrie de saut est ≥ 90 % | B | Tous les sujets ≥ 90 % sur 4 hop tests | [@munro2011] | Seuil `asymPct` 90 justifié |
| L'indice de symétrie a lui-même une erreur | B | MDC90 de l'indice : 7-13 points | [@reid2007] | Ne signaler une asymétrie que si elle se répète sur 2 passations |
| Le Y-balance est fiable mais ne prédit pas la blessure avec un seuil général | A | Fiabilité 0,85-0,91 ; 57 études | [@plisky2021] | Ne pas l'ajouter comme « test de risque » |
| Genou au mur : très fiable | A | ICC 0,65-0,99 ; MDC 1,6-1,9 cm (4,6-4,7°) | [@powden2015] | `mdc` 2 cm confirmé |
| L'asymétrie de cheville est moins fiable qu'un côté seul | C | ICC 0,85 vs 0,98 ; MDC 2,1° vs 1,7° | [@howe2020] | Seuil d'asymétrie ≥ MDC, jamais plus fin |
| L'iPhone mesure l'angle de cheville comme un inclinomètre pro | C | r = 0,989 ; erreur 0,48° | [@balsalobrefernandez2019] | Une version « angle » du genou au mur est possible |
| Le Thomas est reproductible à l'inclinomètre si le bassin est tenu | C | ICC 0,85-0,92 | [@clapis2008] [@eimiller2024] | Consigne « genou serré, dos plaqué » obligatoire |
| Sans contrôle du bassin, le Thomas n'est pas valide | C | Sensibilité 32 %, spécificité 57 % ; r = 0,98 si bassin contrôlé | [@vigotsky2016] | Critère d'arrêt « bas du dos décollé » = essai annulé |
| Le repérage au goniomètre ruine le Thomas ; une mesure de segment est fiable | C | ICC 0,30-0,65 vs 0,90-0,95 | [@wakefield2015] | Téléphone sur la cuisse = bon choix |
| Les applis inclinomètre peuvent remplacer le goniomètre | A | 25 études ; preuve plus faible pour MDC que pour ICC | [@keogh2019] [@milani2014] | Mode « angle » légitime ; afficher l'erreur |
| Aucune appli n'est recommandable sans réserve pour la hanche | A | 25 études membre inférieur | [@hahn2021] | Prudence sur Thomas et rotation de hanche |
| Rotation de hanche au téléphone : erreur large en conditions réelles | C | MDC 10,9-16,4° ; ICC intra 0,54-0,75 | [@spork2021] | Monter le `mdc` de 6° à ≈ 10° |
| Rotation interne : valide contre la 3D ; rotation externe assis moins bonne | C | ICC 0,81-0,94 (RI) ; 0,70-0,73 (RE assis) | [@ganokroj2021] | Garder la RI, ne pas mesurer la RE assis (déjà le cas) |
| Jambe tendue à l'iPhone : précise avec un même examinateur | C | MDC95 3,3° (intra) ; 10,2° (inter) | [@amano2024] | `mdc` 6° raisonnable pour une auto-mesure |
| Épaule à l'inclinomètre : MDC ≈ 8-9° | C | MDC90 8° flexion, 9° rotation externe ; erreur vs 3D 5,8° en flexion | [@kolber2011] [@boissy2017] [@werner2014] | `mdc` 8° confirmé (9° serait plus juste en rotation) |
| La fiabilité d'amplitude au smartphone varie beaucoup selon l'appli et l'articulation | A | ICC 0,33-0,98 (12 études, jeunes sains) | [@canever2025] | Toujours familiariser ; même protocole, même montage |
| Force isométrique en tirage mi-cuisse : très fiable | A | ICC médian 0,96 ; CV médian 4,9 % | [@grgic2022b] | Si capteur de force un jour : c'est le test à viser |
| Dynamomètre à main au membre inférieur : erreur très large | A | Limites d'accord ±34 % (genou), ±49 % (mollet) | [@chamorro2017] | Ne pas baser un suivi dessus |
| Montées sur pointe : très fiable, MDC ≈ 6 reps | B | ICC 1,0 ; limites d'accord ±6 reps ; médiane 24 (H) / 21 (F) | [@hebertlosier2017b] | `mdc` 6 confirmé ; repère 25 = exigeant mais plausible |
| Assis-debout unipodal : fiable, y compris chez des skieurs de fond élite | C | ICC 0,81-0,94 ; CV 6-10 % | [@waldhelm2020] [@birinci2026] | Garder ; préférer un format publié (30 s) |
| Pont unipodal : lien fragile avec la blessure des ischios | C | 482 joueurs, 28 blessures | [@freckleton2014] | Outil de suivi, pas de prédiction |
| Une appli iPhone mesure la vitesse de barre presque comme un capteur à câble | C | r 0,90-0,94 ; biais 0,01-0,03 m/s | [@balsalobrefernandez2018] [@balsalobrefernandez2023] | VBT par vidéo faisable, sur trajectoire verticale |
| Les applis de vitesse ont un biais aux charges lourdes | A | 23 études, 11 applis | [@silva2021] | Ne pas s'en servir pour un 1RM lourd |
| La qualité des études de validation VBT est faible | A | 5/66 études de validité passent tous les critères | [@wannouch2025] [@claassen2026] | Rester humble sur toute fonction « vitesse » |
| Le 1RM estimé par la vitesse surestime | A | SEE 9,8 % ; +3,7 % du 1RM ; ES 0,53 au squat | [@greig2023] [@lemense2024] | Garder la formule reps-charge, pas le profil vitesse |
| Le 1RM s'estime mieux sur peu de reps | B | 5RM : R² 0,97-0,99 ; pas plus de 10 reps | [@reynolds2006] [@mayhew2008] | Test RM sur 3-6 reps, refuser > 10 |
| Le nombre de reps à un %1RM varie selon l'individu et l'exercice | A | 269 études, 7 289 sujets ; presse > développé couché | [@nuzzo2024] | Une formule unique a une erreur individuelle incompressible |
| Le RIR est faux d'environ 1 rep en moyenne | A | Sous-estimation 0,95 rep (IC 0,17-1,73) ; I² 98 % | [@halperin2022] [@refalo2024] | Annoncer « ±1 rep » ; RIR prudent = marge de sécurité |
| Le RIR est bien pire loin de l'échec et en série longue | B | Erreur 2,1 / 3,7 / 5,2 reps à RIR 1 / 3 / 5 (série de ~16) | [@zourdos2021] [@halperin2022] | Test RM : exiger RIR ≤ 2-3 et ≤ 8 reps |
| L'expérience n'améliore pas la précision du RIR ; les séries tardives oui | A | β ≈ 0 pour le niveau ; 1re série sous-estimée | [@halperin2022] [@mansfield2020] | Ne pas ajuster la charge sur la 1re série seule |
| La vitesse baisse quand le RPE monte | B | r = -0,77 à -0,88 | [@zourdos2016] | Le RPE reste un bon substitut gratuit à la vitesse |
| Prédire les reps restantes par la vitesse échoue en fatigue | A | 6 études ; précision compromise avec repos courts | [@mirasmoreno2025] | Pas de « RIR automatique » par la vitesse |
| L'IA de pose a ≈ 4-5° d'erreur en sagittal, plus en frontal à la cheville | A | RMSE 4,4° genou, 5,3° hanche, 7,5° cheville frontale | [@ogura2026] | Profondeur de squat : oui ; angles fins : non |
| Le sans-marqueur est répétable mais pas interchangeable avec le labo | A | SEM < 5° souvent ; écarts 0,2 à 28,6° | [@yoma2025] [@chougule2026] | Comparer l'athlète à lui-même, même cadrage |
| Le comptage de reps par IA dépend du placement de caméra | C | 95,5 % en diagonale à 2 m ; 0 % de profil à 90 cm | [@oliosi2026] | Guide de cadrage obligatoire avant de compter |
| Le valgus mesuré en 2D est incertain | C | Angle de projection frontale vs 3D : ICC 0-0,57 ; OpenPose en labo : 2,4° | [@ortiz2016] [@ino2024] [@erdman2024] | Pas de verdict automatique « genou qui rentre » |
| Le FMS est reproductible mais ne prédit pas la blessure | A | ICC 0,84 ; RR 1,47 au mieux | [@cuchna2016] [@moran2017b] | Squat bras levés = choisir des exercices, rien d'autre |
| FC au poignet : bonne au repos et en course, mauvaise en muscu et à vélo | A | -7,3 bpm en musculation ; -4,6 bpm à vélo ; ≈ 0 au repos | [@zhang2020] [@doherty2024] | Ne pas calculer une charge de muscu depuis la FC poignet |
| Aucune montre n'est juste pour les calories | A | 158 publications ; erreur -21 à +15 % | [@fuller2020] [@doherty2024] | Ne pas afficher de calories de séance |
| La VO2max de montre est bonne en moyenne, pas pour un individu | A | Limites d'accord ±10 ml/kg/min (effort), -13 à +17 (repos) | [@molinagarcia2022] | Lire la tendance, jamais la valeur |
| La VFC des appareils portables est proche de l'ECG | A | ES 0,23 ; 23 études | [@dobbs2019] | VFC du matin exploitable en tendance |
| Le sommeil mesuré au poignet est approximatif | A | ≈ 17 min d'écart sur le sommeil total ; 13 min sur les éveils | [@lee2025] [@doherty2024] | Durée oui, phases non |
| Une montre compte bien les reps au squat, mal au développé couché | C | Exercice reconnu 88 % ; 1RM réussi 9 % | [@oberhofer2021] | Ne pas dépendre du comptage auto d'une montre |

## Chiffres clés

- **MDC95 ≈ 2,77 × SEM** : c'est la règle pour passer de l'erreur typique au plus petit changement réel [@weir2005] [@hopkins2000].
- **CMJ** : CV intra-sujet 2,4-4,6 % [@markovic2004]. **RSI** : CV ≥ 12,5 % quel que soit l'appareil [@montalvo2021].
- **Hop tests** : SEM 3,4-11,1 %, plus petite différence réelle 9,3-30,7 % [@kockum2015] ; indice de symétrie MDC90 7-13 points [@reid2007] ; sains ≥ 90 % de symétrie [@munro2011].
- **Genou au mur** : MDC 1,6 cm (entre évaluateurs) à 1,9 cm (même évaluateur), soit ≈ 4,6-4,7° [@powden2015].
- **Thomas** : ICC 0,85-0,92 bassin contrôlé [@clapis2008] [@eimiller2024] ; sensibilité 32 % sans contrôle [@vigotsky2016] ; extension moyenne de jeunes sains 5,4 ± 9,7° [@eimiller2024].
- **Rotation de hanche au téléphone** : MDC 10,9-16,4° en conditions réelles [@spork2021].
- **Jambe tendue à l'iPhone** : MDC95 3,3° (même examinateur), 10,2° (deux examinateurs) [@amano2024].
- **Épaule** : MDC90 8° en flexion, 9° en rotation externe [@kolber2011] ; écart au 3D 5,8° (flexion), 1,7° (rotation externe) [@boissy2017].
- **Montées sur pointe** : limites d'accord ±6 reps entre deux jours ; médiane 24 reps (hommes), 21 (femmes) [@hebertlosier2017b].
- **Tirage isométrique mi-cuisse** : CV médian 4,9 %, ICC médian 0,96 [@grgic2022b].
- **Vitesse de barre au téléphone** : r 0,90-0,94 avec un capteur à câble, biais 0,01-0,03 m/s [@balsalobrefernandez2018] [@balsalobrefernandez2023].
- **1RM par la vitesse** : erreur 9,8 % (IC 7,4-12,2), surestimation 3,7 % [@greig2023].
- **1RM par les reps** : le 5RM donne R² 0,97-0,99 ; au-delà de 10 reps la précision chute [@reynolds2006].
- **RIR** : erreur moyenne 0,95 rep [@halperin2022] ; 0,65 rep au développé couché à 75 % [@refalo2024] ; 2,1 / 3,7 / 5,2 reps à RIR 1 / 3 / 5 sur une série de 16 reps [@zourdos2021].
- **Estimation de pose** : erreur 4,4° (genou), 5,3° (hanche), 4,9° (cheville) en sagittal ; 7,5° cheville frontale ; hauteur de saut -2,9 cm [@ogura2026].
- **Comptage de reps par IA** : de 0 % à 95,5 % de détection selon l'angle et la distance de la caméra [@oliosi2026].
- **FC au poignet** : -7,3 bpm en musculation, -4,6 bpm à vélo, ≈ 0 au repos [@zhang2020].
- **VO2max de montre** : limites d'accord ≈ ±10 ml/kg/min avec un algorithme d'effort [@molinagarcia2022].
- **Sommeil au poignet** : ≈ 17 min d'écart sur la durée totale [@lee2025]. **Calories** : erreur de -21 à +15 % [@doherty2024].
- **Seuls ≈ 11 % des appareils grand public** ont été validés pour au moins une mesure [@doherty2024].

## Mythes et verdicts

1. **« Un ICC de 0,95, donc le test est précis. »** → Faux raccourci. L'ICC dépend de la diversité du groupe ; le RSI a un ICC ≥ 0,92 et pourtant un CV ≥ 12,5 %. Preuve B [@hopkins2000] [@montalvo2021].
2. **« Le FMS (ou le Y-balance) détecte qui va se blesser. »** → Non. Lien faible ou nul avec des seuils généraux. Preuve A [@moran2017b] [@plisky2021].
3. **« La vitesse de barre donne un 1RM plus juste que les reps. »** → Non. Erreur ≈ 10 % et surestimation ≈ 4 % ; au squat libre la méthode est jugée non viable. Preuve A [@greig2023] [@lemense2024].
4. **« Les athlètes expérimentés jugent mieux leur RIR. »** → Pas démontré : le niveau ne change pas la précision ; c'est la proximité de l'échec et le nombre de reps qui comptent. Preuve A [@halperin2022] [@refalo2024].
5. **« RIR 5, c'est précis. »** → Non. À RIR 5 annoncé, l'erreur moyenne atteint 5 reps sur une série longue. Preuve B [@zourdos2021].
6. **« Le téléphone vaut un goniomètre partout. »** → Oui pour cheville, genou, épaule ; non garanti pour la hanche, et la preuve sur l'erreur absolue est mince. Preuve A [@keogh2019] [@hahn2021].
7. **« Le test de Thomas mesure la raideur du psoas. »** → Seulement si le bassin est tenu ; sinon sensibilité 32 %. Preuve C [@vigotsky2016].
8. **« L'IA voit mieux que l'œil le genou qui rentre. »** → En labo, de face, sans charge, elle fait jeu égal avec un kiné (2,4° vs 3,2°). Hors de ces conditions, rien n'est validé, et l'angle 2D peut ne pas refléter le 3D. Preuve C [@ino2024] [@ortiz2016].
9. **« La FC de ma montre pendant la muscu est fiable. »** → Non : -7 bpm en moyenne, et l'erreur grandit avec la FC. Preuve A [@zhang2020].
10. **« Ma montre connaît ma VO2max. »** → En moyenne oui, pour toi non : ±10 ml/kg/min. Preuve A [@molinagarcia2022].
11. **« Les calories brûlées affichées sont justes. »** → Aucune marque n'est juste. Preuve A [@fuller2020] [@doherty2024].
12. **« Une asymétrie de 12 % au saut = problème. »** → Pas forcément : l'indice de symétrie bouge de 7 à 13 points par simple erreur de mesure. Preuve B [@reid2007].
13. **« Le premier test sert de référence. »** → Non pour les sauts : effet d'apprentissage sur plusieurs séances. Preuve B [@munro2011] [@weir2005].

## Règles pour l'entraîneur

**Mesurer proprement**
1. Sous le `mdc`, écris « stable ». Ne félicite pas et n'alerte pas sur un changement plus petit que l'erreur. (B) [@weir2005] [@hopkins2000]
2. Même heure, même échauffement, même matériel, même montage du téléphone à chaque passation. (B) [@hopkins2000] [@canever2025]
3. La première passation d'un saut ou d'un test nouveau sert à apprendre. La référence, c'est la deuxième. (B) [@munro2011]
4. Garde le meilleur de 3 essais pour les sauts et l'équilibre ; au moins 2 essais pour les angles. (B) [@springer2007] [@hopkins2000]
5. Ne compare jamais deux méthodes entre elles (appli vs tapis vs plateforme, goniomètre vs téléphone). (A) [@xu2023] [@yoma2025]
6. Une asymétrie ne compte que si elle dépasse le `mdc` ET se répète sur deux passations. (B) [@reid2007] [@howe2020]
7. Seuil de symétrie au saut : 90 %. En dessous, deux fois de suite : priorité à la jambe faible. (B) [@munro2011]
8. Ne dis jamais à un athlète qu'un test « prédit » une blessure. Dis : « ça montre quoi travailler ». (A) [@moran2017b] [@plisky2021]

**Mobilité au téléphone**
9. Genou au mur : un gain de moins de 2 cm n'est pas un gain. (A) [@powden2015]
10. Thomas : si le bas du dos décolle, l'essai est nul. Sans bassin tenu, le test ne vaut rien. (C) [@vigotsky2016] [@eimiller2024]
11. Rotation de hanche : n'interprète qu'un changement d'au moins 10°. (C) [@spork2021] [@hahn2021]
12. Épaule : n'interprète qu'un changement d'au moins 8-9°. (C) [@kolber2011]
13. Jambe tendue : en auto-mesure, garde 6° de marge ; si tu mesures toi-même l'athlète, 3-4° suffisent. (C) [@amano2024]
14. Fais faire 1-2 essais de familiarisation avant toute mesure d'angle. (A) [@canever2025]

**Force et charge**
15. Test RM : 3 à 6 reps, jamais plus de 10. (B) [@reynolds2006] [@mayhew2008]
16. Test RM : demande un arrêt à 1-2 reps en réserve, pas à 4-5. Plus on est loin de l'échec, plus l'estimation est fausse. (B) [@zourdos2021] [@halperin2022]
17. Compte ±1 rep d'incertitude sur tout RIR annoncé, soit ≈ ±3 % sur le max estimé avec Epley (calcul). (A) [@halperin2022] [@refalo2024]
18. Ne modifie pas un max pour un écart de moins de 5 % ; attends deux tests concordants. (B) [@reynolds2006] [@nuzzo2024]
19. Fais un max par exercice : le lien reps-charge change d'un exercice à l'autre. (A) [@nuzzo2024]
20. Ne règle pas la charge sur le RIR de la 1re série seule : elle est souvent sous-estimée. Regarde les séries 2 et 3. (B) [@mansfield2020] [@halperin2022]
21. Un athlète « expérimenté » n'est pas plus précis en RIR : garde la même prudence pour tous. (A) [@halperin2022]
22. Séries longues (> 12 reps) : le RIR devient peu fiable ; préfère un nombre de reps fixé et un RPE global. (A) [@halperin2022] [@zourdos2021]
23. Si tu utilises une appli de vitesse : même exercice, trajectoire verticale, charges moyennes ; ne t'en sers pas pour estimer un 1RM. (A) [@silva2021] [@greig2023] [@lemense2024]
24. Le RPE reste un bon indicateur gratuit de la vitesse perdue (r ≈ -0,8). (B) [@zourdos2016]

**Tests d'endurance locale et sauts**
25. Montées sur pointe : un changement de moins de 6 reps est du bruit. (B) [@hebertlosier2017b]
26. Assis-debout unipodal et pont unipodal : compare l'athlète à lui-même et gauche/droite ; pas de norme solide. (C) [@waldhelm2020] [@birinci2026] [@freckleton2014]
27. Si tu veux un test de puissance simple : CMJ filmé au ralenti, meilleur de 3, toujours avec la même appli. (A) [@gencoglu2023] [@markovic2004]
28. Évite le RSI pour le suivi individuel sans matériel dédié : erreur ≥ 12 %. (B) [@montalvo2021]

**Vidéo et IA**
29. Vidéo de squat : téléphone fixe, à ≈ 2 m, corps entier dans le cadre ; pour compter, la vue de trois quarts marche mieux que le profil collé. (C) [@oliosi2026]
30. Sers-toi de la vidéo pour la profondeur, les talons, le buste. Pas pour chiffrer un valgus. (A/C) [@ogura2026] [@ortiz2016]
31. Pour le genou, critère visuel simple : « le genou passe-t-il à l'intérieur du pied ? ». (C) [@erdman2024]

**Montres**
32. FC en musculation : ignore la valeur du poignet. Si tu veux la FC, ceinture thoracique. (A) [@zhang2020]
33. À vélo aussi, la FC du poignet est en retrait (-4,5 bpm) : ceinture pour les séances clés. (A) [@zhang2020]
34. VO2max de montre : regarde la tendance sur des mois, jamais la valeur ni la comparaison entre athlètes. (A) [@molinagarcia2022]
35. Sommeil : fie-toi à la durée approximative et à la régularité, pas aux phases. (A) [@lee2025] [@doherty2024]
36. VFC : une mesure du matin, même position, moyenne sur 7 jours ; l'outil portable suffit. (A pour l'outil ; D pour la moyenne sur 7 jours, usage de terrain) [@dobbs2019]
37. Ne base aucune décision sur les calories d'une montre. (A) [@fuller2020] [@doherty2024]

## Cohérence de `tests.json` avec la littérature

Lecture : **OK** = le `mdc` colle aux chiffres lus ; **Limite** = dans le bas de la fourchette ; **Optimiste** = trop petit ; **Non vérifié** = pas de chiffre dans les résumés ouverts. Aucune étude ne valide l'auto-mesure par un athlète seul pour ces protocoles exacts : tous les `mdc` sont donc des planchers.

| Test (`id`) | `mdc` / seuils de l'appli | Ce que dit la littérature lue | Verdict | Proposition |
|---|---|---|---|---|
| `saut-unipodal` | 12 cm ; 90 % | SEM 3,4-11 %, différence réelle 9-31 % ; symétrie MDC 7-13 points ; sains ≥ 90 % [@kockum2015] [@reid2007] [@munro2011] | **Limite** (12 cm ≈ 7-8 % d'un saut de 150-170 cm) ; seuil 90 % **OK** | Passer à 15 cm ou à 10 % du score. La fiche annonce « ICC 0,92-0,97 » : les résumés lus donnent 0,76-0,98, et Reid 0,82-0,93 sur l'indice de symétrie. Corriger le texte. |
| `assis-debout-unipodal` | 4 reps ; 90 % | Formats publiés : 30 s (ICC 0,92-0,94), 5 reps chronométrées, ou vitesse par appli (ICC 0,81-0,89, CV 6-10 %) [@waldhelm2020] [@birinci2026]. Le format « jusqu'à épuisement au métronome » n'apparaît pas | **Non vérifié** | Garder la mention honnête de la fiche. Mesurer le `mdc` en interne (2 passations à 1 semaine sur les 7 athlètes) ou basculer sur le format 30 s. |
| `rm` | 5 % | 5RM : R² 0,97-0,99 ; pas plus de 10 reps [@reynolds2006] ; RIR ±1 rep près de l'échec, 2-5 reps loin de l'échec [@halperin2022] [@zourdos2021] ; 1 rep ≈ 3,3 % avec Epley (calcul) | **OK sous conditions** (≤ 8 reps et RIR ≤ 2) ; optimiste sinon | Afficher ±5 % si RIR ≤ 2, ±8 à 10 % si RIR ≥ 3 ou reps > 8. Les sources « Moses (Wintec) », « LeSuer 1997 », « étude RIR au squat 2025 » et la phrase sur le soulevé de terre n'ont pas pu être vérifiées ici. |
| `genou-mur` | 2 cm ; asym 2 cm ; repère 10 cm | MDC 1,6-1,9 cm ; ICC 0,65-0,99 [@powden2015] ; asymétrie moins fiable qu'un côté [@howe2020] | **OK** | Rien à changer. Le repère 10 cm n'est pas dans les résumés lus : le garder comme repère d'usage, pas comme norme. |
| `thomas` | 5° ; asym 6° ; repère 0° | ICC 0,85-0,92 bassin tenu [@clapis2008] [@eimiller2024] ; extension de hanche à l'iPhone MDC95 3,9° (intra) et 9,6° (inter) [@amano2024] ; non valide si bassin libre [@vigotsky2016] | **Limite** | 6-7° serait plus prudent en auto-mesure. Moyenne de jeunes sains 5,4 ± 9,7° : environ un tiers est sous 0° sans problème ; présenter 0° comme repère, pas comme seuil d'alerte. |
| `rotation-interne-hanche` | 6° ; asym 8° ; repère 30° | Validité vs 3D ICC 0,81-0,94 (mesure passive par examinateur) [@ganokroj2021] ; en conditions réelles MDC 10,9-16,4° [@spork2021] ; « aucune appli recommandable sans réserve pour la hanche » (résumé de [@hahn2021]) | **Optimiste** | `mdc` 10°, `asym` 10-12°. Le texte de la fiche (ICC 0,81-0,94) est exact mais concerne la validité, pas l'erreur de re-test. Repère 30° non vérifié. |
| `jambe-tendue` | 6° ; asym 8° ; repère 70° | MDC95 3,3° (intra), 10,2° (inter), mesure passive [@amano2024] | **OK** (entre les deux bornes) | Rien à changer. La fiche dit bien que l'auto-mesure active n'est pas validée. Repère 70° non vérifié. |
| `flexion-epaule` | 8° ; asym 10° ; repère 165° | MDC90 8° [@kolber2011] ; écart au 3D 5,8° [@boissy2017] ; ICC 0,80 [@werner2014] | **OK** | Rien à changer. Téléphone sur l'avant-bras : le coude plié fausse la mesure, le critère d'arrêt existe déjà. Repère 165° non vérifié. |
| `rotation-externe-epaule` | 8° ; asym 10° ; repère 60° | MDC90 9° [@kolber2011] ; écart au 3D 1,7° [@boissy2017] | **OK** (à 1° près) | 9° serait exact. Repère 60° non vérifié. |
| `squat-bras-leves` | 1 critère sur 4 | Score FMS total ICC 0,84 [@cuchna2016] ; pas de valeur prédictive [@moran2017b]. Aucune donnée sur 4 critères oui/non cotés par l'athlète | **Non vérifié** | Garder : le texte de la fiche est juste (ne prédit pas la blessure). Faire valider la cotation par le coach sur la vidéo. |
| `unipodal-yeux-fermes` | 8 s ; « ≈ 13 s chez 18-39 ans » | Inter-évaluateur ICC 0,998, baisse avec l'âge [@springer2007]. Ni l'erreur de re-test ni les normes par âge ne sont dans le résumé | **Non vérifié** | Garder 8 s comme valeur maison et le dire. Vérifier le « 13 s » dans le texte complet avant de l'afficher comme norme. |
| `mollet-unipodal` | 6 reps ; repère 25 | Limites d'accord ±6 reps ; médiane 24 (H) / 21 (F), plan incliné 10°, 20-81 ans [@hebertlosier2017b] | **OK** | Rien à changer sur le `mdc`. La fiche écrit « ICC 0,90-0,96, erreur ≈ 2 reps » : le résumé donne ICC 1,0 et ±6 reps. Écrire « un écart de moins de 6 reps n'est pas réel ». Protocole différent (sol plat vs plan incliné) : le repère 25 reste indicatif. |
| `pont-unipodal` | 5 reps ; repère 25 (< 20 faible) | Score plus bas chez les futurs blessés, 28 blessures [@freckleton2014] ; les seuils 20/25 et l'ICC 0,77-0,91 ne sont pas dans le résumé | **Non vérifié** | Garder comme suivi individuel. Vérifier les seuils dans le texte complet. Ne pas parler de risque de blessure. |

**Bilan.** 8 `mdc` cohérents ou à la limite (saut, RM, genou au mur, Thomas, jambe tendue, 2 tests d'épaule, mollet), 1 trop optimiste (rotation interne de hanche), 4 non vérifiables dans les résumés (assis-debout, squat bras levés, équilibre, pont). Trois textes de fiche à corriger : saut unipodal (ICC), mollet (ICC et erreur), RM (conditions du ±5 %).

## Ce que l'appli devrait faire

**À faire**
- **Afficher l'incertitude partout.** Chaque résultat de test avec sa marge : « 11,5 cm (± 2 cm) ». Sous le `mdc` : pastille « stable ». C'est déjà la logique de `tests.json` ; la rendre visible à l'athlète [@weir2005].
- **Corriger trois valeurs** : `rotation-interne-hanche` `mdc` 6 → 10 et `asym` 8 → 10-12 [@spork2021] ; `saut-unipodal` `mdc` 12 → 15 cm ou 10 % [@kockum2015] ; `rotation-externe-epaule` 8 → 9 [@kolber2011]. Et corriger les trois textes de fiche signalés plus haut.
- **Marge du max variable.** `mdcPct` 5 si reps ≤ 8 et RIR ≤ 2 ; 8-10 sinon. Refuser un calcul de max au-delà de 10 reps ou de RIR 4 (message : « série trop loin de l'échec pour estimer ») [@reynolds2006] [@zourdos2021].
- **Passation de familiarisation.** Marquer la 1re passation d'un test « découverte » et prendre la 2e comme référence, au moins pour les sauts [@munro2011].
- **Asymétrie confirmée.** N'afficher l'alerte gauche/droite que si elle dépasse le seuil sur deux passations de suite [@reid2007] [@howe2020].
- **Ajustement de charge prudent.** Ne pas ajuster sur le RIR de la 1re série seule ; pondérer les séries 2-3 ; traiter un RIR annoncé comme « ± 1 » [@mansfield2020] [@halperin2022].
- **Auto-mesure du `mdc` maison.** Proposer au coach un mode « test-retest » (2 passations à une semaine) qui calcule le SEM et le MDC réels du groupe pour les tests non validés (assis-debout, pont, équilibre) [@hopkins2000].
- **Thomas : garde-fou bassin.** Rappel sonore « dos plaqué », et si possible contrôle que le téléphone ne détecte pas de mouvement parasite avant la mesure [@vigotsky2016].
- **Vidéo : guide de cadrage.** Gabarit à l'écran (corps entier, ≈ 2 m, téléphone fixe). Pour un futur comptage de reps, viser la vue de trois quarts [@oliosi2026].
- **CMJ optionnel.** Un saut vertical filmé au ralenti est la mesure de puissance la mieux validée au téléphone [@gencoglu2023] ; `mdc` à fixer par test-retest (CV 2,4-4,6 % en labo [@markovic2004]).
- **Version « angle » du genou au mur.** Le téléphone sur le tibia donne l'angle à 0,5° d'un inclinomètre pro [@balsalobrefernandez2019] : utile si le mètre ruban gêne.
- **Données de montre via intervals.icu.** N'utiliser que des tendances : FC de repos, VFC du matin, durée de sommeil [@dobbs2019] [@lee2025].

**À ne PAS faire**
- Pas de « score de risque de blessure » tiré des tests [@moran2017b] [@plisky2021].
- Pas de verdict automatique « valgus du genou » par IA sur une vidéo d'athlète [@ortiz2016] [@yoma2025].
- Pas de 1RM calculé par la vitesse de barre [@greig2023] [@lemense2024].
- Pas de charge de séance de muscu calculée depuis la FC du poignet [@zhang2020].
- Pas de calories de séance [@fuller2020].
- Pas de comparaison d'un athlète à une « norme » pour les tests sans norme vérifiée (assis-debout, pont, équilibre).
- Pas de RSI ni de Y-balance ajoutés « parce que les pros le font » sans matériel ni MDC [@montalvo2021] [@plisky2021].
- Pas de VO2max de montre affichée comme une mesure [@molinagarcia2022].

## Limites et incertitudes

- **Je n'ai lu que les résumés** (Europe PMC). Les chiffres absents des résumés ne sont pas cités : normes par âge de Springer, seuils 20/25 du pont unipodal, repères 10 cm / 30° / 70° / 165° / 60°.
- **Non trouvés ou non ouverts** : LeSuer 1997, Epley 1985, « Moses (Wintec) », « étude RIR au squat 2025 », « CISS 2023 », « IJSPT 2024 » (pont), « revue Sports 2025 » citées dans `tests.json`. Je ne confirme ni n'infirme ces sources. L'affirmation « au soulevé de terre les formules sous-estiment » n'est pas vérifiée ici.
- **Aucune méta-analyse sur la précision des formules reps → 1RM** (Epley, Brzycki) n'a été trouvée ; le « ±5 % » repose sur des études isolées et sur mon calcul à partir de l'erreur de RIR.
- **Auto-mesure.** Presque toutes les études font mesurer par un examinateur, souvent en passif. L'appli fait mesurer l'athlète seul, en actif. L'erreur réelle est sans doute plus grande ; elle n'est connue que par un test-retest interne.
- **Populations.** Étudiants, sportifs loisir, patients. Très peu d'athlètes d'endurance (exception : skieurs de fond, [@birinci2026]). Rien en altitude.
- **MDC90 vs MDC95, intra vs inter-évaluateur** : les études ne sont pas homogènes ; mes comparaisons avec les `mdc` de l'appli sont des ordres de grandeur.
- **Estimation de pose.** Les revues mélangent des systèmes multi-caméras de labo et des téléphones seuls ; les chiffres (4-5°) sont plutôt ceux des bons systèmes. Pour MediaPipe/BlazePose sur un seul téléphone, je n'ai pas trouvé de revue dédiée ; une seule étude de comptage [@oliosi2026]. OpenCap : une revue de portée 2026 repérée mais non lue, donc non citée.
- **VBT au téléphone.** Les études d'applis sont en grande partie écrites par le développeur des applis (conflit d'intérêts possible) et portent sur 10 à 27 sujets, surtout au développé couché [@balsalobrefernandez2018] [@balsalobrefernandez2023].
- **Montres.** Les modèles changent plus vite que les validations (≈ 11 % des appareils validés) [@doherty2024]. Le comptage automatique de reps n'a qu'une étude ancienne ici [@oberhofer2021].
- **Seuil de 90 % de symétrie** : vient d'un échantillon de 22 sportifs loisir [@munro2011] ; c'est un repère, pas une loi.

## Annexe — notes de lecture par sous-domaine

### Notes de lecture 1 — Tests de terrain (sauts, hop, Y-balance, cheville, Thomas, force isométrique, tests d'endurance locale)

- **Vocabulaire.** L'ICC dit si le test classe bien les gens entre eux ; il dépend de l'hétérogénéité du groupe. Pour suivre UN athlète, il faut l'erreur typique (SEM, souvent en % = CV) et le plus petit changement réel (MDC ≈ SEM × 1,96 × √2 ≈ 2,77 × SEM pour 95 %) [@hopkins2000] [@weir2005]. Repères ICC : < 0,5 faible, 0,5-0,75 modéré, 0,75-0,9 bon, > 0,9 excellent [@koo2016].
- **CMJ.** Test vertical le plus fiable et le plus « valide » pour la puissance (CV 2,4-4,6 %, alpha 0,97-0,98) [@markovic2004]. L'appli My Jump (vidéo au ralenti, temps de vol) est valide et fiable : méta-analyse de 21 études [@gencoglu2023]. Mais les méthodes de calcul donnent des hauteurs différentes : ne jamais mélanger tapis, appli, plateforme [@xu2023].
- **RSI (drop jump).** Bon pour classer (ICC ≥ 0,92) mais l'erreur absolue est grande (CV ≥ 12,5 % sur tous les appareils testés) [@montalvo2021] : un changement de RSI < ~15 % n'est pas interprétable chez un individu.
- **Hop test (saut unipodal en longueur).** ICC 0,76-0,93 ; erreur ≈ 3-11 % ; MDC ≈ 7-13 % de symétrie (Reid, opérés LCA) ou plus petite différence réelle 9-31 % selon le hop (Kockum, athlètes) [@reid2007] [@kockum2015] [@munro2011]. **Effet d'apprentissage** net sur 3 semaines [@munro2011]. Tous les sujets sains ≥ 90 % de symétrie → seuil 90 % conseillé [@munro2011].
- **Y-balance.** Fiable (0,85-0,91) mais avec des seuils généraux, il **ne prédit pas** la blessure ; normes à adapter au sexe et au sport [@plisky2021].
- **Genou au mur (WBLT).** Très fiable ; MDC 1,6-1,9 cm (≈ 4,6-4,7°) [@powden2015]. L'asymétrie gauche/droite est moins fiable que la mesure d'un côté (ICC 0,85, MDC 2,1° contre 1,7°) [@howe2020].
- **Thomas.** Reproductible à l'inclinomètre (ICC ≈ 0,9) [@clapis2008] [@eimiller2024], mais **non valide si la bascule du bassin n'est pas contrôlée** (sensibilité 32 %, spécificité 57 %) [@vigotsky2016]. Extension moyenne chez des jeunes sains : 5 ± 10° [@eimiller2024].
- **Force isométrique.** Tirage mi-cuisse : CV médian 4,9 % [@grgic2022b]. Dynamomètre à main sur les membres inférieurs : limites d'accord très larges (±34 % genou, ±49 % mollet) [@chamorro2017].
- **Tests d'endurance locale.** Montées sur pointe : ICC ≈ 1, limites d'accord ±6 reps, médiane 21-24 reps (plan incliné 10°, adultes 20-81 ans) [@hebertlosier2017b]. Pont unipodal : score plus faible chez les futurs blessés des ischios, preuve fragile (28 blessures) [@freckleton2014] ; version « tenue » 65 ± 33 s chez des jeunes [@worst2026]. Assis-debout unipodal : ICC 0,92-0,94 (30 s) [@waldhelm2020] ; validé chez des skieurs de fond internationaux via une appli (ICC 0,81-0,89, CV 6-10 %) [@birinci2026].
- **Équilibre yeux fermés.** Meilleur de 3 essais très reproductible entre évaluateurs (ICC 0,998), baisse avec l'âge [@springer2007] ; les normes par âge (≈ 13 s chez 18-39 ans citées dans l'appli) ne figurent pas dans le résumé : **non vérifié** ici.

### Notes de lecture 2 — Mesurer un angle avec le capteur du téléphone

- **Globalement oui.** Revue de 25 études : les applis inclinomètre peuvent remplacer le goniomètre ; mais la preuve est plus faible pour l'erreur absolue (MDC) que pour l'ICC [@keogh2019]. Revue plus ancienne : 12 applis validées en statique, pas en dynamique [@milani2014]. Jeunes sains : ICC smartphone 0,33 à 0,98 selon l'articulation et l'appli [@canever2025].
- **Hanche = le point faible.** Aucune appli recommandable sans réserve pour la hanche [@hahn2021]. Rotation interne : validité bonne vs 3D (ICC 0,81-0,94) quand un examinateur bouge la jambe [@ganokroj2021], mais en conditions réelles (jeunes footballeurs) MDC 11-16° [@spork2021]. **L'appli retient un MDC de 6° : c'est probablement trop optimiste**, surtout en auto-mesure active.
- **Jambe tendue.** iPhone, mesure passive : MDC95 3,3° même examinateur, 10,2° entre examinateurs [@amano2024]. Auto-mesure active seul : non validée.
- **Épaule.** Smartphone ≥ goniomètre pour la reproductibilité (ICC 0,80 vs 0,69) [@werner2014]. MDC90 inclinomètre : 8° flexion, 9° rotation externe [@kolber2011]. Vs capture 3D : erreur moyenne 5,8° en flexion, 1,7° en rotation externe [@boissy2017]. **Le MDC de 8° de l'appli colle à la littérature.**
- **Thomas.** Au goniomètre, fiabilité basse entre jours (ICC 0,30-0,65) ; une méthode géométrique (cuisse) fait 0,90-0,95 [@wakefield2015]. Le téléphone posé sur la cuisse se rapproche de la méthode « segment » : bonne idée, mais la bascule du bassin reste la principale source d'erreur [@vigotsky2016].
- **À retenir.** Face à un inclinomètre pro, l'iPhone fait 0,48° d'erreur sur l'angle de cheville [@balsalobrefernandez2019] ; l'erreur vient donc surtout de la **position du corps, du placement et du zéro**. L'auto-mesure active d'un athlète seul n'est validée pour presque aucun test : l'appli doit le dire.

### Notes de lecture 3 — VBT par téléphone, estimation du 1RM, précision du RIR

- **Vitesse de barre au téléphone.** PowerLift (ex-My Lift) vs capteur linéaire : r = 0,94, ICC 0,97 [@balsalobrefernandez2018]. My Jump Lab (IA, temps réel) vs GymAware : r 0,90-0,92, biais ≈ 0,01-0,03 m/s, CV de l'appli proche du capteur [@balsalobrefernandez2023]. Revue des applis : valides, **biais aux charges lourdes** [@silva2021]. Centrales inertielles : 7 modèles sur 8 valides en trajectoire linéaire [@clemente2021]. Méta-analyse 2026 : validité ICC ≈ 0,91, les capteurs à câble plus constants que les IMU [@claassen2026]. Mais seules 5 études de validité sur 66 passent des critères stricts [@wannouch2025].
- **1RM par la vitesse.** Erreur ≈ 10 % (SEE%) et **surestimation** moyenne de ~4 % [@greig2023] ; au squat libre la méthode de vitesse seuil surestime (ES 0,53) [@lemense2024]. Donc le profil charge-vitesse n'est pas plus précis qu'une formule reps-charge bien utilisée.
- **1RM par les reps.** Le 5RM prédit le mieux (R² 0,97-0,99) ; pas plus de 10 reps en équation linéaire [@reynolds2006] [@mayhew2008]. Le nombre de reps à un %1RM varie beaucoup d'un individu à l'autre et selon l'exercice (presse > développé couché) [@nuzzo2024] → une même formule pour tous a une erreur individuelle incompressible.
- **RIR/RPE.** Erreur moyenne ≈ 1 rep (sous-estimation 0,95), hétérogénéité énorme ; meilleur près de l'échec, sous 12 reps, en séries tardives ; le niveau d'entraînement ne change rien [@halperin2022]. Au développé couché 75 % : erreur absolue 0,65 rep [@refalo2024]. Mais en série longue (squat 70 %, ~16 reps) : 2 reps d'erreur à RIR 1, 3,7 à RIR 3, 5,2 à RIR 5 [@zourdos2021]. 1re série souvent sous-estimée [@mansfield2020]. La vitesse baisse quand le RPE monte (r ≈ -0,8 à -0,9) [@zourdos2016].
- **Calcul pour l'appli.** Avec Epley (1RM = charge × (1 + reps/30)), 1 rep d'erreur sur les reps totales ≈ 3 % d'erreur sur le 1RM ; 2 reps ≈ 6-7 %. Le « ±5 % » affiché tient pour 3-8 reps **si** le RIR annoncé est ≤ 2-3 ; il devient optimiste au-delà (calcul de l'auteur à partir de [@zourdos2021] [@halperin2022]).
- **Vitesse → reps restantes.** Bonne au repos, mauvaise en fatigue sauf athlètes très expérimentés de l'échec [@mirasmoreno2025] : pas pour des endurants qui ne vont pas à l'échec.

### Notes de lecture 4 — Analyse vidéo du mouvement par IA (estimation de pose)

- **État 2025-2026.** Méta-analyse sauts : erreur ≈ 4-5° dans le plan sagittal (genou, hanche, cheville), 3° hanche frontale, **7,5° cheville frontale** ; hauteur de saut biaisée de -2,9 cm ; énorme variabilité selon le système [@ogura2026]. Revue de 53 études : fiable d'une fois sur l'autre (SEM < 5° le plus souvent) mais écarts au 3D de 0,2 à 28,6° → **pas interchangeable avec un labo** [@yoma2025] [@chougule2026]. L'IA de pose en sport repose sur des données privées, peu reproductible [@aulton2025].
- **Compter les reps : oui, si la caméra est bien placée.** Squat filmé en diagonale à 2 m : 95 % de détection, erreur 0,05 rep ; de profil à 90 cm : 0 % [@oliosi2026]. Montre connectée : comptage correct au squat et soulevé de terre, mauvais au développé couché [@oberhofer2021].
- **Valgus du genou.** En labo, sans charge, vidéo de face : OpenPose ≈ 2,4° d'erreur, aussi bien qu'un kiné [@ino2024]. Mais l'angle de projection frontale 2D peut être mal corrélé au 3D (ICC 0-0,57) alors que l'écart genoux/chevilles l'est bien [@ortiz2016]. Les vrais angles de valgus sont petits (2-5°) [@erdman2024] : **l'erreur de l'IA est du même ordre que ce qu'on veut mesurer**. Juger un valgus sous charge, en salle, filmé de profil par un athlète seul : non validé → rester sur un critère visuel simple (genou à l'intérieur du pied) et sur l'œil du coach.
- **Amplitudes par IA.** Appli de vision : ICC 0,74-0,93 pour hanche/genou [@hellsten2025] ; systèmes 3D multi-caméras très bons au squat bras levés [@bae2024] (pas un téléphone seul).
- **Squat bras levés / FMS.** Le score FMS est reproductible (ICC 0,84) [@cuchna2016] mais **ne prédit pas la blessure** [@moran2017b]. L'appli le présente bien comme un outil pour choisir des exercices, pas pour prédire.

## Sources

72 sources vérifiées (résumé ou page ouverts), dont 31 méta-analyses, revues systématiques ou consensus. Notices complètes (auteurs, revue, DOI, ce que la source montre) dans `recherche/sources.json`.

[@amano2024] [@aulton2025] [@bae2024] [@balsalobrefernandez2018] [@balsalobrefernandez2019] [@balsalobrefernandez2023] [@birinci2026] [@boissy2017] [@canever2025] [@chamorro2017] [@chougule2026] [@claassen2026] [@clapis2008] [@clemente2021] [@cuchna2016] [@dobbs2019] [@doherty2024] [@eimiller2024] [@erdman2024] [@freckleton2014] [@fuller2020] [@ganokroj2021] [@gencoglu2023] [@greig2023] [@grgic2022b] [@hahn2021] [@halperin2022] [@hebertlosier2017b] [@hellsten2025] [@hopkins2000] [@howe2020] [@ino2024] [@keogh2019] [@kockum2015] [@kolber2011] [@koo2016] [@lee2025] [@lemense2024] [@mansfield2020] [@markovic2004] [@mayhew2008] [@milani2014] [@mirasmoreno2025] [@molinagarcia2022] [@montalvo2021] [@moran2017b] [@munro2011] [@nuzzo2024] [@oberhofer2021] [@ogura2026] [@oliosi2026] [@ortiz2016] [@plisky2021] [@powden2015] [@refalo2024] [@reid2007] [@reynolds2006] [@silva2021] [@spork2021] [@springer2007] [@vigotsky2016] [@wakefield2015] [@waldhelm2020] [@wannouch2025] [@weir2005] [@werner2014] [@worst2026] [@xu2023] [@yoma2025] [@zhang2020] [@zourdos2016] [@zourdos2021]
