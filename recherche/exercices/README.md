# Exercices — carte de couverture et fiches candidates

*Phase 3 de la mission. Carte calculée le 1er octobre 2026 à partir des 190 fiches de `docs/data/exercises.json` par `_outils/carte_couverture.py`. Les fiches candidates sont dans les fichiers `.json` de ce dossier ; chacune a `valide: false` : seul Nathan valide.*

## Comment lire

- **Case en gras = 0, 1 ou 2 exercices** : trou ou zone faible.
- Les qualités sont déduites des fiches (famille, type, matériel, muscles, nom) : c'est une classification automatique, donc approximative. Un exercice peut compter dans plusieurs cases.
- « Salle » = barre, machine, box, banc, kettlebell, disque, swiss-ball, plots, sangle, sac lesté, rameur… « Rien » = aucun matériel (un tapis ou un mur ne comptent pas).

## 1. Qualités × matériel (catalogue actuel)

| Qualité | Total | Salle | Haltères seuls | Élastique | Rien (hôtel, voyage) |
|---|---|---|---|---|---|
| force max | 34 | 17 | 11 | 8 | **1** |
| puissance | 23 | 9 | **0** | **0** | 13 |
| plio | 8 | 3 | **0** | **0** | 5 |
| excentrique | **2** | **0** | **0** | **0** | **1** |
| isométrie | 7 | **2** | **0** | **0** | 5 |
| gainage anti-mouvement | 24 | 4 | **0** | **1** | 19 |
| préhension | 8 | **2** | **2** | 4 | **0** |
| proprio | 23 | 15 | **0** | **0** | 8 |
| mobilité | 21 | **1** | **0** | **0** | 20 |
| étirement | 33 | **1** | **0** | **0** | 32 |
| respiration | **2** | **0** | **0** | **0** | **2** |
| échauffement | 19 | **2** | **0** | **1** | 15 |

## 2. Qualités × niveau

| Qualité | Niveau 1 | Niveau 2 | Niveau 3 |
|---|---|---|---|
| force max | 13 | 16 | 5 |
| puissance | **2** | 14 | 7 |
| plio | **2** | 3 | 3 |
| excentrique | **0** | **1** | **1** |
| isométrie | 6 | **1** | **0** |
| gainage anti-mouvement | 10 | 12 | **2** |
| préhension | 3 | 3 | **2** |
| proprio | 6 | 7 | 10 |
| mobilité | 11 | 9 | **1** |
| étirement | 26 | 7 | **0** |
| respiration | **2** | **0** | **0** |
| échauffement | 19 | **0** | **0** |

## 3. Zones × qualités

| Zone | Total | force max | puissance | plio | excentrique | isométrie | gainage anti-mouvement | préhension | proprio | mobilité | étirement | respiration | échauffement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| pied | 3 | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | **0** | 3 | **0** | **0** |
| cheville | 72 | 6 | 20 | 8 | **1** | 4 | **0** | **1** | 22 | 4 | 10 | **0** | 11 |
| genou | 97 | 15 | 19 | 6 | **1** | **2** | 4 | **2** | 22 | 9 | 14 | **0** | 7 |
| hanche | 116 | 18 | 18 | 5 | **1** | **2** | 16 | **2** | 22 | 14 | 17 | **0** | 8 |
| dos | 66 | 16 | 3 | **0** | **0** | **1** | 15 | 6 | **0** | 9 | 18 | **2** | 3 |
| épaule | 37 | 8 | **1** | **0** | **0** | **1** | 10 | 5 | **0** | 6 | 4 | **0** | 3 |
| cou | 10 | **0** | **0** | **0** | **0** | **0** | **2** | **0** | **0** | 4 | 4 | **0** | **1** |
| poignet | 22 | 9 | **1** | **0** | **0** | **1** | **1** | 8 | **0** | 7 | **1** | **0** | **0** |

## 4. Sports (d'après les tags des fiches)

| Sport | Exercices tagués | Ce qui existe | Ce qui manque |
|---|---|---|---|
| VTT XCO (tags `descente-vtt`, `coup-de-pedale`, `velo`) | 134 | force 22, gainage 15, proprio 16, mobilité et étirements 47 | haut du corps en force et en puissance, **préhension réelle** (suspension, portés), **cou**, plio (5), isométries en position de pilotage, échauffement d'avant course |
| Route (`coup-de-pedale`, `velo`) | 79 | étirements 27, mobilité 18 | force lourde (9), **isométrie 0**, **excentrique 0**, **proprio 0**, **sauts courts pour l'os**, gainage anti-flexion |
| Trail (`trail`, `foulee`, `montee`) | 119 | proprio 22, puissance 20, force 19 | **excentrique de descente (2)**, plio graduée (8), mollet-soléaire lourd, pied, isométries de tendon |
| Triathlon | pas de tag dans le schéma | — | épaule du nageur, gainage en position aéro ; porté par le champ `sports` des fiches candidates |
| Ski nordique | pas de tag dans le schéma | — | double poussée (triceps, dorsaux, abdos), force du haut du corps, équilibre unipodal ; idem |

## 5. La liste de courses (cases vides ou faibles)

| # | Trou | Constat | Fichier de fiches candidates |
|---|---|---|---|
| 1 | **Respiration guidée** | aucun exercice dédié au catalogue : les 2 comptés dans le tableau sont des faux positifs du classement automatique ; la respiration vit seulement dans l'onglet Récup | `echauffement-respiration-voyage.json` (8 protocoles de `science/C`) |
| 2 | **Excentrique** (descente trail, tendons) | 2 exercices (Nordic, mollet excentrique) | `force-bas-du-corps.json`, `mollet-pied-proprio.json` |
| 3 | **Isométrie de force** | 7, presque toutes de cheville ; rien pour la cuisse lourde, les ischios, le mollet lourd | `force-bas-du-corps.json`, `mollet-pied-proprio.json` |
| 4 | **Pliométrie** | 8 exercices, aucun bond horizontal, aucun latéral, aucun lancer | `plio-puissance.json` |
| 5 | **Pied** | 3 étirements, aucun renforcement | `mollet-pied-proprio.json` |
| 6 | **Soléaire et tibial antérieur chargés** | absents | `mollet-pied-proprio.json` |
| 7 | **Préhension** | 8 exercices, mais indirecte (tenir un haltère) ; pas de suspension ni de porté dédié | `haut-du-corps-gainage.json` |
| 8 | **Cou** | aucune force ; seulement mobilité et étirements | `haut-du-corps-gainage.json` |
| 9 | **Haut du corps** | 16 exercices ; peu de force (épaule), 1 seul de puissance ; pas de tirage horizontal au poids du corps ni de porté au-dessus de la tête | `haut-du-corps-gainage.json` |
| 10 | **Gainage anti-rotation et anti-flexion latérale chargés** | gainage surtout au sol sans charge (19 sur 24) | `haut-du-corps-gainage.json` |
| 11 | **Force des jambes à la maison** | 1 seule fiche de force sans matériel ; les 8 fiches « élastique » sont des rotations d'épaule ; 1 seule fiche avec sac lesté | `force-bas-du-corps.json`, `echauffement-respiration-voyage.json` |
| 12 | **Force niveau 3** | 3 exercices | `force-bas-du-corps.json` |
| 13 | **Échauffement spécifique** | 6 fiches, toutes de niveau 1, rien d'orienté « avant muscu », « avant XCO », « avant trail » | `echauffement-respiration-voyage.json` |
| 14 | **Mobilité et étirements** | 54 fiches : bonne base ; manquent le haut du dos en rotation, les poignets et avant-bras du vététiste, les enchaînements de 5 min après la sortie | `mobilite-etirements.json` |
| 15 | **Os (cyclistes)** | aucun exercice pensé « sauts courts pour l'os » (`science/B`) | `plio-puissance.json` |
| 16 | **Triathlon et ski nordique** | non couverts | champ `sports` dans tous les fichiers ; double poussée et épaule dans `haut-du-corps-gainage.json` |

## 6. Bilan après rédaction des fiches

*(Rempli en fin de phase 3 : nombre de fiches par fichier, priorités, animations à créer, et, pour chaque trou ci-dessus, « comblé » ou « justifié ».)*
