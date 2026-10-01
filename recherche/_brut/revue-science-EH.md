# Revue contradictoire — science E à H

*Relecture du 1er octobre 2026. Fichiers relus : `recherche/science/E-nutrition.md`, `F-sports-publics.md`, `G-adhesion.md`, `H-tests-mesure.md`. Méthode : résumés rouverts par l'API Europe PMC (DOI, sinon titre) ; pages AIS, Cespharm et AFNOR rouvertes par curl. Légifrance n'a pas pu être rouvert (protection anti-robot) : l'article 45 est jugé sur la notice de `sources.json` et sur les pages CNIL citées, pas relu à la source.*

## Bilan en 6 lignes

- **Aucune source inventée.** Sur 16 sources tirées au hasard (graine 43) : **15 exactes, 1 approximative, 0 fausse, 0 introuvable**. Environ 75 autres sources « lourdes » ont été rouvertes : métadonnées toutes justes, chiffres fidèles aux résumés.
- **Les erreurs sont dans l'interprétation, pas dans les références** : niveaux de preuve trop hauts, causalité tirée d'études d'observation, extrapolations vers l'endurant.
- **Une erreur factuelle dans E** : le « 1,2 g/kg/h » est dit « non vérifié », alors qu'il figure dans le résumé ISSN que E cite (`kerksick2017`).
- **Le point le plus fragile est dans G** : le « seuil de 74 % de séances » est une borne de tercile entre études, pas un seuil mesuré.
- **Tableau nutrition** : pas de valeur dangereuse, pas de prescription de perte de poids. Trois valeurs à resserrer (glucides du jour, sodium, veille de course) et une dose de caféine formulée comme une consigne.
- **Deux contradictions entre domaines** : pesée (E la demande, F l'interdit aux juniors) ; « faire un peu ne sert à rien » (G) contre « raccourcis plutôt que supprimer » (G) et l'effet dose de F.

## 1. Échantillon aléatoire de 16 sources (graine 43)

Tirage : `random.seed(43); random.sample(sorted(clés citées), 4)` pour chaque fichier.

| Domaine | Clé | Verdict | Détail |
|---|---|---|---|
| E | `ais-groupe-c` | **Exact** | Page AIS rouverte : magnésium, acide alpha-lipoïque, HMB, BCAA, phosphate, SAMe, tyrosine, vitamine E. Listes des groupes A, B et D conformes aussi. |
| E | `grgic2021` | **Exact** | ISSN bicarbonate : 0,2-0,5 g/kg, optimum 0,3, 60-180 min avant, efforts de 30 s à 12 min, 0,4-0,5 g/kg/j sur 3-7 j. Auteurs, revue, DOI justes. |
| E | `bussau2002` | **Exact** | 8 hommes entraînés, 10 g/kg/j, glycogène 95 → 180 mmol/kg (poids humide) en 1 jour. À préciser : hommes seulement. |
| E | `mccubbin2023` | **Exact** | Modélisation (pas un essai) : sodium inutile sur marathon élite, utile sur 160 km si > 80 % des pertes remplacées et sueur ≥ 40 mmol/L. Niveau C justifié. |
| F | `behm2008` | **Exact** | Pas d'âge minimum ; 2-3 séances/sem, 1-2 séries puis 4 × 8-15, 8-12 exercices. Le résumé précise « intensité basse à modérée ». |
| F | `losnegard2011` | **Exact** | 19 skieurs, 12 sem : tirage +19 %, demi-squat +12 %, VO2max skating +7 %. Omission dans F : même progrès en contre-la-montre dans les deux groupes. |
| F | `gallo2022` | **Exact** | 30 hommes (10 par catégorie) : courses juniors plus courtes mais plus exigeantes en charge interne. |
| F | `sherk2014` | **Exact** | 14 femmes : hanche −1,4 % (DMO) ; sous-trochanter −2,1 %. |
| G | `ashford2010` | **Exact** | 27 études, 5 501 sujets, d = 0,16 ; persuasion, maîtrise graduée et repérage des freins associés à une efficacité perçue plus basse. |
| G | `laranjo2021` | **Exact** | 28 ECR, n = 7 454, SDM 0,35 ≈ 1 850 pas/j. Population : adultes non sportifs, 28 % de femmes. |
| G | `saw2015a` | **Exact** | 30 entretiens, 20 sports ; pas de DOI (normal pour cette revue). |
| G | `souissi2021` | **Approximatif** | Chiffres exacts (d = 0,58-1,1 ; 1,2-1,3 à 1 semaine). Mais ce sont des **écoliers avec au moins 3 mois de pratique**, pas de « jeunes haltérophiles ». |
| H | `balsalobrefernandez2019` | **Exact** | 12 sujets, r = 0,989, erreur standard 0,48°. Étude écrite par le développeur de l'appli. |
| H | `lee2025` | **Exact** | 24 études, 798 sujets : sommeil total −16,9 min, éveils +13,3 min. |
| H | `erdman2024` | **Exact** | 41 volleyeuses adolescentes ; angles 2,4-4,6° ; critère « genou à l'intérieur du bord de la chaussure » AUC 0,67-0,93. |
| H | `springer2007` | **Exact** | 549 adultes, ICC 0,998 yeux fermés. Les normes par âge ne sont pas dans le résumé, comme H le dit. |

**Total : 15 exactes, 1 approximative, 0 fausse, 0 introuvable.**

## 2. Affirmations lourdes pour le produit

| Affirmation | Verdict | Ce que disent les sources rouvertes |
|---|---|---|
| Glucides à l'effort 30-60 g/h, jusqu'à 90 g/h, 120 g/h expérimental | **Juste, prudent** | `burke2011` et `rowlands2015` conformes. `podlogar2022` : le 120 g/h est comparé à un 90 g/h de **ratio différent** (0,8:1 contre 1:2) ; n = 11 hommes. |
| Protéines 1,62 g/kg/j | **Juste** | `morton2018` : 49 ECR, 1 863 sujets. La borne « ~2,2 » n'est pas dans le résumé. Concerne la masse maigre en muscu, pas l'endurance. |
| 0,3-0,4 g/kg par repas | **Juste** | `jager2017` 0,25 g/kg ; `kerksick2017` 0,25-0,40 ; `schoenfeld2018` 0,4 × 4. |
| Glycogène ~1 g/kg/h | **Approximatif** | `burke2017` écrit « ~1 g/kg », sans « par heure » dans le résumé. `craven2021` : 1,02 g/kg/h est la dose moyenne des essais, pas un optimum. `kerksick2017` écrit **1,2 g/kg/h**. Voir problème 1. |
| « Train low » sans gain | **Juste** | `gejl2021` : 9 études, SMD 0,17 [−0,15 ; 0,49], p = 0,29. |
| Caféine 3-6 mg/kg | **Juste** | `guest2021` conforme (minimum possible 2 mg/kg, 9 mg/kg sans gain, 4-6 en altitude). |
| Créatine | **Juste** | `kreider2017` : 30 g/j sur 5 ans bien tolérés. `forbes2023` : revue narrative, niveau C justifié. Aucune dose dans E. |
| Nitrate | **Juste** | `senefeld2020` : d = 0,174 ; ≥ 65 ml/kg/min d = 0,021 ; femmes seules NS (6 études). |
| Contamination 9-28 % | **Juste, à nuancer** | `alsaad2026` 9-15 % ; `kozhuharov2022` 875/3 132 ; `geyer2008` 15 %. Le 28 % compte toute substance non déclarée, sur des produits souvent suspects. |
| NF EN 17444 remplace NF V94-001 | **Juste** | Cespharm rouvert : publiée en février 2021, ancienne norme inutilisable après le 21/08/2021, application volontaire. La fiche AFNOR précise : limiter le risque « sans pour autant en garantir l'absence totale ». |
| REDs | **Juste** | `mountjoy2023` conforme. Mais `viner2015` est mal décrit (problème 6). |
| Cycle menstruel | **Juste, une omission** | `mcnulty2020` : ES −0,06 [−0,16 ; 0,04], qualité basse. Non repris : début contre fin de phase folliculaire, ES −0,14 [−0,26 ; −0,03]. |
| Force chez les jeunes | **Juste** | `behm2008`, `lesinski2016`, `moran2017` conformes. `lloyd2014` n'a pas de résumé : F le dit. |
| Consentement à 15 ans | **Juste mais trop large** | Non rouvert à la source. La notice dit bien « offre directe de services de la société de l'information » ; F a perdu cette limite (problème 9). |
| Seuil ~74 % de séances | **Trop fort** | `viiala2026` : terciles d'études. Problème 3. |
| 70 % d'abandon en 100 jours | **Juste** | `kidman2024` conforme. C'est une revue de portée, classée à tort « revue systématique ». |
| Gamification | **Juste** | `mazeas2022` (g 0,42 ; 0,23 ; 0,15) et `nishi2024` (+489 pas/j) conformes. |
| Rappels | **Juste** | `bidargaddi2018` RR 1,039 ; `klasnja2019` +35 pas, p = 0,06. |
| Erreur du RIR | **Juste, mal traduit** | `halperin2022` : 0,95 rep est un **biais moyen** (IC 0,17-1,73, I² 97,9 %), pas une marge d'erreur. Problème 12. |
| 1RM par la vitesse | **Juste, comparaison non fondée** | `greig2023` 9,8 % ; `lemense2024` 4 études, 71 sujets. Problème 13. |
| Inclinomètres de smartphone | **Juste** | `keogh2019`, `powden2015`, `spork2021` conformes. |
| Estimation de pose par IA | **Juste** | `ogura2026` : 4,4° genou, 5,3° hanche, 4,9° cheville, 7,5° cheville frontale. Tâches de saut seulement. |
| FC au poignet | **Juste** | `zhang2020` : −7,26 bpm en muscu, −4,55 à vélo. |

## 3. Tableau « conseil de fin de séance » (E)

**Pas de valeur dangereuse. Aucune prescription de perte de poids** : E interdit déficit, poids cible, IMC et masse grasse. Points à corriger :

| Ligne | Valeur | Jugement | Correction |
|---|---|---|---|
| Endurance longue, glucides | 1,0 g/kg/h pendant 2-4 h | Bas de la fourchette des consensus (1,0-1,2). Appliqué même sans séance proche, alors que E dit ailleurs que rien ne presse au-delà de 24 h. | « 1,0-1,2 g/kg/h pendant 2-4 h **si une séance arrive dans moins de 8 h** ; sinon repas riches en glucides. » |
| Endurance longue, total du jour | 8-12 g/kg | Haut de fourchette généralisé. `kerksick2017` donne 8-12 pour **maximiser** les réserves ; `tiller2019`, cité par E, donne 5-8 à l'entraînement. Pour 65 kg : 520-780 g. | « 6-10 g/kg sur la journée ; 8-12 seulement veille de course longue ou journée de plus de 4-5 h. » |
| Sodium | 1 400 mg/L | Un seul essai de 1996, 6 hommes par groupe. Soit 3,6 g de sel par litre : plus salé que les boissons du commerce. Risque : lu comme une recette. | Mettre `sodium_mg_l: null` et le texte « repas ou boisson salés » partout. Garder 61 mmol/L comme note de labo. |
| Veille de course | ~10 g/kg | Un essai, 8 hommes au repos. Rappel automatique identique pour une course de 1 h 30 et de 4 h. | « 7-10 g/kg si la course dure moins de 90 min ; 10-12 au-delà. Aliments connus, peu de fibres. » |
| Liquide | 1,5 L par kg perdu | Conforme (125-150 %). Utile seulement si la récupération est courte. | Ajouter « si une séance arrive dans la journée ; sinon à la soif ». |
| Protéines | 0,3-0,4 g/kg | Conforme. | Rien. |
| Muscu et plio, glucides | 0,5-1,0 g/kg | Sans source, annoncé comme tel (preuve D). Honnête. | Rien. |

**Doses de compléments.** Créatine, nitrate, fer, vitamine D : aucune dose prescrite. Exceptions :
- **Règle 29 de E** : « Caféine : 3 mg/kg pour commencer, 60 min avant » est une consigne chiffrée. Voir problème 5.
- Les doses de fer (105 et 210 mg/j dans E, 100 mg/j dans F) et de bicarbonate sont des constats d'étude. Elles ne doivent jamais passer côté athlète.

## 4. Liste numérotée des problèmes

### Graves

**1. E — Le « 1,2 g/kg/h » est dit non vérifié alors qu'il est dans une source citée.**
- Où : E, « Limites et incertitudes », première puce ; ligne « 0-4 h après l'effort » ; règle 17 ; tableau.
- Preuve : résumé de `kerksick2017` : « aggressive carbohydrate refeeding (1.2 g/kg/h) » si moins de 4 h de récupération. Le résumé de `burke2017` dit « ~1 g/kg », sans « par heure ».
- Correction : remplacer « Le « 1,2 g/kg/h » n'est donc pas repris. » par « Le 1,2 g/kg/h figure dans le résumé ISSN [@kerksick2017] : la fourchette retenue est 1,0-1,2 g/kg/h. » Remplacer partout « ~1 g/kg/h » par « 1,0-1,2 g/kg/h ».

**2. E — Règle 32 : la norme de fabrication est mise au même rang que le test par lot.**
- Où : E, règle 32 et « En 1 minute ».
- Preuve : fiche AFNOR : la norme limite le risque « sans pour autant en garantir l'absence totale ». E l'écrit lui-même dans son tableau.
- Correction : « Tout complément = risque de contamination. Préférer un produit **testé par lot** (Informed Sport) et garder le numéro de lot. La mention NF EN 17444 atteste de bonnes pratiques de fabrication : elle réduit le risque, elle ne garantit pas l'absence de substance interdite. »

**3. G — Le « seuil de 74 % » n'est pas un seuil.**
- Où : G, « En 1 minute », tableau 1, mythe 2, règle 1.
- Preuve : `viiala2026` classe 35 essais en **terciles** d'adhésion. Le tercile du milieu (RR 0,50) fait aussi bien que le haut (RR 0,53) : pas de gradient au-dessus. Le tercile bas donne RR 0,87, IC 0,75-1,02, p = 0,08 : non significatif, pas nul. Comparaison entre études, surtout en sports collectifs. Aucun essai chez l'endurant, ce que F reconnaît.
- Correction de la règle 1 : « Vise au moins 3 séances sur 4. Dans les essais de prévention, les programmes suivis à moins de ~74 % n'ont pas d'effet net (RR 0,87, NS) ; ce chiffre est une borne de classement entre études, en sports collectifs, pas un seuil prouvé chez l'endurant. (B) »
- Correction du mythe 2 : « « Faire un peu du programme, c'est déjà ça. » → En partie vrai : l'effet baisse quand l'adhésion baisse, sans tomber à zéro. Mieux vaut une séance courte que rien. Preuve B. »
- Dans l'appli : pas d'« alerte à 75 % » présentée comme scientifique ; écrire « repère ».

**4. F et E — Sauts et charges lourdes conseillés à « tout cycliste » sans garde-fou.**
- Où : F, règles 8 et 32, « Module os » ; E, ligne `viner2015`.
- Preuve : les mêmes fichiers disent que les cyclistes ont souvent une densité osseuse basse et un manque d'énergie. Conseiller des impacts à un athlète avec fracture de fatigue ou signes de REDs, sans avis médical, est le seul conseil réellement risqué de ces quatre fichiers.
- Correction, à ajouter à la règle 8 de F : « Exception : antécédent de fracture de fatigue, règles absentes ou perte de poids non voulue → pas de sauts avant l'accord d'un médecin du sport. Commencer bas et monter par paliers. »

**5. E — Une dose de caféine écrite comme une consigne.**
- Où : E, règle 29 ; ligne caféine du tableau.
- Preuve : la demande du produit est « aucune dose de complément présentée comme une prescription ». `guest2021` signale sommeil et anxiété.
- Correction : « Caféine : les essais utilisent 3-6 mg/kg environ 60 min avant ; des effets existent peut-être dès 2 mg/kg. L'appli ne calcule pas de dose. Si l'athlète en prend déjà : tester à l'entraînement, jamais en fin de journée, jamais pour un mineur. (A) »

### Moyens

**6. E — « Os fragiles » : terme médical faux pour `viner2015` et `keay2018`.**
- Où : E, tableau REDs et « Chiffres clés ».
- Preuve : `viner2015` recrute 10 cyclistes de 29-49 ans avec un Z-score **< 0**, c'est-à-dire sous la moyenne. Ce n'est pas un os fragile. L'étude ne montre pas de lien : tous ont été choisis sur ce critère.
- Correction : « Chez 10 cyclistes choisis pour une densité osseuse sous la moyenne (Z < 0), 70 à 90 % étaient en faible disponibilité énergétique selon la période (C). » Supprimer « liée à des os fragiles ». Pour `keay2018` : « densité osseuse plus basse ».

**7. E — Besoin en protéines de l'endurant : preuve surévaluée.**
- Où : E, « En 1 minute » et ligne `kato2016` (preuve B).
- Preuve : 6 hommes, un seul jour, après 20 km, protéines en acides aminés libres.
- Correction : preuve **C** ; « un essai sur 6 coureurs suggère 1,65-1,83 g/kg/j un jour de gros volume ».

**8. E — Niveaux de preuve trop hauts.**
- `podlogar2022` (n = 11, ratios différents) : B → **C**. Ajouter « le ratio diffère aussi entre les deux conditions ».
- `govus2015` : étude d'observation, doses non tirées au sort : B → **C**.
- `alsaad2026` : une seule revue, produits non représentatifs : A → **B**.
- « En 1 minute » : « Fortes doses de vitamines C/E : freinent les adaptations » → « freinent des marqueurs cellulaires ; VO2max et performance inchangées sur 11 semaines ».

**9. F — Consentement à 15 ans : généralisation.**
- Où : F, « En 1 minute », tableau, règle 30, « Chiffres clés ».
- Preuve : la notice `legifrance-lil-art45` limite la règle à l'offre directe de services en ligne et aux traitements fondés sur le consentement. Les données de douleur, de cycle ou de santé sont des données sensibles (consentement explicite). Accepter des conditions d'utilisation relève de la capacité à contracter, pas de cet article.
- Correction : « En France, un mineur de 15 ans ou plus peut consentir seul au traitement de ses données **pour un service en ligne fondé sur le consentement** ; avant 15 ans, accord conjoint avec un parent. Cela ne règle ni les données de santé (consentement explicite), ni l'acceptation de conditions d'utilisation par un mineur. À faire valider par un juriste. »

**10. F — `balsalobrefernandez2016` cité pour de la « force lourde ».**
- Où : F, ligne « La force améliore l'économie de course », règle 13 (A).
- Preuve : résumé : 4 études sur 5 à intensité **basse à modérée (40-70 % 1RM)**, avec sauts et sprints ; 5 études, 93 coureurs, SMD −1,42 [−2,23 ; −0,60].
- Correction : « 2 séances/sem de renforcement + pliométrie ; les essais chez des coureurs très entraînés ont surtout utilisé des charges basses à modérées (40-70 %). L'intérêt propre des charges lourdes vient d'autres sources (voir A). (B) »

**11. G — Causalité tirée d'études d'observation.**
- `saw2015b` : « Le coach est le levier n°1 » et « quand le coach soutient **et utilise les données** ». Le résumé compare des contextes non tirés au sort ; 70 athlètes sur 131 ont essayé ; le 84 % concerne des sports collectifs ; « utilise les données » n'y figure pas. Correction : « Dans une étude d'observation, le remplissage était de 84 % chez les athlètes d'équipe soutenus par leur structure, contre 28 % et 8 % en autonomie (C). »
- `pratap2020` : les « +40 jours » concernent des patients adressés par un clinicien dans des études de recherche. Correction : ajouter « population éloignée, association non causale (C) ».
- `milkman2021` : le meilleur programme donnait des **micro-récompenses** (points à valeur marchande), pas des félicitations. Correction de la règle 13 : « Ne culpabilise pas une séance ratée. Dans la méga-étude, le meilleur programme récompensait par quelques points le retour après une séance manquée ; l'effet d'un simple message positif n'a pas été testé. (C) »
- `ashford2010` : « la persuasion peut réduire la confiance » → « est associée à des gains plus faibles » (analyse entre études).
- `weakley2023` : le retour testé est surtout la **vitesse de barre en temps réel**. Afficher charge et RPE après la série est une extrapolation : (A) → (C) pour l'usage dans l'appli.
- `mcewan2016` : interventions **à plusieurs composantes** incluant un objectif, pas l'objectif seul.

**12. H — Le « ±1 rep » confond biais et erreur.**
- Où : H, « En 1 minute », ligne RIR, règle 17.
- Preuve : `halperin2022` : sous-estimation **moyenne** de 0,95 rep, I² 97,9 %, revue de portée « exploratoire ». L'erreur d'un individu est plus large (`zourdos2021` : 2,05 ± 1,73 reps à RIR 1).
- Correction : « En moyenne, les pratiquants annoncent ~1 rep de moins que ce qu'ils peuvent faire ; l'écart individuel va de 0 à 2 reps près de l'échec, davantage loin de l'échec. (B) » Preuve A → **B**.
- Non signalé dans H : `refalo2024` ne trouve pas de différence entre séries 1 et 2, contre `mansfield2020` (règle 20). Écrire « résultats contradictoires ».

**13. H — « Pas plus précis que par les reps » : comparaison sans données.**
- Où : H, « En 1 minute », mythe 3.
- Preuve : H reconnaît n'avoir trouvé aucune méta-analyse sur l'erreur des formules reps → 1RM. Le « ±5 % » est un calcul de l'auteur. `lemense2024` : 4 études, 71 sujets, squat seulement.
- Correction : « Le 1RM estimé par la vitesse a une erreur d'environ 10 % et surestime d'environ 4 % [@greig2023]. Aucune comparaison directe avec les formules par les reps n'a été lue. » Mythe 3 : preuve A → **B**.

**14. Contradiction E / F — la pesée.**
- Où : E, règle 22 et « test de sudation guidé », poids saisi ; F, règle 29 « Juniors : jamais de pesée ».
- Correction, à ajouter dans E : « Test de sudation : facultatif, réservé aux adultes, désactivé pour les mineurs et pour tout athlète signalé à risque. L'appli n'enregistre que la différence avant/après, jamais le poids. »

### Mineurs

**15. F — Cycle menstruel : notation et omission.** « A (preuve de qualité basse) » se contredit : mettre **B**. Ajouter : « L'écart le plus net est entre début et fin de phase folliculaire (ES −0,14 [−0,26 ; −0,03]) : petit, mais il justifie le suivi individuel des symptômes. »

**16. F — `lauersen2018` noté A.** 6 essais, 177 blessures, aucun en endurance ; l'effet dose est une comparaison entre 6 études. Mettre **B**. Ne pas reprendre « RR 0,338 » dans un message à l'athlète.

**17. F — Masters : « gagnent autant ou plus que les jeunes ».** `louis2012` : 9 contre 8 sujets, 3 semaines de 10 × 10 extensions de genou à 70 %. Correction : « Une très petite étude de 3 semaines suggère un gain de force plus grand chez les masters (C). » Supprimer « efface l'écart avec les jeunes ».

**18. F — Mythe 5, avant le pic de croissance.** `moran2017` : ES 0,5, IC [−0,06 ; 1,07], qui inclut zéro. Écrire « gains probables mais moins nets (ES 0,5, IC incluant 0) ».

**19. F — Vocabulaire.** « Conseiller un avis médical (densitométrie) » : l'appli ne suggère pas d'examen. Écrire « parles-en à ton médecin ». Les termes tendinopathie, ostéopénie, périostite, dysménorrhée restent dans les fiches du coach, jamais dans un message à l'athlète.

**20. G — Types et populations.** `kidman2024` est une revue de portée (type à corriger dans `sources.json`). `souissi2021` : « 35 écoliers débutants », pas « jeunes haltérophiles ». `zhang2016` : l'essai incluait des incitations ; l'ajouter. `baumel2019` : rouvert, exact (rétention médiane 3,9 % à J15, 3,3 % à J30 ; trackers 6,1 % à J30).

**21. H — Extrapolations.** `ogura2026` porte sur des sauts et mélange systèmes multi-caméras et téléphones : « Profondeur de squat : oui » n'est pas validé, écrire « plausible, non validé ». `zhang2020` : le −4,5 bpm à vélo vient surtout d'ergomètres. Les études `balsalobrefernandez*` sont écrites par le développeur des applis : le rappeler à chaque citation.

**22. E — Phrases à ne pas montrer à l'athlète.** « Une restriction modérée et encadrée peut améliorer le rapport poids/puissance » et le mythe 12 (« À court terme parfois ») restent côté coach.

## 5. Trous

- **E** : rien sur les crampes, la cerise acide, les probiotiques, la B12 (annoncé). Rien de propre aux femmes sur les glucides et les protéines : presque tous les essais portent sur des hommes. Pas de mention des troubles digestifs à 90-120 g/h. Consensus ACSM 2016 non lu : les fourchettes du jour reposent sur l'ISSN seul.
- **F** : aucun essai de prévention par la muscu chez des cyclistes, traileurs ou fondeurs (reconnu). Article 45 à relire à la source. Rien sur les 15-17 ans et les données de santé.
- **G** : aucune étude sur l'adhésion à la muscu chez des endurants de 18-25 ans suivis par un coach ; tout est extrapolé du grand public, du football ou de patients. Le 70 % d'abandon concerne des applis grand public sans coach.
- **H** : aucune validation de l'auto-mesure par l'athlète seul (reconnu). Rien sur les formules reps → 1RM. Rien sur un téléphone seul pour la pose.

## 6. Décompte final

- **Échantillon aléatoire (16)** : 15 exactes, 1 approximative, 0 fausse, 0 introuvable.
- **Sources lourdes rouvertes en plus (~75)** : métadonnées toutes exactes ; environ 12 lectures trop fortes ou mal traduites (problèmes 1, 3, 6, 7, 10, 11, 12, 13, 17).
- **Problèmes relevés** : 5 graves, 9 moyens, 8 mineurs.
- **Non vérifié** : Légifrance art. 45 (page bloquée), texte de la norme NF EN 17444 (payant), textes intégraux des consensus.
