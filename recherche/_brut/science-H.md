# H — Tests, mesure et technologie

*Relu par un contradicteur le 1er octobre 2026 : 3 corrections appliquées (voir _brut/revue-science-EH.md).*

## En 1 minute

- **Un test ne vaut que par son erreur de mesure.** Pour suivre UN athlète, il faut le SEM et le plus petit changement réel (MDC), pas l'ICC. Sous le MDC, on écrit « stable » [@hopkins2000] [@weir2005].
- **Le téléphone mesure bien un angle**, mais la preuve est solide surtout pour la fiabilité relative, moins pour l'erreur absolue ; la **hanche** est le point faible, l'épaule et la cheville sont les mieux validées [@keogh2019] [@hahn2021] [@kolber2011] [@powden2015].
- **RIR : un biais moyen, pas une marge d'erreur.** En moyenne, les pratiquants annoncent ~1 rep de moins que ce qu'ils peuvent faire ; l'écart individuel va de 0 à 2 reps près de l'échec, davantage loin de l'échec. (B) En série longue, jusqu'à 4-5 reps à RIR 5 ; le niveau d'entraînement n'y change rien [@halperin2022] [@zourdos2021].
- **1RM par la vitesse.** Le 1RM estimé par la vitesse a une erreur d'environ 10 % et surestime d'environ 4 % [@greig2023]. Aucune comparaison directe avec les formules par les reps n'a été lue. Au squat, 4 études et 71 sujets [@lemense2024].
- **L'IA vidéo sait compter des reps** (si la caméra est bien placée) et mesure des angles sagittaux à ≈ 4-5° près sur des sauts (profondeur de squat : plausible, non validé) ; elle n'est **pas** validée pour juger un valgus de genou sous charge [@oliosi2026] [@ogura2026] [@yoma2025].
- **Montres :** FC correcte au repos et en course, **fausse en musculation (-7 bpm) et à vélo (-4,5 bpm, chiffre tiré surtout d'ergomètres)** ; VO2max estimée à ±10 ml/kg/min près ; sommeil et calories approximatifs [@zhang2020] [@molinagarcia2022] [@doherty2024] [@lee2025].
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
| L'iPhone mesure l'angle de cheville comme un inclinomètre pro | C | r = 0,989 ; erreur 0,48° ; 12 sujets ; étude écrite par le développeur de l'appli | [@balsalobrefernandez2019] | Une version « angle » du genou au mur est possible |
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
| Une appli iPhone mesure la vitesse de barre presque comme un capteur à câble | C | r 0,90-0,94 ; biais 0,01-0,03 m/s ; études écrites par le développeur des applis | [@balsalobrefernandez2018] [@balsalobrefernandez2023] | VBT par vidéo faisable, sur trajectoire verticale |
| Les applis de vitesse ont un biais aux charges lourdes | A | 23 études, 11 applis | [@silva2021] | Ne pas s'en servir pour un 1RM lourd |
| La qualité des études de validation VBT est faible | A | 5/66 études de validité passent tous les critères | [@wannouch2025] [@claassen2026] | Rester humble sur toute fonction « vitesse » |
| Le 1RM estimé par la vitesse surestime | A | SEE 9,8 % ; +3,7 % du 1RM ; ES 0,53 au squat (4 études, 71 sujets, squat seulement) | [@greig2023] [@lemense2024] | Garder la formule reps-charge par simplicité ; aucune comparaison directe avec les formules par les reps n'a été lue |
| Le 1RM s'estime mieux sur peu de reps | B | 5RM : R² 0,97-0,99 ; pas plus de 10 reps | [@reynolds2006] [@mayhew2008] | Test RM sur 3-6 reps, refuser > 10 |
| Le nombre de reps à un %1RM varie selon l'individu et l'exercice | A | 269 études, 7 289 sujets ; presse > développé couché | [@nuzzo2024] | Une formule unique a une erreur individuelle incompressible |
| En moyenne, les pratiquants annoncent ~1 rep de moins que ce qu'ils peuvent faire ; l'écart individuel va de 0 à 2 reps près de l'échec, davantage loin de l'échec | B | Biais moyen : sous-estimation 0,95 rep (IC 0,17-1,73) ; I² 97,9 % ; revue de portée « exploratoire » ; l'erreur d'un individu est plus large (2,05 ± 1,73 reps à RIR 1) | [@halperin2022] [@refalo2024] [@zourdos2021] | Ne pas afficher « ±1 rep » comme une marge d'erreur : c'est un biais moyen ; RIR prudent = marge de sécurité |
| Le RIR est bien pire loin de l'échec et en série longue | B | Erreur 2,1 / 3,7 / 5,2 reps à RIR 1 / 3 / 5 (série de ~16) | [@zourdos2021] [@halperin2022] | Test RM : exiger RIR ≤ 2-3 et ≤ 8 reps |
| L'expérience n'améliore pas la précision du RIR ; pour les séries tardives, résultats contradictoires | B | β ≈ 0 pour le niveau ; 1re série sous-estimée [@mansfield2020] ; pas de différence entre séries 1 et 2 [@refalo2024] | [@halperin2022] [@mansfield2020] [@refalo2024] | Ne pas ajuster la charge sur la 1re série seule |
| La vitesse baisse quand le RPE monte | B | r = -0,77 à -0,88 | [@zourdos2016] | Le RPE reste un bon substitut gratuit à la vitesse |
| Prédire les reps restantes par la vitesse échoue en fatigue | A | 6 études ; précision compromise avec repos courts | [@mirasmoreno2025] | Pas de « RIR automatique » par la vitesse |
| L'IA de pose a ≈ 4-5° d'erreur en sagittal, plus en frontal à la cheville | A | RMSE 4,4° genou, 5,3° hanche, 7,5° cheville frontale | [@ogura2026] | Profondeur de squat : plausible, non validé (la méta-analyse porte sur des sauts et mélange systèmes multi-caméras et téléphones) ; angles fins : non |
| Le sans-marqueur est répétable mais pas interchangeable avec le labo | A | SEM < 5° souvent ; écarts 0,2 à 28,6° | [@yoma2025] [@chougule2026] | Comparer l'athlète à lui-même, même cadrage |
| Le comptage de reps par IA dépend du placement de caméra | C | 95,5 % en diagonale à 2 m ; 0 % de profil à 90 cm | [@oliosi2026] | Guide de cadrage obligatoire avant de compter |
| Le valgus mesuré en 2D est incertain | C | Angle de projection frontale vs 3D : ICC 0-0,57 ; OpenPose en labo : 2,4° | [@ortiz2016] [@ino2024] [@erdman2024] | Pas de verdict automatique « genou qui rentre » |
| Le FMS est reproductible mais ne prédit pas la blessure | A | ICC 0,84 ; RR 1,47 au mieux | [@cuchna2016] [@moran2017b] | Squat bras levés = choisir des exercices, rien d'autre |
| FC au poignet : bonne au repos et en course, mauvaise en muscu et à vélo | A | -7,3 bpm en musculation ; -4,6 bpm à vélo (surtout sur ergomètre) ; ≈ 0 au repos | [@zhang2020] [@doherty2024] | Ne pas calculer une charge de muscu depuis la FC poignet |
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
- **Vitesse de barre au téléphone** : r 0,90-0,94 avec un capteur à câble, biais 0,01-0,03 m/s ; études écrites par le développeur des applis [@balsalobrefernandez2018] [@balsalobrefernandez2023].
- **1RM par la vitesse** : erreur 9,8 % (IC 7,4-12,2), surestimation 3,7 % [@greig2023].
- **1RM par les reps** : le 5RM donne R² 0,97-0,99 ; au-delà de 10 reps la précision chute [@reynolds2006].
- **RIR** : biais moyen (sous-estimation) 0,95 rep, IC 0,17-1,73, I² 97,9 % [@halperin2022] ; 0,65 rep au développé couché à 75 % [@refalo2024] ; 2,1 / 3,7 / 5,2 reps à RIR 1 / 3 / 5 sur une série de 16 reps [@zourdos2021].
- **Estimation de pose** : erreur 4,4° (genou), 5,3° (hanche), 4,9° (cheville) en sagittal ; 7,5° cheville frontale ; hauteur de saut -2,9 cm ; tâches de saut seulement [@ogura2026].
- **Comptage de reps par IA** : de 0 % à 95,5 % de détection selon l'angle et la distance de la caméra [@oliosi2026].
- **FC au poignet** : -7,3 bpm en musculation, -4,6 bpm à vélo (surtout sur ergomètre), ≈ 0 au repos [@zhang2020].
- **VO2max de montre** : limites d'accord ≈ ±10 ml/kg/min avec un algorithme d'effort [@molinagarcia2022].
- **Sommeil au poignet** : ≈ 17 min d'écart sur la durée totale [@lee2025]. **Calories** : erreur de -21 à +15 % [@doherty2024].
- **Seuls ≈ 11 % des appareils grand public** ont été validés pour au moins une mesure [@doherty2024].

## Mythes et verdicts

1. **« Un ICC de 0,95, donc le test est précis. »** → Faux raccourci. L'ICC dépend de la diversité du groupe ; le RSI a un ICC ≥ 0,92 et pourtant un CV ≥ 12,5 %. Preuve B [@hopkins2000] [@montalvo2021].
2. **« Le FMS (ou le Y-balance) détecte qui va se blesser. »** → Non. Lien faible ou nul avec des seuils généraux. Preuve A [@moran2017b] [@plisky2021].
3. **« La vitesse de barre donne un 1RM plus juste que les reps. »** → Pas démontré. Le 1RM estimé par la vitesse a une erreur d'environ 10 % et surestime d'environ 4 % [@greig2023]. Aucune comparaison directe avec les formules par les reps n'a été lue. Au squat libre la méthode est jugée non viable (4 études, 71 sujets). Preuve B [@lemense2024].
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
17. RIR annoncé : en moyenne, les pratiquants annoncent ~1 rep de moins que ce qu'ils peuvent faire ; l'écart individuel va de 0 à 2 reps près de l'échec, davantage loin de l'échec. Une rep d'écart ≈ 3 % sur le max estimé avec Epley (calcul). (B) [@halperin2022] [@refalo2024] [@zourdos2021]
18. Ne modifie pas un max pour un écart de moins de 5 % ; attends deux tests concordants. (B) [@reynolds2006] [@nuzzo2024]
19. Fais un max par exercice : le lien reps-charge change d'un exercice à l'autre. (A) [@nuzzo2024]
20. Ne règle pas la charge sur le RIR de la 1re série seule : elle est souvent sous-estimée. Regarde les séries 2 et 3. Résultats contradictoires : une étude ne trouve pas de différence entre séries 1 et 2. (C) [@mansfield2020] [@halperin2022] [@refalo2024]
21. Un athlète « expérimenté » n'est pas plus précis en RIR : garde la même prudence pour tous. (A) [@halperin2022]
22. Séries longues (> 12 reps) : le RIR devient peu fiable ; préfère un nombre de reps fixé et un RPE global. (A) [@halperin2022] [@zourdos2021]
23. Si tu utilises une appli de vitesse : même exercice, trajectoire verticale, charges moyennes ; ne t'en sers pas pour estimer un 1RM (erreur d'environ 10 %). (A) [@silva2021] [@greig2023] [@lemense2024]
24. Le RPE reste un bon indicateur gratuit de la vitesse perdue (r ≈ -0,8). (B) [@zourdos2016]

**Tests d'endurance locale et sauts**
25. Montées sur pointe : un changement de moins de 6 reps est du bruit. (B) [@hebertlosier2017b]
26. Assis-debout unipodal et pont unipodal : compare l'athlète à lui-même et gauche/droite ; pas de norme solide. (C) [@waldhelm2020] [@birinci2026] [@freckleton2014]
27. Si tu veux un test de puissance simple : CMJ filmé au ralenti, meilleur de 3, toujours avec la même appli. (A) [@gencoglu2023] [@markovic2004]
28. Évite le RSI pour le suivi individuel sans matériel dédié : erreur ≥ 12 %. (B) [@montalvo2021]

**Vidéo et IA**
29. Vidéo de squat : téléphone fixe, à ≈ 2 m, corps entier dans le cadre ; pour compter, la vue de trois quarts marche mieux que le profil collé. (C) [@oliosi2026]
30. Sers-toi de la vidéo pour regarder la profondeur, les talons, le buste : usage plausible, non validé (les mesures portent sur des sauts). Pas pour chiffrer un valgus. (C) [@ogura2026] [@ortiz2016]
31. Pour le genou, critère visuel simple : « le genou passe-t-il à l'intérieur du pied ? ». (C) [@erdman2024]

**Montres**
32. FC en musculation : ignore la valeur du poignet. Si tu veux la FC, ceinture thoracique. (A) [@zhang2020]
33. À vélo aussi, la FC du poignet est en retrait (-4,5 bpm, chiffre tiré surtout d'ergomètres) : ceinture pour les séances clés. (B) [@zhang2020]
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
| `rm` | 5 % | 5RM : R² 0,97-0,99 ; pas plus de 10 reps [@reynolds2006] ; RIR : biais moyen ~1 rep, écart individuel de 0 à 2 reps près de l'échec, 2-5 reps loin de l'échec [@halperin2022] [@zourdos2021] ; 1 rep ≈ 3,3 % avec Epley (calcul) | **OK sous conditions** (≤ 8 reps et RIR ≤ 2) ; optimiste sinon | Afficher ±5 % si RIR ≤ 2, ±8 à 10 % si RIR ≥ 3 ou reps > 8. Les sources « Moses (Wintec) », « LeSuer 1997 », « étude RIR au squat 2025 » et la phrase sur le soulevé de terre n'ont pas pu être vérifiées ici. |
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
- **Ajustement de charge prudent.** Ne pas ajuster sur le RIR de la 1re série seule ; pondérer les séries 2-3 ; traiter un RIR annoncé comme sous-estimé d'environ 1 rep en moyenne, avec un écart individuel de 0 à 2 reps près de l'échec (ne pas afficher « ±1 rep » comme une marge d'erreur) ; l'effet de la 1re série est contesté [@mansfield2020] [@halperin2022] [@refalo2024].
- **Auto-mesure du `mdc` maison.** Proposer au coach un mode « test-retest » (2 passations à une semaine) qui calcule le SEM et le MDC réels du groupe pour les tests non validés (assis-debout, pont, équilibre) [@hopkins2000].
- **Thomas : garde-fou bassin.** Rappel sonore « dos plaqué », et si possible contrôle que le téléphone ne détecte pas de mouvement parasite avant la mesure [@vigotsky2016].
- **Vidéo : guide de cadrage.** Gabarit à l'écran (corps entier, ≈ 2 m, téléphone fixe). Pour un futur comptage de reps, viser la vue de trois quarts [@oliosi2026].
- **CMJ optionnel.** Un saut vertical filmé au ralenti est la mesure de puissance la mieux validée au téléphone [@gencoglu2023] ; `mdc` à fixer par test-retest (CV 2,4-4,6 % en labo [@markovic2004]).
- **Version « angle » du genou au mur.** Le téléphone sur le tibia donne l'angle à 0,5° d'un inclinomètre pro (12 sujets, étude écrite par le développeur de l'appli) [@balsalobrefernandez2019] : utile si le mètre ruban gêne.
- **Données de montre via intervals.icu.** N'utiliser que des tendances : FC de repos, VFC du matin, durée de sommeil [@dobbs2019] [@lee2025].

**À ne PAS faire**
- Pas de « score de risque de blessure » tiré des tests [@moran2017b] [@plisky2021].
- Pas de verdict automatique « valgus du genou » par IA sur une vidéo d'athlète [@ortiz2016] [@yoma2025].
- Pas de 1RM calculé par la vitesse de barre [@greig2023] [@lemense2024].
- Pas de « profondeur de squat mesurée par IA » présentée comme validée : plausible, non validé [@ogura2026].
- Pas de charge de séance de muscu calculée depuis la FC du poignet [@zhang2020].
- Pas de calories de séance [@fuller2020].
- Pas de comparaison d'un athlète à une « norme » pour les tests sans norme vérifiée (assis-debout, pont, équilibre).
- Pas de RSI ni de Y-balance ajoutés « parce que les pros le font » sans matériel ni MDC [@montalvo2021] [@plisky2021].
- Pas de VO2max de montre affichée comme une mesure [@molinagarcia2022].

## Limites et incertitudes

- **Je n'ai lu que les résumés** (Europe PMC). Les chiffres absents des résumés ne sont pas cités : normes par âge de Springer, seuils 20/25 du pont unipodal, repères 10 cm / 30° / 70° / 165° / 60°.
- **Non trouvés ou non ouverts** : LeSuer 1997, Epley 1985, « Moses (Wintec) », « étude RIR au squat 2025 », « CISS 2023 », « IJSPT 2024 » (pont), « revue Sports 2025 » citées dans `tests.json`. Je ne confirme ni n'infirme ces sources. L'affirmation « au soulevé de terre les formules sous-estiment » n'est pas vérifiée ici.
- **Aucune méta-analyse sur la précision des formules reps → 1RM** (Epley, Brzycki) n'a été trouvée ; le « ±5 % » repose sur des études isolées et sur mon calcul à partir de l'erreur de RIR. On ne peut donc pas dire que la vitesse est « moins précise » ou « pas plus précise » que les reps : aucune comparaison directe n'a été lue.
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
- **À retenir.** Face à un inclinomètre pro, l'iPhone fait 0,48° d'erreur sur l'angle de cheville (étude écrite par le développeur de l'appli) [@balsalobrefernandez2019] ; l'erreur vient donc surtout de la **position du corps, du placement et du zéro**. L'auto-mesure active d'un athlète seul n'est validée pour presque aucun test : l'appli doit le dire.

### Notes de lecture 3 — VBT par téléphone, estimation du 1RM, précision du RIR

- **Vitesse de barre au téléphone.** PowerLift (ex-My Lift) vs capteur linéaire : r = 0,94, ICC 0,97 (étude écrite par le développeur de l'appli) [@balsalobrefernandez2018]. My Jump Lab (IA, temps réel) vs GymAware : r 0,90-0,92, biais ≈ 0,01-0,03 m/s, CV de l'appli proche du capteur (étude écrite par le développeur de l'appli) [@balsalobrefernandez2023]. Revue des applis : valides, **biais aux charges lourdes** [@silva2021]. Centrales inertielles : 7 modèles sur 8 valides en trajectoire linéaire [@clemente2021]. Méta-analyse 2026 : validité ICC ≈ 0,91, les capteurs à câble plus constants que les IMU [@claassen2026]. Mais seules 5 études de validité sur 66 passent des critères stricts [@wannouch2025].
- **1RM par la vitesse.** Erreur ≈ 10 % (SEE%) et **surestimation** moyenne de ~4 % [@greig2023] ; au squat libre la méthode de vitesse seuil surestime (ES 0,53) [@lemense2024]. Aucune comparaison directe avec les formules par les reps n'a été lue : on ne peut pas classer les deux méthodes.
- **1RM par les reps.** Le 5RM prédit le mieux (R² 0,97-0,99) ; pas plus de 10 reps en équation linéaire [@reynolds2006] [@mayhew2008]. Le nombre de reps à un %1RM varie beaucoup d'un individu à l'autre et selon l'exercice (presse > développé couché) [@nuzzo2024] → une même formule pour tous a une erreur individuelle incompressible.
- **RIR/RPE.** Biais moyen ≈ 1 rep (sous-estimation 0,95, IC 0,17-1,73, I² 97,9 %, revue de portée « exploratoire ») : ce n'est pas la marge d'erreur d'un individu, qui est plus large ; meilleur près de l'échec, sous 12 reps, en séries tardives ; le niveau d'entraînement ne change rien [@halperin2022]. Au développé couché 75 % : erreur absolue 0,65 rep [@refalo2024]. Mais en série longue (squat 70 %, ~16 reps) : 2 reps d'erreur à RIR 1, 3,7 à RIR 3, 5,2 à RIR 5 [@zourdos2021]. 1re série souvent sous-estimée [@mansfield2020], mais pas de différence entre séries 1 et 2 dans [@refalo2024] : résultats contradictoires. La vitesse baisse quand le RPE monte (r ≈ -0,8 à -0,9) [@zourdos2016].
- **Calcul pour l'appli.** Avec Epley (1RM = charge × (1 + reps/30)), 1 rep d'erreur sur les reps totales ≈ 3 % d'erreur sur le 1RM ; 2 reps ≈ 6-7 %. Le « ±5 % » affiché tient pour 3-8 reps **si** le RIR annoncé est ≤ 2-3 ; il devient optimiste au-delà (calcul de l'auteur à partir de [@zourdos2021] [@halperin2022]).
- **Vitesse → reps restantes.** Bonne au repos, mauvaise en fatigue sauf athlètes très expérimentés de l'échec [@mirasmoreno2025] : pas pour des endurants qui ne vont pas à l'échec.

### Notes de lecture 4 — Analyse vidéo du mouvement par IA (estimation de pose)

- **État 2025-2026.** Méta-analyse sauts : erreur ≈ 4-5° dans le plan sagittal (genou, hanche, cheville), 3° hanche frontale, **7,5° cheville frontale** ; hauteur de saut biaisée de -2,9 cm ; énorme variabilité selon le système (multi-caméras et téléphones mélangés) [@ogura2026]. Revue de 53 études : fiable d'une fois sur l'autre (SEM < 5° le plus souvent) mais écarts au 3D de 0,2 à 28,6° → **pas interchangeable avec un labo** [@yoma2025] [@chougule2026]. L'IA de pose en sport repose sur des données privées, peu reproductible [@aulton2025].
- **Compter les reps : oui, si la caméra est bien placée.** Squat filmé en diagonale à 2 m : 95 % de détection, erreur 0,05 rep ; de profil à 90 cm : 0 % [@oliosi2026]. Montre connectée : comptage correct au squat et soulevé de terre, mauvais au développé couché [@oberhofer2021].
- **Valgus du genou.** En labo, sans charge, vidéo de face : OpenPose ≈ 2,4° d'erreur, aussi bien qu'un kiné [@ino2024]. Mais l'angle de projection frontale 2D peut être mal corrélé au 3D (ICC 0-0,57) alors que l'écart genoux/chevilles l'est bien [@ortiz2016]. Les vrais angles de valgus sont petits (2-5°) [@erdman2024] : **l'erreur de l'IA est du même ordre que ce qu'on veut mesurer**. Juger un valgus sous charge, en salle, filmé de profil par un athlète seul : non validé → rester sur un critère visuel simple (genou à l'intérieur du pied) et sur l'œil du coach.
- **Amplitudes par IA.** Appli de vision : ICC 0,74-0,93 pour hanche/genou [@hellsten2025] ; systèmes 3D multi-caméras très bons au squat bras levés [@bae2024] (pas un téléphone seul).
- **Squat bras levés / FMS.** Le score FMS est reproductible (ICC 0,84) [@cuchna2016] mais **ne prédit pas la blessure** [@moran2017b]. L'appli le présente bien comme un outil pour choisir des exercices, pas pour prédire.

## Sources vérifiées

Toutes ouvertes via l'API Europe PMC (résumé lu) le 1er octobre 2026. Clés `halperin2022` et `zourdos2016` : mêmes articles que dans `science-A.md`. `hebertlosier2017b` et `grgic2022b` : suffixe « b » car les clés sans suffixe désignent d'autres articles ailleurs dans le dossier.

```json
[
 {
  "cle": "hopkins2000",
  "auteurs": "Hopkins WG",
  "annee": 2000,
  "titre": "Measures of reliability in sports medicine and science",
  "revue": "Sports Med 30(1):1-15",
  "doi": "10.2165/00007256-200030010-00001",
  "url": "https://doi.org/10.2165/00007256-200030010-00001",
  "type": "revue",
  "niveau": "B",
  "verifie": true,
  "note": "Recommande l'erreur typique (écart-type des mesures répétées d'un individu, souvent en % CV) comme mesure de référence ; l'ICC dépend de l'hétérogénéité de l'échantillon ; ~50 sujets et 3 essais pour une estimation précise."
 },
 {
  "cle": "weir2005",
  "auteurs": "Weir JP",
  "annee": 2005,
  "titre": "Quantifying test-retest reliability using the intraclass correlation coefficient and the SEM",
  "revue": "J Strength Cond Res 19(1):231-240",
  "doi": "10.1519/15184.1",
  "url": "https://doi.org/10.1519/15184.1",
  "type": "revue",
  "niveau": "B",
  "verifie": true,
  "note": "Explique les formes d'ICC, l'erreur systématique (apprentissage, fatigue) à retirer, et comment le SEM sert à calculer le plus petit changement réel d'un individu."
 },
 {
  "cle": "koo2016",
  "auteurs": "Koo TK, Li MY",
  "annee": 2016,
  "titre": "A Guideline of Selecting and Reporting Intraclass Correlation Coefficients for Reliability Research",
  "revue": "J Chiropr Med 15(2):155-163",
  "doi": "10.1016/j.jcm.2016.02.012",
  "url": "https://doi.org/10.1016/j.jcm.2016.02.012",
  "type": "revue",
  "niveau": "B",
  "verifie": true,
  "note": "ICC < 0,5 faible, 0,5-0,75 modéré, 0,75-0,9 bon, > 0,9 excellent (à juger sur l'IC95) ; 10 formes d'ICC, à préciser."
 },
 {
  "cle": "markovic2004",
  "auteurs": "Markovic G, Dizdar D, Jukic I, Cardinale M",
  "annee": 2004,
  "titre": "Reliability and factorial validity of squat and countermovement jump tests",
  "revue": "J Strength Cond Res 18(3):551-555",
  "doi": "10.1519/1533-4287(2004)18<551:rafvos>2.0.co;2",
  "url": "https://doi.org/10.1519/1533-4287(2004)18<551:rafvos>2.0.co;2",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "93 étudiants : CMJ et squat jump sur tapis de contact, alpha 0,97-0,98, CV intra-sujet 2,4-4,6 % ; CMJ = meilleure validité factorielle (r = 0,87)."
 },
 {
  "cle": "gencoglu2023",
  "auteurs": "Gençoğlu C, Ulupınar S, Özbay S et al.",
  "annee": 2023,
  "titre": "Validity and reliability of \"My Jump app\" to assess vertical jump performance: a meta-analytic review",
  "revue": "Sci Rep 13:20137",
  "doi": "10.1038/s41598-023-46935-x",
  "url": "https://doi.org/10.1038/s41598-023-46935-x",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "21 études : pas de différence de hauteur entre My Jump et les méthodes de référence, corrélations élevées, fiabilité quasi parfaite ; limité au temps de vol."
 },
 {
  "cle": "xu2023",
  "auteurs": "Xu J, Turner A, Comfort P et al.",
  "annee": 2023,
  "titre": "A Systematic Review of the Different Calculation Methods for Measuring Jump Height During the Countermovement and Drop Jump Tests",
  "revue": "Sports Med 53(5):1055-1072",
  "doi": "10.1007/s40279-023-01828-x",
  "url": "https://doi.org/10.1007/s40279-023-01828-x",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "21 articles : temps de vol et saut-touche rapides mais sensibles aux conditions ; les méthodes donnent des hauteurs différentes, donc ne pas mélanger les méthodes ; plateforme de force (impulsion) = référence."
 },
 {
  "cle": "montalvo2021",
  "auteurs": "Montalvo S, Gonzalez MP, Dietze-Hermosa MS et al.",
  "annee": 2021,
  "titre": "Common Vertical Jump and Reactive Strength Index Measuring Devices: A Validity and Reliability Analysis",
  "revue": "J Strength Cond Res 35(5):1234-1243",
  "doi": "10.1519/jsc.0000000000003988",
  "url": "https://doi.org/10.1519/jsc.0000000000003988",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "30 sujets : hauteur de CMJ ICC ≥ 0,98, CV ≤ 8 % sur tous les appareils ; RSI : ICC ≥ 0,92 mais CV ≥ 12,5 % partout ; apps MyJump2 et What'sMyVert valides vs plateforme."
 },
 {
  "cle": "reid2007",
  "auteurs": "Reid A, Birmingham TB, Stratford PW, Alcock GK, Giffin JR",
  "annee": 2007,
  "titre": "Hop testing provides a reliable and valid outcome measure during rehabilitation after anterior cruciate ligament reconstruction",
  "revue": "Phys Ther 87(3):337-349",
  "doi": "10.2522/ptj.20060143",
  "url": "https://doi.org/10.2522/ptj.20060143",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "42 opérés du LCA : indice de symétrie ICC 0,82-0,93, SEM 3,0-5,6 %, MDC90 7,1-13,0 % (exprimé en % de symétrie, pas en cm)."
 },
 {
  "cle": "munro2011",
  "auteurs": "Munro AG, Herrington LC",
  "annee": 2011,
  "titre": "Between-session reliability of four hop tests and the agility T-test",
  "revue": "J Strength Cond Res 25(5):1470-1477",
  "doi": "10.1519/jsc.0b013e3181d83335",
  "url": "https://doi.org/10.1519/jsc.0b013e3181d83335",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "22 sportifs loisir, 3 semaines : effet d'apprentissage sur tous les hop tests, ICC 0,76-0,92 ; tous les sujets sains ≥ 90 % de symétrie, d'où un seuil conseillé à 90 %."
 },
 {
  "cle": "kockum2015",
  "auteurs": "Kockum B, Heijne AI",
  "annee": 2015,
  "titre": "Hop performance and leg muscle power in athletes: Reliability of a test battery",
  "revue": "Phys Ther Sport 16(3):222-227",
  "doi": "10.1016/j.ptsp.2014.09.002",
  "url": "https://doi.org/10.1016/j.ptsp.2014.09.002",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "14 athlètes : ICC 0,84-0,98, SEM 3,4-11,1 % et plus petite différence réelle 9,3-30,7 % pour les hop tests ; erreur ≈ 10 %."
 },
 {
  "cle": "plisky2021",
  "auteurs": "Plisky P, Schwartkopf-Phifer K, Huebner B, Garner MB, Bullock G",
  "annee": 2021,
  "titre": "Systematic Review and Meta-Analysis of the Y-Balance Test Lower Quarter: Reliability, Discriminant Validity, and Predictive Validity",
  "revue": "Int J Sports Phys Ther 16(5):1190-1209",
  "doi": "10.26603/001c.27634",
  "url": "https://doi.org/10.26603/001c.27634",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "57 études : fiabilité intra-évaluateur 0,85-0,91 ; scores différents selon sexe et sport ; avec des seuils généraux, le Y-balance ne prédit pas la blessure."
 },
 {
  "cle": "powden2015",
  "auteurs": "Powden CJ, Hoch JM, Hoch MC",
  "annee": 2015,
  "titre": "Reliability and minimal detectable change of the weight-bearing lunge test: A systematic review",
  "revue": "Man Ther 20(4):524-532",
  "doi": "10.1016/j.math.2015.01.004",
  "url": "https://doi.org/10.1016/j.math.2015.01.004",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "12 études : ICC inter 0,80-0,99, intra 0,65-0,99 ; MDC moyen 1,6 cm (4,6°) entre cliniciens et 1,9 cm (4,7°) pour un même clinicien."
 },
 {
  "cle": "howe2020",
  "auteurs": "Howe LP, Bampouras TM, North JS, Waldron M",
  "annee": 2020,
  "titre": "Within-session reliability for inter-limb asymmetries in ankle dorsiflexion range of motion measured during the weight-bearing lunge test",
  "revue": "Int J Sports Phys Ther 15(1):64-73",
  "doi": "10.26603/ijspt20200064",
  "url": "https://doi.org/10.26603/ijspt20200064",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "50 actifs : un côté ICC 0,98, MDC 1,7° ; l'asymétrie est moins fiable (ICC 0,85, MDC 2,1°) que la mesure d'un seul côté."
 },
 {
  "cle": "clapis2008",
  "auteurs": "Clapis PA, Davis SM, Davis RO",
  "annee": 2008,
  "titre": "Reliability of inclinometer and goniometric measurements of hip extension flexibility using the modified Thomas test",
  "revue": "Physiother Theory Pract 24(2):135-141",
  "doi": "10.1080/09593980701378256",
  "url": "https://doi.org/10.1080/09593980701378256",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "42 sujets sains, mesures par un examinateur : inclinomètre et goniomètre ICC 0,89-0,92 entre évaluateurs, interchangeables."
 },
 {
  "cle": "vigotsky2016",
  "auteurs": "Vigotsky AD, Lehman GJ, Beardsley C et al.",
  "annee": 2016,
  "titre": "The modified Thomas test is not a valid measure of hip extension unless pelvic tilt is controlled",
  "revue": "PeerJ 4:e2325",
  "doi": "10.7717/peerj.2325",
  "url": "https://doi.org/10.7717/peerj.2325",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "29 étudiants : sans contrôle de la bascule du bassin, validité faible (sensibilité 32 %, spécificité 57 % pour un déficit d'extension) ; bassin contrôlé : r = 0,98."
 },
 {
  "cle": "eimiller2024",
  "auteurs": "Eimiller K, Stoddard E, Janes B, Smith M, Vincek A",
  "annee": 2024,
  "titre": "Reliability of Goniometric Techniques for Measuring Hip Flexor Length Using the Modified Thomas Test",
  "revue": "Int J Sports Phys Ther 19(8):997-1002",
  "doi": "10.26603/001c.120899",
  "url": "https://doi.org/10.26603/001c.120899",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "64 jeunes sains, bassin contrôlé par palpation : ICC intra 0,91, inter 0,85 ; extension moyenne 5,4 ± 9,7°."
 },
 {
  "cle": "hebertlosier2017b",
  "auteurs": "Hébert-Losier K, Wessman C, Alricsson M, Svantesson U",
  "annee": 2017,
  "titre": "Updated reliability and normative values for the standing heel-rise test in healthy adults",
  "revue": "Physiotherapy 103(4):446-452",
  "doi": "10.1016/j.physio.2017.03.002",
  "url": "https://doi.org/10.1016/j.physio.2017.03.002",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "566 adultes 20-81 ans sur plan incliné 10° : ICC 1,0, limites d'accord ±6 reps entre jours ; médiane 24 (hommes) et 21 (femmes)."
 },
 {
  "cle": "freckleton2014",
  "auteurs": "Freckleton G, Cook J, Pizzari T",
  "annee": 2014,
  "titre": "The predictive validity of a single leg bridge test for hamstring injuries in Australian Rules Football Players",
  "revue": "Br J Sports Med 48(8):713-717",
  "doi": "10.1136/bjsports-2013-092356",
  "url": "https://doi.org/10.1136/bjsports-2013-092356",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "482 footballeurs australiens : score plus bas au pont unipodal droit chez ceux blessés ensuite à droite ; 28 blessures seulement, facteurs confondants."
 },
 {
  "cle": "worst2026",
  "auteurs": "Worst H, Henderson N",
  "annee": 2026,
  "titre": "Establishing Normative Values and Clinician Assessment Accuracy for the Single Leg Bridge Endurance Test",
  "revue": "Int J Sports Phys Ther 21(1):34-40",
  "doi": "10.26603/001c.154592",
  "url": "https://doi.org/10.26603/001c.154592",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "77 jeunes (78 % femmes) : pont unipodal tenu 65 ± 33 s ; jugement visuel vs appli d'angle r = 0,82-0,84 (version tenue en temps, pas en reps)."
 },
 {
  "cle": "waldhelm2020",
  "auteurs": "Waldhelm A, Gubler C, Sullivan K et al.",
  "annee": 2020,
  "titre": "Inter-rater and test-retest reliability of two new single leg sit-to-stand tests",
  "revue": "Int J Sports Phys Ther 15(3):388-394",
  "doi": "10.26603/ijspt20200388",
  "url": "https://doi.org/10.26603/ijspt20200388",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "20 étudiants : assis-debout unipodal 30 s, ICC test-retest 0,92-0,94 ; 5 reps chronométrées 0,87-0,94."
 },
 {
  "cle": "birinci2026",
  "auteurs": "Birinci MC, Makaracı Y, Aktaş BS, Atasever G, Ruiz-Cárdenas JD",
  "annee": 2026,
  "titre": "The single-leg sit-to-stand test is valid and reliable for assessing lower limb performance and asymmetry in international cross-country skiers",
  "revue": "Gait Posture 125:110100",
  "doi": "10.1016/j.gaitpost.2026.110100",
  "url": "https://doi.org/10.1016/j.gaitpost.2026.110100",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "22 skieurs de fond internationaux, appli mobile : ICC 0,81-0,89, CV 6-10 % ; asymétrie stable entre séances ; lien modéré avec couple isocinétique (r 0,34-0,54) et CMJ (0,46-0,75)."
 },
 {
  "cle": "springer2007",
  "auteurs": "Springer BA, Marin R, Cyhan T, Roberts H, Gill NW",
  "annee": 2007,
  "titre": "Normative values for the unipedal stance test with eyes open and closed",
  "revue": "J Geriatr Phys Ther 30(1):8-15",
  "doi": "10.1519/00139143-200704000-00003",
  "url": "https://doi.org/10.1519/00139143-200704000-00003",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "549 adultes : temps sur une jambe baisse avec l'âge, ne dépend pas du sexe ; ICC inter-évaluateur meilleur de 3 essais 0,998 yeux fermés (les normes par âge ne sont pas dans le résumé)."
 },
 {
  "cle": "grgic2022b",
  "auteurs": "Grgic J, Scapec B, Mikulic P, Pedisic Z",
  "annee": 2022,
  "titre": "Test-retest reliability of isometric mid-thigh pull maximum strength assessment: a systematic review",
  "revue": "Biol Sport 39(2):407-414",
  "doi": "10.5114/biolsport.2022.106149",
  "url": "https://doi.org/10.5114/biolsport.2022.106149",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "16 études : ICC 0,73-0,99 (médiane 0,96), CV 0,7-11,1 % (médiane 4,9 %) pour la force max en tirage isométrique mi-cuisse."
 },
 {
  "cle": "chamorro2017",
  "auteurs": "Chamorro C, Armijo-Olivo S, De la Fuente C, Fuentes J, Chirosa LJ",
  "annee": 2017,
  "titre": "Absolute Reliability and Concurrent Validity of Hand Held Dynamometry and Isokinetic Dynamometry in the Hip, Knee and Ankle Joint: Systematic Review and Meta-analysis",
  "revue": "Open Med (Wars) 12:359-375",
  "doi": "10.1515/med-2017-0052",
  "url": "https://doi.org/10.1515/med-2017-0052",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "17 études : dynamomètre à main, limites d'accord ±34 % en extension de genou et ±49 % en flexion plantaire, contre < 15 % à l'isocinétique."
 },
 {
  "cle": "keogh2019",
  "auteurs": "Keogh JWL, Cox A, Anderson S et al.",
  "annee": 2019,
  "titre": "Reliability and validity of clinically accessible smartphone applications to measure joint range of motion: A systematic review",
  "revue": "PLoS One 14(5):e0215806",
  "doi": "10.1371/journal.pone.0215806",
  "url": "https://doi.org/10.1371/journal.pone.0215806",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "25 études (adultes) : fiabilité et validité correctes pour > 50 % des mesures, mais preuve plus faible pour l'erreur absolue (MDC, limites d'accord) que pour l'ICC ; peut remplacer le goniomètre."
 },
 {
  "cle": "milani2014",
  "auteurs": "Milani P, Coccetta CA, Rabini A et al.",
  "annee": 2014,
  "titre": "Mobile smartphone applications for body position measurement in rehabilitation: a review of goniometric tools",
  "revue": "PM R 6(11):1038-1043",
  "doi": "10.1016/j.pmrj.2014.05.003",
  "url": "https://doi.org/10.1016/j.pmrj.2014.05.003",
  "type": "revue-systematique",
  "niveau": "B",
  "verifie": true,
  "note": "17 articles, 12 applis (accéléromètre, magnétomètre, caméra) validées en statique ; manque de validation en conditions dynamiques (marche, exercices)."
 },
 {
  "cle": "hahn2021",
  "auteurs": "Hahn S, Kröger I, Willwacher S, Augat P",
  "annee": 2021,
  "titre": "Reliability and validity varies among smartphone apps for range of motion measurements of the lower extremity: a systematic review",
  "revue": "Biomed Tech (Berl) 66(6):537-555",
  "doi": "10.1515/bmt-2021-0015",
  "url": "https://doi.org/10.1515/bmt-2021-0015",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "25 études : quelques applis bonnes pour genou et cheville ; aucune appli recommandable sans réserve pour la hanche."
 },
 {
  "cle": "canever2025",
  "auteurs": "Canever JB, Nonnenmacher CH, Lima KMM",
  "annee": 2025,
  "titre": "Reliability of range of motion measurements obtained by goniometry, photogrammetry and smartphone applications in lower limb: A systematic review",
  "revue": "J Bodyw Mov Ther 42:793-802",
  "doi": "10.1016/j.jbmt.2025.01.009",
  "url": "https://doi.org/10.1016/j.jbmt.2025.01.009",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "12 études, jeunes sains : ICC goniomètre 0,18-0,99, photogrammétrie 0,78-1,00, smartphone 0,33-0,98 ; familiarisation conseillée."
 },
 {
  "cle": "ganokroj2021",
  "auteurs": "Ganokroj P, Sompornpanich N, Kerdsomnuek P, Vanadurongwan B, Lertwanich P",
  "annee": 2021,
  "titre": "Validity and reliability of smartphone applications for measurement of hip rotation, compared with three-dimensional motion analysis",
  "revue": "BMC Musculoskelet Disord 22:166",
  "doi": "10.1186/s12891-021-03995-2",
  "url": "https://doi.org/10.1186/s12891-021-03995-2",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "24 sujets, rotation passive par examinateur : validité rotation interne ICC 0,81-0,94, rotation externe assis 0,70-0,73 ; fiabilité entre examinateurs seulement passable à bonne."
 },
 {
  "cle": "spork2021",
  "auteurs": "Spork P, O'Brien J, Sepoetro M, Plachel M, Stöggl T",
  "annee": 2021,
  "titre": "The Intra- and Inter-Rater Reliability of a Hip Rotation Range-of-Motion Measurement Using a Smartphone Application in Academy Football (Soccer) Players",
  "revue": "Sports (Basel) 9(11):148",
  "doi": "10.3390/sports9110148",
  "url": "https://doi.org/10.3390/sports9110148",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "41 footballeurs 14-15 ans, conditions réelles, téléphone sur la jambe : ICC intra 0,54-0,75, MDC 10,9-16,4° ; utilité pratique limitée."
 },
 {
  "cle": "amano2024",
  "auteurs": "Amano T, Agata N, Yamamoto T, Mori K",
  "annee": 2024,
  "titre": "Reliability of range of motion in straight leg raise and hip extension tests among healthy young adults using a smartphone application",
  "revue": "J Bodyw Mov Ther 40:683-688",
  "doi": "10.1016/j.jbmt.2024.05.033",
  "url": "https://doi.org/10.1016/j.jbmt.2024.05.033",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "36 jeunes, mesure passive à l'iPhone : ICC ≥ 0,82 ; MDC95 jambe tendue 3,3° (même examinateur) et 10,2° (entre examinateurs) ; extension de hanche 3,9° et 9,6°."
 },
 {
  "cle": "werner2014",
  "auteurs": "Werner BC, Holzgrefe RE, Griffin JW et al.",
  "annee": 2014,
  "titre": "Validation of an innovative method of shoulder range-of-motion measurement using a smartphone clinometer application",
  "revue": "J Shoulder Elbow Surg 23(11):e275-282",
  "doi": "10.1016/j.jse.2014.02.030",
  "url": "https://doi.org/10.1016/j.jse.2014.02.030",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "24 sains + 15 opérés : ICC entre examinateurs 0,80 au smartphone (0,69 goniomètre, 0,61 à l'œil) chez les sains ; 0,89 chez les opérés."
 },
 {
  "cle": "kolber2011",
  "auteurs": "Kolber MJ, Vega F, Widmayer K, Cheng MS",
  "annee": 2011,
  "titre": "The reliability and minimal detectable change of shoulder mobility measurements using a digital inclinometer",
  "revue": "Physiother Theory Pract 27(2):176-184",
  "doi": "10.3109/09593985.2010.481011",
  "url": "https://doi.org/10.3109/09593985.2010.481011",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "30 sujets, épaule active à l'inclinomètre : ICC intra 0,83-0,94 ; MDC90 entre examinateurs 8° flexion, 9° rotation externe, 8° rotation interne."
 },
 {
  "cle": "boissy2017",
  "auteurs": "Boissy P, Diop-Fallou S, Lebel K et al.",
  "annee": 2017,
  "titre": "Trueness and Minimal Detectable Change of Smartphone Inclinometer Measurements of Shoulder Range of Motion",
  "revue": "Telemed J E Health 23(6):503-506",
  "doi": "10.1089/tmj.2016.0205",
  "url": "https://doi.org/10.1089/tmj.2016.0205",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "25 sujets vs capture 3D : écart moyen 5,8° en flexion, 8,7° en abduction, 1,7° en rotation externe ; biais moyen 3,4° (IC -8,9 à 15,8°)."
 },
 {
  "cle": "wakefield2015",
  "auteurs": "Wakefield CB, Halls A, Difilippo N, Cottrell GT",
  "annee": 2015,
  "titre": "Reliability of goniometric and trigonometric techniques for measuring hip-extension range of motion using the modified Thomas test",
  "revue": "J Athl Train 50(5):460-466",
  "doi": "10.4085/1062-6050-50.2.05",
  "url": "https://doi.org/10.4085/1062-6050-50.2.05",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "22 adultes, 2 jours : Thomas au goniomètre peu fiable (ICC 0,30-0,65), méthode trigonométrique fiable (0,90-0,95) ; le repérage des points pèse lourd."
 },
 {
  "cle": "balsalobrefernandez2018",
  "auteurs": "Balsalobre-Fernández C, Marchante D, Muñoz-López M, Jiménez SL",
  "annee": 2018,
  "titre": "Validity and reliability of a novel iPhone app for the measurement of barbell velocity and 1RM on the bench-press exercise",
  "revue": "J Sports Sci 36(1):64-70",
  "doi": "10.1080/02640414.2017.1280610",
  "url": "https://doi.org/10.1080/02640414.2017.1280610",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "10 powerlifters, appli PowerLift (ex-My Lift) vs capteur linéaire : r = 0,94, ICC 0,965, léger biais ; 1RM estimé vs réel r = 0,98, écart 5,5 ± 9,6 kg."
 },
 {
  "cle": "balsalobrefernandez2023",
  "auteurs": "Balsalobre-Fernández C, Xu J, Jarvis P, Thompson S, Tannion K, Bishop C",
  "annee": 2023,
  "titre": "Validity of a Smartphone App Using Artificial Intelligence for the Real-Time Measurement of Barbell Velocity in the Bench Press Exercise",
  "revue": "J Strength Cond Res 37(12):e640-e645",
  "doi": "10.1519/jsc.0000000000004593",
  "url": "https://doi.org/10.1519/jsc.0000000000004593",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "27 étudiants, My Jump Lab (IA, iPhone 12 Pro) vs GymAware : r = 0,90-0,92, biais -0,01 à -0,03 m/s ; CV appli 8-14 % proche du capteur (6,5-12 %)."
 },
 {
  "cle": "balsalobrefernandez2019",
  "auteurs": "Balsalobre-Fernández C, Romero-Franco N, Jiménez-Reyes P",
  "annee": 2019,
  "titre": "Concurrent validity and reliability of an iPhone app for the measurement of ankle dorsiflexion and inter-limb asymmetries",
  "revue": "J Sports Sci 37(3):249-253",
  "doi": "10.1080/02640414.2018.1494908",
  "url": "https://doi.org/10.1080/02640414.2018.1494908",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "12 sujets, genou au mur mesuré en angle par l'iPhone vs inclinomètre : r = 0,989, erreur 0,48° ; CV 5,1 % vs 4,9 %."
 },
 {
  "cle": "clemente2021",
  "auteurs": "Clemente FM, Akyildiz Z, Pino-Ortega J, Rico-González M",
  "annee": 2021,
  "titre": "Validity and Reliability of the Inertial Measurement Unit for Barbell Velocity Assessments: A Systematic Review",
  "revue": "Sensors (Basel) 21(7):2511",
  "doi": "10.3390/s21072511",
  "url": "https://doi.org/10.3390/s21072511",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "22 études, 8 modèles de centrales inertielles : 7 valides et fiables pour la vitesse de barre en trajectoire linéaire."
 },
 {
  "cle": "silva2021",
  "auteurs": "Silva R, Rico-González M, Lima R et al.",
  "annee": 2021,
  "titre": "Validity and Reliability of Mobile Applications for Assessing Strength, Power, Velocity, and Change-of-Direction: A Systematic Review",
  "revue": "Sensors (Basel) 21(8):2623",
  "doi": "10.3390/s21082623",
  "url": "https://doi.org/10.3390/s21082623",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "23 études, 11 applis : valides et fiables pour la vitesse de barre, mais biais systématique aux charges lourdes."
 },
 {
  "cle": "wannouch2025",
  "auteurs": "Wannouch YJ, Leahey SR, Ramírez-Campillo R et al.",
  "annee": 2025,
  "titre": "A systematic review using a multi-layered criteria framework for assessing the validity and reliability of velocity monitoring devices in resistance training",
  "revue": "PLoS One 20(9):e0324606",
  "doi": "10.1371/journal.pone.0324606",
  "url": "https://doi.org/10.1371/journal.pone.0324606",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "75 études : seules 5/66 études de validité et 16/56 de fiabilité passent tous les critères ; outils prometteurs : GymAware, Perch, Flex, VmaxPro."
 },
 {
  "cle": "claassen2026",
  "auteurs": "Claassen N, Siegel SD, Sproll M et al.",
  "annee": 2026,
  "titre": "Reliability, Device Agreement and Validity of Load-Velocity Profiles: A Systematic Review with Meta-analysis",
  "revue": "Sports Med Open 12:131",
  "doi": "10.1186/s40798-026-01102-0",
  "url": "https://doi.org/10.1186/s40798-026-01102-0",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "63 études capteurs : validité ICC 0,91-0,92, fiabilité 0,90-0,91, capteurs à câble plus constants que les centrales inertielles ; 38 études 1RM : ICC ≈ 0,90 mais forte hétérogénéité au bas du corps."
 },
 {
  "cle": "greig2023",
  "auteurs": "Greig L, Aspe RR, Hall A, Comfort P, Cooper K, Swinton PA",
  "annee": 2023,
  "titre": "The Predictive Validity of Individualised Load-Velocity Relationships for Predicting 1RM: A Systematic Review and Individual Participant Data Meta-analysis",
  "revue": "Sports Med 53(9):1693-1708",
  "doi": "10.1007/s40279-023-01854-9",
  "url": "https://doi.org/10.1007/s40279-023-01854-9",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "20 études, 434 sujets : erreur d'estimation 9,8 % (IC 7,4-12,2 %) ; surestimation moyenne 4,5 kg (3,7 % du 1RM), quelle que soit la méthode."
 },
 {
  "cle": "lemense2024",
  "auteurs": "LeMense AT, Malone GT, Kinderman MA, Fedewa MV, Winchester LJ",
  "annee": 2024,
  "titre": "Validity of Using the Load-Velocity Relationship to Estimate 1 Repetition Maximum in the Back Squat Exercise: A Systematic Review and Meta-Analysis",
  "revue": "J Strength Cond Res 38(3):612-619",
  "doi": "10.1519/jsc.0000000000004709",
  "url": "https://doi.org/10.1519/jsc.0000000000004709",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "4 études, 71 sujets 17-25 ans : la méthode de vitesse seuil surestime le 1RM au squat (ES 0,53) ; jugée non viable au squat libre."
 },
 {
  "cle": "mirasmoreno2025",
  "auteurs": "Miras-Moreno S, Pérez-Castilla A, Weakley J, Rojas-Ruiz FJ, García-Ramos A",
  "annee": 2025,
  "titre": "Improving the Use of Lifting Velocity to Predict Repetitions to Failure: A Systematic Review",
  "revue": "Int J Sports Physiol Perform 20(3):335-344",
  "doi": "10.1123/ijspp.2024-0337",
  "url": "https://doi.org/10.1123/ijspp.2024-0337",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "6 études : la vitesse prédit bien les reps jusqu'à l'échec au repos, mais la précision chute en fatigue (repos courts), sauf chez les très expérimentés."
 },
 {
  "cle": "reynolds2006",
  "auteurs": "Reynolds JM, Gordon TJ, Robergs RA",
  "annee": 2006,
  "titre": "Prediction of one repetition maximum strength from multiple repetition maximum testing and anthropometry",
  "revue": "J Strength Cond Res 20(3):584-592",
  "doi": "10.1519/r-15304.1",
  "url": "https://doi.org/10.1519/r-15304.1",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "70 sujets : le 5RM prédit le mieux le 1RM (R² 0,97-0,99) ; ne pas dépasser 10 reps dans une équation linéaire ; erreur ≈ 3 kg au développé couché, 16 kg à la presse."
 },
 {
  "cle": "mayhew2008",
  "auteurs": "Mayhew JL, Johnson BD, Lamonte MJ, Lauber D, Kemmler W",
  "annee": 2008,
  "titre": "Accuracy of prediction equations for determining one repetition maximum bench press in women before and after resistance training",
  "revue": "J Strength Cond Res 22(5):1570-1577",
  "doi": "10.1519/jsc.0b013e31817b02ad",
  "url": "https://doi.org/10.1519/jsc.0b013e31817b02ad",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "103 femmes, 12 semaines : les équations sont plus précises sous 10 reps ; la relation reps-force change avec l'entraînement (variation individuelle large)."
 },
 {
  "cle": "nuzzo2024",
  "auteurs": "Nuzzo JL, Pinto MD, Nosaka K, Steele J",
  "annee": 2024,
  "titre": "Maximal Number of Repetitions at Percentages of the One Repetition Maximum: A Meta-Regression and Moderator Analysis of Sex, Age, Training Status, and Exercise",
  "revue": "Sports Med 54(2):303-321",
  "doi": "10.1007/s40279-023-01937-7",
  "url": "https://doi.org/10.1007/s40279-023-01937-7",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "269 études, 7 289 sujets : nombre de reps à un %1RM variable entre individus ; plus de reps à la presse qu'au développé couché ; peu d'effet du sexe, de l'âge, du niveau."
 },
 {
  "cle": "halperin2022",
  "auteurs": "Halperin I, Malleron T, Har-Nir I, Androulakis-Korakakis P, Wolf M, Fisher J, Steele J",
  "annee": 2022,
  "titre": "Accuracy in Predicting Repetitions to Task Failure in Resistance Exercise: A Scoping Review and Exploratory Meta-analysis",
  "revue": "Sports Med 52(2):377-390",
  "doi": "10.1007/s40279-021-01559-x",
  "url": "https://doi.org/10.1007/s40279-021-01559-x",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "12 études, 414 sujets : sous-estimation moyenne de 0,95 rep (IC 0,17-1,73), hétérogénéité énorme ; plus précis près de l'échec, sous 12 reps et en fin de séance ; le niveau d'entraînement ne change rien."
 },
 {
  "cle": "zourdos2016",
  "auteurs": "Zourdos MC, Klemp A, Dolan C et al.",
  "annee": 2016,
  "titre": "Novel Resistance Training-Specific Rating of Perceived Exertion Scale Measuring Repetitions in Reserve",
  "revue": "J Strength Cond Res 30(1):267-275",
  "doi": "10.1519/jsc.0000000000001049",
  "url": "https://doi.org/10.1519/jsc.0000000000001049",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "29 squatteurs : forte relation inverse vitesse moyenne - RPE (r = -0,88 expérimentés, -0,77 novices) ; échelle RPE-RIR pratique pour réguler la charge."
 },
 {
  "cle": "zourdos2021",
  "auteurs": "Zourdos MC, Goldsmith JA, Helms ER et al.",
  "annee": 2021,
  "titre": "Proximity to Failure and Total Repetitions Performed in a Set Influences Accuracy of Intraset Repetitions in Reserve-Based Rating of Perceived Exertion",
  "revue": "J Strength Cond Res 35(Suppl 1):S158-S165",
  "doi": "10.1519/jsc.0000000000002995",
  "url": "https://doi.org/10.1519/jsc.0000000000002995",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "25 hommes entraînés, squat 70 % (16 reps) : erreur 2,1 reps à RIR 1, 3,7 à RIR 3, 5,2 à RIR 5 ; plus de reps = plus d'erreur."
 },
 {
  "cle": "refalo2024",
  "auteurs": "Refalo MC, Remmert JF, Pelland JC et al.",
  "annee": 2024,
  "titre": "Accuracy of Intraset Repetitions-in-Reserve Predictions During the Bench Press Exercise in Resistance-Trained Male and Female Subjects",
  "revue": "J Strength Cond Res 38(3):e78-e85",
  "doi": "10.1519/jsc.0000000000004653",
  "url": "https://doi.org/10.1519/jsc.0000000000004653",
  "type": "observationnelle",
  "niveau": "B",
  "verifie": true,
  "note": "24 entraînés, développé couché 75 % : erreur absolue 0,65 ± 0,78 rep à RIR 1 et 3, légère sous-estimation ; pas d'effet du sexe ni de l'expérience."
 },
 {
  "cle": "mansfield2020",
  "auteurs": "Mansfield SK, Peiffer JJ, Hughes LJ, Scott BR",
  "annee": 2020,
  "titre": "Estimating Repetitions in Reserve for Resistance Exercise: An Analysis of Factors Which Impact on Prediction Accuracy",
  "revue": "J Strength Cond Res (en ligne 2020)",
  "doi": "10.1519/jsc.0000000000003779",
  "url": "https://doi.org/10.1519/jsc.0000000000003779",
  "type": "essai",
  "niveau": "B",
  "verifie": true,
  "note": "20 hommes entraînés : RIR sous-estimé à la 1re série (ES 1,3-2,9), précision meilleure aux séries 2-3 ; connaître la charge ne change rien."
 },
 {
  "cle": "ogura2026",
  "auteurs": "Ogura A, Florio E, Wileman TM, Dennison L, Psarakis M",
  "annee": 2026,
  "titre": "Are we there yet? A systematic review and meta-analysis of the validity and reliability of automated markerless motion capture systems during jumping tasks",
  "revue": "J Sports Sci 44(10):1275-1295",
  "doi": "10.1080/02640414.2025.2589689",
  "url": "https://doi.org/10.1080/02640414.2025.2589689",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "20 études, sauts : erreur (RMSE) sagittale 4,4° genou, 5,3° hanche, 4,9° cheville ; frontale 3,0° hanche, 7,5° cheville ; hauteur de saut biais -2,9 cm ; forte variabilité entre systèmes."
 },
 {
  "cle": "yoma2025",
  "auteurs": "Yoma M, Llurda-Almuzara L, Herrington L, Jones R",
  "annee": 2025,
  "titre": "Reliability and validity of lower extremity and trunk kinematics measured with markerless motion capture during sports-related and functional tasks: A systematic review",
  "revue": "J Sports Sci 43(17):1703-1730",
  "doi": "10.1080/02640414.2025.2518359",
  "url": "https://doi.org/10.1080/02640414.2025.2518359",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "53 études : fiabilité souvent bonne (SEM < 5°, squats et réceptions les meilleurs) mais écarts au marqueur de 0,2 à 28,6° selon tâche, plan et articulation ; pas interchangeable avec le 3D."
 },
 {
  "cle": "aulton2025",
  "auteurs": "Aulton C, Wakili L, Strafford BW, Davids K, Chiu CY",
  "annee": 2025,
  "titre": "The Application of Deep Learning Human Pose Estimation in Sport: A Systematic Review",
  "revue": "Sports Med Open 11:155",
  "doi": "10.1186/s40798-025-00953-3",
  "url": "https://doi.org/10.1186/s40798-025-00953-3",
  "type": "revue-systematique",
  "niveau": "B",
  "verifie": true,
  "note": "371 articles triés : estimation de pose par IA utilisée pour l'analyse de gestes, la reconnaissance d'actions, le coaching ; jeux de données privés, peu reproductible."
 },
 {
  "cle": "chougule2026",
  "auteurs": "Chougule A, Dowsett M, Ekundayomi D et al.",
  "annee": 2026,
  "titre": "Accuracy and Validity of 3D Markerless Motion Capture Compared to Marker-Based Systems for Lower-Limb Biomechanical Assessment: A Systematic Review",
  "revue": "Sensors (Basel) 26(12):3956",
  "doi": "10.3390/s26123956",
  "url": "https://doi.org/10.3390/s26123956",
  "type": "revue-systematique",
  "niveau": "B",
  "verifie": true,
  "note": "Réceptions de saut (dépistage LCA) : validité modérée à haute surtout dans le plan sagittal ; variable selon articulation et tâche ; validation supplémentaire nécessaire."
 },
 {
  "cle": "ortiz2016",
  "auteurs": "Ortiz A, Rosario-Canales M, Rodríguez A et al.",
  "annee": 2016,
  "titre": "Reliability and concurrent validity between two-dimensional and three-dimensional evaluations of knee valgus during drop jumps",
  "revue": "Open Access J Sports Med 7:65-73",
  "doi": "10.2147/oajsm.s100242",
  "url": "https://doi.org/10.2147/oajsm.s100242",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "16 sujets, drop jump 40 cm : mesures 2D fiables (ICC 0,89-0,99) ; ratio d'écart genoux/chevilles bien corrélé au 3D (0,94-0,96) mais angle de projection frontale mal corrélé (ICC 0-0,57)."
 },
 {
  "cle": "ino2024",
  "auteurs": "Ino T, Samukawa M, Ishida T et al.",
  "annee": 2024,
  "titre": "Validity and Reliability of OpenPose-Based Motion Analysis in Measuring Knee Valgus during Drop Vertical Jump Test",
  "revue": "J Sports Sci Med 23(1):515-525",
  "doi": "10.52082/jssm.2024.515",
  "url": "https://doi.org/10.52082/jssm.2024.515",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "21 jeunes, vidéo de face : OpenPose erreur 2,4° sur le valgus vs 3D (kiné 3,2°), r = 0,97 ; conditions de labo, saut sans charge."
 },
 {
  "cle": "erdman2024",
  "auteurs": "Erdman A, Loewen A, Dressing M et al.",
  "annee": 2024,
  "titre": "A 2D video-based assessment is associated with 3D biomechanical contributors to dynamic knee valgus in the coronal plane",
  "revue": "Front Sports Act Living 6:1352286",
  "doi": "10.3389/fspor.2024.1352286",
  "url": "https://doi.org/10.3389/fspor.2024.1352286",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "41 volleyeuses : critère visuel « genou à l'intérieur du bord interne de la chaussure » le plus lié au 3D (AUC 0,67-0,93) ; angles réels de valgus petits (2,4-4,6°)."
 },
 {
  "cle": "oliosi2026",
  "auteurs": "Oliosi E, Ferreira S, Giordano AP et al.",
  "annee": 2026,
  "titre": "Evaluation of Smartphone Camera Positioning on Artificial Intelligence Pose Estimation Accuracy for Exercise Detection: Observational Study",
  "revue": "JMIR Mhealth Uhealth 14:e82412",
  "doi": "10.2196/82412",
  "url": "https://doi.org/10.2196/82412",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "44 étudiants, ~2 640 reps : détection moyenne 61 %, erreur de comptage ≈ 1,1 rep ; squat au mieux en diagonale à 2 m (95,5 %, erreur 0,05 rep), au pire de profil à 90 cm (0 %)."
 },
 {
  "cle": "hellsten2025",
  "auteurs": "Hellstén T, Arokoski J, Karlsson J, Ristolainen L, Kettunen J",
  "annee": 2025,
  "titre": "Reliability and validity of computer vision-based markerless human pose estimation for measuring hip and knee range of motion",
  "revue": "Healthc Technol Lett 12(1):e70002",
  "doi": "10.1049/htl2.70002",
  "url": "https://doi.org/10.1049/htl2.70002",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "30 jeunes : appli de vision par ordinateur, ICC 0,93 rotation interne de hanche active, 0,74-0,83 autres amplitudes ; validé contre une image de référence, pas contre la 3D."
 },
 {
  "cle": "bae2024",
  "auteurs": "Bae K, Lee S, Bak SY et al.",
  "annee": 2024,
  "titre": "Concurrent validity and test reliability of the deep learning markerless motion capture system during the overhead squat",
  "revue": "Sci Rep 14:29462",
  "doi": "10.1038/s41598-024-79707-2",
  "url": "https://doi.org/10.1038/s41598-024-79707-2",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "Système 3D sans marqueur (multi-caméras) au squat bras levés : R² 0,88-0,99 vs marqueurs, angles max ICC 0,75-1,0, test-retest 0,92-0,99 ; développé par les auteurs."
 },
 {
  "cle": "oberhofer2021",
  "auteurs": "Oberhofer K, Erni R, Sayers M et al.",
  "annee": 2021,
  "titre": "Validation of a Smartwatch-Based Workout Analysis Application in Exercise Recognition, Repetition Count and Prediction of 1RM in the Strength Training-Specific Setting",
  "revue": "Sports (Basel) 9(9):118",
  "doi": "10.3390/sports9090118",
  "url": "https://doi.org/10.3390/sports9090118",
  "type": "observationnelle",
  "niveau": "C",
  "verifie": true,
  "note": "30 sportifs, Apple Watch : exercice reconnu dans 88 % des séries ; comptage correct au squat et soulevé de terre, mauvais au développé couché ; 1RM estimé réussi dans 9 % des essais seulement."
 },
 {
  "cle": "moran2017b",
  "auteurs": "Moran RW, Schneiders AG, Mason J, Sullivan SJ",
  "annee": 2017,
  "titre": "Do Functional Movement Screen (FMS) composite scores predict subsequent injury? A systematic review with meta-analysis",
  "revue": "Br J Sports Med 51(23):1661-1669",
  "doi": "10.1136/bjsports-2016-096938",
  "url": "https://doi.org/10.1136/bjsports-2016-096938",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "24 cohortes : lien faible FMS ≤ 14 - blessure (RR 1,47 chez des militaires), déconseillé en football ; ne soutient pas l'usage du FMS pour prédire la blessure."
 },
 {
  "cle": "cuchna2016",
  "auteurs": "Cuchna JW, Hoch MC, Hoch JM",
  "annee": 2016,
  "titre": "The interrater and intrarater reliability of the functional movement screen: A systematic review with meta-analysis",
  "revue": "Phys Ther Sport 19:57-65",
  "doi": "10.1016/j.ptsp.2015.12.002",
  "url": "https://doi.org/10.1016/j.ptsp.2015.12.002",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "7 articles : fiabilité inter-évaluateur du score FMS total ICC 0,84 (IC 0,64-0,94), preuve modérée."
 },
 {
  "cle": "doherty2024",
  "auteurs": "Doherty C, Baldwin M, Keogh A, Caulfield B, Argent R",
  "annee": 2024,
  "titre": "Keeping Pace with Wearables: A Living Umbrella Review of Systematic Reviews Evaluating the Accuracy of Consumer Wearable Technologies in Health Measurement",
  "revue": "Sports Med 54(11):2907-2926",
  "doi": "10.1007/s40279-024-02077-2",
  "url": "https://doi.org/10.1007/s40279-024-02077-2",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "Revue parapluie de 24 revues (249 études) : FC biais ±3 % ; VO2max surestimée de ±15 % (au repos) et ±10 % (à l'effort) ; dépense énergétique erreur -21 à +15 % ; sommeil total surestimé (> 10 %) ; seuls ~11 % des appareils validés."
 },
 {
  "cle": "zhang2020",
  "auteurs": "Zhang Y, Weaver RG, Armstrong B, Burkart S, Zhang S, Beets MW",
  "annee": 2020,
  "titre": "Validity of Wrist-Worn photoplethysmography devices to measure heart rate: A systematic review and meta-analysis",
  "revue": "J Sports Sci 38(17):2021-2034",
  "doi": "10.1080/02640414.2020.1767348",
  "url": "https://doi.org/10.1080/02640414.2020.1767348",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "44 articles, 15 marques : écart ≈ 0 bpm au repos et -0,5 bpm sur tapis, mais -7,3 bpm en musculation et -4,6 bpm à vélo ; l'erreur en musculation grandit de 3 bpm par 10 bpm de FC."
 },
 {
  "cle": "fuller2020",
  "auteurs": "Fuller D, Colwell E, Low J et al.",
  "annee": 2020,
  "titre": "Reliability and Validity of Commercially Available Wearable Devices for Measuring Steps, Energy Expenditure, and Heart Rate: Systematic Review",
  "revue": "JMIR Mhealth Uhealth 8(9):e18694",
  "doi": "10.2196/18694",
  "url": "https://doi.org/10.2196/18694",
  "type": "revue-systematique",
  "niveau": "A",
  "verifie": true,
  "note": "158 publications, 9 marques : pas et FC corrects en labo (Apple Watch et Garmin les plus justes en FC) ; aucune marque n'est juste pour la dépense énergétique."
 },
 {
  "cle": "molinagarcia2022",
  "auteurs": "Molina-Garcia P, Notbohm HL, Schumann M et al.",
  "annee": 2022,
  "titre": "Validity of Estimating the Maximal Oxygen Consumption by Consumer Wearables: A Systematic Review with Meta-analysis and Expert Statement of the INTERLIVE Network",
  "revue": "Sports Med 52(7):1577-1597",
  "doi": "10.1007/s40279-021-01639-y",
  "url": "https://doi.org/10.1007/s40279-021-01639-y",
  "type": "consensus",
  "niveau": "A",
  "verifie": true,
  "note": "14 études : algorithmes à l'effort, biais -0,09 mais limites d'accord -9,9 à +9,7 ml/kg/min ; au repos, biais +2,2 et limites -13 à +17 ; bon au niveau d'un groupe, erreur individuelle grande."
 },
 {
  "cle": "lee2025",
  "auteurs": "Lee YJ, Lee JY, Cho JH, Kang YJ, Choi JH",
  "annee": 2025,
  "titre": "Performance of consumer wrist-worn sleep tracking devices compared to polysomnography: a meta-analysis",
  "revue": "J Clin Sleep Med 21(3):573-582",
  "doi": "10.5664/jcsm.11460",
  "url": "https://doi.org/10.5664/jcsm.11460",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "24 études, 798 sujets : écarts significatifs avec la polysomnographie (temps de sommeil ≈ 17 min, efficacité ≈ 4,7 points, éveils ≈ 13 min) ; utile pour les tendances, pas pour une mesure exacte."
 },
 {
  "cle": "dobbs2019",
  "auteurs": "Dobbs WC, Fedewa MV, MacDonald HV et al.",
  "annee": 2019,
  "titre": "The Accuracy of Acquiring Heart Rate Variability from Portable Devices: A Systematic Review and Meta-Analysis",
  "revue": "Sports Med 49(3):417-435",
  "doi": "10.1007/s40279-019-01061-5",
  "url": "https://doi.org/10.1007/s40279-019-01061-5",
  "type": "meta-analyse",
  "niveau": "A",
  "verifie": true,
  "note": "23 études, 301 effets : la VFC des appareils portables diffère peu de l'ECG (ES 0,23), très hétérogène ; erreur jugée acceptable vu le gain pratique."
 }
]
```
