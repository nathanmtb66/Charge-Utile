# Revue contradictoire — science A à D

*Relecture du 1er octobre 2026. Fichiers relus : `recherche/science/A-force-endurance.md`, `B-plio-tendons-prevention.md`, `C-mobilite-respiration.md`, `D-recuperation-charge.md`. Méthode : résumés rouverts un par un via l'API Europe PMC (recherche par DOI), comparés à la notice de `recherche/sources.json` et aux chiffres repris dans les fichiers science. Rien n'a été modifié dans les fichiers relus.*

## 1. Échantillon aléatoire (graine 42, 4 clés par domaine)

Tirage : `random.seed(42)` puis `random.sample(sorted(clés citées), 4)` pour A, B, C, D dans cet ordre.

| Domaine | Clé | Verdict | Détail |
|---|---|---|---|
| A | `eihara2022` | exact | Article, auteurs, revue, DOI conformes. Chiffres conformes (g −0,32 vs −0,13 ; ≥ 90 % 1RM −0,31 ; 10-14 sem −0,45 vs 6-8 sem −0,21 ; 22 études). Non repris par A : la plyo seule a un effet **significatif** sur le chrono (g −0,17 [−0,27 ; −0,06]) dans cette même méta-analyse, ce qui nuance le mythe 6 de A (voir problème 14). |
| A | `beattie2017a` | exact | Conforme. À savoir : groupe muscu n = 6, âge 38 ± 10 ans (cyclistes vétérans, pas 18-25 ans). Le résumé dit bien « body mass » modifiée sans donner le sens, comme A le signale honnêtement. |
| A | `losnegard2011` | exact | Conforme (1RM +19 % / +12 %, CSA quadriceps inchangée). Le résumé rapporte aussi VO2max en skating **+7 %** dans le groupe muscu : c'est un contre-exemple au « la muscu n'améliore pas la VO2max — Faux » du mythe 3 (voir problème 15). |
| A | `liao2021` | exact | Conforme (6 études, 124 sujets, 1RM +3,03 kg NS, saut SMD 0,27 NS). |
| B | `buchalski2026` | exact | Conforme (8 essais, 257 sujets, 246 hommes ; section du tendon 3 essais sur 4). B est même plus prudent que les auteurs (qui écrivent « GRADE A »). Type : revue systématique narrative, juste. |
| B | `bishop2018` | exact | Conforme (18 articles, associations seulement, aucun essai randomisé). |
| B | `ramirezcampillo2021b` | exact | Conforme (21 études, 511 coureurs, ES 0,88, VO2max inchangé). Le résumé précise aussi « pas de gain de force maximale ». |
| B | `battista2021` | exact | Conforme (1 274 cyclistes, 26,5 % sur 12 mois, OR 0,53 et 4,2). Enquête en ligne, transversale. |
| C | `boullosa2020` | exact | Commentaire de taxonomie, conforme. Ne porte aucun chiffre : la « demi-vie ~28 s » vient de `blazevich2019` seul. |
| C | `vangsoe2020` | exact | Conforme (12 cyclistes, 76,9 vs 77,3 s). Population : sprinteurs (puissance pic 1 141 W), effort de 1 km. |
| C | `barnes2021` | approximatif | Notice exacte (17 coureurs, 30 inspirations à 50 %, +2,8 %, ES 0,37). Mais la règle 24 de C écrit « 2 × 30 inspirations à 40-50 % » en fusionnant deux essais : Barnes (résultat positif, course) a fait **1 × 30 à 50 %** ; le « 2 × 30 à 40 % » est le protocole de `johnson2014`, **sans effet** en vélo. La règle prête au protocole positif une dose qui n'est pas la sienne. |
| C | `balban2023` | exact | Conforme (essai à distance, 5 min/jour, 1 mois, soupir cyclique > méditation, p < 0,05). Le résumé décrit l'hyperventilation cyclique avec « inspirations plus longues, expirations plus courtes » : le paramétrage 1,5 s / 1,5 s du protocole 8 ne le reflète pas (mineur). |
| D | `brown2017` | exact | Conforme (23 études ; force à 2-8 h et > 24 h ; vélo du lendemain). « Petits bénéfices » = effet global (ES 0,38) ; pour la force l'effet est en réalité grand (ES 1,03-1,14). |
| D | `duignan2020` | exact | Conforme (21 études, liens triviaux à modérés). Population : **sports collectifs adultes** uniquement. |
| D | `duking2021` | exact | Conforme (8 études, 198 participants ; g 0,296 sous-max ; 0,079 perf NS ; 0,171 VO2pic NS ; moins de non-répondeurs). |
| D | `koivistomork2021` | exact | Conforme (107 stages, +3,7 %, maladie −5,7 %, ni ferritine ni fer). Population : athlètes de niveau mondial, réserves de fer normales. |

**Bilan de l'échantillon : 15 exactes, 1 approximative, 0 fausse, 0 introuvable.** Les 16 articles existent, avec auteurs, année, revue et DOI exacts. Aucune référence inventée. Les problèmes sont ailleurs : dans ce que les fichiers font dire aux sources (voir section 3).

## 2. Affirmations lourdes pour le produit (résumés rouverts)

| # | Affirmation | Source(s) rouvertes | Verdict | Détail |
|---|---|---|---|---|
| 1 | Interférence : force max et hypertrophie non freinées, explosif −0,28 | `schumann2022` | chiffres exacts, lecture incomplète | SMD −0,06 / −0,28 / −0,01, 43 études : conforme. Mais le résumé dit aussi que le résultat est **indépendant du type d'endurance (vélo vs course), de la fréquence et du niveau d'entraînement**. A ne le dit pas et affirme l'inverse avec `wilson2012` et `petre2021` (problème 3). |
| 2 | Interférence chez les entraînés ES −0,35 ; même séance −0,66 vs −0,10 | `petre2021` | exact | Conforme (27 études ; p < 0,01 ; modérés −0,20 p = 0,08 ; non entraînés 0,03). L'effet n'apparaît « que » en même séance. |
| 3 | Délai 6 h, idéalement 24 h | `robineau2016` | chiffres exacts, preuve surévaluée | 58 rugbymen amateurs, 7 semaines, 4-5 groupes (≈ 12 par groupe), inférence « magnitude-based », muscu **toujours avant** l'aérobie. Un seul essai. Classé B dans A (problème 2). |
| 4 | 1 séance/sem maintient la force en saison | `ronnestad2010b`, `spiering2021` | chiffres exacts, preuve surévaluée | Rønnestad : **6 cyclistes** dans le groupe muscu, essai contrôlé non randomisé. Spiering : revue narrative en population générale, qui écrit que les données sont **insuffisantes pour des recommandations aux athlètes**. Classé B (problème 4). |
| 5 | Arrêt de la muscu = pertes en 8 semaines | `ronnestad2016` | exact, preuve surévaluée | 7 cyclistes élites par groupe (VO2max 77), ES 0,49-0,84 : conforme. Un seul essai de 14 sujets, classé B. |
| 6 | Pas besoin d'échec | `robinson2024` | approximatif | Pentes conformes. Mais le RIR est **estimé a posteriori**, l'analyse est dite **exploratoire** par les auteurs, qui appellent à la prudence. La « cible RIR 2-3 » n'est pas dans la source. Classé A (problème 6). |
| 7 | Muscu et blessures RR 0,315 | `lauersen2014`, `lauersen2018` | chiffres exacts, généralisation abusive | RR 0,315 [0,207-0,480] et 0,338 [0,238-0,480] conformes. Mais 2018 : 6 essais, 5 interventions, **177 blessures** au total, participants de 12 à 40 ans ; « +10 % de volume = −4 points » est une méta-régression post-hoc. Rien sur des athlètes d'endurance ; « force lourde » n'apparaît dans aucun des deux résumés (problème 1). |
| 8 | Bain froid et force SMD −0,60 | `malta2021`, `grgic2023`, `pinero2024` | exact (Malta, Grgic) ; Piñero non revérifiable | Malta : −0,60 [−0,87 ; −0,33] conforme ; les « 8 études » sont le total de la revue (force **et** endurance), pas 8 études de force. Grgic : −0,23 [−0,45 ; −0,01], p = 0,041, 92 % d'hommes : conforme. Piñero : la notice Europe PMC n'a ni résumé, ni PMID, ni DOI ; volume « 24(2) » et non « 24 » ; chiffre non revérifié ici (D dit avoir lu le texte intégral). |
| 9 | Sommeil −7,56 % | `craven2022`, `walsh2021` | chiffre exact, affirmation trop forte | −7,56 % [−11,9 ; −3,13], 69 publications, I² 98,1 %, 89 % d'hommes : conforme. Mais la moyenne **mélange nuits blanches et nuits courtes**, et l'effet n'est constant que pour la privation totale et le réveil avancé. Le consensus `walsh2021`, cité par D, écrit que l'effet d'une restriction partielle sur 1-3 nuits « reste peu clair » (problème 5). |
| 10 | sRPE valide « pour tous les types de séance » | `foster2001`, `haddad2017` | approximatif | Foster : vélo continu, vélo fractionné, basket, contre la FC. **Aucune séance de musculation.** Haddad : revue **narrative** (notée niveau A dans `sources.json`), 36 études, sans détail muscu dans le résumé (problème 7). |
| 11 | VFC guidée ≈ plan fixe | `duking2021`, `manresarocamora2021` | exact | g 0,296 / 0,079 / 0,171 et SMD 0,50 / 0,20 / 0,26 / 0,20 conformes. Bien lu, bien nuancé. |
| 12 | Densité osseuse des cyclistes | `olmedillas2012`, `hilkens2023`, `hilkens2024`, `zamboni2024` | chiffres exacts, lecture sélective | Tous les chiffres sont conformes. Mais Olmedillas écrit que le VTT « pourrait réduire » l'effet défavorable ; B le cite à l'appui de « y compris en VTT » (problème 8). Hilkens 2024 : 28 femmes et 8 hommes, élite, essai ouvert, effet au col du fémur seulement. |
| 13 | Isométrie et douleur du tendon | `rio2015`, `holden2020`, `vandervlist2020`, `bonello2021` | exact | 7,0 → 0,17 (n = 6) ; −0,9 (n = 21), non tenu à 45 min ; aucun effet (n = 91) ; 13 études, 346 personnes. Section la mieux tenue des quatre fichiers. |
| 14 | Respiration 6/min | `laborde2022`, `kasap2025`, `bilo2012` | approximatif | Laborde : 223 études, VFC vagale en hausse : conforme. Mais le résumé parle de « respiration lente volontaire », **sans le chiffre 6/min**, et ne mesure ni récupération ni performance. Kasap : mal lu (problème 9). Bilo : exact. |
| 15 | Étirement ≥ 60 s | `behm2016`, `warneke2024` | chiffres exacts, lecture sélective | −3,7 % / −4,4 % / +1,3 % ; −4,6 % vs −1,1 % ; ES −0,21 et −0,84 : conformes. Mais Behm conclut que l'étirement dans l'échauffement est « recommandé pour réduire les blessures musculaires » : C et `sources.json` ne le reprennent pas (problème 10). |

Autres résumés rouverts sans écart : `wilson2012`, `palmer2001`, `wu2024`, `chapman2014` (chiffres), `saw2016`, `karsten2018`, `johnson2014`, `ronnestad2010a`, `llanoslagos2026`, `held2026`, `impellizzeri2020`, `impellizzeri2021`, `wang2023`, `halperin2022`, `hays2021`, `zanini2025`, `illi2012`, `christensen2015`, `gao2019`, `mah2011`.

**Bilan global (16 de l'échantillon + 50 autres, 66 sources rouvertes) : 65 existent avec métadonnées exactes, 1 non revérifiable (`pinero2024`), 0 inventée. Aucun chiffre faux relevé dans les notices. 11 affirmations des fichiers science dépassent ou déforment ce que dit la source.**

## 3. Problèmes, par gravité

Gravité : **bloquant** = à corriger avant que la phrase serve dans l'appli ou dans un argument de vente ; **important** = niveau de preuve ou règle à reformuler ; **mineur** = précision.

### Bloquants

**1. « La muscu prévient les blessures » : généralisation abusive et contradiction entre A, B et D.**
- Où : A, tableau (« La muscu (force lourde) réduit fortement le risque de blessure sportive », A), mythe 8, règle 23 (« Vends la muscu aussi comme prévention des blessures — A »), contenu pédagogique « la muscu prévient les blessures ». B, tableau (« Argument central du produit : la régularité compte »), règle 21. C, « En 1 minute » et règle 6.
- Preuve : `lauersen2018` = 6 essais, 5 interventions, 177 blessures, 12-40 ans ; aucun des deux résumés ne parle de « force lourde » ni d'athlètes d'endurance. `wu2024` (cité par B) : 9 essais, 1 904 coureurs, **aucun effet** des programmes d'exercices sur les blessures (p = 0,110), sauf analyse post-hoc des programmes supervisés. D, « À ne pas faire » : « Pas de promesse du type "évite les blessures" dans la communication : non démontré ». Les trois fichiers se contredisent.
- Correction A, tableau : « Dans les sports collectifs et chez les militaires, les programmes de renforcement réduisent les blessures ; chez les coureurs d'endurance, l'effet n'est pas démontré | A (sports collectifs) ; C (endurance) | RR 0,315 et 0,338 (6 essais, 177 blessures) ; coureurs : pas d'effet, sauf programmes supervisés | [@lauersen2014] [@lauersen2018] [@wu2024] | Ne pas vendre la muscu comme une protection contre les blessures ; dire "mieux que les étirements, non prouvé en endurance" ».
- Correction A, règle 23 : « Ne promets pas moins de blessures grâce à la muscu : c'est montré dans les sports collectifs, pas chez les endurants. Dis seulement qu'elle protège mieux que les étirements. — A (sports collectifs), C (endurance) [@lauersen2014] [@lauersen2018] [@wu2024] ».
- Correction B, tableau : remplacer « Argument central du produit : la régularité compte » par « Argument à manier avec prudence : résultat de sports collectifs, méta-régression post-hoc ».
- Supprimer dans A le contenu pédagogique « la muscu prévient les blessures ».

**2. Garde-fou « 6 h » codé en dur sur un seul essai de rugbymen.**
- Où : A, « En 1 minute », tableau (B), règle 10 (B), « Ce que l'appli devrait faire » (alerte calendrier < 6 h).
- Preuve : `robineau2016` = un essai, 58 rugbymen amateurs, 7 semaines, muscu toujours avant l'aérobie. Il mesure les **gains de force**, pas la qualité de la séance d'endurance. `schumann2022` ne soutient qu'un écart ≥ 3 h, et seulement pour l'explosif. `petre2021` compare « même séance » et « séances différentes », sans heures. A reconnaît la limite en fin de fichier mais garde B et l'alerte.
- Correction, tableau et règle 10 : « Sépare muscu jambes et endurance quand c'est possible : au moins 3 h, mieux 6 h ou plus. Repère issu d'un seul essai chez des rugbymen ; à ajuster selon le ressenti. — C [@robineau2016] [@schumann2022] [@petre2021] ».
- Correction appli : « Signaler (information, pas alerte) quand la muscu jambes et une séance clé sont dans la même demi-journée. Seuil réglable par le coach, 6 h par défaut, niveau C. »

**3. « La course interfère plus que le vélo » et « plus l'athlète est fort, plus il faut séparer » : contredits par la méta-analyse que A cite en premier.**
- Où : A, tableau (lignes `wilson2012` B, `petre2021` A), règle 15 (B), dernier point de « À ne pas faire ».
- Preuve : `schumann2022`, résumé : résultats « indépendants du type d'entraînement aérobie, de la fréquence, du niveau d'entraînement et de l'âge ». `wilson2012` (21 études, 2012) et `petre2021` disent l'inverse. A ne signale pas le désaccord.
- Correction, ligne Wilson : « L'interférence dépend peut-être du type et du volume d'endurance : résultats contradictoires | C | Wilson 2012 : course mais pas vélo ; Schumann 2022 : aucun effet du type, de la fréquence ni du niveau | [@wilson2012] [@schumann2022] [@lundberg2022] | Ne pas en faire une règle différente pour traileurs et cyclistes ».
- Correction, règle 15 : « Traileurs : par prudence, séparer muscu jambes et course ; l'idée que la course interfère plus que le vélo est contestée. — C [@wilson2012] [@lundberg2022] [@schumann2022] ».
- Correction, ligne Petré : passer de A à B et ajouter « Schumann 2022 ne retrouve pas d'effet du niveau ».

**4. Maintien « 1 séance par semaine » : preuve B pour un essai de 6 cyclistes.**
- Où : A, « En 1 minute », tableau (deux lignes B), mythe 7 (B), règle 4 (B), mode « maintien » automatique de l'appli.
- Preuve : `ronnestad2010b` : n = 6 dans le groupe muscu, non randomisé. `spiering2021` : revue narrative, population générale, « insufficient data exists to make specific recommendations for athletes ». `ronnestad2016` : 7 par groupe.
- Correction, tableau : « 1 séance/sem semble suffire à maintenir force et section musculaire en saison | C | 6 cyclistes, 12 sem à 2×/sem puis 13 sem à 1×/sem ; population générale : jusqu'à 32 sem | [@ronnestad2010b] [@spiering2021] | Mode "maintien" 1×/sem par défaut, à vérifier par un test de force en cours de saison ».
- Correction, règle 4 : même texte, « — C ». Mythe 7 : « Preuve C ». Ligne « Arrêter la muscu… » : C.
- Correction appli : « Alerter si aucune séance de muscu depuis > 3 semaines » → préciser « (seuil proposé ; l'étude porte sur 8 semaines d'arrêt) ».

**5. « Une nuit ≤ 6 h coûte −7,6 % » : moyenne de nuits blanches présentée comme l'effet d'une nuit courte.**
- Où : D, « En 1 minute », tableau lignes 13-14 (A), mythe 6, règle 10 (A), règle de score « Sommeil < 6 h → au mieux orange ».
- Preuve : `craven2022` regroupe privation totale et restriction ; effets constants seulement pour privation et réveil avancé ; I² 98 %. `walsh2021` : effet d'une restriction partielle sur 1-3 nuits « remains unclear ».
- Correction, « En 1 minute » : « Le manque de sommeil réduit la performance : −7,6 % en moyenne dans les études, qui vont de la nuit courte à la nuit blanche. Pour une seule nuit un peu courte, l'effet est mal connu. Il touche surtout l'après-midi et le soir. »
- Correction, ligne 13 : « Le manque de sommeil aigu (de la nuit courte à la nuit blanche) réduit la performance | A pour la nuit blanche et le réveil avancé ; C pour une nuit simplement courte ».
- Correction, mythe 6 : remplacer « En moyenne −7,6 % » par « En moyenne −7,6 % toutes privations confondues ; l'effet d'une seule nuit courte reste mal connu [@walsh2021] ».
- Correction, règle 10 : « (B) ». Règle de score : garder, mais libellé « nuit courte : séance à adapter si tu te sens moins bien », et paramètre réglable.

**6. Vocabulaire médical et conseils de soin (contraire aux consignes).**
- B, tableau : « aucun traitement actif ne domine », « tout traitement actif fait mieux que l'attente », « Syndrome de la bandelette : … le traitement le plus étudié », « douleur −27 à −100 % », « patients » (4 fois), « sans promettre de guérison ». Correction : remplacer « traitement » par « approche », « patients » par « personnes », « Syndrome de la bandelette » par « gêne sur le côté du genou chez le coureur », et ajouter à chaque ligne « relève du kiné ».
- B, règle 24 : « Bandelette : renforcer les abducteurs de hanche (preuve faible). » C'est une étiquette de diagnostic suivie d'un soin, sans renvoi. Correction : « Gêne sur le côté du genou : orienter vers un kiné ; le renforcement des abducteurs de hanche est une piste que le kiné peut valider. **C** ».
- B, règle 23 : « Douleur à l'avant du genou : exercices genou + hanche et éducation, toujours avec un kiné » → « Douleur à l'avant du genou : orienter vers un kiné. Le coach ne prescrit rien de spécifique. »
- C, tableau et règle 20 : « lombalgie du VTTiste », « lombalgiques », « VTTiste qui a mal au dos : travailler l'endurance des extenseurs ». Correction, règle 20 : « VTTiste gêné au dos : parles-en à un kiné et fais vérifier la position sur le vélo. En prévention, le gainage et l'endurance du dos passent avant les étirements. **(C)** ».
- A, règle 19 et tableau : isométrie « en saison ou en cas de gêne ». Contredit B (« Pas de protocole antidouleur isométrique »). Correction : supprimer « ou en cas de gêne » aux deux endroits.
- D, tableau ligne 38 et « Chiffres clés » : « 105 mg/j +3,3 %, 210 mg/j +4,0 % ». Des doses de fer figurent dans un document dont la règle est « aucune dose ». Correction : « le gain d'hémoglobine est plus faible sans apport de fer chez certains athlètes ; doses et indication : médecin uniquement » et retirer les mg.
- D, annexe : « seuils de ferritine < 30 ng/mL (femmes) et < 40 ng/mL (hommes) » : à retirer du fichier destiné au coach, ou marquer « information médicale, ne pas reprendre ».
- D, tableau ligne 29 et mythe 10 : « diagnostic d'exclusion fait par un médecin » : acceptable (renvoi au médecin), à garder.
- C, protocole 6 : « descendre en cas de mal des montagnes » : conseil médical. Correction : « en cas de maux de tête ou de malaise en altitude, arrêter et prévenir un adulte responsable ou un médecin ».

**7. Protocoles de respiration à risque proposés dans l'appli à des 18-25 ans.**
- Où : C, protocole 8 (hyperventilation cyclique avec rétention), règle 28, règle 29 (hypoventilation VHL « sous supervision du coach »).
- Preuve : C écrit lui-même « aucun gain de perf », SpO2 60 ± 12 % en apnée (`citherlet2021`), noyades (`boyd2015`), contre-indications « non sourcées ». Un protocole sans bénéfice, avec risque de syncope, n'a pas de raison d'être dans un onglet Récup. La VHL fait descendre la SpO2 vers 90 % à l'effort ; le coach est en L3 STAPS, pas un cadre médical.
- Correction : retirer le protocole 8 du tableau et du JSON ; le déplacer dans « À ne PAS faire » : « Ne pas proposer d'hyperventilation avec apnée dans l'appli : aucun gain de performance, risque de malaise ». Règle 29 : « Hypoventilation volontaire : hors appli ; à réserver à un encadrement formé, après avis médical. **(C)** ». Renommer la section « Les 7 protocoles ».
- `boyd2015` est une série de 16 cas classée « A » : un avertissement de sécurité n'a pas besoin d'une lettre de preuve ; écrire « sécurité » à la place de « A ».

### Importants

**8. Os du vététiste : la revue citée dit plutôt le contraire.**
- Où : B, « En 1 minute », mythe 8 (« y compris en VTT [@olmedillas2012] [@abrahin2016] [@zamboni2024] »), tableau (« Bloc "os" obligatoire », A), règle 27 (« doit », B).
- Preuve : `olmedillas2012` : le VTT « could reduce this unsafe effect ». Seul `zamboni2024` (30 vététistes hommes, transversal, col du fémur sans différence) va dans l'autre sens. Les données sont transversales, donc pas « A ». `hilkens2024` : un essai ouvert, 28 femmes sur 36, élite, sauts + collagène.
- Correction, mythe 8 : « Faux pour la route : pas de gain, DMO lombaire souvent basse [@olmedillas2012] [@abrahin2016]. Pour le VTT, c'est discuté : la revue de 2012 le juge moins défavorable, une étude de 2024 trouve la même DMO lombaire basse [@zamboni2024]. »
- Correction, tableau : « A (revues systématiques) » → « B (revues d'études transversales) » ; « Bloc "os" obligatoire » → « Bloc "os" proposé par défaut ».
- Correction, règle 27 : « Proposer à tout cycliste qui ne fait que du vélo des sauts courts, plusieurs fois par semaine ; l'intérêt est moins établi pour le vététiste. **C** ». Règle 28 : **C**.

**9. Respiration 6/min après l'effort : l'essai est mal lu.**
- Où : C, « En 1 minute », tableau (« fait baisser la FC plus vite », B), mythe 10, règle 25 (B), protocole 1 (« B (récup post-HIIT) »), choix par défaut de l'appli.
- Preuve : `kasap2025` : temps de retour à la FC de base **non différent** (p = 0,128). Le 6/min ne fait pas mieux que la respiration **spontanée** (Borg 15,25 dans les deux cas ; FC 154,8 vs 159,1, non rapporté comme significatif). C'est la respiration carrée qui fait pire. Un seul essai, 40 étudiants. `laborde2022` ne mesure que la VFC.
- Correction, tableau : « Après un HIIT, la respiration carrée 4-4-4-4 donne une FC et un effort perçu plus hauts que le 6/min ou la respiration libre ; le 6/min ne récupère pas plus vite que la respiration libre | C | FC 164,7 (carrée) vs 154,8 (6/min) vs 159,1 (libre) ; temps de retour au calme NS (p = 0,128) ; n = 40 | [@kasap2025] | Après une séance dure : pas de respiration carrée ; le 6/min est une option de confort, pas un accélérateur ».
- Correction, « En 1 minute » : « Après HIIT, éviter la respiration carrée (Kasap 2025) ; le 6/min n'est pas meilleur que respirer librement. » Règle 25 et protocole 1 : « C ». But du protocole 1 : retirer « récupérer ».
- `laborde2022` : écrire « respiration lente (< 10/min, souvent ~6/min) » ; le chiffre 6/min n'est pas dans le résumé.

**10. « Étirer ne prévient pas les blessures » : trop absolu, la source dit autre chose.**
- Où : C, « En 1 minute », mythe 2 (« Faux »), règle 6 (« Ne jamais présenter… », A) ; note de `behm2016` dans `sources.json`.
- Preuve : `behm2016`, conclusion : étirement dans l'échauffement « recommended for reducing muscle injuries », tout en notant l'absence d'effet clair sur les blessures toutes causes et de surmenage.
- Correction, mythe 2 : « Surtout faux. Aucun effet sur l'ensemble des blessures (RR 0,96) [@lauersen2014]. Un effet sur les seules blessures musculaires en sprint reste discuté [@behm2016]. »
- Correction, règle 6 : « Ne pas présenter l'étirement comme la prévention des blessures ; le renforcement et la proprio ont de meilleures preuves. **(A)** ».
- Correction `sources.json`, note de `behm2016` : ajouter « ; les auteurs recommandent quand même l'étirement dans l'échauffement pour les blessures musculaires ».

**11. sRPE pour la musculation : validité non établie par les sources citées, et envoi vers intervals.icu contradictoire.**
- Où : D, « En 1 minute » (« valide pour tous les types de séance »), tableau ligne 19 (A), règle 14 (A), « À faire » point 4 ; règle 15.
- Preuve : `foster2001` : vélo et basket seulement. `haddad2017` : revue narrative. Aucune source ouverte sur le sRPE en muscu, où les temps de repos gonflent les minutes. La règle 15 dit de ne pas additionner sRPE et TSS, mais le point 4 envoie la charge sRPE dans intervals.icu, où elle s'additionne à la charge d'endurance.
- Correction, ligne 19 : « Le sRPE est une mesure valide de la charge en endurance et en sports collectifs ; pour la muscu, aucune source ouverte ici | A (endurance, sports collectifs) ; C (muscu) ».
- Correction, point 4 : « charge sRPE = RPE × minutes, stockée à part dans l'appli. Son envoi dans intervals.icu doit être une option du coach, car l'unité n'est pas celle du TSS ».
- Trou à combler : ouvrir les études de validité du sRPE en musculation avant de garder « A ».

**12. Altitude 1 800 m : la source est lue à l'envers sur l'hémoglobine.**
- Où : D, « En 1 minute », tableau ligne 36, mythe 14, règle 32, note de collecte (« bas de la fourchette "efficace" pour le gain hématologique »).
- Preuve : `chapman2014` : le volume érythrocytaire a augmenté **dans tous les groupes, sans différence**, 1 780 m compris ; c'est le chrono sur 3 000 m qui ne s'est pas amélioré à 1 780 m. `koivistomork2021` : +3,7 % sur des stages à 1 800-2 500 m. Un seul essai, 12 coureurs par groupe, stage de 4 semaines chez des athlètes de plaine ; D reconnaît qu'aucune source ne porte sur des résidents.
- Correction, « En 1 minute » : « 1 800 m : un essai n'y trouve pas de gain de performance en plaine après 4 semaines, alors que les globules rouges montent comme plus haut. Preuve mince, et rien sur ceux qui y vivent toute l'année. »
- Correction, règle 32 : « Ne pas promettre de gain de performance en plaine du seul fait de vivre à 1 800 m : l'unique essai est négatif à cette altitude, bien que le gain sanguin y soit présent. (C) [@chapman2014] [@koivistomork2021] ». Ligne 36 : C.

**13. Règles de A impossibles à tenir ensemble.**
- Où : A, règles 10 (6-24 h), 12 (8 h), 13 (48 h avant une séance intense), 29 (48-72 h après une descente), avec un public à 8-20 h d'endurance et 1-3 séances de muscu.
- Preuve : trois délais différents pour la même situation (muscu jambes puis séance intense). Avec 2 séances de muscu et 2-3 séances clés par semaine, la règle des 48 h ne laisse aucune place.
- Correction : fusionner en une seule règle hiérarchisée : « Après une muscu lourde jambes : pas de séance clé de course dans les 8 h (C) ; si possible attendre le lendemain (C) ; 48 h seulement en début de bloc ou après une séance inhabituelle (C). En cas de conflit, la séance clé d'endurance garde la priorité et la muscu se déplace. » Dire dans l'appli laquelle des trois déclenche un signal.

**14. Niveaux de preuve surévalués (liste).**
- A : `robinson2024` A → **B** (analyse exploratoire, RIR estimé) ; règle 6, écrire « Arrête les séries avant l'échec (repère proposé : 2-3 RIR) » car la cible 2-3 n'est pas dans la source. Règle 1 A → **B** (`llanoslagos2026` : certitude faible ; retirer « quel que soit son niveau », le résumé dit que la preuve ne permet pas de recommandation robuste). `halperin2022` A → **B** (I² 97,9 %). XCO, ligne et règle 24, B → **C** : `hays2021` et `bejder2019` sont des corrélations, pas des essais d'entraînement ; écrire « sont associés à la performance », pas « dépend de ». `kristoffersen2019` B → C (un essai). `giandolini2016b` B → C. Mythe 6 : `eihara2022` trouve un effet significatif de la plyo seule sur le chrono (g −0,17 [−0,27 ; −0,06]) ; écrire « effet petit et inconstant selon les méta-analyses », pas « n'améliore pas significativement ».
- B : ACWR « A (critiques méthodologiques) » → **B** (articles conceptuels ; D met B pour la même source). `dorn2012` B → C (modélisation, 9 sujets). `albracht2013` B → C (un essai). `hilkens2024` B → C. `zhao2014` A → B (6 études). Dos (`steffens2016`, `shiri2018`) : A en population générale, **C** pour l'athlète ; « gainage » n'est pas ce que ces essais testent.
- C : essais croisés uniques classés B → **C** : `burnley2005`, `christensen2015`, `johnson2014`, `solli2020`, `vangsoe2020`, `balban2023` (non athlètes, à distance), `bernardi2001` (n = 15), `bilo2012` (hors altitude utile), `citherlet2021`, `woorons2019`. `opplert2018` (revue narrative) B → C. `precart2025` A → B. Règle 22 IMT « A/B » → B (effet plus faible chez les très entraînés, dit par C lui-même).
- D : règle 9 (« Noter le sommeil chaque matin », A) → **D** (le consensus ne teste pas le suivi quotidien). `chapman2014`, `chapman2016` B → C. Ligne 20, application « le questionnaire pèse plus que la VFC » : inférence d'auteur, à marquer D. Ligne 28 ACWR : B, cohérent ; aligner B dessus.
- `sources.json` : `haddad2017` type « revue » mais niveau « A » → B. `pinero2024` : revue « Eur J Sport Sci 24:177-189 » → « 24(2):177-189 ».

**15. Populations éloignées présentées sans réserve.**
- D, questionnaire en 5 items et poids de 70 % : `mclean2010` (12 rugbymen), `gastin2013` (football australien), `duignan2020` (sports collectifs adultes). Ajouter dans « Ce que la science permet » : « Les questionnaires courts ont été étudiés en sports collectifs ; rien de spécifique à l'endurance. »
- D, règle 11 (« +30 à 60 min au lit ») : `mah2011` = 11 basketteurs, sans groupe témoin, +111 min. Ajouter « sans groupe témoin ».
- D, froid : 92 % d'hommes, aucun endurant (dit en limites, pas dans la règle 1 classée A). Écrire « (A chez des pratiquants de muscu ; non testé chez l'endurant) ».
- A, presque toute la preuve vélo vient d'un seul laboratoire (Rønnestad, Lillehammer), petits groupes d'hommes. À écrire dans les limites.
- A, `beattie2017a` : cyclistes de 38 ans, n = 6.
- C, `vangsoe2020` (sprinteurs, 1 km) et `depoli2020` (récréatifs) appliqués au départ XCO.
- C, règle 14 : `johnson2014` échauffe à 70-90 % du **premier** seuil (intensité facile à modérée). « du tempo jusqu'au seuil » est plus dur que l'étude. Correction : « ex. 3 × 5 min progressifs, en restant sous le premier seuil (Johnson), ou un bloc plus soutenu avec ≥ 10 min de récupération (Burnley) ».

**16. Score de forme : le recentrage masque la fatigue chronique.**
- Où : D, pseudo-code : `score = 70 + (score - base.scoreMoy28)`.
- Preuve : un athlète fatigué depuis 4 semaines voit sa moyenne baisser, donc son score « normal » redevient 70 (vert). Le signal « moyenne 7 jours < 55 » est calculé sur ce score recentré et ne se déclenche plus. C'est le cas que la règle 23 veut repérer.
- Correction : garder deux valeurs. « Le score affiché à l'athlète est relatif à sa base ; l'alerte coach se calcule sur le score brut (non recentré) et sur la pente de la moyenne 28 jours. » Ajouter : « base figée si la moyenne 28 jours baisse de plus de 10 points ».

### Mineurs

**17.** D, incohérence interne : décharge « toutes les 4-8 semaines » (« En 1 minute ») contre « 4-6 semaines » (tableau, règle 29, appli). Garder « 4-6 ».

**18.** D, affûtage : cite `bosquet2007` (2007) et ignore `wang2023`, déjà dans `sources.json` et cité par A (14 études, ≤ 21 jours, effet aussi à ≤ 7 jours). Ajouter la clé, et écrire « 1 à 3 semaines » au lieu de « 2 semaines ». A, règle 31 : « 1 séance courte 5-10 jours avant la course A » n'a pas de source ; marquer « repère proposé (D) ».

**19.** D, « Non couvert faute de source ouverte : … rouleau de massage » alors que C le traite (`wiewelhove2019`, `konrad2022b`). Remplacer par « rouleau de massage : voir domaine C ».

**20.** D, ligne 1 : « (8 études) » après SMD −0,60 : c'est le total de la revue, force et endurance réunies. Écrire « (revue de 8 études au total) ». Mythe 1 : donner la fourchette « −0,23 à −0,60 », pas le seul −0,60.

**21.** D, ligne 39 : « annule une bonne part du gain » : −5,7 points pour un gain moyen de 3,7 %, donc « annule le gain ».

**22.** D, ligne 9 : « petits bénéfices » pour la compression ; l'effet sur la force est grand (ES 1,03-1,14). Écrire « bénéfice global petit, plus net pour la force ».

**23.** A, mythe 3 (« La muscu améliore la VO2max → Faux ») : `losnegard2011`, cité dans A, trouve +7 % de VO2max en skating. Écrire « Faux dans les méta-analyses ; un essai en ski de fond fait exception ».

**24.** C, protocole 8 (si conservé malgré le problème 7) : le résumé de `balban2023` décrit des inspirations plus longues que les expirations ; le 1,5 s / 1,5 s ne le reflète pas.

**25.** C, règle 24 : séparer les deux doses (voir échantillon, `barnes2021`) : « 1 × 30 inspirations à 50 % (course, effet positif) ; 2 × 30 à 40 % testé en vélo sans effet ».

**26.** D, règle 8 (sauna) : « jamais seul si on se sent mal » est mal formulé. Correction : « sortir au moindre malaise ; ne pas y aller seul ; pas après une séance qui a déshydraté ». Préciser « majeurs seulement ».

**27.** A, première phrase : « Toutes les sources ont été ouvertes… Chiffres repris des résumés uniquement » : vrai sur ce que j'ai contrôlé. À garder.

## 4. Trous (sujets attendus, absents)

- **A — Apprentissage et sécurité des charges lourdes.** Les règles 1 et 2 prescrivent ≥ 80-90 % 1RM à des endurants de 18-25 ans souvent débutants en muscu. Rien sur la phase d'apprentissage technique, la montée progressive, l'estimation du 1RM sans test maximal, ni l'encadrement. À ajouter avant toute règle « ≥ 90 % ».
- **A — Semaine type.** Aucune source ni règle sur la répartition concrète muscu/endurance dans la semaine (jour dur regroupé ou non). C'est pourtant la question que pose le garde-fou de calendrier.
- **A — Triathlon et ski nordique** (public second) : une seule source ski, aucune triathlon. **Haut du corps** : aucune preuve d'intervention.
- **A et D — Altitude et muscu** : absent (signalé par A). **Altitude et zones d'entraînement** : D ne dit rien de l'ajustement des intensités à 1 800 m.
- **B — Gênes propres au cycliste** : genou du cycliste, nuque, mains et périnée ne sont pas traités ; seul le dos l'est, par une enquête. **Fractures de fatigue du coureur** : absentes hors REDs.
- **B — Sécurité de la pliométrie** : surface, technique de réception, critères pour commencer. La règle 7 est D et sans source de sécurité.
- **B — Preuves de la proprioception** hors cheville : l'appli a des séances « proprio », la science lue ne couvre que l'entorse.
- **C — Respiration et gainage sous charge lourde** (blocage respiratoire, Valsalva) : absent, alors que A prescrit du lourd.
- **C — Échauffement spécifique de la séance de muscu** (séries de montée en charge) : le RAMP est générique, appuyé sur une étude de jeunes footballeurs.
- **D — Jour à deux séances et froid** : règle 1 (pas de froid après la muscu) et règle 2 (froid après l'endurance) se heurtent quand les deux sont le même jour. Ajouter : « le jour où il y a muscu, pas de bain froid, quelle que soit l'autre séance ».
- **D — Reprise après maladie**, **stress d'examens** (public étudiant), **cycle menstruel et récupération**, **caféine/écrans et sommeil** : mentionnés ou absents, sans source.
- **D — Conversion de la charge muscu** en unité compatible avec intervals.icu : fonction centrale du produit, aucune preuve (voir problème 11).

## 5. Ce qui tient bien

- Aucune référence inventée ; DOI, revues, années et auteurs exacts sur 65 sources contrôlées.
- B sur l'isométrie, le Nordic (réanalyse d'Impellizzeri), l'ACWR et les seuils d'asymétrie : lecture fidèle et prudente.
- D sur la VFC guidée et le modèle de Banister : chiffres exacts, conclusion mesurée.
- Les sections « Limites » sont honnêtes ; le défaut récurrent est que la réserve écrite en fin de fichier ne redescend pas dans la lettre de preuve ni dans la règle codée dans l'appli.
