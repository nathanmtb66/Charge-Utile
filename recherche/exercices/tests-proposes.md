# Tests de terrain proposés pour la batterie

*Phase 3 de la mission. Rédigé le 1er octobre 2026. Méthode : résumés lus un par un sur Europe PMC (API, `curl`). Aucun chiffre ci-dessous ne vient d'ailleurs que d'un résumé lu ; quand je calcule moi-même un seuil à partir d'un chiffre lu, c'est écrit « calcul ». Rien ici n'est validé par Nathan : ce sont des propositions.*

## En 1 minute

- **15 tests physiques retenus + 1 questionnaire** (à part). Ils complètent les 13 tests actuels sans les répéter : la batterie actuelle n'a **aucun saut vertical, aucun test du tronc, aucun test du haut du corps, aucun test sur le vélo**.
- **Les mieux prouvés et les plus simples** : saut vertical filmé au ralenti [@gencoglu2023] [@markovic2004], triple saut sur une jambe [@dingenen2019], sprint de 6 s au capteur de puissance [@falkneto2024], rotation du haut du dos au téléphone [@johnson2012] [@bucke2017].
- **Les tests de tenue du tronc classent bien mais suivent mal** : ICC corrects, erreur typique de 12 à 24 % [@juanrecio2025]. Il faut un `mdc` large (30 à 45 s) et une vraie séance d'apprentissage.
- **Tous les sauts et tous les sprints ont un effet d'apprentissage** : la première passation ne sert pas de référence [@marinjimenez2024] [@mcgawley2006] [@munro2011].
- **Les tests filmés (descente de marche, squat sur une jambe) sont des aides au choix d'exercices**, pas des mesures : accord entre observateurs moyen (kappa 0,40 à 0,80) et validité jugée insuffisante par une revue [@gomes2023] [@mansfield2022].
- **Écartés faute de preuve** : test de respiration BOLT (deux études, aucun lien avec la performance) [@kowalski2024] [@marko2026], chaise au mur, suspension à la barre, tractions max, soléaire genou fléchi, extension de hanche active, tirage isométrique mi-cuisse (matériel).
- **Aucun de ces tests ne dit qui va se blesser.** Ils disent quoi travailler et si ça progresse [@plisky2021] [@moran2017b].

## Comment lire les fiches

- `mdc` = plus petit changement qui dépasse l'erreur de mesure. En dessous, l'appli écrit « stable ». Règle : MDC95 ≈ 2,77 × erreur typique [@weir2005].
- « Publié » = le chiffre est dans un résumé lu. « Calcul » = déduit par moi d'un chiffre lu. « Choix prudent » = rien de publié pour ce protocole exact, valeur volontairement large.
- Modes existants dans `tests.json` : `saisie`, `angle`, `chrono`, `metronome`, `force`, `video`.
- Sports : xco, route, trail, triathlon, nordique.
- Règle commune à tous les tests : même heure, même échauffement, même matériel ; première passation = apprentissage [@hopkins2000].

---

## Fiche 1 — Saut vertical avec élan des jambes, filmé au ralenti (CMJ)

**1. Nom, ce que ça mesure, sport.** `saut-vertical`. La puissance des deux jambes ensemble, en un seul geste. Sports : xco, route, trail, triathlon, nordique. C'est le saut vertical le plus fiable et le plus étudié [@markovic2004].

**2. Protocole.** Échauffement : 5 min de vélo ou de footing facile, 10 squats au poids du corps, 3 sauts d'essai à 70-80-90 %.
1. Pose le téléphone au sol ou sur une chaise, à 2-3 m, objectif à hauteur de tes chevilles, mode ralenti (240 images/s si possible).
2. Debout, pieds largeur de bassin, **mains sur les hanches** : elles n'en bougent plus.
3. Descends vite jusqu'à mi-squat et saute le plus haut possible, d'un seul geste.
4. Reste jambes tendues en l'air, retombe sur la pointe des pieds au même endroit.
5. 3 sauts notés, 30 à 60 s de repos entre chaque. L'appli garde le meilleur.

Critères d'arrêt (essai annulé) : les mains quittent les hanches ; tu plies les genoux en l'air ; tu retombes ailleurs qu'au point de départ ; gêne au genou ou au tendon : « Je ne peux pas ».

**3. Mesurable au téléphone.** Vidéo au ralenti : l'athlète marque l'image où les orteils quittent le sol et celle où ils le retouchent. Hauteur = 1,226 × (temps de vol en s)², en mètres (formule physique du temps de vol). À 240 images/s, une image vaut environ 0,5 cm pour un saut de 30 cm ; à 60 images/s, environ 2 cm (calcul). Mode : `video`, mais avec une variante « deux images à marquer » qui n'existe pas encore. Solution sans développement : `saisie` du résultat lu dans une appli de saut existante.

**4. Fiabilité et validité publiées.**
- CMJ sur tapis de contact : alpha 0,97-0,98, variation intra-sujet 2,4 à 4,6 %, meilleure validité des 7 sauts testés [@markovic2004].
- Applis vidéo de temps de vol : 21 études, pas de différence de moyenne avec le matériel de référence, fiabilité quasi parfaite [@gencoglu2023] ; ICC ≥ 0,98 sur plusieurs appareils [@montalvo2021].
- Version avec détection automatique : r > 0,91 avec une plateforme de force, variation < 6 %, sur 12 sujets seulement [@balsalobrefernandez2024].
- Avec ou sans élan des bras : les deux sont fiables (ICC > 0,70, variation < 10 %) ; mains aux hanches isole mieux les jambes [@heishman2020].
- Les méthodes de calcul ne donnent pas la même hauteur : ne jamais comparer avec une plateforme ou un autre athlète mesuré autrement [@xu2023].

**5. Repères.** Pas de norme fiable pour des athlètes d'endurance de 18-25 ans dans les résumés lus : comparer l'athlète à lui-même.

**6. Erreur à retenir.** `mdc` proposé : **3 cm** (calcul : 2,77 × 2,4 à 4,6 % donne 7 à 13 %, soit 2 à 4 cm pour un saut de 30 cm [@markovic2004] ; l'erreur d'image s'ajoute à 60 images/s). Pas de côtés.

**7. Risques, précautions, ce que le test ne dit pas.** Réception genoux souples, sol dur et non glissant, chaussures. Profil « sans saut » : remplacer par l'assis-debout déjà en place. Le test ne dit pas ta puissance sur le vélo ni ton niveau en course : le lien entre saut et endurance est modeste. Une baisse d'un jour peut être de la fatigue, pas une perte de qualité.

**8. Priorité et intégration.** **Priorité 1.** Animation à créer (`t_cmj`, simple). Effort moyen : écran « marque le décollage, marque la réception » sur la vidéo ; sinon effort nul en `saisie`.

---

## Fiche 2 — Saut en longueur sans élan

**1. Nom, ce que ça mesure, sport.** `saut-longueur`. La puissance horizontale des deux jambes. Sports : trail, nordique, xco, triathlon. Le plus simple de tous : un mètre ruban, pas de vidéo.

**2. Protocole.** Échauffement : comme la fiche 1, plus 3 sauts d'essai non notés.
1. Scotche le mètre au sol, le 0 sur la ligne de départ (comme pour le saut sur une jambe).
2. Pieds largeur de bassin, orteils derrière la ligne, bras libres.
3. Balance les bras, plie les jambes et saute le plus loin possible.
4. Atterris sur les deux pieds et **tiens 2 s** sans bouger.
5. Lis la distance au talon le plus proche de la ligne. 3 sauts notés, 45 s de repos.

Critères d'arrêt : une main touche le sol ; tu recules ou tu sautilles à la réception ; tu prends un pas d'élan.

**3. Mesurable au téléphone.** Rien à capter : `saisie` en cm, meilleur des 3. Le téléphone sert seulement à entrer le chiffre.

**4. Fiabilité et validité publiées.** 410 adultes : la distance s'explique à 78 % par la puissance et la force horizontales mesurées en labo, le sexe et la composition corporelle. **Sans apprentissage**, le deuxième test est meilleur de 12 cm en moyenne : ICC 0,94, variation 7,1 %, MDC90 = 29 cm. **Après une période d'apprentissage** : écart 0,45 cm, ICC 1,00, variation 0,5 %, MDC90 = 1 cm [@marinjimenez2024].

**5. Repères.** Pas de norme pour ce public dans les résumés lus : comparer l'athlète à lui-même.

**6. Erreur à retenir.** `mdc` proposé : **10 cm** (choix prudent, entre les deux valeurs publiées, 1 cm et 29 cm [@marinjimenez2024], et cohérent avec l'erreur de 7 à 11 % des sauts sur une jambe [@dingenen2019]). Les deux premières passations ne comptent pas comme référence.

**7. Risques, précautions, ce que le test ne dit pas.** Sol non glissant, jamais sur parquet en chaussettes. Réception genoux souples. Le test ne sépare pas la jambe gauche de la droite et dépend beaucoup de la technique des bras : il ne dit rien d'un écart entre côtés.

**8. Priorité et intégration.** **Priorité 1.** Mode `saisie` existant, même montage que `saut-unipodal`. Animation à créer (`t_slj`), proche de `t_hop`.

---

## Fiche 3 — Triple saut sur une jambe

**1. Nom, ce que ça mesure, sport.** `triple-saut-unipodal`. La puissance et le rebond d'une jambe sur trois appuis enchaînés. Sports : trail (surtout), nordique, xco. Complète le saut simple sur une jambe déjà en place : il ajoute le rebond.

**2. Protocole.** Échauffement : 5 min facile, 2 × 6 sautillés sur place par jambe, 1 triple saut d'essai à 75 % par jambe.
1. Scotche 7 à 8 m de mètre ruban au sol (ou deux mètres bout à bout).
2. Sur une jambe, orteils derrière la ligne, bras libres.
3. Enchaîne **3 sauts** sur la même jambe, sans pause, le plus loin possible.
4. Tiens la dernière réception 2 s sans poser l'autre pied.
5. Lis la distance au talon. 3 essais notés par jambe, en alternant, 45 s de repos.

Critères d'arrêt : l'autre pied touche le sol ; pause entre deux sauts ; sautillement à la dernière réception ; une main au sol.

**3. Mesurable au téléphone.** `saisie` en cm, par côté, meilleur des 3. L'appli calcule le rapport jambe faible / jambe forte.

**4. Fiabilité et validité publiées.**
- 16 sportifs sains (22 ans), deux passations à une semaine : ICC 0,93 à 0,98 ; erreur typique 2,6 à 4,1 % ; plus petite différence détectable **7,2 à 11,3 %** de la distance [@dingenen2019].
- Effet d'apprentissage sur trois semaines ; chez les sains, symétrie ≥ 90 % [@munro2011].
- Validité : chez 40 footballeurs universitaires, la distance explique 69,5 % de la hauteur de saut vertical et 49 à 59 % de la force des cuisses ; aucun lien avec l'équilibre statique [@hamilton2008].
- L'indice de symétrie a sa propre erreur : 7 à 13 points [@reid2007].

**5. Repères.** Jambe faible à 90 % de l'autre ou plus [@munro2011]. Pas de norme de distance.

**6. Erreur à retenir.** `mdc` proposé : **10 % de la distance**, soit environ 50 cm pour 5 m (publié : 7,2-11,3 % [@dingenen2019]). `asymPct` : **90** (publié [@munro2011]), signalé seulement si l'écart se répète sur deux passations [@reid2007].

**7. Risques, précautions, ce que le test ne dit pas.** Test exigeant pour la cheville et le genou : à ne pas faire en profil « sans saut », ni avec une gêne en cours. Sol plat, dégagé, non glissant. Le test ne dit pas si une jambe est « prête » à reprendre la course, et un écart entre côtés n'annonce rien : il indique la jambe à travailler en priorité.

**8. Priorité et intégration.** **Priorité 2.** Mode `saisie` existant. Animation à créer (`t_triplehop`, dérivée de `t_hop`). Demande 8 m de place : à proposer en option.

---

## Fiche 4 — Sprint de 6 s sur le vélo (puissance max)

**1. Nom, ce que ça mesure, sport.** `sprint-6s`. Ta puissance maximale de pédalage. Sports : xco, route, triathlon. Réservé aux athlètes qui ont déjà un capteur de puissance ou un home-trainer connecté : aucun achat demandé.

**2. Protocole.** Échauffement : 15 min facile, puis 3 accélérations de 5 s à 70-80-90 %, 2 min faciles.
1. Sur home-trainer ou sur une route plate ou en faux plat montant, sans circulation. Toujours le même lieu, le même vélo, le même braquet.
2. Départ lancé à allure tranquille (60-70 tr/min), assis ou debout : choisis une fois, garde-le toujours.
3. Au bip, sprint maximal pendant **6 s**. Bip de fin.
4. 3 à 4 min de récupération très facile.
5. 2 sprints notés (3 le premier jour). Tu notes la puissance max affichée par ton compteur.

Critères d'arrêt : roue qui décroche, perte de contrôle du vélo, vertige : on arrête la séance de test.

**3. Mesurable au téléphone.** Le téléphone donne le décompte et les bips (`chrono` de 6 s) ; la valeur vient du compteur : `saisie` en watts. Ajouter le poids du jour pour afficher des W/kg. Aucun capteur du téléphone n'est utilisé.

**4. Fiabilité et validité publiées.**
- 27 athlètes d'endurance, 9 sprints de 6 s sur 4 jours : pas de dérive entre essais ; ICC 0,95 ; erreur typique 40 W, soit **3,7 %** ; 2,9 % si on garde le meilleur du jour. Deux essais conseillés le premier jour, un seul ensuite [@falkneto2024].
- Le capteur compte : un capteur à manivelle gauche a une erreur typique faible mais ne convient pas si on veut moins de 3 % d'erreur entre 100 et 1 250 W, et l'écart dépend de l'asymétrie de pédalage [@granier2020].
- Sens pour le vélo : la force maximale de pédalage est liée à la performance en XCO (r = 0,77) [@hays2021] ; le sprint de 6 s progresse avec l'entraînement de sprint court (+4,7 %) [@kristoffersen2019].

**5. Repères.** Pas de norme : comparer l'athlète à lui-même, toujours avec le même capteur.

**6. Erreur à retenir.** `mdcPct` proposé : **8 %** (calcul : 2,77 × 2,9 % sur le meilleur du jour [@falkneto2024] ; 10 % si un seul sprint). Pas de côtés.

**7. Risques, précautions, ce que le test ne dit pas.** Sur route : jamais dans la circulation, jamais en descente ; le home-trainer est plus sûr et plus reproductible. Le test ne dit rien de ton endurance ni de ta capacité à répéter les efforts (voir fiche 5). Deux capteurs différents ne se comparent pas.

**8. Priorité et intégration.** **Priorité 1 pour xco et route** (les athlètes ont déjà le matériel). Mode `saisie` existant + décompte sonore. Pas d'animation nécessaire (une image fixe suffit). Option : lecture automatique de la puissance max dans intervals.icu, à étudier plus tard.

---

## Fiche 5 — Six sprints répétés de 6 s (XCO)

**1. Nom, ce que ça mesure, sport.** `sprints-repetes`. Ta capacité à refaire un sprint presque aussi fort après une récupération courte. Sports : xco d'abord, puis route (critériums) et triathlon court.

**2. Protocole.** Échauffement : celui de la fiche 4. À faire un autre jour que le sprint de 6 s, ou en gardant le premier sprint comme valeur de la fiche 4.
1. Home-trainer conseillé (même résistance à chaque passation).
2. Au bip aigu : sprint maximal de **6 s**. Au bip grave : **24 s** en pédalant très facile.
3. Répète **6 fois** (3 min au total). Ne te garde pas pour la fin : le premier sprint doit être à fond.
4. Récupère 10 min très facile.
5. Tu notes la puissance moyenne (ou max) du 1er et du 6e sprint.

Critères d'arrêt : vertige, nausée, perte de contrôle : on arrête.

**3. Mesurable au téléphone.** Le téléphone cadence l'effort : `metronome` détourné (6 s / 24 s) ou `chrono` en intervalles ; valeurs en `saisie` (watts du 1er et du 6e sprint). L'appli affiche le 6e sprint en watts et en % du 1er.

**4. Fiabilité et validité publiées.**
- Format 5 × 6 s avec 24 s de récupération active : progression nette entre la 1re passation et les suivantes ; variation de la puissance totale 5,1 % entre les passations 1-2, puis **2,7 %** entre les passations 3-4. **Deux séances d'apprentissage** conseillées. Le pourcentage de baisse entre sprints varie beaucoup : à lire avec prudence [@mcgawley2006].
- Deux sprints de 30 s séparés de 4 min : erreur typique 1,6 à 2,5 % après un essai d'apprentissage, 3,0 % pour l'indice de fatigue [@watt2002].
- Sens pour le XCO : chez 33 élites, la puissance du **6e sprint** d'un test de sprints courts répétés est très liée au classement (r = 0,87), et le modèle complet explique 89 % de la performance [@hays2021]. Le détail exact de ce test n'est pas dans le résumé lu : le format 6 × 6 s / 24 s proposé ici est une adaptation, pas une copie.
- La course XCO est faite d'efforts de 5 à 30 s répétés [@hays2018] [@protzen2026].

**5. Repères.** Pas de norme : comparer l'athlète à lui-même.

**6. Erreur à retenir.** `mdcPct` proposé pour la puissance du 6e sprint : **8 %** après deux séances d'apprentissage (calcul : 2,77 × 2,7 % [@mcgawley2006]) ; 15 % avant. Pour le % de baisse : **ne pas afficher de tendance** (erreur trop large, publié [@mcgawley2006]).

**7. Risques, précautions, ce que le test ne dit pas.** Séance dure : la compter comme une séance d'intensité dans la semaine, pas la veille d'une course. Le test ne remplace pas un test de seuil ni de PMA. Un mauvais 6e sprint peut venir de la fatigue de la semaine.

**8. Priorité et intégration.** **Priorité 2** (xco). Effort moyen : il faut un minuteur d'intervalles avec deux saisies. Pas d'animation.

---

## Fiche 6 — Planche sur les avant-bras (tenue)

**1. Nom, ce que ça mesure, sport.** `planche`. L'endurance de l'avant du tronc (et des épaules, qui lâchent parfois avant). Sports : xco, route, triathlon, trail, nordique.

**2. Protocole.** Échauffement : 2 tenues de 10 s. **Un seul essai noté** (un deuxième serait faussé par la fatigue).
1. Pose le téléphone au sol sous ton visage, écran visible.
2. Avant-bras au sol, coudes sous les épaules, pieds largeur de bassin, corps en ligne droite des oreilles aux chevilles.
3. Touche l'écran avec le nez ou demande le départ à la voix : le chrono part au bip.
4. Tiens sans bouger. Respire normalement.
5. Le test s'arrête à la 2e faute, ou à **4 min** (plafond).

Critères d'arrêt : le bassin descend ou monte nettement une 2e fois ; un genou touche le sol ; tu ne peux plus tenir la ligne ; gêne dans le bas du dos : arrêt immédiat.

**3. Mesurable au téléphone.** `chrono` existant. Option utile : filmer de profil pour vérifier la ligne après coup (`video`, critère oui/non « bassin dans la ligne »).

**4. Fiabilité et validité publiées.**
- 120 adultes (60 de 20-35 ans), deux passations à 5-9 jours : temps moyen 145 ± 72 s, ICC **0,915** ; les plus actifs tiennent plus longtemps, les plus lourds moins [@bohannon2018]. La valeur du MDC n'est pas dans le résumé.
- 60 adultes, sédentaires et pratiquants de musculation : ICC > 0,84 ; 112 s contre 81 s ; c'est le grand fessier qui montre le plus de fatigue pendant la planche [@ikezaki2021].
- Une variante dite « spécifique au sport » (36 jeunes athlètes ; le détail du protocole n'est pas dans le résumé) : ICC 0,99, variation 2,0 % **si le premier essai sert d'apprentissage**, et le test détecte une baisse d'environ 30 % après une séance de gainage fatigante [@tong2014].
- Sens pour le vélo : après une fatigue du tronc, le mouvement du genou change chez 15 cyclistes, sans changement des forces sur les pédales [@abt2007] ; 8 semaines de gainage chez de jeunes vététistes réduisent le déplacement latéral du vélo, sans effet sur l'économie [@blechschmied2026].

**5. Repères.** 471 étudiants de 20 ans : hommes 124 ± 72 s, femmes 83 ± 63 s ; sportifs 123 ± 69 s, non-sportifs 83 ± 63 s [@strand2014]. Repère simple proposé : **2 min** (c'est la moyenne des sportifs, pas un objectif prouvé).

**6. Erreur à retenir.** `mdc` proposé : **30 s** (choix prudent). Calcul sur les chiffres lus : avec un ICC de 0,915 et un écart-type de 72 s, l'erreur typique vaut environ 21 s et le MDC95 environ 58 s sur un groupe de 20 à 79 ans [@bohannon2018] ; chez de jeunes sportifs homogènes l'erreur est plus petite [@tong2014]. Pas de côtés.

**7. Risques, précautions, ce que le test ne dit pas.** Ne pas retenir sa respiration. Arrêt si le bas du dos tire. Le temps de planche dépend aussi du poids, de la carrure et de la motivation. Il ne mesure pas la force du tronc et ne dit rien d'un futur mal de dos.

**8. Priorité et intégration.** **Priorité 1.** Mode `chrono` existant, animation de planche sans doute déjà au catalogue (gainage : 24 exercices). Effort faible.

---

## Fiche 7 — Pont latéral (planche sur le côté)

**1. Nom, ce que ça mesure, sport.** `pont-lateral`. L'endurance du côté du tronc, côté par côté. Sports : trail, nordique (pas de patineur), xco, triathlon.

**2. Protocole.** Échauffement : 10 s par côté. Un essai noté par côté, 3 min de repos entre les deux. Alterner le côté de départ d'une passation à l'autre.
1. Sur le côté, appui sur l'avant-bras, coude sous l'épaule, jambes tendues, pied du dessus posé devant l'autre.
2. Main libre sur l'épaule opposée, téléphone posé au sol devant toi.
3. Décolle le bassin : corps en ligne droite. Le chrono part au bip.
4. Tiens. Le test s'arrête dès que le bassin redescend ou à **3 min** (plafond).

Critères d'arrêt : le bassin touche le sol ou descend nettement ; le bassin part en arrière ; gêne à l'épaule : « Je ne peux pas ».

**3. Mesurable au téléphone.** `chrono` existant, avec `cotes: true`.

**4. Fiabilité et validité publiées.**
- 75 jeunes adultes sains : coefficients de fiabilité > 0,97 sur 5 jours et à 8 semaines. Les hommes tiennent le pont latéral 65 % de leur temps d'extension du dos, les femmes 39 % [@mcgill1999].
- 24 sportives de loisir : ICC 0,81 mais erreur typique **10,95 s** ; le deltoïde se fatigue autant que les obliques, et la taille et la masse pèsent sur le résultat : validité jugée discutable [@juanrecio2022].
- 45 sportifs de loisir : ICC > 0,70, erreur typique 12,1 à 24,1 % pour les trois tests de tenue du tronc ; différence entre séances au pont latéral ; résultat plus bas chez les hommes lourds et larges ; « longue familiarisation » nécessaire, tests peu utiles pour détecter de petits changements [@juanrecio2025].

**5. Repères.** Rapport publié : pont latéral ≈ 65 % (hommes) et 39 % (femmes) du temps d'extension du dos [@mcgill1999]. Les temps moyens en secondes ne sont pas dans les résumés lus : pas de norme en secondes, comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **30 s** (calcul : 2,77 × 10,95 s [@juanrecio2022]). Écart gauche / droite : `asym` **30 s** (choix prudent : jamais plus fin que le `mdc`, aucun seuil publié dans les résumés lus), à confirmer sur deux passations.

**7. Risques, précautions, ce que le test ne dit pas.** L'épaule porte une grande part de la charge : test déconseillé en profil épaule. Le test ne mesure pas que le tronc, et un écart entre côtés peut venir de l'épaule.

**8. Priorité et intégration.** **Priorité 2.** Mode `chrono` existant ; animation de planche latérale probablement déjà présente. Effort faible.

---

## Fiche 8 — Tenue des extenseurs du dos (test de Sørensen)

**1. Nom, ce que ça mesure, sport.** `sorensen`. L'endurance du dos et des fessiers en position horizontale. Sports : xco et route (position penchée longue), nordique (double poussée), triathlon.

**2. Protocole.** Échauffement : 2 tenues de 10 s. Un seul essai noté.
1. Allongé sur le ventre sur un banc ou une table solide, le haut des hanches au bord, le buste dans le vide.
2. Jambes tenues : sangle serrée autour du banc et des mollets, ou pieds calés sous un meuble lourd. Sans fixation sûre, ne fais pas le test.
3. Bras croisés, téléphone tenu contre la poitrine.
4. Monte le buste à l'horizontale : le chrono part au bip.
5. Tiens. Arrêt quand le buste descend sous l'horizontale une 2e fois, ou à **4 min** (plafond).

Critères d'arrêt : buste sous l'horizontale ; gêne dans le bas du dos ; crampe ; la fixation bouge.

**3. Mesurable au téléphone.** `chrono`. Mieux : le téléphone contre la poitrine sert d'inclinomètre et arrête le chrono tout seul quand le buste descend de plus de 10° (combinaison `chrono` + `angle`, à développer).

**4. Fiabilité et validité publiées.**
- 63 sujets, deux essais à 15 min : chez les sujets sans gêne, ICC 0,83, erreur typique **17,4 s** [@latimer1999].
- Revue critique : reproductibilité et sécurité jugées bonnes ; les fessiers et les ischios participent, la motivation et le poids influencent le temps, et la capacité du test à annoncer un futur mal de dos reste débattue [@demoulin2006].
- 45 sportifs de loisir : femmes 194 ± 53 s, hommes 162 ± 52 s ; différence entre séances ; erreur typique 12 à 24 % ; familiarisation longue nécessaire [@juanrecio2025].
- Les femmes tiennent plus longtemps que les hommes en extension [@mcgill1999].
- En VTT : 14 vététistes gênés au dos avaient une endurance du dos plus faible que 24 autres ; étude transversale, qui ne dit pas la cause [@rostami2015].

**5. Repères.** Sportifs de loisir : environ 160 s (hommes) et 195 s (femmes) [@juanrecio2025]. Repère proposé : **2 min 30**.

**6. Erreur à retenir.** `mdc` proposé : **45 s** (calcul : 2,77 × 17,4 s = 48 s [@latimer1999]). Pas de côtés.

**7. Risques, précautions, ce que le test ne dit pas.** Fixation des jambes obligatoire et testée avant. Arrêt à la moindre gêne dans le dos. Le test ne dit pas qui aura mal au dos, et un bon temps ne dit rien de la force.

**8. Priorité et intégration.** **Priorité 2.** Mode `chrono` existant ; animation à créer (`t_sorensen`). Frein principal : le matériel (banc + sangle). Arrêt automatique par inclinomètre = effort moyen.

---

## Fiche 9 — Pompes au métronome

**1. Nom, ce que ça mesure, sport.** `pompes`. L'endurance de force du haut du corps, rapportée à ton poids. Sports : nordique d'abord (la puissance du haut du corps est très liée à la vitesse en course classique, r ≈ 0,93 sur 13 skieurs [@alsobrook2009]), puis xco (tenue du guidon) et triathlon.

**2. Protocole.** Échauffement : 5 pompes faciles, 1 min de repos. Un seul essai noté.
1. Mains un peu plus larges que les épaules, corps en ligne, pieds joints. Téléphone au sol sous la poitrine.
2. Au bip grave, descends jusqu'à frôler le téléphone avec la poitrine. Au bip aigu, remonte bras tendus.
3. Cadence : **1 pompe toutes les 2 s** (30 par minute).
4. Touche l'écran avec le nez ou dis « stop » quand tu ne peux plus suivre.

Critères d'arrêt : tu rates le bip 2 fois de suite ; le bassin s'affaisse ou monte ; la poitrine ne descend plus jusqu'en bas 2 fois de suite ; gêne à l'épaule ou au poignet.

**3. Mesurable au téléphone.** `metronome` existant (période 2 s, mots « Descends » / « Monte »), reps comptées par l'appli.

**4. Fiabilité et validité publiées.**
- Validité : 31 étudiants, cadence au métronome : le nombre de pompes est lié à la force relative au développé couché (r = 0,71), pas à la force absolue [@clemons2019].
- La cadence change le résultat : 44 adultes testés à 30, 45 et 60 pompes par minute ; le maximum est atteint à cadence libre ou à 60 par minute [@rozenek2022]. D'où une cadence imposée, toujours la même.
- Fiabilité test-retest de ce protocole chez l'adulte : **non trouvé** dans les résumés lus.

**5. Repères.** Pas de norme : comparer l'athlète à lui-même.

**6. Erreur à retenir.** `mdc` proposé : **3 reps** (choix prudent, rien de publié trouvé). Pas de côtés.

**7. Risques, précautions, ce que le test ne dit pas.** Profil épaule : test optionnel avec « Je ne peux pas ». Le test ne mesure pas la force maximale et dépend du poids de corps : un athlète qui s'allège progresse sans être plus fort.

**8. Priorité et intégration.** **Priorité 2** (1 en nordique). Mode `metronome` existant, animation de pompe déjà au catalogue. Effort faible.

---

## Fiche 10 — Copenhague en répétitions (adducteurs)

**1. Nom, ce que ça mesure, sport.** `copenhague`. L'endurance de l'intérieur de la cuisse, jambe par jambe. Sports : nordique (pas de patineur), trail (dévers), xco. **Version en répétitions**, pas en tenue : pour la tenue isométrique, rien de publié trouvé.

**2. Protocole.** Échauffement : 5 montées faciles par côté. Un essai noté par côté, 2 min de repos.
1. Sur le côté, avant-bras au sol. **Genou** de la jambe du dessus posé sur un banc (bras de levier court : plus sûr que la cheville).
2. Jambe du dessous libre sous le banc. Téléphone au sol devant toi.
3. Au bip aigu, monte le bassin et ramène la jambe du dessous contre le banc. Au bip grave, redescends sans poser le bassin.
4. Cadence : 1 répétition toutes les 3 s. L'appli compte.
5. Arrêt quand tu ne suis plus le bip.

Critères d'arrêt : le bassin ne monte plus à la ligne 2 fois de suite ; bip raté 2 fois ; gêne vive à l'intérieur de la cuisse : arrêt immédiat.

**3. Mesurable au téléphone.** `metronome` existant, `cotes: true`.

**4. Fiabilité et validité publiées.**
- Test de Copenhague dynamique mesuré au téléphone, 20 footballeurs amateurs (21 ans), deux séances à une semaine : ICC **0,63 à 0,83** avec des intervalles larges, erreur typique **6,7 à 18,5 %** ; le nombre de reps n'est pas lié à la force isométrique maximale des adducteurs [@mirallesiborra2026].
- Autre test en répétitions (131 athlètes) : hommes 28 reps, femmes 21 reps ; endurance et force maximale des adducteurs presque indépendantes (R² 0,05 à 0,11) [@quintanacepedal2026]. Accord entre examinateurs de ce test : 0,96 [@dequeiroz2023]. Le protocole exact de ce test n'est pas dans les résumés lus.
- L'exercice lui-même, fait 1 à 3 fois par semaine, réduit les problèmes d'aine chez les footballeurs [@haroy2019] : c'est l'exercice qui est prouvé, pas le test.

**5. Repères.** Pas de norme transposable (autre protocole, autre sport) : comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **8 reps** (calcul : erreur typique jusqu'à 18,5 % sur environ 25 reps, soit 2 à 5 reps, donc MDC95 de 5 à 13 reps [@mirallesiborra2026]). `asymPct` : **80** (choix prudent, plus large que les 90 % des sauts, vu l'erreur).

**7. Risques, précautions, ce que le test ne dit pas.** Exercice intense : courbatures marquées les premières fois, à ne jamais découvrir en semaine de course. Le test ne mesure pas la force maximale des adducteurs [@quintanacepedal2026]. Une étude propose un seuil chez des footballeurs élites suivis 3 mois [@dequeiroz2023] : étude unique, autre sport, on ne s'en sert pas.

**8. Priorité et intégration.** **Priorité 3.** Mode `metronome` existant, animation à vérifier au catalogue. À réserver aux athlètes qui font déjà l'exercice.

---

## Fiche 11 — Équilibre en Y, version mètre ruban

**1. Nom, ce que ça mesure, sport.** `equilibre-y`. Jusqu'où tu peux aller chercher avec le pied libre en restant stable sur l'autre jambe : équilibre en mouvement, mobilité et contrôle réunis. Sports : trail, nordique, xco.

**2. Protocole.** Échauffement et apprentissage : **6 essais non notés** par direction et par jambe (le résultat ne se stabilise qu'après le 6e essai réussi [@kattilakoski2023]).
1. Scotche trois bandes au sol en Y : une vers l'avant, deux vers l'arrière à 135° de la première. Gradue-les au mètre ruban depuis le centre.
2. Pieds nus, mains sur les hanches, pied d'appui au centre, orteils sur la ligne de départ.
3. Avec l'autre pied, pousse un petit objet léger (boîte d'allumettes) le plus loin possible le long de la bande, sans t'appuyer dessus.
4. Reviens au centre sans poser le pied. Lis la distance au bord de l'objet.
5. 3 essais notés par direction et par jambe. L'appli garde la moyenne des 3.

Critères d'arrêt (essai annulé) : le pied libre se pose ; le talon d'appui décolle ; les mains quittent les hanches ; tu shootes dans l'objet au lieu de le pousser.

**3. Mesurable au téléphone.** `saisie` en cm, par côté, trois valeurs (avant, arrière-intérieur, arrière-extérieur). Version courte possible : la seule direction avant.

**4. Fiabilité et validité publiées.**
- Revue de 9 études chez l'adulte sain : ICC médians intra-évaluateur 0,88 (avant), 0,88 (arrière-intérieur), 0,90 (arrière-extérieur) ; inter-évaluateurs 0,87-0,88 [@powden2019]. Les valeurs de MDC sont dans l'article, pas dans le résumé : **non lues**.
- Méta-analyse de 57 études : fiabilité 0,85-0,91 ; scores différents selon le sexe et le sport ; avec des seuils généraux, le test n'annonce pas la blessure [@plisky2021].
- Effet d'apprentissage net : au moins 7 essais réussis pour atteindre un plateau ; utiliser la moyenne des 3 meilleurs [@kattilakoski2023].
- La version « scotch et mètre » n'est pas le kit du commerce : sa fiabilité propre en auto-mesure n'a pas été trouvée.

**5. Repères.** 105 sportifs universitaires, version en étoile à 4 directions : 94 ± 9 cm, soit 105 ± 9 % de la longueur de jambe [@lanning2006]. Autre protocole : indicatif seulement. Comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **5 cm** par direction (choix prudent, MDC publié non lu). `asym` : **5 cm**, signalé seulement s'il se répète sur deux passations (choix prudent : jamais plus fin que le `mdc`).

**7. Risques, précautions, ce que le test ne dit pas.** Peu de risque ; à faire loin des meubles. La direction avant dépend beaucoup de la souplesse de cheville (déjà mesurée par le genou au mur). Le test **ne prédit pas** la blessure et n'a pas de seuil général valable [@plisky2021].

**8. Priorité et intégration.** **Priorité 3.** Mode `saisie` existant mais à trois valeurs par côté (petite évolution). Animation à créer. Long à passer (10 min avec l'apprentissage).

---

## Fiche 12 — Rotation du haut du dos, à genoux (téléphone entre les omoplates)

**1. Nom, ce que ça mesure, sport.** `rotation-thoracique`. L'amplitude de rotation du haut du dos, de chaque côté, bas du dos bloqué. Sports : nordique, triathlon (natation), xco, route (position figée longtemps).

**2. Protocole.** Échauffement : 5 rotations lentes par côté, non notées.
1. Fixe le téléphone à plat entre les omoplates (brassard en travers du dos ou sous un maillot serré), le grand côté dans l'axe de la colonne.
2. À genoux, **fesses sur les talons**, un avant-bras posé au sol devant toi, l'autre main derrière la nuque. Dos à plat : l'appli prend le zéro.
3. Tourne le buste pour monter le coude vers le plafond, le plus loin possible, sans décoller les fesses des talons.
4. Tiens 2 s : bip = mesuré. Reviens.
5. 3 essais par côté ; l'appli garde la moyenne.

Critères d'arrêt (essai annulé) : les fesses quittent les talons ; l'avant-bras d'appui glisse ; tu pousses avec la main au sol.

**3. Mesurable au téléphone.** Inclinomètre : dans cette position le buste est à l'horizontale, donc la rotation se lit par rapport à la gravité. Mode `angle` existant, mesure depuis le zéro. **Pourquoi pas « assis » comme dans la piste de départ** : assis, on tourne autour d'un axe vertical ; il faudrait la boussole ou le gyroscope, moins fiables dans une appli web. La version boussole a pourtant de bons ICC (0,96-0,98 pour un même examinateur) mais des limites d'accord de 24,8° avec le goniomètre [@furness2018].

**4. Fiabilité et validité publiées.**
- 46 adultes sains, 5 techniques dont la position « bas du dos bloqué » : entre deux jours, ICC 0,84 à 0,91, erreur typique 1,4 à 2,0°, **MDC 3,9 à 5,6°** ; entre deux examinateurs, MDC 2,8 à 6,3° [@johnson2012].
- Validité, position assis sur les talons, 23 adultes : l'iPhone est corrélé à r = 0,88 avec la mesure de référence par imagerie, mais l'écart moyen est de 4,9° avec des limites larges (-9,4° à +19,2°) [@bucke2017].
- 21 nageurs de 10-18 ans : ICC 0,91 à 0,96 pour un même examinateur [@feijen2018].
- Toutes ces mesures sont faites par un examinateur qui tient l'appareil : l'**auto-mesure avec le téléphone fixé dans le dos n'est pas validée**.

**5. Repères.** Pas de norme dans les résumés lus : comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **8°** (choix prudent : publié 3,9-5,6° avec examinateur [@johnson2012], élargi pour l'auto-mesure). `asym` : **8°**.

**7. Risques, précautions, ce que le test ne dit pas.** Mouvement lent, sans élan. Genoux sensibles : coussin sous les genoux, ou « Je ne peux pas ». La valeur n'est pas un vrai angle de colonne (écart moyen de 5° avec la référence [@bucke2017]) : elle sert à suivre un athlète dans le temps, pas à le comparer à un autre.

**8. Priorité et intégration.** **Priorité 1.** Mode `angle` existant, même logique que les 5 tests d'angle actuels. Animation à créer (`t_trot`). Effort faible. Point à vérifier sur un vrai téléphone : la tenue du brassard dans le dos.

---

## Fiche 13 — Squat sur une jambe, filmé de face

**1. Nom, ce que ça mesure, sport.** `squat-unipodal-video`. La façon dont tu contrôles ton bassin, ton buste et ton genou sur une jambe. Sports : trail, nordique, xco, route, triathlon. C'est un test d'observation : il donne un score de critères, pas une mesure.

**2. Protocole.** Échauffement : 5 squats sur deux jambes, 2 essais par jambe non filmés.
1. Téléphone posé **de face**, à 2-3 m, à hauteur de hanche, corps entier dans le cadre.
2. Debout sur une jambe, bras croisés sur la poitrine, l'autre pied juste décollé devant toi.
3. Descends lentement (2 s) jusqu'à mi-hauteur, comme pour t'asseoir, puis remonte (2 s).
4. **5 répétitions** enchaînées par jambe.
5. Revois la vidéo au ralenti et coche les 5 critères, jambe par jambe.

Critères oui / non proposés (1 point par « oui ») : (a) le buste reste droit, sans pencher sur le côté ; (b) le bassin reste horizontal ; (c) le genou reste au-dessus du pied, sans passer à l'intérieur du gros orteil ; (d) tu tiens l'équilibre sans poser le pied libre ni décroiser les bras ; (e) la descente est régulière sur les 5 reps. Ces critères reprennent les zones observées par les grilles publiées (buste, bassin, hanche, genou) ; leur formulation exacte est la mienne, les grilles détaillées n'étant pas dans les résumés lus.

Critères d'arrêt : gêne au genou ; perte d'équilibre répétée.

**3. Mesurable au téléphone.** `video` existant (filmé, puis critères oui / non), score sur 5, `cotes: true`.

**4. Fiabilité et validité publiées.**
- 34 adultes sans gêne, note « bon / moyen / faible » : accord avec un panel d'experts 73 à 87 %, kappa **0,60 à 0,80** ; même examinateur à deux moments : kappa 0,61 à 0,80. Les « bons » ont un moyen fessier qui s'active plus tôt et plus de force d'abduction de hanche et de tenue latérale du tronc [@crossley2011].
- Échelles à 2, 3 ou 4 niveaux, 58 sujets : par critère, accord entre examinateurs kappa 0,65-0,86 en oui / non ; même examinateur à une semaine 0,47-0,65 [@zhang2025].
- Revue de 10 études : validité des notations visuelles jugée **insuffisante** pour la plupart des usages, preuve de très faible certitude ; à utiliser avec prudence [@gomes2023].
- L'angle du genou en 2D ne reflète pas bien le 3D [@ortiz2016] : pas de verdict automatique.
- Tout cela concerne des examinateurs formés : l'**auto-notation par l'athlète n'est pas validée**.

**5. Repères.** Pas de norme : comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **2 points sur 5** (choix prudent, vu les kappa de 0,47-0,65 pour un même examinateur [@zhang2025]). Écart entre côtés : 2 points.

**7. Risques, précautions, ce que le test ne dit pas.** Peu de risque. Le test ne dit pas qu'un genou « va lâcher », ne mesure pas la force, et un genou qui rentre un peu n'est pas un problème en soi : c'est un indice pour choisir des exercices de hanche et de pied. La vidéo part au coach, qui tranche.

**8. Priorité et intégration.** **Priorité 2.** Mode `video` existant (comme le squat bras levés). Animation à créer ou à dériver de l'assis-debout sur une jambe. Effort faible.

---

## Fiche 14 — Descente de marche, filmée de face

**1. Nom, ce que ça mesure, sport.** `descente-marche`. Le contrôle de la jambe d'appui quand tu freines une descente : le geste du trail en descente. Sports : trail d'abord, nordique, xco.

**2. Protocole.** Échauffement : 5 descentes par jambe non filmées.
1. Debout sur une marche ou une box stable de **15 à 20 cm** (toujours la même), de côté, le pied testé au bord, l'autre dans le vide. Téléphone de face à 2-3 m.
2. Mains sur les hanches.
3. Plie la jambe d'appui pour aller **effleurer le sol avec le talon libre**, sans y mettre de poids, puis remonte.
4. **5 répétitions** lentes par jambe.
5. Revois la vidéo et coche les 5 critères.

Critères oui / non proposés (1 point par « oui ») : (a) les mains restent sur les hanches ; (b) le buste reste droit ; (c) le bassin reste horizontal ; (d) le genou reste au-dessus du pied ; (e) l'appui est stable, sans rattrapage. Formulation de ma main, sur les zones observées par les grilles publiées.

Critères d'arrêt : gêne devant le genou ; tu poses du poids sur le pied libre.

**3. Mesurable au téléphone.** `video` existant, score sur 5, `cotes: true`.

**4. Fiabilité et validité publiées.**
- Revue de 16 articles : fiabilité rapportée kappa **0,59 à 0,81** ; une moins bonne note va avec moins de force de rotation externe de hanche, moins de force d'extension du genou et moins de souplesse de cheville ; protocoles très variables d'une étude à l'autre [@silva2019].
- Sur vidéos 2D, 6 kinésithérapeutes : kappa **0,40 à 0,65** ; pas de différence entre novices et expérimentés [@mansfield2022].
- 30 sujets gênés au genou, deux examinateurs : la qualité du geste en descente de marche fait partie des mesures à fiabilité « modérée » (ICC 0,67 à 0,79 pour ce groupe de mesures) [@piva2006].
- Auto-notation par l'athlète : **non validée**.

**5. Repères.** Pas de norme : comparer l'athlète à lui-même et gauche / droite.

**6. Erreur à retenir.** `mdc` proposé : **2 points sur 5** (choix prudent, kappa modérés [@mansfield2022]). Écart entre côtés : 2 points.

**7. Risques, précautions, ce que le test ne dit pas.** Marche stable, contre un mur si besoin. Une note basse peut venir d'une cheville raide [@silva2019] : regarder le genou au mur avant de conclure. Le test ne prédit rien ; il oriente le choix d'exercices.

**8. Priorité et intégration.** **Priorité 3** : très proche de la fiche 13. Proposition : n'en intégrer qu'un des deux par athlète (descente de marche pour le trail, squat sur une jambe pour les autres). Mode `video` existant, animation à créer.

---

## Fiche 15 — Sauts répétés (10 rebonds, on garde les 5 meilleurs)

**1. Nom, ce que ça mesure, sport.** `rebonds`. Ta réactivité : sauter haut en restant très peu de temps au sol. Sports : trail, nordique, triathlon (course à pied). **Retenu avec une réserve forte sur la précision.**

**2. Protocole.** Échauffement : 2 × 10 sautillés sur place, 1 série d'essai.
1. Téléphone au sol, à 2 m, objectif au ras du sol, ralenti 240 images/s.
2. Mains sur les hanches, jambes presque tendues.
3. Un saut d'élan, puis **10 rebonds** enchaînés : le plus haut possible, le moins longtemps possible au sol.
4. 2 séries notées, 2 min de repos.
5. L'appli garde les 5 meilleurs rebonds de la meilleure série.

Critères d'arrêt : tu plies beaucoup les genoux au sol (ce n'est plus un rebond) ; tu avances de plus d'un pas ; gêne au tendon ou au mollet.

**3. Mesurable au téléphone.** Vidéo au ralenti : temps de contact et temps de vol de chaque rebond, image par image. Indice = hauteur de saut (m) divisée par temps de contact (s). C'est long à dépouiller à la main (20 images à marquer) : il faut une aide (marquage semi-automatique) ou une appli dédiée et une `saisie`. Mode : `video` + calcul, **à développer**.

**4. Fiabilité et validité publiées.**
- 35 sportifs, test à 10 rebonds et test à 5 rebonds, deux jours à une semaine après une séance d'apprentissage : ICC ≥ 0,80, variation ≤ 10 % ; mais capacité à détecter un petit changement jugée **discutable**, « bonne » seulement pour un changement modéré [@comyns2019].
- Le test à 10 rebonds est fiable et valide avec deux positions de bras chez 55 étudiants en sport [@celik2024].
- L'indice de réactivité, quel que soit l'appareil : bon classement (ICC ≥ 0,92) mais variation ≥ 12,5 % [@montalvo2021].
- Au téléphone : validé pour le saut en contrebas depuis 40 cm (r > 0,98 avec une plateforme ; test-retest ICC 0,83-0,93, 17 sujets) [@balsalobrefernandez2026], **pas** pour les rebonds enchaînés.
- Sens pour l'endurance : l'indice de réactivité est lié à la performance d'endurance (r = 0,40) [@jarvis2022] et progresse avec la pliométrie [@ramirezcampillo2023].

**5. Repères.** Pas de norme : comparer l'athlète à lui-même.

**6. Erreur à retenir.** `mdcPct` proposé : **20 %** (calcul : 2,77 × 10 % donnerait 28 % ; 20 % est un compromis, encore optimiste). En pratique : ne lire que les grands changements, sur trois passations.

**7. Risques, précautions, ce que le test ne dit pas.** Charge élevée sur le tendon d'Achille et le mollet : jamais en profil « sans saut », jamais en période de gêne. Le test ne mesure pas la raideur du tendon et ne dit pas que la foulée est économique.

**8. Priorité et intégration.** **Priorité 3.** Gros effort (dépouillement vidéo). À ne faire qu'après le saut vertical (fiche 1), dont il réutilise l'écran de marquage.

---

## Fiche 16 (à part) — Questionnaire de forme en 5 questions

Ce n'est pas un test physique : il va dans le suivi quotidien ou en tête d'une séance de tests, pas dans une batterie.

**1. Nom, ce que ça mesure, sport.** `forme-5`. Ton ressenti du jour : fatigue, sommeil, courbatures, stress, humeur. Tous sports.

**2. Protocole.**
1. Le matin, ou juste avant la séance de tests, avant l'échauffement.
2. 5 curseurs de 1 à 5 : fatigue, qualité du sommeil, courbatures, stress, humeur.
3. 20 secondes, pas plus. Pas de bonne réponse.
4. L'appli compare à **ta** moyenne des 4 dernières semaines.

Critère d'arrêt : aucun. Si un athlète ne veut pas répondre, on n'insiste pas.

**3. Mesurable au téléphone.** `saisie` (5 curseurs) ; pas de mode dédié aujourd'hui : petit mode « questionnaire » à créer, ou réutiliser l'écran RPE.

**4. Fiabilité et validité publiées.**
- Revue de 56 études : les mesures de ressenti suivent la charge d'entraînement avec plus de sensibilité et de constance que les mesures objectives courantes [@saw2016].
- Revue de 21 études sur les questions uniques : les items les plus utilisés sont courbatures, fatigue, sommeil, stress, humeur ; leur lien avec la charge est surtout trivial à modéré [@duignan2020].
- ICC ou MDC d'un questionnaire à 5 curseurs : **non trouvé**.

**5. Repères.** Pas de norme : comparer l'athlète à lui-même.

**6. Erreur à retenir.** Pas de `mdc` publié. Choix prudent : ne signaler qu'une baisse d'au moins 1 point sur au moins 2 items, pendant 3 jours de suite.

**7. Risques, précautions, ce que le test ne dit pas.** Lassitude si on le demande trop souvent sans rien en faire : le coach doit répondre à ce qu'il voit. Le questionnaire ne dit pas pourquoi l'athlète est fatigué et n'est pas un outil de dépistage. Données personnelles : elles restent entre l'athlète et le coach.

**8. Priorité et intégration.** **Priorité 2.** Effort faible à moyen (5 curseurs + moyenne glissante). Sert aussi à interpréter un mauvais jour de tests.

---

## Tableau récapitulatif

| # | Test (`id`) | Mesure | Sports | Mode | Unité | Côtés | `mdc` proposé | Origine du `mdc` | Fiabilité publiée | Priorité | Effort |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `saut-vertical` | Puissance 2 jambes | tous | `video` (2 images) ou `saisie` | cm | non | 3 cm | calcul | variation 2,4-4,6 % ; applis ≈ référence | 1 | moyen (écran de marquage) |
| 2 | `saut-longueur` | Puissance horizontale | trail, nordique, xco, triathlon | `saisie` | cm | non | 10 cm | choix prudent | ICC 0,94 puis 1,00 après apprentissage | 1 | faible |
| 3 | `triple-saut-unipodal` | Puissance + rebond 1 jambe | trail, nordique, xco | `saisie` | cm | oui (90 %) | 10 % | publié | ICC 0,93-0,98 ; différence détectable 7-11 % | 2 | faible |
| 4 | `sprint-6s` | Puissance max à vélo | xco, route, triathlon | `saisie` + bips | W | non | 8 % | calcul | ICC 0,95 ; erreur 3,7 % | 1 (vélo) | faible |
| 5 | `sprints-repetes` | Répéter les sprints | xco, route | `metronome` / `chrono` + `saisie` | W | non | 8 % (6e sprint) | calcul | variation 2,7 % après 2 apprentissages | 2 | moyen |
| 6 | `planche` | Endurance avant du tronc | tous | `chrono` | s | non | 30 s | choix prudent | ICC 0,915 | 1 | faible |
| 7 | `pont-lateral` | Endurance côté du tronc | trail, nordique, xco, triathlon | `chrono` | s | oui (30 s) | 30 s | calcul | ICC 0,81 ; erreur 11 s | 2 | faible |
| 8 | `sorensen` | Endurance du dos | xco, route, nordique, triathlon | `chrono` (+ `angle`) | s | non | 45 s | calcul | ICC 0,83 ; erreur 17 s | 2 | moyen (matériel) |
| 9 | `pompes` | Endurance haut du corps | nordique, xco, triathlon | `metronome` | reps | non | 3 reps | choix prudent | non trouvé (validité r = 0,71) | 2 | faible |
| 10 | `copenhague` | Endurance adducteurs | nordique, trail, xco | `metronome` | reps | oui (80 %) | 8 reps | calcul | ICC 0,63-0,83 | 3 | faible |
| 11 | `equilibre-y` | Équilibre en mouvement | trail, nordique, xco | `saisie` × 3 | cm | oui (5 cm) | 5 cm | choix prudent | ICC 0,88-0,90 (kit, examinateur) | 3 | moyen |
| 12 | `rotation-thoracique` | Rotation du haut du dos | nordique, triathlon, xco, route | `angle` | ° | oui (8°) | 8° | publié élargi | MDC 3,9-5,6° (examinateur) | 1 | faible |
| 13 | `squat-unipodal-video` | Contrôle bassin / genou | tous | `video` | /5 | oui (2 pts) | 2 pts | choix prudent | kappa 0,60-0,80 | 2 | faible |
| 14 | `descente-marche` | Contrôle en freinage | trail, nordique, xco | `video` | /5 | oui (2 pts) | 2 pts | choix prudent | kappa 0,40-0,81 | 3 | faible |
| 15 | `rebonds` | Réactivité | trail, nordique, triathlon | `video` + calcul | indice | non | 20 % | calcul | ICC ≥ 0,80 ; variation ≤ 10 % | 3 | gros |
| 16 | `forme-5` (à part) | Ressenti du jour | tous | `saisie` (curseurs) | /5 | non | 1 pt sur 2 items, 3 jours | choix prudent | non trouvé | 2 | faible à moyen |

Ordre d'intégration conseillé : 6, 2, 12 (aucun développement), puis 4 et 9, puis 1 (écran de marquage vidéo), puis 13, 7, 3, 16, et enfin 5, 8, 10, 11, 14, 15.

## Tests écartés et pourquoi

1. **Test de respiration « BOLT » (tolérance au CO2).** Écarté. Chez 49 patineurs de vitesse de haut niveau, aucun lien avec la puissance, le travail total, le temps limite ni la VO2max (r de -0,17 à 0,01) [@kowalski2024]. Chez 28 étudiants actifs, pas de lien significatif avec la VO2max ni avec le temps limite [@marko2026]. Fiabilité : non trouvée. Un chiffre qui ne dit rien de la performance n'a pas sa place dans la batterie.
2. **Tenue de chaise au mur.** Écarté. Fiabilité du temps de tenue : non trouvée. L'intensité dépend de l'angle du genou à 10° près [@lea2021], impossible à régler seul de façon identique. La version en répétitions sur une jambe (76 ± 35 reps) n'a aucun lien avec la force mesurée, et n'a pas d'étude de fiabilité [@lehecka2025]. Reste un bon exercice.
3. **Tenue de suspension à la barre (préhension).** Écarté pour l'instant. Seule étude lue : le temps de suspension chute de 71 % après 24 h d'escalade [@yu2023] : sensible à la fatigue, mais ni fiabilité ni repère. Besoin d'une barre. À reprendre si une étude de fiabilité paraît ; l'intérêt en xco (tenue du guidon) reste plausible [@impellizzeri2007].
4. **Tractions max.** Écarté. Fiabilité : non trouvée. Chez des étudiants, 8 à 10 reps seulement à 80 % du max [@johnson2009] ; beaucoup d'athlètes d'endurance feraient 0 à 3 tractions, score trop grossier pour suivre un progrès (avis). Les pompes au métronome couvrent le haut du corps sans barre.
5. **Montées sur pointe genou fléchi (soléaire).** Écarté. Le nombre de reps ne distingue pas la version genou fléchi de la version genou tendu (40 dans les deux cas), et l'angle du genou réellement tenu varie de 22 à 43° [@hebertlosier2011]. Le test actuel genou tendu suffit [@hebertlosier2017b].
6. **Extension de hanche active (à plat ventre).** Écarté. En observation, accord entre examinateurs faible à moyen (kappa 0,36 à 0,58) [@kongoun2022] ; aucune mesure au téléphone validée trouvée, et la hanche est déjà le point faible des applis d'angle [@hahn2021]. Le test de Thomas couvre l'avant de la hanche.
7. **Tirage isométrique mi-cuisse.** Écarté pour le matériel. Excellent test (ICC médian 0,96, variation 4,9 %) [@grgic2022b] mais il faut un capteur de force et une barre fixe. Le dynamomètre à main n'est pas une solution (limites d'accord de ±34 à ±49 %) [@chamorro2017].
8. **Tenue isométrique de Copenhague.** Écarté sous cette forme : rien de publié trouvé. Remplacé par la version en répétitions (fiche 10), elle-même en priorité 3.
9. **Sauts répétés « pendant 10 s » et indice de réactivité en saut en contrebas.** Écartés au profit du format 10 rebonds / 5 meilleurs (fiche 15), le seul dont j'ai lu la fiabilité [@comyns2019]. Le saut en contrebas demande une box de 40 cm et charge davantage [@balsalobrefernandez2026].
10. **Pourcentage de baisse entre sprints (indice de fatigue).** Écarté comme indicateur affiché : variation trop large [@mcgawley2006]. On garde la puissance du 6e sprint.
11. **Équilibre en Y comme « test de risque ».** Écarté dans cet usage : pas de seuil général valable [@plisky2021]. Gardé seulement comme mesure de suivi (fiche 11).
12. **Détection automatique du genou qui rentre.** Écartée : l'angle 2D ne reflète pas le 3D [@ortiz2016]. L'athlète et le coach regardent la vidéo.

## Batterie C « puissance et tronc » (20 min)

Complète la batterie A (saut sur une jambe ou assis-debout + tests RM) et la batterie B (mobilité au capteur). Aucun matériel en dehors d'un mètre ruban et d'un tapis. La puissance d'abord (frais), le tronc ensuite, les tenues longues à la fin.

| Minute | Bloc | Détail |
|---|---|---|
| 0-5 | Échauffement | 3 min de footing ou de vélo facile, 10 squats, 5 pompes, 3 sauts à 70-80-90 % |
| 5-8 | `saut-vertical` | 3 sauts filmés, 45 s de repos |
| 8-11 | `saut-longueur` | 3 sauts, 45 s de repos |
| 11-13 | `pompes` | 1 essai au métronome |
| 13-14 | Repos | marcher, boire |
| 14-17 | `planche` | 1 essai (plafond 4 min ; la plupart s'arrêtent vers 2 min) |
| 17-20 | `pont-lateral` | 1 essai par côté, 1 min de repos entre les deux, côté de départ alterné à chaque passation |

- **Variante vélo (xco, route)** : remplacer `saut-longueur` par `sprint-6s` sur home-trainer (2 sprints, 3 min de récupération) : compter 25 min. `sprints-repetes` se fait un autre jour, comme séance d'intensité.
- **Variante trail** : remplacer `pompes` par `triple-saut-unipodal`.
- **Variante dos** (une fois par bloc, si un banc est disponible) : remplacer `pont-lateral` par `sorensen`.
- **Profil « sans saut »** : retirer les deux sauts, garder pompes, planche, pont latéral, et ajouter `rotation-thoracique`.
- **Rythme** : au début et à la fin de chaque bloc de 6 à 8 semaines, jamais dans les 48 h après une séance dure ni la semaine d'une course A. La **première batterie C sert d'apprentissage** : la référence est la deuxième [@marinjimenez2024] [@juanrecio2025] [@tong2014].
- **Commande** : `python3 coach.py batterie <code> C <date>` (à ajouter, sur le modèle de A et B).
- Avec le temps limité des tenues du tronc et les repos, la batterie tient en 20 min si l'athlète enchaîne ; le repos de 1 min entre les deux côtés du pont latéral est plus court que les 3 min de la fiche 7 : c'est un compromis de durée, toujours le même, donc comparable d'une fois sur l'autre.

## Limites

- Tous les résultats viennent des **résumés** : les MDC absents du résumé ont été calculés (2,77 × erreur typique) ou choisis prudemment, et c'est signalé à chaque fois.
- Presque toutes les études de fiabilité sont faites avec un examinateur. L'**auto-mesure** (athlète seul, téléphone posé) n'est validée pour aucun de ces tests, sauf le saut vertical filmé.
- Aucune étude lue ne porte sur des vététistes, routiers ou traileurs de 18-25 ans pour ces tests, sauf le sprint de 6 s (athlètes d'endurance) [@falkneto2024] et les sprints répétés (élites XCO) [@hays2021].
- Les critères oui / non des fiches 13 et 14 sont rédigés par moi : à faire relire par Nathan avant intégration.
- Cadences proposées (pompes 2 s, Copenhague 3 s) : choix de protocole, non publiés tels quels.

## Sources vérifiées

Uniquement les nouvelles sources (49). Les autres clés citées existent déjà dans `recherche/sources.json`.

```json
[
  {"cle": "balsalobrefernandez2024", "auteurs": "Balsalobre-Fernández C, Varela-Olalla D", "annee": 2024, "titre": "The Validity and Reliability of the My Jump Lab App for the Measurement of Vertical Jump Performance Using Artificial Intelligence", "revue": "Sensors (Basel) 24(24):7897", "doi": "10.3390/s24247897", "url": "https://doi.org/10.3390/s24247897", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "12 sujets actifs, CMJ chargés ou non : appli avec détection automatique vs plateforme, r > 0,91, variation < 6 % (PMID 39771636)."},
  {"cle": "heishman2020", "auteurs": "Heishman AD, Daub BD, Miller RM, Freitas EDS, Frantz BA, Bemben MG", "annee": 2020, "titre": "Countermovement Jump Reliability Performed With and Without an Arm Swing in NCAA Division 1 Intercollegiate Basketball Players", "revue": "J Strength Cond Res 34(2):546-558", "doi": "10.1519/jsc.0000000000002812", "url": "https://doi.org/10.1519/jsc.0000000000002812", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "22 basketteurs : CMJ avec ou sans bras fiable entre séances (ICC > 0,70, CV < 10 %) ; sans bras utile pour suivre la fatigue (PMID 30138237)."},
  {"cle": "marinjimenez2024", "auteurs": "Marin-Jimenez N, Perez-Bey A, Cruz-Leon C, Conde-Caveda J, Segura-Jimenez V, Castro-Piñero J, Cuenca-Garcia M", "annee": 2024, "titre": "Criterion-related validity and reliability of the standing long jump test in adults: The Adult-Fit project", "revue": "Eur J Sport Sci 24(9):1379-1392", "doi": "10.1002/ejsc.12182", "url": "https://doi.org/10.1002/ejsc.12182", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "410 adultes : R² 0,78 avec puissance et force horizontales ; sans apprentissage +12 cm au retest, ICC 0,94, CV 7,1 %, MDC90 29 cm ; après apprentissage ICC 1,00, CV 0,5 %, MDC90 1 cm (PMID 39167610)."},
  {"cle": "dingenen2019", "auteurs": "Dingenen B, Truijen J, Bellemans J, Gokeler A", "annee": 2019, "titre": "Test-retest reliability and discriminative ability of forward, medial and rotational single-leg hop tests", "revue": "Knee 26(5):978-987", "doi": "10.1016/j.knee.2019.06.010", "url": "https://doi.org/10.1016/j.knee.2019.06.010", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "16 sportifs sains, retest à 1 semaine : ICC 0,93-0,98, erreur typique 2,6-4,1 %, plus petite différence détectable 7,2-11,3 % (saut simple, triple, latéral, rotation) (PMID 31431339)."},
  {"cle": "hamilton2008", "auteurs": "Hamilton RT, Shultz SJ, Schmitz RJ, Perrin DH", "annee": 2008, "titre": "Triple-hop distance as a valid predictor of lower limb strength and power", "revue": "J Athl Train 43(2):144-151", "doi": "10.4085/1062-6050-43.2.144", "url": "https://doi.org/10.4085/1062-6050-43.2.144", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "40 footballeurs universitaires : le triple saut explique 69,5 % du saut vertical et 49-59 % de la force isocinétique des cuisses ; aucun lien avec l'équilibre statique (PMID 18345338)."},
  {"cle": "falkneto2024", "auteurs": "Falk Neto JH, Boulé N, Jones KE, Comeau AK, Kennedy MD", "annee": 2024, "titre": "The intra-day and inter-day reliability of a 6-second Wingate to determine maximal peak power in endurance-trained athletes", "revue": "PLoS One 19(9):e0307325", "doi": "10.1371/journal.pone.0307325", "url": "https://doi.org/10.1371/journal.pone.0307325", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "27 athlètes d'endurance, 9 sprints de 6 s sur 4 jours : ICC 0,95, erreur typique 40 W (3,7 %), 2,9 % avec le meilleur du jour ; 2 essais le 1er jour, 1 ensuite (PMID 39240856)."},
  {"cle": "granier2020", "auteurs": "Granier C, Hausswirth C, Dorel S, Le Meur Y", "annee": 2020, "titre": "Validity and Reliability of the Stages Cycling Power Meter", "revue": "J Strength Cond Res 34(12):3554-3559", "doi": "10.1519/jsc.0000000000002189", "url": "https://doi.org/10.1519/jsc.0000000000002189", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "11 cyclistes, capteur manivelle gauche vs SRM, 100-1 250 W et sprints de 7 s : écarts triviaux à petits, liés à l'asymétrie de pédalage (r = 0,58) ; inadapté si erreur < 3 % exigée (PMID 28902109)."},
  {"cle": "mcgawley2006", "auteurs": "McGawley K, Bishop D", "annee": 2006, "titre": "Reliability of a 5 x 6-s maximal cycling repeated-sprint test in trained female team-sport athletes", "revue": "Eur J Appl Physiol 98(4):383-393", "doi": "10.1007/s00421-006-0284-8", "url": "https://doi.org/10.1007/s00421-006-0284-8", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "9 footballeuses, 5 passations de 5 × 6 s / 24 s : CV de la puissance 5,1 % (passations 1-2) puis 2,7 % (3-4) ; 2 familiarisations conseillées ; indice de baisse très variable (PMID 16955291)."},
  {"cle": "watt2002", "auteurs": "Watt KK, Hopkins WG, Snow RJ", "annee": 2002, "titre": "Reliability of performance in repeated sprint cycling tests", "revue": "J Sci Med Sport 5(4):354-361", "doi": "10.1016/s1440-2440(02)80024-x", "url": "https://doi.org/10.1016/s1440-2440(02)80024-x", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "8 hommes actifs, 2 × 30 s à 4 min : erreur typique 1,6-2,5 % (puissance) et 2,5-3,0 % (fatigue) après un essai de familiarisation (PMID 12585619)."},
  {"cle": "bohannon2018", "auteurs": "Bohannon RW, Steffl M, Glenney SS, Green M, Cashwell L, Prajerova K, Bunn J", "annee": 2018, "titre": "The prone bridge test: Performance, validity, and reliability among older and younger adults", "revue": "J Bodyw Mov Ther 22(2):385-389", "doi": "10.1016/j.jbmt.2017.07.005", "url": "https://doi.org/10.1016/j.jbmt.2017.07.005", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "120 adultes (20-35 et 60-79 ans), retest à 5-9 jours : planche 145 ± 72 s, ICC 0,915 ; liée à l'activité physique, inversement à l'IMC (PMID 29861239)."},
  {"cle": "ikezaki2021", "auteurs": "Ikezaki F, Krueger E, de Souza Guerino Macedo C", "annee": 2021, "titre": "Performance, reliability and fatigue in prone bridge test and supine unilateral bridge test", "revue": "J Bodyw Mov Ther 26:238-245", "doi": "10.1016/j.jbmt.2020.08.008", "url": "https://doi.org/10.1016/j.jbmt.2020.08.008", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "60 adultes : planche 112 s (pratiquants de musculation) vs 81 s (sédentaires) ; ICC > 0,836 ; fatigue surtout du grand fessier en planche (PMID 33992251)."},
  {"cle": "tong2014", "auteurs": "Tong TK, Wu S, Nie J", "annee": 2014, "titre": "Sport-specific endurance plank test for evaluation of global core muscle function", "revue": "Phys Ther Sport 15(1):58-63", "doi": "10.1016/j.ptsp.2013.03.003", "url": "https://doi.org/10.1016/j.ptsp.2013.03.003", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "36 jeunes athlètes : ICC 0,99, CV 2,0 % si le 1er essai sert de familiarisation ; le test détecte une baisse d'environ 30 % après fatigue du tronc (PMID 23850461)."},
  {"cle": "abt2007", "auteurs": "Abt JP, Smoliga JM, Brick MJ, Jolly JT, Lephart SM, Fu FH", "annee": 2007, "titre": "Relationship between cycling mechanics and core stability", "revue": "J Strength Cond Res 21(4):1300-1304", "doi": "10.1519/r-21846.1", "url": "https://doi.org/10.1519/r-21846.1", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "15 cyclistes : après fatigue du tronc, mouvement frontal du genou 15,1° → 23,3° ; forces sur les pédales inchangées (PMID 18076271)."},
  {"cle": "strand2014", "auteurs": "Strand SL, Hjelm J, Shoepe TC, Fajardo MA", "annee": 2014, "titre": "Norms for an isometric muscle endurance test", "revue": "J Hum Kinet 40:93-102", "doi": "10.2478/hukin-2014-0011", "url": "https://doi.org/10.2478/hukin-2014-0011", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "471 étudiants de 20 ans, planche sur avant-bras : hommes 124 ± 72 s, femmes 83 ± 63 s ; sportifs 123 ± 69 s vs 83 ± 63 s (PMID 25031677)."},
  {"cle": "mcgill1999", "auteurs": "McGill SM, Childs A, Liebenson C", "annee": 1999, "titre": "Endurance times for low back stabilization exercises: clinical targets for testing and training from a normal database", "revue": "Arch Phys Med Rehabil 80(8):941-944", "doi": "10.1016/s0003-9993(99)90087-4", "url": "https://doi.org/10.1016/s0003-9993(99)90087-4", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "75 jeunes sains : fiabilité > 0,97 ; pont latéral = 65 % (hommes) et 39 % (femmes) du temps d'extension ; les femmes tiennent plus longtemps en extension (PMID 10453772)."},
  {"cle": "juanrecio2022", "auteurs": "Juan-Recio C, Prat-Luri A, Galindo A, Manresa-Rocamora A, Barbado D, Vera-Garcia FJ", "annee": 2022, "titre": "Is the Side Bridge Test Valid and Reliable for Assessing Trunk Lateral Flexor Endurance in Recreational Female Athletes?", "revue": "Biology (Basel) 11(7):1043", "doi": "10.3390/biology11071043", "url": "https://doi.org/10.3390/biology11071043", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "24 sportives : ICC 0,81 mais erreur typique 10,95 s ; fatigue du deltoïde égale à celle des obliques ; validité jugée discutable (PMID 36101422)."},
  {"cle": "juanrecio2025", "auteurs": "Juan-Recio C, Vera-Garcia FJ, Lopez-Valenciano A, Barbado D", "annee": 2025, "titre": "The impact of anthropometric characteristics on isometric trunk muscle endurance tests: A reliability and performance analysis", "revue": "PLoS One 20(6):e0324787", "doi": "10.1371/journal.pone.0324787", "url": "https://doi.org/10.1371/journal.pone.0324787", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "45 sportifs de loisir : ICC > 0,70, erreur typique 12,1-24,1 % ; Sørensen 194 s (F) et 162 s (H) ; masse et carrure abaissent les scores ; longue familiarisation nécessaire (PMID 40460094)."},
  {"cle": "latimer1999", "auteurs": "Latimer J, Maher CG, Refshauge K, Colaco I", "annee": 1999, "titre": "The reliability and validity of the Biering-Sorensen test in asymptomatic subjects and subjects reporting current or previous nonspecific low back pain", "revue": "Spine 24(20):2085-2089", "doi": "10.1097/00007632-199910150-00004", "url": "https://doi.org/10.1097/00007632-199910150-00004", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "63 sujets, 2 essais à 15 min : sans gêne ICC 0,83, erreur typique 17,4 s ; avec gêne ICC 0,88, erreur 11,6 s ; temps plus long chez les sujets sans gêne (PMID 10543003)."},
  {"cle": "demoulin2006", "auteurs": "Demoulin C, Vanderthommen M, Duysens C, Crielaard JM", "annee": 2006, "titre": "Spinal muscle evaluation using the Sorensen test: a critical appraisal of the literature", "revue": "Joint Bone Spine 73(1):43-50", "doi": "10.1016/j.jbspin.2004.08.002", "url": "https://doi.org/10.1016/j.jbspin.2004.08.002", "type": "revue", "niveau": "C", "verifie": true, "note": "Revue critique : reproductibilité et sécurité bonnes ; valeur prédictive débattue ; rôle des extenseurs de hanche, du poids et de la motivation (PMID 16461206)."},
  {"cle": "alsobrook2009", "auteurs": "Alsobrook NG, Heil DP", "annee": 2009, "titre": "Upper body power as a determinant of classical cross-country ski performance", "revue": "Eur J Appl Physiol 105(4):633-641", "doi": "10.1007/s00421-008-0943-z", "url": "https://doi.org/10.1007/s00421-008-0943-z", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "13 skieurs : vitesse sur 10 km classique corrélée à la puissance du haut du corps sur 10 s (r = 0,93) et 60 s (r = 0,92) (PMID 19039602)."},
  {"cle": "clemons2019", "auteurs": "Clemons J", "annee": 2019, "titre": "Construct Validity of Two Different Methods of Scoring and Performing Push-ups", "revue": "J Strength Cond Res 33(11):2971-2980", "doi": "10.1519/jsc.0000000000002843", "url": "https://doi.org/10.1519/jsc.0000000000002843", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "31 étudiants, cadence au métronome : pompes liées à la force relative au développé couché (r = 0,71), pas à la force absolue (PMID 30363033)."},
  {"cle": "rozenek2022", "auteurs": "Rozenek R, Byrne JJ, Crussemeyer J, Garhammer J", "annee": 2022, "titre": "Male-Female Differences in Push-up Test Performance at Various Cadences", "revue": "J Strength Cond Res 36(12):3324-3329", "doi": "10.1519/jsc.0000000000004091", "url": "https://doi.org/10.1519/jsc.0000000000004091", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "44 adultes à 30, 45, 60 pompes/min et cadence libre : maximum à cadence libre ou 60/min ; la cadence change le score (PMID 34265814)."},
  {"cle": "mirallesiborra2026", "auteurs": "Miralles-Iborra A, Urban T, De Los Ríos-Calonge J, Elvira JLL, Del Coso J, Tomás-Rodríguez MI, Juan-Recio C, Moreno-Pérez V", "annee": 2026, "titre": "Dynamic Field Assessment of Hip Adductor Function Using a Smartphone-Based Copenhagen Test: Reliability and Concurrent Associations with Isometric Strength in Amateur Football Players", "revue": "Sports (Basel) 14(4):125", "doi": "10.3390/sports14040125", "url": "https://doi.org/10.3390/sports14040125", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "20 footballeurs amateurs, retest à 1 semaine : ICC 0,63-0,83 (intervalles larges), erreur typique 6,7-18,5 % ; reps non liées à la force isométrique (PMID 42043057)."},
  {"cle": "quintanacepedal2026", "auteurs": "Quintana-Cepedal M, Bailen-Garcia T, Riestra-Cendan S, Crespo I, Olmedillas H", "annee": 2026, "titre": "Sex Differences in Maximal and Endurance Adductor Strength: Implications for Athlete Screening and Return to Play", "revue": "J Strength Cond Res (sous presse)", "doi": "10.1519/jsc.0000000000005577", "url": "https://doi.org/10.1519/jsc.0000000000005577", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "131 athlètes : test d'endurance des adducteurs 28 reps (H) vs 21 (F) ; endurance et force max quasi indépendantes (R² 0,05-0,11) (PMID 42384830)."},
  {"cle": "dequeiroz2023", "auteurs": "de Queiroz JHM, Frota JP, Dos Reis FA, de Oliveira RR", "annee": 2023, "titre": "Development and Predictive Validation of the Brazilian Adductor Performance Test for Estimating the Chance of Hip Adductor Injuries in Elite Soccer Athletes", "revue": "Int J Sports Physiol Perform 18(6):653-659", "doi": "10.1123/ijspp.2022-0306", "url": "https://doi.org/10.1123/ijspp.2022-0306", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "108 footballeurs élites suivis 3 mois : accord inter-examinateurs 0,96 ; seuil proposé 33 reps ; étude unique (PMID 37080542)."},
  {"cle": "powden2019", "auteurs": "Powden CJ, Dodds TK, Gabriel EH", "annee": 2019, "titre": "The reliability of the Star Excursion Balance Test and Lower Quarter Y-Balance Test in healthy adults: a systematic review", "revue": "Int J Sports Phys Ther 14(5):683-694", "doi": "10.26603/ijspt20190683", "url": "https://doi.org/10.26603/ijspt20190683", "type": "revue-systematique", "niveau": "A", "verifie": true, "note": "9 études, adultes sains : ICC médians intra 0,88 / 0,88 / 0,90 et inter 0,88 / 0,87 / 0,88 selon la direction ; MDC donnés dans l'article, pas dans le résumé (PMID 31598406)."},
  {"cle": "kattilakoski2023", "auteurs": "Kattilakoski O, Kauranen N, Leppänen M, Kannus P, Pasanen K, Vasankari T, Parkkari J", "annee": 2023, "titre": "Intrarater Reliability and Analysis of Learning Effects in the Y Balance Test", "revue": "Methods Protoc 6(2):41", "doi": "10.3390/mps6020041", "url": "https://doi.org/10.3390/mps6020041", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "16 coureurs débutants : fiabilité bonne à excellente ; plateau après le 6e essai réussi ; au moins 7 essais et moyenne des 3 meilleurs (PMID 37104023)."},
  {"cle": "lanning2006", "auteurs": "Lanning CL, Uhl TL, Ingram CL, Mattacola CG, English T, Newsom S", "annee": 2006, "titre": "Baseline values of trunk endurance and hip strength in collegiate athletes", "revue": "J Athl Train 41(4):427-434", "doi": null, "url": "https://europepmc.org/article/MED/17273469", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "105 athlètes universitaires : équilibre en étoile 94 ± 9 cm (105 ± 9 % de la longueur de jambe) ; extensions du dos en 60 s : 53 ± 13 reps (PMID 17273469)."},
  {"cle": "johnson2012", "auteurs": "Johnson KD, Kim KM, Yu BK, Saliba SA, Grindstaff TL", "annee": 2012, "titre": "Reliability of thoracic spine rotation range-of-motion measurements in healthy adults", "revue": "J Athl Train 47(1):52-60", "doi": "10.4085/1062-6050-47.1.52", "url": "https://doi.org/10.4085/1062-6050-47.1.52", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "46 adultes sains, 5 techniques : entre jours ICC 0,84-0,91, erreur typique 1,4-2,0°, MDC 3,9-5,6° ; entre examinateurs MDC 2,8-6,3° (PMID 22488230)."},
  {"cle": "bucke2017", "auteurs": "Bucke J, Spencer S, Fawcett L, Sonvico L, Rushton A, Heneghan NR", "annee": 2017, "titre": "Validity of the Digital Inclinometer and iPhone When Measuring Thoracic Spine Rotation", "revue": "J Athl Train 52(9):820-825", "doi": "10.4085/1062-6050-52.6.05", "url": "https://doi.org/10.4085/1062-6050-52.6.05", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "23 adultes, assis sur les talons : iPhone vs référence par imagerie r = 0,88, écart moyen 4,94° (limites -9,35 à +19,23°) ; iPhone vs inclinomètre r = 0,98 (PMID 28787176)."},
  {"cle": "furness2018", "auteurs": "Furness J, Schram B, Cox AJ, Anderson SL, Keogh J", "annee": 2018, "titre": "Reliability and concurrent validity of the iPhone Compass application to measure thoracic rotation range of motion (ROM) in healthy participants", "revue": "PeerJ 6:e4431", "doi": "10.7717/peerj.4431", "url": "https://doi.org/10.7717/peerj.4431", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "30 sujets : boussole de l'iPhone, ICC intra 0,96-0,98, inter 0,87-0,89 ; r = 0,835 avec le goniomètre, limites d'accord 24,8° (PMID 29568701)."},
  {"cle": "feijen2018", "auteurs": "Feijen S, Kuppens K, Tate A, Baert I, Struyf T, Struyf F", "annee": 2018, "titre": "Intra- and interrater reliability of the 'lumbar-locked thoracic rotation test' in competitive swimmers ages 10 through 18 years", "revue": "Phys Ther Sport 32:140-144", "doi": "10.1016/j.ptsp.2018.04.012", "url": "https://doi.org/10.1016/j.ptsp.2018.04.012", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "21 nageurs : ICC intra 0,91-0,96, inter 0,86-0,89, dans la même séance (PMID 29793122)."},
  {"cle": "piva2006", "auteurs": "Piva SR, Fitzgerald K, Irrgang JJ, Jones S, Hando BR, Browder DA, Childs JD", "annee": 2006, "titre": "Reliability of measures of impairments associated with patellofemoral pain syndrome", "revue": "BMC Musculoskelet Disord 7:33", "doi": "10.1186/1471-2474-7-33", "url": "https://doi.org/10.1186/1471-2474-7-33", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "30 sujets gênés au genou : la qualité du geste en descente de marche est dans le groupe à fiabilité modérée (ICC 0,67-0,79) (PMID 16579850)."},
  {"cle": "silva2019", "auteurs": "Silva RLE, Pinheiro YT, Lins CAA, de Oliveira RR, Scattone Silva R", "annee": 2019, "titre": "Assessment of quality of movement during a lateral step-down test: Narrative review", "revue": "J Bodyw Mov Ther 23(4):835-843", "doi": "10.1016/j.jbmt.2019.05.012", "url": "https://doi.org/10.1016/j.jbmt.2019.05.012", "type": "revue", "niveau": "C", "verifie": true, "note": "16 articles : fiabilité kappa 0,59-0,81 ; mauvaise note associée à moins de force de hanche et de genou et à moins de souplesse de cheville ; protocoles hétérogènes (PMID 31733769)."},
  {"cle": "mansfield2022", "auteurs": "Mansfield C, Spech C, Rethman K, Clagg S, Ingle A, Largent A, Vatti T, Morrow M, VanEtten L, Briggs M", "annee": 2022, "titre": "Moderate reliability of the lateral step down test amongst experienced and novice physical therapists", "revue": "Physiother Theory Pract 38(12):2029-2037", "doi": "10.1080/09593985.2021.1923097", "url": "https://doi.org/10.1080/09593985.2021.1923097", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "6 kinés notent 22 vidéos 2D : kappa 0,40-0,65 intra et inter ; pas de différence novices / expérimentés (PMID 33956559)."},
  {"cle": "crossley2011", "auteurs": "Crossley KM, Zhang WJ, Schache AG, Bryant A, Cowan SM", "annee": 2011, "titre": "Performance on the single-leg squat task indicates hip abductor muscle function", "revue": "Am J Sports Med 39(4):866-873", "doi": "10.1177/0363546510395456", "url": "https://doi.org/10.1177/0363546510395456", "type": "observationnelle", "niveau": "B", "verifie": true, "note": "34 adultes sans gêne : accord avec un panel 73-87 %, kappa 0,60-0,80 ; les « bons » ont un moyen fessier plus précoce et plus de force d'abduction (+0,47 N·m par poids de corps) (PMID 21335344)."},
  {"cle": "gomes2023", "auteurs": "Gomes DA, da Costa GV, Martins EC, Silva DO, Haupenthal A, Ruschel C, de Castro MP, Fontana HB", "annee": 2023, "titre": "Are visual assessments of the single-leg squat valid to be used in clinical practice? A systematic review of measurement properties based on the COSMIN guideline", "revue": "Phys Ther Sport 63:118-125", "doi": "10.1016/j.ptsp.2023.07.009", "url": "https://doi.org/10.1016/j.ptsp.2023.07.009", "type": "revue-systematique", "niveau": "A", "verifie": true, "note": "10 études, 3 méthodes visuelles : validité discriminante insuffisante pour la plupart des usages, certitude très faible ; validité convergente jamais évaluée (PMID 37549590)."},
  {"cle": "zhang2025", "auteurs": "Zhang Y, Liu Y, Pan Z, Gao H, Martin RL, Huang X", "annee": 2025, "titre": "Comparing the reliability of the single leg squat test using two, three, and four category ordinal rating scales", "revue": "PeerJ 13:e20218", "doi": "10.7717/peerj.20218", "url": "https://doi.org/10.7717/peerj.20218", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "58 sujets : par critère en oui / non, kappa intra 0,47-0,65 et inter 0,65-0,86 ; l'échelle à 3 niveaux est le meilleur compromis (PMID 41112774)."},
  {"cle": "comyns2019", "auteurs": "Comyns TM, Flanagan EP, Fleming S, Fitzgerald E, Harper DJ", "annee": 2019, "titre": "Interday Reliability and Usefulness of a Reactive Strength Index Derived From 2 Maximal Rebound Jump Tests", "revue": "Int J Sports Physiol Perform 14(9):1200-1204", "doi": "10.1123/ijspp.2018-0829", "url": "https://doi.org/10.1123/ijspp.2018-0829", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "35 sportifs, tests à 5 et 10 rebonds : ICC ≥ 0,80, CV ≤ 10 % ; utilité discutable pour détecter un petit changement (PMID 30840515)."},
  {"cle": "celik2024", "auteurs": "Celik H, Bulut S", "annee": 2024, "titre": "Comparing the effects of akimbo and bent-in-front arm positions on jump metrics: Validity and reliability of a modified 10/5 repeated jump test", "revue": "J Biomech 163:111945", "doi": "10.1016/j.jbiomech.2024.111945", "url": "https://doi.org/10.1016/j.jbiomech.2024.111945", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "55 étudiants en sport : test à 10 rebonds fiable et valide avec deux positions de bras, sans différence entre elles (PMID 38237495)."},
  {"cle": "balsalobrefernandez2026", "auteurs": "Balsalobre-Fernández C", "annee": 2026, "titre": "Smartphone-Based Assessment of the Stretch-Shortening Cycle: Validity and Reliability of the My Jump Lab App for Measuring the Dynamic Rebound Index", "revue": "Sensors (Basel) 26(10):3068", "doi": "10.3390/s26103068", "url": "https://doi.org/10.3390/s26103068", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "17 sujets, saut en contrebas de 40 cm : appli vs plateforme r > 0,98, ICC > 0,97 ; test-retest à 48 h ICC 0,825-0,925 (PMID 42197876)."},
  {"cle": "kowalski2024", "auteurs": "Kowalski T, Rebis K, Wilk A, Klusiewicz A, Wiecha S, Paleczny B", "annee": 2024, "titre": "Body Oxygen Level Test (BOLT) is not associated with exercise performance in highly-trained individuals", "revue": "Front Physiol 15:1430837", "doi": "10.3389/fphys.2024.1430837", "url": "https://doi.org/10.3389/fphys.2024.1430837", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "49 patineurs de vitesse : aucun lien entre BOLT et Wingate ou test d'effort (r de -0,17 à 0,01) ; R² 0,08 (PMID 39290618)."},
  {"cle": "marko2026", "auteurs": "Marko D, Krajcigr M, Bahenský P", "annee": 2026, "titre": "Association between BOLT Score, aerobic fitness, and physical activity in active university students: a cross-sectional study", "revue": "J Sports Med Phys Fitness 66(3):329-339", "doi": "10.23736/s0022-4707.25.17282-4", "url": "https://doi.org/10.23736/s0022-4707.25.17282-4", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "28 étudiants actifs : BOLT sans lien significatif avec la VO2max (rho 0,31, p 0,10), le temps limite (0,27) ou l'activité (0,05) (PMID 41307566)."},
  {"cle": "hebertlosier2011", "auteurs": "Hébert-Losier K, Schneiders AG, Sullivan SJ, Newsham-West RJ, García JA, Simoneau GG", "annee": 2011, "titre": "Analysis of knee flexion angles during 2 clinical versions of the heel raise test to assess soleus and gastrocnemius function", "revue": "J Orthop Sports Phys Ther 41(7):505-513", "doi": "10.2519/jospt.2011.3489", "url": "https://doi.org/10.2519/jospt.2011.3489", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "17 sujets : 40 reps attendues genou tendu comme genou fléchi à 30° ; angle réellement tenu de 22 à 43° ; les reps ne distinguent pas les deux versions (PMID 21335928)."},
  {"cle": "lehecka2025", "auteurs": "Lehecka BJ, Black J, Jindra J, McCloud C, Pummell C", "annee": 2025, "titre": "The Single-Leg Wall Squat Test: An Assessment of Functional Lower Extremity Endurance in University Students", "revue": "Int J Sports Phys Ther 20(8):1198-1202", "doi": "10.26603/001c.142063", "url": "https://doi.org/10.26603/001c.142063", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "30 étudiants : 76 ± 35 reps ; aucun lien avec la force de hanche ou de genou ; pas d'étude de fiabilité (PMID 40756787)."},
  {"cle": "lea2021", "auteurs": "Lea JWD, O'Driscoll JM, Coleman DA, Wiles JD", "annee": 2021, "titre": "Validity and reliability of RPE as a measure of intensity during isometric wall squat exercise", "revue": "J Clin Transl Res 7(2):248-256", "doi": "10.18053/jctres.07.202102.007", "url": "https://doi.org/10.18053/jctres.07.202102.007", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "29 hommes, chaise au mur de 2 min à 5 angles de genou : l'effort perçu augmente à chaque palier de 10° et toutes les 30 s (PMID 34104828)."},
  {"cle": "yu2023", "auteurs": "Yu E, Lowe J, Millon J, Tran K, Coffey C", "annee": 2023, "titre": "Change in grip strength, hang time, and knot tying speed after 24 hours of endurance rock climbing", "revue": "Front Sports Act Living 5:1224581", "doi": "10.3389/fspor.2023.1224581", "url": "https://doi.org/10.3389/fspor.2023.1224581", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "36 grimpeurs : après 24 h d'escalade, force de préhension -15 %, temps de suspension -71 % ; pas de donnée de fiabilité (PMID 37601165)."},
  {"cle": "kongoun2022", "auteurs": "Kong-Oun S, Prasertkul W, Fungkiatphaiboon P, Wattananon P", "annee": 2022, "titre": "The inter-rater reliability of clinical observation of prone hip extension and association between aberrant movement and chronic low back pain", "revue": "Musculoskelet Sci Pract 57:102476", "doi": "10.1016/j.msksp.2021.102476", "url": "https://doi.org/10.1016/j.msksp.2021.102476", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "44 sujets : observation de l'extension de hanche à plat ventre, accord entre 2 examinateurs kappa 0,36-0,58 (PMID 34768224)."},
  {"cle": "johnson2009", "auteurs": "Johnson D, Lynch J, Nash K, Cygan J, Mayhew JL", "annee": 2009, "titre": "Relationship of lat-pull repetitions and pull-ups to maximal lat-pull and pull-up strength in men and women", "revue": "J Strength Cond Res 23(3):1022-1028", "doi": "10.1519/jsc.0b013e3181a2d7f5", "url": "https://doi.org/10.1519/jsc.0b013e3181a2d7f5", "type": "observationnelle", "niveau": "C", "verifie": true, "note": "58 étudiants : max en traction = 1,16 (H) et 0,73 (F) fois le poids de corps ; 8,1 (H) et 10,5 (F) tractions à 80 % du max (PMID 19387371)."}
]
```
